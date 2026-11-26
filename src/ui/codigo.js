// Resaltado de sintaxis mínimo (JS/JSX, HTML, CSS, bash) y botón Copiar en los bloques de código.
import { h, esc } from '../nucleo/dom.js';
import { Konsole } from '../consola/consola.js';

const KW = 'const|let|var|function|return|if|else|for|while|of|in|new|class|extends|import|from|export|default|async|await|try|catch|finally|throw|typeof|null|undefined|true|false|this|switch|case|break';
const RULES = {
  js: new RegExp(`(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)|("(?:[^"\\\\\\n]|\\\\.)*"|'(?:[^'\\\\\\n]|\\\\.)*'|\`(?:[^\`\\\\]|\\\\.)*\`)|\\b(${KW})\\b|(<\\/?[A-Za-z][\\w.]*|\\/?>)|\\b(\\d+(?:\\.\\d+)?)\\b`, 'g'),
  html: /(<!--[\s\S]*?-->)|("[^"]*")|(<!DOCTYPE[^>]*>)|(<\/?[A-Za-z][\w-]*|\/?>)|(\s[\w:@-]+(?==))/g,
  css: /(\/\*[\s\S]*?\*\/)|("[^"]*"|'[^']*')|(@[\w-]+)|([.#]?[\w-]+(?=\s*[{,]))|(\b\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw|dvh|fr|s)?\b)/g,
  bash: /(#[^\n]*)|("[^"]*"|'[^']*')|(\b(?:npm|npx|cd|git|node|mkdir)\b)/g,
};
const CLASS = {
  js: ['tok-c', 'tok-s', 'tok-k', 'tok-t', 'tok-n'],
  html: ['tok-c', 'tok-s', 'tok-k', 'tok-t', 'tok-a'],
  css: ['tok-c', 'tok-s', 'tok-k', 'tok-t', 'tok-n'],
  bash: ['tok-c', 'tok-s', 'tok-k'],
};
export function resaltar(code, lang) {
  const key = lang === 'jsx' || lang === 'json' ? 'js' : lang;
  const re = RULES[key];
  if (!re) return esc(code);
  let out = '', last = 0;
  re.lastIndex = 0;
  for (const m of code.matchAll(re)) {
    out += esc(code.slice(last, m.index));
    const g = m.slice(1).findIndex((x) => x !== undefined);
    out += `<span class="${CLASS[key][g]}">${esc(m[0])}</span>`;
    last = m.index + m[0].length;
  }
  return out + esc(code.slice(last));
}

// Bloques de código: resaltado + botón copiar
export function mejorarCodigo(root) {
  root.querySelectorAll('pre.code:not([data-ready])').forEach((pre) => {
    const src = pre.textContent;
    pre.dataset.ready = '1';
    pre.innerHTML = resaltar(src, pre.dataset.lang);
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.type = 'button';
    btn.textContent = 'Copiar';
    btn.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(src); btn.textContent = 'Copiado'; }
      catch { btn.textContent = 'No se pudo copiar'; }
      setTimeout(() => (btn.textContent = 'Copiar'), 1500);
    });
    pre.appendChild(btn);
  });
}

// Lo que usan los laboratorios visuales y el banco: resaltado, `código` en línea y bloque con barra
export function hl(code, lang) { return lang === 'tree' || lang === 'text' ? esc(code) : resaltar(String(code), lang === 'json' ? 'js' : lang); }
export function fmt(t) { return esc(t).replace(/`([^`]+)`/g, '<code>$1</code>'); }
export function codeBox(code, lang, cap, run) {
  const pre = h('pre', { class: 'code', html: hl(code, lang) });
  const LBL = { html: 'HTML', css: 'CSS', jsx: 'JSX', json: 'JSON', bash: 'Terminal', tree: 'Carpetas', js: 'JS' };
  const bar = h('div', { class: 'bar' }, h('span', { class: 'cap' }, cap || ''), run ? h('button', { class: 'btn sm', onclick: () => Konsole.open(code, true, run === 'r' ? 'react' : 'js') }, run === 'r' ? '▶ Probalo en React' : '▶ Probalo') : h('span', { class: 'lbl' }, LBL[lang] || 'JS'));
  return h('div', { class: 'codeblk' }, bar, pre);
}
