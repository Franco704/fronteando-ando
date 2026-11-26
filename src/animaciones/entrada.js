/* Pantalla de entrada al cambiar de tema: la etiqueta de la lección se tipea, se enciende el recorrido
   del navegador (o el de React en la Unidad V) y aparece la trampa típica del tema.
   Adaptada del "Laboratorio Frontend DSW" de Mateo Rusconi. main.js la llama al entrar a una lección. */
import { h, fxHost, sinMovimiento } from '../nucleo/dom.js';
import { LECCIONES } from '../temario/indice.js';
import { LESSON_TOPIC } from '../banco/temas.js';
import { META } from '../banco/entradas.js';

const ETAPAS = {
  4: ['HTML', 'DOM', 'CSSOM', 'Render tree', 'Layout', 'Paint'],
  5: ['JSX', 'createElement', 'Virtual DOM', 'Diff', 'Commit', 'DOM'],
};

function interstitial(mod) {
  return new Promise((res) => {
    const tagText = `<leccion-${String(mod.n).padStart(2, '0')} ${mod.tag}>`;
    const typed = h('p', { class: 'typed', 'aria-hidden': 'true' }, tagText);
    typed.style.setProperty('--steps', tagText.length);
    const pipe = h('p', { class: 'pipe', 'aria-hidden': 'true' }, ETAPAS[mod.unit === 5 ? 5 : 4].flatMap((s, i) => {
      const sp = h('span', { class: 's' }, s);
      sp.style.animationDelay = `${0.35 + i * 0.16}s`;
      return i ? [h('span', { class: 'ar' }, '→'), sp] : [sp];
    }));
    const el = h('div', { class: 'inter', role: 'dialog', 'aria-modal': 'true', tabindex: '-1', 'data-u': mod.unit === 5 ? 'u5' : 'u4', 'aria-label': `Lección ${mod.n}: ${mod.title}` },
      h('div', { class: 'box' }, typed, h('h2', {}, mod.title), pipe,
        h('p', { class: 'teaser' }, h('span', { class: 'lbl' }, 'Trampa de este tema'), mod.teaser),
        h('p', { class: 'skip' }, 'Tocá o presioná una tecla para entrar')));
    let cerrada = false;
    const end = (e) => {
      if (cerrada) return;
      cerrada = true;
      // La tecla que cierra no llega a los atajos de la guía (flechas, /, Escape)
      if (e?.type === 'keydown') { e.preventDefault(); e.stopPropagation(); }
      window.removeEventListener('keydown', end, true);
      el.classList.add('out');
      setTimeout(() => el.remove(), 330);
      res();
    };
    el.addEventListener('click', end);
    window.addEventListener('keydown', end, true);
    fxHost().append(el);
    el.focus();
    setTimeout(end, 2700);
  });
}

// Al entrar a una lección de otro tema. skip = true solo registra el tema (primera carga de la página).
let lastTopic = null;
export function entrada(lessonId, skip) {
  const t = LESSON_TOPIC[lessonId];
  if (!t || t === lastTopic) return Promise.resolve();
  lastTopic = t;
  if (skip || sinMovimiento()) return Promise.resolve();
  const i = LECCIONES.findIndex((l) => l.id === lessonId);
  return interstitial({ n: i + 1, title: LECCIONES[i].title, ...META[t] });
}
