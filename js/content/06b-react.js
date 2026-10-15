/* Módulo: React, parte 2 (formularios, arquitectura, Tailwind, APIs, rutas, build) */
(() => {
  const { code, table, note, lab, flow, reactSol, filesSol } = window.GUIDE.h;

  window.GUIDE.LESSONS.push(
    {
      id: 'formularios-react',
      module: 'react',
      title: 'Formularios: controlados y no controlados',
      keywords: 'formulario controlado no controlado useref usestate input validacion errores componente input',
      tldr: 'En un input <mark>controlado</mark> el valor vive en el estado de React y el input solo lo muestra. En uno <mark>no controlado</mark> el valor vive en el DOM y lo leés cuando lo necesitás, con <code>useRef</code>.',
      goals: ['Escribir inputs controlados y no controlados.', 'Validar y mostrar errores debajo de cada campo.', 'Crear un componente Input reutilizable.', 'Resolver el Ejercicio 28.'],
      body: `
        ${table(['', 'Controlados (useState)', 'No controlados (useRef)'], [
          ['Quién maneja el valor', 'React (estado)', 'El DOM (el input real)'],
          ['Facilidad para validar', 'Muy fácil: el valor ya está en el estado', 'Más trabajo: hay que leer el valor a mano'],
          ['Re-renderizado', 'En cada cambio (cada tecla)', 'No en cada cambio'],
          ['Uso típico', 'Formularios complejos, validación en tiempo real, campos que dependen de otros', 'Formularios simples, cuando solo necesitás el valor al enviar'],
        ])}

        <h2>Inputs controlados</h2>
        <p>El input muestra lo que dice el estado (<code>value</code>) y cada tecla actualiza el estado (<code>onChange</code>). React es la única fuente de verdad.</p>
        ${code('jsx', `const [username, setUsername] = useState('');

<input value={username} onChange={e => setUsername(e.target.value)} />`)}
        <p>Con varios campos, un solo objeto de estado y un solo manejador que use el <code>name</code> del input:</p>
        ${code('jsx', `const [form, setForm] = useState({ username: '', password: '' });

const handleChange = (e) => {
  const { name, value } = e.target;
  setForm({ ...form, [name]: value });   // [name]: clave dinámica
};

<input name="username" value={form.username} onChange={handleChange} />
<input name="password" type="password" value={form.password} onChange={handleChange} />`)}
        ${note('<strong>Advertencia típica:</strong> “A component is changing an uncontrolled input to be controlled”. Pasa cuando el <code>value</code> empieza en <code>undefined</code>. Inicializá siempre el estado con <code>\'\'</code>.', 'warn')}

        <h2>Inputs no controlados</h2>
        ${code('jsx', `const usernameRef = useRef(null);

function handleSubmit(e) {
  e.preventDefault();
  console.log(usernameRef.current.value);   // se lee solo al enviar
}

<form onSubmit={handleSubmit}>
  <input ref={usernameRef} defaultValue="" />
</form>`)}
        <p>Otra forma sin refs: leer todo del formulario al enviar con <code>new FormData(e.target)</code>.</p>
        ${lab(0)}

        <h2>Un componente Input reutilizable</h2>
        <p>Label, input y mensaje de error siempre van juntos. En vez de repetirlos, se encapsulan en un componente que recibe el resto de las props y las pasa al input real con <code>...rest</code>. Es exactamente el <code>Input.jsx</code> del proyecto de la cátedra:</p>
        ${code('jsx', `function Input({ label, error = '', ...restProps }) {
  return (
    <div className="flex flex-col h-20">
      <label>{label}:</label>
      <input className={error && 'border-red-400'} {...restProps} />
      {error && <p className="text-red-500 text-base sm:text-xs">{error}</p>}
    </div>
  );
}`, 'src/modules/shared/components/Input.jsx')}
        ${lab(1)}
      `,
      labs: [
        {
          mode: 'react',
          title: 'Controlado vs. no controlado',
          jsx: `
import { useRef, useState } from 'react';

function Controlado() {
  const [nombre, setNombre] = useState('');
  return (
    <section>
      <h3>Controlado</h3>
      <input value={nombre} onChange={e => setNombre(e.target.value.toUpperCase())} placeholder="Se fuerza a mayúsculas" />
      <p>Hola, {nombre || '…'} ({nombre.length} letras)</p>
    </section>
  );
}

function NoControlado() {
  const ref = useRef(null);
  const [enviado, setEnviado] = useState('');
  return (
    <section>
      <h3>No controlado</h3>
      <form onSubmit={e => { e.preventDefault(); setEnviado(ref.current.value); }}>
        <input ref={ref} placeholder="Se lee al enviar" />
        <button>Enviar</button>
      </form>
      <p>Enviado: {enviado || '…'}</p>
    </section>
  );
}

export default function App() {
  return <><Controlado /><NoControlado /></>;
}`,
          css: `section { border:1px solid #d3d9d3; border-radius:10px; padding:8px 14px; margin-bottom:10px; } h3 { margin:4px 0; } input { font:inherit; padding:5px 8px; }`,
          hint: 'El controlado puede transformar lo que escribís en el momento (mayúsculas) y mostrar el largo en vivo; el no controlado solo se entera al enviar.',
        },
        {
          mode: 'react',
          title: 'Login con inputs controlados (Ejercicio 28)',
          jsx: `
import { useState } from 'react';

// Componente reutilizable: label + input + error
function Input({ label, id, error, ...rest }) {
  return (
    <div className="campo">
      <label htmlFor={id}>{label}</label>
      <input id={id} aria-invalid={Boolean(error)} {...rest} />
      {error && <small className="error">{error}</small>}
    </div>
  );
}

export default function App() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevos = {};
    if (!form.username.trim()) nuevos.username = 'El usuario es requerido';
    if (!form.password) nuevos.password = 'La contraseña es requerida';
    setErrors(nuevos);
    if (Object.keys(nuevos).length === 0) console.log('Datos válidos:', form);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Input label="Usuario" id="username" name="username" value={form.username} onChange={handleChange} error={errors.username} />
      <Input label="Contraseña" id="password" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} />
      <button>Ingresar</button>
    </form>
  );
}`,
          css: `
form { display:grid; gap:10px; max-width:300px; }
.campo { display:grid; gap:4px; }
input { font:inherit; padding:8px; border:1px solid #aab; border-radius:6px; }
input[aria-invalid="true"] { border-color:#c0392b; }
.error { color:#c0392b; }
button { font:inherit; padding:10px; border:0; border-radius:6px; background:#2b4c7e; color:white; cursor:pointer; }`,
          hint: 'Enviá vacío para ver los errores en rojo debajo de cada campo. Con datos válidos, el objeto aparece en la consola.',
        },
      ],
      exercises: [
        {
          official: '#28',
          title: 'Formulario y validaciones',
          level: 2,
          prompt: `<p><strong>Requisitos funcionales:</strong></p><ul>
            <li>Crear la página Login con <code>username</code> (requerido) y <code>password</code> (requerido).</li>
            <li>Mostrar el mensaje de error de validación debajo de cada input, en rojo.</li>
            <li>Si los datos son correctos, mostrarlos por consola.</li>
          </ul><p><strong>Requisitos de diseño:</strong></p><ul>
            <li>Usar inputs controlados.</li>
            <li>Debe existir un componente <code>Input</code> que dibuje el label, el input y el error si existe.</li>
          </ul>`,
          solution: reactSol('<p>El estado del formulario y el de los errores viven en <code>LoginPage</code>; <code>Input</code> es presentacional y reutilizable. La validación se hace al enviar y, para mejor experiencia, el error de un campo se borra apenas el usuario lo corrige.</p>', `
import { useState } from 'react';

function Input({ label, error = '', ...restProps }) {
  return (
    <div className="input-group">
      <label htmlFor={restProps.id}>{label}:</label>
      <input {...restProps} />
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.username.trim()) newErrors.username = 'Usuario es obligatorio';
    if (!form.password.trim()) newErrors.password = 'Contraseña es obligatoria';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    console.log(form);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Input id="username" name="username" label="Usuario" value={form.username} onChange={handleChange} error={errors.username} />
      <Input id="password" name="password" type="password" label="Contraseña" value={form.password} onChange={handleChange} error={errors.password} />
      <button type="submit">Iniciar Sesión</button>
    </form>
  );
}`, { name: 'LoginPage.jsx', css: `form { display: flex; flex-direction: column; gap: 1rem; max-width: 320px; }
.input-group { display: flex; flex-direction: column; }
.error { color: red; margin: 4px 0 0; font-size: .85rem; }` }),
        },
      ],
      sources: [
        { title: '&lt;input&gt; · React', url: 'https://es.react.dev/reference/react-dom/components/input', points: ['No controlado: <code>defaultValue</code> (o <code>defaultChecked</code>) da el valor inicial y el DOM maneja el resto.', 'Controlado: <code>value</code> (o <code>checked</code>) junto con <code>onChange</code>, ligado a una variable de estado.', 'Error común: pasar <code>value</code> sin <code>onChange</code> vuelve el campo de solo lectura.', 'Error común: un <code>value</code> inicial <code>null</code> o <code>undefined</code> hace que el input pase de no controlado a controlado; inicializalo con <code>\'\'</code>.'] },
      ],
    },

    {
      id: 'react-hook-form',
      module: 'react',
      title: 'React Hook Form',
      keywords: 'react hook form useform register handlesubmit errors formstate validaciones required minlength pattern validate',
      tldr: 'Una librería que <mark>maneja el estado, las validaciones y los errores</mark> de un formulario por vos. Trabaja con inputs no controlados, así que re-renderiza mucho menos y escribís mucho menos código.',
      goals: ['Inicializar un formulario con useForm.', 'Registrar campos con validaciones y mensajes.', 'Mostrar errores y usar formState.', 'Resolver el Ejercicio 29.'],
      body: `
        <h2>Qué resuelve</h2>
        <p>React-hook-form es una librería basada en React que permite gestionar el estado interno de un form, manipular componentes controlados y no controlados, gestionar validaciones y manejar formularios complejos. Compará el Ejercicio 28 (un estado por campo, un objeto de errores, validación a mano) con lo que vas a escribir acá.</p>
        ${code('bash', 'npm install react-hook-form')}

        <h2>useForm</h2>
        <p>Es un hook que inicializa un formulario y te da un conjunto de objetos y funciones para gestionar valores, errores y validaciones.</p>
        ${code('jsx', `import { useForm } from 'react-hook-form';

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { username: '', password: '' } });

  const onValid = async (data) => {
    console.log(data);   // { username: '…', password: '…' }
  };

  return (
    <form onSubmit={handleSubmit(onValid)}>
      <input {...register('username', { required: 'Usuario es obligatorio' })} />
      {errors.username && <p>{errors.username.message}</p>}

      <input type="password" {...register('password', { required: 'Contraseña es obligatoria' })} />
      {errors.password && <p>{errors.password.message}</p>}

      <button disabled={isSubmitting}>Ingresar</button>
    </form>
  );
}`)}
        ${table(['Elemento', 'Qué hace'], [
          ['<code>register(name, options?)</code>', 'Conecta un input al formulario. <code>name</code> es la clave del campo (puede ser un path para objetos, ej. <code>user.email</code>); <code>options</code> son las validaciones. Devuelve <code>name</code>, <code>ref</code>, <code>onChange</code> y <code>onBlur</code>: por eso se esparce con <code>{...register(…)}</code>. Trabaja sobre elementos no controlados'],
          ['<code>handleSubmit(onValid, onInvalid?)</code>', 'Envuelve tu función de envío: valida el formulario y llama <code>onValid(data)</code> si todo está bien, u <code>onInvalid(errors)</code> si hay errores. Ya hace el <code>preventDefault</code>'],
          ['<code>formState.errors</code>', 'Objeto con un error por campo: <code>errors.username.message</code>'],
          ['<code>formState.isSubmitting</code>', '<code>true</code> mientras <code>onValid</code> (async) se ejecuta: ideal para deshabilitar el botón'],
          ['<code>formState.isValid</code> / <code>isDirty</code>', '¿No hay errores? / ¿El usuario cambió algo?'],
          ['<code>reset()</code>', 'Vuelve a los valores por defecto'],
          ['<code>watch(name)</code>', 'Lee el valor actual de un campo (para mostrar algo en vivo)'],
          ['<code>setError(name, { message })</code>', 'Marca un error a mano (por ejemplo, uno que vino del servidor)'],
        ])}

        <h2>Validaciones básicas</h2>
        ${table(['Regla', 'Descripción', 'Ejemplo'], [
          ['<code>required</code>', 'El campo es obligatorio', '<code>{ required: "Este campo es obligatorio" }</code>'],
          ['<code>minLength</code>', 'Longitud mínima de caracteres', '<code>{ minLength: { value: 3, message: "Mínimo 3 caracteres" } }</code>'],
          ['<code>maxLength</code>', 'Longitud máxima', '<code>{ maxLength: { value: 10, message: "Máximo 10 caracteres" } }</code>'],
          ['<code>pattern</code>', 'Expresión regular que debe cumplirse', '<code>{ pattern: { value: /^[A-Za-z]+$/, message: "Solo letras" } }</code>'],
          ['<code>min</code>', 'Valor mínimo (números)', '<code>{ min: { value: 18, message: "Debe ser mayor o igual a 18" } }</code>'],
          ['<code>max</code>', 'Valor máximo (números)', '<code>{ max: { value: 99, message: "Debe ser menor o igual a 99" } }</code>'],
          ['<code>validate</code>', 'Validación personalizada: devuelve <code>true</code> o el mensaje', '<code>{ validate: v =&gt; v === "ok" || "Valor inválido" }</code>'],
          ['<code>valueAsNumber</code>', 'Convierte el valor a número antes de validar', '<code>{ valueAsNumber: true }</code>'],
        ])}
        ${note('<strong>Modo de validación:</strong> por defecto valida al enviar y después en cada cambio. Con <code>useForm({ mode: \'onTouched\' })</code> valida cuando el usuario sale de cada campo, que suele ser la mejor experiencia.')}
        ${lab(0)}

        <h2>Con un componente Input</h2>
        <p>Como <code>register</code> devuelve props normales, se pueden pasar a tu componente <code>Input</code> con spread, y este las pasa al <code>&lt;input&gt;</code> real. Así queda el <code>LoginForm.jsx</code> de la cátedra:</p>
        ${code('jsx', `<Input
  label="Usuario"
  {...register('username', { required: 'Usuario es obligatorio' })}
  error={errors.username?.message}
/>`)}
      `,
      labs: [
        {
          mode: 'react',
          title: 'React Hook Form de verdad',
          jsx: `
import { useForm } from 'react-hook-form';

const esperar = (ms) => new Promise(r => setTimeout(r, ms));

export default function App() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({ mode: 'onTouched', defaultValues: { nombre: '', email: '', edad: '', clave: '', clave2: '' } });

  const onValid = async (data) => {
    await esperar(800);           // simula el envío
    console.log('Enviado:', data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onValid)} noValidate>
      <label>Nombre
        <input {...register('nombre', {
          required: 'El nombre es obligatorio',
          minLength: { value: 3, message: 'Mínimo 3 caracteres' },
          pattern: { value: /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/, message: 'Solo letras' },
        })} />
      </label>
      {errors.nombre && <span className="err">{errors.nombre.message}</span>}

      <label>Email
        <input type="email" {...register('email', {
          required: 'El email es obligatorio',
          pattern: { value: /^\\S+@\\S+\\.\\S+$/, message: 'Email inválido' },
        })} />
      </label>
      {errors.email && <span className="err">{errors.email.message}</span>}

      <label>Edad
        <input type="number" {...register('edad', {
          valueAsNumber: true,
          min: { value: 18, message: 'Debe ser mayor o igual a 18' },
          max: { value: 99, message: 'Debe ser menor o igual a 99' },
        })} />
      </label>
      {errors.edad && <span className="err">{errors.edad.message}</span>}

      <label>Contraseña
        <input type="password" {...register('clave', { required: 'Obligatoria' })} />
      </label>
      <label>Repetir
        <input type="password" {...register('clave2', {
          validate: v => v === watch('clave') || 'Las contraseñas no coinciden',
        })} />
      </label>
      {errors.clave2 && <span className="err">{errors.clave2.message}</span>}

      <button disabled={isSubmitting || !isDirty}>{isSubmitting ? 'Enviando…' : 'Registrarme'}</button>
    </form>
  );
}`,
          css: `
form { display:grid; gap:6px; max-width:320px; }
label { display:grid; gap:2px; font-size:.9rem; }
input { font:inherit; padding:6px 8px; }
.err { color:#c0392b; font-size:.85rem; margin-top:-4px; }
button { font:inherit; padding:8px; margin-top:6px; }`,
          hint: 'Esta es la librería real (react-hook-form 7, la misma versión del proyecto de la cátedra). Tocá un campo y salí: se valida al perder el foco (<code>mode: \'onTouched\'</code>).',
        },
      ],
      exercises: [
        {
          official: '#29',
          title: 'Migrar el login a react-hook-form',
          level: 2,
          prompt: '<p>Migrá el ejercicio #28 a react-hook-form: el mismo formulario de login, con los mismos mensajes de error, pero sin <code>useState</code> para los valores ni para los errores.</p>',
          solution: reactSol('<p>Desaparecen los dos <code>useState</code>, el <code>handleChange</code> y la validación manual: <code>register</code> conecta cada campo con sus reglas y <code>handleSubmit</code> solo llama a <code>onValid</code> si todo está bien. El componente <code>Input</code> no cambia: recibe por spread las props que devuelve <code>register</code>.</p>', `
import { useForm } from 'react-hook-form';

function Input({ label, error = '', ...restProps }) {
  return (
    <div className="input-group">
      <label>{label}:</label>
      <input {...restProps} />
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { username: '', password: '' } });

  const onValid = (formData) => {
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit(onValid)} noValidate>
      <Input
        label="Usuario"
        {...register('username', { required: 'Usuario es obligatorio' })}
        error={errors.username?.message}
      />
      <Input
        label="Contraseña"
        type="password"
        {...register('password', { required: 'Contraseña es obligatorio' })}
        error={errors.password?.message}
      />
      <button type="submit">Iniciar Sesión</button>
    </form>
  );
}`, { name: 'LoginForm.jsx', css: `form { display: flex; flex-direction: column; gap: 1rem; max-width: 320px; }
.input-group { display: flex; flex-direction: column; } .error { color: red; margin: 4px 0 0; }` }),
        },
        {
          title: 'Alta de producto',
          level: 2,
          prompt: '<p>Con react-hook-form, hacé un formulario de alta de producto con: SKU (requerido, formato <code>ABC-123</code>), nombre (requerido, 3 a 50 caracteres), precio (número mayor a 0), stock (entero entre 0 y 9999) y un checkbox “Activo”. Al enviar, mostralo por consola con los números ya convertidos, y reseteá el formulario.</p>',
          hints: ['Patrón del SKU: <code>/^[A-Z]{3}-\\d{3}$/</code>.', '<code>valueAsNumber: true</code> en precio y stock.', 'Para “entero”: <code>validate: v =&gt; Number.isInteger(v) || \'Debe ser entero\'</code>.'],
          solution: reactSol('<p><code>valueAsNumber</code> convierte antes de validar, así <code>min</code> y <code>validate</code> trabajan con números. El checkbox registrado devuelve un booleano.</p>', `
import { useForm } from 'react-hook-form';

export default function App() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { sku: '', name: '', price: '', stock: '', isActive: true },
  });

  const onValid = (data) => {
    console.log(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onValid)} noValidate>
      <input placeholder="SKU (ABC-123)" {...register('sku', {
        required: 'El SKU es obligatorio',
        pattern: { value: /^[A-Z]{3}-\\d{3}$/, message: 'Formato: ABC-123' },
      })} />
      <small>{errors.sku?.message}</small>

      <input placeholder="Nombre" {...register('name', {
        required: 'El nombre es obligatorio',
        minLength: { value: 3, message: 'Mínimo 3 caracteres' },
        maxLength: { value: 50, message: 'Máximo 50 caracteres' },
      })} />
      <small>{errors.name?.message}</small>

      <input type="number" step="0.01" placeholder="Precio" {...register('price', {
        valueAsNumber: true,
        required: 'El precio es obligatorio',
        min: { value: 0.01, message: 'Debe ser mayor a 0' },
      })} />
      <small>{errors.price?.message}</small>

      <input type="number" placeholder="Stock" {...register('stock', {
        valueAsNumber: true,
        min: { value: 0, message: 'No puede ser negativo' },
        max: { value: 9999, message: 'Máximo 9999' },
        validate: (v) => Number.isInteger(v) || 'Debe ser entero',
      })} />
      <small>{errors.stock?.message}</small>

      <label><input type="checkbox" {...register('isActive')} /> Activo</label>
      <button>Crear producto</button>
    </form>
  );
}`, { css: `form { display: grid; gap: 4px; max-width: 300px; } small { color: #c0392b; min-height: 1em; }` }),
        },
      ],
      sources: [
        { title: 'Get Started · React Hook Form', url: 'https://react-hook-form.com/get-started', points: ['<code>useForm</code> entrega <code>register</code>, <code>handleSubmit</code> y <code>errors</code>.', '<code>register</code> requiere un <code>name</code> y hace que el valor esté disponible para validar y enviar.', 'Validaciones alineadas al estándar HTML.', '<code>handleSubmit</code> valida antes de llamar a tu función.'] },
        { title: 'register · React Hook Form', url: 'https://react-hook-form.com/docs/useform/register', points: ['<code>name</code> es obligatorio y único.', 'Reglas: <code>required</code>, <code>maxLength</code>, <code>minLength</code>, <code>max</code>, <code>min</code>, <code>pattern</code>, <code>validate</code>.', '<code>valueAsNumber</code> convierte a número antes de validar.', 'Los mensajes se dan con <code>{ value, message }</code> o devolviendo un string en <code>validate</code>.'] },
        { title: 'formState · React Hook Form', url: 'https://react-hook-form.com/docs/useform/formstate', points: ['<code>isDirty</code>: el usuario modificó algún campo.', '<code>isSubmitting</code>: el formulario se está enviando.', '<code>isValid</code>: no hay errores.', '<code>errors</code>: los errores de cada campo.'] },
      ],
    },

    {
      id: 'arquitectura',
      module: 'react',
      title: 'Arquitectura: Screaming, SOLID y Atomic Design',
      keywords: 'screaming architecture solid atomic design atomos moleculas organismos plantillas paginas carpetas modulos',
      tldr: 'Cómo organizar un proyecto que crece: carpetas por <mark>funcionalidad</mark> (Screaming Architecture), componentes con <mark>una sola responsabilidad</mark> (SOLID) y piezas de interfaz de <mark>chicas a grandes</mark> (Atomic Design).',
      goals: ['Organizar carpetas por módulos de negocio.', 'Aplicar cada principio SOLID a componentes React.', 'Clasificar componentes en átomos, moléculas, organismos, plantillas y páginas.', 'Resolver los ejercicios 30 y 31.'],
      body: `
        <h2>Screaming Architecture</h2>
        <p>La idea: al leer simplemente las carpetas, tenés que entender de qué se trata cada módulo. La estructura “grita” el dominio (turnos, productos, órdenes), no la tecnología (components, hooks, services sueltos).</p>
        <ul>
          <li>Buscamos que sea simple, ordenado y que sea fácil encontrar cada cosa.</li>
          <li><strong>No</strong> organizamos en capas técnicas (todos los componentes juntos, todos los servicios juntos).</li>
          <li>Organizamos por funcionalidades, mediante módulos.</li>
        </ul>
        ${table(['Por capas técnicas (evitar)', 'Por funcionalidad (Screaming)'], [
          ['<code>src/components/LoginForm.jsx</code><br><code>src/components/ProductCard.jsx</code><br><code>src/services/login.js</code><br><code>src/services/products.js</code><br><code>src/pages/LoginPage.jsx</code>', '<code>src/modules/auth/components/LoginForm.jsx</code><br><code>src/modules/auth/services/login.js</code><br><code>src/modules/auth/pages/LoginPage.jsx</code><br><code>src/modules/products/components/…</code><br><code>src/modules/products/services/list.js</code>'],
        ])}
        <p>Así está organizado el proyecto base de la cátedra:</p>
        ${code('text', `src/
├── App.jsx
├── main.jsx
└── modules/
    ├── auth/                    ← todo lo de autenticación
    │   ├── components/          LoginForm.jsx, ProtectedRoute.jsx
    │   ├── context/             AuthProvider.jsx
    │   ├── helpers/             backendError.js
    │   ├── hook/                useAuth.js
    │   ├── pages/               LoginPage.jsx
    │   └── services/            login.js
    ├── products/
    │   ├── components/          CreateProductForm.jsx
    │   ├── pages/               ListProductsPage.jsx, CreateProductPage.jsx
    │   └── services/            list.js, create.js
    ├── orders/
    ├── home/
    ├── shared/                  ← lo que usan varios módulos
    │   ├── api/                 axiosInstance.js
    │   └── components/          Button.jsx, Card.jsx, Input.jsx
    └── templates/
        └── components/          Dashboard.jsx`)}
        ${note('<strong>Regla de dependencias:</strong> un módulo puede usar <code>shared</code>, pero <code>shared</code> nunca importa de un módulo. Si dos módulos necesitan lo mismo, eso va a <code>shared</code>.')}

        <h2>SOLID en React</h2>
        ${table(['Principio', 'En React'], [
          ['<strong>S</strong> · Responsabilidad única', 'Un componente hace una sola cosa. Si maneja peticiones de red, lógica de negocio y renderizado a la vez, se divide: por ejemplo, un <code>UserProfile</code> se separa en un hook <code>useUser</code> y componentes visuales'],
          ['<strong>O</strong> · Abierto/cerrado', 'Abiertos a la extensión, cerrados a la modificación. Se logra con composición (<code>children</code>) o compound components: se personalizan sin tocar su código'],
          ['<strong>L</strong> · Sustitución de Liskov', 'Las variantes de un componente deben poder reemplazar a la base sin romper la app ni cambiar el comportamiento esperado de las props (un <code>PrimaryButton</code> acepta todo lo que acepta <code>Button</code>)'],
          ['<strong>I</strong> · Segregación de interfaces', 'Un componente no debe recibir props que no usa. Mejor pasar datos específicos (<code>name</code>, <code>email</code>) que objetos gigantes o stores enteros'],
          ['<strong>D</strong> · Inversión de dependencias', 'Depender de abstracciones (hooks, context, props), no de implementaciones concretas como un <code>fetch</code> directo dentro de la vista'],
        ])}
        ${code('jsx', `// Antes: todo junto (viola S y D)
function ProductsPage() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(setProducts);
  }, []);
  return products.map(p => <div key={p.sku}>{p.name}</div>);
}

