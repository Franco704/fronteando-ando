/* Motor de preguntas: práctica (corrige al responder) y examen (con tiempo, corrige al entregar).
   En cada pregunta o[0] es la correcta; las opciones se mezclan al mostrarse. Teclas 1–4 para responder. */
import { $, h, shuffle, RM } from '../nucleo/dom.js';
import { hl, fmt } from '../ui/codigo.js';
import { Konsole } from '../consola/consola.js';
import { ReactRoots } from '../laboratorios/react-bajo-demanda.js';
import { QUESTIONS } from '../banco/indice.js';
import { TOPICS, TOPIC_LESSON, unitTopics } from '../banco/temas.js';
import { DB, save, record } from './progreso.js';

// Navega a una ruta de la guía; si ya estamos ahí, la vuelve a dibujar
export function go(r) { if (location.hash === '#/' + r) window.dispatchEvent(new HashChangeEvent('hashchange')); else location.hash = '#/' + r; }
// Vista de práctica a todo el ancho del contenido
export function view() {
  cleanup();
  const v = h('div', { class: 'fx' });
  $('#principal').replaceChildren(h('article', { class: 'lesson wide' }, v));
  return v;
}
// Al salir de una vista: corta el examen en curso (si es un modelo fijo) y desmonta los laboratorios con React
export function cleanup() { if (activeModel) { activeModel.onExit = null; activeModel.exit(); activeModel = null; } document.body.classList.remove('exam-on'); ReactRoots.splice(0).forEach(r => { try { r.unmount(); } catch (e) {} }); }
let activeExam = null, lastFinished = null, activeModel = null;
class Quiz {
  constructor(root, o) { Object.assign(this, { root, mode: 'practice', timeMin: 0, title: '', inline: false, onExit: null }, o); this.i = 0; this.ans = {}; this.opts = {}; this.locked = {}; this.list.forEach(q => this.opts[q.id] = shuffle(q.o)); this.t0 = Date.now(); this.finished = false; this.key = this.key.bind(this); }
  start() {
    if (this.timeMin) { this.end = Date.now() + this.timeMin * 60000; this.tick = setInterval(() => this.updTimer(), 250); }
    document.addEventListener('keydown', this.key); this.render();
  }
  attach(root) { this.root = root; document.addEventListener('keydown', this.key); this.render(); }
  key(e) {
    if (this.finished) return;
    if (!this.root || !this.root.isConnected) { document.removeEventListener('keydown', this.key); return; }
    if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    if (document.querySelector('.inter')) return;
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= 4) { const q = this.list[this.i]; const t = this.opts[q.id][n - 1]; if (t !== undefined) { e.preventDefault(); this.choose(t); } }
    else if (e.key === 'Enter' && this.mode === 'practice' && this.locked[this.list[this.i].id]) { e.preventDefault(); this.next(); }
    else if (e.key === 'ArrowRight' && this.mode === 'exam') this.go(this.i + 1);
    else if (e.key === 'ArrowLeft' && this.mode === 'exam') this.go(this.i - 1);
  }
  updTimer() {
    if (!this.timerEl) return;
    const left = Math.max(0, this.end - Date.now());
    const m = Math.floor(left / 60000), s = Math.floor(left / 1000) % 60;
    this.timerEl.textContent = `${m}:${String(s).padStart(2, '0')}`;
    this.timerEl.classList.toggle('low', left < 60000);
    if (left <= 0) this.finish(true);
  }
  go(i) { if (i < 0 || i >= this.list.length) return; this.i = i; this.render(); }
  next() { if (this.i < this.list.length - 1) { this.i++; this.render(); } else this.finish(); }
  choose(t) {
    const q = this.list[this.i];
    if (this.mode === 'practice') {
      if (this.locked[q.id]) return;
      this.locked[q.id] = true; this.ans[q.id] = t; record(q, t === q.o[0]); this.render();
    } else {
      this.ans[q.id] = t; this.render();
      clearTimeout(this.adv);
      this.adv = setTimeout(() => { const nx = this.list.findIndex((qq, k) => k > this.i && !(qq.id in this.ans)); if (nx >= 0) this.go(nx); else if (this.i < this.list.length - 1) this.go(this.i + 1); }, RM ? 0 : 260);
    }
  }
  render() {
    if (!this.root || this.finished) return;
    const q = this.list[this.i], total = this.list.length, answered = Object.keys(this.ans).length;
    const top = h('div', { class: 'q-top' }, h('span', { class: 'q-n' }, `${this.i + 1} / ${total}`), h('div', { class: 'q-prog' }, h('i', { style: { width: (this.mode === 'exam' ? answered / total : (this.i + (this.locked[q.id] ? 1 : 0)) / total) * 100 + '%' } })));
    if (this.timeMin) { this.timerEl = h('span', { class: 'timer', 'aria-label': 'Tiempo restante' }); top.append(this.timerEl); this.updTimer(); }
    if (!this.inline) top.append(h('button', { class: 'btn ghost sm', onclick: () => this.exit() }, this.mode === 'exam' ? 'Abandonar' : 'Salir'));
    const card = h('div', { class: 'q-card' });
    card.append(h('div', { class: 'q-meta' }, h('span', { class: 'pill ' + (q.d === 'd' ? 'hard' : 'easy') }, q.d === 'd' ? 'código' : 'rápida'), h('span', { class: 'lbl' }, TOPICS[q.t])));
    card.append(h('div', { class: 'q-text', html: fmt(q.q) }));
    if (q.c) card.append(h('div', { class: 'codeblk' }, h('pre', { class: 'code', html: hl(q.c, q.l) })));
    const locked = this.locked[q.id];
    const opts = h('div', { class: 'opts', role: 'group', 'aria-label': 'Opciones' });
    this.opts[q.id].forEach((t, k) => {
      let cls = 'opt';
      if (this.mode === 'exam' && this.ans[q.id] === t) cls += ' sel';
      if (locked) { if (t === q.o[0]) cls += ' right'; else if (this.ans[q.id] === t) cls += ' wrong'; }
      opts.append(h('button', { class: cls, disabled: !!locked, onclick: () => this.choose(t) }, h('span', { class: 'k' }, k + 1), h('span', { class: 't', html: fmt(t) })));
    });
    card.append(opts);
    if (locked) {
      const ok = this.ans[q.id] === q.o[0];
      const ex = h('div', { class: 'q-exp ' + (ok ? 'ok' : 'bad') }, h('b', { class: 'v' }, ok ? '✔ Correcto' : '✘ Incorrecto'));
      if (q.e) ex.append(h('div', { html: fmt(q.e) }));
      const r = h('div', { class: 'row' });
      if (q.run) r.append(h('button', { class: 'btn sm', onclick: () => Konsole.open(q.c, true, q.run === 'r' ? 'react' : 'js') }, q.run === 'r' ? '▶ Ejecutarlo en React' : '▶ Ejecutarlo de verdad'));
      const lid = TOPIC_LESSON[q.t];
      if (lid && !this.inline) r.append(h('a', { class: 'btn ghost sm', href: '#/' + lid }, 'Repasar la lección'));
      if (r.children.length) ex.append(r);
      card.append(ex);
    }
    const act = h('div', { class: 'q-actions' });
    if (this.mode === 'practice') {
      act.append(h('span', { class: 'kbd-hint' }, 'Teclas 1–4 para responder · Enter para seguir'));
      if (locked) act.append(h('button', { class: 'btn primary', onclick: () => this.next() }, this.i < total - 1 ? 'Siguiente →' : 'Ver resultado'));
    } else {
      const nav = h('div', { class: 'q-nav' }, this.list.map((qq, k) => h('button', { class: (qq.id in this.ans ? 'ans' : '') + (k === this.i ? ' cur' : ''), onclick: () => this.go(k), 'aria-label': 'Pregunta ' + (k + 1) }, k + 1)));
      const left = total - answered;
      const conf = h('div', { class: 'row' });
      const deliver = h('button', { class: 'btn primary', onclick: () => {
        if (left === 0) return this.finish();
        conf.replaceChildren(h('span', { class: 'msg warn' }, `Te faltan ${left}. ¿Entregás igual?`), h('button', { class: 'btn sm primary', onclick: () => this.finish() }, 'Entregar'), h('button', { class: 'btn sm', onclick: () => conf.replaceChildren() }, 'Seguir'));
      } }, 'Entregar');
      act.append(nav, h('div', { class: 'row' }, h('button', { class: 'btn sm', onclick: () => this.go(this.i - 1), disabled: this.i === 0 }, '←'), h('button', { class: 'btn sm', onclick: () => this.go(this.i + 1), disabled: this.i === total - 1 }, '→'), deliver), conf);
    }
    const wrap = h('div', { class: 'quiz' }, top, card, act);
    if (this.mode === 'exam') wrap.append(h('span', { class: 'kbd-hint' }, 'Teclas 1–4 para responder · ← → para moverte'));
    this.root.replaceChildren(wrap);
  }
  finish(timeout) {
    if (this.finished) return; this.finished = true;
    if (this.mode === 'exam') document.body.classList.remove('exam-on');
    clearInterval(this.tick); clearTimeout(this.adv); document.removeEventListener('keydown', this.key);
    if (this.mode === 'exam') {
      this.list.forEach(q => { if (q.id in this.ans) record(q, this.ans[q.id] === q.o[0]); else if (!DB.wrong.includes(q.id)) { DB.wrong.push(q.id); } });
      const ok = this.list.filter(q => this.ans[q.id] === q.o[0]).length;
      DB.hist.unshift({ d: Date.now(), k: this.kind, u: this.unit, ok, n: this.list.length, s: Math.round((Date.now() - this.t0) / 1000) }); DB.hist = DB.hist.slice(0, 8); save();
    }
    if (activeExam === this) activeExam = null;
    if (!this.root || !this.root.isConnected) { lastFinished = this; this.timedOut = timeout; return; }
    this.results(timeout);
  }
  results(timeout) {
    const n = this.list.length, ok = this.list.filter(q => this.ans[q.id] === q.o[0]).length, pct = Math.round(ok / n * 100);
    const C = 2 * Math.PI * 52;
    const ring = h('div', { html: `<svg class="ring" viewBox="0 0 130 130"><circle class="bg" cx="65" cy="65" r="52"/><circle class="fg" cx="65" cy="65" r="52" stroke-dasharray="${C}" stroke-dashoffset="${C}"/><text x="65" y="74" text-anchor="middle">${pct}%</text></svg>` });
    requestAnimationFrame(() => requestAnimationFrame(() => { const fg = ring.querySelector('.fg'); if (fg) fg.style.strokeDashoffset = C * (1 - pct / 100); }));
    const by = {};
    this.list.forEach(q => { const b = by[q.t] = by[q.t] || { n: 0, ok: 0 }; b.n++; if (this.ans[q.id] === q.o[0]) b.ok++; });
    const bars = h('div', { class: 'bars' }, Object.entries(by).map(([t, b]) => { const p = b.ok / b.n; return h('div', { class: 'bar-r' }, h('span', {}, TOPICS[t]), h('div', { class: 'tr' }, h('i', { class: p < .5 ? 'lo' : p < .8 ? 'mid' : 'hi', style: { width: p * 100 + '%' } })), h('span', {}, `${b.ok}/${b.n}`)); }));
    const secs = Math.round((Date.now() - this.t0) / 1000);
    const headTxt = h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px', minWidth: 0 } },
      h('h2', { style: { fontSize: '28px' } }, `${ok} de ${n} correctas`),
      h('p', { class: 'muted' }, (timeout ? 'Se terminó el tiempo. ' : '') + `Tiempo usado: ${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}` + (this.mode === 'exam' ? '' : ' · modo práctica')), bars);
    const showAll = h('input', { type: 'checkbox', id: 'rev-all' });
    const rev = h('div', { class: 'review' });
    const drawRev = () => {
      rev.replaceChildren(...this.list.filter(q => showAll.checked || this.ans[q.id] !== q.o[0]).map(q => {
        const ok = this.ans[q.id] === q.o[0];
        return h('div', { class: 'rev' + (ok ? ' okk' : '') }, h('div', { class: 'q-meta' }, h('span', { class: 'lbl' }, TOPICS[q.t])), h('div', { class: 'q-text', style: { fontSize: '16.5px' }, html: fmt(q.q) }), q.c ? h('div', { class: 'codeblk' }, h('pre', { class: 'code small', html: hl(q.c, q.l) })) : null,
          ok ? null : h('div', { class: 'yours', html: 'Tu respuesta: ' + (q.id in this.ans ? fmt(this.ans[q.id]) : '<i>sin responder</i>') }),
          h('div', { class: 'corr', html: 'Correcta: ' + fmt(q.o[0]) }), q.e ? h('div', { class: 'muted', style: { fontSize: '14.5px' }, html: fmt(q.e) }) : null,
          q.run ? h('div', {}, h('button', { class: 'btn sm', onclick: () => Konsole.open(q.c, true, q.run === 'r' ? 'react' : 'js') }, '▶ Ejecutarlo')) : null);
      }));
      if (!rev.children.length) rev.append(h('div', { class: 'msg ok' }, 'Sin errores. Impecable.'));
    };
    showAll.addEventListener('change', drawRev); drawRev();
    const wrong = this.list.filter(q => this.ans[q.id] !== q.o[0]);
    const btns = h('div', { class: 'row' });
    if (wrong.length) btns.append(h('button', { class: 'btn primary', onclick: () => startPractice(shuffle(wrong), 'Repaso de este intento', this.inline ? this.root : null, this.back) }, `Practicar mis ${wrong.length} errores`));
    if (!this.inline) btns.append(h('button', { class: 'btn', onclick: () => this.exit() }, 'Volver'));
    else btns.append(h('button', { class: 'btn', onclick: () => { const q = new Quiz(this.root, { list: shuffle(this.list), mode: 'practice', inline: true }); q.start(); } }, 'Otra vuelta'));
    this.root.replaceChildren(h('div', { class: 'quiz' }, h('div', { class: 'res-head' }, ring, headTxt), btns, h('div', { class: 'sec-h', style: { margin: '10px 0 0' } }, h('h2', { style: { fontSize: '20px' } }, 'Revisión'), h('label', { class: 'row', style: { fontSize: '14px' } }, showAll, ' mostrar también las correctas')), rev));
    if (!this.inline) window.scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' });
  }
  exit() { this.finished = true; clearInterval(this.tick); clearTimeout(this.adv); document.removeEventListener('keydown', this.key); if (activeExam === this) activeExam = null; if (this.onExit) this.onExit(); }
}
function pickBalanced(pool, n) {
  const by = {}; shuffle(pool).forEach(q => (by[q.t] = by[q.t] || []).push(q));
  const keys = shuffle(Object.keys(by)), out = [];
  while (out.length < n && keys.some(k => by[k].length)) for (const k of keys) { if (by[k].length && out.length < n) out.push(by[k].pop()); }
  return shuffle(out);
}
function startExam(kind) {
  const topics = unitTopics(DB.set.unit);
  const pool = QUESTIONS.filter(q => topics.includes(q.t) && q.d === (kind === '40' ? 'f' : 'd'));
  const list = pickBalanced(pool, kind === '40' ? 40 : 10);
  activeExam = new Quiz(null, { list, mode: 'exam', timeMin: kind === '40' ? DB.set.t40 : DB.set.t10, kind, unit: DB.set.unit, onExit: () => { go('simulacro'); } });
  activeExam.started = false;
  go('simulacro');
}
function startPractice(list, title, inlineRoot, back) {
  if (inlineRoot) { const q = new Quiz(inlineRoot, { list, mode: 'practice', inline: true }); q.start(); return; }
  const v = view();
  v.append(h('div', { class: 'sec-h', style: { marginTop: 0 } }, h('h2', {}, title)));
  const box = h('div'); v.append(box);
  back = back || 'simulacro';
  const q = new Quiz(box, { list, mode: 'practice', back, onExit: () => { go(back); } }); q.start();
  window.scrollTo(0, 0);
}


// El simulacro sigue corriendo aunque se navegue a otra parte; al volver se retoma o se ven los resultados
export const examenActivo = () => activeExam;
export function tomarTerminado() { const q = lastFinished; lastFinished = null; return q; }

// Examen fijo (modelo de parcial, Moyano o un bloque de diapositivas): el orden de las preguntas se mantiene
export function startModel(m, back = 'parciales') {
  const v = view();
  const box = h('div'); v.append(box);
  activeModel = new Quiz(box, { list: m.qs, mode: 'exam', timeMin: m.min, kind: m.name, back, onExit: () => { activeModel = null; go(back); } });
  document.body.classList.add('exam-on');
  activeModel.start();
  window.scrollTo(0, 0);
}

export { Quiz, startExam, startPractice };
