import type { Localized } from '@/i18n';
import type { IconName } from '@/components/icons';
import type { LocationId } from './locations';

/** Horarios del gran día. El orden es el que se muestra. */
export interface ScheduleItem {
  time: string;
  title: Localized;
  /** Nombre del lugar (no se traduce). */
  place?: string;
  address?: string[];
  text?: Localized;
  icon: IconName;
  /** Si se indica, la tarjeta muestra el botón de Google Maps de ese punto. */
  locationId?: LocationId;
}

export const schedule: ScheduleItem[] = [
  {
    time: '11:45',
    title: { es: 'Autobús', ca: 'Autobús', en: 'Bus' },
    text: {
      es: 'Salida desde Santander centro, zona Centro Botín.',
      ca: 'Sortida des de Santander centre, zona Centro Botín.',
      en: 'Departure from central Santander, by the Centro Botín.',
    },
    icon: 'bus',
    locationId: 'bus',
  },
  {
    time: '12:30',
    title: { es: 'Ceremonia', ca: 'Cerimònia', en: 'Ceremony' },
    place: 'Santuario de Nuestra Señora de Latas',
    address: ['Barrio Latas, 8', '39160 Loredo, Cantabria'],
    text: {
      es: 'La ceremonia será aproximadamente de 12:30 a 13:30.',
      ca: 'La cerimònia serà aproximadament de 12:30 a 13:30.',
      en: 'The ceremony will run roughly from 12:30 to 13:30.',
    },
    icon: 'chapel',
    locationId: 'ceremony',
  },
  {
    time: '14:00',
    title: { es: 'Cóctel', ca: 'Còctel', en: 'Drinks reception' },
    place: 'Huerta de Cubas',
    address: ['Barrio La Polvorosa', '39793 Cubas, Cantabria'],
    icon: 'cocktail',
    locationId: 'party',
  },
  {
    time: '16:30',
    title: { es: 'Comida', ca: 'Dinar', en: 'Lunch' },
    icon: 'cutlery',
  },
  {
    time: '18:30',
    title: { es: 'Baile, DJ y copitas', ca: 'Ball, DJ i copes', en: 'Dancing, DJ and drinks' },
    icon: 'vinyl',
  },
  {
    time: '00:00',
    title: { es: 'Autobús de vuelta', ca: 'Autobús de tornada', en: 'Bus back' },
    text: {
      es: 'Huerta de Cubas → Santander centro / Centro Botín.',
      ca: 'Huerta de Cubas → Santander centre / Centro Botín.',
      en: 'Huerta de Cubas → central Santander / Centro Botín.',
    },
    icon: 'bus',
  },
];
