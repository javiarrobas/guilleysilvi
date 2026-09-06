import type { Dictionary } from './es';

/**
 * Textos de la interfaz en catalán. Debe tener las mismas claves que es.ts
 * (TypeScript avisa si falta alguna). Se publica cuando 'ca' esté en
 * siteConfig.enabledLocales y existan las páginas en src/pages/ca/.
 */
export const ca: Dictionary = {
  code: 'ca',
  label: 'Català',
  meta: {
    siteName: 'Silvia & Guille',
    homeTitle: 'Silvia & Guille · 1 de maig de 2027 · Santander',
    description:
      "Ens n'anem al nord. La Silvia i el Guille es casen l'1 de maig de 2027 a Santander. Horaris, transport, allotjament, el nostre Santander i confirmació d'assistència.",
  },
  common: {
    soon: 'Properament',
    openInMaps: 'Obrir a Google Maps',
    viewOnMap: 'Veure al mapa',
    viewAccommodation: "Veure l'allotjament",
    rsvp: 'Confirmar assistència',
    skipToContent: 'Salta al contingut',
    menu: 'Menú',
    openMenu: 'Obrir el menú',
    closeMenu: 'Tancar el menú',
    close: 'Tancar',
    language: 'Idioma',
    backHome: "Tornar a l'inici",
    dateShort: '01.05.2027',
    dateDots: '01 · 05 · 2027',
    dateLong: 'Dissabte, 1 de maig de 2027',
    city: 'Santander',
    walking: '{n} min a peu',
    approx: 'aprox.',
    perNight: 'la nit',
    newTab: "(s'obre en una pestanya nova)",
    previous: 'Anterior',
    next: 'Següent',
    photoOf: 'Foto {n} de {total}',
  },
  nav: {
    home: 'Inici',
    day: 'El gran dia',
    transport: 'Transport',
    stay: 'Allotjament',
    santander: 'Santander',
    preboda: 'Preboda',
    photos: 'Fotos',
    faq: 'Preguntes',
    rsvp: 'Confirmar assistència',
  },
  hero: {
    eyebrow: '01 · 05 · 2027 — Santander',
    tagline: "Ens n'anem al nord. I volem celebrar-ho amb vosaltres.",
    photoAlt: 'La Silvia i el Guille',
  },
  countdown: {
    label: 'Falten',
    days: 'dies',
    hours: 'hores',
    minutes: 'minuts',
    seconds: 'segons',
    today: 'Avui és el dia!',
    past: 'Ja ens hem casat! Gràcies per acompanyar-nos.',
  },
  home: {
    essentialsEyebrow: "L'essencial",
    essentials: [
      { label: 'Cerimònia', title: 'Santuari de Nuestra Señora de Latas', detail: '12:30 · Loredo', page: 'day' },
      { label: 'Celebració', title: 'Huerta de Cubas', detail: '14:00 · Còctel, dinar i ball', page: 'day' },
      { label: 'Autobusos', title: 'Des del Centro Botín, Santander', detail: '11:45 anada · 00:00 tornada', page: 'transport' },
    ],
    indexEyebrow: 'La web',
    indexTitle: 'Tot el que necessites saber',
    index: {
      day: 'Horaris i llocs del dissabte.',
      transport: 'Autobusos, mapa i com arribar-hi.',
      stay: 'On dormir a Santander.',
      santander: 'El nostre Santander: on esmorzar, dinar, fer unes rabas i què veure.',
      preboda: 'La prèvia del divendres.',
      photos: 'Nosaltres dos, en imatges.',
      faq: 'Dubtes habituals, resolts.',
      rsvp: 'Digues-nos si vens. Només et prendrà dos minuts.',
    },
    rsvpEyebrow: 'Vens?',
    rsvpTitle: 'Confirma la teva assistència',
    rsvpText:
      "Ens ajuda molt saber quants serem, qui farà servir l'autobús i si hi ha cap al·lèrgia o necessitat que hàgim de tenir en compte.",
  },
  day: {
    eyebrow: 'El gran dia',
    title: 'Dissabte, 1 de maig de 2027',
    lead:
      "Cerimònia al Santuari de Latas i celebració a la Huerta de Cubas, a un quart d'hora de Santander. Aquests són els horaris previstos.",
    note: "Els horaris poden patir petits canvis. Confirmarem tota la informació definitiva quan s'acosti el casament.",
    mapCta: 'Veure ubicacions i transport',
  },
  transport: {
    eyebrow: 'Ubicacions i transport',
    title: 'Com arribar-hi',
    lead:
      "Hi haurà autobusos des de Santander per anar a la cerimònia i després a la celebració, així que la nostra recomanació és allotjar-se a Santander i oblidar-se del cotxe.",
    busEyebrow: 'Autobusos',
    busTitle: 'Anada i tornada des del centre',
    busOut: {
      time: '11:45',
      title: 'Sortida cap a la cerimònia',
      text: "Des de Santander centre, zona Centro Botín. Després de la cerimònia, l'autobús us portarà a la Huerta de Cubas.",
    },
    busBack: {
      time: '00:00',
      title: 'Tornada a Santander',
      text: 'Des de la Huerta de Cubas fins al mateix punt: Santander centre / Centro Botín.',
    },
    busNote: "Al formulari de confirmació us preguntem si fareu servir l'autobús d'anada i el de tornada, per ajustar les places.",
    locationsEyebrow: 'Els tres punts',
    locationsTitle: 'On serem',
    mapLegendBus: "Sortida i arribada de l'autobús",
    mapLegendZone: 'Zona recomanada per allotjar-se (uns 15 min a peu)',
    zoneTitle: 'Zona recomanada per allotjar-se',
    zoneText:
      "La zona ombrejada del mapa és a uns 15 minuts a peu del punt de sortida de l'autobús. Qualsevol hotel o apartament dins d'aquesta zona us permetrà anar-hi caminant.",
    byCarTitle: 'I si hi vaig en cotxe?',
    byCarText:
      "Podeu anar-hi directament: els botons de cada ubicació obren Google Maps. Però si us allotgeu a Santander, l'autobús és el més còmode, sobretot a la tornada.",
    mapLoading: 'Carregant el mapa…',
  },
  stay: {
    eyebrow: 'Allotjament',
    title: 'On dormir',
    lead:
      "Anirem afegint aquí hotels i apartaments que ens agraden, tots a distància a peu de l'autobús. Mentrestant, aquesta és la zona on té sentit buscar.",
    soonTitle: 'Estem preparant la llista',
    soonText: 'Aviat hi trobareu les nostres recomanacions, organitzades així:',
    groups: {
      near: "A prop de l'autobús",
      center: 'Centre de Santander',
      groups: 'Apartaments per a grups',
      budget: 'Opcions econòmiques',
    },
    types: { hotel: 'Hotel', apartment: 'Apartament' },
    ourComment: 'El nostre comentari',
    zoneEyebrow: 'El mapa',
    zoneTitle: 'La zona que recomanem',
    zoneText:
      "Tot el que quedi dins del cercle és a uns 15 minuts a peu del punt de sortida de l'autobús, al Centro Botín.",
    tipTitle: 'Un consell',
    tipText: "L'1 de maig és festiu i cap de setmana llarg a Santander: reserveu amb temps.",
  },
  santander: {
    eyebrow: 'El nostre Santander',
    title: 'Una guia molt personal',
    lead:
      'Per als que veniu de fora: els nostres llocs de sempre, les platges on anem i algun pla per si us sobra un dia. No és una guia turística; és el nostre Santander.',
    categoriesLabel: 'Categories',
    emptyCategory: 'Encara estem decidint què recomanar-vos aquí.',
    categories: {
      breakfast: 'Esmorzar',
      lunch: 'Dinar',
      rabas: 'Rabas i aperitiu',
      drinks: 'Fer un beure',
      nightlife: 'Sortir',
      beaches: 'Platges',
      walks: 'Passejades',
      sights: 'Què visitar',
      extraDay: 'Si tens un dia extra',
    },
  },
  preboda: {
    eyebrow: 'La prèvia',
    title: 'El divendres comencem a escalfar motors',
    text: [
      'Estem preparant una petita preboda a Santander per a tots els que ja hi sigueu.',
      'Properament us expliquem on, quan i com.',
    ],
    formNote: 'Al formulari de confirmació podeu dir-nos si compteu venir a la preboda.',
    when: "Divendres, 30 d'abril de 2027",
    where: 'Santander · lloc per confirmar',
  },
  photos: {
    eyebrow: 'Fotos',
    title: 'Nosaltres',
    lead: "Algunes fotos nostres. Aviat n'hi haurà més.",
    placeholderNote: 'Estem triant les fotos. Molt aviat aquí.',
  },
  rsvp: {
    eyebrow: 'Confirmar assistència',
    title: 'Comptem amb tu?',
    lead:
      "Ens faria molta il·lusió que vinguessis. Confirmar només et prendrà un parell de minuts i ens ajuda a organitzar-ho tot: autobusos, menús i taules.",
    deadlineLabel: 'Data límit',
    deadlineSoon: 'Properament us direm la data límit. Com abans confirmeu, millor.',
    button: 'Anar al formulari',
    buttonSoon: 'Formulari disponible properament',
    soonText: "Estem acabant el formulari. Tan bon punt estigui llest, el botó s'activarà i us avisarem.",
  },
  faq: {
    eyebrow: 'Preguntes freqüents',
    title: 'Dubtes habituals',
    lead: 'Anirem ampliant aquesta llista a mesura que ens aneu preguntant.',
    soonAnswer: 'Properament. Actualitzarem aquesta resposta tan bon punt ho tinguem tancat.',
  },
  notFound: {
    eyebrow: '404',
    title: "Aquesta pàgina se n'ha anat a la platja",
    text: "No trobem el que buscaves. Prova des de l'inici.",
  },
  footer: {
    tagline: "Ens n'anem al nord.",
    top: 'Tornar a dalt',
  },
};
