import type { ImageMetadata } from 'astro';

/**
 * Galería. Basta con dejar las fotos en src/assets/gallery/ (jpg, png, webp…):
 * se ordenan por nombre de fichero (01-…, 02-…). Astro las optimiza al compilar.
 *
 * Los ficheros .svg actuales son marcadores de posición: se pueden borrar
 * cuando lleguen las fotos reales.
 *
 * Textos alternativos (accesibilidad) por nombre de fichero sin extensión:
 */
const alts: Record<string, string> = {
  // '01-playa': 'Silvia y Guille en la playa de Somo',
};

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/gallery/*.{jpg,jpeg,png,webp,avif,svg}', {
  eager: true,
});

export interface GalleryImage {
  src: ImageMetadata;
  alt: string;
  id: string;
}

export const gallery: GalleryImage[] = Object.entries(files)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, mod]) => {
    const id = path.split('/').pop()!.replace(/\.\w+$/, '');
    return { src: mod.default, alt: alts[id] ?? '', id };
  });

/** true mientras solo haya marcadores de posición (SVG) en la carpeta. */
export const galleryIsPlaceholder = gallery.length === 0 || gallery.every((img) => img.src.format === 'svg');

/** Foto de portada: src/assets/hero.(jpg|png|webp|svg). */
const heroFiles = import.meta.glob<{ default: ImageMetadata }>('../assets/hero.{jpg,jpeg,png,webp,avif,svg}', {
  eager: true,
});
export const heroImage: ImageMetadata | undefined = Object.values(heroFiles)[0]?.default;
export const heroIsPlaceholder = !heroImage || heroImage.format === 'svg';
