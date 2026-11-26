/* Pantalla de entrada de cada tema: etiqueta tipeada, trampa típica y unidad.
   Generado a partir del "Laboratorio Frontend DSW" (Mateo Rusconi). */
export const META = {
  "web": {"tag":"fundamentos-web","teaser":"Blink no es el motor de JS de Chrome. Ese es V8. Y una PWA no es un tipo de renderizado.","unit":4},
  "html": {"tag":"html","teaser":"Un <button> dentro de un form, sin type, ENVÍA el formulario. Y <head> no es <header>.","unit":4},
  "css": {"tag":"css","teaser":"Si dos reglas tienen la misma especificidad, gana la última de la hoja. El orden de las clases en el atributo class no importa.","unit":4},
  "layout": {"tag":"layout","teaser":"Con flex-direction: column, justify-content centra en VERTICAL. El eje principal se dio vuelta.","unit":4},
  "js": {"tag":"javascript","teaser":"console.log(x); var x = 5; imprime undefined. Con let tira ReferenceError.","unit":4},
  "dom": {"tag":"dom","teaser":"createElement crea el nodo en memoria. No aparece en pantalla hasta que hacés appendChild.","unit":4},
  "obj": {"tag":"objetos","teaser":"Una arrow function como método de objeto no ve this.nombre: su this es el del scope exterior.","unit":4},
  "arr": {"tag":"arrays","teaser":"push no devuelve el array: devuelve el nuevo length. Y forEach siempre devuelve undefined.","unit":4},
  "async": {"tag":"event-loop","teaser":"Promise.then le gana a setTimeout(..., 0). Siempre. Las microtareas tienen prioridad.","unit":4},
  "store": {"tag":"storage","teaser":"localStorage solo guarda strings. Si le pasás un objeto, guarda \"[object Object]\".","unit":4},
  "entorno": {"tag":"node-vite","teaser":"\"^1.2.3\" puede instalar 1.9.0 pero nunca 2.0.0. \"~1.2.3\" solo se mueve en el PATCH: 1.2.x.","unit":5},
  "jsx": {"tag":"jsx","teaser":"JSX no es HTML: className, htmlFor, todo se cierra (<img />) y un componente devuelve UN solo elemento raíz.","unit":5},
  "estado": {"tag":"props-state","teaser":"{count && <p>…</p>} con count = 0 muestra un \"0\". Y setCount no cambia count hasta el próximo render.","unit":5},
  "efectos": {"tag":"use-effect","teaser":"useEffect(fn, []) corre solo al montar. Sin array, corre después de CADA render. Y el render siempre va antes que el efecto.","unit":5},
  "rforms": {"tag":"forms","teaser":"Un input con value y sin onChange queda congelado. Y register() trabaja sobre inputs NO controlados.","unit":5},
  "arq": {"tag":"arquitectura","teaser":"Un InputField (label + input + error) es una MOLÉCULA, no un átomo. Y las carpetas \"gritan\" el dominio (auth, products), no la técnica.","unit":5},
  "tw": {"tag":"tailwind","teaser":"md:flex significa \"desde 768px\", no \"solo en tablet\". Sin prefijo, la clase aplica en TODOS los tamaños.","unit":5},
  "router": {"tag":"router","teaser":"Un <a href> recarga toda la página y perdés el estado. <Link to> navega sin recargar. Y sin <Outlet /> las rutas hijas no se ven.","unit":5},
};
