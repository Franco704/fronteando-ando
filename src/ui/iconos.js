// Íconos de trazo (24×24). Siempre decorativos: el texto o el aria-label del botón dice qué hacen.
const P = {
  menu: 'M4 7h16M4 12h16M4 17h10',
  cerrar: 'M6 6l12 12M18 6L6 18',
  luna: 'M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z',
  inicio: 'M4 11l8-6 8 6v8a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z',
  indice: 'M5 6h2M10 6h9M5 12h2M10 12h9M5 18h2M10 18h9',
  resumen: 'M6 3h12v18H6zM9 8h6M9 12h6M9 16h3',
  conceptual: 'M4 5h7a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H4zM20 5h-7M20 5v13h-7',
  video: 'M4 6h12v12H4zM16 10l4-2v8l-4-2',
  diapositivas: 'M3 4h18v12H3zM12 16v4M8 20h8',
  moyano: 'M12 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM5 21a7 7 0 0 1 14 0',
  parciales: 'M6 3h9l3 3v15H6zM9 11l2 2 4-4M9 17h6',
  simulacro: 'M12 7v5l3 2M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z',
  repasar: 'M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4',
  lab: 'M9 3v6L4 19a1 1 0 0 0 1 2h14a1 1 0 0 0 1-2L15 9V3M8 3h8M7 15h10',
  proyectos: 'M4 7h16v12H4zM9 7V4h6v3',
  consola: 'M4 5h16v14H4zM7 10l3 2-3 2M12 15h5',
};
export const icono = (n, tam = 20) => `<svg viewBox="0 0 24 24" width="${tam}" height="${tam}" aria-hidden="true" focusable="false"><path d="${P[n]}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
