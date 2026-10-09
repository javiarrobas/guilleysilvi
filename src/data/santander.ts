import type { ImageMetadata } from 'astro';
import type { Localized } from '@/i18n';
import { googleMapsSearchUrl } from '@/lib/url';

/**
 * "Nuestro Santander": los sitios de siempre de Silvia y Guille (octubre de 2026).
 * Foto + nombre + recomendación corta, sin bloques largos de texto.
 *
 * Fotos: originales en fotos/santander/ (fuera de git) → `npm run photos` las deja
 * optimizadas en src/assets/santander/ con los nombres de `images` (sin extensión).
 * Un sitio sin foto se muestra con su emoji en grande hasta que la haya.
 */
export interface Place {
  id: string;
  name: string;
  emoji: string;
  /** La recomendación, en una o dos frases. */
  comment: Localized;
  /** Nombres de fichero en src/assets/santander/ (sin extensión). La primera es la principal. */
  images: string[];
  /** Texto que se busca en Google Maps al pulsar "Ver en mapa". */
  mapsQuery: string;
  /** Sitio favorito de uno de los dos. */
  favouriteOf?: 'Guille' | 'Silvia';
}

export const places: Place[] = [
  {
    id: 'diluvio',
    name: 'El Diluvio',
    emoji: '🍳',
    comment: {
      es: 'Nuestro pincho de tortilla recomendado. El primero que pedimos al llegar a Santander.',
      ca: 'El nostre pintxo de truita recomanat. El primer que demanem en arribar a Santander.',
      en: 'Our recommended tortilla pincho. The first thing we order when we get to Santander.',
      tr: "Tavsiye ettiğimiz tortilla pinchosu. Santander'a varınca ilk sipariş ettiğimiz şey.",
    },
    images: [],
    mapsQuery: 'El Diluvio, Santander',
  },
  {
    id: 'riojano',
    name: 'El Riojano',
    emoji: '🦑',
    comment: {
      es: 'Para ir a comer unas buenas rabas.',
      ca: 'Per anar a menjar unes bones rabas.',
      en: 'The place for a good plate of rabas (fried squid).',
      tr: 'İyi bir rabas (kızarmış kalamar) için gidilecek yer.',
    },
    images: ['riojano-rabas'],
    mapsQuery: 'Bodega del Riojano, Santander',
  },
  {
    id: 'canadio',
    name: 'Cañadío',
    emoji: '🍳',
    comment: {
      es: 'Otra de las tortillas más famosas de Santander.',
      ca: 'Una altra de les truites més famoses de Santander.',
      en: "Another of Santander's most famous tortillas.",
      tr: "Santander'ın en ünlü tortillalarından bir diğeri.",
    },
    images: ['canadio-tortilla'],
    mapsQuery: 'Restaurante Cañadío, Santander',
  },
  {
    id: 'santona',
    name: 'Taberna Santoña',
    emoji: '🐟',
    comment: {
      es: 'Para comer anchoas. Las de verdad.',
      ca: 'Per menjar anxoves. Les de veritat.',
      en: 'For anchovies. The real ones.',
      tr: 'Hamsi için. Gerçek olanlarından.',
    },
    images: ['santona-anchoas'],
    mapsQuery: 'Taberna Santoña, Santander',
  },
  {
    id: 'conveniente',
    name: 'La Conveniente',
    emoji: '🍷',
    comment: {
      es: 'El sitio favorito de Guille: una bodega de siempre, vino, cecina y buen pan.',
      ca: 'El lloc preferit del Guille: un celler de tota la vida, vi, cecina i bon pa.',
      en: "Guille's favourite: an old-school bodega, wine, cecina and good bread.",
      tr: "Guille'nin favorisi: eski usul bir bodega, şarap, cecina ve iyi ekmek.",
    },
    images: ['conveniente-guille', 'conveniente-cecina'],
    mapsQuery: 'Bodega La Conveniente, Santander',
    favouriteOf: 'Guille',
  },
  {
    id: 'marucho',
    name: 'El Marucho',
    emoji: '🦀',
    comment: {
      es: 'El sitio favorito de Silvia: marisco en una taberna de barrio sin florituras.',
      ca: 'El lloc preferit de la Silvia: marisc en una taverna de barri sense floritures.',
      en: "Silvia's favourite: seafood in a no-frills neighbourhood tavern.",
      tr: "Silvia'nın favorisi: süssüz bir mahalle tavernasında deniz ürünleri.",
    },
    images: ['marucho-silvia'],
    mapsQuery: 'Marucho, Calle Tetuán, Santander',
    favouriteOf: 'Silvia',
  },
];

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/santander/*.{jpg,jpeg,png,webp}', { eager: true });
const byName = new Map(Object.entries(files).map(([path, mod]) => [path.split('/').pop()!.replace(/\.\w+$/, ''), mod.default]));

/** Imágenes de un sitio (las que existan en src/assets/santander/). */
export function placeImages(place: Place): ImageMetadata[] {
  return place.images.map((name) => byName.get(name)).filter((img): img is ImageMetadata => Boolean(img));
}

export function placeMapsUrl(place: Place): string {
  return googleMapsSearchUrl(place.mapsQuery);
}
