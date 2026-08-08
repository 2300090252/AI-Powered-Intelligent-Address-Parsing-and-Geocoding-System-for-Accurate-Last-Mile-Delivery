@echo off
echo Starting Pata AI FastAPI Backend Server on port 8000...
cd /d "%~dp0backend"
python app/main.py
pause
