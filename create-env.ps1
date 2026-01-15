# PowerShell script to create .env.local file
# Run with: .\create-env.ps1

$envFile = ".env.local"
$exampleFile = "env.example"

if (Test-Path $envFile) {
    Write-Host "⚠️  File .env.local already exists!" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (y/n)"
    if ($overwrite -ne "y") {
        Write-Host "Cancelled." -ForegroundColor Red
        exit
    }
}

Write-Host "`n📝 Creating .env.local file..." -ForegroundColor Cyan
Write-Host "`nYou need to provide your Supabase credentials:" -ForegroundColor Yellow
Write-Host "Get them from: https://supabase.com/dashboard > Settings > API`n" -ForegroundColor Gray

$supabaseUrl = Read-Host "Enter NEXT_PUBLIC_SUPABASE_URL (e.g., https://xxxxx.supabase.co)"
$anonKey = Read-Host "Enter NEXT_PUBLIC_SUPABASE_ANON_KEY"
$serviceKey = Read-Host "Enter SUPABASE_SERVICE_ROLE_KEY"

$content = @"
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=$supabaseUrl
NEXT_PUBLIC_SUPABASE_ANON_KEY=$anonKey
SUPABASE_SERVICE_ROLE_KEY=$serviceKey

# Optional: Rate limiting
RATE_LIMIT_WINDOW_HOURS=24
"@

$content | Out-File -FilePath $envFile -Encoding utf8 -NoNewline

Write-Host "`n✅ File .env.local created successfully!" -ForegroundColor Green
Write-Host "⚠️  Remember to restart the dev server (Ctrl+C and then 'npm run dev')" -ForegroundColor Yellow
