/** Reglas de validación de los formularios. Son funciones puras, fáciles de probar. */
export const MIN_PASSWORD_LENGTH = 8;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type FieldErrors<K extends string> = Partial<Record<K, string>>;

export interface SignUpValues {
  name: string;
  email: string;
  password: string;
  password2: string;
}

export interface LogInValues {
  email: string;
  password: string;
}

export function validateSignUp(values: SignUpValues): FieldErrors<keyof SignUpValues> {
  const errors: FieldErrors<keyof SignUpValues> = {};
  if (!values.name.trim()) errors.name = "Escribe tu nombre.";
  if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = "Escribe un correo válido.";
  if (values.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`;
  }
  if (values.password2 !== values.password) errors.password2 = "Las contraseñas no coinciden.";
  return errors;
}

export function validateLogIn(values: LogInValues): FieldErrors<keyof LogInValues> {
  const errors: FieldErrors<keyof LogInValues> = {};
  if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = "Escribe un correo válido.";
  if (!values.password) errors.password = "Escribe tu contraseña.";
  return errors;
}
