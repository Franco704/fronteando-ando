/* Práctica: laboratorios visuales, trampas de parcial, mini-quiz por lección, simulacro,
   proyectos y consola JS/React. Traído del "Laboratorio Frontend DSW" y adaptado a la guía.
   Expone window.FX; app.js lo usa para montar todo en las lecciones y en #/simulacro y #/proyectos. */
(() => {
const { QUESTIONS, HOT, PROJECTS, TRAPS, VLABS, META } = window.PRACTICA;

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
VLABS.anatomy = { title: 'Anatomía de un elemento', sub: 'Tocá cada parte de la etiqueta para ver cómo se llama.' };

let host;
function fxHost() { if (!host) { host = h('div', { class: 'fx' }); document.body.append(host); } return host; }
// Navega a una ruta de la guía; si ya estamos ahí, la vuelve a dibujar
function go(r) { if (location.hash === '#/' + r) window.dispatchEvent(new HashChangeEvent('hashchange')); else location.hash = '#/' + r; }
const mainEl = document.getElementById('lesson');
function view() {
  cleanup();
  const v = h('div', { class: 'fx' });
  mainEl.replaceChildren(h('article', { class: 'lesson wide' }, v));
  return v;
}
function cleanup() { document.body.classList.remove('exam-on'); ReactRoots.splice(0).forEach(r => { try { r.unmount(); } catch (e) {} }); }

/* ───────── helpers ───────── */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const sleep = ms => new Promise(r => setTimeout(r, RM ? 0 : ms));
function h(tag, props, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'text') el.textContent = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (v === true) el.setAttribute(k, '');
    else el.setAttribute(k, v);
  }
  for (const c of kids.flat(Infinity)) {
    if (c == null || c === false) continue;
    el.append(c.nodeType ? c : document.createTextNode(String(c)));
  }
  return el;
}
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function hl(code, lang) { return lang === 'tree' || lang === 'text' ? esc(code) : window.GUIDE.highlight(String(code), lang === 'json' ? 'js' : lang); }
/* `code` → <code> */
function fmt(t) { return esc(t).replace(/`([^`]+)`/g, '<code>$1</code>'); }
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
/* FLIP: animate children of `root` between layouts */
function flip(root, mutate) {
  const kids = Array.from(root.children);
  const first = new Map(kids.map(k => [k, k.getBoundingClientRect()]));
  mutate();
  if (RM) return;
  kids.forEach(k => {
    const a = first.get(k), b = k.getBoundingClientRect();
    if (!a) return;
    const dx = a.left - b.left, dy = a.top - b.top, sx = a.width / (b.width || 1), sy = a.height / (b.height || 1);
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && Math.abs(sx - 1) < .01 && Math.abs(sy - 1) < .01) return;
    k.animate([{ transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, transformOrigin: 'top left' }, { transform: 'none', transformOrigin: 'top left' }], { duration: 450, easing: 'cubic-bezier(.2,.8,.2,1)' });
  });
}
function codeBox(code, lang, cap, run) {
  const pre = h('pre', { class: 'code', html: hl(code, lang) });
  const LBL = { html: 'HTML', css: 'CSS', jsx: 'JSX', json: 'JSON', bash: 'Terminal', tree: 'Carpetas', js: 'JS' };
  const bar = h('div', { class: 'bar' }, h('span', { class: 'cap' }, cap || ''), run ? h('button', { class: 'btn sm', onclick: () => Konsole.open(code, true, run === 'r' ? 'react' : 'js') }, run === 'r' ? '▶ Probalo en React' : '▶ Probalo') : h('span', { class: 'lbl' }, LBL[lang] || 'JS'));
  return h('div', { class: 'codeblk' }, bar, pre);
}

/* ───────── LABS ───────── */
const LABS = {};

/* 1 · URL */
LABS.url = (box) => {
  const inp = h('input', { type: 'url', class: 'mono', id: 'lab-url', value: 'https://www.google.com/search?q=chatgpt', 'aria-label': 'URL' });
  const parts = h('div', { class: 'url-parts' });
  const err = h('div');
  function parse() {
    parts.innerHTML = ''; err.innerHTML = '';
    let u;
    try { u = new URL(inp.value.trim()); } catch (e) { err.append(h('div', { class: 'msg bad' }, 'Esa URL no es válida. ¿Le falta el protocolo? Probá empezar con https://')); return null; }
    const segs = [['protocolo', u.protocol + '//', 'p0'], ['dominio', u.hostname, 'p1']];
    if (u.port) segs.push(['puerto', ':' + u.port, 'p4']);
    if (u.pathname && u.pathname !== '/') segs.push(['ruta', u.pathname, 'p2']); else segs.push(['ruta', '/', 'p2']);
    if (u.search) segs.push(['parámetros', u.search, 'p3']);
    if (u.hash) segs.push(['fragmento', u.hash, 'p4']);
    segs.forEach(([n, v, c], i) => { const el = h('div', { class: 'url-part ' + c }, h('span', { class: 'v' }, v), h('span', { class: 'n' }, n)); el.style.animationDelay = (i * 90) + 'ms'; parts.append(el); });
    return u;
  }
  inp.addEventListener('input', parse);
  const st = ['Navegador', 'DNS', 'Servidor'].map((n, i) => h('div', { class: 'st' }, h('div', { class: 'ic' }, ['cliente', 'dns', 'server'][i]), n));
  const packet = h('div', { class: 'packet' });
  const trip = h('div', { class: 'trip' }, h('div', { class: 'rail-l' }), ...st, packet);
  const log = h('div', { class: 'trip-log' });
  let busy = false;
  const go = h('button', { class: 'btn primary', onclick: async () => {
    const u = parse(); if (!u || busy) return; busy = true; go.disabled = true; log.innerHTML = '';
    const ip = u.hostname === 'www.google.com' ? '142.250.217.46' : fakeIp(u.hostname);
    const pos = ['16.6%', '50%', '83.4%'];
    const step = async (to, from, txt) => { st.forEach(s => s.classList.remove('on')); st[from].classList.add('on'); packet.style.opacity = 1; packet.style.left = pos[to]; await sleep(950); st[to].classList.add('on'); log.append(h('div', { html: txt })); await sleep(350); };
    packet.style.transition = 'none'; packet.style.left = pos[0]; packet.offsetWidth; packet.style.transition = '';
    await step(1, 0, `<span class="s">1.</span> Navegador → DNS: ¿cuál es la IP de <b>${esc(u.hostname)}</b>?`);
    await step(0, 1, `<span class="s">2.</span> DNS → Navegador: <b>${ip}</b>${u.hostname === 'www.google.com' ? '' : ' <span class="muted">(IP de ejemplo)</span>'}`);
    await step(2, 0, `<span class="s">3.</span> Navegador → ${ip}: <b>GET ${esc(u.pathname + u.search)}</b> por ${u.protocol === 'https:' ? 'HTTPS (cifrado)' : 'HTTP'}`);
    await step(0, 2, `<span class="s">4.</span> Servidor → Navegador: <b>200 OK</b> + documento HTML`);
    log.append(h('div', { html: '<span class="s">5.</span> El navegador parsea el HTML, arma el DOM, aplica CSS, ejecuta JS y <b>renderiza</b>.' }));
    packet.style.opacity = 0; busy = false; go.disabled = false;
  } }, 'Enviar petición');
  function fakeIp(s) { let x = 0; for (const c of s) x = (x * 31 + c.charCodeAt(0)) >>> 0; return [(x >> 24 & 255) % 200 + 20, x >> 16 & 255, x >> 8 & 255, x & 255].join('.'); }
  box.append(h('div', { class: 'field' }, h('label', { for: 'lab-url' }, 'URL'), inp), parts, err, h('div', { class: 'row' }, go, h('span', { class: 'muted', style: { fontSize: '14px' } }, 'Probá también con http://localhost:5173/turnos#hoy')), trip, log);
  parse();
};

/* 1 · Render classifier */
LABS.render = (box) => {
  const CASES = [
    { c: 'Gmail: abrís un mail, la URL cambia, pero la página nunca se recarga.', a: 'SPA', alt: { CSR: 'Casi: SPA es un tipo de CSR. Lo distintivo acá es que nunca recarga → SPA.' }, e: 'Toda la app vive en un index.html.' },
    { c: 'Un diario arma cada nota en el servidor en cada visita, para posicionar bien en Google.', a: 'SSR', e: 'HTML completo por request → SEO optimizado.' },
    { c: 'Tu portfolio, generado una sola vez con Astro al hacer el build.', a: 'SSG', e: 'HTML estático generado de antemano.' },
    { c: 'Spotify web: la instalás como app y sigue andando sin conexión.', a: 'PWA', e: 'Offline + instalable gracias a service workers.' },
    { c: 'Un sitio en WordPress donde cada clic carga una página completa nueva.', a: 'MPA', e: 'Multi-Page Application tradicional.' },
    { c: 'Un dashboard: llega un HTML vacío y JavaScript construye toda la interfaz en el navegador.', a: 'CSR', alt: { SPA: 'También es válido pensarlo como SPA, pero lo que describe el caso es el renderizado en el cliente → CSR.' }, e: 'Peor SEO, primera carga más lenta, navegación fluida.' }
  ];
  let order = shuffle(CASES), i = 0, ok = 0;
  const caseEl = h('div'), fb = h('div'), sc = h('div', { class: 'score' });
  const ch = h('div', { class: 'choices' });
  function show() {
    fb.innerHTML = ''; ch.innerHTML = ''; sc.textContent = `Ronda ${i + 1} de ${order.length} · aciertos: ${ok}`;
    const cur = order[i];
    caseEl.replaceChildren(h('div', { class: 'case' }, cur.c));
    ['SSR', 'CSR', 'SPA', 'PWA', 'MPA', 'SSG'].forEach(t => ch.append(h('button', { class: 'choice', onclick: (ev) => {
      $$('.choice', ch).forEach(b => b.disabled = true);
      const right = t === cur.a;
      if (right) ok++;
      ev.currentTarget.classList.add(right ? 'right' : 'wrong');
      if (!right) $$('.choice', ch).find(b => b.textContent === cur.a).classList.add('right');
      const note = !right && cur.alt && cur.alt[t] ? cur.alt[t] : '';
      fb.replaceChildren(h('div', { class: 'msg ' + (right ? 'ok' : note ? 'warn' : 'bad') }, (right ? '✔ ' : '✘ ') + cur.a + '. ' + (note || cur.e)),
        h('div', { class: 'row', style: { marginTop: '8px' } }, h('button', { class: 'btn sm', onclick: () => { i++; if (i < order.length) show(); else end(); } }, i + 1 < order.length ? 'Siguiente caso →' : 'Ver resultado')));
      sc.textContent = `Ronda ${i + 1} de ${order.length} · aciertos: ${ok}`;
    } }, t)));
  }
  function end() { ch.innerHTML = ''; caseEl.replaceChildren(h('div', { class: 'case' }, `${ok} de ${order.length}. ${ok === order.length ? 'Impecable.' : 'Repasá la tabla de arriba y volvé a intentar.'}`)); fb.replaceChildren(h('button', { class: 'btn sm', onclick: () => { order = shuffle(CASES); i = 0; ok = 0; show(); } }, 'Otra vez')); }
  box.append(sc, caseEl, ch, fb); show();
};

/* 2 · Anatomy (animated block) */
function anatomyBlock() {
  const parts = [
    { cls: 't', txt: '<p', k: 'ap' }, { cls: '', txt: ' ', k: '' }, { cls: 'a', txt: 'class', k: 'at' }, { cls: '', txt: '=', k: 'at' }, { cls: 'vv', txt: '"editor-note"', k: 'at' }, { cls: 't', txt: '>', k: 'ap' },
    { cls: '', txt: 'Mi gato es muy gruñón', k: 'co' }, { cls: 't', txt: '</p>', k: 'ci' }
  ];
  const INFO = { ap: ['Etiqueta de apertura', 'Nombre del elemento entre < >: indica dónde empieza.'], at: ['Atributo', 'Espacio + nombre + = + valor entre comillas.'], co: ['Contenido', 'Lo que va adentro: texto u otros elementos.'], ci: ['Etiqueta de cierre', 'Igual que la de apertura, con / antes del nombre.'], el: ['Elemento', 'Apertura + contenido + cierre: todo junto.'] };
  const wrap = h('div', { class: 'anat' });
  const src = h('div', { class: 'src' }, parts.map(p => { const s = h('span', { class: p.cls, 'data-k': p.k }, p.txt); s.addEventListener('click', () => { stop(); set(p.k || 'el'); }); return s; }));
  const cap = h('div', { class: 'cap' });
  wrap.append(src, cap);
  const seq = ['ap', 'at', 'co', 'ci', 'el']; let i = 0, tm = null;
  function set(k) { wrap.classList.toggle('all', k === 'el'); $$('span', src).forEach(s => s.classList.toggle('hi', k !== 'el' && s.dataset.k === k)); cap.replaceChildren(h('b', {}, INFO[k][0]), h('span', {}, INFO[k][1])); }
  function stop() { clearInterval(tm); tm = null; }
  set('ap');
  if (!RM) tm = setInterval(() => { if (!wrap.isConnected) return stop(); i = (i + 1) % seq.length; set(seq[i]); }, 2200);
  return h('div', {}, wrap, h('p', { class: 'muted', style: { fontSize: '13.5px', marginTop: '6px' } }, 'Tocá cualquier parte para fijarla.'));
}

/* 2 · Semantic wireframe */
LABS.semantic = (box) => {
  const Z = {
    header: ['<header>', 'Cabecera del sitio o de una sección: logo, nombre, a veces la navegación.', 'hd'],
    nav: ['<nav>', 'Bloque de navegación: los links principales (Panel, Doctores, Especialidades…).', 'nv'],
    main: ['<main>', 'Contenido principal, único de esta página. Uno solo por página.', ''],
    article: ['<article>', 'Contenido independiente, con sentido propio (una nota, un post, una card de doctor).', 'ar'],
    section: ['<section>', 'Sección genérica de contenido, agrupa por tema.', 'se'],
    aside: ['<aside>', 'Contenido secundario o complementario (sidebar, publicidad, links relacionados).', 'as'],
    footer: ['<footer>', 'Pie de página o de sección: contacto, avisos legales.', 'ft']
  };
  const info = h('div', { class: 'sem-info' });
  const src = h('pre', { class: 'code small' });
  const lines = ['<header>Consultorio</header>', '<nav>Panel · Doctores</nav>', '<main>', '  <article>Dr. Pérez</article>', '  <section>Horarios</section>', '</main>', '<aside>Novedades</aside>', '<footer>Contacto</footer>'];
  const keyOf = ['header', 'nav', 'main', 'article', 'section', 'main', 'aside', 'footer'];
  function show(k) {
    $$('button, .w-main', wire).forEach(b => b.classList.toggle('on', b.dataset.k === k));
    info.replaceChildren(h('div', { class: 'tg' }, Z[k][0]), h('p', {}, Z[k][1]), src);
    src.innerHTML = lines.map((l, i) => `<span style="display:block;${keyOf[i] === k ? 'background:var(--sel);box-shadow:inset 3px 0 0 var(--tag)' : ''}">${hl(l, 'html')}</span>`).join('');
  }
  const b = (k, area, label) => h('button', { 'data-k': k, style: { gridArea: area }, onmouseenter: () => show(k), onfocus: () => show(k), onclick: () => show(k) }, label);
  const mainBox = h('div', { class: 'w-main', 'data-k': 'main', onmouseenter: (e) => { if (e.target === mainBox) show('main'); }, onclick: (e) => { if (e.target === mainBox) show('main'); } }, h('span', {}, '<main>'), b('article', 'auto', '<article>'), b('section', 'auto', '<section>'));
  const wire = h('div', { class: 'wire' }, b('header', 'hd', '<header>'), b('nav', 'nv', '<nav>'), mainBox, b('aside', 'as', '<aside>'), b('footer', 'ft', '<footer>'));
  box.append(h('div', { class: 'sem' }, wire, info)); show('header');
};

/* Bug hunt (generic) */
function bugHunt(box, rounds) {
  let i = 0, ok = 0;
  const sc = h('div', { class: 'score' }), q = h('div', { class: 'q-text', style: { fontSize: '16px' } }), area = h('div', { class: 'codeblk bug' }), fb = h('div');
  function show() {
    const r = rounds[i]; fb.innerHTML = '';
    sc.textContent = `Ronda ${i + 1} de ${rounds.length} · aciertos: ${ok}`;
    q.textContent = r.q || '¿Qué línea está mal?';
    const pre = h('pre', { class: 'code' });
    let done = false;
    r.c.split('\n').forEach((line, n) => {
      const ln = h('div', { class: 'ln', role: 'button', tabindex: '0', html: `<span class="no">${n + 1}</span><span>${hl(line, r.l) || ' '}</span>` });
      const pick = () => {
        if (done) return; done = true;
        const right = r.bad.includes(n);
        if (right) ok++;
        ln.classList.add(right ? 'right' : 'wrong');
        if (!right) r.bad.forEach(b => pre.children[b].classList.add('right'));
        fb.replaceChildren(h('div', { class: 'msg ' + (right ? 'ok' : 'bad'), html: (right ? '✔ ' : '✘ Era la línea ' + (r.bad[0] + 1) + '. ') + fmt(r.e) }),
          h('div', { class: 'row', style: { marginTop: '8px' } }, h('button', { class: 'btn sm', onclick: () => { i++; if (i < rounds.length) show(); else end(); } }, i + 1 < rounds.length ? 'Siguiente →' : 'Ver resultado')));
        sc.textContent = `Ronda ${i + 1} de ${rounds.length} · aciertos: ${ok}`;
      };
      ln.addEventListener('click', pick); ln.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
      pre.append(ln);
    });
    area.replaceChildren(pre);
  }
  function end() { q.textContent = `${ok} de ${rounds.length}.`; area.replaceChildren(); fb.replaceChildren(h('button', { class: 'btn sm', onclick: () => { i = 0; ok = 0; show(); } }, 'Otra vez')); }
  box.append(sc, q, area, fb); show();
}
LABS.bughtml = (box) => bugHunt(box, [
  { l: 'html', c: '<ul>\n  <li>Panel</li>\n  <li>Doctores</li>\n</ul>\n<p>Hola <em>a todos</p></em>', bad: [4], e: 'Anidamiento: se cierra `</p>` antes que `</em>`. Lo último que abrís es lo primero que cerrás.' },
  { l: 'html', c: '<form>\n  <label for="usuario">Usuario</label>\n  <input type="text" id="user" required>\n  <button type="submit">Ingresar</button>\n</form>', bad: [1, 2], e: '`for="usuario"` no coincide con `id="user"`: la label no queda asociada al input.' },
  { l: 'html', c: '<!DOCTYPE html>\n<html lang="es">\n<head>\n  <header>Consultorio</header>\n  <title>Turnos</title>\n</head>', bad: [3], e: '`<header>` es contenido visible: va en el `<body>`. El `<head>` es solo para metadatos (title, meta, link).' },
  { l: 'html', c: '<p>Elegí un color:</p>\n<input type="radio" name="color" value="rojo"> Rojo\n<input type="radio" name="colour" value="azul"> Azul\n<input type="radio" name="color" value="verde"> Verde', bad: [2], e: 'Ese radio tiene otro `name`: se puede marcar junto con los demás.' },
  { l: 'html', c: '<img src="logo.png" alt="Logo de la clínica">\n<a href="doctors.html">Doctores</a>\n<img src="foto.jpg">\n<p>Bienvenidos</p>', bad: [2], e: 'Falta `alt`: la imagen no es accesible y no muestra nada si no carga.' },
  { l: 'html', c: '<form id="login">\n  <input type="text" required>\n  <input type="password" required>\n  <button onclick="limpiar()">Limpiar</button>\n  <button type="submit">Entrar</button>\n</form>', bad: [3], e: 'Un `<button>` sin type dentro de un form es submit: "Limpiar" también envía el formulario. Necesita `type="button"` (o `type="reset"`).' }
]);

/* 3 · Selector playground */
LABS.selector = (box) => {
  const HTML = `<header id="principal" data-t="header#principal"><h1 data-t="h1">Consultorio</h1><p class="destacado" data-t="p.destacado">Turnos online</p></header>
