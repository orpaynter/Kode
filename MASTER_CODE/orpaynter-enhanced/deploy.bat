@echo off
setlocal

echo ==========================================
echo 🚀 Starting OrPaynter Production Deployment (Windows)
echo ==========================================

:: 1. Check for Docker
where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker is not installed or not in PATH. Please install Docker Desktop first.
    exit /b 1
)

:: 2. Build and Start Containers
echo 📦 Building and Orchestrating Containers...
docker-compose -f docker-compose.prod.yml up -d --build

:: 3. Health Check
echo 🏥 Verifying Service Health...
timeout /t 5 /nobreak >nul

curl -s http://localhost/health | findstr "healthy" >nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ System is ONLINE and HEALTHY
    echo 🌍 Access Application: http://localhost
) else (
    echo ⚠️ System started but health check failed or is still initializing.
    echo Check logs with: docker-compose -f docker-compose.prod.yml logs
)

endlocal
