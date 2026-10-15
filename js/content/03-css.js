/* Módulo: CSS */
(() => {
  const { code, table, note, lab, webSol } = window.GUIDE.h;

  window.GUIDE.LESSONS.push(
    {
      id: 'css-selectores',
      module: 'css',
      title: 'CSS: cómo aplicarlo y selectores',
      keywords: 'css selectores clase id inline externo interno pseudo-clase pseudo-elemento colores fuentes',
      tldr: 'CSS describe <mark>cómo se ve</mark> cada elemento. Una regla tiene un <mark>selector</mark> (a quién le aplica) y <mark>declaraciones</mark> (qué estilo le pone).',
      goals: ['Conectar CSS a una página de las tres formas posibles.', 'Usar todos los tipos de selectores.', 'Aplicar colores, fuentes y fondos básicos.'],
      body: `
        <h2>Anatomía de una regla</h2>
        ${code('css', `h1 {                  /* selector: a quién */
  color: #2b4c7e;      /* declaración = propiedad: valor; */
  font-size: 2rem;
}`)}
        <p>CSS (Cascading Style Sheets, hojas de estilo en cascada) es un lenguaje que describe cómo se renderiza cada elemento en la pantalla, en papel o en otros medios. Cada declaración termina con <code>;</code> y el bloque va entre llaves.</p>

        <h2>Tres formas de aplicar CSS</h2>
        ${table(['Forma', 'Cómo', 'A favor', 'En contra'], [
          ['<strong>En línea</strong>', '<code>&lt;h1 style="color: red;"&gt;Hola&lt;/h1&gt;</code>', 'Rápido para pruebas', 'No reutilizable, difícil de mantener'],
          ['<strong>Interna</strong>', '<code>&lt;style&gt; h1 { color: red; } &lt;/style&gt;</code> en el <code>&lt;head&gt;</code>', 'Útil en archivos simples o pruebas', 'No separa contenido de estilo'],
          ['<strong>Externa</strong>', '<code>&lt;link rel="stylesheet" href="estilos.css"&gt;</code>', 'Reutilizable, limpio y organizado', 'Requiere una carga adicional'],
        ])}
        ${note('<strong>La recomendada es la externa:</strong> un archivo <code>.css</code> que comparten todas tus páginas. Si mañana cambia el color de la marca, lo cambiás en un solo lugar. El repo de la cátedra usa un <code>style.css</code> común y uno por página (<code>login_style.css</code>, <code>dashboard_style.css</code>).')}

        <h2>Selectores</h2>
        ${table(['Tipo', 'Ejemplo', 'Selecciona'], [
          ['Universal', '<code>* { }</code>', 'Todos los elementos'],
          ['Elemento', '<code>p { }</code>', 'Todos los <code>&lt;p&gt;</code>'],
          ['Clase', '<code>.rojo { }</code>', 'Los que tienen <code>class="rojo"</code>'],
          ['ID', '<code>#principal { }</code>', 'El que tiene <code>id="principal"</code> (único en la página)'],
          ['Agrupado', '<code>h1, h2, p { }</code>', 'Todos los h1, h2 y p'],
          ['Descendiente', '<code>article p { }</code>', 'Los p dentro de un article, a cualquier profundidad'],
          ['Hijo directo', '<code>ul &gt; li { }</code>', 'Los li que son hijos directos de ul'],
          ['Hermano adyacente', '<code>h1 + p { }</code>', 'El primer p justo después de un h1'],
          ['Hermanos generales', '<code>h1 ~ p { }</code>', 'Todos los p que vienen después de un h1, al mismo nivel'],
          ['Atributo', '<code>input[type="text"]</code>', 'Inputs de tipo texto'],
          ['Pseudo-clase', '<code>a:hover</code>, <code>li:nth-child(2)</code>, <code>input:focus</code>', 'Un <strong>estado</strong> o posición'],
          ['Pseudo-elemento', '<code>p::first-line</code>, <code>.req::after</code>', 'Una <strong>parte</strong> de un elemento, o contenido generado'],
          ['Combinado', '<code>button.primario</code>', 'Botones que además tienen la clase primario'],
        ])}
        <p><strong>Pseudo-clases que vas a usar siempre:</strong> <code>:hover</code> (mouse encima), <code>:focus</code> y <code>:focus-visible</code> (tiene el foco del teclado), <code>:active</code> (mientras se presiona), <code>:first-child</code>, <code>:last-child</code>, <code>:nth-child(even)</code> (filas pares de una tabla), <code>:not(.x)</code> y <code>:disabled</code>.</p>
        ${lab(0)}

        <h2>Clases: la herramienta principal</h2>
        <p>En la práctica, casi todo tu CSS va a usar <strong>clases</strong>. Son reutilizables (muchos elementos pueden tener la misma), combinables (<code>class="btn btn-primario"</code>) y tienen una especificidad moderada, que evita peleas. Usá IDs para JavaScript (<code>getElementById</code>) y para anclas, no para estilos.</p>

        <h2>Colores, texto y fondos</h2>
        ${code('css', `.tarjeta {
  color: #1f2a2e;                  /* hexadecimal */
  background-color: rgb(242 244 241);  /* rgb */
  border: 1px solid hsl(120 8% 84%);   /* hsl: tono, saturación, luz */
  font-family: "Atkinson Hyperlegible", system-ui, sans-serif;  /* con alternativas */
  font-size: 1rem;
  font-weight: 700;                /* 400 normal, 700 negrita */
  line-height: 1.5;                /* interlineado: sin unidad */
  text-align: center;
  text-decoration: none;           /* sacar el subrayado de un enlace */
  text-transform: uppercase;
}`)}
        ${lab(1)}
      `,
      labs: [
        {
          title: 'Jugá con selectores',
          html: `
<article>
  <h1>Título del artículo</h1>
  <p>Primer párrafo, justo después del h1.</p>
  <p class="destacado">Un párrafo con clase.</p>
  <p>Otro párrafo hermano.</p>
  <ul>
    <li>Hijo directo</li>
    <li>Otro hijo <a href="#">con un enlace</a></li>
    <li>Tercero</li>
  </ul>
  <label>Nombre <span class="req"></span></label>
  <input type="text" placeholder="input[type=text]">
</article>`,
          css: `
article p { color: #4d5b60; }
h1 + p { font-weight: bold; }
.destacado { background: #f5db6b; padding: 4px 8px; }
ul > li:nth-child(odd) { background: #dfe6f1; }
a:hover { color: crimson; }
input[type="text"] { border: 2px solid #2b4c7e; padding: 6px; }
input:focus { outline: 3px solid #f5db6b; }
.req::after { content: "*"; color: crimson; }
p::first-letter { font-size: 1.6em; }`,
          hint: 'Cambiá <code>h1 + p</code> por <code>h1 ~ p</code> (todos los hermanos siguientes) y compará. Hacé clic en el input para ver <code>:focus</code>.',
        },
        {
          title: 'Una tarjeta con estilo',
          html: `
<div class="tarjeta">
  <h2>Cardiología</h2>
  <p>Diagnóstico y tratamiento de enfermedades del corazón.</p>
  <a class="btn" href="#">Pedir turno</a>
</div>`,
          css: `
.tarjeta {
  max-width: 320px;
  padding: 20px;
  border-radius: 14px;
  background: white;
  border: 1px solid #d3d9d3;
  font-family: Georgia, serif;
}
.tarjeta h2 { margin: 0 0 6px; color: #2b4c7e; }
.tarjeta p { color: #4d5b60; line-height: 1.5; }
.btn {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 999px;
  background: #2b4c7e;
  color: white;
  text-decoration: none;
  font-family: system-ui, sans-serif;
}
.btn:hover { background: #1f3a63; }`,
          hint: 'Cambiá la fuente por <code>system-ui</code>, el radio por <code>0</code>, y probá otros colores en hsl.',
        },
      ],
      exercises: [
        {
          official: '#19',
          title: 'Estilos en línea y en archivo externo',
          level: 1,
          prompt: `<ol>
            <li>Creá <code>Ejercicio_19</code> y copiá <code>index.html</code> y <code>doctors.html</code> del ejercicio 17.</li>
            <li>Con el atributo <code>style</code>: <code>header</code> → <code>border: 1px solid gray;</code> · <code>nav</code> → <code>border: 1px solid red; height: 30px;</code> · <code>main</code> → <code>border: 1px solid blue; height: 100px;</code> · <code>footer</code> → <code>border: 1px solid green; height: 30px;</code></li>
            <li>Después aplicá los mismos estilos desde un archivo externo.</li>
          </ol><p><strong>Resultado:</strong> al cargar <code>index.html</code> cada sección muestra su borde.</p>`,
          solution: webSol('<p>Primero con <code>style</code> en cada etiqueta; después se mueve todo a <code>styles.css</code> y se enlaza con <code>&lt;link&gt;</code> en el head de <strong>ambas</strong> páginas. Ventaja: cambiás un color en un solo lugar y se aplica a las dos.</p>', {
            html: `<!-- Versión 1, en línea -->
<!-- <header style="border: 1px solid gray;">Soy una página</header> ... -->

<!-- Versión 2, con archivo externo. En el <head>: -->
<!-- <link rel="stylesheet" href="styles.css"> -->
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
<footer>Información de mi empresa</footer>`,
            css: `header { border: 1px solid gray; }
nav    { border: 1px solid red;   height: 30px; }
main   { border: 1px solid blue;  height: 100px; }
footer { border: 1px solid green; height: 30px; }`,
          }),
        },
        {
          title: 'Tabla cebra',
          level: 2,
          prompt: '<p>Dada una tabla de turnos, hacé que: las filas pares tengan fondo gris claro, la fila bajo el mouse se resalte, la cabecera tenga fondo oscuro y texto blanco, y la última columna esté alineada a la derecha. No podés agregar clases al HTML.</p>',
          hints: ['<code>tbody tr:nth-child(even)</code>', '<code>tr:hover</code>', '<code>td:last-child</code>'],
          solution: webSol('<p>Todo sale con pseudo-clases de posición y estado, sin tocar el HTML.</p>', {
            html: `<table>
  <thead><tr><th>Paciente</th><th>Especialidad</th><th>Hora</th></tr></thead>
  <tbody>
    <tr><td>Julián</td><td>Clínica</td><td>08:30</td></tr>
    <tr><td>María</td><td>Cardiología</td><td>09:00</td></tr>
    <tr><td>Lucía</td><td>Pediatría</td><td>09:30</td></tr>
    <tr><td>Tomás</td><td>Neurología</td><td>10:00</td></tr>
  </tbody>
</table>`,
            css: `table { border-collapse: collapse; width: 100%; }
th, td { padding: 8px 12px; text-align: left; }
thead th { background: #1f2a2e; color: white; }
tbody tr:nth-child(even) { background: #eef1f4; }
tbody tr:hover { background: #f5db6b; }
td:last-child, th:last-child { text-align: right; }`,
          }),
        },
      ],
      sources: [
        { title: 'CSS · MDN', url: 'https://developer.mozilla.org/es/docs/Web/CSS', points: ['CSS es un lenguaje de estilos que describe cómo se presenta un documento HTML en pantalla, papel u otros medios.'] },
      ],
    },

    {
      id: 'css-cascada',
      module: 'css',
      title: 'Unidades, cascada, especificidad y herencia',
      keywords: 'unidades px rem em vw vh dvh porcentaje cascada especificidad herencia important variables custom properties',
      tldr: 'Cuando dos reglas pelean por el mismo elemento, CSS decide con tres criterios: la <mark>cascada</mark> (el orden), la <mark>especificidad</mark> (qué tan preciso es el selector) y la <mark>herencia</mark> (qué pasa de padres a hijos).',
      goals: ['Elegir la unidad correcta para cada caso.', 'Predecir qué regla gana y por qué.', 'Usar variables CSS para no repetir valores.'],
      body: `
        <h2>Unidades de medida</h2>
        ${table(['Tipo', 'Unidad', 'Comportamiento', 'Usala para'], [
          ['Absoluta', '<code>px</code>', 'Un punto de pantalla. Fija', 'Bordes, sombras, detalles finos'],
          ['Absoluta', '<code>cm</code> <code>mm</code> <code>in</code>', 'Medidas físicas', 'Hojas de estilo de impresión'],
          ['Relativa', '<code>em</code>', 'Relativa al tamaño de fuente del <strong>padre</strong> (se acumula al anidar)', 'Espaciados que acompañan al texto'],
          ['Relativa', '<code>rem</code>', 'Relativa a la fuente de la <strong>raíz</strong> (<code>html</code>, normalmente 16px)', 'Tamaños de fuente y espaciados en general'],
          ['Relativa', '<code>%</code>', 'Relativa al contenedor padre', 'Anchos fluidos'],
          ['Relativa', '<code>vw</code> / <code>vh</code>', '1% del ancho / alto de la ventana', 'Secciones a pantalla completa'],
          ['Relativa', '<code>dvw</code> / <code>dvh</code>', 'Igual, pero se ajustan cuando aparecen o desaparecen las barras del navegador móvil', '<code>height: 100dvh</code> en layouts móviles (el repo de la cátedra lo usa)'],
        ])}
        ${note('<strong>¿Por qué rem para las fuentes?</strong> Si alguien configuró su navegador con letra más grande por problemas de visión, todo lo que esté en rem crece con esa preferencia. Lo que esté en px la ignora.')}
        ${lab(0)}

        <h2>Cascada: el orden importa</h2>
        <p>Si dos reglas tienen la <strong>misma especificidad</strong>, gana <mark>la última</mark> que leyó el navegador. Por eso el orden en que enlazás los archivos importa: en el repo de la cátedra, <code>style.css</code> va antes que <code>login_style.css</code>, para que lo específico de cada página pise lo general.</p>
        ${code('css', `h1 { color: red; }
h1 { color: blue; }  /* gana: está después */`)}

        <h2>Especificidad: el selector más preciso gana</h2>
        ${table(['Prioridad', 'Tipo', 'Ejemplo'], [
          ['1 · mayor', '<code>!important</code> (sobrescribe todo, excepto en línea con <code>!important</code>)', '<code>color: red !important;</code>'],
          ['2', 'Estilos en línea', '<code>&lt;p style="color: blue;"&gt;</code>'],
          ['3', 'Selector de ID', '<code>#miElemento {}</code>'],
          ['4', 'Clase, atributo, pseudo-clase', '<code>.rojo {}</code>, <code>[type="text"]</code>, <code>:hover</code>'],
          ['5', 'Elemento, pseudo-elemento', '<code>p {}</code>, <code>h1 {}</code>, <code>::after</code>'],
          ['6 · menor', 'Universal y combinadores', '<code>* {}</code>, <code>div p</code>, <code>&gt;</code>'],
        ])}
        <p>Para comparar selectores compuestos se cuentan columnas <strong>(IDs, clases, elementos)</strong> y se compara de izquierda a derecha:</p>
        ${table(['Selector', 'IDs', 'Clases / atributos / pseudo-clases', 'Elementos', 'Puntaje'], [
          ['<code>p</code>', '0', '0', '1', '0-0-1'],
          ['<code>.menu a</code>', '0', '1', '1', '0-1-1'],
          ['<code>nav .menu a:hover</code>', '0', '2', '2', '0-2-2'],
          ['<code>#sidebar a</code>', '1', '0', '1', '1-0-1 · <strong>gana</strong>'],
        ])}
        ${note('<strong>Evitá <code>!important</code>.</strong> Rompe el orden natural y después necesitás otro <code>!important</code> para ganarle. Si lo necesitás, casi siempre es señal de selectores demasiado largos o de usar IDs para estilos.', 'warn')}

        <h2>Herencia</h2>
        <p>Algunas propiedades que le ponés a un padre pasan a sus hijos y otras no. En general se heredan las de <strong>texto</strong> (<code>color</code>, <code>font-family</code>, <code>font-size</code>, <code>line-height</code>, <code>text-align</code>) y no las de <strong>caja</strong> (<code>width</code>, <code>margin</code>, <code>padding</code>, <code>border</code>, <code>background</code>). Por eso alcanza con poner la fuente en el <code>body</code> para que la use toda la página.</p>
        <p>Podés forzarlo con valores especiales: <code>inherit</code> (copiá del padre), <code>initial</code> (volvé al valor por defecto) y <code>unset</code>.</p>
        ${code('css', `button { font: inherit; }  /* los botones NO heredan la fuente por defecto: así sí */`)}
        ${lab(1)}

        <h2>Variables CSS (custom properties)</h2>
        <p>Guardan un valor con nombre para reusarlo. Se declaran con <code>--nombre</code> y se usan con <code>var()</code>. Se heredan como cualquier propiedad, así que si las definís en <code>:root</code> están disponibles en toda la página. Esta guía entera las usa para el modo claro y oscuro.</p>
        ${code('css', `:root {
  --color-marca: #2b4c7e;
  --radio: 8px;
}
.btn { background: var(--color-marca); border-radius: var(--radio); }
.alerta { border: 2px solid var(--color-marca); }

/* Cambiar el valor en un contexto cambia todo lo que lo usa */
.tema-oscuro { --color-marca: #8fb0e6; }`)}
      `,
      labs: [
        {
          title: 'em vs rem',
          html: `
<div class="padre">
  Padre (20px)
  <div class="hijo-em">Hijo con 1.5em</div>
  <div class="hijo-rem">Hijo con 1.5rem</div>
  <div class="padre-anidado">
    Otro padre con 1.5em
    <div class="hijo-em">Nieto con 1.5em: ¡se acumula!</div>
  </div>
</div>`,
          css: `
html { font-size: 16px; }
.padre { font-size: 20px; border: 1px dashed #aab; padding: 8px; }
.hijo-em { font-size: 1.5em; }     /* 1.5 × 20 = 30px */
.hijo-rem { font-size: 1.5rem; }   /* 1.5 × 16 = 24px, siempre */
.padre-anidado { font-size: 1.5em; } /* 30px, y su hijo: 1.5 × 30 = 45px */`,
          hint: 'Cambiá <code>html { font-size }</code> a 20px: lo que está en rem cambia, lo que está en em depende de su padre.',
        },
        {
          title: '¿Quién gana?',
          html: `
<div class="caja">
  <p id="parrafo" class="texto">¿De qué color soy?</p>
  <p>Yo heredo el color y la fuente del div, pero no su borde.</p>
</div>`,
          css: `
.caja { color: #2b4c7e; font-family: Georgia, serif; border: 2px dashed #aab; padding: 12px; }

p { color: green; }          /* elemento: 0-0-1 */
.texto { color: orange; }    /* clase: 0-1-0, le gana a p */
#parrafo { color: crimson; } /* ID: 1-0-0, le gana a la clase */

/* Probá: comentá la regla #parrafo y mirá qué pasa */
/* Después agregá: p { color: purple !important; } */`,
          hint: 'Comentá las reglas de abajo hacia arriba (con <code>/* */</code>) y anotá qué color queda en cada paso. ¿Por qué el segundo párrafo es verde y no azul?',
        },
      ],
      exercises: [
        {
          title: 'Calculá la especificidad',
          level: 2,
          prompt: '<p>Para un <code>&lt;a class="activo"&gt;</code> dentro de <code>&lt;nav id="menu"&gt;&lt;ul class="lista"&gt;&lt;li&gt;</code>, ¿qué color tiene el enlace?</p>' + code('css', `nav ul li a { color: black; }
.lista .activo { color: blue; }
#menu a { color: green; }
a.activo { color: red; }`),
          solution: { explain: '<p>Puntajes: <code>nav ul li a</code> = 0-0-4 · <code>.lista .activo</code> = 0-2-0 · <code>#menu a</code> = 1-0-1 · <code>a.activo</code> = 0-1-1. Gana <code>#menu a</code> por tener un ID: el enlace es <strong>verde</strong>. Las reglas con más elementos nunca le ganan a una clase, y ninguna cantidad de clases le gana a un ID.</p>' },
        },
        {
          title: 'Tema con variables',
          level: 2,
          prompt: '<p>Armá dos botones y una tarjeta que usen las variables <code>--primario</code>, <code>--fondo</code> y <code>--texto</code>. Agregá un botón que, con JavaScript, ponga o saque la clase <code>oscuro</code> en el <code>body</code>, y que esa clase cambie solo los valores de las variables.</p>',
          hints: ['<code>document.body.classList.toggle(\'oscuro\')</code>', 'En <code>.oscuro { }</code> solo redefinís las variables, no cada propiedad.'],
          solution: webSol('<p>Los componentes nunca usan colores fijos, solo variables. Cambiar el tema es redefinir tres variables en un ancestro: todo lo de adentro se actualiza solo.</p>', {
            html: `<button id="tema">Cambiar tema</button>
<div class="tarjeta">
  <h2>Turno confirmado</h2>
  <p>Lunes 20, 9:30 h, Cardiología.</p>
  <button class="btn">Ver detalle</button>
</div>`,
            css: `:root { --primario: #2b4c7e; --fondo: #ffffff; --texto: #1f2a2e; }
.oscuro { --primario: #8fb0e6; --fondo: #1b2128; --texto: #dfe5e8; }

body { background: var(--fondo); color: var(--texto); transition: background .3s; }
.tarjeta { border: 2px solid var(--primario); border-radius: 12px; padding: 16px; margin-top: 12px; }
.btn, #tema { background: var(--primario); color: var(--fondo); border: 0; padding: 8px 14px; border-radius: 8px; font: inherit; }`,
            js: `document.getElementById('tema').addEventListener('click', () => {
  document.body.classList.toggle('oscuro');
});`,
          }),
        },
      ],
      sources: [
        { title: 'Solucionar conflictos (cascada, especificidad, herencia)', url: 'https://developer.mozilla.org/es/docs/Learn_web_development/Core/Styling_basics/Handling_conflicts', points: ['Con igual especificidad, gana la regla que aparece última.', 'Los ID pesan más que las clases, y las clases más que los elementos.', 'Se heredan propiedades como <code>color</code> o <code>font-family</code>; no se heredan <code>width</code> ni <code>margin</code>.', '<code>!important</code> anula la cascada normal; se recomienda evitarlo.'] },
      ],
    },

    {
      id: 'modelo-de-caja',
      module: 'css',
      title: 'El modelo de caja',
      keywords: 'box model caja padding margin border box-sizing border-box display block inline inline-block colapso margenes overflow',
      tldr: 'Para CSS, <mark>todo elemento es una caja</mark> con cuatro capas: contenido, relleno (padding), borde y margen. Entender cómo se suman es la clave para que las cosas midan lo que esperás.',
      goals: ['Dibujar mentalmente las cuatro capas de cualquier elemento.', 'Usar box-sizing: border-box y saber por qué.', 'Controlar display, overflow y el colapso de márgenes.'],
      body: `
        <h2>Las cuatro capas</h2>
        ${table(['Capa', 'Propiedad', 'Qué es'], [
          ['Contenido', '<code>width</code>, <code>height</code>', 'Donde está el texto o las imágenes'],
          ['Relleno', '<code>padding</code>', 'Espacio <strong>adentro</strong> del borde. Toma el color de fondo'],
          ['Borde', '<code>border</code>', 'La línea que rodea al relleno'],
          ['Margen', '<code>margin</code>', 'Espacio <strong>afuera</strong> del borde, que separa de otros elementos. Siempre transparente'],
        ])}
        ${code('css', `.caja {
  width: 350px;
  padding: 25px;          /* los 4 lados */
  border: 5px solid black;
  margin: 10px;
}
/* Atajos: 1 valor = todos · 2 = vertical horizontal · 4 = arriba derecha abajo izquierda (como el reloj) */
.otra { margin: 0 auto; padding: 8px 16px 12px 16px; }`)}

        <h2>El problema del ancho</h2>
        <p>En el modelo <strong>estándar</strong>, <code>width</code> mide solo el contenido. La caja de arriba ocupa en realidad <code>350 + 25×2 + 5×2 = 410px</code>. Esto vuelve loco a cualquiera que quiera que dos columnas de 50% entren lado a lado con padding.</p>
        <p>La solución es el modelo <strong>alternativo</strong>: con <code>box-sizing: border-box</code>, el <code>width</code> incluye padding y borde. La caja mide 350px y el contenido se achica para hacer lugar. Casi todos los proyectos lo activan para todo:</p>
        ${code('css', `*, *::before, *::after { box-sizing: border-box; }`)}
        ${lab(0)}

        <h2>display: cómo se comporta la caja</h2>
        ${table(['Valor', 'Comportamiento', 'width/height', 'Ejemplo típico'], [
          ['<code>block</code>', 'Ocupa todo el ancho y empieza en una línea nueva', 'Sí', '<code>div</code>, <code>p</code>, <code>h1</code>'],
          ['<code>inline</code>', 'Fluye con el texto. Ignora ancho, alto y márgenes verticales', 'No', '<code>span</code>, <code>a</code>, <code>strong</code>'],
          ['<code>inline-block</code>', 'Fluye con el texto pero respeta ancho, alto y espaciados', 'Sí', 'Botones, badges'],
          ['<code>none</code>', 'Desaparece: no ocupa lugar', '–', 'Ocultar el menú móvil'],
          ['<code>flex</code> / <code>grid</code>', 'Organiza a sus hijos (próximas lecciones)', 'Sí', 'Layouts'],
        ])}
        ${note('<strong>display: none vs. visibility: hidden.</strong> El primero saca el elemento del flujo (los demás ocupan su lugar). El segundo lo vuelve invisible pero sigue ocupando el espacio.')}

        <h2>Colapso de márgenes</h2>
        <p>Cuando dos márgenes <strong>verticales</strong> se tocan, no se suman: queda el más grande. Un párrafo con <code>margin-bottom: 20px</code> seguido de otro con <code>margin-top: 30px</code> quedan separados por 30px, no por 50. No pasa con los márgenes horizontales ni dentro de contenedores flex o grid.</p>

        <h2>Centrar y desbordes</h2>
        ${code('css', `.contenedor {
  max-width: 960px;   /* nunca más ancho que esto… */
  margin: 0 auto;     /* …y centrado horizontalmente */
  padding: 0 16px;    /* aire en los costados en el celular */
}
.recuadro {
  height: 120px;
  overflow: auto;     /* si el contenido no entra: barra de scroll (también hidden, scroll, visible) */
}
img { max-width: 100%; height: auto; }  /* imágenes que nunca desbordan */`)}
        ${lab(1)}
      `,
      labs: [
        {
          title: 'content-box vs border-box',
          html: `
<div class="caja estandar">content-box: width 200px</div>
<div class="caja alternativa">border-box: width 200px</div>
<p>Abrí DevTools e inspeccioná cada caja para ver el box model.</p>`,
          css: `
.caja {
  width: 200px;
  padding: 20px;
  border: 8px solid #2b4c7e;
  margin: 12px 0;
  background: #f5db6b;
}
.estandar { box-sizing: content-box; }   /* mide 200 + 40 + 16 = 256px */
.alternativa { box-sizing: border-box; } /* mide 200px justos */`,
          hint: 'Aumentá el padding a 40px: la caja estándar crece, la border-box se mantiene en 200px y achica el contenido.',
        },
        {
          title: 'block, inline e inline-block',
          html: `
<p>Texto con <span class="inline">un span inline</span> y
<span class="iblock">un inline-block</span> en el medio del renglón.</p>
<div class="block">Un div block</div>
<div class="block oculto">No me ves (display: none)</div>
<div class="block invisible">Ocupo lugar pero no me ves</div>
<div class="block">Último div</div>`,
          css: `
span, div { background: #dfe6f1; border: 2px solid #2b4c7e; }
.inline  { width: 200px; padding: 10px; margin: 20px; }  /* width y margen vertical: ignorados */
.iblock  { display: inline-block; width: 140px; padding: 10px; }
.block   { width: 60%; margin: 6px 0; padding: 6px; }
.oculto  { display: none; }
.invisible { visibility: hidden; }`,
          hint: 'Cambiá <code>.inline</code> a <code>display: block</code> y fijate cómo rompe la línea de texto.',
        },
      ],
      exercises: [
        {
          title: '¿Cuánto mide?',
          level: 1,
          prompt: '<p>Un div tiene <code>width: 300px; padding: 10px 20px; border: 2px solid; margin: 15px;</code>. (a) ¿Cuánto mide de ancho visible (borde incluido) con el modelo estándar? (b) ¿Y con <code>border-box</code>? (c) ¿Cuánto espacio horizontal total ocupa en la página en cada caso?</p>',
          solution: { explain: '<p>(a) Estándar: 300 + 20×2 + 2×2 = <strong>344px</strong>. (b) border-box: <strong>300px</strong> (el contenido queda en 300 − 40 − 4 = 256px). (c) Sumando el margen de 15px por lado: 374px en el estándar y 330px en border-box.</p>' },
        },
        {
          title: 'Dos columnas que entren',
          level: 2,
          prompt: '<p>Tenés dos <code>div</code> con <code>display: inline-block; width: 50%; padding: 16px; border: 1px solid;</code> dentro de un contenedor, y el segundo baja a otra línea. Explicá por qué y corregilo sin cambiar el 50%.</p>',
          hints: ['¿Cuánto mide cada div con el modelo estándar?', 'Los inline-block también dejan un espacio entre ellos por el salto de línea del HTML.'],
          solution: webSol('<p>Con content-box, cada div mide 50% + 34px, así que no entran dos. Con <code>box-sizing: border-box</code> miden exactamente 50%. Además, el espacio en blanco entre los dos <code>inline-block</code> en el HTML también ocupa lugar; la forma moderna de evitar todo esto es usar <code>display: flex</code> en el contenedor.</p>', {
            html: `<div class="contenedor">
  <div class="col">Columna 1</div>
  <div class="col">Columna 2</div>
</div>`,
            css: `.contenedor { display: flex; }   /* evita el espacio fantasma entre inline-blocks */
.col {
  box-sizing: border-box;          /* el 50% incluye padding y borde */
  width: 50%;
  padding: 16px;
  border: 1px solid #2b4c7e;
}`,
          }),
        },
      ],
      sources: [
        { title: 'El modelo de caja · MDN', url: 'https://developer.mozilla.org/es/docs/Learn_web_development/Core/Styling_basics/Box_model', points: ['Todo en CSS es una caja: de bloque (todo el ancho, línea nueva) o en línea (ignoran ancho y alto).', 'Capas: contenido, <code>padding</code>, <code>border</code> y <code>margin</code>.', 'Modelo estándar: el ancho es solo el contenido. Alternativo (<code>box-sizing: border-box</code>): incluye relleno y borde.', 'Los márgenes verticales adyacentes colapsan.', '<code>inline-block</code> respeta ancho, alto y espaciados sin saltar de línea.'] },
      ],
    },

    {
      id: 'flexbox',
      module: 'css',
      title: 'Flexbox: alinear en una dimensión',
      keywords: 'flexbox flex justify-content align-items gap direction wrap grow shrink basis order centrar',
      tldr: 'Flexbox organiza elementos en <mark>una fila o una columna</mark> y reparte el espacio entre ellos. Es la herramienta para centrar, alinear y distribuir.',
      goals: ['Activar flex y entender los dos ejes.', 'Alinear y distribuir con justify-content, align-items y gap.', 'Controlar cuánto crece o se encoge cada ítem.'],
      body: `
        <h2>Contenedor e ítems</h2>
        <p>Le das <code>display: flex</code> al <strong>contenedor</strong> y sus <strong>hijos directos</strong> pasan a ser ítems flex: se ponen en fila automáticamente. Los nietos no se ven afectados (salvo que su padre también sea flex).</p>
        <p>Todo gira alrededor de dos ejes:</p>
        <ul>
          <li><mark>Eje principal</mark> (main axis): la dirección de <code>flex-direction</code>. Horizontal con <code>row</code> (por defecto), vertical con <code>column</code>. Se alinea con <code>justify-content</code>.</li>
          <li><mark>Eje cruzado</mark> (cross axis): el perpendicular. Se alinea con <code>align-items</code>.</li>
        </ul>
        ${note('<strong>El error más común:</strong> cambiar a <code>flex-direction: column</code> y esperar que <code>justify-content: center</code> centre horizontalmente. Ahora el eje principal es vertical: para centrar en horizontal necesitás <code>align-items</code>.')}

        <h2>Propiedades del contenedor</h2>
        ${table(['Propiedad', 'Valores', 'Qué hace'], [
          ['<code>flex-direction</code>', '<code>row</code> · <code>column</code> · <code>row-reverse</code> · <code>column-reverse</code>', 'Dirección del eje principal'],
          ['<code>justify-content</code>', '<code>flex-start</code> · <code>center</code> · <code>flex-end</code> · <code>space-between</code> · <code>space-around</code> · <code>space-evenly</code>', 'Distribución en el eje principal'],
          ['<code>align-items</code>', '<code>stretch</code> (por defecto) · <code>center</code> · <code>flex-start</code> · <code>flex-end</code> · <code>baseline</code>', 'Alineación en el eje cruzado'],
          ['<code>gap</code>', '<code>16px</code>, <code>1rem 2rem</code>', 'Espacio entre ítems (mejor que usar márgenes)'],
          ['<code>flex-wrap</code>', '<code>nowrap</code> · <code>wrap</code>', 'Si los ítems no entran, ¿bajan de línea o se aprietan?'],
        ])}

        <h2>Propiedades de los ítems</h2>
        ${table(['Propiedad', 'Qué hace', 'Ejemplo'], [
          ['<code>flex-grow</code>', 'Cuánto crece para ocupar espacio sobrante (proporción)', '<code>flex-grow: 1</code>'],
          ['<code>flex-shrink</code>', 'Cuánto se encoge si falta espacio (0 = nunca)', '<code>flex-shrink: 0</code> en un logo'],
          ['<code>flex-basis</code>', 'Tamaño inicial antes de repartir', '<code>flex-basis: 200px</code>'],
          ['<code>flex</code>', 'Atajo de los tres', '<code>flex: 1</code> = “repartite el espacio en partes iguales”'],
          ['<code>align-self</code>', 'Alineación propia en el eje cruzado', '<code>align-self: flex-end</code>'],
          ['<code>order</code>', 'Cambia el orden visual sin tocar el HTML', '<code>order: -1</code> lo manda primero'],
        ])}
        ${lab(0)}

        <h2>Recetas que vas a usar siempre</h2>
        ${code('css', `/* 1. Centrar algo en ambos ejes */
.centro { display: flex; justify-content: center; align-items: center; min-height: 100dvh; }

/* 2. Header: logo a la izquierda, acciones a la derecha (como el del TPI) */
header { display: flex; align-items: center; justify-content: space-between; padding: 0 1rem; }

/* 3. Empujar un ítem al final */
.logo { margin-right: auto; }

/* 4. Tarjetas que bajan de línea cuando no entran */
.cards { display: flex; flex-wrap: wrap; gap: 16px; }
.card { flex: 1 1 220px; }  /* crece, se encoge, base 220px */

/* 5. Formulario en columna con separación pareja (como el login del TPI) */
form { display: flex; flex-direction: column; gap: 1rem; }`)}
        ${lab(1)}
      `,
      labs: [
        {
          title: 'El tablero de Flexbox',
          html: `
<div class="controles">
  <label>flex-direction
    <select data-prop="flexDirection"><option>row</option><option>column</option><option>row-reverse</option></select>
  </label>
  <label>justify-content
    <select data-prop="justifyContent"><option>flex-start</option><option>center</option><option>flex-end</option><option>space-between</option><option>space-around</option><option>space-evenly</option></select>
  </label>
  <label>align-items
    <select data-prop="alignItems"><option>stretch</option><option>center</option><option>flex-start</option><option>flex-end</option></select>
  </label>
  <label>flex-wrap
    <select data-prop="flexWrap"><option>nowrap</option><option>wrap</option></select>
  </label>
</div>
<div id="flex" class="flex">
  <div>1</div><div class="alto">2</div><div>3</div><div>4</div>
</div>
<code id="css"></code>`,
          css: `
.controles { display:grid; grid-template-columns:repeat(2,1fr); gap:6px; font-size:.85rem; margin-bottom:10px; }
.controles select { display:block; width:100%; }
.flex { display:flex; gap:8px; height:180px; padding:8px; background:#f2f4f1; border:2px dashed #aab; border-radius:8px; }
.flex > div { width:60px; background:#2b4c7e; color:white; display:grid; place-items:center; border-radius:6px; font-weight:bold; }
.flex > .alto { padding:30px 0; }
#css { display:block; margin-top:8px; font-size:.8rem; }`,
          js: `
const caja = document.getElementById('flex');
document.querySelectorAll('select').forEach(sel => {
  sel.addEventListener('change', () => {
    caja.style[sel.dataset.prop] = sel.value;
    document.getElementById('css').textContent = 'display:flex; ' + caja.style.cssText;
  });
});`,
          hint: 'Poné <code>column</code> y después probá <code>justify-content: center</code>: ¿se centra en horizontal o en vertical? Agregá más divs y activá <code>wrap</code>.',
        },
        {
          title: 'Una navbar y tarjetas con Flexbox',
          html: `
<nav class="nav">
  <strong class="logo">MiClínica</strong>
  <a href="#">Panel</a>
  <a href="#">Doctores</a>
  <a href="#">Especialidades</a>
  <button>Salir</button>
</nav>

<div class="cards">
  <div class="card">Uno</div>
  <div class="card">Dos</div>
  <div class="card grow">Tres (flex: 2)</div>
</div>`,
          css: `
.nav {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: #1f2a2e;
  border-radius: 10px;
}
.nav a { color: #dfe6f1; text-decoration: none; }
.logo { color: #f5db6b; margin-right: auto; } /* empuja el resto a la derecha */

.cards { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 16px; }
.card { flex: 1 1 120px; padding: 24px; background: #dfe6f1; border-radius: 10px; text-align: center; }
.grow { flex-grow: 2; }`,
          hint: 'Sacá <code>margin-right: auto</code> del logo y probá <code>justify-content: space-between</code> en <code>.nav</code>. Achicá la ventana para ver el wrap.',
        },
      ],
      exercises: [
        {
          title: 'Centrá la tarjeta de login',
          level: 1,
          prompt: '<p>Hacé que un formulario de login quede centrado vertical y horizontalmente en toda la pantalla, con los campos en columna separados por 1rem.</p>',
          solution: webSol('<p>Dos contenedores flex: el de afuera centra (en ambos ejes), el form apila sus campos en columna con <code>gap</code>. Es exactamente lo que hace <code>login_style.css</code> en el repo de la cátedra.</p>', {
            html: `<div class="login-container">
  <form>
    <label for="u">Usuario</label>
    <input id="u" required>
    <label for="p">Contraseña</label>
    <input id="p" type="password" required>
    <button>Iniciar sesión</button>
  </form>
</div>`,
            css: `body { margin: 0; }
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f0f0f0;
}
.login-container form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 300px;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}`,
          }),
        },
        {
          title: 'Barra de herramientas de la tabla',
          level: 2,
          prompt: '<p>Arriba de una tabla de pacientes armá una barra con: a la izquierda un título; a la derecha un buscador (input + botón) y un botón “Nuevo paciente”. En pantallas angostas los elementos deben bajar de línea sin desbordar.</p>',
          hints: ['Contenedor con <code>display: flex; flex-wrap: wrap; align-items: center; gap</code>.', '<code>margin-right: auto</code> en el título empuja todo lo demás.'],
          solution: webSol('<p>El título empuja el resto con <code>margin-right: auto</code>. El buscador es un flex anidado para que input y botón queden pegados. Con <code>flex-wrap</code> todo baja de línea si no entra.</p>', {
            html: `<div class="toolbar">
  <h2>Pacientes</h2>
  <div class="buscador">
    <input placeholder="Buscar por nombre">
    <button>Buscar</button>
  </div>
  <button class="primario">Nuevo paciente</button>
</div>`,
            css: `.toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
.toolbar h2 { margin: 0 auto 0 0; }
.buscador { display: flex; }
.buscador input { min-width: 0; padding: 6px 8px; }
button { padding: 6px 12px; }
.primario { background: #2b4c7e; color: white; border: 0; border-radius: 6px; }`,
          }),
        },
      ],
      sources: [
        { title: 'Flexbox · MDN', url: 'https://developer.mozilla.org/es/docs/Learn_web_development/Core/CSS_layout/Flexbox', points: ['Método de diseño unidimensional: filas o columnas.', 'Con <code>display: flex</code> el padre es contenedor y sus hijos ítems flexibles.', 'Dos ejes: principal y transversal.', '<code>flex-wrap</code> permite bajar de línea; <code>flex</code> controla la proporción de espacio.', '<code>align-items</code> alinea en el eje transversal y <code>justify-content</code> en el principal.', '<code>order</code> cambia el orden visual sin tocar el HTML.'] },
      ],
    },

    {
      id: 'grid',
      module: 'css',
      title: 'Grid: layouts en dos dimensiones',
      keywords: 'grid template columns rows areas fr repeat minmax auto-fit layout flexbox vs grid',
      tldr: 'Grid organiza en <mark>filas y columnas a la vez</mark>. Es ideal para el layout completo de una página: header, sidebar, contenido y footer.',
      goals: ['Definir una grilla con columnas, filas y la unidad fr.', 'Ubicar elementos con líneas y con áreas con nombre.', 'Elegir entre Grid y Flexbox.'],
      body: `
        <h2>Lo esencial</h2>
        ${code('css', `.contenedor {
  display: grid;
  grid-template-columns: 200px 1fr 1fr;  /* 3 columnas: fija + dos flexibles iguales */
  grid-template-rows: auto 1fr auto;     /* 3 filas */
  gap: 16px;                             /* espacio entre celdas */
}`)}
        <ul>
          <li><code>grid-template-columns</code> y <code>grid-template-rows</code> definen la cuadrícula. Podés usar px, %, <code>auto</code> y la unidad <mark>fr</mark>.</li>
          <li><code>fr</code> (fracción) reparte el espacio <strong>sobrante</strong>: <code>2fr 1fr 1fr</code> = la primera columna mide el doble que las otras.</li>
          <li><code>repeat(4, 1fr)</code> es un atajo para <code>1fr 1fr 1fr 1fr</code>.</li>
          <li><code>minmax(200px, 1fr)</code>: nunca menos de 200px, como mucho 1fr.</li>
        </ul>

        <h2>Ubicar elementos</h2>
        <h3>Por líneas</h3>
        <p>Las líneas de la grilla se numeran desde 1. Un elemento puede abarcar varias celdas:</p>
        ${code('css', `header { grid-column: 1 / 4; }     /* de la línea 1 a la 4: las 3 columnas */
header { grid-column: 1 / -1; }    /* -1 = la última línea, más cómodo */
.destacado { grid-column: span 2; grid-row: span 2; }  /* ocupa 2×2 */`)}
        <h3>Por áreas con nombre</h3>
        <p>La forma más legible: dibujás el layout con texto. Es lo que usa el <code>dashboard_style.css</code> de la cátedra.</p>
        ${code('css', `.dashboard-container {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header"
    "nav    main"
    "footer footer";
  height: 100dvh;
}
header { grid-area: header; }
nav    { grid-area: nav; }
main   { grid-area: main; }
footer { grid-area: footer; }`)}
        ${lab(0)}

        <h2>Grillas automáticas</h2>
        <p>Una combinación mágica para galerías y listados de tarjetas: tantas columnas como entren, cada una de al menos 180px, sin una sola media query.</p>
        ${code('css', `.galeria {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}`)}
        ${lab(1)}

        <h2>¿Flexbox o Grid?</h2>
        ${table(['', 'Flexbox (1D)', 'Grid (2D)'], [
          ['Dimensión', 'Una: fila o columna', 'Dos: filas y columnas'],
          ['Uso ideal', 'Distribuir y alinear elementos en línea', 'Crear estructuras completas de página'],
          ['Ejes', 'Principal + cruzado', 'Filas + columnas'],
          ['Facilidad', 'Rápido para centrar y alinear', 'Mejor para layouts complejos'],
          ['Ejemplo típico', 'Navbar, botones, cards', 'Página con header, sidebar, contenido y footer'],
        ])}
        <ul>
          <li><strong>Flexbox</strong> → cuando trabajás con un grupo de elementos en fila o columna (menús, tarjetas, botones). El contenido manda.</li>
          <li><strong>Grid</strong> → cuando necesitás un layout completo y estructurado. La grilla manda.</li>
        </ul>
        ${note('<strong>Regla práctica:</strong> Grid para el esqueleto de la página, Flexbox para acomodar cosas adentro de cada parte. El dashboard de la cátedra hace exactamente eso: grid en <code>.dashboard-container</code> y flex dentro del <code>header</code>.')}
      `,
      labs: [
        {
          title: 'Layout de dashboard con áreas',
          html: `
<div class="pagina">
  <header>Header</header>
  <nav>Nav (200px)</nav>
  <main>Main: el contenido principal ocupa el resto</main>
  <aside>Aside</aside>
  <footer>Footer</footer>
</div>`,
          css: `
.pagina {
  display: grid;
  grid-template-columns: 200px 1fr 150px;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header header"
    "nav    main   aside"
    "footer footer footer";
  gap: 8px;
  min-height: 280px;
}
header { grid-area: header; }
nav    { grid-area: nav; }
main   { grid-area: main; }
aside  { grid-area: aside; }
footer { grid-area: footer; }

.pagina > * { background: #dfe6f1; padding: 12px; border-radius: 8px; }
header, footer { background: #1f2a2e; color: white; }`,
          hint: 'Redibujá el layout cambiando solo las áreas: por ejemplo, que el aside ocupe también la fila del footer (<code>"footer footer aside"</code>).',
        },
        {
          title: 'Galería automática',
          html: `
<div class="galeria">
  <div class="item">Cardiología</div>
  <div class="item destacado">Pediatría (span 2)</div>
  <div class="item">Neurología</div>
  <div class="item">Dermatología</div>
  <div class="item">Traumatología</div>
  <div class="item">Oftalmología</div>
  <div class="item">Clínica</div>
</div>`,
          css: `
.galeria {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
}
.item { background: #2b4c7e; color: white; padding: 28px 10px; border-radius: 10px; text-align: center; }
.destacado { grid-column: span 2; background: #f5db6b; color: #1f2a2e; }`,
          hint: 'Achicá la ventana: las columnas se reacomodan solas. Cambiá <code>auto-fit</code> por <code>auto-fill</code> con pocos ítems para ver la diferencia.',
        },
      ],
      exercises: [
        {
          title: 'Grilla de calendario',
          level: 2,
          prompt: '<p>Armá un calendario semanal: 7 columnas iguales con los nombres de los días como cabecera, y debajo 5 filas de turnos. Un turno especial (“Cirugía”) debe ocupar dos días seguidos.</p>',
          hints: ['<code>grid-template-columns: repeat(7, 1fr)</code>', 'Para el turno largo: <code>grid-column: span 2</code>.'],
          solution: webSol('<p>Una sola grilla de 7 columnas: los primeros 7 hijos son la cabecera y el resto se acomoda solo. El turno largo usa <code>span 2</code>.</p>', {
            html: `<div class="semana">
  <b>Lun</b><b>Mar</b><b>Mié</b><b>Jue</b><b>Vie</b><b>Sáb</b><b>Dom</b>
  <div>08:00</div><div>Clínica</div><div class="cirugia">Cirugía</div><div></div><div>Clínica</div><div></div>
  <div>09:00</div><div></div><div>Pediatría</div><div></div><div></div><div>Guardia</div><div></div>
</div>`,
            css: `.semana { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
.semana > * { padding: 8px 4px; text-align: center; background: #f2f4f1; border-radius: 4px; font-size: .85rem; }
.semana b { background: #1f2a2e; color: white; }
.cirugia { grid-column: span 2; background: #f5db6b; }`,
          }),
        },
        {
          title: 'Layout “santo grial”',
          level: 2,
          prompt: '<p>Hacé el layout clásico: header y footer de ancho completo; en el medio nav (180px), main (flexible) y aside (200px). El footer debe quedar siempre abajo aunque haya poco contenido.</p>',
          solution: webSol('<p>Con <code>grid-template-rows: auto 1fr auto</code> y <code>min-height: 100vh</code>, la fila del medio absorbe todo el alto sobrante y empuja el footer al fondo.</p>', {
            html: `<div class="layout">
  <header>Header</header>
  <nav>Nav</nav>
  <main>Poco contenido…</main>
  <aside>Aside</aside>
  <footer>Footer siempre abajo</footer>
</div>`,
            css: `body { margin: 0; }
.layout {
  display: grid;
  min-height: 100vh;
  grid-template-columns: 180px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  grid-template-areas: "header header header" "nav main aside" "footer footer footer";
}
header { grid-area: header; } nav { grid-area: nav; } main { grid-area: main; }
aside { grid-area: aside; } footer { grid-area: footer; }
.layout > * { padding: 12px; border: 1px solid #c9d0c9; }`,
          }),
        },
      ],
      sources: [
        { title: 'Cuadrículas · MDN', url: 'https://developer.mozilla.org/es/docs/Learn_web_development/Core/CSS_layout/Grids', points: ['Método de diseño bidimensional: filas y columnas.', 'Se activa con <code>display: grid</code>.', 'Columnas y filas con longitudes, porcentajes o la unidad <code>fr</code>.', '<code>gap</code> crea espacios entre celdas.', 'Se posiciona por líneas o con áreas nombradas (<code>grid-template-areas</code>).'] },
      ],
    },

    {
      id: 'responsive',
      module: 'css',
      title: 'Responsive, media queries y position',
      keywords: 'responsive media queries mobile first viewport breakpoint position sticky fixed absolute relative z-index imagenes',
      tldr: 'Diseño responsive = una misma página que <mark>se adapta a cualquier pantalla</mark>. Se logra con layouts fluidos, imágenes flexibles y media queries, empezando por el celular.',
      goals: ['Aplicar los tres fundamentos del diseño responsive.', 'Escribir media queries con enfoque mobile first.', 'Usar position para menús fijos, superposiciones y el sidebar móvil del TPI.', 'Resolver el Ejercicio 20.'],
      body: `
        <h2>Los tres fundamentos</h2>
        <ol>
          <li><mark>Diseño fluido</mark>: usá unidades relativas (<code>%</code>, <code>em</code>, <code>rem</code>, <code>vw</code>, <code>vh</code>) en vez de valores fijos en px. Ej.: <code>width: 80%</code> en lugar de <code>width: 600px</code>.</li>
          <li><mark>Imágenes y contenido flexibles</mark>: <code>max-width: 100%</code> para que las imágenes nunca rompan el diseño. Videos y otros elementos multimedia también se adaptan a su contenedor.</li>
          <li><mark>Media queries</mark>: estilos distintos según el tamaño de la pantalla o las características del dispositivo. Ej.: un menú horizontal en escritorio que en celular se vuelve desplegable.</li>
        </ol>

        <h2>La metaetiqueta viewport</h2>
        <p>Sin ella, el celular simula una pantalla de escritorio de unos 980px y achica todo: tu media query para móviles nunca se activa. Le indica al navegador que el ancho de la ventana es el ancho real del dispositivo y que la escala inicial es 100%. <strong>Siempre</strong> va en el <code>&lt;head&gt;</code>:</p>
        ${code('html', '<meta name="viewport" content="width=device-width, initial-scale=1" />')}

        <h2>Media queries</h2>
        <p>Permiten aplicar reglas solo cuando se cumple una condición. Tienen tres partes: un <strong>tipo de medio</strong> (para qué medio es), una <strong>expresión</strong> (la condición que tiene que cumplirse) y las <strong>reglas</strong> que se aplican si se cumple.</p>
        ${code('css', `@media screen and (min-width: 600px) {
  .dashboard-container { grid-template-columns: 200px 1fr; }
}`)}
        ${table(['Tipo de medio', 'Cuándo aplica', 'Ejemplo'], [
          ['<code>all</code>', 'Por defecto, todos los dispositivos. No hace falta escribirlo', '<code>@media all and (max-width: 768px) { … }</code>'],
          ['<code>print</code>', 'Al imprimir o en la vista previa de impresión', '<code>@media print { body { font-size: 12pt; } }</code>'],
          ['<code>screen</code>', 'Pantallas: computadoras, celulares, tablets, TVs. El más usado', '<code>@media screen and (max-width: 600px) { … }</code>'],
        ])}
        <p>Otras condiciones útiles: <code>orientation: landscape</code>, <code>prefers-color-scheme: dark</code> (el usuario usa modo oscuro), <code>prefers-reduced-motion: reduce</code> (pidió menos animaciones) y <code>hover: none</code> (pantalla táctil).</p>
        ${note('<strong>¿Dónde poner los breakpoints?</strong> No en “el ancho del iPhone”: ponelos donde <em>tu contenido</em> se empieza a ver mal. Achicá la ventana hasta que algo se rompa, y ahí va un breakpoint. La cátedra usa 600px.')}

        <h2>Mobile first</h2>
        <p>Es un enfoque centrado en crear primero la experiencia para dispositivos móviles. Escribís los estilos base para <mark>pantallas chicas</mark> (sin media query) y vas agregando complejidad con <code>min-width</code> a medida que la pantalla crece. Ventajas: el celular carga solo lo necesario, y pensar primero en poco espacio te obliga a priorizar lo importante.</p>
        ${code('css', `/* Base: móvil (una columna) */
.layout { display: grid; grid-template-areas: "header" "main" "footer"; }

/* Desde 600px: escritorio */
@media (min-width: 600px) {
  .layout {
    grid-template-columns: 200px 1fr;
    grid-template-areas: "header header" "nav main" "footer footer";
  }
}`)}
        ${lab(0)}

        <h2>La propiedad position</h2>
        <p>Define cómo se posiciona un elemento. Sirve para alterar el flujo normal: superponer elementos, fijar menús o maquetar interfaces complejas. Se complementa con <code>top</code>, <code>right</code>, <code>bottom</code>, <code>left</code> y <code>z-index</code>.</p>
        ${table(['Valor', 'Comportamiento', 'Uso típico'], [
          ['<code>static</code>', 'Por defecto: sigue el flujo normal. top/left no tienen efecto', '–'],
          ['<code>relative</code>', 'Se desplaza respecto de su posición original, sin mover a los demás. Además sirve de referencia para sus hijos absolute', 'Contenedor de un badge'],
          ['<code>absolute</code>', 'Sale del flujo y se ubica respecto del <strong>ancestro posicionado más cercano</strong> (o de la página si no hay)', 'Badge en una esquina, sidebar móvil'],
          ['<code>fixed</code>', 'Fijo respecto de la ventana: no se mueve al hacer scroll', 'Botón flotante, header fijo'],
          ['<code>sticky</code>', 'Relativo hasta que el scroll llega a un umbral; ahí queda pegado', 'Cabecera de tabla, índice lateral'],
        ])}
        <p><code>z-index</code> decide quién queda encima cuando dos elementos posicionados se superponen: mayor número, más arriba.</p>
        ${note('<strong>Así funciona el sidebar móvil del TPI:</strong> en celular, el <code>nav</code> tiene <code>position: absolute; left: -200px</code> (escondido fuera de la pantalla). Al tocar el botón ☰, JavaScript agrega una clase que lo pone en <code>left: 0</code>. Desde 600px vuelve a <code>position: static</code> y ocupa su lugar en la grilla.')}
        ${lab(1)}
      `,
      labs: [
        {
          title: 'Dashboard del TPI, mobile first',
          html: `
<div class="dashboard-container">
  <header>
    <span>Gestor de turnos</span>
    <div><button class="menu">&#9776;</button><button>Cerrar Sesión</button></div>
  </header>
  <nav id="sidebar"><ul><li><a href="#">Panel</a></li><li><a href="#">Pacientes</a></li></ul></nav>
  <main>
    <h1>Pacientes</h1>
    <p>En pantallas angostas el nav está escondido a la izquierda. Desde 600px aparece al costado.</p>
  </main>
  <footer>Mi Aplicación &copy; 2026</footer>
</div>`,
          css: `
/* Estilos de dashboard_style.css del repo de la cátedra */
body { margin: 0; }
.dashboard-container {
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto 1fr auto;
  grid-template-areas: "header" "main" "footer";
  height: 100dvh;
}
.dashboard-container nav {
  position: absolute; top: 0; bottom: 0;
  width: 200px; background-color: #f4f4f4;
  left: -200px;
}
.dashboard-container nav ul { list-style: none; padding: 0; margin: 0; }
.dashboard-container nav ul li { padding: 1rem; border-bottom: 1px solid #ddd; }
.dashboard-container header {
  grid-area: header; height: 50px; background-color: #333; color: white;
  display: flex; align-items: center; justify-content: space-between; padding: 0 1rem;
}
.dashboard-container header div { display: flex; align-items: center; gap: 1rem; }
.dashboard-container main { grid-area: main; padding: 1rem; overflow-y: auto; }
.dashboard-container footer { grid-area: footer; background-color: #333; color: white; text-align: center; padding: 1rem; }

@media screen and (min-width: 600px) {
  .dashboard-container {
    grid-template-columns: 200px 1fr;
    grid-template-areas: "header header" "nav main" "footer footer";
  }
  .dashboard-container nav { grid-area: nav; position: static; left: 0; height: auto; }
  .dashboard-container header div .menu { display: none; }
}`,
          hint: 'Achicá la ventana del navegador por debajo de ~1100px para que el resultado quede debajo del código y se vea en modo celular. El botón ☰ todavía no hace nada: eso es el Ejercicio 22.',
        },
        {
          title: 'Los cinco position',
          html: `
<div class="tarjeta">
  Tarjeta (position: relative)
  <span class="badge">3</span>
</div>
<div class="desplazado">relative con top: 10px; left: 20px</div>
<div class="sticky">sticky: hacé scroll</div>
<p style="height:400px">Contenido largo para poder hacer scroll…</p>
<button class="flotante">+</button>`,
          css: `
.tarjeta { position: relative; padding: 20px; margin: 20px 0; background: #dfe6f1; border-radius: 10px; }
.badge {
  position: absolute; top: -8px; right: -8px;
  width: 26px; height: 26px; border-radius: 50%;
  display: grid; place-items: center;
  background: crimson; color: white; font-weight: bold;
}
.desplazado { position: relative; top: 10px; left: 20px; background: #f5db6b; padding: 8px; }
.sticky { position: sticky; top: 0; z-index: 1; background: #1f2a2e; color: white; padding: 8px; margin-top: 24px; }
.flotante {
  position: fixed; bottom: 16px; right: 16px; z-index: 2;
  width: 48px; height: 48px; border-radius: 50%; border: 0;
  background: #2b4c7e; color: white; font-size: 1.5rem;
}`,
          hint: 'Sacá <code>position: relative</code> de la tarjeta: el badge se va a la esquina de la página, porque ya no tiene un ancestro posicionado.',
        },
      ],
      exercises: [
        {
          official: '#20',
          title: 'Login y dashboard con Grid',
          level: 2,
          prompt: `<ul>
            <li>Creá dos páginas: <code>login.html</code> y <code>dashboard.html</code>.</li>
            <li><code>login.html</code> tiene un form con usuario y contraseña requeridos, y un botón que redirecciona a <code>dashboard.html</code>.</li>
            <li>En <code>login.html</code>, versión mobile, el form ocupa toda la pantalla para que sea fácil de leer. En escritorio ocupa el centro.</li>
            <li>En <code>dashboard.html</code>, versión mobile, solo hay header, main y footer. En escritorio el layout tiene header, nav, main y footer, con nav y main lado a lado y el nav de 200px. Usá Grid.</li>
          </ul>`,
          hints: ['Para redireccionar sin JS podés usar <code>&lt;form action="dashboard.html"&gt;</code>: al enviarse válido, navega.', 'Mobile first: primero sin media query, después <code>@media (min-width: 600px)</code>.'],
          solution: webSol('<p>Esta solución sigue los estilos del TPI (los de <code>login_style.css</code> y <code>dashboard_style.css</code> del repo de la cátedra). El login es flex en columna a pantalla completa y, desde 600px, centra el form con 400px de ancho. El dashboard es una grilla de una columna que, desde 600px, pasa a dos con áreas con nombre. El <code>action</code> del form hace la redirección cuando los campos son válidos.</p><p>Abajo: el login. El dashboard es el del laboratorio “Dashboard del TPI” de esta misma lección.</p>', {
            html: `<!-- login.html -->
<div class="login-container">
  <form action="dashboard.html">
    <label for="username">Usuario:</label>
    <input type="text" id="username" name="username" required>
    <label for="password">Contraseña:</label>
    <input type="password" id="password" name="password" required>
    <button type="submit">Iniciar Sesión</button>
  </form>
</div>`,
            css: `/* style.css (común) */
body { margin: 0; font-size: 2rem; height: 100dvh; }

/* login_style.css */
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  background-color: #f0f0f0;
}
.login-container form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
input, button { font: inherit; }

@media screen and (min-width: 600px) {
  body { font-size: 1rem; }
  .login-container { align-items: center; }
  .login-container form { width: 400px; }
}`,
          }, { cssName: 'style.css + login_style.css', htmlName: 'login.html' }),
        },
        {
          title: 'Galería que cambia de columnas',
          level: 1,
          prompt: '<p>Con mobile first y media queries (sin <code>auto-fit</code>), hacé una grilla de fotos de 1 columna en celular, 2 desde 600px y 4 desde 1000px. Las imágenes no deben desbordar.</p>',
          solution: webSol('<p>Base de una columna y dos media queries con <code>min-width</code> que solo cambian <code>grid-template-columns</code>.</p>', {
            html: `<div class="fotos">
  <img src="https://placehold.co/400x300?text=1" alt="Foto 1">
  <img src="https://placehold.co/400x300?text=2" alt="Foto 2">
  <img src="https://placehold.co/400x300?text=3" alt="Foto 3">
  <img src="https://placehold.co/400x300?text=4" alt="Foto 4">
</div>`,
            css: `.fotos { display: grid; gap: 8px; grid-template-columns: 1fr; }
.fotos img { max-width: 100%; height: auto; display: block; border-radius: 8px; }
@media (min-width: 600px) { .fotos { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1000px) { .fotos { grid-template-columns: repeat(4, 1fr); } }`,
          }),
        },
      ],
      sources: [
        { title: 'Diseño receptivo', url: 'https://developer.mozilla.org/es/docs/Learn_web_development/Core/CSS_layout/Responsive_Design', points: ['RWD se basa en tres técnicas: redes fluidas, imágenes fluidas y media queries.', 'Flexbox, Grid y Multicol son responsivos por defecto.', 'Imágenes responsivas con <code>max-width</code>, <code>&lt;picture&gt;</code> o <code>srcset</code>.', 'Siempre incluir la metaetiqueta viewport.'] },
        { title: 'Fundamentos de las media queries', url: 'https://developer.mozilla.org/es/docs/Learn_web_development/Core/CSS_layout/Media_queries', points: ['Se componen de un tipo de medio y una característica (<code>min-width</code>, <code>orientation</code>…).', 'Los breakpoints van donde el contenido se rompe.', 'Flexbox y Grid a veces logran diseños adaptables sin media queries.'] },
        { title: 'Mobile First · Glosario MDN', url: 'https://developer.mozilla.org/es/docs/Glossary/Mobile_First', points: ['Forma de mejora progresiva: priorizar el diseño para móviles.', 'Se parte de una experiencia para pantallas chicas y se enriquece al crecer.'] },
        { title: 'position · MDN', url: 'https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/position', points: ['<code>static</code>: flujo normal; top/left no tienen efecto.', '<code>relative</code>: se desplaza respecto de sí mismo.', '<code>absolute</code>: sale del flujo, relativo al ancestro posicionado más cercano.', '<code>fixed</code>: relativo al viewport.', '<code>sticky</code>: relativo hasta un umbral de scroll, luego fijo.', 'Los posicionados con <code>z-index</code> crean contextos de apilamiento.'] },
      ],
    },
  );
})();
