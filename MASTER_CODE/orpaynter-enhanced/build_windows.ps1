Write-Host "🚀 Starting OrPaynter Windows Build..."

# 1. Install Dependencies
Write-Host "📦 Installing Dependencies..."
npm install
if ($LASTEXITCODE -ne 0) { exit 1 }

# 2. Clean Temp
if (Test-Path "node_modules/.vite-temp") {
    Remove-Item "node_modules/.vite-temp" -Recurse -Force
}

# 3. Type Check
Write-Host "🔍 Type Checking (Skipped for Build)..."
# npx tsc -b
# if ($LASTEXITCODE -ne 0) { exit 1 }

# 4. Build
Write-Host "🏗️  Building for Production..."
$env:BUILD_MODE = "prod"
npx vite build
if ($LASTEXITCODE -ne 0) { exit 1 }

# 5. Archive
$zipName = "orpaynter-v1.0.0.zip"
if (Test-Path $zipName) { Remove-Item $zipName }
Write-Host "🗜️  Compressing Artifact..."
Compress-Archive -Path "dist\*" -DestinationPath $zipName -Force

# 6. Checksum
$hash = Get-FileHash $zipName -Algorithm SHA256
Write-Host "✅ Build Success!"
Write-Host "SHA256: " $hash.Hash
