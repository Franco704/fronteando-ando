// Registro de laboratorios visuales y qué lección muestra cada uno.
import { h } from '../nucleo/dom.js';
import { VLABS } from './fichas.js';
import { LABS as WEB, anatomyBlock } from './visuales-web.js';
import { LABS as REACT } from './visuales-react.js';

export const LABS = { ...WEB, ...REACT, anatomy: (box) => box.append(anatomyBlock()) };
export { VLABS };

// Laboratorios visuales de cada lección
const LABS_AT = {
  'como-funciona-la-web': ['url'], 'frontend-y-renderizado': ['render'],
  'html-basico': ['anatomy'], 'html-semantico': ['semantic'], 'html-formularios': ['bughtml'],
  'css-selectores': ['selector'], 'css-cascada': ['spec'], flexbox: ['flex'], responsive: ['responsive', 'position'],
  'js-fundamentos': ['engines'], 'js-objetos-funciones': ['freeze', 'thisdemo'], 'js-arrays': ['arrays'],
  dom: ['domtree'], eventos: ['events'], asincronia: ['eventloop'], fetch: ['fetchsim'],
  'formularios-js': ['formlab'], almacenamiento: ['storage'], 'node-npm': ['semver'], vite: ['tree'],
  'react-componentes-jsx': ['jsxfix'], 'virtual-dom': ['vdom'], 'props-state': ['batch'], 'listas-eventos': ['keys'],
  useeffect: ['lifecycle'], hooks: ['hookrules'], 'formularios-react': ['ctrl'], 'react-hook-form': ['rhf'],
  arquitectura: ['folders', 'solid', 'atomic'], tailwind: ['twbp', 'twcss'], 'axios-api': ['proxy'], 'rutas-privadas': ['routersim'],
};
export { LABS_AT };

// Un laboratorio visual con su título y consigna; si falla, lo dice sin romper la página
export function vlab(id) {
  const meta = VLABS[id];
  const body = h('div', { class: 'lab-b' });
  const el = h('section', { class: 'vlab' }, h('div', { class: 'lab-h' }, h('h3', {}, meta.title), h('p', {}, meta.sub)), body);
  try { LABS[id](body); } catch (e) { body.append(h('div', { class: 'msg bad' }, 'No se pudo cargar este laboratorio: ' + e.message)); console.error(e); }
  return el;
}
