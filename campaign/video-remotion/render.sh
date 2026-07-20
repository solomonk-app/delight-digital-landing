#!/usr/bin/env bash
# Render Week-1 videos with Remotion -> out/Day0X.mp4
# Usage: ./render.sh            (all 5)
#        ./render.sh Day03      (one)
set -euo pipefail
cd "$(dirname "$0")"
# No args = every day in days.json; otherwise the ids you pass.
IDS="$*"
[ -z "$IDS" ] && IDS=$(python3 -c "import json;print(' '.join(d['id'] for d in json.load(open('src/days.json'))))")
for id in $IDS; do
  echo "=== $id ==="
  npx remotion render "$id" "out/$id.mp4" --log=error
done
echo "--- done -> out/ ---"
