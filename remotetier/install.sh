#!/usr/bin/env bash
# ติดตั้ง remotetier บน macOS (launchd) หรือ Linux (systemd --user)
set -e
SRC="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "$HOME/.remotetier"
cp "$SRC/remotetier.sh" "$HOME/.remotetier/" && chmod +x "$HOME/.remotetier/remotetier.sh"
# บันทึกค่าตั้งลงไฟล์ (launchd/systemd ไม่เห็น env ของเชลล์นี้)
{
  [ -n "${REMOTETIER_DIR:-}" ]  && printf 'REMOTETIER_DIR=%q\n'  "$REMOTETIER_DIR"
  [ -n "${REMOTETIER_ARGS:-}" ] && printf 'REMOTETIER_ARGS=%q\n' "$REMOTETIER_ARGS"
  [ -n "${REMOTETIER_LOG:-}" ]  && printf 'REMOTETIER_LOG=%q\n'  "$REMOTETIER_LOG"
  true
} > "$HOME/.remotetier/env"
case "$(uname)" in
  Darwin)
    P="$HOME/Library/LaunchAgents/com.remotetier.agent.plist"
    cp "$SRC/com.remotetier.agent.plist" "$P"
    launchctl bootout "gui/$(id -u)" "$P" 2>/dev/null || true
    launchctl bootstrap "gui/$(id -u)" "$P"
    echo "remotetier ทำงานแล้ว (launchd, เปิดเองเมื่อล็อกอิน/หลุด)";;
  Linux)
    mkdir -p "$HOME/.config/systemd/user"
    cp "$SRC/remotetier.service" "$HOME/.config/systemd/user/"
    systemctl --user daemon-reload
    systemctl --user enable --now remotetier.service
    loginctl enable-linger "$USER" 2>/dev/null || true
    echo "remotetier ทำงานแล้ว (systemd --user, Restart=always)";;
  *) echo "ระบบนี้ไม่รองรับ ใช้ install-windows.ps1 บน Windows"; exit 1;;
esac
echo "log: $HOME/.remotetier.log"
