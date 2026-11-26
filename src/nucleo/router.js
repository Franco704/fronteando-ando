// Rutas por hash (GitHub Pages no reescribe rutas): #/<lección>, #/quiz/<módulo>, #/simulacro/<parcial>, etc.
export const rutaActual = () => decodeURIComponent(location.hash.replace(/^#\/?/, ''));
// Vuelve a pintar la ruta actual (por ejemplo, "Hacer otro intento" en un simulacro)
export const repintar = () => dispatchEvent(new HashChangeEvent('hashchange'));
