# ====================================================
# CityMind AI Karnataka - Main Unified Runner
# ====================================================

# Stop any existing running servers in this workspace before starting new ones
Write-Host "Stopping existing backend or portal server processes..." -ForegroundColor DarkYellow
Get-CimInstance Win32_Process | Where-Object { $_.Name -match "node|python" -and $_.CommandLine -like "*SheCodes*" } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }

Write-Host "Launching CityMind AI Karnataka services..." -ForegroundColor Cyan

# 1. Start Consolidated Backend (Port 8080)
Write-Host "Starting Consolidated Backend (Port 8080)..." -ForegroundColor Green
$api = [PowerShell]::Create()
[void]$api.AddScript("cd c:\Users\likit\OneDrive\Desktop\SheCodes\backend ; python -m uvicorn app:app --host 0.0.0.0 --port 8080")
$apiResult = $api.BeginInvoke()

# 2. Start Citizen Portal (Port 3001)
Write-Host "Starting Citizen Portal (Port 3001)..." -ForegroundColor Yellow
$cit = [PowerShell]::Create()
[void]$cit.AddScript("cd c:\Users\likit\OneDrive\Desktop\SheCodes\frontend\citizen ; npm run dev -- -p 3001")
$citResult = $cit.BeginInvoke()

# 3. Start Officer Portal (Port 3002)
Write-Host "Starting Officer Portal (Port 3002)..." -ForegroundColor Yellow
$off = [PowerShell]::Create()
[void]$off.AddScript("cd c:\Users\likit\OneDrive\Desktop\SheCodes\frontend\officer ; npm run dev -- -p 3002")
$offResult = $off.BeginInvoke()

# 4. Start Admin Portal (Port 3003)
Write-Host "Starting Admin Portal (Port 3003)..." -ForegroundColor Yellow
$adm = [PowerShell]::Create()
[void]$adm.AddScript("cd c:\Users\likit\OneDrive\Desktop\SheCodes\frontend\admin ; npm run dev -- -p 3003")
$admResult = $adm.BeginInvoke()

# 5. Start AI Dashboard (Port 3004)
Write-Host "Starting AI Dashboard (Port 3004)..." -ForegroundColor Yellow
$aid = [PowerShell]::Create()
[void]$aid.AddScript("cd c:\Users\likit\OneDrive\Desktop\SheCodes\frontend\ai-dashboard ; npm run dev -- -p 3004")
$aidResult = $aid.BeginInvoke()

Write-Host "All services started! Keep this session open to test." -ForegroundColor Green
Write-Host "Consolidated Backend: http://localhost:8080/health" -ForegroundColor Green
Write-Host "Citizen Portal:       http://localhost:3001" -ForegroundColor Yellow
Write-Host "Officer Portal:       http://localhost:3002" -ForegroundColor Yellow
Write-Host "Admin Portal:         http://localhost:3003" -ForegroundColor Yellow
Write-Host "AI Dashboard:         http://localhost:3004" -ForegroundColor Yellow

# Stay active in foreground until interrupted
try {
    while ($true) {
        Start-Sleep -Seconds 2
    }
} finally {
    # Clean up on exit
    Write-Host "Stopping all backend and portal processes..." -ForegroundColor DarkYellow
    Get-CimInstance Win32_Process | Where-Object { $_.Name -match "node|python" -and $_.CommandLine -like "*SheCodes*" } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
}
