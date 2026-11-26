# Fronteando Ando

Guía de frontend desde cero (HTML, CSS, JavaScript y React) basada en las Unidades 4 y 5 de Desarrollo de Software (UTN-FRT).

40 lecciones con teoría, laboratorios en vivo y ejercicios con solución.

**Sitio publicado:** https://franco704.github.io/fronteando-ando/

Además, integrado del "Laboratorio Frontend DSW":

- 37 laboratorios visuales (event loop paso a paso, métodos de array, especificidad, flexbox, Virtual DOM, ciclo de vida con React real, router con rutas privadas…) dentro de cada lección y todos juntos en `#/laboratorios`.
- Trampas de parcial por tema y un mini-quiz al final de cada lección.
- Simulacro (`#/simulacro`): 40 rápidas o 10 de código con tiempo, sorteadas de un banco de 892 preguntas, con revisión. Los errores quedan en `#/repaso` hasta que los aciertes.
- Modelos de parcial (`#/parciales`): 5 exámenes fijos con el estilo del profesor, incluido el 2do parcial reconstruido.
- Preguntas de Moyano (`#/moyano`) y práctica por diapositivas (`#/diapositivas`), con sus preguntas sumadas al banco del simulacro.
- Resumen para el parcial (`#/resumen`) y resumen conceptual (`#/conceptual`).
- Videos de resumen (`#/videos`): un video por lección (`videos/NN-<id>.mp4`), de corrido y con salto a cada lección; cada lección también tiene el suyo arriba.
- Proyectos (`#/proyectos`) con requisitos para tildar y pruebas de fuego.
- Consola JS y playground de React (botón "> Consola" en escritorio, o desde el índice).
- Animaciones: una pantalla de entrada con la trampa típica cada vez que cambiás de tema y un glifo animado del tema en la cabecera de cada lección.

## Usarla en tu computadora

No necesita instalación ni compilación: es HTML, CSS y JavaScript con módulos ES. Como los navegadores no cargan módulos desde `file://`, levantá un servidor estático en la carpeta (por ejemplo `python3 -m http.server`) y abrí `http://localhost:8000`. El progreso se guarda en el navegador de cada persona, con las claves de siempre (`fa-done`, `fa-practica` y `fa-theme`).

Pruebas: `npm test` (carga todo el temario, el banco y los exámenes y valida lecciones, laboratorios, preguntas, temas y resúmenes).

## Cómo está organizado

La estructura cuenta de qué trata la materia (arquitectura *screaming*):

```
index.html              armazón: barra, índice, dock inferior en móvil
src/main.js             raíz de composición: rutas por hash (#/<lección>, #/resumen, #/videos, #/simulacro, #/repaso…) y vistas
src/temario/            lecciones por unidad (unidad-iv/: web, HTML, CSS, JavaScript; unidad-v/: entorno moderno y React), catálogo, ayudantes de redacción e índice
src/banco/              banco de preguntas, temas, trampas de parcial, temas probables y pantallas de entrada
src/examenes/           modelos de parcial, preguntas de Moyano y práctica por diapositivas (Unidades IV y V)
src/resumenes/          resumen para el parcial y resumen conceptual
src/proyectos/          proyectos con requisitos y pruebas de fuego
src/laboratorios/       editor en vivo (HTML/CSS/JS y React), laboratorios visuales web y React, componentes y carga de React bajo demanda
src/consola/            consola JS y playground de React
src/estudio/            progreso, motor de preguntas (práctica y examen) y otras guías
src/vistas/             inicio, lección, resúmenes, videos, laboratorios y práctica (simulacro, repaso, parciales, Moyano, diapositivas, proyectos)
src/animaciones/        pantalla de entrada a cada tema y glifo de cada lección
src/ui/ src/nucleo/     armazón, resaltado de código e íconos; DOM, almacenamiento y rutas
styles/                 tokens, base, armazón, contenido, editor, práctica, vistas y animaciones
```

El diseño es *mobile-first*: en el celular todo se alcanza desde el dock inferior (Inicio, Índice, Resumen, Simulacro, Repasar) y el cajón, con el buscador, todas las herramientas y el índice completo; desde 1024 px el índice queda fijo y las herramientas principales pasan a la barra superior, y desde 1280 px aparece el riel con las secciones de la lección. La portada abre con un panel Estilos como el de DevTools: varias reglas compiten por el título de la página, la especificidad la calcula la función del laboratorio de especificidad y el navegador aplica la cascada de verdad. Una sola tipografía, Recursive, usada con sus ejes: Sans para leer, más peso para títulos y MONO para el código, con los colores del panel Elementos. El color de acento marca la unidad: naranja de HTML la IV, cian de React la V.

## También probá

### 2.º año

- [Integrando Ando](https://franco704.github.io/integrando-ando/): Análisis Matemático II ([repositorio](https://github.com/Franco704/integrando-ando))
- [Operando Ando](https://franco704.github.io/operando-ando/): Sistemas Operativos ([repositorio](https://github.com/Franco704/operando-ando))
- [Induciendo Ando](https://franco704.github.io/induciendo-ando/): Física II ([repositorio](https://github.com/Franco704/induciendo-ando))

### 3.er año

- [Consultando Ando](https://franco704.github.io/consultando-ando/): Gestión de Datos ([repositorio](https://github.com/Franco704/consultando-ando))
- [Backeando Ando](https://franco704.github.io/backeando-ando/): Desarrollo de Software, backend ([repositorio](https://github.com/Franco704/backeando-ando))
- [Diseñando Ando](https://franco704.github.io/disenando-ando/): Diseño de Sistemas de Información ([repositorio](https://github.com/Franco704/disenando-ando))
- [Iterando Ando](https://franco704.github.io/iterando-ando/): Matemática Superior ([repositorio](https://github.com/Franco704/iterando-ando))
- [Modulando Ando](https://franco704.github.io/modulando-ando/): Comunicación de Datos ([repositorio](https://github.com/Franco704/modulando-ando))
- [Probando Ando](https://franco704.github.io/probando-ando/): Probabilidad y Estadística ([repositorio](https://github.com/Franco704/probando-ando))
- [Economizar](https://franco704.github.io/economizar/): Economía ([repositorio](https://github.com/Franco704/economizar))

## Agradecimientos

Agradecimientos a **Mateo Rusconi**, autor del "Laboratorio Frontend DSW", de donde vienen los laboratorios visuales, el banco de preguntas, el simulacro, los proyectos, la consola y las animaciones que se sumaron a esta guía.
