export interface User {
  name: string;
  email: string;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface SignUpData extends Credentials {
  name: string;
}

export type AuthResult = { ok: true; user: User } | { ok: false; error: string };

/**
 * Contrato del servicio de cuentas.
 *
 * La interfaz es asíncrona a propósito: así, cuando se conecte un servidor real
 * (Supabase u otro), solo se escribe una nueva implementación de este contrato y
 * ninguna pantalla cambia.
 */
export interface AuthService {
  getCurrentUser(): User | null;
  signUp(data: SignUpData): Promise<AuthResult>;
  logIn(data: Credentials): Promise<AuthResult>;
  logOut(): Promise<void>;
}
