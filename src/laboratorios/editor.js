/* Laboratorio con editor en vivo: pestañas HTML / CSS / JS (o App.jsx) y el resultado en un iframe aislado.
   React y las librerías del curso se cargan como módulos ES reales; JSX se compila con Babel dentro del iframe. */
import { esc } from '../nucleo/dom.js';

// React y las librerías del curso como módulos ES reales (mismas versiones que el proyecto de la cátedra)
const IMPORT_MAP = {
  imports: {
    react: 'https://esm.sh/react@19.1.1',
    'react/jsx-runtime': 'https://esm.sh/react@19.1.1/jsx-runtime',
    'react-dom': 'https://esm.sh/react-dom@19.1.1?external=react',
    'react-dom/client': 'https://esm.sh/react-dom@19.1.1/client?external=react',
    // En v7 react-router-dom solo reexporta react-router; apuntar ambos a la misma copia evita
    // dos instancias del contexto del router (el paquete de esm.sh de react-router-dom trae dos)
    'react-router-dom': 'https://esm.sh/react-router@7.9.4?external=react,react-dom',
    'react-router': 'https://esm.sh/react-router@7.9.4?external=react,react-dom',
    'react-router/dom': 'https://esm.sh/react-router@7.9.4/dom?external=react,react-dom,react-router',
    'react-hook-form': 'https://esm.sh/react-hook-form@7.65.0?external=react',
    axios: 'https://esm.sh/axios@1.13.2',
  },
};
const BABEL = `<script src="https://unpkg.com/@babel/standalone@7.26.4/babel.min.js"><\/script>
<script>Babel.registerPreset('jsx-auto', { presets: [[Babel.availablePresets.react, { runtime: 'automatic' }]] });<\/script>`;
const TAILWIND = `<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4.1.14"><\/script>`;

// Consola visible dentro del resultado: muestra console.log y errores
const CONSOLE_SHIM = `
<style>#__con{font:12px/1.5 ui-monospace,monospace;margin:12px 0 0;padding:8px 10px;background:#1d232c;color:#dbe2ea;border-radius:8px;white-space:pre-wrap;max-height:200px;overflow:auto}#__con:empty{display:none}#__con .e{color:#ff9b9b}#__con .w{color:#f5db6b}</style>
<script>
(function(){
function out(cls, args){
  var c=document.getElementById('__con');
  if(!c){c=document.createElement('pre');c.id='__con';(document.body||document.documentElement).appendChild(c);}
  var line=document.createElement('div'); if(cls) line.className=cls;
  line.textContent=Array.prototype.map.call(args,function(a){
    if(a instanceof Error) return a.name+': '+a.message;
    if(typeof a==='object'&&a!==null){try{return JSON.stringify(a,null,1)}catch(e){return String(a)}}
    return String(a);
  }).join(' ');
  c.appendChild(line);
}
var log=console.log, err=console.error, warn=console.warn;
console.log=function(){out('',arguments);log.apply(console,arguments)};
console.error=function(){out('e',arguments);err.apply(console,arguments)};
console.warn=function(){if(!/in-browser Babel/.test(arguments[0]))out('w',arguments);warn.apply(console,arguments)};
window.addEventListener('error',function(e){out('e',['Error: '+e.message])});
window.addEventListener('unhandledrejection',function(e){out('e',['Promesa rechazada: '+(e.reason&&e.reason.message||e.reason)])});
// En el laboratorio no hay otras páginas: los enlaces y redirecciones a .html se informan en vez de navegar
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href]');if(a&&/\\.html$/.test(a.getAttribute('href'))){e.preventDefault();out('w',['Navegarías a '+a.getAttribute('href')+' (en el laboratorio no hay otras páginas)']);}});
})();
<\/script>`;

