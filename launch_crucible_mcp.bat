@echo off
setlocal
cd /d "%~dp0"
title "Crucible MCP Server — AI 3D Engine"

set "CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME_PATH%" (
    set "CHROME_PATH=%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
)

set "JOBS_DIR=%~dp0out\crucible_jobs"
if not exist "%JOBS_DIR%" mkdir "%JOBS_DIR%"

echo ======================================================================
echo    Starting Crucible MCP Server (3D Engine for AI Agents)
echo    Version: 0.21.0 ^| Backend: GPU ^| Memory: 512 MiB
echo ======================================================================
echo.

node node_modules/@codepawlhq/crucible/bin/crucible-mcp.mjs --backend gpu --browser "%CHROME_PATH%" --jobs "%JOBS_DIR%" --memory 512

endlocal
