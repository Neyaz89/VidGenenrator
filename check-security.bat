@echo off
echo Running security check...
powershell -ExecutionPolicy Bypass -File "%~dp0check-security.ps1"
pause