function buildDoc(files, lab) {
  const css = files.css ? `<style>${files.css}</style>` : '';
  const base = `<style>body{font-family:system-ui,sans-serif;margin:16px;color:#1f2a2e}</style>`;
  const tw = lab.tailwind ? TAILWIND : '';
  if (lab.mode === 'react') {
    let src = files.jsx || '';
    // Se monta el componente del export default, se llame como se llame (App, LoginForm…)
    const main = (src.match(/export\s+default\s+(?:function\s+)?([A-Z]\w*)/) || [])[1] || 'App';
    src = src.replace(/^export\s+default\s+[A-Z]\w*;?\s*$/m, '').replace(/export\s+default\s+/g, '');
    // Si el código no monta la app, la montamos nosotros (como hace main.jsx en Vite)
    if (!/createRoot/.test(src)) src += `\nimport { createRoot as __createRoot } from 'react-dom/client';\n__createRoot(document.getElementById('root')).render(<${main} />);`;
    return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<script type="importmap">${JSON.stringify(IMPORT_MAP)}<\/script>${base}${tw}${css}${CONSOLE_SHIM}${BABEL}</head>
<body><div id="root"></div>
<script type="text/babel" data-type="module" data-presets="jsx-auto">${src}<\/script></body></html>`;
  }
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${base}${tw}${css}${CONSOLE_SHIM}</head>
<body>${files.html || ''}<script>${files.js || ''}<\/script></body></html>`;
}

function mountLab(el, lab) {
  const mode = lab.mode || 'web';
  const order = mode === 'react' ? ['jsx', 'css'] : ['html', 'css', 'js'];
  const names = { html: 'HTML', css: 'CSS', js: 'JS', jsx: 'App.jsx' };
  const keys = order.filter((k) => lab[k] !== undefined);
  const uid = Math.random().toString(36).slice(2, 7);

  el.innerHTML = `
    <section class="lab" aria-label="Laboratorio: ${esc(lab.title)}">
      <div class="lab-head">
        <span class="lab-title">Laboratorio: ${lab.title}</span>
        <div class="lab-tabs" role="tablist">
          ${keys.map((k, i) => `<button class="lab-tab" type="button" role="tab" id="t-${uid}-${k}" aria-controls="p-${uid}-${k}" aria-selected="${i === 0}" data-k="${k}">${names[k]}</button>`).join('')}
        </div>
        <button class="lab-btn" type="button" data-act="reset">Restaurar</button>
      </div>
      <div class="lab-body">
        <div class="lab-editor">
          ${keys.map((k, i) => `<textarea id="p-${uid}-${k}" role="tabpanel" aria-labelledby="t-${uid}-${k}" spellcheck="false" data-k="${k}" ${i ? 'hidden' : ''}></textarea>`).join('')}
        </div>
        <div class="lab-preview"><iframe title="Resultado del laboratorio" sandbox="allow-scripts allow-forms allow-modals"></iframe></div>
      </div>
      <p class="lab-hint">${lab.hint || 'Editá el código: el resultado se actualiza solo.'}</p>
    </section>`;

  const areas = [...el.querySelectorAll('textarea')];
  const iframe = el.querySelector('iframe');
  let t;
  const run = () => {
    const files = Object.fromEntries(areas.map((a) => [a.dataset.k, a.value]));
    iframe.srcdoc = buildDoc(files, { ...lab, mode });
  };
  const reset = () => { areas.forEach((a) => (a.value = lab[a.dataset.k].trim() + '\n')); run(); };
  areas.forEach((a) => {
    // React tarda más en compilar: esperamos un poco más antes de recargar
    a.addEventListener('input', () => { clearTimeout(t); t = setTimeout(run, mode === 'react' ? 700 : 400); });
    // Tab inserta sangría en lugar de salir del editor; Esc libera el foco
    a.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        a.setRangeText('  ', a.selectionStart, a.selectionEnd, 'end');
        a.dispatchEvent(new Event('input'));
      } else if (e.key === 'Escape') a.blur();
    });
  });
  el.querySelectorAll('.lab-tab').forEach((b) => b.addEventListener('click', () => {
    el.querySelectorAll('.lab-tab').forEach((x) => x.setAttribute('aria-selected', x === b));
    areas.forEach((a) => (a.hidden = a.dataset.k !== b.dataset.k));
  }));
  el.querySelector('[data-act="reset"]').addEventListener('click', reset);
  reset();
}

export { mountLab as montarEditor };
