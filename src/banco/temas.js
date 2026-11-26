/* Temas del banco de preguntas: nombre, unidad, lección de cada tema y dónde van sus trampas.
   t (en cada pregunta) es la clave de TOPICS. */
// Tema del banco de preguntas de cada lección
const LESSON_TOPIC = {
  'como-funciona-la-web': 'web', 'frontend-y-renderizado': 'web', devtools: 'web',
  'html-basico': 'html', 'html-semantico': 'html', 'html-formularios': 'html',
  'css-selectores': 'css', 'css-cascada': 'css', 'modelo-de-caja': 'css',
  flexbox: 'layout', grid: 'layout', responsive: 'layout',
  'js-fundamentos': 'js', 'js-objetos-funciones': 'obj', 'js-arrays': 'arr', dom: 'dom', eventos: 'dom', errores: 'js',
  asincronia: 'async', fetch: 'async', 'tablas-paginacion': 'arr', 'formularios-js': 'store', almacenamiento: 'store',
  'modulos-es': 'entorno', 'node-npm': 'entorno', vite: 'entorno', 'build-deploy': 'entorno',
  'react-componentes-jsx': 'jsx', 'virtual-dom': 'jsx', 'props-state': 'estado', 'listas-eventos': 'estado',
  useeffect: 'efectos', hooks: 'efectos', 'formularios-react': 'rforms', 'react-hook-form': 'rforms',
  arquitectura: 'arq', tailwind: 'tw', 'axios-api': 'router', 'react-router': 'router', 'rutas-privadas': 'router',
};
// Lección a la que manda "Repasar" para cada tema
const TOPIC_LESSON = { react: 'react-componentes-jsx' };
for (const [l, t] of Object.entries(LESSON_TOPIC)) TOPIC_LESSON[t] = TOPIC_LESSON[t] || l;
// Dónde van las trampas de cada tema (la lección que cierra el tema)
const TRAPS_AT = {
  web: 'devtools', html: 'html-formularios', css: 'css-cascada', layout: 'responsive', js: 'js-fundamentos',
  obj: 'js-objetos-funciones', arr: 'js-arrays', dom: 'eventos', async: 'fetch', store: 'almacenamiento',
  entorno: 'vite', jsx: 'virtual-dom', estado: 'listas-eventos', efectos: 'hooks', rforms: 'react-hook-form',
  arq: 'arquitectura', tw: 'tailwind', router: 'rutas-privadas',
};

const TOPICS = { web: 'Fundamentos web', html: 'HTML', css: 'CSS', layout: 'Layout y responsive', js: 'JS: motor y variables', dom: 'DOM y eventos', obj: 'Objetos y funciones', arr: 'Arrays', async: 'Event loop y fetch', store: 'Forms y storage', entorno: 'Node, npm y Vite', jsx: 'JSX y Virtual DOM', estado: 'Props, state y eventos', efectos: 'useEffect y hooks', rforms: 'Forms y react-hook-form', arq: 'Arquitectura y Atomic', tw: 'Tailwind CSS', router: 'Router y rutas privadas', react: 'JS para React' };
const UNIT4 = ['web', 'html', 'css', 'layout', 'js', 'dom', 'obj', 'arr', 'async', 'store'];
const UNIT5 = ['entorno', 'jsx', 'estado', 'efectos', 'rforms', 'arq', 'tw', 'router'];
const unitTopics = (u) => u === '4' ? UNIT4 : u === '5' ? UNIT5 : UNIT4.concat(UNIT5);

export { LESSON_TOPIC, TOPIC_LESSON, TRAPS_AT, TOPICS, UNIT4, UNIT5, unitTopics };
