/* Laboratorios visuales de la Unidad V: entorno moderno, React, formularios, arquitectura, Tailwind y rutas.
   Traídos del "Laboratorio Frontend DSW" de Mateo Rusconi. */
import { $, $$, h, esc, shuffle, sleep, flip, RM } from '../nucleo/dom.js';
import { hl, fmt, codeBox } from '../ui/codigo.js';
import { rounds, classifier, bugHunt } from './componentes.js';
import { mountReact } from './react-bajo-demanda.js';

const LABS = {};
/* 11 · Estructura del proyecto */
LABS.tree = (box) => {
  const F = [
    ['node_modules/', 0, 'Carpeta donde se instalan todas las dependencias (librerías y paquetes) que el proyecto necesita.', false, '`npm install`'],
    ['public/', 0, 'Archivos estáticos que NO pasan por el proceso de compilación: se sirven tal cual (favicon, imágenes fijas).', true, 'la plantilla de Vite'],
    ['src/', 0, 'Acá va el código fuente de tu aplicación React.', true, 'vos (y la plantilla)'],
    ['assets/', 1, 'Imágenes y recursos que SÍ pasan por el bundler (se importan desde el código).', true, 'la plantilla de Vite'],
    ['App.jsx', 1, 'Componente raíz de la app.', true, 'vos'],
    ['index.css', 1, 'Estilos globales. Con Tailwind, la primera línea es `@import "tailwindcss";`.', true, 'vos'],
    ['main.jsx', 1, 'Arranque de JS: busca `#root` y monta `<App />` con `createRoot(...).render(...)`.', true, 'la plantilla de Vite'],
    ['dist/', 0, 'El bundle de producción: HTML, JS y CSS optimizados para desplegar. Se regenera en cada build.', false, '`npm run build`'],
    ['eslint.config.js', 0, 'Configuración de ESLint: revisa tu código y marca errores de estilo o malas prácticas.', true, 'la plantilla de Vite'],
    ['vite.config.js', 0, 'Configuración de Vite, el bundler que compila y levanta el servidor de desarrollo: plugins (react, tailwind) y proxy.', true, 'la plantilla de Vite'],
    ['package.json', 0, 'Archivo central: nombre y versión del proyecto, scripts (`npm run dev`, `build`) y dependencias.', true, 'la plantilla de Vite'],
    ['package-lock.json', 0, 'Versión "congelada" de las dependencias: asegura que todos instalen exactamente las mismas versiones.', true, '`npm install`'],
    ['README.md', 0, 'Documentación del proyecto.', true, 'la plantilla / vos'],
    ['index.html', 0, 'Punto de entrada. Aunque React controla la interfaz, acá está el `<div id="root"></div>` donde se monta la app y el script a `/src/main.jsx`.', true, 'la plantilla de Vite'],
    ['.gitignore', 0, 'Lo que git ignora: `node_modules`, `dist`, logs…', true, 'la plantilla de Vite']
  ];
  const info = h('div', { class: 'sem-info' });
  const list = h('div', { class: 'tree5', role: 'list' });
  function sel(k) {
    $$('button', list).forEach((b, j) => b.classList.toggle('on', j === k));
    const [n, , d, git, who] = F[k];
    info.replaceChildren(h('div', { class: 'tg' }, n), h('p', { html: fmt(d) }), h('div', { class: 'row' }, h('span', { class: 'pill ' + (git ? 'easy' : 'hot3') }, git ? 'va al repo' : 'NO va al repo'), h('span', { class: 'muted', style: { fontSize: '13.5px' }, html: 'lo crea: ' + fmt(who) })));
  }
  F.forEach(([n, depth], k) => list.append(h('button', { style: { paddingLeft: (10 + depth * 18) + 'px' }, onclick: () => sel(k), onmouseenter: () => sel(k) }, (n.endsWith('/') ? '▸ ' : '  ') + n)));
  box.append(h('div', { class: 'sem' }, list, info)); sel(13);
};

/* 11 · Semver */
function svParse(v) { const m = v.match(/^(\d+)\.(\d+)\.(\d+)(?:-(.+))?$/); return { M: +m[1], m: +m[2], p: +m[3], pre: m[4] || null, raw: v }; }
function svCmp(a, b) { for (const k of ['M', 'm', 'p']) if (a[k] !== b[k]) return a[k] - b[k]; if (a.pre === b.pre) return 0; if (!a.pre) return 1; if (!b.pre) return -1; return a.pre < b.pre ? -1 : 1; }
LABS.semver = (box) => {
  const VERS = ['1.2.2', '1.2.3-beta.1', '1.2.3', '1.2.9', '1.3.0', '1.5.0', '1.9.9', '2.0.0', '2.1.0'].map(svParse);
  const NOT = {
    '1.2.3': [v => !v.pre && svCmp(v, svParse('1.2.3')) === 0, 'Solo esa versión exacta.'],
    '^1.2.3': [v => !v.pre && svCmp(v, svParse('1.2.3')) >= 0 && v.M === 1, 'Circunflejo: actualiza MINOR y PATCH, no MAJOR → >=1.2.3 <2.0.0.'],
    '~1.2.3': [v => !v.pre && svCmp(v, svParse('1.2.3')) >= 0 && v.M === 1 && v.m === 2, 'Tilde: solo PATCH dentro del mismo MINOR → >=1.2.3 <1.3.0.'],
    '*': [v => !v.pre, 'Cualquier versión estable.'],
    '>1.2.3': [v => !v.pre && svCmp(v, svParse('1.2.3')) > 0, 'Más nuevas que 1.2.3 (incluye MAJOR nuevos).'],
    '<2.0.0': [v => !v.pre && svCmp(v, svParse('2.0.0')) < 0, 'Anteriores a 2.0.0.'],
    '>=1.2.3 <2.0.0': [v => !v.pre && svCmp(v, svParse('1.2.3')) >= 0 && svCmp(v, svParse('2.0.0')) < 0, 'Rango explícito: es lo mismo que ^1.2.3.'],
    'latest': [null, 'La última versión publicada (etiqueta latest de npm).'],
    '1.2.3-beta.1': [v => v.raw === '1.2.3-beta.1', 'Pre-release: versión preliminar de prueba. Solo se instala si la pedís explícitamente.']
  };
  let cur = '^1.2.3';
  const chips = h('div', { class: 'row' }, Object.keys(NOT).map(k => h('button', { class: 'chip', 'data-k': k, onclick: () => { cur = k; draw(); } }, k)));
  const pkg = h('pre', { class: 'code small' }), vers = h('div', { class: 'sv' }), msg = h('div');
  function draw() {
    $$('.chip', chips).forEach(c => c.classList.toggle('on', c.dataset.k === cur));
    pkg.innerHTML = hl(`"dependencies": {\n  "mi-lib": "${cur}"\n}`, 'json');
    const [fn, ex] = NOT[cur];
    const stable = VERS.filter(v => !v.pre);
    const okSet = fn ? VERS.filter(fn) : [stable[stable.length - 1]];
    const inst = okSet.slice().sort(svCmp).pop();
    vers.replaceChildren(...VERS.map((v, k) => { const el = h('div', { class: 'ver' + (okSet.includes(v) ? ' ok' : '') + (v === inst ? ' inst' : '') + (v.pre ? ' pre' : '') }, v.raw, v === inst ? h('small', {}, 'instala') : null); el.style.animationDelay = (k * 40) + 'ms'; return el; }));
    msg.replaceChildren(h('div', { class: 'msg info', html: fmt(ex) + (inst ? ` npm instala la más alta que cumple: <b>${inst.raw}</b>.` : '') }));
  }
  box.append(h('span', { class: 'lbl' }, 'Cómo está escrita la dependencia'), chips, h('div', { class: 'codeblk' }, pkg), h('span', { class: 'lbl' }, 'Versiones publicadas de mi-lib'), vers, msg);
  draw();
};