<nav data-t="nav"><ul data-t="ul"><li data-t="li"><a href="#" data-t="a">Panel</a></li><li class="activo" data-t="li.activo"><a href="#" data-t="a">Doctores</a></li></ul></nav>
<article data-t="article"><h2 data-t="h2">Cardiología</h2><p data-t="p">Primer párrafo</p><div data-t="div"><p class="destacado" data-t="p.destacado">Párrafo anidado</p></div></article>
<form data-t="form"><input type="text" placeholder="Nombre" data-t='input[type="text"]'><input type="email" placeholder="Email" data-t='input[type="email"]'></form>`;
  const stage = h('div', { class: 'sel-stage', html: HTML });
  stage.addEventListener('click', e => e.preventDefault());
  stage.addEventListener('submit', e => e.preventDefault());
  const inp = h('input', { type: 'text', class: 'mono', id: 'lab-sel', value: '.destacado', 'aria-label': 'Selector CSS', autocomplete: 'off', spellcheck: 'false' });
  const count = h('div', { class: 'sel-count' });
  function run() {
    $$('[data-hit]', stage).forEach(e => e.removeAttribute('data-hit'));
    const s = inp.value.trim(); if (!s) { count.textContent = ''; return; }
    try {
      const m = stage.querySelectorAll(s);
      m.forEach(e => e.setAttribute('data-hit', ''));
      count.innerHTML = `<b style="color:var(--attr)">${m.length}</b> elemento${m.length === 1 ? '' : 's'} seleccionado${m.length === 1 ? '' : 's'}`;
    } catch (e) { count.innerHTML = '<span style="color:var(--bad)">Selector inválido</span>'; }
  }
  inp.addEventListener('input', run);
  const presets = ['p', '.destacado', '#principal', 'article p', 'article > p', 'ul > li', 'h1 + p', 'h2 ~ p', 'input[type="text"]', 'li:first-child', 'li.activo a', 'header, nav', '*'];
  const chips = h('div', { class: 'row' }, presets.map(p => h('button', { class: 'chip', onclick: () => { inp.value = p; run(); } }, p)));
  const src = h('div', { class: 'codeblk sel-src' }, h('div', { class: 'bar' }, h('span', { class: 'cap' }, 'El documento'), h('span', { class: 'lbl' }, 'HTML')), h('pre', { class: 'code small', html: hl(`<header id="principal">
  <h1>Consultorio</h1>
  <p class="destacado">Turnos online</p>
</header>
<nav>
  <ul>
    <li><a href="#">Panel</a></li>
    <li class="activo"><a href="#">Doctores</a></li>
  </ul>
</nav>
<article>
  <h2>Cardiología</h2>
  <p>Primer párrafo</p>
  <div>
    <p class="destacado">Párrafo anidado</p>
  </div>
</article>
<form>
  <input type="text">
  <input type="email">
