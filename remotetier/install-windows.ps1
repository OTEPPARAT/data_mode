# ติดตั้ง remotetier เป็น Scheduled Task: เริ่มเมื่อล็อกอิน + รีสตาร์ทเองถ้าตาย
$Dir = Join-Path $HOME ".remotetier"
New-Item -ItemType Directory -Force $Dir | Out-Null
Copy-Item "$PSScriptRoot\remotetier.ps1" $Dir -Force
$action   = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$Dir\remotetier.ps1`""
$trigger  = New-ScheduledTaskTrigger -AtLogOn -User $env:USERNAME
$settings = New-ScheduledTaskSettingsSet -RestartCount 999 -RestartInterval (New-TimeSpan -Minutes 1) -ExecutionTimeLimit 0 -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable
Register-ScheduledTask -TaskName "remotetier" -Action $action -Trigger $trigger -Settings $settings -Force | Out-Null
Start-ScheduledTask -TaskName "remotetier"
Write-Host "remotetier ติดตั้งและเริ่มทำงานแล้ว (log: $HOME\.remotetier.log)"
