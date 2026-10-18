import { useState } from "react";
import { TextField } from "./TextField";
import type { TextFieldProps } from "./TextField";

type PasswordFieldProps = Omit<TextFieldProps, "type" | "trailing">;

/** Campo de contraseña con botón para mostrar u ocultar lo escrito. */
export function PasswordField(props: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      {...props}
      type={visible ? "text" : "password"}
      trailing={
        <button
          type="button"
          className="field-toggle"
          aria-pressed={visible}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? "Ocultar" : "Mostrar"}
        </button>
      }
    />
  );
}
