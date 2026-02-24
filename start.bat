@echo off
echo.
echo ╔═══════════════════════════════════════════╗
echo ║  🚀 Paper Shop - Full Stack             ║
echo ║  Cleaning ports 3000 and 3001...         ║
echo ╚═══════════════════════════════════════════╝
echo.

REM Kill processes on port 3000
for /f "tokens=5" %%a in ('netstat -ano ^| find ":3000"') do (
    taskkill /pid %%a /f 2>nul
)

REM Kill processes on port 3001
for /f "tokens=5" %%a in ('netstat -ano ^| find ":3001"') do (
    taskkill /pid %%a /f 2>nul
)

REM Wait a moment
timeout /t 2 /nobreak

echo.
echo ╔═══════════════════════════════════════════╗
echo ║  Starting servers...                      ║
echo ╚═══════════════════════════════════════════╝
echo.

REM Start both servers in parallel
cd /d "%~dp0"

REM Start backend in new window
start "Paper Shop Backend" cmd /k "cd server && npm run dev"

REM Wait for backend to start
timeout /t 3 /nobreak

REM Start frontend in new window
start "Paper Shop Frontend" cmd /k "bun run dev"

echo.
echo ✅ Servers starting...
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔌 Backend API: http://localhost:3001
echo.
