@echo off
setlocal EnableExtensions

set "SCRIPT_DIR=%~dp0"
set "APP_DIR=%SCRIPT_DIR%resource-workbench-app"
set "PATH=%USERPROFILE%\.cargo\bin;%PATH%"

title IPM

echo ============================================================
echo IPM Launcher
echo ============================================================

if not exist "%APP_DIR%\package.json" (
  echo [Error] Missing package.json
  echo Expected path: "%APP_DIR%\package.json"
  echo.
  pause
  exit /b 1
)

where cargo >nul 2>nul
if errorlevel 1 (
  echo [Error] Rust / Cargo was not found.
  echo Please install Rust first from: https://rustup.rs
  echo.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo [Error] npm was not found.
  echo Please install Node.js 20+ first.
  echo.
  pause
  exit /b 1
)

pushd "%APP_DIR%"

echo Closing stale desktop processes...
taskkill /F /IM resource_workbench_desktop.exe >nul 2>nul

if not exist "node_modules" (
  echo Installing npm dependencies...
  call npm install
  if errorlevel 1 (
    echo.
    echo [Error] npm install failed.
    echo.
    popd
    pause
    exit /b 1
  )
)

echo Starting IPM desktop app...
echo.
call npm run tauri:dev
set "EXIT_CODE=%ERRORLEVEL%"
popd

if not "%EXIT_CODE%"=="0" (
  echo.
  echo [Error] Desktop launcher exited with code %EXIT_CODE%.
  echo This window is kept open so you can read the error.
  echo.
  pause
  exit /b %EXIT_CODE%
)

endlocal
