/**
 * Importa las fotos originales de fotos/ a src/assets/ (portada y galería).
 *
 *  - Corrige la orientación EXIF y elimina todos los metadatos (GPS incluido).
 *  - Redimensiona a 2.000 px de lado largo (2.400 la portada) y guarda JPEG optimizado.
 *  - Las HEIC se convierten con `sips` (macOS). En otros sistemas, conviértelas antes a JPEG.
 *  - Escribe src/data/gallery.json con el orden, los destacados y los textos alternativos.
 *
 * Para añadir o reordenar fotos: edita HERO y la lista `photos` y ejecuta `npm run photos`.
 * Los originales de fotos/ no se suben al repositorio (.gitignore).
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import { tmpdir } from 'node:os';
import sharp from 'sharp';

const SOURCE = 'fotos';
const HERO = { file: 'IMG_1725.HEIC', alt: 'Silvia y Guille en la costa cantábrica, entre las rocas y el mar' };

/** Orden de la galería. `featured: true` la muestra en grande. */
const photos = [
  { file: 'IMG_8506.jpeg', alt: 'Silvia y Guille en un puerto, con los barcos al fondo', featured: true },
  { file: '38e0f166-a5d7-4eed-b978-21cefca58838.jpg', alt: 'Silvia y Guille sobre los acantilados de una playa' },
  { file: 'IMG_0567.jpeg', alt: 'Silvia y Guille de celebración' },
  { file: 'IMG_2839.HEIC', alt: 'Silvia y Guille en Navidad, en una plaza iluminada' },
  { file: 'IMG_7604.jpeg', alt: 'Silvia y Guille en un prado al atardecer, con la ría al fondo', featured: true },
  { file: 'IMG_0665.jpeg', alt: 'Silvia y Guille delante de una casa de rayas' },
  { file: 'IMG_1862.jpeg', alt: 'Silvia y Guille en los acantilados, con el mar detrás' },
  { file: 'IMG_20230221_152928.jpg', alt: 'Silvia y Guille esquiando' },
  { file: 'IMG_9154.jpeg', alt: 'Silvia y Guille delante de una iglesia románica', featured: true },
  { file: '222f457c-e250-4489-89e8-b7a135080b52.jpg', alt: 'Silvia y Guille con cascos de moto' },
  { file: 'IMG_7183.jpeg', alt: 'Silvia y Guille en el mar' },
  { file: 'IMG_7499.jpeg', alt: 'Silvia y Guille en un prado junto al mar' },
  { file: 'IMG_3971.HEIC', alt: 'Silvia y Guille en un partido' },
  { file: 'IMG_2595.jpeg', alt: 'Silvia y Guille en un concierto' },
  { file: 'IMG_9697.jpeg', alt: 'Silvia y Guille en un festival' },
  { file: 'fb5fd5ec-73f9-4e2c-998a-91a75add7f22.jpg', alt: 'Silvia y Guille frente al mar, en la costa' },
  { file: 'IMG-20230526-WA0022.jpg', alt: 'Silvia y Guille en un concierto' },
  // Sin usar (casi idéntica a IMG_7499): 'IMG_7498.jpeg'
];

const GALLERY_DIR = 'src/assets/gallery';
const MAX_GALLERY = 2000;
const MAX_HERO = 2400;
const QUALITY = 82;

const tmp = join(tmpdir(), 'guilleysilvi-photos');
mkdirSync(tmp, { recursive: true });

/** Devuelve una ruta legible por sharp (convierte HEIC → JPEG con sips). */
function readable(file) {
  const path = join(SOURCE, file);
  if (!existsSync(path)) throw new Error(`No existe ${path}`);
  if (!/\.heic$/i.test(file)) return path;
  const out = join(tmp, `${basename(file, extname(file))}.jpg`);
  execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '95', path, '--out', out], { stdio: 'ignore' });
  return out;
}

async function process(file, out, max) {
  const info = await sharp(readable(file))
    .rotate()
    .resize({ width: max, height: max, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(out);
  return info;
}

const slug = (file) => basename(file, extname(file)).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Portada
const hero = await process(HERO.file, 'src/assets/hero.jpg', MAX_HERO);
console.log(`portada  hero.jpg  ${hero.width}x${hero.height}  ${(hero.size / 1024).toFixed(0)} kB`);

// Galería: se regenera completa
mkdirSync(GALLERY_DIR, { recursive: true });
for (const old of readdirSync(GALLERY_DIR)) if (/\.(jpe?g|png|webp)$/i.test(old)) rmSync(join(GALLERY_DIR, old));

const images = [];
for (const [i, photo] of photos.entries()) {
  const id = `${String(i + 1).padStart(2, '0')}-${slug(photo.file)}`;
  const info = await process(photo.file, join(GALLERY_DIR, `${id}.jpg`), MAX_GALLERY);
  images.push({ id, alt: photo.alt, ...(photo.featured ? { featured: true } : {}) });
  console.log(`galería  ${id}.jpg  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} kB`);
}

writeFileSync('src/data/gallery.json', JSON.stringify({ hero: { alt: HERO.alt }, images }, null, 2) + '\n');
rmSync(tmp, { recursive: true, force: true });

const unused = readdirSync(SOURCE).filter((f) => /\.(jpe?g|png|heic)$/i.test(f) && f !== HERO.file && !photos.some((p) => p.file === f));
if (unused.length) console.log(`sin usar: ${unused.join(', ')}`);
console.log(`✓ ${images.length} fotos en la galería + portada`);
