"""Pillow card renderers -> 1080x1920 PIL Images, in the Delight Digital brand.

Text conventions (manifest-friendly):
  *word*  -> terracotta italic serif accent (headline cards)
  [text]  -> terracotta brackets (prompt cards)
  \n      -> explicit line break (headlines are hand-broken, not auto-wrapped)
"""
from __future__ import annotations
import os
from PIL import Image, ImageDraw
import brand as B

OUT = os.path.join(B.HERE, "out")


# --- small helpers -----------------------------------------------------------
def _rich_segments(line: str):
    """Split '*accent*' markup -> [(text, is_accent), ...]."""
    segs, accent = [], False
    for part in line.split("*"):
        if part:
            segs.append((part, accent))
        accent = not accent
    return segs


def _draw_rich_center(draw, cx, y, line, size, dark):
    base_f = B.font("serif", size)
    acc_f = B.font("serif_italic", size)
    base_fill = B.CREAM_ON_DARK if dark else B.INK
    segs = _rich_segments(line)
    total = sum(draw.textlength(t, font=(acc_f if a else base_f)) for t, a in segs)
    x = cx - total / 2
    for t, a in segs:
        f = acc_f if a else base_f
        draw.text((x, y), t, font=f, fill=(B.TERRA if a else base_fill))
        x += draw.textlength(t, font=f)


def logo_dot(draw, cx, cy, r=26):
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=B.TERRA)
    # a small 4-point spark
    w = 3
    draw.line([cx, cy - r * 0.5, cx, cy + r * 0.5], fill=B.CREAM, width=w)
    draw.line([cx - r * 0.5, cy, cx + r * 0.5, cy], fill=B.CREAM, width=w)


def _eyebrow(draw, cx, y, text):
    f = B.font("mono", 30, weight=500)
    t = text.upper()
    # letter-spacing
    spaced = "  ".join(list(t)) if len(t) < 3 else t
    tw = draw.textlength(spaced, font=f)
    draw.text((cx - tw / 2, y), spaced, font=f, fill=B.TERRA)


# --- cards -------------------------------------------------------------------
def headline_card(text, size=118, dark=False, eyebrow=None, glow=True):
    """A calm one/two-line serif statement, vertically centred. Days 1 & 5 & titles."""
    img = B.new_canvas(dark=dark, glow=glow)
    d = ImageDraw.Draw(img)
    cx = B.W // 2
    lines = text.split("\n")
    lh = B.line_height(B.font("serif", size), 1.14)
    block_h = lh * len(lines)
    y = (B.H - block_h) // 2
    if eyebrow:
        _eyebrow(d, cx, y - 130, eyebrow)
    for ln in lines:
        _draw_rich_center(d, cx, y, ln, size, dark)
        y += lh
    return img


def checklist_card(title, items, revealed=None, dark=False):
    """Numbered list that builds. `revealed` = how many items to show (None=all)."""
    if revealed is None:
        revealed = len(items)
    img = B.new_canvas(dark=dark)
    d = ImageDraw.Draw(img)
    cx = B.W // 2
    title_f = B.font("serif", 92)
    tlines = title.split("\n")
    ty = 360
    for ln in tlines:
        _draw_rich_center(d, cx, ty, ln, 92, dark)
        ty += B.line_height(title_f, 1.12)

    num_f = B.font("serif", 76)
    lab_f = B.font("sans", 46, weight=500)
    row_h = 190
    y = ty + 90
    x_num = B.MARGIN + 6
    x_lab = B.MARGIN + 130
    for i, label in enumerate(items):
        if i >= revealed:
            break
        d.text((x_num, y - 6), str(i + 1), font=num_f, fill=B.TERRA)
        # label may wrap
        for j, ln in enumerate(B.wrap(d, label, lab_f, B.CONTENT_W - 150)):
            d.text((x_lab, y + j * B.line_height(lab_f, 1.15)), ln, font=lab_f,
                   fill=(B.CREAM_ON_DARK if dark else B.INK))
        y += row_h
    return img


def _draw_mono_prompt(d, x, y, text, size, max_w, reveal, dark_card=True):
    """Monospace prompt text; [brackets] in terracotta; typewriter via `reveal`."""
    f = B.font("mono", size, weight=500)
    cw = d.textlength("M", font=f)
    lh = int(size * 1.5)
    base = B.CREAM_ON_DARK
    # word-wrap while tracking bracket state per character
    shown = 0
    in_br = False
    limit = len(text) if reveal is None else reveal
    words = []
    cur = ""
    for ch in text:
        cur += ch
        if ch == " ":
            words.append(cur); cur = ""
    if cur:
        words.append(cur)
    cxp = x
    yy = y
    idx = 0
    cursor_pos = None
    for word in words:
        wpx = len(word) * cw
        if cxp + wpx > x + max_w and cxp > x:
            cxp = x; yy += lh
        for ch in word:
            if idx >= limit:
                cursor_pos = (cxp, yy)
                break
            if ch == "[":
                in_br = True
            fill = B.TERRA if in_br else base
            if ch not in (" ",):
                d.text((cxp, yy), ch, font=f, fill=fill)
            if ch == "]":
                in_br = False
            cxp += cw
            idx += 1
        if cursor_pos:
            break
    if reveal is not None and cursor_pos:
        cxp, yy = cursor_pos
        d.rectangle([cxp, yy + 6, cxp + max(6, cw * 0.55), yy + lh - 10], fill=B.TERRA)
    return yy + lh