// Después: cada pieza con una responsabilidad
// services/list.js   → cómo se piden los datos
export const getProducts = () => instance.get('api/products');

// hooks/useProducts.js → estado y carga
function useProducts() { /* useState + useEffect + getProducts */ }

// components/ProductCard.jsx → solo cómo se ve un producto
function ProductCard({ name, price }) { return <Card>{name} \${price}</Card>; }

// pages/ProductsPage.jsx → compone las piezas
function ProductsPage() {
  const { products, loading } = useProducts();
  if (loading) return <p>Buscando datos…</p>;
  return products.map(p => <ProductCard key={p.sku} name={p.name} price={p.price} />);
}`)}

        <h2>Atomic Design</h2>
        <p>Es una metodología para crear interfaces de forma modular y escalable, propuesta por Brad Frost. Se basa en cómo la química organiza la materia: <strong>átomos → moléculas → organismos → plantillas → páginas</strong>.</p>
        ${table(['Nivel', 'Descripción', 'Ejemplo práctico (React)'], [
          ['<strong>Átomos</strong>', 'Los elementos más pequeños e indivisibles. No dependen de otros componentes', 'Button, Input, Label, Icono'],
          ['<strong>Moléculas</strong>', 'Átomos que trabajan juntos para cumplir una función simple', 'Input + Label + ErrorMessage → InputField'],
          ['<strong>Organismos</strong>', 'Conjuntos de moléculas y/o átomos que forman secciones completas', 'Navbar, Card de producto, Formulario de login'],
          ['<strong>Plantillas</strong>', 'Estructuras de página que definen el layout, sin datos reales', 'Estructura de “Página de login” con Header, Form y Footer; esqueleto del dashboard'],
          ['<strong>Páginas</strong>', 'Instancias de las plantillas con datos reales', 'LoginPage, ProductsPage, CreateProductPage'],
        ])}
        <p>Ejemplos del dashboard: <code>button</code> y <code>span</code> son átomos, un <code>Button</code> personalizado o un <code>Title</code> son moléculas, el <code>Header</code> es un organismo. <code>nav</code>, <code>ul</code>, <code>li</code> y <code>a</code> son átomos; un menú seleccionable es una molécula; el <code>Sidebar</code> es un organismo. El esqueleto del dashboard es la plantilla, y <code>ProductsPage.jsx</code> (que toma la plantilla y muestra el listado) o <code>CreateProductPage.jsx</code> son páginas.</p>
        ${lab(0)}
      `,
      labs: [
        {
          mode: 'react',
          title: 'De átomos a una página',
          jsx: `
// Átomos
const Button = ({ children, variant = 'default', ...p }) => <button className={'btn ' + variant} {...p}>{children}</button>;
const Label = ({ children, ...p }) => <label className="lbl" {...p}>{children}</label>;

// Molécula
function InputField({ label, id, error }) {
  return (
    <div className="field">
      <Label htmlFor={id}>{label}</Label>
      <input id={id} />
      {error && <small className="err">{error}</small>}
    </div>
  );
}

// Organismos
function Header() {
  return <header className="hdr"><strong>Mi Tienda</strong><Button variant="secondary">Salir</Button></header>;
}
function ProductForm() {
  return (
    <form className="form" onSubmit={e => e.preventDefault()}>
      <InputField label="Nombre" id="n" />
      <InputField label="Precio" id="p" error="Debe ser mayor a 0" />
      <Button>Guardar</Button>
    </form>
  );
}

// Plantilla: el layout, sin saber qué va adentro
function DashboardTemplate({ children }) {
  return <div className="tpl"><Header /><main>{children}</main></div>;
}

// Página: plantilla + contenido real
export default function CreateProductPage() {
  return (
    <DashboardTemplate>
      <h2>Crear producto</h2>
      <ProductForm />
    </DashboardTemplate>
  );
}`,
          css: `
.tpl { border:1px solid #d3d9d3; border-radius:12px; overflow:hidden; }
.hdr { display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:#1f2a2e; color:white; }
main { padding:14px; }
.form { display:grid; gap:10px; max-width:280px; }
.field { display:grid; gap:4px; }
.lbl { font-weight:bold; font-size:.9rem; }
.err { color:#c0392b; }
input { font:inherit; padding:6px 8px; }
.btn { font:inherit; padding:6px 12px; border:0; border-radius:6px; cursor:pointer; }
.default { background:#e9d5ff; } .secondary { background:#f3f4f6; }`,
          hint: 'Cada nivel usa solo los de abajo. Cambiá el estilo de <code>.default</code>: el cambio aparece en todos los botones de la app.',
        },
      ],
      exercises: [
        {
          official: '#30',
          title: 'Organizar con Screaming Architecture y SOLID',
          level: 2,
          prompt: '<p>Migrá el ejercicio #29 a la nueva organización de carpetas usando el patrón SOLID.</p>',
          solution: filesSol('<p>El login pertenece al módulo <code>auth</code>; el <code>Input</code> y el <code>Button</code> son reutilizables y van a <code>shared</code>. <code>LoginForm</code> solo se ocupa del formulario (S), y <code>LoginPage</code> solo lo ubica en la pantalla. <code>App</code> no conoce los detalles.</p>', [
            { name: 'estructura', lang: 'text', code: `src/
├── App.jsx
├── main.jsx
└── modules/
    ├── auth/
    │   ├── components/LoginForm.jsx
    │   └── pages/LoginPage.jsx
    └── shared/
        └── components/
            ├── Button.jsx
            └── Input.jsx` },
            { name: 'src/modules/auth/pages/LoginPage.jsx', lang: 'jsx', code: `import LoginForm from '../components/LoginForm';

function LoginPage() {
  return (
    <div className="login-container">
      <LoginForm />
    </div>
  );
}

export default LoginPage;` },
            { name: 'src/modules/auth/components/LoginForm.jsx', lang: 'jsx', code: `import { useForm } from 'react-hook-form';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { username: '', password: '' },
  });

  const onValid = (formData) => console.log(formData);

  return (
    <form onSubmit={handleSubmit(onValid)}>
      <Input label="Usuario" {...register('username', { required: 'Usuario es obligatorio' })} error={errors.username?.message} />
      <Input label="Contraseña" type="password" {...register('password', { required: 'Contraseña es obligatorio' })} error={errors.password?.message} />
      <Button type="submit">Iniciar Sesión</Button>
    </form>
  );
}

export default LoginForm;` },
            { name: 'src/App.jsx', lang: 'jsx', code: `import LoginPage from './modules/auth/pages/LoginPage';

function App() {
  return <LoginPage />;
}

export default App;` },
          ]),
        },
        {
          official: '#31',
          title: 'Componentes reutilizables en su lugar',
          level: 2,
          prompt: '<p>Basado en el #30: creá los componentes necesarios y ubicalos en las carpetas correspondientes. Definí qué componentes pueden ser reutilizables, crealos si no existen y movelos a donde corresponde según la arquitectura.</p>',
          solution: filesSol('<p>Candidatos claros a <code>shared/components</code>: <code>Button</code> (con variantes), <code>Input</code> y <code>Card</code> (un contenedor con borde y padding que usan login, listados y formularios). Así quedan en el proyecto de la cátedra:</p>', [
            { name: 'src/modules/shared/components/Button.jsx', lang: 'jsx', code: `function Button({ children, type = 'button', variant = 'default', ...restProps }) {
  if (!['button', 'reset', 'submit'].includes(type)) {
    console.warn('type prop not supported');
  }

  const variantStyle = {
    default: 'bg-purple-200 hover:bg-purple-300 transition',
    secondary: 'bg-gray-100 hover:bg-gray-200 transition',
  };

  return (
    <button
      {...restProps}
      className={\`\${variantStyle[variant]} \${restProps.className}\`}
      type={type}
    >
      {children}
    </button>
  );
}

export default Button;` },
            { name: 'src/modules/shared/components/Card.jsx', lang: 'jsx', code: `function Card({ children, className }) {
  return (
    <div className={\`bg-white border border-gray-300 p-4 rounded-xl \${className}\`}>
      {children}
    </div>
  );
}

export default Card;` },
            { name: 'src/modules/shared/components/Input.jsx', lang: 'jsx', code: `function Input({ label, error = '', ...restProps }) {
  return (
    <div className="flex flex-col h-20">
      <label>{label}:</label>
      <input className={error && 'border-red-400'} {...restProps} />
      {error && <p className="text-red-500 text-base sm:text-xs">{error}</p>}
    </div>
  );
}

export default Input;` },
          ]),
        },
        {
          title: 'Clasificá los componentes',
          level: 1,
          prompt: '<p>Clasificá según Atomic Design: <code>Avatar</code>, <code>SearchBar</code> (input + botón), <code>ProductCard</code> (imagen, título, precio, botón), <code>Icon</code>, <code>Sidebar</code>, <code>DashboardLayout</code>, <code>OrdersPage</code>, <code>FormField</code> (label + input + error), <code>Pagination</code> (botones + texto).</p>',
          solution: { explain: '<ul><li><strong>Átomos:</strong> Avatar, Icon.</li><li><strong>Moléculas:</strong> SearchBar, FormField, Pagination.</li><li><strong>Organismos:</strong> ProductCard, Sidebar.</li><li><strong>Plantilla:</strong> DashboardLayout.</li><li><strong>Página:</strong> OrdersPage.</li></ul><p>Los límites no siempre son exactos (hay quien considera ProductCard una molécula): lo importante es que cada nivel solo dependa de los inferiores.</p>' },
        },
      ],
      sources: [
        { title: 'Atomic Design Methodology · Brad Frost', url: 'https://atomicdesign.bradfrost.com/chapter-2/', points: ['<strong>Átomos</strong>: elementos que no se pueden dividir más.', '<strong>Moléculas</strong>: grupos de átomos con una función simple.', '<strong>Organismos</strong>: secciones complejas de la interfaz.', '<strong>Plantillas</strong>: estructura del contenido, no el contenido final.', '<strong>Páginas</strong>: plantillas con contenido real.'] },
        { title: 'Screaming Architecture en React', url: 'https://dev.to/profydev/screaming-architecture-evolution-of-a-react-folder-structure-4g25', points: ['Agrupar por funcionalidad en lugar de por tipo de archivo.', 'Lo compartido va a carpetas de nivel superior.'] },
        { title: 'Proyecto base de la Unidad 5', url: 'https://github.com/vchibilisco/Dsw2025_Unidad5', points: ['Ejemplo real de módulos <code>auth</code>, <code>products</code>, <code>orders</code>, <code>shared</code> y <code>templates</code>.'] },
      ],
    },

    {
      id: 'tailwind',
      module: 'react',
      title: 'Tailwind CSS',
      keywords: 'tailwind utilidades clases responsive mobile first breakpoints sm md lg hover focus dark valores arbitrarios',
      tldr: 'Tailwind te da <mark>clases utilitarias pequeñas</mark> (<code>p-4</code>, <code>flex</code>, <code>text-center</code>) que combinás en el JSX. Escanea tus archivos buscando nombres de clase y genera solo el CSS que usás.',
      goals: ['Instalar Tailwind 4 en un proyecto Vite.', 'Leer y escribir clases utilitarias de espaciado, layout, color y tipografía.', 'Aplicar estados (hover, focus) y responsive con mobile first.', 'Resolver el Ejercicio 32.'],
      body: `
        <h2>Cómo funciona</h2>
        <p>Tailwind escanea todos tus archivos HTML y componentes JavaScript buscando nombres de clase, genera los estilos correspondientes y los escribe en un archivo CSS estático. Si no usás <code>bg-pink-500</code> en ningún lado, no existe en tu CSS final.</p>
        <p>Es <strong>utility-first</strong>: en lugar de inventar una clase <code>.tarjeta</code> y escribir su CSS aparte, combinás utilidades de un solo propósito directamente en el elemento.</p>
        ${code('jsx', `{/* CSS tradicional */}
<div className="tarjeta">…</div>
/* .tarjeta { padding: 1rem; border-radius: .75rem; background: white; border: 1px solid #d1d5db; } */

{/* Tailwind */}
<div className="p-4 rounded-xl bg-white border border-gray-300">…</div>`)}
        ${note('<strong>¿No es lo mismo que <code>style</code> en línea?</strong> No: las clases salen de un sistema de diseño con valores predefinidos (espaciados, colores, tamaños coherentes), y además soportan estados (<code>hover:</code>), media queries (<code>sm:</code>) y modo oscuro (<code>dark:</code>), cosas imposibles con <code>style</code>.')}

        <h2>Instalación (Tailwind 4 con Vite)</h2>
        ${code('bash', `npm install tailwindcss
npm install -D @tailwindcss/vite`)}
        ${code('js', `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});`, 'vite.config.js')}
        ${code('css', `@import "tailwindcss";`, 'src/index.css (primera línea)')}
        <p>Instalá también la extensión <strong>Tailwind CSS IntelliSense</strong> de VS Code: autocompleta las clases y muestra el CSS que genera cada una al pasar el mouse.</p>

        <h2>Las clases que más vas a usar</h2>
        ${table(['Categoría', 'Clases', 'Equivale a'], [
          ['Espaciado', '<code>p-4</code> <code>px-6</code> <code>mt-2</code> <code>gap-3</code>', 'padding 1rem · padding horizontal 1.5rem · margin-top .5rem · gap .75rem (cada unidad = 0.25rem)'],
          ['Tamaño', '<code>w-full</code> <code>h-20</code> <code>max-w-md</code> <code>min-h-screen</code>', 'width 100% · height 5rem · max-width 28rem · min-height 100vh'],
          ['Layout', '<code>flex</code> <code>flex-col</code> <code>items-center</code> <code>justify-between</code> <code>grid</code> <code>grid-cols-3</code>', 'Flexbox y Grid'],
          ['Color', '<code>bg-purple-200</code> <code>text-red-500</code> <code>border-gray-300</code>', 'Paleta de 50 a 950 por color'],
          ['Texto', '<code>text-xl</code> <code>font-bold</code> <code>text-center</code>', 'Tamaño, peso, alineación'],
          ['Bordes', '<code>border</code> <code>rounded-lg</code> <code>rounded-full</code> <code>shadow</code>', 'Borde, radio, sombra'],
          ['Visibilidad', '<code>hidden</code> <code>block</code>', 'display none / block'],
          ['Valores arbitrarios', '<code>w-[256px]</code> <code>bg-[#316ff6]</code> <code>grid-cols-[256px_1fr]</code>', 'Cualquier valor fuera del sistema, entre corchetes'],
        ])}

        <h2>Estados y variantes</h2>
        <p>Se aplican con un prefijo: <code>hover:bg-purple-300</code>, <code>focus:ring-2</code>, <code>disabled:bg-gray-100</code>, <code>dark:bg-gray-800</code>. Se pueden combinar: <code>sm:hover:underline</code>.</p>

        <h2>Responsive: mobile first</h2>
        <p>Tailwind se basa en el principio mobile first. Las clases <mark>sin prefijo</mark> aplican a todos los tamaños. Los breakpoints (<code>sm:</code>, <code>md:</code>…) se usan solamente para aplicar estilos <mark>desde</mark> esa resolución hacia arriba.</p>
        ${table(['Prefijo', 'Desde', 'CSS'], [
          ['<code>sm:</code>', '40rem (640px)', '<code>@media (width &gt;= 40rem)</code>'],
          ['<code>md:</code>', '48rem (768px)', ''],
          ['<code>lg:</code>', '64rem (1024px)', ''],
          ['<code>xl:</code>', '80rem (1280px)', ''],
          ['<code>2xl:</code>', '96rem (1536px)', ''],
        ])}
        ${code('jsx', `{/* Columna en móvil, fila desde sm. Gap grande en móvil, chico desde sm. */}
