// El banco completo, en el mismo orden que armaba la versión anterior: el banco general,
// después los modelos de parcial, la práctica por diapositivas (IV y V) y las preguntas de Moyano.
import { PREGUNTAS_BASE } from './preguntas.js';
import { PARCIALES, DIAPOSITIVAS, MOYANO } from '../examenes/indice.js';

export const QUESTIONS = [
  ...PREGUNTAS_BASE,
  ...PARCIALES.flatMap((m) => m.qs),
  ...DIAPOSITIVAS.flatMap((b) => b.qs),
  ...MOYANO.flatMap((m) => m.qs),
];
const porId = new Map(QUESTIONS.map((q) => [q.id, q]));
export const QBY = (id) => porId.get(id);