</form>`, 'html') }));
  box.append(h('div', { class: 'field' }, h('label', { for: 'lab-sel' }, 'Selector CSS'), inp), chips, count, h('div', { class: 'sel-wrap' }, stage, src));
  run();
};

/* 3 · Specificity duel */
function specificity(sel) {
  let s = ' ' + sel.trim() + ' ', a = 0, b = 0, c = 0;
  s = s.replace(/:where\([^)]*\)/g, ' ');
  s = s.replace(/:(not|is|has)\(([^)]*)\)/g, (m, f, inner) => { const r = specificity(inner); a += r[0]; b += r[1]; c += r[2]; return ' '; });
  s = s.replace(/\[[^\]]*\]/g, () => { b++; return ' '; });
  s = s.replace(/#[\w-]+/g, () => { a++; return ' '; });
  s = s.replace(/\.[\w-]+/g, () => { b++; return ' '; });
  s = s.replace(/::[\w-]+/g, () => { c++; return ' '; });
  s = s.replace(/:(before|after|first-line|first-letter)\b/g, () => { c++; return ' '; });
  s = s.replace(/:[\w-]+(\([^)]*\))?/g, () => { b++; return ' '; });
  s.replace(/[>+~*,]/g, ' ').split(/\s+/).forEach(t => { if (/^[a-zA-Z][\w-]*$/.test(t)) c++; });
  return [a, b, c];
}
LABS.spec = (box) => {
  const DUELS = [['#intro', '.card .texto .destacado'], ['nav ul li a', '.menu a'], ['.btn', '.primario'], ['div p', 'p.texto'], ['ul > li:first-child', 'li.item'], ['a:hover', 'a.link'], ['input[type="text"]', '#nombre'], ['p::first-line', 'p:first-child']];
  let di = 0;
  const mk = (id) => {
    const inp = h('input', { type: 'text', class: 'mono', id, autocomplete: 'off', spellcheck: 'false', 'aria-label': 'Selector' });
    const imp = h('input', { type: 'checkbox', id: id + '-imp' });
    const nums = [0, 1, 2].map(() => h('b', {}, '0'));
    const tri = h('div', { class: 'trip3' }, h('div', {}, nums[0], h('small', {}, 'IDs')), h('div', {}, nums[1], h('small', {}, 'clases')), h('div', {}, nums[2], h('small', {}, 'elementos')));
    const side = h('div', { class: 'side' }, inp, tri, h('label', { class: 'row', style: { fontSize: '13.5px' } }, imp, ' con ', h('code', {}, '!important')));
    return { inp, imp, nums, side };
  };
  const A = mk('spec-a'), B = mk('spec-b');
  const verdict = h('div');
  function calc() {
    const ra = specificity(A.inp.value), rb = specificity(B.inp.value);
    [[A, ra], [B, rb]].forEach(([S, r]) => r.forEach((v, i) => { if (S.nums[i].textContent !== String(v)) { S.nums[i].textContent = v; S.nums[i].classList.remove('bump'); void S.nums[i].offsetWidth; S.nums[i].classList.add('bump'); } }));
    let w = 0, why = '';
    if (A.imp.checked !== B.imp.checked) { w = A.imp.checked ? 1 : 2; why = '!important le gana a cualquier especificidad.'; }
    else { for (let i = 0; i < 3; i++) { if (ra[i] !== rb[i]) { w = ra[i] > rb[i] ? 1 : 2; why = `Se compara de izquierda a derecha: decide la columna de ${['IDs', 'clases/atributos/pseudo-clases', 'elementos/pseudo-elementos'][i]} (${ra[i]} vs ${rb[i]}).`; break; } } }
    A.side.classList.toggle('win', w === 1); B.side.classList.toggle('win', w === 2);
    verdict.replaceChildren(h('div', { class: 'msg ' + (w ? 'ok' : 'warn') }, w ? `Gana ${w === 1 ? 'el de la izquierda' : 'el de la derecha'}. ${why}` : 'Empate: gana la regla que esté MÁS ABAJO en la hoja de estilos (cascada).'));
  }
  function load() { [A.inp.value, B.inp.value] = DUELS[di]; A.imp.checked = B.imp.checked = false; calc(); }
  [A, B].forEach(S => { S.inp.addEventListener('input', calc); S.imp.addEventListener('change', calc); });
  box.append(h('div', { class: 'duel' }, A.side, h('div', { class: 'vs' }, 'vs'), B.side), verdict, h('div', { class: 'row' }, h('button', { class: 'btn sm', onclick: () => { di = (di + 1) % DUELS.length; load(); } }, 'Otro duelo →'), h('span', { class: 'muted', style: { fontSize: '13.5px' } }, 'También podés escribir tus propios selectores.')));
  load();
};

/* 4 · Flexbox */
LABS.flex = (box) => {
  const stage = h('div', { class: 'flex-stage' }, [1, 2, 3, 4].map(n => h('div', { class: 'bx', style: n === 3 ? { padding: '14px 18px' } : {} }, n)));
  const opts = {
    'flex-direction': ['row', 'row-reverse', 'column', 'column-reverse'],
    'justify-content': ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'],
    'align-items': ['stretch', 'flex-start', 'center', 'flex-end'],
    'flex-wrap': ['nowrap', 'wrap'],
    'gap': ['0', '8px', '16px']
  };
  const state = { 'flex-direction': 'row', 'justify-content': 'flex-start', 'align-items': 'stretch', 'flex-wrap': 'nowrap', 'gap': '8px' };
  const grow = h('input', { type: 'checkbox', id: 'flex-grow' });
  const cssOut = h('pre', { class: 'code small' });
  const axis = h('div', { class: 'axis' });
  const ctl = h('div', { class: 'flex-ctl' }, Object.entries(opts).map(([p, vs]) => {
    const sel = h('select', { id: 'flex-' + p }, vs.map(v => h('option', { value: v, selected: v === state[p] }, v)));
    sel.addEventListener('change', () => { state[p] = sel.value; apply(); });
    return h('div', { class: 'field' }, h('label', { for: 'flex-' + p, class: 'mono' }, p), sel);
  }), h('label', { class: 'row', style: { fontSize: '14px', alignSelf: 'end', paddingBottom: '8px' } }, grow, ' item 2: ', h('code', {}, 'flex: 1')));
  grow.addEventListener('change', apply);
  function apply() {
    flip(stage, () => {
      stage.style.display = 'flex';
      for (const [p, v] of Object.entries(state)) stage.style.setProperty(p, v);
      stage.children[1].style.flex = grow.checked ? '1' : '';
    });
    const col = state['flex-direction'].startsWith('column');
    axis.textContent = col ? 'eje principal ↓  ·  justify-content alinea en vertical' : 'eje principal →  ·  justify-content alinea en horizontal';
    cssOut.innerHTML = hl(`.contenedor {\n  display: flex;\n${Object.entries(state).map(([p, v]) => `  ${p}: ${v};`).join('\n')}\n}${grow.checked ? '\n.item-2 { flex: 1; }' : ''}`, 'css');
  }
  stage.style.display = 'flex';
  box.append(ctl, h('div', {}, stage, h('div', { class: 'axis', style: { position: 'static', marginTop: '6px' } }, axis)), h('div', { class: 'codeblk' }, cssOut));
  apply();
};

/* 4 · Responsive dashboard */
LABS.responsive = (box) => {
  const range = h('input', { type: 'range', min: '320', max: '1280', step: '10', value: '420', id: 'resp-w', 'aria-label': 'Ancho de pantalla' });
  const lbl = h('div', { class: 'mono', style: { fontSize: '14px' } });
  const pg = h('div', { class: 'pg' }, h('div', { class: 'hd' }, 'header'), h('div', { class: 'nv' }, 'nav · 200px'), h('div', { class: 'mn' }, 'main'), h('div', { class: 'ft' }, 'footer'));
  const dev = h('div', { class: 'dev' }, pg);
  const wrap = h('div', { class: 'dev-wrap' }, dev);
  const code = h('pre', { class: 'code small' });
  const css = `.page {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas: "header" "main" "footer";
}
nav { display: none; }`;
  const mq = `@media (min-width: 768px) {
  .page {
    grid-template-columns: 200px 1fr;
    grid-template-areas:
      "header header"
      "nav    main"
      "footer footer";
  }
  nav { display: block; }
}`;
  let lastDesk = null;
  function upd() {
    const w = +range.value, desk = w >= 768;
    const avail = wrap.clientWidth - 20 || 600;
    const sc = Math.min(1, avail / w);
    dev.style.width = w + 'px'; dev.style.transform = `scale(${sc})`;
    wrap.style.height = (304 * sc + 20) + 'px';
    if (desk !== lastDesk) { flip(pg, () => dev.classList.toggle('desk', desk)); lastDesk = desk; }
    lbl.innerHTML = `ancho: <b>${w}px</b> · ${desk ? '<span style="color:var(--ok)">@media (min-width: 768px) ACTIVA → escritorio</span>' : '<span style="color:var(--muted)">media query inactiva → móvil (base)</span>'}`;
    code.innerHTML = hl(css, 'css') + '\n\n' + `<span class="${desk ? 'mq-on' : ''}" style="display:block">${hl(mq, 'css')}</span>`;
  }
  range.addEventListener('input', upd);
  new ResizeObserver(upd).observe(wrap);
  box.append(h('div', { class: 'field' }, h('label', { for: 'resp-w' }, 'Ancho de la pantalla'), range), lbl, wrap, h('div', { class: 'codeblk' }, code));
  setTimeout(upd, 0);
};

/* 4 · position */
LABS.position = (box) => {
  const V = {
    static: ['Valor por defecto: sigue el flujo normal. top/left no hacen nada.', {}],
    relative: ['Se corre 20px abajo y 30px a la derecha de SU lugar original. El hermano de abajo no se mueve: el hueco queda reservado.', { top: '20px', left: '30px' }],
    absolute: ['Sale del flujo (el hermano sube a ocupar su lugar) y se ubica arriba a la derecha de su ancestro posicionado más cercano.', { top: '0', right: '0' }],
    fixed: ['Fijo respecto a la ventana: scrolleá y vas a ver que no se mueve.', { top: '10px', right: '10px' }],
    sticky: ['Se comporta como relative hasta que el scroll lo lleva a top: 0; ahí queda pegado mientras su padre siga visible.', { top: '0' }]
  };
  let cur = 'relative';
  const badge = h('div', { class: 'pos-badge' }, 'position: relative');
  const parentRel = h('input', { type: 'checkbox', id: 'pos-rel', checked: true });
  const parent = h('div', { class: 'pos-parent' }, h('span', { class: 'lbl' }, '.padre'), badge, h('div', { class: 'pos-sib' }, 'Hermano (sigue el flujo)'));
  const filler = n => Array.from({ length: n }, (_, i) => h('p', {}, `Párrafo de relleno ${i + 1}. Scrolleá para ver el comportamiento.`));
  const scroll = h('div', { class: 'pos-scroll' }, filler(2), parent, filler(8));
  const frame = h('div', { class: 'pos-frame' }, scroll);
  const note = h('div', { class: 'msg info' });
  const btns = h('div', { class: 'choices' }, Object.keys(V).map(k => h('button', { class: 'choice', 'data-k': k, onclick: () => { cur = k; apply(); } }, k)));
  parentRel.addEventListener('change', apply);
  function apply() {
    badge.removeAttribute('style'); badge.style.position = cur; Object.assign(badge.style, V[cur][1]);
    badge.textContent = 'position: ' + cur;
    parent.style.position = parentRel.checked ? 'relative' : 'static';
    parent.querySelector('.lbl').textContent = '.padre' + (parentRel.checked ? ' { position: relative }' : ' (static)');
    $$('.choice', btns).forEach(b => b.classList.toggle('right', b.dataset.k === cur));
    let t = V[cur][0];
    if (cur === 'absolute' && !parentRel.checked) t = 'El padre es static, así que absolute busca el siguiente ancestro posicionado: acá, la caja con scroll (en una página real, sería el documento).';
    note.textContent = t;
  }
  box.append(btns, h('label', { class: 'row', style: { fontSize: '14px' } }, parentRel, ' el padre tiene ', h('code', {}, 'position: relative')), frame, note);
  apply();
};

/* 5 · Engines */
LABS.engines = (box) => {
  const ITEMS = [['V8', 'js', 'Chrome y Node.js'], ['SpiderMonkey', 'js', 'Firefox'], ['JavaScriptCore', 'js', 'Safari / apps Swift'], ['Blink', 'r', 'Chrome / Chromium'], ['Gecko', 'r', 'Firefox'], ['WebKit', 'r', 'Safari'], ['Trident', 'r', 'Internet Explorer']];
  let order, i, ok;
  const binJ = h('div', { class: 'bin' }, h('h4', {}, 'Motor de JavaScript'));
  const binR = h('div', { class: 'bin' }, h('h4', {}, 'Motor de renderizado'));
  const cur = h('div', { class: 'cur' });
  function show() {
    if (i >= order.length) { cur.replaceChildren(h('div', { class: 'case' }, `${ok}/${order.length}`), h('button', { class: 'btn sm', onclick: start }, 'Otra vez')); return; }
    const [n, t, w] = order[i];
    const pick = (c) => { const r = c === t; if (r) ok++; (t === 'js' ? binJ : binR).append(h('div', { class: 'it ' + (r ? 'right' : 'wrong') }, `${r ? '✔' : '✘'} ${n} · ${w}`)); i++; show(); };
    cur.replaceChildren(h('div', { class: 'big' }, n), h('div', { class: 'row', style: { justifyContent: 'center' } }, h('button', { class: 'btn sm', onclick: () => pick('js') }, '← JS'), h('button', { class: 'btn sm', onclick: () => pick('r') }, 'Render →')), h('div', { class: 'score' }, `${i + 1}/${order.length}`));
  }
  function start() { order = shuffle(ITEMS); i = 0; ok = 0; $$('.it', binJ).concat($$('.it', binR)).forEach(e => e.remove()); show(); }
  box.append(h('div', { class: 'eng' }, binJ, cur, binR)); start();
};

/* 6 · DOM tree step-through */
LABS.domtree = (box) => {
  const L = ["const tabla = document.querySelector('#mi-tabla tbody');", "const nuevaFila = document.createElement('tr');", "const celdaNombre = document.createElement('td');", "celdaNombre.textContent = 'Juan Pérez';", "const celdaEdad = document.createElement('td');", "celdaEdad.textContent = '30';", "nuevaFila.appendChild(celdaNombre);", "nuevaFila.appendChild(celdaEdad);", "tabla.appendChild(nuevaFila);"];
  const NOTES = ['Estado inicial: la tabla ya tiene una fila (Ana García, 25).', 'querySelector encuentra el tbody. La variable tabla apunta a ese nodo: no crea nada.', 'createElement crea un <tr>… en MEMORIA. Todavía no está en el DOM: no se ve.', 'Otro nodo suelto: un <td> vacío.', 'textContent le pone texto al td. Sigue fuera del DOM.', 'Un segundo <td> en memoria.', 'Le ponemos "30".', 'appendChild mete el td dentro del tr. Todo sigue en memoria.', 'Segunda celda adentro de la fila.', 'Recién ahora la fila entra al árbol del DOM → el navegador la pinta.'];
  const codeEl = h('div', { class: 'code-lines' }, L.map(l => h('div', { html: hl(l, 'js') })));
  const tree = h('div', { class: 'tree' }), mem = h('div', { class: 'tree mem' }), rend = h('div', { class: 'dt-render tbl' });
  const note = h('div', { class: 'el-note' });
  let step = 0, autoT = null;
  function nd(tag, kids, opts = {}) { return { tag, kids: kids || [], text: opts.text, lab: opts.lab, isNew: opts.isNew }; }
  function renderNode(n) {
    if (typeof n === 'string') return h('div', { class: 'nd' }, h('span', { class: 'tx' }, `"${n}"`));
    const open = `<span class="t">&lt;${n.tag}&gt;</span>`, close = `<span class="t">&lt;/${n.tag}&gt;</span>`;
    const inline = !n.kids.length;
    const row1 = h('div', { class: 'row1', html: open + (inline ? `<span class="tx">${esc(n.text || '')}</span>${close}` : '') + (n.lab ? `<span class="tlab">← ${n.lab}</span>` : '') });
    const el = h('div', { class: 'nd' + (n.isNew ? ' new' : '') }, row1, n.kids.map(renderNode));
    if (!inline) el.append(h('div', { html: close }));
    return el;
  }
  function build(s) {
    const ana = nd('tr', [nd('td', [], { text: 'Ana García' }), nd('td', [], { text: '25' })]);
    const tdN = nd('td', [], { lab: 'celdaNombre', isNew: s === 3 }), tdE = nd('td', [], { lab: 'celdaEdad', isNew: s === 5 });
    if (s >= 4) { tdN.text = 'Juan Pérez'; tdN.isNew = s === 4; }
    if (s >= 6) { tdE.text = '30'; tdE.isNew = s === 6; }
    const tr = nd('tr', [], { lab: 'nuevaFila', isNew: s === 2 });
    const memory = [];
    if (s >= 2) memory.push(tr);
    if (s >= 3) { if (s >= 7) { tr.kids.push(tdN); tdN.isNew = s === 7; } else memory.push(tdN); }
    if (s >= 5) { if (s >= 8) { tr.kids.push(tdE); tdE.isNew = s === 8; } else memory.push(tdE); }
    const tbody = nd('tbody', [ana], { lab: s >= 1 ? 'tabla' : '' });
    if (s >= 9) { tbody.kids.push(tr); tr.isNew = true; memory.length = 0; }
    const table = nd('table', [nd('thead', [nd('tr', [nd('th', [], { text: 'Nombre' }), nd('th', [], { text: 'Edad' })])]), tbody]);
    tree.replaceChildren(h('div', { class: 'lbl', style: { marginBottom: '6px' } }, 'Árbol del DOM (lo que está en la página)'), renderNode(table));
    mem.replaceChildren(h('div', { class: 'lbl', style: { marginBottom: '6px', color: 'var(--attr)' } }, 'En memoria (fuera del DOM, invisible)'), ...(memory.length ? memory.map(renderNode) : [h('div', { class: 'muted' }, '— vacío —')]));
    const rows = [['Ana García', '25']]; if (s >= 9) rows.push(['Juan Pérez', '30']);
    rend.replaceChildren(h('div', { class: 'cap' }, 'Lo que ve el usuario'), h('table', {}, h('thead', {}, h('tr', {}, h('th', {}, 'Nombre'), h('th', {}, 'Edad'))), h('tbody', {}, rows.map((r, i) => h('tr', { class: i === 1 ? 'new' : '' }, r.map(c => h('td', {}, c)))))));
    $$('div', codeEl).forEach((d, i) => { d.classList.toggle('cur', i === s - 1); d.classList.toggle('done', i < s - 1); });
    note.textContent = `Paso ${s}/9 · ${NOTES[s]}`;
    next.disabled = s >= 9; prev.disabled = s <= 0;
  }
  const next = h('button', { class: 'btn primary sm', onclick: () => { stopAuto(); if (step < 9) build(++step); } }, 'Siguiente paso ▶');
  const prev = h('button', { class: 'btn sm', onclick: () => { stopAuto(); if (step > 0) build(--step); } }, '◀');
  const auto = h('button', { class: 'btn sm', onclick: () => { stopAuto(); step = 0; build(0); autoT = setInterval(() => { if (!box.isConnected || step >= 9) return stopAuto(); build(++step); }, RM ? 400 : 1400); } }, 'Reproducir todo');
  function stopAuto() { clearInterval(autoT); autoT = null; }
  box.append(h('div', { class: 'dt' }, h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px', minWidth: 0 } }, codeEl, note, h('div', { class: 'row' }, prev, next, auto)), h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px', minWidth: 0 } }, tree, mem)), rend);
  build(0);
};

/* 6 · Events */
LABS.events = (box) => {
  const log = h('div', { class: 'ev-log', 'aria-live': 'polite' });
  const add = (html) => { log.prepend(h('div', { html })); while (log.children.length > 60) log.lastChild.remove(); };
  const t = el => el.tagName + (el.id ? '#' + el.id : '');
  const btn = h('button', { class: 'btn', id: 'ev-btn', type: 'button' }, 'Botón');
  ['click', 'dblclick', 'mouseover', 'mouseout', 'mousedown', 'mouseup'].forEach(ev => btn.addEventListener(ev, e => add(`<span class="ty">${ev}</span> · target: ${t(e.target)}`)));
  const inp = h('input', { type: 'text', id: 'ev-in', placeholder: 'Escribí acá', autocomplete: 'off' });
  ['input', 'change', 'focus', 'blur'].forEach(ev => inp.addEventListener(ev, e => add(`<span class="ty">${ev}</span> · value: "${esc(inp.value)}"`)));
  ['keydown', 'keyup'].forEach(ev => inp.addEventListener(ev, e => add(`<span class="ty">${ev}</span> · key: "${esc(e.key)}"`)));
  const sel = h('select', { id: 'ev-sel' }, ['Cardiología', 'Pediatría', 'Dermatología'].map(o => h('option', {}, o)));
  sel.addEventListener('change', () => add(`<span class="ty">change</span> · select: "${esc(sel.value)}"`));
  const pd = h('input', { type: 'checkbox', id: 'ev-pd', checked: true });
  const form = h('form', { class: 'row' }, h('input', { type: 'text', placeholder: 'Nombre', 'aria-label': 'Nombre', style: { flex: '1' } }), h('button', { class: 'btn sm' }, 'Enviar'));
  form.addEventListener('submit', e => {
    e.preventDefault(); // en el lab siempre lo cancelamos para no perder la página
    if (pd.checked) add('<span class="ty">submit</span> · e.preventDefault() → no se recarga, seguís en la página');
    else add('<span class="ty">submit</span> · <span class="warn">sin preventDefault: acá la página se RECARGARÍA y perderías todo lo que no esté guardado</span>');
  });
  const inner = h('button', { class: 'btn sm', type: 'button', id: 'hijo' }, 'Hijo');
  const parent = h('div', { class: 'ev-parent', id: 'padre' }, h('span', { class: 'lbl' }, 'div#padre (también escucha click)'), inner);
  parent.addEventListener('click', e => add(`<span class="ty">click</span> en <b>padre</b> · target: ${t(e.target)} · currentTarget: ${t(e.currentTarget)}`));
  inner.addEventListener('click', () => add('<span class="ty">click</span> en <b>hijo</b>'));
  box.append(h('div', { class: 'ev' }, h('div', { class: 'ev-play' },
    h('div', { class: 'row' }, btn, h('span', { class: 'muted', style: { fontSize: '13.5px' } }, 'click, dblclick, mouseover/out, mousedown/up')),
    h('div', { class: 'field' }, h('label', { for: 'ev-in' }, 'input · change · focus · blur · keydown · keyup'), inp),
    h('div', { class: 'field' }, h('label', { for: 'ev-sel' }, 'change en un select'), sel),
    h('div', { class: 'field' }, h('span', { class: 'lbl' }, 'submit'), form, h('label', { class: 'row', style: { fontSize: '13.5px' } }, pd, ' llamar a ', h('code', {}, 'e.preventDefault()'))),
    parent, h('button', { class: 'btn ghost sm', type: 'button', onclick: () => log.innerHTML = '' }, 'Limpiar registro')), log));
  add('<span class="muted">Los eventos aparecen arriba, el más nuevo primero.</span>');
};

/* 7 · freeze / seal */
LABS.freeze = (box) => {
  let mode = 'none', obj;
  const view = h('pre', { class: 'code' }), res = h('div');
  const modes = h('div', { class: 'choices' }, [['none', 'sin protección'], ['freeze', 'Object.freeze'], ['seal', 'Object.seal']].map(([k, l]) => h('button', { class: 'choice', 'data-k': k, onclick: () => { mode = k; reset(); } }, l)));
  function reset() {
    obj = { nombre: 'Juan', dir: { calle: 'Mitre' } };
    if (mode === 'freeze') Object.freeze(obj); if (mode === 'seal') Object.seal(obj);
    $$('.choice', modes).forEach(b => b.classList.toggle('right', b.dataset.k === mode));
    res.replaceChildren(h('div', { class: 'msg info' }, mode === 'none' ? 'Objeto normal: todo se puede.' : mode === 'freeze' ? 'freeze: no modificar, no agregar, no borrar… en el primer nivel.' : 'seal: modificar sí; agregar y borrar no.'));
    render();
  }
  function render() { view.innerHTML = hl('const persona = ' + JSON.stringify(obj, null, 2).replace(/"(\w+)":/g, '$1:') + ';', 'js'); view.animate?.([{ background: 'var(--warn-soft)' }, { background: 'transparent' }], { duration: 600 }); }
  const OPS = [
    ['persona.nombre = "Carlos"', o => { o.nombre = 'Carlos'; }, o => o.nombre === 'Carlos'],
    ['persona.edad = 30', o => { o.edad = 30; }, o => 'edad' in o],
    ['delete persona.nombre', o => { delete o.nombre; }, o => !('nombre' in o)],
    ['persona.dir.calle = "Belgrano"', o => { o.dir.calle = 'Belgrano'; }, o => o.dir.calle === 'Belgrano']
  ];
  const ops = h('div', { class: 'ops' }, OPS.map(([label, f, chk]) => h('button', { class: 'btn sm', onclick: () => {
    let threw = null; try { f(obj); } catch (e) { threw = e; }
    const changed = chk(obj);
    res.replaceChildren(h('div', { class: 'msg ' + (changed ? 'ok' : 'bad') }, changed ? `✔ ${label} → se aplicó${label.includes('dir.') && mode === 'freeze' ? ' (freeze es superficial: dir es otro objeto y no está congelado)' : ''}.` : `✘ ${label} → se ignoró en silencio${threw ? '' : ' (en "use strict" tiraría TypeError)'}.`));
    render();
  } }, label)));
  box.append(modes, ops, view, res, h('button', { class: 'btn ghost sm', onclick: reset }, 'Reiniciar objeto'));
  reset();
};

/* 7 · this demo */
LABS.thisdemo = (box) => {
  const code = `const persona = {
  nombre: "Ana",
  saludarTrad: function () { return "Hola soy " + this.nombre; },
  saludarArrow: () => "Hola soy " + this.nombre
};`;
  // se crea como un script normal (no estricto): this global = window
  const persona = new Function(code + '\nreturn persona;')();
  const out = h('div', { class: 'minicon' });
  const say = (m, expl) => out.prepend(h('div', { html: `<b>&gt; persona.${m}()</b>\n${esc(persona[m]())}\n<span class="muted">${expl}</span>` }));
  box.append(codeBox(code, 'js', 'Un objeto con dos métodos'), h('div', { class: 'row' },
    h('button', { class: 'btn', onclick: () => say('saludarTrad', 'function: this es el objeto que está antes del punto (persona).') }, 'persona.saludarTrad()'),
    h('button', { class: 'btn', onclick: () => say('saludarArrow', 'arrow: no tiene this propio; usa el del scope donde se creó (global → window), y window.nombre no existe.') }, 'persona.saludarArrow()')), out);
};

/* 8 · Arrays */
LABS.arrays = (box) => {
  const INIT = [3, 8, 1, 6, 4];
  let arr = INIT.slice(), busy = false;
  const main = h('div', { class: 'arr-row' }), res = h('div', { class: 'arr-row' }), ret = h('div', { class: 'arr-ret' }), cons = h('div', { class: 'minicon', style: { minHeight: '0' } });
  const line = h('pre', { class: 'code small', style: { border: '1px solid var(--line)', borderRadius: '8px', background: 'var(--code)' } });
  const cellsOf = () => $$('.cell', main);
  function drawMain(cls) { main.replaceChildren(h('span', { class: 'nm' }, 'numeros'), ...arr.map((v, i) => h('div', { class: 'cell' + (cls ? ' ' + cls : '') }, v, h('small', {}, i)))); }
  function setRet(code, val, mut) { ret.innerHTML = `<span>devuelve: <b>${esc(val)}</b></span><span>¿modifica numeros? <b style="color:${mut ? 'var(--bad)' : 'var(--ok)'}">${mut ? 'Sí' : 'No'}</b></span>`; }
  const show = (a) => '[' + a.join(', ') + ']';
  const M = {
    'push(9)': async () => { line.innerHTML = hl('const r = numeros.push(9);', 'js'); arr.push(9); drawMain(); cellsOf().at(-1).classList.add('enter'); setRet('', arr.length + '  (el nuevo length)', true); },
    'pop()': async () => { line.innerHTML = hl('const r = numeros.pop();', 'js'); if (!arr.length) return setRet('', 'undefined', true); cellsOf().at(-1).classList.add('leave'); await sleep(380); const v = arr.pop(); drawMain(); setRet('', v + '  (el elemento quitado)', true); },
    'shift()': async () => { line.innerHTML = hl('const r = numeros.shift();', 'js'); if (!arr.length) return setRet('', 'undefined', true); cellsOf()[0].classList.add('leave'); await sleep(380); const v = arr.shift(); drawMain(); setRet('', v + '  (el elemento quitado)', true); },
    'unshift(0)': async () => { line.innerHTML = hl('const r = numeros.unshift(0);', 'js'); arr.unshift(0); drawMain(); cellsOf()[0].classList.add('enter'); setRet('', arr.length + '  (el nuevo length)', true); },
    'map(x => x * 2)': async () => {
      line.innerHTML = hl('const r = numeros.map(x => x * 2);', 'js');
      res.replaceChildren(h('span', { class: 'nm' }, 'r'));
      for (const [i, c] of cellsOf().entries()) { c.classList.add('scan'); await sleep(320); res.append(h('div', { class: 'cell res enter' }, arr[i] * 2)); c.classList.remove('scan'); }
      setRet('', show(arr.map(x => x * 2)) + '  (array nuevo, mismo largo)', false);
    },
    'filter(x => x % 2 === 0)': async () => {
      line.innerHTML = hl('const r = numeros.filter(x => x % 2 === 0);', 'js');
      res.replaceChildren(h('span', { class: 'nm' }, 'r'));
      for (const [i, c] of cellsOf().entries()) { c.classList.add('scan'); await sleep(320); c.classList.remove('scan'); if (arr[i] % 2 === 0) { c.classList.add('pass'); res.append(h('div', { class: 'cell res enter' }, arr[i])); } else c.classList.add('fail'); }
      setRet('', show(arr.filter(x => x % 2 === 0)) + '  (array nuevo)', false);
    },
    'find(x => x > 5)': async () => {
      line.innerHTML = hl('const r = numeros.find(x => x > 5);', 'js');
      let found;
      for (const [i, c] of cellsOf().entries()) { c.classList.add('scan'); await sleep(360); c.classList.remove('scan'); if (arr[i] > 5) { c.classList.add('pass'); found = arr[i]; break; } else c.classList.add('fail'); }
      res.replaceChildren(h('span', { class: 'nm' }, 'r'), h('div', { class: 'cell res enter' }, found === undefined ? '∅' : found));
      setRet('', (found === undefined ? 'undefined' : found) + '  (el PRIMERO que cumple; se corta ahí)', false);
    },
    'reduce((acc, x) => acc + x, 0)': async () => {
      line.innerHTML = hl('const r = numeros.reduce((acc, x) => acc + x, 0);', 'js');
      let acc = 0; const accEl = h('div', { class: 'cell acc' }, 'acc: 0');
      res.replaceChildren(h('span', { class: 'nm' }, 'acumulador'), accEl);
      for (const [i, c] of cellsOf().entries()) { c.classList.add('scan'); await sleep(380); acc += arr[i]; accEl.textContent = `acc: ${acc - arr[i]} + ${arr[i]} = ${acc}`; c.classList.remove('scan'); c.classList.add('fail'); }
      accEl.textContent = 'r = ' + acc; setRet('', acc + '  (un único valor)', false);
    },
    'forEach(x => console.log(x))': async () => {
      line.innerHTML = hl('const r = numeros.forEach(x => console.log(x));', 'js');
      cons.replaceChildren(); res.replaceChildren(h('span', { class: 'nm' }, 'consola'), cons);
      for (const [i, c] of cellsOf().entries()) { c.classList.add('scan'); await sleep(300); cons.append(h('div', {}, String(arr[i]))); c.classList.remove('scan'); }
      setRet('', 'undefined  (forEach no devuelve nada)', false);
    }
  };
  const btns = h('div', { class: 'ops' }, Object.keys(M).map(k => h('button', { class: 'btn sm', onclick: async () => {
    if (busy) return; busy = true; $$('button', btns).forEach(b => b.disabled = true);
    drawMain(); res.replaceChildren();
    await M[k]();
    busy = false; $$('button', btns).forEach(b => b.disabled = false);
  } }, '.' + k)), h('button', { class: 'btn ghost sm', onclick: () => { if (busy) return; arr = INIT.slice(); drawMain(); res.replaceChildren(); ret.innerHTML = ''; line.innerHTML = hl('let numeros = [3, 8, 1, 6, 4];', 'js'); } }, 'Reiniciar'));
  box.append(btns, line, main, res, ret);
  drawMain(); line.innerHTML = hl('let numeros = [3, 8, 1, 6, 4];', 'js');
};

/* 9 · Event loop */
const EL_PROGRAMS = [
  { name: 'A · then vs setTimeout', code: `console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");`, steps: [
    { l: 0, s: ['global()'], n: 'Arranca el script: el código global entra al Call Stack. ¿Qué orden predecís?' },
    { l: 1, s: ['global()', 'console.log("A")'], o: ['A'], n: 'Sincrónico: se imprime A.' },
    { l: 2, s: ['global()', 'setTimeout(...)'], w: ['⏱ timer 0ms → log("B")'], o: ['A'], n: 'setTimeout se delega a las Web APIs: el navegador cuenta el tiempo, no JS.' },
    { l: 2, s: ['global()'], q: ['() => log("B")'], o: ['A'], n: 'El timer de 0ms vence: el callback pasa a la Callback Queue. NO se ejecuta todavía: el stack está ocupado.' },
    { l: 3, s: ['global()', 'Promise.then(...)'], m: ['() => log("C")'], q: ['() => log("B")'], o: ['A'], n: 'La promesa ya está resuelta: su callback va a la Microtask Queue.' },
    { l: 4, s: ['global()', 'console.log("D")'], m: ['() => log("C")'], q: ['() => log("B")'], o: ['A', 'D'], n: 'Sincrónico: D.' },
    { l: 0, s: [], m: ['() => log("C")'], q: ['() => log("B")'], o: ['A', 'D'], n: 'Terminó el código global. Stack vacío → el Event Loop revisa las colas: primero TODAS las microtareas.' },
    { l: 3, s: ['() => log("C")'], q: ['() => log("B")'], o: ['A', 'D', 'C'], n: 'Microtarea: C.' },
    { l: 0, s: [], q: ['() => log("B")'], o: ['A', 'D', 'C'], n: 'Microtask Queue vacía. Ahora UNA macrotarea.' },
    { l: 2, s: ['() => log("B")'], o: ['A', 'D', 'C', 'B'], n: 'El callback del setTimeout: B.' },
    { l: 0, s: [], o: ['A', 'D', 'C', 'B'], n: 'Fin: A D C B. Aunque el timeout era de 0ms, la microtarea le ganó.' }] },
  { name: 'B · async / await', code: `async function a() {
  console.log("a1");
  await b();
  console.log("a2");
}
async function b() { console.log("b"); }

console.log("inicio");
a();
setTimeout(() => console.log("timeout"), 0);
console.log("fin");`, steps: [
    { l: 0, s: ['global()'], n: 'Se declaran a y b (hoisting). Todavía no se imprime nada.' },
    { l: 8, s: ['global()', 'console.log("inicio")'], o: ['inicio'], n: 'Sincrónico: inicio.' },
    { l: 2, s: ['global()', 'a()'], o: ['inicio', 'a1'], n: 'a() es async, pero corre SINCRÓNICA hasta el primer await: a1.' },
    { l: 6, s: ['global()', 'a()', 'b()'], o: ['inicio', 'a1', 'b'], n: 'await b() primero LLAMA a b(), que se ejecuta entera: b.' },
    { l: 3, s: ['global()'], m: ['a() → continuar después del await'], o: ['inicio', 'a1', 'b'], n: 'El await pausa a(): lo que sigue (línea 4) queda como microtarea. a() sale del stack y el global sigue.' },
    { l: 10, s: ['global()', 'setTimeout(...)'], w: ['⏱ timer 0ms → log("timeout")'], m: ['a() → continuar después del await'], o: ['inicio', 'a1', 'b'], n: 'setTimeout a las Web APIs.' },
    { l: 10, s: ['global()'], m: ['a() → continuar después del await'], q: ['() => log("timeout")'], o: ['inicio', 'a1', 'b'], n: 'El timer vence: el callback espera en la Callback Queue.' },
    { l: 11, s: ['global()', 'console.log("fin")'], m: ['a() → continuar después del await'], q: ['() => log("timeout")'], o: ['inicio', 'a1', 'b', 'fin'], n: 'Sincrónico: fin.' },
    { l: 0, s: [], m: ['a() → continuar después del await'], q: ['() => log("timeout")'], o: ['inicio', 'a1', 'b', 'fin'], n: 'Stack vacío → microtareas primero.' },
    { l: 4, s: ['a() (retoma)'], q: ['() => log("timeout")'], o: ['inicio', 'a1', 'b', 'fin', 'a2'], n: 'a() retoma después del await: a2.' },
    { l: 10, s: ['() => log("timeout")'], o: ['inicio', 'a1', 'b', 'fin', 'a2', 'timeout'], n: 'Recién ahora la macrotarea: timeout.' },
    { l: 0, s: [], o: ['inicio', 'a1', 'b', 'fin', 'a2', 'timeout'], n: 'Fin: inicio a1 b fin a2 timeout.' }] },
  { name: 'C · then que agenda un timeout', code: `console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve()
  .then(() => {
    console.log(3);
    setTimeout(() => console.log(4), 0);
  })
  .then(() => console.log(5));
console.log(6);`, steps: [
    { l: 0, s: ['global()'], n: 'Predecí antes de avanzar: ¿en qué orden salen 1 a 6?' },
    { l: 1, s: ['global()', 'console.log(1)'], o: ['1'], n: 'Sincrónico: 1.' },
    { l: 2, s: ['global()'], q: ['() => log(2)'], o: ['1'], n: 'setTimeout → Web APIs → vence → Callback Queue.' },
    { l: 4, s: ['global()'], m: ['then #1 (log 3 + setTimeout 4)'], q: ['() => log(2)'], o: ['1'], n: 'El primer then va a microtareas. El segundo then (línea 8) espera a que termine el primero: todavía no está en ninguna cola.' },
    { l: 9, s: ['global()', 'console.log(6)'], m: ['then #1 (log 3 + setTimeout 4)'], q: ['() => log(2)'], o: ['1', '6'], n: 'Sincrónico: 6.' },
    { l: 5, s: ['then #1'], q: ['() => log(2)'], o: ['1', '6', '3'], n: 'Stack vacío → microtarea then #1: imprime 3…' },
    { l: 6, s: ['then #1', 'setTimeout(...)'], q: ['() => log(2)', '() => log(4)'], o: ['1', '6', '3'], n: '…y agenda otro timeout. El 4 queda AL FINAL de la Callback Queue, detrás del 2.' },
    { l: 8, s: [], m: ['then #2 → log(5)'], q: ['() => log(2)', '() => log(4)'], o: ['1', '6', '3'], n: 'Termina then #1 → su promesa se resuelve → then #2 entra a microtareas.' },
    { l: 8, s: ['then #2'], q: ['() => log(2)', '() => log(4)'], o: ['1', '6', '3', '5'], n: 'Todavía hay microtareas: van antes que cualquier setTimeout. 5.' },
    { l: 2, s: ['() => log(2)'], q: ['() => log(4)'], o: ['1', '6', '3', '5', '2'], n: 'Microtareas vacías → una macrotarea: 2.' },
    { l: 6, s: ['() => log(4)'], o: ['1', '6', '3', '5', '2', '4'], n: 'Siguiente macrotarea: 4.' },
    { l: 0, s: [], o: ['1', '6', '3', '5', '2', '4'], n: 'Fin: 1 6 3 5 2 4.' }] },
  { name: 'D · fetch', code: `console.log("1");
fetch("/api/especialidades")
  .then(res => res.json())
  .then(data => console.log("datos"));
setTimeout(() => console.log("timeout"), 0);
console.log("2");`, steps: [
    { l: 0, s: ['global()'], n: 'fetch es una Web API, como setTimeout. ¿Quién gana: los datos o el timeout de 0ms?' },
    { l: 1, s: ['global()', 'console.log("1")'], o: ['1'], n: 'Sincrónico: 1.' },
    { l: 2, s: ['global()', 'fetch(...)'], w: ['🌐 GET /api/especialidades …'], o: ['1'], n: 'fetch se delega a las Web APIs y devuelve una Promise PENDIENTE. Los dos then quedan registrados, esperando.' },
    { l: 5, s: ['global()', 'setTimeout(...)'], w: ['🌐 GET /api/especialidades …', '⏱ timer 0ms'], o: ['1'], n: 'setTimeout también a las Web APIs.' },
    { l: 5, s: ['global()'], w: ['🌐 GET /api/especialidades …'], q: ['() => log("timeout")'], o: ['1'], n: 'El timer de 0ms vence enseguida → Callback Queue. La red sigue trabajando.' },
    { l: 6, s: ['global()', 'console.log("2")'], w: ['🌐 GET /api/especialidades …'], q: ['() => log("timeout")'], o: ['1', '2'], n: 'Sincrónico: 2.' },
    { l: 5, s: ['() => log("timeout")'], w: ['🌐 GET /api/especialidades …'], o: ['1', '2', 'timeout'], n: 'Stack vacío, no hay microtareas (la red no respondió). Corre la macrotarea: timeout.' },
    { l: 3, s: [], m: ['res => res.json()'], o: ['1', '2', 'timeout'], n: 'Llega la respuesta: la Promise de fetch se resuelve → el primer then va a microtareas.' },
    { l: 3, s: ['res => res.json()'], w: ['📄 leyendo el cuerpo…'], o: ['1', '2', 'timeout'], n: 'res.json() lee el cuerpo y devuelve OTRA Promise.' },
    { l: 4, s: [], m: ['data => log("datos")'], o: ['1', '2', 'timeout'], n: 'Cuando el JSON está listo, el segundo then entra a microtareas.' },
    { l: 4, s: ['data => log("datos")'], o: ['1', '2', 'timeout', 'datos'], n: 'datos.' },
    { l: 0, s: [], o: ['1', '2', 'timeout', 'datos'], n: 'Fin: 1 2 timeout datos. La red casi nunca le gana a un setTimeout(0).' }] }
];
LABS.eventloop = (box) => {
  let P = 0, S = 0, autoT = null;
  const tabs = h('div', { class: 'choices' });
  const codeBx = h('div', { class: 'bx el-code' }, h('span', { class: 'lbl' }, 'Código'));
  const mk = (cls, label) => h('div', { class: 'bx ' + cls }, h('span', { class: 'lbl' }, label));
  const stack = mk('stack', 'Call Stack (LIFO)'), web = mk('web', 'Web APIs'), micro = mk('micro', 'Microtask Queue · prioridad'), macro = mk('macro', 'Callback (Macrotask) Queue'), cons = mk('cons', 'Consola');
  const note = h('div', { class: 'el-note' });
  const prev = h('button', { class: 'btn sm', onclick: () => { stop(); if (S > 0) { S--; draw(); } } }, '◀ Anterior');
  const next = h('button', { class: 'btn primary sm', onclick: () => { stop(); if (S < EL_PROGRAMS[P].steps.length - 1) { S++; draw(); } } }, 'Siguiente ▶');
  const play = h('button', { class: 'btn sm', onclick: () => { stop(); S = 0; draw(); autoT = setInterval(() => { if (!box.isConnected || S >= EL_PROGRAMS[P].steps.length - 1) return stop(); S++; draw(); }, RM ? 500 : 1700); } }, 'Reproducir');
  const stepN = h('span', { class: 'score' });
  function stop() { clearInterval(autoT); autoT = null; }
  let prevState = null;
  function fill(bx, items, prevItems) { $$('.it', bx).forEach(e => e.remove()); (items || []).forEach(t => { const it = h('div', { class: 'it' }, t); if (prevItems && prevItems.includes(t)) it.style.animation = 'none'; bx.append(it); }); }
  function draw() {
    const pr = EL_PROGRAMS[P], st = pr.steps[S];
    const lines = pr.code.split('\n');
    codeBx.querySelector('pre')?.remove();
    codeBx.append(h('pre', { html: lines.map((l, i) => `<span class="l${st.l === i + 1 ? ' cur' : ''}">${hl(l, 'js') || ' '}</span>`).join('') }));
    const ps = prevState || {};
    fill(stack, st.s, ps.s); fill(web, st.w, ps.w); fill(micro, st.m, ps.m); fill(macro, st.q, ps.q); fill(cons, st.o, ps.o);
    note.textContent = st.n; note.style.animation = 'none'; void note.offsetWidth; note.style.animation = '';
    stepN.textContent = `paso ${S + 1}/${pr.steps.length}`;
    prev.disabled = S === 0; next.disabled = S === pr.steps.length - 1;
    prevState = st;
  }
  EL_PROGRAMS.forEach((p, i) => tabs.append(h('button', { class: 'choice' + (i === 0 ? ' right' : ''), onclick: (e) => { stop(); P = i; S = 0; prevState = null; $$('.choice', tabs).forEach(b => b.classList.remove('right')); e.currentTarget.classList.add('right'); draw(); } }, p.name)));
  box.append(tabs, h('div', { class: 'el' }, codeBx, stack, web, micro, macro, cons), note, h('div', { class: 'el-ctl' }, h('div', { class: 'row' }, prev, next, play), stepN));
  draw();
};

