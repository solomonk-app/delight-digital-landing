"""Brand tokens, fonts and layout helpers for the Delight Digital video pipeline.

Colours and type mirror the funnel (`tailwind.config.ts` book.* + `app/layout.tsx`)
and the PDFs, so videos read as one system with the site.
"""
from __future__ import annotations
import os
from functools import lru_cache
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
FONT_DIR = os.path.join(HERE, "fonts")

# Vertical short-form canvas.
W, H = 1080, 1920
MARGIN = 110                      # left/right text margin
TOP_SAFE = 70
BOTTOM_SAFE = int(H * 0.16)       # keep content above the platform UI zone
CONTENT_W = W - 2 * MARGIN

# --- Palette (RGB) — from tailwind book.* -----------------------------------
PAPER = (0xF2, 0xEE, 0xE6)        # cream page
CREAM = (0xF5, 0xF1, 0xEA)        # raised card
ESPRESSO = (0x2B, 0x23, 0x20)     # dark sections / prompt boxes
INK = (0x2A, 0x25, 0x20)          # body text on cream
STONE = (0x7A, 0x72, 0x67)        # muted text
TERRA = (0xC9, 0x7A, 0x57)        # signature accent
ROSE = (0xB8, 0x74, 0x4A)         # accent hover
LINE = (0xE2, 0xDA, 0xCB)         # hairline on cream
LINED = (0x3A, 0x32, 0x2C)        # hairline on espresso
CREAM_ON_DARK = (0xEC, 0xE4, 0xD6)
CREAM_DIM = (0xB8, 0xAE, 0x9E)    # muted text on espresso

FONTS = {
    "serif": "InstrumentSerif-Regular.ttf",
    "serif_italic": "InstrumentSerif-Italic.ttf",
    "mono": "JetBrainsMono.ttf",
    "sans": "Inter.ttf",
}


@lru_cache(maxsize=256)
def font(role: str, size: int, weight: int | None = None) -> ImageFont.FreeTypeFont:
    f = ImageFont.truetype(os.path.join(FONT_DIR, FONTS[role]), size)
    if weight is not None:
        try:
            f.set_variation_by_axes([weight])  # variable fonts (Inter, JetBrains Mono)
        except Exception:
            pass
    return f


def new_canvas(dark: bool = False, glow: bool = True) -> Image.Image:
    """Base 1080x1920 canvas in cream or espresso, with a barely-there warm glow."""
    bg = ESPRESSO if dark else PAPER
    img = Image.new("RGB", (W, H), bg)
    if glow:
        # Cheap radial: render tiny, upscale smooth. Terracotta warmth, top area.
        sw, sh = 96, 170
        small = Image.new("RGB", (sw, sh), bg)
        px = small.load()
        cx, cy = sw * 0.32, sh * 0.12
        maxd = (sw ** 2 + sh ** 2) ** 0.5
        gr, gg, gb = (TERRA if not dark else (60, 44, 36))
        strength = 0.05 if not dark else 0.10
        for y in range(sh):
            for x in range(sw):
                d = ((x - cx) ** 2 + (y - cy) ** 2) ** 0.5 / maxd
                t = max(0.0, 1.0 - d * 1.7) * strength
                r, g, b = px[x, y]
                px[x, y] = (
                    int(r + (gr - r) * t),
                    int(g + (gg - g) * t),
                    int(b + (gb - b) * t),
                )
        img = small.resize((W, H), Image.BICUBIC)
    return img


def wrap(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.FreeTypeFont,
         max_w: int) -> list[str]:
    """Word-wrap text to a pixel width. Respects explicit newlines."""
    lines: list[str] = []
    for para in text.split("\n"):
        words = para.split(" ")
        cur = ""
        for wd in words:
            trial = (cur + " " + wd).strip()
            if draw.textlength(trial, font=fnt) <= max_w or not cur:
                cur = trial
            else:
                lines.append(cur)
                cur = wd
        lines.append(cur)
    return lines


def line_height(fnt: ImageFont.FreeTypeFont, factor: float = 1.18) -> int:
    asc, desc = fnt.getmetrics()
    return int((asc + desc) * factor)


def draw_block(draw, x, y, lines, fnt, fill, max_w=None, align="left",
               leading=1.18, anchor_x="left"):
    """Draw pre-wrapped lines; returns the y after the block."""
    lh = line_height(fnt, leading)
    for ln in lines:
        if anchor_x == "center":
            tw = draw.textlength(ln, font=fnt)
            draw.text((x - tw / 2, y), ln, font=fnt, fill=fill)
        else:
            draw.text((x, y), ln, font=fnt, fill=fill)
        y += lh
    return y


def measure_block(draw, lines, fnt, leading=1.18) -> int:
    return line_height(fnt, leading) * len(lines)
