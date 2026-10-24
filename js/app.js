/* Motor de la guía: índice, rutas por hash, progreso, laboratorios y ejercicios. */
(() => {
  const { MODULES, LESSONS } = window.GUIDE;
  const $ = (s, el = document) => el.querySelector(s);
  // Guías hermanas: página publicada y repositorio de cada una
  const SIBLINGS = [
    ['Backeando Ando', 'Desarrollo de software backend (C#, ASP.NET, EF Core)', 'backeando-ando'],
    ['Diseñando Ando', 'Diseño de Sistemas de Información (UML, GRASP, GoF)', 'disenando-ando'],
    ['Iterando Ando', 'Matemática Superior (Laplace, métodos numéricos, Fourier)', 'iterando-ando'],
    ['Economizar', 'Economía (micro y macro con gráficas)', 'economizar'],
    ['Modulando Ando', 'Comunicación de Datos (señales, Shannon, errores, modulación)', 'modulando-ando'],
    ['Probando Ando', 'Probabilidad y Estadística (Bayes, distribuciones, intervalos, tests)', 'probando-ando'],
  ];
  const main = $('#lesson');
  const toc = $('#toc');
  const sidebar = $('#sidebar');
  const scrim = $('#scrim');
  const menuBtn = $('#menuBtn');

  // ---------- Almacenamiento (puede fallar en modo privado) ----------
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  };
  let done = new Set(store.get('fa-done', []));

  // ---------- Resaltado de sintaxis mínimo ----------
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
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
  function highlight(code, lang) {
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
  window.GUIDE.highlight = highlight;

  // Bloques de código: resaltado + botón copiar
  function enhanceCode(root) {
    root.querySelectorAll('pre.code:not([data-ready])').forEach((pre) => {
      const src = pre.textContent;
      pre.dataset.ready = '1';
      pre.innerHTML = highlight(src, pre.dataset.lang);
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

  // ---------- Índice ----------
  function renderToc(filter = '') {
    const q = filter.trim().toLowerCase();
    let html = q ? '' : `<section class="toc-module"><h2>Práctica</h2><ol>
      <li><a class="toc-link" href="#/simulacro" data-id="simulacro"><span class="n">✓</span><span>Simulacro de parcial</span></a></li>
      <li><a class="toc-link" href="#/proyectos" data-id="proyectos"><span class="n">★</span><span>Proyectos</span></a></li></ol></section>`;
    let n = 0;
    for (const mod of MODULES) {
      const items = LESSONS.map((l, i) => ({ l, i })).filter(({ l }) => l.module === mod.id);
      const visible = items.filter(({ l }) => !q || (l.title + ' ' + (l.keywords || '')).toLowerCase().includes(q));
      n += visible.length;
      if (!visible.length) continue;
      html += `<section class="toc-module"><h2>${mod.title}</h2><ol>`;
      for (const { l, i } of visible) {
        html += `<li><a class="toc-link${done.has(l.id) ? ' is-done' : ''}" href="#/${l.id}" data-id="${l.id}">
          <span class="n">${String(i + 1).padStart(2, '0')}</span><span>${l.title}</span><span class="done" aria-label="${done.has(l.id) ? 'Completada' : ''}"></span></a></li>`;
      }
      html += `</ol></section>`;
    }
    toc.innerHTML = n ? html : `<p class="toc-empty">No hay lecciones con “${esc(filter)}”. Probá con otra palabra.</p>`;
    markCurrent();
  }
  function markCurrent() {
    const id = currentId();
    toc.querySelectorAll('.toc-link').forEach((a) => {
      if (a.dataset.id === id) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }
  function updateProgress() {
    const total = LESSONS.length;
    const count = LESSONS.filter((l) => done.has(l.id)).length;
    $('#progressFill').style.width = `${(count / total) * 100}%`;
    $('#progressText').textContent = `${count} de ${total}`;
  }

  // ---------- Rutas ----------
  const currentId = () => location.hash.replace(/^#\/?/, '');

  let firstLoad = true;
  async function route() {
    const id = currentId();
    const idx = LESSONS.findIndex((l) => l.id === id);
    // Al cambiar de tema se muestra una animación de entrada (en la primera carga solo se registra)
    if (idx !== -1) { await FX.intro(id, firstLoad); if (currentId() !== id) return; }
    firstLoad = false;
    FX.cleanup();
    if (idx !== -1) renderLesson(idx);
    else if (!FX.render(id)) renderHome();
    markCurrent();
    closeMenu();
    window.scrollTo(0, 0);
    main.focus({ preventScroll: true });
  }

  function renderHome() {
    document.title = 'Fronteando Ando';
    const cards = MODULES.map((m) => {
      const l = LESSONS.find((x) => x.module === m.id);
      const count = LESSONS.filter((x) => x.module === m.id).length;
      return `<a href="#/${l.id}"><b>${m.title}</b><span>${count} lecciones: ${m.blurb}</span></a>`;
    }).join('');
    const resume = LESSONS.find((l) => !done.has(l.id)) || LESSONS[0];
    const nEx = LESSONS.reduce((a, l) => a + (l.exercises?.length || 0), 0);
    const nLabs = LESSONS.reduce((a, l) => a + (l.labs?.length || 0), 0);
    main.innerHTML = `
      <article class="lesson home">
        <p class="crumb">Desarrollo de Software, Unidades 4 y 5</p>
        <h1>Frontend desde cero, una lección a la vez.</h1>
        <p class="lede">Del “¿qué pasa cuando escribo una URL?” hasta una app en React con rutas privadas. ${LESSONS.length} lecciones con la teoría desarrollada, ${nLabs} laboratorios donde editás código y ves el resultado al instante, y ${nEx} ejercicios con solución, incluidos todos los de la cátedra.</p>
        <a class="start-btn" href="#/${resume.id}">${done.size ? 'Seguir con' : 'Empezar con'} “${resume.title}”</a><button class="also-btn" type="button" data-act="also">También probá…</button>
        <div class="stack">${cards}</div>
        <div id="fxHome"></div>
        <section class="home-links">
          <h2 class="also-h" id="tambien">También probá:</h2>
          <ul class="also">${SIBLINGS.map(([n, d, slug]) => `<li><a class="also-main" href="https://franco704.github.io/${slug}/" target="_blank" rel="noopener"><b>${n}</b><span>${d}</span></a><a class="also-repo" href="https://github.com/Franco704/${slug}" target="_blank" rel="noopener" aria-label="Repositorio de ${n}">repositorio</a></li>`).join('')}</ul>
        </section>
        <div class="note"><p><strong>Cómo usar la guía.</strong> Avanzá en orden: cada tema usa lo anterior. Leé la teoría, tocá los laboratorios y recién después intentá los ejercicios sin mirar la solución. Marcá cada lección como completada para ver tu progreso. Moverte entre lecciones: <kbd>←</kbd> <kbd>→</kbd>.</p></div>
      </article>`;
    $('#fxHome').append(FX.homeExtras());
    $('[data-act="also"]', main).addEventListener('click', () => $('#tambien').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }));
  }

  function renderSources(l) {
    return (l.sources || []).map((s) => `
      <details class="source">
        <summary><span>${s.title}</span><span class="host">${new URL(s.url).hostname.replace('www.', '')}</span></summary>
        <div class="source-body">
          <ul>${s.points.map((p) => `<li>${p}</li>`).join('')}</ul>
          <p><a href="${s.url}" target="_blank" rel="noopener">Leer la fuente completa</a></p>
        </div>
      </details>`).join('');
  }

  const LEVEL = { 1: 'Básico', 2: 'Intermedio', 3: 'Desafío' };
  function renderExercises(l) {
    let practice = 0;
    return (l.exercises || []).map((ex, i) => {
      const sol = ex.solution;
      const files = (sol.files || []).map((f) => `
        <div class="sol-file">
          ${f.name ? `<p class="sol-name">${f.name}</p>` : ''}
          <pre class="code" data-lang="${f.lang}">${esc(f.code.trim())}</pre>
        </div>`).join('');
      const tag = ex.official ? `Ejercicio de la cátedra ${ex.official}` : `Práctica ${++practice}`;
      return `
        <article class="exercise${ex.official ? ' official' : ''}">
          <header class="ex-head">
            <span class="ex-tag">${tag}</span>
            ${ex.level ? `<span class="ex-level" data-level="${ex.level}">${LEVEL[ex.level]}</span>` : ''}
          </header>
          <h3>${ex.title}</h3>
          <div class="ex-prompt">${ex.prompt}</div>
          ${ex.hints ? `<details class="hint"><summary>Ver pista</summary><ul>${ex.hints.map((h) => `<li>${h}</li>`).join('')}</ul></details>` : ''}
          <details class="solution">
            <summary>Ver solución</summary>
            <div class="sol-body">
              ${sol.explain ? `<div class="sol-explain">${sol.explain}</div>` : ''}
              ${files}
              ${sol.run ? `<button class="lab-btn run-sol" type="button" data-ex="${i}">Probar la solución en un laboratorio</button><div class="sol-lab"></div>` : ''}
            </div>
          </details>
        </article>`;
    }).join('');
  }

  function renderLesson(idx) {
    const l = LESSONS[idx];
    const mod = MODULES.find((m) => m.id === l.module);
    const prev = LESSONS[idx - 1];
    const next = LESSONS[idx + 1];
    const labs = l.labs || [];
    document.title = `${l.title} · Fronteando Ando`;

    // Laboratorios no ubicados en el cuerpo se agregan al final de la teoría
    const placed = new Set([...l.body.matchAll(/data-lab="(\d+)"/g)].map((m) => +m[1]));
    const rest = labs.map((_, i) => i).filter((i) => !placed.has(i)).map((i) => `<div class="lab-mount" data-lab="${i}"></div>`).join('');
    const exercises = renderExercises(l);
    const sources = renderSources(l);

    main.innerHTML = `
      <article class="lesson">
        <div class="fx lesson-glyph" id="fxGlyph" aria-hidden="true"></div>
        <p class="crumb">Lección ${idx + 1} de ${LESSONS.length}, ${mod.title}</p>
        <h1>${l.title}</h1>
        <p class="tldr">${l.tldr}</p>
        ${l.goals ? `<div class="goals"><p>Al terminar vas a poder:</p><ul>${l.goals.map((g) => `<li>${g}</li>`).join('')}</ul></div>` : ''}
        <div class="body">${l.body}${rest}</div>
        <section id="fxLabs"></section>
        ${exercises ? `<section class="practice"><h2>Ejercicios</h2><p>Intentalos antes de abrir la solución. Equivocarse acá es gratis.</p>${exercises}</section>` : ''}
        <section id="fxQuiz" class="practice"></section>
        ${sources ? `<section class="sources"><h2>Bibliografía</h2><p>Resumen de cada fuente oficial. Abrí la que quieras profundizar.</p>${sources}</section>` : ''}
        <div class="done-row">
          <button class="done-btn" id="doneBtn" aria-pressed="${done.has(l.id)}">${done.has(l.id) ? 'Completada' : 'Marcar como completada'}</button>
          <span class="kbd-hint">Siguiente tema: <kbd>→</kbd></span>
        </div>
        <nav class="pager" aria-label="Lecciones">
          ${prev ? `<a class="prev" href="#/${prev.id}"><small>Anterior</small><strong>${prev.title}</strong></a>` : ''}
          ${next ? `<a class="next" href="#/${next.id}"><small>Siguiente</small><strong>${next.title}</strong></a>` : ''}
        </nav>
      </article>`;

    enhanceCode(main);
    main.querySelectorAll('.lab-mount').forEach((el) => {
      const lab = labs[+el.dataset.lab];
      if (lab) mountLab(el, lab);
    });
    main.querySelectorAll('.run-sol').forEach((btn) => btn.addEventListener('click', () => {
      const ex = l.exercises[+btn.dataset.ex];
      mountLab(btn.nextElementSibling, { title: 'solución', ...ex.solution.run });
      btn.remove();
    }));
    FX.mountLesson(l.id, main);

    $('#doneBtn').addEventListener('click', (e) => {
      done.has(l.id) ? done.delete(l.id) : done.add(l.id);
      store.set('fa-done', [...done]);
      const on = done.has(l.id);
      e.currentTarget.setAttribute('aria-pressed', on);
      e.currentTarget.textContent = on ? 'Completada' : 'Marcar como completada';
      renderToc($('#search').value);
      updateProgress();
    });
  }

  // ---------- Laboratorio ----------
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

  // ---------- Menú móvil ----------
  function openMenu() { sidebar.classList.add('open'); scrim.hidden = false; menuBtn.setAttribute('aria-expanded', 'true'); }
  function closeMenu() { sidebar.classList.remove('open'); scrim.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); }
  menuBtn.addEventListener('click', () => (sidebar.classList.contains('open') ? closeMenu() : openMenu()));
  scrim.addEventListener('click', closeMenu);

  // ---------- Tema ----------
  $('#themeBtn').addEventListener('click', () => {
    const root = document.documentElement;
    const isDark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = isDark ? 'light' : 'dark';
    try { localStorage.setItem('fa-theme', root.dataset.theme); } catch {}
  });

  // ---------- Teclado ----------
  document.addEventListener('keydown', (e) => {
    if (e.target.closest('input, textarea, select') || e.altKey || e.ctrlKey || e.metaKey) return;
    const idx = LESSONS.findIndex((l) => l.id === currentId());
    if (idx === -1 && currentId()) return; // en simulacro/proyectos las flechas son del quiz
    if (e.key === 'ArrowRight' && idx < LESSONS.length - 1) location.hash = `#/${LESSONS[idx + 1].id}`;
    if (e.key === 'ArrowLeft' && idx > 0) location.hash = `#/${LESSONS[idx - 1].id}`;
    if (e.key === 'Escape') closeMenu();
  });

  $('#search').addEventListener('input', (e) => renderToc(e.target.value));
  window.addEventListener('hashchange', route);
  renderToc();
  updateProgress();
  route();
})();
