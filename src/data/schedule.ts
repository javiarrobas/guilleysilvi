import type { Localized } from '@/i18n';
import type { IconName } from '@/components/icons';
import type { LocationId } from './locations';

/**
 * Horarios del gran día (versión de los novios, octubre de 2026). El orden es el
 * que se muestra. `time` puede ser una hora ("11:30") o un texto ("Después").
 */
export interface ScheduleItem {
  time: Localized;
  /** Emoji del hito: es lo que se ve en el marcador del recorrido. */
  emoji: string;
  /** Icono de línea, por si el emoji no se renderiza (p. ej. en el pie). */
  icon: IconName;
  title: Localized;
  /** Nombre del lugar (no se traduce). */
  place?: string;
  address?: string[];
  text?: Localized;
  /** Si se indica, la tarjeta muestra el botón de Google Maps de ese punto. */
  locationId?: LocationId;
}

export const schedule: ScheduleItem[] = [
  {
    time: '11:30',
    emoji: '🚌',
    icon: 'bus',
    title: {
      es: 'Salida de buses desde el Centro Botín',
      ca: 'Sortida dels busos des del Centro Botín',
      en: 'Buses leave from the Centro Botín',
      tr: 'Otobüsler Centro Botín’den kalkıyor',
    },
    text: {
      es: 'Cuidado con la preboda, que nos conocemos…',
      ca: 'Compte amb la preboda, que ens coneixem…',
      en: 'Go easy at the pre-wedding party. We know you…',
      tr: 'Düğün öncesi partide dikkat, sizi tanıyoruz…',
    },
    locationId: 'bus',
  },
  {
    time: '12:30',
    emoji: '⛪',
    icon: 'chapel',
    title: { es: 'Empieza la misa', ca: 'Comença la missa', en: 'The ceremony begins', tr: 'Tören başlıyor' },
    place: 'Santuario de Nuestra Señora de Latas',
    address: ['Barrio Latas, 8', '39160 Loredo, Cantabria'],
    locationId: 'ceremony',
  },
  {
    time: '13:30',
    emoji: '🚌',
    icon: 'bus',
    title: {
      es: 'Salida de buses hacia La Huerta de Cubas',
      ca: 'Sortida dels busos cap a La Huerta de Cubas',
      en: 'Buses leave for La Huerta de Cubas',
      tr: 'Otobüsler La Huerta de Cubas’a hareket ediyor',
    },
  },
  {
    time: '14:00',
    emoji: '🥂',
    icon: 'cocktail',
    title: { es: 'Empieza el cóctel', ca: 'Comença el còctel', en: 'The cocktail begins', tr: 'Kokteyl başlıyor' },
    place: 'La Huerta de Cubas',
    address: ['Barrio La Polvorosa', '39793 Cubas, Cantabria'],
    locationId: 'party',
  },
  {
    time: '16:00',
    emoji: '🍽️',
    icon: 'cutlery',
    title: { es: 'Empieza la comida', ca: 'Comença el dinar', en: 'Lunch is served', tr: 'Yemek başlıyor' },
  },
  {
    time: { es: 'Después', ca: 'Després', en: 'Then', tr: 'Sonra' },
    emoji: '💃🕺',
    icon: 'vinyl',
    title: { es: 'Baile, copas y fiesta', ca: 'Ball, copes i festa', en: 'Dancing, drinks and party', tr: 'Dans, içki ve parti' },
  },
  {
    time: '00:00',
    emoji: '🪩',
    icon: 'moon',
    title: {
      es: 'Fin de barra libre y fiesta',
      ca: 'Fi de barra lliure i festa',
      en: 'Open bar closes, party ends',
      tr: 'Açık bar kapanıyor, parti bitiyor',
    },
    text: {
      es: 'Los autobuses de vuelta a Santander salen al terminar.',
      ca: 'Els autobusos de tornada a Santander surten en acabar.',
      en: 'The buses back to Santander leave when it ends.',
      tr: 'Santander’a dönüş otobüsleri bitişte kalkıyor.',
    },
  },
];
