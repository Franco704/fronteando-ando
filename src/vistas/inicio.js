// Portada: el título de la guía lo decide la cascada. Varias reglas CSS compiten por él como en el panel
// Estilos de DevTools; la especificidad la calcula la misma función del laboratorio de especificidad y el
// navegador aplica las reglas de verdad (el valor final se lee con getComputedStyle).
// Después: las dos unidades con su avance, la práctica para el parcial, lo más probable y las otras guías.
import { $, esc } from '../nucleo/dom.js';
import { UNIDADES, MODULOS, LECCIONES, EJERCICIOS, leccionesDe } from '../temario/indice.js';
import { QUESTIONS, QBY } from '../banco/indice.js';
import { TOPIC_LESSON } from '../banco/temas.js';
import { HOT } from '../banco/probables.js';
import { DIAPOSITIVAS } from '../examenes/indice.js';
import { LABS_AT } from '../laboratorios/indice.js';
import { specificity } from '../laboratorios/visuales-web.js';
import { hechas, hechasDe, siguienteLeccion, DB } from '../estudio/progreso.js';
import { OTRAS_GUIAS } from '../estudio/otras-guias.js';
import { icono } from '../ui/iconos.js';

const REPO = 'https://github.com/Franco704/fronteando-ando';

// Las reglas que compiten por el título, en orden de aparición en la hoja (el orden desempata)
const REGLAS = [
  { sel: 'h1', prop: 'font-weight', val: '300', imp: false },
  { sel: '.hero h1', prop: 'font-weight', val: '560' },
  { sel: '#titulo', prop: 'font-weight', val: '900' },
  { sel: '.titulo', prop: 'font-variation-settings', val: '"CASL" 0' },
  { sel: 'h1.titulo', prop: 'font-variation-settings', val: '"CASL" 1' },
  { sel: '.hero .titulo', prop: 'font-style', val: 'oblique 10deg' },
];
const CALCULADO = { 'font-weight': 'fontWeight', 'font-variation-settings': 'fontVariationSettings', 'font-style': 'fontStyle' };
const mayor = (a, b) => { for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] > b[i]; return null; };

// Gana la regla activa con !important; si empatan, la más específica; si empatan, la que aparece después
export function ganadoras(reglas) {
  const gana = {};
  reglas.forEach((r, i) => {
    if (!r.on) return;
    const g = gana[r.prop];
    const esp = specificity(r.sel);
    if (!g || (r.imp && !g.r.imp) || (!!r.imp === !!g.r.imp && mayor(esp, g.esp) !== false)) gana[r.prop] = { r, i, esp };
  });
  return gana;
}

function cascada(fig) {
  const reglas = REGLAS.map((r) => ({ ...r, on: true }));
  const hoja = $('style', fig);
  const titulo = $('#titulo', fig.closest('.hero'));
  const pintar = () => {
    hoja.textContent = reglas.filter((r) => r.on).map((r) => `${r.sel} { ${r.prop}: ${r.val}${r.imp ? ' !important' : ''}; }`).join('\n');
    const gana = ganadoras(reglas);
    $('.reglas', fig).innerHTML = reglas.map((r, i) => {
      const esp = specificity(r.sel);
      const pierde = r.on && gana[r.prop]?.i !== i;
      return `<li class="regla${r.on ? '' : ' apagada'}${pierde ? ' pierde' : ''}">
        <label><input type="checkbox" data-i="${i}" ${r.on ? 'checked' : ''}><span class="sr-only">Activar la regla ${esc(r.sel)}</span></label>
        <code class="decl"><span class="tok-t">${esc(r.sel)}</span> { <span class="prop">${r.prop}</span>: <span class="tok-s">${esc(r.val)}</span>${r.imp ? ' <span class="tok-k">!important</span>' : ''}; }</code>
        <span class="esp" title="Especificidad: IDs, clases, elementos">${esp.join(',')}</span>
        ${'imp' in r ? `<button type="button" class="imp" data-imp="${i}" aria-pressed="${!!r.imp}">!important</button>` : ''}
        ${pierde ? '<span class="sr-only">(pierde)</span>' : ''}
      </li>`;
    }).join('');
    calculado(gana);
  };
  // Lo que el navegador terminó aplicando; se vuelve a leer al final de la transición del título
  const calculado = (gana = ganadoras(reglas)) => {
    const cs = getComputedStyle(titulo);
    $('.calculado', fig).innerHTML = Object.entries(CALCULADO).map(([p, k]) => {
      const g = gana[p];
      return `<li><span class="prop">${p}</span> <b>${esc(cs[k])}</b> <span class="de">${g ? `de <code>${esc(g.r.sel)}</code>` : 'hoja del navegador'}</span></li>`;
    }).join('');
  };
  titulo.addEventListener('transitionend', () => calculado());
  fig.addEventListener('change', (e) => { const i = e.target.dataset.i; if (i != null) { reglas[+i].on = e.target.checked; pintar(); } });
  fig.addEventListener('click', (e) => {
    const b = e.target.closest('[data-imp]');
    if (!b) return;
    const r = reglas[+b.dataset.imp];
    r.imp = !r.imp;
    if (r.imp) r.on = true;
    pintar();
    $(`[data-imp="${b.dataset.imp}"]`, fig).focus();
  });
  pintar();
  // La fuente variable puede llegar después del primer cálculo
  document.fonts?.ready.then(() => fig.isConnected && pintar());
}

