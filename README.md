# Silvia & Guille · 01.05.2027 · Santander

Web de la boda. Estática, muy ligera y pensada para móvil (la mayoría de invitados
la abrirán desde WhatsApp). Hecha con [Astro](https://astro.build) y publicada en
GitHub Pages.

- **Producción:** https://javiarrobas.github.io/guilleysilvi/ (hasta que haya dominio propio)
- **Idiomas:** castellano publicado; catalán preparado (ver [Catalán](#catalán)).

## Requisitos

Node 20 (hay un `.nvmrc`): `nvm use` (o `nvm install 20` la primera vez).

```bash
npm install        # dependencias
npm run dev        # http://localhost:4321 con recarga en caliente
npm run build      # genera dist/
npm run preview    # sirve dist/ tal y como se publicará
npm run check      # comprueba tipos y plantillas
npm run test:e2e   # pruebas Playwright en móvil y escritorio (compila y sirve solo)
npm run og         # regenera la imagen de vista previa (WhatsApp) desde la foto de portada
```

Capturas de todas las páginas para revisar el diseño: `SCREENSHOTS=1 npm run test:e2e` → `tests/screenshots/`.

## Dónde se edita cada cosa

| Qué                                        | Dónde                                 |
| ------------------------------------------ | ------------------------------------- |
| Nombres, fecha, URL del formulario, idiomas | `src/site.config.ts`                  |
| Textos de la interfaz (menú, títulos…)     | `src/i18n/es.ts` y `src/i18n/ca.ts`   |
| Horarios del gran día                      | `src/data/schedule.ts`                |
| Los tres puntos del mapa (coordenadas, direcciones) y la zona recomendada | `src/data/locations.ts` |
| Alojamientos                               | `src/data/accommodations.ts`          |
| Guía «Nuestro Santander»                   | `src/data/santander.ts`               |
| Preguntas frecuentes                       | `src/data/faq.ts`                     |
| Fotos de la galería                        | `src/assets/gallery/`                 |
| Foto de portada                            | `src/assets/hero.jpg` (o png/webp)    |
| Colores, tipografías, espaciados           | `src/styles/global.css`               |
| Iconos (olas, anchoa, rabas, faro…)        | `src/components/icons.ts`             |

Todos los ficheros de `src/data/` están comentados con ejemplos: basta copiar un
bloque y rellenarlo. Los textos traducibles se escriben como `{ es: '…', ca: '…' }`;
si falta el catalán se muestra el castellano.

### Fotos

1. **Portada:** guarda la foto como `src/assets/hero.jpg` (vertical o cuadrada queda mejor;
   en escritorio se muestra a la derecha del texto y en móvil a todo el ancho) y borra `hero.svg`.
   Después ejecuta `npm run og` para regenerar la imagen de vista previa de WhatsApp.
2. **Galería:** deja entre 8 y 15 fotos en `src/assets/gallery/` con nombres que ordenen
   (`01-somo.jpg`, `02-….jpg`…) y borra los `*-placeholder.svg`. El mosaico asigna las formas
   (ancha, alta, grande) por posición. Los textos alternativos se añaden en `src/data/gallery.ts`.
3. Astro optimiza y redimensiona las imágenes al compilar: se pueden subir en buena resolución
   (2.000 px de lado largo es más que suficiente).

### Formulario de confirmación

Cuando exista el Google Forms, pega su URL en `rsvpFormUrl` (`src/site.config.ts`). Hasta
entonces la página muestra «Formulario disponible próximamente». La fecha límite se indica
en `rsvpDeadline`.

### Alojamientos

Añade entradas en `src/data/accommodations.ts` (hay un ejemplo comentado). Se agrupan
automáticamente en *Cerca del autobús · Centro de Santander · Apartamentos para grupos ·
Opciones económicas*. Mientras la lista esté vacía, la página muestra el mapa con la zona
recomendada y un aviso de «Próximamente».

### Guía de Santander

`src/data/santander.ts` contiene **recomendaciones de relleno** (lugares conocidos con
comentarios genéricos) para dar forma a la sección. Hay que revisarlas y sustituirlas por
las de Silvia y Guille. Cada recomendación admite foto (`image`), comentario, ubicación y
el texto que se busca en Google Maps al pulsar «Ver en mapa».

### Mapa

El mapa usa Leaflet con las teselas estándar de OpenStreetMap (gratuitas, sin clave; el CSS las
desatura para integrarlas con la paleta). Las coordenadas de los tres puntos y el radio de la zona recomendada (1.100 m ≈
15 min andando desde el Centro Botín) están en `src/data/locations.ts`. Los botones «Abrir en
Google Maps» buscan el lugar por nombre y dirección para que salga su ficha completa.

## Catalán

Todo está preparado para publicar la web en catalán además de castellano:

1. Revisa `src/i18n/ca.ts` (la interfaz ya está traducida) y añade los campos `ca` que falten
   en `src/data/*` (horarios, FAQ, guía, alojamientos).
2. Crea las páginas en `src/pages/ca/` con los nombres de `src/i18n/routes.ts` (`slugs.ca`).
   Cada página es una línea; por ejemplo `src/pages/ca/allotjament.astro`:
   ```astro
   ---
   import StayView from '@/views/StayView.astro';
   ---

   <StayView />
   ```
3. Añade `'ca'` a `enabledLocales` en `src/site.config.ts`. Aparecerá el selector de idioma
   en el menú y el pie, y las etiquetas `hreflang`.

La detección de idioma se hace por URL (`/ca/...`); Astro rellena `Astro.currentLocale` y
las vistas lo leen automáticamente.

## Publicación en GitHub Pages

El workflow `.github/workflows/deploy.yml` compila y publica en cada `push` a `main`.
Una sola vez, en el repositorio de GitHub: **Settings → Pages → Build and deployment →
Source: GitHub Actions**. La web quedará en `https://javiarrobas.github.io/guilleysilvi/`.

El prefijo `/guilleysilvi` se inyecta automáticamente en la compilación (variables
`SITE_URL` y `BASE_PATH`); en local la web se sirve en la raíz. Para probar en local
exactamente lo que se publicará:

```bash
BASE_PATH=/guilleysilvi npm run build && npm run preview
```

### Dominio propio (más adelante)

1. En el registrador del dominio, crea un `CNAME` de `www` → `javiarrobas.github.io` (y, si se
   quiere el dominio sin `www`, registros `A` a las IPs de GitHub Pages).
2. En **Settings → Pages → Custom domain** escribe el dominio y activa *Enforce HTTPS*.
3. Nada más: el siguiente despliegue detecta el dominio, `BASE_PATH` pasa a estar vacío y
   todos los enlaces se generan sin prefijo.

## Privacidad

La web lleva `noindex` (no se indexa en buscadores; no afecta a las vistas previas de
WhatsApp). Se cambia en `src/site.config.ts`. No hay cookies, analíticas ni peticiones a
terceros salvo las teselas del mapa (OpenStreetMap) y los enlaces a Google Maps.

## Estructura

```
src/
├── site.config.ts     configuración general
├── i18n/              diccionarios (es, ca), rutas por idioma, helpers
├── data/              contenidos: horarios, lugares, alojamientos, guía, FAQ, galería
├── components/        cabecera, pie, cuenta atrás, mapa, tarjetas, galería, FAQ, iconos
├── views/             una vista por sección (reutilizables en cualquier idioma)
├── pages/             rutas públicas (una línea cada una) → src/pages/ca/ para el catalán
├── layouts/Base.astro <head>, metadatos, cabecera y pie
├── styles/global.css  tokens de diseño y utilidades
└── assets/            foto de portada y galería (optimizadas por Astro)
```

## Créditos

Tipografías [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif) e
[Instrument Sans](https://fonts.google.com/specimen/Instrument+Sans) (autoalojadas).
Mapa: [Leaflet](https://leafletjs.com) · © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors.
