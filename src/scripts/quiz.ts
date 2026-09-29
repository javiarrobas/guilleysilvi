/**
 * El juego: avatar + nombre + email, preguntas de una en una, corrección en la
 * función de la plataforma (las respuestas correctas nunca están en el navegador),
 * resultado y decisión de publicar en el ranking.
 */
import { isLocale, type Locale } from '@/i18n';
import { quizUrl } from '@/lib/firebase';
import { getAppCheckToken } from './firebase-client';

type Question = { id: string; text: string; options: string[] };
type Messages = Record<string, string>;
type Result = { id: string; chosen: number | null; answer: number; correct: boolean };
type Submit = { score: number; total: number; results: Result[]; playerToken: string; public: boolean };
type Saved = { email: string; name: string; emoji: string; score: number; total: number; playerToken?: string; public: boolean };

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const fill = (text: string, vars: Record<string, string | number>) => text.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));

export function setupQuiz(root: HTMLElement) {
  const questions = JSON.parse(root.dataset.questions ?? '[]') as Question[];
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

  // --- Intro: avatar, nombre, email ---
  const introForm = $('form[data-intro]') as HTMLFormElement;
  const player = { email: '', name: '', emoji: '' };
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
    Object.assign(player, { email, name, emoji });
    startPlaying();
  });

  // --- Preguntas de una en una ---
  const answers: Record<string, number> = {};
  let index = 0;
  const qTitle = $('[data-q-title]');
  const qText = $('[data-q-text]');
  const qOptions = $('[data-q-options]');
  const qNext = $('button[data-q-next]') as HTMLButtonElement;
  const qBar = $('[data-q-bar]');

  const renderQuestion = () => {
    const q = questions[index];
    qTitle.textContent = fill(m.progress, { n: index + 1, total: questions.length });
    qText.textContent = q.text;
    qBar.style.width = `${(index / questions.length) * 100}%`;
    qOptions.innerHTML = '';
    q.options.forEach((option, i) => {
      const label = document.createElement('label');
      label.className = 'option';
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'answer';
      input.value = String(i);
      input.checked = answers[q.id] === i;
      const span = document.createElement('span');
      span.textContent = option;
      label.append(input, span);
      qOptions.appendChild(label);
    });
    qNext.textContent = index === questions.length - 1 ? m.finish : m.next;
    qNext.disabled = !(q.id in answers);
  };
  qOptions.addEventListener('change', () => {
    const chosen = (panels.play.querySelector('input[name="answer"]:checked') as HTMLInputElement | null)?.value;
    if (chosen !== undefined) answers[questions[index].id] = Number(chosen);
    qNext.disabled = false;
  });
  qNext.addEventListener('click', () => {
    if (index < questions.length - 1) {
      index += 1;
      renderQuestion();
      panels.play.scrollIntoView?.({ block: 'start', behavior: 'smooth' });
    } else {
      void submit();
    }
  });
  const startPlaying = () => {
    index = 0;
    renderQuestion();
    show('play');
  };

  // --- Envío y resultado ---
  const api = async (path: string, body: unknown) => {
    const token = await getAppCheckToken();
    return fetch(`${quizUrl}/${siteId}/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { 'X-Firebase-AppCheck': token } : {}) },
      body: JSON.stringify(body),
    });
  };

  const resultTitle = $('[data-result-title]');
  const resultLead = $('[data-result-lead]');
  const resultList = $('[data-result-list]');
  const publishAsk = $('[data-publish-ask]');
  const publishState = $('[data-publish-state]');
  const publishStatus = $('[data-publish-status]');
  const publishToggle = $('button[data-publish-toggle]') as HTMLButtonElement;
  let current: Saved | null = null;

  const renderPublish = () => {
    if (!current) return;
    publishAsk.hidden = true;
    publishState.hidden = false;
    publishStatus.textContent = current.public ? m.published : m.unpublished;
    publishToggle.textContent = current.public ? m.unpublish : m.publishNow;
    publishToggle.hidden = !current.playerToken;
  };

  const renderResult = (data: Submit) => {
    const { score, total } = data;
    resultTitle.textContent = fill(m.resultTitle, { score, total });
    const ratio = total ? score / total : 0;
    resultLead.textContent = ratio === 1 ? m.resultPerfect : ratio >= 0.7 ? m.resultGreat : ratio >= 0.4 ? m.resultOk : m.resultLow;
    resultList.innerHTML = '';
    data.results.forEach((r, i) => {
      const q = questions.find((x) => x.id === r.id);
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
    publishAsk.hidden = false;
    publishState.hidden = true;
    show('result');
  };

  const submit = async () => {
    qNext.disabled = true;
    qNext.textContent = m.sending;
    qBar.style.width = '100%';
    try {
      const res = await api('submit', { email: player.email, name: player.name, emoji: player.emoji, locale, answers, public: false });
      if (res.status === 409) {
        const prev = (await res.json()) as { score: number; total: number; public: boolean };
        $('[data-already-text]').textContent = fill(m.alreadyText, { score: prev.score, total: prev.total });
        show('already');
        return;
      }
      if (res.status === 503) {
        $('[data-error-title]').textContent = m.errorTitle;
        $('[data-error-text]').textContent = m.notReady;
        show('error');
        return;
      }
      if (!res.ok) throw new Error(`quiz submit ${res.status}`);
      const data = (await res.json()) as Submit;
      current = { ...player, score: data.score, total: data.total, playerToken: data.playerToken, public: data.public };
      save(current);
      renderResult(data);
    } catch (error) {
      console.error('quiz: no se pudo corregir', error);
      $('[data-error-title]').textContent = m.errorTitle;
      $('[data-error-text]').textContent = m.errorText;
      show('error');
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
  root.querySelector('[data-retry]')?.addEventListener('click', () => void submit());

  // --- Partida anterior en este navegador: resultado y control de publicación ---
  const saved = load();
  if (saved?.playerToken) {
    current = saved;
    resultTitle.textContent = fill(m.resultTitle, { score: saved.score, total: saved.total });
    resultLead.textContent = '';
    resultList.innerHTML = '';
    renderPublish();
    show('result');
  }
}
