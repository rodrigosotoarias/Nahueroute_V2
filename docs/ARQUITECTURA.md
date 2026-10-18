# Arquitectura de Nahueroute

Aplicación para ingresar y mostrar rutas, polígonos y puntos de Chile (estilo QGIS),
pensada **siempre en formato celular**.

## 1. Tecnologías elegidas

| Capa | Herramienta | Para qué sirve |
| --- | --- | --- |
| Interfaz | React + TypeScript + Vite | Pantallas de la app. TypeScript avisa errores antes de ejecutar. |
| Mapa | MapLibre GL JS | Dibuja el mapa en el celular (libre y de código abierto). |
| Dibujo | Terra Draw (`maplibre-gl-terradraw`) | Dibujar puntos, líneas y polígonos sobre el mapa. |
| Base de datos | PostgreSQL + PostGIS | Guarda las geometrías de forma "espacial". QGIS se conecta directo. |
| Cuentas y servidor | Supabase | Ofrece base de datos, cuentas de usuario y archivos listos para usar. |
| Publicación | Vercel, Netlify o Cloudflare Pages | Pone la app en internet. |

Estado: **hoy solo existe la interfaz** (pantalla de inicio con cuentas de demostración).
El mapa, el dibujo y el servidor son los siguientes pasos.

## 2. Carpetas

```
src/
  main.tsx            Punto de entrada. Monta la app.
  app/                Raíz: proveedores globales y selección de pantalla.
  features/           UNA carpeta por función de la app.
    auth/             Cuentas: pantallas, validación y servicio de cuentas.
    home/             Pantalla tras iniciar sesión.
    (futuro) map/     Mapa y visor de rutas.
    (futuro) routes/  Crear, editar y listar rutas.
  shared/             Piezas reutilizables sin lógica de negocio.
    components/       Botones, campos de texto, etc.
    styles/           Colores y estilos base.
  lib/                Utilidades técnicas (almacenamiento, y luego el cliente del servidor).
docs/                 Documentación.
```

### Reglas para que el código no se enrede

1. **Cada función vive en su carpeta** dentro de `features/` y trae todo lo suyo: pantallas, estilos, lógica y tipos.
2. **Una función solo se muestra al resto por su `index.ts`.** Desde fuera se importa `../features/auth`, nunca un archivo interno.
3. **Las funciones no se importan entre sí** salvo por esa puerta pública (`index.ts`).
4. **`shared/` y `lib/` nunca importan de `features/`.** Las dependencias van en una sola dirección: `app` → `features` → `shared` / `lib`.
5. **Todo acceso al servidor pasa por un "servicio"** con una interfaz definida (ver `features/auth/types.ts`). Las pantallas no saben si los datos vienen del navegador o de un servidor; cambiar de uno a otro es escribir una nueva implementación.
6. **La validación son funciones puras** (`validation.ts`), fáciles de probar.

### Cómo agregar una función nueva (ejemplo: `routes`)

1. Crear `src/features/routes/` con `types.ts`, `routesService.ts`, componentes y `index.ts`.
2. Exportar en `index.ts` solo lo que otras partes necesiten.
3. Mostrar la pantalla desde `src/app/App.tsx`.

Cuando haya varias pantallas, se agrega un enrutador (por ejemplo `react-router`) en `App.tsx`.

## 3. Cómo se conecta todo

```
Celular (navegador / app)
   │  MapLibre muestra el mapa; Terra Draw permite dibujar
   │
   ▼
Servicios en src/features/*/  ──►  Supabase
                                     ├─ Cuentas (Auth)
                                     ├─ PostgreSQL + PostGIS  ◄── QGIS (conexión directa)
                                     └─ Archivos (fotos, GPX)
```

- **Dibujo → base de datos:** Terra Draw entrega cada figura como GeoJSON (formato estándar). El servicio de rutas lo guarda en una columna `geometry` de PostGIS.
- **QGIS:** puede conectarse a la misma base PostGIS para ver, editar y cargar datos masivamente. También sirven GeoJSON, GPX y KML para importar y exportar.

### Boceto del modelo de datos (aún no aplicado)

```sql
create extension if not exists postgis;

create table routes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table route_features (
  id uuid primary key default gen_random_uuid(),
  route_id uuid not null references routes on delete cascade,
  kind text not null check (kind in ('point', 'line', 'polygon')),
  geom geometry(Geometry, 4326) not null,   -- longitud/latitud (WGS 84)
  properties jsonb not null default '{}'
);

create index on route_features using gist (geom);
```

Al crear las tablas hay que activar **Row Level Security** para que cada persona solo
modifique sus propias rutas.

## 4. Decisiones pendientes

- **Mapa base:** de dónde salen las "teselas" del mapa (proveedor gestionado o autoalojado). MapLibre solo dibuja; no trae mapa.
- **Quién puede crear rutas:** cualquier usuario o solo administradores.
- **App nativa:** primero se publica como web instalable en el celular (PWA). Si luego se necesita tienda de apps, se envuelve con Capacitor.

## 5. Estado de la autenticación

`features/auth/authService.local.ts` es una **demostración**: guarda nombre y correo en el navegador y no verifica contraseñas. Debe reemplazarse por Supabase Auth antes de usar la app con personas reales.