<form className="flex flex-col gap-20 bg-white p-8 sm:w-md sm:gap-4 sm:rounded-lg sm:shadow-lg">`)}
        ${note('<strong>Error típico:</strong> pensar que <code>sm:hidden</code> significa “oculto en celular”. Significa “oculto <em>desde</em> 640px”. Para ocultar solo en celular: <code>hidden sm:block</code>.', 'warn')}
        ${lab(0)}
      `,
      labs: [
        {
          mode: 'react',
          tailwind: true,
          title: 'Login de la cátedra con Tailwind 4 (Ejercicio 32)',
          jsx: `
// Átomos, como en src/modules/shared/components
function Input({ label, error = '', ...restProps }) {
  return (
    <div className="flex flex-col h-20">
      <label>{label}:</label>
      <input className={'border rounded px-2 py-1 ' + (error ? 'border-red-400' : 'border-gray-300')} {...restProps} />
      {error && <p className="text-red-500 text-base sm:text-xs">{error}</p>}
    </div>
  );
}

function Button({ children, variant = 'default', className = '', ...rest }) {
  const variantStyle = {
    default: 'bg-purple-200 hover:bg-purple-300 transition',
    secondary: 'bg-gray-100 hover:bg-gray-200 transition',
  };
  return <button className={variantStyle[variant] + ' rounded py-2 ' + className} {...rest}>{children}</button>;
}

export default function LoginPage() {
  return (
    <div className="min-h-[420px] bg-gray-100 flex flex-col justify-center sm:items-center">
      <form className="flex flex-col gap-20 bg-white p-8 sm:w-md sm:gap-4 sm:rounded-lg sm:shadow-lg">
        <Input label="Usuario" />
        <Input label="Contraseña" type="password" error="Contraseña es obligatorio" />
        <Button type="submit">Iniciar Sesión</Button>
        <Button variant="secondary">Registrar Usuario</Button>
      </form>
    </div>
  );
}`,
          hint: 'Achicá la ventana del navegador para ver la versión móvil: el form ocupa todo y los espacios crecen (<code>gap-20</code>). Desde <code>sm:</code> queda como tarjeta centrada. Necesita internet (carga Tailwind 4 desde un CDN).',
        },
      ],
      exercises: [
        {
          official: '#32',
          title: 'Login de la Unidad 4 con Tailwind',
          level: 2,
          prompt: '<p>Basado en el ejercicio #31: replicá con Tailwind el diseño de la página de Login de la Unidad 4, respetando el principio mobile first.</p>',
          hints: ['El login de la Unidad 4: fondo gris, form blanco en columna, en móvil a pantalla completa y desde 600px centrado con 400px de ancho, sombra y bordes redondeados.', 'Pensá primero las clases sin prefijo (móvil) y después agregá las <code>sm:</code>.'],
          solution: reactSol('<p>Se traducen las reglas de <code>login_style.css</code> a utilidades: el contenedor es <code>flex flex-col justify-center</code> con alto de pantalla y fondo gris; desde <code>sm:</code> centra con <code>items-center</code>. El form es columna con <code>gap</code>, fondo blanco y padding; desde <code>sm:</code> toma ancho fijo, bordes redondeados y sombra.</p>', `
import { useForm } from 'react-hook-form';

function Input({ label, error = '', ...restProps }) {
  return (
    <div className="flex flex-col">
      <label className="mb-1">{label}:</label>
      <input className={'border rounded px-3 py-2 ' + (error ? 'border-red-400' : 'border-gray-300')} {...restProps} />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:items-center">
      <form
        onSubmit={handleSubmit((data) => console.log(data))}
        className="flex flex-col gap-4 bg-white p-8 sm:w-[400px] sm:rounded-lg sm:shadow-lg"
      >
        <Input label="Usuario" {...register('username', { required: 'Usuario es obligatorio' })} error={errors.username?.message} />
        <Input label="Contraseña" type="password" {...register('password', { required: 'Contraseña es obligatorio' })} error={errors.password?.message} />
        <button type="submit" className="bg-purple-200 hover:bg-purple-300 transition rounded py-2">
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
}`, { name: 'src/modules/auth/pages/LoginPage.jsx', tailwind: true }),
        },
        {
          title: 'Tarjeta de producto responsive',
          level: 2,
          prompt: '<p>Con Tailwind, hacé una grilla de tarjetas de producto: 1 columna en móvil, 2 desde <code>sm</code>, 3 desde <code>lg</code>. Cada tarjeta tiene imagen, nombre, precio en negrita, un badge “Sin stock” rojo cuando corresponde y un botón que cambia de color al pasar el mouse y queda gris si no hay stock (<code>disabled:</code>).</p>',
          solution: reactSol('<p>La grilla cambia de columnas solo con prefijos. El botón usa la variante <code>disabled:</code>, así el mismo set de clases sirve para los dos estados.</p>', `
const productos = [
  { sku: 'MOU-001', nombre: 'Mouse inalámbrico', precio: 12000, stock: 5 },
  { sku: 'TEC-002', nombre: 'Teclado mecánico', precio: 45000, stock: 0 },
  { sku: 'MON-003', nombre: 'Monitor 24"', precio: 180000, stock: 2 },
];

export default function App() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {productos.map((p) => (
        <article key={p.sku} className="bg-white border border-gray-300 rounded-xl p-4 flex flex-col gap-2">
          <img src={'https://placehold.co/300x160?text=' + p.sku} alt={p.nombre} className="rounded-lg w-full" />
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{p.nombre}</h3>
            {p.stock === 0 && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Sin stock</span>}
          </div>
          <p className="font-bold text-lg">\${p.precio.toLocaleString('es-AR')}</p>
          <button
            disabled={p.stock === 0}
            className="bg-purple-200 hover:bg-purple-300 disabled:bg-gray-100 disabled:text-gray-400 rounded py-2 transition"
          >
            Agregar al carrito
          </button>
        </article>
      ))}
    </div>
  );
}`, { tailwind: true }),
        },
      ],
      sources: [
        { title: 'Instalar Tailwind CSS con Vite', url: 'https://tailwindcss.com/docs/installation/using-vite', points: ['Tailwind escanea tus archivos buscando clases y genera CSS estático.', 'Se instala como plugin de Vite: <code>tailwindcss</code> y <code>@tailwindcss/vite</code>.', 'Se agrega el plugin en <code>vite.config</code> y <code>@import "tailwindcss";</code> en el CSS.'] },
        { title: 'Styling with utility classes · Tailwind', url: 'https://tailwindcss.com/docs/styling-with-utility-classes', points: ['Utility-first: se combinan clases de un solo propósito.', 'No es lo mismo que estilos en línea: hay un sistema de diseño, estados y media queries.', 'Estados con prefijos: <code>hover:bg-sky-700</code>.', 'Modo oscuro con <code>dark:</code>; valores arbitrarios con corchetes: <code>bg-[#316ff6]</code>.'] },
        { title: 'Responsive design · Tailwind', url: 'https://tailwindcss.com/docs/responsive-design', points: ['Cualquier clase se aplica en un breakpoint con prefijos como <code>md:</code>.', 'Mobile first: sin prefijo aplica a todo; con prefijo, desde ese tamaño.', 'Cinco breakpoints: <code>sm</code>, <code>md</code>, <code>lg</code>, <code>xl</code>, <code>2xl</code>.'] },
      ],
    },

    {
      id: 'axios-api',
      module: 'react',
      title: 'Conectar con el backend: Axios, servicios y errores',
      keywords: 'axios fetch api servicio instancia interceptors token bearer errores codigo backend proxy login',
      tldr: '<mark>Axios</mark> es una librería para hacer pedidos HTTP más cómoda que fetch: convierte el JSON solo, rechaza ante errores HTTP y permite configurar una <mark>instancia</mark> con la URL base y el token para toda la app.',
      goals: ['Comparar fetch y Axios.', 'Crear una instancia con interceptores para el token.', 'Organizar los pedidos en servicios.', 'Traducir códigos de error del backend a mensajes, y resolver el Ejercicio 33.'],
      body: `
        <h2>¿Por qué Axios si existe fetch?</h2>
        ${table(['', 'fetch', 'Axios'], [
          ['Instalación', 'Nativo', '<code>npm install axios</code>'],
          ['JSON de la respuesta', '<code>await res.json()</code> a mano', 'Ya viene en <code>response.data</code>'],
          ['Enviar JSON', '<code>JSON.stringify</code> + cabecera a mano', 'Pasás el objeto y listo'],
          ['Errores HTTP (404, 500)', 'No rechaza: revisar <code>res.ok</code>', 'Rechaza: cae en el <code>catch</code> con <code>error.response</code>'],
          ['Configuración global', 'No tiene', 'Instancias con <code>baseURL</code>, cabeceras e interceptores'],
          ['Timeout', 'Con AbortController', 'Opción <code>timeout</code>'],
        ])}
        ${code('js', `import axios from 'axios';

const { data } = await axios.get('https://jsonplaceholder.typicode.com/posts/1');
const { data: creado } = await axios.post('/api/products', { sku: 'MOU-001', name: 'Mouse' });
await axios.get('/api/data', { timeout: 5000, params: { page: 2 } });  // params arma ?page=2`)}

        <h2>Una instancia para toda la app</h2>
        <p>En vez de repetir la URL y el token en cada pedido, se crea una instancia configurada en <code>shared/api</code>. Los <strong>interceptores</strong> son funciones que se ejecutan antes de cada pedido (para agregar el token) o después de cada respuesta (para manejar errores comunes, como un 401).</p>
        ${code('js', `import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

// Antes de cada pedido: agregar el token si existe
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = \`Bearer \${token}\`;
    return config;
  },
  (error) => Promise.reject(error),
);

// Después de cada respuesta: si el token venció (401) en el panel, cerrar sesión
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.status === 401 && window.location.pathname.includes('/admin/')) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export { instance };`, 'src/modules/shared/api/axiosInstance.js (proyecto de la cátedra)')}

        <h2>Servicios: un archivo por operación</h2>
        <p>Los componentes no hablan con Axios directamente: llaman a funciones de servicio. Si mañana cambia la URL o el formato, se toca un solo archivo (es la D de SOLID).</p>
        ${code('js', `import { instance } from '../../shared/api/axiosInstance';

export const login = async (username, password) => {
  const response = await instance.post('api/auth/login', { username, password });
  return { data: response.data.token, error: null };
};`, 'src/modules/auth/services/login.js')}
        ${code('js', `export const getProducts = async (search = null, status = null, pageNumber = 1, pageSize = 20) => {
  const queryString = new URLSearchParams({ search, status, pageNumber, pageSize });
  const response = await instance.get(\`api/products/admin?\${queryString}\`);
  return { data: response.data, error: null };
};`, 'src/modules/products/services/list.js')}

        <h2>Manejar errores del backend</h2>
        <p>Cuando Axios rechaza, el error trae información según qué pasó:</p>
        ${table(['Caso', 'Cómo se detecta', 'Qué mostrar'], [
          ['El servidor respondió con error (4xx/5xx)', '<code>error.response</code> existe: <code>.status</code>, <code>.data</code>', 'Un mensaje según el código'],
          ['No hubo respuesta (sin red, backend caído)', '<code>error.request</code> existe pero no <code>response</code>', '“No pudimos conectar con el servidor”'],
          ['Error al armar el pedido', 'Ninguno de los anteriores', '<code>error.message</code>'],
        ])}
        <p>El backend del TPI responde los errores con un <code>code</code> numérico. El frontend lo traduce con un diccionario, así el mensaje está en un solo lugar y en el idioma de tus usuarios:</p>
        ${code('js', `const frontendErrorMessage = {
  1000: 'Usuario y/o Contraseña no son correctos',
  1002: 'Usuario y/o Contraseña no son correctos',
};

try {
  await singin(username, password);
  navigate('/admin/home');
} catch (error) {
  const code = error?.response?.data?.code;
  setErrorMessage(code ? frontendErrorMessage[code] : 'Llame a soporte');
}`, 'helpers/backendError.js + LoginForm.jsx')}
        ${note('<strong>¿Por qué no mostrar el mensaje que manda el servidor?</strong> Suele estar en inglés o ser técnico, y a veces revela detalles internos. Traducir por código te da control sobre lo que ve el usuario.')}
        ${lab(0)}
      `,
      labs: [
        {
          mode: 'react',
          title: 'Instancia, servicio y errores por código',
          jsx: `
import { useState } from 'react';
import axios from 'axios';

// --- shared/api/axiosInstance.js ---
const instance = axios.create({ baseURL: 'https://jsonplaceholder.typicode.com', timeout: 5000 });
instance.interceptors.request.use((config) => {
  console.log('→', config.method.toUpperCase(), config.url);
  return config;
});

// --- products/services/list.js ---
const getPosts = async (page) => {
  const { data } = await instance.get('/posts', { params: { _page: page, _limit: 3 } });
  return data;
};

// --- auth/services/login.js (simulado: el backend real responde así) ---
const login = async (username, password) => {
  await new Promise((r) => setTimeout(r, 500));
  if (username === 'admin' && password === 'admin') return { token: 'abc123' };
  const error = new Error('Request failed with status code 401');
  error.response = { status: 401, data: { code: 1000 } };
  throw error;
};

// --- auth/helpers/backendError.js ---
const frontendErrorMessage = {
  1000: 'Usuario y/o Contraseña no son correctos',
  1002: 'Usuario y/o Contraseña no son correctos',
};

export default function App() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [msg, setMsg] = useState('');

  const cargar = async (p) => {
    try {
      setPosts(await getPosts(p));
      setPage(p);
    } catch (e) {
      setMsg(e.response ? 'Error ' + e.response.status : 'Sin conexión con el servidor');
    }
  };

  const intentarLogin = async (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    try {
      const { token } = await login(f.get('u'), f.get('p'));
      setMsg('Login correcto. Token: ' + token);
    } catch (error) {
      const code = error?.response?.data?.code;
      setMsg(code ? frontendErrorMessage[code] : 'Llame a soporte');
    }
  };

  return (
    <>
      <form onSubmit={intentarLogin}>
        <input name="u" placeholder="usuario (admin)" /> <input name="p" type="password" placeholder="clave (admin)" />
        <button>Ingresar</button>
      </form>
      <p><strong>{msg}</strong></p>
      <button onClick={() => cargar(page)}>Cargar posts</button>{' '}
      <button disabled={page === 1} onClick={() => cargar(page - 1)}>Atrás</button>{' '}
      <button onClick={() => cargar(page + 1)}>Siguiente</button>
      <ol>{posts.map((p) => <li key={p.id}>{p.title}</li>)}</ol>
    </>
  );
}`,
          css: `input, button { font:inherit; padding:5px 8px; }`,
          hint: 'Probá un login incorrecto: el código 1000 se traduce a un mensaje en español. El interceptor loguea cada pedido de la instancia en la consola.',
        },
      ],
      exercises: [
        {
          official: '#33',
          title: 'Conectar al endpoint de login',
          level: 3,
          prompt: '<p>Basado en el ejercicio #32: configurá lo necesario en Vite. Llamá al endpoint de login y, si falla, controlá el error y mostrá mensajes al usuario según el <code>code</code> que devuelva el backend.</p>',
          hints: ['Proxy de <code>/api</code> en <code>vite.config.js</code> hacia la URL del backend (desde <code>.env.development</code>).', 'Un servicio <code>login(username, password)</code> que haga el POST a <code>api/auth/login</code>.', 'Un diccionario <code>code → mensaje</code> y un <code>catch</code> que lo use.'],
          solution: filesSol('<p>Cuatro piezas: el proxy y la variable de entorno (Vite), la instancia de Axios (shared), el servicio de login y el diccionario de errores (auth), y el formulario que los usa. Si el login sale bien, por ahora se guarda el token y se muestra por consola; en el #34 se navega al dashboard.</p>', [
            { name: '.env.development', lang: 'text', code: 'VITE_BACKEND_URL=http://localhost:5142/' },
            { name: 'vite.config.js', lang: 'js', code: `import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return defineConfig({
    server: {
      proxy: {
        '/api': { target: env.VITE_BACKEND_URL, changeOrigin: true, secure: false },
      },
    },
    plugins: [react(), tailwindcss()],
  });
};` },
            { name: 'src/modules/auth/services/login.js', lang: 'js', code: `import { instance } from '../../shared/api/axiosInstance';

