#!/usr/bin/env bash
# Regenerate ElevenLabs voice + word timestamps for Days 1-5 and stage them in public/.
# Needs ELEVENLABS_API_KEY in ../../.dev.vars. VO text comes from ../video/manifests/day-0X.json.
set -euo pipefail
cd "$(dirname "$0")"
# Args: day numbers to (re)generate, e.g. `./sync-audio.sh 6 7 8`. No args = all in voiceover.json.
python3 - "$@" <<'PY'
import json, sys, os
sys.path.insert(0, "../video")
import tts
vo = json.load(open("voiceover.json"))
want = set(int(a) for a in sys.argv[1:]) if len(sys.argv) > 1 else None
os.makedirs("../video/out/audio", exist_ok=True)
for day_id, text in sorted(vo.items()):
    n = int(day_id.replace("Day", ""))
    if want and n not in want:
        continue
    mp3 = f"../video/out/audio/day-{n:02d}.mp3"
    wj = f"../video/out/audio/day-{n:02d}.words.json"
    src = tts.generate(text, mp3, wj, prefer_say=False)
    words = len(json.load(open(wj)))
    print(f"day-{n:02d}: via={src}  words={words}")
    import shutil
    shutil.copy(mp3, f"public/day-{n:02d}.mp3")
    shutil.copy(wj, f"public/day-{n:02d}.words.json")
PY
echo "--- audio + timestamps staged in public/ ---"
