# remotetier — Windows: คุม `claude remote-control` ให้เปิดตลอด
$WorkDir = if ($env:REMOTETIER_DIR) { $env:REMOTETIER_DIR } else { $HOME }
$Extra   = if ($env:REMOTETIER_ARGS) { $env:REMOTETIER_ARGS } else { "" }
$Log     = Join-Path $HOME ".remotetier.log"
Set-Location $WorkDir
$delay = 2
while ($true) {
  $start = Get-Date
  Add-Content $Log "$(Get-Date -f 'yyyy-MM-dd HH:mm:ss') เริ่ม remote-control ใน $WorkDir"
  & claude remote-control $Extra.Split(' ', [StringSplitOptions]::RemoveEmptyEntries) *>> $Log
  Add-Content $Log "$(Get-Date -f 'yyyy-MM-dd HH:mm:ss') หลุด (exit $LASTEXITCODE) — เปิดใหม่ใน ${delay}s"
  if (((Get-Date) - $start).TotalSeconds -gt 60) { $delay = 2 } else { $delay = [Math]::Min($delay * 2, 60) }
  Start-Sleep -Seconds $delay
}
