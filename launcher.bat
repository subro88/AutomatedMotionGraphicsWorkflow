@echo off
setlocal EnableDelayedExpansion
title Motion Graphics & DaVinci Resolve Workstation Launcher
cd /d "%~dp0"

:: Pin Python 3.12 and FFmpeg paths
set "PY_BIN=%LOCALAPPDATA%\Programs\Python\Python312\python.exe"
if not exist "%PY_BIN%" set "PY_BIN=python"

set "FFMPEG_DIR=%LOCALAPPDATA%\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin"
if exist "%FFMPEG_DIR%" set "PATH=%FFMPEG_DIR%;%PATH%"

:MENU
cls
echo ===============================================================================
echo   🎬 MOTION GRAPHICS & DAVINCI RESOLVE WORKSTATION - MASTER LAUNCHER
echo   NVIDIA RTX 3060 Laptop GPU • Remotion v4 • Blender 4.2 LTS • Motlab
echo ===============================================================================
echo.
echo   [1] 🎬 Launch Motlab Review Viewer (Frame-by-frame spatial feedback)
echo   [2] ⚡ Launch Remotion Studio Preview (http://localhost:3000)
echo   [3] 🎙️ Launch Voice Box Studio (Clone Voice / Kokoro-82M TTS)
echo   [4] 🚀 Run Universal Video Engine Router (Multi-Genre Production)
echo   [5] 🏛️ Manage 3D Asset Vault (StableGen & Blender 3D Models)
echo   [6] 🖥️ Launch PySide6 Desktop GUI (app.py)
echo   [7] 📖 Open Master HTML User Guide in Browser
echo   [0] 🚪 Exit
echo.
echo ===============================================================================
set /p "CHOICE=Enter choice [0-7]: "

if "%CHOICE%"=="1" goto MOTLAB_REVIEWER
if "%CHOICE%"=="2" goto REMOTION_STUDIO
if "%CHOICE%"=="3" goto VOICEBOX_STUDIO
if "%CHOICE%"=="4" goto VIDEO_ROUTER
if "%CHOICE%"=="5" goto ASSET_VAULT
if "%CHOICE%"=="6" goto DESKTOP_APP
if "%CHOICE%"=="7" goto OPEN_GUIDE
if "%CHOICE%"=="0" goto EXIT_PROMPT

echo.
echo ❌ Invalid choice. Please select 0 to 7.
timeout /t 2 >nul
goto MENU

:MOTLAB_REVIEWER
cls
echo ===============================================================================
echo   🎬 MOTLAB FRAME-ACCURATE REVIEW VIEWER
echo ===============================================================================
echo.
echo   Searching for newest rendered video in out/master/...
set "LATEST_VIDEO="
for /f "delims=" %%F in ('dir /b /o-d /s "out\*.mp4" 2^>nul') do (
    if not defined LATEST_VIDEO set "LATEST_VIDEO=%%F"
)

if defined LATEST_VIDEO (
    echo   Found latest video: !LATEST_VIDEO!
    echo.
    echo   [1] Review this video
    echo   [2] Enter custom video path
    echo   [3] Back to menu
    set /p "VCHOICE=Select [1-3]: "
    if "!VCHOICE!"=="1" (
        start "" "%PY_BIN%" scripts/motlab_reviewer.py --video "!LATEST_VIDEO!" --project "MasterReview"
        goto MENU
    )
    if "!VCHOICE!"=="2" (
        set /p "CUSTOM_V=Enter video path: "
        start "" "%PY_BIN%" scripts/motlab_reviewer.py --video "!CUSTOM_V!" --project "CustomReview"
        goto MENU
    )
    goto MENU
) else (
    echo   No rendered MP4 found yet in out/. Starting viewer in blank stage mode...
    start "" "%PY_BIN%" scripts/motlab_reviewer.py --project "DefaultProject"
    goto MENU
)

:REMOTION_STUDIO
cls
echo ===============================================================================
echo   ⚡ LAUNCHING REMOTION STUDIO (http://localhost:3000)
echo ===============================================================================
echo.
start "" "http://localhost:3000"
cmd /c "npm start"
pause
goto MENU

:VOICEBOX_STUDIO
cls
echo ===============================================================================
echo   🎙️ LAUNCHING VOICE BOX STUDIO
echo ===============================================================================
echo.
"%PY_BIN%" -u scripts/voicebox_gui.py
pause
goto MENU

:VIDEO_ROUTER
cls
echo ===============================================================================
echo   🚀 UNIVERSAL VIDEO ENGINE ROUTER (6 PRODUCTION GENRES)
echo ===============================================================================
echo.
echo   [1] motion-graphics (Swiss typography, animated charts, data flow)
echo   [2] 3d-realistic    (Photorealistic hardware, server racks, b-roll)
echo   [3] documentary     (2.5D parallax, historical maps, animated archival)
echo   [4] podcast         (Audio reactive waveforms, multi-speaker visualizer)
echo   [5] anime           (Markdown screenplay, Voicebox casting, Blender NPR)
echo   [6] canvas          (Motlab Video-as-Code, deterministic 2D explainer)
echo   [0] Back to main menu
echo.
set /p "GCHOICE=Select genre [1-6]: "

set "SEL_GENRE=motion-graphics"
if "%GCHOICE%"=="1" set "SEL_GENRE=motion-graphics"
if "%GCHOICE%"=="2" set "SEL_GENRE=3d-realistic"
if "%GCHOICE%"=="3" set "SEL_GENRE=documentary"
if "%GCHOICE%"=="4" set "SEL_GENRE=podcast"
if "%GCHOICE%"=="5" set "SEL_GENRE=anime"
if "%GCHOICE%"=="6" set "SEL_GENRE=canvas"
if "%GCHOICE%"=="0" goto MENU

set /p "PROJ_NAME=Enter project name [Default: Production_Run]: "
if "%PROJ_NAME%"=="" set "PROJ_NAME=Production_Run"

echo.
echo   Rendering genre: !SEL_GENRE! for project: !PROJ_NAME!...
"%PY_BIN%" scripts/video_engine_router.py --genre !SEL_GENRE! --project "!PROJ_NAME!" --render --review
pause
goto MENU

:ASSET_VAULT
cls
echo ===============================================================================
echo   🏛️ 3D ASSET VAULT (assets/3d_models/)
echo ===============================================================================
echo.
"%PY_BIN%" scripts/ingest_stablegen_asset.py --list
echo.
echo   [1] Ingest a new 3D model (.glb/.blend)
echo   [2] Inspect an asset
echo   [0] Back to menu
set /p "ACHOICE=Select [0-2]: "
if "%ACHOICE%"=="1" (
    set /p "ASRC=Enter path to .glb file: "
    set /p "AID=Enter asset ID (e.g. server_blade): "
    set /p "AGENRE=Enter genre (realistic/anime/props): "
    set /p "ANAME=Enter display name: "
    "%PY_BIN%" scripts/ingest_stablegen_asset.py --source "!ASRC!" --id "!AID!" --genre "!AGENRE!" --name "!ANAME!"
    pause
    goto ASSET_VAULT
)
if "%ACHOICE%"=="2" (
    set /p "TID=Enter asset ID to inspect: "
    "%PY_BIN%" scripts/ingest_stablegen_asset.py --inspect "!TID!"
    pause
    goto ASSET_VAULT
)
goto MENU

:DESKTOP_APP
cls
echo ===============================================================================
echo   🖥️ LAUNCHING PYSIDE6 QT DESKTOP STUDIO (app.py)
echo ===============================================================================
echo.
"%PY_BIN%" app.py
pause
goto MENU

:OPEN_GUIDE
cls
echo Opening Master HTML User Guide...
start "" "docs\workflow_user_guide.html"
goto MENU

:EXIT_PROMPT
echo Exiting launcher. Have a great production!
endlocal
exit /b 0