function filaModulo(m) {
  const ls = leccionesDe(m.id), total = ls.length, n = hechasDe(ls);
  return `<li><a class="mod" href="#/${ls[0].id}">
    <span class="mod-tit">${m.title}</span>
    <span class="mod-blurb">${m.blurb[0].toUpperCase()}${m.blurb.slice(1)}.</span>
    <span class="mod-estado"><span class="mod-medidor" aria-hidden="true"><span style="width:${(n / total) * 100}%"></span></span><small>${n === total ? 'Completo' : n ? `${n} de ${total} lecciones` : `${total} lecciones`}</small></span>
  </a></li>`;
}

export function vistaInicio(main) {
  document.title = 'Fronteando Ando, guía de frontend con HTML, CSS, JavaScript y React';
  const sigue = siguienteLeccion();
  const nLabs = LECCIONES.reduce((a, l) => a + (l.labs?.length || 0), 0);
  const nVis = Object.values(LABS_AT).flat().length;
  const errores = DB.wrong.filter(QBY).length;
  const tot = Object.values(DB.stats).reduce((a, s) => ({ n: a.n + s.n, ok: a.ok + s.ok }), { n: 0, ok: 0 });
  const nDiap = DIAPOSITIVAS.reduce((a, b) => a + b.qs.length, 0);
  const PRACTICA = [
    ['#/simulacro', 'simulacro', 'Simulacro con tiempo', `40 rápidas o 10 de código, sorteadas de ${QUESTIONS.length} preguntas. Al entregar, revisás cada una con su explicación.`],
    ['#/parciales', 'parciales', 'Modelos de parcial', 'Exámenes completos con el formato del profesor, incluido el 2do parcial reconstruido.'],
    ['#/diapositivas', 'diapositivas', 'Práctica por diapositivas', `${nDiap} preguntas sacadas de cada diapositiva de las Unidades IV y V, por bloques.`],
    ['#/moyano', 'moyano', 'Preguntas de Moyano', 'Las preguntas de los PDFs del profesor: parcial teórico, tipo parcial U4 y U5, y autoevaluación.'],
    ['#/resumen', 'resumen', 'Resumen para el parcial', 'Los conceptos que tenés que saber sí o sí, en una sola página.'],
    ['#/conceptual', 'conceptual', 'Resumen conceptual', 'La teoría de las Unidades IV y V para leer de corrido.'],
    ['#/videos', 'video', 'Videos de resumen', 'Un video corto por lección, de corrido.'],
    ['#/proyectos', 'proyectos', 'Proyectos', 'Del turnero en vanilla al panel admin en React, con requisitos para tildar y pruebas de fuego.'],
    ['#/laboratorios', 'lab', 'Laboratorios visuales', `Los ${nVis} juntos: event loop, especificidad, flexbox, Virtual DOM, router…`],
    [null, 'consola', 'Consola JS y React', 'Para probar código suelto o un componente. Se abre desde el botón “> Consola” o desde el índice.'],
  ];

  main.innerHTML = `
    <article class="inicio">
      <section class="hero" aria-labelledby="titulo">
        <div class="hero-texto">
          <p class="hero-materia">Desarrollo de Software, Unidades IV y V, UTN-FRT</p>
          <h1 id="titulo" class="titulo">Del primer &lt;h1&gt; a una app en React</h1>
          <p class="lede">Del “¿qué pasa cuando escribo una URL?” hasta una app con rutas privadas. ${LECCIONES.length} lecciones con la teoría desarrollada, ${nLabs} laboratorios donde editás código y ves el resultado al instante, ${nVis} laboratorios visuales y ${EJERCICIOS.length} ejercicios con solución, incluidos todos los de la cátedra.</p>
          <div class="hero-acciones">
            <a class="btn primary" href="#/${sigue.id}">${hechas.size ? 'Seguir con' : 'Empezar con'} “${sigue.title}”</a>
            ${errores ? `<a class="btn" href="#/repaso">Repasar ${errores} ${errores === 1 ? 'error' : 'errores'}</a>` : '<a class="btn" href="#/simulacro">Hacer un simulacro</a>'}
          </div>
        </div>
        <figure class="inspector">
          <style></style>
          <p class="inspector-cabeza"><span>Estilos</span><span class="elemento">h1#titulo.titulo</span></p>
          <ul class="reglas" aria-label="Reglas que se aplican al título"></ul>
          <p class="inspector-cabeza"><span>Calculado</span></p>
          <ul class="calculado" aria-live="polite"></ul>
          <figcaption>Estas reglas le dan forma al título de esta página. Destildá una o probá <code>!important</code>: el navegador vuelve a aplicar la cascada y gana la más específica. La especificidad la calcula la misma función del <a href="#/css-cascada">laboratorio de especificidad</a>.</figcaption>
        </figure>
      </section>

      ${UNIDADES.map((u) => `
        <section class="unidad" data-u="${u.id}" aria-labelledby="t-${u.id}">
          <h2 id="t-${u.id}">${u.title}<span>${u.name}</span></h2>
          <ul class="mods">${MODULOS.filter((m) => m.unit === u.id).map(filaModulo).join('')}</ul>
        </section>`).join('')}

      <section class="practica" aria-labelledby="t-practica">
        <h2 id="t-practica">Practicá como en el parcial</h2>
        <p class="stats">${tot.n ? `Llevás ${tot.n} respuestas, ${Math.round((tot.ok / tot.n) * 100)} % bien${errores ? `, y ${errores} ${errores === 1 ? 'error' : 'errores'} para <a href="#/repaso">repasar</a>` : ''}.` : 'Todavía no respondiste preguntas: cada lección cierra con un mini-quiz del tema.'}</p>
        <ul>${PRACTICA.map(([href, i, t, d]) => `<li>${href ? `<a href="${href}">` : '<button type="button" data-act="consola">'}${icono(i, 22)}<span><b>${t}</b>${d}</span>${href ? '</a>' : '</button>'}</li>`).join('')}</ul>
      </section>

      <section class="probables" aria-labelledby="t-hot">
        <h2 id="t-hot">Lo más probable que te tomen</h2>
        <p class="sec-lede">Estimación a partir de las diapositivas y del 1er parcial.</p>
        <ul class="hot-list">${HOT.map((x) => `<li><a class="hot" href="#/${TOPIC_LESSON[x.mod]}" data-lvl="${x.lvl}"><span class="pill">${['', 'puede salir', 'probable', 'muy probable'][x.lvl]}</span><span class="txt">${x.txt}</span></a></li>`).join('')}</ul>
      </section>

      <section class="como" aria-labelledby="t-como">
        <h2 id="t-como">Cómo usar la guía</h2>
        <ol>
          <li>Avanzá en orden: cada tema usa lo anterior.</li>
          <li>Leé la teoría y tocá los laboratorios: están para romper cosas y ver qué pasa.</li>
          <li>Intentá los ejercicios sin mirar la solución.</li>
          <li>Hacé el mini-quiz del final. Lo que falles queda para <a href="#/repaso">repasar</a>.</li>
          <li>Marcá cada lección como completada para ver tu progreso.</li>
        </ol>
        <p class="atajos">Atajos de teclado: <kbd>←</kbd> y <kbd>→</kbd> para moverte entre lecciones, <kbd>/</kbd> para buscar, <kbd>1</kbd> a <kbd>4</kbd> para responder.</p>
      </section>

      <section class="otras" aria-labelledby="t-otras">
        <div class="repo">
          <div><h2>El código está abierto</h2><p>Si encontrás un error o querés proponer una pregunta, abrí un issue en el repositorio.</p></div>
          <a class="btn" href="${REPO}" target="_blank" rel="noopener">Ver el repositorio en GitHub</a>
        </div>
        <h2 id="t-otras">Otras guías de la UTN</h2>
        ${OTRAS_GUIAS.map((g) => `<h3>${g.anio}</h3><ul class="guias">${g.guias.map(([n, d, slug]) => `<li><a href="https://franco704.github.io/${slug}/" target="_blank" rel="noopener"><b>${n}</b><span>${d}</span></a><a class="guia-repo" href="https://github.com/Franco704/${slug}" target="_blank" rel="noopener" aria-label="Repositorio de ${n}">Repositorio</a></li>`).join('')}</ul>`).join('')}
      </section>
    </article>`;
  cascada($('.inspector', main));
}

