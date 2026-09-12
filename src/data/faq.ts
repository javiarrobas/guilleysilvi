import type { Localized } from '@/i18n';
import type { PageKey } from '@/i18n/routes';

/**
 * Preguntas frecuentes. Para añadir una, copia un bloque.
 *  - `soon: true` muestra la etiqueta "Próximamente" (y el texto genérico si no hay `answer`).
 *  - `links` añade enlaces a otras páginas de la web al final de la respuesta.
 */
export interface FaqItem {
  id: string;
  question: Localized;
  answer?: Localized;
  soon?: boolean;
  links?: { page: PageKey; label: Localized }[];
}

export const faq: FaqItem[] = [
  {
    id: 'autobuses',
    question: { es: '¿Habrá autobuses?', ca: 'Hi haurà autobusos?', en: 'Will there be buses?' },
    answer: {
      es: 'Sí. A las 11:45 saldrá un autobús desde Santander centro (zona Centro Botín) hacia la ceremonia, y después os llevará a la Huerta de Cubas. A las 00:00 habrá autobús de vuelta al mismo punto. En el formulario os preguntamos si los usaréis, para ajustar las plazas.',
      ca: "Sí. A les 11:45 sortirà un autobús des de Santander centre (zona Centro Botín) cap a la cerimònia, i després us portarà a la Huerta de Cubas. A les 00:00 hi haurà autobús de tornada al mateix punt. Al formulari us preguntem si els fareu servir, per ajustar les places.",
      en: 'Yes. At 11:45 a bus will leave central Santander (by the Centro Botín) for the ceremony, and afterwards it will take you on to the Huerta de Cubas. At 00:00 there will be a bus back to the same spot. In the form we ask whether you will use them, so we can book the right number of seats.',
    },
    links: [{ page: 'transport', label: { es: 'Ver transporte', ca: 'Veure transport', en: 'See transport' } }],
  },
  {
    id: 'alojarse',
    question: { es: '¿Dónde recomendamos alojarse?', ca: 'On recomanem allotjar-se?', en: 'Where do we recommend staying?' },
    answer: {
      es: 'En el centro de Santander, a distancia andando del punto de salida del autobús. En la sección de alojamiento hay un mapa con la zona que recomendamos e iremos añadiendo hoteles y apartamentos concretos.',
      ca: "Al centre de Santander, a distància a peu del punt de sortida de l'autobús. A la secció d'allotjament hi ha un mapa amb la zona que recomanem i hi anirem afegint hotels i apartaments concrets.",
      en: 'In central Santander, within walking distance of the bus departure point. The accommodation section has a map of the area we recommend, and we will be adding specific hotels and apartments.',
    },
    links: [{ page: 'stay', label: { es: 'Ver alojamiento', ca: 'Veure allotjament', en: 'See where to stay' } }],
  },
  {
    id: 'coche',
    question: { es: '¿Puedo ir directamente en coche?', ca: 'Puc anar-hi directament en cotxe?', en: 'Can I drive straight there?' },
    answer: {
      es: 'Sí. Tenéis las direcciones y los botones de Google Maps de cada lugar en la sección de transporte. Aun así, como habrá autobuses de ida y de vuelta, nuestra recomendación es alojarse en Santander y olvidarse del coche.',
      ca: "Sí. Teniu les adreces i els botons de Google Maps de cada lloc a la secció de transport. Tot i així, com que hi haurà autobusos d'anada i de tornada, la nostra recomanació és allotjar-se a Santander i oblidar-se del cotxe.",
      en: 'Yes. You will find the addresses and a Google Maps button for each venue in the transport section. Even so, since there will be buses both ways, our advice is to stay in Santander and forget about the car.',
    },
    links: [{ page: 'transport', label: { es: 'Ver ubicaciones', ca: 'Veure ubicacions', en: 'See the venues' } }],
  },
  {
    id: 'parking',
    question: { es: '¿Habrá parking?', ca: 'Hi haurà pàrquing?', en: 'Will there be parking?' },
    soon: true,
  },
  {
    id: 'alimentacion',
    question: {
      es: '¿Hay opciones vegetarianas o para intolerancias?',
      ca: 'Hi ha opcions vegetarianes o per a intoleràncies?',
      en: 'Are there vegetarian options or options for intolerances?',
    },
    answer: {
      es: 'Sí. Indícanoslo en el formulario de confirmación: hay un campo para alergias, intolerancias y necesidades alimentarias, también para acompañantes y niños.',
      ca: "Sí. Indica'ns-ho al formulari de confirmació: hi ha un camp per a al·lèrgies, intoleràncies i necessitats alimentàries, també per a acompanyants i nens.",
      en: 'Yes. Let us know in the RSVP form: there is a field for allergies, intolerances and dietary needs, for your guest and for children too.',
    },
    links: [{ page: 'rsvp', label: { es: 'Confirmar asistencia', ca: 'Confirmar assistència', en: 'RSVP' } }],
  },
  {
    id: 'acompanante',
    question: { es: '¿Puedo venir con acompañante?', ca: 'Puc venir amb acompanyant?', en: 'Can I bring a guest?' },
    answer: {
      es: 'En el formulario de confirmación podrás indicar si vienes acompañado/a y los datos de tu acompañante (nombre, apellidos y alergias o necesidades alimentarias).',
      ca: "Al formulari de confirmació podràs indicar si vens acompanyat/ada i les dades del teu acompanyant (nom, cognoms i al·lèrgies o necessitats alimentàries).",
      en: 'In the RSVP form you will be able to tell us whether you are bringing someone, along with their details (name, surname and any allergies or dietary needs).',
    },
  },
  {
    id: 'fecha-limite',
    question: {
      es: '¿Hasta cuándo puedo confirmar asistencia?',
      ca: 'Fins quan puc confirmar assistència?',
      en: 'How long do I have to RSVP?',
    },
    soon: true,
    answer: {
      es: 'Próximamente os diremos la fecha límite. Cuanto antes confirméis, mejor: nos ayuda a cerrar autobuses, menús y mesas.',
      ca: 'Properament us direm la data límit. Com abans confirmeu, millor: ens ajuda a tancar autobusos, menús i taules.',
      en: 'We will tell you the deadline soon. The sooner you confirm, the better: it helps us settle buses, menus and tables.',
    },
  },
  {
    id: 'preboda',
    question: { es: '¿Habrá preboda?', ca: 'Hi haurà preboda?', en: 'Will there be a pre-wedding get-together?' },
    answer: {
      es: 'Sí. El viernes 30 de abril haremos una pequeña preboda en Santander para todos los que ya estéis por allí. Pronto os contamos dónde, cuándo y cómo.',
      ca: "Sí. El divendres 30 d'abril farem una petita preboda a Santander per a tots els que ja hi sigueu. Aviat us expliquem on, quan i com.",
      en: 'Yes. On Friday 30 April we will have a small pre-wedding gathering in Santander for everyone who is already around. We will tell you where, when and how very soon.',
    },
    links: [{ page: 'preboda', label: { es: 'Ver la previa', ca: 'Veure la prèvia', en: 'See the warm-up' } }],
  },
  {
    id: 'vuelta-antes',
    question: {
      es: '¿Habrá autobuses de vuelta antes de las 00:00?',
      ca: 'Hi haurà autobusos de tornada abans de les 00:00?',
      en: 'Will there be buses back before 00:00?',
    },
    soon: true,
  },
  {
    id: 'dress-code',
    question: { es: '¿Cuál es el dress code?', ca: 'Quin és el dress code?', en: 'What is the dress code?' },
    soon: true,
  },
];
