# FFmpeg Auto-Installer for Windows
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "FFmpeg Auto-Installer" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

$ffmpegUrl = "https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip"
$downloadPath = "$env:TEMP\ffmpeg.zip"
$extractPath = "C:\ffmpeg"

Write-Host "Step 1: Downloading FFmpeg..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri $ffmpegUrl -OutFile $downloadPath -UseBasicParsing
    Write-Host "Download complete!" -ForegroundColor Green
} catch {
    Write-Host "Download failed: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 2: Extracting files..." -ForegroundColor Yellow
try {
    if (Test-Path $extractPath) {
        Remove-Item -Path $extractPath -Recurse -Force
    }
    
    Expand-Archive -Path $downloadPath -DestinationPath "$env:TEMP\ffmpeg-temp" -Force
    
    $innerFolder = Get-ChildItem "$env:TEMP\ffmpeg-temp" | Select-Object -First 1
    Move-Item -Path $innerFolder.FullName -Destination $extractPath -Force
    
    Remove-Item -Path $downloadPath -Force
    Remove-Item -Path "$env:TEMP\ffmpeg-temp" -Recurse -Force
    
    Write-Host "Extraction complete!" -ForegroundColor Green
} catch {
    Write-Host "Extraction failed: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 3: Adding to PATH..." -ForegroundColor Yellow
try {
    $ffmpegBinPath = "$extractPath\bin"
    $currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
    
    if ($currentPath -notlike "*$ffmpegBinPath*") {
        $newPath = "$currentPath;$ffmpegBinPath"
        [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
        $env:Path = "$env:Path;$ffmpegBinPath"
        Write-Host "Added to PATH!" -ForegroundColor Green
    } else {
        Write-Host "Already in PATH!" -ForegroundColor Green
    }
} catch {
    Write-Host "Failed to add to PATH: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "Step 4: Verifying installation..." -ForegroundColor Yellow
try {
    $ffmpegVersion = & "$extractPath\bin\ffmpeg.exe" -version 2>&1 | Select-Object -First 1
    Write-Host "FFmpeg installed successfully!" -ForegroundColor Green
    Write-Host $ffmpegVersion -ForegroundColor Gray
} catch {
    Write-Host "Verification failed" -ForegroundColor Red
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Installation Complete!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next: Close terminal, reopen, then run backend" -ForegroundColor Yellow
Write-Host ""
