import { es, type Dictionary } from './es';
import { ca } from './ca';

export const locales = ['es', 'ca'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'es';

const dictionaries: Record<Locale, Dictionary> = { es, ca };

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

/** Normaliza el valor de Astro.currentLocale a un Locale conocido. */
export function getLocale(value: string | undefined): Locale {
  return isLocale(value) ? value : defaultLocale;
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/**
 * Campo de texto traducible en los ficheros de datos (src/data/*).
 * Se puede escribir como string (vale para todos los idiomas) o como
 * objeto { es: '...', ca: '...' }. Si falta un idioma, se usa el castellano.
 */
export type Localized = string | ({ es: string } & Partial<Record<Locale, string>>);

export function l(value: Localized | undefined, locale: Locale): string {
  if (value === undefined) return '';
  if (typeof value === 'string') return value;
  return value[locale] ?? value.es;
}

/** Sustituye {clave} por su valor: interpolate('{n} min', { n: 12 }) → '12 min'. */
export function interpolate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? `{${key}}`));
}
