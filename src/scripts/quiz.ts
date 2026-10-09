/**
 * El juego: avatar + nombre + email, preguntas de una en una con corrección inmediata
 * (cada respuesta se envía y se juzga al momento en la función de la plataforma; las
 * respuestas correctas nunca viajan en el código de la web), resultado final con
 * mensaje y decisión de publicar en el ranking.
 */
import { isLocale, type Locale } from '@/i18n';
import { quizUrl } from '@/lib/firebase';
import { getAppCheckToken } from './firebase-client';

type Question = { id: string; text: string; options: string[] };
type Messages = Record<string, string> & { tiers: string[] };
type Judged = { id: string; chosen: number | null; answer: number; correct: boolean };
type Start = { playerToken: string; questions: string[]; answered: Record<string, Judged>; resumed: boolean };
type Finish = { score: number; total: number; results: Judged[]; public: boolean };
type Saved = { email: string; name: string; emoji: string; playerToken: string; status: 'playing' | 'finished'; score?: number; total?: number; public: boolean };

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const fill = (text: string, vars: Record<string, string | number>) => text.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));

/** Mensaje final según la fracción de aciertos (umbrales de los novios para 22 preguntas). */
export function tierFor(score: number, total: number, tiers: string[]): string {
  if (!total) return tiers[0];
  const r = score / total;
  if (r >= 1) return tiers[4];
  if (r >= 18 / 22) return tiers[3];
  if (r >= 12 / 22) return tiers[2];
  if (r >= 6 / 22) return tiers[1];
  return tiers[0];
}

