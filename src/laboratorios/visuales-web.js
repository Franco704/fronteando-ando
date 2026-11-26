/* Laboratorios visuales de la Unidad IV: la web, HTML, CSS y JavaScript.
   Traídos del "Laboratorio Frontend DSW" de Mateo Rusconi. Cada uno recibe la caja donde dibujarse. */
import { $, $$, h, esc, shuffle, sleep, flip, RM } from '../nucleo/dom.js';
import { hl, fmt, codeBox } from '../ui/codigo.js';
import { rounds, classifier, bugHunt } from './componentes.js';

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

export { LABS, anatomyBlock, specificity };
