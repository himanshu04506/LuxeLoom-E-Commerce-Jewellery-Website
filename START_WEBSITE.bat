@echo off
title LuxeLoom Jewellery E-Commerce Launcher
echo ====================================================
echo    LUXELOOM JEWELLERY ONE-CLICK AUTOMATED LAUNCHER
echo ====================================================
echo.

cd /d "%~dp0"

echo Starting LuxeLoom services...
start http://localhost:3000
node start.js

pause
