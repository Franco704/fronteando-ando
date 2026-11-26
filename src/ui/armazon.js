// Armazón de la página: barra superior, cajón con el índice, dock inferior (móvil) y riel con las secciones de la lección.
// Mobile-first: en pantallas chicas todo se alcanza desde el dock y el cajón; desde 1024 px el índice queda fijo al costado.
import { $, esc, norm, irA } from '../nucleo/dom.js';
import { rutaActual } from '../nucleo/router.js';
import { UNIDADES, MODULOS, LECCIONES, leccionesDe } from '../temario/indice.js';
import { QBY } from '../banco/indice.js';
import { hechas, hechasDe, DB, alCambiarProgreso } from '../estudio/progreso.js';
import { Konsole, montarConsola } from '../consola/consola.js';
import { icono } from './iconos.js';

const cajon = $('#cajon');
const velo = $('#velo');
const botonMenu = $('#botonMenu');
const indice = $('#indice');
const buscar = $('#buscar');
const escritorio = matchMedia('(min-width: 1024px)');

// [ruta, nombre, ícono, va también en la barra de escritorio]. Todas están en el cajón; en escritorio, las que no van en la barra.
const HERRAMIENTAS = [
  ['#/resumen', 'Resumen', 'resumen', true],
  ['#/conceptual', 'Conceptual', 'conceptual'],
  ['#/videos', 'Videos', 'video'],
  ['#/diapositivas', 'Diapositivas', 'diapositivas'],
  ['#/moyano', 'Moyano', 'moyano'],
  ['#/parciales', 'Parciales', 'parciales', true],
  ['#/simulacro', 'Simulacro', 'simulacro', true],
  ['#/repaso', 'Repasar', 'repasar', true],
  ['#/laboratorios', 'Laboratorios', 'lab', true],
  ['#/proyectos', 'Proyectos', 'proyectos'],
  [null, 'Consola', 'consola'],
];
const DOCK = [['#/', 'Inicio', 'inicio'], [null, 'Índice', 'indice'], ['#/resumen', 'Resumen', 'resumen'], ['#/simulacro', 'Simulacro', 'simulacro'], ['#/repaso', 'Repasar', 'repasar']];
const contador = '<span class="contador" data-repaso hidden></span>';
export const paraRepasar = () => DB.wrong.filter(QBY);