/* 9 · fetch simulator */
LABS.fetchsim = (box) => {
  const SC = { 200: '200 OK', 404: '404 Not Found', 500: '500 Error del servidor', off: 'Sin conexión' };
  let sc = '404', chk = false, busy = false;
  const codes = {
    false: ['async function cargar() {', '  try {', '    const res = await fetch("/api/especialidades");', '    const data = await res.json();', '    console.log("Datos:", data);', '  } catch (error) {', '    console.log("Catch:", error.message);', '  }', '}'],
    true: ['async function cargar() {', '  try {', '    const res = await fetch("/api/especialidades");', '    if (!res.ok) throw new Error("HTTP " + res.status);', '    const data = await res.json();', '    console.log("Datos:", data);', '  } catch (error) {', '    console.log("Catch:", error.message);', '  }', '}']
  };
  const pre = h('pre', { class: 'code small' }), out = h('div', { class: 'minicon' }), verdict = h('div');
  const sTabs = h('div', { class: 'choices' }, Object.entries(SC).map(([k, v]) => h('button', { class: 'choice', 'data-k': k, onclick: () => { sc = k; draw(); } }, v)));
  const cTabs = h('div', { class: 'choices' }, [['false', 'Sin chequear res.ok'], ['true', 'Con chequeo de res.ok']].map(([k, v]) => h('button', { class: 'choice', 'data-k': k, onclick: () => { chk = k === 'true'; draw(); } }, v)));
  function draw(hlLines = [], cur = -1) {
    $$('.choice', sTabs).forEach(b => b.classList.toggle('right', b.dataset.k === sc));
    $$('.choice', cTabs).forEach(b => b.classList.toggle('right', b.dataset.k === String(chk)));
    pre.innerHTML = codes[chk].map((l, i) => `<span class="l${i === cur ? ' cur' : hlLines.includes(i) ? ' hit' : ''}">${hl(l, 'js')}</span>`).join('');
  }
  function plan() {
    const c = chk;
    if (sc === 'off') return { path: [2, c ? 7 : 6], out: 'Catch: Failed to fetch', v: ['ok', 'Es el ÚNICO caso en que fetch rechaza por sí solo: falla de red.'] };
    if (sc === '200') return { path: c ? [2, 3, 4, 5] : [2, 3, 4], out: "Datos: [{id: 1, nombre: 'Cardiología'}, {id: 2, nombre: 'Pediatría'}]", v: ['ok', 'Todo bien: res.ok es true.'] };
    if (sc === '404') return c ? { path: [2, 3, 7], out: 'Catch: HTTP 404', v: ['ok', 'El chequeo de res.ok convierte el 404 en un error que atrapa el catch.'] } : { path: [2, 3, 4], out: "Datos: {error: 'No encontrado'}", v: ['bad', 'fetch NO rechazó: el código trató la respuesta de error como si fueran datos.'] };
    return c ? { path: [2, 3, 7], out: 'Catch: HTTP 500', v: ['ok', 'Error claro, gracias al chequeo de res.ok.'] } : { path: [2, 3, 6], out: 'Catch: Unexpected token \'<\', "<!DOCTYPE "... is not valid JSON', v: ['warn', 'Terminó en el catch, pero por un error confuso: el servidor mandó una página HTML de error y res.json() no la pudo parsear.'] };
  }
  const run = h('button', { class: 'btn primary', onclick: async () => {
    if (busy) return; busy = true; run.disabled = true; out.replaceChildren(); verdict.replaceChildren();
    const p = plan(), done = [];
    for (const ln of p.path) { draw(done, ln); await sleep(650); done.push(ln); }
    draw(done); out.append(h('div', {}, p.out));
    verdict.replaceChildren(h('div', { class: 'msg ' + p.v[0] }, p.v[1]));
    busy = false; run.disabled = false;
  } }, '▶ Ejecutar cargar()');
  box.append(h('div', { class: 'field' }, h('span', { class: 'lbl' }, 'El servidor responde'), sTabs), h('div', { class: 'field' }, h('span', { class: 'lbl' }, 'Tu código'), cTabs),
    h('div', { class: 'fs' }, h('div', { class: 'codeblk' }, pre), h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px', minWidth: 0 } }, run, h('span', { class: 'lbl' }, 'Consola'), out, verdict)));
  draw();
};

/* 10 · Form lab (EJ#24) */
LABS.formlab = (box) => {
  const lista = [];
  const nombre = h('input', { type: 'text', id: 'fl-nombre', autocomplete: 'off' });
  const desc = h('textarea', { id: 'fl-desc', rows: '3' });
  const eN = h('div', { class: 'err', id: 'fl-en' }), eD = h('div', { class: 'err', id: 'fl-ed' });
  const cN = h('div', { class: 'cnt' }), cD = h('div', { class: 'cnt' });
  const con = h('div', { class: 'minicon' }, h('div', { class: 'muted' }, '// acá aparece console.log(especialidad)'));
  const tbody = h('tbody');
  const tbl = h('div', { class: 'tbl' }, h('table', {}, h('thead', {}, h('tr', {}, h('th', {}, 'Nombre'), h('th', {}, 'Descripción'))), tbody));
  const cnt = () => { cN.textContent = nombre.value.length + '/15'; cN.classList.toggle('over', nombre.value.length > 15); cD.textContent = desc.value.length + '/100'; cD.classList.toggle('over', desc.value.length > 100); };
  nombre.addEventListener('input', cnt); desc.addEventListener('input', cnt);
  const form = h('form', { novalidate: true }, h('div', { class: 'field' }, h('label', { for: 'fl-nombre' }, 'Nombre'), nombre, cN, eN), h('div', { class: 'field' }, h('label', { for: 'fl-desc' }, 'Descripción'), desc, cD, eD), h('div', { class: 'row' }, h('button', { class: 'btn primary', type: 'submit' }, 'Guardar'), h('button', { class: 'btn ghost', type: 'button', onclick: () => { nombre.value = 'Odontología pediátrica'; desc.value = ''; cnt(); } }, 'Cargar datos inválidos')));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const n = nombre.value.trim(), d = desc.value.trim();
    eN.textContent = !n ? 'El nombre es requerido.' : n.length > 15 ? `Máximo 15 caracteres (tiene ${n.length}).` : '';
    eD.textContent = !d ? 'La descripción es requerida.' : d.length > 100 ? `Máximo 100 caracteres (tiene ${d.length}).` : '';
    if (eN.textContent || eD.textContent) { con.prepend(h('div', { style: { color: 'var(--bad)' } }, '✘ validación fallida: no se guardó nada')); return; }
    const id = (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(16).slice(2));
    const especialidad = { id, nombre: n, descripcion: d };
    lista.push(especialidad);
    con.prepend(h('div', {}, `> console.log(especialidad)\n{id: '${id.slice(0, 8)}…', nombre: '${n}', descripcion: '${d}'}`));
    tbody.append(h('tr', { class: 'new' }, h('td', {}, n), h('td', {}, d)));
    form.reset(); cnt();
  });
  const src = codeBox(`form.addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = inputNombre.value.trim();
  const descripcion = inputDesc.value.trim();
  errorNombre.textContent =
    !nombre ? "El nombre es requerido." :
    nombre.length > 15 ? "Máximo 15 caracteres." : "";
  // (igual para descripción con 100)
  if (errorNombre.textContent || errorDesc.textContent) return;

  const especialidad = { id: crypto.randomUUID(), nombre, descripcion };
  console.log(especialidad);
  form.reset();
});`, 'js', 'El JS del laboratorio');
  box.append(h('div', { class: 'fl' }, form, h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px', minWidth: 0 } }, h('span', { class: 'lbl' }, 'Consola'), con, tbl)), src);
  cnt();
};

/* 10 · Storage simulator */
LABS.storage = (box) => {
  let L = {}, S = {}, C = {};
  const colL = h('div', { class: 'col' }), colS = h('div', { class: 'col' }), colC = h('div', { class: 'col' }), srv = h('div', { class: 'srv' }, 'Servidor');
  const out = h('div', { class: 'minicon', style: { minHeight: '46px' } });
  const log = (code, val, bad) => out.prepend(h('div', { html: `<b>&gt; ${esc(code)}</b>${val !== undefined ? '\n<span style="color:' + (bad ? 'var(--bad)' : 'var(--val)') + '">' + esc(val) + '</span>' : ''}` }));
  function col(el, title, sub, obj, badKeys = []) {
    el.replaceChildren(h('h4', {}, title), h('div', { class: 'sub' }, sub), ...Object.entries(obj).map(([k, v]) => h('div', { class: 'kv' + (badKeys.includes(k) && v === '[object Object]' ? ' badv' : ''), 'data-k': k }, `${k} = "${v}"`)));
    if (!Object.keys(obj).length) el.append(h('div', { class: 'muted', style: { fontSize: '12.5px' } }, '— vacío —'));
  }
  function render() { col(colC, 'Cookies', '~4KB · viajan al servidor', C); col(colL, 'localStorage', '~5–10MB · persiste', L, ['user']); col(colS, 'sessionStorage', '~5MB · por pestaña', S); }
  async function vanish(el) { $$('.kv', el).forEach(k => k.classList.add('gone')); await sleep(450); }
  const OPS = [
    ['localStorage.setItem("user", {nombre: "Vicente"})', () => { L.user = '[object Object]'; render(); log('localStorage.setItem("user", {nombre: "Vicente"})', 'guardó "[object Object]": ¡solo acepta strings!', true); }],
    ['localStorage.setItem("user", JSON.stringify({nombre: "Vicente"}))', () => { L.user = '{"nombre":"Vicente"}'; render(); log('localStorage.setItem("user", JSON.stringify(...))', 'guardó \'{"nombre":"Vicente"}\''); }],
    ['JSON.parse(localStorage.getItem("user"))', () => { const v = L.user; if (v === undefined) return log('JSON.parse(localStorage.getItem("user"))', 'null  (getItem → null, y JSON.parse(null) → null)'); if (v === '[object Object]') return log('JSON.parse(localStorage.getItem("user"))', 'Uncaught SyntaxError: "[object Object]" is not valid JSON', true); log('JSON.parse(localStorage.getItem("user"))', "{nombre: 'Vicente'}"); }],
    ['localStorage.getItem("noExiste")', () => log('localStorage.getItem("noExiste")', 'null')],
    ['sessionStorage.setItem("carrito", "3 items")', () => { S.carrito = '3 items'; render(); log('sessionStorage.setItem("carrito", "3 items")'); }],
    ['localStorage.setItem("tema", "oscuro")', () => { L.tema = 'oscuro'; render(); log('localStorage.setItem("tema", "oscuro")'); }],
    ['document.cookie = "sesion=abc123; expires=..."', () => { C.sesion = 'abc123'; render(); log('document.cookie = "sesion=abc123; expires=Fri, 31 Dec 2027 23:59:59 GMT"'); }]
  ];
  const ACT = [
    ['Hacer una request', async () => { srv.classList.add('got'); const ck = Object.entries(C).map(([k, v]) => k + '=' + v).join('; '); srv.textContent = ck ? 'Servidor recibió\nCookie: ' + ck : 'Servidor: no llegó ninguna cookie'; log('fetch("/api/turnos")', ck ? `la cabecera Cookie: ${ck} viajó sola. localStorage y sessionStorage NO viajan.` : 'sin cookies: localStorage y sessionStorage nunca viajan solos'); await sleep(1600); srv.classList.remove('got'); srv.textContent = 'Servidor'; }],
    ['Cerrar la pestaña y volver', async () => { await vanish(colS); S = {}; render(); log('(cerraste la pestaña)', 'sessionStorage se borró; localStorage y la cookie con fecha siguen.'); }],
    ['Borrar datos del sitio', async () => { await vanish(colL); await vanish(colS); await vanish(colC); L = {}; S = {}; C = {}; render(); log('(DevTools → Application → Clear site data)', 'todo vacío'); }]
  ];
  box.append(h('div', { class: 'stg' }, colC, colL, colS, srv), h('span', { class: 'lbl' }, 'Ejecutá'), h('div', { class: 'ops' }, OPS.map(([l, f]) => h('button', { class: 'btn sm', onclick: f }, l))), h('span', { class: 'lbl' }, 'Simulá'), h('div', { class: 'ops' }, ACT.map(([l, f]) => h('button', { class: 'btn sm', style: { fontFamily: 'var(--f-body)', fontWeight: 700 }, onclick: f }, l))), out);
  render();
};

/* ───────── Unidad V: carga de React / Babel bajo demanda ───────── */
const LIB_URLS = {
  react: ['https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.development.js', 'https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.development.js', 'https://unpkg.com/react@18.3.1/umd/react.development.js'],
  reactdom: ['https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.development.js', 'https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.development.js', 'https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js'],
  babel: ['https://cdn.jsdelivr.net/npm/@babel/standalone@7.26.4/babel.min.js', 'https://unpkg.com/@babel/standalone@7.26.4/babel.min.js']
};
const _loads = {};
function loadScript(key) {
  if (_loads[key]) return _loads[key];
  const urls = LIB_URLS[key];
  return _loads[key] = new Promise((res, rej) => {
    let i = 0;
    const next = () => {
      if (i >= urls.length) { delete _loads[key]; return rej(new Error('No se pudo cargar ' + key)); }
      const s = document.createElement('script'); s.src = urls[i++]; s.async = false;
      s.onload = () => res(); s.onerror = () => { s.remove(); next(); };
      document.head.append(s);
    };
    next();
  });
}
function ensureReact() { if (window.React && window.ReactDOM && ReactDOM.createRoot) return Promise.resolve(); return loadScript('react').then(() => loadScript('reactdom')); }
function ensureBabel() { if (window.Babel) return Promise.resolve(); return loadScript('babel'); }
const ReactRoots = [];
function mountReact(box, make) {
  const host = h('div', { class: 'rlab' }, h('div', { class: 'muted', style: { fontSize: '14px' } }, 'Cargando React…'));
  box.append(host);
  ensureReact().then(() => {
    if (!host.isConnected) return;
    host.replaceChildren();
    const root = ReactDOM.createRoot(host);
    root.render(React.createElement(make()));
    ReactRoots.push(root);
  }).catch(() => host.replaceChildren(h('div', { class: 'msg bad' }, 'No se pudo cargar React. Revisá la conexión y recargá la página.')));
  return host;
}

/* ───────── componentes genéricos ───────── */
function rounds(box, { cases, choices, pick, mono = true }) {
  let order, i, ok;
  const sc = h('div', { class: 'score' }), caseEl = h('div'), ch = h('div', { class: 'choices' }), fb = h('div');
  function start() { order = shuffle(cases).slice(0, pick || cases.length); i = 0; ok = 0; show(); }
  function show() {
    const cur = order[i]; fb.replaceChildren(); ch.replaceChildren();
    sc.textContent = `Ronda ${i + 1} de ${order.length} · aciertos: ${ok}`;
    caseEl.replaceChildren(h('div', { class: 'case', html: fmt(cur.c) }));
    const ans = cur.o ? cur.o[0] : cur.a;
    const opts = cur.o ? shuffle(cur.o) : choices;
    opts.forEach(t => ch.append(h('button', { class: 'choice' + (mono ? '' : ' plain'), html: fmt(t), onclick: (ev) => {
      $$('.choice', ch).forEach(b => b.disabled = true);
      const right = t === ans; if (right) ok++;
      ev.currentTarget.classList.add(right ? 'right' : 'wrong');
      if (!right) $$('.choice', ch).forEach((b, k) => { if (opts[k] === ans) b.classList.add('right'); });
      fb.replaceChildren(h('div', { class: 'msg ' + (right ? 'ok' : 'bad'), html: (right ? '✔ ' : '✘ Era ' + fmt(ans) + '. ') + fmt(cur.e || '') }),
        h('div', { class: 'row', style: { marginTop: '8px' } }, h('button', { class: 'btn sm', onclick: () => { i++; if (i < order.length) show(); else end(); } }, i + 1 < order.length ? 'Siguiente →' : 'Ver resultado')));
      sc.textContent = `Ronda ${i + 1} de ${order.length} · aciertos: ${ok}`;
    } })));
  }
  function end() { ch.replaceChildren(); caseEl.replaceChildren(h('div', { class: 'case' }, `${ok} de ${order.length}.`)); fb.replaceChildren(h('button', { class: 'btn sm', onclick: start }, 'Otra vez')); }
  box.append(sc, caseEl, ch, fb); start();
}
function classifier(box, { items, bins }) {
  let order, i, ok;
  const binEls = {};
  const grid = h('div', { class: 'cls-bins' }, bins.map(([k, label]) => (binEls[k] = h('div', { class: 'bin' }, h('h4', {}, label)))));
  const cur = h('div', { class: 'cls-cur' });
  function start() { order = shuffle(items); i = 0; ok = 0; Object.values(binEls).forEach(b => $$('.it', b).forEach(e => e.remove())); show(); }
  function show() {
    if (i >= order.length) { cur.replaceChildren(h('div', { class: 'case' }, `${ok} de ${order.length} bien ubicados.`), h('button', { class: 'btn sm', onclick: start }, 'Otra vez')); return; }
    const [name, k, info] = order[i];
    const pickBin = (b) => { const r = b === k; if (r) ok++; binEls[k].append(h('div', { class: 'it ' + (r ? 'right' : 'wrong'), title: info || '' }, `${r ? '✔' : '✘'} ${name}`, info ? h('small', {}, info) : null)); i++; show(); };
    cur.replaceChildren(h('div', { class: 'big' }, name), h('div', { class: 'row', style: { justifyContent: 'center' } }, bins.map(([b, label]) => h('button', { class: 'btn sm', onclick: () => pickBin(b) }, label))), h('div', { class: 'score' }, `${i + 1} de ${order.length} · aciertos: ${ok}`));
  }
  box.append(cur, grid); start();
}

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

/* ───────── persistencia (solo en este navegador) ───────── */
const STORE_KEY = 'fa-practica';
const DB = (() => {
  let d = {};
  try { d = JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { d = {}; }
  d.seen = d.seen || {}; d.stats = d.stats || {}; d.wrong = d.wrong || []; d.proj = d.proj || {}; d.hist = d.hist || [];
  d.set = Object.assign({ t40: 20, t10: 25, unit: 'both' }, d.set || {}); delete d.set.react; d.lastMod = d.lastMod || 'web';
  return d;
})();
function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(DB)); } catch (e) {} }

