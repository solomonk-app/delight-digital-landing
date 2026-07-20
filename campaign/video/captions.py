"""Build a styled .ass subtitle (burned in by ffmpeg).

Captions sit in the lower third inside a soft translucent espresso pill so they
read on both cream and dark cards. Timing comes from ElevenLabs word timestamps
when available; otherwise chunks are distributed evenly across the audio.
"""
from __future__ import annotations

MAX_CHARS = 26          # per caption line (short, reel-friendly)
MAX_WORDS = 4

# ASS colours are &HAABBGGRR (AA: 00 opaque .. FF transparent)
CREAM = "&H00D6E4EC"          # #ECE4D6 text, opaque
BOX = "&H3820232B"            # #2B2320 espresso, ~78% opaque (pill)


def _chunks_from_words(words):
    chunks, cur, n = [], [], 0
    for w in words:
        txt = w["word"]
        joined = " ".join([*[c["word"] for c in cur], txt])
        if cur and (len(joined) > MAX_CHARS or n >= MAX_WORDS):
            chunks.append(cur); cur, n = [], 0
        cur.append(w); n += 1
    if cur:
        chunks.append(cur)
    out = []
    for c in chunks:
        out.append({"text": " ".join(w["word"] for w in c),
                    "start": c[0]["start"], "end": c[-1]["end"]})
    return out


def _chunks_from_text(text, duration):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if cur and (len(trial) > MAX_CHARS or len(cur.split()) >= MAX_WORDS):
            lines.append(cur); cur = w
        else:
            cur = trial
    if cur:
        lines.append(cur)
    n = max(1, len(lines))
    step = duration / n
    return [{"text": t, "start": i * step, "end": (i + 1) * step}
            for i, t in enumerate(lines)]


def _t(sec: float) -> str:
    if sec < 0:
        sec = 0
    h = int(sec // 3600); m = int((sec % 3600) // 60)
    s = sec % 60
    return f"{h:d}:{m:02d}:{s:05.2f}"


def _esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace("{", "(").replace("}", ")").replace("\n", " ")


def timed_chunks(words, full_text, duration):
    """Return [{text, start, end}] for burning captions frame-by-frame (Pillow)."""
    chunks = _chunks_from_words(words) if words else _chunks_from_text(full_text, duration)
    if chunks:
        chunks[-1]["end"] = max(chunks[-1]["end"], duration - 0.05)
    return chunks


def build_ass(words, full_text, duration, ass_path):
    chunks = _chunks_from_words(words) if words else _chunks_from_text(full_text, duration)
    # clamp last chunk to the audio end
    if chunks:
        chunks[-1]["end"] = max(chunks[-1]["end"], duration - 0.05)
    header = f"""[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Cap, Inter, 56, {CREAM}, {CREAM}, {BOX}, {BOX}, 0, 0, 0, 0, 100, 100, 0, 0, 3, 18, 0, 2, 90, 90, 360, 1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    lines = [header]
    for c in chunks:
        lines.append(
            f"Dialogue: 0,{_t(c['start'])},{_t(c['end'])},Cap,,0,0,0,,{_esc(c['text'])}"
        )
    with open(ass_path, "w") as f:
        f.write("\n".join(lines) + "\n")
    return ass_path
