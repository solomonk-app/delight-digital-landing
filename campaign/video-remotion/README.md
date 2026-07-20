# Video pipeline (Remotion) — bold, kinetic short-form videos

React/Remotion pipeline for the Delight Digital campaign videos. Renders 1080×1920
MP4s with kinetic type, a live-typing chat UI, staggered chips, and **word-by-word
captions synced to the ElevenLabs voiceover**. Uses the brand palette/fonts, tuned
darker and punchier than the print/editorial look.

## Setup
```bash
npm install                 # already done
```
Add your ElevenLabs key to `../../.dev.vars` (git-ignored):
```
ELEVENLABS_API_KEY=...
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
```
Model + settings live in `../video/tts.py` (eleven_multilingual_v2; stability 0.55,
similarity 0.75, style 0.25). Verify the model id there if generation errors.

## Produce Week 1
```bash
./sync-audio.sh             # ElevenLabs voice + word timestamps -> public/
./render.sh                 # all 5 -> out/Day01.mp4 … Day05.mp4
./render.sh Day03           # just one
npm run studio              # live preview / tweak in the browser
```
`sync-audio.sh` reads the VO from `../video/manifests/day-0X.json` (single source of
truth for voiceover text) and writes `public/day-0X.mp3` + `.words.json`.

## How it's built
- `src/manifests.ts` — per-day scene list (`DAYS`). This is what you edit to add/adjust videos.
- `src/scenes.tsx` — the scene components: `Kinetic` (big type), `Chat` (typed prompt +
  streamed answer, `[brackets]` in terracotta), `Chips` (pill grid | numbered reveal),
  `InputBox` (blank-box typing), `EndCard`, plus `Captions` (word-by-word from real timestamps).
- `src/DailyVideo.tsx` — generic composition; lays scenes out by weight, scaled to the audio length.
- `src/Root.tsx` — registers Day01–Day05; `calculateMetadata` fetches the words file and sets
  the duration from the audio.
- `src/theme.ts`, `src/fonts.ts` — brand tokens + Instrument Serif / Inter / JetBrains Mono.

## Add Days 6–30
1. Add the VO to `../video/manifests/day-06.json` (or wherever your script text lives).
2. Add a `DayDef` to `DAYS` in `manifests.ts` (scenes: kinetic / chat / chips / input / end,
   each with a `w` weight — weights auto-scale to the voice length).
3. `./sync-audio.sh` (extend the loop to the new day) then `./render.sh Day06`.

## Notes
- Captions use ElevenLabs per-word timestamps → frame-accurate. No prices/model names appear.
- `out/`, `public/*.mp3|*.words.json`, and `node_modules/` are git-ignored (generated).
- Scene text avoids emoji (headless Chromium may not have the glyphs) — use SVG/markup instead.
