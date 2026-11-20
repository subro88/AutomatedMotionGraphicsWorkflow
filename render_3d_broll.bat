@echo off
setlocal
cd /d "%~dp0"
title "Crucible 3D B-Roll Generator"

echo ======================================================================
echo    Rendering Crucible 3D Engineering B-Roll Scenes
echo    (Mechanical Gears, Electrical Transformer, Holographic Diploma)
echo ======================================================================
echo.

node scripts/render_crucible_scenes.mjs
if errorlevel 1 (
    echo.
    echo [ERROR] Crucible render encountered an error.
    pause
) else (
    echo.
    echo [SUCCESS] All 3D scenes rendered to out\crucible_renders\ !
    echo You can view the renders or drag them into DaVinci Resolve / Remotion.
    pause
)

endlocal
