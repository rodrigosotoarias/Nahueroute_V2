import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { LogInForm } from "./LogInForm";
import { SignUpForm } from "./SignUpForm";
import "../auth.css";

type Mode = "signup" | "login";

const TABS: { mode: Mode; label: string }[] = [
  { mode: "signup", label: "Crear cuenta" },
  { mode: "login", label: "Iniciar sesión" },
];

/** Pantalla de inicio: marca y acceso (crear cuenta o iniciar sesión). */
export function AuthPage() {
  const [mode, setMode] = useState<Mode>("signup");
  const tabRefs = useRef<Record<Mode, HTMLButtonElement | null>>({ signup: null, login: null });

  function handleTabKeys(event: KeyboardEvent) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const next: Mode = mode === "signup" ? "login" : "signup";
    setMode(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div className="auth">
      <header className="auth-hero">
        <p className="auth-brand">Nahueroute</p>
        <h1 className="auth-title">
          Descubre Chile,
          <br />
          <em>un camino a la vez.</em>
        </h1>
        <p className="auth-lead">Rutas y panoramas de todo el país, explicados de forma simple.</p>
        <Mountains />
      </header>

      <main className="auth-panel">
        <div className="auth-tabs" role="tablist" aria-label="Acceso" onKeyDown={handleTabKeys}>
          {TABS.map(({ mode: tabMode, label }) => (
            <button
              key={tabMode}
              ref={(element) => {
                tabRefs.current[tabMode] = element;
              }}
              type="button"
              role="tab"
              id={`tab-${tabMode}`}
              className="auth-tab"
              aria-selected={mode === tabMode}
              aria-controls={`panel-${tabMode}`}
              tabIndex={mode === tabMode ? 0 : -1}
              onClick={() => setMode(tabMode)}
            >
              {label}
            </button>
          ))}
        </div>

        <div role="tabpanel" id={`panel-${mode}`} aria-labelledby={`tab-${mode}`}>
          {mode === "signup" ? (
            <SignUpForm onGoToLogIn={() => setMode("login")} />
          ) : (
            <LogInForm onGoToSignUp={() => setMode("signup")} />
          )}
        </div>

        <p className="auth-demo-note">Modo demostración: por ahora la cuenta se guarda solo en este navegador.</p>
      </main>
    </div>
  );
}

function Mountains() {
  return (
    <svg
      className="auth-mountains"
      viewBox="0 0 800 260"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="m3"
        d="M0 170 L110 90 L190 150 L300 60 L420 160 L520 100 L640 170 L720 120 L800 170 V260 H0Z"
      />
      <path
        className="m2"
        d="M0 210 L90 140 L170 190 L290 110 L400 200 L510 140 L610 205 L710 150 L800 205 V260 H0Z"
      />
      <path
        className="m1"
        d="M0 240 L120 190 L220 230 L340 175 L450 235 L560 190 L680 238 L800 205 V260 H0Z"
      />
    </svg>
  );
}
