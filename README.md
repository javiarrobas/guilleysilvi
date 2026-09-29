# Silvia & Guille · 01.05.2027 · Santander

Web de la boda. Estática, muy ligera y pensada para móvil (la mayoría de invitados
la abrirán desde WhatsApp). Hecha con [Astro](https://astro.build) y publicada en
GitHub Pages.

- **Producción:** https://javiarrobas.github.io/guilleysilvi/ (hasta que haya dominio propio)
- **Idiomas:** castellano (por defecto), catalán en `/ca/`, inglés en `/en/` y turco en `/tr/` (ver [Idiomas](#idiomas)).

## Requisitos

Node 22 LTS (hay un `.nvmrc`): `nvm use` (o `nvm install 22` la primera vez).

```bash
npm install        # dependencias
npm run dev        # http://localhost:4321 con recarga en caliente
npm run build      # genera dist/
npm run preview    # sirve dist/ en http://localhost:4321 tal y como lo hará GitHub Pages
npm run check      # comprueba tipos y plantillas
npm run test:e2e   # pruebas Playwright en móvil y escritorio (compila y sirve solo)
npm run og         # regenera la imagen de vista previa (WhatsApp) desde la foto de portada
```

Capturas de todas las páginas para revisar el diseño: `SCREENSHOTS=1 npm run test:e2e` → `tests/screenshots/`.

## Dónde se edita cada cosa

| Qué                                        | Dónde                                 |
| ------------------------------------------ | ------------------------------------- |
| Nombres, fecha, fecha límite, idiomas       | `src/site.config.ts`                  |
| Conexión con Firebase (formulario, juego)  | `src/firebase.config.json`            |
| Preguntas del juego / clave de respuestas  | `src/data/quiz.json` / `quiz.answers.json` (local) |
| Textos de la interfaz (menú, títulos…)     | `src/i18n/es.ts`, `ca.ts`, `en.ts`, `tr.ts` |
| Horarios del gran día                      | `src/data/schedule.ts`                |
| Los tres puntos del mapa (coordenadas, direcciones) y la zona recomendada | `src/data/locations.ts` |
| Alojamientos                               | `src/data/accommodations.ts`          |
| Guía «Nuestro Santander»                   | `src/data/santander.ts`               |
| Preguntas frecuentes                       | `src/data/faq.ts`                     |
| Fotos (portada y galería)                  | `fotos/` + `npm run photos` (ver abajo) |
| Colores, tipografías, espaciados           | `src/styles/global.css`               |
| Iconos (olas, anchoa, rabas, faro…)        | `src/components/icons.ts`             |

Todos los ficheros de `src/data/` están comentados con ejemplos: basta copiar un
bloque y rellenarlo. Los textos traducibles se escriben como `{ es: '…', ca: '…', … }`, una clave por idioma;
si falta un idioma se muestra el castellano.

### Fotos

Los originales se dejan en `fotos/` (carpeta ignorada por git: no se suben al repositorio) y
se importan con:

```bash
npm run photos   # genera src/assets/hero.jpg, src/assets/gallery/*.jpg y src/data/gallery.json
npm run og       # regenera la imagen de vista previa de WhatsApp a partir de la portada
```

El script `scripts/import-photos.mjs` corrige la orientación, elimina los metadatos (GPS
incluido), redimensiona a 2.000 px y guarda JPEG optimizados. Al principio del script se elige
la foto de portada (`HERO`) y la lista ordenada de la galería, con el texto alternativo de cada
foto (en los tres idiomas) y cuáles van en grande (`featured`). Para añadir fotos: cópialas a
`fotos/`, añádelas a la lista y vuelve a ejecutar `npm run photos`. Las HEIC del iPhone se
convierten solas (macOS).

El mosaico adapta cada celda a la orientación de la foto (retratos 3:4, paisajes 3:2) y completa
siempre la última fila. Astro genera al compilar las versiones redimensionadas para cada pantalla.

### Formulario de confirmación

El formulario es propio de la web (`src/components/RsvpForm.astro` + `src/scripts/rsvp.ts`):
los invitados lo rellenan sin ninguna cuenta y las respuestas se guardan en Firestore, en el
proyecto compartido **youwebit-platform** (repo `wedoco/youwebit-platform`), bajo
`sites/guilleysilvi/rsvps`. Tres capas de protección: reglas de Firestore (solo crear, campos
y tamaños validados, nadie lee desde el navegador), App Check con reCAPTCHA Enterprise
(invisible) y un campo trampa para bots.

- **Activarlo**: rellena `src/firebase.config.json` con `terraform output -json sites` de la
  plataforma (`web_config` + `recaptcha_site_key`). Son identificadores públicos, no secretos.
  Mientras esté vacío, la página muestra «Próximamente». Si algún día se prefiere un formulario
  externo, basta poner su URL en `rsvpFormUrl` (`src/site.config.ts`).
- **Las respuestas**: los novios reciben un enlace privado que descarga un CSV actualizado
  (`terraform output -json export_urls` en la plataforma). Un invitado que quiera corregir algo
  vuelve a enviar el formulario; el CSV marca la última respuesta de cada email.
- **Fecha límite**: texto en `rsvpDeadline` (`src/site.config.ts`).
- **Desarrollo local contra el proyecto real**: exporta `PUBLIC_APPCHECK_DEBUG_TOKEN` con el
  token de `terraform output -json app_check_debug_tokens` antes de `npm run dev`. Nunca lo
  incluyas en un build que se publique.
- **Pruebas**: `npm run test:e2e` arranca el emulador de Firestore con una copia de las reglas
  reales (`tests/emulator/`, ver su README) y compila la web apuntando a él, sin App Check.

### El juego («¿Cuánto sabes de Silvia y Guille?»)

Un cuestionario tipo Kahoot en `/juego/` (y `/ca/joc/`, `/en/quiz/`, `/tr/oyun/`): avatar,
nombre y email, preguntas de una en una, resultado con las respuestas correctas y la opción
de publicar la puntuación en el ranking (`/ranking/`). Un intento por email.

- **Preguntas**: `src/data/quiz.json`, en los cuatro idiomas. Las actuales son de ejemplo;
  sustitúyelas manteniendo los `id` estables. No contiene las respuestas.
- **Respuestas correctas**: `src/data/quiz.answers.json` (copia de `quiz.answers.example.json`,
  **ignorado por git** porque el repo es público). Índice 0-based de la opción correcta por
  pregunta. Se publican en Firestore con `npm run quiz:publish` (usa tu cuenta wedoco.io de
  gcloud), donde solo las lee la función que puntúa: nunca viajan al navegador.
- **Corrección y ranking**: la función `quiz` de youwebit-platform puntúa, guarda al jugador y,
  si acepta, su entrada pública (emoji, nombre, puntuación; sin email). Su URL está en
  `quizUrl` de `src/firebase.config.json`.
- **Pruebas**: `tests/quiz.spec.ts` simula la función con `page.route` y lee el ranking real del
  emulador; la función se prueba en su repo (`functions/quiz/test`).

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

## Idiomas

La web está publicada en castellano (por defecto, en la raíz), en catalán (`/ca/`), inglés
(`/en/`) y turco (`/tr/`). El idioma se detecta por la URL; Astro rellena `Astro.currentLocale` y las
vistas lo leen. El selector aparece en la cabecera (escritorio, como desplegable), en el menú
(móvil) y en el pie; se controla con el prop `variant` de `src/components/LanguageSwitcher.astro`.

- Textos de la interfaz: un fichero por idioma en `src/i18n/`. El castellano es el diccionario de
  referencia: TypeScript avisa si a los otros les falta una clave.
- Contenidos: los campos traducibles de `src/data/*` llevan una clave por idioma: `{ es, ca, en, tr }`.
  Si falta un idioma se muestra el castellano, así que se puede traducir poco a poco.
- Rutas: `src/i18n/routes.ts` (`slugs`). Cada página de `src/pages/<idioma>/` es una línea que
  reutiliza la vista correspondiente; para añadir una sección nueva hay que crear el fichero en
  todos los idiomas. Las URL van sin caracteres especiales (el turco usa `/tr/buyuk-gun/`).
- Añadir un idioma: diccionario en `src/i18n/`, entrada en `locales` (`src/i18n/index.ts`) y en
  `astro.config.mjs`, rutas en `routes.ts`, anclas en `SantanderView.astro`, páginas en
  `src/pages/<idioma>/`, `og:locale` en `Base.astro` y la clave en los campos de `src/data/*`.
- Anclas de la guía de Santander (`#desayunar`, `#breakfast`…): `src/views/SantanderView.astro`.
- Textos alternativos de las fotos: en la lista de `scripts/import-photos.mjs`, `{ es, ca, en, tr }`.
- Para dejar de publicar un idioma basta con quitarlo de `enabledLocales` (`src/site.config.ts`):
  desaparece del selector, aunque sus páginas sigan existiendo.
- La página 404 se sirve en castellano para cualquier ruta inexistente (GitHub Pages usa un único
  `404.html`).

## Publicación

La web se publica en **Firebase Hosting** (proyecto youwebit-platform) con el workflow
`.github/workflows/deploy-firebase.yml`, en cada push a `main`. El workflow se autentica sin
claves (Workload Identity Federation) y se activa cuando existen estas variables del repositorio
(Settings → Secrets and variables → Actions → Variables), que salen de `infra/tf output` en la
plataforma:

| Variable | Valor |
| --- | --- |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | output `workload_identity_provider` |
| `GCP_DEPLOY_SERVICE_ACCOUNT` | output `sites.guilleysilvi.deploy_service_account` |
| `SITE_URL` (opcional) | `https://guilleysilvi.web.app` o el dominio definitivo |

URL por defecto: `https://guilleysilvi.web.app`. El subdominio `guilleysilvi.youwebit.com` y,
más adelante, el dominio propio de la boda se conectan desde la plataforma (`custom_domain`),
sin tocar nada aquí salvo `SITE_URL`.

En Firebase la web vive en la raíz, así que el workflow compila con `BASE_PATH=/`. El workflow
antiguo de GitHub Pages (`deploy.yml`) sigue publicando en
`https://javiarrobas.github.io/guilleysilvi/` hasta que se retire; GitHub Pages no permite
alojar webs de un servicio comercial, por eso el cambio.

Para probar en local exactamente lo que se publicará:

```bash
npm run build && npm run preview
```

## Privacidad

La web lleva `noindex` (no se indexa en buscadores; no afecta a las vistas previas de
WhatsApp). Se cambia en `src/site.config.ts`. No hay cookies ni analíticas. Peticiones a
terceros: las teselas del mapa (OpenStreetMap), los enlaces a Google Maps y, en la página de
confirmación, Firestore y reCAPTCHA Enterprise (Google) para guardar las respuestas. Las
respuestas contienen datos personales y de salud (alergias): la base de datos está en la UE,
nadie puede leerlas desde la web, y conviene borrarlas después de la boda.

## Estructura

```
src/
├── site.config.ts     configuración general
├── i18n/              diccionarios (es, ca, en, tr), rutas por idioma, helpers
├── data/              contenidos: horarios, lugares, alojamientos, guía, FAQ, galería
├── components/        cabecera, pie, cuenta atrás, mapa, tarjetas, galería, FAQ, formulario, iconos
├── scripts/rsvp.ts    lógica del formulario de confirmación (Firestore)
├── lib/firebase.ts    configuración de Firebase (lee src/firebase.config.json)
├── views/             una vista por sección (reutilizables en cualquier idioma)
├── pages/             rutas públicas (una línea cada una); ca/, en/ y tr/ para los otros idiomas
├── layouts/Base.astro <head>, metadatos, cabecera y pie
├── styles/global.css  tokens de diseño y utilidades
└── assets/            foto de portada y galería (generadas por npm run photos)
fotos/                 originales de las fotos (ignorados por git)
scripts/               import-photos.mjs, og-image.mjs, serve.mjs
```

## Créditos

Tipografías [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif) e
[Instrument Sans](https://fonts.google.com/specimen/Instrument+Sans) (autoalojadas).
Mapa: [Leaflet](https://leafletjs.com) · © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors.
