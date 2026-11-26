// Las lecciones en orden de cursada. El orden importa: numera los videos (videos/NN-<id>.mp4).
import web from './unidad-iv/como-funciona-la-web.js';
import html from './unidad-iv/html.js';
import css from './unidad-iv/css.js';
import js1 from './unidad-iv/javascript-lenguaje-dom-y-eventos.js';
import js2 from './unidad-iv/javascript-asincronia-formularios-y-datos.js';
import entorno from './unidad-v/entorno-moderno.js';
import react1 from './unidad-v/react-componentes-estado-y-hooks.js';
import react2 from './unidad-v/react-formularios-arquitectura-y-rutas.js';

export const LESSONS = [web, html, css, js1, js2, entorno, react1, react2].flat();