/* 12 · JSX con errores */
LABS.jsxfix = (box) => bugHunt(box, [
  { l: 'jsx', c: 'function Card({ titulo }) {\n  return (\n    <div class="card">\n      <h2>{titulo}</h2>\n    </div>\n  );\n}', bad: [2], e: 'En JSX es `className`: `class` es palabra reservada de JS.' },
  { l: 'jsx', c: 'function CampoEmail() {\n  return (\n    <>\n      <label for="email">Correo</label>\n      <input id="email" type="email" />\n    </>\n  );\n}', bad: [3], e: 'En JSX es `htmlFor`.' },
  { l: 'jsx', c: 'function Logo({ foto }) {\n  return (\n    <div>\n      <img src={foto} alt="Logo">\n    </div>\n  );\n}', bad: [3], e: 'En JSX todo se cierra: `<img … />`.' },
  { l: 'jsx', c: 'function Encabezado() {\n  return (\n    <h1>Turnos</h1>\n    <p>Hoy hay 3</p>\n  );\n}', bad: [3], e: 'Dos elementos hermanos sin padre. Envolvelos en `<>…</>` o en un div.' },
  { l: 'jsx', c: 'function Guardar({ onGuardar }) {\n  return (\n    <button onclick={onGuardar}>\n      Guardar\n    </button>\n  );\n}', bad: [2], e: 'Los eventos van en camelCase: `onClick`.' },
  { l: 'jsx', c: 'function Alerta({ texto }) {\n  return (\n    <p style="color: red">\n      {texto}\n    </p>\n  );\n}', bad: [2], e: '`style` recibe un objeto: `style={{ color: "red" }}`.' },
  { l: 'jsx', c: 'function Lista({ productos }) {\n  return (\n    <ul>\n      {productos.map(p => <li>{p.nombre}</li>)}\n    </ul>\n  );\n}', bad: [3], e: 'Falta la `key` en cada `<li>`: `<li key={p.id}>`.' }
]);

/* 12 · Diff del Virtual DOM */
LABS.vdom = (box) => {
  const BASE = [['r', 'div', 84, 18, null], ['a', 'header', 42, 58, 'r'], ['b', 'ul', 128, 58, 'r'], ['a1', 'h1', 22, 100, 'a'], ['a2', 'p', 62, 100, 'a'], ['b1', 'li', 112, 100, 'b'], ['b2', 'li', 144, 100, 'b']];
  const SC = [
    { n: 'Cambia el texto de un <p>', ch: ['a2'], note: 'Mismo tipo: React reutiliza el <p> y solo actualiza su texto. 1 operación en el DOM real.' },
    { n: 'Cambia el className del <ul>', ch: ['b'], note: 'Mismo tipo: actualiza solo el atributo class. Los <li> ni se tocan.' },
    { n: 'Cambia el tipo: <ul> → <ol>', ch: ['b', 'b1', 'b2'], type: { b: 'ol' }, note: 'Cambió el TIPO: React desmonta todo el sub-árbol del <ul> (con sus hijos) y monta uno nuevo.' },
    { n: 'Se agrega un <li> al final', ch: ['b3'], add: [['b3', 'li', 172, 100, 'b']], note: 'Mismo tipo y mismas keys: solo crea el <li> nuevo y lo inserta.' }
  ];
  let s = 0, step = 0;
  const panes = [0, 1, 2].map(() => h('div', { class: 'vd-p' }));
  const note = h('div', { class: 'el-note' });
  const svgTree = (nodes, chg, dim) => {
    const by = Object.fromEntries(nodes.map(n => [n[0], n]));
    let out = `<svg viewBox="0 0 190 120" class="${dim ? 'dim' : ''}">`;
    nodes.forEach(([id, , x, y, p]) => { if (p) { const P = by[p]; out += `<line x1="${P[2]}" y1="${P[3]}" x2="${x}" y2="${y}" class="ve"/>`; } });
    nodes.forEach(([id, t, x, y]) => { out += `<g class="vn${chg.includes(id) ? ' ch' : ''}"><circle cx="${x}" cy="${y}" r="13"/><text x="${x}" y="${y + 2.5}"${t.length > 4 ? ' style="font-size:5.5px"' : ''}>${t}</text></g>`; });
    return out + '</svg>';
  };
  const treeOf = (sc) => { const t = BASE.map(n => n.slice()); if (sc.type) t.forEach(n => { if (sc.type[n[0]]) n[1] = sc.type[n[0]]; }); if (sc.add) t.push(...sc.add.map(n => n.slice())); return t; };
  const tabs = h('div', { class: 'choices' }, SC.map((x, k) => h('button', { class: 'choice', 'data-k': k, onclick: () => { s = k; step = 0; draw(); } }, x.n)));
  const STEPS = ['Estado inicial: el Virtual DOM y el DOM real coinciden.', 'Cambio de estado → React genera un NUEVO árbol virtual.', 'Diff: compara el árbol nuevo con el anterior, nodo por nodo.', 'Commit: aplica al DOM real solo lo que cambió.'];
  const next = h('button', { class: 'btn primary sm', onclick: () => { if (step < 3) { step++; draw(); } } }, 'Siguiente ▶');
  const reset = h('button', { class: 'btn sm', onclick: () => { step = 0; draw(); } }, 'Reiniciar');
  function draw() {
    $$('.choice', tabs).forEach(b => b.classList.toggle('right', +b.dataset.k === s));
    const sc = SC[s], nt = treeOf(sc), chg = sc.ch;
    panes[0].innerHTML = '<span class="lbl">Virtual DOM anterior</span>' + svgTree(BASE, step >= 2 ? chg.filter(id => BASE.some(n => n[0] === id)) : [], false);
    panes[1].innerHTML = '<span class="lbl">Virtual DOM nuevo</span>' + (step >= 1 ? svgTree(nt, step >= 1 ? chg : [], false) : svgTree(BASE, [], true));
    panes[2].innerHTML = '<span class="lbl">DOM real (navegador)</span>' + svgTree(step >= 3 ? nt : BASE, step >= 3 ? chg : [], false);
    note.innerHTML = `<b>Paso ${step + 1}/4.</b> ${esc(STEPS[step])}` + (step >= 2 ? ` <span class="muted">· ${chg.length} nodo${chg.length > 1 ? 's' : ''} distinto${chg.length > 1 ? 's' : ''} de ${nt.length}.</span>` : '') + (step === 3 ? '<br>' + esc(sc.note) : '');
    next.disabled = step >= 3;
  }
  box.append(tabs, h('div', { class: 'vd' }, panes), note, h('div', { class: 'row' }, next, reset));
  draw();
};

