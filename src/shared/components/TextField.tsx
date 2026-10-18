import { useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import "./components.css";

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  /** Elemento al final del campo, por ejemplo el botón "Mostrar" de la contraseña. */
  trailing?: ReactNode;
}

export function TextField({ label, error, hint, trailing, ...inputProps }: TextFieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined;

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className={trailing ? "field-control field-control--with-trailing" : "field-control"}>
        <input id={id} aria-invalid={error ? true : undefined} aria-describedby={describedBy} {...inputProps} />
        {trailing}
      </div>
      {hint && (
        <p id={hintId} className="field-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
