/* Modelos de parcial: exámenes fijos con el estilo del profesor (multiple choice conceptual
   + algunas de código). Mismo formato que el banco: o[0] es la correcta (se mezclan al mostrarse),
   t = tema, d = 'f' conceptual | 'd' de código, c/l = código y lenguaje.
   Las preguntas también se suman al banco general (simulacro y práctica por tema). */
  const f = (t, q, o, e) => ({ t, d: 'f', q, o, e });
  const d = (t, q, c, o, e, l = 'js') => ({ t, d: 'd', q, c, l, o, e });

  export const MODELOS = [
    {
      id: 'real2', name: '2do parcial (reconstruido)', min: 15,
      desc: 'Las 10 preguntas del 2do parcial, armadas a partir de los enunciados que circularon. Las opciones son una reconstrucción: el enunciado es el real.',
      qs: [
        f('css', 'Dada la siguiente jerarquía de selectores CSS, ¿cuál establece la prioridad de la regla a aplicar a un elemento específico? (De mayor a menor prioridad).', [
          'Estilos en línea > ID > clase / atributo / pseudoclase > elemento / pseudoelemento',
          'ID > estilos en línea > clase / atributo / pseudoclase > elemento / pseudoelemento',
          'Clase / atributo / pseudoclase > ID > elemento / pseudoelemento > estilos en línea',
          'Elemento > clase > ID > estilos en línea, porque gana el selector más cercano al nodo',
        ], 'Especificidad (sin `!important`): `style=""` en línea (1,0,0,0) > `#id` (0,1,0,0) > `.clase`, `[atributo]`, `:hover` (0,0,1,0) > `div`, `::before` (0,0,0,1). Con empate gana la que aparece última. `!important` le gana a todo.'),
        f('web', '¿Cuál es la función principal del DNS (Domain Name System) en el ciclo de vida de una petición web?', [
          'Traducir el nombre de dominio a la dirección IP del servidor antes de abrir la conexión',
          'Cifrar la comunicación entre el navegador y el servidor para que la petición viaje por HTTPS',
          'Guardar en caché las respuestas HTTP del servidor para que la página cargue más rápido la próxima vez',
          'Interpretar el HTML recibido y construir el árbol DOM que se muestra en pantalla',
        ], 'El DNS es la "agenda" de internet: nombre → IP. Es el primer paso: DNS → conexión TCP (+TLS si es HTTPS) → petición HTTP → respuesta → renderizado. El cifrado lo hace TLS; el DOM lo arma el navegador.'),
        f('store', '¿Cuál de los siguientes mecanismos de almacenamiento del lado del cliente (`sessionStorage`, `localStorage`, Cookies, `IndexedDB`) ofrece la mayor capacidad de almacenamiento y soporta objetos complejos de manera nativa?', [
          '`IndexedDB`', '`localStorage`', '`sessionStorage`', 'Cookies',
        ], 'IndexedDB es una base de datos en el navegador: cientos de MB o más, guarda objetos, arrays, archivos (Blob) y tiene índices y transacciones. localStorage y sessionStorage guardan solo strings (~5–10 MB); las cookies ~4 KB y viajan en cada petición.'),
        f('dom', '¿Cuál es la diferencia fundamental entre los eventos `load` y `DOMContentLoaded` en JavaScript?', [
          '`DOMContentLoaded` se dispara con el DOM construido, sin esperar imágenes ni estilos; `load`, cuando cargaron todos los recursos',
          '`load` se dispara apenas el DOM está construido; `DOMContentLoaded`, cuando terminaron de cargar imágenes, estilos e iframes',
          'Son equivalentes: `DOMContentLoaded` es el nombre moderno de `load` y se recomienda por compatibilidad con los navegadores',
          '`DOMContentLoaded` se dispara cada vez que cambia el DOM con JavaScript; `load` una sola vez, al abrir la página',
        ], 'Orden: primero `DOMContentLoaded` (DOM construido) y después `load` en `window` (imágenes, CSS, iframes cargados). Para manipular el DOM alcanza con `DOMContentLoaded` (o `<script defer>`).'),
        f('layout', 'Según el enfoque Mobile First para el Diseño Web Adaptativo, ¿cuál es la práctica recomendada al escribir Media Queries en CSS?', [
          'Escribir los estilos base para pantallas chicas y usar `min-width` para ir ajustando a medida que la pantalla crece',
          'Escribir los estilos base para escritorio y usar `max-width` para ir ajustando a medida que la pantalla se achica',
          'Crear una hoja de estilos distinta por dispositivo y elegir cuál cargar con JavaScript según `navigator.userAgent`',
          'Usar medidas fijas en `px` y ocultar con `display: none` en el celular todo lo que no entra en la pantalla',
        ], 'Mobile First = base móvil + `@media (min-width: …)` hacia arriba. Escritorio primero con `max-width` es Desktop First. Tailwind sigue Mobile First: `md:flex` significa "desde md en adelante".'),
        d('async', 'Analizar el siguiente bloque de código. ¿Cuál de las opciones es la correcta?', `console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");`, [
          'Se imprime A, D, C, B', 'Se imprime A, B, C, D', 'Se imprime A, D, B, C', 'Se imprime A, C, D, B',
        ], 'Reconstrucción: el código del enunciado real no se ve en la captura, así que va un tema típico. Primero corre todo el código sincrónico (A, D). Después se vacía la cola de microtareas (`.then` → C) y recién ahí la de macrotareas (`setTimeout` → B), aunque tenga 0 ms.'),
        f('tw', 'En el contexto de Tailwind CSS, ¿qué significa el enfoque Utility-First?', [
          'Armar la interfaz combinando clases chicas de un solo propósito (`flex`, `p-4`) directamente en el HTML/JSX',
          'Usar componentes ya armados (botones, cards, modales) que se importan y se personalizan con un tema',
          'Priorizar funciones utilitarias de JavaScript que aplican los estilos a cada elemento en tiempo de ejecución',
          'Escribir primero un archivo `utilities.css` con todas las reglas del sitio y después importarlo en cada componente',
        ], 'Utility-first: cada clase hace una sola cosa y el diseño sale de combinarlas. No trae componentes armados (eso es Bootstrap) y no es JS. Las clases que no usás no terminan en el CSS final.'),
        f('rforms', 'Se utiliza react-hook-form en un componente. ¿Cuál es la forma correcta de registrar un campo de input y aplicar una validación de que el campo es obligatorio?', [
          '`<input {...register("nombre", { required: "El nombre es obligatorio" })} />`',
          '`<input name="nombre" required={register("nombre")} />`',
          '`<input ref={register.required("nombre", true)} />`',
          '`<input onChange={register("nombre")} validate="required" />`',
        ], '`register(nombre, reglas)` devuelve `{ name, onChange, onBlur, ref }`, por eso se esparce con `{...}` sobre el input. Las reglas van en el segundo argumento: `required`, `minLength`, `pattern`, `validate`… El texto de `required` es el mensaje que queda en `errors.nombre.message`.'),
        f('router', 'En el contexto de Axios, ¿qué ocurrirá con la promesa devuelta por `axios.get(url)` si el servidor responde con un estado HTTP 500 (Internal Server Error)?', [
          'Se rechaza: entra al `catch` con un error cuyo `error.response.status` es 500',
          'Se resuelve igual y hay que revisar `response.ok` para detectar el error, igual que con `fetch`',
          'Axios reintenta la petición automáticamente hasta recibir un 200 y recién entonces resuelve',
          'Queda pendiente para siempre, porque Axios solo resuelve o rechaza respuestas con status 2xx',
        ], 'Diferencia clave con fetch: Axios rechaza con cualquier status fuera de 2xx (por defecto, `validateStatus`). `fetch` solo rechaza si falla la red; con un 500 resuelve y hay que mirar `res.ok`.'),
        f('rforms', 'En react-hook-form, si se intenta enviar un formulario que no ha pasado las reglas de validación, ¿qué propiedad del objeto retornado por `useForm()` contendrá la información detallada de los errores?', [
          '`formState.errors`',
          'El objeto `errors` que recibe como argumento la función `onSubmit`',
          '`getValues().errors`, que se actualiza al validar',
          '`register.errors`, un objeto por cada campo registrado',
        ], '`formState.errors` es un objeto con una entrada por campo inválido: `errors.email.type` y `errors.email.message`. Si hay errores, `handleSubmit` no llama a `onSubmit`.'),
      ],
    },
    {
      id: 'mA', name: 'Modelo A · integrador', min: 25,
      desc: 'Unidades IV y V mezcladas, como el 2do parcial: 12 conceptuales y 3 de código.',
      qs: [
        f('web', '¿Qué significa que HTTP sea un protocolo "sin estado" (stateless)?', [
          'Que cada petición es independiente y el servidor no recuerda las anteriores por sí mismo',
          'Que la conexión queda abierta y el servidor guarda en memoria los datos de cada cliente conectado',
          'Que solo puede transportar documentos HTML estáticos, nunca datos dinámicos como un JSON generado',
          'Que no informa el resultado de la petición, por eso hace falta revisar el cuerpo de la respuesta',
        ], 'Stateless: cada request trae todo lo necesario. Para "recordar" al usuario se agregan cookies, sesiones o un token (JWT) en cada petición. El resultado sí se informa: es el código de estado.'),
        f('web', '¿Qué caracteriza a una SPA (Single Page Application)?', [
          'Se carga un único HTML y JavaScript cambia las vistas al navegar, sin recargar la página',
          'Cada vez que el usuario navega, el servidor genera y envía un documento HTML completo y nuevo',
          'Todas las páginas se generan una vez, en tiempo de build, como archivos HTML estáticos sin JavaScript',
          'Es una aplicación que se instala en el dispositivo y funciona solamente sin conexión',
        ], 'SPA = un HTML + JS que arma las vistas (React con React Router). Un HTML nuevo por navegación es MPA/SSR; HTML generado en el build es SSG; instalable y offline es PWA.'),
        f('html', '¿Cuál es la principal ventaja de usar etiquetas semánticas (`<header>`, `<nav>`, `<main>`, `<article>`) en lugar de `<div>` genéricos?', [
          'Dan significado a cada parte, lo que mejora la accesibilidad y el SEO',
          'El navegador las procesa más rápido porque las guarda en caché entre páginas',
          'Traen estilos propios que evitan tener que escribir CSS para el layout',
          'Son obligatorias: un documento con `<div>` en su lugar no es HTML válido',
        ], 'Visualmente un `<nav>` y un `<div>` son iguales: la diferencia es el significado. Lectores de pantalla y buscadores entienden la estructura de la página.'),
        f('css', 'Con `box-sizing: border-box`, ¿qué incluye el `width` declarado de un elemento?', [
          'El contenido, el padding y el borde',
          'Solo el contenido; padding y borde se suman por fuera',
          'El contenido, el padding, el borde y también el margin',
          'El contenido y el margin, pero no el padding ni el borde',
        ], 'Con `content-box` (el valor por defecto) el width es solo el contenido y padding + borde se suman. Con `border-box` el padding y el borde "entran" en el width. El margin nunca se incluye.'),
        f('layout', '¿Cuál es la diferencia conceptual principal entre Flexbox y CSS Grid?', [
          'Flexbox es unidimensional (fila o columna) y Grid bidimensional (filas y columnas)',
          'Grid es unidimensional (fila o columna) y Flexbox bidimensional (filas y columnas)',
          'Flexbox solo sirve para centrar un único elemento y Grid para distribuir todos los demás',
          'Grid no permite alinear elementos y Flexbox no permite separar elementos con `gap`',
        ], 'Flex: un eje principal (`flex-direction`) y uno cruzado. Grid: defino columnas y filas (`grid-template-columns`). Los dos tienen `gap` y alineación.'),
        f('js', '¿Qué diferencia a `let` y `const` de `var`?', [
          '`let`/`const` tienen alcance de bloque y zona muerta temporal; `var` tiene alcance de función',
          '`let`/`const` no tienen hoisting de ningún tipo; `var` se mueve al inicio del archivo',
          '`const` hace inmutable al objeto asignado: no se pueden cambiar ni agregar sus propiedades',
          '`var` tiene alcance de bloque y zona muerta temporal; `let`/`const`, alcance de función',
        ], 'Las tres se "elevan", pero `let`/`const` quedan en la TDZ: usarlas antes da ReferenceError. `const` impide reasignar la variable, no mutar el objeto: `const o = {}; o.x = 1` funciona.'),
        f('async', '¿Qué hace `Promise.all([p1, p2, p3])`?', [
          'Espera a todas y da un array de resultados; se rechaza si una falla',
          'Se resuelve con el resultado de la primera promesa que termine, sea cual sea',
          'Ejecuta las promesas una detrás de otra, esperando que termine cada una',
          'Ignora las que fallan y se resuelve con un array con los resultados de las exitosas',
        ], 'Las promesas ya están en curso en paralelo; `all` espera a todas. La primera que termina es `Promise.race`; obtener todas, fallen o no, es `Promise.allSettled`.'),
        f('entorno', 'En `package.json`, ¿qué diferencia hay entre `dependencies` y `devDependencies`?', [
          '`dependencies` van al bundle final; `devDependencies` solo se usan para desarrollar',
          '`devDependencies` se instalan solo en el servidor de producción, no en la máquina local',
          '`dependencies` se instalan de forma global y `devDependencies` en la carpeta del proyecto',
          'No hay diferencia práctica: es solo una convención para ordenar visualmente el archivo',
        ], 'Así lo define la cátedra: dependencies "serán parte del bundler final" (react, axios, react-router). devDependencies: herramientas (`npm i -D vite`).'),
        f('jsx', '¿Qué es el Virtual DOM en React?', [
          'Una representación en memoria del DOM que React compara para aplicar solo los cambios',
          'Una API del navegador que reemplaza a `document` y que React usa en lugar del DOM real',
          'Una copia del DOM que React guarda en `localStorage` para restaurar la vista al recargar',
          'Un segundo DOM que el navegador pinta en otro hilo para no bloquear la interfaz principal',
        ], 'La cátedra lo remarca: "NO es una API, es un concepto/patrón". Con cada cambio de estado o props: nuevo árbol virtual → diff contra el anterior → se aplican al DOM real solo las diferencias.'),
        f('estado', '¿Cuál es la diferencia entre props y estado (state) en un componente de React?', [
          'Las props vienen del padre y son de solo lectura; el estado es interno y al cambiar re-renderiza',
          'Las props se pueden modificar directamente en el hijo; el estado solo desde el componente padre',
          'El estado se comparte automáticamente con todos los componentes hijos y las props no',
          'Las props solo pueden ser strings y números; el estado puede guardar cualquier tipo de dato',
        ], 'Flujo de datos unidireccional: padre → hijo por props. Si el hijo necesita cambiar algo del padre, recibe una función por props (por ej. `onAgregar`).'),
        f('efectos', 'Un `useEffect` tiene como segundo argumento un array vacío (`[]`). ¿Cuándo se ejecuta?', [
          'Una sola vez, después del primer render (al montar)',
          'Una sola vez, antes del primer render, para preparar el estado inicial',
          'Después de cada render, porque no tiene dependencias que lo frenen',
          'Nunca, porque no tiene ninguna dependencia que pueda cambiar',
        ], 'Sin array: después de cada render. `[]`: solo al montar (el lugar típico para el `axios.get` inicial). `[x]`: al montar y cada vez que cambia `x`.'),
        f('arq', 'En Atomic Design, ¿cómo se clasifica un formulario de búsqueda compuesto por un Label, un Input y un Button?', [
          'Molécula', 'Átomo', 'Organismo', 'Plantilla',
        ], 'Átomos (Label, Input, Button) → molécula: un grupo chico con una función (buscar) → organismo: una sección completa (Header con logo, menú y buscador) → plantilla → página.'),
        d('arr', '¿Qué se imprime por consola?', `const nums = [1, 2, 3, 4];
const r = nums.filter(n => n % 2 === 0).map(n => n * 10);
console.log(r, nums.length);`, [
          '`[20, 40] 4`', '`[10, 30] 4`', '`[20, 40] 2`', '`[2, 4] 4`',
        ], '`filter` se queda con los pares `[2, 4]` y `map` los multiplica: `[20, 40]`. Ninguno de los dos modifica el array original, que sigue teniendo 4 elementos.'),
        d('estado', 'El usuario hace un clic en el botón. ¿Qué número muestra después?', `function Contador() {
  const [n, setN] = useState(0);
  const sumar = () => {
    setN(n + 1);
    setN(n + 1);
  };
  return <button onClick={sumar}>{n}</button>;
}`, [
          '`1`', '`2`', '`0`', 'Da error: no se puede llamar dos veces al setter en la misma función',
        ], 'En ese render `n` vale 0, así que las dos llamadas son `setN(0 + 1)`. React agrupa (batching) y renderiza una vez con 1. Para sumar 2: `setN(prev => prev + 1)` dos veces.', 'jsx'),
        d('router', '¿Qué hace este componente?', `function RutaPrivada({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}`, [
          'Muestra `children` si hay token; si no, redirige a `/login` sin dejar la ruta en el historial',
          'Siempre redirige a `/login` y, al iniciar sesión, vuelve automáticamente a la ruta original',
          'Guarda un token nuevo en localStorage y después navega a `/login` reemplazando el historial',
          'Muestra el contenido protegido y además abre `/login` en una pestaña nueva del navegador',
        ], 'Patrón de ruta privada: si no hay sesión, `<Navigate>` redirige. `replace` evita que con "Atrás" el usuario vuelva a la ruta protegida.', 'jsx'),
      ],
    },
    {
      id: 'mB', name: 'Modelo B · integrador', min: 25,
      desc: 'Otro integrador de las dos unidades, con las trampas más típicas: fetch vs Axios, event loop, keys, hooks.',
      qs: [
        f('web', 'En la URL `https://api.clinica.com:8080/turnos?fecha=hoy#lista`, ¿qué es `#lista`?', [
          'El fragmento: no viaja al servidor, lo usa el navegador dentro de la página',
          'Un parámetro de consulta que el servidor recibe junto con `fecha=hoy`',
          'El identificador del puerto por el que se conecta el navegador',
          'Parte de la ruta del recurso que el navegador le pide al servidor',
        ], 'Protocolo `https://` · dominio `api.clinica.com` · puerto `:8080` · ruta `/turnos` · parámetros `?fecha=hoy` · fragmento `#lista` (se queda en el navegador).'),
        f('web', '¿Qué familia de códigos de estado HTTP indica un error del lado del cliente (por ejemplo, recurso inexistente o falta de autorización)?', [
          '4xx', '5xx', '3xx', '2xx',
        ], '2xx éxito (200, 201, 204) · 3xx redirección (301, 304) · 4xx error del cliente (400, 401, 403, 404) · 5xx error del servidor (500, 503).'),
        f('css', 'Si dos reglas CSS tienen exactamente la misma especificidad y apuntan al mismo elemento, ¿cuál se aplica?', [
          'La que aparece última en el código',
          'La que aparece primera en el código',
          'Ninguna: las dos se anulan y queda el valor por defecto',
          'La que declara más propiedades en el bloque',
        ], 'La cascada decide por: importancia (`!important`) → especificidad → orden de aparición. Con empate gana la última.'),
        f('css', '¿Respecto de qué se posiciona un elemento con `position: absolute`?', [
          'Respecto de su ancestro más cercano con `position` distinta de `static`',
          'Respecto de su propia posición normal dentro del flujo del documento',
          'Respecto de la ventana del navegador, y queda fijo aunque se haga scroll',
          'Respecto del elemento hermano que tiene justo antes en el HTML',
        ], '`relative` se mueve respecto de su lugar normal; `absolute` sale del flujo y toma como referencia al ancestro posicionado (por eso el padre lleva `position: relative`); `fixed` respecto de la ventana; `sticky` se pega al hacer scroll.'),
        f('dom', '¿Qué es la propagación de eventos (bubbling) en el DOM?', [
          'El evento ocurre en un elemento y después sube por sus ancestros',
          'El evento baja desde el elemento donde ocurrió hacia todos sus hijos y nietos',
          'El evento se repite sobre el mismo elemento hasta que algún listener lo maneje',
          'El navegador cancela el evento cuando el elemento tiene más de un listener',
        ], 'Gracias al bubbling existe la delegación de eventos: un solo listener en el `<ul>` atiende los clics de todos sus `<li>` (con `e.target`). `stopPropagation()` frena la subida.'),
        f('dom', 'En el evento `submit` de un formulario, ¿qué hace `event.preventDefault()`?', [
          'Evita que el navegador envíe el formulario y recargue la página',
          'Frena la propagación del evento hacia los elementos padre del formulario',
          'Borra los valores que el usuario escribió en los campos del formulario',
          'Ejecuta las validaciones HTML (`required`, `minlength`) antes de enviar',
        ], 'Acción por defecto ≠ propagación: `preventDefault()` cancela el comportamiento del navegador; `stopPropagation()` corta el bubbling. Sin `preventDefault` en el submit, la página se recarga y se pierde el estado.'),
        f('async', '¿Por qué el callback de una promesa ya resuelta (`.then`) se ejecuta antes que el de un `setTimeout(fn, 0)` que se programó antes?', [
          'Porque las microtareas se vacían antes de pasar a la siguiente macrotarea',
          'Porque `setTimeout` con 0 ms en realidad espera como mínimo un segundo entero',
          'Porque las promesas se ejecutan en paralelo, en otro hilo del navegador',
          'Porque `setTimeout` solo corre cuando no quedan eventos del usuario pendientes',
        ], 'JS tiene un solo hilo. Event loop: termina el código sincrónico (call stack vacío) → vacía TODAS las microtareas (promesas, `await`) → toma UNA macrotarea (timers, eventos) → repite.'),
        f('async', '¿Qué pasa con la promesa que devuelve `fetch(url)` si el servidor responde con un 404?', [
          'Se resuelve igual: hay que revisar `response.ok` para detectarlo',
          'Se rechaza y el código entra directamente al bloque `catch` con el status',
          'Se resuelve con `null` porque el recurso pedido no tiene contenido',
          'Lanza una excepción sincrónica que corta la ejecución del script',
        ], '`fetch` solo rechaza ante un fallo de red (sin conexión, DNS, CORS). Por eso el patrón: `if (!res.ok) throw new Error(res.status)`. Axios, en cambio, rechaza con cualquier status fuera de 2xx.'),
        f('store', '¿Qué hay que hacer para guardar un objeto en `localStorage` y poder recuperarlo como objeto?', [
          'Guardarlo con `JSON.stringify` y leerlo con `JSON.parse`',
          'Nada especial: `localStorage.setItem` guarda objetos y arrays de forma nativa',
          'Usar `localStorage.setObject(clave, objeto)` y leerlo con `getObject`',
          'Convertirlo con `objeto.toString()` y leerlo con `Object.from()`',
        ], '`setItem("user", {nombre: "Ana"})` guarda el texto `"[object Object]"`. Lo correcto: `setItem("user", JSON.stringify(user))` y `JSON.parse(getItem("user"))`.'),
        f('entorno', '¿Qué rol cumple Vite en un proyecto de React?', [
          'Es el bundler: servidor de desarrollo (`npm run dev`) y build para producción',
          'Es un framework que reemplaza a React y trae sus propios componentes y hooks',
          'Es un gestor de paquetes alternativo a npm para instalar las dependencias',
          'Es el servidor backend que expone la API REST que consume la app',
        ], 'La cátedra lo define como "un bundler moderno y rápido": servidor de desarrollo con recarga al instante (HMR) + empaquetado para producción en `dist/`.'),
        f('jsx', '¿Por qué en JSX se usa `className` en lugar de `class`?', [
          'Porque JSX se convierte en JavaScript y `class` es palabra reservada',
          'Porque `className` aplica los estilos más rápido que el atributo `class`',
          'Porque `class` es exclusivo de los archivos CSS y no del HTML',
          'Es indistinto: React acepta los dos atributos sin ninguna diferencia',
        ], 'Lo mismo pasa con `for` → `htmlFor`. Además en JSX: eventos en camelCase (`onClick`), `style` recibe un objeto y toda etiqueta se cierra (`<img />`).'),
        f('estado', '¿Para qué sirve la prop `key` al renderizar una lista con `map` en React?', [
          'Para que React identifique cada ítem entre renders al reconciliar',
          'Para que React ordene los ítems de la lista según ese valor',
          'Para asignar el atributo `id` de cada elemento en el DOM real',
          'Para que cada ítem se pueda enfocar con la tecla Tab en orden',
        ], 'Usá un id del dato (`key={turno.id}`). El índice del `map` como key falla al reordenar o borrar: React reutiliza el componente equivocado y el estado queda en la fila incorrecta.'),
        f('efectos', '¿Cuál de estas es una regla de los hooks de React?', [
          'Se llaman solo en el nivel superior, nunca dentro de un `if` o un bucle',
          'Solo pueden usarse dentro de componentes de clase',
          'Se pueden llamar dentro de un `if` mientras se respete el orden alfabético',
          'Deben llamarse dentro de un `useEffect` para que React los registre',
        ], 'React identifica cada hook por el orden en que se llama. Si un `if` saltea uno, el orden cambia entre renders y se mezclan los estados. Los custom hooks empiezan con `use`.'),
        d('obj', '¿Qué se imprime por consola?', `const turno = { id: 1, paciente: { nombre: "Ana" } };
const copia = { ...turno };
copia.id = 2;
copia.paciente.nombre = "Luis";
console.log(turno.id, turno.paciente.nombre);`, [
          '`1 Luis`', '`1 Ana`', '`2 Luis`', '`2 Ana`',
        ], 'El spread hace una copia superficial: `id` se copia por valor, pero `paciente` es el mismo objeto en las dos variables. Por eso en React, para actualizar algo anidado, hay que copiar cada nivel: `{ ...turno, paciente: { ...turno.paciente, nombre: "Luis" } }`.'),
        d('efectos', '¿Cuándo se imprime "efecto"?', `function Listado({ filtro }) {
  useEffect(() => {
    console.log("efecto");
  }, [filtro]);
  return <p>{filtro}</p>;
}`, [
          'Al montar y cada vez que cambia `filtro`',
          'Una sola vez, al montar el componente',
          'En cada render, haya cambiado `filtro` o no',
          'Solo cuando el componente se desmonta de la pantalla',
        ], 'Con dependencias, el efecto corre al montar y después solo si alguna dependencia cambió respecto del render anterior.', 'jsx'),
      ],
    },
    {
      id: 'mC', name: 'Modelo C · Unidad IV', min: 25,
      desc: 'Solo Unidad IV: web, HTML, CSS, JavaScript, DOM, asincronía y almacenamiento.',
      qs: [
        f('web', '¿Cuál es el orden correcto de lo que ocurre cuando escribís una URL en el navegador y presionás Enter?', [
          'DNS → conexión TCP/TLS → petición HTTP → respuesta → renderizado',
          'Petición HTTP → DNS → conexión TCP/TLS → renderizado → respuesta',
          'Conexión TCP/TLS → DNS → petición HTTP → respuesta → renderizado',
          'DNS → petición HTTP → renderizado → conexión TCP/TLS → respuesta',
        ], 'Sin la IP (DNS) no hay a dónde conectarse; sin conexión no hay petición; sin respuesta no hay nada que renderizar.'),
        f('web', '¿Por qué una aplicación con renderizado del lado del cliente (CSR) puede tener peor SEO que una con renderizado del lado del servidor (SSR)?', [
          'Porque el HTML inicial llega casi vacío y el contenido lo arma JavaScript en el navegador',
          'Porque las aplicaciones CSR no pueden incluir etiquetas `<meta>` ni `<title>` en el `<head>`',
          'Porque CSR usa HTTP en lugar de HTTPS y los buscadores penalizan los sitios sin cifrado',
          'Porque los buscadores bloquean las páginas que cargan scripts de React desde otro dominio',
        ], 'CSR (una SPA con Vite): el servidor manda `<div id="root"></div>` y un script. SSR: el servidor manda el HTML ya armado. SSR mejora SEO y primera carga; CSR se siente más fluido al navegar.'),
        f('html', 'En un formulario, ¿para qué sirve el atributo `for` de una etiqueta `<label>`?', [
          'Asocia el label al control con ese `id`: al hacer clic se enfoca el input',
          'Indica a qué formulario de la página se envía el dato cuando se presiona el botón',
          'Es el nombre con el que viaja el valor del campo al servidor al enviar',
          'Repite el label tantas veces como indique su valor numérico',
        ], '`<label for="email">` + `<input id="email">`. La clave con la que viaja el dato es `name`. En JSX se escribe `htmlFor`.'),
        f('html', 'Al enviar un formulario HTML, ¿qué atributo de cada campo determina la clave con la que viaja su valor?', [
          '`name`', '`id`', '`class`', '`placeholder`',
        ], 'Sin `name` el campo no se envía. `id` sirve para el label, CSS y JS; `placeholder` es solo un texto de ayuda y no reemplaza al label.'),
        f('css', '¿Cuál de estos selectores tiene mayor especificidad?', [
          '`#menu .item`', '`.nav .menu .item a`', '`nav ul li a`', '`.item:hover`',
        ], 'Se cuenta (IDs, clases/pseudoclases/atributos, elementos): `#menu .item` = (1,1,0) · `.nav .menu .item a` = (0,3,1) · `nav ul li a` = (0,0,4) · `.item:hover` = (0,2,0). Un solo ID le gana a cualquier cantidad de clases.'),
        f('css', '¿Qué diferencia hay entre las unidades `rem` y `em`?', [
          '`rem` toma la fuente del elemento raíz (`html`) y `em` la del elemento padre',
          '`em` toma la fuente del elemento raíz (`html`) y `rem` la del elemento padre',
          '`rem` es una medida fija en píxeles y `em` un porcentaje del ancho de la pantalla',
          '`em` solo se puede usar en márgenes y paddings, y `rem` solo en tamaños de fuente',
        ], 'Con la raíz en 16px, `2rem` siempre son 32px. `em` se acumula al anidar. Para el ancho de pantalla están `vw`/`vh`; `%` es relativo al padre.'),
        f('layout', '¿Para qué sirve `<meta name="viewport" content="width=device-width, initial-scale=1">`?', [
          'Hace que el ancho de la página coincida con el del dispositivo',
          'Bloquea el zoom del usuario en celulares para que el diseño no se rompa',
          'Hace que el navegador descargue una hoja de estilos distinta en celulares',
          'Mejora el SEO porque le indica al buscador la palabra clave de la página',
        ], 'Sin esa línea el celular simula una pantalla de ~980px y achica todo: tus media queries de móvil nunca se activan.'),
        f('js', '¿Cuál es la diferencia entre `==` y `===` en JavaScript?', [
          '`===` compara valor y tipo; `==` convierte los tipos antes de comparar',
          '`==` compara valor y tipo; `===` solo el valor, convirtiendo los tipos',
          '`===` compara si dos objetos tienen las mismas propiedades, y `==` si son la misma referencia',
          'No hay diferencia: `===` es la forma moderna de escribir la misma comparación',
        ], '`"5" == 5` es true y `"5" === 5` es false. Con objetos, los dos comparan referencias: `{} === {}` es false. Usá siempre `===`.'),
        f('obj', '¿Qué diferencia a una arrow function de una función tradicional respecto de `this`?', [
          'La arrow no tiene `this` propio: lo toma de donde fue definida',
          'La arrow siempre crea un `this` nuevo que apunta a la propia función',
          'La arrow hace que `this` apunte siempre al elemento que disparó el evento',
          'No hay ninguna diferencia con `this`: solo cambia la sintaxis de la función',
        ], 'Por eso una arrow usada como método de un objeto (`saludar: () => this.nombre`) no ve al objeto. En una función tradicional, `this` depende de cómo se la llama.'),
        f('obj', '¿Qué es un closure (clausura) en JavaScript?', [
          'Una función que recuerda las variables del ámbito donde fue creada',
          'Una función que se ejecuta inmediatamente después de definirse, sin llamarla',
          'La forma de cerrar un objeto para que no se le agreguen nuevas propiedades',
          'Un bloque `try/catch` que encierra código que puede fallar',
        ], 'Ej.: `function contador() { let n = 0; return () => ++n; }`: la función devuelta sigue viendo `n`. La que se ejecuta al definirse es una IIFE; cerrar un objeto es `Object.freeze`/`seal`.'),
        f('dom', '¿Qué devuelve `document.querySelectorAll(".item")`?', [
          'Una NodeList con todos los elementos que coinciden',
          'Solo el primer elemento del documento que coincide con el selector',
          'Un array que se actualiza solo cada vez que se agrega un `.item`',
          '`null` cuando hay más de un elemento que coincide con el selector',
        ], '`querySelector` → el primero (o `null`). `querySelectorAll` → NodeList (aunque esté vacía, nunca `null`). No es un array: para `map`/`filter`, `Array.from(...)` o `[...lista]`.'),
        f('store', '¿Qué diferencia principal tienen las cookies respecto de `localStorage`?', [
          'Las cookies viajan al servidor en cada petición; `localStorage` no',
          '`localStorage` viaja al servidor en cada petición; las cookies no',
          'Las cookies se borran siempre al cerrar la pestaña; `localStorage` nunca',
          'Las cookies guardan objetos de forma nativa; `localStorage` solo strings',
        ], 'Cookies: ~4 KB, viajan en cada request, pueden tener vencimiento (`expires`). localStorage: ~5–10 MB, persiste hasta borrarlo. sessionStorage: igual pero muere al cerrar la pestaña.'),
        d('js', '¿Qué ocurre al ejecutar este código?', `console.log(a);
var a = 5;
console.log(b);
let b = 10;`, [
          '`undefined` y después `ReferenceError`',
          '`5` y después `10`',
          '`undefined` y después `undefined`',
          '`ReferenceError` en la primera línea',
        ], '`var a` se eleva y se inicializa en `undefined`. `let b` también se eleva, pero queda en la zona muerta temporal hasta su línea: leerla antes da `ReferenceError: Cannot access \'b\' before initialization`.'),
        d('async', '¿En qué orden se imprimen los números?', `setTimeout(() => console.log(1), 0);
Promise.resolve().then(() => console.log(2));
(async () => {
  console.log(3);
  await null;
  console.log(4);
})();
console.log(5);`, [
          '`3 5 2 4 1`', '`1 2 3 4 5`', '`3 5 4 2 1`', '`5 3 2 4 1`',
        ], 'Sincrónico: la async corre hasta el `await` (3) y sigue el resto (5). Microtareas en orden de llegada: el `.then` (2) y lo que sigue al `await` (4). Al final la macrotarea del timer (1).'),
        d('arr', '¿Qué se imprime por consola?', `const carrito = [
  { precio: 100, cant: 2 },
  { precio: 50, cant: 1 },
];
const total = carrito.reduce((acc, it) => acc + it.precio * it.cant, 0);
console.log(total);`, [
          '`250`', '`150`', '`300`', '`NaN`',
        ], '0 + 100·2 = 200 → 200 + 50·1 = 250. El `0` es el valor inicial del acumulador; sin él, `acc` arrancaría siendo el primer objeto y daría un resultado sin sentido.'),
      ],
    },
    {
      id: 'mD', name: 'Modelo D · Unidad V', min: 25,
      desc: 'Solo Unidad V: npm y Vite, React, hooks, formularios, Atomic Design, Tailwind, Router y Axios.',
      qs: [
        f('entorno', '¿Para qué sirve el archivo `package-lock.json`?', [
          'Registra la versión exacta instalada de cada dependencia y subdependencia',
          'Bloquea el proyecto para que nadie pueda instalar ni quitar dependencias',
          'Guarda las credenciales necesarias para publicar el paquete en npm',
          'Es una copia de seguridad de `package.json` que se puede borrar sin consecuencias',
        ], '`package.json` dice qué rangos aceptás (`^1.13.2`); el lock fija qué se instaló (`1.13.2` exacto). Se sube al repositorio; `node_modules` no.'),
        f('entorno', 'En `package.json` figura `"axios": "^1.13.2"`. ¿Qué versiones acepta npm al instalar?', [
          'Cualquier `1.x.x` desde `1.13.2`, sin llegar a `2.0.0`',
          'Solamente la versión exacta `1.13.2`, nunca otra',
          'Solo parches de esa versión menor: cualquier `1.13.x`',
          'Cualquier versión mayor a `1.13.2`, incluida la `2.x`',
        ], 'Semver MAJOR.MINOR.PATCH. `^` permite minor y patch (no cambia el major, que rompe compatibilidad). `~` permite solo patch. Sin símbolo: versión exacta.'),
        f('jsx', 'Según el algoritmo de reconciliación de React, ¿qué ocurre si entre dos renders un elemento cambia de tipo (por ejemplo, de `<div>` a `<section>`, o un componente por otro)?', [
          'Desmonta el sub-árbol anterior y monta uno nuevo (se pierde el estado)',
          'Solo cambia el nombre de la etiqueta en el DOM y conserva los hijos y su estado',
          'Lanza un error, porque el árbol no puede cambiar de forma entre renders',
          'Ignora el cambio hasta que el usuario recarga la página en el navegador',
        ], 'Reglas de la reconciliación: tipo distinto → se desmonta y remonta; mismo tipo → se actualizan solo los atributos que cambiaron; en listas, las `key` identifican cada hijo.'),
        f('estado', '¿Por qué no se debe hacer `lista.push(item)` y después `setLista(lista)`?', [
          'Porque la referencia no cambia y React puede no detectar el cambio',
          'Porque `push` es asincrónico y el setter se ejecuta antes de que termine de agregar',
          'Porque `setLista` solo acepta valores primitivos, como strings y números',
          'Porque React prohíbe usar métodos de array dentro del cuerpo de un componente',
        ], 'React compara la referencia anterior con la nueva (`Object.is`). Agregar: `[...lista, item]` · quitar: `lista.filter(...)` · editar: `lista.map(...)`.'),
        f('efectos', '¿Qué caracteriza al hook `useRef`?', [
          'Guarda un valor que persiste entre renders y cambiarlo no re-renderiza',
          'Funciona igual que `useState`, pero el valor se guarda en `localStorage`',
          'Sirve para hacer peticiones HTTP y guardar la respuesta entre renders',
          'Crea una referencia al componente padre para poder modificar sus props',
        ], 'Uso típico: `const inputRef = useRef(null)` + `<input ref={inputRef} />` y después `inputRef.current.focus()`. Es la base de los formularios no controlados.'),
        f('efectos', '¿Para qué sirve la función que se devuelve (return) dentro de un `useEffect`?', [
          'Es la limpieza: corre antes de repetir el efecto y al desmontar',
          'Es el JSX que devuelve el componente para mostrar en pantalla',
          'Se ejecuta antes del primer render para preparar el estado inicial',
          'Le indica a React qué dependencias tiene el efecto para repetirlo',
        ], '`useEffect(() => { const id = setInterval(tick, 1000); return () => clearInterval(id); }, [])`. Sin limpieza quedan intervalos o listeners vivos después de desmontar.'),
        f('rforms', '¿Qué hace `handleSubmit(onSubmit)` de react-hook-form?', [
          'Valida y, solo si todo pasa, llama a `onSubmit` con los datos',
          'Llama a `onSubmit` siempre, valide o no, y después muestra los errores',
          'Envía el formulario a la URL del atributo `action` y recarga la página',
          'Limpia todos los campos del formulario y vuelve a los valores iniciales',
        ], '`<form onSubmit={handleSubmit(onSubmit)}>`: `onSubmit(data)` recibe un objeto `{ email: "...", ... }`. Si algo falla, completa `formState.errors` y no llama a `onSubmit`.'),
        f('arq', 'En Atomic Design, ¿qué diferencia a una plantilla (template) de una página?', [
          'La plantilla es el esqueleto sin datos; la página, la plantilla con datos reales',
          'La plantilla agrupa átomos y la página agrupa moléculas y organismos',
          'La página es el esqueleto sin datos; la plantilla, la página con datos reales',
          'No hay diferencia: son dos nombres para el mismo nivel de la jerarquía',
        ], 'Átomos → moléculas → organismos → plantillas → páginas. En la cátedra: plantilla = esqueleto del dashboard; página = `ProductsPage.jsx`, que usa ese esqueleto con los productos de la API.'),
        f('tw', 'En Tailwind CSS, ¿qué significa la clase `md:flex`?', [
          'Aplica `display: flex` desde 768px (`md`) en adelante',
          'Aplica `display: flex` solo en pantallas medianas, no en las grandes',
          'Aplica `display: flex` solo en pantallas de menos de 768px',
          'Aplica `display: flex` cuando el usuario pasa el mouse por encima',
        ], 'Los prefijos de Tailwind son `min-width`: `hidden md:flex` = oculto en celular, flex desde md. Breakpoints: `sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280. Al pasar el mouse es `hover:`.'),
        f('router', 'En React Router, ¿por qué se usa `<Link to="/turnos">` en lugar de `<a href="/turnos">`?', [
          'Porque `Link` cambia de ruta sin recargar la página y `<a>` recarga todo',
          'Porque `<a>` no funciona dentro de los componentes de React',
          'Porque `Link` precarga todas las rutas de la aplicación al iniciar',
          'Porque `<a>` solo sirve para enlaces hacia otros dominios externos',
        ], 'Para navegar desde código (después de un login, por ejemplo) se usa `const navigate = useNavigate(); navigate("/turnos")`.'),
        f('router', 'Con la ruta `<Route path="/medicos/:id" element={<Medico />} />`, ¿cómo se obtiene el valor de `id` dentro de `Medico`?', [
          '`const { id } = useParams()`', '`const { id } = useNavigate()`', '`const { id } = useLocation()`', '`const { id } = props.params`',
        ], '`useParams` devuelve los segmentos dinámicos de la URL (siempre como string). `useNavigate` es para navegar y `useLocation` da la ubicación actual (`pathname`, `search`).'),
        f('router', '¿Para qué se usa un interceptor de request en una instancia de Axios creada con `axios.create`?', [
          'Para modificar cada petición antes de enviarla, por ejemplo agregando el token',
          'Para cancelar automáticamente todas las peticiones que tarden más de un segundo',
          'Para convertir automáticamente las respuestas JSON del servidor a XML',
          'Para guardar en caché todas las respuestas del servidor en `localStorage`',
        ], '`api.interceptors.request.use(config => { config.headers.Authorization = "Bearer " + token; return config; })`. Un interceptor de response sirve, por ejemplo, para mandar al login ante un 401.'),
        d('rforms', 'El usuario envía el formulario con el email vacío. ¿Qué pasa?', `const { register, handleSubmit, formState: { errors } } = useForm();
const onSubmit = (data) => console.log(data);

return (
  <form onSubmit={handleSubmit(onSubmit)}>
    <input {...register("email", { required: "Obligatorio" })} />
    {errors.email && <p>{errors.email.message}</p>}
    <button>Enviar</button>
  </form>
);`, [
          'No se llama a `onSubmit` y aparece "Obligatorio"',
          'Se imprime `{ email: "" }` y después aparece "Obligatorio"',
          'La página se recarga porque falta llamar a `e.preventDefault()`',
          'No pasa nada visible: `errors.email` es un string sin `message`',
        ], 'La validación falla → `handleSubmit` no llama a `onSubmit` y completa `errors.email` (`{ type: "required", message: "Obligatorio" }`). `handleSubmit` ya hace el `preventDefault`.', 'jsx'),
        d('router', 'Con estas rutas, el usuario navega a `/turnos`. ¿Qué se renderiza?', `<Routes>
  <Route path="/" element={<Layout />}>
    <Route index element={<Inicio />} />
    <Route path="turnos" element={<Turnos />} />
  </Route>
</Routes>`, [
          '`Layout` con `Turnos` en su `<Outlet />`',
          'Solo `Turnos`, porque la ruta hija reemplaza a `Layout`',
          '`Layout`, `Inicio` y `Turnos`, los tres al mismo tiempo',
          'Nada: a `path="turnos"` le falta la barra inicial',
        ], 'Rutas anidadas: el padre (`Layout`, con el header y el menú) se mantiene y la hija se dibuja donde está `<Outlet />`. La ruta `index` solo se muestra en `/`. Las rutas hijas van sin barra (son relativas).', 'jsx'),
        d('efectos', '¿Qué problema tiene este código?', `function Turnos() {
  const [datos, setDatos] = useState([]);
  useEffect(() => {
    axios.get("/api/turnos").then(r => setDatos(r.data));
  });
  return <Lista items={datos} />;
}`, [
          'Sin array de dependencias, `setDatos` genera un bucle infinito de peticiones',
          'Ninguno: el efecto se ejecuta una sola vez, al montar el componente',
          'Falta `await`: sin él, `r.data` siempre llega como `undefined`',
          'Da error porque `useEffect` no puede llamar a funciones asincrónicas',
        ], 'render → efecto → petición → `setDatos` (array nuevo) → render → efecto → … Solución: `useEffect(() => { ... }, [])`.', 'jsx'),
      ],
    },
  ];

  // Ids estables por modelo para que las estadísticas y "repasar errores" funcionen
  MODELOS.forEach((m) => m.qs.forEach((q, i) => { q.id = `${m.id}-${i + 1}`; }));
