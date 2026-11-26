// Autocomprobación del contenido. Uso: npm test (o node tests/contenido.test.js)
import assert from 'node:assert';
import { LECCIONES, MODULOS, UNIDADES } from '../src/temario/indice.js';
import { QUESTIONS } from '../src/banco/indice.js';
import { LESSON_TOPIC, TOPIC_LESSON, TRAPS_AT, TOPICS, UNIT4, UNIT5 } from '../src/banco/temas.js';
import { TRAPS } from '../src/banco/trampas.js';
import { META } from '../src/banco/entradas.js';
import { HOT } from '../src/banco/probables.js';
import { PARCIALES, MOYANO, DIAPOSITIVAS } from '../src/examenes/indice.js';
import { PROJECTS } from '../src/proyectos/proyectos.js';
import { RESUMEN } from '../src/resumenes/para-el-parcial.js';
import { CONCEPTUAL } from '../src/resumenes/conceptual.js';
import { VLABS } from '../src/laboratorios/fichas.js';
import { GLYPHS } from '../src/animaciones/glifos.js';

const ids = new Set(LECCIONES.map((l) => l.id));
assert.strictEqual(ids.size, LECCIONES.length, 'ids de lección repetidos');
for (const l of LECCIONES) {
  assert(MODULOS.some((m) => m.id === l.module), `módulo inexistente en ${l.id}`);
  assert(l.title && l.tldr && l.body, `lección incompleta ${l.id}`);
  [...l.body.matchAll(/data-lab="(\d+)"/g)].forEach((m) => assert(l.labs?.[+m[1]], `lab(${m[1]}) sin definir en ${l.id}`));
  for (const lab of l.labs || []) assert(lab.mode === 'react' ? lab.jsx : lab.html !== undefined || lab.js !== undefined, `laboratorio vacío en ${l.id}`);
  for (const e of l.exercises || []) assert(e.title && e.prompt && e.solution && (e.solution.explain || e.solution.files?.length), `ejercicio incompleto en ${l.id}`);
  for (const s of l.sources || []) assert(new URL(s.url) && s.points.length, `fuente inválida en ${l.id}`);
  assert(LESSON_TOPIC[l.id] && TOPICS[LESSON_TOPIC[l.id]], `lección sin tema del banco: ${l.id}`);
}
assert(MODULOS.every((m) => UNIDADES.some((u) => u.id === m.unit)), 'módulo sin unidad');

// Banco: ids únicos y estables, o[0] es la correcta, opciones sin repetir, tema conocido
const qids = new Set();
for (const q of QUESTIONS) {
  assert(q.id && !qids.has(q.id), `id de pregunta faltante o repetido: ${q.id}`); qids.add(q.id);
  assert(TOPICS[q.t], `tema desconocido en ${q.id}: ${q.t}`);
  assert(q.q && q.o.length >= 2 && q.o.every(Boolean), `pregunta incompleta ${q.id}`);
  assert(new Set(q.o).size === q.o.length, `opciones repetidas en ${q.id}`);
  assert(['f', 'd'].includes(q.d) && (q.d === 'f' || q.c), `pregunta de código sin código: ${q.id}`);
}
for (const id of ['f-web-1', 'real2-1', 'u4-web-1', 'u5-router-16', 'moy-auto-10']) assert(qids.has(id), `cambió el id ${id}: se perdería el progreso guardado`);
for (const ex of [...PARCIALES, ...MOYANO, ...DIAPOSITIVAS]) assert(ex.qs.length && ex.min > 0 && ex.name, `examen incompleto ${ex.id}`);

// Tablas de temas: todo apunta a lecciones y temas que existen
for (const t of [...UNIT4, ...UNIT5]) assert(TOPICS[t] && META[t] && ids.has(TOPIC_LESSON[t]), `tema ${t} incompleto`);
for (const [t, l] of Object.entries(TRAPS_AT)) assert(ids.has(l) && TRAPS[t]?.length, `trampas de ${t} mal ubicadas`);
for (const x of HOT) assert(TOPIC_LESSON[x.mod] && x.lvl >= 1 && x.lvl <= 3, `tema probable inválido: ${x.txt}`);
for (const p of PROJECTS) for (const m of p.mods) assert(TOPICS[m] || m === 'react', `proyecto ${p.id} con tema ${m} desconocido`);
for (const it of [...RESUMEN, ...CONCEPTUAL].flatMap((u) => u.items)) assert(ids.has(it.lesson) && it.html, `ficha de resumen ${it.id} sin lección`);
for (const t of Object.values(LESSON_TOPIC)) assert(GLYPHS[t], `tema ${t} sin glifo`);
assert(Object.values(VLABS).every((v) => v.title && v.sub), 'laboratorio visual sin título');

const n = (k) => LECCIONES.reduce((a, l) => a + (l[k]?.length || 0), 0);
console.log(`contenido OK: ${LECCIONES.length} lecciones, ${n('labs')} laboratorios de código, ${Object.keys(VLABS).length} visuales, ${n('exercises')} ejercicios, ${QUESTIONS.length} preguntas, ${PARCIALES.length + MOYANO.length} exámenes y ${DIAPOSITIVAS.length} bloques de diapositivas`);
