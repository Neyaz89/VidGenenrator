# Environment Setup Script
# This script helps you configure API keys safely

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Environment Setup Wizard" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env files already exist
$backendEnvExists = Test-Path "backend-node/.env"
$frontendEnvExists = Test-Path "frontend/.env.local"

if ($backendEnvExists -or $frontendEnvExists) {
    Write-Host "Warning: Environment files already exist!" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite them? (y/n)"
    if ($overwrite -ne "y") {
        Write-Host "Setup cancelled." -ForegroundColor Red
        exit
    }
}

# Backend Setup
Write-Host ""
Write-Host "Step 1: Backend Configuration" -ForegroundColor Green
Write-Host "------------------------------" -ForegroundColor Gray

# Copy example file
Copy-Item "backend-node/.env.example" "backend-node/.env"

# Get Groq API Key
Write-Host ""
Write-Host "Get your Groq API key from: https://console.groq.com" -ForegroundColor Yellow
$groqKey = Read-Host "Enter your Groq API Key"

if ($groqKey -eq "") {
    Write-Host "Error: Groq API key is required!" -ForegroundColor Red
    exit 1
}

# Update .env file
$envContent = Get-Content "backend-node/.env"
$envContent = $envContent -replace "your_groq_api_key_here", $groqKey
Set-Content "backend-node/.env" $envContent

Write-Host "✓ Backend configured!" -ForegroundColor Green

# Frontend Setup
Write-Host ""
Write-Host "Step 2: Frontend Configuration" -ForegroundColor Green
Write-Host "-------------------------------" -ForegroundColor Gray

Copy-Item "frontend/.env.example" "frontend/.env.local"

$apiUrl = Read-Host "Enter Backend URL (press Enter for default: http://localhost:8000)"
if ($apiUrl -eq "") {
    $apiUrl = "http://localhost:8000"
}

$frontendEnvContent = "NEXT_PUBLIC_API_URL=$apiUrl"
Set-Content "frontend/.env.local" $frontendEnvContent

Write-Host "✓ Frontend configured!" -ForegroundColor Green

# Summary
Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Configuration saved to:" -ForegroundColor Yellow
Write-Host "  - backend-node/.env" -ForegroundColor White
Write-Host "  - frontend/.env.local" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  IMPORTANT: Never commit these files to Git!" -ForegroundColor Red
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. cd backend-node && npm install && npm start" -ForegroundColor White
Write-Host "2. cd frontend && npm install && npm run dev" -ForegroundColor White
Write-Host "3. Open http://localhost:3000" -ForegroundColor White
Write-Host ""
