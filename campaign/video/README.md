# Video pipeline — faceless, on-brand short-form videos

Turns a per-day manifest + the script voiceover into a 1080×1920 MP4, in the
Delight Digital brand (cream / espresso / terracotta, Instrument Serif + JetBrains
Mono + Inter). Everything is local and free except the ElevenLabs voiceover.

```
render branded cards (Pillow)  →  voiceover (ElevenLabs)  →  ffmpeg assemble
   Ken-Burns · reveals · crossfades · burned-in captions        → out/day-XX.mp4
```

## One-time setup
```bash
./setup_fonts.sh                    # fetches the 3 brand fonts (free, OFL)
```
Requires: `python3` + Pillow, `ffmpeg`, `curl` (all already on this machine).

## Voiceover key (ElevenLabs)
Add to `../../.dev.vars` (git-ignored, same file as the MailerLite keys):
```
ELEVENLABS_API_KEY=sk_...
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM   # optional; default is a warm preset ("Rachel")
```
Pick any voice from your ElevenLabs Voices page and paste its Voice ID.
Note: the free tier is ~10k characters/month — Week 1 (~3k) fits; all 30 (~18k)
may need a paid tier or spreading across months. Verify the current model id in
`tts.py` (`MODEL_ID`) if generation errors.

## Render
```bash
./build_week1.sh            # Days 1–5 with ElevenLabs voice
./build_week1.sh --say      # free offline preview voice (macOS `say`) — no key needed
python3 build_day.py 3      # a single day
```
Output: `out/day-01.mp4 … day-05.mp4`.

## How it fits together
- `brand.py` — palette, fonts, layout (mirrors `tailwind.config.ts` + `app/layout.tsx`).
- `cards.py` — Pillow renderers: headline, checklist, prompt (dark box, `[brackets]`
  in terracotta), mock-chat, input box, end card, and the burned-in caption pill.
- `tts.py` — ElevenLabs TTS *with word timestamps* (for synced captions); falls back
  to macOS `say` with `--say`.
- `captions.py` — groups the VO into timed caption chunks.
- `build_day.py` — renders every frame (Ken-Burns, typewriter/checklist reveals,
  crossfades, captions), then ffmpeg muxes audio + gentle fades → MP4.
- `manifests/day-XX.json` — the beats + VO for each video.

## Add Days 6–30
1. Copy a manifest, e.g. `manifests/day-06.json`.
2. Set `cta`, `vo` (from `../scripts/day-06.md`), and `beats` (choose beat types:
   `headline`, `text`, `checklist`, `prompt` (`type_anim` for typewriter),
   `mock_chat`, `input`, `end`). `sec` values are relative — they auto-scale to the VO.
3. `python3 build_day.py 6`.

## Notes
- Captions are burned into frames (this ffmpeg has no libass) — style lives in
  `cards.draw_caption`.
- Keep videos free of prices / model names (brand-safety rule); Week 1 already is.
- `out/` and `fonts/` are git-ignored (generated binaries).
