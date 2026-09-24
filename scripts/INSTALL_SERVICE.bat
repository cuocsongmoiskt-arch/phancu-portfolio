@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
title WEBOX Portfolio - cai dat chay tu dong khi bat may

set "PORT=3200"
set "TASKNAME=WEBOX_Portfolio"
set "ROOT=%~dp0.."
cd /d "%ROOT%"
set "ROOT=%CD%"

REM --- Bat buoc quyen Administrator ------------------------------------
net session >nul 2>&1
if errorlevel 1 (
  echo.
  echo  [LOI] Can chay bang quyen Administrator.
  echo        Chuot phai vao file nay - Run as administrator.
  echo.
  pause
  exit /b 1
)

echo.
echo  ==========================================================
echo   Cai dat WEBOX Portfolio chay tu dong khi bat may
echo   Thu muc: %ROOT%
echo   Cong   : %PORT%
echo  ==========================================================
echo.

REM --- Build san de lan khoi dong dau khong phai cho ---------------------
if not exist "node_modules" (
  echo  [..] Dang cai thu vien...
  call npm install --no-audit --no-fund || (echo  [LOI] Cai that bai. & pause & exit /b 1)
)
if not exist ".next\BUILD_ID" (
  echo  [..] Dang build...
  call npm run build || (echo  [LOI] Build that bai. & pause & exit /b 1)
)

REM --- Uu tien NSSM neu may da co --------------------------------------
where nssm >nul 2>&1
if not errorlevel 1 (
  echo  [i] Phat hien NSSM - cai dat dang Windows Service that.
  nssm stop %TASKNAME% >nul 2>&1
  nssm remove %TASKNAME% confirm >nul 2>&1
  for /f "delims=" %%n in ('where npm.cmd') do set "NPMCMD=%%n"
  nssm install %TASKNAME% "!NPMCMD!" "run start"
  nssm set %TASKNAME% AppDirectory "%ROOT%"
  nssm set %TASKNAME% AppStdout "%ROOT%\logs\portfolio.log"
  nssm set %TASKNAME% AppStderr "%ROOT%\logs\portfolio.log"
  nssm set %TASKNAME% Start SERVICE_AUTO_START
  nssm set %TASKNAME% DisplayName "WEBOX Portfolio - Phan Cu"
  nssm start %TASKNAME%
  set "MODE=Windows Service (NSSM)"
) else (
  echo  [i] Khong co NSSM - dung Task Scheduler cua Windows.
  schtasks /delete /tn "%TASKNAME%" /f >nul 2>&1
  schtasks /create /tn "%TASKNAME%" /sc onstart /ru "SYSTEM" /rl HIGHEST /f ^
    /tr "wscript //nologo \"%ROOT%\scripts\_hidden.vbs\" \"%ROOT%\" \"npm run start >> logs\portfolio.log 2>&1\""
  if errorlevel 1 (
    echo  [LOI] Tao tac vu that bai.
    pause
    exit /b 1
  )
  schtasks /run /tn "%TASKNAME%" >nul 2>&1
  set "MODE=Task Scheduler (chay luc bat may)"
)

echo.
echo  [OK] Da cai: !MODE!
echo.

REM --- Mo cong tren tuong lua (tuy chon, hoi truoc) ---------------------
echo  Cho phep may khac trong LAN truy cap cong %PORT%?
echo  Lenh se chay: netsh advfirewall firewall add rule name="WEBOX Portfolio %PORT%" dir=in action=allow protocol=TCP localport=%PORT%
set /p FW="  Go Y de dong y, phim khac de bo qua: "
if /i "!FW!"=="Y" (
  netsh advfirewall firewall delete rule name="WEBOX Portfolio %PORT%" >nul 2>&1
  netsh advfirewall firewall add rule name="WEBOX Portfolio %PORT%" dir=in action=allow protocol=TCP localport=%PORT%
  echo  [OK] Da mo cong %PORT% tren tuong lua.
) else (
  echo  [i] Bo qua tuong lua - chi truy cap duoc tu chinh may nay.
)

echo.
echo   Tren may nay : http://localhost:%PORT%/vi
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
  set "IP=%%a"
  set "IP=!IP: =!"
  echo   Trong mang LAN: http://!IP!:%PORT%/vi
)
echo.
echo   Go cai dat: chay UNINSTALL_SERVICE.bat bang quyen Administrator
echo.
pause
exit /b 0
