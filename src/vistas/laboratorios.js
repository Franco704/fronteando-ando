// Todos los laboratorios visuales en un solo lugar, por unidad y lección. Se montan al acercarse a la pantalla
// (los de React cargan la librería recién ahí).

import { UNIDADES, LECCIONES, modulo } from '../temario/indice.js';
import { LABS_AT, vlab } from '../laboratorios/indice.js';

let observador = null;
export function vistaLaboratorios(main) {
  document.title = 'Laboratorios, Fronteando Ando';
  observador?.disconnect();
  const todos = LECCIONES.filter((l) => LABS_AT[l.id]).map((l) => ({ l, u: modulo(l.module).unit, ids: LABS_AT[l.id] }));
  const n = todos.reduce((a, x) => a + x.ids.length, 0);
  main.innerHTML = `
    <article class="lesson labs-page">
      <h1>Laboratorios</h1>
      <p class="tldr">Los ${n} laboratorios visuales de la guía en un solo lugar: la URL por partes, el event loop paso a paso, los métodos de array, la especificidad, flexbox, el Virtual DOM, el ciclo de vida con React real y el router con rutas privadas. Cada lección tiene además sus laboratorios de código, donde editás y ves el resultado al instante.</p>
      <nav class="filtro" aria-label="Ir a una unidad">${UNIDADES.map((u) => `<a class="btn sm" href="#lab-${u.id}" data-u="${u.id}">${u.title}</a>`).join('')}</nav>
      ${UNIDADES.map((u) => `<section class="labs-unidad" data-u="${u.id}" id="lab-${u.id}"><h2>${u.title}<span>${u.name}</span></h2>
        ${todos.filter((x) => x.u === u.id).map((x) => `<div class="labs-item"><p class="labs-de"><a href="#/${x.l.id}">${x.l.title}</a></p>${x.ids.map((id) => `<div class="fx labs-slot" data-vlab="${id}"></div>`).join('')}</div>`).join('')}
      </section>`).join('')}
    </article>`;
  observador = new IntersectionObserver((entradas) => entradas.forEach((en) => {
    if (!en.isIntersecting) return;
    observador.unobserve(en.target);
    en.target.append(vlab(en.target.dataset.vlab));
  }), { rootMargin: '400px 0px' });
  main.querySelectorAll('[data-vlab]').forEach((el) => observador.observe(el));
}
