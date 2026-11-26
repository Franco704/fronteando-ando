// Resumen para el parcial (#/resumen, fichas comparativas) y Resumen conceptual (#/conceptual, para leer de corrido).

import { RESUMEN } from '../resumenes/para-el-parcial.js';
import { CONCEPTUAL } from '../resumenes/conceptual.js';
import { mejorarCodigo } from '../ui/codigo.js';

const PAGINAS = {
  resumen: {
    prefix: 'r', title: 'Resumen para el parcial', units: RESUMEN,
    tldr: 'Lo que tenés que saber sí o sí, tema por tema. El parcial es multiple choice conceptual: las opciones se parecen mucho, así que fijate en las diferencias de estas tablas. Si preferís leerlo de corrido, está el <a href="#/conceptual">resumen conceptual</a>. Después probá con los <a href="#/parciales">modelos de parcial</a>.',
  },
  conceptual: {
    prefix: 'c', title: 'Resumen conceptual', units: CONCEPTUAL,
    tldr: 'La teoría de las Unidades IV y V para leer de corrido antes del parcial. Los temas marcados con “salió en el parcial” fueron preguntas del 2do parcial real. Para las tablas comparativas, mirá el <a href="#/resumen">resumen para el parcial</a>.',
  },
};

export function vistaResumen(main, ruta) {
  const page = PAGINAS[ruta];
  document.title = `${page.title}, Fronteando Ando`;
  const all = page.units.flatMap((u) => u.items);
  main.innerHTML = `
    <article class="lesson resumen">
      <h1>${page.title}</h1>
      <p class="tldr">${page.tldr}</p>
      <nav class="sum-index" aria-label="Temas del resumen">${all.map((it) => `<a href="#${page.prefix}-${it.id}">${it.title}</a>`).join('')}</nav>
      ${page.units.map((u, i) => `<h2 data-u="u${i + 4}">${u.unit}</h2><div class="sum-grid">${u.items.map((it) => `
        <section class="sum-card" id="${page.prefix}-${it.id}">
          <h3>${it.title}</h3>
          ${it.html}
          <p class="sum-more"><a href="#/${it.lesson}">Repasar la lección</a></p>
        </section>`).join('')}</div>`).join('')}
      <div class="done-row"><a class="btn primary" href="#/parciales">Probar un modelo de parcial</a></div>
    </article>`;
  mejorarCodigo(main);
}

