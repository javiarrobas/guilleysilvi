// @ts-check
import { defineConfig } from 'astro/config';

/**
 * Despliegue en Firebase Hosting (.github/workflows/deploy-firebase.yml).
 * SITE_URL es la URL pública (vistas previas, canonical); BASE_PATH solo se usaría si
 * la web viviera en una subcarpeta. En local no hace falta definir nada.
 */
const site = process.env.SITE_URL || 'https://guilleysilvi.web.app';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'ca', 'en', 'tr'],
    routing: { prefixDefaultLocale: false },
  },
  devToolbar: { enabled: false },
});
