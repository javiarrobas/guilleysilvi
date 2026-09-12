// @ts-check
import { defineConfig } from 'astro/config';

/**
 * Despliegue en GitHub Pages
 * --------------------------
 * El workflow (.github/workflows/deploy.yml) inyecta SITE_URL y BASE_PATH a
 * partir de la configuración de Pages del repositorio:
 *   - URL por defecto:  SITE_URL=https://javiarrobas.github.io  BASE_PATH=/guilleysilvi
 *   - Dominio propio:   SITE_URL=https://tudominio.com          BASE_PATH=""  → base "/"
 * En local no hace falta definir nada: la web se sirve en la raíz.
 */
const site = process.env.SITE_URL || 'https://javiarrobas.github.io';
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
