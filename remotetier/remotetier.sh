#!/usr/bin/env bash
# remotetier — คุม `claude remote-control` ให้เปิดตลอด ถ้าหลุด/ปิด จะเปิดใหม่ทันที
# ใช้กับ macOS / Linux / WSL
set -u
WORKDIR="${REMOTETIER_DIR:-$HOME}"          # โฟลเดอร์ที่ให้มือถือเข้ามาทำงาน
EXTRA_ARGS="${REMOTETIER_ARGS:-}"           # อาร์กิวเมนต์เสริมของ claude remote-control
LOG="${REMOTETIER_LOG:-$HOME/.remotetier.log}"
export PATH="$HOME/.local/bin:$HOME/.npm-global/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:$PATH"

command -v claude >/dev/null || { echo "$(date '+%F %T') ไม่พบคำสั่ง claude" >>"$LOG"; exit 1; }
cd "$WORKDIR" || exit 1

delay=2
while true; do
  start=$(date +%s)
  echo "$(date '+%F %T') เริ่ม remote-control ใน $WORKDIR" >>"$LOG"
  # shellcheck disable=SC2086
  claude remote-control $EXTRA_ARGS </dev/null >>"$LOG" 2>&1
  code=$?
  echo "$(date '+%F %T') หลุด (exit $code) — เปิดใหม่ใน ${delay}s" >>"$LOG"
  # ถ้ารันได้นานกว่า 60 วิ ถือว่าปกติ รีเซ็ตดีเลย์; ถ้าล้มเร็วซ้ำ ๆ ค่อย ๆ ถอย (สูงสุด 60 วิ)
  if (( $(date +%s) - start > 60 )); then delay=2; else delay=$(( delay*2 > 60 ? 60 : delay*2 )); fi
  sleep "$delay"
done
