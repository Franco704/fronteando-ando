// Vistas de práctica: simulacro, repaso de errores, modelos de parcial, preguntas de Moyano,
// práctica por diapositivas y proyectos. Todas usan el mismo motor (estudio/cuestionario.js).
import { $$, h, shuffle } from '../nucleo/dom.js';
import { QUESTIONS, QBY } from '../banco/indice.js';
import { TOPICS, TOPIC_LESSON, UNIT4, UNIT5, unitTopics } from '../banco/temas.js';
import { PARCIALES, MOYANO, DIAPOSITIVAS } from '../examenes/indice.js';
import { PROJECTS } from '../proyectos/proyectos.js';
import { DB, save } from '../estudio/progreso.js';
import { Quiz, view, go, startExam, startPractice, startModel, examenActivo, tomarTerminado } from '../estudio/cuestionario.js';
import { fmt } from '../ui/codigo.js';

const cabecera = (titulo, bajada) => h('header', { class: 'vista-cabeza' }, h('h1', {}, titulo), bajada ? h('p', { class: 'tldr' }, ...[bajada].flat()) : null);
const subtitulo = (t, extra) => h('div', { class: 'sec-h' }, h('h2', {}, t), extra ? h('span', { class: 'muted' }, extra) : null);

// ---------- Simulacro ----------
export function vistaSimulacro() {
  const v = view();
  const terminado = tomarTerminado();
  if (terminado) { const box = h('div'); v.append(box); terminado.root = box; terminado.results(terminado.timedOut); return; }
  const activo = examenActivo();
  if (activo) {
    const box = h('div'); v.append(box);
    if (!activo.started) { activo.started = true; activo.root = box; activo.start(); }
    else activo.attach(box);
    return;
  }
  const timeChips = (key, vals) => h('div', { class: 'opts-row', role: 'group', 'aria-label': 'Tiempo' }, h('span', { class: 'lbl' }, 'Tiempo'), vals.map((t) => h('button', { class: 'chip' + (DB.set[key] === t ? ' on' : ''), type: 'button', 'aria-pressed': String(DB.set[key] === t), onclick: (e) => { DB.set[key] = t; save(); $$('.chip', e.currentTarget.parentNode).forEach((c) => { c.classList.toggle('on', c === e.currentTarget); c.setAttribute('aria-pressed', String(c === e.currentTarget)); }); } }, t + ' min')));
  const tp = unitTopics(DB.set.unit);
  const nE = QUESTIONS.filter((q) => q.d === 'f' && tp.includes(q.t)).length, nD = QUESTIONS.filter((q) => q.d === 'd' && tp.includes(q.t)).length;
  const UN = { both: 'las Unidades IV y V', '4': 'la Unidad IV', '5': 'la Unidad V' };
  v.append(cabecera('Simulacro', 'Los dos formatos que puede tener el parcial. Durante el simulacro no ves las respuestas; al entregar, revisás cada una con su explicación.'));
  v.append(h('div', { class: 'opts-row', role: 'group', 'aria-label': 'Temas' }, h('span', { class: 'lbl' }, 'Temas'), [['both', 'Unidad IV + V'], ['4', 'Solo Unidad IV'], ['5', 'Solo Unidad V']].map(([k, l]) => h('button', { class: 'chip' + (DB.set.unit === k ? ' on' : ''), type: 'button', 'aria-pressed': String(DB.set.unit === k), onclick: () => { DB.set.unit = k; save(); vistaSimulacro(); } }, l))));
  v.append(h('div', { class: 'mode-cards' },
    h('div', { class: 'mode' }, h('h2', {}, h('span', { class: 'n' }, '40'), ' rápidas'), h('p', {}, `Preguntas cortas de ${UN[DB.set.unit]}, sorteadas de un banco de ${nE} y repartidas entre temas. Respondés y pasa sola a la siguiente; podés volver con la grilla.`), timeChips('t40', [15, 20, 30, 40]), h('button', { class: 'btn primary', type: 'button', onclick: () => startExam('40') }, 'Empezar 40 rápidas')),
    h('div', { class: 'mode' }, h('h2', {}, h('span', { class: 'n' }, '10'), ' difíciles'), h('p', {}, `Leer código: qué imprime, qué se ve en pantalla, dónde está el error, qué regla gana. Sorteadas de ${nD}, de temas distintos.`), timeChips('t10', [15, 25, 35, 45]), h('button', { class: 'btn primary', type: 'button', onclick: () => startExam('10') }, 'Empezar 10 difíciles'))));
  v.append(subtitulo('Práctica por tema', 'Con la explicación después de cada respuesta'));
  const chip = (t) => { const s = DB.stats[t], n = QUESTIONS.filter((q) => q.t === t).length; return h('button', { class: 'chip', type: 'button', onclick: () => startPractice(shuffle(QUESTIONS.filter((q) => q.t === t)), 'Práctica: ' + TOPICS[t]) }, `${TOPICS[t]}, ${n}` + (s ? `, ${Math.round(s.ok / s.n * 100)} %` : '')); };
  v.append(h('h3', { class: 'lbl-u', 'data-u': 'u4' }, 'Unidad IV'), h('div', { class: 'topic-grid' }, UNIT4.map(chip)), h('h3', { class: 'lbl-u', 'data-u': 'u5' }, 'Unidad V'), h('div', { class: 'topic-grid' }, UNIT5.map(chip)));
  const wr = DB.wrong.map(QBY).filter(Boolean);
  v.append(h('div', { class: 'row acciones' }, h('a', { class: 'btn', href: '#/repaso' }, `Repasar mis errores (${wr.length})`), h('button', { class: 'btn', type: 'button', onclick: () => startPractice(shuffle(QUESTIONS.filter((q) => q.d === 'd' && tp.includes(q.t))), 'Todas las de código') }, `Todas las de código (${nD})`)));
  if (DB.hist.length) {
    v.append(subtitulo('Tus últimos simulacros'));
    v.append(h('div', { class: 'tbl' }, h('table', {}, h('thead', {}, h('tr', {}, h('th', {}, 'Fecha'), h('th', {}, 'Formato'), h('th', {}, 'Resultado'), h('th', {}, 'Tiempo'))), h('tbody', {}, DB.hist.map((x) => h('tr', {}, h('td', {}, new Date(x.d).toLocaleString('es-AR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })), h('td', {}, (x.k === '40' ? '40 rápidas' : x.k === '10' ? '10 difíciles' : x.k) + (x.u ? ', ' + ({ both: 'IV + V', '4': 'IV', '5': 'V' })[x.u] : '')), h('td', { class: 'mono' }, `${x.ok}/${x.n} (${Math.round(x.ok / x.n * 100)} %)`), h('td', { class: 'mono' }, `${Math.floor(x.s / 60)}:${String(x.s % 60).padStart(2, '0')}`)))))));
  }
}

// ---------- Repaso de errores ----------
export function vistaRepaso() {
  const v = view();
  document.title = 'Repasar errores, Fronteando Ando';
  const wr = DB.wrong.map(QBY).filter(Boolean);
  v.append(cabecera('Repasar mis errores', wr.length
    ? `Las ${wr.length} ${wr.length === 1 ? 'pregunta que fallaste' : 'preguntas que fallaste'} en mini-quizzes, simulacros y modelos de parcial. Cuando acertás una, sale de la lista.`
    : 'Todavía no hay errores para repasar. Las preguntas que falles en los mini-quizzes, el simulacro o los modelos de parcial aparecen acá hasta que las aciertes.'));
  if (!wr.length) { v.append(h('div', { class: 'row acciones' }, h('a', { class: 'btn primary', href: '#/simulacro' }, 'Hacer un simulacro'), h('a', { class: 'btn', href: '#/parciales' }, 'Ver los modelos de parcial'))); return; }
  const porTema = {};
  wr.forEach((q) => (porTema[q.t] = (porTema[q.t] || 0) + 1));
  v.append(h('ul', { class: 'repaso-temas', 'aria-label': 'Errores por tema' }, Object.entries(porTema).sort((a, b) => b[1] - a[1]).map(([t, n]) => h('li', {}, h('a', { href: '#/' + TOPIC_LESSON[t] }, TOPICS[t]), h('span', {}, n)))));
  const box = h('div'); v.append(box);
  new Quiz(box, { list: shuffle(wr), mode: 'practice', back: 'repaso', onExit: () => go('repaso') }).start();
}

// ---------- Exámenes fijos ----------
function modelCards(MODELOS, back) {
  return h('div', { class: 'mode-cards' }, MODELOS.map((m) => {
    const nD = m.qs.filter((q) => q.d === 'd').length;
    const last = DB.hist.find((x) => x.k === m.name);
    return h('div', { class: 'mode' },
      h('h2', {}, h('span', { class: 'n' }, m.qs.length), ' ' + m.name),
      m.desc ? h('p', {}, m.desc) : null,
      h('p', { class: 'muted' }, m.rango ? `Diapositivas ${m.rango}, ${m.min} min` : `${m.qs.length - nD} conceptuales, ${nD} de código, ${m.min} min`, last ? `. Último intento: ${last.ok}/${last.n}` : ''),
      h('div', { class: 'row' },
        h('button', { class: 'btn primary', type: 'button', onclick: () => (m.rango ? startPractice(shuffle(m.qs), m.name, null, back) : startModel(m, back)) }, m.rango ? 'Practicar' : 'Rendir con tiempo'),
        h('button', { class: 'btn', type: 'button', onclick: () => (m.rango ? startModel(m, back) : startPractice(m.qs, 'Práctica: ' + m.name, null, back)) }, m.rango ? 'Rendir con tiempo' : 'Practicar con explicación')));
  }));
}

export function vistaParciales() {
  const v = view();
  v.append(cabecera('Modelos de parcial', ['Exámenes armados con el estilo del profesor: enunciados largos y teóricos, cuatro opciones parecidas y alguna pregunta de leer código. Rendilos con tiempo y sin ver las respuestas, o practicalos con la explicación después de cada pregunta. Antes de rendir, repasá el ', h('a', { href: '#/resumen' }, 'resumen para el parcial'), '.']));
  v.append(modelCards(PARCIALES, 'parciales'));
}

export function vistaMoyano() {
  const v = view();
  const all = MOYANO.flatMap((m) => m.qs);
  v.append(cabecera('Preguntas de Moyano', `${all.length} preguntas de los PDFs del profesor. Enunciados, opciones y respuestas copiados tal cual, sin agregar nada. Las de “seleccioná todas las que correspondan” aparecen como una sola opción con la combinación.`));
  v.append(h('div', { class: 'row acciones' }, h('button', { class: 'btn primary', type: 'button', onclick: () => startPractice(shuffle(all), 'Moyano: todas mezcladas', null, 'moyano') }, `Mezclar todas (${all.length})`)));
  v.append(modelCards(MOYANO, 'moyano'));
}

export function vistaDiapositivas() {
  const v = view();
  const all = DIAPOSITIVAS.flatMap((b) => b.qs);
  v.append(cabecera('Práctica por diapositivas', `${all.length} preguntas de las Unidades IV y V. Cada una sale de una diapositiva concreta (te lo indica la explicación con 📍). Están armadas para que no alcance con reconocer palabras: las opciones incorrectas suelen ser la definición de otro concepto de la misma diapositiva.`));
  v.append(h('div', { class: 'row acciones' },
    h('button', { class: 'btn primary', type: 'button', onclick: () => startPractice(shuffle(all), 'Todas las diapositivas, mezcladas', null, 'diapositivas') }, `Mezclar todas (${all.length})`),
    ['IV', 'V'].map((u) => { const qs = DIAPOSITIVAS.filter((b) => b.u === u).flatMap((b) => b.qs); return h('button', { class: 'btn', type: 'button', onclick: () => startPractice(shuffle(qs), 'Unidad ' + u + ', mezclada', null, 'diapositivas') }, `Solo Unidad ${u} (${qs.length})`); })));
  ['IV', 'V'].forEach((u) => {
    v.append(h('div', { class: 'sec-h', 'data-u': u === 'IV' ? 'u4' : 'u5' }, h('h2', {}, 'Unidad ' + u)));
    v.append(modelCards(DIAPOSITIVAS.filter((b) => b.u === u), 'diapositivas'));
  });
}

// ---------- Proyectos ----------
export function vistaProyectos() {
  const v = view();
  v.append(cabecera('Proyectos para comprobar si sabés', 'Ordenados por dificultad. Cada uno tiene requisitos (tildalos a medida que los cumplís) y pruebas de fuego: situaciones que solo pasás si entendiste el tema de verdad. Si te trabás, los chips te llevan a la lección que tenés que repasar.'));
  v.append(h('div', { class: 'projs' }, PROJECTS.map((p, pi) => {
    const done = DB.proj[p.id] = DB.proj[p.id] || [];
    const pct = h('span', { class: 'pct' });
    const upd = () => { pct.textContent = `${done.length}/${p.reqs.length}`; };
    const checks = h('div', { class: 'checks' }, p.reqs.map((r, i) => {
      const cb = h('input', { type: 'checkbox', id: `pj-${p.id}-${i}`, checked: done.includes(i) });
      const lab = h('label', { for: `pj-${p.id}-${i}`, class: done.includes(i) ? 'done' : '' }, cb, h('span', { html: fmt(r) }));
      cb.addEventListener('change', () => { const k = done.indexOf(i); if (cb.checked && k < 0) done.push(i); if (!cb.checked && k >= 0) done.splice(k, 1); lab.classList.toggle('done', cb.checked); save(); upd(); });
      return lab;
    }));
    upd();
    return h('details', { class: 'proj', open: pi === 1 },
      h('summary', {}, h('span', { class: 'lvl', title: 'Dificultad ' + p.lvl + ' de 4' }, h('span', { class: 'sr-only' }, `Dificultad ${p.lvl} de 4, `), [1, 2, 3, 4].map((k) => h('i', { class: k <= p.lvl ? 'f' : '' })), ' ' + p.time), h('div', {}, h('h3', {}, p.name), h('p', { class: 'pitch' }, p.pitch)), pct),
      h('div', { class: 'body' },
        h('div', { class: 'col' }, h('span', { class: 'lbl' }, 'Requisitos'), checks),
        h('div', { class: 'col' }, h('div', { class: 'fire' }, h('span', { class: 'lbl' }, 'Pruebas de fuego'), h('ul', {}, p.tests.map((t) => h('li', { html: fmt(t) })))),
          h('div', {}, h('span', { class: 'lbl' }, 'Temas que pone a prueba'), h('div', { class: 'row' }, p.mods.map((id) => h('a', { class: 'chip', href: '#/' + (TOPIC_LESSON[id] || 'react-componentes-jsx') }, TOPICS[id] || 'React')))))));
  })));
}
