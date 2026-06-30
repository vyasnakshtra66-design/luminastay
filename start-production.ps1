# LuminaStay Production Start Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   LuminaStay - Starting Production" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. Kill zombie processes on ports 8000/8001
Write-Host "[1/4] Cleaning ports..." -ForegroundColor Yellow
$ports = @(8000, 8001)
foreach ($port in $ports) {
    $processes = netstat -ano | Select-String ":$port " | ForEach-Object {
        $parts = $_ -split '\s+'
        $parts[-1]
    } | Where-Object { $_ -match '^\d+$' } | Select-Object -Unique

    foreach ($pid in $processes) {
        try {
            Stop-Process -Id $pid -Force -ErrorAction Stop
            Write-Host "   Killed PID $pid on port $port" -ForegroundColor DarkYellow
        } catch { }
    }
}
Start-Sleep 1

# 2. Start Backend
Write-Host "[2/4] Starting Backend (port 8001)..." -ForegroundColor Yellow
$backendDir = Join-Path $PSScriptRoot "backend"
$pythonExe = Join-Path $backendDir "venv\Scripts\python.exe"
$mainPy = Join-Path $backendDir "main.py"

if (Test-Path $pythonExe) {
    $backendProc = Start-Process -NoNewWindow -FilePath $pythonExe -ArgumentList $mainPy -PassThru
    Write-Host "   Backend PID: $($backendProc.Id)" -ForegroundColor Green
} else {
    Write-Host "   ERROR: $pythonExe not found!" -ForegroundColor Red
    exit 1
}

# Wait for backend
Start-Sleep 3
try {
    $health = Invoke-WebRequest -Uri "http://localhost:8001/health" -UseBasicParsing -TimeoutSec 5
    Write-Host "   Backend: $($health.Content)" -ForegroundColor Green
} catch {
    Write-Host "   WARNING: Backend health check failed" -ForegroundColor DarkYellow
}

# 3. Start Frontend
Write-Host "[3/4] Starting Frontend (port 3000)..." -ForegroundColor Yellow
$frontendDir = Join-Path $PSScriptRoot "nextjs-app"
Set-Location $frontendDir

$frontendProc = Start-Process -NoNewWindow -FilePath "npx" -ArgumentList "next dev --turbopack" -PassThru
Write-Host "   Frontend PID: $($frontendProc.Id)" -ForegroundColor Green

# 4. Done
Write-Host "[4/4] Done!" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "   Backend:  http://localhost:8001" -ForegroundColor Green
Write-Host "   Docs:     http://localhost:8001/docs" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Demo login: john@example.com / demo123" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Cyan

# Keep script running
while ($true) {
    $backendRunning = Get-Process -Id $backendProc.Id -ErrorAction SilentlyContinue
    $frontendRunning = Get-Process -Id $frontendProc.Id -ErrorAction SilentlyContinue
    if (-not $backendRunning) { Write-Host "[!] Backend stopped" -ForegroundColor Red }
    if (-not $frontendRunning) { Write-Host "[!] Frontend stopped" -ForegroundColor Red }
    if (-not $backendRunning -and -not $frontendRunning) { break }
    Start-Sleep 10
}
