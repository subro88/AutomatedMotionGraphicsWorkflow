@echo off
setlocal
cd /d "%~dp0"
title "Voice Box Studio - Neural Speech and Audio Mastering"

:: Pin Python 3.12 path
set "PYTHON_EXE=C:\Users\User\AppData\Local\Programs\Python\Python312\python.exe"
if not exist "%PYTHON_EXE%" (
    set "PYTHON_EXE=python"
)

:: Add FFmpeg Gyan full build to PATH
set "FFMPEG_DIR=C:\Users\User\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin"
if exist "%FFMPEG_DIR%" (
    set "PATH=%FFMPEG_DIR%;%PATH%"
)

echo ======================================================================
echo    Voice Box Studio - Quick Audio and Voiceover Generator
echo    Indian, Bengali, Kokoro Offline and Cloud Neural Voices
echo ======================================================================
echo.

"%PYTHON_EXE%" -u scripts/voicebox_gui.py
if errorlevel 1 (
    echo.
    echo [ERROR] Voice Box GUI encountered an issue.
    pause
)
endlocal

