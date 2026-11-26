// Exámenes fijos: modelos de parcial, preguntas de Moyano y la práctica por diapositivas (bloques de las Unidades IV y V).
import { MODELOS as PARCIALES } from './modelos-de-parcial.js';
import { MODELOS as MOYANO } from './preguntas-de-moyano.js';
import { BLOQUES as U4 } from './diapositivas-unidad-iv.js';
import { BLOQUES as U5 } from './diapositivas-unidad-v.js';

export { PARCIALES, MOYANO };
export const DIAPOSITIVAS = [...U4, ...U5];
