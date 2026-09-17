import { test, expect, type APIRequestContext, type Page } from '@playwright/test';

/**
 * Formulario de confirmación contra el emulador de Firestore (reglas reales).
 * El emulador y la web se levantan en playwright.config.ts (webServer).
 *
 * Móvil y escritorio comparten el emulador y corren en paralelo, así que las
 * pruebas nunca borran datos: cada una usa un email único y busca su propio
 * documento.
 */
const EMULATOR = 'http://127.0.0.1:8085';
const DOCS = `${EMULATOR}/v1/projects/demo-youwebit/databases/(default)/documents`;
const OWNER = { Authorization: 'Bearer owner' }; // el emulador salta las reglas con este token

type Field = {
  stringValue?: string;
  booleanValue?: boolean;
  integerValue?: string;
  timestampValue?: string;
  arrayValue?: { values?: { mapValue: { fields: Record<string, Field> } }[] };
};

async function seedSite(request: APIRequestContext) {
  // El documento del sitio lo crea Terraform en producción; aquí lo sembramos (idempotente).
  await request.patch(`${DOCS}/sites/guilleysilvi`, {
    headers: OWNER,
    data: { fields: { name: { stringValue: 'Silvia & Guille' }, exportTokenHash: { stringValue: 'test' } } },
  });
}

async function docsByEmail(request: APIRequestContext, email: string): Promise<Record<string, Field>[]> {
  const res = await request.get(`${DOCS}/sites/guilleysilvi/rsvps?pageSize=300`, { headers: OWNER });
  const body = (await res.json()) as { documents?: { fields: Record<string, Field> }[] };
  return (body.documents ?? []).map((d) => d.fields).filter((d) => d.email?.stringValue === email);
}

const uniqueEmail = (tag: string, info: { project: { name: string } }) =>
  `${tag}-${info.project.name.replace(/\W/g, '')}-${Date.now()}@example.com`;

async function fillContact(page: Page, email: string) {
  await page.locator('#firstName').fill('Ana');
  await page.locator('#lastName').fill('Pérez');
  await page.locator('#email').fill(email);
}

/** Marca una opción pulsando la píldora visible (como un invitado), no el radio oculto. */
async function choose(page: Page, name: string, value: string) {
  const pill = page.locator(`label.pill:has(input[name="${name}"][value="${value}"])`);
  await pill.scrollIntoViewIfNeeded();
  await pill.click();
  await expect(pill.locator('input')).toBeChecked();
}

test.beforeEach(async ({ request }) => {
  await seedSite(request);
});

test('respuesta completa (sí) con acompañante, alergias, autobús y dos niños', async ({ page, request }, info) => {
  const email = uniqueEmail('ana', info);
  await page.goto('/confirmar/');
  await expect(page.locator('[data-rsvp-form]')).toBeVisible();
  await expect(page.locator('[data-when="attending=yes"]')).toBeHidden();

  await fillContact(page, email);
  await page.locator('#phone').fill('+34 600 000 000');
  await choose(page, 'attending', 'yes');
  await expect(page.locator('[data-when="attending=yes"]')).toBeVisible();

  await choose(page, 'plusOne', 'yes');
  await page.locator('#plusOneFirstName').fill('Luis');
  await page.locator('#plusOneLastName').fill('Gómez');
  await choose(page, 'hasDiet', 'yes');
  await page.locator('#diet').fill('Sin gluten');
  await choose(page, 'busOut', 'yes');
  await choose(page, 'busBack', 'no');
  await choose(page, 'hasChildren', 'yes');
  await page.locator('select[name="childrenCount"]').selectOption('2');
  const rows = page.locator('[data-child-row]:not([hidden])');
  await expect(rows).toHaveCount(2);
  await rows.nth(0).locator('[data-child="name"]').fill('Leo');
  await rows.nth(0).locator('[data-child="age"]').fill('4');
  await rows.nth(1).locator('[data-child="name"]').fill('Mar');
  await rows.nth(1).locator('[data-child="age"]').fill('2');
  await rows.nth(1).locator('[data-child="diet"]').fill('huevo');
  await choose(page, 'preboda', 'maybe');
  await page.locator('#song').fill('Sobreviviré');
  await page.locator('#artist').fill('Mónica Naranjo');
  await page.locator('#comments').fill('¡Qué ganas!');

  await page.getByRole('button', { name: 'Enviar respuesta' }).click();
  await expect(page.locator('[data-panel="success"]')).toBeVisible({ timeout: 15_000 });
  await expect(page.locator('[data-panel="success"]')).toContainText('¡Gracias!');

  const docs = await docsByEmail(request, email);
  expect(docs).toHaveLength(1);
  const d = docs[0];
  expect(d.firstName?.stringValue).toBe('Ana');
  expect(d.phone?.stringValue).toBe('+34 600 000 000');
  expect(d.attending?.booleanValue).toBe(true);
  expect(d.plusOne?.booleanValue).toBe(true);
  expect(d.plusOneFirstName?.stringValue).toBe('Luis');
  expect(d.diet?.stringValue).toBe('Sin gluten');
  expect(d.busOut?.booleanValue).toBe(true);
  expect(d.busBack?.booleanValue).toBe(false);
  expect(d.children?.arrayValue?.values).toHaveLength(2);
  expect(d.children?.arrayValue?.values?.[0].mapValue.fields.age.integerValue).toBe('4');
  expect(d.children?.arrayValue?.values?.[1].mapValue.fields.diet.stringValue).toBe('huevo');
  expect(d.preboda?.stringValue).toBe('maybe');
  expect(d.song?.stringValue).toBe('Sobreviviré');
  expect(d.comments?.stringValue).toBe('¡Qué ganas!');
  expect(d.locale?.stringValue).toBe('es');
  expect(d.createdAt?.timestampValue).toBeTruthy();
  expect(d).not.toHaveProperty('website');

  // Al recargar, la web recuerda que ya se respondió (solo aviso)
  await page.reload();
  await expect(page.locator('[data-already]')).toBeVisible();
});

