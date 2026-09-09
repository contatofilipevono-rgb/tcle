@echo off
chcp 65001 > nul
cd /d "%~dp0"
call npm run deploy
if errorlevel 1 (
  echo Publicacao falhou. Confira o erro acima.
  pause
  exit /b 1
)
echo Publicacao concluida: https://dentalsafe-tcle-ai.surge.sh
pause
