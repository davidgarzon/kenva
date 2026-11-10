"""Regenerate og.png (1200x630) and linkedin-cover.png (1128x191).

Run from the repository root: python3 scripts/gen_og.py
Requires Pillow and the Liberation Sans fonts.
"""
import math
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

CLAIM = "Embedded product and technology leadership"

ROOT = Path(__file__).resolve().parent.parent
FONT_DIR = Path("/usr/share/fonts/truetype/liberation")
BOLD = FONT_DIR / "LiberationSans-Bold.ttf"
REGULAR = FONT_DIR / "LiberationSans-Regular.ttf"

BG = (5, 5, 8)
GRID = (19, 19, 22)
WHITE = (240, 240, 245)
INDIGO = (99, 102, 241)
PURPLE = (168, 85, 247)
GREY = (139, 139, 144)


def glow(size, center, radius, color, strength):
    layer = Image.new("RGB", size, (0, 0, 0))
    d = ImageDraw.Draw(layer)
    cx, cy = center
    d.ellipse((cx - radius, cy - radius, cx + radius, cy + radius),
              fill=tuple(int(c * strength) for c in color))
    return layer.filter(ImageFilter.GaussianBlur(radius * 0.6))


def background(size, glows):
    img = Image.new("RGB", size, BG)
    for g in glows:
        img = ImageChops.lighter(img, glow(size, *g))
    d = ImageDraw.Draw(img)
    w, h = size
    for x in range(0, w, 60):
        d.line((x, 0, x, h), fill=GRID)
    for y in range(0, h, 60):
        d.line((0, y, w, y), fill=GRID)
    return img


def hexagon(d, cx, cy, r, width):
    pts = [(cx + r * math.cos(math.radians(a)), cy + r * math.sin(math.radians(a)))
           for a in range(-90, 270, 60)]
    d.polygon(pts, outline=INDIGO, width=width)
    inner = [(cx + 0.55 * r * math.cos(math.radians(a)), cy + 0.55 * r * math.sin(math.radians(a)))
             for a in range(-90, 270, 60)]
    d.polygon(inner, outline=(40, 40, 70), width=1)
    for a in (-90, 150, 30):
        d.line((cx, cy, cx + 0.55 * r * math.cos(math.radians(a)),
                cy + 0.55 * r * math.sin(math.radians(a))), fill=(40, 40, 70), width=1)
    dot = r * 0.16
    d.ellipse((cx - dot, cy - dot, cx + dot, cy + dot), fill=INDIGO)


def gradient_line(img, x0, y, length, thickness):
    d = ImageDraw.Draw(img)
    for i in range(length):
        t = i / length
        col = tuple(int(INDIGO[k] + (PURPLE[k] - INDIGO[k]) * t) for k in range(3))
        fade = 1 - t
        bg = img.getpixel((x0 + i, y))
        col = tuple(int(bg[k] + (col[k] - bg[k]) * fade) for k in range(3))
        d.line((x0 + i, y, x0 + i, y + thickness - 1), fill=col)


def wordmark(d, x, y, size):
    font = ImageFont.truetype(str(BOLD), size)
    d.text((x, y), "Kenva", font=font, fill=WHITE)
    w = d.textlength("Kenva ", font=font)
    d.text((x + w, y), "Labs", font=font, fill=INDIGO)


def og():
    size = (1200, 630)
    img = background(size, [((600, 0), 420, (30, 30, 80), 0.5),
                             ((1050, 280), 200, (40, 20, 60), 0.4)])
    d = ImageDraw.Draw(img)
    hexagon(d, 112, 295, 55, 2)
    wordmark(d, 196, 240, 86)
    claim_font = ImageFont.truetype(str(REGULAR), 40)
    d.text((196, 340), CLAIM, font=claim_font, fill=GREY)
    gradient_line(img, 196, 585, 600, 2)
    img.save(ROOT / "og.png", optimize=True)


def cover():
    size = (1128, 191)
    img = background(size, [((380, 95), 180, (30, 30, 80), 0.6)])
    d = ImageDraw.Draw(img)
    hexagon(d, 376, 95, 36, 2)
    wordmark(d, 432, 52, 56)
    claim_font = ImageFont.truetype(str(REGULAR), 25)
    d.text((432, 112), CLAIM, font=claim_font, fill=GREY)
    gradient_line(img, 432, 187, 480, 2)
    img.save(ROOT / "linkedin-cover.png", optimize=True)


if __name__ == "__main__":
    og()
    cover()