def prompt_card(prompt, variant="neutral", reveal=None, label=None):
    """Cream canvas with a dark prompt box; optional ✗/✓ tag; typewriter via reveal."""
    img = B.new_canvas(dark=False)
    d = ImageDraw.Draw(img)
    cx = B.W // 2
    tag = {"bad": ("DON’T", B.ROSE), "good": ("TRY", B.TERRA)}.get(variant)
    box_x0, box_x1 = B.MARGIN, B.W - B.MARGIN
    box_y0 = 640
    pad = 60
    # estimate height from wrapped mono lines
    f = B.font("mono", 44, weight=500)
    cw = d.textlength("M", font=f)
    approx_cols = int((box_x1 - box_x0 - 2 * pad) / cw)
    n_lines = max(1, -(-len(prompt) // max(10, approx_cols)))
    box_h = 2 * pad + n_lines * int(44 * 1.5)
    if tag:
        tf = B.font("mono", 34, weight=600)
        ttxt = tag[0]
        tw = d.textlength(ttxt, font=tf)
        d.rounded_rectangle([cx - tw / 2 - 26, box_y0 - 90, cx + tw / 2 + 26, box_y0 - 30],
                            radius=30, fill=tag[1])
        d.text((cx - tw / 2, box_y0 - 84), ttxt, font=tf, fill=B.PAPER)
    d.rounded_rectangle([box_x0, box_y0, box_x1, box_y0 + box_h], radius=44,
                        fill=B.ESPRESSO)
    _draw_mono_prompt(d, box_x0 + pad, box_y0 + pad, prompt, 44,
                      box_x1 - box_x0 - 2 * pad, reveal)
    if label:
        lf = B.font("sans", 42, weight=500)
        for j, ln in enumerate(B.wrap(d, label, lf, B.CONTENT_W)):
            lw = d.textlength(ln, font=lf)
            d.text((cx - lw / 2, box_y0 + box_h + 70 + j * 60), ln, font=lf, fill=B.STONE)
    return img


def mock_chat(prompt, answer, dark=False):
    """A minimal branded 'chat': the ask (dark mono bubble) + the answer (sans)."""
    img = B.new_canvas(dark=dark)
    d = ImageDraw.Draw(img)
    _eyebrow(d, B.W // 2, 300, "The answer")
    # ask bubble
    ax0, ax1, ay0 = B.MARGIN, B.W - B.MARGIN, 400
    af = B.font("mono", 40, weight=500)
    alines = B.wrap(d, prompt, af, ax1 - ax0 - 100)
    ah = 80 + len(alines) * int(40 * 1.5)
    d.rounded_rectangle([ax0, ay0, ax1, ay0 + ah], radius=40, fill=B.ESPRESSO)
    for j, ln in enumerate(alines):
        d.text((ax0 + 50, ay0 + 40 + j * int(40 * 1.5)), ln, font=af, fill=B.CREAM_ON_DARK)
    # answer
    yf = B.font("sans", 46, weight=400)
    yhead = B.font("sans", 46, weight=600)
    y = ay0 + ah + 90
    for para in answer.split("\n"):
        head = para.endswith("::")
        para = para.rstrip(":")
        fnt = yhead if head else yf
        for ln in B.wrap(d, para, fnt, B.CONTENT_W):
            d.text((B.MARGIN, y), ln, font=fnt, fill=(B.CREAM_ON_DARK if dark else B.INK))
            y += B.line_height(fnt, 1.28)
        y += 14
    return img


def input_box_card(typed="", cursor=True):
    """Day 5: a cream card with a rounded 'input box' + typed text + blinking cursor."""
    img = B.new_canvas(dark=False)
    d = ImageDraw.Draw(img)
    _eyebrow(d, B.W // 2, 720, "Type one real question")
    bx0, bx1 = B.MARGIN, B.W - B.MARGIN
    by0, by1 = 820, 1000
    d.rounded_rectangle([bx0, by0, bx1, by1], radius=40, outline=B.LINE, width=3,
                        fill=(255, 255, 255))
    f = B.font("mono", 44, weight=500)
    tx, ty = bx0 + 50, by0 + 58
    d.text((tx, ty), typed, font=f, fill=B.INK)
    if cursor:
        cxp = tx + d.textlength(typed, font=f) + 4
        d.rectangle([cxp, ty + 4, cxp + 6, ty + 58], fill=B.TERRA)
    return img


def end_card(cta, handle="guide.delightdigital.online"):
    img = B.new_canvas(dark=True)
    d = ImageDraw.Draw(img)
    cx = B.W // 2
    logo_dot(d, cx, 780, 30)
    wf = B.font("serif", 96)
    wtxt = "AI, Made Friendly"
    _draw_rich_center(d, cx, 850, "AI, Made *Friendly*", 96, dark=True)
    cf = B.font("sans", 46, weight=500)
    for j, ln in enumerate(B.wrap(d, cta, cf, B.CONTENT_W)):
        lw = d.textlength(ln, font=cf)
        d.text((cx - lw / 2, 1010 + j * B.line_height(cf, 1.3)), ln, font=cf,
               fill=B.CREAM_DIM)
    hf = B.font("mono", 34, weight=500)
    htxt = "→  " + handle
    hw = d.textlength(htxt, font=hf)
    d.text((cx - hw / 2, 1230), htxt, font=hf, fill=B.TERRA)
    return img


def draw_caption(img, text, y_center=1486):
    """Burn a caption into a frame: a soft translucent espresso pill + cream text,
    in the lower third, readable on both cream and dark cards."""
    if not text:
        return img
    pad_x, pad_y, radius = 46, 26, 30
    f = B.font("sans", 52, weight=600)
    d0 = ImageDraw.Draw(img)
    lines = B.wrap(d0, text, f, B.CONTENT_W - 2 * pad_x - 20)
    lh = B.line_height(f, 1.16)
    text_w = max(d0.textlength(ln, font=f) for ln in lines)
    block_h = lh * len(lines)
    cx = B.W // 2
    x0, x1 = cx - text_w / 2 - pad_x, cx + text_w / 2 + pad_x
    y0, y1 = y_center - block_h / 2 - pad_y, y_center + block_h / 2 + pad_y
    base = img.convert("RGBA")
    ov = Image.new("RGBA", img.size, (0, 0, 0, 0))
    do = ImageDraw.Draw(ov)
    do.rounded_rectangle([x0, y0, x1, y1], radius=radius, fill=(0x2B, 0x23, 0x20, 214))
    yy = y0 + pad_y
    for ln in lines:
        w = do.textlength(ln, font=f)
        do.text((cx - w / 2, yy), ln, font=f, fill=(0xEC, 0xE4, 0xD6, 255))
        yy += lh
    return Image.alpha_composite(base, ov).convert("RGB")


# --- self-test ---------------------------------------------------------------
if __name__ == "__main__":
    td = os.path.join(OUT, "frames", "_selftest")
    os.makedirs(td, exist_ok=True)
    samples = {
        "headline": headline_card("You’re not behind.\nYou’re just *beginning.*",
                                  eyebrow="AI, Made Friendly"),
        "text": headline_card("There are *no magic words.*", size=110),
        "checklist_full": checklist_card("The whole skill\n= *4 habits.*",
                                         ["Talk like a person", "Give it backstory",
                                          "Ask it to redo", "Verify what matters"]),
        "checklist_2": checklist_card("The whole skill\n= *4 habits.*",
                                      ["Talk like a person", "Give it backstory",
                                       "Ask it to redo", "Verify what matters"], revealed=2),
        "prompt_bad": prompt_card("Plan a workout.", variant="bad"),
        "prompt_good": prompt_card(
            "Act as a gentle physiotherapist. A 15-minute morning workout for "
            "someone at a desk with a sore lower back. A numbered list, one rest "
            "day, warm and reassuring.", variant="good"),
        "prompt_type": prompt_card(
            "I have [chicken, broccoli, rice, eggs] and about [30 min] to feed "
            "[a family of 4]. Suggest 3 simple dinners.", variant="good", reveal=48),
        "mock_chat": mock_chat(
            "I have [chicken, broccoli, rice, eggs]…",
            "1. Sheet-pan chicken + broccoli — 30 min, one tray.\n"
            "2. Rice bowls — leftover veg, an egg on top.\n"
            "3. Tomato pasta — pantry staples, done in 20.\n"
            "⭐ Start with #1 if you’re worn out."),
        "input_box": input_box_card("Explain this letter in plain English."),
        "end": end_card("Save this and try it today."),
    }
    for name, im in samples.items():
        p = os.path.join(td, f"{name}.png")
        im.save(p)
        print("wrote", p)
    print("done ->", td)
