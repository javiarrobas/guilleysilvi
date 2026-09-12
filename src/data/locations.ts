import type { Localized } from '@/i18n';
import { googleMapsSearchUrl } from '@/lib/url';

/**
 * Los tres puntos del día. Las coordenadas se usan para el mapa (Leaflet);
 * los botones "Abrir en Google Maps" buscan el lugar por nombre y dirección,
 * para que a los invitados les salga la ficha completa del sitio.
 */
export type LocationId = 'bus' | 'ceremony' | 'party';

export interface Location {
  id: LocationId;
  /** Nombre propio del lugar (no se traduce). */
  name: string;
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
    id: 'bus',
    name: 'Centro Botín',
    short: { es: 'Autobús', ca: 'Autobús', en: 'Bus' },
    address: ['Muelle de Albareda, s/n', '39004 Santander'],
    lat: 43.4602,
    lng: -3.8043,
    mapsUrl: googleMapsSearchUrl('Centro Botín, Muelle de Albareda, Santander'),
    time: '11:45 · 00:00',
    description: {
      es: 'Punto de salida y llegada de los autobuses, en Santander centro, junto a los Jardines de Pereda. Confirmaremos el punto exacto de parada más adelante.',
      ca: "Punt de sortida i arribada dels autobusos, a Santander centre, al costat dels Jardines de Pereda. Confirmarem el punt exacte de parada més endavant.",
      en: 'Departure and arrival point for the buses, in central Santander, next to the Jardines de Pereda. We will confirm the exact stop later on.',
    },
    highlight: true,
  },
  {
    id: 'ceremony',
    name: 'Santuario de Nuestra Señora de Latas',
    short: { es: 'Ceremonia', ca: 'Cerimònia', en: 'Ceremony' },
    address: ['Barrio Latas, 8', '39160 Loredo, Cantabria'],
    lat: 43.4566,
    lng: -3.7233,
    mapsUrl: googleMapsSearchUrl('Santuario de Nuestra Señora de Latas, Barrio Latas 8, 39160 Loredo, Cantabria'),
    time: '12:30',
    description: {
      es: 'Un santuario del siglo XVII en lo alto de Loredo, entre Somo y la playa. La ceremonia durará aproximadamente una hora.',
      ca: 'Un santuari del segle XVII a dalt de Loredo, entre Somo i la platja. La cerimònia durarà aproximadament una hora.',
      en: 'A 17th-century sanctuary up in Loredo, between Somo and the beach. The ceremony will last about an hour.',
    },
  },
  {
    id: 'party',
    name: 'Huerta de Cubas',
    short: { es: 'Celebración', ca: 'Celebració', en: 'Celebration' },
    address: ['Barrio La Polvorosa', '39793 Cubas, Cantabria'],
    lat: 43.4281,
    lng: -3.7040,
    mapsUrl: googleMapsSearchUrl('La Huerta de Cubas, Barrio La Polvorosa, 39793 Cubas, Cantabria'),
    time: '14:00',
    description: {
      es: 'Una finca ecológica con un invernadero de cristal y un bosque de camelias, a un cuarto de hora de Santander. Cóctel, comida y baile, todo aquí.',
      ca: "Una finca ecològica amb un hivernacle de vidre i un bosc de camèlies, a un quart d'hora de Santander. Còctel, dinar i ball, tot aquí.",
      en: 'An organic estate with a glass greenhouse and a camellia wood, a quarter of an hour from Santander. Drinks, lunch and dancing, all here.',
    },
  },
];

export const busLocation = locations.find((loc) => loc.id === 'bus')!;

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
