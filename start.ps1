# LuxeLoom Jewellery E-Commerce PowerShell Launcher
# Run this script in PowerShell using: .\start.ps1

Write-Host "====================================================" -ForegroundColor Gold
Write-Host "   LUXELOOM JEWELLERY POWERSHELL AUTOMATED LAUNCHER" -ForegroundColor Gold
Write-Host "====================================================`n" -ForegroundColor Gold

$rootDir = Get-Location
$serverDir = Join-Path $rootDir "server"
$clientDir = Join-Path $rootDir "client"

# Detect node.exe path if not in current $env:PATH
$nodePath = Get-Command "node" -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source

if (-not $nodePath) {
    Write-Host "[Info] Searching for Node.exe in standard Windows installation paths..." -ForegroundColor Yellow
    $possiblePaths = @(
        "C:\Program Files\nodejs",
        "C:\Program Files (x86)\nodejs",
        "$env:LOCALAPPDATA\Programs\node",
        "$env:APPDATA\nvm"
    )

    foreach ($p in $possiblePaths) {
        if (Test-Path "$p\node.exe") {
            $env:PATH += ";$p"
            $nodePath = "$p\node.exe"
            Write-Host "[Success] Located Node.exe at: $nodePath" -ForegroundColor Green
            break
        }
    }
}

if ($nodePath) {
    # Node.js Available: Run Full-Stack React + Express Stack
    Write-Host "[Node Engine Detected] Initializing LuxeLoom Full-Stack Server..." -ForegroundColor Green
    
    if (-not (Test-Path "$serverDir\node_modules")) {
        Write-Host "[1/3] Installing Backend dependencies..." -ForegroundColor Cyan
        Set-Location $serverDir
        npm install
        Set-Location $rootDir
    }

    if (-not (Test-Path "$clientDir\node_modules")) {
        Write-Host "[2/3] Installing Frontend dependencies..." -ForegroundColor Cyan
        Set-Location $clientDir
        npm install
        Set-Location $rootDir
    }

    Write-Host "[3/3] Seeding Database & Test Accounts..." -ForegroundColor Cyan
    try {
        Set-Location $serverDir
        node scripts/seed.js
        Set-Location $rootDir
    } catch {
        Set-Location $rootDir
    }

    Start-Process "http://localhost:3000"
    node start.js
} else {
    # Node.js Not Installed: Fallback to Native PowerShell HTTP Server
    Write-Host "[Notice] Node.exe not found in system PATH." -ForegroundColor Yellow
    Write-Host "[Fallback] Starting Native PowerShell HTTP Web Server on port 5173..." -ForegroundColor Green
    
    & "$rootDir\server.ps1"
}
