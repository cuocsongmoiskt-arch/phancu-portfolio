@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
title WEBOX Portfolio - cap nhat ban moi

set "PORT=3200"
set "ROOT=%~dp0.."
cd /d "%ROOT%"

echo.
echo  ==========================================================
echo   CAP NHAT PORTFOLIO
echo   Chay file nay SAU KHI da giai nen ban moi de len thu muc
echo  ==========================================================
echo.

REM --- 1. Dung dich vu dang chay -----------------------------------
echo  [1/4] Dung dich vu tren cong %PORT%...
for /f "tokens=5" %%p in ('netstat -ano ^| findstr /r /c:":%PORT% .*LISTENING"') do (
  if not "%%p"=="0" taskkill /PID %%p /T /F >nul 2>&1
)

REM --- 2. Xoa ban build cu (bat buoc, neu khong se hien giao dien cu)
echo  [2/4] Xoa ban build cu...
if exist ".next" rmdir /s /q ".next"

REM --- 3. Cap nhat thu vien neu package.json doi -------------------
echo  [3/4] Kiem tra thu vien...
if not exist "node_modules" (
  call npm install --no-audit --no-fund || (echo  [LOI] Cai thu vien that bai. & pause & exit /b 1)
)

REM --- 4. Build lai ------------------------------------------------
echo  [4/4] Dang build lai, doi 1-3 phut...
call npm run build
if errorlevel 1 (
  echo.
  echo  [LOI] Build that bai. Doc thong bao loi o tren.
  pause
  exit /b 1
)

echo.
echo  [OK] Da cap nhat. Dang khoi dong lai...
call "%~dp0START_PORTFOLIO.bat"
exit /b 0
