@echo off
:: =============================================================================
:: 0oO - OrPaynter Unified Operations System
:: Windows Startup Script
:: =============================================================================
:: Usage: start_0oO.bat [option]
:: Options:
::   --dev      Start in development mode (default)
::   --prod     Start in production mode
::   --status   Check system status
::   --stop     Stop all services
::   --help     Show help
:: =============================================================================

setlocal enabledelayedexpansion

set "RED="
set "GREEN="
set "YELLOW="
set "BLUE="
set "CYAN="
set "NC="

:: Enable ANSI colors on Windows 10+
for /f "tokens=2 delims==" %%a in ('wmic os get Caption /value') do set "OS=%%a"
echo %OS% | findstr /C:"Windows 10" >nul 2>&1
if %errorlevel%==0 (
    powershell -command "& {$host.UI.RawUI.ForegroundColor = 'White'}" 2>nul
    set "ESC="
)

echo.
echo  ____  ____  ____  ____  ____  ____  ____  ____  ____ 
echo  ||0  ||||o ||||O ||||  ||||o ||||O ||||  ||||o ||||O 
echo  ||__ ||__| ||___||__| ||__| ||___||__| ||__| ||___| 
echo  |__| |__   |___ |__   |__O |___ |__   |__O |___  
echo  __  __                        __                  
echo  ^|  \/  ^|__   __               /  \  _   _  _ __   
echo  ^| ^|\ /^|\ \ / /              / _ \ ^| ^| ^| ^|_ \  
echo  ^| ^|  ^| ^| \ V /               / ___ \^| ^|_^| ^|_) ^|
echo  ^|_^|  ^|_|  \_/               /_/   \_\\.__^/^|.__/  
echo                                          ^| ^|     
echo                                          ^|_^|     
echo.
echo OrPaynter Unified Operations System
echo Version 1.0.0
echo.

set "APP_DIR=%~dp0"
set "BACKEND_DIR=%APP_DIR%backend"
set "PORT=5000"

:: Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH
    exit /b 1
)
echo [OK] Python found

:: Check pip
pip --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] pip is not installed or not in PATH
    exit /b 1
)
echo [OK] pip found

:: Install dependencies if needed
echo.
echo Checking dependencies...
pip show flask >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing Flask and dependencies...
    pip install flask flask-cors requests
)

echo [OK] Dependencies ready
echo.

:: Process command line arguments
if "%1"=="--dev" goto start_dev
if "%1"=="--prod" goto start_prod
if "%1"=="--status" goto check_status
if "%1"=="--logs" goto view_logs
if "%1"=="--help" goto show_help
if "%1"=="" goto start_dev

:start_dev
echo Starting 0oO in Development Mode...
echo.
cd /d "%BACKEND_DIR%"
echo Starting Flask server on port %PORT%...
echo Press Ctrl+C to stop
echo.
python app.py
goto :eof

:start_prod
echo Starting 0oO in Production Mode...
echo.
cd /d "%BACKEND_DIR%"
pip install gunicorn >nul 2>&1
echo Starting with Gunicorn on port %PORT%...
start /b gunicorn -w 4 -b 0.0.0.0:%PORT% app:app
echo 0oO is running on http://localhost:%PORT%
goto :eof

:check_status
echo Checking 0oO System Status...
echo.
curl -s http://localhost:%PORT%/api/0oO/health >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] 0oO Gateway: Running
    echo.
    curl -s http://localhost:%PORT%/api/0oO/status
    echo.
) else (
    echo [ERROR] 0oO Gateway: Not running
    echo Start with: start_0oO.bat --dev
)
goto :eof

:view_logs
echo Viewing 0oO Logs (Ctrl+C to exit)...
if exist "%BACKEND_DIR%\app.log" (
    type "%BACKEND_DIR%\app.log"
) else (
    echo No log file found
)
goto :eof

:show_help
echo Usage: start_0oO.bat [option]
echo.
echo Options:
echo   --dev     Start in development mode (default)
echo   --prod    Start in production mode
echo   --status  Check system status
echo   --logs    View logs
echo   --help    Show this help message
goto :eof
