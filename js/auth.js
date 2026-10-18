/*
 * Módulo de autenticación (MODO DEMOSTRACIÓN).
 *
 * Guarda las cuentas en localStorage del navegador, solo con nombre y correo.
 * NO guarda contraseñas y NO es seguro: sirve únicamente para probar la interfaz.
 * Cuando exista un servidor, se reemplazan estas tres funciones (signUp, logIn,
 * logOut) por llamadas reales a la API y el resto de la app no cambia.
 */
const Auth = (() => {
  const USERS_KEY = "nahueroute:users";
  const SESSION_KEY = "nahueroute:session";

  // El almacenamiento puede fallar (modo privado, datos bloqueados): se cae a memoria.
  const memory = {};
  const store = {
    get(key) {
      try { return window.localStorage.getItem(key); }
      catch { return memory[key] ?? null; }
    },
    set(key, value) {
      try { window.localStorage.setItem(key, value); }
      catch { memory[key] = value; }
    },
    remove(key) {
      try { window.localStorage.removeItem(key); }
      catch { delete memory[key]; }
    },
  };

  const readUsers = () => {
    try { return JSON.parse(store.get(USERS_KEY)) || {}; }
    catch { return {}; }
  };

  const normalize = (email) => email.trim().toLowerCase();

  function signUp({ name, email }) {
    const users = readUsers();
    const key = normalize(email);
    if (users[key]) {
      return { ok: false, error: "Ya existe una cuenta con ese correo." };
    }
    users[key] = { name: name.trim(), email: key };
    store.set(USERS_KEY, JSON.stringify(users));
    store.set(SESSION_KEY, key);
    return { ok: true, user: users[key] };
  }

  function logIn({ email }) {
    const users = readUsers();
    const key = normalize(email);
    const user = users[key];
    if (!user) {
      return { ok: false, error: "No encontramos una cuenta con ese correo." };
    }
    store.set(SESSION_KEY, key);
    return { ok: true, user };
  }

  function current() {
    const key = store.get(SESSION_KEY);
    return key ? readUsers()[key] || null : null;
  }

  function logOut() {
    store.remove(SESSION_KEY);
  }

  return { signUp, logIn, current, logOut };
})();
