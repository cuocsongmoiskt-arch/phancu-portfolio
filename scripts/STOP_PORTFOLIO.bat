@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
title WEBOX Portfolio - dung dich vu

set "PORT=3200"
echo.
echo  Dang tim tien trinh dang giu cong %PORT%...

set "FOUND="
for /f "tokens=5" %%p in ('netstat -ano ^| findstr /r /c:":%PORT% .*LISTENING"') do (
  if not "%%p"=="0" (
    set "FOUND=1"
    echo   - Dung PID %%p
    taskkill /PID %%p /T /F >nul 2>&1
  )
)

if not defined FOUND (
  echo  Khong co dich vu nao chay tren cong %PORT%.
) else (
  echo  Da dung dich vu tren cong %PORT%.
)
echo.
timeout /t 4 /nobreak >nul
exit /b 0
