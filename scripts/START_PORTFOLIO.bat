@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
title WEBOX Portfolio - Phan Cu

set "PORT=3200"
set "ROOT=%~dp0.."
cd /d "%ROOT%"

echo.
echo  ==========================================================
echo   PHAN CU PORTFOLIO  -  khoi dong dich vu chay ngam
echo   Cong: %PORT%   Thu muc: %CD%
echo  ==========================================================
echo.

REM --- 1. Kiem tra Node.js -------------------------------------------
where node >nul 2>&1
if errorlevel 1 (
  echo  [LOI] Khong tim thay Node.js. Cai dat tai https://nodejs.org roi chay lai.
  echo.
  pause
  exit /b 1
)
for /f "delims=" %%v in ('node -v') do echo  [OK] Node.js %%v

REM --- 2. Neu cong da co dich vu chay thi mo trinh duyet luon ---------
netstat -ano | findstr /r /c:":%PORT% .*LISTENING" >nul 2>&1
if not errorlevel 1 (
  echo  [i] Dich vu da chay san tren cong %PORT%.
  goto :OPEN
)

REM --- 3. Cai thu vien neu chua co ------------------------------------
if not exist "node_modules" (
  echo  [..] Lan dau chay - dang cai thu vien, vui long doi vai phut...
  call npm install --no-audit --no-fund
  if errorlevel 1 (
    echo  [LOI] Cai thu vien that bai.
    pause
    exit /b 1
  )
)

REM --- 4. Build neu chua co --------------------------------------------
if not exist ".next\BUILD_ID" (
  echo  [..] Dang build website...
  call npm run build
  if errorlevel 1 (
    echo  [LOI] Build that bai.
    pause
    exit /b 1
  )
)

REM --- 5. Khoi dong o che do an ----------------------------------------
if not exist "logs" mkdir "logs"
echo  [..] Dang khoi dong dich vu ngam...
wscript //nologo "%~dp0_hidden.vbs" "%CD%" "npm run start >> logs\portfolio.log 2>&1"

REM --- 6. Cho cong san sang (toi da 60 giay) ----------------------------
set /a TRIES=0
:WAIT
timeout /t 1 /nobreak >nul
netstat -ano | findstr /r /c:":%PORT% .*LISTENING" >nul 2>&1
if not errorlevel 1 goto :OPEN
set /a TRIES+=1
if !TRIES! lss 60 goto :WAIT
echo  [LOI] Qua 60 giay van chua len. Xem log: logs\portfolio.log
echo.
pause
exit /b 1

:OPEN
echo.
echo  [OK] Dich vu dang chay.
echo.
echo   Tren may nay : http://localhost:%PORT%/vi
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
  set "IP=%%a"
  set "IP=!IP: =!"
  echo   Trong mang LAN: http://!IP!:%PORT%/vi
)
echo.
echo   Dung dich vu : chay STOP_PORTFOLIO.bat
echo   Log          : logs\portfolio.log
echo.
start "" "http://localhost:%PORT%/vi"
timeout /t 6 /nobreak >nul
exit /b 0
