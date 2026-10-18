import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { authService } from "./authService";
import type { AuthResult, Credentials, SignUpData, User } from "./types";

interface AuthContextValue {
  user: User | null;
  signUp: (data: SignUpData) => Promise<AuthResult>;
  logIn: (data: Credentials) => Promise<AuthResult>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Mantiene la sesión en memoria para que cualquier pantalla pueda consultarla. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => authService.getCurrentUser());

  const signUp = useCallback(async (data: SignUpData) => {
    const result = await authService.signUp(data);
    if (result.ok) setUser(result.user);
    return result;
  }, []);

  const logIn = useCallback(async (data: Credentials) => {
    const result = await authService.logIn(data);
    if (result.ok) setUser(result.user);
    return result;
  }, []);

  const logOut = useCallback(async () => {
    await authService.logOut();
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, signUp, logIn, logOut }), [user, signUp, logIn, logOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return context;
}
