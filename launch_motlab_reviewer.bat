@echo off
setlocal EnableDelayedExpansion
title Motlab Frame-Accurate Review Viewer
cd /d "%~dp0"

:: Pin Python 3.12 and FFmpeg paths
set "PY_BIN=%LOCALAPPDATA%\Programs\Python\Python312\python.exe"
if not exist "%PY_BIN%" set "PY_BIN=python"

set "FFMPEG_DIR=%LOCALAPPDATA%\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin"
if exist "%FFMPEG_DIR%" set "PATH=%FFMPEG_DIR%;%PATH%"

echo ===============================================================================
echo   🎬 MOTLAB FRAME-ACCURATE REVIEW VIEWER
echo   Interactive Video Scrubbing, Bounding Box Notes & selection.json Sync
echo ===============================================================================
echo.

:: 1. Check if user dragged & dropped a video file onto this .bat
if not "%~1"=="" (
    echo [Target Video]: "%~1"
    echo Starting viewer on port 4173...
    "%PY_BIN%" scripts/motlab_reviewer.py --video "%~1" --project "%~n1"
    goto END
)

:: 2. Otherwise auto-detect latest rendered video in out/
echo Searching for newest rendered video in out/...
set "TARGET_VIDEO="
for /f "delims=" %%F in ('dir /b /o-d /s "out\*.mp4" 2^>nul') do (
    if not defined TARGET_VIDEO set "TARGET_VIDEO=%%F"
)

if defined TARGET_VIDEO (
    echo [Latest Video]: "!TARGET_VIDEO!"
    echo.
    echo Starting review viewer on http://127.0.0.1:4173 ...
    "%PY_BIN%" scripts/motlab_reviewer.py --video "!TARGET_VIDEO!" --project "MasterReview"
) else (
    echo [Notice] No MP4 files found in out/. Starting viewer in blank canvas mode...
    "%PY_BIN%" scripts/motlab_reviewer.py --project "DefaultProject"
)

:END
if errorlevel 1 (
    echo.
    echo [ERROR] Review viewer exited with an issue.
    pause
)
endlocal
