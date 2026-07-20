#!/usr/bin/env python3
"""Merge gen/b*.json (days 6-30) into src/days.json + voiceover.json, with validation."""
import json, glob, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))

VALID = {"kinetic", "chat", "chips", "input", "end"}
by_id = {d["id"]: d for d in json.load(open("src/days.json"))}  # keep days 1-5
vo = json.load(open("voiceover.json"))

for f in sorted(glob.glob("gen/b*.json")):
    b = json.load(open(f))
    for d in b["days"]:
        by_id[d["id"]] = d
    vo.update(b["vo"])
    print(f"merged {f}: {[d['id'] for d in b['days']]}")

days = [by_id[f"Day{n:02d}"] for n in range(1, 31) if f"Day{n:02d}" in by_id]

# validate
errs = []
for d in days:
    scenes = d.get("scenes", [])
    if not scenes or scenes[-1]["type"] != "end":
        errs.append(f"{d['id']}: last scene not 'end'")
    for s in scenes:
        if s.get("type") not in VALID:
            errs.append(f"{d['id']}: bad scene type {s.get('type')}")
        if "w" not in s:
            errs.append(f"{d['id']}: scene missing weight")
    for k in ("id", "audio", "wordsFile", "cta"):
        if not d.get(k):
            errs.append(f"{d['id']}: missing {k}")
    if d["id"] not in vo:
        errs.append(f"{d['id']}: no voiceover text")
if errs:
    print("VALIDATION ERRORS:")
    for e in errs:
        print("  -", e)
    raise SystemExit(1)

json.dump(days, open("src/days.json", "w"), ensure_ascii=False, indent=2)
json.dump(vo, open("voiceover.json", "w"), ensure_ascii=False, indent=1)
print(f"OK — {len(days)} days, {len(vo)} voiceovers")