const TOPICS = { web: 'Fundamentos web', html: 'HTML', css: 'CSS', layout: 'Layout y responsive', js: 'JS: motor y variables', dom: 'DOM y eventos', obj: 'Objetos y funciones', arr: 'Arrays', async: 'Event loop y fetch', store: 'Forms y storage', entorno: 'Node, npm y Vite', jsx: 'JSX y Virtual DOM', estado: 'Props, state y eventos', efectos: 'useEffect y hooks', rforms: 'Forms y react-hook-form', arq: 'Arquitectura y Atomic', tw: 'Tailwind CSS', router: 'Router y rutas privadas', react: 'JS para React' };
const UNIT4 = ['web', 'html', 'css', 'layout', 'js', 'dom', 'obj', 'arr', 'async', 'store'];
const UNIT5 = ['entorno', 'jsx', 'estado', 'efectos', 'rforms', 'arq', 'tw', 'router'];
const unitTopics = (u) => u === '4' ? UNIT4 : u === '5' ? UNIT5 : UNIT4.concat(UNIT5);
const QBY = id => QUESTIONS.find(q => q.id === id);
function record(q, right) {
  const s = DB.stats[q.t] = DB.stats[q.t] || { n: 0, ok: 0 };
  s.n++; if (right) s.ok++;
  const i = DB.wrong.indexOf(q.id);
  if (right && i >= 0) DB.wrong.splice(i, 1);
  if (!right && i < 0) DB.wrong.push(q.id);
  save();
}
function modProgress(id) {
  const s = DB.stats[id] || { n: 0, ok: 0 };
  const acc = s.n ? s.ok / s.n : 0;
  return Math.round((DB.seen[id] ? 30 : 0) + 70 * acc * Math.min(1, s.n / 10));
}

