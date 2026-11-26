// Todo el temario listo para las vistas, más las consultas que usan.
import { UNIDADES, MODULOS } from './catalogo.js';
import { LESSONS } from './lecciones.js';

export { UNIDADES, MODULOS };
export const LECCIONES = LESSONS;
export const EJERCICIOS = LECCIONES.flatMap((l) => (l.exercises || []).map((ex) => ({ ex, l })));

export const unidad = (id) => UNIDADES.find((u) => u.id === id);
export const modulo = (id) => MODULOS.find((m) => m.id === id);
export const leccionesDe = (modId) => LECCIONES.filter((l) => l.module === modId);
// Video de cada lección: videos/NN-<id>.mp4, numerado según el orden de las lecciones
export const videoDe = (i) => `videos/${String(i + 1).padStart(2, '0')}-${LECCIONES[i].id}.mp4`;