export const login = async (username, password) => {
  const response = await instance.post('api/auth/login', { username, password });
  return { data: response.data.token, error: null };
};` },
            { name: 'src/modules/auth/helpers/backendError.js', lang: 'js', code: `const frontendErrorMessage = {
  1000: 'Usuario y/o Contraseña no son correctos',
  1002: 'Usuario y/o Contraseña no son correctos',
};

export { frontendErrorMessage };` },
            { name: 'src/modules/auth/components/LoginForm.jsx (onValid)', lang: 'jsx', code: `const [errorMessage, setErrorMessage] = useState('');

const onValid = async (formData) => {
  try {
    const { data: token } = await login(formData.username, formData.password);
    localStorage.setItem('token', token);
    console.log('Login correcto');
  } catch (error) {
    const code = error?.response?.data?.code;
    setErrorMessage(code ? frontendErrorMessage[code] : 'Llame a soporte');
  }
};

// …en el JSX, debajo de los botones:
{errorMessage && <p className="text-red-500">{errorMessage}</p>}` },
          ]),
        },
        {
          title: 'Listado paginado desde el servidor',
          level: 3,
          prompt: '<p>Con Axios y <code>https://jsonplaceholder.typicode.com/comments</code>, hacé un listado que pida de a 5 comentarios (<code>_page</code> y <code>_limit</code>), con botones Atrás/Siguiente, un select de tamaño de página (5, 10, 20) que vuelva a la página 1, y “Buscando datos…” mientras carga. El total viene en la cabecera <code>x-total-count</code>.</p>',
          hints: ['El efecto depende de <code>[page, pageSize]</code>, como en <code>ListProductsPage.jsx</code> de la cátedra.', '<code>Number(response.headers[\'x-total-count\'])</code>'],
          solution: reactSol('<p>La página y el tamaño son estado, y el efecto se vuelve a ejecutar cuando cambian. La paginación la hace el servidor: el frontend solo pide la página que necesita y calcula el total de páginas con la cabecera.</p>', `
