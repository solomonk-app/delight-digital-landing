#!/usr/bin/env bash
# Render Week-1 videos (Days 1-5) -> out/day-01.mp4 .. day-05.mp4
# Pass --say for the free offline preview voice:  ./build_week1.sh --say
set -euo pipefail
cd "$(dirname "$0")"
[ -f fonts/Inter.ttf ] || ./setup_fonts.sh
for d in 1 2 3 4 5; do
  python3 build_day.py "$d" "$@"
done
echo "--- Week 1 built -> out/day-01.mp4 … day-05.mp4 ---"
