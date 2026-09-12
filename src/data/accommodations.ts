import type { ImageMetadata } from 'astro';
import type { Localized } from '@/i18n';

/**
 * Alojamientos recomendados. La lista está vacía hasta que Silvia y Guille
 * decidan cuáles incluir: mientras tanto la página muestra el mapa con la
 * zona recomendada y un aviso de "Próximamente".
 *
 * Para añadir uno, copia este ejemplo dentro del array:
 *
 *   {
 *     name: 'Hotel Ejemplo',
 *     type: 'hotel',                       // 'hotel' | 'apartment'
 *     group: 'near',                       // 'near' | 'center' | 'groups' | 'budget'
 *     zone: { es: 'Puertochico', ca: 'Puertochico', en: 'Puertochico', tr: 'Puertochico' },
 *     walkingMinutes: 8,                   // hasta el autobús (Centro Botín)
 *     price: { es: '120-150 €', ca: '120-150 €', en: '€120-150', tr: '120-150 €' },
 *     comment: {
 *       es: 'Nos gusta porque…',
 *       ca: 'Ens agrada perquè…',
 *       en: 'We like it because…',
 *       tr: 'Beğenmemizin sebebi…',
 *     },
 *     url: 'https://…',                    // botón "Ver alojamiento"
 *     // image: hotelEjemplo,              // import hotelEjemplo from '@/assets/alojamiento/hotel-ejemplo.jpg'
 *   },
 */
export type AccommodationType = 'hotel' | 'apartment';
export type AccommodationGroup = 'near' | 'center' | 'groups' | 'budget';

export interface Accommodation {
  name: string;
  type: AccommodationType;
  group: AccommodationGroup;
  zone: Localized;
  walkingMinutes: number;
  price: Localized;
  comment: Localized;
  url: string;
  image?: ImageMetadata;
}

/** Orden en que se muestran los grupos. */
export const accommodationGroups: AccommodationGroup[] = ['near', 'center', 'groups', 'budget'];

export const accommodations: Accommodation[] = [];