/* 12 · keys (React real) */
LABS.keys = (box) => {
  mountReact(box, () => {
    const e = React.createElement, { useState, useRef } = React;
    const NUEVOS = ['Fideos', 'Café', 'Pan', 'Queso', 'Arvejas'];
    function Lista({ porIndice }) {
      const [items, setItems] = useState([{ id: 1, n: 'Leche' }, { id: 2, n: 'Arroz' }, { id: 3, n: 'Yogur' }]);
      const nid = useRef(4);
      const agregar = () => { const n = NUEVOS[(nid.current - 4) % NUEVOS.length]; setItems([{ id: nid.current++, n }, ...items]); };
      return e('div', { className: 'kl' },
        e('div', { className: 'row' }, e('button', { className: 'btn primary sm', onClick: agregar }, 'Agregar al principio')),
        e('ul', null, items.map((it, i) => e('li', { key: porIndice ? i : it.id },
          e('span', { className: 'kn' }, it.n), e('input', { defaultValue: 'nota de ' + it.n, 'aria-label': 'Nota de ' + it.n }), e('code', null, porIndice ? `key=${i}` : `key=${it.id}`)))));
    }
    return function KeysLab() {
      const [porIndice, setPorIndice] = useState(true);
      const [v, setV] = useState(0);
      const modo = (pi) => () => { setPorIndice(pi); setV(v + 1); };
      return e('div', { className: 'rlab-in' },
        e('div', { className: 'choices' },
          e('button', { className: 'choice' + (porIndice ? ' wrong' : ''), onClick: modo(true) }, 'key={index}'),
          e('button', { className: 'choice' + (!porIndice ? ' right' : ''), onClick: modo(false) }, 'key={item.id}'),
          e('button', { className: 'btn ghost sm', onClick: () => setV(v + 1) }, 'Reiniciar')),
        e(Lista, { key: v + (porIndice ? 'i' : 'd'), porIndice }),
        e('div', { className: 'msg ' + (porIndice ? 'warn' : 'ok') }, porIndice
          ? 'Con key={index}: al agregar arriba, React ve "la key 0 cambió de texto" y reutiliza el <li> de la posición 0 con su input. La nota de Leche queda al lado del producto nuevo.'
          : 'Con key={item.id}: React sabe que Leche sigue siendo Leche. Crea un <li> nuevo para el producto nuevo y cada nota sigue con su producto.'));
    };
  });
};

/* 13 · batching (React real) */
LABS.batch = (box) => {
  const code = h('pre', { class: 'code small' });
  const CODES = {
    a: 'const sumarTres = () => {\n  setCount(count + 1);\n  setCount(count + 1);\n  setCount(count + 1);\n  console.log("count:", count);\n};',
    b: 'const sumarTres = () => {\n  setCount(c => c + 1);\n  setCount(c => c + 1);\n  setCount(c => c + 1);\n  console.log("count:", count);\n};'
  };
  const logEl = h('div', { class: 'minicon' }, h('div', { class: 'muted' }, '// acá aparece lo que imprime cada clic'));
  const log = (t, cls) => logEl.prepend(h('div', { class: cls || '' }, t));
  const show = (k) => { code.innerHTML = hl(CODES[k], 'jsx'); };
  show('a');
  mountReact(box, () => {
    const e = React.createElement, { useState, useRef } = React;
    return function Batch() {
      const [count, setCount] = useState(0);
      const renders = useRef(0); renders.current++;
      const A = () => { setCount(count + 1); setCount(count + 1); setCount(count + 1); show('a'); log(`A · count dentro del handler: ${count} → pidió "poné ${count + 1}" tres veces`); };
      const B = () => { setCount(c => c + 1); setCount(c => c + 1); setCount(c => c + 1); show('b'); log(`B · count dentro del handler: ${count} → pidió "sumá 1" tres veces`); };
      return e('div', { className: 'rbatch' },
        e('div', { className: 'big-n', 'aria-live': 'polite' }, count),
        e('div', { className: 'muted', style: { fontSize: '13.5px' } }, `render n.º ${renders.current} · tres setCount por clic = un solo render (React los agrupa)`),
        e('div', { className: 'row' },
          e('button', { className: 'btn sm', onClick: A }, 'A · setCount(count + 1) ×3'),
          e('button', { className: 'btn sm', onClick: B }, 'B · setCount(c => c + 1) ×3'),
          e('button', { className: 'btn ghost sm', onClick: () => setCount(0) }, 'Volver a 0')));
    };
  });
  box.append(h('div', { class: 'codeblk' }, code), h('span', { class: 'lbl' }, 'Consola'), logEl);
};

