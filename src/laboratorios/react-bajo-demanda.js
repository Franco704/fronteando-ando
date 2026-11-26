/* React y Babel se cargan solo cuando un laboratorio o la consola los necesita (≈3 MB). */
import { h } from '../nucleo/dom.js';

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


export { ensureReact, ensureBabel, mountReact, ReactRoots };
