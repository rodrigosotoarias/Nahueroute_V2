import { Button } from "../../shared/components";
import { useAuth } from "../auth";
import "./home.css";

/** Pantalla que ve la persona después de entrar. Aquí irá el mapa y las rutas. */
export function HomePage() {
  const { user, logOut } = useAuth();

  return (
    <main className="home">
      <p className="home-eyebrow">Sesión iniciada</p>
      <h1 className="home-title">¡Hola, {user?.name}!</h1>
      <p className="home-text">Pronto verás aquí las rutas y panoramas de Chile.</p>
      <Button variant="ghost" onClick={() => void logOut()}>
        Cerrar sesión
      </Button>
    </main>
  );
}
