#!/usr/bin/env bash
# Fetch the brand fonts (free, OFL-licensed) from Google Fonts into ./fonts.
# These match the funnel + PDFs: Instrument Serif (display), JetBrains Mono
# (labels/prompts), Inter (body). Re-run any time; it skips files already present.
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p fonts
RAW="https://raw.githubusercontent.com/google/fonts/main"

fetch () { # url  dest
  local url="$1" dest="fonts/$2"
  if [ -s "$dest" ]; then echo "have  $2"; return; fi
  echo "get   $2"
  curl -fsSL "$url" -o "$dest"
}

fetch "$RAW/ofl/instrumentserif/InstrumentSerif-Regular.ttf" "InstrumentSerif-Regular.ttf"
fetch "$RAW/ofl/instrumentserif/InstrumentSerif-Italic.ttf"  "InstrumentSerif-Italic.ttf"
fetch "$RAW/ofl/jetbrainsmono/JetBrainsMono%5Bwght%5D.ttf"   "JetBrainsMono.ttf"
fetch "$RAW/ofl/inter/Inter%5Bopsz,wght%5D.ttf"              "Inter.ttf"

echo "--- fonts ready ---"
ls -la fonts
