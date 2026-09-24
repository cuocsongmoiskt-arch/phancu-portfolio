@echo off
chcp 65001 >nul
setlocal
title WEBOX Portfolio - go cai dat chay tu dong

set "PORT=3200"
set "TASKNAME=WEBOX_Portfolio"

net session >nul 2>&1
if errorlevel 1 (
  echo  [LOI] Can chay bang quyen Administrator.
  pause
  exit /b 1
)

echo.
echo  Dang go cai dat...

where nssm >nul 2>&1
if not errorlevel 1 (
  nssm stop %TASKNAME% >nul 2>&1
  nssm remove %TASKNAME% confirm >nul 2>&1
  echo   - Da go Windows Service (NSSM)
)

schtasks /end /tn "%TASKNAME%" >nul 2>&1
schtasks /delete /tn "%TASKNAME%" /f >nul 2>&1
echo   - Da go tac vu Task Scheduler

netsh advfirewall firewall delete rule name="WEBOX Portfolio %PORT%" >nul 2>&1
echo   - Da xoa rule tuong lua (neu co)

for /f "tokens=5" %%p in ('netstat -ano ^| findstr /r /c:":%PORT% .*LISTENING"') do (
  if not "%%p"=="0" taskkill /PID %%p /T /F >nul 2>&1
)
echo   - Da dung tien trinh tren cong %PORT%

echo.
echo  [OK] Xong. Ma nguon van con nguyen trong thu muc.
echo.
pause
exit /b 0
