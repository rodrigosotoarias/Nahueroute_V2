import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { flushSync } from "react-dom";
import { Button, PasswordField, TextField } from "../../../shared/components";
import { useAuth } from "../AuthContext";
import { MIN_PASSWORD_LENGTH, validateSignUp } from "../validation";
import type { FieldErrors, SignUpValues } from "../validation";

const EMPTY: SignUpValues = { name: "", email: "", password: "", password2: "" };

export function SignUpForm({ onGoToLogIn }: { onGoToLogIn: () => void }) {
  const { signUp } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<SignUpValues>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors<keyof SignUpValues>>({});
  const [submitting, setSubmitting] = useState(false);

  const update = (field: keyof SignUpValues) => (event: { target: { value: string } }) =>
    setValues((current) => ({ ...current, [field]: event.target.value }));

  const focusFirstInvalid = () =>
    formRef.current?.querySelector<HTMLInputElement>('[aria-invalid="true"]')?.focus();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const found = validateSignUp(values);
    if (Object.keys(found).length > 0) {
      flushSync(() => setErrors(found));
      return focusFirstInvalid();
    }

    setSubmitting(true);
    const result = await signUp({ name: values.name, email: values.email, password: values.password });
    setSubmitting(false);

    if (!result.ok) {
      flushSync(() => setErrors({ email: result.error }));
      focusFirstInvalid();
    }
    // Si salió bien, AuthProvider guarda la sesión y la app cambia de pantalla sola.
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate aria-label="Crear cuenta">
      <TextField
        label="Nombre"
        name="name"
        autoComplete="name"
        value={values.name}
        onChange={update("name")}
        error={errors.name}
      />
      <TextField
        label="Correo electrónico"
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        value={values.email}
        onChange={update("email")}
        error={errors.email}
      />
      <PasswordField
        label="Contraseña"
        name="password"
        autoComplete="new-password"
        hint={`Mínimo ${MIN_PASSWORD_LENGTH} caracteres.`}
        value={values.password}
        onChange={update("password")}
        error={errors.password}
      />
      <TextField
        label="Repetir contraseña"
        name="password2"
        type="password"
        autoComplete="new-password"
        value={values.password2}
        onChange={update("password2")}
        error={errors.password2}
      />
      <Button type="submit" disabled={submitting}>
        Crear cuenta
      </Button>
      <p className="auth-switch">
        ¿Ya tienes cuenta?{" "}
        <button type="button" className="auth-link" onClick={onGoToLogIn}>
          Inicia sesión
        </button>
      </p>
    </form>
  );
}
