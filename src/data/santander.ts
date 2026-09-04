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
    },
    location: { es: 'Barrio Pesquero, junto al puerto', ca: 'Barrio Pesquero, al costat del port' },
    mapsQuery: 'Barrio Pesquero, Santander',
  },
  {
    name: 'Puertochico',
    category: 'lunch',
    comment: {
      es: 'Restaurantes y terrazas frente a los barcos. Buena opción para una comida larga, con sobremesa y paseo después.',
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
    },
    location: { es: 'Calle Calderón de la Barca, 9', ca: 'Carrer Calderón de la Barca, 9' },
    mapsQuery: 'El Machi, Calle Calderón de la Barca, Santander',
  },
  {
    name: 'Marucho',
    category: 'rabas',
    comment: {
      es: 'Para muchos, las mejores rabas de la ciudad. Pequeño, sencillo y lleno: id con paciencia y con hambre.',
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
    },
    location: { es: 'Calle Río de la Pila, 5', ca: 'Carrer Río de la Pila, 5' },
    mapsQuery: 'Bodega del Riojano, Santander',
  },
  {
    name: 'Plaza de Cañadío',
    category: 'drinks',
    comment: {
      es: 'La plaza donde se junta todo Santander a tomar algo antes (y después) de cenar. Empezad aquí y dejaos llevar.',
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
    },
    location: { es: 'Entre Cañadío y la Puertochico', ca: 'Entre Cañadío i Puertochico' },
    mapsQuery: 'Calle del Sol, Santander',
  },

  // ── Playas ─────────────────────────────────────────────────────────────
  {
    name: 'El Sardinero',
    category: 'beaches',
    comment: {
      es: 'La playa de siempre: casi dos kilómetros de arena, paseo y el Gran Casino de fondo. Perfecta para una mañana de domingo.',
    },
    location: { es: 'El Sardinero, a 10 min en bus del centro', ca: 'El Sardinero, a 10 min en bus del centre' },
    mapsQuery: 'Playa del Sardinero, Santander',
  },
  {
    name: 'Mataleñas',
    category: 'beaches',
    comment: {
      es: 'Una cala pequeña y resguardada junto al faro de Cabo Mayor. Nuestra favorita cuando queremos tranquilidad.',
    },
    location: { es: 'Cabo Mayor, más allá del Sardinero', ca: 'Cabo Mayor, més enllà del Sardinero' },
    mapsQuery: 'Playa de Mataleñas, Santander',
  },
  {
    name: 'Somo y Loredo',
    category: 'beaches',
    comment: {
      es: 'Al otro lado de la bahía, a un paso del Santuario de Latas. Se llega en lancha desde el centro y es un plan redondo para el domingo.',
    },
    location: { es: 'Ribamontán al Mar, en lancha desde Santander', ca: 'Ribamontán al Mar, en llanxa des de Santander' },
    mapsQuery: 'Playa de Somo, Ribamontán al Mar',
  },
  {
    name: 'Los Peligros y Bikinis',
    category: 'beaches',
    comment: {
      es: 'Las playas de la bahía, al pie de la Magdalena: agua tranquila, vistas a Somo y un paseo precioso para llegar.',
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
    },
    location: { es: 'Parque de la Magdalena', ca: 'Parc de la Magdalena' },
    mapsQuery: 'Península de la Magdalena, Santander',
  },
  {
    name: 'Paseo de Pereda y Puertochico',
    category: 'walks',
    comment: {
      es: 'El paseo clásico por el frente marítimo: del Centro Botín a los barcos de Puertochico, siempre con la bahía al lado.',
    },
    location: { es: 'Santander centro', ca: 'Santander centre' },
    mapsQuery: 'Paseo de Pereda, Santander',
  },
  {
    name: 'Del Sardinero al faro de Cabo Mayor',
    category: 'walks',
    comment: {
      es: 'Por la senda costera desde la Segunda playa hasta el faro: acantilados, mar abierto y, si hay suerte, un atardecer de los buenos.',
    },
    location: { es: 'Senda costera, El Sardinero', ca: 'Senda costanera, El Sardinero' },
    mapsQuery: 'Faro de Cabo Mayor, Santander',
  },
  {
    name: 'Cruzar la bahía en lancha',
    category: 'walks',
    comment: {
      es: 'Las lanchas de Los Reginas salen del Palacete del Embarcadero hacia Pedreña y Somo. La mejor forma de ver Santander es desde el agua.',
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
    },
    location: { es: 'Muelle de Albareda, Jardines de Pereda', ca: 'Muelle de Albareda, Jardines de Pereda' },
    mapsQuery: 'Centro Botín, Santander',
  },
  {
    name: 'Palacio de la Magdalena',
    category: 'sights',
    comment: {
      es: 'Residencia de verano de Alfonso XIII y hoy el símbolo de la ciudad. El paseo hasta él ya vale la visita.',
    },
    location: { es: 'Península de la Magdalena', ca: 'Península de la Magdalena' },
    mapsQuery: 'Palacio de la Magdalena, Santander',
  },
  {
    name: 'Mercado de la Esperanza',
    category: 'sights',
    comment: {
      es: 'El mercado de abastos, detrás del Ayuntamiento: pescado, anchoas, quesos y sobaos. Ideal para llevarse un trozo de Cantabria a casa.',
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
    },
    location: { es: 'A 30-40 min de Santander, hacia el oeste', ca: "A 30-40 min de Santander, cap a l'oest" },
    mapsQuery: 'Santillana del Mar, Cantabria',
  },
  {
    name: 'Picos de Europa',
    category: 'extraDay',
    comment: {
      es: 'Potes, el teleférico de Fuente Dé y el valle de Liébana. Es un día largo, pero se merece cada kilómetro.',
    },
    location: { es: 'A 1 h 30 min de Santander', ca: 'A 1 h 30 min de Santander' },
    mapsQuery: 'Fuente Dé, Cantabria',
  },
  {
    name: 'San Vicente de la Barquera',
    category: 'extraDay',
    comment: {
      es: 'Pueblo marinero con la ría, el castillo y los Picos de fondo. Para comer pescado con vistas y volver despacio por la costa.',
    },
    location: { es: 'A 50 min de Santander, hacia el oeste', ca: "A 50 min de Santander, cap a l'oest" },
    mapsQuery: 'San Vicente de la Barquera, Cantabria',
  },
  {
    name: 'Cabárceno',
    category: 'extraDay',
    comment: {
      es: 'Parque de la naturaleza a veinte minutos de Santander, con animales en semilibertad en una antigua mina. Si venís con niños, acierto seguro.',
    },
    location: { es: 'Obregón, a 20 min de Santander', ca: 'Obregón, a 20 min de Santander' },
    mapsQuery: 'Parque de la Naturaleza de Cabárceno',
  },
];

export function recommendationMapsUrl(item: Recommendation): string {
  return googleMapsSearchUrl(item.mapsQuery ?? `${item.name}, Santander`);
}
