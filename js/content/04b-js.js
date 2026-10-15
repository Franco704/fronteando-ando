/* Módulo: JavaScript, parte 2 (asincronía, fetch, formularios, tablas, almacenamiento) */
(() => {
  const { code, table, note, lab, flow, webSol } = window.GUIDE.h;
  const EJ23_JSON = 'https://raw.githubusercontent.com/dsw-frt-utn/dsw2026-ej23/main/specialties.json';

  window.GUIDE.LESSONS.push(
    {
      id: 'asincronia',
      module: 'js',
      title: 'Event loop, Promises y async/await',
      keywords: 'event loop call stack microtask macrotask callback queue promise async await settimeout asincronico promise all',
      tldr: 'JavaScript tiene <mark>un solo hilo</mark> (no es multihilo), pero no se bloquea esperando: delega las tareas lentas al navegador y retoma cuando terminan. Las Promises y <code>async/await</code> son la forma de escribir ese código.',
      goals: ['Explicar el event loop con sus cuatro piezas.', 'Predecir el orden de ejecución entre código sincrónico, microtareas y tareas.', 'Crear y consumir Promises con then/catch y con async/await.'],
      body: `
        <h2>El problema</h2>
        <p>Pedir datos a un servidor puede tardar segundos. Si JavaScript se quedara esperando, la página se congelaría: no podrías hacer scroll ni hacer clic. Como tiene un solo hilo de ejecución, necesita un mecanismo para <strong>no bloquearse</strong>: el event loop.</p>

        <h2>El event loop, pieza por pieza</h2>
        ${table(['Pieza', 'Qué es'], [
          ['<strong>Call Stack</strong>', 'Donde se ejecuta el código sincrónico. Funciona como una pila LIFO: la última función que entra es la primera que sale'],
          ['<strong>Web APIs</strong>', 'Operaciones del navegador que corren aparte: <code>setTimeout</code>, <code>fetch</code>, eventos del DOM, <code>addEventListener</code>'],
          ['<strong>Callback Queue</strong> (Task / Macrotask Queue)', 'Cola de tareas: los callbacks de las operaciones asincrónicas esperando su turno'],
          ['<strong>Microtask Queue</strong>', 'Cola de mayor prioridad: <code>Promise.then</code>, <code>.catch</code>, <code>.finally</code>, lo que sigue a un <code>await</code>, <code>queueMicrotask</code>'],
        ])}
        ${flow('Call Stack vacío', 'Ejecuta TODAS las microtareas', 'Ejecuta UNA tarea', 'Repite')}
        <p><strong>El event loop siempre:</strong> ejecuta todo el Call Stack; cuando queda vacío, ejecuta todas las microtareas; luego ejecuta una tarea de la Callback Queue; y repite.</p>
        ${lab(0)}

        <h2>Promise</h2>
        <p>Una Promise es un objeto que representa un <strong>resultado futuro</strong> de un proceso asincrónico (una consulta a una API, leer un archivo, un temporizador). Tiene tres estados:</p>
        <ul>
          <li><mark>pending</mark> (pendiente): todavía no terminó.</li>
          <li><mark>fulfilled</mark> (cumplida): terminó bien, con un valor.</li>
          <li><mark>rejected</mark> (rechazada): ocurrió un error.</li>
        </ul>
        ${code('js', `// Crear una promesa
const esperar = (ms) => new Promise((resolve, reject) => {
  if (ms < 0) reject(new Error('Tiempo negativo'));
  setTimeout(() => resolve('Pasaron ' + ms + 'ms'), ms);
});

// Consumirla
esperar(1000)
  .then(valor => console.log(valor))      // si se cumplió
  .catch(error => console.error(error))   // si se rechazó
  .finally(() => console.log('Terminó'));  // siempre`)}
        <h3>Encadenar</h3>
        <p>Cada <code>.then</code> devuelve una promesa nueva con lo que retornes, así que se pueden encadenar pasos. Un solo <code>.catch</code> al final atrapa el error de cualquier paso.</p>
        ${code('js', `fetch('/api/paciente/1')
  .then(res => res.json())
  .then(paciente => fetch('/api/turnos?dni=' + paciente.dni))
  .then(res => res.json())
  .then(turnos => console.log(turnos))
  .catch(err => console.error('Algo falló en la cadena', err));`)}

        <h2>async / await</h2>
        <p>Es una forma más clara y legible de trabajar con Promises: se escribe como código secuencial.</p>
        <ul>
          <li><code>async</code> antes de la función significa que <strong>devolverá una Promise</strong>.</li>
          <li><code>await</code> (solo dentro de una función <code>async</code>) hace que el código espere el resultado de una Promise <strong>sin bloquear</strong> la página.</li>
          <li>Los errores se atrapan con el <code>try/catch</code> de siempre.</li>
        </ul>
        ${code('js', `async function cargarTurnos() {
  try {
    const res = await fetch('/api/paciente/1');
    const paciente = await res.json();
    const res2 = await fetch('/api/turnos?dni=' + paciente.dni);
    return await res2.json();
  } catch (error) {
    console.error('No se pudieron cargar', error);
    return [];
  }
}`)}

        <h2>Varias promesas a la vez</h2>
        ${table(['Método', 'Espera a…', 'Si una falla'], [
          ['<code>Promise.all([a, b])</code>', 'Que todas se cumplan; devuelve un array con los resultados', 'Se rechaza enseguida'],
          ['<code>Promise.allSettled([a, b])</code>', 'Que todas terminen, bien o mal', 'No se rechaza: te dice el estado de cada una'],
          ['<code>Promise.race([a, b])</code>', 'La primera que termine', 'Depende de cuál termine primero'],
        ])}
        ${code('js', `// En paralelo: tarda lo que la más lenta, no la suma de las dos
const [doctores, especialidades] = await Promise.all([
  fetch('/api/doctores').then(r => r.json()),
  fetch('/api/especialidades').then(r => r.json()),
]);`)}
        ${lab(1)}
      `,
      labs: [
        {
          title: 'Adiviná el orden',
          html: `<p>Antes de mirar abajo: ¿en qué orden se imprimen los números?</p>`,
          js: `
console.log('1 · sincrónico');

setTimeout(() => console.log('5 · setTimeout 0ms (task)'), 0);

Promise.resolve().then(() => console.log('3 · promesa (microtask)'));
queueMicrotask(() => console.log('4 · queueMicrotask (microtask)'));

console.log('2 · sincrónico');

const esperar = (ms) => new Promise(r => setTimeout(r, ms));
async function demo() {
  await esperar(500);
  console.log('6 · después de 500ms con await');
}
demo();`,
          hint: 'El <code>setTimeout</code> con 0 ms igual sale después de las promesas: las microtareas siempre tienen prioridad sobre las tareas.',
        },
        {
          title: 'Secuencial vs. paralelo',
          html: `<button id="sec">Secuencial</button> <button id="par">Paralelo (Promise.all)</button>
<p id="r"></p>`,
          js: `
// Simula una API que tarda
const api = (nombre, ms) => new Promise(res => setTimeout(() => res(nombre), ms));

document.getElementById('sec').addEventListener('click', async () => {
  const t0 = performance.now();
  const a = await api('doctores', 800);
  const b = await api('especialidades', 800);
  document.getElementById('r').textContent =
    [a, b].join(' + ') + ' en ' + Math.round(performance.now() - t0) + 'ms';
});

document.getElementById('par').addEventListener('click', async () => {
  const t0 = performance.now();
  const [a, b] = await Promise.all([api('doctores', 800), api('especialidades', 800)]);
  document.getElementById('r').textContent =
    [a, b].join(' + ') + ' en ' + Math.round(performance.now() - t0) + 'ms';
});`,
          hint: 'Secuencial tarda ~1600ms; en paralelo ~800ms. Usá <code>Promise.all</code> cuando los pedidos no dependen uno del otro.',
        },
      ],
      exercises: [
        {
          title: '¿Qué imprime?',
          level: 2,
          prompt: '<p>Sin ejecutarlo, escribí el orden de la salida. Después verificalo en el laboratorio.</p>' + code('js', `console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => {
  console.log('C');
  setTimeout(() => console.log('D'), 0);
});
(async () => {
  console.log('E');
  await null;
  console.log('F');
})();
console.log('G');`),
          solution: { explain: '<p><strong>A, E, G, C, F, B, D.</strong> Sincrónico primero: A, E (el cuerpo de una función async corre sincrónico hasta el primer <code>await</code>) y G. Después las microtareas en orden: C (y agenda D como tarea) y F (lo que sigue al <code>await</code>). Por último las tareas en orden de llegada: B y luego D.</p>' },
        },
        {
          title: 'Reintentar con espera',
          level: 3,
          prompt: '<p>Escribí <code>reintentar(fn, intentos)</code> que llame a una función async; si falla, espere 500ms y vuelva a intentar hasta <code>intentos</code> veces, y si falla todas, lance el último error. Probala con una función que falla al azar el 70% de las veces.</p>',
          hints: ['Un <code>for</code> con <code>try { return await fn(); } catch (e) { ultimo = e; await esperar(500); }</code>.'],
          solution: webSol('<p>Gracias a <code>async/await</code>, un bucle común alcanza: el <code>return</code> dentro del <code>try</code> corta apenas sale bien.</p>', {
            html: '<button id="b">Probar</button><pre id="out"></pre>',
            js: `const esperar = (ms) => new Promise(r => setTimeout(r, ms));

async function reintentar(fn, intentos = 3) {
  let ultimo;
  for (let i = 1; i <= intentos; i++) {
    try {
      return await fn();
    } catch (e) {
      ultimo = e;
      console.log('Intento ' + i + ' falló');
      if (i < intentos) await esperar(500);
    }
  }
  throw ultimo;
}

async function inestable() {
  await esperar(200);
  if (Math.random() < 0.7) throw new Error('Servidor ocupado');
  return 'Datos recibidos';
}

document.getElementById('b').addEventListener('click', async () => {
  const out = document.getElementById('out');
  out.textContent = 'Intentando…';
  try {
    out.textContent = await reintentar(inestable, 4);
  } catch (e) {
    out.textContent = 'Falló definitivamente: ' + e.message;
  }
});`,
          }),
        },
      ],
      sources: [
        { title: 'Promise · MDN', url: 'https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise', points: ['Representa la finalización (o falla) eventual de una operación asincrónica y su valor.', 'Estados: <em>pending</em>, <em>fulfilled</em>, <em>rejected</em>.', '<code>.then()</code>, <code>.catch()</code> y <code>.finally()</code> permiten encadenar acciones.'] },
      ],
    },

    {
      id: 'fetch',
      module: 'js',
      title: 'Fetch y JSON: hablar con un servidor',
      keywords: 'fetch api http get post put delete json response ok status headers stringify parse cors',
      tldr: '<code>fetch()</code> es la función nativa para hacer <mark>peticiones HTTP</mark>. Devuelve una Promise. Los datos casi siempre viajan en <mark>JSON</mark>, un formato de texto con la forma de un objeto de JavaScript.',
      goals: ['Leer y escribir JSON y convertirlo con parse y stringify.', 'Hacer GET, POST, PUT y DELETE con fetch.', 'Manejar errores HTTP y de red, y mostrar estados de carga.'],
      body: `
        <h2>JSON</h2>
        <p>JSON (JavaScript Object Notation) es un formato de texto para representar datos estructurados. Es el idioma común entre el frontend y el backend: el servidor manda JSON, vos lo convertís en objetos para usarlo, y para enviar datos hacés el camino inverso.</p>
        ${code('json', `{
  "id": "GUID-1",
  "name": "Cardiology",
  "description": "Cardiology is a branch of medicine that deals with disorders of the heart",
  "active": true,
  "doctors": ["Pérez", "Gómez"]
}`)}
        <p>Es más estricto que un objeto de JS: las claves y los strings van <strong>siempre con comillas dobles</strong>, y no admite funciones, <code>undefined</code>, comentarios ni comas al final.</p>
        ${code('js', `const texto = '{"nombre":"Ana","edad":30}';
const obj = JSON.parse(texto);       // texto → objeto (deserializar)
obj.nombre;                          // 'Ana'
const deVuelta = JSON.stringify(obj);  // objeto → texto (serializar)
JSON.stringify(obj, null, 2);          // con sangría, para leerlo`)}

        <h2>fetch: GET</h2>
        <p><code>fetch</code> es nativa en los navegadores modernos y en Node.js. Devuelve una Promise con un objeto <code>Response</code>. Leer el cuerpo también es asincrónico, por eso hay dos <code>await</code>.</p>
        ${code('js', `async function obtenerUsuarios() {
  const res = await fetch('https://jsonplaceholder.typicode.com/users');
  if (!res.ok) throw new Error('Error HTTP ' + res.status);
  const usuarios = await res.json();   // el cuerpo, convertido de JSON
  return usuarios;
}`)}
        ${note('<strong>Trampa clásica:</strong> fetch <em>no</em> rechaza la Promise ante un 404 o un 500: para fetch, “el servidor respondió” es un éxito. Solo falla si no hubo respuesta (sin red, dominio inexistente, CORS). Por eso siempre revisá <code>res.ok</code> (true si el código es 2xx) o <code>res.status</code>.', 'warn')}
        ${lab(0)}

        <h2>fetch: POST, PUT y DELETE</h2>
        <p>El segundo parámetro configura el pedido: método, cabeceras y cuerpo. Para mandar JSON hay que decirlo en <code>Content-Type</code> y convertir el objeto con <code>JSON.stringify</code>.</p>
        ${code('js', `// Crear
const res = await fetch('/api/especialidades', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Pediatría', description: 'Salud infantil' }),
});
const creada = await res.json();   // muchas APIs devuelven lo creado, con su id

// Modificar
await fetch('/api/especialidades/' + id, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(cambios),
});

// Borrar
await fetch('/api/especialidades/' + id, { method: 'DELETE' });

// Con autenticación (lo vas a usar con el token del login)
await fetch('/api/admin/products', {
  headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
});`)}
        <h3>Más opciones de fetch</h3>
        <ul>
          <li><code>credentials: 'include'</code>: enviar cookies a otro origen (por defecto fetch no las manda).</li>
          <li>Parámetros en la URL: <code>new URLSearchParams({ search, pageNumber: 1 })</code> arma <code>search=…&amp;pageNumber=1</code> con los caracteres escapados.</li>
          <li>Otros formatos de respuesta: <code>res.text()</code>, <code>res.blob()</code> (archivos).</li>
        </ul>
        ${note('<strong>¿Qué es CORS?</strong> Por seguridad, el navegador bloquea que una página de un origen (ej. <code>localhost:5173</code>) lea respuestas de otro (ej. <code>localhost:5142</code>) salvo que el servidor lo permita. En desarrollo se resuelve con el proxy de Vite, que verás en la Unidad 5.')}

        <h2>Los tres estados de una carga</h2>
        <p>Toda interfaz que pide datos tiene que contemplar: <strong>cargando</strong> (mostrá “Buscando datos…”), <strong>error</strong> (decí qué pasó y cómo seguir) y <strong>éxito</strong> (mostrá los datos, o un mensaje si la lista vino vacía).</p>
        ${lab(1)}
      `,
      labs: [
        {
          title: 'Traé usuarios de una API real',
          html: `
<button id="cargar">Cargar usuarios</button>
<p id="estado"></p>
<ul id="lista"></ul>`,
          css: `#estado { color: #4d5b60; } li { margin: 4px 0; }`,
          js: `
const estado = document.getElementById('estado');

document.getElementById('cargar').addEventListener('click', async () => {
  estado.textContent = 'Buscando datos…';
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/users');
    if (!res.ok) throw new Error('El servidor respondió ' + res.status);
    const usuarios = await res.json();
    document.getElementById('lista').innerHTML = usuarios
      .map(u => \`<li><strong>\${u.name}</strong>, \${u.email}</li>\`)
      .join('');
    estado.textContent = usuarios.length + ' usuarios cargados.';
  } catch (err) {
    estado.textContent = 'No se pudieron cargar: ' + err.message;
  }
});`,
          hint: 'Necesita conexión a internet. Rompé la URL a propósito (<code>/userss</code>) para ver el 404, y cambiá el dominio para ver un error de red.',
        },
        {
          title: 'POST: crear un recurso',
          html: `
<form id="f">
  <input id="titulo" placeholder="Título del post" required>
  <button>Crear</button>
</form>
<pre id="out"></pre>`,
          js: `
document.getElementById('f').addEventListener('submit', async (e) => {
  e.preventDefault();
  const out = document.getElementById('out');
  const boton = e.target.querySelector('button');
  boton.disabled = true;          // evita doble envío
  out.textContent = 'Enviando…';
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: document.getElementById('titulo').value, userId: 1 }),
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const creado = await res.json();
    out.textContent = 'Código ' + res.status + '\\n' + JSON.stringify(creado, null, 2);
  } catch (err) {
    out.textContent = 'Error: ' + err.message;
  } finally {
    boton.disabled = false;
  }
});`,
          hint: 'Mirá el código de estado: 201 Created. JSONPlaceholder simula la creación (devuelve el objeto con un id) pero no lo guarda de verdad.',
        },
      ],
      exercises: [
        {
          title: 'Detalle de un usuario',
          level: 1,
          prompt: '<p>Con un input numérico y un botón, pedí <code>https://jsonplaceholder.typicode.com/users/{id}</code> y mostrá nombre, email y ciudad. Si el id no existe (404), mostrá “No existe un usuario con ese id”. Mientras carga, deshabilitá el botón.</p>',
          solution: webSol('<p>Se distingue el 404 (el servidor respondió, pero no hay usuario) de un error de red (fetch rechaza). <code>finally</code> rehabilita el botón en ambos casos.</p>', {
            html: `<input id="id" type="number" value="1" min="1">
<button id="ver">Ver usuario</button>
<p id="out"></p>`,
            js: `const btn = document.getElementById('ver');
const out = document.getElementById('out');

btn.addEventListener('click', async () => {
  btn.disabled = true;
  out.textContent = 'Buscando…';
  try {
    const id = document.getElementById('id').value;
    const res = await fetch('https://jsonplaceholder.typicode.com/users/' + id);
    if (res.status === 404) {
      out.textContent = 'No existe un usuario con ese id';
      return;
    }
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const u = await res.json();
    out.textContent = u.name + ' · ' + u.email + ' · ' + u.address.city;
  } catch (e) {
    out.textContent = 'Error de conexión: ' + e.message;
  } finally {
    btn.disabled = false;
  }
});`,
          }),
        },
        {
          title: 'Posts de un usuario, en paralelo',
          level: 2,
          prompt: '<p>Pedí en paralelo el usuario 3 (<code>/users/3</code>) y sus posts (<code>/posts?userId=3</code>). Mostrá su nombre como título y la lista de títulos de los posts. Si cualquiera de los dos falla, mostrá un único mensaje de error.</p>',
          hints: ['<code>Promise.all</code> con dos fetch.', 'Escribí una función <code>getJSON(url)</code> que haga el fetch, revise <code>ok</code> y devuelva <code>res.json()</code>.'],
          solution: webSol('<p>La función auxiliar <code>getJSON</code> evita repetir el chequeo de <code>ok</code>. <code>Promise.all</code> se rechaza apenas una falla, así que un solo <code>catch</code> cubre ambas.</p>', {
            html: '<h2 id="nombre">Cargando…</h2><ol id="posts"></ol>',
            js: `async function getJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(url + ' respondió ' + res.status);
  return res.json();
}

async function cargar() {
  const base = 'https://jsonplaceholder.typicode.com';
  try {
    const [usuario, posts] = await Promise.all([
      getJSON(base + '/users/3'),
      getJSON(base + '/posts?userId=3'),
    ]);
    document.getElementById('nombre').textContent = usuario.name;
    document.getElementById('posts').innerHTML = posts
      .map(p => '<li>' + p.title + '</li>')
      .join('');
  } catch (e) {
    document.getElementById('nombre').textContent = 'No se pudo cargar: ' + e.message;
  }
}
cargar();`,
          }),
        },
      ],
      sources: [
        { title: 'Uso de Fetch', url: 'https://developer.mozilla.org/es/docs/Web/API/Fetch_API/Using_Fetch', points: ['<code>fetch()</code> hace peticiones HTTP asíncronas y devuelve una Promise con un <code>Response</code>.', 'No rechaza ante errores HTTP (404, 500): hay que revisar <code>response.ok</code>.', 'No envía credenciales por defecto: opción <code>credentials</code>.', 'Un objeto de opciones configura método, cabeceras y cuerpo.', 'Métodos como <code>.json()</code> o <code>.blob()</code> extraen el cuerpo.'] },
        { title: 'Trabajar con JSON', url: 'https://developer.mozilla.org/es/docs/Learn_web_development/Core/Scripting/JSON', points: ['Formato de texto para datos estructurados, basado en la sintaxis de objetos de JS.', 'Deserializar: texto → objeto. Serializar: objeto → texto.', 'Reglas estrictas: comillas dobles, sin funciones, <code>undefined</code>, comentarios ni comas finales.', '<code>JSON.parse()</code> y <code>JSON.stringify()</code> hacen las conversiones.'] },
      ],
    },

    {
      id: 'tablas-paginacion',
      module: 'js',
      title: 'Tablas dinámicas, filtros y paginación',
      keywords: 'tabla dinamica json filtro busqueda paginacion slice render especialidades ejercicio 23',
      tldr: 'Con un array de datos en memoria podés <mark>generar, filtrar y paginar una tabla</mark> sin volver a pedir nada al servidor. La clave es tener una sola función que dibuje la tabla a partir del estado actual.',
      goals: ['Cargar un JSON una vez y dibujar una tabla a partir de él.', 'Filtrar en memoria con un buscador.', 'Paginar con slice y botones anterior/siguiente.', 'Resolver el Ejercicio 23.'],
      body: `
        <h2>El patrón: estado + render</h2>
        <p>Toda tabla dinámica se resuelve igual:</p>
        <ol>
          <li><strong>Estado</strong>: variables con los datos y las opciones actuales (los datos completos, el texto buscado, la página).</li>
          <li><strong>Render</strong>: una función que borra la tabla y la vuelve a dibujar a partir del estado.</li>
          <li><strong>Eventos</strong>: cada interacción cambia el estado y llama a render.</li>
        </ol>
        ${code('js', `// Estado
let especialidades = [];   // los datos, cargados UNA vez
let filtro = '';
let pagina = 0;
const POR_PAGINA = 5;

// Derivados: se calculan, no se guardan
function visibles() {
  return especialidades.filter(e => e.name.toLowerCase().includes(filtro));
}

// Render
function render() {
  const lista = visibles();
  const totalPaginas = Math.max(1, Math.ceil(lista.length / POR_PAGINA));
  pagina = Math.min(pagina, totalPaginas - 1);
  const pedazo = lista.slice(pagina * POR_PAGINA, (pagina + 1) * POR_PAGINA);
  // …dibujar las filas de "pedazo" y el texto "Página X de Y"
}`)}
        ${note('<strong>Esta es la idea central de React.</strong> En la Unidad 5, el estado va a vivir en <code>useState</code> y React va a llamar a “render” por vos cada vez que cambie. Si entendés este patrón, React se vuelve natural.')}

        <h2>Cargar el JSON</h2>
        ${code('js', `async function cargar() {
  const res = await fetch('specialties.json');  // el archivo del repo del Ej. 23
  especialidades = await res.json();
  render();
}
document.addEventListener('DOMContentLoaded', cargar);`)}
        ${note('<strong>Si abrís el HTML con doble clic</strong> (<code>file://</code>), el navegador bloquea <code>fetch</code> a archivos locales. Usá la extensión <strong>Live Server</strong> de VS Code, o <code>npx serve</code> en la carpeta, para tener un servidor en <code>http://localhost</code>.', 'warn')}

        <h2>Dibujar filas de forma segura</h2>
        ${code('js', `function filaDe(especialidad) {
  const tr = document.createElement('tr');
  for (const valor of [especialidad.name, especialidad.description]) {
    const td = document.createElement('td');
    td.textContent = valor;     // seguro aunque el dato traiga HTML
    tr.appendChild(td);
  }
  return tr;
}
tbody.replaceChildren(...pedazo.map(filaDe));`)}

        <h2>Paginación</h2>
        <p>Con <code>slice</code> mostrás un pedazo del array: la página <code>p</code> (empezando en 0) con <code>n</code> elementos es <code>lista.slice(p * n, p * n + n)</code>. El total de páginas es <code>Math.ceil(total / n)</code>. Deshabilitá “Anterior” en la primera y “Siguiente” en la última, y volvé a la página 0 cuando cambie el filtro.</p>
        ${table(['Página (p)', 'n = 5', 'slice', 'Elementos'], [
          ['0', '', '<code>slice(0, 5)</code>', '0 a 4'],
          ['1', '', '<code>slice(5, 10)</code>', '5 a 9'],
          ['2', '', '<code>slice(10, 15)</code>', '10 a 14'],
        ])}
        <p>Esto es <strong>paginación en el cliente</strong>: tenés todos los datos y mostrás de a poco. Con miles de registros, la paginación la hace el servidor (<code>?pageNumber=2&amp;pageSize=10</code>), como en el proyecto de la Unidad 5.</p>
        ${lab(0)}
      `,
      labs: [
        {
          title: 'Ejercicio 23 + paginación, con el JSON real de la cátedra',
          html: `
<div class="buscar">
  <input id="q" placeholder="Buscar por nombre" aria-label="Buscar por nombre">
  <button id="btnBuscar">Buscar</button>
</div>
<p id="estado">Cargando…</p>
<table>
  <thead><tr><th>Nombre</th><th>Descripción</th></tr></thead>
  <tbody id="tbody"></tbody>
</table>
<div class="pager">
  <button id="prev">Anterior</button>
  <span id="pag"></span>
  <button id="next">Siguiente</button>
  <label>Por página <select id="tam"><option>2</option><option selected>3</option><option>5</option></select></label>
</div>`,
          css: `
.buscar { display:flex; gap:6px; margin-bottom:8px; }
input, button, select { font:inherit; padding:5px 8px; }
table { border-collapse:collapse; width:100%; }
th, td { border:1px solid #c9d0c9; padding:6px 10px; text-align:left; vertical-align:top; }
th { background:#dfe6f1; }
.pager { display:flex; gap:10px; align-items:center; margin-top:8px; flex-wrap:wrap; }`,
          js: `
// specialties.json del repo dsw2026-ej23 (en tu proyecto: fetch('specialties.json'))
const URL_JSON = '${EJ23_JSON}';

let especialidades = [];
let filtro = '';
let pagina = 0;
let porPagina = 3;

function filaDe(e) {
  const tr = document.createElement('tr');
  [e.name, e.description].forEach(v => {
    const td = document.createElement('td');
    td.textContent = v;
    tr.appendChild(td);
  });
  return tr;
}

function render() {
  const lista = especialidades.filter(e => e.name.toLowerCase().includes(filtro));
  const total = Math.max(1, Math.ceil(lista.length / porPagina));
  pagina = Math.min(pagina, total - 1);
  const pedazo = lista.slice(pagina * porPagina, (pagina + 1) * porPagina);

  document.getElementById('tbody').replaceChildren(...pedazo.map(filaDe));
  document.getElementById('estado').textContent = lista.length
    ? lista.length + ' especialidades'
    : 'Ninguna especialidad coincide con “' + filtro + '”.';
  document.getElementById('pag').textContent = 'Página ' + (pagina + 1) + ' de ' + total;
  document.getElementById('prev').disabled = pagina === 0;
  document.getElementById('next').disabled = pagina >= total - 1;
}

document.getElementById('btnBuscar').addEventListener('click', () => {
  filtro = document.getElementById('q').value.trim().toLowerCase();
  pagina = 0;
  render();   // filtra en memoria: no vuelve a pedir el JSON
});
document.getElementById('prev').addEventListener('click', () => { pagina--; render(); });
document.getElementById('next').addEventListener('click', () => { pagina++; render(); });
document.getElementById('tam').addEventListener('change', (e) => { porPagina = Number(e.target.value); pagina = 0; render(); });

fetch(URL_JSON)
  .then(res => { if (!res.ok) throw new Error('HTTP ' + res.status); return res.json(); })
  .then(datos => { especialidades = datos; render(); })
  .catch(err => { document.getElementById('estado').textContent = 'No se pudo cargar el JSON: ' + err.message; });`,
          hint: 'Carga el <code>specialties.json</code> real del repo de la cátedra (necesita internet). Buscá “logy” y cambiá el tamaño de página.',
        },
      ],
      exercises: [
        {
          official: '#23',
          title: 'Tabla con buscador',
          level: 2,
          prompt: `<ul>
            <li>A partir de ahora los ejercicios son incrementales.</li>
            <li>Descargá el JSON de <a href="https://github.com/dsw-frt-utn/dsw2026-ej23" target="_blank" rel="noopener">github.com/dsw-frt-utn/dsw2026-ej23</a>.</li>
            <li>Generá una tabla basada en el JSON con todas las especialidades. Columnas: “Nombre” y “Descripción”.</li>
            <li>Arriba de la tabla, un buscador por la columna Nombre con un botón. Al hacer clic se filtra la tabla según el criterio.</li>
            <li>La tabla se filtra en JS: no se vuelve a cargar el JSON.</li>
          </ul><p><strong>Importante:</strong> aplicá los estilos de maquetación del TPI.</p>`,
          hints: ['Cada objeto del JSON tiene <code>id</code>, <code>name</code> y <code>description</code>.', 'Guardá lo que devuelve el fetch en una variable fuera de la función.'],
          solution: webSol('<p>El JSON se pide una sola vez en <code>DOMContentLoaded</code> y se guarda en <code>specialties</code>. El botón solo filtra ese array y redibuja. El HTML va dentro del <code>main</code> del dashboard del TPI. (En el laboratorio se usa la URL del repo porque no hay archivos locales).</p>', {
            html: `<h1>Especialidades</h1>
<div class="search">
  <input id="search" placeholder="Buscar por nombre">
  <button id="search-btn">Buscar</button>
</div>
<table>
  <thead><tr><th>Nombre</th><th>Descripción</th></tr></thead>
  <tbody id="specialties-body"></tbody>
</table>`,
            css: `.search { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
table { width: 100%; border-collapse: collapse; }
th, td { border-bottom: 1px solid #ddd; padding: 0.5rem; text-align: left; }`,
            js: `let specialties = [];

function renderTable(list) {
  const tbody = document.getElementById('specialties-body');
  tbody.innerHTML = '';
  list.forEach((s) => {
    const tr = document.createElement('tr');
    const name = document.createElement('td');
    name.textContent = s.name;
    const description = document.createElement('td');
    description.textContent = s.description;
    tr.append(name, description);
    tbody.appendChild(tr);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  // En tu proyecto: fetch('specialties.json')
  const res = await fetch('${EJ23_JSON}');
  specialties = await res.json();
  renderTable(specialties);

  document.getElementById('search-btn').addEventListener('click', () => {
    const term = document.getElementById('search').value.trim().toLowerCase();
    renderTable(specialties.filter((s) => s.name.toLowerCase().includes(term)));
  });
});`,
          }, { htmlName: 'dashboard.html (main)', jsName: 'dashboard.js' }),
        },
        {
          title: 'Ordenar por columna',
          level: 3,
          prompt: '<p>Sobre la tabla de especialidades, hacé que al hacer clic en una cabecera se ordene por esa columna (ascendente), y un segundo clic invierta el orden. Mostrá una flecha ▲/▼ en la columna activa. El filtro y el orden deben combinarse.</p>',
          hints: ['Estado nuevo: <code>orden = { campo: \'name\', asc: true }</code>.', 'Ordená una <strong>copia</strong> de la lista filtrada con <code>localeCompare</code>.', 'Poné <code>data-campo</code> en cada <code>th</code> y usá delegación en el <code>thead</code>.'],
          solution: webSol('<p>El orden es parte del estado; <code>render</code> aplica filtro → orden → dibujo, siempre en ese orden. La delegación en <code>thead</code> evita un listener por cabecera.</p>', {
            html: `<input id="q" placeholder="Filtrar">
<table>
  <thead><tr><th data-campo="name">Nombre</th><th data-campo="description">Descripción</th></tr></thead>
  <tbody id="tb"></tbody>
</table>`,
            css: `th { cursor: pointer; user-select: none; background: #dfe6f1; } th, td { padding: 6px; text-align: left; border-bottom: 1px solid #ccc; }`,
            js: `let datos = [];
let filtro = '';
let orden = { campo: 'name', asc: true };

function render() {
  const lista = datos
    .filter(d => d.name.toLowerCase().includes(filtro))
    .slice()   // copia antes de ordenar
    .sort((a, b) => a[orden.campo].localeCompare(b[orden.campo]) * (orden.asc ? 1 : -1));

  document.getElementById('tb').innerHTML = '';
  lista.forEach(d => {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td></td><td></td>';
    tr.children[0].textContent = d.name;
    tr.children[1].textContent = d.description;
    document.getElementById('tb').appendChild(tr);
  });
  document.querySelectorAll('th').forEach(th => {
    const base = th.textContent.replace(/ [▲▼]$/, '');
    th.textContent = th.dataset.campo === orden.campo ? base + (orden.asc ? ' ▲' : ' ▼') : base;
  });
}

document.querySelector('thead').addEventListener('click', (e) => {
  const th = e.target.closest('th');
  if (!th) return;
  orden = { campo: th.dataset.campo, asc: orden.campo === th.dataset.campo ? !orden.asc : true };
  render();
});
document.getElementById('q').addEventListener('input', (e) => { filtro = e.target.value.toLowerCase(); render(); });

fetch('${EJ23_JSON}').then(r => r.json()).then(d => { datos = d; render(); });`,
          }),
        },
      ],
      sources: [
        { title: 'Repositorio del Ejercicio 23', url: 'https://github.com/dsw-frt-utn/dsw2026-ej23', points: ['Contiene <code>specialties.json</code>: un array de objetos con <code>id</code>, <code>name</code> y <code>description</code>.', 'Pide tabla con columnas Nombre y Descripción y un buscador que filtre en JS sin recargar el JSON.'] },
      ],
    },

    {
      id: 'formularios-js',
      module: 'js',
      title: 'Formularios y validación con JavaScript',
      keywords: 'formulario validacion javascript submit preventdefault mensajes error formdata constraint validation api setcustomvalidity',
      tldr: 'Validar con JavaScript te da <mark>control total sobre las reglas y los mensajes</mark>: errores debajo de cada campo, en tu idioma, en el momento justo. Combinado con las validaciones nativas, es lo que hace un formulario profesional.',
      goals: ['Leer valores de un formulario y armar un objeto.', 'Validar a mano y mostrar errores accesibles debajo de cada campo.', 'Usar la Constraint Validation API.', 'Resolver el Ejercicio 24.'],
      body: `
        <h2>El flujo</h2>
        ${flow('submit', 'preventDefault()', 'Leer valores', 'Validar', '¿Errores? Mostrarlos', 'Si no: armar objeto y enviar')}
        ${code('js', `form.addEventListener('submit', (e) => {
  e.preventDefault();

  // 1. Leer (trim saca espacios al principio y al final)
  const nombre = form.nombre.value.trim();   // form.nombre = el campo con name="nombre"
  const descripcion = form.descripcion.value.trim();

  // 2. Validar: un objeto con un mensaje por campo
  const errores = {};
  if (!nombre) errores.nombre = 'El nombre es obligatorio';
  else if (nombre.length > 15) errores.nombre = 'Máximo 15 caracteres';
  if (!descripcion) errores.descripcion = 'La descripción es obligatoria';

  // 3. Mostrar
  mostrarErrores(errores);
  if (Object.keys(errores).length > 0) return;

  // 4. Usar
  const especialidad = { nombre, descripcion };
  console.log(especialidad);
});`)}
        <p>Para leer todos los campos de una vez: <code>Object.fromEntries(new FormData(form))</code> devuelve un objeto con cada <code>name</code> como clave.</p>

        <h2>Mostrar errores bien</h2>
        <ul>
          <li>Un elemento para el mensaje <strong>debajo de cada campo</strong> (no un <code>alert</code>).</li>
          <li>Marcá el campo con <code>aria-invalid="true"</code> y conectá el mensaje con <code>aria-describedby</code>, así un lector de pantalla lo lee al enfocar el campo.</li>
          <li>Enfocá el primer campo con error.</li>
          <li>Decí cómo arreglarlo: “Máximo 15 caracteres” es mejor que “Valor inválido”.</li>
        </ul>
        ${code('html', `<label for="nombre">Nombre</label>
<input id="nombre" name="nombre" aria-describedby="error-nombre">
<small id="error-nombre" class="error"></small>`)}
        ${note('<strong>Usá <code>novalidate</code> en el form</strong> cuando valides con JS: desactiva las burbujas del navegador para que no aparezcan dos mensajes distintos para el mismo error. Los atributos (<code>required</code>, <code>maxlength</code>) se pueden dejar: siguen documentando las reglas y sirven si el JS falla.')}
        ${lab(0)}

        <h2>La Constraint Validation API</h2>
        <p>Un punto intermedio: el navegador valida con los atributos HTML y vos leés el resultado desde JS para mostrar tus propios mensajes.</p>
        ${table(['Propiedad / método', 'Qué hace'], [
          ['<code>input.checkValidity()</code>', 'true si cumple todas sus reglas'],
          ['<code>form.checkValidity()</code>', 'true si todos los campos son válidos'],
          ['<code>input.validity</code>', 'Detalle: <code>valueMissing</code>, <code>tooLong</code>, <code>typeMismatch</code>, <code>patternMismatch</code>…'],
          ['<code>input.validationMessage</code>', 'El mensaje que mostraría el navegador'],
          ['<code>input.setCustomValidity(msg)</code>', 'Marca el campo como inválido con tu mensaje (<code>""</code> lo vuelve válido)'],
          ['<code>form.reportValidity()</code>', 'Muestra los mensajes del navegador'],
        ])}
        ${lab(1)}
        ${note('<strong>Validar en el cliente no es seguridad.</strong> Cualquiera puede saltear tu JavaScript desde DevTools o mandar el pedido directo. El backend siempre vuelve a validar; el frontend valida para que la experiencia sea buena.', 'warn')}
      `,
      labs: [
        {
          title: 'Nueva especialidad con errores (Ejercicio 24)',
          html: `
<form id="form" novalidate>
  <label for="nombre">Nombre</label>
  <input id="nombre" name="nombre" maxlength="15" required aria-describedby="e-nombre">
  <small class="error" id="e-nombre"></small>

  <label for="descripcion">Descripción</label>
  <textarea id="descripcion" name="descripcion" rows="3" maxlength="100" required aria-describedby="e-descripcion"></textarea>
  <small class="error" id="e-descripcion"></small>

  <button>Guardar especialidad</button>
</form>`,
          css: `
form { display:grid; gap:4px; max-width:360px; }
input, textarea, button { font:inherit; padding:6px 8px; }
[aria-invalid="true"] { border:2px solid #c0392b; }
.error { color:#c0392b; min-height:1.2em; }`,
          js: `
const form = document.getElementById('form');

function validar({ nombre, descripcion }) {
  const errores = {};
  if (!nombre) errores.nombre = 'El nombre es obligatorio';
  else if (nombre.length > 15) errores.nombre = 'Máximo 15 caracteres';
  if (!descripcion) errores.descripcion = 'La descripción es obligatoria';
  else if (descripcion.length > 100) errores.descripcion = 'Máximo 100 caracteres';
  return errores;
}

function mostrarErrores(errores) {
  ['nombre', 'descripcion'].forEach(campo => {
    document.getElementById('e-' + campo).textContent = errores[campo] ?? '';
    form[campo].setAttribute('aria-invalid', Boolean(errores[campo]));
  });
  const primero = Object.keys(errores)[0];
  if (primero) form[primero].focus();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const datos = {
    nombre: form.nombre.value.trim(),
    descripcion: form.descripcion.value.trim(),
  };
  const errores = validar(datos);
  mostrarErrores(errores);
  if (Object.keys(errores).length) return;

  console.log('Especialidad creada:', datos);
  form.reset();
});`,
          hint: 'Enviá el formulario vacío: aparecen los dos mensajes y el foco va al primer campo con error. Con datos válidos el objeto sale por consola.',
        },
        {
          title: 'Validación nativa leída desde JS',
          html: `
<form id="f" novalidate>
  <label for="mail">Email</label>
  <input id="mail" type="email" required>
  <small id="m-mail"></small>

  <label for="clave">Contraseña</label>
  <input id="clave" type="password" required minlength="8">
  <label for="clave2">Repetir contraseña</label>
  <input id="clave2" type="password" required>
  <small id="m-clave2"></small>

  <button>Registrarme</button>
</form>`,
          css: `form { display:grid; gap:4px; max-width:300px; } small { color:#c0392b; min-height:1.2em; }`,
          js: `
const mail = document.getElementById('mail');
const clave = document.getElementById('clave');
const clave2 = document.getElementById('clave2');

// Regla que HTML no puede expresar: que coincidan
clave2.addEventListener('input', () => {
  clave2.setCustomValidity(clave2.value === clave.value ? '' : 'Las contraseñas no coinciden');
});

document.getElementById('f').addEventListener('submit', (e) => {
  e.preventDefault();
  document.getElementById('m-mail').textContent =
    mail.validity.valueMissing ? 'Ingresá tu email' :
    mail.validity.typeMismatch ? 'Ese email no tiene un formato válido' : '';
  document.getElementById('m-clave2').textContent = clave2.validationMessage;

  if (e.target.checkValidity()) console.log('Formulario válido');
  else console.log('Hay errores:', clave.validity.tooShort ? 'contraseña corta' : '');
});`,
          hint: 'Escribí dos contraseñas distintas: <code>setCustomValidity</code> marca el campo como inválido y <code>checkValidity()</code> lo detecta.',
        },
      ],
      exercises: [
        {
          official: '#24',
          title: 'Formulario de especialidad',
          level: 2,
          prompt: `<ul>
            <li>Tomá como base el ejercicio #23.</li>
            <li>Agregá un archivo <code>specialty.html</code>, copia de <code>dashboard.html</code> con lo básico para que la maquetación del dashboard funcione.</li>
            <li>Campos para crear una especialidad: label e input para Nombre (requerido, no superar 15 caracteres); label y textarea para Descripción (requerido, no superar 100 caracteres); botón submit que ejecute una función JS.</li>
            <li>Con JavaScript, tomá los valores de cada input, creá un objeto y mostralo por consola.</li>
            <li>Las validaciones deben ser con JavaScript y mostrar mensajes de error.</li>
          </ul><p><strong>Importante:</strong> aplicá los estilos de maquetación del TPI.</p>`,
          solution: webSol('<p>El <code>main</code> de <code>specialty.html</code> lleva el formulario; el resto (header, nav, footer y los CSS del TPI) se copia de <code>dashboard.html</code>. La lógica es la del primer laboratorio de esta lección, en su propio <code>specialty.js</code>.</p>', {
            html: `<!-- specialty.html (dentro del <main> del dashboard) -->
<h1>Nueva especialidad</h1>
<form id="specialty-form" novalidate>
  <label for="name">Nombre</label>
  <input id="name" name="name" aria-describedby="error-name">
  <small class="error" id="error-name"></small>

  <label for="description">Descripción</label>
  <textarea id="description" name="description" rows="4" aria-describedby="error-description"></textarea>
  <small class="error" id="error-description"></small>

  <button type="submit">Guardar</button>
</form>`,
            css: `#specialty-form { display: flex; flex-direction: column; gap: 0.5rem; max-width: 400px; }
#specialty-form input, #specialty-form textarea { font: inherit; padding: 0.5rem; }
.error { color: #c0392b; min-height: 1.2em; }`,
            js: `document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('specialty-form');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const specialty = {
      name: form.name.value.trim(),
      description: form.description.value.trim(),
    };

    const errors = {};
    if (!specialty.name) errors.name = 'El nombre es requerido';
    else if (specialty.name.length > 15) errors.name = 'El nombre no puede superar 15 caracteres';
    if (!specialty.description) errors.description = 'La descripción es requerida';
    else if (specialty.description.length > 100) errors.description = 'La descripción no puede superar 100 caracteres';

    document.getElementById('error-name').textContent = errors.name ?? '';
    document.getElementById('error-description').textContent = errors.description ?? '';

    if (Object.keys(errors).length > 0) return;

    console.log(specialty);
    form.reset();
  });
});`,
          }, { htmlName: 'specialty.html', jsName: 'specialty.js' }),
        },
        {
          title: 'Validación en vivo',
          level: 2,
          prompt: '<p>Convertí el formulario del ejercicio anterior para que cada campo se valide cuando el usuario sale de él (<code>blur</code>) y, a partir de ahí, mientras escribe (<code>input</code>), pero que no muestre errores en campos que nunca tocó. El botón Guardar debe estar deshabilitado mientras haya errores.</p>',
          hints: ['Guardá en un <code>Set</code> qué campos fueron “tocados”.', 'Una función <code>validarCampo(nombre)</code> que devuelve el mensaje o <code>""</code>.'],
          solution: webSol('<p>Se separa “¿es válido?” (para habilitar el botón, se calcula siempre) de “¿muestro el error?” (solo si el campo fue tocado). Es el mismo criterio que usa React Hook Form con su modo <code>onTouched</code>.</p>', {
            html: `<form id="f" novalidate>
  <label for="name">Nombre</label>
  <input id="name" name="name">
  <small class="error" data-for="name"></small>
  <label for="description">Descripción</label>
  <textarea id="description" name="description"></textarea>
  <small class="error" data-for="description"></small>
  <button disabled>Guardar</button>
</form>`,
            css: `form { display: grid; gap: 4px; max-width: 320px; } .error { color: #c0392b; min-height: 1.2em; }`,
            js: `const form = document.getElementById('f');
const tocados = new Set();
const reglas = {
  name: v => !v ? 'Requerido' : v.length > 15 ? 'Máximo 15 caracteres' : '',
  description: v => !v ? 'Requerido' : v.length > 100 ? 'Máximo 100 caracteres' : '',
};

function validarCampo(nombre) {
  return reglas[nombre](form[nombre].value.trim());
}

function actualizar() {
  let hayErrores = false;
  for (const nombre of Object.keys(reglas)) {
    const msg = validarCampo(nombre);
    if (msg) hayErrores = true;
    form.querySelector('[data-for="' + nombre + '"]').textContent = tocados.has(nombre) ? msg : '';
  }
  form.querySelector('button').disabled = hayErrores;
}

for (const nombre of Object.keys(reglas)) {
  form[nombre].addEventListener('blur', () => { tocados.add(nombre); actualizar(); });
  form[nombre].addEventListener('input', actualizar);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log(Object.fromEntries(new FormData(form)));
});`,
          }),
        },
      ],
      sources: [
        { title: 'Validación de formularios en el lado del cliente', url: 'https://developer.mozilla.org/es/docs/Learn_web_development/Extensions/Forms/Form_validation', points: ['La validación del cliente mejora la experiencia; la del servidor es obligatoria por seguridad.', 'La API de validación ofrece <code>checkValidity()</code>, <code>reportValidity()</code>, <code>setCustomValidity()</code> y <code>validity</code>.', '<code>novalidate</code> desactiva los mensajes del navegador para mostrar los propios en el DOM.'] },
      ],
    },

    {
      id: 'almacenamiento',
      module: 'js',
      title: 'Almacenamiento en el navegador',
      keywords: 'localstorage sessionstorage cookies indexeddb json stringify parse randomuuid guid persistencia',
      tldr: 'El navegador puede <mark>guardar datos del lado del cliente</mark>: cookies, localStorage, sessionStorage e IndexedDB. Cada uno tiene su capacidad, duración y uso típico.',
      goals: ['Elegir el mecanismo de almacenamiento adecuado.', 'Guardar y leer objetos en localStorage con JSON.', 'Organizar el acceso en un módulo propio.', 'Resolver el Ejercicio 25.'],
      body: `
        <h2>Comparación</h2>
        ${table(['Método', 'Capacidad aprox.', 'Persistencia', 'Tipo de datos', 'Acceso', 'Uso típico'], [
          ['<strong>Cookies</strong>', '~4 KB por cookie', 'Hasta que expira (fecha) o termina la sesión', 'Texto clave=valor', 'Sincrónico; se envían al servidor en cada pedido', 'Sesiones de usuario, recordar login, datos que necesita el servidor'],
          ['<strong>localStorage</strong>', '~5–10 MB (según el navegador)', 'Permanente, hasta que el usuario lo borre', 'Strings (objetos con <code>JSON.stringify</code>)', 'Sincrónico', 'Configuraciones, preferencias, tema'],
          ['<strong>sessionStorage</strong>', '~5 MB', 'Mientras la pestaña esté abierta', 'Strings', 'Sincrónico', 'Datos temporales por pestaña, como un carrito mientras no se cierre'],
          ['<strong>IndexedDB</strong>', 'Cientos de MB o más', 'Permanente', 'Objetos complejos, índices, transacciones, archivos (blobs)', 'Asíncrono', 'Apps offline, almacenamiento masivo: correos, notas, catálogos'],
        ])}

        <h2>localStorage y sessionStorage</h2>
        <p>Tienen la misma API. Cada <strong>origen</strong> (protocolo + dominio + puerto) tiene su propio espacio: lo que guarda <code>localhost:5173</code> no lo ve <code>localhost:3000</code>.</p>
        ${code('js', `localStorage.setItem('tema', 'oscuro');
localStorage.getItem('tema');       // 'oscuro'
localStorage.getItem('noExiste');   // null
localStorage.removeItem('tema');
localStorage.clear();               // borra todo lo de este origen

// Solo guarda strings: los objetos se convierten con JSON
const lista = [{ id: crypto.randomUUID(), name: 'Pediatría' }];
localStorage.setItem('specialties', JSON.stringify(lista));
const leida = JSON.parse(localStorage.getItem('specialties')) ?? [];`)}
        <p><code>crypto.randomUUID()</code> genera un identificador único universal (GUID/UUID), como <code>"3b241101-e2bb-4255-8caf-4136c566a962"</code>. Ideal como <code>id</code> de cada registro: dos llamadas nunca dan lo mismo.</p>
        ${note('<strong>Nunca guardes datos sensibles</strong> (contraseñas, datos médicos) en localStorage: cualquier script que corra en la página puede leerlo. El proyecto de la cátedra guarda ahí el token de sesión, que es lo habitual en SPAs, pero por eso es importante que el sitio no tenga vulnerabilidades XSS. En modo incógnito, el almacenamiento se borra al cerrar (o tiene cupo 0 en Safari).', 'warn')}

        <h2>Un módulo para el almacenamiento</h2>
        <p>El Ejercicio 25 pide un archivo JS que concentre todas las operaciones con localStorage. Así el resto del código no sabe ni le importa <em>dónde</em> se guardan los datos: mañana podrías cambiar a una API sin tocar la tabla ni el formulario.</p>
        ${code('js', `// storage.js
const KEY = 'specialties';

function getSpecialties() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? [];
  } catch {
    return [];   // si alguien corrompió el valor, empezamos de cero
  }
}

