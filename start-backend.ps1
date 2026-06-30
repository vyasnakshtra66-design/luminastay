# LuminaStay - Start Backend Only
Write-Host "Starting LuminaStay Backend..." -ForegroundColor Yellow

# Kill zombie on 8001
$portPids = netstat -ano | Select-String ":8001 " | ForEach-Object { ($_ -split '\s+')[-1] } | Where-Object { $_ -match '^\d+$' } | Select-Object -Unique
foreach ($pid in $portPids) { try { Stop-Process -Id $pid -Force } catch {} }
Start-Sleep 1

cd "$PSScriptRoot\backend"
$proc = Start-Process -NoNewWindow -FilePath ".\venv\Scripts\python.exe" -ArgumentList "main.py" -PassThru
Write-Host "Backend started (PID: $($proc.Id)): http://localhost:8001" -ForegroundColor Green
Write-Host "API docs: http://localhost:8001/docs" -ForegroundColor Green
