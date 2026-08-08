@echo off
echo Starting Pata AI React Frontend Server on port 3000...
cd /d "%~dp0frontend"
cmd.exe /c npm run dev
pause