import { useEffect, useState } from 'react';
import axios from 'axios';

const api = axios.create({ baseURL: 'https://jsonplaceholder.typicode.com' });

export default function App() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelado = false;
    setLoading(true);
    api.get('/comments', { params: { _page: page, _limit: pageSize } })
      .then((res) => {
        if (cancelado) return;
        setItems(res.data);
        setTotal(Number(res.headers['x-total-count']));
      })
      .finally(() => { if (!cancelado) setLoading(false); });
    return () => { cancelado = true; };
  }, [page, pageSize]);

  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <>
      {loading ? <p>Buscando datos…</p> : <ol start={(page - 1) * pageSize + 1}>{items.map((c) => <li key={c.id}>{c.name}</li>)}</ol>}
      <button disabled={page === 1} onClick={() => setPage(page - 1)}>Atrás</button>
      <span> {page} / {totalPages} </span>
      <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Siguiente</button>
      <select value={pageSize} onChange={(e) => { setPage(1); setPageSize(Number(e.target.value)); }}>
        <option value="5">5</option><option value="10">10</option><option value="20">20</option>
      </select>
    </>
  );
}`),
        },
      ],
      sources: [
        { title: 'Primeros pasos · axios', url: 'https://axios-http.com/es/docs/intro', points: ['Se instala con <code>npm install axios</code> y se importa con <code>import axios from "axios"</code>.', 'Pedidos con async/await: <code>const response = await axios.get(url)</code>; los datos están en <code>response.data</code>.', 'Acepta opciones como <code>timeout</code>.'] },
        { title: 'Interceptores · axios', url: 'https://axios.rest/es/pages/advanced/interceptors', points: ['Interceptan y modifican pedidos y respuestas antes de enviarlos o recibirlos.', 'De request: antes de enviar (agregar cabeceras, como el token).', 'De response: antes de entregar la respuesta.', 'Se aplican a instancias creadas con <code>axios.create()</code>.'] },
        { title: 'Error handling · axios', url: 'https://axios.rest/pages/advanced/error-handling', points: ['<code>error.response</code>: el servidor respondió con un código fuera de 2xx (con <code>data</code>, <code>status</code>, <code>headers</code>).', '<code>error.request</code>: se hizo el pedido pero no hubo respuesta.', 'Si no, falló al armar el pedido: <code>error.message</code>.'] },
      ],
    },

    {
      id: 'react-router',
      module: 'react',
      title: 'React Router: rutas, navegación y layouts',
      keywords: 'react router dom rutas createbrowserrouter routerprovider link navlink usenavigate outlet parametros useparams anidadas layout',
      tldr: 'React Router asocia <mark>URLs con componentes</mark> en una SPA: cambia lo que se ve sin recargar la página. Con rutas anidadas y <code>&lt;Outlet /&gt;</code> armás un layout (header + sidebar) que se mantiene mientras cambia el contenido.',
      goals: ['Definir rutas con createBrowserRouter.', 'Navegar con Link, NavLink y useNavigate.', 'Anidar rutas y usar Outlet para el layout del dashboard.', 'Resolver los ejercicios 34 y 35.'],
      body: `
        <h2>Qué es</h2>
        <p>Una biblioteca que facilita el enrutamiento en aplicaciones React de forma eficiente y sencilla. Su principal responsabilidad es la navegación: que <code>/login</code> muestre la página de login y <code>/admin/products</code> el listado, sin recargar.</p>
        ${code('bash', 'npm install react-router-dom')}

        <h2>Definir rutas</h2>
        <p>Se crea un array donde cada objeto tiene, como mínimo, <code>path</code> y <code>element</code>:</p>
        <ul>
          <li><code>path</code>: la URL de la página. Puede tener parámetros dinámicos (<code>/products/:sku</code>).</li>
          <li><code>element</code>: el componente que se monta cuando el usuario entra a esa URL.</li>
        </ul>
        ${code('jsx', `import { createBrowserRouter, RouterProvider } from 'react-router-dom';

function App() {
  const router = createBrowserRouter([
    { path: '/', element: <Home /> },
    { path: '/login', element: <LoginPage /> },
    { path: '/products/:sku', element: <ProductDetail /> },
    { path: '*', element: <NotFound /> },          // cualquier otra: 404
  ]);

  return <RouterProvider router={router} />;
}`)}

        <h2>¿Cómo navegamos?</h2>
        ${table(['Forma', 'Ejemplo', 'Cuándo'], [
          ['Etiqueta <code>a</code>', '<code>&lt;a href="/app"&gt;</code>', 'Recarga toda la página y se pierde el estado: evitala dentro de la app'],
          ['Componente <code>Link</code>', '<code>&lt;Link to="/app"&gt;Ir&lt;/Link&gt;</code>', 'Navega sin recargar'],
          ['Componente <code>NavLink</code>', '<code>&lt;NavLink to="/admin/products" className={({ isActive }) =&gt; …}&gt;</code>', 'Como Link, pero sabe si está activo: ideal para resaltar el menú'],
          ['Hook <code>useNavigate</code>', '<code>navigate("/admin/home")</code>', 'Desde código: después de un login, al guardar un formulario'],
          ['<code>navigate(-1)</code>', '<code>&lt;button onClick={() =&gt; navigate(-1)}&gt;Volver&lt;/button&gt;</code>', 'Volver a la página anterior'],
          ['Componente <code>Navigate</code>', '<code>&lt;Navigate to="/login" replace /&gt;</code>', 'Redirigir al renderizar (rutas privadas)'],
        ])}
        ${code('jsx', `import { useNavigate, useParams } from 'react-router-dom';

function ProductDetail() {
  const { sku } = useParams();          // lee el :sku de la URL
  const navigate = useNavigate();
  return (
    <>
      <h1>Producto {sku}</h1>
      <button onClick={() => navigate(-1)}>Volver</button>
    </>
  );
}`)}

        <h2>Dependencias entre rutas y Outlet</h2>
        <p>Las rutas pueden anidarse con <code>children</code>: así un componente se renderiza <strong>dentro</strong> de otro según la URL. En el proyecto de la cátedra, <code>Home</code>, <code>ListProductsPage</code> y <code>ListOrdersPage</code> se dibujan dentro de <code>Dashboard</code>. Pero no alcanza con declarar la dependencia: el padre tiene que indicar <strong>dónde</strong> va el hijo, con <code>&lt;Outlet /&gt;</code>.</p>
        ${code('jsx', `const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/admin',
    element: <Dashboard />,
    children: [
      { path: '/admin/home', element: <Home /> },
      { path: '/admin/products', element: <ListProductsPage /> },
      { path: '/admin/products/create', element: <CreateProductPage /> },
      { path: '/admin/orders', element: <ListOrdersPage /> },
    ],
  },
]);

function Dashboard() {
  return (
    <div className="grid sm:grid-cols-[256px_1fr]">
      <header>…</header>
      <aside><nav>…NavLinks…</nav></aside>
      <main>
        <Outlet />   {/* acá aparece Home, Products u Orders según la URL */}
      </main>
    </div>
  );
}`)}
        ${note('<strong>Recargar en una ruta y ver 404:</strong> en producción, el servidor tiene que devolver siempre <code>index.html</code> para cualquier ruta (React Router decide qué mostrar). El servidor de desarrollo de Vite ya lo hace solo.')}
        ${lab(0)}
      `,
      labs: [
        {
          mode: 'react',
          tailwind: true,
          title: 'Dashboard con rutas anidadas (Ejercicios 34 y 35)',
          jsx: `
