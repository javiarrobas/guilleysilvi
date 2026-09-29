import type { Locale } from './index';
import { withBase } from '../lib/url';

/** Páginas de la web. El orden es el del menú. */
export const pageKeys = [
  'home',
  'day',
  'transport',
  'stay',
  'santander',
  'preboda',
  'photos',
  'faq',
  'rsvp',
  'quiz',
  'ranking',
] as const;
export type PageKey = (typeof pageKeys)[number];

/** Páginas que aparecen en el menú principal (el resto se enlaza desde otros sitios). */
export const navKeys: PageKey[] = ['day', 'transport', 'stay', 'santander', 'preboda', 'photos', 'faq'];

/**
 * Rutas (slugs) por idioma. Las rutas de cada idioma solo funcionan cuando existan
 * los ficheros correspondientes en src/pages/<idioma>/.
 */
export const slugs: Record<Locale, Record<PageKey, string>> = {
  es: {
    home: '/',
    day: '/el-gran-dia/',
    transport: '/transporte/',
    stay: '/alojamiento/',
    santander: '/santander/',
    preboda: '/preboda/',
    photos: '/fotos/',
    faq: '/preguntas/',
    rsvp: '/confirmar/',
    quiz: '/juego/',
    ranking: '/ranking/',
  },
  ca: {
    home: '/ca/',
    day: '/ca/el-gran-dia/',
    transport: '/ca/transport/',
    stay: '/ca/allotjament/',
    santander: '/ca/santander/',
    preboda: '/ca/preboda/',
    photos: '/ca/fotos/',
    faq: '/ca/preguntes/',
    rsvp: '/ca/confirmar/',
    quiz: '/ca/joc/',
    ranking: '/ca/ranquing/',
  },
  en: {
    home: '/en/',
    day: '/en/the-big-day/',
    transport: '/en/getting-there/',
    stay: '/en/where-to-stay/',
    santander: '/en/santander/',
    preboda: '/en/pre-wedding/',
    photos: '/en/photos/',
    faq: '/en/faq/',
    rsvp: '/en/rsvp/',
    quiz: '/en/quiz/',
    ranking: '/en/ranking/',
  },
  // Sin caracteres propios del turco en las URL: se comparten por WhatsApp.
  tr: {
    home: '/tr/',
    day: '/tr/buyuk-gun/',
    transport: '/tr/ulasim/',
    stay: '/tr/konaklama/',
    santander: '/tr/santander/',
    preboda: '/tr/dugun-oncesi/',
    photos: '/tr/fotograflar/',
    faq: '/tr/sss/',
    rsvp: '/tr/katilim/',
    quiz: '/tr/oyun/',
    ranking: '/tr/siralama/',
  },
};

/** URL final (con el prefijo de GitHub Pages si hace falta) de una página en un idioma. */
export function href(locale: Locale, page: PageKey): string {
  return withBase(slugs[locale][page]);
}
