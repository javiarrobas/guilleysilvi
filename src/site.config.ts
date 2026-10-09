/**
 * Configuración general de la web.
 * Todo lo que probablemente haya que tocar en los próximos meses está aquí.
 */
import type { Locale } from './i18n';

export const siteConfig = {
  /** Nombres tal y como aparecen en la portada. */
  couple: { first: 'Silvia', second: 'Guille' },

  /** Fecha y hora de la ceremonia (hora peninsular, CEST). Se usa para la cuenta atrás. */
  weddingDate: '2027-05-01T12:30:00+02:00',

  /** Fecha de la preboda (solo informativa). */
  prebodaDate: '2027-04-30',

  city: 'Santander',

  /**
   * Identificador de esta web en la plataforma Youwebit (proyecto Firebase
   * youwebit-platform). Las respuestas se guardan en sites/<siteId>/rsvps.
   */
  siteId: 'guilleysilvi',

  /**
   * Formulario de confirmación:
   *  - Por defecto es el formulario propio de la web, que guarda las respuestas en
   *    Firestore. Se activa cuando src/firebase.config.json tiene valores
   *    (`terraform output -json sites` en youwebit-platform).
   *  - Si se indica una URL aquí (p. ej. un Google Forms), el botón enlaza a ella.
   *  - Sin lo uno ni lo otro, la página muestra "Próximamente".
   */
  rsvpFormUrl: '',

  /**
   * Fecha límite para confirmar (texto libre, por idioma). Vacío = "Próximamente".
   * Ejemplo: { es: '31 de marzo de 2027', en: '31 March 2027', … }
   */
  rsvpDeadline: { es: '', ca: '', en: '', tr: '' } as Record<Locale, string>,

  /**
   * Idiomas publicados. Para activar (o desactivar) uno:
   *   1. Traduce lo que falte en src/i18n/<idioma>.ts y los campos de ese idioma en src/data/*.
   *   2. Crea las páginas en src/pages/<idioma>/ (ver README).
   *   3. Añade el código aquí → aparece en el selector de idioma.
   */
  enabledLocales: ['es', 'ca', 'en', 'tr'] as Locale[],

  /**
   * La web es privada (invitados): pedimos a los buscadores que no la indexen.
   * No afecta a las vistas previas de WhatsApp.
   */
  noindex: true,

  /** Imagen para las vistas previas al compartir (WhatsApp, etc.). Ruta dentro de /public. */
  ogImage: '/og.png',
};
