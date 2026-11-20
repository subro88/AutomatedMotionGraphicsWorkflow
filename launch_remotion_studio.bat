@echo off
title Remotion Studio — Automated Motion Graphics Workstation
cd /d "%~dp0"

echo ==========================================================
echo   🚀 Launching Remotion Studio (https://www.remotion.dev)
echo   Interactive Frame Scrubber, Live Preview & Prop Editor
echo ==========================================================
echo.

:: Add FFmpeg and Python paths to current session
set "PATH=%LOCALAPPDATA%\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin;%LOCALAPPDATA%\Programs\Python\Python312;%LOCALAPPDATA%\Programs\Python\Python312\Scripts;%PATH%"

echo Starting Remotion Studio on http://localhost:3000 ...
start "" "http://localhost:3000"
cmd /c "npm start"

pause

