@echo off
rem Inicia Nahueroute en Windows con doble clic.
rem Instala las dependencias la primera vez y abre la app en el navegador.
setlocal
cd /d "%~dp0"
title Nahueroute

where node >nul 2>nul
if errorlevel 1 (
  echo No se encontro Node.js.
  echo Instalalo desde https://nodejs.org ^(version LTS^) y vuelve a abrir este archivo.
  echo.
  pause
  exit /b 1
)

node -e "const [a,b]=process.versions.node.split('.').map(Number);process.exit(a>=22||(a===20&&b>=19)?0:1)"
if errorlevel 1 (
  echo Tu version de Node.js es muy antigua. Se necesita la 20.19 o superior.
  echo Descarga la version LTS desde https://nodejs.org y vuelve a abrir este archivo.
  echo.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Instalando dependencias ^(solo la primera vez, puede tardar un minuto^)...
  call npm install
  if errorlevel 1 (
    echo.
    echo Fallo la instalacion. Revisa tu conexion a internet y vuelve a intentarlo.
    pause
    exit /b 1
  )
)

echo.
echo Iniciando Nahueroute. Se abrira en el navegador.
echo Para detenerla, cierra esta ventana o presiona Ctrl+C.
echo.
call npm run dev -- --open
echo.
pause