import { useState } from 'react';
import { createMemoryRouter, RouterProvider, NavLink, Outlet, useNavigate, useParams, Link } from 'react-router-dom';

// En tu proyecto: createBrowserRouter. Acá usamos memoria porque el laboratorio no tiene URL propia.

function LoginPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-3 p-8 bg-white rounded-lg shadow max-w-sm mx-auto mt-6">
      <h1 className="text-xl font-bold">Login</h1>
      <button className="bg-purple-200 hover:bg-purple-300 rounded py-2" onClick={() => navigate('/admin/home')}>
        Iniciar sesión (va a /admin/home)
      </button>
    </div>
  );
}

function Dashboard() {
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();
  const linkStyles = ({ isActive }) =>
    'pl-4 block py-3 rounded-full transition hover:bg-gray-100 ' + (isActive ? 'bg-purple-200 hover:bg-purple-100' : '');

  return (
    <div className="relative h-[460px] grid grid-cols-1 grid-rows-[auto_1fr] sm:gap-3 sm:grid-cols-[200px_1fr] bg-gray-100 p-2">
      <header className="flex items-center justify-between p-4 shadow rounded bg-white sm:col-span-2">
        <span>Mi Dashboard</span>
        <button className="hidden sm:block bg-purple-200 rounded px-3 py-1" onClick={() => navigate('/login')}>Cerrar sesión</button>
        <button className="sm:hidden" onClick={() => setOpenMenu(!openMenu)}>{openMenu ? '×' : '☰'}</button>
      </header>
      <aside className={'absolute top-0 bottom-0 bg-white w-[200px] p-4 rounded shadow transition-all z-10 sm:relative sm:left-0 ' + (openMenu ? 'left-0' : '-left-[220px]')}>
        <nav>
          <ul>
            <li><NavLink to="/admin/home" className={linkStyles} onClick={() => setOpenMenu(false)}>Principal</NavLink></li>
            <li><NavLink to="/admin/products" className={linkStyles} onClick={() => setOpenMenu(false)}>Productos</NavLink></li>
            <li><NavLink to="/admin/orders" className={linkStyles} onClick={() => setOpenMenu(false)}>Órdenes</NavLink></li>
          </ul>
        </nav>
      </aside>
      <main className="p-5 overflow-y-auto bg-white rounded">
        <Outlet />
      </main>
    </div>
  );
}

