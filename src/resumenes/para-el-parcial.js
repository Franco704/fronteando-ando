/* Resumen para el parcial (#/resumen): lo que hay que saber sí o sí, tema por tema.
   Cada ficha: { id, lesson (lección para repasar), title, html }. */
import { code, table, note } from '../temario/redaccion.js';

  export const RESUMEN = [
    {
      unit: 'Unidad IV: la web, HTML, CSS y JavaScript',
      items: [
        {
          id: 'web', lesson: 'como-funciona-la-web', title: 'Cómo funciona una petición web',
          html: `<ol>
<li><strong>DNS</strong>: traduce el dominio a una IP. Es el primer paso.</li>
<li><strong>TCP</strong> (+ <strong>TLS</strong> si es HTTPS, que cifra): se abre la conexión.</li>
<li><strong>Petición HTTP</strong>: método (GET, POST, PUT, DELETE), URL, headers y cuerpo.</li>
<li><strong>Respuesta</strong>: código de estado + headers + cuerpo (HTML, JSON…).</li>
<li>El navegador <strong>parsea y renderiza</strong>: HTML → DOM, CSS → estilos, ejecuta JS.</li>
</ol>
<p>HTTP es <strong>sin estado</strong>: cada petición es independiente. Para "recordar" al usuario se usan cookies, sesiones o tokens.</p>
${table(['Familia', 'Significa', 'Ejemplos'], [
  ['2xx', 'Éxito', '200 OK, 201 Created, 204 No Content'],
  ['3xx', 'Redirección', '301, 304 Not Modified'],
  ['4xx', 'Error del <strong>cliente</strong>', '400, 401 sin autenticar, 403 sin permiso, 404'],
  ['5xx', 'Error del <strong>servidor</strong>', '500, 503'],
])}
<p>URL: <code>https://</code> protocolo · <code>api.clinica.com</code> dominio · <code>:8080</code> puerto · <code>/turnos</code> ruta · <code>?fecha=hoy</code> parámetros · <code>#lista</code> fragmento (no viaja al servidor).</p>`,
        },
        {
          id: 'render', lesson: 'frontend-y-renderizado', title: 'Tipos de renderizado',
          html: table(['Sigla', 'Qué hace', 'Para qué'], [
            ['SSR', 'El servidor arma el HTML completo en cada petición', 'Buen SEO, contenido que cambia seguido'],
            ['CSR', 'Llega un HTML casi vacío y JS arma la página en el navegador', 'Apps interactivas; peor SEO inicial'],
            ['SPA', 'Un solo HTML; JS cambia las vistas sin recargar', 'React + React Router'],
            ['MPA', 'Cada navegación pide un HTML nuevo', 'Sitios clásicos'],
            ['SSG', 'Los HTML se generan en el build', 'Blogs, documentación'],
            ['PWA', 'Web instalable, funciona offline (service worker)', 'Experiencia tipo app'],
          ]),
        },
        {
          id: 'html', lesson: 'html-semantico', title: 'HTML: semántica y formularios',
          html: `<ul>
<li>Etiquetas semánticas (<code>header</code>, <code>nav</code>, <code>main</code>, <code>section</code>, <code>article</code>, <code>aside</code>, <code>footer</code>): dan <strong>significado</strong> → accesibilidad y SEO. Se ven igual que un <code>div</code>.</li>
<li>Un solo <code>&lt;h1&gt;</code> y títulos en orden. <code>alt</code> en toda imagen.</li>
<li><code>&lt;label for="x"&gt;</code> se asocia al <code>id="x"</code> del input. El dato viaja con la clave <code>name</code>.</li>
<li>Validación nativa: <code>required</code>, <code>minlength</code>, <code>pattern</code>, <code>type="email"</code>.</li>
<li>Elemento de bloque (ocupa todo el ancho: <code>div</code>, <code>p</code>) vs. en línea (<code>span</code>, <code>a</code>).</li>
</ul>`,
        },
        {
          id: 'spec', lesson: 'css-cascada', title: 'CSS: especificidad y cascada',
          html: `<p>Prioridad, de mayor a menor (lo que preguntaron en el 2do parcial):</p>
${table(['', 'Selector', 'Peso'], [
  ['1', '<code>!important</code>', 'le gana a todo'],
  ['2', 'Estilo en línea <code>style=""</code>', '1,0,0,0'],
  ['3', 'ID <code>#menu</code>', '0,1,0,0'],
  ['4', 'Clase <code>.item</code>, atributo <code>[type]</code>, pseudoclase <code>:hover</code>', '0,0,1,0'],
  ['5', 'Elemento <code>li</code>, pseudoelemento <code>::before</code>', '0,0,0,1'],
])}
<p>Se compara columna por columna: un ID le gana a cualquier cantidad de clases. Con la misma especificidad, gana la regla que aparece <strong>última</strong>. El selector universal <code>*</code> pesa 0.</p>`,
        },
        {
          id: 'caja', lesson: 'modelo-de-caja', title: 'Modelo de caja, unidades y position',
          html: `<ul>
<li>Caja: <strong>contenido → padding → borde → margin</strong>.</li>
<li><code>box-sizing: border-box</code>: el <code>width</code> incluye padding y borde (no el margin). Por defecto (<code>content-box</code>) solo el contenido.</li>
<li><code>rem</code>: relativo a la fuente de <code>html</code>. <code>em</code>: relativo a la fuente del padre. <code>%</code>: del padre. <code>vw</code>/<code>vh</code>: de la ventana.</li>
</ul>
${table(['position', 'Se ubica respecto de'], [
  ['static', 'Flujo normal (por defecto; <code>top</code>/<code>left</code> no hacen nada)'],
  ['relative', 'Su propia posición normal (no sale del flujo)'],
  ['absolute', 'El ancestro posicionado más cercano; sale del flujo'],
  ['fixed', 'La ventana; queda fijo al hacer scroll'],
  ['sticky', 'Normal hasta que llega al borde al hacer scroll, ahí se pega'],
])}`,
        },
        {
          id: 'layout', lesson: 'flexbox', title: 'Flexbox, Grid y Mobile First',
          html: `<ul>
<li><strong>Flexbox</strong>: una dimensión (fila o columna). <code>justify-content</code> = eje principal, <code>align-items</code> = eje cruzado.</li>
<li><strong>Grid</strong>: dos dimensiones. <code>grid-template-columns: repeat(3, 1fr)</code>.</li>
<li><strong>Mobile First</strong>: estilos base para el celular y <code>@media (min-width: …)</code> para agrandar. Desktop First usa <code>max-width</code>.</li>
<li>Sin <code>&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;</code> el responsive no funciona en el celular.</li>
</ul>
${code('css', `.grilla { display: grid; gap: 1rem; }           /* celular: 1 columna */
@media (min-width: 768px) {
  .grilla { grid-template-columns: repeat(3, 1fr); } /* tablet en adelante */
}`)}`,
        },
        {
          id: 'js', lesson: 'js-fundamentos', title: 'JavaScript: variables, tipos y hoisting',
          html: `${table(['', 'Alcance', 'Reasignar', 'Antes de declararla'], [
  ['<code>var</code>', 'Función', 'Sí', '<code>undefined</code> (hoisting)'],
  ['<code>let</code>', 'Bloque', 'Sí', '<code>ReferenceError</code> (zona muerta temporal)'],
  ['<code>const</code>', 'Bloque', 'No', '<code>ReferenceError</code> (zona muerta temporal)'],
])}
<ul>
<li><code>const</code> no hace inmutable al objeto: <code>const o = {}; o.x = 1</code> funciona. Para congelarlo: <code>Object.freeze</code>.</li>
<li><code>===</code> compara valor y tipo; <code>==</code> convierte tipos. Usá siempre <code>===</code>.</li>
<li>Primitivos (string, number, boolean, null, undefined) se copian por valor; objetos y arrays por <strong>referencia</strong>.</li>
<li>Falsy: <code>false</code>, <code>0</code>, <code>""</code>, <code>null</code>, <code>undefined</code>, <code>NaN</code>. Todo lo demás es truthy (incluidos <code>[]</code> y <code>{}</code>).</li>
<li>JS corre en un motor (V8 en Chrome y Node) con <strong>un solo hilo</strong>.</li>
</ul>`,
        },
        {
          id: 'obj', lesson: 'js-objetos-funciones', title: 'Objetos, funciones y this',
          html: `<ul>
<li>Arrow function: no tiene su propio <code>this</code>, lo toma de donde fue definida. No sirve como método que usa <code>this</code>.</li>
<li><strong>Closure</strong>: una función recuerda las variables del ámbito donde se creó.</li>
<li>Spread <code>{ ...obj }</code> / <code>[...arr]</code>: copia <strong>superficial</strong> (lo anidado sigue compartido).</li>
<li>Desestructuración: <code>const { nombre, edad = 18 } = persona;</code> · <code>const [a, b] = lista;</code></li>
<li>Encadenamiento opcional <code>user?.dir?.calle</code> y valor por defecto <code>valor ?? "sin dato"</code>.</li>
</ul>`,
        },
        {
          id: 'arr', lesson: 'js-arrays', title: 'Métodos de array',
          html: table(['Método', 'Devuelve', '¿Modifica el original?'], [
            ['<code>map</code>', 'Array nuevo del mismo largo, transformado', 'No'],
            ['<code>filter</code>', 'Array nuevo con los que cumplen', 'No'],
            ['<code>find</code>', 'El primer elemento que cumple (o <code>undefined</code>)', 'No'],
            ['<code>reduce</code>', 'Un solo valor acumulado (pasale el valor inicial)', 'No'],
            ['<code>some</code> / <code>every</code>', '<code>true</code>/<code>false</code>', 'No'],
            ['<code>forEach</code>', '<code>undefined</code> (solo recorre)', 'No'],
            ['<code>push</code>, <code>pop</code>, <code>splice</code>, <code>sort</code>', 'Varía', '<strong>Sí</strong>, mutan'],
          ]),
        },
        {
          id: 'dom', lesson: 'eventos', title: 'DOM y eventos',
          html: `<ul>
<li><code>querySelector</code> → el primero (o <code>null</code>). <code>querySelectorAll</code> → NodeList estática (no es array).</li>
<li><strong><code>DOMContentLoaded</code></strong>: el HTML se parseó y el DOM está listo. <strong><code>load</code></strong>: además cargaron imágenes, CSS e iframes. Primero ocurre <code>DOMContentLoaded</code>.</li>
<li><code>&lt;script defer&gt;</code>: descarga en paralelo y ejecuta cuando el DOM está listo, en orden. <code>async</code>: ejecuta apenas descarga, sin orden.</li>
<li><strong>Bubbling</strong>: el evento sube por los ancestros. Permite la <strong>delegación</strong> (un listener en el padre, se usa <code>e.target</code>).</li>
<li><code>preventDefault()</code> cancela la acción del navegador (enviar el form, seguir el link). <code>stopPropagation()</code> frena la subida.</li>
<li><code>textContent</code> inserta texto; <code>innerHTML</code> interpreta HTML (cuidado con datos del usuario: XSS).</li>
</ul>`,
        },
        {
          id: 'async', lesson: 'asincronia', title: 'Event loop, promesas y fetch',
          html: `<p>Orden: <strong>código sincrónico → todas las microtareas (<code>.then</code>, lo que sigue a un <code>await</code>) → una macrotarea (<code>setTimeout</code>, eventos)</strong> → repetir.</p>
${code('js', `console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");
// A D C B`)}
<ul>
<li>Promesa: <em>pending</em> → <em>fulfilled</em> o <em>rejected</em>. <code>async</code> siempre devuelve una promesa.</li>
<li><code>Promise.all</code>: todas o falla con la primera que falle. <code>race</code>: la primera que termine. <code>allSettled</code>: todas, fallen o no.</li>
</ul>
${note('<strong>fetch vs. Axios ante un 404 o 500.</strong> <code>fetch</code> <em>resuelve</em> igual (solo rechaza si falla la red): hay que revisar <code>res.ok</code> y hacer <code>await res.json()</code>. Axios <em>rechaza</em> con cualquier status fuera de 2xx, entra al <code>catch</code> con <code>error.response.status</code>, y ya trae los datos parseados en <code>res.data</code>.', 'warn')}`,
        },
        {
          id: 'store', lesson: 'almacenamiento', title: 'Almacenamiento en el navegador',
          html: `${table(['', 'Capacidad', 'Dura', 'Viaja al servidor', 'Guarda'], [
  ['Cookies', '~4 KB', 'Hasta <code>expires</code> (o la sesión)', '<strong>Sí</strong>, en cada petición', 'Strings'],
  ['localStorage', '~5–10 MB', 'Hasta que se borre', 'No', 'Solo strings'],
  ['sessionStorage', '~5 MB', 'Hasta cerrar la pestaña', 'No', 'Solo strings'],
  ['IndexedDB', '<strong>La mayor</strong> (cientos de MB o más)', 'Hasta que se borre', 'No', '<strong>Objetos complejos</strong>, archivos'],
])}
${code('js', `localStorage.setItem("user", JSON.stringify(user)); // guardar un objeto
const user = JSON.parse(localStorage.getItem("user")); // leerlo`)}`,
        },
      ],
    },
    {
      unit: 'Unidad V: entorno y React',
      items: [
        {
          id: 'npm', lesson: 'node-npm', title: 'Node, npm y Vite',
          html: `<ul>
<li><strong>Node</strong>: ejecuta JS fuera del navegador. <strong>npm</strong>: gestor de paquetes.</li>
<li><code>package.json</code>: nombre, versión, <strong>scripts</strong> (<code>dev</code>, <code>build</code>) y dependencias. <code>dependencies</code> van al bundle final; <code>devDependencies</code> solo para desarrollar (<code>npm i -D</code>).</li>
<li><code>package-lock.json</code>: versiones exactas instaladas. Se sube al repo; <code>node_modules</code> no (se regenera con <code>npm install</code>).</li>
<li>Semver <code>MAJOR.MINOR.PATCH</code>: <code>^1.13.2</code> acepta 1.x.x ≥ 1.13.2; <code>~1.13.2</code> solo 1.13.x.</li>
<li><strong>Vite</strong>: bundler. <code>npm run dev</code> = servidor de desarrollo con recarga instantánea (HMR); <code>npm run build</code> = empaqueta para producción en <code>dist/</code>. Se crea con <code>npm create vite@latest</code>.</li>
</ul>`,
        },
        {
          id: 'jsx', lesson: 'react-componentes-jsx', title: 'Componentes, JSX y Virtual DOM',
          html: `<ul>
<li>Componente = función que empieza con mayúscula y devuelve JSX. Un solo elemento raíz (o un Fragment <code>&lt;&gt;…&lt;/&gt;</code>).</li>
<li>JSX: <code>className</code>, <code>htmlFor</code>, eventos en camelCase (<code>onClick</code>), <code>style={{ color: "red" }}</code>, toda etiqueta cerrada, <code>{expresión}</code> para JS.</li>
<li><strong>Virtual DOM</strong>: representación en memoria del DOM. "No es una API, es un concepto".</li>
<li><strong>Reconciliación</strong>: cambia el estado → nuevo árbol virtual → <em>diff</em> con el anterior → se aplican al DOM real solo los cambios. Si cambia el tipo de un elemento, se desmonta y remonta (pierde el estado).</li>
<li><code>key</code> en listas: única y estable (el id del dato, no el índice).</li>
</ul>`,
        },
        {
          id: 'estado', lesson: 'props-state', title: 'Props y estado',
          html: `<ul>
<li><strong>Props</strong>: vienen del padre, solo lectura. <strong>Estado</strong>: interno; cambiarlo con el setter vuelve a renderizar.</li>
<li>Datos de padre a hijo (unidireccional). El hijo avisa al padre con una función que recibe por props.</li>
<li>Si dos hermanos comparten un dato: <strong>elevar el estado</strong> al padre común.</li>
<li><strong>Inmutabilidad</strong>: nunca mutes el estado. Agregar <code>[...lista, x]</code>, quitar <code>filter</code>, editar <code>map</code>, objetos <code>{ ...obj, campo }</code>.</li>
<li>El setter no cambia la variable al instante: el valor nuevo se ve en el próximo render. Para depender del anterior: <code>setN(prev => prev + 1)</code>.</li>
</ul>`,
        },
        {
          id: 'hooks', lesson: 'hooks', title: 'Hooks y useEffect',
          html: `${table(['Dependencias', 'El efecto corre'], [
  ['Sin array', 'Después de <strong>cada</strong> render (con un setter adentro: bucle infinito)'],
  ['<code>[]</code>', 'Una vez, al montar (la carga inicial con Axios va acá)'],
  ['<code>[a, b]</code>', 'Al montar y cada vez que cambia <code>a</code> o <code>b</code>'],
])}
<p>El <code>return</code> del efecto es la <strong>limpieza</strong>: corre antes de repetir el efecto y al desmontar.</p>
${table(['Hook', 'Para qué'], [
  ['<code>useState</code>', 'Estado que, al cambiar, re-renderiza'],
  ['<code>useEffect</code>', 'Efectos secundarios: peticiones, timers, listeners'],
  ['<code>useRef</code>', 'Valor mutable o nodo del DOM; cambiarlo <strong>no</strong> re-renderiza'],
  ['<code>useContext</code>', 'Leer un valor global (Context API) sin pasar props'],
  ['<code>useMemo</code> / <code>useCallback</code>', 'Memorizar un valor / una función entre renders'],
  ['<code>useReducer</code>', 'Estado complejo con acciones'],
])}
${note('<strong>Reglas de los hooks.</strong> Solo en el nivel superior de un componente o custom hook (nunca en <code>if</code>, bucles ni funciones anidadas), y los custom hooks empiezan con <code>use</code>.')}`,
        },
        {
          id: 'rhf', lesson: 'react-hook-form', title: 'Formularios y react-hook-form',
          html: `<p><strong>Controlado</strong>: el valor vive en el estado (<code>value</code> + <code>onChange</code>). <strong>No controlado</strong>: el valor vive en el DOM y se lee con <code>ref</code> (así trabaja react-hook-form).</p>
${code('jsx', `const { register, handleSubmit, formState: { errors } } = useForm();

<form onSubmit={handleSubmit(onSubmit)}>
  <input {...register("email", { required: "Obligatorio" })} />
  {errors.email && <p>{errors.email.message}</p>}
</form>`)}
<ul>
<li><code>register(nombre, reglas)</code> se <strong>esparce</strong> en el input. Reglas: <code>required</code>, <code>minLength</code>, <code>maxLength</code>, <code>pattern</code>, <code>validate</code>.</li>
<li>Los errores están en <strong><code>formState.errors</code></strong> (<code>errors.campo.message</code>).</li>
<li><code>handleSubmit</code> hace el <code>preventDefault</code>, valida y solo si todo pasa llama a <code>onSubmit(data)</code>.</li>
<li>También: <code>reset()</code>, <code>watch("campo")</code>, <code>setValue</code>.</li>
</ul>`,
        },
        {
          id: 'atomic', lesson: 'arquitectura', title: 'Atomic Design',
          html: table(['Nivel', 'Qué es', 'Ejemplo'], [
            ['Átomo', 'Lo más chico e indivisible', 'Button, Input, Label, Icono'],
            ['Molécula', 'Átomos juntos con una función', 'Campo de búsqueda (Label + Input + Button)'],
            ['Organismo', 'Sección completa de la interfaz', 'Header, Sidebar, Footer, tabla de productos'],
            ['Plantilla', 'Esqueleto de la pantalla, sin datos reales', 'Layout del dashboard'],
            ['Página', 'La plantilla con contenido real', '<code>ProductsPage.jsx</code>'],
          ]) + '<p>Metodología de Brad Frost, inspirada en la química: interfaces modulares y reutilizables.</p>',
        },
        {
          id: 'tw', lesson: 'tailwind', title: 'Tailwind CSS',
          html: `<ul>
<li><strong>Utility-first</strong>: clases chicas de un solo propósito combinadas en el JSX (<code>flex p-4 text-center</code>) en vez de CSS propio. No trae componentes armados (eso es Bootstrap).</li>
<li><strong>Mobile First</strong>: la clase sin prefijo es para el celular; <code>md:flex</code> aplica desde 768px en adelante (<code>min-width</code>).</li>
<li>Breakpoints: <code>sm</code> 640 · <code>md</code> 768 · <code>lg</code> 1024 · <code>xl</code> 1280.</li>
<li>Estados: <code>hover:</code>, <code>focus:</code>, <code>disabled:</code>. Solo las clases usadas llegan al CSS final.</li>
</ul>`,
        },
        {
          id: 'router', lesson: 'react-router', title: 'React Router y rutas privadas',
          html: `${code('jsx', `<BrowserRouter>
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/" element={<RutaPrivada><Layout /></RutaPrivada>}>
      <Route index element={<Inicio />} />
      <Route path="medicos/:id" element={<Medico />} />
    </Route>
    <Route path="*" element={<NoEncontrado />} />
  </Routes>
</BrowserRouter>`)}
${table(['Pieza', 'Para qué'], [
  ['<code>&lt;Link to&gt;</code>', 'Navegar sin recargar (un <code>&lt;a href&gt;</code> recarga todo)'],
  ['<code>useNavigate()</code>', 'Navegar desde código, por ej. después del login'],
  ['<code>useParams()</code>', 'Leer <code>:id</code> de la URL (siempre string)'],
  ['<code>&lt;Outlet /&gt;</code>', 'Dónde se dibuja la ruta hija dentro del layout'],
  ['<code>&lt;Navigate to replace /&gt;</code>', 'Redirigir; base de la ruta privada'],
])}`,
        },
        {
          id: 'axios', lesson: 'axios-api', title: 'Axios',
          html: `${code('jsx', `const api = axios.create({ baseURL: "http://localhost:5000/api" });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = "Bearer " + token;
  return config;
});

useEffect(() => {
  api.get("/especialidades")
    .then((res) => setDatos(res.data))           // ya viene parseado
    .catch((err) => setError(err.response?.status)); // 4xx y 5xx caen acá
}, []);`)}
<ul>
<li>Rechaza ante cualquier status fuera de 2xx (fetch no). Convierte el JSON solo (<code>res.data</code>).</li>
<li><strong>Interceptores</strong>: de request para agregar el token a todas las peticiones; de response para manejar un 401 (mandar al login).</li>
</ul>`,
        },
      ],
    },
  ];
