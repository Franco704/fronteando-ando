// Videos de resumen (#/videos o #/videos/<lección>): uno por lección, de corrido, con salto a cada lección.
import { $ } from '../nucleo/dom.js';
import { LECCIONES, videoDe } from '../temario/indice.js';

const n2 = (i) => String(i + 1).padStart(2, '0');

export function vistaVideos(main, desde) {
  let cur = Math.max(LECCIONES.findIndex((l) => l.id === desde), 0);
  document.title = 'Videos de resumen, Fronteando Ando';
  main.innerHTML = `
    <article class="lesson videos">
      <h1>Videos de resumen</h1>
      <p class="tldr">Un video corto por lección. Se reproducen de corrido: cuando termina uno arranca el siguiente. Si algo no te cierra, abrí la lección de la que habla.</p>
      <div class="vid-player">
        <video controls playsinline preload="metadata"></video>
        <p class="vid-now"><span></span><a href="#/">Ir a la lección</a></p>
      </div>
      <label class="vid-auto"><input type="checkbox" checked /> Reproducir el siguiente automáticamente</label>
      <ol class="vid-list">${LECCIONES.map((l, i) => `<li><button type="button" data-i="${i}"><span class="n">${n2(i)}</span>${l.title}</button><a href="#/${l.id}" aria-label="Lección ${n2(i)}: ${l.title}">Lección</a></li>`).join('')}</ol>
    </article>`;
  const video = $('video', main);
  const btns = [...main.querySelectorAll('.vid-list button')];
  const play = (i, auto) => {
    cur = i;
    video.src = videoDe(i);
    if (auto) video.play().catch(() => {});
    $('.vid-now span', main).textContent = `${n2(i)}. ${LECCIONES[i].title}`;
    $('.vid-now a', main).href = `#/${LECCIONES[i].id}`;
    btns.forEach((b, j) => b.toggleAttribute('aria-current', j === i));
  };
  btns.forEach((b) => b.addEventListener('click', () => { play(+b.dataset.i, true); video.scrollIntoView({ block: 'nearest' }); }));
  video.addEventListener('ended', () => { if ($('.vid-auto input', main).checked && cur < LECCIONES.length - 1) play(cur + 1, true); });
  play(cur, false);
}
