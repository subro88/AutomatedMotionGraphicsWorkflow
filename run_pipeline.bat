@echo off
title Automated Motion Graphics Pipeline Runner
cd /d "%~dp0"

echo ==========================================================
echo   🎬 Automated Motion Graphics Workstation Runner
echo   Voice Box - Remotion - Whisper - DaVinci Resolve
echo ==========================================================
echo.

set "PY_BIN=%LOCALAPPDATA%\Programs\Python\Python312\python.exe"
if not exist "%PY_BIN%" (
    set "PY_BIN=python"
)

echo Executing End-to-End Pipeline...
"%PY_BIN%" .agent\skills\motion-pipeline\run.py --action run-all --text "Welcome to the next generation motion graphics workstation powered by Remotion, Three.js, and DaVinci Resolve." --voice tech --project "Desktop_Run" --aspect 9:16

echo.
echo ==========================================================
echo   ✔ Pipeline Run Completed!
echo   Output Deliverables: out\resolve_exports\
echo   Interactive Dashboard: docs\dashboard.html
echo ==========================================================
pause

