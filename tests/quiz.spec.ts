import { test, expect, type APIRequestContext, type Page, type Route } from '@playwright/test';
import { createHash } from 'node:crypto';
import quiz from '../src/data/quiz.json' with { type: 'json' };

/**
 * El juego y el ranking. La función que puntúa vive en la plataforma (otro repo), así
 * que aquí se simula con page.route() (start / answer / finish / publish); el ranking
 * se lee de verdad del emulador.
 */
const EMULATOR = 'http://127.0.0.1:8085';
const DOCS = `${EMULATOR}/v1/projects/demo-youwebit/databases/(default)/documents`;
const OWNER = { Authorization: 'Bearer owner' };
const QUIZ_URL = 'http://127.0.0.1:8098'; // quizUrl en modo emulador (src/lib/firebase.ts)
const sha256 = (text: string) => createHash('sha256').update(text.trim().toLowerCase(), 'utf8').digest('hex');
const ids = quiz.questions.map((q) => q.id);
const total = ids.length;
/** Clave de prueba: la opción correcta es siempre la 0. */
const KEY: Record<string, number> = Object.fromEntries(ids.map((id) => [id, 0]));

async function seedSite(request: APIRequestContext) {
  await request.patch(`${DOCS}/sites/guilleysilvi`, { headers: OWNER, data: { fields: { name: { stringValue: 'Silvia y Guille' } } } });
}

type Calls = { start: any[]; answer: any[]; finish: any[]; publish: any[] };
const cors = () => ({ 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, X-Firebase-AppCheck', 'Content-Type': 'application/json' });

/** Simula la función con una sesión en memoria por email. */
function mockQuizFunction(page: Page, calls: Calls) {
  const sessions = new Map<string, { answers: Record<string, number>; finished: boolean; public: boolean }>();
  return page.route(`${QUIZ_URL}/**`, async (route: Route) => {
    const req = route.request();
    const url = new URL(req.url());
    if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors() });
    const body = req.postDataJSON();
    const action = url.pathname.split('/').pop();
    const email = String(body.email ?? '').toLowerCase();
    if (action === 'start') {
      calls.start.push(body);
      if (email === 'played@example.com') return route.fulfill({ status: 409, headers: cors(), json: { error: 'already_played', score: 5, total, public: true } });
      const s = sessions.get(email) ?? { answers: {}, finished: false, public: false };
      sessions.set(email, s);
      const answered = Object.fromEntries(Object.entries(s.answers).map(([id, c]) => [id, { id, chosen: c, answer: KEY[id], correct: c === KEY[id] }]));
      return route.fulfill({ status: 200, headers: cors(), json: { playerToken: 'tok-test', questions: ids, answered, resumed: Object.keys(s.answers).length > 0 } });
    }
    const s = sessions.get(email);
    if (!s || body.playerToken !== 'tok-test') return route.fulfill({ status: 403, headers: cors(), json: { error: 'forbidden' } });
    if (action === 'answer') {
      calls.answer.push(body);
      if (!(body.questionId in s.answers)) s.answers[body.questionId] = body.choice;
      const c = s.answers[body.questionId];
      return route.fulfill({ status: 200, headers: cors(), json: { correct: c === KEY[body.questionId], answer: KEY[body.questionId], chosen: c, answered: Object.keys(s.answers).length, total } });
    }
    if (action === 'finish') {
      calls.finish.push(body);
      s.finished = true;
      const results = ids.map((id) => ({ id, chosen: s.answers[id] ?? null, answer: KEY[id], correct: s.answers[id] === KEY[id] }));
      return route.fulfill({ status: 200, headers: cors(), json: { score: results.filter((r) => r.correct).length, total, results, public: s.public } });
    }
    if (action === 'publish') {
      calls.publish.push(body);
      s.public = body.public === true;
      return route.fulfill({ status: 200, headers: cors(), json: { public: s.public } });
    }
    return route.fulfill({ status: 404, headers: cors(), json: { error: 'not_found' } });
  });
}
const newCalls = (): Calls => ({ start: [], answer: [], finish: [], publish: [] });