/* 14 · ciclo de vida (React real) */
LABS.lifecycle = (box) => {
  const logEl = h('div', { class: 'rlog' });
  let n = 0;
  const log = (type, t) => { n++; logEl.prepend(h('div', { class: 't-' + type }, h('b', {}, String(n).padStart(2, '0')), ' ', h('span', { class: 'ty' }, type), ' ', t)); };
  const code = h('pre', { class: 'code small' });
  const DEPS = { vacio: '[]', dep: '[valor]', none: '' };
  const showCode = (modo) => { code.innerHTML = hl(`function Hijo({ valor }) {\n  console.log("render");\n  useEffect(() => {\n    console.log("efecto");\n    return () => console.log("limpieza");\n  }${DEPS[modo] ? ', ' + DEPS[modo] : ''});\n  return <p>valor = {valor}</p>;\n}`, 'jsx'); };
  showCode('vacio');
  mountReact(box, () => {
    const e = React.createElement, { useState, useEffect } = React;
    function Hijo({ valor, modo }) {
      log('render', `<Hijo valor={${valor}} />`);
      useEffect(() => { log('efecto', `efecto (valor = ${valor})`); return () => log('limpieza', `limpieza del efecto (valor = ${valor})`); }, modo === 'vacio' ? [] : modo === 'dep' ? [valor] : undefined);
      return e('div', { className: 'rl-child' }, `<Hijo valor={${valor}} />`);
    }
    return function Padre() {
      const [modo, setModo] = useState('vacio'), [valor, setValor] = useState(0), [visible, setVisible] = useState(true), [otro, setOtro] = useState(0);
      const btn = (label, fn, cls) => e('button', { className: 'btn sm ' + (cls || ''), onClick: fn }, label);
      return e('div', { className: 'rlab-in' },
        e('div', { className: 'choices' }, Object.entries({ vacio: 'useEffect(fn, [])', dep: 'useEffect(fn, [valor])', none: 'useEffect(fn) sin array' }).map(([k, l]) =>
          e('button', { key: k, className: 'choice' + (modo === k ? ' right' : ''), onClick: () => { setModo(k); showCode(k); log('info', 'cambié las dependencias: el Hijo se vuelve a montar'); } }, l))),
        e('div', { className: 'row' },
          btn(visible ? 'Desmontar Hijo' : 'Montar Hijo', () => setVisible(!visible), 'primary'),
          btn('valor + 1 (cambia una prop)', () => setValor(valor + 1)),
          btn('Re-render del padre (misma prop)', () => setOtro(otro + 1)),
          btn('Limpiar registro', () => { logEl.replaceChildren(); n = 0; }, 'ghost')),
        visible ? e(Hijo, { key: modo, valor, modo }) : e('div', { className: 'rl-child off' }, '(Hijo desmontado)'));
    };
  });
  box.append(h('div', { class: 'lc' }, h('div', { class: 'codeblk' }, code), h('div', {}, h('span', { class: 'lbl' }, 'Registro (lo más nuevo arriba)'), logEl)));
};

/* 14 · reglas de los hooks */
LABS.hookrules = (box) => bugHunt(box, [
  { l: 'jsx', c: 'function Perfil({ logueado }) {\n  if (logueado) {\n    const [nombre, setNombre] = useState("");\n  }\n  return <p>Perfil</p>;\n}', bad: [2], e: 'Hook dentro de un `if`: los hooks van en el nivel superior, siempre en el mismo orden.' },
  { l: 'jsx', c: 'function Lista({ items }) {\n  const filas = items.map(item => {\n    const [abierto, setAbierto] = useState(false);\n    return <li key={item.id}>{item.nombre}</li>;\n  });\n  return <ul>{filas}</ul>;\n}', bad: [2], e: 'Hook dentro de un callback de `map` (un loop). Si cada fila necesita estado, creá un componente `Fila`.' },
  { l: 'jsx', c: 'function obtenerUsuario() {\n  const [usuario, setUsuario] = useState(null);\n  return usuario;\n}\n\nfunction App() {\n  const u = obtenerUsuario();\n  return <p>{u?.nombre}</p>;\n}', bad: [0, 1], e: 'Usa un hook pero no es componente ni empieza con `use`. Como custom hook: `useUsuario`.' },
  { l: 'jsx', c: 'function Contador() {\n  const handleClick = () => {\n    const [n, setN] = useState(0);\n    setN(n + 1);\n  };\n  return <button onClick={handleClick}>+</button>;\n}', bad: [2], e: 'Hook dentro de un handler. El `useState` va arriba de todo, en el cuerpo del componente.' },
  { l: 'jsx', c: 'function Reloj() {\n  const [seg, setSeg] = useState(0);\n  useEffect(() => {\n    setSeg(seg + 1);\n  });\n  return <p>{seg}</p>;\n}', bad: [3, 4], e: 'Sin array de dependencias, el efecto corre después de cada render y cambia el estado: bucle infinito.' }
]);

/* 15 · controlado vs no controlado (React real) */
LABS.ctrl = (box) => {
  mountReact(box, () => {
    const e = React.createElement, { useState, useRef } = React;
    function Controlado() {
      const [v, setV] = useState(''); const r = useRef(0); r.current++;
      return e('div', { className: 'cc' }, e('h4', null, 'Controlado'), e('code', null, 'value={v} onChange={…}'),
        e('input', { value: v, onChange: ev => setV(ev.target.value), placeholder: 'Escribí acá', 'aria-label': 'Input controlado' }),
        e('div', { className: 'rc' }, 'renders: ', e('b', null, r.current)), e('div', { className: 'muted' }, `estado: "${v}"`));
    }
    function NoControlado() {
      const ref = useRef(); const r = useRef(0); r.current++; const [leido, setLeido] = useState(null);
      return e('div', { className: 'cc' }, e('h4', null, 'No controlado'), e('code', null, 'ref={inputRef}'),
        e('input', { ref, placeholder: 'Escribí acá', 'aria-label': 'Input no controlado' }),
        e('div', { className: 'rc' }, 'renders: ', e('b', null, r.current)),
        e('button', { className: 'btn sm', onClick: () => setLeido(ref.current.value) }, 'Leer inputRef.current.value'),
        leido !== null && e('div', { className: 'muted' }, `leído: "${leido}" (este clic sí renderiza: usé setLeido)`));
    }
    function Congelado() {
      return e('div', { className: 'cc' }, e('h4', null, 'value sin onChange'), e('code', null, 'value="Ana"'),
        e('input', { value: 'Ana', 'aria-label': 'Input congelado' }), e('div', { className: 'muted' }, 'Probá escribir: no se puede. React avisa en la consola del navegador.'));
    }
    return function Ctrl() { return e('div', { className: 'ctrl3' }, e(Controlado), e(NoControlado), e(Congelado)); };
  });
};

