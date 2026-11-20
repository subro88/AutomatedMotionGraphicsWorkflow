@echo off
title Motion Graphics & DaVinci Resolve Workstation
cd /d "%~dp0"

echo ==========================================================
echo   🚀 Launching Motion Graphics Desktop Workstation
echo   PySide6 Qt Desktop Studio (Voice Box, Remotion, Resolve)
echo ==========================================================
echo.

set "PY_BIN=%LOCALAPPDATA%\Programs\Python\Python312\python.exe"
if not exist "%PY_BIN%" (
    set "PY_BIN=python"
)

:: Ensure FFmpeg is on path for this process
set "PATH=%LOCALAPPDATA%\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin;%LOCALAPPDATA%\Programs\Python\Python312;%LOCALAPPDATA%\Programs\Python\Python312\Scripts;%PATH%"

"%PY_BIN%" app.py

if errorlevel 1 (
    echo.
    echo ❌ Application exited with error.
    pause
)

