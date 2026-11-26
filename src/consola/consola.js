/* Consola JS y playground de React: ejecuta código suelto en un sandbox y muestra la salida. */
import { $, $$, h, fxHost } from '../nucleo/dom.js';
import { ensureReact, ensureBabel } from '../laboratorios/react-bajo-demanda.js';

// Se crea recién al montarla: registra oyentes de errores y agrega el botón flotante.
function crearConsola() {
  let abridor, root, ta, out, prevBox, prev, title, modeBtns, gen = 0, timers = [], lastRun = 0, mode = 'js', rroot = null, lastErrMsg = '', lastErrT = 0;
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
    abridor = document.activeElement; root.hidden = false; fab.hidden = true;
    if (code != null) { ta.value = code; out.replaceChildren(); unmountPreview(); }
    if (autorun) run(); else ta.focus();
  }
  function close() { if (root) root.hidden = true; fab.hidden = false; abridor?.focus(); gen++; clearTimers(); unmountPreview(); }
  const fab = h('button', { class: 'btn primary con-fab', type: 'button', onclick: () => open(null, false) }, '> Consola');
  fxHost().append(fab);
  return { open, close, fmtVal, get mode() { return mode; } };
}

let consola;
export const montarConsola = () => (consola ||= crearConsola());
export const Konsole = { open: (...a) => montarConsola().open(...a), close: () => consola?.close() };