// ---------- Cajón (en móvil y tablet es un panel modal; en escritorio, una columna fija) ----------
export function abrirMenu() {
  if (escritorio.matches) return;
  cajon.classList.add('abierto');
  cajon.inert = false;
  velo.hidden = false;
  document.body.classList.add('sin-scroll');
  document.querySelectorAll('[aria-controls="cajon"]').forEach((b) => b.setAttribute('aria-expanded', 'true'));
  enfocarCierre();
}
// Con movimiento reducido, Chrome tarda unos milisegundos en dejar enfocar el botón del cajón recién abierto: se reintenta
function enfocarCierre(intento = 0) {
  const b = $('#cerrarCajon');
  b.focus();
  if (document.activeElement !== b && intento < 10 && cajon.classList.contains('abierto')) setTimeout(() => enfocarCierre(intento + 1), 30);
}
export function cerrarMenu() {
  const estaba = cajon.classList.contains('abierto');
  cajon.classList.remove('abierto');
  cajon.inert = !escritorio.matches;
  velo.hidden = true;
  document.body.classList.remove('sin-scroll');
  document.querySelectorAll('[aria-controls="cajon"]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
  if (estaba && cajon.contains(document.activeElement)) botonMenu.focus();
}
export const enfocarBusqueda = () => { abrirMenu(); buscar.focus(); };

// ---------- Índice por unidad y tema, con buscador ----------
export function pintarIndice() {
  const q = norm(buscar.value.trim());
  const actual = rutaActual();
  let html = '', n = 0;
  for (const u of UNIDADES) {
    let mods = '';
    for (const m of MODULOS.filter((x) => x.unit === u.id)) {
      const todas = leccionesDe(m.id);
      const visibles = todas.filter((l) => !q || norm(`${l.title} ${l.keywords || ''} ${m.title}`).includes(q));
      n += visibles.length;
      if (!visibles.length) continue;
      const abierto = q || visibles.some((l) => l.id === actual);
      mods += `<details class="ind-mod" ${abierto ? 'open' : ''}>
        <summary><span class="ind-tit">${m.title}</span><span class="ind-cuenta">${hechasDe(todas)}/${todas.length}</span></summary>
        <ol>${visibles.map((l) => `<li><a class="ind-link${hechas.has(l.id) ? ' hecha' : ''}" href="#/${l.id}" data-id="${l.id}">
          <span class="ind-n">${String(LECCIONES.indexOf(l) + 1).padStart(2, '0')}</span><span>${l.title}</span>${hechas.has(l.id) ? '<span class="sr-only"> (completada)</span>' : ''}</a></li>`).join('')}
        </ol></details>`;
    }
    if (mods) html += `<section class="ind-unidad" data-u="${u.id}"><h2>${u.title}<span>${u.name}</span></h2>${mods}</section>`;
  }
  indice.innerHTML = n ? html : `<p class="ind-vacio">No hay lecciones con “${esc(buscar.value)}”. Probá con otra palabra.</p>`;
  marcarActual();
}

function marcarActual() {
  const actual = rutaActual();
  const ruta = `#/${actual}`;
  indice.querySelectorAll('.ind-link').forEach((a) => a.toggleAttribute('aria-current', a.dataset.id === actual));
  document.querySelectorAll('.barra-enlaces a, .herramientas a, .dock a').forEach((a) => {
    const h = a.getAttribute('href');
    const activa = h === '#/' ? actual === '' : ruta === h || ruta.startsWith(`${h}/`);
    a.toggleAttribute('aria-current', activa);
  });
}

// ---------- Avance general y contador de preguntas para repasar ----------
function pintarAvance() {
  const total = LECCIONES.length;
  const hechasN = LECCIONES.filter((l) => hechas.has(l.id)).length;
  $('#avance').innerHTML = `<span class="avance-barra"><span style="width:${(hechasN / total) * 100}%"></span></span><span class="avance-txt">${hechasN} de ${total} lecciones</span>`;
  const pendientes = paraRepasar().length;
  document.querySelectorAll('[data-repaso]').forEach((b) => { b.hidden = !pendientes; b.textContent = pendientes; });
  $('.dock a[href="#/repaso"]')?.setAttribute('aria-label', pendientes ? `Repasar, ${pendientes} errores pendientes` : 'Repasar');
}

// ---------- Riel: secciones de la lección actual (pantallas anchas) ----------
let observador = null;
export function pintarRiel(main) {
  const riel = $('#riel');
  observador?.disconnect();
  riel.innerHTML = '';
  const hs = [...main.querySelectorAll('.lesson > .body > h2, .lesson > section > h2')];
  if (hs.length < 3) return;
  hs.forEach((h, i) => { if (!h.id) h.id = `s-${i}-${norm(h.textContent).replace(/[^a-z0-9]+/g, '-').slice(0, 40)}`; });
  riel.innerHTML = `<p>En esta lección</p><ol>${hs.map((h) => `<li><a href="#${h.id}" data-target="${h.id}">${h.textContent}</a></li>`).join('')}</ol>`;
  const enlaces = new Map([...riel.querySelectorAll('a')].map((a) => [a.dataset.target, a]));
  riel.onclick = (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    e.preventDefault();
    irA(document.getElementById(a.dataset.target));
  };
  observador = new IntersectionObserver((entradas) => entradas.forEach((en) => {
    if (!en.isIntersecting) return;
    enlaces.forEach((a) => a.removeAttribute('aria-current'));
    enlaces.get(en.target.id)?.setAttribute('aria-current', 'true');
  }), { rootMargin: '0px 0px -70% 0px' });
  hs.forEach((h) => observador.observe(h));
}

// ---------- Montaje ----------
export function montarArmazon() {
  botonMenu.innerHTML = icono('menu', 22);
  $('#cerrarCajon').innerHTML = icono('cerrar', 22);
  $('#botonTema').innerHTML = icono('luna', 20);
  $('#barraEnlaces').innerHTML = HERRAMIENTAS.filter((x) => x[3]).map(([h, t]) => `<a href="${h}">${t}${h === '#/repaso' ? contador : ''}</a>`).join('');
  $('#herramientas').innerHTML = [['#/', 'Inicio', 'inicio'], ...HERRAMIENTAS].map(([h, t, i, barra]) => `<li${barra ? ' data-barra' : ''}${h === '#/' ? ' data-inicio' : ''}>${h
    ? `<a href="${h}">${icono(i, 18)}<span>${t}</span>${h === '#/repaso' ? contador : ''}</a>`
    : `<button type="button" data-act="consola">${icono(i, 18)}<span>${t}</span></button>`}</li>`).join('');
  $('#dock').innerHTML = DOCK.map(([h, t, i]) => (h
    ? `<a href="${h}">${icono(i, 22)}<span>${t}</span>${h === '#/repaso' ? contador : ''}</a>`
    : `<button type="button" aria-controls="cajon" aria-expanded="false" data-act="indice">${icono(i, 22)}<span>${t}</span></button>`)).join('');

  botonMenu.addEventListener('click', () => (cajon.classList.contains('abierto') ? cerrarMenu() : abrirMenu()));
  $('#dock [data-act="indice"]').addEventListener('click', abrirMenu);
  $('#cerrarCajon').addEventListener('click', cerrarMenu);
  velo.addEventListener('click', cerrarMenu);
  // Elegir un enlace del cajón lo cierra aunque la ruta no cambie
  cajon.addEventListener('click', (e) => {
    if (e.target.closest('[data-act="consola"]')) { cerrarMenu(); Konsole.open(null, false); return; }
    if (e.target.closest('a')) cerrarMenu();
  });
  buscar.addEventListener('input', pintarIndice);
  escritorio.addEventListener('change', cerrarMenu);

  $('#botonTema').addEventListener('click', () => {
    const raiz = document.documentElement;
    const oscuro = raiz.dataset.theme ? raiz.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    raiz.dataset.theme = oscuro ? 'light' : 'dark';
    try { localStorage.setItem('fa-theme', raiz.dataset.theme); } catch {}
  });

  alCambiarProgreso(() => { pintarAvance(); pintarIndice(); });
  montarConsola();
  cerrarMenu();
  pintarAvance();
}
