/* Módulo: cómo funciona la web */
(() => {
  const { code, table, note, lab, flow, webSol } = window.GUIDE.h;

  window.GUIDE.LESSONS.push(
    {
      id: 'como-funciona-la-web',
      module: 'web',
      title: 'Qué pasa cuando abrís una página',
      keywords: 'internet ip dns dominio url servidor http https cliente metodos codigos estado',
      tldr: 'Tu navegador (el <mark>cliente</mark>) le pide archivos a una computadora remota (el <mark>servidor</mark>) usando el protocolo HTTP. Para encontrarla, traduce un nombre como google.com a una dirección IP con el DNS.',
      goals: ['Explicar qué hacen la IP, el dominio, el DNS y el servidor web.', 'Desarmar una URL en sus partes.', 'Contar el viaje completo de un pedido HTTP y leer un código de estado.'],
      body: `
        <h2>Internet y la Web no son lo mismo</h2>
        <p><mark>Internet</mark> es la infraestructura: millones de computadoras conectadas por cables, antenas y routers. Dentro de una red local, un <strong>switch</strong> conecta las computadoras entre sí; un <strong>router</strong> conecta esa red con otras redes. Internet es, literalmente, una red de redes.</p>
        <p>La <strong>Web</strong> es uno de los servicios que funcionan <em>encima</em> de internet, igual que el correo electrónico o los juegos en línea. Lo que la define es que los documentos se piden y se entregan con HTTP y se enlazan entre sí con hipervínculos.</p>

        <h2>Las piezas del rompecabezas</h2>
        <h3>Dirección IP</h3>
        <p>Cada dispositivo conectado tiene un número que lo identifica, como <code>142.250.217.46</code>. Es como el número de documento de una computadora: único y difícil de recordar.</p>
        <h3>Dominio</h3>
        <p>Es un nombre legible que apunta a una IP: <code>www.google.com</code>. Se lee de derecha a izquierda: <code>.com</code> es el dominio de nivel superior (TLD), <code>google</code> es el dominio de segundo nivel y <code>www</code> es un subdominio. Un dominio no se compra para siempre: se alquila por uno o más años a través de un registrador (en Argentina, NIC.ar para los <code>.ar</code>).</p>
        <h3>DNS</h3>
        <p>El <mark>Domain Name System</mark> es la guía telefónica de internet: traduce dominios a IPs. Tu navegador primero mira si ya conoce la respuesta (caché) y, si no, le pregunta a un servidor DNS.</p>
        <h3>Servidor web</h3>
        <p>Es <strong>hardware</strong> (una computadora encendida y conectada siempre) más <strong>software</strong> (un servidor HTTP como Nginx o Apache) que recibe pedidos y devuelve archivos. Hay dos grandes tipos:</p>
        <ul>
          <li><strong>Estático:</strong> entrega los archivos tal cual están guardados. Rápido y barato.</li>
          <li><strong>Dinámico:</strong> tiene además un servidor de aplicaciones y una base de datos. Arma la respuesta en el momento (por ejemplo, tu bandeja de entrada).</li>
        </ul>

        <h2>Anatomía de una URL</h2>
        <p>Una URL es la dirección completa de un recurso. Tomemos <code>https://www.google.com:443/search?q=chatgpt&amp;hl=es#resultados</code>:</p>
        ${table(['Parte', 'Ejemplo', 'Para qué sirve'], [
          ['Protocolo (esquema)', '<code>https://</code>', 'Cómo hablar con el servidor. HTTPS = HTTP cifrado'],
          ['Dominio', '<code>www.google.com</code>', 'A qué servidor ir (el DNS lo convierte en IP)'],
          ['Puerto', '<code>:443</code>', 'Qué “puerta” del servidor. Casi siempre se omite: 80 para HTTP, 443 para HTTPS'],
          ['Ruta', '<code>/search</code>', 'Qué recurso pedir dentro del servidor'],
          ['Parámetros', '<code>?q=chatgpt&amp;hl=es</code>', 'Datos extra en pares clave=valor, separados por <code>&amp;</code>'],
          ['Ancla', '<code>#resultados</code>', 'Una parte de la página. No viaja al servidor: la usa el navegador'],
        ])}
        <p>Las URLs pueden ser <strong>absolutas</strong> (tienen todo, desde el protocolo) o <strong>relativas</strong> (se completan según la página actual). En tus proyectos vas a usar relativas todo el tiempo: <code>href="doctors.html"</code> significa “el archivo doctors.html en la misma carpeta que esta página”.</p>
        ${lab(0)}

        <h2>El viaje completo de un pedido</h2>
        ${flow('Escribís la URL', 'DNS: dominio → IP', 'Conexión TCP + TLS', 'Pedido HTTP', 'Respuesta HTML', 'Más pedidos (CSS, JS, imágenes)', 'Render en pantalla')}
        <ol>
          <li>Escribís <code>https://www.google.com/search?q=chatgpt</code>.</li>
          <li>El navegador pregunta al DNS la IP de <code>www.google.com</code> y recibe <code>142.250.217.46</code>.</li>
          <li>Abre una conexión con esa IP. Como es HTTPS, negocia un cifrado (TLS) para que nadie en el medio lea los datos.</li>
          <li>Envía un pedido HTTP: <code>GET /search?q=chatgpt</code>.</li>
          <li>El servidor responde con un código de estado y un HTML.</li>
          <li>El navegador lee el HTML y descubre que necesita CSS, JavaScript e imágenes: hace un pedido por cada uno.</li>
          <li>El motor de renderizado arma todo y lo pinta.</li>
        </ol>

        <h2>Cómo se ve un pedido y una respuesta HTTP</h2>
        <p>HTTP es un protocolo <strong>de texto</strong> y <strong>sin estado</strong>: cada pedido es independiente, el servidor no “recuerda” el anterior (para eso existen las cookies, que verás más adelante).</p>
        ${code('text', `GET /search?q=chatgpt HTTP/1.1
Host: www.google.com
Accept: text/html
User-Agent: Mozilla/5.0 (X11; Linux x86_64) Firefox/131.0`, 'Pedido (request)')}
        ${code('text', `HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Length: 48213

<!DOCTYPE html>
<html>…</html>`, 'Respuesta (response)')}

        <h3>Métodos HTTP: qué querés hacer</h3>
        ${table(['Método', 'Intención', 'Ejemplo'], [
          ['<code>GET</code>', 'Leer un recurso', 'Ver la lista de especialidades'],
          ['<code>POST</code>', 'Crear algo nuevo', 'Registrar un paciente'],
          ['<code>PUT</code> / <code>PATCH</code>', 'Reemplazar / modificar parte', 'Cambiar el teléfono de un paciente'],
          ['<code>DELETE</code>', 'Borrar', 'Cancelar un turno'],
        ])}
        <h3>Códigos de estado: cómo salió</h3>
        ${table(['Rango', 'Significado', 'Los que más vas a ver'], [
          ['<strong>2xx</strong>', 'Éxito', '<code>200 OK</code>, <code>201 Created</code>, <code>204 No Content</code>'],
          ['<strong>3xx</strong>', 'Redirección', '<code>301 Moved Permanently</code>, <code>304 Not Modified</code>'],
          ['<strong>4xx</strong>', 'Error del cliente (vos pediste mal)', '<code>400 Bad Request</code>, <code>401 Unauthorized</code>, <code>403 Forbidden</code>, <code>404 Not Found</code>'],
          ['<strong>5xx</strong>', 'Error del servidor', '<code>500 Internal Server Error</code>, <code>503 Service Unavailable</code>'],
        ])}
        ${note('<strong>Truco para recordar:</strong> 4xx es “la culpa es tuya” (pediste algo que no existe o no tenés permiso), 5xx es “la culpa es mía” (el servidor se rompió).')}

        <h2>Un caso real: un servicio de archivos en la nube</h2>
        <p>Pensá en algo como Google Drive. Las mismas piezas, a escala:</p>
        <ul>
          <li><strong>Cliente:</strong> la app web que corre en tu navegador (HTML, CSS y mucho JavaScript).</li>
          <li><strong>DNS + balanceador:</strong> el dominio apunta a varios servidores; un balanceador reparte los pedidos para que ninguno se sature.</li>
          <li><strong>Servidores de aplicación:</strong> reciben <code>GET /archivos</code> o <code>POST /subir</code>, verifican quién sos y deciden qué hacer.</li>
          <li><strong>Base de datos y almacenamiento:</strong> guardan los datos de cada archivo y los archivos en sí.</li>
          <li><strong>CDN:</strong> copias de los archivos estáticos (CSS, JS, imágenes) en servidores cerca tuyo, para que carguen rápido.</li>
        </ul>
        <p>En tu computadora vas a reproducir una versión mínima: el navegador como cliente y <code>npm run dev</code> (Vite) como servidor en <code>http://localhost:5173</code>. <code>localhost</code> es un dominio especial que apunta a tu propia máquina (IP <code>127.0.0.1</code>).</p>

        <h2>El mapa del desarrollo web</h2>
        ${table(['Área', 'Qué incluye'], [
          ['Frontend (cliente)', 'HTML, CSS, JavaScript · frameworks: React, Vue, Angular · preprocesadores: SASS, LESS · gestores de paquetes: npm, yarn · bundlers: Vite, Webpack, Babel'],
          ['Backend (servidor)', 'Node.js, Python (Django/Flask), PHP, Java (Spring), C# (.NET), Ruby (Rails) · servidores web (Nginx, Apache) · bases de datos · rutas · APIs REST/GraphQL · autenticación (JWT, OAuth)'],
          ['Conocimientos generales', 'HTTP/HTTPS, DNS, IP, URL · modelo cliente-servidor · ciclo de vida de una petición · seguridad, performance, accesibilidad, responsive · control de versiones · testing (unitario, integración, e2e) · CI/CD · documentación'],
          ['Herramientas', 'VS Code, WebStorm · DevTools · Docker, Vagrant · despliegue en Vercel, Netlify, AWS'],
        ])}
        ${lab(1)}
      `,
      labs: [
        {
          title: 'Desarmá una URL con JavaScript',
          html: `
<p>Escribí una URL y mirá sus partes:</p>
<input id="u" value="https://www.google.com:443/search?q=chatgpt&hl=es#resultados" style="width:100%;padding:8px;font:inherit">
<dl id="out"></dl>`,
          css: `
dl { display:grid; grid-template-columns:max-content 1fr; gap:6px 16px; }
dt { font-weight:bold; color:#2b4c7e; }
dd { margin:0; font-family:monospace; word-break:break-all; }`,
          js: `
const input = document.getElementById('u');
const out = document.getElementById('out');

function mostrar() {
  try {
    // URL es una API del navegador que entiende direcciones
    const url = new URL(input.value);
    const params = [...url.searchParams].map(([k, v]) => k + ' = ' + v).join(', ');
    out.innerHTML =
      '<dt>Protocolo</dt><dd>' + url.protocol + '</dd>' +
      '<dt>Dominio</dt><dd>' + url.hostname + '</dd>' +
      '<dt>Puerto</dt><dd>' + (url.port || '(el de siempre)') + '</dd>' +
      '<dt>Ruta</dt><dd>' + url.pathname + '</dd>' +
      '<dt>Parámetros</dt><dd>' + (params || '(ninguno)') + '</dd>' +
      '<dt>Ancla</dt><dd>' + (url.hash || '(ninguna)') + '</dd>';
  } catch {
    out.innerHTML = '<dd>Esa no es una URL válida todavía.</dd>';
  }
}
input.addEventListener('input', mostrar);
mostrar();`,
          hint: 'Agregá <code>&amp;page=2</code> a los parámetros, o probá con <code>http://localhost:5173/admin/products</code>.',
        },
        {
          title: 'Simulá códigos de estado',
          html: `
<p>Elegí qué responde el “servidor”:</p>
<select id="estado">
  <option value="200">200 OK</option>
  <option value="201">201 Created</option>
  <option value="401">401 Unauthorized</option>
  <option value="404">404 Not Found</option>
  <option value="500">500 Internal Server Error</option>
</select>
<p id="msg"></p>`,
          css: `#msg { padding:10px 14px; border-radius:8px; font-weight:bold; }
.ok { background:#dff3e7; color:#1d5e3d; } .cliente { background:#fdf0d5; color:#7a4a0c; } .servidor { background:#fde2e2; color:#8a1f1f; }`,
          js: `
const select = document.getElementById('estado');
const msg = document.getElementById('msg');

function interpretar(codigo) {
  if (codigo >= 200 && codigo < 300) return ['ok', 'Todo salió bien.'];
  if (codigo >= 400 && codigo < 500) return ['cliente', 'Error del cliente: revisá lo que pediste o si tenés permiso.'];
  if (codigo >= 500) return ['servidor', 'Error del servidor: no es tu culpa, probá más tarde.'];
  return ['', 'Otro tipo de respuesta.'];
}

function render() {
  const [clase, texto] = interpretar(Number(select.value));
  msg.className = clase;
  msg.textContent = select.value + ': ' + texto;
}
select.addEventListener('change', render);
render();`,
          hint: 'Agregá una opción <code>301</code> y un caso para el rango 3xx en <code>interpretar</code>.',
        },
      ],
      exercises: [
        {
          title: 'Identificá las partes',
          level: 1,
          prompt: '<p>Para la URL <code>https://turnos.clinica.com.ar/pacientes/buscar?dni=30111222&amp;orden=apellido#resultados</code> indicá: protocolo, dominio, subdominio, TLD, ruta, cada parámetro y el ancla. ¿Qué parte <em>no</em> se envía al servidor?</p>',
          solution: {
            explain: `<ul>
              <li><strong>Protocolo:</strong> <code>https</code></li>
              <li><strong>Dominio completo:</strong> <code>turnos.clinica.com.ar</code>. Subdominio: <code>turnos</code>. TLD: <code>.ar</code> (con <code>.com.ar</code> como zona de segundo nivel).</li>
              <li><strong>Ruta:</strong> <code>/pacientes/buscar</code></li>
              <li><strong>Parámetros:</strong> <code>dni = 30111222</code> y <code>orden = apellido</code></li>
              <li><strong>Ancla:</strong> <code>#resultados</code>. Es la única parte que <strong>no viaja al servidor</strong>: el navegador la usa para saltar a esa sección.</li>
            </ul>`,
          },
        },
        {
          title: '¿Qué código devolverías?',
          level: 1,
          prompt: '<p>Para cada situación, elegí el código de estado más adecuado: (a) se creó un turno nuevo; (b) alguien pide <code>/pacientes/999</code> y no existe; (c) el usuario no inició sesión e intenta ver su perfil; (d) la base de datos se cayó; (e) se listaron las especialidades sin problemas.</p>',
          solution: { explain: '<p>(a) <code>201 Created</code> · (b) <code>404 Not Found</code> · (c) <code>401 Unauthorized</code> (si inició sesión pero no tiene permiso, sería <code>403 Forbidden</code>) · (d) <code>500 Internal Server Error</code> o <code>503 Service Unavailable</code> · (e) <code>200 OK</code>.</p>' },
        },
        {
          title: 'Un contador de parámetros',
          level: 2,
          prompt: '<p>Hacé una página con un input donde se pega una URL y que muestre una lista con cada parámetro (clave y valor) y cuántos hay en total. Si la URL es inválida, mostrá un mensaje claro.</p>',
          hints: ['<code>new URL(texto)</code> lanza un error si la URL es inválida: envolvelo en <code>try/catch</code>.', '<code>url.searchParams</code> se puede recorrer con <code>for...of</code> o convertir en array con <code>[...url.searchParams]</code>.'],
          solution: webSol('<p>Se crea un objeto <code>URL</code> en cada cambio del input. <code>searchParams</code> ya separa los pares; solo hay que recorrerlos.</p>', {
            html: `<label for="u">URL</label>
<input id="u" style="width:100%" value="https://tienda.com/buscar?q=mouse&color=negro&orden=precio">
<p id="total"></p>
<ul id="lista"></ul>`,
            js: `const input = document.getElementById('u');

function contar() {
  const lista = document.getElementById('lista');
  const total = document.getElementById('total');
  lista.innerHTML = '';
  try {
    const url = new URL(input.value);
    const pares = [...url.searchParams];
    total.textContent = 'Parámetros: ' + pares.length;
    for (const [clave, valor] of pares) {
      const li = document.createElement('li');
      li.textContent = clave + ' → ' + valor;
      lista.appendChild(li);
    }
  } catch {
    total.textContent = 'La URL no es válida: revisá que empiece con http:// o https://';
  }
}

input.addEventListener('input', contar);
contar();`,
          }),
        },
      ],
      sources: [
        { title: '¿Cómo funciona Internet?', url: 'https://developer.mozilla.org/es/docs/Learn_web_development/Howto/Web_mechanics/How_does_the_Internet_work', points: ['Internet es la infraestructura que conecta computadoras; la Web es un servicio construido sobre ella.', 'Un <strong>switch</strong> conecta computadoras en una red local; un <strong>router</strong> conecta redes entre sí.', 'Cada computadora tiene una IP; el dominio es un alias legible para humanos.', 'Intranets y extranets usan la misma tecnología pero son redes privadas.'] },
        { title: '¿Qué es un nombre de dominio?', url: 'https://developer.mozilla.org/es/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_domain_name', points: ['Se leen de derecha a izquierda: TLD, dominio de segundo nivel y subdominios.', 'No se compran: se paga el derecho a usarlos por uno o más años.', 'El navegador consulta su caché o un servidor DNS para obtener la IP.'] },
        { title: '¿Qué es una URL?', url: 'https://developer.mozilla.org/es/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_URL', points: ['Partes: esquema, autoridad (dominio y puerto), ruta, parámetros y ancla.', 'URLs absolutas tienen todo; las relativas se completan según el documento actual.', 'Las URLs semánticas usan palabras legibles.'] },
        { title: '¿Qué es un servidor web?', url: 'https://developer.mozilla.org/es/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_web_server', points: ['Es hardware (la computadora) más software (el servidor HTTP).', 'Estático: envía archivos tal cual. Dinámico: genera contenido con un servidor de aplicaciones y base de datos.', 'HTTP es textual y sin estado: pedidos del cliente, respuestas del servidor.'] },
        { title: 'MDN Web Docs en español', url: 'https://developer.mozilla.org/es/', points: ['La referencia principal de la materia para HTML, CSS, JavaScript y las APIs del navegador.', 'Tiene un área “Aprende desarrollo web” con cursos por niveles.'] },
      ],
    },

    {
      id: 'frontend-y-renderizado',
      module: 'web',
      title: 'Frontend y formas de renderizar',
      keywords: 'ssr csr spa pwa mpa ssg renderizado frontend herramientas vscode git',
      tldr: 'El frontend es todo lo que el usuario ve y toca en el navegador. <mark>Renderizar</mark> es convertir código en una interfaz visible, y eso puede pasar en el servidor, en el navegador o una sola vez al compilar.',
      goals: ['Distinguir el rol de HTML, CSS y JavaScript.', 'Comparar SSR, CSR, SPA, PWA, MPA y SSG y elegir uno según el proyecto.', 'Preparar las herramientas de trabajo.'],
      body: `
        <h2>Tres lenguajes, tres trabajos</h2>
        ${table(['Lenguaje', 'Rol', 'Analogía'], [
          ['<strong>HTML</strong>', 'Estructura: qué hay en la página', 'El esqueleto'],
          ['<strong>CSS</strong>', 'Estilos visuales: cómo se ve', 'La piel y la ropa'],
          ['<strong>JavaScript</strong>', 'Lógica: cómo se comporta', 'Los músculos'],
        ])}
        <p>Un frontend incluye mucho más que “la parte linda”: menús, formularios, botones e imágenes; animaciones, validaciones y navegación entre páginas; adaptarse a cualquier pantalla (responsive); accesibilidad para personas con discapacidad; gráficos y planillas.</p>
        ${lab(0)}

        <h2>¿Qué significa renderizar?</h2>
        <p>Es transformar el código en una interfaz visual e interactiva. La pregunta clave de cualquier proyecto es <mark>dónde se arma el HTML final</mark>: en el servidor, en el navegador o de antemano. Cada respuesta tiene consecuencias en velocidad, SEO (que Google encuentre tu contenido) y complejidad.</p>

        <h3>1. SSR: Server-Side Rendering</h3>
        <p>El servidor genera el HTML completo <strong>en cada pedido</strong> y lo envía listo. Ideal cuando el contenido cambia seguido y necesitás buen SEO: blogs, e-commerce, portales de noticias.</p>
        <ul><li><strong>A favor:</strong> buena performance inicial, SEO optimizado.</li><li><strong>En contra:</strong> navegar entre páginas es más lento (recarga), el servidor trabaja más.</li><li><strong>Herramientas:</strong> Next.js (modo SSR), Laravel, Ruby on Rails, ASP.NET MVC.</li></ul>

        <h3>2. CSR: Client-Side Rendering</h3>
        <p>El navegador recibe un HTML casi vacío y <strong>JavaScript construye la interfaz</strong>. Típico de dashboards y paneles de usuario.</p>
        <ul><li><strong>A favor:</strong> navegación fluida, frontend y backend bien separados (se hablan por una API).</li><li><strong>En contra:</strong> peor SEO (al principio el HTML no tiene contenido), primera carga más lenta.</li><li><strong>Herramientas:</strong> React (con Vite), Vue, Angular.</li></ul>

        <h3>3. SPA: Single Page Application</h3>
        <p>Un tipo de CSR: toda la app vive en un solo <code>index.html</code> y navegar <strong>no recarga</strong> la página; JavaScript cambia lo que se ve. Gmail, Trello y Google Drive son SPAs.</p>
        <ul><li><strong>A favor:</strong> experiencia muy fluida, ideal para apps con muchas interacciones.</li><li><strong>En contra:</strong> el manejo de estado y de rutas es más complejo; SEO limitado (se compensa con prerendering).</li></ul>

        <h3>4. PWA: Progressive Web App</h3>
        <p>No es un método de renderizado: es un <strong>enfoque</strong> que permite que una web funcione offline, se vea como una app y se instale en el dispositivo. Requiere <em>service workers</em> (scripts que interceptan pedidos de red). Ejemplo: Spotify web.</p>

        <h3>5. MPA: Multi-Page Application</h3>
        <p>Cada sección es un HTML distinto y navegar recarga toda la página. Es la web “tradicional”: sitios en PHP, WordPress, ASP. Es lo que vas a hacer en la Unidad 4 con <code>login.html</code> y <code>dashboard.html</code>.</p>

        <h3>6. SSG: Static Site Generation</h3>
        <p>Los HTML se generan <strong>una sola vez al compilar</strong> y después se sirven como archivos estáticos. Rapidísimo y barato. Ideal para blogs, landing pages y portfolios. Herramientas: Astro, entre otras.</p>

        ${table(['', 'Dónde se arma el HTML', 'Navegar recarga', 'SEO', 'Ejemplo'], [
          ['SSR', 'Servidor, en cada pedido', 'Sí', 'Muy bueno', 'Portal de noticias'],
          ['CSR / SPA', 'Navegador, con JS', 'No', 'Limitado', 'Dashboard, Gmail'],
          ['MPA', 'Servidor o archivos', 'Sí', 'Bueno', 'WordPress'],
          ['SSG', 'Al compilar', 'Sí (rápido)', 'Muy bueno', 'Portfolio'],
        ])}
        ${note('<strong>En la materia</strong> vas a construir primero una MPA con HTML/CSS/JS puros (Unidad 4) y después una SPA con React + Vite, que es CSR (Unidad 5). Mirá el laboratorio de abajo: es una SPA en miniatura.')}
        ${lab(1)}

        <h2>Herramientas a utilizar</h2>
        <ul>
          <li><strong>VS Code</strong>: el editor. Descargalo de <a href="https://code.visualstudio.com/" target="_blank" rel="noopener">code.visualstudio.com</a>. Extensiones útiles: ESLint, Prettier, Tailwind CSS IntelliSense, Live Server.</li>
          <li><strong>Línea de comandos</strong>: la terminal donde vas a ejecutar <code>npm</code>, <code>git</code> y Vite. En VS Code se abre con <kbd>Ctrl</kbd> + <kbd>ñ</kbd> (o <kbd>Ctrl</kbd> + <kbd>&#96;</kbd>).</li>
          <li><strong>Git</strong>: guarda la historia de tu código y te deja volver atrás. Los ejercicios de la cátedra se descargan con <code>git clone</code>.</li>
        </ul>
        ${code('bash', `git clone https://github.com/dsw-frt-utn/dsw2026-ej22.git
cd dsw2026-ej22
code .            # abre la carpeta en VS Code
git status        # qué cambió
git add .
git commit -m "Menú móvil funcionando"`)}
      `,
      labs: [
        {
          title: 'HTML, CSS y JS, por separado',
          html: `
<!-- HTML: qué hay -->
<button id="saludo" class="boton">Saludar</button>
<p id="mensaje"></p>`,
          css: `
/* CSS: cómo se ve */
.boton { padding:10px 18px; border:0; border-radius:999px; background:#2b4c7e; color:white; font:inherit; cursor:pointer; }
.boton:hover { background:#1f3a63; }
#mensaje { font-size:1.4rem; }`,
          js: `
// JavaScript: cómo se comporta
document.getElementById('saludo').addEventListener('click', () => {
  document.getElementById('mensaje').textContent = '¡Hola! Esto lo escribió JavaScript.';
});`,
          hint: 'Probá borrar todo el CSS: la página sigue funcionando, solo se ve más fea. Sin el JS, se ve igual pero el botón no hace nada.',
        },
        {
          title: 'Una SPA en miniatura',
          html: `
<nav>
  <a href="#/inicio">Inicio</a>
  <a href="#/doctores">Doctores</a>
  <a href="#/contacto">Contacto</a>
</nav>
<main id="app"></main>`,
          css: `
nav { display:flex; gap:12px; padding:10px; background:#1f2a2e; border-radius:8px; }
nav a { color:#dfe6f1; text-decoration:none; }
nav a.activo { color:#f5db6b; font-weight:bold; }
main { padding:16px 4px; }`,
          js: `
// Cada "página" es una función que devuelve HTML. La página nunca se recarga.
const paginas = {
  inicio: () => '<h1>Inicio</h1><p>Bienvenido al gestor de turnos.</p>',
  doctores: () => '<h1>Doctores</h1><ul><li>Dra. Pérez</li><li>Dr. Gómez</li></ul>',
  contacto: () => '<h1>Contacto</h1><p>turnos@clinica.com</p>',
};

function render() {
  const ruta = location.hash.replace('#/', '') || 'inicio';
  const pagina = paginas[ruta] || (() => '<h1>404</h1><p>Esa página no existe.</p>');
  document.getElementById('app').innerHTML = pagina();
  document.querySelectorAll('nav a').forEach(a =>
    a.classList.toggle('activo', a.getAttribute('href') === '#/' + ruta));
  console.log('Navegaste a', ruta, 'sin recargar');
}

window.addEventListener('hashchange', render);
render();`,
          hint: 'Así funcionan React Router y esta misma guía: escuchan cambios de URL y cambian el contenido. Agregá una página <code>especialidades</code>.',
        },
      ],
      exercises: [
        {
          title: 'Elegí el tipo de renderizado',
          level: 1,
          prompt: '<p>¿Qué enfoque usarías para cada caso y por qué? (a) el portfolio personal de una diseñadora; (b) el panel interno donde la secretaría carga turnos; (c) un diario online que necesita aparecer en Google; (d) una app de notas que debe funcionar sin conexión.</p>',
          solution: { explain: '<ul><li>(a) <strong>SSG</strong>: el contenido casi no cambia; se genera una vez y se sirve rapidísimo.</li><li>(b) <strong>SPA (CSR)</strong>: es interno (el SEO no importa) y tiene muchas interacciones.</li><li>(c) <strong>SSR</strong>: contenido nuevo todo el tiempo y SEO crítico.</li><li>(d) <strong>PWA</strong> (sobre una SPA): necesita service workers para funcionar offline e instalarse.</li></ul>' },
        },
        {
          title: 'Sumale una página a la SPA',
          level: 2,
          prompt: '<p>Tomando el laboratorio “Una SPA en miniatura”, agregá una sección <code>especialidades</code> que muestre una lista generada a partir de un array, y hacé que la ruta por defecto (sin hash) sea <code>inicio</code>.</p>',
          hints: ['Agregá una clave <code>especialidades</code> al objeto <code>paginas</code>.', 'Usá <code>array.map(...).join(\'\')</code> para armar los <code>&lt;li&gt;</code>.'],
          solution: webSol('<p>Solo se agregan un enlace y una entrada en el objeto <code>paginas</code>. El resto del “router” ya funciona.</p>', {
            html: `<nav>
  <a href="#/inicio">Inicio</a>
  <a href="#/especialidades">Especialidades</a>
</nav>
<main id="app"></main>`,
            css: `nav { display:flex; gap:12px; } nav a.activo { font-weight:bold; }`,
            js: `const especialidades = ['Cardiología', 'Pediatría', 'Neurología'];

const paginas = {
  inicio: () => '<h1>Inicio</h1>',
  especialidades: () =>
    '<h1>Especialidades</h1><ul>' +
    especialidades.map(e => '<li>' + e + '</li>').join('') +
    '</ul>',
};

function render() {
  const ruta = location.hash.replace('#/', '') || 'inicio';
  const pagina = paginas[ruta] || (() => '<h1>404</h1>');
  document.getElementById('app').innerHTML = pagina();
  document.querySelectorAll('nav a').forEach(a =>
    a.classList.toggle('activo', a.getAttribute('href') === '#/' + ruta));
}

window.addEventListener('hashchange', render);
render();`,
          }),
        },
      ],
      sources: [
        { title: 'Visual Studio Code', url: 'https://code.visualstudio.com/', points: ['Editor gratuito con terminal integrada, depurador, control de versiones con Git y extensiones.'] },
      ],
    },

    {
      id: 'devtools',
      module: 'web',
      title: 'DevTools: el taller del navegador',
      keywords: 'devtools inspeccionar consola network elements lighthouse breakpoint debugger',
      tldr: 'Todos los navegadores traen herramientas para <mark>inspeccionar, editar y depurar</mark> HTML, CSS y JavaScript en vivo. Se abren con <kbd>F12</kbd> o clic derecho → Inspeccionar.',
      goals: ['Abrir DevTools y moverte entre sus pestañas.', 'Editar estilos en vivo y leer el box model.', 'Depurar con console.log, debugger y breakpoints.', 'Ver pedidos de red y el almacenamiento.'],
      body: `
        <h2>Cómo abrirlas</h2>
        <ul>
          <li><kbd>F12</kbd> o <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>I</kbd> (en Mac, <kbd>Cmd</kbd> + <kbd>Opt</kbd> + <kbd>I</kbd>).</li>
          <li>Clic derecho sobre cualquier elemento → <strong>Inspeccionar</strong>: abre Elements con ese elemento seleccionado.</li>
          <li>En Chrome: menú → Más herramientas → Herramientas para desarrolladores.</li>
        </ul>

        <h2>Las pestañas</h2>
        ${table(['Pestaña', 'Para qué', 'Qué podés hacer'], [
          ['<strong>Elements</strong> (Inspector)', 'HTML y CSS', 'Ver el DOM real, editar texto y atributos, activar/desactivar reglas CSS, ver el box model y qué regla gana'],
          ['<strong>Console</strong>', 'Mensajes y errores de JS', 'Ejecutar código, ver <code>console.log</code>, advertencias y errores con el archivo y la línea'],
          ['<strong>Sources</strong> (Depurador)', 'Depurar JavaScript', 'Poner breakpoints, avanzar línea por línea, ver variables'],
          ['<strong>Network</strong>', 'Pedidos de red', 'Ver cada pedido HTTP: método, código de estado, tiempo, cabeceras y respuesta'],
          ['<strong>Application</strong> (Storage)', 'Almacenamiento', 'Ver y editar cookies, localStorage, sessionStorage, caché'],
          ['<strong>Performance</strong>', 'Rendimiento', 'Grabar y medir FPS, repintados, tiempo de scripts'],
          ['<strong>Lighthouse</strong>', 'Auditoría (Chrome)', 'Puntaje de performance, accesibilidad, SEO y buenas prácticas'],
          ['<strong>Memory</strong>', 'Memoria', 'Detectar fugas de memoria, ver el heap'],
          ['<strong>Security</strong>', 'Seguridad', 'Verificar el certificado HTTPS y contenido mixto'],
        ])}

        <h2>Elements: tu mejor amiga para CSS</h2>
        <p>Cuando algo “no se ve como debería”, el camino es siempre el mismo:</p>
        <ol>
          <li>Inspeccioná el elemento.</li>
          <li>En el panel de estilos mirá qué reglas se aplican. Las <strong>tachadas</strong> perdieron contra otra más específica.</li>
          <li>Abajo de todo está el <strong>box model</strong>: contenido, padding, borde y margen con sus medidas reales.</li>
          <li>Probá cambios ahí mismo. Cuando funcione, copialo a tu archivo CSS: lo que cambiás en DevTools se pierde al recargar.</li>
        </ol>
        <p>Otra joya: el <strong>modo dispositivo</strong> (<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>M</kbd>) simula pantallas de celular para probar tu diseño responsive.</p>

        <h2>Console y depuración</h2>
        ${code('js', `console.log('valor:', total);           // mensaje común
console.table([{ id: 1, nombre: 'Ana' }]); // muestra arrays de objetos como tabla
console.warn('Ojo con esto');             // advertencia (amarillo)
console.error('Algo falló');              // error (rojo)

function calcularTotal(items) {
  debugger;   // con DevTools abiertas, el código se pausa acá
  return items.reduce((acc, i) => acc + i.precio, 0);
}`)}
        <p>Con la ejecución pausada podés pasar el mouse sobre cada variable para ver su valor, y usar los botones de “siguiente paso” para avanzar línea por línea. Es mucho más potente que llenar el código de <code>console.log</code>.</p>
        ${note('<strong>Leé el error completo.</strong> La consola dice qué pasó (<code>TypeError: Cannot read properties of null</code>), en qué archivo y en qué línea. Hacé clic en el nombre del archivo y te lleva directo al problema.')}
        ${lab(0)}

        <h2>Network: ver lo que viaja</h2>
        <p>Abrí Network y recargá la página. Vas a ver cada archivo pedido con su código de estado. Si un <code>fetch</code> a tu API falla, acá ves si fue un <code>404</code>, un <code>500</code> o si ni siquiera salió. Hacé clic en un pedido y mirá las pestañas <em>Headers</em> (cabeceras), <em>Payload</em> (lo que enviaste) y <em>Response</em> (lo que volvió).</p>

        <h3>Extensiones para React</h3>
        <ul><li><strong>React Developer Tools</strong>: agrega las pestañas Components (ver props y estado de cada componente) y Profiler.</li><li><strong>React Context DevTool</strong>: inspecciona los valores de los Context.</li></ul>
      `,
      labs: [
        {
          title: 'La consola por dentro',
          html: `<button id="b">Generar mensajes</button>
<button id="err">Provocar un error</button>
<p>Los mensajes aparecen abajo (y también en la consola real de DevTools).</p>`,
          js: `
document.getElementById('b').addEventListener('click', () => {
  console.log('Hola desde console.log');
  console.log({ usuario: 'ana', edad: 21 });
  console.warn('Así se ve una advertencia');
  console.error('Así se ve un error');
});

document.getElementById('err').addEventListener('click', () => {
  const elemento = document.getElementById('no-existe'); // devuelve null
  elemento.textContent = 'hola'; // TypeError: no se puede leer textContent de null
});`,
          hint: 'Abrí DevTools con <kbd>F12</kbd> → Console y apretá “Provocar un error”: vas a ver el mensaje con el número de línea. Es el error más común de la Unidad 4.',
        },
      ],
      exercises: [
        {
          title: 'Detective de estilos',
          level: 1,
          prompt: '<p>Abrí cualquier sitio que uses seguido. Con Elements: (1) cambiá el texto de un título; (2) encontrá una regla CSS tachada y explicá por qué perdió; (3) anotá el padding y el margen de un botón según el box model; (4) activá el modo dispositivo y mirá cómo cambia el diseño en 375px de ancho.</p>',
          solution: { explain: '<p>No hay una única respuesta. Lo importante: una regla aparece tachada cuando otra con <strong>mayor especificidad</strong> (o igual especificidad pero escrita después) le gana para la misma propiedad. El box model muestra de adentro hacia afuera: contenido → padding → border → margin. En modo dispositivo deberías ver cómo actúan las media queries del sitio.</p>' },
        },
        {
          title: 'Encontrá el bug',
          level: 2,
          prompt: '<p>Este código debería mostrar el total del carrito, pero muestra <code>NaN</code>. Usá <code>console.log</code> o <code>debugger</code> para encontrar el problema y corregilo.</p>' + code('js', `const carrito = [
  { nombre: 'Mouse', precio: '12000' },
  { nombre: 'Teclado', precio: 25000 },
  { nombre: 'Pad' },
];
const total = carrito.reduce((acc, item) => acc + item.precio, 0);
document.body.textContent = 'Total: ' + total;`),
          hints: ['Logueá <code>acc</code> e <code>item.precio</code> en cada vuelta del reduce.', 'Hay dos problemas distintos: uno de tipo de dato y otro de un valor que falta.'],
          solution: webSol('<p>Dos bugs: el precio del mouse es un <strong>string</strong> (<code>0 + "12000"</code> concatena en vez de sumar) y el pad <strong>no tiene precio</strong> (<code>undefined</code> en una suma da <code>NaN</code>). Se corrige convirtiendo con <code>Number()</code> y usando <code>?? 0</code> como valor por defecto.</p>', {
            html: '<p id="total"></p>',
            js: `const carrito = [
  { nombre: 'Mouse', precio: '12000' },
  { nombre: 'Teclado', precio: 25000 },
  { nombre: 'Pad' },
];

const total = carrito.reduce((acc, item) => {
  console.log('acumulado:', acc, 'precio:', item.precio);
  return acc + Number(item.precio ?? 0);
}, 0);

document.getElementById('total').textContent = 'Total: ' + total;`,
          }),
        },
      ],
      sources: [
        { title: '¿Cuáles son las herramientas de desarrollo del navegador?', url: 'https://developer.mozilla.org/es/docs/Learn_web_development/Howto/Tools_and_setup/What_are_browser_developer_tools', points: ['El <strong>Inspector</strong> muestra el DOM en tiempo real y permite editar CSS al instante.', 'El <strong>depurador</strong> permite ver variables, la pila de llamadas y poner puntos de interrupción.', 'La <strong>consola</strong> ejecuta JavaScript en la página actual e informa errores.'] },
      ],
    },
  );
})();
