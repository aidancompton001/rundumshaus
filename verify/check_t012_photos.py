# -*- coding: utf-8 -*-
"""T012 Ф2: фото Entkernung на диске, без EXIF/XMP/ICC, ширины вариантов точные.

Печатает 1 при успехе, 0 при провале. Таблица размеров — в stderr при провале
или с флагом -v (verify.py склеивает stdout и stderr, поэтому по умолчанию молчит).
"""
import os
import sys
from PIL import Image

D = os.path.join(os.path.dirname(__file__), "..", "site", "public", "images", "services")
WIDTHS = {"": None, "-400w": 400, "-800w": 800, "-1200w": 1200}

ok = True
lines = []
for base in ("entkernung-hero", "entkernung-card"):
    for suf, want_w in WIDTHS.items():
        name = base + suf + ".webp"
        p = os.path.join(D, name)
        if not os.path.exists(p):
            lines.append("MISSING " + name)
            ok = False
            continue
        im = Image.open(p)
        meta = [k for k in ("exif", "xmp", "icc_profile") if im.info.get(k)]
        if len(im.getexif()):
            meta.append("exif-tags")
        bad = bool(meta) or (want_w is not None and im.size[0] != want_w)
        lines.append("%-28s %4dx%-4d %4d KB meta=%s %s" % (
            name, im.size[0], im.size[1], os.path.getsize(p) // 1024, meta, "BAD" if bad else "ok"))
        ok = ok and not bad

if not ok or "-v" in sys.argv:
    print("\n".join(lines), file=sys.stderr)
print(1 if ok else 0)
