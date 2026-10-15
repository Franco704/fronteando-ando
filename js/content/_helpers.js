/* Base del contenido: módulos, array de lecciones y ayudantes para escribir lecciones.
   Cada lección: { id, module, title, keywords, tldr, goals?, body, labs?, exercises?, sources? }
   - body puede incluir lab(i) para ubicar el laboratorio i dentro de la teoría.
   - exercises: { title, official?, level (1-3), prompt, hints?, solution: { explain, files, run? } } */
(() => {
  const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const code = (lang, src, name) => `${name ? `<p class="sol-name">${name}</p>` : ''}<pre class="code" data-lang="${lang}">${esc(src.trim())}</pre>`;
  const table = (head, rows) => `<div class="table-wrap"><table><thead><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const note = (html, kind = '') => `<div class="note ${kind}"><p>${html}</p></div>`;
  const lab = (i) => `<div class="lab-mount" data-lab="${i}"></div>`;
  const flow = (...steps) => `<div class="flow">${steps.map((s) => `<span>${s}</span>`).join('<i>→</i>')}</div>`;

  // Solución web: muestra los archivos y permite ejecutarla
  const webSol = (explain, f, opts = {}) => ({
    explain,
    files: [
      f.html !== undefined && { name: opts.htmlName || 'index.html', lang: 'html', code: f.html },
      f.css !== undefined && { name: opts.cssName || 'styles.css', lang: 'css', code: f.css },
      f.js !== undefined && { name: opts.jsName || 'app.js', lang: 'js', code: f.js },
    ].filter(Boolean),
    run: { mode: 'web', ...f, tailwind: opts.tailwind },
  });
  // Solución React: un App.jsx ejecutable (más archivos extra opcionales, solo para leer)
  const reactSol = (explain, jsx, opts = {}) => ({
    explain,
    files: [...(opts.extra || []), { name: opts.name || 'App.jsx', lang: 'jsx', code: jsx }, ...(opts.css ? [{ name: 'index.css', lang: 'css', code: opts.css }] : [])],
    run: opts.noRun ? undefined : { mode: 'react', jsx, css: opts.css, tailwind: opts.tailwind },
  });
  // Solución solo de lectura (proyecto de varios archivos)
  const filesSol = (explain, files) => ({ explain, files });

  const MODULES = [
    { id: 'web', title: 'Cómo funciona la web', blurb: 'internet, HTTP, renderizado' },
    { id: 'html', title: 'HTML', blurb: 'estructura y formularios' },
    { id: 'css', title: 'CSS', blurb: 'estilos, cajas, layout, responsive' },
    { id: 'js', title: 'JavaScript', blurb: 'lógica, DOM, datos, asincronía' },
    { id: 'tooling', title: 'Entorno moderno', blurb: 'módulos, Node, npm, Vite' },
    { id: 'react', title: 'React', blurb: 'componentes, hooks, rutas, APIs' },
  ];

  window.GUIDE = { MODULES, LESSONS: [], h: { esc, code, table, note, lab, flow, webSol, reactSol, filesSol } };
})();
