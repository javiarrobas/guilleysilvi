/**
 * Añade el prefijo de despliegue (p. ej. /guilleysilvi en GitHub Pages) a una ruta interna.
 * Úsalo SIEMPRE para enlaces internos y ficheros de /public.
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean}` || '/';
}

/** URL absoluta (para metadatos Open Graph, canonical, etc.). */
export function absoluteUrl(path: string, site: URL | undefined): string {
  const relative = withBase(path);
  if (!site) return relative;
  return new URL(relative, site).toString();
}

export function googleMapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function googleMapsCoordsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

export function googleMapsDirectionsUrl(lat: number, lng: number, mode: 'walking' | 'driving' | 'transit' = 'walking'): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=${mode}`;
}
