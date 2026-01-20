@echo off
echo Running FFmpeg installer...
powershell -ExecutionPolicy Bypass -File "%~dp0install-ffmpeg.ps1"
pause
