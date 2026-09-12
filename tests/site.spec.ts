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
  { path: '/en/', h1: /Silvia/, lang: 'en' },
  { path: '/en/the-big-day/', h1: /1 May 2027/, lang: 'en' },
  { path: '/en/getting-there/', h1: /How to get there/, lang: 'en' },
  { path: '/en/where-to-stay/', h1: /Where to sleep/, lang: 'en' },
  { path: '/en/santander/', h1: /very personal guide/, lang: 'en' },
  { path: '/en/pre-wedding/', h1: /warming up/, lang: 'en' },
  { path: '/en/photos/', h1: /Us/, lang: 'en' },
  { path: '/en/faq/', h1: /Common questions/, lang: 'en' },
  { path: '/en/rsvp/', h1: /count on you/, lang: 'en' },
  { path: '/tr/', h1: /Silvia/, lang: 'tr' },
  { path: '/tr/buyuk-gun/', h1: /1 Mayıs 2027/, lang: 'tr' },
  { path: '/tr/ulasim/', h1: /Nasıl gidilir/, lang: 'tr' },
  { path: '/tr/konaklama/', h1: /Nerede kalınır/, lang: 'tr' },
  { path: '/tr/santander/', h1: /kişisel bir rehber/, lang: 'tr' },
  { path: '/tr/dugun-oncesi/', h1: /ısınmaya başlıyoruz/, lang: 'tr' },
  { path: '/tr/fotograflar/', h1: /Biz/, lang: 'tr' },
  { path: '/tr/sss/', h1: /Merak edilenler/, lang: 'tr' },
  { path: '/tr/katilim/', h1: /güvenebilir miyiz/, lang: 'tr' },
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

// El selector de idioma del pie crece con cada idioma: vigilamos la pantalla más estrecha.
test('móvil estrecho (320 px): nada desborda', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'solo en móvil');
  await page.setViewportSize({ width: 320, height: 800 });
  for (const path of ['/tr/', '/tr/ulasim/', '/tr/santander/']) {
    await page.goto(path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, `desborda en ${path}`).toBeLessThanOrEqual(0);
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
  const item = page.locator('.faq__item').first(); // hay otro <details> en la cabecera: el selector de idioma
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

test('idiomas: el selector lleva a la misma página en los otros idiomas', async ({ page, isMobile }) => {
  await page.goto('/alojamiento/');
  // En escritorio el selector es un desplegable en la cabecera; en móvil, la lista del menú.
  const openSwitcher = () =>
    page.locator(isMobile ? '[data-menu-toggle]' : '.site-header [data-lang-menu] summary').click();

  await openSwitcher();
  await page.getByRole('link', { name: 'Català' }).first().click();
  await expect(page).toHaveURL(/\/ca\/allotjament\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'ca');
  await expect(page.locator('h1')).toContainText('On dormir');

  await openSwitcher();
  await page.getByRole('link', { name: 'English' }).first().click();
  await expect(page).toHaveURL(/\/en\/where-to-stay\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('h1')).toContainText('Where to sleep');

  await openSwitcher();
  await page.getByRole('link', { name: 'Türkçe' }).first().click();
  await expect(page).toHaveURL(/\/tr\/konaklama\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'tr');
  await expect(page.locator('h1')).toContainText('Nerede kalınır');

  await openSwitcher();
  await page.getByRole('link', { name: 'Castellano' }).first().click();
  await expect(page).toHaveURL(/\/alojamiento\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
});

test('escritorio: el desplegable de idioma abre, marca el actual y cierra', async ({ page, isMobile }) => {
  test.skip(isMobile, 'solo en escritorio');
  await page.goto('/en/where-to-stay/');
  const menu = page.locator('.site-header [data-lang-menu]');
  const trigger = menu.locator('summary');
  await expect(trigger).toContainText('EN');
  await expect(menu).not.toHaveAttribute('open', '');

  await trigger.click();
  await expect(menu).toHaveAttribute('open', '');
  await expect(menu.getByRole('link')).toHaveCount(4);
  await expect(menu.locator('a[aria-current="true"] .lang-menu__name')).toHaveText('English');
  await expect(menu.locator('svg')).toHaveCount(0); // sin flechas

  await page.keyboard.press('Escape');
  await expect(menu).not.toHaveAttribute('open', '');

  // También se cierra al pulsar fuera.
  await trigger.click();
  await expect(menu).toHaveAttribute('open', '');
  await page.locator('h1').click();
  await expect(menu).not.toHaveAttribute('open', '');
});

test('idiomas: hreflang en todas las versiones', async ({ page }) => {
  await page.goto('/ca/transport/');
  const alternates = page.locator('link[rel="alternate"][hreflang]');
  await expect(alternates).toHaveCount(5); // es, ca, en, tr, x-default
  await expect(page.locator('link[hreflang="es"]')).toHaveAttribute('href', /\/transporte\/$/);
  await expect(page.locator('link[hreflang="ca"]')).toHaveAttribute('href', /\/ca\/transport\/$/);
  await expect(page.locator('link[hreflang="en"]')).toHaveAttribute('href', /\/en\/getting-there\/$/);
  await expect(page.locator('link[hreflang="tr"]')).toHaveAttribute('href', /\/tr\/ulasim\/$/);
});
