import { defineConfig, devices } from '@playwright/test';

/**
 * Pruebas end-to-end con Playwright.
 *   npm run test:e2e            → compila, sirve dist/ y prueba en móvil y escritorio
 *   SCREENSHOTS=1 npm run test:e2e → además guarda capturas en tests/screenshots/
 */
// Puerto distinto del de `npm run dev` (4321) para no reutilizar por error el servidor de desarrollo.
const PORT = 4173;

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
    locale: 'es-ES',
    timezoneId: 'Europe/Madrid',
  },
  webServer: {
    command: `npm run build && node scripts/serve.mjs dist ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    { name: 'móvil', use: { ...devices['Pixel 7'] } },
    { name: 'escritorio', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
  ],
});
