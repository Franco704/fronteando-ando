/* Resumen conceptual (#/conceptual): la teoría de las Unidades IV y V para leer de corrido.
   Mismo formato que resumen.js: { unit, items: [{ id, lesson, title, html }] }. */
import { code, table, note } from '../temario/redaccion.js';
  const P = '<strong>(salió en el parcial)</strong>';

  export const CONCEPTUAL = [
    {
      unit: 'Unidad IV: la web, HTML, CSS y JavaScript',
      items: [
        {
          id: 'web', lesson: 'como-funciona-la-web', title: '1. Cómo funciona una petición web',
          html: `<ol>
<li><strong>DNS</strong> traduce el nombre de dominio a una <strong>dirección IP</strong>. Es el primer paso ${P}.</li>
<li>Se abre la conexión con <strong>TCP</strong>. Si es HTTPS, se suma <strong>TLS</strong>, que cifra.</li>
<li>El navegador envía la <strong>petición HTTP</strong>: método (GET lee, POST crea, PUT/PATCH modifica, DELETE borra), URL, headers y cuerpo.</li>
<li>Llega la <strong>respuesta</strong>: código de estado, headers y cuerpo (HTML o JSON).</li>
<li>El navegador <strong>parsea y renderiza</strong>: el HTML se convierte en DOM, aplica el CSS y ejecuta el JS.</li>
</ol>
<ul>
<li>HTTP es <strong>sin estado</strong>: cada petición es independiente. Para "recordar" al usuario se usan cookies, sesiones o tokens.</li>
<li>Códigos de estado: <strong>2xx</strong> éxito · <strong>3xx</strong> redirección · <strong>4xx</strong> error del <em>cliente</em> (401 = no autenticado, 403 = sin permiso, 404 = no existe) · <strong>5xx</strong> error del <em>servidor</em> (500).</li>
<li>Partes de una URL: protocolo, dominio, puerto, ruta, <code>?query</code> y <code>#fragmento</code>. El fragmento no viaja al servidor.</li>
</ul>`,
        },
        {
          id: 'render', lesson: 'frontend-y-renderizado', title: '2. Tipos de renderizado',
          html: table(['', 'Qué hace'], [
            ['<strong>SSR</strong>', 'El servidor arma el HTML en cada petición. Bueno para SEO.'],
            ['<strong>CSR</strong>', 'Llega un HTML casi vacío y el JS arma la página en el navegador.'],
            ['<strong>SPA</strong>', 'Un solo HTML; el JS cambia las vistas sin recargar (React + Router).'],
            ['<strong>MPA</strong>', 'Cada navegación pide un HTML nuevo.'],
            ['<strong>SSG</strong>', 'Los HTML se generan en el build.'],
            ['<strong>PWA</strong>', 'Web instalable que funciona offline (service worker).'],
          ]),
        },
        {
          id: 'html', lesson: 'html-semantico', title: '3. HTML',
          html: `<ul>
<li>Las etiquetas <strong>semánticas</strong> (<code>header</code>, <code>nav</code>, <code>main</code>, <code>section</code>, <code>article</code>, <code>footer</code>) dan significado, lo que mejora la accesibilidad y el SEO. Visualmente no cambian nada.</li>
<li><code>&lt;label for="x"&gt;</code> se asocia al input con <code>id="x"</code>. El dato se envía con la clave <code>name</code>.</li>
<li>Validación nativa: <code>required</code>, <code>minlength</code>, <code>pattern</code>, <code>type="email"</code>.</li>
<li>Elementos de <strong>bloque</strong> (<code>div</code>, <code>p</code>) ocupan todo el ancho; los <strong>en línea</strong> (<code>span</code>, <code>a</code>) no.</li>
</ul>`,
        },
        {
          id: 'css', lesson: 'css-cascada', title: '4. CSS',
          html: `<p><strong>Especificidad</strong>, de mayor a menor ${P}:</p>
<p><code>!important</code> &gt; estilo en línea &gt; <code>#id</code> &gt; <code>.clase</code>, <code>[atributo]</code>, <code>:pseudoclase</code> &gt; elemento, <code>::pseudoelemento</code> &gt; <code>*</code></p>
<ul>
<li>Se compara nivel por nivel: un ID le gana a cualquier cantidad de clases.</li>
<li>Si empatan, gana la regla que aparece <strong>última</strong> (eso es la cascada).</li>
</ul>
<p><strong>Modelo de caja</strong>: contenido → padding → borde → margin. Con <code>box-sizing: border-box</code>, el <code>width</code> incluye padding y borde.</p>
<p><strong>Unidades</strong>: <code>rem</code> es relativo a la fuente de <code>html</code> · <code>em</code> a la fuente del padre · <code>%</code> al padre · <code>vw</code>/<code>vh</code> a la ventana.</p>
${table(['position', 'Se ubica respecto de'], [
  ['relative', 'Su propia posición normal'],
  ['absolute', 'El ancestro posicionado más cercano, y sale del flujo'],
  ['fixed', 'La ventana'],
  ['sticky', 'Se comporta normal hasta llegar al borde al hacer scroll, y ahí se pega'],
])}
<p><strong>Layout</strong>: <strong>Flexbox</strong> trabaja en una dimensión (<code>justify-content</code> alinea en el eje principal y <code>align-items</code> en el cruzado). <strong>Grid</strong> trabaja en dos dimensiones.</p>
<p><strong>Mobile First</strong> ${P}: los estilos base son para el celular, y se agranda con <code>@media (min-width: …)</code>. Desktop First usa <code>max-width</code>. Sin <code>&lt;meta name="viewport"&gt;</code> el diseño no se adapta en el celular.</p>`,
        },
        {
          id: 'js', lesson: 'js-fundamentos', title: '5. JavaScript',
          html: `${table(['', 'Alcance', '¿Se puede reasignar?', 'Si se usa antes de declararla'], [
  ['<code>var</code>', 'función', 'sí', '<code>undefined</code> (hoisting)'],
  ['<code>let</code>', 'bloque', 'sí', 'ReferenceError (zona muerta temporal)'],
  ['<code>const</code>', 'bloque', 'no', 'ReferenceError (zona muerta temporal)'],
])}
<ul>
<li><code>const</code> no congela el objeto: se pueden cambiar sus propiedades. Para congelarlo existe <code>Object.freeze</code>.</li>
<li><code>===</code> compara valor y tipo; <code>==</code> convierte los tipos antes de comparar.</li>
<li>Los primitivos se copian <strong>por valor</strong>; los objetos y arrays <strong>por referencia</strong>.</li>
<li><strong>Falsy</strong>: <code>false, 0, "", null, undefined, NaN</code>. Todo lo demás es truthy, incluidos <code>[]</code> y <code>{}</code>.</li>
<li>Las <strong>arrow functions</strong> no tienen <code>this</code> propio. Un <strong>closure</strong> es una función que recuerda el ámbito donde se creó.</li>
<li><code>map</code>, <code>filter</code>, <code>find</code> y <code>reduce</code> devuelven algo nuevo sin tocar el original. <code>push</code>, <code>pop</code>, <code>splice</code> y <code>sort</code> <strong>mutan</strong> el array.</li>
</ul>`,
        },
        {
          id: 'dom', lesson: 'eventos', title: '6. DOM, eventos y asincronía',
          html: `<ul>
<li><strong>DOMContentLoaded</strong> se dispara cuando el HTML está parseado y el DOM listo. <strong>load</strong> espera además imágenes, CSS e iframes. DOMContentLoaded ocurre primero ${P}.</li>
<li><code>&lt;script defer&gt;</code> ejecuta con el DOM listo y respeta el orden. <code>async</code> ejecuta apenas termina de descargar, sin orden.</li>
<li><strong>Bubbling</strong>: el evento sube por los ancestros. En eso se basa la delegación de eventos (se lee <code>e.target</code>).</li>
<li><code>preventDefault()</code> cancela la acción del navegador. <code>stopPropagation()</code> frena la subida del evento.</li>
<li><code>innerHTML</code> interpreta HTML (riesgo de XSS); <code>textContent</code> inserta solo texto.</li>
<li><strong>Event loop</strong>: primero el código sincrónico, después <strong>todas</strong> las microtareas (<code>.then</code>, <code>await</code>) y luego <strong>una</strong> macrotarea (<code>setTimeout</code>).</li>
<li>Una promesa pasa de <em>pending</em> a <em>fulfilled</em> o <em>rejected</em>. <code>Promise.all</code> falla con la primera promesa que falle; <code>allSettled</code> espera a todas.</li>
</ul>
${code('js', `console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");
// A D C B`)}`,
        },
        {
          id: 'store', lesson: 'almacenamiento', title: '7. Almacenamiento en el navegador',
          html: `${table(['', 'Capacidad', 'Dura', '¿Viaja al servidor?'], [
  ['Cookies', '~4 KB', 'hasta que expira', '<strong>sí</strong>, en cada petición'],
  ['localStorage', '~5–10 MB', 'hasta que se borra', 'no'],
  ['sessionStorage', '~5 MB', 'hasta cerrar la pestaña', 'no'],
  ['<strong>IndexedDB</strong>', '<strong>la mayor</strong>', 'hasta que se borra', 'no'],
])}
<p><strong>IndexedDB</strong> es la de mayor capacidad y la única que guarda <strong>objetos complejos</strong> de forma nativa ${P}. Las demás guardan solo strings, por eso se usa <code>JSON.stringify</code> / <code>JSON.parse</code>.</p>`,
        },
      ],
    },
    {
      unit: 'Unidad V: entorno y React',
      items: [
        {
          id: 'npm', lesson: 'node-npm', title: '8. Node, npm y Vite',
          html: `<ul>
<li><strong>Node</strong> ejecuta JS fuera del navegador; <strong>npm</strong> es el gestor de paquetes.</li>
<li><code>dependencies</code> van al producto final; <code>devDependencies</code> (<code>npm i -D</code>) solo se usan para desarrollar.</li>
<li><code>package-lock.json</code> fija las versiones exactas y <strong>se sube</strong> al repo; <code>node_modules</code> no se sube.</li>
<li><strong>Semver</strong> MAJOR.MINOR.PATCH: <code>^1.2.3</code> acepta 1.x.x; <code>~1.2.3</code> solo 1.2.x.</li>
<li><strong>Vite</strong>: <code>npm run dev</code> levanta el servidor con HMR (recarga instantánea); <code>npm run build</code> genera <code>dist/</code> para producción.</li>
</ul>`,
        },
        {
          id: 'jsx', lesson: 'react-componentes-jsx', title: '9. React: componentes, JSX y Virtual DOM',
          html: `<ul>
<li>Un componente es una <strong>función con nombre en mayúscula</strong> que devuelve JSX, con <strong>un solo elemento raíz</strong> (o un Fragment <code>&lt;&gt;…&lt;/&gt;</code>).</li>
<li>JSX usa <code>className</code>, <code>htmlFor</code>, eventos en camelCase (<code>onClick</code>), <code>style={{…}}</code> y <code>{expresión}</code> para JS.</li>
<li><strong>Virtual DOM</strong>: es una copia del DOM en memoria. Cuando cambia el estado, React arma un árbol nuevo, lo compara con el anterior (<strong>reconciliación</strong>) y aplica al DOM real solo las diferencias.</li>
<li><strong>key</strong> en las listas: tiene que ser única y estable (el id, no el índice).</li>
</ul>`,
        },
        {
          id: 'estado', lesson: 'props-state', title: '10. Props, estado y hooks',
          html: `<ul>
<li>Las <strong>props</strong> vienen del padre y son de solo lectura. El <strong>estado</strong> es interno, y cambiarlo provoca un nuevo render.</li>
<li>El flujo de datos es <strong>unidireccional</strong> (de padre a hijo). Para avisarle al padre, el hijo recibe una función por props. Si dos hermanos comparten un dato, se <strong>eleva el estado</strong> al padre común.</li>
<li><strong>Inmutabilidad</strong>: nunca se modifica el estado directamente. Se crea uno nuevo con <code>[...lista, x]</code>, <code>filter</code>, <code>map</code> o <code>{...obj}</code>. Si el nuevo valor depende del anterior: <code>setN(prev =&gt; prev + 1)</code>.</li>
</ul>
${table(['useEffect con…', 'Corre'], [
  ['sin array de dependencias', 'después de cada render'],
  ['<code>[]</code>', 'una sola vez al montar (ahí va la carga inicial de datos)'],
  ['<code>[a]</code>', 'al montar y cada vez que cambia <code>a</code>'],
])}
<p>El <code>return</code> del efecto es la limpieza. <code>useRef</code> guarda un valor que puede cambiar sin re-renderizar, o una referencia a un nodo del DOM. <code>useContext</code> lee un valor global sin pasar props.</p>
${note('<strong>Reglas de los hooks.</strong> Solo en el nivel superior del componente (nunca dentro de un <code>if</code> o un bucle), y los custom hooks empiezan con <code>use</code>.')}`,
        },
        {
          id: 'rhf', lesson: 'react-hook-form', title: '11. react-hook-form',
          html: `<p>Salió en el parcial dos veces: cómo registrar un campo obligatorio y dónde están los errores.</p>
${code('jsx', `const { register, handleSubmit, formState: { errors } } = useForm();
<input {...register("email", { required: "Obligatorio" })} />
{errors.email && <p>{errors.email.message}</p>}`)}
<ul>
<li>El campo se registra con <code>{...register("nombre", reglas)}</code>. Las reglas posibles son <code>required</code>, <code>minLength</code>, <code>maxLength</code>, <code>pattern</code> y <code>validate</code>.</li>
<li>Los errores están en <strong><code>formState.errors</code></strong>.</li>
<li><code>handleSubmit</code> hace el <code>preventDefault</code>, valida y <strong>solo si todo pasa</strong> llama a <code>onSubmit(data)</code>.</li>
<li>RHF trabaja con inputs <strong>no controlados</strong>: el valor vive en el DOM y se lee con refs. Un input controlado, en cambio, usa <code>value</code> + <code>onChange</code>.</li>
</ul>`,
        },
        {
          id: 'atomic', lesson: 'arquitectura', title: '12. Atomic Design (Brad Frost)',
          html: `<p><strong>Átomo</strong> (Button, Input) → <strong>Molécula</strong> (buscador = label + input + botón) → <strong>Organismo</strong> (Header, tabla) → <strong>Plantilla</strong> (el esqueleto, sin datos) → <strong>Página</strong> (la plantilla con datos reales).</p>`,
        },
        {
          id: 'tw', lesson: 'tailwind', title: '13. Tailwind',
          html: `<ul>
<li><strong>Utility-first</strong> ${P}: se combinan clases chicas de un solo propósito (<code>flex p-4 text-center</code>) en lugar de escribir CSS propio. No trae componentes armados; eso es Bootstrap.</li>
<li>Es Mobile First: la clase sin prefijo aplica al celular y <code>md:</code> desde 768px en adelante (min-width). Breakpoints: sm 640 · md 768 · lg 1024 · xl 1280.</li>
</ul>`,
        },
        {
          id: 'router', lesson: 'react-router', title: '14. React Router',
          html: `<ul>
<li><code>&lt;Link to&gt;</code> navega sin recargar la página. Un <code>&lt;a href&gt;</code> recarga todo.</li>
<li><code>useNavigate()</code> navega desde el código; <code>useParams()</code> lee el <code>:id</code> de la URL (siempre llega como string).</li>
<li><code>&lt;Outlet /&gt;</code> es el lugar donde se dibuja la ruta hija dentro del layout.</li>
<li><strong>Ruta privada</strong>: si no hay token, <code>&lt;Navigate to="/login" replace /&gt;</code>.</li>
</ul>`,
        },
        {
          id: 'axios', lesson: 'axios-api', title: '15. Axios vs fetch',
          html: `<ul>
<li><strong>Axios rechaza la promesa</strong> ante cualquier status fuera de 2xx: un <strong>500 cae en el <code>catch</code></strong> ${P} y el código se lee en <code>error.response.status</code>. Además, el JSON ya viene parseado en <code>res.data</code>.</li>
<li><strong>fetch</strong> solo rechaza si falla la red. Ante un 404 o un 500 la promesa se resuelve igual, así que hay que revisar <code>res.ok</code> y hacer <code>await res.json()</code>.</li>
<li><code>axios.create({ baseURL })</code> crea una instancia con la URL base. Con los <strong>interceptores</strong> de request se agrega el <code>Authorization: Bearer token</code> a todas las peticiones, y con los de response se maneja un 401 mandando al login.</li>
</ul>
${note('<strong>Antes de entrar, repasá:</strong> especificidad, DNS, IndexedDB, load vs DOMContentLoaded, Mobile First con min-width, utility-first, <code>register</code> + <code>required</code>, Axios ante un 500 y <code>formState.errors</code>. Esas fueron las preguntas del parcial real, así que pueden aparecer variantes.', 'warn')}`,
        },
      ],
    },
  ];
