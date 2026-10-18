import { storage } from "../../lib/storage";
import type { AuthResult, AuthService, Credentials, SignUpData, User } from "./types";

/*
 * Implementación de DEMOSTRACIÓN del servicio de cuentas.
 *
 * Guarda nombre y correo en el navegador. NO guarda contraseñas y NO es segura:
 * sirve solo para probar la interfaz. Se reemplaza por una implementación con
 * servidor sin cambiar el resto de la app (ver authService.ts).
 */
const USERS_KEY = "nahueroute:users";
const SESSION_KEY = "nahueroute:session";

type UserMap = Record<string, User>;

function readUsers(): UserMap {
  try {
    const raw = storage.get(USERS_KEY);
    return raw ? (JSON.parse(raw) as UserMap) : {};
  } catch {
    return {};
  }
}

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const localAuthService: AuthService = {
  getCurrentUser(): User | null {
    const key = storage.get(SESSION_KEY);
    return key ? (readUsers()[key] ?? null) : null;
  },

  async signUp({ name, email }: SignUpData): Promise<AuthResult> {
    const users = readUsers();
    const key = normalizeEmail(email);
    if (users[key]) {
      return { ok: false, error: "Ya existe una cuenta con ese correo." };
    }
    const user: User = { name: name.trim(), email: key };
    users[key] = user;
    storage.set(USERS_KEY, JSON.stringify(users));
    storage.set(SESSION_KEY, key);
    return { ok: true, user };
  },

  async logIn({ email }: Credentials): Promise<AuthResult> {
    const user = readUsers()[normalizeEmail(email)];
    if (!user) {
      return { ok: false, error: "No encontramos una cuenta con ese correo." };
    }
    storage.set(SESSION_KEY, user.email);
    return { ok: true, user };
  },

  async logOut(): Promise<void> {
    storage.remove(SESSION_KEY);
  },
};
