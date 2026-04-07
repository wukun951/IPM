@echo off
setlocal EnableExtensions

set "SCRIPT_DIR=%~dp0"
set "DEMO_DIR=%SCRIPT_DIR%resource-workbench-demo"
set "PYTHON_EXE="

title IPM

echo ============================================================
echo IPM Launcher
echo ============================================================

if not exist "%DEMO_DIR%\launch_demo.py" (
  echo [Error] Missing launch_demo.py
  echo Expected path: "%DEMO_DIR%\launch_demo.py"
  echo.
  pause
  exit /b 1
)

if exist "D:\py3119\python.exe" (
  set "PYTHON_EXE=D:\py3119\python.exe"
)

if not defined PYTHON_EXE (
  where py >nul 2>nul
  if not errorlevel 1 (
    set "PYTHON_EXE=py -3"
  )
)

if not defined PYTHON_EXE (
  where python >nul 2>nul
  if not errorlevel 1 (
    set "PYTHON_EXE=python"
  )
)

if not defined PYTHON_EXE (
  echo [Error] Python was not found.
  echo Please install Python 3 and make sure ^`python^` or ^`py^` is available.
  echo.
  pause
  exit /b 1
)

echo Demo directory: "%DEMO_DIR%"
echo Python command: %PYTHON_EXE%
echo.

pushd "%DEMO_DIR%"
call %PYTHON_EXE% launch_demo.py
set "EXIT_CODE=%ERRORLEVEL%"
popd

if not "%EXIT_CODE%"=="0" (
  echo.
  echo [Error] Demo launcher exited with code %EXIT_CODE%.
  echo This window is kept open so you can read the error.
  echo.
  pause
  exit /b %EXIT_CODE%
)

endlocal