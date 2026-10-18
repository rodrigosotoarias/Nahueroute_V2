#!/bin/bash
# Inicia Nahueroute en Mac (doble clic) o Linux (bash iniciar.command).
# Instala las dependencias la primera vez y abre la app en el navegador.

cd "$(dirname "$0")" || exit 1

pausar() {
  echo
  read -n 1 -s -r -p "Presiona una tecla para cerrar..."
  echo
}

if ! command -v node >/dev/null 2>&1; then
  echo "No se encontró Node.js."
  echo "Instálalo desde https://nodejs.org (versión LTS) y vuelve a abrir este archivo."
  pausar
  exit 1
fi

if ! node -e "const [a,b]=process.versions.node.split('.').map(Number);process.exit(a>=22||(a===20&&b>=19)?0:1)"; then
  echo "Tu versión de Node.js es muy antigua. Se necesita la 20.19 o superior."
  echo "Descarga la versión LTS desde https://nodejs.org y vuelve a abrir este archivo."
  pausar
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "Instalando dependencias (solo la primera vez, puede tardar un minuto)..."
  if ! npm install; then
    echo
    echo "Falló la instalación. Revisa tu conexión a internet y vuelve a intentarlo."
    pausar
    exit 1
  fi
fi

echo
echo "Iniciando Nahueroute. Se abrirá en el navegador."
echo "Para detenerla, cierra esta ventana o presiona Ctrl+C."
echo
npm run dev -- --open
pausar
