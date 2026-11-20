@echo off
setlocal
cd /d "%~dp0"
title "Voicebox - Official Desktop App (voicebox.sh)"

set "VOICEBOX_EXE=%LOCALAPPDATA%\Programs\Voicebox\Voicebox.exe"
set "VOICEBOX_EXE2=%LOCALAPPDATA%\Programs\voicebox\Voicebox.exe"

if exist "%VOICEBOX_EXE%" (
    echo Starting Voicebox Desktop App...
    start "" "%VOICEBOX_EXE%"
    goto :done
)

if exist "%VOICEBOX_EXE2%" (
    echo Starting Voicebox Desktop App...
    start "" "%VOICEBOX_EXE2%"
    goto :done
)

if exist "Voicebox_Setup.exe" (
    echo Voicebox is not yet installed.
    echo Launching the official Voicebox Windows Installer (Voicebox_Setup.exe)...
    echo Follow the on-screen installer to install Voicebox on your PC.
    start "" "Voicebox_Setup.exe"
    goto :done
)

echo Voicebox_Setup.exe not found. Downloading installer...
python scripts/download_official_voicebox.py
if exist "Voicebox_Setup.exe" (
    start "" "Voicebox_Setup.exe"
)

:done
endlocal

