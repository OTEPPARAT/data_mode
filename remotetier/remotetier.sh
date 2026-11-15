#!/usr/bin/env bash
# remotetier — คุม `claude remote-control` ให้เปิดตลอด ถ้าหลุด/ปิด จะเปิดใหม่ทันที
# ใช้กับ macOS / Linux / WSL
set -u
# ค่าตั้งถาวร (install.sh เขียนไฟล์นี้ให้) — launchd/systemd ไม่ส่ง env ของเชลล์มาให้
[ -f "$HOME/.remotetier/env" ] && . "$HOME/.remotetier/env"
WORKDIR="${REMOTETIER_DIR:-$HOME}"          # โฟลเดอร์ที่ให้มือถือเข้ามาทำงาน (ต้อง trusted แล้ว)
EXTRA_ARGS="${REMOTETIER_ARGS:-}"           # อาร์กิวเมนต์เสริมของ claude remote-control
LOG="${REMOTETIER_LOG:-$HOME/.remotetier.log}"
SCREEN="${REMOTETIER_SCREEN:-$HOME/.remotetier-screen.log}"   # ภาพจอ TUI เขียนทับทุกรอบ ไม่ให้ log บวม
export PATH="$HOME/.local/bin:$HOME/.npm-global/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:$PATH"

command -v claude >/dev/null || { echo "$(date '+%F %T') ไม่พบคำสั่ง claude" >>"$LOG"; exit 1; }
cd "$WORKDIR" || { echo "$(date '+%F %T') เข้าโฟลเดอร์ $WORKDIR ไม่ได้" >>"$LOG"; exit 1; }

# remote-control ต้องมี TTY ไม่งั้นค้างตั้งแต่เริ่ม (launchd/systemd ไม่มี) → ห่อด้วย script (จอจำลอง)
# stdin ต่อจาก tail -f /dev/null เพื่อไม่ให้เจอ EOF (script จะส่ง ^D ให้ claude แล้วปิดตัว)
# ใช้ process substitution ไม่ใช่ pipe: ถ้าเป็น pipe bash จะรอ tail ด้วย และ loop จะไม่เปิดใหม่
run_rc() {
  if [ "$(uname)" = "Darwin" ]; then
    # shellcheck disable=SC2086
    script -q /dev/null claude remote-control $EXTRA_ARGS
  else
    script -q -e -c "claude remote-control $EXTRA_ARGS" /dev/null
  fi
}

delay=2
while true; do
  start=$(date +%s)
  echo "$(date '+%F %T') เริ่ม remote-control ใน $WORKDIR" >>"$LOG"
  run_rc < <(exec -a remotetier-stdin tail -f /dev/null) >"$SCREEN" 2>&1
  code=$?
  pkill -f '^remotetier-stdin' 2>/dev/null || true   # ปิดตัวป้อน stdin ของรอบนี้
  echo "$(date '+%F %T') หลุด (exit $code) — เปิดใหม่ใน ${delay}s" >>"$LOG"
  # ถ้ารันได้นานกว่า 60 วิ ถือว่าปกติ รีเซ็ตดีเลย์; ถ้าล้มเร็วซ้ำ ๆ ค่อย ๆ ถอย (สูงสุด 60 วิ)
  if (( $(date +%s) - start > 60 )); then delay=2; else delay=$(( delay*2 > 60 ? 60 : delay*2 )); fi
  sleep "$delay"
done
