import { test } from '@playwright/test';
import { mkdirSync } from 'node:fs';

/**
 * Capturas de todas las páginas (móvil y escritorio) para revisar el diseño.
 * Solo se ejecuta con SCREENSHOTS=1. Salida: tests/screenshots/ (o SCREENSHOT_DIR).
 */
const enabled = Boolean(process.env.SCREENSHOTS);
const dir = process.env.SCREENSHOT_DIR ?? 'tests/screenshots';

const routes: Record<string, string> = {
  home: '/',
  'el-gran-dia': '/el-gran-dia/',
  transporte: '/transporte/',
  alojamiento: '/alojamiento/',
  santander: '/santander/',
  preboda: '/preboda/',
  fotos: '/fotos/',
  preguntas: '/preguntas/',
  confirmar: '/confirmar/',
  'ca-home': '/ca/',
  'ca-santander': '/ca/santander/',
  'en-home': '/en/',
  'en-santander': '/en/santander/',
  'tr-home': '/tr/',
  'tr-santander': '/tr/santander/',
};

test.describe('capturas', () => {
  test.skip(!enabled, 'define SCREENSHOTS=1 para generar capturas');

  for (const [name, path] of Object.entries(routes)) {
    test(name, async ({ page }, info) => {
      mkdirSync(dir, { recursive: true });
      await page.goto(path);
      const map = page.locator('.venue-map');
      if (await map.count()) {
        await map.scrollIntoViewIfNeeded();
        await page.locator('.venue-map.is-ready').waitFor();
        await page.locator('.leaflet-tile-loaded').first().waitFor({ timeout: 15_000 }).catch(() => {});
        await page.waitForTimeout(800);
      }
      // Recorre la página para que carguen las imágenes con loading="lazy" y espera a todas.
      await page.evaluate(async () => {
        const step = window.innerHeight * 0.8;
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 120));
        }
        await Promise.all(
          Array.from(document.images).map((img) =>
            img.complete ? null : new Promise((r) => img.addEventListener('load', r, { once: true })),
          ),
        );
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(400);
      await page.screenshot({ path: `${dir}/${name}-${info.project.name}.png`, fullPage: true, animations: 'disabled' });
    });
  }

  test('menu-movil', async ({ page, isMobile }, info) => {
    test.skip(!isMobile);
    await page.goto('/');
    await page.locator('[data-menu-toggle]').click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${dir}/menu-${info.project.name}.png` });
  });
});