const Home = () => <h2 className="text-2xl">Hola a todos</h2>;
const Orders = () => <h2 className="text-2xl">Órdenes</h2>;
function Products() {
  return (
    <>
      <h2 className="text-2xl mb-2">Productos</h2>
      <ul className="list-disc pl-5">
        {['MOU-001', 'TEC-002'].map(sku => <li key={sku}><Link className="underline" to={'/admin/products/' + sku}>{sku}</Link></li>)}
      </ul>
    </>
  );
}
function ProductDetail() {
  const { sku } = useParams();
  const navigate = useNavigate();
  return <><h2 className="text-2xl">Producto {sku}</h2><button className="underline" onClick={() => navigate(-1)}>Volver</button></>;
}

const router = createMemoryRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/admin',
    element: <Dashboard />,
    children: [
      { path: '/admin/home', element: <Home /> },
      { path: '/admin/products', element: <Products /> },
      { path: '/admin/products/:sku', element: <ProductDetail /> },
      { path: '/admin/orders', element: <Orders /> },
    ],
  },
], { initialEntries: ['/login'] });

export default function App() {
  return <RouterProvider router={router} />;
}`,
          hint: 'React Router 7 real. Iniciá sesión, navegá con el menú (el activo se resalta con <code>NavLink</code>), entrá a un producto y volvé con <code>navigate(-1)</code>. Achicá la ventana para ver el menú móvil.',
        },
      ],
      exercises: [
        {
          official: '#34',
          title: 'Login → Dashboard',
          level: 2,
          prompt: `<ul>
            <li>Basado en el proyecto <a href="https://github.com/vchibilisco/Dsw2025_Unidad5" target="_blank" rel="noopener">github.com/vchibilisco/Dsw2025_Unidad5</a>.</li>
            <li>Creá un componente <code>Dashboard.jsx</code> que por el momento solo tenga el mensaje “Hola a todos”.</li>
            <li>La página Login se relaciona con la URL <code>/login</code> y el Dashboard con <code>/app</code>.</li>
            <li>Cuando el inicio de sesión termine correctamente, navegá de <code>/login</code> a <code>/app</code>.</li>
          </ul>`,
          solution: filesSol('<p>Se definen las dos rutas en <code>App.jsx</code> y, en el <code>onValid</code> del formulario, después de un login exitoso se llama a <code>navigate(\'/app\')</code>. Una ruta <code>/</code> que redirige a <code>/login</code> evita una pantalla en blanco.</p>', [
            { name: 'src/modules/templates/components/Dashboard.jsx', lang: 'jsx', code: `function Dashboard() {
  return <h1>Hola a todos</h1>;
}

export default Dashboard;` },
            { name: 'src/App.jsx', lang: 'jsx', code: `import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import LoginPage from './modules/auth/pages/LoginPage';
import Dashboard from './modules/templates/components/Dashboard';

function App() {
  const router = createBrowserRouter([
    { path: '/', element: <Navigate to="/login" replace /> },
    { path: '/login', element: <LoginPage /> },
    { path: '/app', element: <Dashboard /> },
  ]);

  return <RouterProvider router={router} />;
}

export default App;` },
            { name: 'src/modules/auth/components/LoginForm.jsx (cambios)', lang: 'jsx', code: `import { useNavigate } from 'react-router-dom';

// dentro del componente:
const navigate = useNavigate();

const onValid = async (formData) => {
  try {
    const { data: token } = await login(formData.username, formData.password);
    localStorage.setItem('token', token);
    navigate('/app');
  } catch (error) {
    const code = error?.response?.data?.code;
    setErrorMessage(code ? frontendErrorMessage[code] : 'Llame a soporte');
  }
};` },
          ]),
        },
        {
          official: '#35',
          title: 'Layout / Dashboard',
          level: 3,
          prompt: `<ul>
            <li>Basado en el ejercicio #34.</li>
            <li>Usando Tailwind CSS, pensando en Atomic Design y mobile first: creá los componentes necesarios para Header, Sidebar y Footer.</li>
            <li>El componente Dashboard debe usarlos, aplicando el mismo layout que se usó en la Unidad 4.</li>
          </ul><p><strong>Objetivo:</strong> replicar apariencia, color y funcionamiento del Dashboard de la Unidad 4. <strong>Ayuda:</strong> usá la documentación oficial de Tailwind para encontrar las clases que replican el comportamiento.</p>`,
          hints: ['Layout de la Unidad 4: grid de una columna en móvil (header, main, footer); desde 600px, 200px + 1fr con áreas header/nav/main/footer.', 'En Tailwind: <code>grid grid-rows-[auto_1fr_auto] sm:grid-cols-[200px_1fr]</code> y <code>sm:col-span-2</code> en header y footer.', 'Sidebar móvil: <code>absolute -left-[200px]</code>, y <code>left-0</code> cuando está abierto; desde <code>sm:</code> vuelve a <code>static</code>.'],
          solution: reactSol('<p>Tres organismos (<code>Header</code>, <code>Sidebar</code>, <code>Footer</code>) en <code>templates/components</code> y el <code>Dashboard</code> como plantilla con <code>&lt;Outlet /&gt;</code>. Las clases replican <code>dashboard_style.css</code>: fondo <code>#333</code> en header y footer, sidebar <code>#f4f4f4</code> de 200px, ítems con borde inferior, y el menú móvil que se desliza desde la izquierda. El estado <code>openMenu</code> vive en el Dashboard porque lo usan Header (el botón) y Sidebar (la posición). En el laboratorio de abajo se reemplaza el <code>Outlet</code> por contenido fijo para poder verlo sin rutas.</p>', `
import { useState } from 'react';

function Header({ onToggleMenu, onLogout }) {
  return (
    <header className="sm:col-span-2 h-[50px] bg-[#333] text-white flex items-center justify-between px-4">
      <span>Gestor de turnos</span>
      <div className="flex items-center gap-4">
        <button className="sm:hidden" onClick={onToggleMenu} aria-label="Abrir menú">&#9776;</button>
        <button onClick={onLogout}>Cerrar Sesión</button>
      </div>
    </header>
  );
}

function Sidebar({ open }) {
  const items = ['Panel', 'Productos', 'Órdenes'];
  return (
    <nav className={'absolute top-[50px] bottom-0 w-[200px] bg-[#f4f4f4] transition-all z-10 sm:static ' + (open ? 'left-0' : '-left-[200px]')}>
      <ul>
        {items.map((item) => (
          <li key={item} className="p-4 border-b border-[#ddd]">{item}</li>
        ))}
      </ul>
    </nav>
  );
}

function Footer() {
  return <footer className="sm:col-span-2 bg-[#333] text-white text-center p-4">Mi Aplicación &copy; 2026</footer>;
}

export default function Dashboard() {
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <div className="relative grid grid-cols-1 grid-rows-[auto_1fr_auto] h-[100dvh] sm:grid-cols-[200px_1fr]">
      <Header onToggleMenu={() => setOpenMenu(!openMenu)} onLogout={() => console.log('logout')} />
      <Sidebar open={openMenu} />
      <main className="p-4 overflow-y-auto">
        {/* En el proyecto: <Outlet /> */}
        <h1 className="text-2xl">Hola a todos</h1>
      </main>
      <Footer />
    </div>
  );
}`, { name: 'src/modules/templates/components/Dashboard.jsx (con Header, Sidebar y Footer)', tailwind: true }),
        },
      ],
      sources: [
        { title: 'Routing · React Router', url: 'https://reactrouter.com/start/declarative/routing', points: ['Las rutas acoplan segmentos de URL con componentes.', 'Las rutas hijas incluyen el camino del padre.', '<code>&lt;Outlet /&gt;</code> renderiza la ruta hija dentro del padre.', '<code>Link</code> y <code>NavLink</code> enlazan rutas; <code>NavLink</code> sabe si está activo.'] },
        { title: 'Navigating · React Router', url: 'https://reactrouter.com/start/declarative/navigating', points: ['<code>Link</code> y <code>NavLink</code> para enlaces; <code>NavLink</code> recibe <code>isActive</code> para estilos.', '<code>useNavigate</code> navega desde código.'] },
      ],
    },

    {
      id: 'rutas-privadas',
      module: 'react',
      title: 'Rutas privadas con Context',
      keywords: 'rutas privadas protectedroute authprovider useauth context navigate token login logout',
      tldr: 'Una ruta privada <mark>redirige al login si el usuario no está autenticado</mark>. Se arma con un <code>AuthProvider</code> (Context) que guarda la sesión, un hook <code>useAuth</code> para leerla y un <code>ProtectedRoute</code> que decide.',
      goals: ['Exponer la sesión a toda la app con un AuthProvider.', 'Leerla desde cualquier componente con useAuth.', 'Proteger rutas con ProtectedRoute y cerrar sesión.'],
      body: `
        <h2>El objetivo</h2>
        <p>Encontrar un mecanismo para que, si el usuario no está autenticado, sea redirigido directamente a la página de login. Como la información del usuario se necesita en varios lugares (el ProtectedRoute, el botón de cerrar sesión, el formulario de login), se expone a nivel global con la <strong>Context API</strong>, desde el módulo <code>auth</code>.</p>
        ${flow('Usuario entra a /admin/products', 'ProtectedRoute pregunta a useAuth', '¿Autenticado?', 'Sí: muestra la página · No: Navigate a /login')}

        <h2>1. AuthProvider</h2>
        <p>Un componente en la carpeta <code>context</code> que guarda el estado de la sesión y lo expone al resto de la app. Inicializa leyendo el token de localStorage, así la sesión sobrevive a una recarga.</p>
        ${code('jsx', `import { createContext, useState } from 'react';
import { login } from '../services/login';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token');
    return Boolean(token);
  });

  const singout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
  };

  const singin = async (username, password) => {
    const { data, error } = await login(username, password);
    if (error) return { error };
    localStorage.setItem('token', data);
    setIsAuthenticated(true);
    return { error: null };
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, singin, singout }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext };`, 'src/modules/auth/context/AuthProvider.jsx')}

        <h2>2. useAuth</h2>
        <p>Un custom hook en la carpeta <code>hook</code>: es la única forma en que el resto de la app accede a la sesión. Si alguien lo usa fuera del Provider, avisa con un error claro.</p>
        ${code('jsx', `import { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth no debe ser usado por fuera de AuthProvider');
  }
  return {
    isAuthenticated: context.isAuthenticated,
    singin: context.singin,
    singout: context.singout,
  };
};

export default useAuth;`, 'src/modules/auth/hook/useAuth.js')}
        ${note('<strong>Detalle del repo de la cátedra:</strong> en su <code>useAuth.js</code> la línea es <code>new Error(…)</code> sin <code>throw</code>, así que el error se crea pero nunca se lanza. Con <code>throw</code> el aviso funciona de verdad.', 'warn')}

        <h2>3. ProtectedRoute</h2>
        <p>Recibe la página como <code>children</code> y verifica si el usuario está logueado: si no, devuelve un <code>Navigate</code> a <code>/login</code>; si sí, devuelve la página.</p>
        ${code('jsx', `import { Navigate } from 'react-router-dom';
import useAuth from '../hook/useAuth';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  return children;
}

export default ProtectedRoute;`, 'src/modules/auth/components/ProtectedRoute.jsx')}

        <h2>4. Implementación</h2>
        <ul>
          <li><strong>AuthProvider</strong> engloba toda la app.</li>
          <li><strong>ProtectedRoute</strong> engloba solamente a los componentes que deben ser privados.</li>
        </ul>
        ${code('jsx', `function App() {
  const router = createBrowserRouter([
    { path: '/login', element: <LoginPage /> },
    {
      path: '/admin',
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
      children: [
        { path: '/admin/home', element: <Home /> },
        { path: '/admin/products', element: <ListProductsPage /> },
      ],
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}`, 'src/App.jsx')}
        ${note('<strong>Proteger en el frontend no es seguridad.</strong> Alguien puede saltear el ProtectedRoute desde DevTools. Lo que protege de verdad los datos es que el backend rechace pedidos sin un token válido (401). El ProtectedRoute es para la experiencia de usuario.')}
        ${lab(0)}
      `,
      labs: [
        {
          mode: 'react',
          title: 'Rutas privadas funcionando',
          jsx: `
