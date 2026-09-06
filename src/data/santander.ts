import type { ImageMetadata } from 'astro';
import type { Localized } from '@/i18n';
import type { IconName } from '@/components/icons';
import { googleMapsSearchUrl } from '@/lib/url';

/**
 * "Nuestro Santander": la guía personal para los invitados de fuera.
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ BORRADOR. Estas recomendaciones son de relleno para dar forma a la      │
 * │ sección: lugares conocidos de Santander con comentarios genéricos.      │
 * │ Silvia y Guille deben revisarlas, quitar lo que no sea suyo y escribir │
 * │ sus propios comentarios. Los campos `ca` son opcionales (si faltan, se │
 * │ muestra el castellano).                                                 │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Para añadir una foto: import foto from '@/assets/santander/nombre.jpg' y
 * añade `image: foto` a la recomendación.
 */
export type GuideCategory =
  | 'breakfast'
  | 'lunch'
  | 'rabas'
  | 'drinks'
  | 'nightlife'
  | 'beaches'
  | 'walks'
  | 'sights'
  | 'extraDay';

export const guideCategories: { id: GuideCategory; icon: IconName }[] = [
  { id: 'breakfast', icon: 'coffee' },
  { id: 'lunch', icon: 'cutlery' },
  { id: 'rabas', icon: 'rabas' },
  { id: 'drinks', icon: 'wine' },
  { id: 'nightlife', icon: 'moon' },
  { id: 'beaches', icon: 'beach' },
  { id: 'walks', icon: 'walk' },
  { id: 'sights', icon: 'lighthouse' },
  { id: 'extraDay', icon: 'mountains' },
];

export interface Recommendation {
  name: string;
  category: GuideCategory;
  /** Nuestro comentario personal. */
  comment: Localized;
  /** Dónde está, en una línea (barrio, calle…). */
  location: Localized;
  /** Texto que se busca en Google Maps al pulsar "Ver en mapa" (por defecto, `name` + Santander). */
  mapsQuery?: string;
  image?: ImageMetadata;
  imageAlt?: string;
}

