/* Módulo: React, parte 1 (componentes, estado, efectos, hooks) */
(() => {
  const { code, table, note, lab, flow, reactSol, filesSol } = window.GUIDE.h;

  window.GUIDE.LESSONS.push(
    {
      id: 'react-componentes-jsx',
      module: 'react',
      title: 'Componentes y JSX',
      keywords: 'react componente jsx classname fragment expresiones llaves',
      tldr: 'Un <mark>componente</mark> es una función que devuelve interfaz. <mark>JSX</mark> es la sintaxis que te deja escribir algo parecido a HTML dentro de JavaScript. Con ellos dividís la app en bloques reutilizables.',
      goals: ['Escribir y componer componentes.', 'Aplicar las reglas de JSX y meter expresiones entre llaves.', 'Explicar en qué se diferencia JSX de HTML.'],
      body: `
        <h2>Por qué React</h2>
        <p>Acordate del Ejercicio 17.2: para tener dos páginas copiaste el header y el nav en cada archivo. Si cambiaba el menú, había que cambiarlo en todos lados. Y en la tabla del Ejercicio 23 tuviste que borrar y redibujar filas a mano cada vez que cambiaba el filtro. React resuelve las dos cosas: <strong>componentes reutilizables</strong> y <strong>la interfaz como función del estado</strong> (vos decís cómo se ve para cada estado; React actualiza el DOM).</p>

        <h2>Componentes</h2>
        <p>Un componente es una función (o una clase, en código viejo) que <strong>retorna elementos visuales</strong>. Permiten dividir la aplicación en bloques reutilizables, cada uno con su marcado, su estilo y su lógica.</p>
        ${code('jsx', `function Saludo() {
  return <h1>Hola, mundo</h1>;
}

export default function App() {
  return (
    <main>
      <Saludo />
      <Saludo />
    </main>
  );
}`)}
        <ul>
          <li>Es una función de JavaScript común que devuelve JSX.</li>
          <li>Su nombre <mark>empieza con mayúscula</mark>: así React distingue <code>&lt;Saludo /&gt;</code> (tu componente) de <code>&lt;section&gt;</code> (etiqueta HTML).</li>
          <li>Se usan como etiquetas y se anidan: <code>App</code> contiene <code>Header</code>, que contiene <code>Logo</code>… formando un árbol.</li>
          <li><strong>Nunca definas un componente adentro de otro</strong>: todos van en el nivel superior del archivo (si no, se recrean en cada render y pierden su estado).</li>
          <li>Normalmente, un componente por archivo, con <code>export default</code>.</li>
        </ul>

        <h2>JSX</h2>
        <p>JSX es una extensión de la sintaxis de JavaScript que permite escribir código similar a HTML dentro de archivos JS. Facilita la creación de contenido dinámico porque podés mezclar marcado y lógica. No lo entiende el navegador: Vite lo compila a llamadas a <code>React.createElement()</code> (o <code>jsx()</code>) antes de ejecutarlo.</p>
        <h3>Las tres reglas</h3>
        <ol>
          <li><strong>Un solo elemento raíz.</strong> Para devolver varios, envolvelos en un <code>&lt;div&gt;</code> o en un Fragment <code>&lt;&gt;…&lt;/&gt;</code> (que no agrega nada al DOM).</li>
          <li><strong>Cerrá todas las etiquetas</strong>, incluso las vacías: <code>&lt;img /&gt;</code>, <code>&lt;br /&gt;</code>, <code>&lt;input /&gt;</code>.</li>
          <li><strong>camelCase</strong> en la mayoría de los atributos: <code>className</code> (en vez de <code>class</code>, que es palabra reservada de JS), <code>htmlFor</code> (en vez de <code>for</code>), <code>onClick</code>, <code>tabIndex</code>. Excepción: <code>aria-*</code> y <code>data-*</code> van con guiones.</li>
        </ol>
        <h3>Llaves: la puerta a JavaScript</h3>
        ${code('jsx', `const doctor = { nombre: 'Laura Pérez', foto: '/img/lp.jpg', activo: true };

<div className={doctor.activo ? 'card activa' : 'card'}>
  <img src={doctor.foto} alt={'Foto de ' + doctor.nombre} />
  <h2>{doctor.nombre.toUpperCase()}</h2>
  <p>Turnos hoy: {3 + 2}</p>
  <p style={{ color: 'crimson', fontSize: 14 }}>Estilo en línea: un objeto (doble llave)</p>
</div>`)}
        <p>Entre llaves va cualquier <strong>expresión</strong> (algo que da un valor): variables, cuentas, llamadas a funciones, ternarios. No van sentencias como <code>if</code> o <code>for</code> (para eso hay alternativas que vas a ver en la lección de condicionales y listas).</p>
        ${lab(0)}

        <h2>JSX vs. HTML</h2>
        ${table(['Característica', 'HTML', 'JSX (JavaScript XML)'], [
          ['Qué es', 'Lenguaje de marcado estándar de la web', 'Extensión de JavaScript para escribir algo parecido a HTML dentro de JS'],
          ['Dónde se usa', 'Archivos <code>.html</code> servidos por el navegador', 'Archivos <code>.jsx</code> o <code>.tsx</code> en proyectos React'],
          ['Sintaxis', 'Pura estructura de etiquetas', 'Mezcla de etiquetas y expresiones JS dentro de <code>{}</code>'],
          ['Atributos', 'Palabras de HTML: <code>class</code>, <code>for</code>', 'camelCase o modificados: <code>className</code>, <code>htmlFor</code>'],
          ['Lógica', 'No admite lógica: se combina con JS aparte', 'Permite incrustar variables y expresiones'],
          ['Validación', 'Flexible: el navegador tolera errores menores', 'Estricta: cada etiqueta debe cerrarse (<code>&lt;img /&gt;</code>, <code>&lt;br /&gt;</code>)'],
          ['Transformación', 'Se interpreta tal cual', 'Se compila a <code>React.createElement()</code> antes de ejecutarse'],
        ])}
        ${code('html', `<!-- HTML -->
<label for="email" class="lbl">Email</label>
<input id="email" type="email" onclick="avisar()">
<img src="logo.png">`)}
        ${code('jsx', `{/* JSX */}
<label htmlFor="email" className="lbl">Email</label>
<input id="email" type="email" onClick={avisar} />
<img src="logo.png" alt="Logo" />`)}
        ${lab(1)}
      `,
      labs: [
        {
          mode: 'react',
          title: 'Componiendo una tarjeta',
          jsx: `
function Avatar({ iniciales }) {
  return <div className="avatar">{iniciales}</div>;
}

function Tarjeta() {
  const nombre = 'Ana Núñez';
  const rol = 'Frontend trainee';
  const iniciales = nombre.split(' ').map(p => p[0]).join('');
  return (
    <div className="tarjeta">
      <Avatar iniciales={iniciales} />
      <div>
        <h2>{nombre}</h2>
        <p>{rol} · {new Date().getFullYear()}</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Tarjeta />
      <Tarjeta />
    </>
  );
}`,
          css: `
.tarjeta { display:flex; gap:14px; align-items:center; padding:14px; margin-bottom:10px; border:1px solid #d3d9d3; border-radius:12px; }
.tarjeta h2 { margin:0; font-size:1.1rem; }
.tarjeta p { margin:0; color:#4d5b60; }
.avatar { width:48px; height:48px; border-radius:50%; display:grid; place-items:center; background:#2b4c7e; color:white; font-weight:bold; }`,
          hint: 'Sacá el Fragment <code>&lt;&gt;</code> para ver el error de “un solo elemento raíz”. Cambiá <code>className</code> por <code>class</code> y mirá la advertencia en la consola.',
        },
        {
          mode: 'react',
          title: 'Un layout con componentes',
          jsx: `
function Header() {
  return <header className="hdr"><strong>Gestor de turnos</strong><button>Salir</button></header>;
}
function Nav() {
  return (
    <nav className="nav">
      <a href="#">Panel</a>
      <a href="#">Doctores</a>
      <a href="#">Especialidades</a>
    </nav>
  );
}
function Footer() {
  return <footer className="ftr">Mi Aplicación © {new Date().getFullYear()}</footer>;
}

export default function App() {
  return (
    <div className="layout">
      <Header />
      <Nav />
      <main><h1>Pacientes</h1><p>El header, el nav y el footer se escriben una sola vez.</p></main>
      <Footer />
    </div>
  );
}`,
          css: `
.layout { display:grid; grid-template-columns:150px 1fr; grid-template-areas:"h h" "n m" "f f"; gap:6px; }
.hdr { grid-area:h; display:flex; justify-content:space-between; align-items:center; background:#333; color:white; padding:8px 12px; }
.nav { grid-area:n; display:flex; flex-direction:column; gap:6px; background:#f4f4f4; padding:8px; }
main { grid-area:m; padding:0 8px; }
.ftr { grid-area:f; background:#333; color:white; text-align:center; padding:8px; }`,
          hint: 'Este es el Ejercicio 17.2 resuelto “a lo React”: si querés agregar un enlace al menú, lo hacés en un solo lugar.',
        },
      ],
      exercises: [
        {
          title: 'Convertí HTML a JSX',
          level: 1,
          prompt: '<p>Convertí este HTML en un componente <code>LoginCard</code> válido.</p>' + code('html', `<div class="card">
  <h2>Iniciar sesión</h2>
  <label for="user">Usuario</label>
  <input id="user" type="text" class="input">
  <br>
  <label for="pass">Contraseña</label>
  <input id="pass" type="password" class="input">
  <button onclick="ingresar()" style="background-color: blue; color: white">Entrar</button>
</div>`),
          solution: reactSol('<p>Cambios: <code>class</code> → <code>className</code>, <code>for</code> → <code>htmlFor</code>, etiquetas vacías cerradas, <code>onclick="…"</code> → <code>onClick={función}</code>, y <code>style</code> como objeto con propiedades en camelCase.</p>', `
function ingresar() {
  console.log('Ingresando…');
}

function LoginCard() {
  return (
    <div className="card">
      <h2>Iniciar sesión</h2>
      <label htmlFor="user">Usuario</label>
      <input id="user" type="text" className="input" />
      <br />
      <label htmlFor="pass">Contraseña</label>
      <input id="pass" type="password" className="input" />
      <button onClick={ingresar} style={{ backgroundColor: 'blue', color: 'white' }}>Entrar</button>
    </div>
  );
}

export default function App() {
  return <LoginCard />;
}`),
        },
        {
          title: 'Perfil desde un objeto',
          level: 2,
          prompt: '<p>Dado un objeto <code>doctor</code> con nombre, especialidad, matrícula, años de experiencia y un booleano <code>atiendeHoy</code>, mostrá una tarjeta con: el nombre en mayúsculas, “Dra./Dr.” según un campo <code>genero</code>, “Senior” si tiene más de 10 años de experiencia, y un punto verde o gris según <code>atiendeHoy</code> (usando <code>className</code> dinámico).</p>',
          solution: reactSol('<p>Todo se resuelve con expresiones entre llaves: ternarios para elegir texto o clase, métodos de string y una comparación.</p>', `
const doctor = {
  nombre: 'Laura Pérez',
  genero: 'F',
  especialidad: 'Cardiología',
  matricula: 4521,
  experiencia: 14,
  atiendeHoy: true,
};

export default function App() {
  const titulo = doctor.genero === 'F' ? 'Dra.' : 'Dr.';
  return (
    <article className="card">
      <span className={doctor.atiendeHoy ? 'dot on' : 'dot'} />
      <h2>{titulo} {doctor.nombre.toUpperCase()}</h2>
      <p>{doctor.especialidad} · MP {doctor.matricula}</p>
      <p>{doctor.experiencia} años {doctor.experiencia > 10 ? '(Senior)' : ''}</p>
    </article>
  );
}`, { css: `.card { position: relative; border: 1px solid #ccc; border-radius: 12px; padding: 12px 16px; max-width: 320px; }
.dot { position: absolute; top: 12px; right: 12px; width: 12px; height: 12px; border-radius: 50%; background: #aaa; }
.dot.on { background: #2f7a55; }` }),
        },
      ],
      sources: [
        { title: 'Tu primer componente · React', url: 'https://es.react.dev/learn/your-first-component', points: ['Los componentes son piezas reutilizables que combinan marcado, CSS y JS.', 'Son funciones cuyo nombre empieza con mayúscula.', 'Devuelven JSX y se pueden anidar.', 'Nunca se definen componentes dentro de otros.'] },
        { title: 'Escribir marcado con JSX · React', url: 'https://es.react.dev/learn/writing-markup-with-jsx', points: ['Un solo elemento raíz (o Fragment <code>&lt;&gt;&lt;/&gt;</code>).', 'Todas las etiquetas cerradas.', 'Atributos en camelCase, como <code>className</code>.'] },
        { title: 'React · documentación oficial en español', url: 'https://es.react.dev/', points: ['La biblioteca para interfaces de usuario web y nativas.', 'La sección “Aprende” recorre los conceptos en orden, con ejercicios.'] },
      ],
    },

    {
      id: 'virtual-dom',
      module: 'react',
      title: 'Renderizado: DOM, Virtual DOM y reconciliación',
      keywords: 'virtual dom reconciliacion diff key render commit renderizado',
      tldr: 'React mantiene una <mark>copia liviana del DOM en memoria</mark> (el Virtual DOM). Cuando algo cambia, arma un árbol nuevo, lo compara con el anterior y toca en el DOM real solo lo necesario.',
      goals: ['Explicar por qué existe el Virtual DOM.', 'Describir los pasos render → diff → commit.', 'Usar keys correctamente en listas.'],
      body: `
        <h2>El problema</h2>
        <p>Modificar el DOM real es caro: cada cambio puede obligar al navegador a recalcular estilos, rehacer el layout y repintar. Si en la Unidad 4 redibujabas una tabla entera para cambiar una celda, el navegador trabajaba de más.</p>

        <h2>Virtual DOM</h2>
        <ul>
          <li>Es una <strong>representación en memoria</strong> del DOM real: objetos de JavaScript livianos que describen qué debería haber en pantalla.</li>
          <li><strong>No es una API</strong> del navegador: es un concepto, un patrón que usan varias librerías y frameworks.</li>
          <li>React lo usa para calcular qué cambió en la interfaz antes de tocar el DOM.</li>
        </ul>
        ${table(['Característica', 'DOM', 'Virtual DOM (React)'], [
          ['Qué es', 'El documento HTML como árbol de nodos', 'Una copia ligera, en memoria'],
          ['Ubicación', 'En el navegador', 'En la memoria de la app React'],
          ['Actualizaciones', 'Directas: cada cambio fuerza recalcular estilos y repintar', 'Indirectas: actualiza el Virtual DOM, compara y aplica solo lo necesario'],
          ['Rendimiento', 'Muchos cambios seguidos pueden ser costosos', 'Minimiza las operaciones en el DOM real, que son las más pesadas'],
          ['Uso típico', 'JS puro, jQuery', 'React y frameworks modernos'],
          ['Ejemplo de cambio', '<code>document.getElementById("titulo").textContent = "Hola"</code>', '<code>setTitulo("Hola")</code>: React detecta el cambio y actualiza solo ese nodo'],
        ])}

        <h2>Reconciliación</h2>
        <p>Es el proceso por el cual React compara el árbol de elementos anterior con el nuevo y decide qué nodos del DOM actualizar, crear o eliminar. Cuando el estado o las props de un componente cambian:</p>
        ${flow('1. Render: nuevo árbol virtual', '2. Diff contra el anterior', '3. Commit: mínimas mutaciones en el DOM')}
        <h3>Las reglas del diff</h3>
        <ul>
          <li>Si el <strong>tipo</strong> de elemento cambia (<code>div</code> → <code>span</code>, o un componente por otro), desmonta el subárbol viejo (perdiendo su estado) y monta uno nuevo.</li>
          <li>Si el tipo es el mismo, <strong>reutiliza</strong> el nodo y actualiza solo los atributos o props que cambiaron.</li>
          <li>En listas, la prop <code>key</code> ayuda a identificar cada hijo entre renders y evita reutilizar el componente equivocado.</li>
        </ul>
        ${note('<strong>Keys estables e identificativas:</strong> usá un id del dato. Evitá el índice si la lista se reordena o se filtra, y nunca uses un valor aleatorio (<code>Math.random()</code>) en cada render: React pensaría que todo es nuevo y destruiría y recrearía cada elemento.', 'warn')}
        ${lab(0)}

        <h2>“Renderizar” no es “pintar”</h2>
        <p>En React, <strong>renderizar</strong> significa que React llama a tu función componente para obtener el JSX nuevo. No implica que el DOM cambie: si el resultado es igual al anterior, el commit no toca nada. Por eso tus componentes tienen que ser <mark>puros</mark>: con las mismas props y estado, devuelven el mismo JSX, y no modifican nada de afuera mientras renderizan.</p>
      `,
      labs: [
        {
          mode: 'react',
          title: 'Por qué importan las keys',
          jsx: `
import { useState } from 'react';

const inicial = [
  { id: 'a1', nombre: 'Ana' },
  { id: 'b2', nombre: 'Luis' },
  { id: 'c3', nombre: 'Sol' },
];

function Fila({ nombre }) {
  // Cada fila tiene un input con su propio estado interno (el texto que escribas)
  return <li>{nombre} <input placeholder={'nota sobre ' + nombre} /></li>;
}

export default function App() {
  const [lista, setLista] = useState(inicial);
  const invertir = () => setLista([...lista].reverse());

  return (
    <>
      <p>Escribí algo en el input de Ana y después invertí la lista.</p>
      <button onClick={invertir}>Invertir</button>
      <div className="cols">
        <div>
          <h3>key = índice (mal)</h3>
          <ul>{lista.map((p, i) => <Fila key={i} nombre={p.nombre} />)}</ul>
        </div>
        <div>
          <h3>key = id (bien)</h3>
          <ul>{lista.map(p => <Fila key={p.id} nombre={p.nombre} />)}</ul>
        </div>
      </div>
    </>
  );
}`,
          css: `.cols { display:grid; grid-template-columns:1fr 1fr; gap:12px; } h3 { font-size:.95rem; } input { width:110px; }`,
          hint: 'Con key = índice, el texto que escribiste se queda en la primera posición aunque Ana se mueva: React reutilizó el componente equivocado. Con key = id, la nota viaja con Ana.',
        },
      ],
      exercises: [
        {
          title: '¿Qué hace React?',
          level: 2,
          prompt: '<p>Para cada cambio, decí si React actualiza un atributo, reemplaza un subárbol o no toca el DOM: (a) el estado cambia de <code>&lt;p className="ok"&gt;</code> a <code>&lt;p className="error"&gt;</code>; (b) un ternario cambia <code>&lt;Login /&gt;</code> por <code>&lt;Panel /&gt;</code>; (c) se llama a <code>setContador(5)</code> cuando ya valía 5; (d) se agrega un elemento al principio de una lista con <code>key={indice}</code>.</p>',
          solution: { explain: '<ul><li>(a) Mismo tipo (<code>p</code>): actualiza solo el atributo <code>class</code>.</li><li>(b) Cambia el tipo de componente: desmonta <code>Login</code> (pierde su estado) y monta <code>Panel</code>.</li><li>(c) El valor es igual: React puede saltear el render y no toca el DOM.</li><li>(d) Todas las keys se corren una posición: React cree que cada elemento cambió de contenido y actualiza <em>todos</em>, además de que el estado interno queda en la posición equivocada. Con ids estables, solo insertaría un nodo.</li></ul>' },
        },
      ],
    },

    {
      id: 'props-state',
      module: 'react',
      title: 'Props, children y state',
      keywords: 'props children state usestate inmutable desestructuracion valores por defecto actualizar estado',
      tldr: 'Las <mark>props</mark> son datos que un padre le pasa a un hijo, y son de solo lectura. El <mark>state</mark> es la memoria propia de un componente: cuando cambia, React vuelve a renderizarlo.',
      goals: ['Pasar y leer props, con valores por defecto y children.', 'Declarar estado con useState y actualizarlo correctamente.', 'Actualizar objetos y arrays en el estado sin mutarlos.'],
      body: `
        <h2>Props</h2>
        <p>Las props son la forma de pasar datos de un componente padre a un hijo. Se escriben como atributos y llegan al hijo como <strong>un objeto</strong>. Pueden ser cualquier valor: strings, números, objetos, arrays, funciones, JSX.</p>
        ${code('jsx', `// El hijo las recibe desestructuradas, con valores por defecto opcionales
function Avatar({ nombre, size = 48, redondo = true }) {
  return (
    <img
      src={'https://i.pravatar.cc/' + size}
      alt={nombre}
      width={size}
      style={{ borderRadius: redondo ? '50%' : 0 }}
    />
  );
}

// El padre las pasa: strings con comillas, todo lo demás entre llaves
<Avatar nombre="Ana" size={64} />
<Avatar nombre="Luis" redondo={false} />`)}
        <p>Las props son <mark>inmutables</mark>: el hijo nunca las modifica, solo las lee. Si el padre cambia lo que le pasa, el hijo se vuelve a renderizar con los valores nuevos.</p>

        <h2>children</h2>
        <p>Es una prop especial: contiene lo que el componente envuelve, lo que va <strong>entre</strong> su etiqueta de apertura y de cierre. Permite crear “cajas” reutilizables que no saben qué van a contener.</p>
        ${code('jsx', `function Card({ titulo, children }) {
  return (
    <section className="card">
      <h2>{titulo}</h2>
      {children}
    </section>
  );
}

<Card titulo="Turnos de hoy">
  <p>No hay turnos.</p>
  <button>Crear turno</button>
</Card>`)}

        <h2>State</h2>
        <p>El estado representa la memoria interna de un componente. Guarda datos que, al cambiar, deben cambiar lo que se ve. ¿Por qué no alcanza con una variable común? Porque las variables locales se reinician en cada render y cambiarlas no avisa a React que tiene que volver a dibujar.</p>
        ${code('jsx', `import { useState } from 'react';

function Contador() {
  const [contador, setContador] = useState(0);
  //      valor     función para cambiarlo   valor inicial

  return <button onClick={() => setContador(contador + 1)}>Clics: {contador}</button>;
}`)}
        <ul>
          <li>El estado es <strong>privado</strong> de cada instancia: dos <code>&lt;Contador /&gt;</code> cuentan por separado.</li>
          <li>Un componente puede tener varios estados: un <code>useState</code> por cada dato.</li>
          <li>Nunca lo modifiques directo (<code>contador++</code>): llamá a la función <code>set</code> con el valor nuevo y React re-renderiza.</li>
        </ul>
        ${note('<strong>El estado se actualiza en el próximo render.</strong> Después de <code>setContador(contador + 1)</code>, la variable <code>contador</code> sigue teniendo el valor viejo hasta que la función se vuelva a ejecutar. Si necesitás basarte en el valor anterior (por ejemplo, sumar dos veces seguidas), usá la forma con función: <code>setContador(c =&gt; c + 1)</code>.', 'warn')}

        <h3>Objetos y arrays en el estado</h3>
        <p>React compara por referencia: si mutás el objeto y llamás a <code>set</code> con el mismo objeto, React cree que nada cambió. Siempre creá uno nuevo:</p>
        ${code('jsx', `const [form, setForm] = useState({ nombre: '', email: '' });
setForm({ ...form, email: 'ana@mail.com' });     // copiar y cambiar una propiedad

const [items, setItems] = useState([]);
setItems([...items, nuevo]);                       // agregar
setItems(items.filter(i => i.id !== id));          // quitar
setItems(items.map(i => i.id === id ? { ...i, cantidad: i.cantidad + 1 } : i));  // modificar uno`)}
        ${lab(0)}

        <h2>Props vs. state</h2>
        ${table(['', 'Props', 'State'], [
          ['Qué son', 'Argumentos que el padre le pasa al hijo', 'Un valor definido dentro del propio componente'],
          ['¿Se pueden cambiar?', 'No desde el hijo: son inmutables', 'Su valor es inmutable, pero se puede <strong>establecer un valor nuevo</strong> con su función <code>set</code>'],
          ['Al cambiar', 'El hijo se re-renderiza con las nuevas', 'React re-renderiza el componente'],
          ['Analogía', 'Los parámetros de una función', 'Las variables que la función recuerda entre llamadas'],
        ])}
        ${lab(1)}
      `,
      labs: [
        {
          mode: 'react',
          title: 'Contador con props y children',
          jsx: `
import { useState } from 'react';

function Card({ titulo, children }) {
  return (
    <section className="card">
      <h2>{titulo}</h2>
      {children}
    </section>
  );
}

function Contador({ paso = 1 }) {
  const [valor, setValor] = useState(0);
  return (
    <div className="fila">
      <button onClick={() => setValor(valor - paso)}>−{paso}</button>
      <output>{valor}</output>
      <button onClick={() => setValor(valor + paso)}>+{paso}</button>
      <button onClick={() => { setValor(v => v + paso); setValor(v => v + paso); }}>+{paso} dos veces</button>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Card titulo="De a uno"><Contador /></Card>
      <Card titulo="De a cinco"><Contador paso={5} /></Card>
    </>
  );
}`,
          css: `
.card { border:1px solid #d3d9d3; border-radius:12px; padding:12px 16px; margin-bottom:10px; }
.card h2 { margin:0 0 8px; font-size:1rem; }
.fila { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
button { font:inherit; padding:6px 12px; border-radius:8px; border:1px solid #aab; cursor:pointer; }
output { font-size:1.6rem; font-weight:bold; min-width:3ch; text-align:center; }`,
          hint: 'Cada <code>Contador</code> tiene su propio estado. Cambiá el último botón a <code>setValor(valor + paso)</code> dos veces: solo suma una vez, porque <code>valor</code> no cambia hasta el próximo render.',
        },
        {
          mode: 'react',
          title: 'Estado con objetos y arrays',
          jsx: `
import { useState } from 'react';

export default function App() {
  const [paciente, setPaciente] = useState({ nombre: '', obraSocial: 'Particular' });
  const [lista, setLista] = useState([]);

  const agregar = () => {
    if (!paciente.nombre.trim()) return;
    setLista([...lista, { ...paciente, id: crypto.randomUUID() }]);
    setPaciente({ ...paciente, nombre: '' });
  };

  return (
    <>
      <input
        value={paciente.nombre}
        onChange={e => setPaciente({ ...paciente, nombre: e.target.value })}
        placeholder="Nombre"
      />
      <select value={paciente.obraSocial} onChange={e => setPaciente({ ...paciente, obraSocial: e.target.value })}>
        <option>Particular</option><option>OSDE</option><option>Subsidio</option>
      </select>
      <button onClick={agregar}>Agregar</button>
      <ul>
        {lista.map(p => (
          <li key={p.id}>
            {p.nombre} ({p.obraSocial}){' '}
            <button onClick={() => setLista(lista.filter(x => x.id !== p.id))}>Quitar</button>
          </li>
        ))}
      </ul>
      <pre>{JSON.stringify(paciente)}</pre>
    </>
  );
}`,
          css: `input, select, button { font:inherit; padding:5px 8px; margin:2px; }`,
          hint: 'Probá cambiar <code>setLista([...lista, …])</code> por <code>lista.push(…); setLista(lista)</code>: no se actualiza la pantalla, porque es el mismo array.',
        },
      ],
      exercises: [
        {
          title: 'Componente Badge',
          level: 1,
          prompt: '<p>Creá un componente <code>Badge</code> que reciba <code>texto</code>, <code>color</code> (por defecto <code>"gris"</code>) y <code>children</code> opcional (un ícono antes del texto). Usalo para mostrar estados de turnos: “Confirmado” (verde), “Pendiente” (amarillo) y “Cancelado” (rojo).</p>',
          solution: reactSol('<p>El color elige una clase con un objeto como “mapa”. <code>children</code> es opcional: si no viene, es <code>undefined</code> y React no dibuja nada.</p>', `
function Badge({ texto, color = 'gris', children }) {
  return (
    <span className={'badge ' + color}>
      {children} {texto}
    </span>
  );
}

export default function App() {
  return (
    <p>
      <Badge texto="Confirmado" color="verde">✔</Badge>{' '}
      <Badge texto="Pendiente" color="amarillo" />{' '}
      <Badge texto="Cancelado" color="rojo">✖</Badge>{' '}
      <Badge texto="Sin estado" />
    </p>
  );
}`, { css: `.badge { display: inline-block; padding: 2px 10px; border-radius: 99px; font-size: .85rem; }
.gris { background: #e5e7eb; } .verde { background: #d1fae5; color: #065f46; }
.amarillo { background: #fef3c7; color: #92400e; } .rojo { background: #fee2e2; color: #991b1b; }` }),
        },
        {
          title: 'Carrito con cantidades',
          level: 2,
          prompt: '<p>Mostrá una lista de productos con un botón “Agregar”. Abajo, un carrito que muestre cada producto agregado con su cantidad, botones + y −, y el total. Si la cantidad llega a 0, el producto sale del carrito. El estado del carrito es un array de <code>{ id, nombre, precio, cantidad }</code>.</p>',
          hints: ['Para agregar: si ya existe, <code>map</code> sumando 1; si no, spread con el nuevo.', 'Para restar: <code>map</code> restando y después <code>filter(i =&gt; i.cantidad &gt; 0)</code>.'],
          solution: reactSol('<p>Todas las actualizaciones crean arrays nuevos con <code>map</code>, <code>filter</code> y spread. El total no se guarda en el estado: se <strong>calcula</strong> en cada render a partir del carrito.</p>', `
import { useState } from 'react';

const productos = [
  { id: 1, nombre: 'Mouse', precio: 12000 },
  { id: 2, nombre: 'Teclado', precio: 25000 },
  { id: 3, nombre: 'Monitor', precio: 180000 },
];

export default function App() {
  const [carrito, setCarrito] = useState([]);

  const cambiar = (producto, delta) => {
    const existe = carrito.find(i => i.id === producto.id);
    if (!existe) {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
      return;
    }
    setCarrito(
      carrito
        .map(i => (i.id === producto.id ? { ...i, cantidad: i.cantidad + delta } : i))
        .filter(i => i.cantidad > 0)
    );
  };

  const total = carrito.reduce((acc, i) => acc + i.precio * i.cantidad, 0);

  return (
    <>
      <h2>Productos</h2>
      {productos.map(p => (
        <p key={p.id}>{p.nombre} \${p.precio} <button onClick={() => cambiar(p, 1)}>Agregar</button></p>
      ))}
      <h2>Carrito</h2>
      {carrito.length === 0 && <p>Vacío.</p>}
      {carrito.map(i => (
        <p key={i.id}>
          {i.nombre} × {i.cantidad}{' '}
          <button onClick={() => cambiar(i, -1)}>−</button>
          <button onClick={() => cambiar(i, 1)}>+</button>
        </p>
      ))}
      <strong>Total: \${total}</strong>
    </>
  );
}`),
        },
      ],
      sources: [
        { title: 'Pasar props a un componente · React', url: 'https://es.react.dev/learn/passing-props-to-a-component', points: ['Las props permiten que un padre le envíe información a sus hijos.', 'Se leen desestructurando: <code>function Avatar({ person, size })</code>.', 'Se pueden dar valores por defecto.', 'El contenido anidado llega en la prop <code>children</code>.', 'Las props son de solo lectura: para cambiar datos se usa el estado.'] },
        { title: 'El estado: la memoria de un componente · React', url: 'https://es.react.dev/learn/state-a-components-memory', points: ['Las variables locales no persisten entre renders ni provocan un nuevo render.', '<code>useState</code> devuelve el valor actual y la función para actualizarlo.', 'Puede haber varios estados por componente.', 'El estado es aislado y privado de cada instancia.', 'Los hooks se llaman solo en el nivel superior.'] },
      ],
    },

    {
      id: 'listas-eventos',
      module: 'react',
      title: 'Condicionales, listas, eventos y comunicación',
      keywords: 'renderizado condicional ternario && map key eventos onclick sinteticos padre hijo lifting state up',
      tldr: 'Mostrás cosas según una condición con <code>? :</code> o <code>&amp;&amp;</code>, dibujás listas con <code>.map()</code> y una <code>key</code>, y los hijos le avisan al padre llamando a una función que reciben por props.',
      goals: ['Renderizar condicionalmente sin caer en la trampa del 0.', 'Dibujar y filtrar listas con keys.', 'Manejar eventos y comunicar hijo → padre.', 'Resolver los ejercicios 26 y 27.'],
      body: `
        <h2>Renderizado condicional</h2>
        ${code('jsx', `// 1. if antes del return: para casos grandes
if (cargando) return <p>Buscando datos…</p>;

// 2. Ternario: uno u otro
{logueado ? <Panel /> : <Login />}

// 3. &&: esto o nada
{errores.length > 0 && <Alerta errores={errores} />}

// 4. null: no dibujar nada
function Aviso({ mensaje }) {
  if (!mensaje) return null;
  return <p className="aviso">{mensaje}</p>;
}`)}
        ${note('<strong>La trampa del 0:</strong> <code>{cantidad &amp;&amp; &lt;Badge /&gt;}</code> muestra un <code>0</code> en pantalla cuando cantidad es 0, porque React dibuja los números. Usá siempre una condición booleana: <code>{cantidad &gt; 0 &amp;&amp; &lt;Badge /&gt;}</code>.', 'warn')}

        <h2>Listas con map</h2>
        <p>Para renderizar varios elementos de un array, se transforma cada dato en JSX con <code>.map()</code>. Cada elemento necesita una prop <code>key</code> <mark>única entre sus hermanos</mark> para que React identifique qué cambió.</p>
        ${code('jsx', `<ul>
  {productos
    .filter(p => p.stock > 0)
    .map(p => (
      <li key={p.id}>{p.nombre}</li>
    ))}
</ul>`)}
        ${note('<strong>Error común con map:</strong> si usás llaves en la arrow (<code>p =&gt; { … }</code>), tenés que escribir <code>return</code>. Con paréntesis (<code>p =&gt; ( … )</code>) el return es implícito.')}

        <h2>Eventos</h2>
        <ul>
          <li>Son como en JS, pero se escriben en <strong>camelCase</strong> y reciben una <strong>función</strong>, no un string: <code>onClick={manejarClic}</code>.</li>
          <li>Por convención, los manejadores se llaman <code>handle</code> + evento: <code>handleClick</code>, <code>handleSubmit</code>.</li>
          <li>React usa <mark>eventos sintéticos</mark>: una abstracción de los eventos nativos que funciona igual en todos los navegadores. Tienen <code>e.target</code>, <code>e.preventDefault()</code> y <code>e.stopPropagation()</code> como siempre.</li>
        </ul>
        ${code('jsx', `function Formulario() {
  function handleSubmit(e) {
    e.preventDefault();
    console.log('Enviando');
  }
  return (
    <form onSubmit={handleSubmit}>
      <button onClick={() => console.log('clic')}>Enviar</button>
    </form>
  );
}`)}
        ${note('<strong>Error clásico:</strong> <code>onClick={borrar(id)}</code> ejecuta la función <em>al renderizar</em>, no al hacer clic. Pasá la referencia, <code>onClick={borrar}</code>, o envolvela en una arrow si necesitás argumentos: <code>onClick={() =&gt; borrar(id)}</code>.', 'warn')}
        ${lab(0)}

        <h2>Comunicación entre componentes</h2>
        <h3>A) Padre → hijo: props</h3>
        <p>El padre pasa los datos al hijo mediante props. El hijo solo los muestra.</p>
        <h3>B) Hijo → padre: funciones por props</h3>
        <p>El padre le pasa una función al hijo como prop, y el hijo la ejecuta cuando pasa algo. Así el hijo comunica eventos o datos hacia arriba sin saber qué hace el padre con ellos.</p>
        ${code('jsx', `function Button({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>;   // el hijo solo avisa
}

function App() {
  const [show, setShow] = useState(false);              // el estado vive en el padre
  return <Button onClick={() => setShow(!show)}>Alternar</Button>;
}`)}
        <h3>Elevar el estado</h3>
        <p>Si dos componentes hermanos necesitan el mismo dato, el estado se <strong>eleva</strong> al padre común más cercano, que lo pasa por props a ambos (y les pasa funciones para cambiarlo). Cada dato tiene una <strong>única fuente de verdad</strong>.</p>
        ${lab(1)}
      `,
      labs: [
        {
          mode: 'react',
          title: 'Mostrar/ocultar productos (Ejercicios 26 y 27)',
          jsx: `
import { useState } from 'react';

const productos = [
  { id: 1, nombre: 'Teclado', precio: 25000 },
  { id: 2, nombre: 'Mouse', precio: 12000 },
  { id: 3, nombre: 'Monitor', precio: 180000 },
];

// Componente genérico: recibe el evento del padre
function Button({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>;
}

// Solo dibuja lo que le pasan por props
function List({ items }) {
  return (
    <ul>
      {items.map(p => (
        <li key={p.id}>{p.nombre}: \${p.precio}</li>
      ))}
    </ul>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <Button onClick={() => setShow(!show)}>
        {show ? 'Ocultar productos' : 'Mostrar productos'}
      </Button>
      {show && <List items={productos} />}
    </>
  );
}`,
          css: `button { font:inherit; padding:8px 14px; border-radius:8px; border:0; background:#2b4c7e; color:white; cursor:pointer; }`,
          hint: 'El estado vive en <code>App</code> (el padre). <code>Button</code> avisa del clic y <code>List</code> solo muestra.',
        },
        {
          mode: 'react',
          title: 'Elevar el estado: buscador y lista hermanos',
          jsx: `
import { useState } from 'react';

const pacientes = ['Ana López', 'Andrés Paz', 'Luis Gómez', 'Sol Díaz', 'Tomás Ruiz'];

function Buscador({ valor, onCambio }) {
  return <input value={valor} onChange={e => onCambio(e.target.value)} placeholder="Buscar paciente" />;
}

function Resultados({ texto }) {
  const visibles = pacientes.filter(p => p.toLowerCase().includes(texto.toLowerCase()));
  if (visibles.length === 0) return <p>No hay pacientes con “{texto}”.</p>;
  return <ul>{visibles.map(p => <li key={p}>{p}</li>)}</ul>;
}

function Contador({ texto }) {
  return <small>Buscando: “{texto}”</small>;
}

export default function App() {
  // El texto vive acá porque lo necesitan tres hijos
  const [texto, setTexto] = useState('');
  return (
    <>
      <Buscador valor={texto} onCambio={setTexto} />
      <Contador texto={texto} />
      <Resultados texto={texto} />
    </>
  );
}`,
          css: `input { font:inherit; padding:6px 8px; width:100%; max-width:280px; display:block; }`,
          hint: 'Ningún hijo tiene estado: todos dependen del padre. Así no pueden desincronizarse.',
        },
      ],
      exercises: [
        {
          official: '#26',
          title: 'Mostrar/ocultar un listado de productos',
          level: 1,
          prompt: `<ul>
            <li>Creá un proyecto desde cero con <code>npm create vite@latest</code> y abrí la carpeta en VS Code.</li>
            <li>En <code>App.jsx</code>, creá un array de productos.</li>
            <li>Definí un state <code>show</code> con valor por defecto <code>false</code>.</li>
            <li>Borrá el contenido del return del componente App.</li>
            <li>Agregá un botón con la prop <code>onClick</code> que cambie el valor de <code>show</code>. El texto del botón cambia según <code>show</code>.</li>
            <li>Debajo del botón, mostrá el listado de productos de forma condicional según <code>show</code>.</li>
          </ul><p><strong>Resultado:</strong> el listado se muestra o no según cómo interactúe el usuario con el botón.</p>`,
          solution: reactSol('<p>Un estado booleano, un ternario para el texto del botón y <code>&amp;&amp;</code> para mostrar la lista.</p>', `
import { useState } from 'react';

const products = [
  { id: 1, name: 'Notebook', price: 950000 },
  { id: 2, name: 'Mouse', price: 12000 },
  { id: 3, name: 'Teclado', price: 25000 },
];

function App() {
  const [show, setShow] = useState(false);

  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Ocultar productos' : 'Mostrar productos'}
      </button>
      {show && (
        <ul>
          {products.map((product) => (
            <li key={product.id}>{product.name} - \${product.price}</li>
          ))}
        </ul>
      )}
    </>
  );
}

export default App;`),
        },
        {
          official: '#27',
          title: 'Mostrar/ocultar (padre → hijo)',
          level: 1,
          prompt: `<ul>
            <li>Tomá como base el ejercicio anterior.</li>
            <li>Creá un componente <code>List</code> que dibuje la lista de productos, recibida desde <code>App</code> como prop.</li>
            <li>Creá un componente <code>Button</code> genérico que reciba el evento <code>onClick</code>.</li>
            <li>Los dos componentes nuevos deben estar en archivos separados.</li>
          </ul><p><strong>Resultado:</strong> el mismo comportamiento que el ejercicio anterior.</p>`,
          solution: reactSol('<p><code>App</code> conserva el estado y decide; <code>List</code> y <code>Button</code> son componentes “tontos” que solo reciben props, por eso son reutilizables. El <code>Button</code> pasa además cualquier otra prop (<code>...rest</code>) al botón real, como <code>type</code> o <code>disabled</code>.</p>', `
import { useState } from 'react';
import Button from './components/Button';
import List from './components/List';

const products = [
  { id: 1, name: 'Notebook', price: 950000 },
  { id: 2, name: 'Mouse', price: 12000 },
  { id: 3, name: 'Teclado', price: 25000 },
];

function App() {
  const [show, setShow] = useState(false);

  return (
    <>
      <Button onClick={() => setShow(!show)}>
        {show ? 'Ocultar productos' : 'Mostrar productos'}
      </Button>
      {show && <List items={products} />}
    </>
  );
}

export default App;`, {
            noRun: true,
            extra: [
              { name: 'src/components/Button.jsx', lang: 'jsx', code: `function Button({ children, onClick, ...rest }) {
  return (
    <button onClick={onClick} {...rest}>
      {children}
    </button>
  );
}

export default Button;` },
              { name: 'src/components/List.jsx', lang: 'jsx', code: `function List({ items }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.name} - \${item.price}</li>
      ))}
    </ul>
  );
}

export default List;` },
            ],
          }),
        },
        {
          title: 'Lista de tareas con filtros',
          level: 2,
          prompt: '<p>Hacé una lista de tareas con: input + botón para agregar (no se pueden agregar vacías), checkbox para marcar como hecha, botón para borrar, y tres botones de filtro (Todas, Pendientes, Hechas) con el activo resaltado. Mostrá “No hay tareas” cuando la lista filtrada esté vacía.</p>',
          hints: ['Dos estados: <code>tareas</code> y <code>filtro</code>.', 'La lista visible se calcula en el render con <code>filter</code>: no la guardes en otro estado.'],
          solution: reactSol('<p>El filtro activo es estado, pero la lista filtrada no: se deriva en cada render. Guardarla en otro <code>useState</code> sería duplicar información que se puede desincronizar.</p>', `
import { useState } from 'react';

const FILTROS = { todas: () => true, pendientes: t => !t.hecha, hechas: t => t.hecha };

export default function App() {
  const [tareas, setTareas] = useState([]);
  const [texto, setTexto] = useState('');
  const [filtro, setFiltro] = useState('todas');

  function agregar(e) {
    e.preventDefault();
    if (!texto.trim()) return;
    setTareas([...tareas, { id: crypto.randomUUID(), texto: texto.trim(), hecha: false }]);
    setTexto('');
  }
  const alternar = id => setTareas(tareas.map(t => (t.id === id ? { ...t, hecha: !t.hecha } : t)));
  const borrar = id => setTareas(tareas.filter(t => t.id !== id));

  const visibles = tareas.filter(FILTROS[filtro]);

  return (
    <>
      <form onSubmit={agregar}>
        <input value={texto} onChange={e => setTexto(e.target.value)} placeholder="Nueva tarea" />
        <button>Agregar</button>
      </form>
      <p>
        {Object.keys(FILTROS).map(f => (
          <button key={f} className={f === filtro ? 'activo' : ''} onClick={() => setFiltro(f)}>{f}</button>
        ))}
      </p>
      {visibles.length === 0 ? <p>No hay tareas.</p> : (
        <ul>
          {visibles.map(t => (
            <li key={t.id}>
              <input type="checkbox" checked={t.hecha} onChange={() => alternar(t.id)} />
              <span className={t.hecha ? 'hecha' : ''}>{t.texto}</span>
              <button onClick={() => borrar(t.id)}>Borrar</button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}`, { css: `.activo { background: #2b4c7e; color: white; } .hecha { text-decoration: line-through; color: #888; } li { display: flex; gap: 8px; align-items: center; }` }),
        },
      ],
      sources: [
        { title: 'Renderizado condicional · React', url: 'https://es.react.dev/learn/conditional-rendering', points: ['Se puede usar <code>if</code>, el ternario <code>? :</code> y <code>&amp;&amp;</code>.', 'Devolver <code>null</code> no dibuja nada.', 'Error común: un número a la izquierda de <code>&amp;&amp;</code> muestra <code>0</code>.'] },
        { title: 'Renderizado de listas · React', url: 'https://es.react.dev/learn/rendering-lists', points: ['<code>map()</code> transforma arrays en elementos; <code>filter()</code> elige cuáles.', 'Cada elemento necesita una <code>key</code> única basada en los datos.', 'Errores comunes: olvidar <code>return</code> en arrows con llaves, usar el índice o <code>Math.random()</code> como key.'] },
        { title: 'Responder a eventos · React', url: 'https://es.react.dev/learn/responding-to-events', points: ['Los manejadores se pasan como props: <code>onClick={handleClick}</code>.', 'Por convención empiezan con <code>handle</code>.', 'Los eventos se propagan; <code>e.stopPropagation()</code> lo corta y <code>e.preventDefault()</code> evita el comportamiento por defecto.', 'Error común: pasar <code>handleClick()</code> en vez de <code>handleClick</code>.'] },
        { title: 'Compartir estado entre componentes · React', url: 'https://es.react.dev/learn/sharing-state-between-components', points: ['Para que dos componentes cambien juntos, se eleva el estado al padre común.', 'Componentes controlados: su información viene por props del padre.', 'Cada pieza de estado tiene una única fuente de verdad.'] },
      ],
    },

    {
      id: 'useeffect',
      module: 'react',
      title: 'useEffect y el ciclo de vida',
      keywords: 'useeffect efecto dependencias montaje actualizacion desmontaje limpieza ciclo de vida fetch strict mode',
      tldr: '<code>useEffect</code> ejecuta <mark>efectos secundarios</mark>: todo lo que sale del render puro, como llamar a una API, usar timers, suscribirse a eventos o leer localStorage. Sincroniza tu componente con el mundo exterior.',
      goals: ['Escribir efectos con el array de dependencias correcto.', 'Relacionar montaje, actualización y desmontaje con useEffect.', 'Limpiar timers y listeners.', 'Saber cuándo NO usar un efecto.'],
      body: `
        <h2>Qué es un efecto secundario</h2>
        <p>Renderizar debería ser puro: recibir props y estado, devolver JSX. Pero las apps necesitan hacer cosas “afuera”: pedir datos a una API, suscribirse a eventos de la ventana, manipular el DOM directamente, leer o escribir localStorage. Eso son efectos secundarios, y van en <code>useEffect</code>, que se ejecuta <strong>después</strong> de que React actualizó la pantalla.</p>

        <h2>La forma</h2>
        <p>Recibe dos parámetros: la función que se ejecutará, y un array de dependencias.</p>
        ${code('jsx', `useEffect(() => {
  // efecto: corre después del render
  return () => {
    // limpieza (opcional): corre antes del próximo efecto y al desmontar
  };
}, [dependencias]);`)}

        <h2>El array de dependencias</h2>
        ${table(['Segundo parámetro', 'Cuándo se ejecuta'], [
          ['<code>[]</code>', 'Solo en el montaje (cuando el componente se renderiza por primera vez)'],
          ['<code>[variable]</code>', 'En el montaje y cada vez que <code>variable</code> cambie'],
          ['(sin segundo parámetro)', 'Después de <strong>cada</strong> render'],
        ])}
        <p>Las dependencias son todos los valores reactivos (props, estado, variables del componente) que usás adentro del efecto. ESLint te avisa si te olvidás de alguno: hacele caso.</p>

        <h2>Ciclo de vida de un componente</h2>
        <ul>
          <li><mark>Montaje</mark> (mount): se renderiza por primera vez.</li>
          <li><mark>Actualización</mark> (update): se vuelve a renderizar porque cambió una prop o el estado.</li>
          <li><mark>Desmontaje</mark> (unmount): se quita del árbol de React.</li>
        </ul>
        ${table(['Fase', 'Cómo se maneja con useEffect', 'Ejemplo'], [
          ['Montaje', '<code>useEffect(() =&gt; {…}, [])</code>', 'Llamar a la API al cargar'],
          ['Actualización', '<code>useEffect(() =&gt; {…}, [dependencia])</code>', 'Reaccionar a cambios de estado o props (buscar cuando cambia la página)'],
          ['Desmontaje', '<code>useEffect(() =&gt; { return () =&gt; {…} }, [])</code>', 'Limpiar timers o eventos'],
        ])}
        ${lab(0)}

        <h2>Pedir datos en un efecto</h2>
        ${code('jsx', `function ListProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelado = false;                 // evita usar una respuesta vieja
    async function cargar() {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        if (!cancelado) setProducts(data);
      } catch (e) {
        if (!cancelado) setError(e.message);
      } finally {
        if (!cancelado) setLoading(false);
      }
    }
    cargar();
    return () => { cancelado = true; };    // si el componente se va antes de que llegue
  }, []);

  if (loading) return <p>Buscando datos…</p>;
  if (error) return <p>Error: {error}</p>;
  return <ul>{products.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
}`)}
        ${note('<strong>¿Por qué se ejecuta dos veces?</strong> En desarrollo, el <code>&lt;StrictMode&gt;</code> de <code>main.jsx</code> monta, desmonta y vuelve a montar cada componente para ayudarte a detectar efectos sin limpieza. En producción corre una vez. Si tu efecto se rompe por eso, le falta la función de limpieza.')}

        <h2>Cuándo NO usar useEffect</h2>
        <ul>
          <li><strong>Para calcular datos derivados:</strong> si algo se puede calcular a partir de props o estado, calculalo directo en el render (<code>const total = items.reduce(…)</code>). Guardarlo en un estado con un efecto genera renders de más.</li>
          <li><strong>Para responder a un clic o un envío:</strong> eso va en el manejador del evento, no en un efecto que “observa” un estado.</li>
          <li><strong>Encadenar efectos</strong> que actualizan estados uno tras otro: suele ser una señal de diseño frágil.</li>
        </ul>
        ${lab(1)}
      `,
      labs: [
        {
          mode: 'react',
          title: 'Simulación de fetch con “Buscando datos”',
          jsx: `
import { useState, useEffect } from 'react';

// Simula una API que tarda 1,5 segundos
function fakeFetch() {
  return new Promise(resolve =>
    setTimeout(() => resolve(['Cardiología', 'Pediatría', 'Neurología']), 1500)
  );
}

function Reloj() {
  const [seg, setSeg] = useState(0);
  useEffect(() => {
    console.log('Reloj montado');
    const id = setInterval(() => setSeg(s => s + 1), 1000);
    return () => {
      clearInterval(id);            // limpieza al desmontar
      console.log('Reloj desmontado');
    };
  }, []);
  return <p>Montado hace {seg} s</p>;
}

export default function App() {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [verReloj, setVerReloj] = useState(true);

  useEffect(() => {
    fakeFetch().then(r => {
      setDatos(r);
      setCargando(false);
    });
  }, []); // [] = solo al montar

  return (
    <>
      {cargando ? <p>Buscando datos…</p> : (
        <ul>{datos.map(d => <li key={d}>{d}</li>)}</ul>
      )}
      <button onClick={() => setVerReloj(!verReloj)}>
        {verReloj ? 'Desmontar reloj' : 'Montar reloj'}
      </button>
      {verReloj && <Reloj />}
    </>
  );
}`,
          css: `button { font:inherit; padding:6px 12px; border-radius:8px; border:1px solid #aab; cursor:pointer; }`,
          hint: 'Desmontá y volvé a montar el reloj: arranca de cero porque la limpieza borró el intervalo y el estado se perdió. Mirá la consola.',
        },
        {
          mode: 'react',
          title: 'Efecto que depende de un estado',
          jsx: `
import { useState, useEffect } from 'react';

export default function App() {
  const [id, setId] = useState(1);
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    let cancelado = false;
    setCargando(true);
    fetch('https://jsonplaceholder.typicode.com/users/' + id)
      .then(r => r.json())
      .then(u => { if (!cancelado) setUsuario(u); })
      .finally(() => { if (!cancelado) setCargando(false); });
    console.log('Pidiendo usuario', id);
    return () => { cancelado = true; };
  }, [id]); // se vuelve a ejecutar cada vez que cambia id

  // Derivado: no necesita efecto ni estado
  const iniciales = usuario ? usuario.name.split(' ').map(p => p[0]).join('') : '';

  return (
    <>
      <button disabled={id === 1} onClick={() => setId(id - 1)}>Anterior</button>
      <span> Usuario {id} </span>
      <button disabled={id === 10} onClick={() => setId(id + 1)}>Siguiente</button>
      {cargando ? <p>Buscando datos…</p> : usuario && (
        <p><strong>{iniciales}</strong> · {usuario.name} · {usuario.email}</p>
      )}
    </>
  );
}`,
          hint: 'Hacé clic rápido varias veces en “Siguiente”: gracias a <code>cancelado</code>, nunca se muestra una respuesta vieja que llegó tarde.',
        },
      ],
      exercises: [
        {
          title: 'Simulación de fetch',
          level: 1,
          prompt: '<p>Simulá un fetch de datos en un <code>useEffect</code>. Mientras se está realizando, mostrá “Buscando datos”. Cuando termine, mostrá los datos obtenidos (una lista de especialidades). Agregá un botón “Recargar” que vuelva a disparar la búsqueda.</p>',
          hints: ['Para recargar, usá un estado <code>recarga</code> que sea dependencia del efecto y se incremente en el botón.'],
          solution: reactSol('<p>El efecto depende de <code>recarga</code>: cambiar ese número es la forma de pedirle a React que lo vuelva a ejecutar.</p>', `
import { useEffect, useState } from 'react';

const getSpecialties = () =>
  new Promise((resolve) => setTimeout(() => resolve(['Cardiología', 'Dermatología', 'Neurología']), 1000));

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recarga, setRecarga] = useState(0);

  useEffect(() => {
    setLoading(true);
    getSpecialties().then((result) => {
      setData(result);
      setLoading(false);
    });
  }, [recarga]);

  return (
    <>
      {loading ? <p>Buscando datos</p> : <ul>{data.map((d) => <li key={d}>{d}</li>)}</ul>}
      <button onClick={() => setRecarga(recarga + 1)} disabled={loading}>Recargar</button>
    </>
  );
}`),
        },
        {
          title: 'Título de la pestaña y tamaño de ventana',
          level: 2,
          prompt: '<p>Hacé un componente que: (1) ponga en el título de la pestaña “(N) Turnos pendientes” cada vez que cambie la cantidad de turnos; (2) muestre el ancho actual de la ventana y si es “móvil” (&lt; 600px) o “escritorio”, actualizándose al redimensionar. No te olvides de limpiar.</p>',
          solution: reactSol('<p>Dos efectos independientes, cada uno con sus dependencias: el del título depende de <code>pendientes</code>; el del resize se suscribe una vez y limpia el listener al desmontar. “Móvil o escritorio” es un dato derivado: no necesita estado propio.</p>', `
import { useEffect, useState } from 'react';

export default function App() {
  const [pendientes, setPendientes] = useState(3);
  const [ancho, setAncho] = useState(window.innerWidth);

  useEffect(() => {
    document.title = '(' + pendientes + ') Turnos pendientes';
  }, [pendientes]);

  useEffect(() => {
    const onResize = () => setAncho(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const esMovil = ancho < 600;

  return (
    <>
      <p>Pendientes: {pendientes} <button onClick={() => setPendientes(pendientes + 1)}>+1</button></p>
      <p>Ancho: {ancho}px ({esMovil ? 'móvil' : 'escritorio'})</p>
    </>
  );
}`),
        },
      ],
      sources: [
        { title: 'useEffect · React', url: 'https://es.react.dev/reference/react/useEffect', points: ['Sincroniza un componente con un sistema externo (red, APIs del navegador, librerías).', 'Recibe una función de configuración (que puede devolver una limpieza) y un array de dependencias.', 'Sin array corre después de cada render; con <code>[]</code>, solo al montar.', 'No usarlo para estado derivado. En modo estricto corre un ciclo extra en desarrollo.'] },
        { title: 'Quizás no necesites un Efecto · React', url: 'https://es.react.dev/learn/you-might-not-need-an-effect', points: ['Los efectos son una vía de escape para sincronizar con sistemas externos.', 'Errores comunes: transformar datos en efectos, manejar clics en efectos, cadenas de efectos, fetch sin limpieza (condiciones de carrera).', 'Alternativas: calcular en el render, <code>useMemo</code> para cálculos costosos, <code>key</code> para reiniciar estado.'] },
      ],
    },

    {
      id: 'hooks',
      module: 'react',
      title: 'Hooks: useRef, useContext, useReducer, useMemo y custom hooks',
      keywords: 'hooks usestate useeffect usecontext useref usereducer usememo usecallback custom hook context reglas',
      tldr: 'Los hooks son funciones que <mark>enganchan tus componentes</mark> a las capacidades de React: estado, efectos, contexto, referencias. Y podés crear los tuyos para reutilizar lógica entre componentes.',
      goals: ['Respetar las reglas de los hooks.', 'Usar useRef, useContext, useReducer y useMemo en su caso justo.', 'Extraer lógica a un custom hook.'],
      body: `
        <h2>Qué son</h2>
        <p>Son funciones especiales de React que permiten usar estado y otras características en componentes funcionales, sin escribir clases. “Hook” significa gancho: te permiten <em>enganchar</em> tus componentes a todo lo que ofrece React.</p>
        <h3>Reglas básicas</h3>
        <ol>
          <li>Solo se llaman en el <mark>nivel superior</mark> del componente: nunca dentro de <code>if</code>, bucles o funciones anidadas. React los identifica por el orden en que se llaman en cada render.</li>
          <li>Solo se usan en componentes funcionales o en otros custom hooks.</li>
        </ol>
        ${table(['Hook', 'Uso principal', 'Ejemplo'], [
          ['<code>useState</code>', 'Estado local', '<code>const [count, setCount] = useState(0);</code>'],
          ['<code>useEffect</code>', 'Efectos secundarios (fetch, timers, suscripciones)', '<code>useEffect(() =&gt; {…}, []);</code>'],
          ['<code>useContext</code>', 'Acceder a valores globales con Context API', '<code>const user = useContext(UserContext);</code>'],
          ['<code>useRef</code>', 'Referenciar elementos o valores mutables sin disparar un render', '<code>const inputRef = useRef(null);</code>'],
          ['<code>useReducer</code>', 'Estado complejo con múltiples acciones (alternativa a useState)', '<code>const [state, dispatch] = useReducer(reducer, initState);</code>'],
          ['<code>useMemo</code>', 'Memorizar valores calculados', '<code>const total = useMemo(() =&gt; calc(items), [items]);</code>'],
          ['<code>useCallback</code>', 'Memorizar funciones para evitar renders innecesarios', '<code>const handleClick = useCallback(() =&gt; {…}, []);</code>'],
        ])}

        <h2>useRef</h2>
        <p>Devuelve un objeto <code>{ current }</code> que <strong>persiste entre renders</strong> y que, al cambiar, <strong>no provoca un render</strong>. Dos usos:</p>
        ${code('jsx', `// 1. Acceder a un elemento del DOM
const inputRef = useRef(null);
<input ref={inputRef} />
<button onClick={() => inputRef.current.focus()}>Enfocar</button>

// 2. Guardar un valor que no se muestra (el id de un intervalo, un contador interno)
const intervalo = useRef(null);
intervalo.current = setInterval(tick, 1000);`)}
        ${note('No leas ni escribas <code>ref.current</code> mientras renderizás (en el cuerpo del componente): hacelo en manejadores de eventos o efectos. Y no esperes que cambiar una ref actualice la pantalla: para eso está el estado.')}

        <h2>useContext y la Context API</h2>
        <p>Pasar props por cinco niveles para que llegue el usuario logueado al último componente se vuelve tedioso (“prop drilling”). Un <strong>contexto</strong> pone un valor a disposición de todo un subárbol: cualquier componente de adentro lo lee con <code>useContext</code>.</p>
        ${code('jsx', `import { createContext, useContext, useState } from 'react';

// 1. Crear el contexto
const ThemeContext = createContext('claro');

// 2. Proveerlo arriba en el árbol
function App() {
  const [tema, setTema] = useState('claro');
  return (
    <ThemeContext.Provider value={{ tema, setTema }}>
      <Pagina />
    </ThemeContext.Provider>
  );
}

// 3. Leerlo donde haga falta, sin pasar props
function BotonTema() {
  const { tema, setTema } = useContext(ThemeContext);
  return <button onClick={() => setTema(tema === 'claro' ? 'oscuro' : 'claro')}>{tema}</button>;
}`)}
        ${note('<strong>Errores comunes:</strong> poner el Provider en el mismo componente que llama a <code>useContext</code> (o debajo): el hook busca el Provider más cercano <em>hacia arriba</em>. Y olvidarse de la prop <code>value</code> (o escribirla con otro nombre), que da <code>undefined</code>. Lo vas a usar en serio para las rutas privadas.', 'warn')}
        ${lab(0)}

        <h2>useReducer</h2>
        <p>Cuando el estado tiene muchas formas de cambiar (agregar, quitar, vaciar, cambiar cantidad…), conviene centralizar esa lógica en una función <strong>reducer</strong>: recibe el estado actual y una acción, y devuelve el estado nuevo.</p>
        ${code('jsx', `function carritoReducer(state, action) {
  switch (action.type) {
    case 'agregar': return [...state, action.producto];
    case 'quitar':  return state.filter(p => p.id !== action.id);
    case 'vaciar':  return [];
    default: throw new Error('Acción desconocida: ' + action.type);
  }
}

const [carrito, dispatch] = useReducer(carritoReducer, []);
dispatch({ type: 'agregar', producto });`)}

        <h2>useMemo y useCallback</h2>
        <p>Optimizaciones: <code>useMemo</code> recuerda el <strong>resultado</strong> de un cálculo costoso y solo lo rehace si cambian sus dependencias; <code>useCallback</code> recuerda una <strong>función</strong> entre renders. No los uses por defecto: solo cuando midas un problema de rendimiento.</p>

        <h2>Custom hooks</h2>
        <p>Son funciones de JavaScript que usan hooks de React y encapsulan lógica reutilizable. Su nombre <mark>debe empezar con use</mark> seguido de mayúscula (<code>useFetch</code>, <code>useForm</code>, <code>useAuth</code>). Permiten separar la lógica de negocio de la interfaz.</p>
        <p>Comparten <strong>lógica</strong>, no <strong>estado</strong>: cada componente que llama a <code>useFetch</code> tiene su propio estado independiente.</p>
        ${code('jsx', `function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelado = false;
    setLoading(true);
    fetch(url)
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(d => { if (!cancelado) setData(d); })
      .catch(e => { if (!cancelado) setError(e.message); })
      .finally(() => { if (!cancelado) setLoading(false); });
    return () => { cancelado = true; };
  }, [url]);

  return { data, loading, error };
}

// En cualquier componente:
const { data, loading, error } = useFetch('/api/productos');`)}
        ${lab(1)}
      `,
      labs: [
        {
          mode: 'react',
          title: 'useRef y useContext',
          jsx: `
import { createContext, useContext, useRef, useState } from 'react';

const ThemeContext = createContext(null);

function Pagina() {
  return (
    <div>
      <Titulo />
      <Formulario />
      <BotonTema />
    </div>
  );
}

function Titulo() {
  const { tema } = useContext(ThemeContext);   // sin props: lo lee del contexto
  return <h2>Tema actual: {tema}</h2>;
}

function BotonTema() {
  const { tema, setTema } = useContext(ThemeContext);
  return <button onClick={() => setTema(tema === 'claro' ? 'oscuro' : 'claro')}>Cambiar tema</button>;
}

function Formulario() {
  const inputRef = useRef(null);
  const renders = useRef(0);
  renders.current++;   // cambia sin provocar un render (solo para mostrar el concepto)
  return (
    <p>
      <input ref={inputRef} placeholder="Nombre" />{' '}
      <button onClick={() => inputRef.current.focus()}>Enfocar</button>{' '}
      <small>renders: {renders.current}</small>
    </p>
  );
}

export default function App() {
  const [tema, setTema] = useState('claro');
  return (
    <ThemeContext.Provider value={{ tema, setTema }}>
      <div className={tema}>
        <Pagina />
      </div>
    </ThemeContext.Provider>
  );
}`,
          css: `.claro { background:white; color:#1f2a2e; padding:12px; } .oscuro { background:#1b2128; color:#dfe5e8; padding:12px; }`,
          hint: '<code>Titulo</code> y <code>BotonTema</code> no reciben props: el tema les llega por el contexto, sin pasar por <code>Pagina</code>.',
        },
        {
          mode: 'react',
          title: 'Custom hooks: useFetch y useLocalStorage',
          jsx: `
import { useEffect, useState } from 'react';

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    let cancelado = false;
    setLoading(true);
    setError(null);
    fetch(url)
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(d => { if (!cancelado) setData(d); })
      .catch(e => { if (!cancelado) setError(e.message); })
      .finally(() => { if (!cancelado) setLoading(false); });
    return () => { cancelado = true; };
  }, [url]);
  return { data, loading, error };
}

// Como useState, pero recuerda el valor en localStorage
function useLocalStorage(key, inicial) {
  const [valor, setValor] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) ?? inicial; } catch { return inicial; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(valor)); } catch {}
  }, [key, valor]);
  return [valor, setValor];
}

export default function App() {
  const [userId, setUserId] = useLocalStorage('userId', 1);
  const { data, loading, error } = useFetch('https://jsonplaceholder.typicode.com/users/' + userId + '/todos?_limit=4');

  return (
    <>
      <label>Usuario <input type="number" min="1" max="10" value={userId} onChange={e => setUserId(Number(e.target.value))} /></label>
      {loading && <p>Buscando datos…</p>}
      {error && <p>Error: {error}</p>}
      {data && <ul>{data.map(t => <li key={t.id}>{t.completed ? '✔' : '○'} {t.title}</li>)}</ul>}
    </>
  );
}`,
          hint: 'El componente no sabe nada de fetch ni de localStorage: esa lógica vive en los hooks y se puede reutilizar en cualquier pantalla.',
        },
      ],
      exercises: [
        {
          title: 'Carrito con useReducer',
          level: 2,
          prompt: '<p>Reescribí el carrito de la lección de props y estado usando <code>useReducer</code>, con las acciones <code>agregar</code>, <code>restar</code> y <code>vaciar</code>. El componente solo debe hacer <code>dispatch</code>.</p>',
          solution: reactSol('<p>Toda la lógica de cómo cambia el carrito queda en una función pura, fácil de leer y de testear. El componente solo describe la interfaz y despacha acciones.</p>', `
import { useReducer } from 'react';

const productos = [
  { id: 1, nombre: 'Mouse', precio: 12000 },
  { id: 2, nombre: 'Teclado', precio: 25000 },
];

function carritoReducer(state, action) {
  switch (action.type) {
    case 'agregar': {
      const existe = state.find(i => i.id === action.producto.id);
      if (!existe) return [...state, { ...action.producto, cantidad: 1 }];
      return state.map(i => (i.id === action.producto.id ? { ...i, cantidad: i.cantidad + 1 } : i));
    }
    case 'restar':
      return state
        .map(i => (i.id === action.id ? { ...i, cantidad: i.cantidad - 1 } : i))
        .filter(i => i.cantidad > 0);
    case 'vaciar':
      return [];
    default:
      throw new Error('Acción desconocida: ' + action.type);
  }
}

export default function App() {
  const [carrito, dispatch] = useReducer(carritoReducer, []);
  const total = carrito.reduce((a, i) => a + i.precio * i.cantidad, 0);

  return (
    <>
      {productos.map(p => (
        <button key={p.id} onClick={() => dispatch({ type: 'agregar', producto: p })}>+ {p.nombre}</button>
      ))}
      <ul>
        {carrito.map(i => (
          <li key={i.id}>
            {i.nombre} × {i.cantidad} <button onClick={() => dispatch({ type: 'restar', id: i.id })}>−</button>
          </li>
        ))}
      </ul>
      <p>Total: \${total} <button onClick={() => dispatch({ type: 'vaciar' })}>Vaciar</button></p>
    </>
  );
}`),
        },
        {
          title: 'Custom hook useToggle y useOnlineStatus',
          level: 2,
          prompt: '<p>Creá dos custom hooks: <code>useToggle(inicial)</code> que devuelva <code>[valor, alternar]</code>, y <code>useOnlineStatus()</code> que devuelva si hay conexión escuchando los eventos <code>online</code> y <code>offline</code> de la ventana. Usalos en un componente que muestre un menú desplegable y un indicador de conexión.</p>',
          solution: reactSol('<p>Cada hook encapsula su propia lógica con hooks de React. <code>useOnlineStatus</code> se suscribe en un efecto y se desuscribe en la limpieza. (Para probar el offline: DevTools → Network → Offline).</p>', `
import { useCallback, useEffect, useState } from 'react';

function useToggle(inicial = false) {
  const [valor, setValor] = useState(inicial);
  const alternar = useCallback(() => setValor(v => !v), []);
  return [valor, alternar];
}

function useOnlineStatus() {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);
  return online;
}

export default function App() {
  const [abierto, alternar] = useToggle();
  const online = useOnlineStatus();

  return (
    <>
      <p>{online ? '🟢 Conectado' : '🔴 Sin conexión'}</p>
      <button onClick={alternar}>{abierto ? 'Cerrar menú' : 'Abrir menú'}</button>
      {abierto && <ul><li>Panel</li><li>Pacientes</li></ul>}
    </>
  );
}`),
        },
      ],
      sources: [
        { title: 'Hooks integrados · React', url: 'https://es.react.dev/reference/react/hooks', points: ['De estado (<code>useState</code>, <code>useReducer</code>): recordar información.', 'De contexto (<code>useContext</code>): recibir datos de un padre lejano sin props.', 'Ref (<code>useRef</code>): guardar información que no se usa para renderizar.', 'De efecto (<code>useEffect</code>): sincronizar con sistemas externos.', 'De rendimiento (<code>useMemo</code>, <code>useCallback</code>, <code>useTransition</code>).'] },
        { title: 'useRef · React', url: 'https://es.react.dev/reference/react/useRef', points: ['Devuelve un objeto con una única propiedad <code>current</code>.', 'Cambiar una ref no provoca un render.', 'Se usa para valores mutables entre renders y para manipular el DOM.', 'No leer ni escribir <code>ref.current</code> durante el render.'] },
        { title: 'useContext · React', url: 'https://es.react.dev/reference/react/useContext', points: ['Lee y se suscribe a un contexto desde un componente.', 'Busca el Provider más cercano hacia arriba en el árbol.', 'Errores comunes: el Provider debajo del componente que lo usa, u olvidar la prop <code>value</code>.'] },
        { title: 'Reutilizar la lógica con Hooks personalizados · React', url: 'https://es.react.dev/learn/reusing-logic-with-custom-hooks', points: ['Permiten reutilizar lógica entre componentes.', 'Su nombre empieza con <code>use</code> seguido de mayúscula.', 'Comparten lógica con estado, pero no el estado en sí.', 'Error común: poner <code>use</code> a funciones que no usan hooks.'] },
        { title: 'React.js Wiki', url: 'https://www.reactjs.wiki/', points: ['Preguntas y respuestas de React en español, por nivel: principiante, intermedio, experto y errores típicos.', 'Útil para repasar antes de un parcial o una entrevista.'] },
      ],
    },
  );
})();