/* 15 · react-hook-form builder */
LABS.rhf = (box) => {
  const F = {
    nombre: { label: 'Nombre', type: 'text', val: 'Al', rules: { required: 'El nombre es obligatorio', minLength: [3, 'Mínimo 3 caracteres'], maxLength: [10, 'Máximo 10 caracteres'], pattern: ['^[A-Za-z]+$', 'Solo letras'] }, on: { required: 1, minLength: 1 } },
    email: { label: 'Correo', type: 'text', val: 'ana@mail', rules: { required: 'El correo es obligatorio', pattern: ['^[^@ ]+@[^@ ]+\\.[^@ .]{2,}$', 'Correo inválido'] }, on: { required: 1, pattern: 1 } },
    edad: { label: 'Edad', type: 'number', val: '17', rules: { required: 'La edad es obligatoria', min: [18, 'Debe ser mayor de edad'], max: [99, 'Debe ser menor o igual a 99'] }, on: { min: 1 } }
  };
  const ORDER = ['required', 'min', 'max', 'maxLength', 'minLength', 'pattern'];
  const code = h('pre', { class: 'code small' }), con = h('div', { class: 'minicon' }, h('div', { class: 'muted' }, '// apretá Enviar'));
  const errEls = {}, inputs = {};
  const fields = h('div', { class: 'rhf' }, Object.entries(F).map(([k, f]) => {
    const inp = inputs[k] = h('input', { type: f.type, id: 'rhf-' + k, value: f.val });
    errEls[k] = h('div', { class: 'err' });
    const rules = h('div', { class: 'row' }, Object.keys(f.rules).map(r => { const c = h('button', { class: 'chip' + (f.on[r] ? ' on' : ''), type: 'button', onclick: () => { f.on[r] = !f.on[r]; c.classList.toggle('on', !!f.on[r]); drawCode(); } }, r); return c; }));
    return h('div', { class: 'card' }, h('label', { for: 'rhf-' + k, class: 'lbl' }, f.label), inp, errEls[k], rules);
  }));
  const opt = (k, r) => { const v = F[k].rules[r]; if (r === 'required') return `required: '${v}'`; if (r === 'pattern') return `pattern: { value: /${v[0]}/, message: '${v[1]}' }`; return `${r}: { value: ${v[0]}, message: '${v[1]}' }`; };
  function drawCode() {
    const lines = ['<form onSubmit={handleSubmit(onSubmit, onInvalid)}>'];
    Object.keys(F).forEach(k => { const act = Object.keys(F[k].rules).filter(r => F[k].on[r]); lines.push(`  <input${F[k].type === 'number' ? ' type="number"' : ''} {...register('${k}'${act.length ? ', {\n' + act.map(r => '    ' + opt(k, r)).join(',\n') + '\n  }' : ''})} />`); lines.push(`  {errors.${k} && <span>{errors.${k}.message}</span>}`); });
    lines.push('  <button type="submit">Enviar</button>', '</form>');
    code.innerHTML = hl(lines.join('\n'), 'jsx');
  }
  function validate(k) {
    const f = F[k], v = inputs[k].value, empty = v === '';
    for (const r of ORDER) {
      if (!f.on[r] || !f.rules[r]) continue;
      const rule = f.rules[r];
      if (r === 'required' && empty) return rule;
      if (empty) continue;
      if (r === 'min' && Number(v) < rule[0]) return rule[1];
      if (r === 'max' && Number(v) > rule[0]) return rule[1];
      if (r === 'maxLength' && v.length > rule[0]) return rule[1];
      if (r === 'minLength' && v.length < rule[0]) return rule[1];
      if (r === 'pattern' && !new RegExp(rule[0]).test(v)) return rule[1];
    }
    return null;
  }
  const send = h('button', { class: 'btn primary', type: 'button', onclick: () => {
    const errs = {}; Object.keys(F).forEach(k => { const m = validate(k); errEls[k].textContent = m || ''; if (m) errs[k] = m; });
    if (Object.keys(errs).length) con.prepend(h('div', { style: { color: 'var(--bad)' } }, '> onInvalid(errors)  · onSubmit NO se llamó\n' + Object.entries(errs).map(([k, m]) => `errors.${k}.message = '${m}'`).join('\n')));
    else con.prepend(h('div', {}, '> onSubmit(data)\n{' + Object.keys(F).map(k => `${k}: '${inputs[k].value}'`).join(', ') + '}\n// ojo: los valores llegan como string (para números: valueAsNumber: true)'));
  } }, 'Enviar (handleSubmit)');
  box.append(fields, h('div', { class: 'row' }, send, h('span', { class: 'muted', style: { fontSize: '13.5px' } }, 'Los chips activan o desactivan cada regla.')), h('div', { class: 'fl' }, h('div', { class: 'codeblk' }, code), h('div', {}, h('span', { class: 'lbl' }, 'Consola'), con)));
  drawCode();
};

/* 16 · arquitectura */
LABS.folders = (box) => classifier(box, {
  bins: [['auth', 'modules/auth'], ['products', 'modules/products'], ['orders', 'modules/orders'], ['shared', 'modules/shared']],
  items: [['LoginForm.jsx', 'auth', 'auth/components/'], ['useAuth.js', 'auth', 'auth/hooks/'], ['AuthProvider.jsx', 'auth', 'auth/context/'], ['ProtectedRoute.jsx', 'auth', 'auth/components/'], ['frontendErrorMessage.js', 'auth', 'auth/helpers/'], ['ProductsPage.jsx', 'products', 'products/pages/'], ['CreateProductPage.jsx', 'products', 'products/pages/'], ['productsService.js', 'products', 'products/services/'], ['ListOrdersPage.jsx', 'orders', 'orders/pages/'], ['Button.jsx', 'shared', 'shared/components/ (lo usa toda la app)'], ['Header.jsx', 'shared', 'shared/components/'], ['Input.jsx', 'shared', 'shared/components/']]
});
LABS.solid = (box) => rounds(box, {
  choices: ['S', 'O', 'L', 'I', 'D'],
  cases: [
    { c: '`UserProfile` hace el fetch del usuario, calcula la edad y dibuja todo en el mismo componente.', a: 'S', e: 'Responsabilidad única: separá la lógica en un hook `useUser` y dejá componentes visuales.' },
    { c: '`<Avatar user={user} />` recibe un objeto de 30 campos y solo usa `user.foto`.', a: 'I', e: 'Segregación de interfaces: pasale solo lo que usa, `<Avatar foto={user.foto} />`.' },
    { c: '`ProductsPage` hace `fetch("http://localhost:5001/api/products")` directo dentro del componente.', a: 'D', e: 'Inversión de dependencias: la vista debería depender de una abstracción (`useProducts`, un servicio), no del fetch concreto.' },
    { c: 'Para agregarle un ícono a `Card` tuviste que modificar su código. Si renderizara `children`, alcanzaba con pasárselo.', a: 'O', e: 'Abierto/cerrado: composición con children para extender sin modificar.' },
    { c: 'Creaste `DangerButton` a partir de `Button`, pero ignora la prop `onClick` y rompe los formularios donde lo usás.', a: 'L', e: 'Liskov: la variante tiene que poder reemplazar al componente base sin romper el comportamiento de sus props.' },
    { c: '`LoginForm` valida, hace la petición, guarda el token en localStorage y además dibuja el header.', a: 'S', e: 'Hace cuatro cosas. Separar: validación (react-hook-form), servicio de auth, contexto y componentes visuales.' }
  ]
});
LABS.atomic = (box) => classifier(box, {
  bins: [['at', 'Átomo'], ['mo', 'Molécula'], ['or', 'Organismo'], ['pl', 'Plantilla'], ['pa', 'Página']],
  items: [['<button>', 'at', 'indivisible'], ['Label', 'at', ''], ['Input', 'at', ''], ['Icono', 'at', ''], ['InputField (Label + Input + Error)', 'mo', 'átomos que trabajan juntos'], ['Menú seleccionable (ul + li + a)', 'mo', 'del Sidebar de la diapositiva'], ['Button (componente personalizado)', 'mo', 'así lo clasifica la diapositiva del Header'], ['Header (título + Cerrar sesión)', 'or', 'sección completa'], ['Sidebar', 'or', ''], ['Formulario de login', 'or', ''], ['Card de producto', 'or', ''], ['DashboardTemplate (Header + Sidebar + Footer, sin datos)', 'pl', 'layout sin datos reales'], ['ProductsPage', 'pa', 'plantilla + datos reales'], ['CreateProductPage', 'pa', '']]
});

