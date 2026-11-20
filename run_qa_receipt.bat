@echo off
setlocal
cd /d "%~dp0"
title Automated Broadcast QA Validator ^& Provenance Ledger

echo ======================================================================
echo    Automated QA Safe-Area Checker ^& Provenance Receipt Ledger
echo ======================================================================
echo.

set PYTHON_EXE=python
where python >nul 2>&1
if %ERRORLEVEL% neq 0 (
    if exist "C:\Users\User\AppData\Local\Programs\Python\Python312\python.exe" (
        set PYTHON_EXE="C:\Users\User\AppData\Local\Programs\Python\Python312\python.exe"
    )
)

echo [1/2] Auditing NHIT Infographic 16:9 Master...
%PYTHON_EXE% scripts\qa_validator.py --video "out\master\NHIT_Infographic_Admission_16x9.mp4"
%PYTHON_EXE% scripts\receipt_generator.py --video "out\master\NHIT_Infographic_Admission_16x9.mp4"
echo.

echo [2/2] Auditing NHIT Infographic 9:16 Vertical Reel...
%PYTHON_EXE% scripts\qa_validator.py --video "out\master\NHIT_Infographic_Admission_9x16.mp4"
%PYTHON_EXE% scripts\receipt_generator.py --video "out\master\NHIT_Infographic_Admission_9x16.mp4"
echo.

echo ======================================================================
echo  ✓ QA Audit and Provenance Receipts Successfully Generated!
echo  Reports:  out\qa_reports\
echo  Receipts: out\receipts\
echo ======================================================================
pause
