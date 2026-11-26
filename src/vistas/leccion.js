// Una lección: teoría con sus laboratorios en vivo, laboratorios visuales y trampas de parcial, ejercicios con solución,
// mini-quiz con el formato del parcial, bibliografía y navegación.
import { $, h, esc, shuffle } from '../nucleo/dom.js';
import { LECCIONES, modulo, unidad, leccionesDe, videoDe } from '../temario/indice.js';
import { QUESTIONS } from '../banco/indice.js';
import { LESSON_TOPIC, TRAPS_AT, TOPICS } from '../banco/temas.js';
import { TRAPS } from '../banco/trampas.js';
import { LABS_AT, vlab } from '../laboratorios/indice.js';
import { montarEditor } from '../laboratorios/editor.js';
import { GLYPHS } from '../animaciones/glifos.js';
import { Quiz, startPractice, cleanup } from '../estudio/cuestionario.js';
import { hechas, alternarHecha, DB } from '../estudio/progreso.js';
import { pintarRiel } from '../ui/armazon.js';
import { mejorarCodigo } from '../ui/codigo.js';

const LEVEL = { 1: 'Básico', 2: 'Intermedio', 3: 'Desafío' };
function renderExercises(l) {
  let practice = 0;
  return (l.exercises || []).map((ex, i) => {
    const sol = ex.solution;
    const files = (sol.files || []).map((f) => `
      <div class="sol-file">
        ${f.name ? `<p class="sol-name">${f.name}</p>` : ''}
        <pre class="code" data-lang="${f.lang}">${esc(f.code.trim())}</pre>
      </div>`).join('');
    const tag = ex.official ? `Ejercicio de la cátedra ${ex.official}` : `Práctica ${++practice}`;
    return `
      <article class="exercise${ex.official ? ' official' : ''}">
        <header class="ex-head">
          <span class="ex-tag">${tag}</span>
          ${ex.level ? `<span class="ex-level" data-level="${ex.level}">${LEVEL[ex.level]}</span>` : ''}
        </header>
        <h3>${ex.title}</h3>
        <div class="ex-prompt">${ex.prompt}</div>
        ${ex.hints ? `<details class="hint"><summary>Ver pista</summary><ul>${ex.hints.map((x) => `<li>${x}</li>`).join('')}</ul></details>` : ''}
        <details class="solution">
          <summary>Ver solución</summary>
          <div class="sol-body">
            ${sol.explain ? `<div class="sol-explain">${sol.explain}</div>` : ''}
            ${files}
            ${sol.run ? `<button class="btn sm run-sol" type="button" data-ex="${i}">Probar la solución en un laboratorio</button><div class="sol-lab"></div>` : ''}
          </div>
        </details>
      </article>`;
  }).join('');
}

const renderSources = (l) => (l.sources || []).map((s) => `
  <details class="source">
    <summary><span>${s.title}</span><span class="host">${new URL(s.url).hostname.replace('www.', '')}</span></summary>
    <div class="source-body">
      <ul>${s.points.map((p) => `<li>${p}</li>`).join('')}</ul>
      <p><a href="${s.url}" target="_blank" rel="noopener">Leer la fuente completa</a></p>
    </div>
  </details>`).join('');

// 6 preguntas al azar del tema (3 rápidas y 3 de código), o todas
function miniQuiz(lessonId) {
  const t = LESSON_TOPIC[lessonId];
  const topics = lessonId === 'react-componentes-jsx' ? [t, 'react'] : [t];
  const qs = QUESTIONS.filter((q) => topics.includes(q.t));
  if (!qs.length) return null;
  const box = h('div', { class: 'inline-quiz' });
  const startMini = () => {
    const list = shuffle(qs.filter((q) => q.d === 'f')).slice(0, 3).concat(shuffle(qs.filter((q) => q.d === 'd')).slice(0, 3));
    new Quiz(box, { list: shuffle(list), mode: 'practice', inline: true }).start();
  };
  const s = DB.stats[t];
  box.append(h('div', { class: 'mq-inicio' },
    h('div', {}, h('h3', {}, `Mini-quiz: ${TOPICS[t]}`),
      h('p', { class: 'muted' }, `6 preguntas al azar (rápidas y de código) de un banco de ${qs.length}.` + (s ? ` Llevás ${s.ok}/${s.n} bien en este tema.` : ''))),
    h('div', { class: 'row' }, h('button', { class: 'btn primary', type: 'button', onclick: startMini }, 'Empezar'),
      h('button', { class: 'btn', type: 'button', onclick: () => startPractice(shuffle(qs), 'Todas las preguntas: ' + TOPICS[t], null, lessonId) }, `Todas (${qs.length})`))));
  return box;
}

