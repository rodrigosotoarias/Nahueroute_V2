# Nahueroute V2

Aplicación para mostrar rutas y panoramas dentro de Chile de forma sencilla y amigable.
Se diseña siempre en formato celular.

## Cómo ejecutarla en tu computador

Necesitas [Node.js](https://nodejs.org) versión 20.19 o superior (se recomienda la LTS).

```bash
npm install     # instala las dependencias (la primera vez)
npm run dev     # abre la app en http://localhost:5173
```

Otros comandos:

```bash
npm run build       # revisa tipos y genera la versión de producción en dist/
npm run typecheck   # solo revisa tipos
```

Después del primer `npm install` se crea `package-lock.json`: súbelo al repositorio para que todos usen las mismas versiones.

## Documentación

- [Arquitectura, carpetas y servidores](docs/ARQUITECTURA.md)
