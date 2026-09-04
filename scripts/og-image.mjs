/**
 * Genera public/og.png (vista previa al compartir en WhatsApp, etc.) a partir de
 * la foto de portada (src/assets/hero.*) y public/apple-touch-icon.png desde el favicon.
 * Uso: npm run og   (repetir cuando cambie la foto de portada)
 */
import { existsSync } from 'node:fs';
import sharp from 'sharp';

const hero = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'svg'].map((ext) => `src/assets/hero.${ext}`).find(existsSync);
if (!hero) throw new Error('No se encuentra src/assets/hero.(jpg|png|webp|svg)');

const W = 1200;
const H = 630;
const PHOTO_W = 690;

const photo = await sharp(hero).resize(PHOTO_W, H, { fit: 'cover' }).png().toBuffer();

const panel = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W - PHOTO_W}" height="${H}">
  <rect width="100%" height="100%" fill="#f6f3ee"/>
  <text x="56" y="228" font-family="Iowan Old Style, Palatino, Georgia, serif" font-size="78" fill="#16232b">Silvia</text>
  <text x="56" y="316" font-family="Iowan Old Style, Palatino, Georgia, serif" font-size="78" fill="#16232b"><tspan font-style="italic" fill="#2f5f6e">&amp;</tspan> Guille</text>
  <text x="58" y="392" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="17" letter-spacing="4" fill="#5f6b72">01 · 05 · 2027 — SANTANDER</text>
  <path d="M58 450c14 0 14-16 28-16s14 16 28 16 14-16 28-16 14 16 28 16" stroke="#2f5f6e" stroke-width="2.5" fill="none" stroke-linecap="round"/>
</svg>`);

await sharp({ create: { width: W, height: H, channels: 3, background: '#f6f3ee' } })
  .composite([
    { input: photo, left: 0, top: 0 },
    { input: panel, left: PHOTO_W, top: 0 },
  ])
  .png()
  .toFile('public/og.png');

await sharp('public/favicon.svg').resize(180, 180).png().toFile('public/apple-touch-icon.png');

console.log('✓ public/og.png y public/apple-touch-icon.png generados');
