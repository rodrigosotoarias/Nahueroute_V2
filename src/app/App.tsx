import { AuthPage, AuthProvider, useAuth } from "../features/auth";
import { HomePage } from "../features/home";

/**
 * Raíz de la aplicación.
 *
 * - Aquí se montan los proveedores globales (sesión, y más adelante datos, tema, etc.).
 * - `Screens` decide qué pantalla mostrar. Cuando haya más pantallas (mapa, rutas,
 *   perfil) se reemplaza por un enrutador (por ejemplo react-router) en este mismo
 *   archivo, sin tocar las funciones de `features/`.
 *
 * La app se muestra siempre con el formato de celular: `.app-frame` limita el ancho
 * y lo centra cuando se abre en una pantalla grande.
 */
export function App() {
  return (
    <AuthProvider>
      <div className="app-frame">
        <Screens />
      </div>
    </AuthProvider>
  );
}

function Screens() {
  const { user } = useAuth();
  return user ? <HomePage /> : <AuthPage />;
}
