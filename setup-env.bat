@echo off
echo Running environment setup wizard...
powershell -ExecutionPolicy Bypass -File "%~dp0setup-env.ps1"
pause
