import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { flushSync } from "react-dom";
import { Button, PasswordField, TextField } from "../../../shared/components";
import { useAuth } from "../AuthContext";
import { validateLogIn } from "../validation";
import type { FieldErrors, LogInValues } from "../validation";

const EMPTY: LogInValues = { email: "", password: "" };

export function LogInForm({ onGoToSignUp }: { onGoToSignUp: () => void }) {
  const { logIn } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<LogInValues>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors<keyof LogInValues>>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (field: keyof LogInValues) => (event: { target: { value: string } }) =>
    setValues((current) => ({ ...current, [field]: event.target.value }));

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError("");

    const found = validateLogIn(values);
    if (Object.keys(found).length > 0) {
      flushSync(() => setErrors(found));
      return formRef.current?.querySelector<HTMLInputElement>('[aria-invalid="true"]')?.focus();
    }
    setErrors({});

    setSubmitting(true);
    const result = await logIn(values);
    setSubmitting(false);

    if (!result.ok) setFormError(result.error);
    // Si salió bien, AuthProvider guarda la sesión y la app cambia de pantalla sola.
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate aria-label="Iniciar sesión">
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
        autoComplete="current-password"
        value={values.password}
        onChange={update("password")}
        error={errors.password}
      />
      {formError && (
        <p className="field-error auth-form-error" role="alert">
          {formError}
        </p>
      )}
      <Button type="submit" disabled={submitting}>
        Iniciar sesión
      </Button>
      <p className="auth-switch">
        ¿Primera vez aquí?{" "}
        <button type="button" className="auth-link" onClick={onGoToSignUp}>
          Crea tu cuenta
        </button>
      </p>
    </form>
  );
}
