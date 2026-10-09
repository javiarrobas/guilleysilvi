import type { Localized } from '@/i18n';
import { googleMapsSearchUrl } from '@/lib/url';

/**
 * Los tres puntos del día. Las coordenadas se usan para el mapa (Leaflet);
 * los botones "Abrir en Google Maps" buscan el lugar por nombre y dirección,
 * para que a los invitados les salga la ficha completa del sitio.
 */
export type LocationId = 'train' | 'airport' | 'bus' | 'ceremony' | 'party';

export interface Location {
  id: LocationId;
  /** Nombre propio del lugar (no se traduce). */
  name: string;
  /** Emoji del marcador en el mapa y en las tarjetas. */
  emoji: string;
  /** Etiqueta corta traducible: "Autobús", "Ceremonia", "Celebración". */
  short: Localized;
  /** Dirección postal, por líneas. */
  address: string[];
  lat: number;
  lng: number;
  /** Enlace del botón de Google Maps. */
  mapsUrl: string;
  /** Hora o franja que se muestra en la tarjeta. */
  time?: string;
  description?: Localized;
  /** Punto destacado (el autobús). */
  highlight?: boolean;
}

export const locations: Location[] = [
  {
    id: 'train',
    name: 'Estación de Santander',
    emoji: '🚆',
    short: { es: 'Tren', ca: 'Tren', en: 'Train', tr: 'Tren' },
    address: ['Plaza de las Estaciones, s/n', '39002 Santander'],
    lat: 43.4593,
    lng: -3.8098,
    mapsUrl: googleMapsSearchUrl('Estación de Santander, Plaza de las Estaciones, Santander'),
    description: {
      es: 'Trenes de Renfe desde Madrid y Alvia desde Alicante y Valencia, además de la estación de autobuses justo al lado. Del centro Botín la separan diez minutos andando.',
      ca: 'Trens de Renfe des de Madrid i Alvia des d’Alacant i València, a més de l’estació d’autobusos just al costat. Del Centro Botín la separen deu minuts a peu.',
      en: 'Renfe trains from Madrid and Alvia services from Alicante and Valencia, with the bus station right next door. A ten-minute walk from the Centro Botín.',
      tr: 'Madrid’den Renfe, Alicante ve Valencia’dan Alvia trenleri; otobüs terminali hemen yanında. Centro Botín’e on dakika yürüyüş.',
    },
  },
  {
    id: 'airport',
    name: 'Aeropuerto Seve Ballesteros',
    emoji: '✈️',
    short: { es: 'Aeropuerto', ca: 'Aeroport', en: 'Airport', tr: 'Havalimanı' },
    address: ['Carretera del Aeropuerto, s/n', '39600 Maliaño, Cantabria'],
    lat: 43.4269,
    lng: -3.8243,
    mapsUrl: googleMapsSearchUrl('Aeropuerto Seve Ballesteros-Santander'),
    description: {
      es: 'A 15 minutos en taxi del centro de Santander (unos 20 €) o en el autobús del aeropuerto, que para junto a la estación.',
      ca: 'A 15 minuts en taxi del centre de Santander (uns 20 €) o amb l’autobús de l’aeroport, que para al costat de l’estació.',
      en: 'Fifteen minutes by taxi to central Santander (about €20), or take the airport bus, which stops by the train station.',
      tr: 'Santander merkeze taksiyle 15 dakika (yaklaşık 20 €) ya da tren istasyonunun yanında duran havalimanı otobüsüyle.',
    },
  },
  {
    id: 'bus',
    name: 'Centro Botín',
    emoji: '🚌',
    short: { es: 'Autobús', ca: 'Autobús', en: 'Bus', tr: 'Otobüs' },
    address: ['Muelle de Albareda, s/n', '39004 Santander'],
    lat: 43.4602,
    lng: -3.8043,
    mapsUrl: googleMapsSearchUrl('Centro Botín, Muelle de Albareda, Santander'),
    time: '11:30 · 00:00',
    description: {
      es: 'Punto de salida y llegada de los autobuses, en Santander centro, junto a los Jardines de Pereda. Confirmaremos el punto exacto de parada más adelante.',
      ca: "Punt de sortida i arribada dels autobusos, a Santander centre, al costat dels Jardines de Pereda. Confirmarem el punt exacte de parada més endavant.",
      en: 'Departure and arrival point for the buses, in central Santander, next to the Jardines de Pereda. We will confirm the exact stop later on.',
      tr: "Otobüslerin kalkış ve varış noktası; Santander merkezde, Jardines de Pereda'nın yanında. Tam durak yerini ilerleyen günlerde netleştireceğiz.",
    },
    highlight: true,
  },
  {
    id: 'ceremony',
    name: 'Santuario de Nuestra Señora de Latas',
    emoji: '⛪',
    short: { es: 'Ceremonia', ca: 'Cerimònia', en: 'Ceremony', tr: 'Tören' },
    address: ['Barrio Latas, 8', '39160 Loredo, Cantabria'],
    lat: 43.4566,
    lng: -3.7233,
    mapsUrl: googleMapsSearchUrl('Santuario de Nuestra Señora de Latas, Barrio Latas 8, 39160 Loredo, Cantabria'),
    time: '12:30',
    description: {
      es: 'Un santuario del siglo XVII en lo alto de Loredo, entre Somo y la playa. La ceremonia durará aproximadamente una hora.',
      ca: 'Un santuari del segle XVII a dalt de Loredo, entre Somo i la platja. La cerimònia durarà aproximadament una hora.',
      en: 'A 17th-century sanctuary up in Loredo, between Somo and the beach. The ceremony will last about an hour.',
      tr: "Loredo'nun tepesinde, Somo ile plaj arasında 17. yüzyıldan kalma bir mabet. Tören yaklaşık bir saat sürecek.",
    },
  },
  {
    id: 'party',
    name: 'La Huerta de Cubas',
    emoji: '🥂',
    short: { es: 'Celebración', ca: 'Celebració', en: 'Celebration', tr: 'Kutlama' },
    address: ['Barrio La Polvorosa', '39793 Cubas, Cantabria'],
    lat: 43.4281,
    lng: -3.7040,
    mapsUrl: googleMapsSearchUrl('La Huerta de Cubas, Barrio La Polvorosa, 39793 Cubas, Cantabria'),
    time: '14:00',
    description: {
      es: 'Una finca ecológica con un invernadero de cristal y un bosque de camelias, a un cuarto de hora de Santander. Cóctel, comida y baile, todo aquí.',
      ca: "Una finca ecològica amb un hivernacle de vidre i un bosc de camèlies, a un quart d'hora de Santander. Còctel, dinar i ball, tot aquí.",
      en: 'An organic estate with a glass greenhouse and a camellia wood, a quarter of an hour from Santander. Drinks, lunch and dancing, all here.',
      tr: "Cam serası ve kamelya ormanı olan, Santander'a çeyrek saat mesafede organik bir çiftlik. Kokteyl, yemek ve dans, hepsi burada.",
    },
  },
];

export const busLocation = locations.find((loc) => loc.id === 'bus')!;

/** Los tres puntos del día (sin tren ni aeropuerto), para la portada y "El gran día". */
export const dayLocations = locations.filter((loc) => ['bus', 'ceremony', 'party'].includes(loc.id));

/** Página de Skyscanner "vuelos a Santander (SDR)", en el mercado del idioma. */
export function flightsUrl(locale: string): string {
  if (locale === 'es' || locale === 'ca') return 'https://www.skyscanner.es/vuelos-a/sdr/vuelos-baratos-a-santander-aeropuerto.html';
  return 'https://www.skyscanner.com/flights-to/sdr/cheap-flights-to-santander-airport.html';
}

/**
 * Zona recomendada para alojarse: un círculo alrededor del punto del autobús.
 * 1.100 m ≈ 15 minutos andando por el centro de Santander.
 */
export const stayZone = {
  lat: busLocation.lat,
  lng: busLocation.lng,
  radiusMeters: 1100,
  walkingMinutes: 15,
};
