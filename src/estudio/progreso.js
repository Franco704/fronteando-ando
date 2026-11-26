// Progreso del alumno, guardado en el navegador con las claves de la versión anterior (nadie pierde lo hecho):
// fa-done = lecciones completadas; fa-practica = estadísticas por tema, errores, proyectos, historial y ajustes del simulacro.
import { almacen } from '../nucleo/almacen.js';
import { LECCIONES } from '../temario/indice.js';

export const hechas = new Set(almacen.leer('fa-done', []));

export const DB = (() => {
  const d = almacen.leer('fa-practica', {}) || {};
  d.seen = d.seen || {}; d.stats = d.stats || {}; d.wrong = d.wrong || []; d.proj = d.proj || {}; d.hist = d.hist || [];
  d.set = Object.assign({ t40: 20, t10: 25, unit: 'both' }, d.set || {}); delete d.set.react; d.lastMod = d.lastMod || 'web';
  return d;
})();

const oyentes = new Set();
export const alCambiarProgreso = (fn) => oyentes.add(fn);
const avisar = () => oyentes.forEach((fn) => fn());

export function save() { almacen.guardar('fa-practica', DB); avisar(); }

export function alternarHecha(id) {
  hechas.has(id) ? hechas.delete(id) : hechas.add(id);
  almacen.guardar('fa-done', [...hechas]);
  avisar();
  return hechas.has(id);
}

// Una respuesta: suma a las estadísticas del tema y entra o sale de la lista de errores
export function record(q, right) {
  const s = DB.stats[q.t] = DB.stats[q.t] || { n: 0, ok: 0 };
  s.n++; if (right) s.ok++;
  const i = DB.wrong.indexOf(q.id);
  if (right && i >= 0) DB.wrong.splice(i, 1);
  if (!right && i < 0) DB.wrong.push(q.id);
  save();
}

export const siguienteLeccion = () => LECCIONES.find((l) => !hechas.has(l.id)) || LECCIONES[0];
export const hechasDe = (lecciones) => lecciones.filter((l) => hechas.has(l.id)).length;
// Aciertos de un tema (0–100), o null si todavía no respondió ninguna
export const aciertos = (t) => { const s = DB.stats[t]; return s?.n ? Math.round((s.ok / s.n) * 100) : null; };
