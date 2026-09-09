@echo off
chcp 65001 > nul
title DentalSafe TCLE AI - Publicador Online
echo ============================================================
echo      DENTALSAFE TCLE AI — PUBLICADOR ONLINE SEGURO
echo ============================================================
echo.
echo 1. Garantindo que o servidor local esteja ativo...
start "" /b node server.js
timeout /t 2 /nobreak > nul
echo 2. Iniciando tunel de alta velocidade Cloudflare...
echo.
"C:\Users\Valer\.gemini\antigravity\scratch\cloudflared.exe" tunnel --protocol http2 --url http://localhost:3000 --http-host-header localhost
pause
