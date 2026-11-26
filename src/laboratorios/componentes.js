/* Componentes genéricos de los laboratorios visuales: rondas de preguntas, clasificador y caza de errores. */
import { $, $$, h, esc, shuffle, sleep, flip, RM } from '../nucleo/dom.js';
import { hl, fmt, codeBox } from '../ui/codigo.js';

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

export { rounds, classifier, bugHunt };