async function fillIntro(page: Page, email: string) {
  await page.locator('label.emoji:has(input[value="🦊"])').click();
  await page.locator('#quiz-name').fill('Ana');
  await page.locator('#quiz-email').fill(email);
  await page.locator('form[data-intro] button[type="submit"]').click();
}

/** Responde la pregunta en pantalla con la opción `choice` y espera la corrección. */
async function answer(page: Page, choice: number) {
  await page.locator('.option').nth(choice).click();
  await expect(page.locator('[data-q-feedback]')).toBeVisible();
  await expect(page.locator('button[data-q-next]')).toBeEnabled();
}

test.beforeEach(async ({ request }) => {
  await seedSite(request);
});

test('juego completo: intro, corrección inmediata, resultado y publicación', async ({ page }) => {
  const calls = newCalls();
  await mockQuizFunction(page, calls);
  await page.goto('/juego/');
  await expect(page.locator('[data-panel="intro"]')).toBeVisible();

  // Validación de la intro
  await page.locator('form[data-intro] button[type="submit"]').click();
  await expect(page.locator('[data-error="emoji"]')).toHaveText('Elige un avatar.');
  await expect(page.locator('[data-error="email"]')).toHaveText('Este campo es obligatorio.');

  await fillIntro(page, 'ana@example.com');
  await expect(page.locator('[data-panel="play"]')).toBeVisible();
  await expect(page.locator('[data-q-title]')).toHaveText(`Pregunta 1 de ${total}`);
  await expect(page.locator('[data-q-text]')).toHaveText(quiz.questions[0].text.es);
  await expect(page.locator('.option')).toHaveCount(4);
  const next = page.locator('button[data-q-next]');
  await expect(next).toBeDisabled();

  // Pregunta 1: acierto → verde y "¡Correcto!"
  await answer(page, 0);
  await expect(page.locator('[data-q-feedback]')).toContainText('¡Correcto!');
  await expect(page.locator('.option').nth(0)).toHaveClass(/is-correct/);
  // La opción ya no se puede cambiar
  await page.locator('.option').nth(1).click({ force: true });
  expect(calls.answer).toHaveLength(1);
  await next.click();

  // Pregunta 2: fallo → roja, se marca la correcta y se muestra el texto
  await expect(page.locator('[data-q-title]')).toHaveText(`Pregunta 2 de ${total}`);
  await answer(page, 1);
  await expect(page.locator('[data-q-feedback]')).toContainText(`Casi… la respuesta era: ${quiz.questions[1].options[0].es}`);
  await expect(page.locator('.option').nth(1)).toHaveClass(/is-wrong/);
  await expect(page.locator('.option').nth(0)).toHaveClass(/is-correct/);
  await next.click();

  // Resto: pares acierto, impares fallo
  for (let i = 2; i < total; i++) {
    await answer(page, i % 2);
    if (i === total - 1) await expect(next).toHaveText('Ver mi resultado');
    await next.click();
  }

  await expect(page.locator('[data-panel="result"]')).toBeVisible({ timeout: 10_000 });
  const expected = Math.ceil(total / 2);
  await expect(page.locator('[data-result-title]')).toHaveText(`Has acertado ${expected} de ${total}`);
  await expect(page.locator('[data-result-lead]')).toHaveText('Aprobado por los pelos.'); // 11/22 → 6–11
  await expect(page.locator('[data-result-list] li')).toHaveCount(total);
  await expect(page.locator('[data-result-list] li.is-correct')).toHaveCount(expected);
  expect(calls.start).toHaveLength(1);
  expect(calls.start[0]).toMatchObject({ email: 'ana@example.com', name: 'Ana', emoji: '🦊', locale: 'es' });
  expect(calls.answer).toHaveLength(total);
  expect(calls.finish).toHaveLength(1);

  // Publicar
  await expect(page.locator('[data-publish-ask]')).toBeVisible();
  await page.getByRole('button', { name: 'Sí, publicar' }).click();
  await expect(page.locator('[data-publish-status]')).toHaveText('Tu puntuación está en el ranking.');
  expect(calls.publish).toEqual([{ email: 'ana@example.com', playerToken: 'tok-test', public: true }]);

  // Al volver, recuerda la partida y permite retirar
  await page.reload();
  await expect(page.locator('[data-panel="result"]')).toBeVisible();
  await expect(page.locator('[data-result-title]')).toHaveText(`Has acertado ${expected} de ${total}`);
  await page.getByRole('button', { name: 'Retirar del ranking' }).click();
  await expect(page.locator('[data-publish-status]')).toHaveText('Tu puntuación no está publicada.');
});