/* 17 · Tailwind breakpoints */
const TW_BP = { '': 0, sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 };
const TW_CSS = { flex: { display: 'flex' }, 'flex-col': { flexDirection: 'column' }, 'flex-row': { flexDirection: 'row' }, 'gap-2': { gap: '0.5rem' }, 'gap-6': { gap: '1.5rem' }, 'p-2': { padding: '0.5rem' }, 'p-6': { padding: '1.5rem' }, 'w-full': { width: '100%' }, 'w-1/3': { width: '33.333%' }, 'text-sm': { fontSize: '0.875rem' }, 'text-base': { fontSize: '1rem' }, 'text-xl': { fontSize: '1.25rem' }, hidden: { display: 'none' }, block: { display: 'block' } };
LABS.twbp = (box) => {
  const GROUPS = { contenedor: 'flex flex-col md:flex-row gap-2 lg:gap-6 p-2 md:p-6', tarjeta: 'w-full md:w-1/3 text-sm md:text-base xl:text-xl', badge: 'hidden lg:block' };
  const range = h('input', { type: 'range', min: '320', max: '1600', step: '10', value: '700', id: 'tw-w', 'aria-label': 'Ancho de pantalla' });
  const ruler = h('div', { class: 'tw-ruler' }, Object.entries(TW_BP).filter(([k]) => k).map(([k, px]) => { const m = h('span', { class: 'mk', 'data-bp': k }, k, h('small', {}, ' ' + px)); m.style.left = ((px - 320) / 1280 * 100) + '%'; return m; }), h('i', { class: 'pos' }));
  const lbl = h('div', { class: 'mono', style: { fontSize: '14px' } });
  const toks = h('div', { class: 'tw-toks' });
  const card = (n) => h('div', { class: 'tw-card' }, h('span', { class: 'tw-badge' }, 'nuevo'), `Turno ${n}`);
  const cont = h('div', { class: 'tw-cont' }, card(1), card(2), card(3));
  const wrap = h('div', { class: 'dev-wrap' }, h('div', { class: 'dev tw-dev' }, cont));
  function apply(el, cls, w) {
    el.removeAttribute('style');
    const list = cls.split(' ').map(t => { const m = t.match(/^(?:(sm|md|lg|xl|2xl):)?(.+)$/); return { t, bp: m[1] || '', u: m[2] }; });
    list.filter(x => w >= TW_BP[x.bp]).sort((a, b) => TW_BP[a.bp] - TW_BP[b.bp]).forEach(x => Object.assign(el.style, TW_CSS[x.u] || {}));
    return list;
  }
  function upd() {
    const w = +range.value;
    const dev = wrap.firstChild, avail = wrap.clientWidth - 20 || 600, sc = Math.min(1, avail / w);
    dev.style.width = w + 'px'; dev.style.transform = `scale(${sc})`;
    const active = Object.entries(TW_BP).filter(([k, px]) => w >= px).pop()[0];
    ruler.querySelector('.pos').style.left = ((w - 320) / 1280 * 100) + '%';
    $$('.mk', ruler).forEach(m => m.classList.toggle('on', w >= TW_BP[m.dataset.bp]));
    lbl.innerHTML = `ancho: <b>${w}px</b> · breakpoint activo: <b>${active || 'ninguno (base, móvil)'}</b>`;
    toks.replaceChildren();
    const lc = apply(cont, GROUPS.contenedor, w);
    $$('.tw-card', cont).forEach(c => { apply(c, GROUPS.tarjeta, w); apply(c.querySelector('.tw-badge'), GROUPS.badge, w); });
    Object.entries(GROUPS).forEach(([g, cls]) => toks.append(h('div', { class: 'tw-row' }, h('span', { class: 'lbl' }, g), ...cls.split(' ').map(t => { const bp = (t.match(/^(sm|md|lg|xl|2xl):/) || [, ''])[1]; return h('span', { class: 'tok' + (w >= TW_BP[bp] ? ' on' : '') }, t); }))));
    requestAnimationFrame(() => { wrap.style.height = (dev.offsetHeight * sc + 20) + 'px'; });
  }
  range.addEventListener('input', upd);
  new ResizeObserver(() => upd()).observe(wrap);
  box.append(h('div', { class: 'field' }, h('label', { for: 'tw-w' }, 'Ancho de la pantalla'), range), ruler, lbl, toks, wrap);
  setTimeout(upd, 0);
};
LABS.twcss = (box) => rounds(box, {
  pick: 8, mono: false,
  cases: [
    { c: '`p-4`', o: ['`padding: 1rem`', '`padding: 4px`', '`padding: 4rem`', '`margin: 1rem`'] },
    { c: '`flex`', o: ['`display: flex`', '`flex: 1`', '`display: block`', '`flex-direction: row`'] },
    { c: '`flex-col`', o: ['`flex-direction: column`', '`columns: 1`', '`grid-template-columns: 1fr`', '`flex-wrap: wrap`'] },
    { c: '`justify-between`', o: ['`justify-content: space-between`', '`align-items: space-between`', '`justify-items: start`', '`gap: auto`'] },
    { c: '`items-center`', o: ['`align-items: center`', '`justify-content: center`', '`text-align: center`', '`vertical-align: middle`'] },
    { c: '`gap-4`', o: ['`gap: 1rem`', '`gap: 4px`', '`margin: 1rem`', '`gap: 4rem`'] },
    { c: '`w-full`', o: ['`width: 100%`', '`width: 100vw`', '`max-width: 100%`', '`width: auto`'] },
    { c: '`hidden`', o: ['`display: none`', '`visibility: hidden`', '`opacity: 0`', '`overflow: hidden`'] },
    { c: '`text-center`', o: ['`text-align: center`', '`align-items: center`', '`justify-content: center`', '`vertical-align: middle`'] },
    { c: '`font-bold`', o: ['`font-weight: 700`', '`font-size: bold`', '`font-weight: 400`', '`text-decoration: bold`'] },
    { c: '`rounded-lg`', o: ['`border-radius: 0.5rem`', '`border: 1px solid`', '`border-radius: 50%`', '`outline: 2px solid`'] },
    { c: '`md:grid-cols-3`', o: ['Desde 768px: `grid-template-columns: repeat(3, minmax(0, 1fr))`', 'Hasta 768px: tres columnas', '`columns: 3` siempre', '`grid-template-rows: repeat(3, 1fr)`'] }
  ]
});

