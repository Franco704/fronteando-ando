// Utilidades mínimas de DOM y texto que usan todas las vistas y los laboratorios.
export const $ = (s, el = document) => el.querySelector(s);
export const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
export const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export const norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
export const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
export const sinMovimiento = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
// Se lee una vez al cargar, como en el laboratorio original
export const RM = sinMovimiento();
export const sleep = (ms) => new Promise((r) => setTimeout(r, RM ? 0 : ms));
export const irA = (el) => el?.scrollIntoView({ behavior: sinMovimiento() ? 'auto' : 'smooth' });

// h('div', { class, html, text, style: {}, onclick, atributo }, ...hijos)
export function h(tag, props, ...kids) {
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

// FLIP: anima los hijos de root entre dos disposiciones
export function flip(root, mutate) {
  const kids = Array.from(root.children);
  const first = new Map(kids.map((k) => [k, k.getBoundingClientRect()]));
  mutate();
  if (RM) return;
  kids.forEach((k) => {
    const a = first.get(k), b = k.getBoundingClientRect();
    if (!a) return;
    const dx = a.left - b.left, dy = a.top - b.top, sx = a.width / (b.width || 1), sy = a.height / (b.height || 1);
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && Math.abs(sx - 1) < .01 && Math.abs(sy - 1) < .01) return;
    k.animate([{ transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, transformOrigin: 'top left' }, { transform: 'none', transformOrigin: 'top left' }], { duration: 450, easing: 'cubic-bezier(.2,.8,.2,1)' });
  });
}

// Capa .fx en el body para lo que flota sobre la página (consola, pantalla de entrada)
let capa;
export function fxHost() { if (!capa) { capa = h('div', { class: 'fx fx-capa' }); document.body.append(capa); } return capa; }
