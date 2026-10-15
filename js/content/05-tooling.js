/* Módulo: entorno moderno (módulos, Node, npm, Vite) */
(() => {
  const { code, table, note, lab, filesSol } = window.GUIDE.h;

  window.GUIDE.LESSONS.push(
    {
      id: 'modulos-es',
      module: 'tooling',
      title: 'Módulos de JavaScript: import y export',
      keywords: 'modulos import export default named es modules type module scope',
      tldr: 'Los módulos dividen un programa en <mark>archivos que exportan e importan</mark> lo que necesitan. Son la base de cualquier proyecto con Vite y React: cada componente es un módulo.',
      goals: ['Exportar e importar con nombre y por defecto.', 'Entender por qué cada módulo tiene su propio scope.', 'Usar módulos en el navegador y leer imports de librerías.'],
      body: `
        <h2>El problema que resuelven</h2>
        <p>En la Unidad 4, si tenés <code>storage.js</code> y <code>dashboard.js</code>, todo lo que declarás queda en el ámbito global: cualquier archivo puede pisar las variables de otro, y el orden de los <code>&lt;script&gt;</code> importa. Con módulos, cada archivo tiene <strong>su propio scope</strong> y declara explícitamente qué comparte y qué usa.</p>

        <h2>Exportar</h2>
        ${code('js', `// storage.js
const KEY = 'specialties';            // privado: no se exporta

export function getSpecialties() {    // export con nombre
  return JSON.parse(localStorage.getItem(KEY)) ?? [];
}

export function addSpecialty(s) { /* … */ }

export const MAX_NAME = 15;`, 'storage.js')}
        ${code('js', `// Button.jsx: un export por defecto (uno solo por archivo)
export default function Button({ children }) {
  return <button>{children}</button>;
}`, 'Button.jsx')}

        <h2>Importar</h2>
        ${code('js', `import { getSpecialties, addSpecialty } from './storage.js';  // con nombre: llaves y mismo nombre
import Button from './Button.jsx';                             // por defecto: sin llaves, el nombre lo elegís vos
import { getSpecialties as listar } from './storage.js';      // renombrar
import * as storage from './storage.js';                      // todo junto: storage.getSpecialties()
import { useState } from 'react';                             // de una librería instalada (sin ./)
import './index.css';                                         // solo por su efecto (Vite inyecta el CSS)`)}
        ${table(['', 'Export con nombre', 'Export por defecto'], [
          ['Cuántos por archivo', 'Los que quieras', 'Uno'],
          ['Al importar', '<code>import { x } from</code>, nombre exacto', '<code>import x from</code>, cualquier nombre'],
          ['Típico para', 'Funciones de servicios, helpers, constantes', 'El componente principal del archivo'],
        ])}
        ${note('<strong>Rutas:</strong> los imports que empiezan con <code>./</code> o <code>../</code> son archivos tuyos. Los que no (como <code>\'react\'</code> o <code>\'axios\'</code>) son paquetes instalados en <code>node_modules</code>. Vite permite omitir la extensión <code>.js</code>/<code>.jsx</code>; el navegador sin Vite, no.')}

        <h2>Módulos en el navegador</h2>
        ${code('html', `<script type="module" src="main.js"></script>`)}
        <ul>
          <li>Se ejecutan en modo estricto y diferidos (como <code>defer</code>), una sola vez aunque se importen en varios lugares.</li>
          <li>Necesitan servirse por HTTP: con doble clic (<code>file://</code>) fallan por CORS. Vite resuelve esto (y mucho más).</li>
          <li><code>import()</code> como función carga un módulo bajo demanda y devuelve una Promise: así se “parte” una app grande para que cargue más rápido.</li>
        </ul>
        ${lab(0)}
      `,
      labs: [
        {
          mode: 'react',
          title: 'Imports reales de una librería',
          jsx: `
// Este laboratorio funciona como un módulo de verdad:
// 'react' se resuelve desde internet con un import map, como haría Vite desde node_modules.
import { useState } from 'react';
import axios from 'axios';

export default function App() {
  const [titulo, setTitulo] = useState('Apretá el botón');

  async function cargar() {
    const { data } = await axios.get('https://jsonplaceholder.typicode.com/todos/1');
    setTitulo(data.title);
  }

  return (
    <>
      <p>{titulo}</p>
      <button onClick={cargar}>Traer una tarea con axios</button>
    </>
  );
}`,
          hint: 'Probá cambiar <code>import { useState }</code> por <code>import useState</code> (sin llaves): falla, porque <code>useState</code> es un export con nombre.',
        },
      ],
      exercises: [
        {
          title: 'Separá en módulos',
          level: 2,
          prompt: '<p>Tenés un único <code>app.js</code> con: una función <code>formatearPrecio(n)</code>, un array <code>productos</code> y el código que dibuja la lista. Reorganizalo en tres archivos: <code>format.js</code> (export con nombre), <code>data.js</code> (export por defecto del array) y <code>main.js</code> que importe ambos. Escribí también la etiqueta <code>&lt;script&gt;</code> del HTML.</p>',
          solution: filesSol('<p>Cada archivo exporta lo suyo y <code>main.js</code> es el único que conoce a los demás. El HTML solo carga <code>main.js</code> con <code>type="module"</code>: el navegador sigue los imports solo.</p>', [
            { name: 'format.js', lang: 'js', code: `export function formatearPrecio(n) {
  return n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
}` },
            { name: 'data.js', lang: 'js', code: `const productos = [
  { nombre: 'Mouse', precio: 12000 },
  { nombre: 'Teclado', precio: 25000 },
];
export default productos;` },
            { name: 'main.js', lang: 'js', code: `import productos from './data.js';
import { formatearPrecio } from './format.js';

document.getElementById('lista').innerHTML = productos
  .map((p) => '<li>' + p.nombre + ': ' + formatearPrecio(p.precio) + '</li>')
  .join('');` },
            { name: 'index.html', lang: 'html', code: `<ul id="lista"></ul>
<script type="module" src="main.js"></script>` },
          ]),
        },
      ],
      sources: [
        { title: 'Módulos JavaScript · MDN', url: 'https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Modules', points: ['Dividen programas grandes en archivos que se importan y exportan.', 'En el navegador se usan con <code>type="module"</code>.', 'Exportaciones con nombre y por defecto (una sola por módulo).', 'Se puede renombrar con <code>as</code> o importar todo con <code>import * as</code>.', 'Son estrictos, diferidos, se ejecutan una vez y requieren servidor.', '<code>import()</code> carga módulos dinámicamente y devuelve una Promise.'] },
      ],
    },

    {
      id: 'node-npm',
      module: 'tooling',
      title: 'Node.js, npm y package.json',
      keywords: 'node npm yarn pnpm package.json dependencies devdependencies scripts semver versiones lock node_modules',
      tldr: '<mark>Node.js</mark> ejecuta JavaScript fuera del navegador. En frontend no lo usamos como backend, sino como entorno para <mark>instalar librerías con npm</mark> y ejecutar herramientas como Vite.',
      goals: ['Instalar Node y usar npm para manejar dependencias.', 'Leer y editar un package.json.', 'Entender las versiones semver y los rangos ^ y ~.'],
      body: `
        <h2>Node.js</h2>
        <ul>
          <li>Es un <strong>runtime</strong> de JavaScript que funciona fuera del navegador (usa el mismo motor V8 que Chrome).</li>
          <li>Permite ejecutar JS en la terminal y usar herramientas modernas de desarrollo.</li>
          <li>En frontend no se usa como backend: es el entorno para instalar librerías y ejecutar scripts.</li>
        </ul>
        ${code('bash', `node --version     # comprobar la instalación (usá una versión LTS)
npm --version
node archivo.js    # ejecutar un script`)}

        <h2>npm, yarn, pnpm</h2>
        <p>Son <strong>gestores de dependencias</strong>: instalan librerías de terceros (y las dependencias de esas librerías) y trabajan sobre el archivo <code>package.json</code>. npm viene con Node; yarn y pnpm son alternativas más rápidas con los mismos conceptos. Los paquetes se buscan en <a href="https://www.npmjs.com/" target="_blank" rel="noopener">npmjs.com</a>.</p>
        ${code('bash', `npm install                 # instala todo lo que dice package.json (abreviado: npm i)
npm install axios           # agrega una dependencia
npm install -D eslint       # agrega una devDependency
npm uninstall axios         # la quita
npm run dev                 # ejecuta el script "dev"
npx serve                   # ejecuta un paquete sin instalarlo`)}

        <h2>package.json</h2>
        <p>El archivo central del proyecto. Este es el del proyecto base de la Unidad 5:</p>
        ${code('json', `{
  "name": "unidad-5",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.13.2",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-hook-form": "^7.65.0",
    "react-router-dom": "^7.9.4",
    "tailwindcss": "^4.1.14"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.1.14",
    "@vitejs/plugin-react": "^5.0.3",
    "eslint": "^9.36.0",
    "vite": "^7.1.7"
  }
}`, 'package.json')}
        ${table(['Sección', 'Qué contiene'], [
          ['<code>scripts</code>', 'Comandos que se ejecutan con <code>npm run &lt;nombre&gt;</code>'],
          ['<code>dependencies</code>', 'Paquetes necesarios para que la aplicación funcione. Van a ser parte del bundle final'],
          ['<code>devDependencies</code>', 'Paquetes solo para desarrollo: bundler, linters, tests'],
          ['<code>"type": "module"</code>', 'Los archivos .js usan <code>import</code>/<code>export</code>'],
        ])}
        <p>Hay más secciones posibles (<code>engines</code>, <code>author</code>, <code>license</code>…), pero estas son las que vas a tocar.</p>

        <h2>node_modules y package-lock.json</h2>
        <ul>
          <li><code>node_modules/</code>: donde se instalan físicamente las dependencias. Puede pesar cientos de MB. <strong>No se versiona</strong> (está en <code>.gitignore</code>): cualquiera lo regenera con <code>npm install</code>.</li>
          <li><code>package-lock.json</code>: la versión “congelada” de cada dependencia instalada, incluidas las indirectas. Asegura que todos los que instalen el proyecto tengan exactamente lo mismo. <strong>Sí se versiona</strong>.</li>
        </ul>

        <h2>Versiones: semver</h2>
        <p>Las librerías siguen el estándar <strong>Semantic Versioning</strong>: <code>MAJOR.MINOR.PATCH</code>.</p>
        <ul>
          <li><mark>MAJOR</mark>: cambios grandes o incompatibles (puede romper tu código).</li>
          <li><mark>MINOR</mark>: funcionalidades nuevas, compatibles.</li>
          <li><mark>PATCH</mark>: correcciones de errores.</li>
        </ul>
        ${table(['Notación', 'Ejemplo', 'Significado', 'Instala'], [
          ['Exacta', '<code>"1.2.3"</code>', 'Solo esa versión', '1.2.3'],
          ['Circunflejo <code>^</code>', '<code>"^1.2.3"</code>', 'Actualiza MINOR y PATCH, no MAJOR', '&gt;=1.2.3 &lt;2.0.0'],
          ['Tilde <code>~</code>', '<code>"~1.2.3"</code>', 'Solo PATCH dentro del mismo MINOR', '&gt;=1.2.3 &lt;1.3.0'],
          ['Asterisco', '<code>"*"</code>', 'Cualquier versión', 'La última'],
          ['Mayor que', '<code>"&gt;1.2.3"</code>', 'Más nuevas que esa', '&gt;1.2.3'],
          ['Menor que', '<code>"&lt;2.0.0"</code>', 'Anteriores a esa', '&lt;2.0.0'],
          ['Rango', '<code>"&gt;=1.2.3 &lt;2.0.0"</code>', 'Un rango específico', 'Ej.: 1.2.3, 1.5.0, 1.9.9'],
          ['latest', '<code>"latest"</code>', 'La última publicada en npm', 'La última'],
          ['Pre-release', '<code>"1.2.3-beta.1"</code>', 'Versión preliminar (alpha, beta, rc)', '1.2.3-beta.1'],
        ])}
        ${note('<strong>¿Por qué ^ es el default?</strong> Te da correcciones y mejoras sin romper nada (en teoría). El <code>package-lock.json</code> igual fija la versión exacta instalada, así que nadie recibe una sorpresa hasta que corra <code>npm update</code>.')}
      `,
      exercises: [
        {
          title: 'Leé el package.json',
          level: 1,
          prompt: '<p>Con el package.json de la lección: (a) ¿Qué comando levanta el servidor de desarrollo? (b) ¿Por qué <code>vite</code> está en devDependencies y <code>react</code> en dependencies? (c) Si hoy salió <code>axios 1.14.0</code> y <code>axios 2.0.0</code>, ¿cuál instalaría un <code>npm install</code> limpio, sin lock? (d) ¿Qué subís a git: node_modules, package.json, package-lock.json?</p>',
          solution: { explain: '<ul><li>(a) <code>npm run dev</code>.</li><li>(b) Vite solo se usa para desarrollar y compilar; el código de React, en cambio, viaja dentro del bundle que usa el usuario final.</li><li>(c) <code>1.14.0</code>: <code>^1.13.2</code> acepta cualquier 1.x mayor o igual a 1.13.2, pero nunca 2.0.0.</li><li>(d) <code>package.json</code> y <code>package-lock.json</code> sí; <code>node_modules</code> no (se regenera con <code>npm install</code>).</li></ul>' },
        },
        {
          title: 'Tu propio script',
          level: 2,
          prompt: '<p>En un proyecto nuevo (<code>npm init -y</code>), creá un archivo <code>saludo.js</code> que imprima la fecha actual y un saludo, y agregá un script <code>"saludar"</code> en package.json para ejecutarlo con <code>npm run saludar</code>. Después instalá <code>dayjs</code> y usalo para formatear la fecha como “15/10/2026 22:30”.</p>',
          solution: filesSol('<p><code>npm init -y</code> crea un package.json básico. Con <code>"type": "module"</code> podés usar <code>import</code> en Node. <code>npm install dayjs</code> la agrega a dependencies.</p>', [
            { name: 'terminal', lang: 'bash', code: `mkdir saludo && cd saludo
npm init -y
npm install dayjs
npm run saludar` },
            { name: 'package.json (partes relevantes)', lang: 'json', code: `{
  "type": "module",
  "scripts": {
    "saludar": "node saludo.js"
  },
  "dependencies": {
    "dayjs": "^1.11.13"
  }
}` },
            { name: 'saludo.js', lang: 'js', code: `import dayjs from 'dayjs';

console.log('¡Hola desde Node!');
console.log('Ahora es', dayjs().format('DD/MM/YYYY HH:mm'));` },
          ]),
        },
      ],
      sources: [
        { title: 'package.json · npm Docs', url: 'https://docs.npmjs.com/cli/v10/configuring-npm/package-json', points: ['<code>scripts</code>: comandos que se ejecutan en distintos momentos del ciclo de vida.', '<code>dependencies</code>: paquetes y rangos de versión para producción.', '<code>devDependencies</code>: herramientas de desarrollo.', '<code>^</code> = “compatible con”; <code>~</code> = “aproximadamente equivalente a”.'] },
        { title: 'npm', url: 'https://www.npmjs.com/', points: ['El registro público donde se publican y buscan los paquetes de JavaScript.'] },
      ],
    },

    {
      id: 'vite',
      module: 'tooling',
      title: 'Vite: crear, configurar y servir',
      keywords: 'vite bundler dev build hmr proxy create vite estructura env variables import.meta.env modo',
      tldr: 'Vite es un <mark>bundler moderno y muy rápido</mark>: en desarrollo levanta un servidor con recarga instantánea, y para producción empaqueta todo optimizado. Con configuraciones mínimas.',
      goals: ['Crear un proyecto React con Vite y recorrer su estructura.', 'Configurar un proxy hacia el backend.', 'Usar variables de entorno con import.meta.env.'],
      body: `
        <h2>Qué es y cómo te ayuda</h2>
        <ul>
          <li>Funciona como <strong>servidor de desarrollo</strong> (<code>npm run dev</code>) con HMR (Hot Module Replacement): guardás un archivo y el cambio aparece sin recargar ni perder el estado.</li>
          <li>Funciona como <strong>empaquetador</strong> para producción (<code>npm run build</code>).</li>
          <li>Es uno de los bundlers más rápidos que existen y soporta ES Modules nativos.</li>
          <li>Gestiona librerías de terceros, trabaja como servidor web, permite configurar un proxy, ejecutar tests (con Vitest) y generar el bundle para desplegar.</li>
        </ul>

        <h2>Crear un proyecto</h2>
        ${code('bash', `npm create vite@latest
# Si pide instalar algo extra (suele pasar la primera vez), respondé "y"
# 1. Nombre del proyecto
# 2. Framework: React
# 3. Variante: JavaScript
# 4. Instalar con npm: sí
# Esperar…
cd mi-proyecto
npm run dev       # → http://localhost:5173`)}

        <h2>Qué contiene</h2>
        ${code('text', `mi-proyecto/
├── node_modules/       dependencias instaladas (NO se versiona)
├── public/             archivos estáticos que no se procesan (favicon, robots.txt)
├── src/                tu código React
│   ├── main.jsx        punto de entrada de JS: monta <App /> en #root
│   ├── App.jsx         el componente raíz
│   └── index.css
├── index.html          punto de entrada: tiene <div id="root">
├── vite.config.js      configuración de Vite
├── eslint.config.js    reglas de ESLint
├── package.json
└── package-lock.json`)}
        ${table(['Archivo', 'Para qué'], [
          ['<code>index.html</code>', 'Punto de entrada. Aunque React controle la interfaz, este archivo define el <code>&lt;div id="root"&gt;</code> donde se monta la app'],
          ['<code>src/main.jsx</code>', 'Busca <code>#root</code> y renderiza <code>&lt;App /&gt;</code> adentro, envuelto en <code>&lt;StrictMode&gt;</code>'],
          ['<code>eslint.config.js</code>', 'ESLint revisa tu código y marca errores de estilo o malas prácticas (por ejemplo, dependencias faltantes en useEffect)'],
          ['<code>vite.config.js</code>', 'Configuración del bundler que compila y levanta el servidor'],
        ])}
        ${code('jsx', `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);`, 'src/main.jsx')}

        <h2>Configurar un proxy</h2>
        <p>Tu frontend corre en <code>localhost:5173</code> y el backend en otro puerto. Por CORS, el navegador bloquearía los pedidos. El proxy hace que los pedidos a <code>/api</code> pasen por Vite, que los reenvía al backend: para el navegador, todo es el mismo origen.</p>
        ${code('js', `import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const target = env.VITE_BACKEND_URL || 'http://localhost:5001/';

  return defineConfig({
    server: {
      proxy: {
        '/api': {
          target,              // a dónde reenviar
          changeOrigin: true,  // cambia la cabecera Host al del backend
          secure: false,       // acepta certificados HTTPS de desarrollo
        },
      },
    },
    plugins: [react(), tailwindcss()],
  });
};`, 'vite.config.js (proyecto de la cátedra)')}
        <p>Con esto, <code>fetch('/api/auth/login')</code> desde el navegador termina en <code>http://localhost:5142/api/auth/login</code>.</p>

        <h2>Variables de entorno</h2>
        ${code('text', `VITE_BACKEND_URL=http://localhost:5142/`, '.env.development')}
        <ul>
          <li>Vite carga <code>.env</code> (siempre), <code>.env.local</code> (tuyo, ignorado por git), <code>.env.[modo]</code> y <code>.env.[modo].local</code>. Los específicos del modo tienen prioridad.</li>
          <li><code>npm run dev</code> corre en modo <code>development</code>; <code>npm run build</code> en <code>production</code>.</li>
          <li>Solo las variables con prefijo <mark>VITE_</mark> llegan a tu código, en <code>import.meta.env</code>. Es una protección: así no exponés por error una contraseña del servidor.</li>
          <li>También hay constantes incorporadas: <code>import.meta.env.MODE</code>, <code>DEV</code>, <code>PROD</code>, <code>BASE_URL</code>.</li>
        </ul>
        ${code('js', `console.log(import.meta.env.VITE_BACKEND_URL);  // 'http://localhost:5142/'
console.log(import.meta.env.DB_PASSWORD);       // undefined: no tiene prefijo VITE_`)}
        ${note('<strong>Todo lo que llega al frontend es público.</strong> Cualquiera puede ver el bundle. Nunca pongas claves secretas en variables <code>VITE_</code>.', 'warn')}
      `,
      exercises: [
        {
          title: 'Tu primer proyecto Vite',
          level: 1,
          prompt: '<p>Creá un proyecto React con Vite, levantalo, y: (1) cambiá el título de la pestaña en <code>index.html</code>; (2) reemplazá el contenido de <code>App.jsx</code> por un <code>h1</code> con tu nombre; (3) creá un <code>.env.development</code> con <code>VITE_APP_NAME=Gestor de turnos</code> y mostrala en la página. Fijate qué pasa al guardar (HMR) y qué pasa si cambiás el .env sin reiniciar.</p>',
          solution: filesSol('<p>Los cambios en componentes se ven al instante por HMR. Los cambios en <code>.env</code> o <code>vite.config.js</code> requieren reiniciar <code>npm run dev</code>, porque se leen al arrancar.</p>', [
            { name: 'terminal', lang: 'bash', code: `npm create vite@latest turnos -- --template react
cd turnos
npm install
npm run dev` },
            { name: '.env.development', lang: 'text', code: 'VITE_APP_NAME=Gestor de turnos' },
            { name: 'src/App.jsx', lang: 'jsx', code: `function App() {
  return (
    <main>
      <h1>Hola, soy Fran</h1>
      <p>{import.meta.env.VITE_APP_NAME}</p>
    </main>
  );
}

export default App;` },
          ]),
        },
        {
          title: 'Proxy hacia una API',
          level: 2,
          prompt: '<p>Configurá el proxy de Vite para que <code>/api</code> vaya a <code>https://jsonplaceholder.typicode.com</code> quitando el prefijo <code>/api</code> (es decir, <code>/api/users</code> → <code>/users</code>). Después hacé un <code>fetch(\'/api/users\')</code> desde App.jsx y mostrá la cantidad de usuarios.</p>',
          hints: ['La opción <code>rewrite: (path) =&gt; path.replace(/^\\/api/, \'\')</code> quita el prefijo.', 'Como el destino es HTTPS de otro dominio, necesitás <code>changeOrigin: true</code>.'],
          solution: filesSol('<p><code>rewrite</code> transforma la ruta antes de reenviarla. Desde el navegador, el pedido va a <code>localhost:5173/api/users</code> (mismo origen, sin CORS).</p>', [
            { name: 'vite.config.js', lang: 'js', code: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\\/api/, ''),
      },
    },
  },
});` },
            { name: 'src/App.jsx', lang: 'jsx', code: `import { useEffect, useState } from 'react';

export default function App() {
  const [total, setTotal] = useState(null);

  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((users) => setTotal(users.length));
  }, []);

  return <p>{total === null ? 'Cargando…' : total + ' usuarios'}</p>;
}` },
          ]),
        },
      ],
      sources: [
        { title: 'Getting Started · Vite', url: 'https://vite.dev/guide/', points: ['Herramienta para una experiencia de desarrollo rápida y liviana.', 'Servidor de desarrollo con HMR y comando de build optimizado.', 'Usa ES Modules nativos en desarrollo.', '<code>index.html</code> es el punto de entrada y se trata como código fuente.', 'Se inicia con <code>npm create vite@latest</code>.'] },
        { title: 'Env Variables and Modes · Vite', url: 'https://vite.dev/guide/env-and-mode', points: ['<code>import.meta.env</code> expone variables y constantes como <code>MODE</code>, <code>DEV</code>, <code>PROD</code>.', 'Solo las variables con prefijo <code>VITE_</code> llegan al cliente.', 'Archivos: <code>.env</code>, <code>.env.local</code>, <code>.env.[modo]</code>, <code>.env.[modo].local</code>.', 'dev corre en <code>development</code> y build en <code>production</code>; se cambia con <code>--mode</code>.'] },
        { title: 'Proyecto base de la Unidad 5', url: 'https://github.com/vchibilisco/Dsw2025_Unidad5', points: ['Vite 7 + React 19 + React Router 7 + React Hook Form + Axios + Tailwind 4.', 'Proxy de <code>/api</code> hacia <code>VITE_BACKEND_URL</code> definido en <code>.env.development</code>.', 'Organizado por módulos: <code>auth</code>, <code>products</code>, <code>orders</code>, <code>shared</code>, <code>templates</code>.'] },
      ],
    },
  );
})();