/* 18 · proxy + login */
LABS.proxy = (box) => {
  let resp = 'err', mode = 'dev', busy = false;
  const rTabs = h('div', { class: 'choices' }, [['ok', '200 · devuelve el token'], ['err', '401 · { "code": 1000 }']].map(([k, l]) => h('button', { class: 'choice', 'data-k': k, onclick: () => { resp = k; draw(); } }, l)));
  const mTabs = h('div', { class: 'choices' }, [['dev', 'npm run dev'], ['prod', 'producción (dist/)']].map(([k, l]) => h('button', { class: 'choice', 'data-k': k, onclick: () => { mode = k; draw(); } }, l)));
  const st = ['Navegador', 'Vite :5173', 'Backend :5001'].map((n, i) => h('div', { class: 'st' }, h('div', { class: 'ic' }, ['react', 'proxy', 'api'][i]), n));
  const packet = h('div', { class: 'packet' });
  const trip = h('div', { class: 'trip' }, h('div', { class: 'rail-l' }), ...st, packet);
  const log = h('div', { class: 'trip-log' });
  const screen = h('div', { class: 'msg info' }, 'Formulario de login: usuario y contraseña cargados.');
  function draw() {
    $$('.choice', rTabs).forEach(b => b.classList.toggle('right', b.dataset.k === resp));
    $$('.choice', mTabs).forEach(b => b.classList.toggle('right', b.dataset.k === mode));
    st[1].querySelector('.ic').textContent = mode === 'dev' ? 'proxy' : 'nginx'; st[1].lastChild.textContent = mode === 'dev' ? 'Vite :5173' : 'Servidor de dist/';
  }
  const go = h('button', { class: 'btn primary', onclick: async () => {
    if (busy) return; busy = true; go.disabled = true; log.replaceChildren(); screen.className = 'msg info'; screen.textContent = 'Enviando…';
    const pos = ['16.6%', '50%', '83.4%'];
    const hop = async (to, txt) => { packet.style.opacity = 1; packet.style.left = pos[to]; st.forEach((s, k) => s.classList.toggle('on', k === to)); await sleep(900); log.append(h('div', { html: txt })); await sleep(250); };
    packet.style.transition = 'none'; packet.style.left = pos[0]; packet.offsetWidth; packet.style.transition = '';
    log.append(h('div', { html: '<span class="s">1.</span> <code>fetch("api/auth/login", { method: "POST", body: JSON.stringify(data) })</code>' }));
    if (mode === 'prod') {
      await hop(1, '<span class="s">2.</span> No hay Vite en producción: el pedido llega al servidor que sirve <code>dist/</code>, que no conoce <code>/api</code>.');
      await hop(0, '<span class="s">3.</span> Respuesta <b>404</b> (una página HTML). <code>response.ok</code> es false y <code>response.json()</code> falla al parsear.');
      screen.className = 'msg bad'; screen.textContent = 'El login no anda en producción: el proxy era solo del servidor de desarrollo. Hay que apuntar a la URL real del backend (o configurar el proxy en el servidor).';
    } else {
      await hop(1, '<span class="s">2.</span> Vite ve que la ruta empieza con <code>/api</code> y la reenvía (proxy).');
      await hop(2, '<span class="s">3.</span> Llega a <code>http://localhost:5001/api/auth/login</code>: tu backend procesa el login.');
      if (resp === 'ok') {
        await hop(0, '<span class="s">4.</span> <b>200 OK</b> → <code>response.ok</code> true → <code>const token = await response.json()</code>.');
        screen.className = 'msg ok'; screen.textContent = 'Sesión iniciada: guardás el token (localStorage) y navegás con navigate("/app").';
      } else {
        await hop(0, '<span class="s">4.</span> <b>401</b> con <code>{ "code": 1000 }</code>. fetch NO rechaza: <code>response.ok</code> es false.');
        log.append(h('div', { html: '<span class="s">5.</span> <code>frontendErrorMessage[1000]</code> → mensaje para el usuario, y <code>return</code> (no se lee el token).' }));
        screen.className = 'msg bad'; screen.textContent = 'Usuario y/o Contraseña no son correctos';
      }
    }
    packet.style.opacity = 0; busy = false; go.disabled = false;
  } }, 'Iniciar sesión');
  box.append(h('div', { class: 'field' }, h('span', { class: 'lbl' }, 'El backend responde'), rTabs), h('div', { class: 'field' }, h('span', { class: 'lbl' }, 'Dónde corre el front'), mTabs), go, trip, log, h('span', { class: 'lbl' }, 'Lo que ve el usuario'), screen);
  draw();
};

