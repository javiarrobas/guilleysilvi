import type { Dictionary } from './es';

/**
 * Textos de la interfaz en inglés. Debe tener las mismas claves que es.ts
 * (TypeScript avisa si falta alguna). Se publica cuando 'en' esté en
 * siteConfig.enabledLocales y existan las páginas en src/pages/en/.
 */
export const en: Dictionary = {
  code: 'en',
  label: 'English',
  meta: {
    siteName: 'Silvia & Guille',
    homeTitle: 'Silvia & Guille · 1 May 2027 · Santander',
    description:
      "We're heading north. Silvia and Guille are getting married on 1 May 2027 in Santander. Schedule, travel, where to stay, our Santander and RSVP.",
  },
  common: {
    soon: 'Coming soon',
    openInMaps: 'Open in Google Maps',
    viewOnMap: 'View on map',
    viewAccommodation: 'View accommodation',
    rsvp: 'RSVP',
    skipToContent: 'Skip to content',
    menu: 'Menu',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    close: 'Close',
    language: 'Language',
    backHome: 'Back to the home page',
    dateShort: '01.05.2027',
    dateDots: '01 · 05 · 2027',
    dateLong: 'Saturday, 1 May 2027',
    city: 'Santander',
    walking: '{n} min walk',
    approx: 'approx.',
    perNight: 'per night',
    newTab: '(opens in a new tab)',
    previous: 'Previous',
    next: 'Next',
    photoOf: 'Photo {n} of {total}',
  },
  nav: {
    home: 'Home',
    day: 'The big day',
    transport: 'Getting there',
    stay: 'Where to stay',
    santander: 'Santander',
    preboda: 'Pre-wedding',
    photos: 'Photos',
    faq: 'FAQ',
    rsvp: 'RSVP',
  },
  hero: {
    eyebrow: '01 · 05 · 2027 — Santander',
    tagline: "We're heading north. And we'd love to celebrate it with you.",
    photoAlt: 'Silvia and Guille',
  },
  countdown: {
    label: 'Counting down',
    days: 'days',
    hours: 'hours',
    minutes: 'minutes',
    seconds: 'seconds',
    today: "Today's the day!",
    past: "We're married! Thank you for celebrating with us.",
  },
  home: {
    essentialsEyebrow: 'The essentials',
    essentials: [
      { label: 'Ceremony', title: 'Santuario de Nuestra Señora de Latas', detail: '12:30 · Loredo', page: 'day' },
      { label: 'Celebration', title: 'Huerta de Cubas', detail: '14:00 · Drinks, lunch and dancing', page: 'day' },
      { label: 'Buses', title: 'From the Centro Botín, Santander', detail: '11:45 out · 00:00 back', page: 'transport' },
    ],
    indexEyebrow: 'The site',
    indexTitle: 'Everything you need to know',
    index: {
      day: "Saturday's timings and venues.",
      transport: 'Buses, map and how to get there.',
      stay: 'Where to sleep in Santander.',
      santander: 'Our Santander: where to have breakfast, lunch, rabas and what to see.',
      preboda: "Friday's warm-up.",
      photos: 'The two of us, in pictures.',
      faq: 'Common questions, answered.',
      rsvp: "Tell us if you're coming. It only takes two minutes.",
    },
    rsvpEyebrow: 'Coming?',
    rsvpTitle: 'Let us know you can make it',
    rsvpText:
      "It really helps us to know how many we'll be, who will use the bus and whether there is any allergy or dietary need we should take into account.",
  },
  day: {
    eyebrow: 'The big day',
    title: 'Saturday, 1 May 2027',
    lead:
      'Ceremony at the Santuario de Latas and celebration at the Huerta de Cubas, a quarter of an hour from Santander. These are the planned timings.',
    note: 'Timings may change slightly. We will confirm all the final details closer to the wedding.',
    mapCta: 'See venues and transport',
  },
  transport: {
    eyebrow: 'Venues and transport',
    title: 'How to get there',
    lead:
      'There will be buses from Santander to the ceremony and on to the celebration afterwards, so our advice is to stay in Santander and forget about the car.',
    busEyebrow: 'Buses',
    busTitle: 'There and back from the centre',
    busOut: {
      time: '11:45',
      title: 'Departure to the ceremony',
      text: 'From central Santander, by the Centro Botín. After the ceremony, the bus will take you on to the Huerta de Cubas.',
    },
    busBack: {
      time: '00:00',
      title: 'Back to Santander',
      text: 'From the Huerta de Cubas to the same spot: central Santander / Centro Botín.',
    },
    busNote: 'In the RSVP form we ask whether you will use the bus out and the bus back, so we can book the right number of seats.',
    locationsEyebrow: 'The three points',
    locationsTitle: 'Where we will be',
    mapLegendBus: 'Bus departure and arrival',
    mapLegendZone: 'Recommended area to stay (about a 15 min walk)',
    zoneTitle: 'Recommended area to stay',
    zoneText:
      'The shaded area on the map is about a 15-minute walk from the bus departure point. Any hotel or apartment inside it will let you walk there.',
    byCarTitle: 'What if I drive?',
    byCarText:
      'You can go straight there: the button on each venue opens Google Maps. But if you are staying in Santander, the bus is the easiest option, especially on the way back.',
    mapLoading: 'Loading map…',
  },
  stay: {
    eyebrow: 'Where to stay',
    title: 'Where to sleep',
    lead:
      'We will be adding hotels and apartments we like here, all within walking distance of the bus. In the meantime, this is the area where it makes sense to look.',
    soonTitle: 'We are putting the list together',
    soonText: 'Our recommendations will be here soon, organised like this:',
    groups: {
      near: 'Close to the bus',
      center: 'Central Santander',
      groups: 'Apartments for groups',
      budget: 'Budget options',
    },
    types: { hotel: 'Hotel', apartment: 'Apartment' },
    ourComment: 'Our comment',
    zoneEyebrow: 'The map',
    zoneTitle: 'The area we recommend',
    zoneText:
      'Everything inside the circle is about a 15-minute walk from the bus departure point, at the Centro Botín.',
    tipTitle: 'A tip',
    tipText: '1 May is a public holiday and a long weekend in Santander: book well in advance.',
  },
  santander: {
    eyebrow: 'Our Santander',
    title: 'A very personal guide',
    lead:
      'For those of you coming from further afield: our usual places, the beaches we go to and a plan or two in case you have a spare day. This is not a tourist guide; it is our Santander.',
    categoriesLabel: 'Categories',
    emptyCategory: 'We are still deciding what to recommend here.',
    categories: {
      breakfast: 'Breakfast',
      lunch: 'Lunch',
      rabas: 'Rabas and snacks',
      drinks: 'Drinks',
      nightlife: 'Going out',
      beaches: 'Beaches',
      walks: 'Walks',
      sights: 'What to visit',
      extraDay: 'If you have a spare day',
    },
  },
  preboda: {
    eyebrow: 'The warm-up',
    title: 'On Friday we start warming up',
    text: [
      'We are putting together a small pre-wedding get-together in Santander for everyone who is already around.',
      'We will tell you where, when and how very soon.',
    ],
    formNote: 'In the RSVP form you can tell us whether you plan to come to the pre-wedding.',
    when: 'Friday, 30 April 2027',
    where: 'Santander · venue to be confirmed',
  },
  photos: {
    eyebrow: 'Photos',
    title: 'Us',
    lead: 'A few photos of us. There will be more soon.',
    placeholderNote: 'We are choosing the photos. Very soon here.',
  },
  rsvp: {
    eyebrow: 'RSVP',
    title: 'Can we count on you?',
    lead:
      'We would love you to come. Confirming only takes a couple of minutes and helps us organise everything: buses, menus and tables.',
    deadlineLabel: 'Deadline',
    deadlineSoon: 'We will tell you the deadline soon. The sooner you confirm, the better.',
    button: 'Go to the form',
    buttonSoon: 'Form available soon',
    soonText: 'We are finishing the form. As soon as it is ready, the button will be enabled and we will let you know.',
  },
  faq: {
    eyebrow: 'Frequently asked questions',
    title: 'Common questions',
    lead: 'We will keep adding to this list as you ask us things.',
    soonAnswer: 'Coming soon. We will update this answer as soon as it is settled.',
  },
  notFound: {
    eyebrow: '404',
    title: 'This page has gone to the beach',
    text: 'We could not find what you were looking for. Try from the home page.',
  },
  footer: {
    tagline: "We're heading north.",
    top: 'Back to top',
  },
};
