@echo off
cd /d "%~dp0"
title DentalSafe AI - Servidor Local
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js nao encontrado. Instale a versao LTS em https://nodejs.org
  pause
  exit /b 1
)
echo Iniciando DentalSafe AI. O navegador abrira quando o servidor estiver pronto.
node server.js --open
pause
