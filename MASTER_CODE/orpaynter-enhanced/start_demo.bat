@echo off
echo ==========================================
echo Starting OrPaynter Demo Environment...
echo ==========================================

echo [1/2] Launching Backend API (Port 5000)...
start "OrPaynter Backend" cmd /k "python backend/app.py"

echo [2/2] Launching Frontend (Port 5173)...
echo Waiting for backend to warm up...
timeout /t 3 /nobreak >nul
start "OrPaynter Frontend" cmd /k "npm run dev"

echo.
echo ==========================================
echo DEMO IS LIVE!
echo Access the Dashboard: http://localhost:5173/dashboard
echo Access the Orchestrator: http://localhost:5173/orchestrator
echo ==========================================
pause
