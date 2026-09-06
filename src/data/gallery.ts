import type { ImageMetadata } from 'astro';
import manifest from './gallery.json';

/**
 * Galería y foto de portada.
 *
 * Las imágenes viven en src/assets/gallery/ y src/assets/hero.jpg; las genera
 * `npm run photos` (scripts/import-photos.mjs) a partir de los originales de fotos/,
 * junto con gallery.json (orden, destacadas y textos alternativos).
 * Cualquier imagen de la carpeta que no esté en gallery.json se añade al final.
 */
const files = import.meta.glob<{ default: ImageMetadata }>('../assets/gallery/*.{jpg,jpeg,png,webp,avif,svg}', {
  eager: true,
});

const byId = new Map(
  Object.entries(files).map(([path, mod]) => [path.split('/').pop()!.replace(/\.\w+$/, ''), mod.default] as const),
);

export interface GalleryImage {
  id: string;
  src: ImageMetadata;
  alt: string;
  /** Se muestra en grande dentro del mosaico. */
  featured?: boolean;
}

const listed: GalleryImage[] = manifest.images
  .filter((item) => byId.has(item.id))
  .map((item) => ({ id: item.id, src: byId.get(item.id)!, alt: item.alt, featured: item.featured }));

const listedIds = new Set(listed.map((item) => item.id));
const extra: GalleryImage[] = [...byId.keys()]
  .filter((id) => !listedIds.has(id))
  .sort()
  .map((id) => ({ id, src: byId.get(id)!, alt: '' }));

export const gallery: GalleryImage[] = [...listed, ...extra];

/** true mientras solo haya marcadores de posición (SVG) o ninguna foto. */
export const galleryIsPlaceholder = gallery.length === 0 || gallery.every((img) => img.src.format === 'svg');

/** Foto de portada: src/assets/hero.(jpg|png|webp|svg). */
const heroFiles = import.meta.glob<{ default: ImageMetadata }>('../assets/hero.{jpg,jpeg,png,webp,avif,svg}', {
  eager: true,
});
export const heroImage: ImageMetadata | undefined = Object.values(heroFiles)[0]?.default;
export const heroIsPlaceholder = !heroImage || heroImage.format === 'svg';
export const heroAlt: string = manifest.hero?.alt ?? '';
