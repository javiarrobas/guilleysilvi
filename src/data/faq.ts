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
    question: { es: '¿Habrá autobuses?', ca: 'Hi haurà autobusos?', en: 'Will there be buses?', tr: 'Otobüs olacak mı?' },
    answer: {
      es: 'Sí. A las 11:30 salen los autobuses desde el Centro Botín hacia la misa y a las 13:30 siguen hasta La Huerta de Cubas. Al terminar la fiesta (00:00) os devuelven al mismo punto. En el formulario os preguntamos si los usaréis, para ajustar las plazas.',
      ca: "Sí. A les 11:30 surten els autobusos des del Centro Botín cap a la missa i a les 13:30 segueixen fins a La Huerta de Cubas. En acabar la festa (00:00) us tornen al mateix punt. Al formulari us preguntem si els fareu servir, per ajustar les places.",
      en: 'Yes. Buses leave the Centro Botín at 11:30 for the ceremony and continue to La Huerta de Cubas at 13:30. When the party ends (00:00) they bring you back to the same spot. The form asks whether you will use them, so we can size them.',
      tr: "Evet. Otobüsler 11:30'da Centro Botín'den törene kalkıyor ve 13:30'da La Huerta de Cubas'a devam ediyor. Parti bitince (00:00) sizi aynı noktaya geri getiriyor. Formda kullanıp kullanmayacağınızı soruyoruz; yerleri ayarlamak için.",
    },
    links: [{ page: 'transport', label: { es: 'Ver cómo llegar', ca: 'Veure com arribar-hi', en: 'See getting there', tr: 'Ulaşımı gör' } }],
  },
  {
    id: 'alojarse',
    question: { es: '¿Dónde recomendamos alojarse?', ca: 'On recomanem allotjar-se?', en: 'Where do we recommend staying?', tr: 'Nerede kalmanızı öneriyoruz?' },
    answer: {
      es: 'En el centro de Santander, a distancia andando del Centro Botín, de donde salen los autobuses. En la sección de alojamiento hay un mapa con la zona que recomendamos. ¿Dudas? Escribidnos por WhatsApp y os ayudamos a elegir.',
      ca: "Al centre de Santander, a distància a peu del Centro Botín, d'on surten els autobusos. A la secció d'allotjament hi ha un mapa amb la zona que recomanem. Dubtes? Escriviu-nos per WhatsApp i us ajudem a triar.",
      en: 'In central Santander, within walking distance of the Centro Botín, where the buses leave from. The accommodation page has a map of the area we recommend. Not sure? Message us on WhatsApp and we will help you choose.',
      tr: "Santander merkezde, otobüslerin kalktığı Centro Botín'e yürüme mesafesinde. Konaklama sayfasında önerdiğimiz bölgenin haritası var. Kararsız mısınız? WhatsApp'tan yazın, seçmenize yardım edelim.",
    },
    links: [{ page: 'stay', label: { es: 'Ver alojamiento', ca: 'Veure allotjament', en: 'See where to stay', tr: 'Konaklamayı gör' } }],
  },
  {
    id: 'coche',
    question: { es: '¿Puedo ir directamente en coche?', ca: 'Puc anar-hi directament en cotxe?', en: 'Can I drive straight there?', tr: 'Doğrudan arabayla gelebilir miyim?' },
    answer: {
      es: 'Sí. Tenéis las direcciones y los botones de Google Maps de cada lugar en la sección de transporte. Aun así, como habrá autobuses de ida y de vuelta, nuestra recomendación es alojarse en Santander y olvidarse del coche.',
      ca: "Sí. Teniu les adreces i els botons de Google Maps de cada lloc a la secció de transport. Tot i així, com que hi haurà autobusos d'anada i de tornada, la nostra recomanació és allotjar-se a Santander i oblidar-se del cotxe.",
      en: 'Yes. You will find the addresses and a Google Maps button for each venue in the transport section. Even so, since there will be buses both ways, our advice is to stay in Santander and forget about the car.',
      tr: "Evet. Her mekânın adresini ve Google Haritalar düğmesini ulaşım bölümünde bulabilirsiniz. Yine de gidiş ve dönüş otobüsleri olacağı için önerimiz Santander'da kalmanız ve arabayı unutmanız.",
    },
    links: [{ page: 'transport', label: { es: 'Ver ubicaciones', ca: 'Veure ubicacions', en: 'See the venues', tr: 'Mekânları gör' } }],
  },
  {
    id: 'parking',
    question: { es: '¿Habrá parking?', ca: 'Hi haurà pàrquing?', en: 'Will there be parking?', tr: 'Otopark olacak mı?' },
    soon: true,
  },
  {
    id: 'alimentacion',
    question: {
      es: '¿Hay opciones vegetarianas o para intolerancias?',
      ca: 'Hi ha opcions vegetarianes o per a intoleràncies?',
      en: 'Are there vegetarian options or options for intolerances?',
      tr: 'Vejetaryen ya da intoleranslar için seçenek var mı?',
    },
    answer: {
      es: 'Sí. Indícanoslo en el formulario de confirmación: hay un campo para alergias, intolerancias y necesidades alimentarias, también para acompañantes y niños.',
      ca: "Sí. Indica'ns-ho al formulari de confirmació: hi ha un camp per a al·lèrgies, intoleràncies i necessitats alimentàries, també per a acompanyants i nens.",
      en: 'Yes. Let us know in the RSVP form: there is a field for allergies, intolerances and dietary needs, for your guest and for children too.',
      tr: 'Evet. Katılım formunda bize bildirin: alerjiler, intoleranslar ve beslenme ihtiyaçları için bir alan var; refakatçiler ve çocuklar için de.',
    },
    links: [{ page: 'rsvp', label: { es: 'Confirmar asistencia', ca: 'Confirmar assistència', en: 'RSVP', tr: 'Katılımını bildir' } }],
  },
  {
    id: 'fecha-limite',
    question: {
      es: '¿Hasta cuándo puedo confirmar asistencia?',
      ca: 'Fins quan puc confirmar assistència?',
      en: 'How long do I have to RSVP?',
      tr: 'Katılımımı ne zamana kadar bildirebilirim?',
    },
    soon: true,
    answer: {
      es: 'Próximamente os diremos la fecha límite. Cuanto antes confirméis, mejor: nos ayuda a cerrar autobuses, menús y mesas.',
      ca: 'Properament us direm la data límit. Com abans confirmeu, millor: ens ajuda a tancar autobusos, menús i taules.',
      en: 'We will tell you the deadline soon. The sooner you confirm, the better: it helps us settle buses, menus and tables.',
      tr: 'Son tarihi yakında bildireceğiz. Ne kadar erken bildirirseniz o kadar iyi: otobüsleri, menüleri ve masaları kapatmamıza yardımcı oluyor.',
    },
  },
  {
    id: 'preboda',
    question: { es: '¿Habrá preboda?', ca: 'Hi haurà preboda?', en: 'Will there be a pre-wedding party?', tr: 'Düğün öncesi parti olacak mı?' },
    answer: {
      es: 'Sí: el viernes 30 de abril, una quedada informal en Santander para empezar el finde todos juntos. Estamos terminando de decidir el sitio y os lo confirmaremos muy pronto. 🍻',
      ca: "Sí: el divendres 30 d'abril, una trobada informal a Santander per començar el cap de setmana tots junts. Estem acabant de decidir el lloc i us ho confirmarem molt aviat. 🍻",
      en: 'Yes: on Friday 30 April, an informal get-together in Santander to start the weekend all together. We are finalising the venue and will confirm it very soon. 🍻',
      tr: "Evet: 30 Nisan Cuma, hafta sonuna hep birlikte başlamak için Santander'da gayriresmi bir buluşma. Yeri belirlemek üzereyiz ve çok yakında bildireceğiz. 🍻",
    },
    links: [{ page: 'preboda', label: { es: 'Ver la previa', ca: 'Veure la prèvia', en: 'See the pre-wedding', tr: 'Düğün öncesini gör' } }],
  },
  {
    id: 'vuelta-antes',
    question: {
      es: '¿Habrá autobuses de vuelta antes de las 00:00?',
      ca: 'Hi haurà autobusos de tornada abans de les 00:00?',
      en: 'Will there be buses back before 00:00?',
      tr: "00:00'dan önce dönüş otobüsü olacak mı?",
    },
    soon: true,
  },
  {
    id: 'dress-code',
    question: { es: '¿Cuál es el dress code?', ca: 'Quin és el dress code?', en: 'What is the dress code?', tr: 'Kıyafet kuralı nedir?' },
    answer: {
      es: 'Formal ✨ Chicos: traje y corbata. Chicas: vestido elegante. Todos iremos muy guapos, seguro. Importante: estamos en Santander y es mayo… puede refrescar un poquito, especialmente cuando caiga el sol. 🌊',
      ca: 'Formal ✨ Nois: vestit i corbata. Noies: vestit elegant. Tots anirem molt guapos, segur. Important: som a Santander i és maig… pot refrescar una mica, sobretot quan es pongui el sol. 🌊',
      en: "Formal ✨ Gents: suit and tie. Ladies: elegant dress. We'll all look great, no doubt. Important: this is Santander in May… it can get a little chilly, especially once the sun goes down. 🌊",
      tr: "Resmi ✨ Erkekler: takım elbise ve kravat. Kadınlar: şık elbise. Hepimiz çok şık olacağız, kesin. Önemli: Santander'dayız ve mayıs ayı… özellikle güneş battıktan sonra biraz serinleyebilir. 🌊",
    },
    links: [{ page: 'day', label: { es: 'Ver el gran día', ca: 'Veure el gran dia', en: 'See the big day', tr: 'Büyük günü gör' } }],
  },
];
