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
   * URL del formulario de Google Forms para confirmar asistencia.
   * Mientras esté vacía, el botón muestra "Próximamente".
   * Ejemplo: 'https://forms.gle/xxxxxxxx'
   */
  rsvpFormUrl: '',

  /**
   * Fecha límite para confirmar (texto libre, por idioma). Vacío = "Próximamente".
   * Ejemplo: { es: '31 de marzo de 2027', ca: '31 de març de 2027' }
   */
  rsvpDeadline: { es: '', ca: '' } as Record<Locale, string>,

  /**
   * Idiomas publicados. Para activar el catalán:
   *   1. Traduce lo que falte en src/i18n/ca.ts y los campos `ca` de src/data/*.
   *   2. Crea las páginas en src/pages/ca/ (ver README).
   *   3. Añade 'ca' aquí → aparece el selector de idioma.
   */
  enabledLocales: ['es'] as Locale[],

  /**
   * La web es privada (invitados): pedimos a los buscadores que no la indexen.
   * No afecta a las vistas previas de WhatsApp.
   */
  noindex: true,

  /** Imagen para las vistas previas al compartir (WhatsApp, etc.). Ruta dentro de /public. */
  ogImage: '/og.png',
};