function saveSpecialties(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

function addSpecialty({ name, description }) {
  const list = getSpecialties();
  const nueva = { id: crypto.randomUUID(), name, description };
  list.push(nueva);
  saveSpecialties(list);
  return nueva;
}`)}
        ${code('html', `<!-- El orden importa: primero storage.js, después quien lo usa -->
<script src="storage.js" defer></script>
<script src="dashboard.js" defer></script>`)}
        ${lab(0)}

        <h2>Cookies</h2>
        <p>Las suele crear el servidor con la cabecera <code>Set-Cookie</code>, y el navegador las devuelve automáticamente en cada pedido a ese dominio. Por eso sirven para sesiones: HTTP no tiene memoria, la cookie se la da. Atributos de seguridad:</p>
        <ul>
          <li><code>Expires</code> / <code>Max-Age</code>: cuándo vence (sin ellos, es de sesión y se borra al cerrar el navegador).</li>
          <li><code>Secure</code>: solo viaja por HTTPS.</li>
          <li><code>HttpOnly</code>: JavaScript no la puede leer. Protege contra robo por XSS.</li>
          <li><code>SameSite</code>: limita el envío desde otros sitios. Protege contra CSRF.</li>
        </ul>
        ${code('js', `document.cookie = 'idioma=es; max-age=31536000; path=/';  // crear desde JS (sin HttpOnly)
document.cookie;  // 'idioma=es; otra=valor' (todas juntas en un string)`)}

        <h2>IndexedDB</h2>
        <p>Una base de datos de objetos dentro del navegador, para grandes volúmenes de datos estructurados (incluso archivos), con índices para búsquedas rápidas. Su API es asíncrona y de bajo nivel (verbosa); en la práctica se usa con librerías como <code>idb</code> o Dexie. Es lo que permite que una app como Gmail funcione offline.</p>
      `,
      labs: [
        {
          title: 'Especialidades en localStorage (Ejercicio 25)',
          html: `
<form id="f">
  <input id="n" placeholder="Nombre" required maxlength="15">
  <input id="d" placeholder="Descripción" required maxlength="100">
  <button>Guardar</button>
</form>
<input id="q" placeholder="Filtrar por nombre">
<table><thead><tr><th>Nombre</th><th>Descripción</th><th>ID</th></tr></thead><tbody id="tb"></tbody></table>
<button id="borrar">Vaciar todo</button>`,
          css: `
form, #q { display:flex; gap:6px; margin-bottom:8px; }
input, button { font:inherit; padding:5px 8px; }
table { border-collapse:collapse; width:100%; margin-bottom:8px; }
th, td { border:1px solid #c9d0c9; padding:5px 8px; text-align:left; }
td:last-child { font-family:monospace; color:#7f8b99; font-size:.8rem; }`,
          js: `
// ---- storage.js ----
const KEY = 'specialties';
const storage = {
  getAll() {
    try { return JSON.parse(localStorage.getItem(KEY)) ?? []; }
    catch { return []; } // en este laboratorio aislado puede no estar disponible
  },
  save(list) { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {} },
  add(item) {
    const list = this.getAll();
    list.push({ id: crypto.randomUUID(), ...item });
    this.save(list);
  },
};

// ---- dashboard.js ----
let memoria = storage.getAll(); // respaldo por si el laboratorio no permite localStorage

function leer() { const l = storage.getAll(); return l.length ? l : memoria; }

function render() {
  const q = document.getElementById('q').value.toLowerCase();
  const tb = document.getElementById('tb');
  tb.innerHTML = '';
  leer().filter(s => s.name.toLowerCase().includes(q)).forEach(s => {
    const tr = document.createElement('tr');
    [s.name, s.description, s.id.slice(0, 8)].forEach(v => {
      const td = document.createElement('td'); td.textContent = v; tr.appendChild(td);
    });
    tb.appendChild(tr);
  });
}

document.getElementById('f').addEventListener('submit', (e) => {
  e.preventDefault();
  const item = { name: document.getElementById('n').value.trim(), description: document.getElementById('d').value.trim() };
  storage.add(item);
  memoria = [...memoria, { id: crypto.randomUUID(), ...item }];
  e.target.reset();
  render();
});
document.getElementById('q').addEventListener('input', render);
document.getElementById('borrar').addEventListener('click', () => { storage.save([]); memoria = []; render(); });
render();`,
          hint: 'Este laboratorio corre aislado y el almacenamiento puede no persistir acá. En tu propio proyecto sí: guardá, recargá y la tabla sigue. Miralo en DevTools → Application → Local Storage.',
        },
      ],
      exercises: [
        {
          official: '#25',
          title: 'Almacenamiento',
          level: 2,
          prompt: `<ul>
            <li>Tomá como base el ejercicio #24.</li>
            <li>Ya no necesitamos leer <code>specialties.json</code>: eliminalo.</li>
            <li>Creá un archivo JavaScript que haga todas las operaciones con localStorage.</li>
            <li>Inicializá un array <code>specialties</code> vacío.</li>
            <li>La tabla Especialidades se carga con los datos del array <code>specialties</code> de localStorage, usando el archivo anterior.</li>
            <li>Desde el formulario, se agrega un objeto al array <code>specialties</code>. Antes de guardarlo, generá un GUID con <code>crypto.randomUUID()</code>.</li>
            <li>El filtrado de la tabla debe funcionar obteniendo los datos desde localStorage.</li>
          </ul><p><strong>Plus:</strong> paginación en la tabla. <strong>Importante:</strong> aplicá los estilos de maquetación del TPI.</p>`,
          solution: {
            explain: '<p>Tres archivos con responsabilidades separadas: <code>storage.js</code> (único que toca localStorage), <code>dashboard.js</code> (tabla, filtro y paginación) y <code>specialty.js</code> (formulario). Como el formulario está en <code>specialty.html</code> y la tabla en <code>dashboard.html</code>, comparten los datos a través de localStorage: guardás en una página y aparecen en la otra.</p>',
            files: [
              { name: 'storage.js', lang: 'js', code: `const SPECIALTIES_KEY = 'specialties';

function initSpecialties() {
  if (localStorage.getItem(SPECIALTIES_KEY) === null) {
    localStorage.setItem(SPECIALTIES_KEY, JSON.stringify([]));
  }
}

function getSpecialties() {
  try {
    return JSON.parse(localStorage.getItem(SPECIALTIES_KEY)) ?? [];
  } catch {
    return [];
  }
}

function addSpecialty(specialty) {
  const specialties = getSpecialties();
  specialties.push({ id: crypto.randomUUID(), ...specialty });
  localStorage.setItem(SPECIALTIES_KEY, JSON.stringify(specialties));
}

initSpecialties();` },
              { name: 'specialty.js (fragmento del submit)', lang: 'js', code: `// ...después de validar sin errores:
addSpecialty(specialty);
form.reset();
window.location.href = 'dashboard.html';` },
              { name: 'dashboard.js', lang: 'js', code: `const PAGE_SIZE = 5;
let page = 0;
let term = '';

function renderTable() {
  const filtered = getSpecialties().filter((s) => s.name.toLowerCase().includes(term));
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  page = Math.min(page, totalPages - 1);

  const tbody = document.getElementById('specialties-body');
  tbody.innerHTML = '';
  filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).forEach((s) => {
    const tr = document.createElement('tr');
    const name = document.createElement('td');
    name.textContent = s.name;
    const description = document.createElement('td');
    description.textContent = s.description;
    tr.append(name, description);
    tbody.appendChild(tr);
  });

  document.getElementById('page-info').textContent = \`Página \${page + 1} de \${totalPages}\`;
  document.getElementById('prev').disabled = page === 0;
  document.getElementById('next').disabled = page >= totalPages - 1;
}

document.addEventListener('DOMContentLoaded', () => {
  renderTable();
  document.getElementById('search-btn').addEventListener('click', () => {
    term = document.getElementById('search').value.trim().toLowerCase();
    page = 0;
    renderTable();
  });
  document.getElementById('prev').addEventListener('click', () => { page--; renderTable(); });
  document.getElementById('next').addEventListener('click', () => { page++; renderTable(); });
});` },
              { name: 'dashboard.html (scripts y paginador)', lang: 'html', code: `<script src="storage.js" defer></script>
<script src="dashboard.js" defer></script>
<!-- debajo de la tabla -->
<div class="pagination">
  <button id="prev">Anterior</button>
  <span id="page-info"></span>
  <button id="next">Siguiente</button>
</div>` },
            ],
          },
        },
        {
          title: 'Recordar preferencias',
          level: 1,
          prompt: '<p>Hacé una página con un selector de tema (claro/oscuro) y otro de tamaño de letra (chica/normal/grande). Al cambiarlos se aplican al instante y se guardan en localStorage como un solo objeto; al recargar se restauran.</p>',
          solution: webSol('<p>Un objeto <code>prefs</code> con todo, guardado como JSON. <code>aplicar</code> lo vuelca a la página y a los selects; se llama al cargar y en cada cambio. El <code>try/catch</code> evita que un valor corrupto rompa la página.</p>', {
            html: `<label>Tema <select id="tema"><option value="claro">Claro</option><option value="oscuro">Oscuro</option></select></label>
<label>Letra <select id="tam"><option value="14px">Chica</option><option value="16px">Normal</option><option value="20px">Grande</option></select></label>
<p>Este texto cambia según tus preferencias.</p>`,
            css: `body.oscuro { background: #1b2128; color: #dfe5e8; }`,
            js: `const KEY = 'prefs';
let prefs = { tema: 'claro', tam: '16px' };
try { prefs = { ...prefs, ...JSON.parse(localStorage.getItem(KEY)) }; } catch {}

function aplicar() {
  document.body.classList.toggle('oscuro', prefs.tema === 'oscuro');
  document.body.style.fontSize = prefs.tam;
  document.getElementById('tema').value = prefs.tema;
  document.getElementById('tam').value = prefs.tam;
  try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch {}
}

document.getElementById('tema').addEventListener('change', (e) => { prefs.tema = e.target.value; aplicar(); });
document.getElementById('tam').addEventListener('change', (e) => { prefs.tam = e.target.value; aplicar(); });
aplicar();`,
          }),
        },
      ],
      sources: [
        { title: 'API de almacenamiento web', url: 'https://developer.mozilla.org/es/docs/Web/API/Web_Storage_API', points: ['Guarda pares clave/valor de forma más intuitiva que las cookies.', '<code>sessionStorage</code> dura la sesión de la página; <code>localStorage</code> persiste al cerrar el navegador.', 'El evento <code>storage</code> avisa cuando cambia el almacenamiento.', 'En navegación privada cada navegador lo maneja distinto.'] },
        { title: 'HTTP cookies', url: 'https://developer.mozilla.org/es/docs/Web/HTTP/Guides/Cookies', points: ['Datos que el servidor envía y el navegador reenvía en cada pedido, porque HTTP no tiene estado.', 'Usos: sesiones, personalización, rastreo.', 'Para guardar datos en el cliente hoy se recomiendan Web Storage e IndexedDB.', '<code>Secure</code>, <code>HttpOnly</code> y <code>SameSite</code> mejoran la seguridad.'] },
        { title: 'IndexedDB', url: 'https://developer.mozilla.org/es/docs/Web/API/IndexedDB_API', points: ['API de bajo nivel para grandes cantidades de datos estructurados, archivos y blobs.', 'Usa índices para búsquedas rápidas.', 'Su API es asíncrona: no bloquea la página.', 'Los límites dependen del navegador.'] },
      ],
    },
  );
})();
