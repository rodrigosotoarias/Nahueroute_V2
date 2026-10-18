# Nahueroute V2

Aplicación para mostrar rutas y panoramas dentro de Chile de forma sencilla y amigable.
Se diseña siempre en formato celular.

## Ejecutarla en tu computador (para quien trabaja en el código)

Solo necesitas [Node.js](https://nodejs.org) versión 20.19 o superior (se recomienda la LTS).
Después, con el proyecto descargado:

| Sistema | Qué hacer |
| --- | --- |
| **Windows** | Haz doble clic en `iniciar.bat` |
| **Mac** | Haz doble clic en `iniciar.command` |

La primera vez instala lo necesario (tarda un minuto) y luego abre la app en tu navegador.
Para detenerla, cierra la ventana de la terminal o presiona `Ctrl + C`.

### Si el doble clic no funciona

- **Mac: "no se puede abrir" o "permiso denegado".** Haz clic derecho sobre `iniciar.command`, elige **Abrir** y confirma. Si sigue sin funcionar, abre la Terminal en la carpeta del proyecto y escribe `bash iniciar.command`.
- **Windows: la ventana se cierra o muestra un error.** Abre una terminal en la carpeta y escribe `npm.cmd install` y luego `npm.cmd run dev` para ver el mensaje completo.
- **Windows, error de PowerShell "la ejecución de scripts está deshabilitada".** Usa `npm.cmd` en lugar de `npm`, o el archivo `iniciar.bat`, que no tiene este problema.

### A mano (otros sistemas o si prefieres la terminal)

```bash
npm install     # instala las dependencias (la primera vez)
npm run dev     # abre la app en http://localhost:5173
```

Otros comandos:

```bash
npm run build       # revisa tipos y genera la versión de producción en dist/
npm run typecheck   # solo revisa tipos
```

`package-lock.json` guarda las versiones exactas de las dependencias. Debe estar en el repositorio para que todas las personas instalen lo mismo.

## Documentación

- [Arquitectura, carpetas y servidores](docs/ARQUITECTURA.md)
