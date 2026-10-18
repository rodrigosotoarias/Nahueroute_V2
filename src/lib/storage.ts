/**
 * Acceso seguro al almacenamiento del navegador.
 *
 * `localStorage` puede lanzar errores (modo privado, datos bloqueados). En ese caso
 * se usa memoria temporal para que la app siga funcionando durante la visita.
 */
const memory = new Map<string, string>();

export const storage = {
  get(key: string): string | null {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return memory.get(key) ?? null;
    }
  },

  set(key: string, value: string): void {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      memory.set(key, value);
    }
  },

  remove(key: string): void {
    try {
      window.localStorage.removeItem(key);
    } catch {
      memory.delete(key);
    }
  },
};
