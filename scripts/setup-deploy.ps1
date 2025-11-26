<#
  setup-deploy.ps1

  Usage: Run this script locally (PowerShell) to add GitHub Secrets needed by the CI workflows
  - Requires: GitHub CLI (gh) installed and authenticated, jq (for Render response pretty-print)

  The script will ask for the values and call `gh secret set` for each.
#>

Function Ensure-Command($name) {
  $c = Get-Command $name -ErrorAction SilentlyContinue
  if (-not $c) {
    Write-Host "ERROR: Required executable '$name' not found in PATH. Please install and retry." -ForegroundColor Red
    return $false
  }
  return $true
}

if (-not (Ensure-Command 'gh')) { exit 1 }

Write-Host "This helper will set repository secrets for Vercel and Render using 'gh secret set'." -ForegroundColor Cyan
Write-Host "Make sure you run this inside the repo directory and gh is authenticated (gh auth login)." -ForegroundColor Yellow

$confirm = Read-Host "Proceed? (y/n)"
if ($confirm -ne 'y') { Write-Host "Aborted"; exit 0 }

function Set-Repo-Secret($secretName) {
  $value = Read-Host "Enter value for $secretName (paste and press Enter)"
  if ([string]::IsNullOrWhiteSpace($value)) {
    Write-Host "Skipping $secretName (empty)" -ForegroundColor Yellow
    return
  }
  gh secret set $secretName --body "$value"
  if ($LASTEXITCODE -eq 0) { Write-Host "$secretName set ✔" -ForegroundColor Green } else { Write-Host "Failed to set $secretName" -ForegroundColor Red }
}

Write-Host "\n--- Vercel secrets ---" -ForegroundColor Cyan
Set-Repo-Secret -secretName 'VERCEL_TOKEN'
Set-Repo-Secret -secretName 'VERCEL_ORG_ID'
Set-Repo-Secret -secretName 'VERCEL_PROJECT_ID'

Write-Host "\n--- Render secrets ---" -ForegroundColor Cyan
Set-Repo-Secret -secretName 'RENDER_API_KEY'
Set-Repo-Secret -secretName 'RENDER_SERVICE_ID'

Write-Host "\nAll requested repo secrets have been processed. If you also need to set Render environment variables (MONGODB_URI, JWT_SECRET, EMAIL_*), configure those directly in the Render dashboard for your service." -ForegroundColor Green

Write-Host "Finally, push to main to trigger workflows (or run 'git push origin main' if necessary)." -ForegroundColor Cyan
