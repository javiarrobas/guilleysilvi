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
 * │ Silvia y Guille deben revisarlas, quitar lo que no sea suyo y escribir  │
 * │ sus propios comentarios. Los campos `ca` y `en` son opcionales: si      │
 * │ faltan, se muestra el castellano.                                       │
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
      en: 'A quiet coffee with the bay in front of you, to start the day without rushing. Any terrace along the promenade will do, and from here the bus is two steps away.',
      tr: 'Güne acele etmeden başlamak için körfez manzaralı sakin bir kahve. Sahil yolundaki her teras iş görür ve buradan otobüs iki adım ötede.',
    },
    location: { es: 'Paseo de Pereda, frente a los Jardines', ca: 'Paseo de Pereda, davant dels Jardines', en: 'Paseo de Pereda, opposite the Jardines', tr: 'Paseo de Pereda, Jardines karşısı' },
    mapsQuery: 'Paseo de Pereda, Santander',
  },

  // ── Comer ──────────────────────────────────────────────────────────────
  {
    name: 'Barrio Pesquero',
    category: 'lunch',
    comment: {
      es: 'Para comer pescado del día sin florituras: marisco, parrilla y raciones generosas en el barrio de los pescadores, a diez minutos del centro.',
      ca: 'Per menjar peix del dia sense floritures: marisc, graella i racions generoses al barri dels pescadors, a deu minuts del centre.',
      en: "For fish straight off the boat, no frills: seafood, grilled dishes and generous portions in the fishermen's quarter, ten minutes from the centre.",
      tr: 'Günün balığını sade haliyle yemek için: deniz ürünleri, ızgara ve bol porsiyonlar; merkeze on dakika mesafedeki balıkçı mahallesinde.',
    },
    location: { es: 'Barrio Pesquero, junto al puerto', ca: 'Barrio Pesquero, al costat del port', en: 'Barrio Pesquero, next to the port', tr: 'Barrio Pesquero, limanın yanında' },
    mapsQuery: 'Barrio Pesquero, Santander',
  },
  {
    name: 'Puertochico',
    category: 'lunch',
    comment: {
      es: 'Restaurantes y terrazas frente a los barcos. Buena opción para una comida larga, con sobremesa y paseo después.',
      ca: 'Restaurants i terrasses davant dels vaixells. Bona opció per a un dinar llarg, amb sobretaula i passejada després.',
      en: 'Restaurants and terraces facing the boats. A good choice for a long lunch, with time to linger and a walk afterwards.',
      tr: 'Teknelerin karşısında restoranlar ve teraslar. Uzun bir yemek, ardından sohbet ve yürüyüş için iyi bir seçenek.',
    },
    location: { es: 'Puertochico, al final del Paseo de Pereda', ca: 'Puertochico, al final del Paseo de Pereda', en: 'Puertochico, at the end of the Paseo de Pereda', tr: "Puertochico, Paseo de Pereda'nın sonunda" },
    mapsQuery: 'Puertochico, Santander',
  },

  // ── Rabas y aperitivo ──────────────────────────────────────────────────
  {
    name: 'El Machi',
    category: 'rabas',
    comment: {
      es: 'Un clásico de Santander desde hace más de un siglo: rabas y marisco a un paso del muelle. Siempre hay gente; siempre merece la pena.',
      ca: "Un clàssic de Santander des de fa més d'un segle: rabas i marisc a un pas del moll. Sempre hi ha gent; sempre val la pena.",
      en: 'A Santander classic for more than a century: rabas (fried squid) and seafood a step from the quay. It is always busy; it is always worth it.',
      tr: 'Yüz yılı aşkın süredir bir Santander klasiği: rıhtımdan bir adım ötede rabas (kızarmış kalamar) ve deniz ürünleri. Hep kalabalıktır; hep değer.',
    },
    location: { es: 'Calle Calderón de la Barca, 9', ca: 'Carrer Calderón de la Barca, 9', en: 'Calle Calderón de la Barca, 9', tr: 'Calle Calderón de la Barca, 9' },
    mapsQuery: 'El Machi, Calle Calderón de la Barca, Santander',
  },
  {
    name: 'Marucho',
    category: 'rabas',
    comment: {
      es: 'Para muchos, las mejores rabas de la ciudad. Pequeño, sencillo y lleno: id con paciencia y con hambre.',
      ca: 'Per a molts, les millors rabas de la ciutat. Petit, senzill i ple: aneu-hi amb paciència i amb gana.',
      en: 'For many, the best rabas in the city. Small, simple and packed: go with patience and an appetite.',
      tr: 'Çoğu kişiye göre şehrin en iyi rabası. Küçük, sade ve hep dolu: sabırla ve aç karnına gidin.',
    },
    location: { es: 'Calle Tetuán, 21', ca: 'Carrer Tetuán, 21', en: 'Calle Tetuán, 21', tr: 'Calle Tetuán, 21' },
    mapsQuery: 'Marucho, Calle Tetuán, Santander',
  },

  // ── Tomar algo ─────────────────────────────────────────────────────────
  {
    name: 'Bodega del Riojano',
    category: 'drinks',
    comment: {
      es: 'Una bodega histórica con las tapas de los toneles pintadas por artistas. Un vino aquí es casi obligatorio.',
      ca: 'Un celler històric amb les tapes de les bótes pintades per artistes. Un vi aquí és quasi obligatori.',
      en: 'A historic wine cellar where the barrel ends are painted by artists. A glass of wine here is almost compulsory.',
      tr: 'Fıçı kapakları sanatçılar tarafından boyanmış tarihi bir şarap mahzeni. Burada bir kadeh şarap neredeyse zorunlu.',
    },
    location: { es: 'Calle Río de la Pila, 5', ca: 'Carrer Río de la Pila, 5', en: 'Calle Río de la Pila, 5', tr: 'Calle Río de la Pila, 5' },
    mapsQuery: 'Bodega del Riojano, Santander',
  },
  {
    name: 'Plaza de Cañadío',
    category: 'drinks',
    comment: {
      es: 'La plaza donde se junta todo Santander a tomar algo antes (y después) de cenar. Empezad aquí y dejaos llevar.',
      ca: 'La plaça on es troba tot Santander per fer un beure abans (i després) de sopar. Comenceu aquí i deixeu-vos portar.',
      en: 'The square where the whole of Santander meets for a drink before (and after) dinner. Start here and let the evening take you.',
      tr: "Bütün Santander'ın yemekten önce (ve sonra) bir şeyler içmek için toplandığı meydan. Buradan başlayın, gerisi kendiliğinden gelsin.",
    },
    location: { es: 'Plaza de Cañadío', ca: 'Plaça de Cañadío', en: 'Plaza de Cañadío', tr: 'Plaza de Cañadío' },
    mapsQuery: 'Plaza de Cañadío, Santander',
  },

  // ── Salir ──────────────────────────────────────────────────────────────
  {
    name: 'Calle del Sol y Río de la Pila',
    category: 'nightlife',
    comment: {
      es: 'Las calles de las copas y de las noches largas, a un paso de Cañadío. Bares para todos los gustos y la ciudad entera de camino.',
      ca: 'Els carrers de les copes i de les nits llargues, a un pas de Cañadío. Bars per a tots els gustos i la ciutat sencera de camí.',
      en: 'The streets of late drinks and long nights, a step from Cañadío. Bars for every taste and the whole city on the way.',
      tr: "Cañadío'dan bir adım ötede, uzun gecelerin ve kadeh sokaklarının olduğu yer. Her zevke göre bar ve yol boyunca bütün şehir.",
    },
    location: { es: 'Entre Cañadío y Puertochico', ca: 'Entre Cañadío i Puertochico', en: 'Between Cañadío and Puertochico', tr: 'Cañadío ile Puertochico arasında' },
    mapsQuery: 'Calle del Sol, Santander',
  },

  // ── Playas ─────────────────────────────────────────────────────────────
  {
    name: 'El Sardinero',
    category: 'beaches',
    comment: {
      es: 'La playa de siempre: casi dos kilómetros de arena, paseo y el Gran Casino de fondo. Perfecta para una mañana de domingo.',
      ca: 'La platja de sempre: quasi dos quilòmetres de sorra, passeig i el Gran Casino de fons. Perfecta per a un matí de diumenge.',
      en: 'The classic beach: almost two kilometres of sand, a promenade and the Gran Casino behind. Perfect for a Sunday morning.',
      tr: 'Her zamanki plaj: neredeyse iki kilometre kum, sahil yolu ve arkada Gran Casino. Pazar sabahı için mükemmel.',
    },
    location: { es: 'El Sardinero, a 10 min en bus del centro', ca: 'El Sardinero, a 10 min en bus del centre', en: 'El Sardinero, 10 min by bus from the centre', tr: 'El Sardinero, merkeze otobüsle 10 dk' },
    mapsQuery: 'Playa del Sardinero, Santander',
  },
  {
    name: 'Mataleñas',
    category: 'beaches',
    comment: {
      es: 'Una cala pequeña y resguardada junto al faro de Cabo Mayor. Nuestra favorita cuando queremos tranquilidad.',
      ca: 'Una cala petita i arrecerada al costat del far de Cabo Mayor. La nostra preferida quan volem tranquil·litat.',
      en: 'A small, sheltered cove next to the Cabo Mayor lighthouse. Our favourite when we want somewhere quiet.',
      tr: 'Cabo Mayor deniz fenerinin yanında küçük ve korunaklı bir koy. Sessizlik istediğimizde en sevdiğimiz yer.',
    },
    location: { es: 'Cabo Mayor, más allá del Sardinero', ca: 'Cabo Mayor, més enllà del Sardinero', en: 'Cabo Mayor, beyond El Sardinero', tr: "Cabo Mayor, El Sardinero'nun ötesinde" },
    mapsQuery: 'Playa de Mataleñas, Santander',
  },
  {
    name: 'Somo y Loredo',
    category: 'beaches',
    comment: {
      es: 'Al otro lado de la bahía, a un paso del Santuario de Latas. Se llega en lancha desde el centro y es un plan redondo para el domingo.',
      ca: "A l'altra banda de la badia, a un pas del Santuari de Latas. S'hi arriba en llanxa des del centre i és un pla rodó per al diumenge.",
      en: 'On the other side of the bay, a step from the Santuario de Latas. You get there by boat from the centre and it makes a perfect Sunday.',
      tr: "Körfezin diğer yakasında, Santuario de Latas'a bir adım. Merkezden vapurla gidiliyor ve pazar günü için tam bir plan.",
    },
    location: { es: 'Ribamontán al Mar, en lancha desde Santander', ca: 'Ribamontán al Mar, en llanxa des de Santander', en: 'Ribamontán al Mar, by boat from Santander', tr: "Ribamontán al Mar, Santander'den vapurla" },
    mapsQuery: 'Playa de Somo, Ribamontán al Mar',
  },
  {
    name: 'Los Peligros y Bikinis',
    category: 'beaches',
    comment: {
      es: 'Las playas de la bahía, al pie de la Magdalena: agua tranquila, vistas a Somo y un paseo precioso para llegar.',
      ca: 'Les platges de la badia, al peu de la Magdalena: aigua tranquil·la, vistes a Somo i una passejada preciosa per arribar-hi.',
      en: 'The bay beaches, at the foot of the Magdalena: calm water, views across to Somo and a lovely walk to get there.',
      tr: "Magdalena'nın eteğindeki körfez plajları: sakin su, Somo manzarası ve oraya giden çok güzel bir yürüyüş.",
    },
    location: { es: 'Bahía de Santander, junto a la Magdalena', ca: 'Badia de Santander, al costat de la Magdalena', en: 'Bay of Santander, next to the Magdalena', tr: "Santander Körfezi, Magdalena'nın yanında" },
    mapsQuery: 'Playa de los Peligros, Santander',
  },

  // ── Paseos ─────────────────────────────────────────────────────────────
  {
    name: 'Península de la Magdalena',
    category: 'walks',
    comment: {
      es: 'La vuelta al parque de la Magdalena, con el palacio, los pinos y las vistas a la bahía. Imprescindible, aunque solo tengáis una hora.',
      ca: 'La volta al parc de la Magdalena, amb el palau, els pins i les vistes a la badia. Imprescindible, encara que només tingueu una hora.',
      en: 'The loop around the Magdalena park, with the palace, the pines and the views over the bay. A must, even if you only have an hour.',
      tr: 'Sarayı, çamları ve körfez manzarasıyla Magdalena parkının etrafındaki tur. Sadece bir saatiniz olsa bile kaçırmayın.',
    },
    location: { es: 'Parque de la Magdalena', ca: 'Parc de la Magdalena', en: 'Parque de la Magdalena', tr: 'Parque de la Magdalena' },
    mapsQuery: 'Península de la Magdalena, Santander',
  },
  {
    name: 'Paseo de Pereda y Puertochico',
    category: 'walks',
    comment: {
      es: 'El paseo clásico por el frente marítimo: del Centro Botín a los barcos de Puertochico, siempre con la bahía al lado.',
      ca: 'El passeig clàssic pel front marítim: del Centro Botín als vaixells de Puertochico, sempre amb la badia al costat.',
      en: 'The classic seafront walk: from the Centro Botín to the boats at Puertochico, with the bay beside you the whole way.',
      tr: "Klasik sahil yürüyüşü: Centro Botín'den Puertochico'daki teknelere, yol boyunca körfez yanınızda.",
    },
    location: { es: 'Santander centro', ca: 'Santander centre', en: 'Central Santander', tr: 'Santander merkez' },
    mapsQuery: 'Paseo de Pereda, Santander',
  },
  {
    name: 'Del Sardinero al faro de Cabo Mayor',
    category: 'walks',
    comment: {
      es: 'Por la senda costera desde la Segunda playa hasta el faro: acantilados, mar abierto y, si hay suerte, un atardecer de los buenos.',
      ca: 'Per la senda costanera des de la Segunda platja fins al far: penya-segats, mar oberta i, si hi ha sort, una posta de sol de les bones.',
      en: 'Along the coastal path from the Segunda beach to the lighthouse: cliffs, open sea and, if you are lucky, a proper sunset.',
      tr: 'Segunda plajından deniz fenerine kadar kıyı patikasından: uçurumlar, açık deniz ve şanslıysanız güzel bir gün batımı.',
    },
    location: { es: 'Senda costera, El Sardinero', ca: 'Senda costanera, El Sardinero', en: 'Coastal path, El Sardinero', tr: 'Kıyı patikası, El Sardinero' },
    mapsQuery: 'Faro de Cabo Mayor, Santander',
  },
  {
    name: 'Cruzar la bahía en lancha',
    category: 'walks',
    comment: {
      es: 'Las lanchas de Los Reginas salen del Palacete del Embarcadero hacia Pedreña y Somo. La mejor forma de ver Santander es desde el agua.',
      ca: "Les llanxes de Los Reginas surten del Palacete del Embarcadero cap a Pedreña i Somo. La millor manera de veure Santander és des de l'aigua.",
      en: 'The Los Reginas boats leave from the Palacete del Embarcadero for Pedreña and Somo. The best way to see Santander is from the water.',
      tr: "Los Reginas vapurları Palacete del Embarcadero'dan Pedreña ve Somo'ya kalkıyor. Santander'ı görmenin en iyi yolu sudan.",
    },
    location: { es: 'Palacete del Embarcadero, Paseo de Pereda', ca: 'Palacete del Embarcadero, Paseo de Pereda', en: 'Palacete del Embarcadero, Paseo de Pereda', tr: 'Palacete del Embarcadero, Paseo de Pereda' },
    mapsQuery: 'Palacete del Embarcadero, Santander',
  },

  // ── Qué visitar ────────────────────────────────────────────────────────
  {
    name: 'Centro Botín',
    category: 'sights',
    comment: {
      es: 'El edificio de Renzo Piano suspendido sobre la bahía. Aunque no entréis a las exposiciones, subid a las pasarelas: las vistas son gratis. Y de aquí salen los autobuses.',
      ca: "L'edifici de Renzo Piano suspès sobre la badia. Encara que no entreu a les exposicions, pugeu a les passarel·les: les vistes són gratis. I d'aquí surten els autobusos.",
      en: "Renzo Piano's building, suspended over the bay. Even if you do not go into the exhibitions, go up to the walkways: the views are free. And this is where the buses leave from.",
      tr: "Renzo Piano'nun körfezin üzerinde asılı duran binası. Sergilere girmeseniz bile yürüyüş platformlarına çıkın: manzara bedava. Otobüsler de buradan kalkıyor.",
    },
    location: { es: 'Muelle de Albareda, Jardines de Pereda', ca: 'Muelle de Albareda, Jardines de Pereda', en: 'Muelle de Albareda, Jardines de Pereda', tr: 'Muelle de Albareda, Jardines de Pereda' },
    mapsQuery: 'Centro Botín, Santander',
  },
  {
    name: 'Palacio de la Magdalena',
    category: 'sights',
    comment: {
      es: 'Residencia de verano de Alfonso XIII y hoy el símbolo de la ciudad. El paseo hasta él ya vale la visita.',
      ca: "Residència d'estiu d'Alfons XIII i avui el símbol de la ciutat. El passeig fins a arribar-hi ja val la visita.",
      en: "Alfonso XIII's summer residence and today the symbol of the city. The walk up to it is worth the visit on its own.",
      tr: "XIII. Alfonso'nun yazlık konutu ve bugün şehrin simgesi. Oraya kadar yürümek bile ziyarete değer.",
    },
    location: { es: 'Península de la Magdalena', ca: 'Península de la Magdalena', en: 'Península de la Magdalena', tr: 'Península de la Magdalena' },
    mapsQuery: 'Palacio de la Magdalena, Santander',
  },
  {
    name: 'Mercado de la Esperanza',
    category: 'sights',
    comment: {
      es: 'El mercado de abastos, detrás del Ayuntamiento: pescado, anchoas, quesos y sobaos. Ideal para llevarse un trozo de Cantabria a casa.',
      ca: "El mercat d'abastament, darrere de l'Ajuntament: peix, anxoves, formatges i sobaos. Ideal per endur-se un tros de Cantàbria a casa.",
      en: 'The covered food market behind the town hall: fish, anchovies, cheeses and sobaos. Ideal for taking a piece of Cantabria home.',
      tr: "Belediye binasının arkasındaki kapalı hal: balık, hamsi, peynir ve sobao. Cantabria'dan eve bir parça götürmek için ideal.",
    },
    location: { es: 'Plaza de la Esperanza, detrás del Ayuntamiento', ca: "Plaça de la Esperanza, darrere de l'Ajuntament", en: 'Plaza de la Esperanza, behind the town hall', tr: 'Plaza de la Esperanza, belediyenin arkasında' },
    mapsQuery: 'Mercado de la Esperanza, Santander',
  },

  // ── Si tienes un día extra ─────────────────────────────────────────────
  {
    name: 'Santillana del Mar y Comillas',
    category: 'extraDay',
    comment: {
      es: 'El pueblo medieval y el Capricho de Gaudí, a media hora en coche. Se ven los dos en un día con calma, y de paso las playas de Oyambre.',
      ca: "El poble medieval i el Capricho de Gaudí, a mitja hora en cotxe. Es veuen tots dos en un dia amb calma, i de passada les platges d'Oyambre.",
      en: "The medieval village and Gaudí's Capricho, half an hour away by car. You can see both in one unhurried day, and the Oyambre beaches on the way.",
      tr: "Ortaçağ kasabası ve Gaudí'nin Capricho'su, arabayla yarım saat. İkisi de aceleye getirmeden bir günde görülür, dönüşte Oyambre plajları.",
    },
    location: { es: 'A 30-40 min de Santander, hacia el oeste', ca: "A 30-40 min de Santander, cap a l'oest", en: '30-40 min west of Santander', tr: "Santander'ın 30-40 dk batısında" },
    mapsQuery: 'Santillana del Mar, Cantabria',
  },
  {
    name: 'Picos de Europa',
    category: 'extraDay',
    comment: {
      es: 'Potes, el teleférico de Fuente Dé y el valle de Liébana. Es un día largo, pero se merece cada kilómetro.',
      ca: 'Potes, el telefèric de Fuente Dé i la vall de Liébana. És un dia llarg, però es mereix cada quilòmetre.',
      en: 'Potes, the Fuente Dé cable car and the Liébana valley. It is a long day, but it earns every kilometre.',
      tr: 'Potes, Fuente Dé teleferiği ve Liébana vadisi. Uzun bir gün, ama her kilometresine değiyor.',
    },
    location: { es: 'A 1 h 30 min de Santander', ca: 'A 1 h 30 min de Santander', en: '1 h 30 min from Santander', tr: "Santander'a 1 sa 30 dk" },
    mapsQuery: 'Fuente Dé, Cantabria',
  },
  {
    name: 'San Vicente de la Barquera',
    category: 'extraDay',
    comment: {
      es: 'Pueblo marinero con la ría, el castillo y los Picos de fondo. Para comer pescado con vistas y volver despacio por la costa.',
      ca: 'Poble mariner amb la ria, el castell i els Picos de fons. Per menjar peix amb vistes i tornar a poc a poc per la costa.',
      en: 'A fishing town with its estuary, the castle and the Picos behind. For fish with a view and a slow drive back along the coast.',
      tr: 'Haliçi, kalesi ve arkada Picos dağlarıyla bir balıkçı kasabası. Manzaraya karşı balık yemek ve kıyıdan ağır ağır dönmek için.',
    },
    location: { es: 'A 50 min de Santander, hacia el oeste', ca: "A 50 min de Santander, cap a l'oest", en: '50 min west of Santander', tr: "Santander'ın 50 dk batısında" },
    mapsQuery: 'San Vicente de la Barquera, Cantabria',
  },
  {
    name: 'Cabárceno',
    category: 'extraDay',
    comment: {
      es: 'Parque de la naturaleza a veinte minutos de Santander, con animales en semilibertad en una antigua mina. Si venís con niños, acierto seguro.',
      ca: 'Parc de la natura a vint minuts de Santander, amb animals en semillibertat en una antiga mina. Si veniu amb nens, encert segur.',
      en: 'A wildlife park twenty minutes from Santander, with animals roaming a former open-cast mine. A sure hit if you are coming with children.',
      tr: "Santander'a yirmi dakika mesafede, eski bir maden ocağında yarı serbest hayvanların yaşadığı doğa parkı. Çocuklarla geliyorsanız garanti isabet.",
    },
    location: { es: 'Obregón, a 20 min de Santander', ca: 'Obregón, a 20 min de Santander', en: 'Obregón, 20 min from Santander', tr: "Obregón, Santander'a 20 dk" },
    mapsQuery: 'Parque de la Naturaleza de Cabárceno',
  },
];

export function recommendationMapsUrl(item: Recommendation): string {
  return googleMapsSearchUrl(item.mapsQuery ?? `${item.name}, Santander`);
}
