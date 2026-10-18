import { localAuthService } from "./authService.local";
import type { AuthService } from "./types";

/**
 * Único punto donde se elige qué servicio de cuentas usa la app.
 * Para conectar un servidor real, crear `authService.supabase.ts` (o similar)
 * y cambiar esta línea.
 */
export const authService: AuthService = localAuthService;