test('partida a medias: al recargar continúa en la siguiente pregunta', async ({ page }) => {
  const calls = newCalls();
  await mockQuizFunction(page, calls);
  await page.goto('/juego/');
  await fillIntro(page, 'half@example.com');
  await answer(page, 0);
  await page.locator('button[data-q-next]').click();
  await answer(page, 0);
  await page.reload();
  await expect(page.locator('[data-panel="play"]')).toBeVisible();
  await expect(page.locator('[data-resume]')).toBeVisible();
  await expect(page.locator('[data-q-title]')).toHaveText(`Pregunta 3 de ${total}`);
});

test('segundo intento con el mismo email: la función responde 409 y la web lo explica', async ({ page }) => {
  await mockQuizFunction(page, newCalls());
  await page.goto('/juego/');
  await fillIntro(page, 'played@example.com');
  await expect(page.locator('[data-panel="already"]')).toBeVisible({ timeout: 10_000 });
  await expect(page.locator('[data-already-text]')).toHaveText(`Con este email ya hay una partida: 5 de ${total}. Solo se puede jugar una vez.`);
});

test('viene de confirmar asistencia: nombre y email prerrellenados', async ({ page }) => {
  await mockQuizFunction(page, newCalls());
  await page.goto('/');
  await page.evaluate(() => sessionStorage.setItem('quiz:prefill', JSON.stringify({ name: 'Bea', email: 'bea@example.com' })));
  await page.goto('/juego/');
  await expect(page.locator('#quiz-name')).toHaveValue('Bea');
  await expect(page.locator('#quiz-email')).toHaveValue('bea@example.com');
  await expect(page.locator('[data-prefilled]')).toBeVisible();
});

test('en catalán: textos y locale=ca', async ({ page }) => {
  const calls = newCalls();
  await mockQuizFunction(page, calls);
  await page.goto('/ca/joc/');
  await expect(page.locator('h1')).toContainText('Quant saps');
  await fillIntro(page, 'cat@example.com');
  await expect(page.locator('[data-q-text]')).toHaveText(quiz.questions[0].text.ca);
  await answer(page, 0);
  await expect(page.locator('[data-q-feedback]')).toContainText('Correcte!');
  expect(calls.start[0].locale).toBe('ca');
});

test('ranking: ordena por puntuación y marca al jugador de este navegador', async ({ page, request }) => {
  const now = new Date().toISOString();
  const seed = async (email: string, name: string, emoji: string, score: number) =>
    request.patch(`${DOCS}/sites/guilleysilvi/ranking/${sha256(email)}`, {
      headers: OWNER,
      data: { fields: { name: { stringValue: name }, emoji: { stringValue: emoji }, score: { integerValue: String(score) }, total: { integerValue: String(total) }, at: { timestampValue: now } } },
    });
  await seed('r1@example.com', 'Bea', '🐙', 6);
  await seed('r2@example.com', 'Ana', '🦊', 8);
  await seed('r3@example.com', 'Pau', '🐧', 3);

  await page.goto('/ranking/');
  await page.evaluate((key) => localStorage.setItem(key, JSON.stringify({ email: 'r1@example.com', name: 'Bea', emoji: '🐙', playerToken: 't', status: 'finished', score: 6, total: 22, public: true })), 'quiz:guilleysilvi');
  await page.reload();
  const rows = page.locator('[data-ranking-list] .rank');
  await expect(rows.first()).toBeVisible({ timeout: 15_000 });
  const names = await rows.locator('.rank__name').allTextContents();
  expect(names[0]).toBe('Ana');
  expect(names[1]).toBe('Bea (tú)');
  expect(names[names.length - 1]).toBe('Pau');
  await expect(rows.nth(1)).toHaveClass(/rank--me/);
  await expect(rows.first().locator('.rank__score')).toHaveText(`8/${total}`);
});
