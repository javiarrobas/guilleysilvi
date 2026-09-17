import { defineConfig, devices } from '@playwright/test';

/**
 * Pruebas end-to-end con Playwright.
 *   npm run test:e2e            → arranca el emulador de Firestore, compila, sirve dist/ y prueba en móvil y escritorio
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
  webServer: [
    {
      // Emulador de Firestore con las reglas reales (copia en tests/emulator).
      command: 'npx firebase-tools@15 emulators:start --only firestore --project demo-youwebit --config tests/emulator/firebase.json',
      url: 'http://127.0.0.1:8085/',
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
    },
    {
      // La web, compilada apuntando al emulador (sin App Check).
      command: `npm run build && node scripts/serve.mjs dist ${PORT}`,
      url: `http://localhost:${PORT}`,
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
      env: { PUBLIC_FIRESTORE_EMULATOR_HOST: '127.0.0.1:8085' },
    },
  ],
  projects: [
    { name: 'móvil', use: { ...devices['Pixel 7'] } },
    { name: 'escritorio', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
  ],
});
