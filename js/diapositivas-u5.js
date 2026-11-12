/* Práctica por diapositivas — Unidad V (Entorno moderno, React). Mismo formato que diapositivas-u4.js. */
(() => {
  const U = 'U5';
  const f = (t, s, q, o, e) => ({ t, d: 'f', q, o, e: `📍 ${U} · diap. ${s} — ${e}` });
  const d = (t, s, q, c, o, e, l = 'jsx') => ({ t, d: 'd', q, c, l, o, e: `📍 ${U} · diap. ${s} — ${e}` });

  const BLOQUES = [
    {
      id: 'u5-entorno', u: 'V', rango: '2–15', name: 'Node, npm, Vite, package.json y semver', min: 14,
      qs: [
        f('entorno', '4–5', 'Según el "Material de Estudio" de la Unidad 5, ¿qué temas forman la segunda parte?', [
          'Atomic Design, Tailwind CSS y React Router Dom',
          'Screaming Architecture, useEffect y React Hook Form',
          'Vite, package.json y componentes de React',
          'Axios, rutas privadas y generación del bundler',
        ], 'Screaming Architecture, Vite, package.json, JSX, props, children, useEffect, hooks y React Hook Form son de la primera parte.'),
        f('entorno', '6', 'Según la diapositiva, en un proyecto de frontend Node.js se usa:', [
          'Como entorno para instalar librerías y correr scripts',
          'Como backend que sirve la API REST que consume la aplicación React',
          'Como motor de renderizado que reemplaza al navegador en desarrollo',
          'Como librería que se incluye en el bundle final de producción',
        ], 'Node es un runtime de JavaScript que funciona fuera del navegador.'),
        f('entorno', '7', 'Según la diapositiva, npm, yarn y pnpm son:', [
          'Gestores de dependencias que trabajan sobre package.json',
          'Bundlers que empaquetan la aplicación para producción',
          'Runtimes de JavaScript alternativos a Node.js',
          'Linters que revisan el código antes de ejecutarlo',
        ], 'Permiten instalar librerías. Los paquetes de terceros están en npmjs.com.'),
        f('entorno', '9', 'Según la diapositiva, Vite funciona como:', [
          'Servidor de desarrollo (npm run dev) y empaquetador (npm run build)',
          'Gestor de dependencias (npm install) y servidor de producción (npm start)',
          'Runtime de JavaScript (node) y formateador de código al guardar',
          'Servidor de producción (npm run build) y de testing (npm run dev)',
        ], 'Es un bundler moderno y rápido, con configuración mínima y soporte de ESModules.'),
        f('entorno', '10', '¿Cuál NO figura en "Vite - ¿Cómo nos ayuda?"', [
          'Reemplazar a Node.js como runtime',
          'Configurar un proxy',
          'Ejecutar tests',
          'Generar el bundle para desplegar',
        ], 'La lista: gestionar librerías de terceros, trabajar como servidor web, configurar un proxy, ejecutar tests y generar el bundler.'),
        f('entorno', '11', '¿Con qué comando se crea un proyecto según la diapositiva?', [
          'npm create vite@latest',
          'npm install vite@latest',
          'npx vite build',
          'npm run dev',
        ], 'Después se ingresa el nombre, se elige framework y variante, y se instala con npm.'),
        f('entorno', '12', 'Según la estructura de un proyecto Vite, ¿qué carpeta "NO se versiona"?', [
          'node_modules/',
          'public/',
          'src/',
          'dist/',
        ], 'node_modules guarda las dependencias instaladas; se regeneran con npm install a partir de package.json.'),
        f('entorno', '12', '¿Qué contiene public/ en un proyecto Vite?', [
          'Archivos estáticos que no se compilan',
          'El código fuente de la aplicación React',
          'Las dependencias instaladas del proyecto',
          'El resultado compilado listo para desplegar',
        ], 'El código fuente va en src/.'),
        f('entorno', '12', 'Según la diapositiva, package-lock.json:', [
          'Congela las versiones exactas para todos',
          'Lista los scripts que se ejecutan con npm run',
          'Bloquea la instalación de paquetes sin permiso',
          'Guarda la configuración del bundler y del proxy',
        ], 'Los scripts están en package.json; la configuración del bundler, en vite.config.js.'),
        f('entorno', '12', 'Si React controla toda la interfaz, ¿para qué sigue existiendo index.html?', [
          'Es el punto de entrada: tiene el <div id="root">',
          'Guarda una copia del Virtual DOM para comparar entre renders',
          'Contiene las rutas de la app que lee React Router',
          'Solo sirve en desarrollo; en producción lo reemplaza main.jsx',
        ], 'eslint.config.js configura ESLint; vite.config.js configura el bundler y el servidor.'),
        f('entorno', '13', 'Según la diapositiva de package.json, ¿qué diferencia hay entre dependencies y devDependencies?', [
          'dependencies son parte del bundle final; devDependencies solo se usan en desarrollo',
          'devDependencies son parte del bundle final; dependencies solo se usan en desarrollo',
          'dependencies se instalan con npm; devDependencies se instalan con Vite',
          'Ninguna: es solo una forma de ordenar la lista de paquetes',
        ], 'scripts: comandos que se ejecutan con npm run…'),
        f('entorno', '14', 'En semver, ¿qué parte cambia con "nuevas funcionalidades, compatible"?', [
          'MINOR',
          'MAJOR',
          'PATCH',
          'Pre-release',
        ], 'MAJOR: cambios grandes o incompatibles. PATCH: corrección de errores.'),
        f('entorno', '15', 'Según la tabla, ¿qué versiones acepta "^1.2.3"?', [
          '>=1.2.3 <2.0.0',
          '>=1.2.3 <1.3.0',
          'Solo la 1.2.3',
          'Cualquier versión',
        ], 'El circunflejo actualiza MINOR y PATCH pero no cambia MAJOR.'),
        f('entorno', '15', 'Según la tabla, ¿qué versiones acepta "~1.2.3"?', [
          '>=1.2.3 <1.3.0',
          '>=1.2.3 <2.0.0',
          '>1.2.3',
          'La última publicada',
        ], 'La tilde actualiza solo PATCH dentro del mismo MINOR.'),
        f('entorno', '15', '¿Qué significa "1.2.3-beta.1" en la tabla de notaciones?', [
          'Una versión preliminar de prueba',
          'La primera corrección de la 1.2.3',
          'Cualquier versión mayor a la 1.2.3',
          'Un rango entre la 1.2.3 y la 1.3',
        ], 'Las pre-release (alpha, beta, rc) se publican antes de la versión estable.'),
      ],
    },
    {
      id: 'u5-jsx', u: 'V', rango: '16–24', name: 'Componentes, JSX, Virtual DOM y reconciliación', min: 12,
      qs: [
        f('jsx', '16', 'Según la diapositiva, un componente de React es:', [
          'Una función o clase que retorna elementos visuales',
          'Un archivo .jsx que exporta estilos y estructura',
          'Un objeto con las props y el estado de una vista',
          'Una etiqueta HTML personalizada que lee el navegador',
        ], 'Permiten dividir la aplicación en bloques reutilizables.'),
        f('jsx', '17', 'Según la diapositiva, JSX es:', [
          'Una extensión de la sintaxis de JavaScript',
          'Un lenguaje de marcado que reemplaza a HTML',
          'Una librería de plantillas que se instala aparte',
          'Un formato de datos parecido a JSON',
        ], 'Permite escribir código similar a HTML dentro de archivos JavaScript y facilita el contenido dinámico.'),
        f('jsx', '18–19', '¿Por qué en JSX se escribe className y htmlFor?', [
          'Porque JSX usa versiones camelCase o modificadas de los atributos',
          'Porque JSX no acepta atributos de HTML y React define los suyos propios',
          'Porque así el navegador los interpreta directamente sin compilar',
          'Porque class y for solo están permitidos en archivos .html',
        ], 'La tabla: HTML usa sus palabras (class, for); JSX usa la versión camelCase o modificada (className, htmlFor), porque class y for son palabras reservadas de JavaScript. Ejemplo: <div class="caja"> pasa a <div className="caja">.'),
        f('jsx', '19', 'Según la tabla JSX vs HTML, ¿qué pasa con JSX antes de ejecutarse?', [
          'Se compila a React.createElement()',
          'El navegador lo interpreta tal cual',
          'Se convierte en un archivo .html',
          'Se guarda en el DOM real sin cambios',
        ], 'HTML se interpreta tal cual en el navegador; JSX necesita compilarse.'),
        f('jsx', '19', 'Según la tabla, ¿qué diferencia hay en la validación?', [
          'HTML es más flexible; JSX exige cerrar cada etiqueta',
          'JSX es más flexible; HTML es más estricto y exige cerrar cada etiqueta',
          'Los dos son igual de flexibles: el navegador corrige los errores menores',
          'Los dos son estrictos, pero solo JSX permite etiquetas sin cerrar',
        ], 'En HTML el navegador interpreta errores menores; en JSX una etiqueta sin cerrar es un error de compilación.'),
        f('jsx', '20', '¿Qué aclara la diapositiva sobre el Virtual DOM?', [
          'NO es una API: es un concepto o patrón que usan varias librerías',
          'Es una API del navegador que React activa al montar la app',
          'Es un DOM alternativo que reemplaza al real en los navegadores modernos',
          'Es una copia del DOM que vive en el servidor y se envía al cliente',
        ], 'Es una representación en memoria del DOM real, que React usa para calcular la interfaz.'),
        f('jsx', '21', '¿Qué secuencia muestra el diagrama del Virtual DOM?', [
          'State Change → Compute Diff → Re-render',
          'Re-render → State Change → Compute Diff',
          'Compute Diff → Re-render → State Change',
          'State Change → Re-render → Compute Diff',
        ], 'En el DOM del navegador solo cambian los nodos marcados (los que difieren).'),
        f('jsx', '22', 'Según las reglas de reconciliación, si un elemento cambia de tipo (div → span), React:', [
          'Desmonta el subárbol viejo y monta uno nuevo',
          'Reutiliza el nodo y actualiza solo las props',
          'Cambia solo el nombre de la etiqueta en el DOM',
          'Lanza un error porque el tipo no puede cambiar',
        ], 'Si el tipo es el mismo, sí reutiliza el nodo y actualiza solo props/atributos que cambiaron.'),
        f('jsx', '22', 'Según la diapositiva, ¿cómo deben ser las keys de una lista?', [
          'Estables e identificativas (un id); no el índice si la lista se reordena',
          'Aleatorias en cada render, para que React detecte siempre el cambio',
          'El índice del .map, porque es único y estable en todos los casos',
          'Opcionales: React identifica los elementos por su contenido',
        ], 'Nunca un valor aleatorio en cada render: la key ayuda a no reutilizar el componente equivocado.'),
        f('jsx', '23', 'Cuando cambia el estado o las props, ¿qué tres pasos hace React según la diapositiva?', [
          'Arma un árbol virtual nuevo, hace el diff y aplica lo mínimo (commit)',
          'Recarga el index.html, vuelve a montar la app y aplica todas las mutaciones',
          'Compara el DOM real con el HTML original y reemplaza el árbol completo',
          'Aplica las mutaciones en el DOM real y después actualiza el árbol virtual',
        ], 'Commit es el paso en que React toca el DOM real.'),
        f('jsx', '24', 'Según la tabla DOM vs Virtual DOM, ¿dónde vive cada uno?', [
          'DOM: en el navegador · Virtual DOM: en la memoria de la aplicación React',
          'DOM: en la memoria de React · Virtual DOM: en el navegador',
          'Los dos viven en el navegador; el virtual es una pestaña de DevTools',
          'DOM: en el servidor · Virtual DOM: en el navegador del cliente',
        ], 'Actualizaciones del DOM: directas (cada cambio recalcula y redibuja). Del Virtual DOM: indirectas (diff y solo los cambios necesarios).'),
        f('jsx', '24', 'En la tabla, el ejemplo de cambio con Virtual DOM es setState("Hola"). ¿Qué pasa después?', [
          'Hace el diff y actualiza solo el nodo del título',
          'React reemplaza todo el body por el nuevo HTML generado',
          'El navegador recalcula estilos y redibuja la página completa',
          'React ejecuta document.getElementById("titulo").textContent',
        ], 'document.getElementById(...).textContent = "Hola" es el ejemplo del DOM directo (JS puro, jQuery).'),
      ],
    },
    {
      id: 'u5-props', u: 'V', rango: '25–35', name: 'Props, children, state, listas y eventos', min: 14,
      qs: [
        f('estado', '25', 'Según la diapositiva, las props:', [
          'Pasan datos de padre a hijo y son inmutables para el hijo',
          'Pasan datos de hijo a padre y el padre puede modificarlas',
          'Guardan el estado interno de un componente',
          'Se modifican en el hijo y React avisa al padre',
        ], 'Los hijos no modifican los valores de las props; solo el padre.'),
        d('estado', '26', 'En el ejemplo de la diapositiva, ¿qué contiene props.children dentro de Card?', `function Card(props) {
  return (
    <div className="card">
      <h2>{props.title}</h2>
      <div>{props.children}</div>
    </div>
  );
}

<Card title="Título de la tarjeta">
  <p>Contenido de la tarjeta</p>
</Card>`, [
          'El <p> que va entre <Card> y </Card>',
          'El string "Título de la tarjeta" pasado como prop',
          'Un array con el h2 y el div que retorna Card',
          'undefined, porque children no se pasó como atributo',
        ], 'children es una prop especial: lo que va entre la etiqueta de apertura y la de cierre del componente.'),
        f('estado', '27', 'Según la diapositiva, el state:', [
          'Es el estado interno de un componente o hook y se define con useState',
          'Son los datos que el padre le pasa al hijo y se leen con useProps',
          'Es un objeto global compartido por todos los componentes',
          'Se define con useEffect y cambia cuando cambian las dependencias',
        ], 'Almacena datos, y en base a ellos el componente cambia de apariencia o comportamiento.'),
        f('estado', '28', 'Según "props vs state", ¿qué pasa con el valor del state?', [
          'No se modifica directo: se setea uno nuevo y React re-renderiza',
          'Es mutable: se puede modificar directamente y React lo detecta en el próximo render',
          'Solo lo puede modificar el componente padre, a través de las props',
          'Es inmutable: una vez definido no cambia hasta que se desmonta el componente',
        ], 'Las props, en cambio, no se pueden modificar desde el hijo.'),
        d('estado', '27', 'En el Contador de la diapositiva, ¿qué pasa al hacer clic en "Sumar"?', `const [count, setCount] = useState(0);
return (
  <div>
    <h1>Contador: {count}</h1>
    <button onClick={() => setCount(count + 1)}>Sumar</button>
    <button onClick={() => setCount(count - 1)}>Restar</button>
  </div>
);`, [
          'Se setea un count nuevo y React re-renderiza con 1',
          'count cambia, pero el h1 sigue mostrando 0 hasta recargar la página',
          'Se modifica directamente la variable count y el DOM se actualiza solo',
          'Da error: count es const y no puede cambiar',
        ], 'count es const en cada render; setCount programa un render nuevo donde count vale 1.'),
        d('estado', '29', '¿Qué renderiza <Mensaje mostrar={false} />?', `function Mensaje({ mostrar }) {
  return <div>{mostrar && <p>Este es un mensaje secreto</p>}</div>;
}`, [
          'Un div vacío',
          'Un div con el texto "false"',
          'Nada: el componente devuelve null',
          'El párrafo, porque false se ignora',
        ], 'Con &&, si la condición es false React no dibuja nada en ese lugar (false no se renderiza). El ternario se usa cuando hay dos alternativas.'),
        f('estado', '30', 'Según la diapositiva, al renderizar una lista con .map cada elemento debe tener:', [
          'Una propiedad key única',
          'Un id en el atributo HTML',
          'Un índice en el className',
          'Un onClick propio',
        ], 'La key ayuda a React a identificar cambios. En el ejemplo: <li key={p.id}>.'),
        f('estado', '31', 'En el Ejercicio #26, ¿cuál es el valor por defecto del state "show"?', [
          'false',
          'true',
          'null',
          'El array de productos',
        ], 'El botón cambia "show" con onClick, su texto depende de "show" y debajo se muestra (o no) el listado.'),
        f('estado', '32', 'Según la diapositiva, los eventos en React:', [
          'Se escriben en camelCase y se pasan como funciones',
          'Se escriben en minúscula y se pasan como strings',
          'Se escriben en camelCase y se pasan como strings',
          'Se registran siempre con addEventListener',
        ], 'Ejemplo: <button onClick={handleClick}>, no onclick="handleClick()".'),
        f('estado', '32', 'Según la diapositiva, un evento sintético es:', [
          'Una capa sobre el evento nativo, igual en todo navegador',
          'Un evento que React dispara solo, sin intervención del usuario',
          'Un evento nativo del navegador que React no puede interceptar',
          'Un evento que se simula en los tests para no usar el navegador',
        ], 'React implementa un sistema de eventos sintéticos que funciona de manera uniforme en todos los navegadores.'),
        d('estado', '34', 'En el ejemplo Hijo → Padre, ¿quién muestra el alert y con qué texto?', `function Hijo({ onSaludar }) {
  return <button onClick={() => onSaludar("Hola desde el hijo!")}>Saludar</button>;
}
function Padre() {
  const manejarSaludo = (mensaje) => { alert(mensaje); };
  return <Hijo onSaludar={manejarSaludo} />;
}`, [
          'La función del Padre, con "Hola desde el hijo!"',
          'La función del Hijo, con "Hola desde el hijo!"',
          'La función del Padre, con el texto "Saludar"',
          'Nadie: el hijo no puede ejecutar funciones del padre',
        ], 'El Padre pasa una función como prop y el Hijo la ejecuta con sus datos. Padre → Hijo, en cambio, es solo pasar datos por props.'),
        f('estado', '35', 'En el Ejercicio #27, ¿qué dos componentes nuevos se crean y dónde?', [
          'List y un Button genérico, en archivos separados',
          'List y ListItem, dentro del mismo archivo App.jsx',
          'Button y Modal, que reemplazan al state "show"',
          'Header y Footer, en una carpeta components',
        ], 'App le pasa la lista de productos a List como prop. El resultado debe comportarse igual que el ejercicio anterior.'),
      ],
    },
    {
      id: 'u5-efectos', u: 'V', rango: '36–48', name: 'useEffect, ciclo de vida y hooks', min: 14,
      qs: [
        f('efectos', '36', 'Según la diapositiva, un efecto secundario es:', [
          'Cualquier operación fuera del renderizado puro',
          'Cualquier cambio de estado que provoca un nuevo render del componente',
          'Un error que aparece en la consola después de renderizar',
          'Cualquier componente hijo que se renderiza dentro de otro',
        ], 'Ejemplos de la diapositiva: llamadas a una API, suscripciones, manipulación de eventos, interacciones con localStorage.'),
        f('efectos', '38', 'Según la diapositiva, ¿cuándo se ejecuta un useEffect sin segundo parámetro?', [
          'En cada render',
          'Solo en el montaje',
          'Solo al desmontar',
          'Nunca',
        ], '[] → solo en el montaje. [variable] → cada vez que variable cambie.'),
        d('efectos', '37–38', 'En el Counter de la diapositiva, ¿cuándo aparece el mensaje en consola?', `function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    console.log('El contador se ha actualizado');
  }, [count]);
  return <button onClick={() => setCount(count + 1)}>Aumentar</button>;
}`, [
          'Al montar y cada vez que cambia count',
          'Solo cuando cambia count, nunca al montar',
          'Solo una vez, al montar el componente',
          'En cada render, cambie o no count',
        ], 'Un efecto siempre corre después del primer render; con [count] vuelve a correr cuando count cambia.'),
        f('efectos', '40', 'Según la diapositiva, la fase de Actualización (Update) ocurre cuando:', [
          'Cambia una prop o el state y vuelve a renderizar',
          'El componente se renderiza por primera vez en el árbol',
          'El componente se quita del árbol de React',
          'El usuario recarga la página en el navegador',
        ], 'Montaje: primer render. Desmontar: cuando sale del árbol de React.'),
        d('efectos', '41–42', 'En el ejemplo de ciclo de vida, ¿cuándo se ejecuta la función que retorna el efecto?', `useEffect(() => {
  // Mount
  console.log('Componente montado');
  return () => {
    // Unmount
    console.log('Componente desmontado');
  };
}, []);`, [
          'Cuando el componente se desmonta',
          'Inmediatamente después del montaje',
          'En cada render, antes del efecto',
          'Nunca, porque el array está vacío',
        ], 'Según la tabla, el desmontaje se maneja con useEffect(() => { return () => {...} }, []) y se usa para limpiar timers o eventos.'),
        f('efectos', '42', 'Según la tabla del ciclo de vida, "llamar a la API al cargar" corresponde a:', [
          'Montaje: useEffect(() => {...}, [])',
          'Actualización: useEffect(() => {...}, [dependencia])',
          'Desmontaje: useEffect(() => { return () => {...} }, [])',
          'Cualquier render: useEffect(() => {...})',
        ], 'Reaccionar a cambios de estado/props es la fase de actualización.'),
        f('efectos', '43', 'En la "Simulación de fetch", ¿qué hay que mostrar mientras se buscan los datos?', [
          'El mensaje "Buscando datos"',
          'Un spinner y la lista vacía',
          'Los datos de la búsqueda anterior',
          'Nada hasta que termine el fetch',
        ], 'Cuando el "fetch" termina, se muestran los datos obtenidos. Se simula dentro de un useEffect.'),
        f('efectos', '44', '¿Cuál es una de las reglas básicas de los Hooks según la diapositiva?', [
          'Solo en el nivel superior: nunca dentro de if o loops',
          'Solo se llaman dentro de un useEffect para no provocar renders extra',
          'Se pueden llamar en cualquier función, siempre que empiece con use',
          'Solo se llaman en componentes de clase o dentro de otros hooks',
        ], 'La otra regla: solo en componentes funcionales o en otros Custom Hooks. "Hook" es gancho: enganchan los componentes funcionales a las características de React.'),
        f('efectos', '45', 'Según la tabla de hooks, ¿cuál sirve para "referenciar elementos o valores mutables sin disparar render"?', [
          'useRef',
          'useState',
          'useMemo',
          'useContext',
        ], 'useState sí dispara un render cuando cambia.'),
        f('efectos', '45', 'Según la tabla, ¿qué diferencia hay entre useMemo y useCallback?', [
          'useMemo memoriza valores calculados; useCallback memoriza funciones',
          'useMemo memoriza funciones; useCallback memoriza valores calculados',
          'useMemo guarda estado global; useCallback guarda estado local',
          'Ninguna: son alias del mismo hook',
        ], 'useCallback se usa para evitar renders innecesarios.'),
        f('efectos', '45', 'Según la tabla, ¿qué hook es una alternativa a useState para estado complejo con múltiples acciones?', [
          'useReducer',
          'useContext',
          'useRef',
          'useEffect',
        ], 'const [state, dispatch] = useReducer(reducer, initState). useContext accede a valores globales con Context API.'),
        f('efectos', '46', 'Según la diapositiva, un Custom Hook:', [
          'Es una función que usa hooks, empieza con use y aísla lógica',
          'Es un componente que retorna JSX y se reutiliza en varias páginas',
          'Es un hook que viene con React y se configura con un objeto de opciones',
          'Es una función de JS que no puede usar otros hooks adentro',
        ], 'Ejemplos de nombre: useFetch, useForm.'),
        d('efectos', '47–48', 'Usando el useCounter de la diapositiva, ¿qué muestra el h1 después de hacer clic en +, +, y después en reset?', `function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  const increment = () => setCount((c) => c + 1);
  const decrement = () => setCount((c) => c - 1);
  const reset = () => setCount(initialValue);
  return { count, increment, decrement, reset };
}

export default function CounterApp() {
  const { count, increment, decrement, reset } = useCounter(5);
  return <h1>Contador: {count}</h1>; // + botones
}`, [
          'Contador: 5',
          'Contador: 0',
          'Contador: 7',
          'Contador: 2',
        ], 'reset vuelve a initialValue, que en CounterApp es 5 (no el 0 por defecto).'),
      ],
    },
    {
      id: 'u5-forms', u: 'V', rango: '49–60', name: 'Formularios controlados y React Hook Form', min: 14,
      qs: [
        f('rforms', '49', 'Según la tabla, en un formulario NO controlado (useRef), ¿quién maneja el valor?', [
          'El DOM (el input real)',
          'React (el estado)',
          'El navegador vía localStorage',
          'El componente padre vía props',
        ], 'En los controlados (useState) el valor lo maneja React.'),
        f('rforms', '49', 'Según la tabla, ¿qué pasa con el re-renderizado en cada tipo de formulario?', [
          'Controlado: ocurre en cada cambio · No controlado: no ocurre en cada cambio',
          'Controlado: no ocurre en cada cambio · No controlado: ocurre en cada cambio',
          'Los dos re-renderizan en cada tecla, porque el input cambia',
          'Ninguno re-renderiza hasta que se envía el formulario',
        ], 'Uso típico del controlado: formularios complejos con validación en tiempo real. Del no controlado: formularios simples donde solo se necesita el valor al enviar.'),
        f('rforms', '49', 'Según la tabla, ¿en cuál es "muy fácil" validar y por qué?', [
          'En el controlado: el valor ya está en el estado',
          'En el no controlado, porque el DOM valida solo',
          'En el no controlado, porque no re-renderiza',
          'En los dos por igual, leyendo el valor con useRef',
        ], 'En el no controlado hay que leer el valor manualmente (ref.current.value).'),
        d('rforms', '50', 'En el input controlado de la diapositiva, ¿qué pasa al escribir "Al"?', `const [nombre, setNombre] = useState("");
const [error, setError] = useState("");
const handleChange = (e) => {
  const value = e.target.value;
  setNombre(value);
  if (value.length < 3) setError("El nombre debe tener al menos 3 caracteres");
  else setError("");
};
// <input value={nombre} onChange={handleChange} />
// {error && <p style={{ color: "red" }}>{error}</p>}`, [
          'Se actualiza nombre y se muestra el error en rojo',
          'Se actualiza nombre, pero el error recién aparece al enviar',
          'No se puede escribir, porque value está fijo en ""',
          'Se muestra el error, pero nombre sigue vacío',
        ], 'La validación corre en cada cambio: es validación en tiempo real. Al enviar se loguea solo si no hay error y nombre no está vacío.'),
        d('rforms', '51–52', 'En el input no controlado de la diapositiva, ¿cómo se obtiene el email?', `const emailRef = useRef();
const handleSubmit = (e) => {
  e.preventDefault();
  const email = emailRef.current.value;
  // ...
};
// <input type="email" ref={emailRef} />`, [
          'Leyendo emailRef.current.value al enviar',
          'Con un useState que se actualiza en onChange',
          'Leyendo e.target.value dentro de handleSubmit',
          'Con document.getElementById("email") en cada tecla',
        ], 'La ref apunta al input real del DOM; el valor se lee una sola vez, al enviar.'),
        f('rforms', '53', 'En el Ejercicio #28, ¿qué responsabilidad tiene el componente Input?', [
          'Dibujar label, input y error (si hay)',
          'Validar y enviar el formulario completo',
          'Guardar el usuario logueado en localStorage',
          'Mostrar los datos correctos por consola',
        ], 'Login con username y password requeridos, inputs controlados y error en rojo debajo de cada input.'),
        f('rforms', '54', 'Según la diapositiva, React Hook Form permite:', [
          'Manejar estado, validaciones e inputs controlados y no controlados',
          'Gestionar solo inputs controlados, reemplazando a useState en todos los componentes',
          'Enviar formularios al backend sin escribir fetch ni axios',
          'Generar automáticamente el HTML del formulario a partir de un esquema',
        ], 'Se instala con npm install react-hook-form.'),
        f('rforms', '56', 'Según la diapositiva, register(name, options?):', [
          'Conecta un input al formulario y trabaja sobre elementos no controlados',
          'Conecta un input al formulario y lo vuelve un componente controlado',
          'Envuelve la función onSubmit y valida antes de llamarla',
          'Devuelve los errores de validación de un campo',
        ], 'name es la clave del campo (puede ser un path, como user.email); options son las validaciones.'),
        f('rforms', '56', 'Según la diapositiva, handleSubmit(onValid, onInvalid?):', [
          'Valida y llama a onValid(data) o a onInvalid(errors)',
          'Llama siempre a onValid(data) y después valida para marcar los errores',
          'Conecta los inputs al formulario y devuelve sus valores actuales',
          'Valida un solo campo por vez y llama a onInvalid si está vacío',
        ], 'Se usa así: <form onSubmit={handleSubmit(onSubmit)}>.'),
        f('rforms', '57', 'Según la tabla de validaciones, ¿qué diferencia hay entre min y minLength?', [
          'minLength: longitud mínima de caracteres · min: valor mínimo para números',
          'min: longitud mínima de caracteres · minLength: valor mínimo para números',
          'Son equivalentes; minLength es el nombre nuevo de min',
          'min valida en el submit y minLength en cada tecla',
        ], 'Ejemplos: { minLength: { value: 3, message: "Mínimo 3 caracteres" } } y { min: { value: 18, message: "Debe ser mayor o igual a 18" } }.'),
        f('rforms', '57', 'Según la tabla, ¿qué validación se usa para una regla personalizada escrita como función?', [
          'validate',
          'pattern',
          'required',
          'custom',
        ], 'pattern recibe una expresión regular (ej. /^[A-Za-z]+$/ con mensaje "Solo letras").'),
        d('rforms', '58–59', 'Con el código de la diapositiva, ¿qué se muestra si el usuario escribe "Al" y envía?', `const { register, handleSubmit, formState: { errors } } = useForm();

<input placeholder="Nombre"
  {...register('nombre', {
    required: 'El nombre es obligatorio',
    minLength: { value: 3, message: 'Mínimo 3 caracteres' },
  })}
/>
{errors.nombre && <span>{errors.nombre.message}</span>}`, [
          '"Mínimo 3 caracteres"',
          '"El nombre es obligatorio"',
          'Los dos mensajes juntos',
          'Nada: "Al" no está vacío',
        ], 'El campo no está vacío (pasa required) pero tiene 2 caracteres. errors.nombre.message trae el mensaje de la regla que falló.'),
        f('rforms', '59', '¿De dónde salen los errores en React Hook Form según la diapositiva?', [
          'const { formState: { errors } } = useForm();',
          'const { errors } = register("nombre");',
          'const errors = handleSubmit(onSubmit);',
          'const [errors, setErrors] = useState({});',
        ], 'errors es un objeto con una clave por campo que falló.'),
        f('rforms', '60', '¿Qué pide el Ejercicio #29?', [
          'Migrar el ejercicio #28 a react-hook-form',
          'Agregar validaciones con useRef al #28',
          'Pasar el login del #28 a Tailwind',
          'Conectar el login del #28 al backend',
        ], 'El #28 usaba inputs controlados con useState.'),
      ],
    },
    {
      id: 'u5-arq', u: 'V', rango: '61–89', name: 'Screaming Architecture, SOLID, módulos y linters', min: 18,
      qs: [
        f('arq', '61', 'Según la diapositiva, Screaming Architecture organiza el proyecto:', [
          'Por funcionalidades, en módulos, y no en capas técnicas',
          'Por capas técnicas: components, hooks, services, utils',
          'Por tipo de archivo: .jsx, .css, .js y .json',
          'Por nivel de Atomic Design: átomos, moléculas, organismos',
        ], 'La idea es que al leer solo las carpetas se entienda de qué trata cada módulo.'),
        f('arq', '62–63', '¿Qué tres formas de organizar carpetas compara la diapositiva?', [
          'Por tipo, por tipo + features y screaming architecture',
          'Por capas, por páginas y por componentes atómicos',
          'Monorepo, multirepo y screaming architecture por capas',
          'Por tipo, por fecha y por desarrollador',
        ], 'En screaming architecture, src/modules tiene core, payment, auth, employees… y cada uno sus propios components, hooks, services, etc.'),
        f('arq', '64', 'En la Screaming Architecture del proyecto de la cátedra, ¿dónde está Login.jsx?', [
          'src/modules/auth/pages/',
          'src/pages/auth/',
          'src/components/auth/',
          'src/modules/shared/pages/',
        ], 'auth tiene components, context, helpers, hooks, pages y services. Al lado están los módulos orders, products y shared.'),
        f('arq', '65, 67', 'Según la diapositiva, el Principio de Responsabilidad Única (SRP) dice que un componente:', [
          'Debe tener un único motivo de cambio',
          'Solo debe recibir una prop por vez',
          'Solo debe renderizarse una vez',
          'Solo debe usar un hook',
        ], 'Si maneja peticiones de red, lógica de negocio y renderizado a la vez, debe dividirse.'),
        f('arq', '68–71', 'En el ejemplo de SRP, el UserProfile original se divide en:', [
          'useUser, useEmailValidation, UserProfileForm y UserProfile',
          'UserService (abstracción), ApiUserService (real) y MockUserService (pruebas)',
          'SimpleUserCard (mínima) y EditableUserCard (con acciones de editar y borrar)',
          'PrimaryButton, DestructiveButton y ThemedButton con una prop variant',
        ], 'Las otras divisiones son los ejemplos de DIP, ISP y LSP.'),
        f('arq', '65, 72', 'Según la diapositiva, ¿cómo se logra el Principio Abierto/Cerrado en React?', [
          'Con composición (children) o Compound Components',
          'Copiando el componente y modificando la copia para cada caso nuevo',
          'Agregando un if por cada variante nueva dentro del componente',
          'Cerrando el componente con Object.freeze para que no se modifique',
        ], 'Abierto a la extensión, cerrado a la modificación.'),
        d('arq', '73–74', 'En el ejemplo de OCP, ¿por qué la segunda versión cumple el principio?', `// Versión 1
let color = "gray";
if (type === "success") color = "green";
else if (type === "error") color = "red";
else if (type === "warning") color = "orange";

// Versión 2
const notificationStyles = {
  success: { color: "green" },
  error: { color: "red" },
  warning: { color: "orange" },
  info: { color: "blue" }, // easily extensible
};
// <div style={notificationStyles[type]}>`, [
          'Un tipo nuevo es una entrada más del objeto, sin tocar el componente',
          'Porque usa style en lugar de un if, y style es más rápido de renderizar',
          'Porque el objeto no se puede modificar, así que los colores quedan fijos',
          'Porque cada tipo de notificación pasa a ser un componente separado',
        ], 'En la versión 1, cada tipo nuevo obliga a modificar la cadena de if/else.'),
        d('arq', '75–76', 'En el ejemplo de Liskov, ¿qué problema tiene DestructiveButton?', `interface ButtonProps {
  variant: "primary" | "secondary";
  onClick: () => void;
}
const PrimaryButton = ({ onClick }) => <button className="primary" onClick={onClick} />;
const DestructiveButton = ({ onClick }) => (
  <button className="danger" onClick={onClick} /> // ignores variant!
);`, [
          'Ignora variant, así que no es sustituible por su tipo base',
          'Recibe demasiadas props que no usa, así que viola segregación de interfaces',
          'Llama directamente a una API en lugar de depender de una abstracción',
          'Hace más de una cosa a la vez: renderiza y maneja el click',
        ], 'LSP: los subtipos deben poder reemplazar a su tipo base sin romper la app ni alterar el comportamiento esperado de las props. La solución usa variant o una prop theme más flexible.', 'jsx'),
        f('arq', '66, 78', 'Según la diapositiva, el Principio de Segregación de Interfaces en React significa:', [
          'Un componente no debe recibir props que no usa',
          'Un componente debe depender de abstracciones y no de llamadas directas a fetch',
          'Un componente debe poder reemplazar a su componente base sin romper nada',
          'Un componente debe separar sus estilos en un archivo de interfaz aparte',
        ], 'Mejor pasar datos específicos (name, email) que objetos gigantes o stores enteros de los que se usa una porción.'),
        f('arq', '79–80', 'En el ejemplo de ISP, UserCard tenía muchas props opcionales (onEdit, onDelete, showActions, isAdminView…). ¿Cuál es la solución?', [
          'Separarlo en SimpleUserCard y EditableUserCard',
          'Un único UserCard con todas las props obligatorias en lugar de opcionales',
          'Un UserCard que reciba el store completo y lea lo que necesite',
          'Un hook useUserCard que devuelva las diez props opcionales',
        ], 'EditableUserCard reutiliza a SimpleUserCard y agrega los botones.'),
        d('arq', '82–83', 'En el ejemplo de inversión de dependencias, ¿qué viola el principio?', `const UserProfile = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    axios.get("/api/user").then(res => setUser(res.data));
  }, []);
  return <div>{user?.name}</div>;
};`, [
          'Depende de algo concreto (axios.get), no de una abstracción',
          'Usa useEffect con un array vacío en lugar de pasar la dependencia user',
          'Usa el operador ?. en lugar de mostrar un mensaje de carga',
          'Hace la petición con axios en lugar de usar fetch nativo',
        ], 'La solución define una interfaz UserService, una ApiUserService real y un MockUserService para testing, y UserProfile recibe el servicio por props.'),
        f('arq', '81', 'Según la diapositiva, el DIP dice que los módulos de alto nivel:', [
          'Deben depender de abstracciones, no de detalles',
          'Deben importar directamente los servicios que usan',
          'Deben tener una sola razón para cambiar',
          'No deben recibir props que no utilizan',
        ], 'En React: depender de hooks personalizados, contextos o props, no de fetch dentro de la vista.'),
        d('arq', '85', '¿Qué import es correcto para este archivo matematicas.js?', `export const sumar = (a, b) => a + b;
export const PI = 3.1416;`, [
          "import { PI } from './matematicas.js';",
          "import sumar from './matematicas.js';",
          "import { suma } from './matematicas.js';",
          "import * from './matematicas.js';",
        ], 'Con exportaciones nombradas se usa el nombre exacto (o un alias con as). import * necesita "as Nombre". import sumar sin llaves buscaría el export default, que no existe.', 'js'),
        f('arq', '86', 'Según la diapositiva de exportaciones por defecto:', [
          'Una sola por archivo; se importa con cualquier nombre',
          'Puede haber varias por archivo y se importan con el nombre exacto',
          'Solo puede haber una por archivo y se importa entre llaves',
          'Reemplazan a las nombradas: un archivo no puede tener las dos',
        ], 'Ejemplo: export default function saludar() → import miFuncionSaludar from "./funcionPorDefecto.js".'),
        f('arq', '87', 'Según la diapositiva, ESLint es:', [
          'Un linter: analiza el código estáticamente',
          'Un formateador que corrige espacios, comillas y punto y coma',
          'Un bundler que avisa los errores mientras empaqueta',
          'Una extensión de VS Code que se instala aparte de Vite',
        ], 'Detecta variables no definidas e imports olvidados, y avisa si se rompen las reglas de los hooks o faltan dependencias. Ya viene integrado con Vite.'),
        f('arq', '88', 'Según la diapositiva, Prettier se encarga de:', [
          'El estilo visual: espacios, saltos de línea, comillas',
          'Detectar errores de lógica y malas prácticas antes de ejecutar',
          'Avisar cuando falta una dependencia en el array de un hook',
          'Compilar JSX a React.createElement antes de ejecutarlo',
        ], 'Elimina debates en el equipo y se integra con el editor para formatear al guardar.'),
        f('arq', '89', 'Según la diapositiva, ¿qué problema tiene usar ESLint y Prettier juntos y cómo se resuelve?', [
          'Pueden tener reglas en conflicto; se resuelve con eslint-config-prettier',
          'Formatean dos veces el mismo archivo; se resuelve desinstalando ESLint',
          'Ninguno: Vite los integra automáticamente sin configuración',
          'Prettier desactiva las reglas de los hooks; se resuelve con un plugin de React',
        ], 'Son complementarios. Instalación: npm install --save-dev eslint-plugin-prettier eslint-config-prettier.'),
      ],
    },
    {
      id: 'u5-atomic', u: 'V', rango: '90–106', name: 'Atomic Design, Tailwind, proxy y fetch', min: 16,
      qs: [
        f('arq', '90', 'Según la diapositiva, ¿quién propuso Atomic Design y en qué se inspira?', [
          'Brad Frost, en cómo la química organiza la materia',
          'Robert C. Martin, en los principios SOLID',
          'Brad Frost, en la arquitectura de carpetas por módulos',
          'El equipo de React, en el árbol del Virtual DOM',
        ], 'Átomos → moléculas → organismos → plantillas → páginas.'),
        f('arq', '91', 'Según la tabla, ¿qué nivel son "estructuras de página que definen el layout, pero aún sin datos reales"?', [
          'Plantillas (templates)',
          'Páginas (pages)',
          'Organismos (organisms)',
          'Moléculas (molecules)',
        ], 'Las páginas son instancias finales de las plantillas con datos reales (LoginPage, ProductsPage).'),
        f('arq', '91', 'Según la tabla, Input + Label + ErrorMessage → InputField es un ejemplo de:', [
          'Molécula',
          'Átomo',
          'Organismo',
          'Plantilla',
        ], 'Molécula: combinación de átomos que trabajan juntos para una función simple. Organismos: Navbar, Card de producto, Formulario de login.'),
        f('arq', '91', 'Según la tabla, los átomos:', [
          'Son los elementos más pequeños e indivisibles de la UI',
          'Combinan varios elementos para cumplir una función simple',
          'Forman secciones completas de la interfaz, como una navbar',
          'Definen el layout de la página sin datos reales',
        ], 'Ejemplos: botón, input, label, ícono.'),
        f('arq', '92', 'En el ejemplo del Header de la diapositiva 92, ¿qué nivel se le asigna al componente Button personalizado?', [
          'Molécula',
          'Átomo',
          'Organismo',
          'Plantilla',
        ], 'En ese ejemplo los átomos son las etiquetas button y span; Button (componente propio) y Title son moléculas; Header es el organismo.'),
        f('arq', '93', 'En el ejemplo del Sidebar, ¿qué son nav, ul, li y a?', [
          'Átomos',
          'Moléculas',
          'Organismos',
          'Plantillas',
        ], 'Molécula: menú seleccionable. Organismo: Sidebar.'),
        f('arq', '95–96', 'Según la diapositiva, ProductsPage.jsx y CreateProductPage.jsx:', [
          'Toman el Template y lo llenan con su contenido',
          'Definen el esqueleto del dashboard sin datos reales',
          'Son organismos que se reutilizan dentro de un Template',
          'Son plantillas que después usa el componente Dashboard',
        ], 'El Template es el esqueleto del dashboard que define el diseño base.'),
        f('tw', '98', 'Según la diapositiva, ¿cómo funciona Tailwind CSS?', [
          'Escanea los archivos buscando nombres de clase y genera un CSS estático con esos estilos',
          'Incluye todas sus clases en un CSS enorme que se carga entero en cada página',
          'Aplica los estilos en tiempo de ejecución con JavaScript, según las clases del DOM',
          'Convierte los archivos .css del proyecto en clases de utilidad reutilizables',
        ], 'Por eso solo terminan en el CSS final las clases que realmente usaste.'),
        f('tw', '99', 'Según la instalación de la diapositiva, ¿qué va en la primera línea de index.css?', [
          '@import "tailwindcss";',
          'import tailwindcss from "@tailwindcss/vite";',
          '@tailwind base;',
          'tailwindcss()',
        ], 'Pasos: npm install tailwindcss, npm install -D @tailwindcss/vite, en vite.config.js importar tailwindcss y agregar tailwindcss() en plugins, y el @import en index.css.'),
        f('tw', '100', '¿Qué extensión de VS Code recomienda la diapositiva para Tailwind?', [
          'Tailwind CSS IntelliSense',
          'Prettier - Code formatter',
          'ES7+ React Snippets',
          'Live Server',
        ], 'Autocompleta las clases y muestra el CSS que genera cada una.'),
        f('tw', '101', 'Según la diapositiva, en Tailwind los breakpoints:', [
          'Aplican desde (>=) cierta resolución: es mobile first',
          'Solo aplican por debajo de (<=) una resolución, porque es desktop first',
          'Aplican únicamente en el rango exacto de cada breakpoint',
          'Aplican siempre, y el breakpoint solo cambia la prioridad',
        ], 'Las clases sin prefijo aplican a todas las pantallas; md: aplica desde 48rem en adelante.'),
        f('tw', '102', 'Según la tabla de breakpoints, ¿desde qué ancho aplica el prefijo md:?', [
          '48rem (768px)',
          '40rem (640px)',
          '64rem (1024px)',
          '80rem (1280px)',
        ], 'sm 640px · md 768px · lg 1024px · xl 1280px · 2xl 1536px.'),
        d('tw', '101–102', 'En una pantalla de 700px de ancho, ¿qué tamaño de texto tiene este párrafo?', '<p className="text-sm md:text-lg xl:text-2xl">Hola</p>', [
          'text-sm',
          'text-lg',
          'text-2xl',
          'Ninguno: falta el prefijo sm:',
        ], '700px no llega a md (768px), así que solo aplica la clase sin prefijo.'),
        d('entorno', '104', 'Con este vite.config.js, ¿a dónde llega en desarrollo un fetch("/api/auth/login")?', `export default defineConfig({
  server: {
    proxy: {
      '/api': { target: 'http://localhost:5001/' },
    },
  },
  plugins: [react(), tailwindcss()],
});`, [
          'Al backend en http://localhost:5001',
          'Al servidor de Vite, que responde 404',
          'A un archivo api/auth/login de public/',
          'A localhost:5001, pero solo en producción',
        ], 'El proxy del servidor de desarrollo reenvía todo lo que empieza con /api al target. En producción no existe ese proxy.', 'js'),
        d('async', '105', 'En el login de la diapositiva, si el backend responde con error y code 1000, ¿qué ve el usuario?', `const response = await fetch('api/auth/login', { method: 'POST', ... });
if (!response.ok) {
  const errorData = await response.json();
  setErrorMessage(frontendErrorMessage[errorData.code]);
  return;
}

// frontendErrorMessage = { 1000: 'Usuario y/o Contraseña no son correctos' }`, [
          '"Usuario y/o Contraseña no son correctos"',
          'El mensaje de error que mandó el backend',
          'Nada: fetch lanza una excepción y se corta',
          'El texto "1000" en el mensaje de error',
        ], 'fetch no rechaza ante un 4xx/5xx: hay que revisar response.ok. El code del backend se traduce a un mensaje propio del frontend.'),
        f('async', '106', 'En el Ejercicio #33, si falla el endpoint de login hay que:', [
          'Controlar el error y mostrar mensajes según el code',
          'Reintentar la petición hasta que responda bien',
          'Mostrar el mensaje que devuelve el servidor tal cual',
          'Redirigir directamente a la página de error 404',
        ], 'Antes hay que configurar lo necesario en Vite (el proxy).'),
      ],
    },
    {
      id: 'u5-router', u: 'V', rango: '107–123', name: 'React Router, rutas privadas y Outlet', min: 16,
      qs: [
        f('router', '107', 'Según la diapositiva, la principal responsabilidad de React Router Dom es:', [
          'Facilitar la navegación',
          'Hacer las peticiones HTTP al backend',
          'Proteger las rutas que necesitan login',
          'Renderizar las páginas en el servidor',
        ], 'Se instala con npm install react-router-dom.'),
        f('router', '108', 'Según la diapositiva, cada objeto del array de rutas tiene como mínimo:', [
          'path y element',
          'path y component',
          'url y element',
          'path, element y children',
        ], 'path es la URL (puede tener parámetros dinámicos) y element el componente que se monta al entrar.'),
        d('router', '109', 'En esta definición de la diapositiva, ¿qué representa :id en "careers/:id"?', `const routes = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorNotFoundPage />,
    children: [
      { path: '/', element: <MainPage /> },
      { path: 'careers', element: <CareersPage /> },
      { path: 'careers/:id', element: <CareerDetail /> },
    ],
  },
]);
<RouterProvider router={routes} />`, [
          'Un parámetro dinámico (/careers/7)',
          'Un id de HTML que CareerDetail debe tener',
          'Un texto fijo: solo coincide con /careers/:id',
          'Un query param: coincide con /careers?id=7',
        ], 'errorElement es lo que se muestra si la ruta no existe o falla. RouterProvider recibe el router creado.'),
        f('router', '110', 'La diapositiva muestra el menú hecho con <a href> y con <Link to>. ¿Qué cambia con Link?', [
          'Navega sin recargar la página',
          'Abre la ruta en una pestaña nueva',
          'Recarga la página, pero conserva el estado',
          'Solo cambia la URL, sin renderizar la ruta',
        ], 'Un <a href> hace una petición nueva al servidor y se pierde el estado de la app.'),
        d('router', '111', '¿Qué aporta NavLink en este código de la diapositiva?', `<NavLink
  to={'careers'}
  className={({ isActive }) => isActive ? 'app-layout__menu-active' : ''}
>
  Listar Carreras
</NavLink>`, [
          'Sabe si está activo (isActive) y cambia su clase',
          'Valida que el usuario esté logueado antes de navegar a la ruta',
          'Abre la ruta en una pestaña nueva y la marca como visitada',
          'Recarga la página para aplicar los estilos del menú activo',
        ], 'Es un Link con información de si está activo; className puede ser una función.'),
        d('router', '112', '¿Qué hace este botón de la diapositiva?', `const navigate = useNavigate();

<button onClick={() => navigate(\`/careers/\${career.id}\`)}>Ver</button>`, [
          'Navega por código al detalle de esa carrera',
          'Vuelve a la página anterior del historial',
          'Recarga la lista de carreras desde la API',
          'Abre el detalle en una pestaña nueva',
        ], 'useNavigate sirve para navegar desde un componente o hook (por ejemplo, después de un login exitoso).'),
        f('router', '113', '¿Cómo se vuelve a la página anterior según la diapositiva?', [
          'navigate(-1)',
          'navigate("back")',
          'navigate("/")',
          'navigate(0)',
        ], 'const navigate = useNavigate(); <button onClick={() => navigate(-1)}>Volver atrás</button>.'),
        f('router', '114', 'En el Ejercicio #34, ¿qué URLs se definen y qué pasa al loguearse bien?', [
          '/login para Login y /app para Dashboard; se navega de /login a /app',
          '/ para Login y /dashboard para Dashboard; se navega de / a /dashboard',
          '/login para Login y /app para Dashboard; se recarga la página en /app',
          '/app para Login y /login para Dashboard; se navega de /app a /login',
        ], 'Se parte del repo unidad5-boilerplate y Dashboard por ahora solo dice "Hola a todos".'),
        f('router', '115', 'El Ejercicio #35 pide armar el Dashboard con Tailwind pensando en:', [
          'Atomic Design y Mobile First',
          'Screaming Architecture y SOLID',
          'Rutas privadas y Context API',
          'Flexbox y media queries de CSS',
        ], 'Componentes para Header, Sidebar y Footer, replicando apariencia, color y funcionamiento del dashboard de la unidad 4.'),
        f('router', '116–117', '¿Qué objetivo tienen las rutas privadas según la diapositiva y con qué se implementan?', [
          'Mandar al login a quien no está autenticado, con Context API',
          'Ocultar del menú las rutas que no se usan, usando NavLink',
          'Impedir que el usuario escriba la URL a mano, usando el proxy de Vite',
          'Cifrar las URLs privadas, usando localStorage',
        ], 'La protección se arma desde el módulo auth, exponiendo la información del usuario a nivel global.'),
        d('router', '118', 'En el AuthProvider de la diapositiva, ¿cómo se decide isAuthenticated?', `function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    setIsAuthenticated(localStorage.getItem('token') ? true : false);
  }, []);
  return (
    <AuthContext.Provider value={{ isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}`, [
          'Al montar, según haya un token en localStorage',
          'En cada render, pidiéndole el token al backend',
          'Cuando el usuario envía el formulario de login',
          'Siempre es false hasta que se recarga la página',
        ], 'El Provider expone value a todos los componentes que envuelve (children).'),
        d('router', '119', 'Según el useAuth de la diapositiva, ¿qué pasa si se usa fuera de un AuthProvider?', `const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};`, [
          'Lanza un error que avisa que debe usarse dentro de un AuthProvider',
          'Devuelve { isAuthenticated: false } y la app redirige al login',
          'Crea un AuthProvider nuevo automáticamente y lo devuelve',
          'Devuelve undefined sin avisar, y falla más adelante',
        ], 'Se crea en la carpeta "hook" para acceder a la sesión desde cualquier lugar de la app.'),
        d('router', '120', '¿Qué devuelve ProtectedRoute si el usuario NO está autenticado?', `function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to='/login' />;
  }
  return children;
}`, [
          'Un <Navigate to="/login" />',
          'El children, pero deshabilitado',
          'null, y la página queda en blanco',
          'Un error que muestra errorElement',
        ], 'Si está autenticado retorna el componente Page recibido como children.'),
        f('router', '121', 'Según la implementación de rutas privadas, ¿qué envuelve cada componente?', [
          'AuthProvider envuelve toda la app; ProtectedRoute solo a los componentes privados',
          'ProtectedRoute envuelve toda la app; AuthProvider solo a los componentes privados',
          'AuthProvider y ProtectedRoute envuelven cada ruta privada por separado',
          'AuthProvider va dentro de cada página; ProtectedRoute envuelve al router',
        ], 'En el ejemplo: <AuthProvider><RouterProvider router={router} /></AuthProvider>, y la ruta /orders tiene element: <ProtectedRoute><ListOrdersPage /></ProtectedRoute>.'),
        f('router', '122', 'En "Dependencias entre rutas", Home, ListProductsPage y ListOrdersPage se definen como children de /admin. ¿Qué falta además para que se vean dentro de Dashboard?', [
          'Indicar dentro de Dashboard dónde se renderizan, con <Outlet />',
          'Envolver cada página hija en su propio ProtectedRoute',
          'Importar las tres páginas dentro de Dashboard y renderizarlas',
          'Nada: con definir children ya aparecen debajo de Dashboard',
        ], 'La diapositiva lo aclara: no alcanza con la dependencia, hay que indicar dentro de Dashboard dónde se renderiza.'),
        f('router', '123', 'Según la diapositiva, Outlet es:', [
          'Un componente donde se renderizan las rutas hijas',
          'Un hook que devuelve la ruta hija que está activa',
          'Un componente que redirige a la ruta hija por defecto',
          'Un componente que protege a las rutas hijas del acceso',
        ], 'Se importa de react-router-dom y se ubica donde debe aparecer la hija, por ejemplo dentro de <main>.'),
      ],
    },
  ];

  BLOQUES.forEach((b) => b.qs.forEach((q, i) => { q.id = `${b.id}-${i + 1}`; }));
  window.DIAPOS.BLOQUES.push(...BLOQUES);
  window.PRACTICA.QUESTIONS.push(...window.DIAPOS.BLOQUES.flatMap((b) => b.qs));
})();
