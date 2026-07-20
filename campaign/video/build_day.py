"""Build one day's vertical MP4 from its manifest.

  render frames (Pillow: cards + Ken-Burns + reveal + crossfades)
  -> voiceover (ElevenLabs, or macOS `say` with --say)
  -> ffmpeg assemble (burn captions, mux audio) -> out/day-XX.mp4

Usage:
  python3 build_day.py 1            # ElevenLabs VO (needs key in ../../.dev.vars)
  python3 build_day.py 1 --say      # free offline preview voice
"""
from __future__ import annotations
import glob
import json
import os
import shutil
import subprocess
import sys
from PIL import Image
import brand as B
import cards
import tts
import captions

HERE = B.HERE
FPS = 30
TR = 0.35          # crossfade seconds
STATIC = {"headline", "text", "mock_chat", "end"}


def ffprobe_dur(path: str) -> float:
    out = subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "csv=p=0", path])
    return float(out.decode().strip())


def kenburns(img: Image.Image, p: float) -> Image.Image:
    p = max(0.0, min(1.0, p))
    z = 1.0 + 0.035 * p
    w, h = img.size
    cw, ch = int(w / z), int(h / z)
    x, y = (w - cw) // 2, (h - ch) // 2
    return img.crop((x, y, x + cw, y + ch)).resize((w, h), Image.BICUBIC)


class Video:
    def __init__(self, manifest):
        self.m = manifest
        self.beats = manifest["beats"]
        self.cta = manifest["cta"]
        self._base = {}      # static card cache
        self._anim = {}      # animated frame cache

    def _base_card(self, i):
        if i in self._base:
            return self._base[i]
        b = self.beats[i]
        t = b["type"]
        if t in ("headline", "text"):
            img = cards.headline_card(b["text"], size=b.get("size", 118),
                                      eyebrow=b.get("eyebrow"))
        elif t == "mock_chat":
            img = cards.mock_chat(b["prompt"], b["answer"])
        elif t == "end":
            img = cards.end_card(self.cta)
        elif t == "prompt":
            img = cards.prompt_card(b["text"], b.get("variant", "neutral"))
        else:
            img = B.new_canvas()
        self._base[i] = img
        return img

    def _cached(self, key, fn):
        if key not in self._anim:
            self._anim[key] = fn()
        return self._anim[key]

    def frame_at(self, i, tl, dur):
        b = self.beats[i]
        t = b["type"]
        if t in STATIC:
            return kenburns(self._base_card(i), tl / dur if dur else 0)
        if t == "prompt" and not b.get("type_anim"):
            return kenburns(self._base_card(i), tl / dur if dur else 0)
        if t == "checklist":
            items = b["items"]
            per = 0.6 * dur / max(1, len(items))
            count = min(len(items), 1 + int(tl / per)) if per else len(items)
            return self._cached((i, "cl", count),
                                lambda: cards.checklist_card(b["title"], items, revealed=count))
        if t == "prompt":
            total = len(b["text"])
            n = min(total, int((tl / (0.8 * dur)) * total)) if dur else total
            rev = None if n >= total else n
            return self._cached((i, "pr", rev if rev is not None else -1),
                                lambda: cards.prompt_card(b["text"], b.get("variant", "good"), reveal=rev))
        if t == "input":
            full = b["typed"]
            shown = min(len(full), int((tl / (0.6 * dur)) * len(full))) if dur else len(full)
            cur = int(tl * 2) % 2 == 0
            return self._cached((i, "in", shown, cur),
                                lambda: cards.input_box_card(full[:shown], cursor=cur))
        return self._base_card(i)


def build(day: int, prefer_say=False):
    tag = f"day-{day:02d}"
    manifest = json.load(open(os.path.join(HERE, "manifests", f"{tag}.json")))
    out = os.path.join(HERE, "out")
    os.makedirs(os.path.join(out, "audio"), exist_ok=True)
    frames_dir = os.path.join(out, "frames", tag)
    if os.path.isdir(frames_dir):
        shutil.rmtree(frames_dir)
    os.makedirs(frames_dir)

    # 1) Voiceover + duration
    mp3 = os.path.join(out, "audio", f"{tag}.mp3")
    words_json = os.path.join(out, "audio", f"{tag}.words.json")
    src = tts.generate(manifest["vo"], mp3, words_json, prefer_say=prefer_say)
    dur = ffprobe_dur(mp3)
    print(f"[{tag}] voice={src}  audio={dur:.2f}s")

    # 2) Scale beat seconds to the audio length; +0.4s tail on the end card
    tail = 0.4
    weights = [b["sec"] for b in manifest["beats"]]
    scale = (dur - tail) / sum(weights)
    durs = [w * scale for w in weights]
    durs[-1] += tail
    starts, acc = [], 0.0
    for d in durs:
        starts.append(acc); acc += d
    total = acc
    ends = [starts[i] + durs[i] for i in range(len(durs))]

    # 3) Captions (burned into frames by Pillow — this ffmpeg has no libass)
    words = json.load(open(words_json))
    chunks = captions.timed_chunks(words, manifest["vo"], total)

    def caption_at(tt):
        for c in chunks:
            if c["start"] <= tt < c["end"]:
                return c["text"]
        return ""

    # 4) Frames (single pass: cards + Ken-Burns + reveal + crossfades + captions)
    vid = Video(manifest)
    n_frames = int(round(total * FPS))
    last = len(manifest["beats"]) - 1
    for f in range(n_frames):
        t = f / FPS
        i = last
        for k in range(len(starts)):
            if t < ends[k]:
                i = k; break
        img = vid.frame_at(i, t - starts[i], durs[i])
        if i < last and t >= ends[i] - TR:
            prog = (t - (ends[i] - TR)) / TR
            nxt = vid.frame_at(i + 1, 0.0, durs[i + 1])
            img = Image.blend(img, nxt, max(0.0, min(1.0, prog)))
        img = cards.draw_caption(img, caption_at(t))
        img.save(os.path.join(frames_dir, f"{f + 1:05d}.png"))
    print(f"[{tag}] {n_frames} frames -> encoding")

    # 5) Encode: frames + audio (+ gentle fades; captions already burned in)
    mp4 = os.path.join(out, f"{tag}.mp4")
    vf = f"fade=t=in:st=0:d=0.4,fade=t=out:st={total - 0.4:.2f}:d=0.4"
    cmd = ["ffmpeg", "-y", "-loglevel", "error",
           "-framerate", str(FPS), "-i", f"out/frames/{tag}/%05d.png",
           "-i", f"out/audio/{tag}.mp3",
           "-vf", vf, "-c:v", "libx264", "-pix_fmt", "yuv420p",
           "-profile:v", "high", "-crf", "19", "-r", str(FPS),
           "-c:a", "aac", "-b:a", "160k", "-shortest", f"out/{tag}.mp4"]
    subprocess.run(cmd, cwd=HERE, check=True)
    shutil.rmtree(frames_dir)  # frames are large; keep only the mp4
    print(f"[{tag}] done -> {mp4}")
    return mp4


if __name__ == "__main__":
    days = [int(a) for a in sys.argv[1:] if a.isdigit()]
    say = "--say" in sys.argv
    for d in days or [1]:
        build(d, prefer_say=say)
