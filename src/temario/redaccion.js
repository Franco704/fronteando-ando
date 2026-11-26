/* Ayudantes para escribir lecciones (los mismos de la versión anterior, para que el HTML generado no cambie).
 Cada lección: { id, module, title, keywords, tldr, goals?, body, labs?, exercises?, sources? }
 - body puede incluir lab(i) para ubicar el laboratorio i dentro de la teoría.
 - labs: [{ title, mode: 'web' | 'react', html?, css?, js?, jsx?, tailwind?, hint? }] (editor en vivo, src/laboratorios/editor.js)
 - exercises: { title, official?, level (1-3), prompt, hints?, solution: { explain, files, run? } }
 - sources: [{ title, url, points: [] }] */
export const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
export const code = (lang, src, name) => `${name ? `<p class="sol-name">${name}</p>` : ''}<pre class="code" data-lang="${lang}">${esc(src.trim())}</pre>`;
export const table = (head, rows) => `<div class="table-wrap"><table><thead><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
export const note = (html, kind = '') => `<div class="note ${kind}"><p>${html}</p></div>`;
export const lab = (i) => `<div class="lab-mount" data-lab="${i}"></div>`;
export const flow = (...steps) => `<div class="flow">${steps.map((s) => `<span>${s}</span>`).join('<i>→</i>')}</div>`;

// Solución web: muestra los archivos y permite ejecutarla
export const webSol = (explain, f, opts = {}) => ({
  explain,
  files: [
    f.html !== undefined && { name: opts.htmlName || 'index.html', lang: 'html', code: f.html },
    f.css !== undefined && { name: opts.cssName || 'styles.css', lang: 'css', code: f.css },
    f.js !== undefined && { name: opts.jsName || 'app.js', lang: 'js', code: f.js },
  ].filter(Boolean),
  run: { mode: 'web', ...f, tailwind: opts.tailwind },
});
// Solución React: un App.jsx ejecutable (más archivos extra opcionales, solo para leer)
export const reactSol = (explain, jsx, opts = {}) => ({
  explain,
  files: [...(opts.extra || []), { name: opts.name || 'App.jsx', lang: 'jsx', code: jsx }, ...(opts.css ? [{ name: 'index.css', lang: 'css', code: opts.css }] : [])],
  run: opts.noRun ? undefined : { mode: 'react', jsx, css: opts.css, tailwind: opts.tailwind },
});
// Solución solo de lectura (proyecto de varios archivos)
export const filesSol = (explain, files) => ({ explain, files });
