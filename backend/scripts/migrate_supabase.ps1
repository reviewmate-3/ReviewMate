$ErrorActionPreference = 'Stop'

Set-Location $PSScriptRoot\..

if ([string]::IsNullOrWhiteSpace($env:SUPABASE_DATABASE_URL)) {
    throw 'SUPABASE_DATABASE_URL is required. Set it in backend/.env or in the shell before running this script.'
}

Write-Host 'Applying ReviewMate Alembic migrations to Supabase PostgreSQL...'
& .\venv\Scripts\python.exe -m alembic upgrade head
if ($LASTEXITCODE -ne 0) {
    throw "Supabase migration failed with exit code $LASTEXITCODE."
}

Write-Host 'Supabase schema is up to date.'
