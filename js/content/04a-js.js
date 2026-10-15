/* Módulo: JavaScript, parte 1 (lenguaje, DOM, eventos, errores) */
(() => {
  const { code, table, note, lab, webSol } = window.GUIDE.h;

  window.GUIDE.LESSONS.push(
    {
      id: 'js-fundamentos',
      module: 'js',
      title: 'JavaScript: motor, variables, tipos y control',
      keywords: 'javascript motor v8 ecmascript let const var tipos hoisting operadores if for while template literal truthy',
      tldr: 'JavaScript es un lenguaje <mark>interpretado, dinámico y multiparadigma</mark> que da comportamiento a las páginas (y también corre en servidores). Un motor como V8 lo convierte en código máquina mientras se ejecuta.',
      goals: ['Explicar qué es un motor de JS, un motor de renderizado y ECMAScript.', 'Declarar variables con let y const y conocer los tipos primitivos.', 'Escribir condiciones, bucles y funciones simples.'],
      body: `
        <h2>Qué es JavaScript</h2>
        <p>Es un lenguaje de programación <strong>interpretado</strong> (no hace falta compilarlo vos), <strong>multiparadigma</strong> (permite programar con objetos, de forma funcional o imperativa) y <strong>dinámico</strong> (las variables no tienen un tipo fijo). Nació para darle vida a las páginas, pero hoy también se usa del lado del servidor con Node.js.</p>

        <h2>Motores: quién ejecuta tu código</h2>
        <p>Un <mark>motor de JS</mark> analiza y ejecuta JavaScript. Los modernos usan compilación <strong>JIT</strong> (justo a tiempo): traducen el código a código máquina mientras corre, y optimizan las partes que se ejecutan muchas veces.</p>
        ${table(['Motor', 'De quién', 'Dónde'], [
          ['<strong>V8</strong>', 'Google, escrito en C++', 'Chrome, Edge y Node.js'],
          ['<strong>SpiderMonkey</strong>', 'Mozilla, en C++ y Rust', 'Firefox'],
          ['<strong>JavaScriptCore</strong>', 'Apple', 'Safari y apps en Swift, Objective-C y C'],
        ])}
        <p>El <mark>motor de renderizado</mark> es otra parte del navegador: transforma HTML, CSS y demás recursos en lo que ves en pantalla. Los dos trabajan juntos a través del DOM.</p>
        ${table(['Motor de renderizado', 'Dónde'], [
          ['<strong>Blink</strong>', 'Desarrollado por Google como parte de Chromium (Chrome, Edge, Opera)'],
          ['<strong>Gecko</strong>', 'Mozilla: Firefox'],
          ['<strong>WebKit</strong>', 'Apple: Safari'],
          ['<strong>Trident</strong> (MSHTML)', 'El de Internet Explorer, reemplazado por EdgeHTML y luego por Blink'],
        ])}
        <p><mark>ECMAScript</mark> es el estándar técnico de JavaScript: define la sintaxis y las características del lenguaje para que todos los motores lo ejecuten igual. Cuando leas “ES6” o “ES2022”, se refiere a versiones de ese estándar. ES6 (2015) trajo <code>let</code>, <code>const</code>, arrow functions, clases y módulos.</p>

        <h2>Dónde escribir JavaScript</h2>
        ${code('html', `<!-- Al final del body, o en el head con defer -->
<script src="app.js" defer></script>

<!-- También se puede escribir adentro, para pruebas -->
<script>
  console.log('Hola desde el HTML');
</script>`)}

        <h2>Variables: let, const y var</h2>
        ${table(['', '<code>var</code>', '<code>let</code>', '<code>const</code>'], [
          ['Alcance (scope)', 'Función / global', 'Bloque <code>{ }</code>', 'Bloque <code>{ }</code>'],
          ['Redeclarar', 'Sí', 'No', 'No'],
          ['Reasignar', 'Sí', 'Sí', 'No'],
          ['Hoisting', 'Sí, se inicializa en <code>undefined</code>', 'Sí, pero en TDZ', 'Sí, pero en TDZ'],
          ['Uso recomendado', '<strong>Evitar</strong>', 'Variables que cambian', 'Constantes y referencias'],
        ])}
        <p><strong>Hoisting</strong>: antes de ejecutar, JS “sube” las declaraciones (de variables y funciones) al inicio de su scope. Con <code>var</code> eso hace que la variable exista (vale <code>undefined</code>) antes de la línea donde la declaraste, lo que provoca bugs silenciosos. Con <code>let</code> y <code>const</code> la variable está en la <strong>TDZ</strong> (zona muerta temporal): usarla antes de declararla da error, que es mucho mejor.</p>
        ${note('<strong>Regla simple:</strong> usá <code>const</code> por defecto, <code>let</code> cuando necesites reasignar, y nunca <code>var</code>. Ojo: <code>const</code> impide <em>reasignar</em>, no <em>modificar</em>: un array declarado con <code>const</code> acepta <code>push</code>.')}

        <h2>Tipos de datos primitivos</h2>
        ${table(['Tipo', 'Ejemplo', 'Nota'], [
          ['<code>string</code>', '<code>"Hola"</code>, <code>\'Mundo\'</code>, <code>`texto`</code>', 'Texto. Las comillas invertidas permiten interpolar'],
          ['<code>number</code>', '<code>42</code>, <code>3.14</code>, <code>NaN</code>, <code>Infinity</code>', 'Un solo tipo para enteros y decimales'],
          ['<code>bigint</code>', '<code>9007199254740991n</code>', 'Enteros enormes'],
          ['<code>boolean</code>', '<code>true</code>, <code>false</code>', 'Lógico'],
          ['<code>undefined</code>', '<code>let x;</code>', 'Sin valor asignado'],
          ['<code>null</code>', '<code>let y = null;</code>', 'Ausencia intencional de valor'],
          ['<code>symbol</code>', '<code>Symbol("id")</code>', 'Valor único'],
        ])}
        <p>Todo lo demás (objetos, arrays, funciones, fechas) es de tipo <code>object</code>. <code>typeof</code> te dice el tipo de un valor.</p>
        ${note('<strong>Rareza histórica:</strong> <code>typeof null</code> devuelve <code>"object"</code>. Es un bug de los primeros días del lenguaje que nunca se corrigió para no romper sitios existentes.', 'warn')}

        <h3>Template literals</h3>
        ${code('js', `const nombre = 'Ana';
const turno = 3;
// Con comillas invertidas podés meter expresiones con \${ } y escribir en varias líneas
const mensaje = \`Hola \${nombre}, tu turno es el #\${turno + 1}\`;`)}

        <h2>Operadores</h2>
        ${table(['Operador', 'Qué hace', 'Ejemplo'], [
          ['<code>+ - * / %</code>', 'Aritmética (<code>%</code> es el resto)', '<code>7 % 2</code> → 1'],
          ['<code>===</code> / <code>!==</code>', 'Igualdad estricta (valor <strong>y</strong> tipo)', '<code>1 === "1"</code> → false'],
          ['<code>==</code>', 'Igualdad con conversión. <strong>Evitalo</strong>', '<code>1 == "1"</code> → true'],
          ['<code>&amp;&amp; || !</code>', 'Y, O, NO', '<code>edad &gt;= 18 &amp;&amp; tieneDni</code>'],
          ['<code>? :</code>', 'Ternario: un if en una expresión', '<code>edad &gt;= 18 ? "mayor" : "menor"</code>'],
          ['<code>??</code>', 'Valor por defecto si es null o undefined', '<code>nombre ?? "Anónimo"</code>'],
          ['<code>?.</code>', 'Encadenamiento opcional: no explota si algo es null', '<code>usuario?.direccion?.calle</code>'],
        ])}
        <h3>Truthy y falsy</h3>
        <p>En una condición, estos valores cuentan como <strong>falsos</strong>: <code>false</code>, <code>0</code>, <code>""</code> (string vacío), <code>null</code>, <code>undefined</code> y <code>NaN</code>. Todo lo demás es verdadero, incluso <code>"0"</code>, <code>[]</code> y <code>{}</code>. Por eso <code>if (input.value)</code> sirve para saber si el usuario escribió algo.</p>

        <h2>Control de flujo</h2>
        ${code('js', `// Condicionales
if (nota >= 6) {
  console.log('Aprobado');
} else if (nota >= 4) {
  console.log('Recuperatorio');
} else {
  console.log('Desaprobado');
}

switch (dia) {
  case 'sabado':
  case 'domingo':
    console.log('Fin de semana');
    break;
  default:
    console.log('Día hábil');
}

// Bucles
for (let i = 0; i < 3; i++) console.log(i);          // 0, 1, 2
for (const fruta of ['manzana', 'pera']) console.log(fruta);  // recorre valores
let intentos = 0;
while (intentos < 3) intentos++;`)}

        <h2>Funciones</h2>
        ${code('js', `function sumar(a, b = 0) {   // b tiene valor por defecto
  return a + b;
}
const doble = (n) => n * 2;  // arrow function (la próxima lección las compara)

sumar(2, 3);   // 5
doble(4);      // 8`)}
        ${lab(0)}
      `,
      labs: [
        {
          title: 'Variables, tipos y condiciones',
          html: `<p>Mirá los resultados abajo.</p>`,
          js: `
const nombre = 'Ana';
let edad = 21;
edad = edad + 1; // let se puede reasignar

console.log(\`\${nombre} tiene \${edad} años\`);
console.log(typeof nombre, typeof edad, typeof true);
console.log(typeof undefined, typeof null); // ¡ojo con null!

console.log('1 === "1" →', 1 === '1');
console.log('1 == "1"  →', 1 == '1');

const apodo = null;
console.log('Apodo:', apodo ?? 'sin apodo');

const usuario = { perfil: null };
console.log('Ciudad:', usuario.perfil?.ciudad); // undefined, sin error

for (const valor of [0, '', 'hola', [], null]) {
  console.log(JSON.stringify(valor), valor ? 'truthy' : 'falsy');
}

// Descomentá para ver los errores:
// nombre = 'Luis';           // TypeError: const no se reasigna
// console.log(antes); let antes = 1;  // ReferenceError: TDZ`,
          hint: 'Descomentá las líneas marcadas (borrá <code>//</code>) para ver los errores que da JavaScript.',
        },
      ],
      exercises: [
        {
          title: 'Calculadora de IMC',
          level: 1,
          prompt: '<p>Escribí una función <code>imc(peso, altura)</code> que devuelva el índice de masa corporal (peso / altura²) redondeado a un decimal, y otra <code>clasificar(imc)</code> que devuelva “Bajo peso” (&lt; 18.5), “Normal” (&lt; 25), “Sobrepeso” (&lt; 30) u “Obesidad”. Probalas con tres personas y mostrá los resultados con template literals.</p>',
          hints: ['<code>altura ** 2</code> eleva al cuadrado.', '<code>Number(x.toFixed(1))</code> redondea a un decimal.'],
          solution: webSol('<p>Dos funciones puras (no tocan nada de afuera, solo reciben y devuelven), una cadena de <code>if</code> que aprovecha el orden de las condiciones y un <code>for...of</code> para probarlas.</p>', {
            html: '<ul id="out"></ul>',
            js: `function imc(peso, altura) {
  return Number((peso / altura ** 2).toFixed(1));
}

function clasificar(valor) {
  if (valor < 18.5) return 'Bajo peso';
  if (valor < 25) return 'Normal';
  if (valor < 30) return 'Sobrepeso';
  return 'Obesidad';
}

const personas = [
  { nombre: 'Ana', peso: 55, altura: 1.65 },
  { nombre: 'Luis', peso: 92, altura: 1.75 },
  { nombre: 'Sol', peso: 48, altura: 1.70 },
];

for (const p of personas) {
  const valor = imc(p.peso, p.altura);
  const li = document.createElement('li');
  li.textContent = \`\${p.nombre}: IMC \${valor}, \${clasificar(valor)}\`;
  document.getElementById('out').appendChild(li);
}`,
          }),
        },
        {
          title: 'FizzBuzz de turnos',
          level: 2,
          prompt: '<p>Mostrá los números del 1 al 30, pero: si es múltiplo de 3 escribí “Clínica”, si es múltiplo de 5 “Pediatría”, y si es múltiplo de ambos “Guardia”. Cada número en un <code>&lt;li&gt;</code>.</p>',
          hints: ['Preguntá primero por el caso de “ambos” (múltiplo de 15).', '<code>n % 3 === 0</code> significa “múltiplo de 3”.'],
          solution: webSol('<p>El orden de los <code>if</code> importa: si preguntaras primero por 3, el 15 nunca llegaría a “Guardia”.</p>', {
            html: '<ol id="lista"></ol>',
            js: `const lista = document.getElementById('lista');

for (let n = 1; n <= 30; n++) {
  let texto = n;
  if (n % 15 === 0) texto = 'Guardia';
  else if (n % 3 === 0) texto = 'Clínica';
  else if (n % 5 === 0) texto = 'Pediatría';

  const li = document.createElement('li');
  li.textContent = texto;
  lista.appendChild(li);
}`,
          }),
        },
      ],
      sources: [
        { title: 'JavaScript engine · MDN', url: 'https://developer.mozilla.org/en-US/docs/Glossary/Engine/JavaScript', points: ['Intérpretes que analizan y ejecutan JavaScript, usando compilación JIT.', 'Se usan en navegadores y en servidores (Node.js).', 'En el navegador trabajan junto al motor de renderizado a través del DOM.', 'Ejemplos: V8, SpiderMonkey, JavaScriptCore.'] },
        { title: 'Rendering engine · MDN', url: 'https://developer.mozilla.org/en-US/docs/Glossary/Engine/Rendering', points: ['Parte del navegador que transforma HTML, CSS y otros recursos en una representación visual.', 'Ejemplos: Blink, Gecko, WebKit y Trident.'] },
        { title: 'JavaScript · MDN', url: 'https://developer.mozilla.org/es/docs/Web/JavaScript', points: ['Lenguaje ligero, interpretado o compilado JIT, con funciones de primera clase.', 'Multiparadigma: orientado a objetos, imperativo y funcional.'] },
      ],
    },

    {
      id: 'js-objetos-funciones',
      module: 'js',
      title: 'Objetos y funciones',
      keywords: 'objetos propiedades metodos clase constructor arrow function this spread desestructuracion object keys entries',
      tldr: 'Un objeto es una colección de pares <mark>clave: valor</mark>. Es la forma de modelar cosas del mundo real: un paciente, un producto, un turno. Las funciones son el otro gran bloque: y en JS, una función también es un valor.',
      goals: ['Crear objetos con literales, constructores y clases.', 'Leer, agregar, copiar y desestructurar propiedades.', 'Elegir entre function y arrow function sabiendo qué pasa con this.'],
      body: `
        <h2>Qué es un objeto</h2>
        <p>Es una colección de <strong>propiedades</strong>, donde cada una combina un nombre (clave) y un valor. Si el valor es una función, se llama <strong>método</strong>. Es fundamental saber trabajar con objetos: con ellos se modelan y manipulan los datos de cualquier aplicación, y son el formato en el que llegan las respuestas de las APIs.</p>

        <h2>Tres formas de crearlos</h2>
        ${code('js', `// 1. Literal (la más común)
const paciente = {
  nombre: 'Julián',
  edad: 34,
  alergias: ['penicilina'],
  saludar() { return 'Hola, soy ' + this.nombre; },  // método
};

// 2. Función constructora (forma antigua)
function Doctor(nombre, matricula) {
  this.nombre = nombre;
  this.matricula = matricula;
}
const d = new Doctor('Pérez', 1234);

// 3. Clase (azúcar sintáctico moderno sobre lo mismo)
class Especialidad {
  constructor(nombre) { this.nombre = nombre; }
  describir() { return 'Especialidad: ' + this.nombre; }
}
const cardio = new Especialidad('Cardiología');`)}

        <h2>Acceder a propiedades</h2>
        ${table(['Notación', 'Ejemplo', 'Cuándo'], [
          ['Punto', '<code>paciente.nombre</code>', 'Casi siempre: cuando conocés el nombre'],
          ['Corchetes', '<code>paciente["nombre"]</code>', 'Cuando la clave está en una variable o tiene caracteres raros'],
        ])}
        ${code('js', `const campo = 'edad';
paciente[campo];          // 34

paciente.telefono = '381-555';  // agregar
paciente.edad = 35;             // modificar
delete paciente.telefono;       // eliminar
'edad' in paciente;             // true: ¿existe la clave?`)}

        <h2>Funciones de Object más usadas</h2>
        ${code('js', `Object.keys(paciente);     // ['nombre', 'edad', 'alergias', 'saludar']
Object.values(paciente);   // ['Julián', 34, [...], ƒ]
Object.entries(paciente);  // [['nombre','Julián'], ['edad',34], ...]
Object.assign({}, paciente);   // copia superficial (forma vieja)

// Spread: copiar y modificar sin tocar el original
const actualizado = { ...paciente, edad: 35 };

// Desestructuración: sacar propiedades a variables
const { nombre, edad } = paciente;
const { nombre: n, obraSocial = 'Particular' } = paciente; // renombrar y valor por defecto`)}
        ${note('<strong>Los objetos se pasan por referencia.</strong> <code>const b = a</code> no copia: las dos variables apuntan al mismo objeto, y cambiar <code>b.x</code> cambia <code>a.x</code>. Por eso <code>{a:1} === {a:1}</code> es <code>false</code> (son dos objetos distintos). Para copiar usá spread. Esto es clave en React, donde nunca hay que modificar el estado directamente.', 'warn')}
        ${lab(0)}

        <h2>function tradicional vs. arrow function</h2>
        ${code('js', `function sumar(a, b) { return a + b; }       // declaración
const restar = function (a, b) { return a - b; }; // expresión
const multiplicar = (a, b) => a * b;          // arrow con return implícito
const crear = (nombre) => ({ nombre });        // devolver un objeto: entre paréntesis`)}
        ${table(['Característica', 'function tradicional', 'Arrow function'], [
          ['Sintaxis', 'Verbosa, requiere <code>function</code>', 'Compacta, usa <code>=&gt;</code>'],
          ['<code>this</code>', 'Dinámico: depende de cómo se invoque (objeto, <code>call</code>, <code>apply</code>, <code>bind</code>)', 'Léxico: hereda el <code>this</code> del lugar donde fue creada'],
          ['<code>arguments</code>', 'Disponible automáticamente', 'No existe: usar <code>...args</code>'],
          ['Constructor (<code>new</code>)', 'Sí: <code>new Persona()</code>', 'No: lanza error'],
          ['Métodos en objetos', 'Ideal: <code>this</code> apunta al objeto', 'Problema: <code>this</code> apunta al contexto exterior'],
          ['Clases', 'Métodos por defecto', 'Útil en propiedades de clase para auto-bind (en React de clases)'],
          ['Hoisting', 'Se eleva completa: se puede usar antes de declararla', 'Se comporta como <code>const</code>: no existe antes'],
          ['Prototipo', 'Tiene <code>prototype</code>', 'No tiene'],
          ['Return implícito', 'No: hay que escribir <code>return</code>', 'Sí, si el cuerpo es una sola expresión'],
          ['<code>super</code> en clases', 'Depende del contexto', 'Usa el del contexto padre (igual que <code>this</code>)'],
          ['Performance', 'Leve diferencia en motores viejos', 'Similar en motores modernos'],
          ['Uso recomendado', 'Constructores, métodos de objeto, cuando necesitás <code>this</code> dinámico o <code>arguments</code>', 'Callbacks, funciones cortas, promesas, funciones dentro de funciones'],
        ])}
        ${lab(1)}
      `,
      labs: [
        {
          title: 'Modelá un turno médico',
          html: `<div id="out"></div>`,
          css: `.turno { border-left:4px solid #2b4c7e; padding:8px 12px; background:#f2f4f1; margin:6px 0; }`,
          js: `
class Turno {
  constructor(numero, paciente, especialidad, hora) {
    this.numero = numero;
    this.paciente = paciente;
    this.especialidad = especialidad;
    this.hora = hora;
  }
  // método tradicional: this apunta al objeto
  resumen() {
    return \`#\${this.numero} · \${this.hora} · \${this.paciente} (\${this.especialidad})\`;
  }
}

const turnos = [
  new Turno(1, 'Julián', 'Clínica', '08:30'),
  new Turno(2, 'María', 'Cardiología', '09:00'),
];

document.getElementById('out').innerHTML = turnos
  .map(t => \`<div class="turno">\${t.resumen()}</div>\`)
  .join('');

console.log(Object.keys(turnos[0]));
const { paciente, hora } = turnos[1];
console.log('Desestructurado:', paciente, hora);

// Referencia vs. copia
const copia = { ...turnos[0], hora: '10:00' };
const mismo = turnos[0];
mismo.paciente = 'Julián Pérez';
console.log(turnos[0].paciente, '| copia:', copia.paciente, copia.hora);`,
          hint: 'Agregá un tercer turno. Después mirá la última línea de la consola: cambiar <code>mismo</code> cambió el original, pero <code>copia</code> no.',
        },
        {
          title: 'El problema de this',
          html: `<p>Mirá la consola.</p>`,
          js: `
const contador = {
  valor: 0,
  // function: this es el objeto
  sumar() { this.valor++; return this.valor; },
  // arrow: this NO es el objeto (es el contexto de afuera)
  sumarFlecha: () => { return typeof this; },
  // arrow ADENTRO de un método: hereda el this del método, ¡útil!
  sumarDespues() {
    setTimeout(() => {
      this.valor += 10;
      console.log('Después de 300ms, valor =', this.valor);
    }, 300);
  },
};

console.log('sumar():', contador.sumar());
console.log('sumarFlecha() ve this como:', contador.sumarFlecha());
contador.sumarDespues();`,
          hint: 'Cambiá la arrow de adentro de <code>setTimeout</code> por <code>function () { … }</code>: el <code>this</code> se pierde y el valor queda en <code>NaN</code>.',
        },
      ],
      exercises: [
        {
          title: 'Ficha de paciente',
          level: 1,
          prompt: '<p>Creá un objeto <code>paciente</code> con nombre, DNI, obra social y un array de turnos (cada uno con fecha y especialidad). Escribí una función <code>describir(p)</code> que use desestructuración y devuelva: “Ana (DNI 30111222), OSDE, 2 turnos”. Después creá una copia con otra obra social sin modificar el original y mostrá ambos.</p>',
          solution: webSol('<p>La desestructuración en el parámetro saca directo lo que la función necesita. La copia con spread crea un objeto nuevo; ojo que el array de turnos sigue siendo <em>el mismo</em> (copia superficial).</p>', {
            html: '<pre id="out"></pre>',
            js: `const paciente = {
  nombre: 'Ana',
  dni: 30111222,
  obraSocial: 'OSDE',
  turnos: [
    { fecha: '2026-10-20', especialidad: 'Clínica' },
    { fecha: '2026-11-02', especialidad: 'Cardiología' },
  ],
};

function describir({ nombre, dni, obraSocial, turnos }) {
  return \`\${nombre} (DNI \${dni}), \${obraSocial}, \${turnos.length} turnos\`;
}

const particular = { ...paciente, obraSocial: 'Particular' };

document.getElementById('out').textContent =
  describir(paciente) + '\\n' + describir(particular);`,
          }),
        },
        {
          title: 'Clase Carrito',
          level: 2,
          prompt: '<p>Escribí una clase <code>Carrito</code> con: un array <code>items</code>; un método <code>agregar(producto, cantidad)</code> que, si el producto ya está, sume la cantidad; un método <code>quitar(nombre)</code>; y un método <code>total()</code>. Probala agregando dos veces el mismo producto.</p>',
          hints: ['Usá <code>this.items.find(i =&gt; i.nombre === producto.nombre)</code> para ver si ya existe.', 'Para quitar, <code>filter</code> devuelve un array nuevo sin ese ítem.'],
          solution: webSol('<p>Los métodos usan <code>this</code> para acceder a los ítems de <strong>esa</strong> instancia. Por eso son funciones tradicionales (la sintaxis de método de clase), no arrows.</p>', {
            html: '<pre id="out"></pre>',
            js: `class Carrito {
  constructor() {
    this.items = [];
  }
  agregar(producto, cantidad = 1) {
    const existente = this.items.find(i => i.nombre === producto.nombre);
    if (existente) existente.cantidad += cantidad;
    else this.items.push({ ...producto, cantidad });
  }
  quitar(nombre) {
    this.items = this.items.filter(i => i.nombre !== nombre);
  }
  total() {
    return this.items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
  }
}

const c = new Carrito();
c.agregar({ nombre: 'Mouse', precio: 12000 });
c.agregar({ nombre: 'Teclado', precio: 25000 });
c.agregar({ nombre: 'Mouse', precio: 12000 }, 2);
c.quitar('Teclado');

document.getElementById('out').textContent =
  JSON.stringify(c.items, null, 2) + '\\nTotal: $' + c.total();`,
          }),
        },
      ],
      sources: [
        { title: 'Trabajando con objetos', url: 'https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Working_with_objects', points: ['Un objeto es una colección de propiedades (clave → valor). Si el valor es una función, se llama método.', 'Se accede con notación de punto o de corchetes.', 'Se crean con literales <code>{}</code>, constructores con <code>new</code> u <code>Object.create()</code>.', '<code>this</code> dentro de un método refiere al objeto actual.', 'Dos objetos distintos nunca son iguales, aunque tengan las mismas propiedades.'] },
      ],
    },

    {
      id: 'js-arrays',
      module: 'js',
      title: 'Arrays y sus métodos',
      keywords: 'array push pop shift unshift map filter find reduce foreach some every sort includes slice splice spread',
      tldr: 'Un array guarda <mark>muchos valores en una sola variable</mark>, en orden. Cada elemento tiene un índice que empieza en 0. Sus métodos (map, filter, reduce…) son lo que más vas a usar en React.',
      goals: ['Crear arrays y modificarlos por índice.', 'Distinguir métodos que mutan de los que devuelven un array nuevo.', 'Encadenar filter, map y reduce para transformar datos.'],
      body: `
        <h2>Qué es un array</h2>
        <p>Es una estructura que almacena múltiples valores en una sola variable. Puede contener cualquier tipo de dato, mezclado: números, strings, booleanos, objetos y hasta otros arrays. Es <strong>indexado</strong>: el primer elemento está en la posición <code>0</code> y el último en <code>length - 1</code>.</p>
        ${code('js', `const frutas = ['Manzana', 'Banana'];     // literal (recomendado)
const numeros = new Array(1, 2, 3);        // constructor
const vacio = [];

frutas[0];            // 'Manzana'
frutas[1] = 'Pera';   // modificar usando el índice
frutas.length;        // 2
frutas[frutas.length - 1];  // el último
frutas.at(-1);              // también el último (moderno)`)}

        <h2>Agregar y quitar (mutan el array)</h2>
        ${table(['Método', 'Qué hace', 'Dónde', 'Devuelve'], [
          ['<code>push(x)</code>', 'Agrega', 'Al final', 'El nuevo largo'],
          ['<code>pop()</code>', 'Quita', 'Del final', 'El elemento quitado'],
          ['<code>unshift(x)</code>', 'Agrega', 'Al principio', 'El nuevo largo'],
          ['<code>shift()</code>', 'Quita', 'Del principio', 'El elemento quitado'],
          ['<code>splice(i, n)</code>', 'Quita <code>n</code> elementos desde <code>i</code> (y puede insertar)', 'En el medio', 'Los quitados'],
        ])}

        <h2>Recorrer y transformar (no mutan)</h2>
        <p>Reciben una función (callback) que se ejecuta por cada elemento, con <code>(elemento, índice, array)</code>. <mark>map, filter, find y reduce no modifican el original</mark>: devuelven algo nuevo. Eso los vuelve perfectos para React.</p>
        ${table(['Método', 'Devuelve', 'Para qué', 'Ejemplo'], [
          ['<code>forEach</code>', 'nada', 'Hacer algo con cada elemento', '<code>lista.forEach(x =&gt; console.log(x))</code>'],
          ['<code>map</code>', 'array del mismo largo', 'Transformar cada elemento', '<code>precios.map(p =&gt; p * 1.21)</code>'],
          ['<code>filter</code>', 'array más corto (o igual)', 'Quedarse con los que cumplen', '<code>turnos.filter(t =&gt; t.hoy)</code>'],
          ['<code>find</code>', 'un elemento o <code>undefined</code>', 'El primero que cumple', '<code>users.find(u =&gt; u.id === 3)</code>'],
          ['<code>findIndex</code>', 'índice o -1', 'La posición del primero que cumple', ''],
          ['<code>some</code> / <code>every</code>', 'boolean', '¿Alguno cumple? / ¿Todos cumplen?', '<code>notas.every(n =&gt; n &gt;= 6)</code>'],
          ['<code>includes</code>', 'boolean', '¿Está este valor?', '<code>roles.includes("admin")</code>'],
          ['<code>reduce</code>', 'un solo valor', 'Acumular: sumar, contar, agrupar', '<code>items.reduce((acc, i) =&gt; acc + i, 0)</code>'],
          ['<code>slice(a, b)</code>', 'una porción', 'Copiar un pedazo (paginación)', '<code>lista.slice(0, 10)</code>'],
          ['<code>join(sep)</code>', 'string', 'Unir en un texto', '<code>["a","b"].join(", ")</code>'],
        ])}
        ${code('js', `const precios = [100, 250, 80];
precios.map(p => p * 1.21);              // [121, 302.5, 96.8]
precios.filter(p => p > 90);             // [100, 250]
precios.find(p => p < 90);               // 80
precios.reduce((acc, p) => acc + p, 0);  // 430

// Encadenar: el total con IVA de los productos de más de 90
precios.filter(p => p > 90).map(p => p * 1.21).reduce((a, p) => a + p, 0);`)}
        <h3>Cómo funciona reduce, paso a paso</h3>
        ${table(['Vuelta', '<code>acc</code> (antes)', '<code>p</code>', 'Devuelve'], [
          ['1', '0 (valor inicial)', '100', '100'],
          ['2', '100', '250', '350'],
          ['3', '350', '80', '<strong>430</strong>'],
        ])}

        <h2>Copiar, ordenar y combinar</h2>
        ${code('js', `const copia = [...frutas];               // copia (spread)
const todas = [...frutas, ...otras];     // concatenar
const sinTercero = lista.filter((_, i) => i !== 2);  // quitar sin mutar

// sort MUTA y ordena como texto por defecto: [10, 9, 1].sort() → [1, 10, 9]
const ordenados = [...numeros].sort((a, b) => a - b);          // números ascendente
const porNombre = [...pacientes].sort((a, b) => a.nombre.localeCompare(b.nombre));

const [primero, segundo, ...resto] = [1, 2, 3, 4];  // desestructuración`)}
        ${lab(0)}
        ${lab(1)}
      `,
      labs: [
        {
          title: 'Filtrá y sumá un carrito',
          html: `
<label>Precio mínimo: <input id="min" type="range" min="0" max="200000" step="5000" value="0"> <span id="v"></span></label>
<label><input id="orden" type="checkbox"> Ordenar por precio</label>
<ul id="lista"></ul>
<p id="total"></p>`,
          css: `ul { padding-left: 18px; } #total { font-weight: bold; } label { display:block; margin:4px 0; }`,
          js: `
const productos = [
  { nombre: 'Teclado', precio: 25000 },
  { nombre: 'Mouse', precio: 12000 },
  { nombre: 'Monitor', precio: 180000 },
  { nombre: 'Auriculares', precio: 40000 },
];

const min = document.getElementById('min');
const orden = document.getElementById('orden');

function render() {
  let visibles = productos.filter(p => p.precio >= Number(min.value));
  if (orden.checked) visibles = [...visibles].sort((a, b) => a.precio - b.precio);

  document.getElementById('v').textContent = '$' + min.value;
  document.getElementById('lista').innerHTML = visibles
    .map(p => \`<li>\${p.nombre}: $\${p.precio}</li>\`)
    .join('');
  const total = visibles.reduce((acc, p) => acc + p.precio, 0);
  document.getElementById('total').textContent = 'Total: $' + total;
}

min.addEventListener('input', render);
orden.addEventListener('change', render);
render();`,
          hint: 'Mové el control. Después usá <code>find</code> para mostrar en la consola el primer producto de más de $30000.',
        },
        {
          title: 'Agrupar con reduce',
          html: `<pre id="out"></pre>`,
          js: `
const turnos = [
  { paciente: 'Ana', especialidad: 'Clínica' },
  { paciente: 'Luis', especialidad: 'Pediatría' },
  { paciente: 'Sol', especialidad: 'Clínica' },
  { paciente: 'Tomás', especialidad: 'Cardiología' },
  { paciente: 'Eva', especialidad: 'Pediatría' },
];

// Contar turnos por especialidad: el acumulador es un objeto
const porEspecialidad = turnos.reduce((acc, t) => {
  acc[t.especialidad] = (acc[t.especialidad] ?? 0) + 1;
  return acc;
}, {});

const hayCardio = turnos.some(t => t.especialidad === 'Cardiología');
const nombres = turnos.map(t => t.paciente).join(', ');

document.getElementById('out').textContent =
  JSON.stringify(porEspecialidad, null, 2) +
  '\\n¿Hay cardiología? ' + hayCardio +
  '\\nPacientes: ' + nombres;`,
          hint: 'Cambiá el reduce para que agrupe los <em>nombres</em> de los pacientes por especialidad en vez de contarlos.',
        },
      ],
      exercises: [
        {
          title: 'Estadísticas de notas',
          level: 1,
          prompt: '<p>Dado <code>const notas = [7, 4, 9, 6, 2, 10, 8]</code>, calculá sin usar <code>for</code>: el promedio, la nota más alta, cuántos aprobaron (≥ 6), si todos aprobaron, y las notas ordenadas de mayor a menor sin modificar el array original.</p>',
          hints: ['<code>Math.max(...notas)</code>', 'Para ordenar sin mutar: <code>[...notas].sort((a, b) =&gt; b - a)</code>.'],
          solution: webSol('<p>Cada pregunta tiene su método: <code>reduce</code> para sumar, <code>Math.max</code> con spread, <code>filter().length</code> para contar, <code>every</code> para “todos”, y <code>sort</code> sobre una copia.</p>', {
            html: '<pre id="out"></pre>',
            js: `const notas = [7, 4, 9, 6, 2, 10, 8];

const promedio = notas.reduce((acc, n) => acc + n, 0) / notas.length;
const maxima = Math.max(...notas);
const aprobados = notas.filter(n => n >= 6).length;
const todosAprobaron = notas.every(n => n >= 6);
const ordenadas = [...notas].sort((a, b) => b - a);

document.getElementById('out').textContent = [
  'Promedio: ' + promedio.toFixed(2),
  'Máxima: ' + maxima,
  'Aprobados: ' + aprobados,
  '¿Todos aprobaron? ' + todosAprobaron,
  'Ordenadas: ' + ordenadas.join(', '),
  'Original intacto: ' + notas.join(', '),
].join('\\n');`,
          }),
        },
        {
          title: 'Buscador de pacientes',
          level: 2,
          prompt: '<p>Con un array de pacientes (nombre, edad, obra social), hacé una página con un input de búsqueda y un select de obra social. La lista debe mostrar solo los que coinciden con ambos filtros (el texto sin importar mayúsculas), ordenados por nombre, y un contador “Mostrando X de Y”.</p>',
          hints: ['Encadená dos <code>filter</code> (o uno con <code>&amp;&amp;</code>), después <code>sort</code> y <code>map</code>.', '<code>texto.toLowerCase().includes(busqueda.toLowerCase())</code>'],
          solution: webSol('<p>Una sola función <code>render</code> que siempre parte del array original y aplica los filtros vigentes. Este es el mismo patrón que vas a usar en el Ejercicio 23 y, más adelante, en React.</p>', {
            html: `<input id="q" placeholder="Buscar por nombre">
<select id="os">
  <option value="">Todas</option>
  <option>OSDE</option>
  <option>Particular</option>
  <option>Subsidio</option>
</select>
<p id="cuenta"></p>
<ul id="lista"></ul>`,
            js: `const pacientes = [
  { nombre: 'Sofía Díaz', edad: 29, os: 'OSDE' },
  { nombre: 'Ana López', edad: 41, os: 'Particular' },
  { nombre: 'Marcos Ruiz', edad: 35, os: 'Subsidio' },
  { nombre: 'Andrés Paz', edad: 52, os: 'OSDE' },
];

const q = document.getElementById('q');
const os = document.getElementById('os');

function render() {
  const texto = q.value.trim().toLowerCase();
  const visibles = pacientes
    .filter(p => p.nombre.toLowerCase().includes(texto))
    .filter(p => !os.value || p.os === os.value)
    .sort((a, b) => a.nombre.localeCompare(b.nombre));

  document.getElementById('cuenta').textContent =
    'Mostrando ' + visibles.length + ' de ' + pacientes.length;
  document.getElementById('lista').innerHTML = visibles
    .map(p => '<li>' + p.nombre + ' (' + p.edad + '), ' + p.os + '</li>')
    .join('');
}

q.addEventListener('input', render);
os.addEventListener('change', render);
render();`,
          }),
        },
      ],
      sources: [
        { title: 'Array · MDN', url: 'https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array', points: ['Objeto global para listas de alto nivel, de longitud y tipos variables.', 'Los índices arrancan en 0; el último está en <code>length - 1</code>.', '<code>length</code> se actualiza sola al agregar o quitar elementos.', 'Métodos de recorrido, mutación, búsqueda y transformación: <code>push</code>, <code>pop</code>, <code>forEach</code>, <code>map</code>, <code>filter</code>…'] },
      ],
    },

    {
      id: 'dom',
      module: 'js',
      title: 'El DOM: JavaScript toca la página',
      keywords: 'dom document queryselector createelement appendchild nodos arbol classlist textcontent innerhtml dataset',
      tldr: 'El DOM (Document Object Model) es la <mark>representación de la página como un árbol de objetos</mark>. JavaScript lo usa para leer y cambiar la estructura, los estilos y el contenido.',
      goals: ['Entender el árbol de nodos que arma el navegador.', 'Seleccionar, modificar, crear y eliminar elementos.', 'Resolver el Ejercicio 21 con la API Document.'],
      body: `
        <h2>El árbol</h2>
        <p>Cuando el navegador lee tu HTML, construye en memoria un árbol de <strong>nodos</strong>: cada etiqueta es un nodo elemento, el texto de adentro es un nodo de texto, y hasta los comentarios son nodos. Ese árbol es el DOM, y es lo que realmente ves: si JavaScript lo cambia, la pantalla cambia (aunque tu archivo HTML siga igual).</p>
        ${code('html', `<body>
  <h1>Turnos</h1>
  <ul id="lista">
    <li>Julián</li>
  </ul>
</body>`)}
        <p>Se convierte en: <code>document → html → body → (h1 → "Turnos", ul#lista → li → "Julián")</code>. El objeto global <code>document</code> es la puerta de entrada (la API Document).</p>

        <h2>Seleccionar elementos</h2>
        ${table(['Método', 'Devuelve', 'Ejemplo'], [
          ['<code>getElementById(id)</code>', 'Un elemento o <code>null</code>', '<code>document.getElementById("lista")</code>'],
          ['<code>querySelector(selector)</code>', 'El <strong>primero</strong> que coincide o <code>null</code>', '<code>document.querySelector(".card.activa")</code>'],
          ['<code>querySelectorAll(selector)</code>', 'Todos (NodeList, se recorre con <code>forEach</code>)', '<code>document.querySelectorAll("li")</code>'],
          ['<code>el.closest(selector)</code>', 'El ancestro más cercano que coincide', '<code>boton.closest("tr")</code>'],
        ])}
        ${note('<strong>El error más común:</strong> <code>Cannot read properties of null</code>. Significa que el selector no encontró nada: el id está mal escrito, o el script corrió antes de que exista el HTML (usá <code>defer</code> o <code>DOMContentLoaded</code>).', 'warn')}

        <h2>Modificar</h2>
        ${code('js', `const h1 = document.querySelector('h1');
h1.textContent = 'Nuevo título';     // cambia el texto (seguro)
h1.innerHTML = 'Turnos <small>(3)</small>';  // interpreta HTML
h1.style.color = 'crimson';          // estilo en línea (camelCase: backgroundColor)
h1.classList.add('activo');          // también remove, toggle, contains
h1.setAttribute('title', 'Hola');    // atributos
h1.dataset.id = '42';                // atributos data-*: <h1 data-id="42">

const input = document.querySelector('input');
input.value;                         // el texto que escribió el usuario
input.disabled = true;`)}
        ${note('<strong>textContent vs. innerHTML.</strong> <code>textContent</code> trata todo como texto. <code>innerHTML</code> interpreta HTML: es cómodo para plantillas, pero nunca lo uses con datos que escribió un usuario, porque podría inyectar código (ataque XSS).', 'warn')}
        <p>Preferí cambiar <strong>clases</strong> antes que estilos: el CSS define cómo se ve <code>.abierto</code>, y JS solo decide cuándo ponerla. Así no mezclás diseño con lógica.</p>

        <h2>Crear, agregar y eliminar</h2>
        ${code('js', `const li = document.createElement('li');
li.textContent = 'María';
li.className = 'paciente';

const lista = document.getElementById('lista');
lista.appendChild(li);        // al final
lista.prepend(li);            // al principio
lista.append(a, b, 'texto');  // varios a la vez
li.remove();                  // eliminar
lista.replaceChildren();      // vaciar
lista.innerHTML = '';         // vaciar (otra forma)`)}
        ${lab(0)}

        <h2>Recorrer el árbol</h2>
        ${code('js', `el.parentElement;          // el padre
el.children;               // los hijos (elementos)
el.firstElementChild;
el.nextElementSibling;     // el hermano siguiente`)}
        ${lab(1)}
      `,
      labs: [
        {
          title: 'Crear una tabla con la API Document (Ejercicio 21)',
          html: `<button id="crear">Crear tabla</button>
<div id="destino"></div>`,
          css: `
table { border-collapse: collapse; margin-top: 12px; }
th, td { border: 1px solid #c9d0c9; padding: 6px 12px; }
th { background: #dfe6f1; }`,
          js: `
const datos = [['#1', 'Julian'], ['#2', 'Maria']];

function crearTabla() {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const trHead = document.createElement('tr');

  ['Número de turno', 'Nombre de Paciente'].forEach(texto => {
    const th = document.createElement('th');
    th.textContent = texto;
    trHead.appendChild(th);
  });
  thead.appendChild(trHead);

  const tbody = document.createElement('tbody');
  datos.forEach(fila => {
    const tr = document.createElement('tr');
    fila.forEach(valor => {
      const td = document.createElement('td');
      td.textContent = valor;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.append(thead, tbody);
  document.getElementById('destino').replaceChildren(table);
}

document.getElementById('crear').addEventListener('click', crearTabla);`,
          hint: 'Agregá un tercer paciente al array <code>datos</code> y volvé a apretar el botón. Inspeccioná con DevTools: la tabla existe en el DOM aunque no esté en el HTML.',
        },
        {
          title: 'Lista de tareas',
          html: `
<form id="f"><input id="t" placeholder="Nueva tarea" required> <button>Agregar</button></form>
<ul id="lista"></ul>
<p id="pendientes"></p>`,
          css: `
li { display:flex; gap:8px; align-items:center; padding:4px 0; }
li.hecha span { text-decoration: line-through; color:#7f8b99; }
li button { margin-left:auto; }`,
          js: `
const lista = document.getElementById('lista');

function contar() {
  const total = lista.children.length;
  const hechas = lista.querySelectorAll('.hecha').length;
  document.getElementById('pendientes').textContent = (total - hechas) + ' pendientes de ' + total;
}

document.getElementById('f').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('t');

  const li = document.createElement('li');
  const check = document.createElement('input');
  check.type = 'checkbox';
  const span = document.createElement('span');
  span.textContent = input.value;   // textContent: seguro aunque escriban HTML
  const borrar = document.createElement('button');
  borrar.textContent = 'Borrar';

  check.addEventListener('change', () => { li.classList.toggle('hecha', check.checked); contar(); });
  borrar.addEventListener('click', () => { li.remove(); contar(); });

  li.append(check, span, borrar);
  lista.appendChild(li);
  input.value = '';
  contar();
});
contar();`,
          hint: 'Probá escribir <code>&lt;b&gt;hola&lt;/b&gt;</code> como tarea: se muestra como texto porque usamos <code>textContent</code>.',
        },
      ],
      exercises: [
        {
          official: '#21',
          title: 'Crear una tabla',
          level: 1,
          prompt: `<ul>
            <li>Creá una página <code>index.html</code> con un botón que, en el evento onclick, ejecute una función de JS.</li>
            <li>Usando la API Document, creá los elementos con esta jerarquía: <code>table</code> → <code>thead</code> → <code>tr</code> → <code>th</code> “Número de turno” y <code>th</code> “Nombre de Paciente”; <code>tbody</code> → <code>tr</code> con <code>td</code> “#1” y <code>td</code> “Julian”; otro <code>tr</code> con <code>td</code> “#2” y <code>td</code> “Maria”.</li>
          </ul>`,
          solution: webSol('<p>Esta versión es la más literal: crea cada elemento a mano, en el orden de la jerarquía. El laboratorio de la lección muestra la versión con arrays y <code>forEach</code>, que escala mejor. El enunciado pide <code>onclick</code>: se puede usar el atributo en el HTML o, mejor, <code>addEventListener(\'click\')</code>.</p>', {
            html: `<button id="btn">Crear tabla</button>`,
            js: `function crearTabla() {
  const table = document.createElement('table');

  const thead = document.createElement('thead');
  const trHead = document.createElement('tr');
  const th1 = document.createElement('th');
  th1.textContent = 'Número de turno';
  const th2 = document.createElement('th');
  th2.textContent = 'Nombre de Paciente';
  trHead.append(th1, th2);
  thead.appendChild(trHead);

  const tbody = document.createElement('tbody');
  const fila1 = document.createElement('tr');
  fila1.innerHTML = '<td>#1</td><td>Julian</td>';
  const fila2 = document.createElement('tr');
  fila2.innerHTML = '<td>#2</td><td>Maria</td>';
  tbody.append(fila1, fila2);

  table.append(thead, tbody);
  document.body.appendChild(table);
}

document.getElementById('btn').onclick = crearTabla;`,
          }),
        },
        {
          title: 'Tarjetas desde un array',
          level: 2,
          prompt: '<p>Dado un array de doctores (nombre, especialidad, disponible), generá una tarjeta por doctor dentro de un contenedor. Las tarjetas de doctores no disponibles deben tener la clase <code>no-disponible</code> (gris) y un botón “Pedir turno” deshabilitado. Agregá un botón que alterne entre mostrar todos y solo los disponibles.</p>',
          hints: ['Una función <code>render(soloDisponibles)</code> que vacía el contenedor y vuelve a crear las tarjetas.', '<code>boton.disabled = !doctor.disponible</code>'],
          solution: webSol('<p>Se separa el estado (<code>soloDisponibles</code>) del dibujo (<code>render</code>). Cada vez que cambia el estado se redibuja todo: es simple y es la idea que React automatiza.</p>', {
            html: `<button id="filtro">Ver solo disponibles</button>
<div id="cards" class="cards"></div>`,
            css: `.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 10px; margin-top: 10px; }
.card { border: 1px solid #c9d0c9; border-radius: 10px; padding: 12px; }
.card h3 { margin: 0 0 4px; font-size: 1rem; }
.no-disponible { opacity: .5; }`,
            js: `const doctores = [
  { nombre: 'Dra. Pérez', especialidad: 'Cardiología', disponible: true },
  { nombre: 'Dr. Gómez', especialidad: 'Pediatría', disponible: false },
  { nombre: 'Dra. Ruiz', especialidad: 'Neurología', disponible: true },
];
let soloDisponibles = false;

function render() {
  const cont = document.getElementById('cards');
  cont.replaceChildren();
  doctores
    .filter(d => !soloDisponibles || d.disponible)
    .forEach(d => {
      const card = document.createElement('article');
      card.className = 'card' + (d.disponible ? '' : ' no-disponible');
      const h3 = document.createElement('h3');
      h3.textContent = d.nombre;
      const p = document.createElement('p');
      p.textContent = d.especialidad;
      const btn = document.createElement('button');
      btn.textContent = 'Pedir turno';
      btn.disabled = !d.disponible;
      card.append(h3, p, btn);
      cont.appendChild(card);
    });
}

document.getElementById('filtro').addEventListener('click', (e) => {
  soloDisponibles = !soloDisponibles;
  e.target.textContent = soloDisponibles ? 'Ver todos' : 'Ver solo disponibles';
  render();
});
render();`,
          }),
        },
      ],
      sources: [
        { title: 'Document Object Model (DOM)', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model', points: ['Representa la página como nodos y objetos para que los programas cambien su estructura, estilo y contenido.'] },
        { title: 'Uso del modelo de objetos del documento', url: 'https://developer.mozilla.org/es/docs/Web/API/Document_Object_Model/Using_the_Document_Object_Model', points: ['El navegador crea el árbol DOM al analizar el HTML.', 'La API de documentos permite crear el árbol desde cero o cambiar su contenido.', 'Se accede desde JavaScript con el objeto global <code>document</code>.'] },
        { title: 'Document · MDN', url: 'https://developer.mozilla.org/es/docs/Web/API/Document', points: ['Representa la página cargada y es el punto de entrada al árbol DOM.', 'Ofrece <code>getElementById</code>, <code>querySelector</code>, <code>createElement</code> y más.'] },
      ],
    },

    {
      id: 'eventos',
      module: 'js',
      title: 'Eventos',
      keywords: 'eventos click addeventlistener submit input change keydown preventdefault target bubbling propagacion delegacion domcontentloaded',
      tldr: 'Un evento es <mark>algo que pasa en la página</mark>: un clic, una tecla, un envío de formulario. Con <code>addEventListener</code> le decís a JavaScript qué hacer cuando ocurre.',
      goals: ['Escuchar eventos y usar el objeto Event.', 'Conocer los eventos de mouse, teclado, formulario y ventana.', 'Entender la propagación y usar delegación.', 'Resolver el Ejercicio 22 (menú móvil del TPI).'],
      body: `
        <h2>Escuchar un evento</h2>
        <p>Un evento es una acción o suceso que ocurre en la página y que JavaScript puede detectar y manejar. Cuando pasa, el navegador crea un <mark>objeto Event</mark> con la información de lo que ocurrió (el tipo, el elemento que lo generó, la tecla presionada, la posición del mouse…) y se lo pasa a tu función.</p>
        ${code('js', `const btn = document.querySelector('button');

function manejarClic(e) {
  console.log(e.type);     // 'click'
  console.log(e.target);   // el elemento que lo generó
}

btn.addEventListener('click', manejarClic);
btn.removeEventListener('click', manejarClic);  // dejar de escuchar (necesita la misma función)`)}
        ${note('<strong>Evitá <code>onclick="…"</code> en el HTML.</strong> Mezcla código con estructura, solo permite un manejador por evento y es una mala práctica de seguridad. Preferí <code>addEventListener</code>.')}

        <h2>Los eventos más usados</h2>
        ${table(['Categoría', 'Evento', 'Cuándo'], [
          ['Mouse', '<code>click</code> / <code>dblclick</code>', 'Clic / doble clic'],
          ['', '<code>mouseover</code> / <code>mouseout</code>', 'Entrar / salir de un elemento'],
          ['', '<code>mousemove</code>', 'Mover el mouse'],
          ['', '<code>mousedown</code> / <code>mouseup</code>', 'Presionar / soltar el botón'],
          ['Teclado', '<code>keydown</code> / <code>keyup</code>', 'Se presiona / se suelta una tecla. <code>e.key</code> dice cuál. (<code>keypress</code> está obsoleto)'],
          ['Formulario', '<code>submit</code>', 'Se envía un formulario'],
          ['', '<code>input</code>', 'Cada vez que se escribe en un campo'],
          ['', '<code>change</code>', 'Cambia el valor de un select, checkbox, o un input al salir'],
          ['', '<code>focus</code> / <code>blur</code>', 'Un campo recibe / pierde el foco'],
          ['Ventana / documento', '<code>DOMContentLoaded</code>', 'El HTML está listo (antes de que carguen las imágenes)'],
          ['', '<code>load</code>', 'Terminó de cargar todo'],
          ['', '<code>resize</code> / <code>scroll</code>', 'Cambia el tamaño de la ventana / se hace scroll'],
          ['Otros', 'portapapeles, drag &amp; drop, multimedia, red, dispositivos, animaciones, DOM', '<code>copy</code>, <code>drop</code>, <code>play</code>, <code>online</code>, <code>transitionend</code>…'],
        ])}

        <h2>preventDefault: cancelar lo que haría el navegador</h2>
        <p>Algunos elementos tienen un comportamiento por defecto: un formulario recarga la página al enviarse, un enlace navega. <code>e.preventDefault()</code> lo cancela para que lo manejes vos.</p>
        ${code('js', `form.addEventListener('submit', (e) => {
  e.preventDefault();   // no recargar
  // validar y procesar…
});`)}
        ${lab(0)}

        <h2>Propagación: los eventos suben</h2>
        <p>Cuando hacés clic en un botón que está dentro de un <code>div</code>, el evento se dispara primero en el botón y después <mark>burbujea</mark> hacia arriba: el <code>div</code>, el <code>body</code>, el <code>document</code>. Cualquiera de ellos puede escucharlo.</p>
        <ul>
          <li><code>e.target</code>: el elemento donde <strong>se originó</strong> el evento (el botón).</li>
          <li><code>e.currentTarget</code>: el elemento que tiene el listener que se está ejecutando (el div).</li>
          <li><code>e.stopPropagation()</code>: corta la subida.</li>
        </ul>
        <h3>Delegación de eventos</h3>
        <p>En vez de poner un listener en cada fila de una tabla (y volver a ponerlo cada vez que agregás una), ponés <strong>uno solo en el padre</strong> y preguntás de dónde vino. Funciona incluso para elementos que se crean después.</p>
        ${code('js', `tbody.addEventListener('click', (e) => {
  const boton = e.target.closest('button[data-id]');
  if (!boton) return;                 // el clic no fue en un botón
  borrarPaciente(boton.dataset.id);
});`)}
        ${lab(1)}
      `,
      labs: [
        {
          title: 'Menú hamburguesa del TPI (Ejercicio 22)',
          html: `
<div class="dashboard-container">
  <header>
    <span>Gestor de turnos</span>
    <div><button class="menu" id="menu-btn" aria-expanded="false" aria-controls="sidebar">&#9776;</button><button id="logout">Cerrar Sesión</button></div>
  </header>
  <nav id="sidebar"><ul><li><a href="#">Panel</a></li><li><a href="#">Pacientes</a></li></ul></nav>
  <main><h1>Pacientes</h1><p id="tecla">Hacé clic acá y tocá una tecla…</p></main>
  <footer>Mi Aplicación &copy; 2026</footer>
</div>`,
          css: `
body { margin: 0; }
.dashboard-container { display:grid; grid-template-rows:auto 1fr auto; grid-template-areas:"header" "main" "footer"; height:100dvh; }
.dashboard-container nav { position:absolute; top:50px; bottom:0; width:200px; background:#f4f4f4; left:-200px; transition:left .25s; }
.dashboard-container nav.open { left:0; }   /* la clase que agrega JS */
.dashboard-container nav ul { list-style:none; padding:0; margin:0; }
.dashboard-container nav li { padding:1rem; border-bottom:1px solid #ddd; }
.dashboard-container header { grid-area:header; height:50px; background:#333; color:white; display:flex; align-items:center; justify-content:space-between; padding:0 1rem; }
.dashboard-container header div { display:flex; gap:1rem; }
.dashboard-container main { grid-area:main; padding:1rem; }
.dashboard-container footer { grid-area:footer; background:#333; color:white; text-align:center; padding:1rem; }
@media screen and (min-width: 600px) {
  .dashboard-container { grid-template-columns:200px 1fr; grid-template-areas:"header header" "nav main" "footer footer"; }
  .dashboard-container nav { grid-area:nav; position:static; }
  .dashboard-container header .menu { display:none; }
}`,
          js: `
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menu-btn');
  const nav = document.getElementById('sidebar');

  menuBtn.addEventListener('click', () => {
    const abierto = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', abierto);
  });

  // Si se agranda la pantalla con el menú abierto, lo cerramos
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 600) nav.classList.remove('open');
  });

  document.getElementById('logout').addEventListener('click', () => {
    console.log('Iría a login.html');
  });

  document.addEventListener('keydown', (e) => {
    document.getElementById('tecla').textContent = 'Presionaste: ' + e.key;
    if (e.key === 'Escape') nav.classList.remove('open');
  });
});`,
          hint: 'El botón ☰ solo se ve en pantallas angostas: achicá la ventana del navegador para que el resultado quede debajo del código. La media query de 600px garantiza que el menú solo funcione en móvil.',
        },
        {
          title: 'Propagación y delegación',
          html: `
<div id="caja" class="caja">
  div#caja
  <button id="interno">Botón interno</button>
</div>
<label><input type="checkbox" id="stop"> stopPropagation en el botón</label>

<h3>Delegación</h3>
<ul id="lista"><li>Ana <button data-nombre="Ana">Borrar</button></li></ul>
<button id="agregar">Agregar paciente</button>`,
          css: `.caja { padding:16px; background:#dfe6f1; border-radius:8px; margin-bottom:6px; }`,
          js: `
document.getElementById('interno').addEventListener('click', (e) => {
  console.log('1. botón (target:', e.target.id + ')');
  if (document.getElementById('stop').checked) e.stopPropagation();
});
document.getElementById('caja').addEventListener('click', (e) => {
  console.log('2. div (target:', e.target.id, '| currentTarget:', e.currentTarget.id + ')');
});
document.body.addEventListener('click', () => console.log('3. body'));

// Un solo listener en la lista sirve para los botones que agreguemos después
const lista = document.getElementById('lista');
lista.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-nombre]');
  if (!btn) return;
  console.log('Borrando a', btn.dataset.nombre);
  btn.closest('li').remove();
});

let n = 1;
document.getElementById('agregar').addEventListener('click', () => {
  const nombre = 'Paciente ' + n++;
  const li = document.createElement('li');
  li.textContent = nombre + ' ';
  const b = document.createElement('button');
  b.textContent = 'Borrar';
  b.dataset.nombre = nombre;
  li.appendChild(b);
  lista.appendChild(li);
});`,
          hint: 'Hacé clic en el botón interno: la consola muestra 1, 2 y 3. Marcá el checkbox y repetí. Después agregá pacientes y borralos: funcionan sin listener propio.',
        },
      ],
      exercises: [
        {
          official: '#22',
          title: 'Navbar móvil',
          level: 2,
          prompt: `<ul>
            <li>Cloná <a href="https://github.com/dsw-frt-utn/dsw2026-ej22" target="_blank" rel="noopener">github.com/dsw-frt-utn/dsw2026-ej22</a>.</li>
            <li>Con JavaScript, detectá el clic en el botón de menú.</li>
            <li>Al hacer clic, mostrá u ocultá el menú de navegación.</li>
            <li>Asegurate de que la funcionalidad solo esté activa en resoluciones móviles.</li>
          </ul><p><strong>Importante:</strong> aplicá los estilos de maquetación del TPI. El repo trae <code>dashboard.html</code>, <code>dashboard.js</code>, <code>dashboard_style.css</code>, <code>login.html</code>, <code>login.js</code>, <code>login_style.css</code> y <code>style.css</code>.</p>`,
          hints: ['El README sugiere <code>classList.toggle(\'open\')</code>.', 'En móvil el nav tiene <code>left: -200px</code>: la clase <code>open</code> solo tiene que ponerlo en <code>left: 0</code>.', 'Como en escritorio el botón tiene <code>display: none</code> y el nav es <code>static</code>, la clase no tiene efecto ahí: eso cumple el “solo en móvil”.'],
          solution: webSol('<p>Tres cambios sobre el repo: (1) un <code>id</code> en el botón del menú (el repo solo tiene la clase <code>menu</code>), (2) una regla <code>.open</code> en el CSS y (3) el listener en <code>dashboard.js</code>, dentro del <code>DOMContentLoaded</code> que ya existe. El laboratorio “Menú hamburguesa del TPI” de esta lección es esta misma solución funcionando.</p>', {
            html: `<!-- dashboard.html: solo cambia el botón -->
<button class="menu" id="menu-btn" aria-controls="sidebar" aria-expanded="false">&#9776;</button>`,
            css: `/* dashboard_style.css: agregar debajo de la regla del nav */
.dashboard-container nav {
  transition: left 0.25s;
}
.dashboard-container nav.open {
  left: 0;
}`,
            js: `document.addEventListener('DOMContentLoaded', () => {
  const logoutButton = document.getElementById('logout');
  logoutButton.addEventListener('click', () => {
    window.location.href = 'login.html';
  });

  const menuBtn = document.getElementById('menu-btn');
  const nav = document.getElementById('sidebar');

  menuBtn.addEventListener('click', () => {
    const abierto = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', abierto);
  });

  // Por si se agranda la pantalla con el menú abierto
  window.addEventListener('resize', () => {
    if (window.matchMedia('(min-width: 600px)').matches) {
      nav.classList.remove('open');
    }
  });
});`,
          }, { htmlName: 'dashboard.html', cssName: 'dashboard_style.css', jsName: 'dashboard.js' }),
        },
        {
          title: 'Contador de caracteres',
          level: 1,
          prompt: '<p>Hacé un <code>textarea</code> para observaciones con un máximo de 100 caracteres. Debajo mostrá “X / 100” que se actualice mientras se escribe, y que se ponga rojo a partir de 90.</p>',
          solution: webSol('<p>El evento <code>input</code> se dispara con cada tecla (y también al pegar). <code>classList.toggle(clase, condición)</code> agrega o quita según el booleano.</p>', {
            html: `<label for="obs">Observaciones</label>
<textarea id="obs" maxlength="100" rows="3"></textarea>
<p id="cuenta">0 / 100</p>`,
            css: `textarea { width: 100%; font: inherit; } .casi { color: crimson; font-weight: bold; }`,
            js: `const obs = document.getElementById('obs');
const cuenta = document.getElementById('cuenta');

obs.addEventListener('input', () => {
  const n = obs.value.length;
  cuenta.textContent = n + ' / 100';
  cuenta.classList.toggle('casi', n >= 90);
});`,
          }),
        },
        {
          title: 'Atajos de teclado',
          level: 2,
          prompt: '<p>En una página con una lista de pacientes, implementá: <kbd>/</kbd> enfoca el buscador, <kbd>Esc</kbd> lo limpia y le saca el foco, y las flechas <kbd>↑</kbd> <kbd>↓</kbd> mueven una selección resaltada por la lista. Las flechas no deben funcionar mientras se escribe en el buscador.</p>',
          hints: ['Escuchá <code>keydown</code> en <code>document</code>.', '<code>e.target.matches(\'input\')</code> te dice si el foco está en el input.', 'Llamá a <code>e.preventDefault()</code> con <kbd>/</kbd> para que no se escriba la barra.'],
          solution: webSol('<p>Un único listener en <code>document</code> decide según <code>e.key</code>. El índice seleccionado es el estado; <code>render</code> lo refleja en las clases.</p>', {
            html: `<input id="q" placeholder="Apretá / para buscar">
<ul id="lista"><li>Ana</li><li>Luis</li><li>Sol</li><li>Tomás</li></ul>`,
            css: `li.sel { background: #f5db6b; } li { padding: 4px 8px; }`,
            js: `const q = document.getElementById('q');
const items = [...document.querySelectorAll('#lista li')];
let sel = 0;

function render() {
  items.forEach((li, i) => li.classList.toggle('sel', i === sel));
}

document.addEventListener('keydown', (e) => {
  const escribiendo = e.target.matches('input');
  if (e.key === '/' && !escribiendo) {
    e.preventDefault();
    q.focus();
  } else if (e.key === 'Escape') {
    q.value = '';
    q.blur();
  } else if (!escribiendo && e.key === 'ArrowDown') {
    sel = Math.min(sel + 1, items.length - 1);
    render();
  } else if (!escribiendo && e.key === 'ArrowUp') {
    sel = Math.max(sel - 1, 0);
    render();
  }
});
render();`,
          }),
        },
      ],
      sources: [
        { title: 'Introducción a los eventos', url: 'https://developer.mozilla.org/es/docs/Learn_web_development/Core/Scripting/Events', points: ['Los eventos son señales del navegador cuando pasa algo (clic, tecla, carga).', '<code>addEventListener()</code> es el mecanismo recomendado.', 'Evitar manejadores en línea en el HTML.', 'El objeto evento trae información; <code>e.target</code> es el elemento exacto.', '<code>preventDefault()</code> evita el comportamiento por defecto.'] },
        { title: 'Event bubbling · MDN', url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling', points: ['El evento se dispara en el elemento interno y luego sube por sus ancestros.', 'La captura es el recorrido inverso; se activa con <code>{ capture: true }</code>.', '<code>target</code> es donde se originó; <code>currentTarget</code>, donde está el listener.', '<code>stopPropagation()</code> corta la propagación.', 'Delegación: un listener en el padre maneja los eventos de muchos hijos.'] },
        { title: 'Repositorio del Ejercicio 22', url: 'https://github.com/dsw-frt-utn/dsw2026-ej22', points: ['Base del TPI: login y dashboard con estilos de maquetación.', 'Pide abrir el nav desde el botón en modo móvil, con <code>classList.toggle</code>.'] },
      ],
    },

    {
      id: 'errores',
      module: 'js',
      title: 'Manejo de errores',
      keywords: 'errores try catch finally throw error typeerror referenceerror syntaxerror excepciones validacion',
      tldr: 'Cuando algo sale mal, JavaScript <mark>lanza un error</mark> y, si nadie lo atrapa, el script se detiene. Con <code>try/catch</code> lo capturás y decidís qué hacer: mostrar un mensaje, reintentar o seguir.',
      goals: ['Leer los tipos de error más comunes.', 'Capturar errores con try, catch y finally.', 'Lanzar tus propios errores con throw.'],
      body: `
        <h2>Los errores que más vas a ver</h2>
        ${table(['Error', 'Cuándo', 'Ejemplo'], [
          ['<code>ReferenceError</code>', 'Usás una variable o función que no existe', '<code>totl + 1</code> (error de tipeo)'],
          ['<code>TypeError</code>', 'Hacés algo que ese tipo de valor no permite', '<code>null.textContent</code>, llamar a algo que no es función'],
          ['<code>SyntaxError</code>', 'El código está mal escrito', 'Falta una llave, o <code>JSON.parse("{mal}")</code>'],
          ['<code>RangeError</code>', 'Un número fuera de rango', '<code>new Array(-1)</code>'],
        ])}
        <p>El mensaje siempre dice <strong>qué</strong> pasó y <strong>dónde</strong> (archivo y línea). Leelo entero antes de cambiar código al azar.</p>

        <h2>try, catch y finally</h2>
        ${code('js', `try {
  // código que puede fallar
  const datos = JSON.parse(texto);
  mostrar(datos);
} catch (error) {
  // solo se ejecuta si algo falló adentro del try
  console.error(error.name, error.message);
  mostrarMensaje('No se pudieron leer los datos');
} finally {
  // se ejecuta SIEMPRE, haya error o no: ideal para limpiar
  ocultarSpinner();
}`)}
        <ul>
          <li>Tiene que haber al menos un <code>catch</code> o un <code>finally</code>.</li>
          <li>El <code>catch</code> recibe el objeto error, con <code>name</code>, <code>message</code> y <code>stack</code>. Si no lo necesitás, podés escribir <code>catch { … }</code>.</li>
          <li>Los <code>try/catch</code> se pueden anidar.</li>
        </ul>
        ${note('<strong>No atrapes por atrapar.</strong> Un <code>catch</code> vacío esconde bugs. Atrapá donde podés hacer algo útil (avisar al usuario, usar un valor por defecto) y dejá que el resto falle de forma visible.', 'warn')}
        ${lab(0)}

        <h2>Lanzar tus propios errores</h2>
        <p>Con <code>throw</code> cortás la ejecución cuando algo no tiene sentido. Lanzá siempre un objeto <code>Error</code> (no un string), así conservás el stack.</p>
        ${code('js', `function crearTurno(paciente, hora) {
  if (!paciente) throw new Error('El paciente es obligatorio');
  if (hora < 8 || hora > 20) throw new RangeError('Horario fuera de atención');
  return { paciente, hora };
}

// Errores propios con más información
class ValidationError extends Error {
  constructor(campo, mensaje) {
    super(mensaje);
    this.name = 'ValidationError';
    this.campo = campo;
  }
}`)}

        <h2>Errores y asincronía</h2>
        <p>Un <code>try/catch</code> común <strong>no</strong> atrapa errores de un callback que se ejecuta después (un <code>setTimeout</code>, un <code>.then</code>). Con promesas se usa <code>.catch()</code>, y con <code>async/await</code> vuelve a funcionar el <code>try/catch</code> de siempre. Lo vas a ver en las próximas lecciones.</p>
        ${lab(1)}
      `,
      labs: [
        {
          title: 'Validar JSON sin romper la página',
          html: `
<label for="t">Pegá un JSON:</label>
<textarea id="t" rows="4">{"nombre": "Ana", "edad": 30}</textarea>
<p id="res"></p>`,
          css: `textarea { width:100%; font-family:monospace; } .ok { color:#2f7a55; } .mal { color:#c0392b; }`,
          js: `
const t = document.getElementById('t');
const res = document.getElementById('res');

function revisar() {
  try {
    const obj = JSON.parse(t.value);
    res.className = 'ok';
    res.textContent = 'JSON válido con ' + Object.keys(obj).length + ' claves.';
  } catch (error) {
    res.className = 'mal';
    res.textContent = error.name + ': ' + error.message;
  } finally {
    console.log('Revisado a las', new Date().toLocaleTimeString());
  }
}

t.addEventListener('input', revisar);
revisar();`,
          hint: 'Borrá una comilla o poné comillas simples: el error se muestra en la página y el resto sigue funcionando.',
        },
        {
          title: 'throw con errores propios',
          html: `
<form id="f" novalidate>
  <input id="paciente" placeholder="Paciente">
  <input id="hora" type="number" placeholder="Hora (8 a 20)">
  <button>Crear turno</button>
</form>
<p id="msg"></p>`,
          css: `#msg { font-weight:bold; }`,
          js: `
class ValidationError extends Error {
  constructor(campo, mensaje) {
    super(mensaje);
    this.name = 'ValidationError';
    this.campo = campo;
  }
}

function crearTurno(paciente, hora) {
  if (!paciente.trim()) throw new ValidationError('paciente', 'El paciente es obligatorio');
  if (!(hora >= 8 && hora <= 20)) throw new ValidationError('hora', 'Atendemos de 8 a 20 h');
  return { paciente, hora };
}

document.getElementById('f').addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = document.getElementById('msg');
  try {
    const turno = crearTurno(
      document.getElementById('paciente').value,
      Number(document.getElementById('hora').value)
    );
    msg.style.color = '#2f7a55';
    msg.textContent = 'Turno creado: ' + JSON.stringify(turno);
  } catch (err) {
    if (err instanceof ValidationError) {
      msg.style.color = '#c0392b';
      msg.textContent = err.message;
      document.getElementById(err.campo).focus();
    } else {
      throw err; // un error que no esperábamos: que se vea
    }
  }
});`,
          hint: 'El error lleva el campo que falló, así el catch puede enfocarlo. Probá con la hora vacía y con 22.',
        },
      ],
      exercises: [
        {
          title: 'División segura',
          level: 1,
          prompt: '<p>Escribí <code>dividir(a, b)</code> que lance un <code>TypeError</code> si alguno no es número y un <code>RangeError</code> si <code>b</code> es 0. Llamala desde una función que la envuelva en <code>try/catch</code> y muestre un mensaje distinto según el tipo de error.</p>',
          solution: webSol('<p><code>instanceof</code> distingue el tipo de error en el <code>catch</code>. Validar con <code>Number.isFinite</code> descarta strings, <code>NaN</code> e <code>Infinity</code>.</p>', {
            html: '<pre id="out"></pre>',
            js: `function dividir(a, b) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) throw new TypeError('Ambos valores deben ser números');
  if (b === 0) throw new RangeError('No se puede dividir por cero');
  return a / b;
}

function probar(a, b) {
  try {
    return a + ' / ' + b + ' = ' + dividir(a, b);
  } catch (e) {
    if (e instanceof RangeError) return 'Cuidado: ' + e.message;
    if (e instanceof TypeError) return 'Dato inválido: ' + e.message;
    throw e;
  }
}

document.getElementById('out').textContent =
  [probar(10, 2), probar(5, 0), probar('8', 2)].join('\\n');`,
          }),
        },
        {
          title: 'Configuración con valor por defecto',
          level: 2,
          prompt: '<p>Escribí <code>leerPreferencias()</code> que lea un JSON guardado en un string (simulando localStorage). Si no existe o está corrupto, devolvé <code>{ tema: \'claro\', tamano: 16 }</code> sin que la página se rompa, y avisá por <code>console.warn</code> solo cuando estaba corrupto.</p>',
          solution: webSol('<p>Se distinguen dos casos: “no hay nada” (normal, sin aviso) y “hay algo inválido” (se avisa). El spread combina los valores por defecto con los guardados, por si faltaba alguna clave.</p>', {
            html: '<pre id="out"></pre>',
            js: `const POR_DEFECTO = { tema: 'claro', tamano: 16 };

function leerPreferencias(guardado) {
  if (!guardado) return { ...POR_DEFECTO };
  try {
    return { ...POR_DEFECTO, ...JSON.parse(guardado) };
  } catch {
    console.warn('Preferencias corruptas, se usan las de fábrica');
    return { ...POR_DEFECTO };
  }
}

document.getElementById('out').textContent = [
  JSON.stringify(leerPreferencias(null)),
  JSON.stringify(leerPreferencias('{"tema":"oscuro"}')),
  JSON.stringify(leerPreferencias('{tema: oscuro')),
].join('\\n');`,
          }),
        },
      ],
      sources: [
        { title: 'try...catch · MDN', url: 'https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/try...catch', points: ['<code>try</code> marca el bloque a intentar; tiene que haber al menos un <code>catch</code> o un <code>finally</code>.', '<code>catch</code> recibe el objeto de error.', '<code>finally</code> se ejecuta siempre: útil para limpieza.', 'Se pueden anidar.'] },
      ],
    },
  );
})();

// La solución del Ejercicio 22 se prueba sobre el dashboard completo del TPI (el mismo del laboratorio)
(() => {
  const ev = window.GUIDE.LESSONS.find((l) => l.id === 'eventos');
  ev.exercises.find((e) => e.official === '#22').solution.run = { ...ev.labs[0] };
})();
