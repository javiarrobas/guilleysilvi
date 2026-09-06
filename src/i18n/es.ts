import type { PageKey } from './routes';

/**
 * Textos de la interfaz en castellano. Es el diccionario de referencia:
 * el catalán (ca.ts) debe tener exactamente las mismas claves.
 * Los contenidos largos (horarios, FAQ, guía, alojamientos) viven en src/data/*.
 */
export const es = {
  code: 'es',
  label: 'Castellano',
  meta: {
    siteName: 'Silvia & Guille',
    homeTitle: 'Silvia & Guille · 1 de mayo de 2027 · Santander',
    description:
      'Nos vamos al norte. Silvia y Guille se casan el 1 de mayo de 2027 en Santander. Horarios, transporte, alojamiento, nuestro Santander y confirmación de asistencia.',
  },
  common: {
    soon: 'Próximamente',
    openInMaps: 'Abrir en Google Maps',
    viewOnMap: 'Ver en mapa',
    viewAccommodation: 'Ver alojamiento',
    rsvp: 'Confirmar asistencia',
    skipToContent: 'Saltar al contenido',
    menu: 'Menú',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    close: 'Cerrar',
    language: 'Idioma',
    backHome: 'Volver al inicio',
    dateShort: '01.05.2027',
    dateDots: '01 · 05 · 2027',
    dateLong: 'Sábado, 1 de mayo de 2027',
    city: 'Santander',
    walking: '{n} min andando',
    approx: 'aprox.',
    perNight: 'la noche',
    newTab: '(se abre en una pestaña nueva)',
    previous: 'Anterior',
    next: 'Siguiente',
    photoOf: 'Foto {n} de {total}',
  },
  nav: {
    home: 'Inicio',
    day: 'El gran día',
    transport: 'Transporte',
    stay: 'Alojamiento',
    santander: 'Santander',
    preboda: 'Preboda',
    photos: 'Fotos',
    faq: 'Preguntas',
    rsvp: 'Confirmar asistencia',
  },
  hero: {
    eyebrow: '01 · 05 · 2027 — Santander',
    tagline: 'Nos vamos al norte. Y queremos celebrarlo con vosotros.',
    photoAlt: 'Silvia y Guille',
  },
  countdown: {
    label: 'Faltan',
    days: 'días',
    hours: 'horas',
    minutes: 'minutos',
    seconds: 'segundos',
    today: '¡Hoy es el día!',
    past: '¡Ya nos hemos casado! Gracias por acompañarnos.',
  },
  home: {
    essentialsEyebrow: 'Lo esencial',
    essentials: [
      { label: 'Ceremonia', title: 'Santuario de Nuestra Señora de Latas', detail: '12:30 · Loredo', page: 'day' as PageKey },
      { label: 'Celebración', title: 'Huerta de Cubas', detail: '14:00 · Cóctel, comida y baile', page: 'day' as PageKey },
      { label: 'Autobuses', title: 'Desde el Centro Botín, Santander', detail: '11:45 ida · 00:00 vuelta', page: 'transport' as PageKey },
    ],
    indexEyebrow: 'La web',
    indexTitle: 'Todo lo que necesitas saber',
    index: {
      day: 'Horarios y lugares del sábado.',
      transport: 'Autobuses, mapa y cómo llegar.',
      stay: 'Dónde dormir en Santander.',
      santander: 'Nuestro Santander: dónde desayunar, comer, tomar rabas y qué ver.',
      preboda: 'La previa del viernes.',
      photos: 'Nosotros dos, en imágenes.',
      faq: 'Dudas habituales, respondidas.',
      rsvp: 'Dinos si vienes. Solo te llevará dos minutos.',
    } as Record<Exclude<PageKey, 'home'>, string>,
    rsvpEyebrow: '¿Vienes?',
    rsvpTitle: 'Confirma tu asistencia',
    rsvpText:
      'Nos ayuda mucho saber cuántos seremos, quién usará el autobús y si hay alguna alergia o necesidad que debamos tener en cuenta.',
  },
  day: {
    eyebrow: 'El gran día',
    title: 'Sábado, 1 de mayo de 2027',
    lead:
      'Ceremonia en el Santuario de Latas y celebración en la Huerta de Cubas, a un cuarto de hora de Santander. Estos son los horarios previstos.',
    note: 'Los horarios pueden sufrir pequeños cambios. Confirmaremos toda la información definitiva cuando se acerque la boda.',
    mapCta: 'Ver ubicaciones y transporte',
  },
  transport: {
    eyebrow: 'Ubicaciones y transporte',
    title: 'Cómo llegar',
    lead:
      'Habrá autobuses desde Santander para ir a la ceremonia y posteriormente a la celebración, así que nuestra recomendación es alojarse en Santander y olvidarse del coche.',
    busEyebrow: 'Autobuses',
    busTitle: 'Ida y vuelta desde el centro',
    busOut: {
      time: '11:45',
      title: 'Salida hacia la ceremonia',
      text: 'Desde Santander centro, zona Centro Botín. Después de la ceremonia, el autobús os llevará a la Huerta de Cubas.',
    },
    busBack: {
      time: '00:00',
      title: 'Vuelta a Santander',
      text: 'Desde la Huerta de Cubas hasta el mismo punto: Santander centro / Centro Botín.',
    },
    busNote: 'En el formulario de confirmación os preguntamos si usaréis el autobús de ida y el de vuelta, para ajustar las plazas.',
    locationsEyebrow: 'Los tres puntos',
    locationsTitle: 'Dónde estaremos',
    mapLegendBus: 'Salida y llegada del autobús',
    mapLegendZone: 'Zona recomendada para alojarse (unos 15 min andando)',
    zoneTitle: 'Zona recomendada para alojarse',
    zoneText:
      'La zona sombreada del mapa está a unos 15 minutos andando del punto de salida del autobús. Cualquier hotel o apartamento dentro de ella os permitirá ir a pie.',
    byCarTitle: '¿Y si voy en coche?',
    byCarText:
      'Podéis ir directamente: los botones de cada ubicación abren Google Maps. Pero si os alojáis en Santander, el autobús es lo más cómodo, sobre todo a la vuelta.',
    mapLoading: 'Cargando mapa…',
  },
  stay: {
    eyebrow: 'Alojamiento',
    title: 'Dónde dormir',
    lead:
      'Iremos añadiendo aquí hoteles y apartamentos que nos gustan, todos a distancia andando del autobús. Mientras tanto, esta es la zona en la que tiene sentido buscar.',
    soonTitle: 'Estamos preparando la lista',
    soonText: 'Pronto encontraréis aquí nuestras recomendaciones, organizadas así:',
    groups: {
      near: 'Cerca del autobús',
      center: 'Centro de Santander',
      groups: 'Apartamentos para grupos',
      budget: 'Opciones económicas',
    },
    types: { hotel: 'Hotel', apartment: 'Apartamento' },
    ourComment: 'Nuestro comentario',
    zoneEyebrow: 'El mapa',
    zoneTitle: 'La zona que recomendamos',
    zoneText:
      'Todo lo que quede dentro del círculo está a unos 15 minutos andando del punto de salida del autobús, en el Centro Botín.',
    tipTitle: 'Un consejo',
    tipText: 'El 1 de mayo es festivo y fin de semana largo en Santander: reservad con tiempo.',
  },
  santander: {
    eyebrow: 'Nuestro Santander',
    title: 'Una guía muy personal',
    lead:
      'Para los que venís de fuera: nuestros sitios de siempre, las playas a las que vamos y algún plan por si os sobra un día. No es una guía turística; es nuestro Santander.',
    categoriesLabel: 'Categorías',
    emptyCategory: 'Todavía estamos decidiendo qué recomendaros aquí.',
    categories: {
      breakfast: 'Desayunar',
      lunch: 'Comer',
      rabas: 'Rabas y aperitivo',
      drinks: 'Tomar algo',
      nightlife: 'Salir',
      beaches: 'Playas',
      walks: 'Paseos',
      sights: 'Qué visitar',
      extraDay: 'Si tienes un día extra',
    },
  },
  preboda: {
    eyebrow: 'La previa',
    title: 'El viernes empezamos a calentar motores',
    text: [
      'Estamos preparando una pequeña preboda en Santander para todos los que ya estéis por allí.',
      'Próximamente os contamos dónde, cuándo y cómo.',
    ],
    formNote: 'En el formulario de confirmación podéis decirnos si contáis con venir a la preboda.',
    when: 'Viernes, 30 de abril de 2027',
    where: 'Santander · lugar por confirmar',
  },
  photos: {
    eyebrow: 'Fotos',
    title: 'Nosotros',
    lead: 'Algunas fotos nuestras. Pronto habrá más.',
    placeholderNote: 'Estamos eligiendo las fotos. Muy pronto aquí.',
  },
  rsvp: {
    eyebrow: 'Confirmar asistencia',
    title: '¿Contamos contigo?',
    lead:
      'Nos haría mucha ilusión que vinieras. Confirmar solo te llevará un par de minutos y nos ayuda a organizarlo todo: autobuses, menús y mesas.',
    deadlineLabel: 'Fecha límite',
    deadlineSoon: 'Próximamente os diremos la fecha límite. Cuanto antes confirméis, mejor.',
    button: 'Ir al formulario',
    buttonSoon: 'Formulario disponible próximamente',
    soonText: 'Estamos terminando el formulario. En cuanto esté listo, el botón se activará y os avisaremos.',
  },
  faq: {
    eyebrow: 'Preguntas frecuentes',
    title: 'Dudas habituales',
    lead: 'Iremos ampliando esta lista según nos vayáis preguntando.',
    soonAnswer: 'Próximamente. Actualizaremos esta respuesta en cuanto lo tengamos cerrado.',
  },
  notFound: {
    eyebrow: '404',
    title: 'Esta página se ha ido a la playa',
    text: 'No encontramos lo que buscabas. Prueba desde el inicio.',
  },
  footer: {
    tagline: 'Nos vamos al norte.',
    top: 'Volver arriba',
  },
};

export type Dictionary = typeof es;