import { createContext, useContext, useState } from 'react';
import { createMemoryRouter, RouterProvider, Navigate, Outlet, NavLink, useNavigate } from 'react-router-dom';

// ---- auth/context/AuthProvider.jsx ----
const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const singin = async (username, password) => {
    await new Promise(r => setTimeout(r, 400));             // simula el pedido al backend
    if (username !== 'admin' || password !== 'admin') return { error: 'Usuario y/o Contraseña no son correctos' };
    setIsAuthenticated(true);
    return { error: null };
  };
  const singout = () => setIsAuthenticated(false);
  return <AuthContext.Provider value={{ isAuthenticated, singin, singout }}>{children}</AuthContext.Provider>;
}

// ---- auth/hook/useAuth.js ----
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth no debe ser usado por fuera de AuthProvider');
  return context;
}

// ---- auth/components/ProtectedRoute.jsx ----
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

// ---- páginas ----
function LoginPage() {
  const { singin } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const onSubmit = async (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const { error } = await singin(f.get('u'), f.get('p'));
    if (error) return setError(error);
    navigate('/admin/home');
  };
  return (
    <form className="box" onSubmit={onSubmit}>
      <h2>Login</h2>
      <input name="u" placeholder="usuario: admin" />
      <input name="p" type="password" placeholder="clave: admin" />
      <button>Iniciar sesión</button>
      {error && <p className="err">{error}</p>}
      <button type="button" onClick={() => navigate('/admin/products')}>Intentar entrar a /admin/products sin login</button>
    </form>
  );
}

function Dashboard() {
  const { singout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="layout">
      <nav>
        <NavLink to="/admin/home">Principal</NavLink>
        <NavLink to="/admin/products">Productos</NavLink>
        <button onClick={() => { singout(); navigate('/login'); }}>Cerrar sesión</button>
      </nav>
      <main><Outlet /></main>
    </div>
  );
}

const router = createMemoryRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/admin',
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
    children: [
      { path: '/admin/home', element: <h3>Bienvenido al panel</h3> },
      { path: '/admin/products', element: <h3>Listado de productos (privado)</h3> },
    ],
  },
], { initialEntries: ['/admin/home'] });

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}`,
          css: `
.box { display:grid; gap:8px; max-width:300px; }
input, button { font:inherit; padding:6px 8px; }
.err { color:#c0392b; margin:0; }
.layout { display:grid; grid-template-columns:150px 1fr; gap:12px; border:1px solid #d3d9d3; border-radius:12px; padding:12px; }
nav { display:grid; gap:6px; align-content:start; }
nav a { padding:6px 8px; border-radius:8px; color:inherit; text-decoration:none; }
nav a.active { background:#e9d5ff; font-weight:bold; }`,
          hint: 'La app arranca pidiendo <code>/admin/home</code>, pero como no hay sesión, <code>ProtectedRoute</code> te manda a <code>/login</code>. Probá el botón de entrar sin login, después iniciá sesión con admin/admin.',
        },
      ],
      exercises: [
        {
          title: 'Proteger el dashboard',
          level: 3,
          prompt: '<p>En tu proyecto del #35: agregá <code>AuthProvider</code>, <code>useAuth</code> y <code>ProtectedRoute</code> en el módulo <code>auth</code>; envolvé las rutas de <code>/admin</code> con <code>ProtectedRoute</code>; hacé que el login use <code>singin</code> y navegue a <code>/admin/home</code>, y que el botón “Cerrar sesión” del Header use <code>singout</code> y navegue a <code>/login</code>. Además, si alguien autenticado entra a <code>/login</code>, redirigilo al panel.</p>',
          hints: ['Para lo último: en <code>LoginPage</code>, <code>if (isAuthenticated) return &lt;Navigate to="/admin/home" replace /&gt;</code>.'],
          solution: filesSol('<p>Los tres archivos de auth son los de la lección (los del proyecto de la cátedra, con el <code>throw</code> corregido). Lo nuevo es la redirección inversa en el login y conectar el Header con <code>singout</code>.</p>', [
            { name: 'src/modules/auth/pages/LoginPage.jsx', lang: 'jsx', code: `import { Navigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import useAuth from '../hook/useAuth';

function LoginPage() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/admin/home" replace />;

  return (
    <div className="flex flex-col justify-center h-screen bg-gray-100 sm:items-center">
      <LoginForm />
    </div>
  );
}

export default LoginPage;` },
            { name: 'src/modules/auth/components/LoginForm.jsx (onValid)', lang: 'jsx', code: `const { singin } = useAuth();
const navigate = useNavigate();

const onValid = async (formData) => {
  try {
    const { error } = await singin(formData.username, formData.password);
    if (error) {
      setErrorMessage(error.frontendErrorMessage);
      return;
    }
    navigate('/admin/home');
  } catch (error) {
    const code = error?.response?.data?.code;
    setErrorMessage(code ? frontendErrorMessage[code] : 'Llame a soporte');
  }
};` },
            { name: 'src/modules/templates/components/Dashboard.jsx (logout)', lang: 'jsx', code: `const navigate = useNavigate();
const { singout } = useAuth();

const logout = () => {
  singout();
  navigate('/login');
};

// <Header onLogout={logout} onToggleMenu={…} />` },
          ]),
        },
      ],
      sources: [
        { title: 'useContext · React', url: 'https://es.react.dev/reference/react/useContext', points: ['Lee un contexto desde cualquier componente debajo del Provider.', 'Si no hay Provider, devuelve el valor por defecto de <code>createContext</code>.'] },
        { title: 'Proyecto base de la Unidad 5', url: 'https://github.com/vchibilisco/Dsw2025_Unidad5', points: ['<code>AuthProvider.jsx</code>, <code>useAuth.js</code> y <code>ProtectedRoute.jsx</code> en el módulo auth.', '<code>App.jsx</code> envuelve el router con <code>AuthProvider</code> y las rutas de <code>/admin</code> con <code>ProtectedRoute</code>.'] },
      ],
    },

    {
      id: 'build-deploy',
      module: 'react',
      title: 'Generar el bundle y desplegar',
      keywords: 'build bundle dist vite build preview deploy despliegue netlify vercel base spa fallback',
      tldr: '<code>npm run build</code> genera la carpeta <mark>dist/</mark>: tu app optimizada (minificada, en pocos archivos) lista para subir a cualquier hosting estático. Con <code>npm run preview</code> la probás antes.',
      goals: ['Generar y probar el bundle de producción.', 'Entender qué hay dentro de dist/.', 'Desplegar una SPA y configurar el fallback a index.html.'],
      body: `
        <h2>De tu código al bundle</h2>
        <p>En desarrollo, Vite sirve tus archivos casi tal cual, uno por uno. Para producción hace lo contrario: los <strong>empaqueta</strong> (bundle). Toma <code>index.html</code> como punto de entrada, sigue todos los imports, compila el JSX, elimina el código que no se usa, minifica y genera unos pocos archivos con nombres únicos (para que el navegador los cachee sin problemas).</p>
        ${code('bash', `npm run build      # vite build → genera dist/
npm run preview    # sirve dist/ en http://localhost:4173 para probarlo`)}
        ${code('text', `dist/
├── index.html
├── vite.svg                  (lo que estaba en public/ se copia tal cual)
└── assets/
    ├── index-BxK3s9aQ.js     todo tu JS + React, minificado
    └── index-D8f2Lm1c.css    todo tu CSS (incluido el de Tailwind que usaste)`)}
        ${note('<strong>Probá siempre con preview.</strong> Algunos errores solo aparecen en producción: una variable de entorno que falta, una ruta de imagen absoluta, un import con mayúsculas distintas (Windows no distingue, Linux sí).')}

        <h2>Antes de compilar</h2>
        <ul>
          <li><strong>Variables de entorno:</strong> el build usa el modo <code>production</code>, así que lee <code>.env.production</code>. La URL del backend real va ahí.</li>
          <li><strong>El proxy no existe en producción:</strong> la configuración <code>server.proxy</code> es solo del servidor de desarrollo. En producción, o el backend permite CORS, o el hosting reenvía <code>/api</code> al backend.</li>
          <li><strong>Base pública:</strong> si la app no vive en la raíz del dominio (ej. <code>usuario.github.io/turnos/</code>), compilá con <code>vite build --base=/turnos/</code>.</li>
          <li><code>npm run lint</code> para atrapar errores antes.</li>
        </ul>

        <h2>Desplegar</h2>
        <p><code>dist/</code> son archivos estáticos: sirve cualquier hosting estático (Netlify, Vercel, GitHub Pages, un Nginx propio). En Netlify o Vercel alcanza con conectar el repositorio e indicar el comando <code>npm run build</code> y la carpeta <code>dist</code>.</p>
        <h3>El detalle de las SPA</h3>
        <p>Si alguien entra directo a <code>tusitio.com/admin/products</code>, el servidor busca un archivo <code>admin/products</code> que no existe y responde 404. Hay que configurarlo para que devuelva <strong>siempre <code>index.html</code></strong> y deje que React Router decida:</p>
        ${code('text', `/*    /index.html   200`, 'public/_redirects (Netlify)')}
        ${code('json', `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`, 'vercel.json (Vercel)')}
        ${code('text', `location / {
  try_files $uri /index.html;
}`, 'nginx.conf')}
      `,
      exercises: [
        {
          title: 'Build y preview',
          level: 1,
          prompt: '<p>En tu proyecto de la Unidad 5: (1) corré <code>npm run build</code> y anotá cuántos archivos hay en <code>dist/assets</code> y cuánto pesan; (2) corré <code>npm run preview</code> y navegá la app; (3) entrá directo a <code>http://localhost:4173/admin/home</code> y recargá: ¿funciona? (4) Creá un <code>.env.production</code> con otra <code>VITE_BACKEND_URL</code> y verificá con <code>console.log(import.meta.env.VITE_BACKEND_URL)</code> que el build la usa.</p>',
          solution: { explain: '<p>Deberías ver un JS y un CSS con hash en el nombre (los números exactos varían). <code>vite preview</code> ya hace el fallback a <code>index.html</code>, así que recargar en <code>/admin/home</code> funciona; en un hosting real hay que configurarlo (<code>_redirects</code>, <code>vercel.json</code> o <code>try_files</code>). El build lee <code>.env.production</code> porque corre en modo <code>production</code>; el valor queda “quemado” en el JS al compilar, así que si lo cambiás hay que volver a compilar.</p>' },
        },
      ],
      sources: [
        { title: 'Building for Production · Vite', url: 'https://vite.dev/guide/build', points: ['<code>vite build</code> genera un bundle de producción usando <code>index.html</code> como entrada.', 'El resultado va a <code>dist/</code> y se sirve en cualquier hosting estático.', 'La opción <code>base</code> (o <code>--base</code>) ajusta las rutas si la app vive en una subruta.'] },
      ],
    },
  );
})();
