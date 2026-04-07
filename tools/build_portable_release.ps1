param(
  [string]$Version = "0.1.0-beta",
  [string]$ReleaseName = "IPM"
)

$ErrorActionPreference = "Stop"

$root = "E:\AIGC\promptagent\ImproveMAX"
$appRoot = Join-Path $root "resource-workbench-app"
$tauriRoot = Join-Path $appRoot "src-tauri"
$releaseRoot = Join-Path $root "dist"
$portableDir = Join-Path $releaseRoot "$ReleaseName-$Version-windows-portable"
$zipPath = Join-Path $releaseRoot "$ReleaseName-$Version-windows-portable.zip"
$sourceExe = Join-Path $tauriRoot "target\release\resource_workbench_desktop.exe"
$portableExe = Join-Path $portableDir "$ReleaseName.exe"

if (-not (Test-Path $sourceExe)) {
  throw "Missing built desktop executable: $sourceExe"
}

Remove-Item $portableDir -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item $zipPath -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $portableDir | Out-Null
New-Item -ItemType Directory -Path (Join-Path $portableDir "docs") | Out-Null
New-Item -ItemType Directory -Path (Join-Path $portableDir "assets") | Out-Null

Copy-Item $sourceExe $portableExe -Force
Copy-Item (Join-Path $root "README.md") (Join-Path $portableDir "README.md") -Force
Copy-Item (Join-Path $root "docs\QUICK_START.md") (Join-Path $portableDir "docs\QUICK_START.md") -Force
Copy-Item (Join-Path $root "docs\KNOWN_ISSUES.md") (Join-Path $portableDir "docs\KNOWN_ISSUES.md") -Force
Copy-Item (Join-Path $root "assets\github\hero-cover.png") (Join-Path $portableDir "assets\hero-cover.png") -Force
Copy-Item (Join-Path $root "assets\github\quickstart-board.png") (Join-Path $portableDir "assets\quickstart-board.png") -Force
Copy-Item (Join-Path $root "assets\github\cards-view.png") (Join-Path $portableDir "assets\cards-view.png") -Force
Copy-Item (Join-Path $root "assets\github\graph-view.png") (Join-Path $portableDir "assets\graph-view.png") -Force

$readmeTxt = @"
IPM Portable Beta
=================

1. 双击 IPM.exe 启动
2. 优先使用“导入文件”按钮导入 Markdown / TXT / PDF / DOCX / 图片
3. 如果第一次启动稍慢，请等待几秒

附带文档：
- docs\QUICK_START.md
- docs\KNOWN_ISSUES.md
"@

Set-Content -Path (Join-Path $portableDir "Portable-Readme.txt") -Value $readmeTxt

Compress-Archive -Path (Join-Path $portableDir "*") -DestinationPath $zipPath -CompressionLevel Optimal

Write-Output "Portable directory: $portableDir"
Write-Output "Zip package: $zipPath"
