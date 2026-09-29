/**
 * Publica la clave de respuestas del juego en Firestore (sites/<siteId>/quiz/answers),
 * donde solo la lee la función que puntúa. Así las respuestas correctas nunca viajan
 * al navegador ni al repositorio (que es público).
 *
 *   npm run quiz:publish
 *
 * Requisitos: gcloud con la cuenta wedoco.io activa (misma que Terraform) y
 * src/data/quiz.answers.json (copia de quiz.answers.example.json con las respuestas reales).
 * Cada pregunta de src/data/quiz.json debe tener su índice de respuesta correcta.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const PROJECT = 'youwebit-platform';
const quiz = JSON.parse(readFileSync(new URL('../src/data/quiz.json', import.meta.url), 'utf8'));
const key = JSON.parse(readFileSync(new URL('../src/data/quiz.answers.json', import.meta.url), 'utf8'));
const config = JSON.parse(readFileSync(new URL('../src/firebase.config.json', import.meta.url), 'utf8'));
const site = JSON.parse(readFileSync(new URL('../src/site.config.ts', import.meta.url), 'utf8').match(/siteId: '([a-z0-9-]+)'/)?.[1] ? `"${readFileSync(new URL('../src/site.config.ts', import.meta.url), 'utf8').match(/siteId: '([a-z0-9-]+)'/)[1]}"` : '""');

if (!site) throw new Error('siteId not found in src/site.config.ts');
if (key.quizId !== quiz.id) throw new Error(`quiz.answers.json is for "${key.quizId}" but quiz.json is "${quiz.id}"`);
if (config.projectId && config.projectId !== PROJECT) throw new Error(`firebase.config.json points to ${config.projectId}, expected ${PROJECT}`);

const answers = {};
for (const q of quiz.questions) {
  const a = key.answers[q.id];
  if (!Number.isInteger(a) || a < 0 || a >= q.options.length) throw new Error(`Question ${q.id}: answer must be an index between 0 and ${q.options.length - 1}`);
  answers[q.id] = a;
}
const extra = Object.keys(key.answers).filter((id) => !quiz.questions.some((q) => q.id === id));
if (extra.length) throw new Error(`quiz.answers.json has answers for unknown questions: ${extra.join(', ')}`);

const account = execFileSync('gcloud', ['config', 'get-value', 'account'], { encoding: 'utf8' }).trim();
if (!account.endsWith('@wedoco.io')) throw new Error(`Active gcloud account is ${account}; run: gcloud config configurations activate wedoco`);
const token = execFileSync('gcloud', ['auth', 'print-access-token'], { encoding: 'utf8' }).trim();

const url = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/sites/${site}/quiz/answers`;
const body = {
  fields: {
    quizId: { stringValue: quiz.id },
    total: { integerValue: String(quiz.questions.length) },
    answers: { mapValue: { fields: Object.fromEntries(Object.entries(answers).map(([id, a]) => [id, { integerValue: String(a) }])) } },
    updatedAt: { timestampValue: new Date().toISOString() },
  },
};
const res = await fetch(url, { method: 'PATCH', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
if (!res.ok) throw new Error(`Firestore answered ${res.status}: ${await res.text()}`);
console.log(`✓ Answer key "${quiz.id}" (${quiz.questions.length} questions) published for site "${site}" as ${account}`);