/* ───────── consola JS + playground React ───────── */
const Konsole = (() => {
  let root, ta, out, prevBox, prev, title, modeBtns, gen = 0, timers = [], lastRun = 0, mode = 'js', rroot = null, lastErrMsg = '', lastErrT = 0;
  function fmtVal(v, d = 0, top = true) {
    if (typeof v === 'string') return top ? v : `'${v}'`;
    if (v === null) return 'null'; if (v === undefined) return 'undefined';
    if (typeof v === 'bigint') return v + 'n';
    if (typeof v === 'number' || typeof v === 'boolean') return String(v);
    if (typeof v === 'symbol') return v.toString();
    if (typeof v === 'function') return 'ƒ ' + (v.name || 'anonymous') + '()';
    if (v instanceof Error) return v.name + ': ' + v.message;
    if (v instanceof Promise) return 'Promise {<pending>}';
    if (d > 2) return Array.isArray(v) ? '[…]' : '{…}';
    if (Array.isArray(v)) return '[' + Array.from(v, x => fmtVal(x, d + 1, false)).join(', ') + ']';
    if (typeof Node !== 'undefined' && v instanceof Node) return '<' + v.nodeName.toLowerCase() + '>';
    if (v && v.$$typeof) return '<' + (typeof v.type === 'string' ? v.type : (v.type && v.type.name) || 'Componente') + ' />';
    const name = v.constructor && v.constructor !== Object && v.constructor.name ? v.constructor.name + ' ' : '';
    return name + '{' + Object.keys(v).map(k => k + ': ' + fmtVal(v[k], d + 1, false)).join(', ') + '}';
  }
  function line(cls, args, g) {
    if (g !== gen || !out) return;
    const div = h('div', { class: cls || '' });
    const parts = args.map(a => fmtVal(a));
    div.textContent = parts.join(' ');
    out.append(div); out.scrollTop = out.scrollHeight;
    args.forEach((a, i) => {
      if (a instanceof Promise) {
        const t = {};
        Promise.race([a, t]).then(v => v === t ? null : ['fulfilled', v], e => ['rejected', e]).then(st => {
          if (!st) return; parts[i] = `Promise {<${st[0]}>: ${fmtVal(st[1], 1, false)}}`; div.textContent = parts.join(' ');
        });
      }
    });
  }
  function err(e, g, inPromise) {
    const msg = 'Uncaught ' + (inPromise ? '(in promise) ' : '') + (e && e.name ? e.name + ': ' + e.message : fmtVal(e));
    if (msg === lastErrMsg && Date.now() - lastErrT < 1500) return;
    lastErrMsg = msg; lastErrT = Date.now();
    line('e', [msg], g);
  }
  function mkStorage() { const m = new Map(); return { setItem: (k, v) => m.set(String(k), String(v)), getItem: k => m.has(String(k)) ? m.get(String(k)) : null, removeItem: k => m.delete(String(k)), clear: () => m.clear(), key: i => Array.from(m.keys())[i] ?? null, get length() { return m.size; } }; }
  /* avisos de React (modo desarrollo) → a nuestra consola */
  const active = () => mode === 'react' && root && !root.hidden && Date.now() - lastRun < 180000;
  const fmtPct = (a) => { if (typeof a[0] !== 'string') return a.map(x => fmtVal(x)).join(' '); const rest = a.slice(1); return a[0].replace(/%[sdoOi]/g, () => rest.length ? String(rest.shift()) : '').split('\n').filter(l => !/^\s+at /.test(l)).join(' ').replace(/\s+/g, ' ').trim(); };
  ['error', 'warn'].forEach(k => { const o = console[k].bind(console); console[k] = (...a) => { try { if (active()) { const m = fmtPct(a); if (/^Warning:/.test(m)) line('w', [m.replace(/See https:\/\/\S+ for more information\.?/, '').trim()], gen); } } catch (e) {} return o(...a); }; });
  window.addEventListener('error', ev => { if (active() && (ev.error || !/^Script error\.?$/.test(ev.message || ''))) err(ev.error || ev.message, gen); });
  window.addEventListener('unhandledrejection', ev => { if (root && !root.hidden && Date.now() - lastRun < 15000) { err(ev.reason, gen, true); ev.preventDefault(); } });
  function clearTimers() { timers.forEach(t => { clearTimeout(t); clearInterval(t); }); timers = []; }
  function sandbox(g) {
    const c = { log: (...a) => line('', a, g), info: (...a) => line('', a, g), warn: (...a) => line('w', a, g), error: (...a) => line('e', a, g), table: (...a) => line('', a, g) };
    const wrap = (cb, a) => () => { if (g !== gen) return; try { if (typeof cb === 'function') cb(...a); } catch (e) { err(e, g); } };
    const sT = (cb, ms, ...a) => { const id = setTimeout(wrap(cb, a), ms); timers.push(id); return id; };
    const sI = (cb, ms, ...a) => { const id = setInterval(wrap(cb, a), ms); timers.push(id); return id; };
    return { names: ['console', 'localStorage', 'sessionStorage', 'setTimeout', 'setInterval'], vals: [c, mkStorage(), mkStorage(), sT, sI] };
  }
  function unmountPreview() { if (rroot) { try { rroot.unmount(); } catch (e) {} rroot = null; } if (prev) prev.replaceChildren(); }
  function run() {
    clearTimers();
    const g = ++gen; lastRun = Date.now();
    if (mode === 'react') return runReact(g);
    unmountPreview();
    out.replaceChildren(h('div', { class: 'sys' }, '▶ ejecutando…'));
    const sb = sandbox(g);
    let fn, isAsync = false;
    try { fn = new Function(...sb.names, ta.value); }
    catch (e) {
      if (/await/.test(ta.value)) { try { fn = new (Object.getPrototypeOf(async function () {}).constructor)(...sb.names, ta.value); isAsync = true; } catch (e2) { return err(e2, g); } }
      else return err(e, g);
    }
    try { const r = fn(...sb.vals); if (isAsync && r && r.catch) r.catch(e => err(e, g, true)); }
    catch (e) { err(e, g); }
    setTimeout(() => { if (g === gen && out.children.length === 1) line('sys', ['(sin salida)'], g); }, 1600);
  }
  async function runReact(g) {
    unmountPreview();
    out.replaceChildren(h('div', { class: 'sys' }, window.Babel && window.React ? '▶ compilando JSX…' : 'Cargando React y el compilador de JSX (≈3 MB, solo la primera vez)…'));
    try { await ensureReact(); await ensureBabel(); } catch (e) { return line('e', ['No se pudo cargar React o Babel. Revisá la conexión.'], g); }
    if (g !== gen) return;
    out.replaceChildren();
    let src = ta.value, name = null;
    src.replace(/export\s+default\s+function\s+([A-Za-z_$][\w$]*)/g, (m, n) => { if (/^[A-Z]/.test(n)) name = n; });
    src.replace(/^\s*export\s+default\s+([A-Za-z_$][\w$]*)\s*;?\s*$/gm, (m, n) => { if (/^[A-Z]/.test(n)) name = n; });
    src = src.replace(/^\s*import\s[^\n]*$/gm, '').replace(/export\s+default\s+function/g, 'function')
      .replace(/^\s*export\s+default\s+[A-Za-z_$][\w$]*\s*;?\s*$/gm, '').replace(/^\s*export\s*\{[^}]*\}\s*;?\s*$/gm, '').replace(/^export\s+(const|let|function|class)/gm, '$1');
    name = name || 'App';
    let code;
    try { code = Babel.transform(src, { presets: [['react', { runtime: 'classic' }]], filename: 'App.jsx' }).code; }
    catch (e) { return line('e', ['SyntaxError: ' + String(e.message).split('\n')[0].replace(/^[^:]*App\.jsx:\s*/, '')], g); }
    const sb = sandbox(g);
    const R = window.React;
    const names = ['React', 'ReactDOM', 'useState', 'useEffect', 'useRef', 'useContext', 'createContext', 'useReducer', 'useMemo', 'useCallback', 'Fragment', ...sb.names];
    const vals = [R, window.ReactDOM, R.useState, R.useEffect, R.useRef, R.useContext, R.createContext, R.useReducer, R.useMemo, R.useCallback, R.Fragment, ...sb.vals];
    let Comp;
    try { Comp = new Function(...names, code + `\n;return typeof ${name} !== 'undefined' ? ${name} : null;`)(...vals); }
    catch (e) { return err(e, g); }
    if (typeof Comp !== 'function') return line('e', [`No encontré el componente ${name}: definí function App() { … } (o export default).`], g);
    class Boundary extends R.Component {
      constructor(p) { super(p); this.state = { e: null }; }
      static getDerivedStateFromError(e) { return { e }; }
      componentDidCatch(e) { err(e, g); }
      render() { return this.state.e ? R.createElement('div', { className: 'prev-err' }, 'La app se rompió: mirá el error en la consola.') : this.props.children; }
    }
    const host = h('div'); prev.replaceChildren(host);
    rroot = ReactDOM.createRoot(host);
    rroot.render(R.createElement(Boundary, null, R.createElement(Comp)));
  }
  function setMode(m) {
    mode = m;
    if (!root) return;
    prevBox.hidden = m !== 'react';
    title.textContent = m === 'react' ? '> playground React' : '> consola JS';
    ta.setAttribute('aria-label', m === 'react' ? 'Código JSX' : 'Código JavaScript');
    $$('.chip', modeBtns).forEach(c => c.classList.toggle('on', c.dataset.m === m));
    if (m !== 'react') unmountPreview();
  }
  function build() {
    ta = h('textarea', { id: 'con-code', spellcheck: 'false', 'aria-label': 'Código JavaScript', class: 'mono' });
    ta.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); run(); }
      if (e.key === 'Tab') { e.preventDefault(); const s = ta.selectionStart; ta.setRangeText('  ', s, ta.selectionEnd, 'end'); }
      if (e.key === 'Escape') close();
    });
    out = h('div', { class: 'con-out', 'aria-live': 'polite' });
    prev = h('div', { class: 'con-prev-in' });
    prevBox = h('div', { class: 'con-prev', hidden: true }, h('span', { class: 'lbl' }, 'Vista (React real)'), prev);
    title = h('b', {}, '> consola JS');
    modeBtns = h('div', { class: 'row' }, [['js', 'JS'], ['react', 'React']].map(([m, l]) => h('button', { class: 'chip', 'data-m': m, onclick: () => { setMode(m); out.replaceChildren(); } }, l)));
    root = h('div', { class: 'con', role: 'dialog', 'aria-label': 'Consola', hidden: true },
      h('div', { class: 'con-h' }, title, modeBtns, h('button', { class: 'btn ghost sm', onclick: close, 'aria-label': 'Cerrar consola' }, '✕')),
      ta, prevBox, out,
      h('div', { class: 'con-f' }, h('div', { class: 'row' }, h('button', { class: 'btn primary sm', onclick: run }, '▶ Ejecutar'), h('button', { class: 'btn ghost sm', onclick: () => { out.replaceChildren(); } }, 'Limpiar salida')), h('span', { class: 'kbd-hint' }, 'Ctrl + Enter ejecuta · Esc cierra')));
    fxHost().append(root);
    setMode(mode);
  }
  function open(code, autorun, m) {
    if (!root) build();
    if (m) setMode(m);
    root.hidden = false; fab.hidden = true;
    if (code != null) { ta.value = code; out.replaceChildren(); unmountPreview(); }
    if (autorun) run(); else ta.focus();
  }
  function close() { if (root) root.hidden = true; fab.hidden = false; gen++; clearTimers(); unmountPreview(); }
  const fab = h('button', { class: 'btn primary con-fab', onclick: () => open(null, false) }, '> Consola');
  fxHost().append(fab);
  return { open, close, fmtVal, get mode() { return mode; } };
})();

/* ───────── quiz engine ───────── */
let activeExam = null, lastFinished = null;
class Quiz {
  constructor(root, o) { Object.assign(this, { root, mode: 'practice', timeMin: 0, title: '', inline: false, onExit: null }, o); this.i = 0; this.ans = {}; this.opts = {}; this.locked = {}; this.list.forEach(q => this.opts[q.id] = shuffle(q.o)); this.t0 = Date.now(); this.finished = false; this.key = this.key.bind(this); }
  start() {
    if (this.timeMin) { this.end = Date.now() + this.timeMin * 60000; this.tick = setInterval(() => this.updTimer(), 250); }
    document.addEventListener('keydown', this.key); this.render();
  }
  attach(root) { this.root = root; document.addEventListener('keydown', this.key); this.render(); }
  key(e) {
    if (this.finished) return;
    if (!this.root || !this.root.isConnected) { document.removeEventListener('keydown', this.key); return; }
    if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    if (document.querySelector('.inter')) return;
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= 4) { const q = this.list[this.i]; const t = this.opts[q.id][n - 1]; if (t !== undefined) { e.preventDefault(); this.choose(t); } }
    else if (e.key === 'Enter' && this.mode === 'practice' && this.locked[this.list[this.i].id]) { e.preventDefault(); this.next(); }
    else if (e.key === 'ArrowRight' && this.mode === 'exam') this.go(this.i + 1);
    else if (e.key === 'ArrowLeft' && this.mode === 'exam') this.go(this.i - 1);
  }
  updTimer() {
    if (!this.timerEl) return;
    const left = Math.max(0, this.end - Date.now());
    const m = Math.floor(left / 60000), s = Math.floor(left / 1000) % 60;
    this.timerEl.textContent = `${m}:${String(s).padStart(2, '0')}`;
    this.timerEl.classList.toggle('low', left < 60000);
    if (left <= 0) this.finish(true);
  }
  go(i) { if (i < 0 || i >= this.list.length) return; this.i = i; this.render(); }
  next() { if (this.i < this.list.length - 1) { this.i++; this.render(); } else this.finish(); }
  choose(t) {
    const q = this.list[this.i];
    if (this.mode === 'practice') {
      if (this.locked[q.id]) return;
      this.locked[q.id] = true; this.ans[q.id] = t; record(q, t === q.o[0]); this.render();
    } else {
      this.ans[q.id] = t; this.render();
      clearTimeout(this.adv);
      this.adv = setTimeout(() => { const nx = this.list.findIndex((qq, k) => k > this.i && !(qq.id in this.ans)); if (nx >= 0) this.go(nx); else if (this.i < this.list.length - 1) this.go(this.i + 1); }, RM ? 0 : 260);
    }
  }
  render() {
    if (!this.root || this.finished) return;
    const q = this.list[this.i], total = this.list.length, answered = Object.keys(this.ans).length;
    const top = h('div', { class: 'q-top' }, h('span', { class: 'q-n' }, `${this.i + 1} / ${total}`), h('div', { class: 'q-prog' }, h('i', { style: { width: (this.mode === 'exam' ? answered / total : (this.i + (this.locked[q.id] ? 1 : 0)) / total) * 100 + '%' } })));
    if (this.timeMin) { this.timerEl = h('span', { class: 'timer', 'aria-label': 'Tiempo restante' }); top.append(this.timerEl); this.updTimer(); }
    if (!this.inline) top.append(h('button', { class: 'btn ghost sm', onclick: () => this.exit() }, this.mode === 'exam' ? 'Abandonar' : 'Salir'));
    const card = h('div', { class: 'q-card' });
    card.append(h('div', { class: 'q-meta' }, h('span', { class: 'pill ' + (q.d === 'd' ? 'hard' : 'easy') }, q.d === 'd' ? 'código' : 'rápida'), h('span', { class: 'lbl' }, TOPICS[q.t])));
    card.append(h('div', { class: 'q-text', html: fmt(q.q) }));
    if (q.c) card.append(h('div', { class: 'codeblk' }, h('pre', { class: 'code', html: hl(q.c, q.l) })));
    const locked = this.locked[q.id];
    const opts = h('div', { class: 'opts', role: 'group', 'aria-label': 'Opciones' });
    this.opts[q.id].forEach((t, k) => {
      let cls = 'opt';
      if (this.mode === 'exam' && this.ans[q.id] === t) cls += ' sel';
      if (locked) { if (t === q.o[0]) cls += ' right'; else if (this.ans[q.id] === t) cls += ' wrong'; }
      opts.append(h('button', { class: cls, disabled: !!locked, onclick: () => this.choose(t) }, h('span', { class: 'k' }, k + 1), h('span', { class: 't', html: fmt(t) })));
    });
    card.append(opts);
    if (locked) {
      const ok = this.ans[q.id] === q.o[0];
      const ex = h('div', { class: 'q-exp ' + (ok ? 'ok' : 'bad') }, h('b', { class: 'v' }, ok ? '✔ Correcto' : '✘ Incorrecto'));
      if (q.e) ex.append(h('div', { html: fmt(q.e) }));
      const r = h('div', { class: 'row' });
      if (q.run) r.append(h('button', { class: 'btn sm', onclick: () => Konsole.open(q.c, true, q.run === 'r' ? 'react' : 'js') }, q.run === 'r' ? '▶ Ejecutarlo en React' : '▶ Ejecutarlo de verdad'));
      const lid = TOPIC_LESSON[q.t];
      if (lid && !this.inline) r.append(h('a', { class: 'btn ghost sm', href: '#/' + lid }, 'Repasar la lección'));
      if (r.children.length) ex.append(r);
      card.append(ex);
    }
    const act = h('div', { class: 'q-actions' });
    if (this.mode === 'practice') {
      act.append(h('span', { class: 'kbd-hint' }, 'Teclas 1–4 para responder · Enter para seguir'));
      if (locked) act.append(h('button', { class: 'btn primary', onclick: () => this.next() }, this.i < total - 1 ? 'Siguiente →' : 'Ver resultado'));
    } else {
      const nav = h('div', { class: 'q-nav' }, this.list.map((qq, k) => h('button', { class: (qq.id in this.ans ? 'ans' : '') + (k === this.i ? ' cur' : ''), onclick: () => this.go(k), 'aria-label': 'Pregunta ' + (k + 1) }, k + 1)));
      const left = total - answered;
      const conf = h('div', { class: 'row' });
      const deliver = h('button', { class: 'btn primary', onclick: () => {
        if (left === 0) return this.finish();
        conf.replaceChildren(h('span', { class: 'msg warn' }, `Te faltan ${left}. ¿Entregás igual?`), h('button', { class: 'btn sm primary', onclick: () => this.finish() }, 'Entregar'), h('button', { class: 'btn sm', onclick: () => conf.replaceChildren() }, 'Seguir'));
      } }, 'Entregar');
      act.append(nav, h('div', { class: 'row' }, h('button', { class: 'btn sm', onclick: () => this.go(this.i - 1), disabled: this.i === 0 }, '←'), h('button', { class: 'btn sm', onclick: () => this.go(this.i + 1), disabled: this.i === total - 1 }, '→'), deliver), conf);
    }
    const wrap = h('div', { class: 'quiz' }, top, card, act);
    if (this.mode === 'exam') wrap.append(h('span', { class: 'kbd-hint' }, 'Teclas 1–4 para responder · ← → para moverte'));
    this.root.replaceChildren(wrap);
  }
  finish(timeout) {
    if (this.finished) return; this.finished = true;
    if (this.mode === 'exam') document.body.classList.remove('exam-on');
    clearInterval(this.tick); clearTimeout(this.adv); document.removeEventListener('keydown', this.key);
    if (this.mode === 'exam') {
      this.list.forEach(q => { if (q.id in this.ans) record(q, this.ans[q.id] === q.o[0]); else if (!DB.wrong.includes(q.id)) { DB.wrong.push(q.id); } });
      const ok = this.list.filter(q => this.ans[q.id] === q.o[0]).length;
      DB.hist.unshift({ d: Date.now(), k: this.kind, u: this.unit, ok, n: this.list.length, s: Math.round((Date.now() - this.t0) / 1000) }); DB.hist = DB.hist.slice(0, 8); save();
    }
    if (activeExam === this) activeExam = null;
    if (!this.root || !this.root.isConnected) { lastFinished = this; this.timedOut = timeout; return; }
    this.results(timeout);
  }
  results(timeout) {
    const n = this.list.length, ok = this.list.filter(q => this.ans[q.id] === q.o[0]).length, pct = Math.round(ok / n * 100);
    const C = 2 * Math.PI * 52;
    const ring = h('div', { html: `<svg class="ring" viewBox="0 0 130 130"><circle class="bg" cx="65" cy="65" r="52"/><circle class="fg" cx="65" cy="65" r="52" stroke-dasharray="${C}" stroke-dashoffset="${C}"/><text x="65" y="74" text-anchor="middle">${pct}%</text></svg>` });
    requestAnimationFrame(() => requestAnimationFrame(() => { const fg = ring.querySelector('.fg'); if (fg) fg.style.strokeDashoffset = C * (1 - pct / 100); }));
    const by = {};
    this.list.forEach(q => { const b = by[q.t] = by[q.t] || { n: 0, ok: 0 }; b.n++; if (this.ans[q.id] === q.o[0]) b.ok++; });
    const bars = h('div', { class: 'bars' }, Object.entries(by).map(([t, b]) => { const p = b.ok / b.n; return h('div', { class: 'bar-r' }, h('span', {}, TOPICS[t]), h('div', { class: 'tr' }, h('i', { class: p < .5 ? 'lo' : p < .8 ? 'mid' : 'hi', style: { width: p * 100 + '%' } })), h('span', {}, `${b.ok}/${b.n}`)); }));
    const secs = Math.round((Date.now() - this.t0) / 1000);
    const headTxt = h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px', minWidth: 0 } },
      h('h2', { style: { fontSize: '28px' } }, `${ok} de ${n} correctas`),
      h('p', { class: 'muted' }, (timeout ? 'Se terminó el tiempo. ' : '') + `Tiempo usado: ${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}` + (this.mode === 'exam' ? '' : ' · modo práctica')), bars);
    const showAll = h('input', { type: 'checkbox', id: 'rev-all' });
    const rev = h('div', { class: 'review' });
    const drawRev = () => {
      rev.replaceChildren(...this.list.filter(q => showAll.checked || this.ans[q.id] !== q.o[0]).map(q => {
        const ok = this.ans[q.id] === q.o[0];
        return h('div', { class: 'rev' + (ok ? ' okk' : '') }, h('div', { class: 'q-meta' }, h('span', { class: 'lbl' }, TOPICS[q.t])), h('div', { class: 'q-text', style: { fontSize: '16.5px' }, html: fmt(q.q) }), q.c ? h('div', { class: 'codeblk' }, h('pre', { class: 'code small', html: hl(q.c, q.l) })) : null,
          ok ? null : h('div', { class: 'yours', html: 'Tu respuesta: ' + (q.id in this.ans ? fmt(this.ans[q.id]) : '<i>sin responder</i>') }),
          h('div', { class: 'corr', html: 'Correcta: ' + fmt(q.o[0]) }), q.e ? h('div', { class: 'muted', style: { fontSize: '14.5px' }, html: fmt(q.e) }) : null,
          q.run ? h('div', {}, h('button', { class: 'btn sm', onclick: () => Konsole.open(q.c, true, q.run === 'r' ? 'react' : 'js') }, '▶ Ejecutarlo')) : null);
      }));
      if (!rev.children.length) rev.append(h('div', { class: 'msg ok' }, 'Sin errores. Impecable.'));
    };
    showAll.addEventListener('change', drawRev); drawRev();
    const wrong = this.list.filter(q => this.ans[q.id] !== q.o[0]);
    const btns = h('div', { class: 'row' });
    if (wrong.length) btns.append(h('button', { class: 'btn primary', onclick: () => startPractice(shuffle(wrong), 'Repaso de este intento', this.inline ? this.root : null, this.back) }, `Practicar mis ${wrong.length} errores`));
    if (!this.inline) btns.append(h('button', { class: 'btn', onclick: () => this.exit() }, 'Volver'));
    else btns.append(h('button', { class: 'btn', onclick: () => { const q = new Quiz(this.root, { list: shuffle(this.list), mode: 'practice', inline: true }); q.start(); } }, 'Otra vuelta'));
    this.root.replaceChildren(h('div', { class: 'quiz' }, h('div', { class: 'res-head' }, ring, headTxt), btns, h('div', { class: 'sec-h', style: { margin: '10px 0 0' } }, h('h2', { style: { fontSize: '20px' } }, 'Revisión'), h('label', { class: 'row', style: { fontSize: '14px' } }, showAll, ' mostrar también las correctas')), rev));
    if (!this.inline) window.scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' });
  }
  exit() { this.finished = true; clearInterval(this.tick); clearTimeout(this.adv); document.removeEventListener('keydown', this.key); if (activeExam === this) activeExam = null; if (this.onExit) this.onExit(); }
}
function pickBalanced(pool, n) {
  const by = {}; shuffle(pool).forEach(q => (by[q.t] = by[q.t] || []).push(q));
  const keys = shuffle(Object.keys(by)), out = [];
  while (out.length < n && keys.some(k => by[k].length)) for (const k of keys) { if (by[k].length && out.length < n) out.push(by[k].pop()); }
  return shuffle(out);
}
function startExam(kind) {
  const topics = unitTopics(DB.set.unit);
  const pool = QUESTIONS.filter(q => topics.includes(q.t) && q.d === (kind === '40' ? 'f' : 'd'));
  const list = pickBalanced(pool, kind === '40' ? 40 : 10);
  activeExam = new Quiz(null, { list, mode: 'exam', timeMin: kind === '40' ? DB.set.t40 : DB.set.t10, kind, unit: DB.set.unit, onExit: () => { go('simulacro'); } });
  activeExam.started = false;
  go('simulacro');
}
function startPractice(list, title, inlineRoot, back) {
  if (inlineRoot) { const q = new Quiz(inlineRoot, { list, mode: 'practice', inline: true }); q.start(); return; }
  const v = view();
  v.append(h('div', { class: 'sec-h', style: { marginTop: 0 } }, h('h2', {}, title)));
  const box = h('div'); v.append(box);
  back = back || 'simulacro';
  const q = new Quiz(box, { list, mode: 'practice', back, onExit: () => { go(back); } }); q.start();
  window.scrollTo(0, 0);
}

