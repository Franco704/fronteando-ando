/* Práctica por diapositivas — Unidad IV (HTML, CSS, JavaScript).
   Mismo formato que el banco: o[0] = correcta (se mezcla al mostrarse), t = tema, d = 'f' | 'd'.
   s = diapositiva de donde sale la pregunta; se antepone a la explicación. */
(() => {
  const U = 'U4';
  const f = (t, s, q, o, e) => ({ t, d: 'f', q, o, e: `📍 ${U} · diap. ${s} — ${e}` });
  const d = (t, s, q, c, o, e, l = 'js') => ({ t, d: 'd', q, c, l, o, e: `📍 ${U} · diap. ${s} — ${e}` });

  const BLOQUES = [
    {
      id: 'u4-web', u: 'IV', rango: '2–24', name: 'Fundamentos web, renderizado y DevTools', min: 18,
      qs: [
        f('web', '4', 'Según el "Material de Estudio" de la primera parte, ¿qué temas figuran como complementarios y no como obligatorios?', [
          'DevTools, diseño responsive y mobile first',
          'Media queries, cascada y herencia de CSS',
          'Nombre de dominio, URL y servidor web',
          'HTML, CSS y funcionamiento de internet',
        ], 'Los obligatorios son internet, dominio, URL, servidor web, HTML, CSS, cascada/herencia y media queries. Complementarios: DevTools, diseño responsive y mobile first.'),
        f('web', '7', 'En la diapositiva de fundamentos, Webpack, Babel y Vite aparecen agrupados como:', [
          'Bundlers y transpiladores',
          'Gestores de paquetes',
          'Frameworks y bibliotecas',
          'Preprocesadores de CSS',
        ], 'Gestores de paquetes: npm, yarn. Preprocesadores: SASS, LESS. Frameworks: React, Vue, Angular.'),
        f('web', '7', 'Entre los conceptos importantes del backend, ¿cuál "define cómo responder a solicitudes HTTP"?', [
          'Rutas (Routing)',
          'APIs (REST, GraphQL)',
          'Autenticación y autorización',
          'Modelo cliente-servidor',
        ], 'Las APIs permiten que frontend y backend se comuniquen; la autenticación/autorización controla el acceso (JWT, OAuth). El modelo cliente-servidor está en "conocimientos generales".'),
        f('web', '7', 'Nginx y Apache aparecen en la diapositiva como ejemplo de:', [
          'Servidor web',
          'Framework de backend',
          'Contenedor o entorno virtual',
          'Despliegue en la nube',
        ], 'Componentes clave del backend: servidor web (Nginx, Apache), frameworks de backend y base de datos. Docker/Vagrant son contenedores; Vercel/Netlify, despliegue.'),
        f('web', '7', 'En la columna "Conocimientos generales", ¿bajo qué subtítulo aparecen seguridad, performance, accesibilidad (a11y), responsive design y control de versiones?', [
          'Buenas prácticas',
          'Protocolos y arquitectura',
          'Testing y mantenimiento',
          'Conceptos importantes',
        ], 'La columna tiene tres subtítulos: Protocolos y arquitectura (HTTP/HTTPS, DNS, IP, URL, cliente-servidor, ciclo de una petición), Buenas prácticas y Testing y mantenimiento (tests, CI/CD, documentación). "Conceptos importantes" es de la columna Backend.'),
        f('web', '7', 'GitHub Actions y Jenkins se mencionan como ejemplos de:', [
          'CI/CD: integración y despliegue continuo',
          'Testing unitario, de integración y e2e',
          'Contenedores y entornos virtuales',
          'Control de versiones del código',
        ], 'Ambos aparecen en el ítem CI/CD de "Testing y mantenimiento", dentro de la columna "Conocimientos generales".'),
        f('web', '8', 'En la URL https://www.google.com/search?q=chatgpt, ¿qué parte es "/search"?', [
          'La ruta del recurso',
          'El dominio',
          'Los parámetros',
          'El protocolo',
        ], 'Protocolo: https:// · Dominio: www.google.com · Ruta del recurso: /search · Parámetros: ?q=chatgpt.'),
        f('web', '8', 'Según la diapositiva, "nombre fácil de recordar que se usa para acceder a una dirección IP" es la definición de:', [
          'Dominio',
          'URL',
          'DNS',
          'Ruta',
        ], 'El DNS es el sistema que traduce ese dominio a la IP real; la URL es la dirección completa que escribís en el navegador.'),
        f('web', '8', '¿Qué hace el DNS en el ejemplo de www.google.com?', [
          'Convierte el dominio en la IP 142.250.217.46',
          'Asigna una IP única al dispositivo del usuario',
          'Arma la URL completa con protocolo y parámetros',
          'Cifra la conexión entre navegador y servidor',
        ], 'Después, el navegador usa esa IP para conectarse al servidor de Google. La IP identifica a cada dispositivo; el DNS solo traduce.'),
        f('web', '9–10', 'En el diagrama "en nuestra local", ¿qué piezas quedan dentro del servidor web?', [
          'HTTP/proxy, servidor de aplicación y base de datos',
          'Cliente, internet y servidor que devuelve el documento HTML',
          'Balanceador, servidores de frontend y servidores de backend',
          'Navegador, DNS y servidor de aplicación con su base de datos',
        ], 'El cliente envía la solicitud HTTP/S (URL) y recibe "Documentos HTML o JSON". La visión simplificada era cliente → internet → servidor.'),
        f('web', '11', 'En el caso de uso real (CaminsDrive), la petición del usuario pasa primero por un firewall y luego por:', [
          'Un balanceador (Apache) que reparte entre varios nginx + ownCloud',
          'Un servidor OpenLDAP que valida y luego sirve los archivos',
          'Un servidor NFS + MySQL que entrega el HTML terminado',
          'Un único servidor nginx que hace de frontend y de base de datos',
        ], 'El diagrama tiene tres bloques: Balancer (Apache), Frontend (varios nginx + ownCloud) y Backend (OpenLDAP, NFS + MySQL, archivos y base de datos).'),
        f('web', '13', '¿Cuál de estos NO aparece en la lista "Frontend - ¿Qué contiene?"', [
          'Consultas a la base de datos',
          'Validaciones y navegación entre páginas',
          'Accesibilidad para personas con discapacidad',
          'Gráficas y planillas',
        ], 'La lista: menús, formularios, botones, imágenes, animaciones, validaciones, navegación, responsive, accesibilidad, gráficas, planillas. La base de datos es del backend.'),
        f('web', '14', '¿En qué orden muestra la diapositiva el proceso de renderizado de una página web?', [
          'Usuario accede → servidor envía HTML, JS… → navegador procesa → página representada',
          'Navegador procesa → usuario accede → servidor envía el código → página representada',
          'Servidor envía el código → usuario accede → página representada → navegador procesa',
          'Usuario accede → navegador procesa → servidor envía el código → página representada',
        ], 'Renderizar es transformar el código en una interfaz visual e interactiva en el navegador; el código tiene que llegar antes de procesarse.'),
        f('web', '15', '¿Qué contras le asigna la diapositiva al SSR (Server-Side Rendering)?', [
          'Carga más lenta entre páginas y más recursos del servidor',
          'Peor SEO porque el contenido inicial no está en el HTML',
          'Manejo más complejo del estado y de las rutas',
          'Configuración compleja y necesidad de service workers',
        ], 'Las otras son los contras de CSR, SPA y PWA. Pros del SSR: buena performance y SEO optimizado.'),
        f('web', '16', '¿Qué pros le asigna la diapositiva al CSR (Client-Side Rendering)?', [
          'Navegación fluida y separación clara entre frontend y backend',
          'Buena performance y SEO optimizado desde la primera carga',
          'Carga rápida, experiencia tipo app y funcionamiento offline',
          'Contenido completo en el HTML que envía el servidor',
        ], 'En CSR el navegador recibe un HTML vacío y lo completa con JavaScript. Contras: peor SEO y primera carga más lenta.'),
        f('web', '15–16', 'Next.js (modo SSR), Laravel, RoR y ASP.NET MVC se listan como frameworks de SSR. ¿Cuáles se listan para CSR?', [
          'React (con Vite o CRA), Vue y Angular',
          'Astro y otros generadores estáticos',
          'WordPress, PHP y ASP tradicionales',
          'Next.js en modo estático y Gatsby',
        ], 'Astro aparece en SSG; PHP, WordPress y ASP como ejemplo de MPA.'),
        f('web', '17', 'Según la diapositiva, una SPA es:', [
          'Un tipo particular de CSR en el que la navegación no recarga la página',
          'Un tipo particular de SSR que prerenderiza cada ruta en el servidor',
          'Un enfoque que permite instalar la app y que funcione sin conexión',
          'Varias páginas HTML que comparten los mismos estilos y scripts',
        ], 'Toda la app corre en un solo index.html (Gmail, Trello, Drive). Contras: estado y rutas más complejos y SEO limitado (se usa prerendering).'),
        f('web', '18', '¿Qué aclara la diapositiva sobre la PWA?', [
          'No es un método de renderizado: es un enfoque',
          'Es un tipo de CSR que reemplaza el index.html por un service worker',
          'Es un tipo de SSG que genera las páginas al instalar la aplicación',
          'Es una SPA con prerendering para resolver el problema del SEO',
        ], 'La PWA permite funcionar offline, verse como app móvil e instalarse (ej. Spotify web). Contra: compleja de configurar.'),
        f('web', '15, 19', '"Blogs, ecommerce, portales de noticias" y "blogs, landing pages, portfolios" son, respectivamente, ejemplos de:', [
          'SSR y SSG',
          'SSG y SSR',
          'CSR y MPA',
          'MPA y SPA',
        ], 'SSR: contenido que cambia seguido y necesita buen SEO. SSG (Static Site Generation): sitios estáticos, con herramientas como Astro.'),
        f('web', '19', 'Los "sitios tradicionales en PHP, WordPress, ASP" son el ejemplo de:', [
          'MPA (Multi-Page Application)',
          'SSG (Static Site Generation)',
          'SPA (Single Page Application)',
          'PWA (Progressive Web App)',
        ], 'En una MPA cada navegación pide una página nueva al servidor.'),
        f('web', '20', '¿Qué tres herramientas presenta "Herramientas a utilizar"?', [
          'VS Code, línea de comandos y Git',
          'VS Code, Node.js y el gestor npm',
          'WebStorm, Docker y la terminal',
          'VS Code, Chrome y Postman',
        ], 'Node y npm aparecen recién en la Unidad 5.'),
        f('web', '21', '¿Cuál NO figura entre las formas de abrir las DevTools?', [
          'Ctrl + U',
          'F12',
          'Click derecho → Inspeccionar',
          'Configuración → Más herramientas → Herramientas del desarrollador',
        ], 'Ctrl + U muestra el código fuente de la página, no abre las DevTools.'),
        f('web', '22', '¿Qué pestaña de DevTools se usa para colocar breakpoints y depurar paso a paso?', [
          'Sources',
          'Console',
          'Elements',
          'Performance',
        ], 'Console: ejecutar JS y ver logs. Elements: ver y editar HTML/CSS en vivo. Performance: FPS, repaints y tiempos.'),
        f('web', '22', 'Querés ver las peticiones HTTP que hace la página, sus tiempos de carga y cabeceras. ¿Qué pestaña usás?', [
          'Network',
          'Application',
          'Sources',
          'Security',
        ], 'Network: análisis de solicitudes y recursos de red.'),
        f('web', '23', '¿Qué pestaña permite revisar cookies, localStorage, sessionStorage y cachés?', [
          'Application',
          'Network',
          'Memory',
          'Security',
        ], 'Application: gestión de almacenamiento local y recursos.'),
        f('web', '23', 'Necesitás detectar una fuga de memoria y ver el heap. ¿Qué pestaña corresponde?', [
          'Memory',
          'Performance',
          'Lighthouse',
          'Sources',
        ], 'Performance mide FPS, repaints, scripting y renderizado; el heap y las fugas se analizan en Memory.'),
        f('web', '23', '¿Qué pestaña verifica HTTPS y problemas de contenido mixto?', [
          'Security',
          'Network',
          'Lighthouse',
          'Application',
        ], 'Security: revisión de certificados y políticas de seguridad.'),
        f('web', '23', '¿Qué pestaña evalúa performance, accesibilidad, SEO y PWA, y existe solo en Chrome?', [
          'Lighthouse',
          'Performance',
          'Security',
          'Elements',
        ], 'Lighthouse es una auditoría de calidad. Performance solo mide el rendimiento de ejecución.'),
        f('web', '24', '¿Qué extensiones del navegador presenta la diapositiva?', [
          'React Developer Tools y React Context Devtool',
          'Redux DevTools y Vue.js devtools',
          'Lighthouse y React Profiler',
          'Tailwind CSS IntelliSense y ESLint para VS Code',
        ], 'Las dos son para inspeccionar componentes y contextos de React.'),
      ],
    },
    {
      id: 'u4-html', u: 'IV', rango: '25–39', name: 'HTML: estructura, semántica y formularios', min: 14,
      qs: [
        f('html', '25', 'Según la diapositiva, HTML es:', [
          'Un lenguaje para estructurar páginas web mediante etiquetas',
          'Un lenguaje de programación que interpreta el navegador',
          'Un lenguaje de estilos que describe cómo renderizar',
          'Una representación del documento como nodos y objetos',
        ], 'Es el esqueleto de la página. CSS describe cómo se renderiza; el DOM representa el documento como nodos y objetos.'),
        f('html', '26', '¿Qué dice la diapositiva sobre la etiqueta de cierre?', [
          'Hay que cerrar siempre: nunca confiar en que el navegador complete la estructura',
          'Se puede omitir, porque el navegador completa siempre dónde termina el elemento',
          'Solo es obligatoria en los elementos que contienen otros elementos',
          'Solo es obligatoria si el documento declara <!DOCTYPE html>',
        ], 'Algunos navegadores completan la estructura, pero la diapositiva lo remarca en mayúsculas: no se debe confiar en esto nunca.'),
        f('html', '26', 'La etiqueta de cierre se diferencia de la de apertura porque:', [
          'Lleva una barra diagonal antes del nombre',
          'Lleva un signo igual después del nombre',
          'Pone el contenido de la etiqueta entre comillas',
          'Repite los atributos de la apertura',
        ], 'Apertura: <p>. Contenido: el texto. Cierre: </p>.'),
        d('html', '27', '¿Qué problema muestra este ejemplo de la diapositiva de anidamiento?', '<p>Mi gato es <strong>muy gruñón.</p></strong>', [
          'Se cierra p antes que strong: el anidamiento está cruzado',
          'strong no puede ir dentro de un párrafo porque es un elemento de bloque',
          'A strong le falta la barra de cierre automático: debería ser <strong />',
          'Ninguno: se ve igual que el correcto, así que el anidamiento es válido',
        ], 'Lo correcto es <p>Mi gato es <strong>muy</strong> gruñón.</p>: el último en abrirse es el primero en cerrarse.', 'html'),
        f('html', '27', '¿Por qué <img src="…" alt="…" /> aparece como "caso especial" de anidamiento?', [
          'Es un elemento vacío: no tiene contenido ni cierre',
          'Hay que cerrarlo siempre con </img> después del atributo alt',
          'Es el único elemento cuyos atributos no van entre comillas',
          'Tiene que estar anidado dentro de un párrafo para mostrarse',
        ], 'La información de la imagen va toda en atributos (src, alt).'),
        f('html', '28', '¿Cuál NO es un requisito de un atributo según la diapositiva?', [
          'Que su nombre se escriba en mayúsculas',
          'Un espacio entre el atributo y el elemento',
          'El nombre seguido de un signo igual',
          'El valor entre comillas de apertura y cierre',
        ], 'Ejemplo de la diapositiva: <p class="editor-note">. Las comillas tienen casos particulares.'),
        f('html', '29', 'Según la anatomía de un documento HTML, <!DOCTYPE html>:', [
          'Indica que el documento es HTML5',
          'Es el elemento raíz del documento',
          'Contiene los metadatos y el título',
          'Agrupa el contenido visible',
        ], '<html> es el elemento raíz; <head> tiene metadatos, título y enlaces a estilos o scripts; <body> el contenido visible.'),
        f('html', '29', '¿Dónde van los metadatos, el título y los enlaces a estilos o scripts?', [
          '<head>',
          '<header>',
          '<body>',
          '<main>',
        ], 'No confundir <head> (metadatos del documento) con <header> (cabecera visible del sitio o sección).'),
        f('html', '30', '¿Qué etiquetas presenta la diapositiva como divisiones genéricas sin semántica?', [
          '<div> y <span>',
          '<section> y <article>',
          '<main> y <aside>',
          '<p> y <figure>',
        ], 'section y article son semánticas (sección genérica de contenido y contenido independiente).'),
        f('html', '30', '¿Cuál es la estructura de una lista ordenada?', [
          '<ol><li>…</li></ol>',
          '<ul><li>…</li></ul>',
          '<li><ol>…</ol></li>',
          '<ol><ul>…</ul></ol>',
        ], 'ol = ordered list (numerada); ul = unordered list (viñetas). Los ítems siempre son <li>.'),
        f('html', '31', 'Según la diapositiva, las etiquetas semánticas transmiten el significado del contenido y mejoran:', [
          'La accesibilidad y el SEO',
          'La performance y la caché',
          'La seguridad y la validación',
          'El diseño responsive',
        ], 'Visualmente un <nav> y un <div> son iguales; la diferencia está en el significado.'),
        f('html', '31', '¿Qué etiqueta se describe como "contenido independiente (artículos, entradas)"?', [
          '<article>',
          '<section>',
          '<aside>',
          '<main>',
        ], '<section>: sección genérica de contenido. <aside>: contenido secundario (sidebar). <main>: contenido principal de la página.'),
        f('html', '31', '¿Cuál NO está en la lista "Otras" de etiquetas semánticas?', [
          '<span>',
          '<mark>',
          '<time>',
          '<details>',
        ], 'La lista: <mark>, <time>, <progress>, <details>, <summary>. <span> es una división genérica sin semántica.'),
        f('html', '33', 'En el Ejercicio #17, los enlaces "Panel", "Doctores", "Especialidades" y "Búsqueda de Pacientes" van dentro de:', [
          '<nav>',
          '<header>',
          '<main>',
          '<footer>',
        ], 'Orden pedido: header ("Soy una página"), nav (los 4 enlaces), main (div "Hola a todos!") y footer.'),
        f('html', '34', 'En el Ejercicio #17.2, ¿cómo se relacionan index.html y doctors.html?', [
          'Con el atributo href de los <a>, que apunta a cada archivo',
          'Con un <link> en el head de cada página',
          'Con el atributo src de los <a>, que carga la otra página',
          'Con un formulario cuyo action apunta a doctors.html',
        ], '"Panel" apunta a index.html y "Doctors" a doctors.html; al hacer clic se navega entre páginas.'),
        f('html', '35', 'En <form action="/procesar" method="POST">, ¿qué indica action?', [
          'La URL a la que se envían los datos',
          'El método HTTP con el que se envían',
          'La función de JS que valida el formulario',
          'El tipo de codificación de los datos',
        ], 'El método va en method. Un formulario permite enviar datos a un servidor o procesarlos en el cliente.'),
        f('html', '36', '¿Qué tipo de input se describe como "opción única dentro de un grupo"?', [
          'radio',
          'checkbox',
          'select',
          'option',
        ], 'checkbox es una casilla de verificación (se pueden marcar varias). select + option es un menú desplegable.'),
        f('html', '36', 'En el ejemplo <input type="radio" name="color"> Rojo, ¿qué hace que varios radios formen un grupo?', [
          'Compartir el mismo name',
          'Compartir el mismo id',
          'Estar dentro del mismo label',
          'Tener el mismo value',
        ], 'Los radios con el mismo name son excluyentes entre sí. El id debe ser único en la página.'),
        f('html', '37', '¿Cómo se asocia un <label> con su control en el ejemplo <label for="email">Correo</label>?', [
          'El for del label coincide con el id del input',
          'El for del label coincide con el name del input',
          'El id del label coincide con el for del input',
          'El texto del label coincide con el value del input',
        ], 'Así, al hacer clic en el texto se enfoca el input, y los lectores de pantalla lo anuncian.'),
        f('html', '37', '¿Qué hace <input type="reset">?', [
          'Limpia los campos del formulario',
          'Envía el formulario sin validar',
          'Recarga la página completa',
          'Borra el último carácter escrito',
        ], 'type="submit" es el botón para enviar el formulario.'),
        d('html', '38', 'En el ejemplo de la diapositiva, si el usuario elige "Argentina", ¿qué valor se envía para el campo pais?', `<select id="pais" name="pais">
  <option value="ar">Argentina</option>
  <option value="br">Brasil</option>
  <option value="uy">Uruguay</option>
</select>`, [
          'ar',
          'Argentina',
          'pais',
          '0',
        ], 'Se envía el value de la option elegida, con la clave del name del select (pais=ar). El texto visible es solo para el usuario.', 'html'),
        f('html', '39', 'El Ejercicio #18 pide un login con "validaciones en cada campo" sin escribir JavaScript. ¿Cómo se logra?', [
          'Con el atributo required en cada input',
          'Con type="email" en el nombre de usuario',
          'Con el evento submit y preventDefault',
          'Con pattern en el input de contraseña',
        ], 'Usuario (text, requerido), contraseña (password, requerido) y un button de tipo submit.'),
      ],
    },
    {
      id: 'u4-css', u: 'IV', rango: '40–49', name: 'CSS: selectores, unidades y especificidad', min: 16,
      qs: [
        f('css', '40', 'Según la diapositiva, CSS es:', [
          'Un lenguaje de estilos que describe cómo renderizar un elemento',
          'Un lenguaje de marcado que define la estructura y los estilos del documento',
          'Una API del navegador que permite modificar los estilos de los nodos',
          'Un lenguaje de programación que agrega comportamiento a los elementos',
        ], 'Hojas de Estilo en Cascada (Cascading Style Sheets).'),
        f('css', '41', '¿Qué desventaja le asigna la tabla al CSS interno (<style> dentro del <head>)?', [
          'No separa contenido de estilo',
          'No es reutilizable y es difícil de mantener',
          'Requiere una carga adicional',
          'Es más lento para hacer pruebas',
        ], 'Inline: no reutilizable, difícil de mantener. Externo: requiere carga adicional. "Útil para archivos simples o pruebas" es la ventaja del interno.'),
        f('css', '41', '¿Qué ventaja le asigna la tabla al CSS externo y qué desventaja?', [
          'Reutilizable, limpio y organizado / requiere carga adicional',
          'Rápido para pruebas / no reutilizable y difícil de mantener',
          'Útil para archivos simples / no separa contenido de estilo',
          'Mayor especificidad / no se puede sobrescribir con clases',
        ], 'Se referencia con <link rel="stylesheet" href="estilos.css">.'),
        f('css', '41', '¿Cuál es la ventaja del CSS inline (atributo style)?', [
          'Rápido para pruebas',
          'Reutilizable y organizado',
          'Separa contenido de estilo',
          'No requiere el atributo style',
        ], 'Ejemplo: <h1 style="color: red;">Hola</h1>. Desventaja: no reutilizable, difícil de mantener.'),
        f('css', '42–43', '¿Qué selecciona el selector agrupado h1, h2, p { }?', [
          'Todos los h1, todos los h2 y todos los p',
          'Los p que están dentro de un h2 dentro de un h1',
          'Solo los elementos que son h1, h2 y p a la vez',
          'El primer p que sigue a un h1 o a un h2',
        ], 'La coma agrupa selectores independientes: misma regla para los tres.'),
        f('css', '43–44', '¿Qué diferencia hay entre article p { } y ul > li { }?', [
          'El primero toma cualquier p dentro de article; el segundo solo los li hijos directos de ul',
          'El primero toma solo los p hijos directos de article; el segundo cualquier li dentro de ul',
          'Los dos seleccionan descendientes en cualquier nivel; > solo da más especificidad',
          'El primero selecciona al article que contiene un p; el segundo al ul que contiene un li',
        ], 'Espacio = descendiente (cualquier profundidad). > = hijo directo.'),
        f('css', '44', 'Según la tabla, ¿qué selecciona h1 + p?', [
          'El primer p que sigue a un h1',
          'Todos los p que siguen a un h1',
          'Los p que están dentro de un h1',
          'El h1 y el p, con la misma regla',
        ], 'Es el selector de hermano adyacente: solo el p inmediatamente posterior al h1, al mismo nivel.'),
        f('css', '44', '¿Qué tipo de selector es input[type="text"]?', [
          'De atributo',
          'De pseudo-clase',
          'De clase',
          'De hijo directo',
        ], 'Selecciona los inputs de tipo texto.'),
        f('css', '45', '¿Qué tipo de selector es p::first-line y qué selecciona?', [
          'Pseudo-elemento: la primera línea de cada párrafo',
          'Pseudo-clase: el primer párrafo del documento',
          'Pseudo-elemento: el primer párrafo de cada contenedor',
          'Pseudo-clase: la primera línea de cada párrafo',
        ], 'Pseudo-elemento (::) = una parte del elemento. Pseudo-clase (:) = un estado, como a:hover "al pasar el mouse".'),
        f('css', '46', 'En el Ejercicio #19, después de poner bordes con el atributo style, ¿qué se pide?', [
          'Aplicar los mismos estilos en un archivo externo',
          'Pasar los estilos a una etiqueta <style> interna',
          'Reemplazar los bordes por colores de fondo',
          'Aplicar los estilos solo en la versión mobile',
        ], 'Bordes: header gris, nav rojo (30px), main azul (100px), footer verde (30px).'),
        f('css', '47', 'Según la tabla de unidades, ¿cuáles son absolutas (fijas)?', [
          'px, cm, mm, in',
          'px, em, rem',
          '%, vw, vh',
          'rem, dvw, dvh',
        ], 'cm/mm/in se usan sobre todo para medios impresos. em, rem, %, vw/vh y dvw/dvh son relativas (escalables, fluidas).'),
        f('css', '47', '¿Respecto a qué es relativa cada unidad: em y rem?', [
          'em: tamaño de fuente del padre · rem: tamaño de fuente de la raíz html',
          'em: tamaño de fuente de la raíz html · rem: tamaño de fuente del padre',
          'em: ancho del contenedor padre · rem: ancho del viewport',
          'em: tamaño de fuente del propio body · rem: tamaño del elemento padre',
        ], 'rem = root em. El % es relativo al tamaño del contenedor padre directo.'),
        f('css', '47', 'Según la diapositiva, 1vh (o 1dvh) equivale a:', [
          'El 1% del alto del viewport',
          'El 1% del alto del padre',
          '1/100 del font-size raíz',
          'Un píxel físico de la pantalla, en vertical',
        ], 'vw/vh: viewport estándar; dvw/dvh: viewport dinámico. 1vw es el 1% del ancho.'),
        f('css', '48', '"El orden de las reglas SÍ importa en CSS" es la definición de:', [
          'Cascada',
          'Especificidad',
          'Herencia',
          'Prioridad',
        ], 'Especificidad: cómo decide el navegador entre reglas con distintos selectores. Herencia: un valor del padre puede o no pasar a los hijos.'),
        f('css', '48', 'Según la diapositiva, la herencia significa que:', [
          'Algunos valores del padre pueden o no pasar a los hijos',
          'Todas las propiedades del padre se heredan siempre a los hijos',
          'Cuando dos reglas empatan, gana la que aparece más abajo',
          'El navegador elige la regla con el selector más específico',
        ], 'La palabra clave de la diapositiva es "PUEDE o NO": color se hereda, border no.'),
        f('css', '49', 'En la jerarquía de la diapositiva, !important "sobrescribe todo, excepto…":', [
          'Los estilos en línea que también usan !important',
          'Los selectores de ID que aparecen más abajo',
          'Los estilos en línea, aunque no usen !important',
          'Las pseudo-clases como :hover o :focus',
        ], 'Orden: 1) !important, 2) estilos en línea, 3) ID, 4) clase/atributo/pseudo-clase, 5) elemento/pseudo-elemento, 6) universal y combinadores.'),
        f('css', '49', '¿En qué nivel de la jerarquía ubica la diapositiva al selector universal y a los combinadores (div p, >)?', [
          'En el último (6), con la menor prioridad',
          'En el 5, junto a elementos y pseudo-elementos',
          'En el 4, junto a clases y atributos',
          'No figuran: no forman parte de la jerarquía',
        ], 'Los combinadores no suman especificidad por sí mismos; cuentan los selectores que unen.'),
        f('css', '49', 'Según la jerarquía, ¿qué nivel comparten [type="text"] y :hover?', [
          'El de las clases (.rojo)',
          'El de los IDs (#miElemento)',
          'El de los elementos (p, h1)',
          'El de los pseudo-elementos (::after)',
        ], 'Nivel 4: clase, atributo o pseudo-clase. ::after va con los elementos (nivel 5).'),
        d('css', '48–49', '¿De qué color se ve el párrafo?', `<style>
  p { color: red; }
  .rojo { color: blue; }
  p { color: green; }
</style>
<p class="rojo">Texto</p>`, [
          'Azul',
          'Verde',
          'Rojo',
          'Negro',
        ], 'La cascada (el orden) solo desempata entre reglas de igual especificidad. .rojo (clase) le gana a p (elemento) aunque el p verde esté más abajo.', 'html'),
        d('css', '49', '¿De qué color se ve el párrafo?', `<style>
  #a { color: red; }
  .b { color: green !important; }
</style>
<p id="a" class="b" style="color: blue;">Hola</p>`, [
          'Verde',
          'Azul',
          'Rojo',
          'Negro',
        ], '!important (nivel 1) le gana al estilo en línea (nivel 2) y al ID (nivel 3). Solo lo vencería un style en línea con !important.', 'html'),
      ],
    },
    {
      id: 'u4-layout', u: 'IV', rango: '50–73', name: 'Diseño, Flexbox, Grid, responsive y position', min: 18,
      qs: [
        f('layout', '50', 'En las zonas de un diseño web, ¿a cuál corresponde "un sistema de navegación alternativo"?', [
          'Al contenido secundario',
          'Al encabezado',
          'Al contenido principal',
          'Al pie de página',
        ], 'Contenido secundario: info complementaria, info compartida entre un subconjunto de páginas o navegación alternativa; todo lo que no es requerido por el contenido principal.'),
        f('layout', '50', 'Según la diapositiva, el contenido principal es:', [
          'El área más grande, con contenido único para la página actual',
          'El área superior, con información relevante para todas las páginas',
          'La información complementaria compartida entre varias páginas',
          'El área inferior, con avisos legales e información de contacto',
        ], 'Encabezado: arriba, global y con navegación. Pie: abajo, global y menos llamativo (avisos legales, contacto).'),
        f('layout', '51–54', 'En los diagramas de diseño de 1, 2 y 3 columnas, ¿qué representan 1, 2, A y B1/B2?', [
          '1 encabezado, 2 pie, A contenido principal, B1/B2 contenido secundario',
          '1 contenido principal, 2 secundario, A encabezado, B1/B2 pies de página',
          '1 y 2 columnas laterales, A encabezado, B1/B2 bloques de navegación',
          '1 pie de página, 2 encabezado, A secundario, B1/B2 contenido principal',
        ], 'En 1 columna, B1 y B2 se apilan debajo de A; en 2 y 3 columnas pasan a los costados.'),
        f('layout', '57', 'Según la diapositiva, Flexbox es:', [
          'Un sistema unidimensional: organiza en fila o en columna',
          'Un sistema bidimensional: organiza en filas y columnas',
          'Un sistema para posicionar elementos fuera del flujo',
          'Un sistema pensado para layouts completos de página',
        ], 'Fue creado para alinear y distribuir espacio entre los elementos de un contenedor. Grid es el bidimensional.'),
        f('layout', '58', 'flex-grow, flex-shrink y flex-basis corresponden a la característica de Flexbox llamada:', [
          'Flexibilidad',
          'Espaciado',
          'Alineación',
          'Dirección',
        ], 'Alineación: justify-content y align-items. Espaciado: space-between, space-around, gap. Flexibilidad: estirarse o encogerse según el espacio.'),
        f('layout', '58', 'Según la diapositiva, justify-content y align-items sirven para:', [
          'Centrar en el eje principal y en el cruzado',
          'Definir si la fila crece o se encoge',
          'Elegir entre fila y columna',
          'Repartir el espacio entre filas y columnas',
        ], 'justify-content trabaja sobre el eje principal; align-items sobre el cruzado.'),
        d('layout', '59', 'En el ejemplo de Flexbox de la diapositiva, ¿qué logra flex: 1 en .page .container?', `.page { height: 100vh; display: flex; flex-direction: column; }
.page .container { flex: 1; display: flex; }
.page .container nav { width: 200px; }
.page .container main { flex: 1; }`, [
          'Que el contenedor ocupe todo el alto que dejan libre el header y el footer',
          'Que nav y main tengan exactamente el mismo ancho dentro del contenedor',
          'Que el contenedor ordene a nav y main en una sola columna, uno abajo del otro',
          'Que el footer quede fijo al fondo de la ventana al hacer scroll',
        ], '.page es una columna de 100vh: header y footer toman su alto natural y el contenedor crece con flex: 1. Adentro, nav mide 200px y main (flex: 1) ocupa el resto del ancho.', 'css'),
        f('layout', '60–61', '¿Con qué propiedades Grid "posiciona elementos en celdas específicas"?', [
          'grid-column y grid-row',
          'grid-template-columns y grid-template-rows',
          'grid-template-areas',
          'justify-content y align-items',
        ], 'grid-template-columns/rows definen la cuadrícula; grid-template-areas define áreas con nombre.'),
        d('layout', '62', 'En el ejemplo de Grid de la diapositiva, ¿cómo se reparte la fila del medio?', `.page {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  height: 100vh;
}`, [
          'sidebar con 200px y main con el resto del ancho; la fila toma todo el alto sobrante',
          'sidebar y main con la mitad del ancho cada uno; la fila toma su alto natural',
          'main con 200px y sidebar con el resto del ancho; la fila toma todo el alto sobrante',
          'header ocupa la fila del medio, porque aparece dos veces en grid-template-areas',
        ], 'Columnas: 200px y 1fr. Filas: auto (header), 1fr (sidebar/main, el resto del alto) y auto (footer). Header y footer ocupan las dos columnas.', 'css'),
        f('layout', '63', 'Según la tabla Flexbox vs Grid, "rápido para centrar y alinear" y "mejor para layouts complejos" describen:', [
          'Flexbox y Grid, respectivamente',
          'Grid y Flexbox, respectivamente',
          'A Flexbox en los dos casos',
          'A Grid en los dos casos',
        ], 'Ejes: Flexbox principal + cruzado; Grid filas + columnas.'),
        f('layout', '63–64', '¿Qué ejemplo típico le asigna la tabla a Grid?', [
          'Página con header, sidebar, contenido y footer',
          'Barra de navegación con sus botones alineados en fila',
          'Un grupo de tarjetas en una sola fila',
          'Un botón con un ícono centrado',
        ], 'Flexbox: barra de navegación, botones, cards. Grid: el layout completo de la página.'),
        f('layout', '65', '¿Qué ejemplo da la diapositiva de "diseño fluido"?', [
          'Usar width: 80% en lugar de width: 600px',
          'Usar max-width: 100% en las imágenes',
          'Usar @media para pasar el menú a lista',
          'Usar display: flex en el contenedor',
        ], 'Diseño fluido: unidades relativas (%, em, rem, vh, vw) en lugar de px fijos. max-width: 100% es el ejemplo de imágenes flexibles.'),
        f('layout', '65', 'Según los fundamentos del diseño responsive, ¿cómo se evita que las imágenes "rompan" el diseño?', [
          'Haciéndolas escalables con max-width: 100%',
          'Dándoles un width fijo en px en cada breakpoint',
          'Ocultándolas con una media query en mobile',
          'Usando siempre unidades vh en su alto',
        ], 'Videos y otros elementos multimedia también deben adaptarse a su contenedor.'),
        f('layout', '66', 'La metaetiqueta viewport informa a los navegadores móviles que deben:', [
          'Usar el ancho del dispositivo como ancho de la ventana gráfica y escalar al 100%',
          'Aplicar automáticamente las media queries de tipo screen y descartar las de print',
          'Mostrar la versión de escritorio reducida para que entre completa en la pantalla',
          'Bloquear el zoom del usuario para que el diseño no se desarme',
        ], '<meta name="viewport" content="width=device-width, initial-scale=1" />'),
        f('layout', '67', 'En @media screen and (max-width: 600px) { … }, ¿qué es (max-width: 600px)?', [
          'La expresión de medio',
          'El tipo de medio',
          'El conjunto de reglas',
          'El valor del viewport',
        ], 'Una media query consta de un tipo de medio (screen), una expresión de medio (la prueba que debe aprobarse) y un conjunto de reglas.'),
        f('layout', '68', 'Según la tabla de media types, ¿cuál es el valor por defecto que "normalmente no es necesario escribir"?', [
          'all',
          'screen',
          'print',
          'any',
        ], 'screen es el más usado para responsive; print aplica al imprimir o en vista previa.'),
        d('layout', '69', 'Con el CSS de la diapositiva, ¿qué fondo tiene el body en la vista previa de impresión?', `@media screen and (max-width: 768px) {
  body { background: lightblue; }
}
@media print {
  body { background: white; font-size: 12pt; }
}`, [
          'white',
          'lightblue',
          'lightblue si la hoja mide menos de 768px',
          'El fondo por defecto: ninguna regla aplica',
        ], 'La vista previa de impresión usa el medio print, no screen.', 'css'),
        f('layout', '70', 'Según la diapositiva, Mobile first es:', [
          'Un enfoque centrado en la experiencia para móviles',
          'Una técnica para ocultar contenido en las pantallas pequeñas',
          'Una media query que se aplica solo a pantallas menores de 768px',
          'Un enfoque que adapta el diseño de escritorio a los celulares',
        ], 'El diagrama va de celular → tablet → escritorio: se parte del móvil y se agrega para pantallas más grandes.'),
        f('layout', '71', '¿Qué valor de position "se desplaza respecto a su posición original sin alterar el flujo del resto"?', [
          'relative',
          'absolute',
          'static',
          'sticky',
        ], 'static es el valor por defecto (flujo normal). absolute se posiciona respecto del ancestro posicionado más cercano.'),
        f('layout', '71', 'Según la diapositiva, un elemento con position: absolute se posiciona respecto:', [
          'De su ancestro posicionado más cercano',
          'De su posición original en el flujo',
          'De la ventana del navegador',
          'Siempre del elemento body, ignore o no los ancestros',
        ], 'El que se fija a la ventana del navegador (y no se mueve al hacer scroll) es fixed.'),
        f('layout', '71', '¿Qué valor "se comporta como relativo hasta que se alcanza un umbral de scroll, donde se vuelve fijo"?', [
          'sticky',
          'fixed',
          'relative',
          'absolute',
        ], 'position se complementa con top, right, bottom, left y z-index.'),
        f('layout', '72', 'En el Ejercicio #20, ¿qué tiene el dashboard en la versión mobile?', [
          'Solo header, main y footer',
          'Header, nav, main y footer apilados',
          'Nav de 200px a la izquierda de main',
          'Solo el formulario a pantalla completa',
        ], 'En escritorio: header, nav, main y footer, con nav (200px) y main en horizontal, usando grid.'),
        f('layout', '72', 'En el Ejercicio #20, ¿cómo se ve el formulario de login.html?', [
          'Mobile: ocupa toda la pantalla · Escritorio: centrado en la pantalla',
          'Mobile: centrado en la pantalla · Escritorio: ocupa toda la pantalla',
          'Igual en todos los tamaños: centrado y con ancho fijo de 200px',
          'Mobile: oculto detrás de un botón · Escritorio: en la barra lateral',
        ], 'El form lleva user y password requeridos y un botón que redirige a dashboard.html.'),
      ],
    },
    {
      id: 'u4-js', u: 'IV', rango: '74–91', name: 'JavaScript: motor, variables, DOM y eventos', min: 18,
      qs: [
        f('js', '74', 'Según la diapositiva, JavaScript es un lenguaje:', [
          'Interpretado, multiparadigma y dinámico',
          'Compilado, orientado a objetos y tipado',
          'Interpretado, funcional puro y estático',
          'Compilado, multihilo y dinámico',
        ], 'Multiparadigma: POO, funcional y procedural/imperativa. Sirve en páginas web y del lado del servidor.'),
        f('js', '75', 'Según la diapositiva, los motores de JS modernos usan compilación JIT, que:', [
          'Convierte el código JS a código máquina justo a tiempo',
          'Traduce el JS a HTML antes de renderizar la página',
          'Ejecuta el código en varios hilos al mismo tiempo',
          'Compila todo el proyecto antes de abrir la página',
        ], 'JIT = Just In Time. Hay motores en los navegadores y en servidores como Node.js.'),
        f('js', '75', '¿Qué motor de JavaScript usan Chrome y Node.js?', [
          'V8, de Google, escrito en C++',
          'SpiderMonkey, de Mozilla, escrito en C++ y Rust',
          'JavaScriptCore, para Swift, Objective-C y C',
          'Blink, desarrollado como parte de Chromium',
        ], 'Blink es el motor de renderizado de Chromium, no el de JavaScript.'),
        f('js', '75–76', '¿Cuál de estos es un motor de renderizado y no de JavaScript?', [
          'Gecko',
          'V8',
          'SpiderMonkey',
          'JavaScriptCore',
        ], 'Motores de renderizado: Blink (Google/Chromium), Gecko (Mozilla), WebKit (Apple/Safari) y Trident (Internet Explorer).'),
        f('js', '76', 'Según la diapositiva, el motor de renderizado es la parte del navegador que:', [
          'Transforma el HTML, CSS y otros recursos en una representación visual',
          'Analiza y ejecuta el código JavaScript compilándolo a código máquina',
          'Traduce el dominio de la página a su dirección IP real',
          'Gestiona el almacenamiento local, las cookies y la caché',
        ], 'El que ejecuta JS es el motor de JS (V8, SpiderMonkey…).'),
        f('js', '76', '¿Qué motor de renderizado usa Safari?', [
          'WebKit',
          'Blink',
          'Gecko',
          'JavaScriptCore',
        ], 'WebKit está registrado por Apple. JavaScriptCore es un motor de JS, no de renderizado.'),
        f('js', '77', '¿Qué es ECMAScript?', [
          'El estándar técnico que define las características y la sintaxis de JS',
          'El motor que usa Firefox para ejecutar JavaScript del lado del cliente',
          'Una versión de JavaScript que solo funciona en servidores con Node.js',
          'Un framework para escribir JavaScript orientado a objetos con clases',
        ], 'Garantiza que los distintos motores implementen el mismo lenguaje.'),
        d('js', '78', 'Al abrir el "mini ejemplo", ¿dónde aparece el texto "Hola desde la consola"?', `<body>
  <h1>Hola JavaScript</h1>
  <script>
    console.log("Hola desde la consola");
    alert("Hola desde un alert!");
  </script>
</body>`, [
          'En la pestaña Console de las DevTools',
          'En un cuadro emergente del navegador',
          'Dentro del h1, debajo del título',
          'En la pestaña Sources, como breakpoint',
        ], 'console.log escribe en la consola; alert es el que abre el cuadro emergente.', 'html'),
        f('js', '79', 'Según la tabla de variables, ¿cuál permite redeclaración?', [
          'Solo var',
          'var y let',
          'let y const',
          'Ninguna',
        ], 'Reasignación: var y let sí, const no. Scope: var de función/global; let y const de bloque.'),
        f('js', '79', '¿Qué dice la tabla sobre el hoisting de let y const?', [
          'Sí hay hoisting, pero quedan en la TDZ hasta su declaración',
          'No hay hoisting: solo var y las funciones se elevan',
          'Sí hay hoisting y se inicializan en undefined, como var',
          'Solo const tiene hoisting; let se crea al ejecutarse',
        ], 'TDZ = Temporal Dead Zone. var sí se inicializa en undefined.'),
        d('js', '79', '¿Qué muestra este código?', `console.log(a);
var a = 1;
console.log(b);
let b = 2;`, [
          'undefined y después un ReferenceError',
          'undefined y después undefined',
          '1 y después 2',
          'Un ReferenceError en la primera línea',
        ], 'var se eleva inicializada en undefined. let se eleva pero está en la TDZ: acceder antes de la declaración lanza ReferenceError.'),
        f('js', '79', '¿Qué uso recomendado le da la tabla a cada declaración?', [
          'var: evitar · let: variables mutables · const: constantes / refs',
          'var: variables globales · let: constantes · const: objetos',
          'var: evitar · let: constantes / refs · const: variables mutables',
          'var: funciones · let: variables mutables · const: evitar',
        ], 'const no permite reasignar, pero un objeto o array const sí puede cambiar por dentro (es una referencia).'),
        f('js', '80', 'Según la tabla de tipos primitivos, NaN e Infinity son de tipo:', [
          'number',
          'undefined',
          'bigint',
          'symbol',
        ], 'bigint es para enteros grandes (9007199254740991n).'),
        f('js', '80', '¿Qué diferencia marca la tabla entre undefined y null?', [
          'undefined: sin valor asignado · null: ausencia intencional',
          'undefined: ausencia intencional · null: sin valor asignado',
          'undefined es un objeto vacío; null es un primitivo',
          'Son el mismo tipo; solo cambia cómo se escriben',
        ], 'let x; → undefined. let y = null; → ausencia puesta a propósito.'),
        f('js', '80', 'La nota de la diapositiva sobre typeof null === "object" dice que es:', [
          'Un bug histórico de JavaScript',
          'Correcto, porque null es un objeto vacío',
          'Algo que solo pasa en modo estricto',
          'Un error que lanza TypeError',
        ], 'null es un primitivo; que typeof devuelva "object" es un bug histórico que nunca se corrigió.'),
        f('js', '80', '¿Qué describe la tabla como "valor único"?', [
          'symbol',
          'bigint',
          'null',
          'const',
        ], 'Symbol("id") crea un valor que no es igual a ningún otro.'),
        f('js', '81', 'Según la diapositiva, el DOM:', [
          'Representa el documento como nodos y objetos modificables',
          'Es el motor del navegador que dibuja en pantalla el HTML y el CSS',
          'Es una copia del HTML en memoria que React compara antes de actualizar',
          'Es el estándar que define la sintaxis de las etiquetas de HTML5',
        ], 'Permite modificar la estructura, el estilo y el contenido del documento.'),
        f('js', '82', 'En el árbol DOM de la diapositiva, el nodo de texto "Paragraph" es hijo de:', [
          'P',
          'BODY',
          'HTML',
          'Document',
        ], 'Document → HTML → HEAD / BODY. HEAD → TITLE → "My document". BODY → H1 → "Header" y P → "Paragraph".'),
        d('js', '83', 'Si en el ejemplo de "Manipular el DOM" se borra la última línea, ¿qué pasa?', `const tabla = document.querySelector('#mi-tabla tbody');
const nuevaFila = document.createElement('tr');
const celdaNombre = document.createElement('td');
celdaNombre.textContent = 'Juan Pérez';
nuevaFila.appendChild(celdaNombre);
tabla.appendChild(nuevaFila);`, [
          'La fila se crea en memoria pero no aparece en la página',
          'Da error, porque nuevaFila no existe sin agregarla',
          'La fila aparece igual, porque createElement ya la inserta',
          'Se muestra la celda suelta, sin la fila que la contiene',
        ], 'createElement crea el nodo suelto; recién appendChild lo cuelga del árbol del documento.'),
        f('js', '84', 'En el Ejercicio #21, ¿qué jerarquía hay que crear con la API Document?', [
          'table → thead → tr → th, y table → tbody → tr → td',
          'table → tr → thead → th, y table → tr → tbody → td',
          'table → th → tr, y table → td → tr',
          'thead → table → tr → th, y tbody → table → tr → td',
        ], 'Los th son "Número de turno" y "Nombre de Paciente"; las filas: #1 Julian y #2 Maria. Se ejecuta desde el onclick de un botón.'),
        f('js', '85', 'Según la diapositiva, cuando ocurre un evento el navegador entrega:', [
          'Un objeto Event con tipo, elemento que lo generó, tecla…',
          'Un string con el nombre del evento para comparar en un if',
          'Una Promise que se resuelve cuando termina el evento',
          'El nodo del DOM que se modificó, sin más información',
        ], 'Un evento es una acción o suceso de la página que JS puede detectar y manejar.'),
        f('js', '86', 'Según la diapositiva, mouseover y mouseout se disparan al:', [
          'Entrar y salir de un elemento',
          'Presionar y soltar el botón del mouse',
          'Mover el mouse dentro de un elemento',
          'Hacer doble click sobre un elemento',
        ], 'mousedown / mouseup: presionar / soltar. mousemove: mover. dblclick: doble click.'),
        f('js', '87', '¿Qué dice la diapositiva sobre keypress?', [
          'Está obsoleto: usar keydown o keyup',
          'Es el recomendado para leer teclas',
          'Solo funciona dentro de un formulario',
          'Se dispara al soltar la tecla',
        ], 'keydown: se presiona una tecla. keyup: se suelta.'),
        f('js', '88', 'Según la diapositiva, ¿qué diferencia hay entre change e input?', [
          'change: cuando cambia el valor de un input/select · input: cuando se escribe en el campo',
          'change: cuando se escribe en el campo · input: cuando cambia el valor de un input/select',
          'change: cuando el campo recibe el foco · input: cuando el campo pierde el foco',
          'change: solo para inputs de texto · input: solo para selects y checkboxes',
        ], 'focus / blur: el campo recibe o pierde el foco. submit: se envía el formulario.'),
        f('js', '89', 'Según la diapositiva, DOMContentLoaded se dispara:', [
          'Con el DOM listo, antes de que carguen las imágenes',
          'Cuando la página terminó de cargar, imágenes incluidas',
          'Cuando el usuario hace el primer scroll de la página',
          'Cuando se termina de ejecutar el último script del body',
        ], 'load es el que espera a que la página termine de cargar por completo.'),
        f('js', '90', '¿Cuál de estas NO figura en "Eventos - otros"?', [
          'Base de datos',
          'Portapapeles',
          'Drag & Drop',
          'Animación y transición',
        ], 'La lista: portapapeles, drag & drop, multimedia, red, dispositivos, animación y transición, DOM.'),
        f('js', '91', 'En el Ejercicio #22 (navbar), el menú se muestra u oculta al hacer clic en el botón, pero:', [
          'Solo en resoluciones móviles',
          'Solo en resoluciones de escritorio',
          'Solo la primera vez que se hace clic',
          'Solo si el usuario inició sesión',
        ], 'Se clona dsw2026-ej22 y hay que aplicar los estilos de maquetación del TPI.'),
      ],
    },
    {
      id: 'u4-obj', u: 'IV', rango: '92–107', name: 'Objetos, function vs arrow y arrays', min: 16,
      qs: [
        f('obj', '92', 'Según la diapositiva, un objeto es:', [
          'Una colección de pares clave-valor (propiedades)',
          'Una lista indexada de valores cuyo primer índice es el 0',
          'Una función que se ejecuta con new para crear instancias',
          'Un tipo primitivo que agrupa valores de distinto tipo',
        ], 'La lista indexada es el array.'),
        f('obj', '93', '¿Qué tres formas de crear objetos muestra la diapositiva?', [
          'Literal, constructor y clases',
          'Literal, Object.assign y Object.freeze',
          'Constructor, JSON.parse y Object.entries',
          'Clases, prototipos y funciones flecha',
        ], 'Literal: { nombre: "Juan" }. Constructor: new Object() y luego persona.nombre = … Clases: class Persona con constructor.'),
        d('obj', '94', '¿Qué muestran estas dos líneas?', `let persona = { nombre: "Juan", edad: 30 };
console.log(persona.nombre);
console.log(persona["edad"]);`, [
          '"Juan" y 30',
          '"Juan" y undefined',
          'undefined y 30',
          'Un error en la segunda línea',
        ], 'Notación de punto y notación de corchetes acceden a la misma propiedad; con corchetes la clave va como string.'),
        d('obj', '95', '¿Qué muestra persona.saludar()?', `let persona = {
  nombre: "Juan",
  saludar: function() {
    console.log("Hola, mi nombre es " + this.nombre);
  }
};
persona.saludar();`, [
          '"Hola, mi nombre es Juan"',
          '"Hola, mi nombre es undefined"',
          '"Hola, mi nombre es this.nombre"',
          'TypeError: this is not defined',
        ], 'En una function tradicional usada como método, this apunta al objeto que la invoca.'),
        d('obj', '96', '¿Qué devuelve Object.entries(persona)?', `let persona = { nombre: "Juan", edad: 30 };`, [
          '[["nombre", "Juan"], ["edad", 30]]',
          '[["nombre"], ["edad"]]',
          '[{ nombre: "Juan" }, { edad: 30 }]',
          '{ nombre: "Juan", edad: 30 }',
        ], 'Object.keys → claves; Object.values → valores; Object.entries → pares [clave, valor].'),
        d('obj', '97', '¿Qué muestra el console.log?', `let objetoDestino = { a: 1 };
let objetoOrigen = { b: 2, c: 3 };
Object.assign(objetoDestino, objetoOrigen);
console.log(objetoDestino);`, [
          '{ a: 1, b: 2, c: 3 }',
          '{ a: 1 }',
          '{ b: 2, c: 3 }',
          '{ a: 1, objetoOrigen: { b: 2, c: 3 } }',
        ], 'Object.assign copia las propiedades del origen dentro del destino (y lo modifica).'),
        d('obj', '97', '¿Qué muestra el console.log?', `let persona = { nombre: "Juan" };
Object.seal(persona);
persona.edad = 30;
persona.nombre = "Carlos";
console.log(persona);`, [
          '{ nombre: "Carlos" }',
          '{ nombre: "Juan" }',
          '{ nombre: "Carlos", edad: 30 }',
          '{ nombre: "Juan", edad: 30 }',
        ], 'seal: no se pueden añadir propiedades, pero sí modificar las existentes. freeze: tampoco se pueden modificar.'),
        f('obj', '97', '¿Qué diferencia hay entre Object.freeze y Object.seal según la diapositiva?', [
          'freeze no deja cambiar valores; seal no deja añadir, pero sí modificar',
          'seal no deja cambiar valores; freeze no deja añadir, pero sí modificar',
          'freeze borra las propiedades; seal las vuelve de solo lectura',
          'Ninguna: los dos impiden añadir y modificar propiedades',
        ], 'Ejemplo: tras Object.freeze(persona), persona.nombre = "Carlos" no cambia el valor ("Juan").'),
        f('obj', '98', 'Según la tabla, ¿cómo es el this en cada tipo de función?', [
          'Tradicional: dinámico, según cómo se invoque · Arrow: léxico, del scope donde se creó',
          'Tradicional: léxico, del scope donde se creó · Arrow: dinámico, según cómo se invoque',
          'Las dos tienen this dinámico; la arrow solo cambia la sintaxis',
          'Tradicional: siempre window · Arrow: siempre el objeto que la contiene',
        ], 'Por eso la arrow no sirve como método de objeto: this no apunta al objeto sino al contexto exterior.'),
        d('obj', '100', '¿Qué muestra cada llamada del ejemplo de la diapositiva?', `const persona = {
  nombre: "Ana",
  saludarTrad: function () { console.log("Hola soy " + this.nombre); },
  saludarArrow: () => console.log("Hola soy " + this.nombre)
};
persona.saludarTrad();
persona.saludarArrow();`, [
          '"Hola soy Ana" y "Hola soy undefined"',
          '"Hola soy undefined" y "Hola soy Ana"',
          '"Hola soy Ana" las dos veces',
          '"Hola soy Ana" y un TypeError',
        ], 'La arrow toma el this del scope exterior (no el objeto), por eso this.nombre es undefined.'),
        f('obj', '98', 'Según la tabla, ¿qué pasa con arguments en una arrow function?', [
          'No existe: se usa ...args',
          'Existe igual que en una función tradicional',
          'Existe, pero solo con el primer argumento',
          'Existe como array, no como objeto iterable',
        ], 'En la función tradicional arguments está disponible automáticamente.'),
        d('obj', '98–100', '¿Qué pasa al ejecutar la última línea?', `function Animal(nombre) { this.nombre = nombre; }
const perro = new Animal("Firulais");

const AnimalArrow = (nombre) => { this.nombre = nombre; };
const gato = new AnimalArrow("Michi");`, [
          'Error: una arrow no sirve como constructor',
          'Crea gato con nombre "Michi", igual que perro',
          'Crea gato, pero con nombre undefined',
          'Crea gato y además cambia el nombre de perro',
        ], 'La arrow no tiene prototipo ni puede usarse con new.'),
        f('obj', '98–99', 'Según la tabla, ¿qué diferencia hay en hoisting y return entre function y arrow?', [
          'function se eleva completa · arrow no, y admite return implícito',
          'arrow se eleva completa · function se comporta como let y puede omitir el return',
          'Las dos se elevan completas; solo la arrow puede omitir el return',
          'Ninguna se eleva; las dos necesitan return explícito',
        ], 'La arrow puede omitir return si el cuerpo es una sola expresión.'),
        f('obj', '99', '¿Qué uso recomendado le da la tabla a la arrow function?', [
          'Callbacks, funciones cortas, promesas y funciones dentro de funciones',
          'Constructores, métodos de objeto y cuando se necesita this dinámico',
          'Clases con herencia, porque maneja super de forma dinámica',
          'Código que debe correr en engines antiguos por su mejor optimización',
        ], 'Las tradicionales se recomiendan para constructores, métodos de objeto, this dinámico o arguments.'),
        f('arr', '101', 'Según la diapositiva, un array puede contener:', [
          'Cualquier tipo, incluso otros arrays u objetos',
          'Solo valores del mismo tipo que el primer elemento',
          'Solo primitivos: números, strings y booleanos',
          'Cualquier tipo, salvo otros arrays',
        ], 'Los arrays son indexados y el índice empieza en 0.'),
        d('arr', '102–104', '¿Qué muestra este código?', `let frutas = ["Manzana", "Banana", "Naranja"];
frutas[1] = "Mango";
console.log(frutas[0], frutas[1]);`, [
          'Manzana Mango',
          'Mango Banana',
          'Banana Mango',
          'Manzana Banana',
        ], 'El índice 1 es el segundo elemento ("Banana"), que se reemplaza por "Mango".'),
        d('arr', '105', '¿Qué muestran los console.log?', `let numeros = [1, 2, 3];
let primero = numeros.shift();
numeros.unshift(0);
console.log(primero, numeros);`, [
          '1 [0, 2, 3]',
          '3 [0, 1, 2]',
          '1 [2, 3, 0]',
          '0 [0, 1, 2, 3]',
        ], 'shift saca el primero y lo devuelve; unshift agrega al inicio. push/pop hacen lo mismo pero al final.'),
        d('arr', '105', '¿Qué valor tiene ultimo y cómo queda numeros?', `let numeros = [1, 2, 3];
numeros.push(4);
let ultimo = numeros.pop();`, [
          '4 y [1, 2, 3]',
          '3 y [1, 2, 4]',
          '4 y [1, 2, 3, 4]',
          '1 y [2, 3, 4]',
        ], 'push agrega el 4 al final y pop lo saca y lo devuelve.'),
        d('arr', '106–107', '¿Qué muestra este código?', `let numeros = [1, 2, 3, 4, 5];
const a = numeros.filter(n => n % 2 === 0);
const b = numeros.find(n => n > 3);
console.log(a, b);`, [
          '[2, 4] 4',
          '[2, 4] [4, 5]',
          '[1, 3, 5] 4',
          '[true, false] 5',
        ], 'filter devuelve un array con todos los que cumplen; find devuelve el primer elemento que cumple (no un array).'),
        d('arr', '107', '¿Qué muestra este código de la diapositiva?', `let numeros = [1, 2, 3, 4];
let suma = numeros.reduce(function(acumulador, valorActual) {
  return acumulador + valorActual;
}, 0);
console.log(suma);`, [
          '10',
          '0',
          '[1, 3, 6, 10]',
          '4',
        ], 'reduce recorre el array acumulando: 0+1+2+3+4. El 0 es el valor inicial del acumulador.'),
        f('arr', '106', '¿Qué diferencia hay entre forEach y map?', [
          'map devuelve un array nuevo con el resultado de cada vuelta; forEach solo recorre',
          'forEach devuelve un array nuevo con el resultado de cada vuelta; map solo recorre',
          'map modifica el array original; forEach crea una copia y la modifica',
          'Ninguna: los dos devuelven un array nuevo del mismo largo',
        ], 'En la diapositiva: map con num * 2 da [2, 4, 6]; forEach solo imprime cada fruta.'),
      ],
    },
    {
      id: 'u4-async', u: 'IV', rango: '108–128', name: 'Event loop, promesas, fetch, validaciones y storage', min: 18,
      qs: [
        f('async', '108', 'Según la diapositiva, el Event Loop es el mecanismo que permite a JS:', [
          'Ser no bloqueante con un solo hilo de ejecución',
          'Ejecutar varias funciones en paralelo usando múltiples hilos',
          'Repetir una función cada cierto intervalo de tiempo',
          'Recorrer el DOM buscando eventos pendientes para disparar',
        ], 'La diapositiva lo remarca: JS no es un lenguaje multihilos.'),
        f('async', '109', '¿Cuáles son los "4 pilares" del diagrama del Event Loop?', [
          'Call Stack, Web APIs, Callback Queue y Microtask Queue',
          'Call Stack, Heap, Event Queue y la Render Queue del navegador',
          'Web APIs, Promise, async/await y setTimeout',
          'Motor JS, motor de renderizado, DOM y Event Loop',
        ], 'El código sincrónico se ejecuta en el Call Stack, las operaciones asincrónicas se delegan a las Web APIs y sus callbacks esperan en las colas.'),
        f('async', '110', 'Según la diapositiva, el Call Stack:', [
          'Ejecuta código sincrónico y funciona como pila LIFO',
          'Ejecuta código asincrónico y funciona como cola FIFO',
          'Guarda los callbacks de setTimeout hasta que vencen',
          'Tiene mayor prioridad que cualquier otra cola',
        ], 'LIFO: el último en entrar es el primero en salir.'),
        f('async', '111', '¿Cuál de estos NO aparece en la diapositiva de Web APIs?', [
          'Promise.then',
          'setTimeout',
          'fetch',
          'addEventListener',
        ], 'Web APIs: setTimeout, fetch, eventos del DOM, addEventListener. Promise.then está en la Microtask Queue.'),
        f('async', '112', 'Según la diapositiva, la Callback Queue también se conoce como:', [
          'Task Queue o Macrotask Queue',
          'Microtask Queue o Job Queue',
          'Call Stack o Execution Stack',
          'Render Queue o Event Queue',
        ], 'Una task es una unidad de trabajo que será ejecutada; ahí esperan los callbacks de las operaciones asincrónicas.'),
        f('async', '113', '¿Qué va a la Microtask Queue según la diapositiva?', [
          'Promise.then/catch/finally, async/await y queueMicrotask',
          'setTimeout, setInterval y los callbacks de click y de input',
          'fetch, addEventListener y los eventos del DOM',
          'Solo las funciones marcadas como async y sus await',
        ], 'Es una cola de mayor prioridad que la de tasks.'),
        f('async', '114', 'Según el resumen, cuando el Call Stack queda vacío el Event Loop:', [
          'Ejecuta todas las microtasks, luego una task, y repite',
          'Ejecuta una microtask, luego todas las tasks, y repite',
          'Ejecuta todas las tasks y después todas las microtasks',
          'Ejecuta lo que llegó primero, sin importar la cola',
        ], 'Por eso un .then se ejecuta antes que un setTimeout(…, 0).'),
        d('async', '113–114', '¿En qué orden se imprime?', `console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
queueMicrotask(() => console.log("D"));
console.log("E");`, [
          'A E C D B',
          'A B C D E',
          'A E B C D',
          'A C D E B',
        ], 'Primero todo lo sincrónico (A, E). Con el stack vacío, todas las microtasks en orden (C, D). Después una task (B).'),
        f('async', '115', 'Según la diapositiva, una Promise es un objeto que representa un proceso asincrónico que puede:', [
          'Resolverse si termina bien o rechazarse si ocurre un error',
          'Ejecutarse en otro hilo y devolver el resultado al terminar',
          'Repetirse hasta que la operación termine sin errores',
          'Bloquear el programa hasta que la operación termine',
        ], 'Se usa para operaciones que tardan: consultas a API, lectura de archivos, temporizadores.'),
        f('async', '116', 'Según la diapositiva de async/await:', [
          'async: la función devuelve una Promise · await: espera sin bloquear',
          'async hace que la función corra en otro hilo; await bloquea hasta que termine',
          'await se puede usar en cualquier función; async solo marca que tarda',
          'async convierte la función en sincrónica; await devuelve una Promise',
        ], 'Es una forma más clara y legible de trabajar con Promises. await se usa dentro de una función async.'),
        f('async', '117', '¿Qué dice la diapositiva sobre fetch?', [
          'Es nativa, hace peticiones HTTP y devuelve una Promise',
          'Es una librería que se instala con npm install fetch',
          'Hace peticiones HTTP y devuelve directamente el JSON',
          'Es sincrónica, por eso no necesita .then ni await',
        ], 'Está en navegadores modernos y en Node.js (con node-fetch o undici). Se trabaja con .then/.catch o async/await.'),
        d('async', '118', 'En el GET de la diapositiva, ¿para qué está el primer .then?', `fetch("https://jsonplaceholder.typicode.com/posts/1")
  .then(res => res.json())
  .then(data => console.log("Post:", data))
  .catch(err => console.error("Error:", err));`, [
          'Para pasar el cuerpo a objeto JS (también es una Promise)',
          'Para verificar que la respuesta tenga código 200 antes de continuar',
          'Para reintentar la petición si el servidor tarda demasiado',
          'Para convertir el objeto JS a texto antes de enviarlo al servidor',
        ], 'res.json() lee el cuerpo y devuelve otra Promise; el segundo .then recibe los datos ya parseados.'),
        d('async', '119', 'En el POST de la diapositiva, ¿por qué el body usa JSON.stringify?', `fetch("https://jsonplaceholder.typicode.com/posts", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ titulo: "Nuevo producto", stock: 30 })
})`, [
          'Porque el cuerpo se envía como texto: hay que convertir el objeto a JSON',
          'Porque fetch solo acepta objetos JS y stringify los valida antes',
          'Porque así el servidor devuelve la respuesta ya convertida a objeto',
          'Porque reemplaza al header Content-Type, que es opcional',
        ], 'El header Content-Type: application/json le avisa al servidor el formato de ese texto.'),
        d('store', '120', '¿Qué validan solos estos inputs de la diapositiva "Forms y validaciones HTML"?', `<form id="miFormulario">
  <label>Email:</label>
  <input type="email" id="email" required>
  <label>Contraseña:</label>
  <input type="password" id="password" required>
  <button type="submit">Enviar</button>
</form>`, [
          'Que ambos campos estén completos y que el email tenga formato de email',
          'Solo que el email tenga formato de email; required necesita JavaScript',
          'Que la contraseña tenga al menos 8 caracteres y el email una arroba',
          'Nada: sin un listener de submit el navegador no valida',
        ], 'required y type="email" son validaciones nativas de HTML: el navegador bloquea el envío.', 'html'),
        d('store', '121', 'En la validación con JavaScript de la diapositiva, ¿para qué está e.preventDefault()?', `form.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const edad = parseInt(document.getElementById("edad").value);
  let mensajes = [];
  if (!email.includes("@")) mensajes.push("El email no es válido");
  if (isNaN(edad) || edad < 18) mensajes.push("Debes tener al menos 18 años");
  ...
});`, [
          'Para que el form no se envíe solo y recargue la página',
          'Para evitar que el evento submit llegue a los inputs del formulario',
          'Para vaciar los campos del formulario antes de validar',
          'Para que el navegador no muestre sus validaciones nativas',
        ], 'Si hay mensajes se muestran con errores.innerText = mensajes.join(", "); si no, alert y form.reset().'),
        f('store', '122', 'En el Ejercicio #23, ¿cómo debe filtrarse la tabla de especialidades?', [
          'Con JS, sin volver a cargar el archivo JSON',
          'Volviendo a pedir el JSON con el filtro aplicado',
          'Con CSS, ocultando las filas que no coinciden',
          'Recargando la página con el criterio en la URL',
        ], 'Columnas "Nombre" y "Descripción", buscador por Nombre con un botón, y estilos del TPI.'),
        f('store', '123', 'En el Ejercicio #24, ¿qué límites tienen los campos de una nueva especialidad?', [
          'Nombre: hasta 15 caracteres · Descripción (textarea): hasta 100',
          'Nombre: hasta 100 caracteres · Descripción (textarea): hasta 15',
          'Nombre: al menos 15 caracteres · Descripción: al menos 100',
          'Nombre y Descripción: hasta 50 caracteres cada uno',
        ], 'Ambos requeridos, validados con JavaScript y con mensaje de error. El objeto se muestra por consola.'),
        f('store', '124', 'Según la tabla de almacenamiento, ¿qué tiene de particular el acceso a las cookies?', [
          'Se envían al servidor en cada request',
          'Es asíncrono y soporta transacciones',
          'Solo dura mientras la pestaña esté abierta',
          'Necesita JSON.stringify para guardar texto',
        ], 'Cookies: ~4 KB por cookie, persisten hasta que expiren (fecha o sesión). Uso típico: sesiones, recordar login, datos que necesita el servidor.'),
        f('store', '124', '¿Qué capacidad y persistencia le asigna la tabla a localStorage?', [
          '~5–10 MB · hasta que el usuario lo borre',
          '~5 MB · dura mientras la pestaña esté abierta',
          '~4 KB · hasta que expire por fecha o sesión',
          'Cientos de MB · persistente, con acceso asíncrono',
        ], 'Uso típico: configuraciones, preferencias de usuario, temas. Acceso sincrónico; guarda strings (JSON.stringify para objetos).'),
        f('store', '124', 'Según la tabla, un carrito de compras que solo debe durar mientras no se cierre la pestaña va en:', [
          'sessionStorage',
          'localStorage',
          'Cookies',
          'IndexedDB',
        ], 'sessionStorage: ~5 MB, strings, sincrónico, datos temporales por pestaña.'),
        f('store', '124', '¿Qué método de almacenamiento es asíncrono y soporta índices, transacciones, binarios y blobs?', [
          'IndexedDB',
          'localStorage',
          'sessionStorage',
          'Cookies',
        ], 'Capacidad de cientos de MB o más. Uso: apps offline y almacenamiento masivo (correos, notas, catálogos).'),
        d('store', '126', '¿Qué hace este código de la diapositiva?', `document.cookie = "usuario=Vicente; expires=Fri, 31 Dec 2025 23:59:59 GMT";
console.log(document.cookie);`, [
          'Crea una cookie con vencimiento y después las lee',
          'Reemplaza todas las cookies del sitio por una sola',
          'Guarda "usuario" en localStorage hasta esa fecha',
          'Borra la cookie "usuario" en la fecha indicada',
        ], 'Asignar a document.cookie agrega o actualiza una sola cookie; leerlo devuelve todas como un string.'),
        d('store', '127', 'En el ejemplo de IndexedDB, ¿cuándo se ejecuta onupgradeneeded?', `const request = indexedDB.open("MiBaseDeDatos", 1);
request.onupgradeneeded = function (event) {
  const db = event.target.result;
  const store = db.createObjectStore("productos", { keyPath: "id" });
  store.createIndex("nombreIndex", "nombre", { unique: false });
};`, [
          'La primera vez o al cambiar la versión',
          'Cada vez que se abre la base, antes de onsuccess',
          'Cada vez que se agrega un producto al almacén',
          'Solo cuando la apertura de la base falla',
        ], 'Ahí se crea el almacén (como una tabla) y los índices. Para leer o escribir se abre una transaction "readonly" o "readwrite".'),
        f('store', '128', 'En el Ejercicio #25, ¿con qué se genera el GUID antes de guardar una especialidad?', [
          'crypto.randomUUID()',
          'Math.random()',
          'Date.now()',
          'specialties.length + 1',
        ], 'Se elimina specialties.json, el array "specialties" vive en localStorage y un archivo JS concentra todas las operaciones. Plus: paginación.'),
      ],
    },
  ];

  BLOQUES.forEach((b) => b.qs.forEach((q, i) => { q.id = `${b.id}-${i + 1}`; }));
  window.DIAPOS = { BLOQUES };
})();