export function setupQuiz(root: HTMLElement) {
  const questions = JSON.parse(root.dataset.questions ?? '[]') as Question[];
  const byId = new Map(questions.map((q) => [q.id, q]));
  const m = JSON.parse(root.dataset.messages ?? '{}') as Messages;
  const locale: Locale = isLocale(root.dataset.locale) ? root.dataset.locale : 'es';
  const siteId = root.dataset.site ?? '';
  const storageKey = `quiz:${siteId}`;
  const $ = <T extends HTMLElement>(sel: string) => root.querySelector<T>(sel)!;
  const panels = {
    intro: $('[data-panel="intro"]'),
    play: $('[data-panel="play"]'),
    result: $('[data-panel="result"]'),
    already: $('[data-panel="already"]'),
    error: $('[data-panel="error"]'),
  };
  const show = (key: keyof typeof panels) => {
    Object.entries(panels).forEach(([k, el]) => (el.hidden = k !== key));
    panels[key].scrollIntoView?.({ block: 'start', behavior: 'smooth' });
  };
  const fail = (title: string, text: string) => {
    $('[data-error-title]').textContent = title;
    $('[data-error-text]').textContent = text;
    show('error');
  };

  const load = (): Saved | null => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) ?? 'null');
    } catch {
      return null;
    }
  };
  const save = (data: Saved) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch {
      /* sin almacenamiento */
    }
  };

  // --- Llamadas a la función ---
  const api = async (path: string, body: unknown) => {
    const token = await getAppCheckToken();
    return fetch(`${quizUrl}/${siteId}/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { 'X-Firebase-AppCheck': token } : {}) },
      body: JSON.stringify(body),
    });
  };

  // --- Estado de la partida ---
  let current: Saved | null = null;
  let order: string[] = [];
  let judged: Record<string, Judged> = {};
  let index = 0;

  // --- Intro: avatar, nombre, email (prerrellenados si viene de confirmar asistencia) ---
  const introForm = $('form[data-intro]') as HTMLFormElement;
  const prefilledNote = root.querySelector<HTMLElement>('[data-prefilled]');
  try {
    const prefill = JSON.parse(sessionStorage.getItem('quiz:prefill') ?? 'null') as { name?: string; email?: string } | null;
    if (prefill?.email) {
      (introForm.elements.namedItem('name') as HTMLInputElement).value = prefill.name ?? '';
      (introForm.elements.namedItem('email') as HTMLInputElement).value = prefill.email;
      if (prefilledNote) prefilledNote.hidden = false;
    }
  } catch {
    /* sin almacenamiento */
  }
  const setError = (name: string, message: string) => {
    const slot = introForm.querySelector<HTMLElement>(`[data-error="${name}"]`);
    if (slot) slot.textContent = message;
  };
  introForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const emoji = (introForm.elements.namedItem('emoji') as RadioNodeList | null)?.value ?? '';
    const name = (introForm.elements.namedItem('name') as HTMLInputElement).value.trim().slice(0, 60);
    const email = (introForm.elements.namedItem('email') as HTMLInputElement).value.trim();
    setError('emoji', emoji ? '' : m.pickEmoji);
    setError('name', name ? '' : m.required);
    setError('email', !email ? m.required : !EMAIL.test(email) ? m.invalidEmail : '');
    if (!emoji || !name || !email || !EMAIL.test(email)) return;
    void start({ email, name, emoji, playerToken: '', status: 'playing', public: false });
  });

  const start = async (player: Saved) => {
    const button = introForm.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (button) button.disabled = true;
    try {
      const res = await api('start', { email: player.email, name: player.name, emoji: player.emoji, locale, playerToken: player.playerToken || undefined });
      if (res.status === 409) {
        const prev = (await res.json()) as { score: number; total: number; public: boolean };
        current = { ...player, status: 'finished', score: prev.score, total: prev.total, public: prev.public };
        save(current);
        $('[data-already-text]').textContent = fill(m.alreadyText, { score: prev.score, total: prev.total });
        show('already');
        return;
      }
      if (res.status === 503) return fail(m.errorTitle, m.notReady);
      if (!res.ok) throw new Error(`quiz start ${res.status}`);
      const data = (await res.json()) as Start;
      current = { ...player, playerToken: data.playerToken, status: 'playing' };
      save(current);
      order = data.questions.filter((id) => byId.has(id));
      judged = data.answered;
      const firstPending = order.findIndex((id) => !judged[id]);
      index = firstPending === -1 ? order.length - 1 : firstPending;
      if (data.resumed && resumeNote) resumeNote.hidden = false;
      if (firstPending === -1) {
        await finish();
        return;
      }
      renderQuestion();
      show('play');
    } catch (error) {
      console.error('quiz: no se pudo empezar', error);
      fail(m.errorTitle, m.errorText);
    } finally {
      if (button) button.disabled = false;
    }
  };

  // --- Preguntas de una en una, con corrección al momento ---
  const resumeNote = root.querySelector<HTMLElement>('[data-resume]');
  const qTitle = $('[data-q-title]');
  const qText = $('[data-q-text]');
  const qOptions = $('[data-q-options]');
  const qFeedback = $('[data-q-feedback]');
  const qNext = $('button[data-q-next]') as HTMLButtonElement;
  const qBar = $('[data-q-bar]');
  let busy = false;

  const renderFeedback = (q: Question, result: Judged) => {
    qOptions.querySelectorAll<HTMLElement>('.option').forEach((label, i) => {
      label.classList.toggle('is-correct', i === result.answer);
      label.classList.toggle('is-wrong', i === result.chosen && !result.correct);
      label.classList.toggle('is-dim', i !== result.answer && i !== result.chosen);
      const input = label.querySelector('input');
      if (input) input.disabled = true;
    });
    qFeedback.hidden = false;
    qFeedback.className = `feedback ${result.correct ? 'feedback--ok' : 'feedback--ko'}`;
    qFeedback.textContent = result.correct ? `✅ ${m.correct}` : `❌ ${m.wrong} ${q.options[result.answer] ?? ''}`;
    qNext.disabled = false;
    qNext.focus();
  };

  const renderQuestion = () => {
    const q = byId.get(order[index])!;
    qTitle.textContent = fill(m.progress, { n: index + 1, total: order.length });
    qText.textContent = q.text;
    qBar.style.width = `${(index / order.length) * 100}%`;
    qFeedback.hidden = true;
    qFeedback.textContent = '';
    qOptions.innerHTML = '';
    q.options.forEach((option, i) => {
      const label = document.createElement('label');
      label.className = 'option';
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'answer';
      input.value = String(i);
      const span = document.createElement('span');
      span.textContent = option;
      label.append(input, span);
      qOptions.appendChild(label);
    });
    qNext.textContent = index === order.length - 1 ? m.finish : m.next;
    qNext.disabled = true;
    if (judged[q.id]) renderFeedback(q, judged[q.id]);
  };

  qOptions.addEventListener('change', (event) => {
    const input = event.target as HTMLInputElement;
    if (busy || !current || input.name !== 'answer') return;
    const q = byId.get(order[index])!;
    if (judged[q.id]) return;
    busy = true;
    qOptions.querySelectorAll('input').forEach((el) => (el.disabled = true));
    void (async () => {
      try {
        const res = await api('answer', { email: current!.email, playerToken: current!.playerToken, questionId: q.id, choice: Number(input.value) });
        if (res.status === 403) {
          // token perdido o reemplazado desde otro dispositivo: volvemos a sincronizar
          await start({ ...current!, playerToken: '' });
          return;
        }
        if (!res.ok) throw new Error(`quiz answer ${res.status}`);
        const data = (await res.json()) as { correct: boolean; answer: number; chosen: number };
        judged[q.id] = { id: q.id, chosen: data.chosen, answer: data.answer, correct: data.correct };
        renderFeedback(q, judged[q.id]);
      } catch (error) {
        console.error('quiz: no se pudo corregir', error);
        fail(m.errorTitle, m.errorText);
      } finally {
        busy = false;
      }
    })();
  });

  qNext.addEventListener('click', () => {
    if (index < order.length - 1) {
      index += 1;
      renderQuestion();
      panels.play.scrollIntoView?.({ block: 'start', behavior: 'smooth' });
    } else {
      void finish();
    }
  });

  // --- Resultado y publicación ---
  const resultTitle = $('[data-result-title]');
  const resultLead = $('[data-result-lead]');
  const resultList = $('[data-result-list]');
  const publishAsk = $('[data-publish-ask]');
  const publishState = $('[data-publish-state]');
  const publishStatus = $('[data-publish-status]');
  const publishToggle = $('button[data-publish-toggle]') as HTMLButtonElement;

  const renderPublish = () => {
    if (!current) return;
    publishAsk.hidden = true;
    publishState.hidden = false;
    publishStatus.textContent = current.public ? m.published : m.unpublished;
    publishToggle.textContent = current.public ? m.unpublish : m.publishNow;
    publishToggle.hidden = !current.playerToken;
  };

  const renderResult = (data: Finish) => {
    resultTitle.textContent = fill(m.resultTitle, { score: data.score, total: data.total });
    resultLead.textContent = tierFor(data.score, data.total, m.tiers);
    resultList.innerHTML = '';
    data.results.forEach((r, i) => {
      const q = byId.get(r.id);
      if (!q) return;
      const li = document.createElement('li');
      li.className = r.correct ? 'is-correct' : 'is-wrong';
      const title = document.createElement('p');
      title.className = 'rq__title';
      title.textContent = `${i + 1}. ${q.text}`;
      const yours = document.createElement('p');
      yours.className = 'rq__line';
      yours.textContent = `${m.yourAnswer}: ${r.chosen === null ? '—' : q.options[r.chosen]}`;
      li.append(title, yours);
      if (!r.correct) {
        const right = document.createElement('p');
        right.className = 'rq__line rq__line--right';
        right.textContent = `${m.correctAnswer}: ${q.options[r.answer]}`;
        li.appendChild(right);
      }
      resultList.appendChild(li);
    });
    if (data.public) renderPublish();
    else {
      publishAsk.hidden = false;
      publishState.hidden = true;
    }
    show('result');
  };

  const finish = async () => {
    if (!current) return;
    qNext.disabled = true;
    qNext.textContent = m.sending;
    qBar.style.width = '100%';
    try {
      const res = await api('finish', { email: current.email, playerToken: current.playerToken });
      if (!res.ok) throw new Error(`quiz finish ${res.status}`);
      const data = (await res.json()) as Finish;
      current = { ...current, status: 'finished', score: data.score, total: data.total, public: data.public };
      save(current);
      renderResult(data);
    } catch (error) {
      console.error('quiz: no se pudo terminar', error);
      fail(m.errorTitle, m.errorText);
    } finally {
      qNext.disabled = false;
      qNext.textContent = m.finish;
    }
  };

  const setPublic = async (value: boolean) => {
    if (!current?.playerToken) return;
    try {
      const res = await api('publish', { email: current.email, playerToken: current.playerToken, public: value });
      if (!res.ok) throw new Error(`quiz publish ${res.status}`);
      current = { ...current, public: value };
      save(current);
      renderPublish();
    } catch (error) {
      console.error('quiz: no se pudo cambiar la publicación', error);
      publishStatus.textContent = m.errorText;
    }
  };
  root.querySelector('[data-publish-yes]')?.addEventListener('click', () => void setPublic(true));
  root.querySelector('[data-publish-no]')?.addEventListener('click', () => {
    if (current) {
      current = { ...current, public: false };
      save(current);
    }
    renderPublish();
  });
  publishToggle.addEventListener('click', () => void setPublic(!current?.public));
  root.querySelector('[data-retry]')?.addEventListener('click', () => {
    if (current?.status === 'playing' && order.length) {
      renderQuestion();
      show('play');
    } else if (current) void start({ ...current, playerToken: current.playerToken });
    else show('intro');
  });

  // --- Partida de este navegador: en curso → continuar; terminada → resultado ---
  const saved = load();
  if (saved?.playerToken && saved.status === 'playing') {
    void start(saved);
  } else if (saved?.playerToken && saved.status === 'finished') {
    current = saved;
    resultTitle.textContent = fill(m.resultTitle, { score: saved.score ?? 0, total: saved.total ?? 0 });
    resultLead.textContent = tierFor(saved.score ?? 0, saved.total ?? 0, m.tiers);
    resultList.innerHTML = '';
    renderPublish();
    show('result');
  }
}