/* ───────── glyphs (animación por nivel) ───────── */
const GLYPHS = {
  web: `<svg viewBox="0 0 150 120"><line x1="20" y1="60" x2="130" y2="60" class="g-line"/><circle cx="20" cy="60" r="13" class="g-node"/><circle cx="75" cy="60" r="13" class="g-node"/><circle cx="130" cy="60" r="13" class="g-node"/><text x="20" y="92" class="g-t">cliente</text><text x="75" y="92" class="g-t">dns</text><text x="130" y="92" class="g-t">server</text><circle cx="20" cy="60" r="5.5" class="g-a g-trip"/></svg>`,
  html: `<svg viewBox="0 0 150 120">${['<header>', '<main>', '<footer>'].map((t, i) => `<g class="g-stack" style="animation-delay:${i * .35}s"><rect x="18" y="${14 + i * 34}" width="114" height="26" rx="6" class="g-box${i === 1 ? ' g-b2' : ''}"/><text x="75" y="${31 + i * 34}" class="g-t g-tc">${esc(t)}</text></g>`).join('')}</svg>`,
  css: `<svg viewBox="0 0 150 120">${[['ID', 80, 'g-a'], ['clase', 52, 'g-b'], ['elem', 28, 'g-c']].map(([l, hh, c], i) => `<rect x="${20 + i * 42}" y="${96 - hh}" width="30" height="${hh}" rx="4" class="${c} g-bar" style="animation-delay:${i * .25}s"/><text x="${35 + i * 42}" y="112" class="g-t">${l}</text>`).join('')}</svg>`,
  layout: `<svg viewBox="0 0 150 120">${[0, 1, 2, 3].map(i => `<rect x="${8 + i * 35}" y="46" width="28" height="28" rx="5" class="${['g-a', 'g-b', 'g-c', 'g-d'][i]} g-l${i}"/>`).join('')}<text x="75" y="112" class="g-t g-swap">flex ⇄ grid</text></svg>`,
  js: `<svg viewBox="0 0 150 120"><text x="18" y="72" class="g-brace">{</text><text x="132" y="72" class="g-brace">}</text>${['var', 'let', 'const'].map((t, i) => `<text x="75" y="68" class="g-kw" style="animation-delay:${i * 1.2}s">${t}</text>`).join('')}</svg>`,
  dom: `<svg viewBox="0 0 150 120"><path d="M75 22 L40 58 M75 22 L110 58 M40 58 L22 96 M40 58 L58 96 M110 58 L110 96" class="g-line"/>${[[75, 22], [40, 58], [110, 58], [22, 96], [58, 96], [110, 96]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="9" class="${i ? 'g-node' : 'g-a'} g-pop" style="animation-delay:${i * .25}s"/>`).join('')}</svg>`,
  obj: `<svg viewBox="0 0 150 120"><text x="14" y="76" class="g-brace">{</text><text x="136" y="76" class="g-brace">}</text>${[0, 1, 2].map(i => `<g class="g-stack" style="animation-delay:${i * .35}s"><rect x="34" y="${30 + i * 24}" width="30" height="12" rx="3" class="g-c"/><rect x="70" y="${30 + i * 24}" width="${44 - i * 8}" height="12" rx="3" class="g-b"/></g>`).join('')}</svg>`,
  arr: `<svg viewBox="0 0 150 120">${[0, 1, 2, 3, 4].map(i => `<rect x="${6 + i * 28}" y="44" width="24" height="24" rx="4" class="${i === 4 ? 'g-a g-push' : 'g-box'}"/><text x="${18 + i * 28}" y="86" class="g-t">${i}</text>`).join('')}</svg>`,
  async: `<svg viewBox="0 0 150 120"><circle cx="75" cy="58" r="36" class="g-ring"/><g class="g-spin"><circle cx="75" cy="22" r="7" class="g-a"/></g><text x="75" y="54" class="g-t">event</text><text x="75" y="68" class="g-t">loop</text></svg>`,
  store: `<svg viewBox="0 0 150 120">${[0, 1, 2].map(i => `<rect x="30" y="${18 + i * 30}" width="90" height="24" rx="4" class="g-box g-drawer" style="animation-delay:${i * .5}s"/><rect x="66" y="${27 + i * 30}" width="18" height="5" rx="2" class="g-c g-drawer" style="animation-delay:${i * .5}s"/>`).join('')}</svg>`,
  entorno: `<svg viewBox="0 0 150 120"><rect x="8" y="12" width="134" height="96" rx="8" class="g-box"/><circle cx="20" cy="23" r="3" class="g-c"/><circle cx="30" cy="23" r="3" class="g-a"/><circle cx="40" cy="23" r="3" class="g-d"/>${['$ npm create vite', '$ npm install', '$ npm run dev', '➜ localhost:5173'].map((t, i) => `<text x="18" y="${46 + i * 16}" class="g-term g-stack${i === 3 ? ' g-okt' : ''}" style="animation-delay:${i * .45}s">${t}</text>`).join('')}</svg>`,
  jsx: `<svg viewBox="0 0 150 120">${['&lt;App /&gt;', '{nombre}', '&lt;&gt;…&lt;/&gt;'].map((t, i) => `<text x="75" y="68" class="g-kw" style="animation-delay:${i * 1.2}s">${t}</text>`).join('')}</svg>`,
  estado: `<svg viewBox="0 0 150 120"><rect x="35" y="10" width="80" height="26" rx="6" class="g-box g-b2"/><text x="75" y="27" class="g-t g-tc">Padre</text><rect x="35" y="84" width="80" height="26" rx="6" class="g-box"/><text x="75" y="101" class="g-t">Hijo</text><line x1="62" y1="38" x2="62" y2="82" class="g-line"/><line x1="88" y1="38" x2="88" y2="82" class="g-line"/><circle cx="62" cy="42" r="5" class="g-b g-down"/><circle cx="88" cy="78" r="5" class="g-a g-up"/><text x="30" y="64" class="g-t">props</text><text x="122" y="64" class="g-t">fn()</text></svg>`,
  efectos: `<svg viewBox="0 0 150 120">${['montaje', 'actualización', 'desmontaje'].map((t, i) => `<g class="g-stack" style="animation-delay:${i * .5}s"><rect x="${14 + i * 8}" y="${14 + i * 32}" width="${122 - i * 16}" height="24" rx="12" class="${['g-d', 'g-b', 'g-a'][i]}"/><text x="75" y="${30 + i * 32}" class="g-t g-white">${t}</text></g>`).join('')}</svg>`,
  rforms: `<svg viewBox="0 0 150 120"><rect x="15" y="30" width="120" height="26" rx="5" class="g-box g-b2"/><text x="24" y="47" class="g-term">Al</text><rect x="38" y="35" width="2" height="16" class="g-a g-blink"/><text x="15" y="78" class="g-err g-stack">Mínimo 3 caracteres</text></svg>`,
  arq: `<svg viewBox="0 0 150 120"><circle cx="22" cy="60" r="8" class="g-a g-pop"/>${[[60, 50], [70, 68], [52, 68]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" class="g-b g-pop" style="animation-delay:.4s"/>`).join('')}${[0, 1, 2].flatMap(r => [0, 1, 2].map(c => `<circle cx="${100 + c * 16}" cy="${44 + r * 16}" r="6" class="g-c g-pop" style="animation-delay:.8s"/>`)).join('')}<text x="22" y="100" class="g-t">átomo</text><text x="62" y="100" class="g-t">molécula</text><text x="116" y="100" class="g-t">organismo</text></svg>`,
  tw: `<svg viewBox="0 0 150 120"><line x1="10" y1="64" x2="140" y2="64" class="g-line"/>${[['sm', 38], ['md', 62], ['lg', 92], ['xl', 120]].map(([t, x]) => `<line x1="${x}" y1="56" x2="${x}" y2="72" class="g-line"/><text x="${x}" y="88" class="g-t">${t}</text>`).join('')}<circle cx="14" cy="64" r="6" class="g-a g-tw"/><text x="75" y="36" class="g-t g-tc">mobile first →</text></svg>`,
  router: `<svg viewBox="0 0 150 120"><line x1="20" y1="60" x2="130" y2="60" class="g-line"/><circle cx="20" cy="60" r="13" class="g-node"/><circle cx="75" cy="60" r="13" class="g-node"/><circle cx="130" cy="60" r="13" class="g-node"/><text x="20" y="92" class="g-t">/login</text><text x="75" y="92" class="g-t">/admin</text><text x="130" y="92" class="g-t">/products</text><circle cx="20" cy="60" r="5.5" class="g-a g-trip"/></svg>`
};
(function glyphCSS() {
  const css = `.g-line{stroke:var(--line);stroke-width:2;fill:none}.g-node{fill:var(--panel);stroke:var(--tag);stroke-width:2}.g-t{font-family:var(--f-mono);font-size:10px;fill:var(--muted);text-anchor:middle}.g-tc{fill:var(--tag);font-size:11px}
  .g-a{fill:var(--tag)}.g-b{fill:var(--val)}.g-c{fill:var(--attr)}.g-d{fill:var(--ok)}.g-box{fill:var(--panel-2);stroke:var(--line)}.g-b2{stroke:var(--tag)}
  .g-trip{animation:gTrip 4s cubic-bezier(.6,0,.3,1) infinite}@keyframes gTrip{0%,8%{transform:translateX(0)}25%,33%{transform:translateX(55px)}50%,58%{transform:translateX(0)}75%,83%{transform:translateX(110px)}100%{transform:translateX(0)}}
  .g-stack{animation:gStack 4s ease infinite both}@keyframes gStack{0%{opacity:0;transform:translateY(-8px)}15%,85%{opacity:1;transform:none}100%{opacity:0}}
  .g-bar{transform-box:fill-box;transform-origin:bottom;animation:gBar 2.4s ease-in-out infinite alternate}@keyframes gBar{from{transform:scaleY(.35)}to{transform:scaleY(1)}}
  .g-l0,.g-l1,.g-l2,.g-l3{animation:4.5s cubic-bezier(.5,0,.2,1) infinite}.g-l0{animation-name:gL0}.g-l1{animation-name:gL1}.g-l2{animation-name:gL2}.g-l3{animation-name:gL3}
  @keyframes gL0{0%,30%,100%{transform:none}50%,80%{transform:translate(32px,-24px)}}@keyframes gL1{0%,30%,100%{transform:none}50%,80%{transform:translate(32px,-24px)}}@keyframes gL2{0%,30%,100%{transform:none}50%,80%{transform:translate(-38px,8px)}}@keyframes gL3{0%,30%,100%{transform:none}50%,80%{transform:translate(-38px,8px)}}
  .g-brace{font-family:var(--f-mono);font-size:58px;fill:var(--tag);text-anchor:middle}.g-kw{font-family:var(--f-mono);font-size:22px;font-weight:600;fill:var(--attr);text-anchor:middle;opacity:0;animation:gKw 3.6s infinite}@keyframes gKw{0%{opacity:0;transform:translateY(6px)}8%,28%{opacity:1;transform:none}36%,100%{opacity:0}}
  .g-pop{transform-box:fill-box;transform-origin:center;animation:gPop 4s ease infinite both}@keyframes gPop{0%{transform:scale(0)}12%,85%{transform:scale(1)}100%{transform:scale(0)}}
  .g-push{animation:gPush 3s ease-in-out infinite}@keyframes gPush{0%,20%{transform:none;opacity:1}45%,55%{transform:translate(20px,-26px);opacity:0}80%,100%{transform:none;opacity:1}}
  .g-ring{fill:none;stroke:var(--line);stroke-width:3;stroke-dasharray:6 5}.g-spin{transform-origin:75px 58px;animation:gSpin 3s linear infinite}@keyframes gSpin{to{transform:rotate(360deg)}}
  .g-drawer{animation:gDrawer 3s ease-in-out infinite}@keyframes gDrawer{0%,30%,100%{transform:none}50%,70%{transform:translateX(16px)}}
  .g-term{font-family:var(--f-mono);font-size:9.5px;fill:var(--ink)}.g-okt{fill:var(--ok)}.g-white{fill:var(--on-tag);font-size:10px}.g-err{font-family:var(--f-body);font-size:11px;fill:var(--bad)}
  .g-down{animation:gDown 2.4s ease-in-out infinite}@keyframes gDown{0%,10%{transform:none;opacity:1}80%{transform:translateY(34px);opacity:1}100%{transform:translateY(34px);opacity:0}}
  .g-up{animation:gUp 2.4s ease-in-out 1.2s infinite}@keyframes gUp{0%,10%{transform:none;opacity:1}80%{transform:translateY(-34px);opacity:1}100%{transform:translateY(-34px);opacity:0}}
  .g-blink{animation:blink 1s steps(1) infinite}.g-tw{animation:gTw 5s ease-in-out infinite alternate}@keyframes gTw{from{transform:none}to{transform:translateX(118px)}}
  @media (prefers-reduced-motion: reduce){.g-stack,.g-pop,.g-kw{animation:none!important;opacity:1}.g-kw{opacity:0!important}.g-kw:last-child{opacity:1!important}}`;
  document.head.append(h('style', {}, css));
})();

/* ───────── pantalla de entrada al cambiar de tema ───────── */
function interstitial(mod) {
  return new Promise(res => {
    if (RM) return res();
    const tagText = `<leccion-${String(mod.n).padStart(2, '0')} ${mod.tag}>`;
    const typed = h('div', { class: 'typed' }, tagText);
    typed.style.setProperty('--steps', tagText.length);
    const stages = mod.unit === 5 ? ['JSX', 'createElement', 'Virtual DOM', 'Diff', 'Commit', 'DOM'] : ['HTML', 'DOM', 'CSSOM', 'Render tree', 'Layout', 'Paint'];
    const pipe = h('div', { class: 'pipe', 'aria-hidden': 'true' }, stages.flatMap((s, i) => { const sp = h('span', { class: 's' }, s); sp.style.animationDelay = (0.35 + i * 0.16) + 's'; return i ? [h('span', { class: 'ar' }, '→'), sp] : [sp]; }));
    const el = h('div', { class: 'inter', role: 'dialog', 'aria-label': 'Lección ' + mod.n + ': ' + mod.title },
      h('div', { class: 'box' }, typed, h('h2', {}, mod.title), pipe, h('div', { class: 'teaser' }, h('span', { class: 'lbl' }, 'Trampa de este tema'), mod.teaser), h('div', { class: 'skip' }, 'Tocá o presioná una tecla para entrar')));
    let done = false;
    const end = () => { if (done) return; done = true; document.removeEventListener('keydown', end); el.classList.add('out'); setTimeout(() => { el.remove(); }, 330); res(); };
    el.addEventListener('click', end); document.addEventListener('keydown', end);
    fxHost().append(el);
    setTimeout(end, 2700);
  });
}

// Al entrar a una lección de otro tema: animación con la trampa típica del tema.
// skip = true solo registra el tema (primera carga de la página).
let lastTopic = null;
function intro(lessonId, skip) {
  const t = LESSON_TOPIC[lessonId];
  if (!t || t === lastTopic) return Promise.resolve();
  lastTopic = t;
  if (skip) return Promise.resolve();
  const { LESSONS } = window.GUIDE, i = LESSONS.findIndex(l => l.id === lessonId);
  return interstitial({ n: i + 1, title: LESSONS[i].title, ...META[t] });
}

/* ───────── integración con la guía ───────── */
LABS.anatomy = (box) => box.append(anatomyBlock());

function vlab(id) {
  const meta = VLABS[id];
  const body = h('div', { class: 'lab-b' });
  const el = h('section', { class: 'vlab' }, h('div', { class: 'lab-h' }, h('h3', {}, meta.title), h('p', {}, meta.sub)), body);
  try { LABS[id](body); } catch (e) { body.append(h('div', { class: 'msg bad' }, 'No se pudo cargar este laboratorio: ' + e.message)); console.error(e); }
  return el;
}

function miniQuiz(lessonId) {
  const t = LESSON_TOPIC[lessonId];
  const topics = lessonId === 'react-componentes-jsx' ? [t, 'react'] : [t];
  const qs = QUESTIONS.filter(q => topics.includes(q.t));
  if (!qs.length) return null;
  const box = h('div', { class: 'inline-quiz' });
  const startMini = () => {
    const list = shuffle(qs.filter(q => q.d === 'f')).slice(0, 3).concat(shuffle(qs.filter(q => q.d === 'd')).slice(0, 3));
    new Quiz(box, { list: shuffle(list), mode: 'practice', inline: true }).start();
  };
  const s = DB.stats[t];
  box.append(h('div', { class: 'row', style: { justifyContent: 'space-between' } },
    h('div', {}, h('h3', { style: { fontSize: '20px' } }, 'Mini-quiz: ' + TOPICS[t]),
      h('p', { class: 'muted', style: { fontSize: '14.5px' } }, `6 preguntas al azar (rápidas y de código) de un banco de ${qs.length}.` + (s ? ` Llevás ${s.ok}/${s.n} bien en este tema.` : ''))),
    h('div', { class: 'row' }, h('button', { class: 'btn primary', onclick: startMini }, 'Empezar'),
      h('button', { class: 'btn', onclick: () => startPractice(shuffle(qs), 'Todas las preguntas: ' + TOPICS[t], null, lessonId) }, `Todas (${qs.length})`))));
  return box;
}

// Monta en una lección ya dibujada: laboratorios visuales + trampas (en #fxLabs) y mini-quiz (en #fxQuiz)
function mountLesson(lessonId, root) {
  cleanup();
  const labsSlot = root.querySelector('#fxLabs'), quizSlot = root.querySelector('#fxQuiz');
  const glyphSlot = root.querySelector('#fxGlyph');
  if (glyphSlot && GLYPHS[LESSON_TOPIC[lessonId]]) glyphSlot.innerHTML = GLYPHS[LESSON_TOPIC[lessonId]];
  const ids = LABS_AT[lessonId] || [];
  const trapTopic = Object.keys(TRAPS_AT).find(t => TRAPS_AT[t] === lessonId);
  if (labsSlot && ids.length) labsSlot.append(h('h2', {}, 'Laboratorios visuales'),
    h('p', {}, 'Simuladores para ver por dentro lo que acabás de leer: tocá, avanzá paso a paso, rompé cosas.'),
    h('div', { class: 'fx', style: { display: 'grid', gap: '20px' } }, ids.map(vlab)));
  if (labsSlot && trapTopic && TRAPS[trapTopic]) labsSlot.append(h('div', { class: 'fx', style: { marginTop: '28px' } },
    h('div', { class: 'traps' }, h('div', { class: 'h' }, `console.warn("Trampas de parcial: ${TOPICS[trapTopic]}")`), h('ul', {}, TRAPS[trapTopic].map(x => h('li', { html: x }))))));
  const mq = quizSlot && LESSON_TOPIC[lessonId] && miniQuiz(lessonId);
  if (mq) quizSlot.append(h('h2', {}, 'Autoevaluación'), h('p', {}, 'Preguntas con el formato del parcial. Las de código se pueden ejecutar de verdad.'), h('div', { class: 'fx' }, mq));
}

// Bloque extra de la portada: práctica, estadísticas y temas probables
function homeExtras() {
  const tot = Object.values(DB.stats).reduce((a, s) => ({ n: a.n + s.n, ok: a.ok + s.ok }), { n: 0, ok: 0 });
  return h('div', { class: 'fx' },
    h('div', { class: 'sec-h' }, h('h2', {}, 'Practicá como en el parcial')),
    h('div', { class: 'howto' },
      [['#/simulacro', 'Simulacro con tiempo', `40 rápidas o 10 de código, sorteadas de ${QUESTIONS.length} preguntas. Al entregar, revisás cada una con su explicación.`],
       ['#/proyectos', 'Proyectos', 'Del turnero en vanilla al panel admin en React, con requisitos para tildar y pruebas de fuego.'],
       [null, 'Consola JS y React', 'Abrila desde el botón “> Consola” (abajo a la derecha) para probar código suelto o un componente.']]
        .map(([href, t, d]) => h(href ? 'a' : 'div', { href, style: { textDecoration: 'none', color: 'inherit' } }, h('h3', {}, t), h('p', {}, d)))),
    h('div', { class: 'stats' }, h('span', {}, h('b', {}, tot.n), ' respuestas'), h('span', {}, h('b', {}, tot.n ? Math.round(tot.ok / tot.n * 100) + '%' : '—'), ' de aciertos'), h('span', {}, h('b', {}, DB.wrong.length), ' errores para repasar')),
    h('div', { class: 'sec-h' }, h('h2', {}, 'Lo más probable que te tomen'), h('span', { class: 'muted', style: { fontSize: '14px' } }, 'Estimación a partir de las diapositivas y del 1er parcial')),
    h('div', { class: 'hot-list' }, HOT.map(x => h('a', { class: 'hot', href: '#/' + TOPIC_LESSON[x.mod] }, h('span', { class: 'pill hot' + x.lvl }, ['', 'puede salir', 'probable', 'muy probable'][x.lvl]), h('span', { class: 'txt' }, x.txt)))));
}

function simView() {
  const v = view();
  if (lastFinished) { const q = lastFinished; lastFinished = null; const box = h('div'); v.append(box); q.root = box; q.results(q.timedOut); return; }
  if (activeExam) {
    const box = h('div'); v.append(box);
    if (!activeExam.started) { activeExam.started = true; activeExam.root = box; activeExam.start(); }
    else activeExam.attach(box);
    return;
  }
  const timeChips = (key, vals) => h('div', { class: 'opts-row' }, h('span', { class: 'lbl' }, 'tiempo'), vals.map(t => h('button', { class: 'chip' + (DB.set[key] === t ? ' on' : ''), onclick: (e) => { DB.set[key] = t; save(); $$('.chip', e.currentTarget.parentNode).forEach(c => c.classList.toggle('on', c === e.currentTarget)); } }, t + ' min')));
  const tp = unitTopics(DB.set.unit);
  const nE = QUESTIONS.filter(q => q.d === 'f' && tp.includes(q.t)).length, nD = QUESTIONS.filter(q => q.d === 'd' && tp.includes(q.t)).length;
  const UN = { both: 'Unidades IV y V', '4': 'la Unidad IV', '5': 'la Unidad V' };
  v.append(h('div', { class: 'sec-h', style: { marginTop: 0 } }, h('h1', { style: { fontSize: 'var(--step-4)', fontWeight: 800 } }, 'Simulacro'), h('span', { class: 'muted' }, 'Los dos formatos que puede tener el parcial')));
  v.append(h('div', { class: 'opts-row', style: { marginBottom: '14px' } }, h('span', { class: 'lbl' }, 'temas'), [['both', 'Unidad IV + V'], ['4', 'Solo Unidad IV'], ['5', 'Solo Unidad V']].map(([k, l]) => h('button', { class: 'chip' + (DB.set.unit === k ? ' on' : ''), onclick: () => { DB.set.unit = k; save(); simView(); } }, l))));
  v.append(h('div', { class: 'mode-cards' },
    h('div', { class: 'mode' }, h('h2', {}, h('span', { class: 'n' }, '40'), ' rápidas'), h('p', {}, `Preguntas cortas de ${UN[DB.set.unit]}, sorteadas de un banco de ${nE} y repartidas entre temas. Respondés y pasa sola a la siguiente; podés volver con la grilla.`), timeChips('t40', [15, 20, 30, 40]), h('button', { class: 'btn primary', onclick: () => startExam('40') }, 'Empezar 40 rápidas')),
    h('div', { class: 'mode' }, h('h2', {}, h('span', { class: 'n' }, '10'), ' difíciles'), h('p', {}, `Leer código: qué imprime, qué se ve en pantalla, dónde está el error, qué regla gana. Sorteadas de ${nD}, de temas distintos.`), timeChips('t10', [15, 25, 35, 45]), h('button', { class: 'btn primary', onclick: () => startExam('10') }, 'Empezar 10 difíciles'))));
  v.append(h('p', { class: 'muted', style: { fontSize: '14px', marginTop: '10px' } }, 'Durante el simulacro no ves las respuestas; al entregar, revisás cada una con su explicación.'));
  v.append(h('div', { class: 'sec-h' }, h('h2', {}, 'Práctica por tema'), h('span', { class: 'muted' }, 'Con explicación después de cada respuesta')));
  const chip = t => { const s = DB.stats[t], n = QUESTIONS.filter(q => q.t === t).length; return h('button', { class: 'chip', onclick: () => startPractice(shuffle(QUESTIONS.filter(q => q.t === t)), 'Práctica: ' + TOPICS[t]) }, `${TOPICS[t]} · ${n}` + (s ? ` · ${Math.round(s.ok / s.n * 100)}%` : '')); };
  v.append(h('span', { class: 'lbl' }, 'Unidad IV'), h('div', { class: 'topic-grid', style: { margin: '6px 0 12px' } }, UNIT4.map(chip)), h('span', { class: 'lbl' }, 'Unidad V'), h('div', { class: 'topic-grid', style: { marginTop: '6px' } }, UNIT5.map(chip)));
  const wr = DB.wrong.map(QBY).filter(Boolean);
  v.append(h('div', { class: 'row', style: { marginTop: '14px' } }, h('button', { class: 'btn', disabled: !wr.length, onclick: () => startPractice(shuffle(wr), 'Repaso de errores') }, `Repasar mis errores (${wr.length})`), h('button', { class: 'btn', onclick: () => startPractice(shuffle(QUESTIONS.filter(q => q.d === 'd' && tp.includes(q.t))), 'Todas las de código') }, `Todas las de código (${nD})`)));
  if (DB.hist.length) {
    v.append(h('div', { class: 'sec-h' }, h('h2', {}, 'Tus últimos simulacros')));
    v.append(h('div', { class: 'tbl' }, h('table', {}, h('thead', {}, h('tr', {}, h('th', {}, 'Fecha'), h('th', {}, 'Formato'), h('th', {}, 'Resultado'), h('th', {}, 'Tiempo'))), h('tbody', {}, DB.hist.map(x => h('tr', {}, h('td', {}, new Date(x.d).toLocaleString('es-AR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })), h('td', {}, (x.k === '40' ? '40 rápidas' : '10 difíciles') + (x.u ? ' · ' + ({ both: 'IV+V', '4': 'IV', '5': 'V' })[x.u] : '')), h('td', { class: 'mono' }, `${x.ok}/${x.n} · ${Math.round(x.ok / x.n * 100)}%`), h('td', { class: 'mono' }, `${Math.floor(x.s / 60)}:${String(x.s % 60).padStart(2, '0')}`)))))));
  }
}

function projView() {
  const v = view();
  v.append(h('div', { class: 'sec-h', style: { marginTop: 0 } }, h('h1', { style: { fontSize: 'var(--step-4)', fontWeight: 800 } }, 'Proyectos para comprobar si sabés')));
  v.append(h('p', { style: { marginBottom: '18px', maxWidth: '72ch' } }, 'Ordenados por dificultad. Cada uno tiene requisitos (tildalos a medida que los cumplís) y pruebas de fuego: situaciones que solo pasás si entendiste el tema de verdad. Si te trabás, los chips te llevan a la lección que tenés que repasar.'));
  v.append(h('div', { class: 'projs' }, PROJECTS.map((p, pi) => {
    const done = DB.proj[p.id] = DB.proj[p.id] || [];
    const pct = h('span', { class: 'pct' });
    const upd = () => pct.textContent = `${done.length}/${p.reqs.length}`;
    const checks = h('div', { class: 'checks' }, p.reqs.map((r, i) => { const cb = h('input', { type: 'checkbox', id: `pj-${p.id}-${i}`, checked: done.includes(i) }); const lab = h('label', { for: `pj-${p.id}-${i}`, class: done.includes(i) ? 'done' : '' }, cb, h('span', { html: fmt(r) })); cb.addEventListener('change', () => { const k = done.indexOf(i); if (cb.checked && k < 0) done.push(i); if (!cb.checked && k >= 0) done.splice(k, 1); lab.classList.toggle('done', cb.checked); save(); upd(); }); return lab; }));
    upd();
    return h('details', { class: 'proj', open: pi === 1 },
      h('summary', {}, h('span', { class: 'lvl', title: 'Dificultad ' + p.lvl + ' de 4' }, [1, 2, 3, 4].map(k => h('i', { class: k <= p.lvl ? 'f' : '' })), ' ' + p.time), h('div', {}, h('h3', {}, p.name), h('p', { class: 'pitch' }, p.pitch)), pct),
      h('div', { class: 'body' }, h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px', minWidth: 0 } }, h('span', { class: 'lbl' }, 'Requisitos'), checks),
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px', minWidth: 0 } }, h('div', { class: 'fire' }, h('span', { class: 'lbl' }, 'Pruebas de fuego'), h('ul', {}, p.tests.map(t => h('li', { html: fmt(t) })))), h('div', {}, h('span', { class: 'lbl' }, 'Temas que pone a prueba'), h('div', { class: 'row', style: { marginTop: '6px' } }, p.mods.map(id => h('a', { class: 'chip', href: '#/' + (TOPIC_LESSON[id] || 'react-componentes-jsx') }, TOPICS[id] || 'React')))))));
  })));
}

const VIEWS = { simulacro: ['Simulacro', simView], proyectos: ['Proyectos', projView] };
// Dibuja una vista propia (#/simulacro, #/proyectos); devuelve false si la ruta no es nuestra
function render(id) {
  const v = VIEWS[id];
  document.body.classList.toggle('exam-on', id === 'simulacro' && !!activeExam);
  if (!v) return false;
  document.title = `${v[0]} · Fronteando Ando`;
  v[1]();
  document.body.classList.toggle('exam-on', id === 'simulacro' && !!activeExam);
  return true;
}

window.FX = { render, mountLesson, intro, homeExtras, cleanup, views: Object.keys(VIEWS) };
})();
