import { test, expect, type Page } from '@playwright/test';

const pages = [
  { path: '/', h1: /Silvia/ },
  { path: '/el-gran-dia/', h1: /1 de mayo de 2027/ },
  { path: '/transporte/', h1: /Cómo llegar/ },
  { path: '/alojamiento/', h1: /Dónde dormir/ },
  { path: '/santander/', h1: /guía muy personal/ },
  { path: '/preboda/', h1: /calentar motores/ },
  { path: '/fotos/', h1: /Nosotros/ },
  { path: '/preguntas/', h1: /Dudas habituales/ },
  { path: '/confirmar/', h1: /Contamos contigo/ },
  { path: '/ca/', h1: /Silvia/, lang: 'ca' },
  { path: '/ca/el-gran-dia/', h1: /1 de maig de 2027/, lang: 'ca' },
  { path: '/ca/transport/', h1: /Com arribar-hi/, lang: 'ca' },
  { path: '/ca/allotjament/', h1: /On dormir/, lang: 'ca' },
  { path: '/ca/santander/', h1: /guia molt personal/, lang: 'ca' },
  { path: '/ca/preboda/', h1: /escalfar motors/, lang: 'ca' },
  { path: '/ca/fotos/', h1: /Nosaltres/, lang: 'ca' },
  { path: '/ca/preguntes/', h1: /Dubtes habituals/, lang: 'ca' },
  { path: '/ca/confirmar/', h1: /Comptem amb tu/, lang: 'ca' },
];

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  return errors;
}

test.describe('todas las páginas', () => {
  for (const { path, h1, lang = 'es' } of pages) {
    test(`${path} carga sin errores y sin scroll horizontal`, async ({ page }) => {
      const errors = collectErrors(page);
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.locator('h1')).toContainText(h1);
      await expect(page.locator('html')).toHaveAttribute('lang', lang);

      // Nada debe desbordar horizontalmente (prioridad móvil).
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);

      // Todos los enlaces internos deben apuntar a páginas existentes.
      const hrefs = await page.$$eval('a[href^="/"]', (links) => links.map((a) => (a as HTMLAnchorElement).pathname));
      for (const href of new Set(hrefs)) {
        const res = await page.request.get(href);
        expect(res.status(), `enlace roto: ${href}`).toBe(200);
      }

      expect(errors).toEqual([]);
    });
  }
});

test('portada: cuenta atrás en marcha y botón de confirmar', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-unit="days"]')).toHaveText(/^\d+$/);
  const seconds = page.locator('[data-unit="seconds"]');
  const before = await seconds.textContent();
  await page.waitForTimeout(1200);
  expect(await seconds.textContent()).not.toBe(before);

  await page.locator('.hero').getByRole('link', { name: 'Confirmar asistencia' }).click();
  await expect(page).toHaveURL(/\/confirmar\/$/);
});

test('menú móvil: abre, lista las secciones y navega', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'solo en móvil');
  await page.goto('/');
  const toggle = page.locator('[data-menu-toggle]');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  const menu = page.locator('#site-menu');
  await expect(menu).toBeVisible();
  await expect(menu.locator('.site-menu__item')).toHaveCount(7);
  await menu.getByRole('link', { name: 'Alojamiento' }).click();
  await expect(page).toHaveURL(/\/alojamiento\/$/);
});

test('escritorio: la navegación principal marca la página actual', async ({ page, isMobile }) => {
  test.skip(isMobile, 'solo en escritorio');
  await page.goto('/transporte/');
  await expect(page.locator('.nav-desktop a[aria-current="page"]')).toHaveText('Transporte');
});

