@echo off
echo ========================================
echo SHARE RIDE APP - COMPLETE STARTUP
echo ========================================
echo.

cd /d "c:\Users\chinnu\OneDrive\Desktop\share ride app\share-ride"

echo [1/6] Killing any existing Node processes...
taskkill /F /IM node.exe >nul 2>&1

echo [2/6] Waiting for ports to be freed...
timeout /t 3 >nul

echo [3/6] Starting Backend Server (Port 3001)...
start /B cmd /c "node src/server.js"
timeout /t 3 >nul

echo [4/6] Starting Frontend Server (Port 5173)...
start /B cmd /c "npm run dev"
timeout /t 5 >nul

echo [5/6] Testing Backend Connection...
curl -s http://localhost:3001/api >nul
if %errorlevel% equ 0 (
    echo ✓ Backend server is running on http://localhost:3001
) else (
    echo ✗ Backend server failed to start
)

echo [6/6] Testing Frontend Connection...
curl -s http://localhost:5173 >nul
if %errorlevel% equ 0 (
    echo ✓ Frontend server is running on http://localhost:5173
) else (
    echo ✗ Frontend server failed to start
)

echo.
echo ========================================
echo STARTUP COMPLETE
echo ========================================
echo.
echo Available URLs:
echo - Frontend: http://localhost:5173
echo - Backend API: http://localhost:3001/api
echo - Health Check: http://localhost:3001/health
echo.
echo Demo Login Credentials:
echo - Username: demo_user
echo - Password: demo123
echo.

echo Opening application in browser...
start "" "http://localhost:5173"

echo.
echo Press any key to exit...
pause >nul
