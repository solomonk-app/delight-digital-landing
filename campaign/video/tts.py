"""Voiceover generation.

Primary: ElevenLabs text-to-speech *with timestamps* (for synced captions).
Fallback: macOS `say` (free, offline) for previewing the pipeline end-to-end
before an ElevenLabs key/voice is chosen.

Credentials are read from ../../.dev.vars (git-ignored), same as the MailerLite keys:
    ELEVENLABS_API_KEY=...
    ELEVENLABS_VOICE_ID=...     # optional; defaults to a warm preset voice
"""
from __future__ import annotations
import base64
import json
import os
import subprocess
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
DEV_VARS = os.path.abspath(os.path.join(HERE, "..", "..", ".dev.vars"))

# A warm, calm default (ElevenLabs preset "Rachel"). Swap via ELEVENLABS_VOICE_ID.
DEFAULT_VOICE = "21m00Tcm4TlvDq8ikWAM"
MODEL_ID = "eleven_multilingual_v2"  # verify current model ids if this errors
SAY_VOICE = "Samantha"               # macOS preview voice


def _load_dev_vars() -> dict:
    env = {}
    if os.path.exists(DEV_VARS):
        for line in open(DEV_VARS):
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                env[k.strip()] = v.strip()
    return env


def _chars_to_words(chars, starts, ends):
    """Group per-character alignment into word tokens with start/end seconds."""
    words, cur, w_start = [], "", None
    for ch, st, en in zip(chars, starts, ends):
        if ch == " ":
            if cur:
                words.append({"word": cur, "start": w_start, "end": prev_end})
                cur = ""
            continue
        if not cur:
            w_start = st
        cur += ch
        prev_end = en
    if cur:
        words.append({"word": cur, "start": w_start, "end": prev_end})
    return words


def elevenlabs(text: str, mp3_path: str, words_path: str) -> bool:
    env = _load_dev_vars()
    key = env.get("ELEVENLABS_API_KEY") or os.environ.get("ELEVENLABS_API_KEY")
    if not key:
        return False
    voice = env.get("ELEVENLABS_VOICE_ID") or os.environ.get("ELEVENLABS_VOICE_ID") or DEFAULT_VOICE
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice}/with-timestamps"
    body = json.dumps({
        "text": text,
        "model_id": MODEL_ID,
        "voice_settings": {"stability": 0.55, "similarity_boost": 0.75,
                           "style": 0.25, "use_speaker_boost": True},
    }).encode()
    req = urllib.request.Request(url, data=body, headers={
        "xi-api-key": key, "Content-Type": "application/json", "Accept": "application/json",
    })
    with urllib.request.urlopen(req, timeout=120) as r:
        data = json.load(r)
    with open(mp3_path, "wb") as f:
        f.write(base64.b64decode(data["audio_base64"]))
    al = data.get("alignment") or data.get("normalized_alignment") or {}
    words = _chars_to_words(al.get("characters", []),
                            al.get("character_start_times_seconds", []),
                            al.get("character_end_times_seconds", []))
    json.dump(words, open(words_path, "w"))
    return True


def say_fallback(text: str, mp3_path: str, words_path: str):
    aiff = mp3_path.replace(".mp3", ".aiff")
    subprocess.run(["say", "-v", SAY_VOICE, "-o", aiff, text], check=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", aiff,
                    "-codec:a", "libmp3lame", "-qscale:a", "3", mp3_path], check=True)
    os.remove(aiff)
    json.dump([], open(words_path, "w"))  # no timestamps -> captions distribute evenly


def generate(text: str, mp3_path: str, words_path: str, prefer_say=False) -> str:
    os.makedirs(os.path.dirname(mp3_path), exist_ok=True)
    if not prefer_say:
        try:
            if elevenlabs(text, mp3_path, words_path):
                return "elevenlabs"
        except Exception as e:
            print(f"  [tts] ElevenLabs failed ({e}); falling back to macOS say")
    say_fallback(text, mp3_path, words_path)
    return "say"


if __name__ == "__main__":
    import sys
    txt = sys.argv[1] if len(sys.argv) > 1 else "This is a quick voiceover test."
    src = generate(txt, os.path.join(HERE, "out", "audio", "_test.mp3"),
                   os.path.join(HERE, "out", "audio", "_test.words.json"),
                   prefer_say="--say" in sys.argv)
    print("generated via:", src)