test('transporte: el mapa se inicializa con los tres puntos y la zona', async ({ page }) => {
  await page.goto('/transporte/');
  const map = page.locator('.venue-map');
  await map.scrollIntoViewIfNeeded();
  await expect(map).toHaveClass(/is-ready/);
  await expect(page.locator('.venue-marker')).toHaveCount(3);
  await expect(page.locator('.venue-marker--highlight')).toHaveCount(1);
  await expect(page.locator('path.leaflet-interactive')).toHaveCount(1); // círculo de la zona
  await expect(page.locator('.leaflet-tile-loaded').first()).toBeVisible({ timeout: 15_000 });

  const mapsLinks = page.locator('a[href^="https://www.google.com/maps/"]');
  expect(await mapsLinks.count()).toBeGreaterThanOrEqual(3);
  for (const link of await mapsLinks.all()) {
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', /noopener/);
  }
});

test('alojamiento: mapa centrado en la zona recomendada', async ({ page }) => {
  await page.goto('/alojamiento/');
  const map = page.locator('.venue-map');
  await map.scrollIntoViewIfNeeded();
  await expect(map).toHaveClass(/is-ready/);
  await expect(page.locator('.venue-marker')).toHaveCount(1);
  await expect(page.getByText('Próximamente').first()).toBeVisible();
});

test('preguntas: los desplegables abren y cierran', async ({ page }) => {
  await page.goto('/preguntas/');
  const item = page.locator('details').first();
  await expect(item).not.toHaveAttribute('open', '');
  await item.locator('summary').click();
  await expect(item).toHaveAttribute('open', '');
  await expect(item.locator('.faq__answer')).toBeVisible();
  await item.locator('summary').click();
  await expect(item).not.toHaveAttribute('open', '');
});

test('fotos: el visor se abre y navega', async ({ page }) => {
  await page.goto('/fotos/');
  const buttons = page.locator('[data-gallery-open]');
  expect(await buttons.count()).toBeGreaterThanOrEqual(8);
  await buttons.nth(1).click();
  const dialog = page.locator('dialog[open]');
  await expect(dialog).toBeVisible();
  const src1 = await dialog.locator('img').getAttribute('src');
  await dialog.locator('[data-lightbox-next]').click();
  expect(await dialog.locator('img').getAttribute('src')).not.toBe(src1);
  await page.keyboard.press('Escape');
  await expect(page.locator('dialog[open]')).toHaveCount(0);
});

test('santander: las categorías enlazan a sus secciones', async ({ page }) => {
  await page.goto('/santander/');
  const chips = page.locator('.chip');
  await expect(chips).toHaveCount(9);
  for (const href of await chips.evaluateAll((els) => els.map((el) => (el as HTMLAnchorElement).hash))) {
    await expect(page.locator(href)).toHaveCount(1);
  }
});

test('confirmar: sin URL de formulario muestra "próximamente"', async ({ page }) => {
  await page.goto('/confirmar/');
  await expect(page.locator('.rsvp__action .btn')).toHaveAttribute('aria-disabled', 'true');
});

test('404 personalizada', async ({ page }) => {
  const response = await page.goto('/no-existe/');
  expect(response?.status()).toBe(404);
  await expect(page.locator('h1')).toContainText('playa');
});

test('idiomas: el selector lleva a la misma página en el otro idioma', async ({ page, isMobile }) => {
  await page.goto('/alojamiento/');
  if (isMobile) await page.locator('[data-menu-toggle]').click();
  await page.getByRole('link', { name: 'Català' }).first().click();
  await expect(page).toHaveURL(/\/ca\/allotjament\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'ca');
  await expect(page.locator('h1')).toContainText('On dormir');

  if (isMobile) await page.locator('[data-menu-toggle]').click();
  await page.getByRole('link', { name: 'Castellano' }).first().click();
  await expect(page).toHaveURL(/\/alojamiento\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
});

test('idiomas: hreflang en ambas versiones', async ({ page }) => {
  await page.goto('/ca/transport/');
  const alternates = page.locator('link[rel="alternate"][hreflang]');
  await expect(alternates).toHaveCount(3); // es, ca, x-default
  await expect(page.locator('link[hreflang="es"]')).toHaveAttribute('href', /\/transporte\/$/);
  await expect(page.locator('link[hreflang="ca"]')).toHaveAttribute('href', /\/ca\/transport\/$/);
});
