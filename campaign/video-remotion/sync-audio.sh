#!/usr/bin/env bash
# Regenerate ElevenLabs voice + word timestamps for Days 1-5 and stage them in public/.
# Needs ELEVENLABS_API_KEY in ../../.dev.vars. VO text comes from ../video/manifests/day-0X.json.
set -euo pipefail
cd "$(dirname "$0")"
python3 - <<'PY'
import json, sys
sys.path.insert(0, "../video")
import tts
for d in range(1, 6):
    m = json.load(open(f"../video/manifests/day-0{d}.json"))
    src = tts.generate(m["vo"], f"../video/out/audio/day-0{d}.mp3",
                       f"../video/out/audio/day-0{d}.words.json", prefer_say=False)
    print(f"day-0{d}: {src}")
PY
for d in 01 02 03 04 05; do
  cp "../video/out/audio/day-$d.mp3" "public/day-$d.mp3"
  cp "../video/out/audio/day-$d.words.json" "public/day-$d.words.json"
done
echo "--- audio + timestamps staged in public/ ---"
