// localStorage puede fallar (modo privado, cuota): leer devuelve el valor por defecto y escribir no rompe nada.
export const almacen = {
  leer(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  guardar(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
