// Raíz de composición: conecta el armazón, las rutas y las vistas.
// Rutas (las mismas de la versión anterior): #/<lección>, #/resumen, #/conceptual, #/videos[/<lección>],
// #/simulacro, #/parciales, #/moyano, #/diapositivas, #/proyectos; nuevas: #/repaso y #/laboratorios.
import { $, irA } from './nucleo/dom.js';
import { rutaActual } from './nucleo/router.js';
import { LECCIONES } from './temario/indice.js';
import { entrada } from './animaciones/entrada.js';
import { montarArmazon, pintarIndice, cerrarMenu, enfocarBusqueda } from './ui/armazon.js';
import { Konsole } from './consola/consola.js';
import { cleanup, examenActivo } from './estudio/cuestionario.js';
import { vistaInicio } from './vistas/inicio.js';
import { vistaLeccion } from './vistas/leccion.js';
import { vistaResumen } from './vistas/resumenes.js';
import { vistaVideos } from './vistas/videos.js';
import { vistaLaboratorios } from './vistas/laboratorios.js';
import { vistaSimulacro, vistaRepaso, vistaParciales, vistaMoyano, vistaDiapositivas, vistaProyectos } from './vistas/practica.js';

const main = $('#principal');
montarArmazon();

// [título, vista] de las vistas de práctica
const PRACTICA = {
  simulacro: ['Simulacro', vistaSimulacro], repaso: ['Repasar errores', vistaRepaso], parciales: ['Modelos de parcial', vistaParciales],
  moyano: ['Preguntas de Moyano', vistaMoyano], diapositivas: ['Práctica por diapositivas', vistaDiapositivas], proyectos: ['Proyectos', vistaProyectos],
};

let primeraCarga = true;
async function resolver() {
  const id = rutaActual();
  const idx = LECCIONES.findIndex((l) => l.id === id);
  // Pantalla de entrada al cambiar de tema; si mientras tanto cambió la ruta, gana la nueva
  if (idx !== -1) { await entrada(id, primeraCarga); if (rutaActual() !== id) return; }
  primeraCarga = false;
  cleanup();
  delete document.body.dataset.unit;
  $('#riel').innerHTML = '';
  const [raiz, arg] = [id.split('/')[0], id.split('/').slice(1).join('/')];
  if (idx !== -1) vistaLeccion(main, idx);
  else if (raiz === 'resumen' || raiz === 'conceptual') vistaResumen(main, raiz);
  else if (raiz === 'videos') vistaVideos(main, arg);
  else if (raiz === 'laboratorios') vistaLaboratorios(main);
  else if (PRACTICA[raiz]) { document.title = `${PRACTICA[raiz][0]}, Fronteando Ando`; PRACTICA[raiz][1](); }
  else vistaInicio(main);
  // Mientras corre el simulacro se esconde el botón de la consola
  document.body.classList.toggle('exam-on', raiz === 'simulacro' && !!examenActivo());
  document.body.dataset.view = idx !== -1 ? 'leccion' : main.querySelector('.inicio') ? 'inicio' : raiz;
  pintarIndice();
  cerrarMenu();
  scrollTo(0, 0);
  main.focus({ preventScroll: true });
}

addEventListener('hashchange', resolver);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { cerrarMenu(); return; }
  if (e.target.closest('input, textarea, select, [contenteditable]') || e.altKey || e.ctrlKey || e.metaKey) return;
  const idx = LECCIONES.findIndex((l) => l.id === rutaActual());
  if (e.key === 'ArrowRight' && idx > -1 && idx < LECCIONES.length - 1) location.hash = `#/${LECCIONES[idx + 1].id}`;
  if (e.key === 'ArrowLeft' && idx > 0) location.hash = `#/${LECCIONES[idx - 1].id}`;
  if (e.key === '/') { e.preventDefault(); enfocarBusqueda(); }
});
document.addEventListener('click', (e) => {
  // Botones "Consola" fuera del cajón (el cajón maneja los suyos)
  const con = e.target.closest('[data-act="consola"]');
  if (con && !con.closest('#cajon')) { Konsole.open(null, false); return; }
  // Enlaces dentro de la misma página (#seccion): se desplazan sin tocar la ruta
  const a = e.target.closest('a[href^="#"]:not([href^="#/"])');
  const destino = a && a.getAttribute('href').length > 1 && document.getElementById(a.getAttribute('href').slice(1));
  if (!destino) return;
  e.preventDefault();
  irA(destino);
});
resolver();