export const recommendations: Recommendation[] = [
  // ── Desayunar ──────────────────────────────────────────────────────────
  {
    name: 'Terrazas del Paseo de Pereda',
    category: 'breakfast',
    comment: {
      es: 'Un café tranquilo con la bahía delante para empezar el día sin prisa. Cualquier terraza del paseo vale, y desde aquí el autobús está a dos pasos.',
      ca: "Un cafè tranquil amb la badia al davant per començar el dia sense pressa. Qualsevol terrassa del passeig val, i des d'aquí l'autobús és a dos passos.",
    },
    location: { es: 'Paseo de Pereda, frente a los Jardines', ca: 'Paseo de Pereda, davant dels Jardines' },
    mapsQuery: 'Paseo de Pereda, Santander',
  },

  // ── Comer ──────────────────────────────────────────────────────────────
  {
    name: 'Barrio Pesquero',
    category: 'lunch',
    comment: {
      es: 'Para comer pescado del día sin florituras: marisco, parrilla y raciones generosas en el barrio de los pescadores, a diez minutos del centro.',
      ca: 'Per menjar peix del dia sense floritures: marisc, graella i racions generoses al barri dels pescadors, a deu minuts del centre.',
    },
    location: { es: 'Barrio Pesquero, junto al puerto', ca: 'Barrio Pesquero, al costat del port' },
    mapsQuery: 'Barrio Pesquero, Santander',
  },
  {
    name: 'Puertochico',
    category: 'lunch',
    comment: {
      es: 'Restaurantes y terrazas frente a los barcos. Buena opción para una comida larga, con sobremesa y paseo después.',
      ca: 'Restaurants i terrasses davant dels vaixells. Bona opció per a un dinar llarg, amb sobretaula i passejada després.',
    },
    location: { es: 'Puertochico, al final del Paseo de Pereda', ca: 'Puertochico, al final del Paseo de Pereda' },
    mapsQuery: 'Puertochico, Santander',
  },

  // ── Rabas y aperitivo ──────────────────────────────────────────────────
  {
    name: 'El Machi',
    category: 'rabas',
    comment: {
      es: 'Un clásico de Santander desde hace más de un siglo: rabas y marisco a un paso del muelle. Siempre hay gente; siempre merece la pena.',
      ca: "Un clàssic de Santander des de fa més d'un segle: rabas i marisc a un pas del moll. Sempre hi ha gent; sempre val la pena.",
    },
    location: { es: 'Calle Calderón de la Barca, 9', ca: 'Carrer Calderón de la Barca, 9' },
    mapsQuery: 'El Machi, Calle Calderón de la Barca, Santander',
  },
  {
    name: 'Marucho',
    category: 'rabas',
    comment: {
      es: 'Para muchos, las mejores rabas de la ciudad. Pequeño, sencillo y lleno: id con paciencia y con hambre.',
      ca: 'Per a molts, les millors rabas de la ciutat. Petit, senzill i ple: aneu-hi amb paciència i amb gana.',
    },
    location: { es: 'Calle Tetuán, 21', ca: 'Carrer Tetuán, 21' },
    mapsQuery: 'Marucho, Calle Tetuán, Santander',
  },

  // ── Tomar algo ─────────────────────────────────────────────────────────
  {
    name: 'Bodega del Riojano',
    category: 'drinks',
    comment: {
      es: 'Una bodega histórica con las tapas de los toneles pintadas por artistas. Un vino aquí es casi obligatorio.',
      ca: 'Un celler històric amb les tapes de les bótes pintades per artistes. Un vi aquí és quasi obligatori.',
    },
    location: { es: 'Calle Río de la Pila, 5', ca: 'Carrer Río de la Pila, 5' },
    mapsQuery: 'Bodega del Riojano, Santander',
  },
  {
    name: 'Plaza de Cañadío',
    category: 'drinks',
    comment: {
      es: 'La plaza donde se junta todo Santander a tomar algo antes (y después) de cenar. Empezad aquí y dejaos llevar.',
      ca: 'La plaça on es troba tot Santander per fer un beure abans (i després) de sopar. Comenceu aquí i deixeu-vos portar.',
    },
    location: { es: 'Plaza de Cañadío', ca: 'Plaça de Cañadío' },
    mapsQuery: 'Plaza de Cañadío, Santander',
  },

  // ── Salir ──────────────────────────────────────────────────────────────
  {
    name: 'Calle del Sol y Río de la Pila',
    category: 'nightlife',
    comment: {
      es: 'Las calles de las copas y de las noches largas, a un paso de Cañadío. Bares para todos los gustos y la ciudad entera de camino.',
      ca: 'Els carrers de les copes i de les nits llargues, a un pas de Cañadío. Bars per a tots els gustos i la ciutat sencera de camí.',
    },
    location: { es: 'Entre Cañadío y Puertochico', ca: 'Entre Cañadío i Puertochico' },
    mapsQuery: 'Calle del Sol, Santander',
  },

  // ── Playas ─────────────────────────────────────────────────────────────
  {
    name: 'El Sardinero',
    category: 'beaches',
    comment: {
      es: 'La playa de siempre: casi dos kilómetros de arena, paseo y el Gran Casino de fondo. Perfecta para una mañana de domingo.',
      ca: 'La platja de sempre: quasi dos quilòmetres de sorra, passeig i el Gran Casino de fons. Perfecta per a un matí de diumenge.',
    },
    location: { es: 'El Sardinero, a 10 min en bus del centro', ca: 'El Sardinero, a 10 min en bus del centre' },
    mapsQuery: 'Playa del Sardinero, Santander',
  },
  {
    name: 'Mataleñas',
    category: 'beaches',
    comment: {
      es: 'Una cala pequeña y resguardada junto al faro de Cabo Mayor. Nuestra favorita cuando queremos tranquilidad.',
      ca: 'Una cala petita i arrecerada al costat del far de Cabo Mayor. La nostra preferida quan volem tranquil·litat.',
    },
    location: { es: 'Cabo Mayor, más allá del Sardinero', ca: 'Cabo Mayor, més enllà del Sardinero' },
    mapsQuery: 'Playa de Mataleñas, Santander',
  },
  {
    name: 'Somo y Loredo',
    category: 'beaches',
    comment: {
      es: 'Al otro lado de la bahía, a un paso del Santuario de Latas. Se llega en lancha desde el centro y es un plan redondo para el domingo.',
      ca: "A l'altra banda de la badia, a un pas del Santuari de Latas. S'hi arriba en llanxa des del centre i és un pla rodó per al diumenge.",
    },
    location: { es: 'Ribamontán al Mar, en lancha desde Santander', ca: 'Ribamontán al Mar, en llanxa des de Santander' },
    mapsQuery: 'Playa de Somo, Ribamontán al Mar',
  },
  {
    name: 'Los Peligros y Bikinis',
    category: 'beaches',
    comment: {
      es: 'Las playas de la bahía, al pie de la Magdalena: agua tranquila, vistas a Somo y un paseo precioso para llegar.',
      ca: 'Les platges de la badia, al peu de la Magdalena: aigua tranquil·la, vistes a Somo i una passejada preciosa per arribar-hi.',
    },
    location: { es: 'Bahía de Santander, junto a la Magdalena', ca: 'Badia de Santander, al costat de la Magdalena' },
    mapsQuery: 'Playa de los Peligros, Santander',
  },

  // ── Paseos ─────────────────────────────────────────────────────────────
  {
    name: 'Península de la Magdalena',
    category: 'walks',
    comment: {
      es: 'La vuelta al parque de la Magdalena, con el palacio, los pinos y las vistas a la bahía. Imprescindible, aunque solo tengáis una hora.',
      ca: 'La volta al parc de la Magdalena, amb el palau, els pins i les vistes a la badia. Imprescindible, encara que només tingueu una hora.',
    },
    location: { es: 'Parque de la Magdalena', ca: 'Parc de la Magdalena' },
    mapsQuery: 'Península de la Magdalena, Santander',
  },
  {
    name: 'Paseo de Pereda y Puertochico',
    category: 'walks',
    comment: {
      es: 'El paseo clásico por el frente marítimo: del Centro Botín a los barcos de Puertochico, siempre con la bahía al lado.',
      ca: 'El passeig clàssic pel front marítim: del Centro Botín als vaixells de Puertochico, sempre amb la badia al costat.',
    },
    location: { es: 'Santander centro', ca: 'Santander centre' },
    mapsQuery: 'Paseo de Pereda, Santander',
  },
  {
    name: 'Del Sardinero al faro de Cabo Mayor',
    category: 'walks',
    comment: {
      es: 'Por la senda costera desde la Segunda playa hasta el faro: acantilados, mar abierto y, si hay suerte, un atardecer de los buenos.',
      ca: 'Per la senda costanera des de la Segunda platja fins al far: penya-segats, mar oberta i, si hi ha sort, una posta de sol de les bones.',
    },
    location: { es: 'Senda costera, El Sardinero', ca: 'Senda costanera, El Sardinero' },
    mapsQuery: 'Faro de Cabo Mayor, Santander',
  },
  {
    name: 'Cruzar la bahía en lancha',
    category: 'walks',
    comment: {
      es: 'Las lanchas de Los Reginas salen del Palacete del Embarcadero hacia Pedreña y Somo. La mejor forma de ver Santander es desde el agua.',
      ca: "Les llanxes de Los Reginas surten del Palacete del Embarcadero cap a Pedreña i Somo. La millor manera de veure Santander és des de l'aigua.",
    },
    location: { es: 'Palacete del Embarcadero, Paseo de Pereda', ca: 'Palacete del Embarcadero, Paseo de Pereda' },
    mapsQuery: 'Palacete del Embarcadero, Santander',
  },

  // ── Qué visitar ────────────────────────────────────────────────────────
  {
    name: 'Centro Botín',
    category: 'sights',
    comment: {
      es: 'El edificio de Renzo Piano suspendido sobre la bahía. Aunque no entréis a las exposiciones, subid a las pasarelas: las vistas son gratis. Y de aquí salen los autobuses.',
      ca: "L'edifici de Renzo Piano suspès sobre la badia. Encara que no entreu a les exposicions, pugeu a les passarel·les: les vistes són gratis. I d'aquí surten els autobusos.",
    },
    location: { es: 'Muelle de Albareda, Jardines de Pereda', ca: 'Muelle de Albareda, Jardines de Pereda' },
    mapsQuery: 'Centro Botín, Santander',
  },
  {
    name: 'Palacio de la Magdalena',
    category: 'sights',
    comment: {
      es: 'Residencia de verano de Alfonso XIII y hoy el símbolo de la ciudad. El paseo hasta él ya vale la visita.',
      ca: "Residència d'estiu d'Alfons XIII i avui el símbol de la ciutat. El passeig fins a arribar-hi ja val la visita.",
    },
    location: { es: 'Península de la Magdalena', ca: 'Península de la Magdalena' },
    mapsQuery: 'Palacio de la Magdalena, Santander',
  },
  {
    name: 'Mercado de la Esperanza',
    category: 'sights',
    comment: {
      es: 'El mercado de abastos, detrás del Ayuntamiento: pescado, anchoas, quesos y sobaos. Ideal para llevarse un trozo de Cantabria a casa.',
      ca: "El mercat d'abastament, darrere de l'Ajuntament: peix, anxoves, formatges i sobaos. Ideal per endur-se un tros de Cantàbria a casa.",
    },
    location: { es: 'Plaza de la Esperanza, detrás del Ayuntamiento', ca: "Plaça de la Esperanza, darrere de l'Ajuntament" },
    mapsQuery: 'Mercado de la Esperanza, Santander',
  },

  // ── Si tienes un día extra ─────────────────────────────────────────────
  {
    name: 'Santillana del Mar y Comillas',
    category: 'extraDay',
    comment: {
      es: 'El pueblo medieval y el Capricho de Gaudí, a media hora en coche. Se ven los dos en un día con calma, y de paso las playas de Oyambre.',
      ca: "El poble medieval i el Capricho de Gaudí, a mitja hora en cotxe. Es veuen tots dos en un dia amb calma, i de passada les platges d'Oyambre.",
    },
    location: { es: 'A 30-40 min de Santander, hacia el oeste', ca: "A 30-40 min de Santander, cap a l'oest" },
    mapsQuery: 'Santillana del Mar, Cantabria',
  },
  {
    name: 'Picos de Europa',
    category: 'extraDay',
    comment: {
      es: 'Potes, el teleférico de Fuente Dé y el valle de Liébana. Es un día largo, pero se merece cada kilómetro.',
      ca: 'Potes, el telefèric de Fuente Dé i la vall de Liébana. És un dia llarg, però es mereix cada quilòmetre.',
    },
    location: { es: 'A 1 h 30 min de Santander', ca: 'A 1 h 30 min de Santander' },
    mapsQuery: 'Fuente Dé, Cantabria',
  },
  {
    name: 'San Vicente de la Barquera',
    category: 'extraDay',
    comment: {
      es: 'Pueblo marinero con la ría, el castillo y los Picos de fondo. Para comer pescado con vistas y volver despacio por la costa.',
      ca: 'Poble mariner amb la ria, el castell i els Picos de fons. Per menjar peix amb vistes i tornar a poc a poc per la costa.',
    },
    location: { es: 'A 50 min de Santander, hacia el oeste', ca: "A 50 min de Santander, cap a l'oest" },
    mapsQuery: 'San Vicente de la Barquera, Cantabria',
  },
  {
    name: 'Cabárceno',
    category: 'extraDay',
    comment: {
      es: 'Parque de la naturaleza a veinte minutos de Santander, con animales en semilibertad en una antigua mina. Si venís con niños, acierto seguro.',
      ca: 'Parc de la natura a vint minuts de Santander, amb animals en semillibertat en una antiga mina. Si veniu amb nens, encert segur.',
    },
    location: { es: 'Obregón, a 20 min de Santander', ca: 'Obregón, a 20 min de Santander' },
    mapsQuery: 'Parque de la Naturaleza de Cabárceno',
  },
];

export function recommendationMapsUrl(item: Recommendation): string {
  return googleMapsSearchUrl(item.mapsQuery ?? `${item.name}, Santander`);
}
