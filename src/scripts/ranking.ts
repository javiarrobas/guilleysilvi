/** Ranking público del juego: lee sites/<site>/ranking (nombre, avatar y puntuación; sin emails). */
import { collection, getDocs } from 'firebase/firestore/lite';
import { emailHash, getDb } from './firebase-client';

type Entry = { id: string; name: string; emoji: string; score: number; total: number; at: number };

const fill = (text: string, vars: Record<string, string | number>) => text.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));

export function setupRanking(root: HTMLElement) {
  const m = JSON.parse(root.dataset.messages ?? '{}') as Record<string, string>;
  const siteId = root.dataset.site ?? '';
  const list = root.querySelector<HTMLElement>('[data-ranking-list]')!;
  const status = root.querySelector<HTMLElement>('[data-ranking-status]')!;
  const count = root.querySelector<HTMLElement>('[data-ranking-count]')!;

  const mine = async (): Promise<string> => {
    try {
      const saved = JSON.parse(localStorage.getItem(`quiz:${siteId}`) ?? 'null') as { email?: string } | null;
      return saved?.email ? await emailHash(saved.email) : '';
    } catch {
      return '';
    }
  };

  const render = (entries: Entry[], myId: string) => {
    list.innerHTML = '';
    entries.forEach((e, i) => {
      const li = document.createElement('li');
      li.className = 'rank' + (e.id === myId ? ' rank--me' : '') + (i < 3 ? ` rank--top${i + 1}` : '');
      li.innerHTML = `<span class="rank__pos">${i + 1}</span><span class="rank__emoji" aria-hidden="true"></span><span class="rank__name"></span><span class="rank__score"></span>`;
      li.querySelector('.rank__emoji')!.textContent = e.emoji;
      li.querySelector('.rank__name')!.textContent = e.name + (e.id === myId ? ` (${m.you})` : '');
      li.querySelector('.rank__score')!.textContent = `${e.score}/${e.total}`;
      list.appendChild(li);
    });
    count.textContent = entries.length ? fill(m.players, { n: entries.length }) : '';
    status.textContent = entries.length ? '' : m.empty;
    status.hidden = entries.length > 0;
  };

  const refresh = async () => {
    status.hidden = false;
    status.textContent = m.loading;
    try {
      const snap = await getDocs(collection(getDb(), `sites/${siteId}/ranking`));
      const entries: Entry[] = snap.docs.map((d) => {
        const data = d.data() as { name?: string; emoji?: string; score?: number; total?: number; at?: { toMillis?: () => number } };
        return { id: d.id, name: String(data.name ?? ''), emoji: String(data.emoji ?? ''), score: Number(data.score ?? 0), total: Number(data.total ?? 0), at: data.at?.toMillis?.() ?? 0 };
      });
      entries.sort((a, b) => b.score - a.score || a.at - b.at || a.name.localeCompare(b.name));
      render(entries, await mine());
    } catch (error) {
      console.error('ranking: no se pudo cargar', error);
      status.hidden = false;
      status.textContent = m.error;
    }
  };

  root.querySelector('[data-ranking-refresh]')?.addEventListener('click', () => void refresh());
  void refresh();
}
