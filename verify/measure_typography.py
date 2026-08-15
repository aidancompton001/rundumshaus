# -*- coding: utf-8 -*-
"""ЗАМЕР ТИПОГРАФИКИ МАКЕТА (T008 Ф2) — cap-height, а не bbox.

Landa F-01: в v1 типографика мерилась как полный bbox строки, куда попадают
умляутные точки сверху (ä, ö, ü) и выносные элементы снизу (g, f, p, y).
Для строк со строчными буквами это завышало высоту на ~37 %:
H2 «Vielfältige…» дал 23 px вместо реальных 17 px (cap буквы «V»).
Для CAPS-строк bbox == cap, поэтому H1 совпал и ошибка была не видна.

Метод здесь: измеряем ПЕРВУЮ ЗАГЛАВНУЮ букву строки отдельно.
Заглавная стоит на базовой линии и не имеет выносных, значит её
вертикальный размер и есть cap-height.

Usage: py verify/measure_typography.py [path] > docs/design/TYPOGRAPHY.json
"""
import json
import sys

import numpy as np
from PIL import Image

REF = sys.argv[1] if len(sys.argv) > 1 else "docs/design/ref/reference.jpg"

# Окна замера: (имя, y0, y1, x0, x1, светлый_ли_текст, порог)
# x0 выбран так, чтобы окно начиналось ровно на первой заглавной букве строки.
TARGETS = [
    ("h1_hero",            155, 250,  55, 120, True,  90),
    ("hero_subline",       265, 292,  55, 100, True, 110),
    ("h2_section",         495, 535, 262, 292, False, 110),
    ("eyebrow_caps",       472, 492, 420, 442, False, 130),
    ("card_title",         680, 700,  50,  78, False, 110),
    ("card_bullet",        723, 742,  56,  76, False, 130),
    ("h2_about",           885, 925, 484, 512, False, 110),
    ("stats_value",       1240, 1262, 133, 150, True,  70),
    ("stats_label",       1264, 1288,  96, 122, True, 120),
]


def glyph_extent(a, y0, y1, x0, x1, light_text, thr):
    """Вертикальный размер первого глифа в окне (верх → низ включительно)."""
    z = a[y0:y1, x0:x1].mean(axis=2)
    mask = z > (255 - thr) if light_text else z < thr
    rows = np.where(mask.any(axis=1))[0]
    if len(rows) == 0:
        return None
    # первая непрерывная вертикальная группа = одна строка текста
    runs, s, p = [], rows[0], rows[0]
    for r in rows[1:]:
        if r - p > 3:
            runs.append((s, p))
            s = r
        p = r
    runs.append((s, p))
    t, b = max(runs, key=lambda r: r[1] - r[0])
    return {
        "cap_px": int(b - t + 1),
        "top_abs": int(y0 + t),
        "bottom_abs": int(y0 + b),
        "window": {"y0": y0, "y1": y1, "x0": x0, "x1": x1},
    }


def main():
    a = np.asarray(Image.open(REF).convert("RGB"), dtype=np.int16)
    W = a.shape[1]
    SCALE = 1440 / W          # макет — уменьшенный скриншот дизайна под 1440
    CAP_RATIO = 0.72          # cap-height ≈ 0.72 от кегля для гротесков (эвристика)

    out = {
        "source": REF,
        "layout_width": W,
        "assumed_design_width": 1440,
        "scale_to_1440": round(SCALE, 4),
        "cap_ratio_assumption": CAP_RATIO,
        "method": "cap-height первой заглавной буквы строки (без выносных и умляутов)",
        "elements": {},
    }
    for name, y0, y1, x0, x1, light, thr in TARGETS:
        g = glyph_extent(a, y0, y1, x0, x1, light, thr)
        if g is None:
            out["elements"][name] = {"error": "глиф не найден в окне"}
            continue
        cap = g["cap_px"]
        out["elements"][name] = {
            **g,
            "font_size_at_1440_est": round(cap * SCALE / CAP_RATIO),
        }

    h1 = out["elements"].get("h1_hero", {}).get("cap_px")
    h2 = out["elements"].get("h2_section", {}).get("cap_px")
    if h1 and h2:
        out["h1_to_h2_ratio"] = round(h1 / h2, 2)

    print(json.dumps(out, ensure_ascii=False, indent=1))
    return 0


if __name__ == "__main__":
    sys.exit(main())