/* 18 · mini router */
LABS.routersim = (box) => {
  const S = { path: '/login', auth: false, outlet: true, count: 0, hist: ['/login'], reloads: 0 };
  const ROUTES = [
    { id: 'login', path: '/login', el: 'LoginPage' },
    { id: 'admin', path: '/admin', el: 'Dashboard', prot: true, children: [{ id: 'home', path: '/admin/home', el: 'Home' }, { id: 'prod', path: '/admin/products', el: 'ListProductsPage' }, { id: 'ord', path: '/admin/orders', el: 'ListOrdersPage' }] },
    { id: 'car', path: '/careers/:id', el: 'CareerDetail' }
  ];
  const match = (p) => {
    for (const r of ROUTES) {
      if (r.children) { if (p === r.path) return { r }; const c = r.children.find(c => c.path === p); if (c) return { r, c }; continue; }
      if (r.path.includes(':')) { const mm = p.match(new RegExp('^' + r.path.replace(/:\w+/, '([^/]+)') + '$')); if (mm) return { r, params: { id: mm[1] } }; }
      else if (r.path === p) return { r };
    }
    return null;
  };
  const logEl = h('div', { class: 'trip-log rs-log' });
  const say = (t) => { logEl.prepend(h('div', { html: t })); while (logEl.children.length > 8) logEl.lastChild.remove(); };
  const url = h('div', { class: 'rs-url mono' }), scr = h('div', { class: 'rs-scr' }), cfg = h('pre', { class: 'code small rs-cfg' }), tree = h('div', { class: 'rs-tree mono' }), banner = h('div');
  function go(to, how) {
    banner.replaceChildren();
    if (how === 'back') { if (S.hist.length > 1) { S.hist.pop(); S.path = S.hist[S.hist.length - 1]; say(`<code>navigate(-1)</code> → vuelve a <code>${S.path}</code>`); } else say('No hay página anterior en el historial.'); }
    else {
      if (how === 'a') { S.count = 0; S.reloads++; banner.replaceChildren(h('div', { class: 'msg warn' }, 'Recarga completa: el navegador pidió la página de nuevo y React arrancó de cero (el contador volvió a 0). El token sigue: está en localStorage.')); say(`<code>&lt;a href="${to}"&gt;</code> → <b>recarga toda la página</b>`); }
      else if (how === 'nav') say(`<code>navigate("${to}")</code> → navega sin recargar`);
      else say(`<code>&lt;Link to="${to}"&gt;</code> → navega sin recargar`);
      S.path = to; S.hist.push(to);
    }
    const m = match(S.path);
    if (m && m.r.prot && S.auth && how === 'a' && S.bug) { say('Primer render tras la recarga: <code>isAuthenticated</code> todavía es <b>false</b> (el useEffect corre después del render) → ProtectedRoute redirige a <code>/login</code> aunque el token esté.'); S.path = '/login'; S.hist.push('/login'); }
    else if (m && m.r.prot && !S.auth) { say("ProtectedRoute: <code>isAuthenticated</code> es false → <code>&lt;Navigate to='/login' /&gt;</code>"); S.path = '/login'; S.hist.push('/login'); }
    draw();
  }
  const link = (to, label, cls) => h('button', { class: 'nl' + (S.path === to ? ' active' : '') + (cls ? ' ' + cls : ''), onclick: () => go(to, 'link') }, label);
  function draw() {
    const m = match(S.path);
    url.innerHTML = `<span class="muted">http://localhost:5173</span><b>${esc(S.path)}</b>` + (S.reloads ? ` <span class="pill hot2">${S.reloads} recarga${S.reloads > 1 ? 's' : ''}</span>` : '');
    const hlId = m ? (m.c ? m.c.id : m.r.id) : null;
    const lines = [['', 'createBrowserRouter(['], ['login', "  { path: '/login', element: <LoginPage /> },"], ['admin', "  { path: '/admin',"], ['admin', '    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,'], ['', '    children: ['], ['home', "      { path: '/admin/home', element: <Home /> },"], ['prod', "      { path: '/admin/products', element: <ListProductsPage /> },"], ['ord', "      { path: '/admin/orders', element: <ListOrdersPage /> },"], ['', '    ] },'], ['car', "  { path: '/careers/:id', element: <CareerDetail /> },"], ['', ']);']];
    cfg.innerHTML = lines.map(([id, l]) => `<span class="l${id && (id === hlId || (m && m.c && id === 'admin')) ? ' cur' : ''}">${hl(l, 'jsx')}</span>`).join('');
    let chain = ['AuthProvider', 'RouterProvider'];
    let body;
    if (!m) { chain.push('errorElement → ErrorNotFoundPage'); body = h('div', { class: 'rs-page err' }, h('h4', {}, '404 · ErrorNotFoundPage'), h('p', {}, 'Ninguna ruta coincide: se muestra el errorElement.')); }
    else if (m.r.id === 'login') {
      chain.push('LoginPage');
      body = h('div', { class: 'rs-page' }, h('h4', {}, 'LoginPage'), h('button', { class: 'btn primary sm', onclick: () => { S.auth = true; say("Login OK → <code>localStorage.setItem('token', …)</code>"); go('/admin/home', 'nav'); } }, 'Iniciar sesión'));
    } else if (m.r.id === 'car') {
      chain.push('CareerDetail');
      body = h('div', { class: 'rs-page' }, h('h4', {}, 'CareerDetail'), h('p', { html: `<code>useParams()</code> → <code>{ id: '${esc(m.params.id)}' }</code> (siempre string)` }));
    } else {
      chain.push('ProtectedRoute', 'Dashboard');
      const main = h('main', { class: 'rs-main' });
      if (!S.outlet) { main.append(h('div', { class: 'rs-empty' }, 'Sin <Outlet />: las rutas hijas no tienen dónde dibujarse.')); if (m.c) chain.push('(sin Outlet: ' + m.c.el + ' no se ve)'); }
      else if (m.c) { chain.push('Outlet', m.c.el); main.append(h('h4', {}, m.c.el), h('p', { class: 'muted' }, 'Renderizado dentro del <Outlet /> del Dashboard.')); }
      else main.append(h('p', { class: 'muted' }, 'Elegí una sección del menú.'));
      body = h('div', { class: 'rs-dash' },
        h('header', {}, h('b', {}, 'Dashboard'), h('span', { class: 'row' }, h('button', { class: 'btn sm', onclick: () => { S.count++; draw(); } }, `Clics: ${S.count}`), h('button', { class: 'btn ghost sm', onclick: () => { S.auth = false; say("Cerrar sesión → <code>localStorage.removeItem('token')</code>"); go('/login', 'nav'); } }, 'Cerrar sesión'))),
        h('nav', {}, link('/admin/home', 'Home'), link('/admin/products', 'Productos'), link('/admin/orders', 'Pedidos')), main);
    }
    tree.textContent = chain.join(' › ');
    scr.replaceChildren(body);
  }
  const outletCb = h('input', { type: 'checkbox', id: 'rs-outlet', checked: true });
  const bugCb = h('input', { type: 'checkbox' });
  bugCb.addEventListener('change', () => { S.bug = bugCb.checked; say(S.bug ? 'AuthProvider con <code>useState(false)</code> y el token leído en un <code>useEffect</code>' : 'AuthProvider con <code>useState(() =&gt; !!localStorage.getItem("token"))</code>'); });
  outletCb.addEventListener('change', () => { S.outlet = outletCb.checked; say(S.outlet ? 'Dashboard con <code>&lt;Outlet /&gt;</code>' : 'Le sacaste el <code>&lt;Outlet /&gt;</code> al Dashboard'); draw(); });
  const ctl = h('div', { class: 'ops' },
    h('button', { class: 'btn sm', onclick: () => go('/admin/products', 'link') }, '<Link to="/admin/products">'),
    h('button', { class: 'btn sm', onclick: () => go('/admin/products', 'a') }, '<a href="/admin/products">'),
    h('button', { class: 'btn sm', onclick: () => go('/admin/orders', 'link') }, '<Link to="/admin/orders">'),
    h('button', { class: 'btn sm', onclick: () => go('/careers/7', 'nav') }, 'navigate("/careers/7")'),
    h('button', { class: 'btn sm', onclick: () => go(null, 'back') }, 'navigate(-1)'),
    h('button', { class: 'btn sm', onclick: () => go('/no-existe', 'link') }, '<Link to="/no-existe">'));
  box.append(h('div', { class: 'rs-bar' }, url), banner, ctl, h('label', { class: 'row', style: { fontSize: '14px' } }, outletCb, ' El Dashboard tiene ', h('code', {}, '<Outlet />')),
    h('label', { class: 'row', style: { fontSize: '14px' } }, bugCb, ' AuthProvider arranca en ', h('code', {}, 'useState(false)'), ' y lee el token en un ', h('code', {}, 'useEffect')),
    h('div', { class: 'rs' }, h('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px', minWidth: 0 } }, h('span', { class: 'lbl' }, 'Rutas (la que coincide, resaltada)'), cfg, h('span', { class: 'lbl' }, 'Árbol renderizado'), tree), h('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px', minWidth: 0 } }, h('span', { class: 'lbl' }, 'Pantalla'), scr, h('span', { class: 'lbl' }, 'Registro'), logEl)));
  say('Arrancás en <code>/login</code>, sin token.');
  draw();
};

export { LABS };
