/**
 * Pequeña biblioteca de iconos de línea (24×24, trazo 1.5).
 * Guiños al norte: olas, anchoa, rabas, faro, autobús…
 * Se renderizan con <Icon name="..." />.
 */
export const icons = {
  wave: '<path d="M2 12c2.5 0 2.5-3 5-3s2.5 3 5 3 2.5-3 5-3 2.5 3 5 3"/>',
  waves:
    '<path d="M2 9c2.5 0 2.5-3 5-3s2.5 3 5 3 2.5-3 5-3 2.5 3 5 3"/><path d="M2 16c2.5 0 2.5-3 5-3s2.5 3 5 3 2.5-3 5-3 2.5 3 5 3"/>',
  bus: '<rect x="4" y="3" width="16" height="14" rx="2.5"/><path d="M4 10h16M8 20v-3M16 20v-3"/><path d="M7.5 13.5h.5M16 13.5h.5"/>',
  chapel:
    '<path d="M4 21V11l8-6 8 6v10"/><path d="M10 21v-5a2 2 0 0 1 4 0v5"/><path d="M12 2v3M10.5 3.5h3"/><path d="M2 21h20"/>',
  cocktail: '<path d="M5 4h14l-7 8-7-8z"/><path d="M12 12v7M8 21h8"/>',
  cutlery: '<path d="M8 3v18"/><path d="M6 3v5a2 2 0 0 0 4 0V3"/><path d="M16 3v18"/><path d="M16 3c2.2 0 3.5 3 3.5 7v2H16"/>',
  vinyl: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.5"/><path d="M12 6.5a5.5 5.5 0 0 1 5.5 5.5"/>',
  moon: '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/>',
  coffee:
    '<path d="M4 8h12v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8z"/><path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16"/><path d="M8 3v2M11.5 3v2"/>',
  rabas: '<circle cx="8.5" cy="14" r="4.5"/><circle cx="15.5" cy="9" r="3.5"/><circle cx="16.5" cy="16.5" r="2.5"/>',
  wine: '<path d="M7 3h10l-1 7a4 4 0 0 1-8 0L7 3z"/><path d="M12 14v6M8.5 21h7"/>',
  beach:
    '<circle cx="12" cy="9" r="3.5"/><path d="M12 2.5v1.5M5.5 5.5l1 1M18.5 5.5l-1 1M3 9h1.5M19.5 9H21"/><path d="M2 18c2.5 0 2.5-2.5 5-2.5s2.5 2.5 5 2.5 2.5-2.5 5-2.5 2.5 2.5 5 2.5"/>',
  walk: '<path d="M4 20c3-5 1.5-8.5 5-10s6.5.5 8.5-3.5" stroke-dasharray="2.5 3"/><circle cx="18.5" cy="5" r="1.75"/>',
  lighthouse:
    '<path d="M9.5 9 8.5 21h7L14.5 9"/><path d="M9 6h6v3H9z"/><path d="M10.5 6l1.5-3 1.5 3"/><path d="M6.5 7.5H4M20 7.5h-2.5M7 21h10"/>',
  mountains: '<path d="M2 20l6.5-11 4.5 7.5L16 12l6 8H2z"/><circle cx="17.5" cy="6" r="2"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="M12 5l2.5 7-2.5 7-2.5-7z"/><path d="M9.5 12h5"/>',
  north: '<path d="M12 21V3"/><path d="M12 3l4.5 8L12 8.5 7.5 11z"/>',
  anchovy:
    '<path d="M2.5 12c3-4.5 6.5-6.5 10.5-6.5S19 8 20.5 12c-1.5 4-3.5 6.5-7.5 6.5S5.5 16.5 2.5 12z"/><path d="M20.5 12l2.5-3.5v7L20.5 12z"/><path d="M7 12h9"/><circle cx="6.5" cy="10.5" r=".6" fill="currentColor"/>',
  golf: '<path d="M8 21V3M8 4l9 3.5L8 11"/><path d="M3 21c0-1.2 2.3-1.8 5-1.8s5 .6 5 1.8"/>',
  pin: '<path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z"/><circle cx="12" cy="10" r="2"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  bed: '<path d="M3 7v11M3 12h18v6M3 15.5h18M6 12V9a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1v3"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  form: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/>',
  question: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7"/><path d="M12 17h.01"/>',
  music: '<path d="M9 18V5l10-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>',
  arrowRight: '<path d="M4 12h16M14 6l6 6-6 6"/>',
  arrowUp: '<path d="M12 20V4M6 10l6-6 6 6"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 13.5V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  chevron: '<path d="M6 9l6 6 6-6"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  menu: '<path d="M3 8h18M3 16h18"/>',
} as const;

export type IconName = keyof typeof icons;
