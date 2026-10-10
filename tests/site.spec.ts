import { test, expect, type Page } from '@playwright/test';

const pages = [
  { path: '/', h1: /Silvia/ },
  { path: '/el-gran-dia/', h1: /1 de mayo de 2027/ },
  { path: '/transporte/', h1: /Cómo llegar/ },
  { path: '/alojamiento/', h1: /Dónde dormir/ },
  { path: '/santander/', h1: /Nuestros sitios de siempre/ },
  { path: '/preboda/', h1: /calentar motores/ },
  { path: '/fotos/', h1: /Nosotros/ },
  { path: '/preguntas/', h1: /Dudas habituales/ },
  { path: '/confirmar/', h1: /Contamos contigo/ },
  { path: '/juego/', h1: /Cuánto sabes/ },
  { path: '/ranking/', h1: /Quién los conoce mejor/ },
  { path: '/ca/joc/', h1: /Quant saps/, lang: 'ca' },
  { path: '/ca/ranquing/', h1: /Qui els coneix millor/, lang: 'ca' },
  { path: '/en/quiz/', h1: /How well do you know/, lang: 'en' },
  { path: '/en/ranking/', h1: /Who knows them best/, lang: 'en' },
  { path: '/tr/oyun/', h1: /ne kadar tanıyorsun/, lang: 'tr' },
  { path: '/tr/siralama/', h1: /en iyi kim/, lang: 'tr' },
  { path: '/ca/', h1: /Silvia/, lang: 'ca' },
  { path: '/ca/el-gran-dia/', h1: /1 de maig de 2027/, lang: 'ca' },
  { path: '/ca/transport/', h1: /Com arribar-hi/, lang: 'ca' },
  { path: '/ca/allotjament/', h1: /On dormir/, lang: 'ca' },
  { path: '/ca/santander/', h1: /Els nostres llocs de sempre/, lang: 'ca' },
  { path: '/ca/preboda/', h1: /escalfar motors/, lang: 'ca' },
  { path: '/ca/fotos/', h1: /Nosaltres/, lang: 'ca' },
  { path: '/ca/preguntes/', h1: /Dubtes habituals/, lang: 'ca' },
  { path: '/ca/confirmar/', h1: /Comptem amb tu/, lang: 'ca' },
  { path: '/en/', h1: /Silvia/, lang: 'en' },
  { path: '/en/the-big-day/', h1: /1 May 2027/, lang: 'en' },
  { path: '/en/getting-there/', h1: /How to get there/, lang: 'en' },
  { path: '/en/where-to-stay/', h1: /Where to sleep/, lang: 'en' },
  { path: '/en/santander/', h1: /Our usual places/, lang: 'en' },
  { path: '/en/pre-wedding/', h1: /warming up/, lang: 'en' },
  { path: '/en/photos/', h1: /Us/, lang: 'en' },
  { path: '/en/faq/', h1: /Common questions/, lang: 'en' },
  { path: '/en/rsvp/', h1: /count on you/, lang: 'en' },
  { path: '/tr/', h1: /Silvia/, lang: 'tr' },
  { path: '/tr/buyuk-gun/', h1: /1 Mayıs 2027/, lang: 'tr' },
  { path: '/tr/ulasim/', h1: /Nasıl gidilir/, lang: 'tr' },
  { path: '/tr/konaklama/', h1: /Nerede kalınır/, lang: 'tr' },
  { path: '/tr/santander/', h1: /Her zamanki yerlerimiz/, lang: 'tr' },
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

test('portada: nombres, fecha y foto en la primera pantalla; confirmar y juego justo debajo', async ({ page, isMobile }) => {
  await page.goto('/');
  const viewport = page.viewportSize()!;
  const names = await page.locator('.hero__names').boundingBox();
  const photo = await page.locator('.hero__media').boundingBox();
  expect(names!.y + names!.height).toBeLessThanOrEqual(viewport.height);
  // La foto empieza dentro de la primera pantalla
  expect(photo!.y).toBeLessThan(viewport.height);
  await expect(page.locator('.hero [data-compact-text]')).toHaveText(/Faltan \d+ días/);
  const rsvp = page.locator('.hero').getByRole('link', { name: 'Confirmar asistencia' });
  const quiz = page.locator('.hero').getByRole('link', { name: '¿Cuánto sabes de nosotros?' });
  if (isMobile) {
    // En móvil la foto va antes que los botones, y estos a menos de dos pantallas
    const rsvpBox = await rsvp.boundingBox();
    expect(rsvpBox!.y).toBeGreaterThan(photo!.y + photo!.height - 1);
    expect(rsvpBox!.y).toBeLessThan(viewport.height * 2);
  }
  await expect(quiz).toBeVisible();
  // Después del recorrido del día solo quedan el juego y confirmar
  await expect(page.locator('.essentials, .index')).toHaveCount(0);
  await expect(page.locator('.game')).toHaveCount(1);
  await expect(page.locator('.banner')).toHaveCount(1);
  await rsvp.click();
  await expect(page).toHaveURL(/\/confirmar\/$/);
});

test('cabecera: los cuatro idiomas abreviados, visibles en todas las pantallas', async ({ page }) => {
  await page.goto('/');
  const codes = page.locator('.site-header .lang--codes .lang__link');
  await expect(codes).toHaveCount(4);
  await expect(codes).toHaveText(['ES', 'CA', 'EN', 'TR']);
  for (const code of await codes.all()) await expect(code).toBeVisible();
  await expect(codes.nth(0)).toHaveAttribute('aria-current', 'true');
  await codes.nth(1).click();
  await expect(page).toHaveURL(/\/ca\/$/);
  await expect(page.locator('.site-header .lang--codes .lang__link[aria-current="true"]')).toHaveText('CA');
});

test('menú móvil: abre, lista las secciones y navega', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'solo en móvil');
  await page.goto('/');
  const toggle = page.locator('[data-menu-toggle]');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  const menu = page.locator('#site-menu');
  await expect(menu).toBeVisible();
  await expect(menu.locator('.site-menu__item')).toHaveCount(8);
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
  await expect(page.locator('.venue-marker')).toHaveCount(5); // tren, aeropuerto, bus, ceremonia, celebración
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
  await expect(page.getByText('Escribidnos por WhatsApp').first()).toBeVisible();
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

test('santander: collage con los seis sitios, fotos y enlaces al mapa', async ({ page }) => {
  await page.goto('/santander/');
  const cards = page.locator('.place');
  await expect(cards).toHaveCount(6);
  await expect(cards.locator('img')).toHaveCount(7); // seis sitios con foto, La Conveniente con dos
  await expect(page.locator('.place--none')).toHaveCount(0);
  for (const link of await page.locator('.place a[href^="https://www.google.com/maps/"]').all()) {
    await expect(link).toHaveAttribute('target', '_blank');
  }
});

test('confirmar: muestra el formulario propio (sin botón de "próximamente")', async ({ page }) => {
  // La web se compila apuntando al emulador, así que el formulario propio está activo.
  await page.goto('/confirmar/');
  await expect(page.locator('[data-rsvp-form]')).toBeVisible();
  await expect(page.locator('.rsvp__action')).toHaveCount(0);
});

test('banners: cada página lleva una foto de los novios con su punto de interés', async ({ page }) => {
  for (const path of ['/el-gran-dia/', '/transporte/', '/alojamiento/', '/santander/', '/preboda/', '/juego/', '/ranking/', '/preguntas/', '/confirmar/']) {
    await page.goto(path);
    const img = page.locator('figure.banner img');
    await expect(img, path).toHaveCount(1);
    await expect(img, path).toHaveAttribute('style', /object-position: center \d+%/);
  }
});

test('404 personalizada', async ({ page }) => {
  const response = await page.goto('/no-existe/');
  expect(response?.status()).toBe(404);
  await expect(page.locator('h1')).toContainText('playa');
});

test('idiomas: el selector lleva a la misma página en los otros idiomas', async ({ page }) => {
  await page.goto('/alojamiento/');
  // Los códigos de idioma están siempre a la vista en la cabecera (aria-label: nombre completo).
  await page.getByRole('link', { name: 'Català' }).first().click();
  await expect(page).toHaveURL(/\/ca\/allotjament\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'ca');
  await expect(page.locator('h1')).toContainText('On dormir');

  await page.getByRole('link', { name: 'English' }).first().click();
  await expect(page).toHaveURL(/\/en\/where-to-stay\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('h1')).toContainText('Where to sleep');

  await page.getByRole('link', { name: 'Türkçe' }).first().click();
  await expect(page).toHaveURL(/\/tr\/konaklama\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'tr');
  await expect(page.locator('h1')).toContainText('Nerede kalınır');

  await page.getByRole('link', { name: 'Castellano' }).first().click();
  await expect(page).toHaveURL(/\/alojamiento\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
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