// Laboratorios visuales + trampas (en #fxLabs) y mini-quiz (en #fxQuiz)
function montarPractica(lessonId, root) {
  const labsSlot = $('#fxLabs', root), quizSlot = $('#fxQuiz', root);
  const ids = LABS_AT[lessonId] || [];
  const trapTopic = Object.keys(TRAPS_AT).find((t) => TRAPS_AT[t] === lessonId);
  if (ids.length) labsSlot.append(h('h2', {}, 'Laboratorios visuales'),
    h('p', { class: 'sec-lede' }, 'Simuladores para ver por dentro lo que acabás de leer: tocá, avanzá paso a paso, rompé cosas.'),
    h('div', { class: 'fx vlabs' }, ids.map(vlab)));
  if (trapTopic && TRAPS[trapTopic]) labsSlot.append(h('div', { class: 'fx' },
    h('div', { class: 'traps' }, h('p', { class: 'h' }, `console.warn("Trampas de parcial: ${TOPICS[trapTopic]}")`), h('ul', {}, TRAPS[trapTopic].map((x) => h('li', { html: x }))))));
  if (!labsSlot.children.length) labsSlot.remove();
  const mq = LESSON_TOPIC[lessonId] && miniQuiz(lessonId);
  if (mq) quizSlot.append(h('h2', {}, 'Autoevaluación'), h('p', { class: 'sec-lede' }, 'Preguntas con el formato del parcial. Las de código se pueden ejecutar de verdad.'), h('div', { class: 'fx' }, mq));
  else quizSlot.remove();
}

export function vistaLeccion(main, idx) {
  cleanup();
  const l = LECCIONES[idx];
  const m = modulo(l.module);
  const u = unidad(m.unit);
  const prev = LECCIONES[idx - 1], next = LECCIONES[idx + 1];
  const labs = l.labs || [];
  const delModulo = leccionesDe(m.id);
  document.body.dataset.unit = m.unit;
  document.title = `${l.title}, Fronteando Ando`;

  // Laboratorios no ubicados en el cuerpo se agregan al final de la teoría
  const placed = new Set([...l.body.matchAll(/data-lab="(\d+)"/g)].map((x) => +x[1]));
  const rest = labs.map((_, i) => i).filter((i) => !placed.has(i)).map((i) => `<div class="lab-mount" data-lab="${i}"></div>`).join('');
  const exercises = renderExercises(l);
  const sources = renderSources(l);
  const glifo = GLYPHS[LESSON_TOPIC[l.id]];

  main.innerHTML = `
    <article class="lesson">
      <header class="lesson-head">
        <p class="crumb"><span class="chip-unidad">${u.title}</span><a href="#/${delModulo[0].id}">${m.title}</a></p>
        ${glifo ? `<div class="fx lesson-glyph" aria-hidden="true">${glifo}</div>` : ''}
        <h1>${l.title}</h1>
        <p class="lesson-pos">Lección ${delModulo.indexOf(l) + 1} de ${delModulo.length} de ${m.title}, ${idx + 1} de ${LECCIONES.length} en total</p>
      </header>
      <p class="tldr">${l.tldr}</p>
      <details class="lesson-video"><summary>Ver el video resumen de esta lección</summary>
        <video controls playsinline preload="none" src="${videoDe(idx)}"></video>
        <a href="#/videos/${l.id}">Ver todos los videos de corrido desde acá</a></details>
      ${l.goals ? `<div class="goals"><p>Al terminar vas a poder:</p><ul>${l.goals.map((g) => `<li>${g}</li>`).join('')}</ul></div>` : ''}
      <div class="body">${l.body}${rest}</div>
      <section id="fxLabs" class="visuales"></section>
      ${exercises ? `<section class="practice" id="ejercicios"><h2>Ejercicios</h2><p class="sec-lede">Intentalos antes de abrir la solución. Equivocarse acá es gratis.</p>${exercises}</section>` : ''}
      <section id="fxQuiz" class="practice"></section>
      ${sources ? `<section class="sources" id="bibliografia"><h2>Bibliografía</h2><p class="sec-lede">Resumen de cada fuente oficial. Abrí la que quieras profundizar.</p>${sources}</section>` : ''}
      <div class="done-row">
        <button class="btn done-btn" type="button" aria-pressed="${hechas.has(l.id)}">${hechas.has(l.id) ? 'Lección completada' : 'Marcar como completada'}</button>
        <span class="kbd-hint">Siguiente lección: <kbd>→</kbd></span>
      </div>
      <nav class="pager" aria-label="Lecciones">
        ${prev ? `<a class="prev" href="#/${prev.id}"><small>Anterior</small><strong>${prev.title}</strong></a>` : '<span></span>'}
        ${next ? `<a class="next" href="#/${next.id}"><small>Siguiente</small><strong>${next.title}</strong></a>` : '<a class="next" href="#/simulacro"><small>Para cerrar</small><strong>Simulacro de parcial</strong></a>'}
      </nav>
    </article>`;

  mejorarCodigo(main);
  main.querySelectorAll('.lab-mount').forEach((el) => { const lab = labs[+el.dataset.lab]; if (lab) montarEditor(el, lab); });
  main.querySelectorAll('.run-sol').forEach((btn) => btn.addEventListener('click', () => {
    const ex = l.exercises[+btn.dataset.ex];
    montarEditor(btn.nextElementSibling, { title: 'solución', ...ex.solution.run });
    btn.remove();
  }));
  montarPractica(l.id, main);
  $('.done-btn', main).addEventListener('click', (e) => {
    const on = alternarHecha(l.id);
    e.currentTarget.setAttribute('aria-pressed', on);
    e.currentTarget.textContent = on ? 'Lección completada' : 'Marcar como completada';
  });
  pintarRiel(main);
}
