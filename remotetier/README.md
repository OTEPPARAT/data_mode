# remotetier

ทำให้ `claude remote-control` บนเครื่องเดสก์ท็อปเปิดตลอด และเปิดใหม่ทันทีถ้าหลุด/ถูกปิด/รีบูต
มือถือ (แอป Claude → Claude Code) จะเห็นเครื่องนี้เองอัตโนมัติ ไม่ต้องติดตั้งอะไรฝั่งมือถือ

## ติดตั้ง (ทำครั้งเดียวบนเดสก์ท็อป)
0. ล็อกอินก่อน 1 ครั้ง: เปิดเทอร์มินัล รัน `claude` แล้ว `claude remote-control` ให้ผ่านหนึ่งรอบ
1. ให้โฟลเดอร์ทำงาน "trusted" ก่อน: `cd <โฟลเดอร์>` แล้วรัน `claude` ตอบ trust 1 ครั้ง (ใต้ launchd/systemd ไม่มีจอให้ตอบ)
   - macOS: อย่าใช้ ~/Desktop ~/Documents ~/Downloads (TCC กั้น process จะค้าง) เว้นแต่ให้สิทธิ์ Full Disk Access
2. macOS / Linux: `REMOTETIER_DIR=~/work bash install.sh` (ค่าจะบันทึกใน `~/.remotetier/env` แก้แล้วรีสตาร์ทได้)
3. Windows (PowerShell): `powershell -ExecutionPolicy Bypass -File install-windows.ps1`

## ตั้งค่า (ไม่บังคับ)
| ตัวแปร | ค่าเริ่มต้น | ความหมาย |
|---|---|---|
| REMOTETIER_DIR | โฟลเดอร์ home | โฟลเดอร์ที่ให้มือถือเข้ามาทำงาน |
| REMOTETIER_ARGS | (ว่าง) | อาร์กิวเมนต์เสริมของ `claude remote-control` |
| REMOTETIER_LOG | ~/.remotetier.log | ไฟล์ log เหตุการณ์ |
| REMOTETIER_SCREEN | ~/.remotetier-screen.log | ภาพจอ TUI ล่าสุด (เขียนทับทุกรอบ) |

## กลไก 2 ชั้น
- `claude remote-control` ต้องมี TTY: macOS/Linux ห่อด้วย `script` (จอจำลอง) + stdin ค้างจาก `tail -f /dev/null`
- ชั้นใน: `remotetier.sh` / `.ps1` วนเปิดใหม่ทุกครั้งที่ process จบ (2 วิ, ถ้าล้มเร็วซ้ำถอยสูงสุด 60 วิ)
- ชั้นนอก: launchd `KeepAlive` / systemd `Restart=always` / Task Scheduler `RestartCount` เปิดตัว watchdog เองเมื่อล็อกอินหรือถ้า watchdog ตาย

## ตรวจ / หยุด
- macOS: `launchctl print gui/$(id -u)/com.remotetier.agent` · หยุด `launchctl bootout gui/$(id -u) ~/Library/LaunchAgents/com.remotetier.agent.plist`
- Linux: `systemctl --user status remotetier` · หยุด `systemctl --user disable --now remotetier`
- Windows: `Get-ScheduledTask remotetier` · หยุด `Unregister-ScheduledTask remotetier -Confirm:$false`
