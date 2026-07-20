#!/usr/bin/env bash
# Render Week-1 videos with Remotion -> out/Day0X.mp4
# Usage: ./render.sh            (all 5)
#        ./render.sh Day03      (one)
set -euo pipefail
cd "$(dirname "$0")"
IDS="${*:-Day01 Day02 Day03 Day04 Day05}"
for id in $IDS; do
  echo "=== $id ==="
  npx remotion render "$id" "out/$id.mp4" --log=error
done
echo "--- done -> out/ ---"
