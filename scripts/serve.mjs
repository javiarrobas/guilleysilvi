/**
 * Servidor estático mínimo, sin dependencias, que sirve dist/ imitando a GitHub Pages:
 *   /ruta  → 301 a /ruta/       /ruta/ → /ruta/index.html       no existe → 404.html (estado 404)
 *
 * Uso:  node scripts/serve.mjs [directorio=dist] [puerto=4321]
 *       BASE_PATH=/guilleysilvi node scripts/serve.mjs   (tras compilar con el mismo BASE_PATH)
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

const [dir = 'dist', port = '4321'] = process.argv.slice(2);
const root = resolve(dir);
const base = (process.env.BASE_PATH ?? '').replace(/\/+$/, '');

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
};

const info = (path) => stat(path).catch(() => null);

async function notFound(res) {
  const page = join(root, '404.html');
  const body = (await info(page))?.isFile() ? await readFile(page) : Buffer.from('Not found');
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(body);
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  let pathname = decodeURIComponent(url.pathname);

  if (base) {
    if (pathname === base) {
      res.writeHead(301, { Location: `${base}/${url.search}` });
      return res.end();
    }
    if (!pathname.startsWith(`${base}/`)) return notFound(res);
    pathname = pathname.slice(base.length);
  }

  let filePath = join(root, normalize(pathname));
  if (!filePath.startsWith(root)) return notFound(res);

  let stats = await info(filePath);
  if (stats?.isDirectory()) {
    if (!pathname.endsWith('/')) {
      res.writeHead(301, { Location: `${base}${pathname}/${url.search}` });
      return res.end();
    }
    filePath = join(filePath, 'index.html');
    stats = await info(filePath);
  }
  if (!stats?.isFile()) {
    const alt = `${filePath}.html`;
    const altStats = await info(alt);
    if (!altStats?.isFile()) return notFound(res);
    filePath = alt;
    stats = altStats;
  }

  res.writeHead(200, {
    'Content-Type': types[extname(filePath).toLowerCase()] ?? 'application/octet-stream',
    'Content-Length': stats.size,
    'Cache-Control': 'no-cache',
  });
  res.end(await readFile(filePath));
});

server.listen(Number(port), () => {
  console.log(`Sirviendo ${root} en http://localhost:${port}${base}/  (Ctrl+C para parar)`);
});
