# Build script for DDL Retailer App (Windows PowerShell)
# Usage:
#   .\build.ps1 -Target mobile   - Build static export for Capacitor (Android/iOS)
#   .\build.ps1 -Target web      - Build for web deployment
#   .\build.ps1                  - Defaults to mobile

param(
    [string]$Target = "mobile"
)

$ErrorActionPreference = "Stop"

if ($Target -eq "mobile") {
    Write-Host "Building for mobile (Capacitor static export)..." -ForegroundColor Cyan

    # Temporarily move API routes out (they don't work with static export)
    if (Test-Path "src\app\api") {
        Move-Item "src\app\api" "src\app\_api_backup"
        Write-Host "  API routes temporarily excluded (native app uses localStorage)" -ForegroundColor Yellow
    }

    # Build static export
    npx next build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  Build failed!" -ForegroundColor Red
        # Restore API routes even on failure
        if (Test-Path "src\app\_api_backup") {
            Move-Item "src\app\_api_backup" "src\app\api"
            Write-Host "  API routes restored after failure" -ForegroundColor Yellow
        }
        exit 1
    }

    # Restore API routes
    if (Test-Path "src\app\_api_backup") {
        Move-Item "src\app\_api_backup" "src\app\api"
        Write-Host "  API routes restored" -ForegroundColor Green
    }

    # Sync with Capacitor
    npx cap sync
    Write-Host "  Capacitor sync complete" -ForegroundColor Green
    Write-Host ""
    Write-Host "Run the following to open in Android Studio:" -ForegroundColor White
    Write-Host "  npx cap open android" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Or run directly on a connected device:" -ForegroundColor White
    Write-Host "  npx cap run android" -ForegroundColor Yellow

} elseif ($Target -eq "web") {
    Write-Host "Building for web deployment..." -ForegroundColor Cyan

    # For web, switch to standalone output temporarily
    if (Test-Path "next.config.ts") {
        Copy-Item "next.config.ts" "next.config.ts.bak"
    }

    $webConfig = @"
import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  output: "standalone",
  typescript: { ignoreBuildErrors: true },
  reactStrictMode: false,
};
export default nextConfig;
"@
    Set-Content -Path "next.config.ts" -Value $webConfig -NoNewline

    npx next build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  Build failed!" -ForegroundColor Red
        # Restore original config
        if (Test-Path "next.config.ts.bak") {
            Move-Item "next.config.ts.bak" "next.config.ts" -Force
        }
        exit 1
    }

    # Restore original config
    Remove-Item "next.config.ts" -Force
    if (Test-Path "next.config.ts.bak") {
        Move-Item "next.config.ts.bak" "next.config.ts" -Force
    }
    Write-Host "  Web build complete" -ForegroundColor Green

} else {
    Write-Host "Usage: .\build.ps1 -Target [web|mobile]" -ForegroundColor White
    Write-Host ""
    Write-Host "  mobile  - Build static export + sync with Capacitor for Android/iOS"
    Write-Host "  web     - Build for web server deployment"
    Write-Host ""
    Write-Host "For development, just run: npm run dev"
}
