/* Módulo: HTML */
(() => {
  const { code, table, note, lab, webSol } = window.GUIDE.h;

  window.GUIDE.LESSONS.push(
    {
      id: 'html-basico',
      module: 'html',
      title: 'HTML: etiquetas, atributos y documento',
      keywords: 'html etiqueta elemento atributo doctype head body anidamiento vacio enlaces imagenes listas',
      tldr: 'HTML define la <mark>estructura</mark> de una página con etiquetas como <code>&lt;h1&gt;</code>, <code>&lt;p&gt;</code> o <code>&lt;img&gt;</code>. El navegador las interpreta y muestra el contenido.',
      goals: ['Escribir un documento HTML válido desde cero.', 'Usar atributos, anidar elementos y distinguir bloque de en línea.', 'Crear enlaces, imágenes y listas.'],
      body: `
        <h2>Qué es HTML</h2>
        <p>HTML (HyperText Markup Language) es un <strong>lenguaje de marcado</strong>, no de programación: no tiene variables ni condiciones. Lo que hace es <em>marcar</em> el contenido para decir qué es cada cosa: “esto es un título”, “esto es un párrafo”, “esto es un enlace”. Es el esqueleto de la página, y junto con CSS (estilos) y JavaScript (comportamiento) forma la base del desarrollo web.</p>

        <h2>Anatomía de un elemento</h2>
        ${code('html', '<p class="nota">Mi gato es muy gruñón</p>')}
        <ul>
          <li><mark>Etiqueta de apertura</mark> <code>&lt;p&gt;</code>: el nombre del elemento entre <code>&lt; &gt;</code>. Marca dónde empieza.</li>
          <li><mark>Contenido</mark>: el texto o los elementos de adentro.</li>
          <li><mark>Etiqueta de cierre</mark> <code>&lt;/p&gt;</code>: igual a la de apertura pero con <code>/</code>. Marca dónde termina.</li>
          <li>El conjunto completo es un <strong>elemento</strong>.</li>
        </ul>
        ${note('<strong>Cerrá siempre tus etiquetas.</strong> Algunos navegadores adivinan dónde termina un elemento y completan la estructura solos. No confíes nunca en eso: lo que adivinan puede no ser lo que querías.', 'warn')}

        <h3>Elementos vacíos</h3>
        <p>Algunos elementos no tienen contenido y por eso no llevan cierre: <code>&lt;img&gt;</code>, <code>&lt;br&gt;</code>, <code>&lt;hr&gt;</code>, <code>&lt;input&gt;</code>, <code>&lt;meta&gt;</code>, <code>&lt;link&gt;</code>. Se pueden escribir con barra final (<code>&lt;img /&gt;</code>), que es obligatoria en JSX.</p>

        <h2>Atributos</h2>
        <p>Dan información extra al elemento. Reglas: un <strong>espacio</strong> después del nombre de la etiqueta, el <strong>nombre</strong> del atributo, un <code>=</code> y el <strong>valor entre comillas</strong>.</p>
        ${code('html', `<a href="https://developer.mozilla.org" target="_blank" title="Documentación">MDN</a>
<img src="img/gato.jpg" alt="Un gato naranja durmiendo" width="300" />
<input type="checkbox" checked disabled>   <!-- atributos booleanos: con estar alcanza -->`)}
        ${table(['Atributo', 'Dónde', 'Para qué'], [
          ['<code>id</code>', 'cualquiera', 'Identificador <strong>único</strong> en la página'],
          ['<code>class</code>', 'cualquiera', 'Una o más clases para CSS y JS (separadas por espacio)'],
          ['<code>href</code>', '<code>&lt;a&gt;</code>, <code>&lt;link&gt;</code>', 'A dónde apunta'],
          ['<code>src</code>', '<code>&lt;img&gt;</code>, <code>&lt;script&gt;</code>', 'Qué archivo cargar'],
          ['<code>alt</code>', '<code>&lt;img&gt;</code>', 'Texto alternativo: lo leen los lectores de pantalla y se muestra si la imagen falla'],
          ['<code>target="_blank"</code>', '<code>&lt;a&gt;</code>', 'Abrir en otra pestaña'],
        ])}

        <h2>Anidamiento</h2>
        <p>Los elementos van unos dentro de otros, y se cierran en orden inverso: <strong>el último que abriste es el primero que cerrás</strong>, como cajas dentro de cajas.</p>
        ${code('html', `<p>Mi gato es <strong>muy</strong> gruñón.</p>   <!-- bien -->
<p>Mi gato es <strong>muy gruñón.</p></strong>  <!-- mal: se cruzan -->`)}
        <p><strong>Casos especiales:</strong> un <code>&lt;p&gt;</code> no puede contener otro <code>&lt;p&gt;</code> ni un <code>&lt;div&gt;</code>; un <code>&lt;a&gt;</code> no puede contener otro <code>&lt;a&gt;</code>; los <code>&lt;li&gt;</code> van siempre dentro de <code>&lt;ul&gt;</code> u <code>&lt;ol&gt;</code>.</p>

        <h2>Bloque y en línea</h2>
        ${table(['', 'Elementos de bloque', 'Elementos en línea'], [
          ['Ejemplos', '<code>div</code>, <code>p</code>, <code>h1</code>…<code>h6</code>, <code>ul</code>, <code>section</code>', '<code>span</code>, <code>a</code>, <code>strong</code>, <code>em</code>, <code>img</code>'],
          ['Ocupan', 'Todo el ancho disponible', 'Solo lo que mide su contenido'],
          ['Empiezan', 'En una línea nueva', 'En la misma línea, junto al texto'],
        ])}

        <h2>Anatomía de un documento</h2>
        ${code('html', `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Gestor de turnos</title>
    <link rel="stylesheet" href="styles.css" />
    <script src="app.js" defer></script>
  </head>
  <body>
    <h1>Hola mundo</h1>
  </body>
</html>`)}
        <ul>
          <li><code>&lt;!DOCTYPE html&gt;</code>: indica que es HTML5. Va siempre primero.</li>
          <li><code>&lt;html lang="es"&gt;</code>: elemento raíz. El <code>lang</code> ayuda a lectores de pantalla y traductores.</li>
          <li><code>&lt;head&gt;</code>: información <strong>sobre</strong> la página, que no se ve: codificación (<code>utf-8</code> para que se vean las tildes y la ñ), viewport, título de la pestaña, estilos y scripts.</li>
          <li><code>&lt;body&gt;</code>: todo el contenido visible.</li>
        </ul>
        ${note('<strong>¿Por qué <code>defer</code>?</strong> Un <code>&lt;script&gt;</code> en el head se ejecuta antes de que exista el body, y <code>getElementById</code> devuelve <code>null</code>. Con <code>defer</code> el script espera a que el HTML esté leído. La alternativa es ponerlo al final del body, o esperar el evento <code>DOMContentLoaded</code> como hace el repo de la cátedra.')}

        <h2>Etiquetas comunes</h2>
        ${table(['Etiqueta', 'Para qué'], [
          ['<code>&lt;h1&gt;</code> … <code>&lt;h6&gt;</code>', 'Encabezados, de más a menos importante. Un solo <code>h1</code> por página y sin saltear niveles'],
          ['<code>&lt;p&gt;</code>', 'Párrafos'],
          ['<code>&lt;a href="URL"&gt;</code>', 'Enlaces a otra página, a un archivo, a un <code>#id</code> de la misma página o <code>mailto:</code>'],
          ['<code>&lt;img src alt /&gt;</code>', 'Imágenes'],
          ['<code>&lt;ol&gt;</code> / <code>&lt;ul&gt;</code> + <code>&lt;li&gt;</code>', 'Listas ordenadas (numeradas) / desordenadas (viñetas)'],
          ['<code>&lt;strong&gt;</code> / <code>&lt;em&gt;</code>', 'Importancia / énfasis (no solo “negrita” y “cursiva”)'],
          ['<code>&lt;table&gt;</code>', 'Datos tabulares (lo vas a usar mucho en la Unidad 4)'],
          ['<code>&lt;div&gt;</code> / <code>&lt;span&gt;</code>', 'Contenedores genéricos sin significado (bloque / en línea)'],
          ['<code>&lt;!-- … --&gt;</code>', 'Comentario: no se muestra'],
        ])}
        ${lab(0)}

        <h2>Tablas</h2>
        <p>Una tabla tiene cabecera (<code>&lt;thead&gt;</code>) y cuerpo (<code>&lt;tbody&gt;</code>); cada fila es un <code>&lt;tr&gt;</code>, cada celda de cabecera un <code>&lt;th&gt;</code> y cada celda de datos un <code>&lt;td&gt;</code>. Úsalas solo para datos, nunca para maquetar la página.</p>
        ${lab(1)}

        <h2>Rutas relativas</h2>
        <p>Si tu proyecto tiene esta estructura, así se enlaza cada cosa desde <code>index.html</code>:</p>
        ${code('text', `proyecto/
├── index.html
├── doctors.html
├── css/styles.css
└── img/logo.png`)}
        ${code('html', `<a href="doctors.html">Doctores</a>          <!-- misma carpeta -->
<link rel="stylesheet" href="css/styles.css"> <!-- carpeta hija -->
<img src="img/logo.png" alt="Logo">
<!-- desde css/styles.css, para subir un nivel: url("../img/logo.png") -->`)}
      `,
      labs: [
        {
          title: 'Tu primera página',
          html: `
<h1>Recetas de la abuela</h1>
<p>Las mejores recetas, <strong>probadas</strong> durante <em>generaciones</em>.</p>

<h2>Ingredientes del bizcochuelo</h2>
<ul>
  <li>4 huevos</li>
  <li>1 taza de azúcar</li>
  <li>1 taza de harina leudante</li>
</ul>

<h2>Pasos</h2>
<ol>
  <li>Batir los huevos con el azúcar.</li>
  <li>Agregar la harina de a poco.</li>
  <li>Hornear 40 minutos a 180°.</li>
</ol>

<hr>
<p>¿Dudas? Escribinos a <a href="mailto:abuela@recetas.com">abuela@recetas.com</a>
o mirá más en <a href="https://developer.mozilla.org/es/" target="_blank">MDN</a>.</p>`,
          hint: 'Cambiá <code>&lt;ol&gt;</code> por <code>&lt;ul&gt;</code> y mirá qué pasa con los números. Después agregá un <code>&lt;h3&gt;</code> con “Variante de chocolate”.',
        },
        {
          title: 'Una tabla de turnos',
          html: `
<table>
  <thead>
    <tr>
      <th>Turno</th>
      <th>Paciente</th>
      <th>Especialidad</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>#1</td><td>Julián</td><td>Clínica</td></tr>
    <tr><td>#2</td><td>María</td><td>Cardiología</td></tr>
    <tr><td>#3</td><td>Lucía</td><td>Pediatría</td></tr>
  </tbody>
</table>`,
          css: `
table { border-collapse: collapse; width: 100%; }
th, td { border: 1px solid #c9d0c9; padding: 8px 12px; text-align: left; }
th { background: #dfe6f1; }
tbody tr:nth-child(even) { background: #f2f4f1; }`,
          hint: 'Agregá una columna “Hora” (acordate de sumar un <code>&lt;th&gt;</code> y un <code>&lt;td&gt;</code> en cada fila).',
        },
      ],
      exercises: [
        {
          title: 'Encontrá los errores',
          level: 1,
          prompt: '<p>Este HTML tiene cinco errores. Encontralos y corregilos.</p>' + code('html', `<html>
<head><title>Mi página</head>
<body>
  <h1>Bienvenidos</h2>
  <p>Visitá <a href=docs.html>la documentación</p></a>
  <img src="foto.jpg">
  <ul><p>Un ítem</p></ul>
</body>
</html>`),
          solution: webSol('<ol><li>Falta <code>&lt;!DOCTYPE html&gt;</code>.</li><li><code>&lt;title&gt;</code> no está cerrado.</li><li><code>&lt;h1&gt;</code> se cierra con <code>&lt;/h2&gt;</code>.</li><li>El <code>&lt;a&gt;</code> y el <code>&lt;p&gt;</code> se cruzan; además conviene poner el <code>href</code> entre comillas.</li><li>La imagen no tiene <code>alt</code>, y dentro de <code>&lt;ul&gt;</code> solo van <code>&lt;li&gt;</code>.</li></ol>', {
            html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Mi página</title>
</head>
<body>
  <h1>Bienvenidos</h1>
  <p>Visitá <a href="docs.html">la documentación</a></p>
  <img src="foto.jpg" alt="Foto del equipo">
  <ul><li>Un ítem</li></ul>
</body>
</html>`,
          }),
        },
        {
          title: 'Ficha de un doctor',
          level: 2,
          prompt: '<p>Armá una página de perfil con: un <code>h1</code> con el nombre, una imagen con <code>alt</code>, un párrafo de presentación con una palabra en <code>strong</code>, una lista de especialidades, una tabla de horarios (día y franja horaria) y un enlace que vuelva a <code>index.html</code>.</p>',
          solution: webSol('<p>Lo importante es la jerarquía: un único <code>h1</code>, <code>h2</code> para cada sección, la tabla con <code>thead</code>/<code>tbody</code> y un <code>alt</code> que describa la imagen.</p>', {
            html: `<h1>Dra. Laura Pérez</h1>
<img src="https://placehold.co/160x160" alt="Retrato de la doctora Laura Pérez" width="160">
<p>Médica <strong>cardióloga</strong> con 15 años de experiencia en adultos.</p>

<h2>Especialidades</h2>
<ul>
  <li>Cardiología clínica</li>
  <li>Ecocardiografía</li>
</ul>

<h2>Horarios</h2>
<table>
  <thead><tr><th>Día</th><th>Horario</th></tr></thead>
  <tbody>
    <tr><td>Lunes</td><td>8 a 12 h</td></tr>
    <tr><td>Jueves</td><td>14 a 18 h</td></tr>
  </tbody>
</table>

<p><a href="index.html">Volver al inicio</a></p>`,
            css: `table { border-collapse: collapse; } th, td { border: 1px solid #ccc; padding: 6px 10px; }`,
          }),
        },
      ],
      sources: [
        { title: 'HTML · MDN', url: 'https://developer.mozilla.org/es/docs/Web/HTML', points: ['HTML es el bloque más básico de la web: define el significado y la estructura del contenido.', 'Se acompaña de CSS (presentación) y JavaScript (comportamiento).'] },
      ],
    },

    {
      id: 'html-semantico',
      module: 'html',
      title: 'HTML semántico y estructura de página',
      keywords: 'semantica header nav main section article aside footer accesibilidad seo layout columnas',
      tldr: 'Las etiquetas semánticas dicen <mark>qué significa</mark> el contenido, no solo dónde está. Mejoran la accesibilidad (lectores de pantalla) y el SEO, y hacen tu código más fácil de leer.',
      goals: ['Elegir la etiqueta semántica correcta para cada zona.', 'Reconocer las partes de un diseño web y los layouts de 1, 2 y 3 columnas.', 'Resolver los ejercicios 17 y 17.2.'],
      body: `
        <h2>¿Por qué importa la semántica?</h2>
        <p>Visualmente, un <code>&lt;div&gt;</code> y un <code>&lt;nav&gt;</code> son idénticos. La diferencia es para quien <strong>lee</strong> el código:</p>
        <ul>
          <li><strong>Lectores de pantalla:</strong> una persona ciega puede saltar directo al <code>&lt;main&gt;</code> o listar los <code>&lt;nav&gt;</code> de la página.</li>
          <li><strong>Buscadores:</strong> Google entiende qué es contenido principal y qué es navegación.</li>
          <li><strong>Vos y tu equipo:</strong> <code>&lt;footer&gt;</code> se entiende sin leer las clases.</li>
        </ul>

        <h2>Las etiquetas del layout</h2>
        ${table(['Etiqueta', 'Significado', 'Ejemplo de uso'], [
          ['<code>&lt;header&gt;</code>', 'Cabecera del sitio o de una sección', 'Logo y nombre del sitio'],
          ['<code>&lt;nav&gt;</code>', 'Bloque de navegación principal', 'Menú del dashboard'],
          ['<code>&lt;main&gt;</code>', 'Contenido principal. <strong>Uno por página</strong>', 'La tabla de pacientes'],
          ['<code>&lt;section&gt;</code>', 'Sección temática, normalmente con su título', '“Turnos de hoy”'],
          ['<code>&lt;article&gt;</code>', 'Contenido que tiene sentido por sí solo', 'Una noticia, un comentario, la tarjeta de un producto'],
          ['<code>&lt;aside&gt;</code>', 'Contenido secundario, relacionado pero prescindible', 'Barra lateral, “artículos relacionados”'],
          ['<code>&lt;footer&gt;</code>', 'Pie de página o de sección', 'Copyright, contacto'],
          ['<code>&lt;figure&gt;</code> + <code>&lt;figcaption&gt;</code>', 'Imagen o gráfico con su descripción', 'Un diagrama con epígrafe'],
        ])}
        <p>Otras muy útiles: <code>&lt;mark&gt;</code> (texto resaltado), <code>&lt;time datetime="2026-10-15"&gt;</code> (fechas legibles por máquinas), <code>&lt;progress&gt;</code> (barra de progreso) y <code>&lt;details&gt;</code> + <code>&lt;summary&gt;</code> (bloque desplegable sin JavaScript: los ejercicios de esta guía lo usan).</p>
        ${code('html', `<!-- Sin semántica: todo es div -->
<div class="header">…</div>
<div class="menu">…</div>
<div class="contenido">…</div>

<!-- Con semántica: el navegador y los lectores de pantalla entienden -->
<header>…</header>
<nav>…</nav>
<main>…</main>`)}
        ${note('<strong>¿section, article o div?</strong> Si lo podrías publicar solo (en otro sitio, en un feed) es <code>article</code>. Si agrupa contenido de un mismo tema con un título, es <code>section</code>. Si solo lo necesitás para dar estilo, es <code>div</code>.')}

        <h2>Las partes de un diseño web</h2>
        <ul>
          <li><mark>Encabezado</mark>: arriba en cada página. Contiene lo que es común a todas (nombre o logo) y un sistema de navegación fácil de usar.</li>
          <li><mark>Contenido principal</mark>: el área más grande, con el contenido único de la página actual.</li>
          <li><mark>Contenido secundario</mark>: información complementaria, información compartida entre algunas páginas, o una navegación alternativa. Todo lo que no es imprescindible para el contenido principal.</li>
          <li><mark>Pie de página</mark>: abajo en cada página. Información global pero menos llamativa: avisos legales, contacto.</li>
        </ul>
        ${lab(0)}

        <h2>Layouts de 1, 2 y 3 columnas</h2>
        <p>Casi todos los sitios combinan estas piezas en alguna de estas formas:</p>
        <ul>
          <li><strong>1 columna:</strong> todo apilado. Es la base en celulares.</li>
          <li><strong>2 columnas:</strong> navegación lateral + contenido. Es el dashboard de la materia.</li>
          <li><strong>3 columnas:</strong> navegación + contenido + aside. Típico de diarios y redes sociales.</li>
        </ul>
        <p>Cómo lograrlo con CSS lo vas a ver en las lecciones de Flexbox y Grid; por ahora, lo importante es la estructura HTML, que es la misma en los tres casos.</p>
        ${lab(1)}
      `,
      labs: [
        {
          title: 'Esqueleto semántico (Ejercicio 17)',
          html: `
<header>Soy una página</header>
<nav>
  <a href="index.html">Panel</a>
  <a href="doctors.html">Doctores</a>
  <a href="#">Especialidades</a>
  <a href="#">Búsqueda de Pacientes</a>
</nav>
<main>
  <div>Hola a todos!</div>
  <details>
    <summary>¿Qué es esto?</summary>
    Un elemento nativo que se abre y se cierra sin JavaScript.
  </details>
</main>
<footer>Información de mi empresa</footer>`,
          css: `
/* Bordes para ver cada zona, como en el Ejercicio 19 */
header { border:1px solid gray; padding:8px; }
nav    { border:1px solid red; padding:8px; display:flex; gap:12px; }
main   { border:1px solid blue; min-height:100px; padding:8px; }
footer { border:1px solid green; padding:8px; }`,
          hint: 'Hacé clic en “Doctores”: en el laboratorio no hay otras páginas, pero en tu carpeta navegarías a <code>doctors.html</code>.',
        },
        {
          title: 'Tres columnas con semántica',
          html: `
<header><strong>Diario Tucumano</strong></header>
<div class="cols">
  <nav>
    <a href="#">Política</a>
    <a href="#">Deportes</a>
    <a href="#">Cultura</a>
  </nav>
  <main>
    <article>
      <h2>Se inauguró un nuevo hospital</h2>
      <p><time datetime="2026-10-15">15 de octubre</time>. El edificio cuenta con 120 camas…</p>
    </article>
    <article>
      <h2>Atlético ganó el clásico</h2>
      <p>Con un gol en el último minuto…</p>
    </article>
  </main>
  <aside>
    <h3>Lo más leído</h3>
    <ol><li>Feriado largo</li><li>Clima del finde</li></ol>
  </aside>
</div>
<footer>© 2026 Diario Tucumano</footer>`,
          css: `
.cols { display:grid; grid-template-columns: 140px 1fr 180px; gap:12px; margin:12px 0; }
nav { display:flex; flex-direction:column; gap:6px; }
header, footer { background:#1f2a2e; color:white; padding:10px; border-radius:6px; }
article { border-bottom:1px solid #d3d9d3; }
aside { background:#f2f4f1; padding:8px; border-radius:6px; }
@media (max-width: 600px) { .cols { grid-template-columns: 1fr; } }`,
          hint: 'Achicá el resultado: se vuelve una sola columna. Fijate que el HTML no cambia, solo el CSS.',
        },
      ],
      exercises: [
        {
          official: '#17',
          title: 'Página semántica',
          level: 1,
          prompt: `<ol>
            <li>Creá una carpeta <code>Ejercicio_17</code>, abrila en VS Code y creá <code>index.html</code>.</li>
            <li>Agregá en este orden: un <code>header</code> con “Soy una página”; un <code>nav</code> con cuatro <code>a</code>: “Panel”, “Doctores”, “Especialidades”, “Búsqueda de Pacientes”; un <code>main</code> con un <code>div</code> que diga “Hola a todos!”; un <code>footer</code> con “Información de mi empresa”.</li>
            <li>Abrí la carpeta y hacé doble clic en <code>index.html</code>.</li>
          </ol><p><strong>Resultado:</strong> se abre el navegador mostrando el contenido.</p>`,
          solution: webSol('<p>Un documento completo con la estructura pedida. Recordá el <code>lang</code>, el <code>charset</code> y el viewport.</p>', {
            html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ejercicio 17</title>
</head>
<body>
  <header>Soy una página</header>
  <nav>
    <a>Panel</a>
    <a>Doctores</a>
    <a>Especialidades</a>
    <a>Búsqueda de Pacientes</a>
  </nav>
  <main>
    <div>Hola a todos!</div>
  </main>
  <footer>Información de mi empresa</footer>
</body>
</html>`,
          }),
        },
        {
          official: '#17.2',
          title: 'Relacionar dos páginas',
          level: 1,
          prompt: `<ul>
            <li>“Panel” debe apuntar con <code>href</code> a <code>index.html</code> y “Doctores” a <code>doctors.html</code>.</li>
            <li>Creá <code>doctors.html</code> copiando el contenido de <code>index.html</code> y cambiá el <code>div</code> por “Soy un listado de Doctores”.</li>
            <li>Modificá los <code>a</code> en ambos archivos agregando el <code>href</code>.</li>
          </ul><p><strong>Resultado:</strong> desde el navegador, al hacer clic en los enlaces navegás de una página a otra.</p>`,
          solution: webSol('<p>Las dos páginas comparten la misma estructura; solo cambia el contenido del <code>main</code>. Como están en la misma carpeta, las rutas son relativas y sin barras. (Esta duplicación del header y el nav en cada archivo es justamente lo que React va a resolver con componentes).</p>', {
            html: `<!-- index.html -->
<header>Soy una página</header>
<nav>
  <a href="index.html">Panel</a>
  <a href="doctors.html">Doctores</a>
  <a href="#">Especialidades</a>
  <a href="#">Búsqueda de Pacientes</a>
</nav>
<main>
  <div>Hola a todos!</div>
</main>
<footer>Información de mi empresa</footer>

<!-- doctors.html: idéntico, salvo el main -->
<!--
<main>
  <div>Soy un listado de Doctores</div>
</main>
-->`,
          }),
        },
        {
          title: 'Semantizá esta página',
          level: 2,
          prompt: '<p>Reescribí este HTML usando etiquetas semánticas donde corresponda. ¿Cuántos <code>div</code> sobreviven?</p>' + code('html', `<div class="top"><div class="logo">Clínica</div><div class="menu"><a href="#">Inicio</a><a href="#">Turnos</a></div></div>
<div class="content">
  <div class="post"><div class="title">Nuevo horario</div><div>Desde noviembre abrimos los sábados.</div></div>
  <div class="sidebar">Teléfono de guardia: 0381-555-1234</div>
</div>
<div class="bottom">© 2026</div>`),
          solution: webSol('<p>Solo sobrevive el <code>div</code> que agrupa contenido y aside para el layout (y hasta ese se podría evitar aplicando la grilla al body). El post se vuelve <code>article</code> con un <code>h2</code> real en lugar de un div con clase “title”.</p>', {
            html: `<header>
  <strong class="logo">Clínica</strong>
  <nav><a href="#">Inicio</a> <a href="#">Turnos</a></nav>
</header>
<div class="content">
  <main>
    <article>
      <h2>Nuevo horario</h2>
      <p>Desde noviembre abrimos los sábados.</p>
    </article>
  </main>
  <aside>Teléfono de guardia: 0381-555-1234</aside>
</div>
<footer>© 2026</footer>`,
          }),
        },
      ],
    },

    {
      id: 'html-formularios',
      module: 'html',
      title: 'Formularios HTML',
      keywords: 'form input label button required validacion select textarea checkbox radio fieldset',
      tldr: 'Un <code>&lt;form&gt;</code> permite que el usuario <mark>ingrese y envíe datos</mark> a un servidor o los procese en el navegador. HTML ya trae validaciones como <code>required</code> sin escribir JavaScript.',
      goals: ['Construir formularios con los controles adecuados para cada dato.', 'Conectar labels e inputs para que sean accesibles.', 'Usar las validaciones nativas y estilizar campos inválidos.'],
      body: `
        <h2>Cómo funciona un formulario</h2>
        <p>Cuando se envía, el navegador junta los valores de todos los controles que tengan <code>name</code> y los manda a la URL del <code>action</code> con el método del <code>method</code>. Con <code>GET</code> los datos viajan en la URL (<code>?usuario=ana&amp;clave=…</code>); con <code>POST</code>, en el cuerpo del pedido.</p>
        ${code('html', `<form action="/api/login" method="post">
  <label for="user">Usuario</label>
  <input id="user" name="username" type="text" required>
  <button type="submit">Ingresar</button>
</form>`)}
        <p>En una app moderna casi nunca dejás que el navegador envíe el formulario solo: lo interceptás con JavaScript (<code>preventDefault</code>) y mandás los datos con <code>fetch</code>. Pero la estructura HTML es la misma.</p>

        <h2>Los elementos de un formulario</h2>
        ${table(['Elemento', 'Para qué'], [
          ['<code>&lt;form&gt;</code>', 'Contenedor. <code>action</code>: a dónde enviar; <code>method</code>: GET o POST'],
          ['<code>&lt;label for="id"&gt;</code>', 'Describe un campo. Al hacer clic en el label, se enfoca el campo'],
          ['<code>&lt;input type="…"&gt;</code>', 'Campo de entrada. El <code>type</code> cambia el teclado en el celular y la validación'],
          ['<code>&lt;textarea&gt;</code>', 'Texto largo, de varias líneas'],
          ['<code>&lt;select&gt;</code> + <code>&lt;option&gt;</code>', 'Lista desplegable'],
          ['<code>&lt;fieldset&gt;</code> + <code>&lt;legend&gt;</code>', 'Agrupa campos relacionados con un título'],
          ['<code>&lt;button type="submit"&gt;</code>', 'Envía. Otros tipos: <code>reset</code> (limpia) y <code>button</code> (no hace nada solo)'],
        ])}
        ${note('<strong>Cuidado:</strong> un <code>&lt;button&gt;</code> dentro de un form es <code>type="submit"</code> por defecto. Si querés un botón que no envíe (por ejemplo “Mostrar contraseña”), poné <code>type="button"</code>.', 'warn')}

        <h3>Tipos de input</h3>
        ${table(['type', 'Para', 'Bonus'], [
          ['<code>text</code>', 'Texto libre', ''],
          ['<code>password</code>', 'Contraseñas', 'Oculta los caracteres'],
          ['<code>email</code>', 'Correos', 'Valida el formato y muestra @ en el teclado del celular'],
          ['<code>number</code>', 'Números', 'Acepta <code>min</code>, <code>max</code> y <code>step</code>'],
          ['<code>date</code> / <code>time</code>', 'Fechas / horas', 'Muestra un selector'],
          ['<code>tel</code>', 'Teléfonos', 'Teclado numérico en el celular'],
          ['<code>checkbox</code>', 'Sí/no, varias opciones', 'Se marca con <code>checked</code>'],
          ['<code>radio</code>', 'Una opción entre varias', 'Los del mismo grupo comparten <code>name</code>'],
          ['<code>search</code>', 'Buscadores', 'Agrega botón para limpiar'],
        ])}
        ${lab(0)}

        <h2>Validaciones nativas</h2>
        <p>Antes de enviar, el navegador revisa las reglas y, si algo falla, muestra un mensaje y no envía. Es <strong>validación del lado del cliente</strong>: mejora la experiencia, pero se puede saltear fácil, así que <mark>el servidor siempre tiene que volver a validar</mark>.</p>
        ${table(['Atributo', 'Qué valida'], [
          ['<code>required</code>', 'El campo no puede estar vacío'],
          ['<code>minlength</code> / <code>maxlength</code>', 'Cantidad de caracteres'],
          ['<code>min</code> / <code>max</code> / <code>step</code>', 'Rango y saltos en números y fechas'],
          ['<code>type="email"</code>, <code>type="url"</code>', 'El formato'],
          ['<code>pattern</code>', 'Una expresión regular. Ej.: <code>pattern="[0-9]{7,8}"</code> para un DNI'],
        ])}
        <p>CSS puede reaccionar al estado de validación con las pseudo-clases <code>:valid</code>, <code>:invalid</code>, <code>:required</code> y <code>:user-invalid</code> (esta última solo se activa después de que el usuario tocó el campo, así no aparece todo en rojo apenas carga la página).</p>
        ${note('<strong>Siempre conectá label e input:</strong> el <code>for</code> del label tiene que coincidir con el <code>id</code> del input. Un <code>placeholder</code> no reemplaza al label: desaparece al escribir y muchos lectores de pantalla no lo leen.')}
        ${lab(1)}
      `,
      labs: [
        {
          title: 'Todos los controles',
          html: `
<form id="f">
  <fieldset>
    <legend>Datos del paciente</legend>
    <label for="nombre">Nombre</label>
    <input id="nombre" name="nombre" required>

    <label for="email">Email</label>
    <input id="email" name="email" type="email" placeholder="ana@mail.com">

    <label for="nac">Fecha de nacimiento</label>
    <input id="nac" name="nacimiento" type="date">

    <label for="esp">Especialidad</label>
    <select id="esp" name="especialidad">
      <option value="">Elegí una…</option>
      <option>Cardiología</option>
      <option>Pediatría</option>
    </select>
  </fieldset>

  <fieldset>
    <legend>Turno</legend>
    <label><input type="radio" name="turno" value="manana" checked> Mañana</label>
    <label><input type="radio" name="turno" value="tarde"> Tarde</label>
    <label><input type="checkbox" name="recordatorio"> Enviarme un recordatorio</label>
  </fieldset>

  <label for="obs">Observaciones</label>
  <textarea id="obs" name="observaciones" rows="3"></textarea>

  <button>Enviar</button>
</form>`,
          css: `
form { display:grid; gap:10px; max-width:380px; }
fieldset { display:grid; gap:6px; border:1px solid #d3d9d3; border-radius:8px; }
legend { font-weight:bold; padding:0 6px; }
input, select, textarea, button { font:inherit; padding:6px 8px; }
button { background:#2b4c7e; color:white; border:0; border-radius:6px; cursor:pointer; }`,
          js: `
// FormData lee todos los campos que tienen name, como hace el navegador al enviar
document.getElementById('f').addEventListener('submit', (e) => {
  e.preventDefault();
  const datos = Object.fromEntries(new FormData(e.target));
  console.log(datos);
});`,
          hint: 'Completá y enviá: en la consola aparece un objeto con cada <code>name</code>. Fijate que el checkbox solo aparece si está marcado.',
        },
        {
          title: 'Validación nativa con estilo',
          html: `
<form>
  <label for="dni">DNI (7 u 8 números)</label>
  <input id="dni" required pattern="[0-9]{7,8}" inputmode="numeric">

  <label for="edad">Edad</label>
  <input id="edad" type="number" min="0" max="120" required>

  <label for="mail">Email</label>
  <input id="mail" type="email" required>

  <button>Guardar</button>
</form>`,
          css: `
form { display:grid; gap:6px; max-width:300px; }
input { font:inherit; padding:8px; border:2px solid #c9d0c9; border-radius:6px; }
input:user-invalid { border-color:#c0392b; background:#fdf0f0; }
input:valid { border-color:#2f7a55; }
button { margin-top:8px; padding:10px; font:inherit; }`,
          hint: 'Escribí letras en el DNI y salí del campo: se pone rojo gracias a <code>:user-invalid</code>, sin una línea de JavaScript.',
        },
      ],
      exercises: [
        {
          official: '#18',
          title: 'Formulario de login de administrador',
          level: 1,
          prompt: `<ol>
            <li>Creá la carpeta <code>Ejercicio_18</code>, abrila en VS Code y creá <code>index.html</code>.</li>
            <li>Dentro de un <code>form</code>: un <code>label</code> “Nombre de Usuario:” y un <code>input</code> de texto requerido; un <code>label</code> “Contraseña:” y un <code>input</code> password requerido; un <code>button</code> de tipo submit.</li>
          </ol><p><strong>Resultado:</strong> el formulario de login con las validaciones en cada campo.</p>`,
          solution: webSol('<p>Cada label se conecta a su input con <code>for</code>/<code>id</code>. Con <code>required</code>, el navegador no deja enviar campos vacíos.</p>', {
            html: `<form>
  <label for="username">Nombre de Usuario:</label>
  <input type="text" id="username" name="username" required>

  <label for="password">Contraseña:</label>
  <input type="password" id="password" name="password" required>

  <button type="submit">Ingresar</button>
</form>`,
            css: `form { display: flex; flex-direction: column; gap: 8px; max-width: 280px; }`,
          }),
        },
        {
          title: 'Formulario de alta de paciente',
          level: 2,
          prompt: '<p>Creá un formulario con: nombre y apellido (requeridos, mínimo 2 caracteres), DNI (7 u 8 dígitos con <code>pattern</code>), email, fecha de nacimiento, obra social en un <code>select</code> (con opción “Particular”), sexo con radios y un checkbox “Acepto los términos” obligatorio. Los campos inválidos deben verse en rojo solo después de tocarlos.</p>',
          hints: ['Un checkbox también acepta <code>required</code>.', 'Usá <code>:user-invalid</code> en el CSS.'],
          solution: webSol('<p>Todo se resuelve con atributos nativos. El <code>required</code> en un radio del grupo alcanza para que el grupo sea obligatorio.</p>', {
            html: `<form>
  <label for="nombre">Nombre</label>
  <input id="nombre" name="nombre" required minlength="2">

  <label for="apellido">Apellido</label>
  <input id="apellido" name="apellido" required minlength="2">

  <label for="dni">DNI</label>
  <input id="dni" name="dni" required pattern="[0-9]{7,8}" inputmode="numeric">

  <label for="email">Email</label>
  <input id="email" name="email" type="email">

  <label for="nac">Fecha de nacimiento</label>
  <input id="nac" name="nacimiento" type="date" required>

  <label for="os">Obra social</label>
  <select id="os" name="obraSocial" required>
    <option value="">Elegí…</option>
    <option>Particular</option>
    <option>Subsidio de Salud</option>
    <option>OSDE</option>
  </select>

  <fieldset>
    <legend>Sexo</legend>
    <label><input type="radio" name="sexo" value="F" required> Femenino</label>
    <label><input type="radio" name="sexo" value="M"> Masculino</label>
    <label><input type="radio" name="sexo" value="X"> No binario</label>
  </fieldset>

  <label><input type="checkbox" name="terminos" required> Acepto los términos</label>
  <button>Registrar</button>
</form>`,
            css: `form { display:grid; gap:6px; max-width:340px; }
input, select { font:inherit; padding:6px; border:2px solid #c9d0c9; border-radius:6px; }
:user-invalid { border-color:#c0392b; }`,
          }),
        },
      ],
      sources: [
        { title: 'Validación de formularios en el lado del cliente', url: 'https://developer.mozilla.org/es/docs/Learn_web_development/Extensions/Forms/Form_validation', points: ['La validación del cliente da respuesta inmediata; la del servidor es obligatoria por seguridad.', 'Atributos nativos: <code>required</code>, <code>minlength</code>, <code>maxlength</code>, <code>min</code>, <code>max</code>, <code>step</code>, <code>type</code>, <code>pattern</code>.', '<code>:valid</code> e <code>:invalid</code> permiten dar estilo según el estado.', 'La API de validación ofrece <code>checkValidity()</code>, <code>setCustomValidity()</code> y la propiedad <code>validity</code>.', '<code>novalidate</code> en el form desactiva los mensajes del navegador para mostrar los tuyos.'] },
      ],
    },
  );
})();