test('respuesta "no": solo los datos de contacto', async ({ page, request }, info) => {
  const email = uniqueEmail('pau', info);
  await page.goto('/confirmar/');
  await fillContact(page, email);
  await choose(page, 'attending', 'no');
  await page.getByRole('button', { name: 'Enviar respuesta' }).click();
  await expect(page.locator('[data-panel="success-no"]')).toBeVisible({ timeout: 15_000 });

  const docs = await docsByEmail(request, email);
  expect(docs).toHaveLength(1);
  expect(docs[0].attending?.booleanValue).toBe(false);
  expect(Object.keys(docs[0]).sort()).toEqual(['attending', 'createdAt', 'email', 'firstName', 'lastName', 'locale']);
});

test('validación: campos obligatorios y email', async ({ page, request }, info) => {
  const bad = `esto-no-es-un-email-${info.project.name.replace(/\W/g, '')}`;
  await page.goto('/confirmar/');
  await page.getByRole('button', { name: 'Enviar respuesta' }).click();
  await expect(page.locator('[data-form-error]')).toBeVisible();
  await expect(page.locator('.is-invalid')).toHaveCount(4); // nombre, apellidos, email, asistencia
  await expect(page.locator('input[name="attending"]').first()).toHaveAttribute('aria-invalid', 'true');
  await fillContact(page, bad);
  await choose(page, 'attending', 'no');
  await page.getByRole('button', { name: 'Enviar respuesta' }).click();
  await expect(page.locator('.is-invalid')).toHaveCount(1);
  await expect(page.locator('.is-invalid [data-error]')).toHaveText('Escribe un email válido.');
  expect(await docsByEmail(request, bad)).toHaveLength(0);
});

test('honeypot: un bot ve el "gracias" pero no se guarda nada', async ({ page, request }, info) => {
  const email = uniqueEmail('bot', info);
  await page.goto('/confirmar/');
  await fillContact(page, email);
  await choose(page, 'attending', 'no');
  await page.locator('input[name="website"]').fill('http://spam.example', { force: true });
  await page.getByRole('button', { name: 'Enviar respuesta' }).click();
  await expect(page.locator('[data-panel="success-no"]')).toBeVisible();
  await page.waitForTimeout(500);
  expect(await docsByEmail(request, email)).toHaveLength(0);
});

test('en catalán se guarda locale=ca', async ({ page, request }, info) => {
  const email = uniqueEmail('cat', info);
  await page.goto('/ca/confirmar/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ca');
  await fillContact(page, email);
  await choose(page, 'attending', 'no');
  await page.getByRole('button', { name: 'Enviar resposta' }).click();
  await expect(page.locator('[data-panel="success-no"]')).toBeVisible({ timeout: 15_000 });
  const docs = await docsByEmail(request, email);
  expect(docs).toHaveLength(1);
  expect(docs[0].locale?.stringValue).toBe('ca');
});

test('en inglés se guarda locale=en', async ({ page, request }, info) => {
  const email = uniqueEmail('en', info);
  await page.goto('/en/rsvp/');
  await fillContact(page, email);
  await choose(page, 'attending', 'no');
  await page.getByRole('button', { name: 'Send reply' }).click();
  await expect(page.locator('[data-panel="success-no"]')).toBeVisible({ timeout: 15_000 });
  const docs = await docsByEmail(request, email);
  expect(docs).toHaveLength(1);
  expect(docs[0].locale?.stringValue).toBe('en');
});
