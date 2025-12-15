@echo off
REM
start cmd /k "npm run dev"

REM

timeout /t 5 /nobreak >nul

REM
start cmd /k "lt --port 3000 --subdomain omerisgay"

REM
pause
