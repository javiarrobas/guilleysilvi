import { test, expect, type APIRequestContext, type Page, type Route } from '@playwright/test';
import { createHash } from 'node:crypto';
import quiz from '../src/data/quiz.json' with { type: 'json' };

/**
 * El juego y el ranking. La función que puntúa vive en la plataforma (otro repo), así
 * que aquí se simula con page.route(); el ranking se lee de verdad del emulador.
 */
const EMULATOR = 'http://127.0.0.1:8085';
const DOCS = `${EMULATOR}/v1/projects/demo-youwebit/databases/(default)/documents`;
const OWNER = { Authorization: 'Bearer owner' };
const QUIZ_URL = 'http://127.0.0.1:8098'; // quizUrl en modo emulador (src/lib/firebase.ts)
const sha256 = (text: string) => createHash('sha256').update(text.trim().toLowerCase(), 'utf8').digest('hex');
const total = quiz.questions.length;

async function seedSite(request: APIRequestContext) {
  await request.patch(`${DOCS}/sites/guilleysilvi`, { headers: OWNER, data: { fields: { name: { stringValue: 'Silvia y Guille' } } } });
}

/** Simula la función: puntúa contra una clave de prueba (todas las respuestas correctas = índice 0). */
function mockQuizFunction(page: Page, calls: { submit: unknown[]; publish: unknown[] }) {
  return page.route(`${QUIZ_URL}/**`, async (route: Route) => {
    const req = route.request();
    const url = new URL(req.url());
    if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors() });
    const body = req.postDataJSON();
    if (url.pathname.endsWith('/submit')) {
      calls.submit.push(body);
      if (body.email === 'played@example.com') return route.fulfill({ status: 409, headers: cors(), json: { error: 'already_played', score: 5, total, public: true } });
      const results = quiz.questions.map((q) => ({ id: q.id, chosen: body.answers[q.id] ?? null, answer: 0, correct: body.answers[q.id] === 0 }));
      return route.fulfill({ status: 200, headers: cors(), json: { score: results.filter((r) => r.correct).length, total, results, playerToken: 'tok-test', public: false } });
    }
    if (url.pathname.endsWith('/publish')) {
      calls.publish.push(body);
      return route.fulfill({ status: 200, headers: cors(), json: { public: body.public } });
    }
    return route.fulfill({ status: 404, headers: cors(), json: { error: 'not_found' } });
  });
}
const cors = () => ({ 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, X-Firebase-AppCheck', 'Content-Type': 'application/json' });

async function fillIntro(page: Page, email: string) {
  await page.locator('label.emoji:has(input[value="🦊"])').click();
  await page.locator('#quiz-name').fill('Ana');
  await page.locator('#quiz-email').fill(email);
  await page.locator('form[data-intro] button[type="submit"]').click();
}

test.beforeEach(async ({ request }) => {
  await seedSite(request);
});

test('juego completo: intro, preguntas, resultado y publicación', async ({ page }) => {
  const calls = { submit: [] as any[], publish: [] as any[] };
  await mockQuizFunction(page, calls);
  await page.goto('/juego/');
  await expect(page.locator('[data-panel="intro"]')).toBeVisible();

  // Validación de la intro
  await page.getByRole('button', { name: 'Empezar' }).click();
  await expect(page.locator('[data-error="emoji"]')).toHaveText('Elige un avatar.');
  await expect(page.locator('[data-error="email"]')).toHaveText('Este campo es obligatorio.');

  await fillIntro(page, 'ana@example.com');
  await expect(page.locator('[data-panel="play"]')).toBeVisible();
  await expect(page.locator('[data-q-title]')).toHaveText(`Pregunta 1 de ${total}`);
  await expect(page.locator('[data-q-text]')).toHaveText(quiz.questions[0].text.es);
  const next = page.locator('button[data-q-next]');
  await expect(next).toBeDisabled();

  // Responde: correcta (índice 0) en las pares, incorrecta (índice 1) en las impares
  for (let i = 0; i < total; i++) {
    await page.locator('.option').nth(i % 2).click();
    await expect(next).toBeEnabled();
    if (i === total - 1) await expect(next).toHaveText('Ver mi resultado');
    await next.click();
  }

  await expect(page.locator('[data-panel="result"]')).toBeVisible({ timeout: 10_000 });
  const expected = Math.ceil(total / 2);
  await expect(page.locator('[data-result-title]')).toHaveText(`Has acertado ${expected} de ${total}`);
  await expect(page.locator('[data-result-list] li')).toHaveCount(total);
  await expect(page.locator('[data-result-list] li.is-correct')).toHaveCount(expected);
  await expect(page.locator('[data-result-list] li.is-wrong').first()).toContainText('Respuesta correcta');
  expect(calls.submit).toHaveLength(1);
  expect(calls.submit[0]).toMatchObject({ email: 'ana@example.com', name: 'Ana', emoji: '🦊', locale: 'es', public: false });
  expect(Object.keys(calls.submit[0].answers)).toHaveLength(total);

  // Publicar
  await expect(page.locator('[data-publish-ask]')).toBeVisible();
  await page.getByRole('button', { name: 'Sí, publicar' }).click();
  await expect(page.locator('[data-publish-status]')).toHaveText('Tu puntuación está en el ranking.');
  expect(calls.publish).toEqual([{ email: 'ana@example.com', playerToken: 'tok-test', public: true }]);
  await expect(page.getByRole('button', { name: 'Retirar del ranking' })).toBeVisible();

  // Al volver, recuerda la partida y permite retirar
  await page.reload();
  await expect(page.locator('[data-panel="result"]')).toBeVisible();
  await expect(page.locator('[data-result-title]')).toHaveText(`Has acertado ${expected} de ${total}`);
  await page.getByRole('button', { name: 'Retirar del ranking' }).click();
  await expect(page.locator('[data-publish-status]')).toHaveText('Tu puntuación no está publicada.');
});

test('segundo intento con el mismo email: la función responde 409 y la web lo explica', async ({ page }) => {
  const calls = { submit: [] as any[], publish: [] as any[] };
  await mockQuizFunction(page, calls);
  await page.goto('/juego/');
  await fillIntro(page, 'played@example.com');
  for (let i = 0; i < total; i++) {
    await page.locator('.option').first().click();
    await page.locator('button[data-q-next]').click();
  }
  await expect(page.locator('[data-panel="already"]')).toBeVisible({ timeout: 10_000 });
  await expect(page.locator('[data-already-text]')).toHaveText(`Con este email ya hay una partida: 5 de ${total}. Solo se puede jugar una vez.`);
});

test('en catalán: textos y locale=ca', async ({ page }) => {
  const calls = { submit: [] as any[], publish: [] as any[] };
  await mockQuizFunction(page, calls);
  await page.goto('/ca/joc/');
  await expect(page.locator('h1')).toContainText('Quant saps');
  await fillIntro(page, 'cat@example.com');
  await expect(page.locator('[data-q-text]')).toHaveText(quiz.questions[0].text.ca);
  for (let i = 0; i < total; i++) {
    await page.locator('.option').first().click();
    await page.locator('button[data-q-next]').click();
  }
  await expect(page.locator('[data-panel="result"]')).toBeVisible({ timeout: 10_000 });
  expect(calls.submit[0].locale).toBe('ca');
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
  await page.evaluate((key) => localStorage.setItem(key, JSON.stringify({ email: 'r1@example.com', name: 'Bea', emoji: '🐙', score: 6, total: 8, public: true })), 'quiz:guilleysilvi');
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
