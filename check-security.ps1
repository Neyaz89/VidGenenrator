# Local Security Check Script
# Run this before committing to ensure no secrets are exposed

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Security Check" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

$errors = 0

# Check for Groq API keys
Write-Host "Checking for exposed Groq API keys..." -ForegroundColor Yellow
$groqKeys = Get-ChildItem -Recurse -File -Exclude node_modules,.git | 
    Select-String -Pattern "gsk_" -SimpleMatch

if ($groqKeys) {
    Write-Host "✗ ERROR: Groq API key found in:" -ForegroundColor Red
    $groqKeys | ForEach-Object { Write-Host "  $($_.Path)" -ForegroundColor Red }
    $errors++
} else {
    Write-Host "✓ No Groq API keys found" -ForegroundColor Green
}

# Check for Google API keys
Write-Host "Checking for exposed Google API keys..." -ForegroundColor Yellow
$googleKeys = Get-ChildItem -Recurse -File -Exclude node_modules,.git | 
    Select-String -Pattern "AIzaSy" -SimpleMatch

if ($googleKeys) {
    Write-Host "✗ ERROR: Google API key found in:" -ForegroundColor Red
    $googleKeys | ForEach-Object { Write-Host "  $($_.Path)" -ForegroundColor Red }
    $errors++
} else {
    Write-Host "✓ No Google API keys found" -ForegroundColor Green
}

# Check if .env files exist in git
Write-Host "Checking for committed .env files..." -ForegroundColor Yellow
$envFiles = git ls-files | Select-String -Pattern "\.env$|\.env\.local$"

if ($envFiles) {
    Write-Host "✗ ERROR: .env files should not be committed:" -ForegroundColor Red
    $envFiles | ForEach-Object { Write-Host "  $_" -ForegroundColor Red }
    $errors++
} else {
    Write-Host "✓ No .env files in git" -ForegroundColor Green
}

# Check .gitignore
Write-Host "Checking .gitignore configuration..." -ForegroundColor Yellow
$gitignoreContent = Get-Content .gitignore -Raw

if ($gitignoreContent -match "\.env") {
    Write-Host "✓ .gitignore properly configured" -ForegroundColor Green
} else {
    Write-Host "✗ ERROR: .env not in .gitignore!" -ForegroundColor Red
    $errors++
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan

if ($errors -eq 0) {
    Write-Host "✓ Security check passed!" -ForegroundColor Green
    Write-Host "Safe to commit." -ForegroundColor Green
} else {
    Write-Host "✗ Security check failed!" -ForegroundColor Red
    Write-Host "Fix the issues above before committing." -ForegroundColor Red
    exit 1
}

Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
