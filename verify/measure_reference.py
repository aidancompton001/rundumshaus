# -*- coding: utf-8 -*-
"""ЗАМЕР РЕФЕРЕНС-МАКЕТА (T008 Ф2) — все числа из пикселей, не на глаз (Закон 1).

Меряет макет Kevin (docs/design/ref/reference.jpg):
  1. Горизонтальные кромки секций — где медиана строки резко меняется
  2. Палитра по зонам — доминирующий цвет каждой секции
  3. Геометрия карточек услуг — колонки и гэпы
  4. Акцентный цвет — самый насыщенный зелёный на макете

Usage: py verify/measure_reference.py [path] > docs/design/REFERENCE_MEASUREMENTS.json
Код возврата: 0 — замер выполнен.
"""
import json
import sys

import numpy as np
from PIL import Image

REF = sys.argv[1] if len(sys.argv) > 1 else "docs/design/ref/reference.jpg"


def load(path):
    im = Image.open(path).convert("RGB")
    return np.asarray(im, dtype=np.int16), im.size


def hex_of(rgb):
    return "#%02X%02X%02X" % tuple(int(round(c)) for c in rgb)


def row_edges(a, min_jump=18):
    """Строки, где медианный цвет резко меняется — границы секций."""
    med = np.median(a, axis=1)  # (H, 3) медиана по ширине
    d = np.abs(np.diff(med, axis=0)).sum(axis=1)
    idx = np.where(d > min_jump)[0]
    # склеиваем соседние в одну кромку
    edges = []
    for i in idx:
        if not edges or i - edges[-1][-1] > 4:
            edges.append([i])
        else:
            edges[-1].append(i)
    return [int(np.mean(e)) + 1 for e in edges]


def zone_color(a, y0, y1, x0=None, x1=None):
    """Доминирующий (модальный по округлению) цвет зоны."""
    x0 = 0 if x0 is None else x0
    x1 = a.shape[1] if x1 is None else x1
    z = a[y0:y1, x0:x1].reshape(-1, 3)
    q = (z // 8) * 8
    uniq, cnt = np.unique(q, axis=0, return_counts=True)
    dom = uniq[cnt.argmax()]
    share = float(cnt.max() / len(q) * 100)
    return {"hex": hex_of(dom), "rgb": [int(v) for v in dom], "share_pct": round(share, 1)}


def most_saturated_green(a):
    """Самый насыщенный зелёный (акцент) — G заметно выше R и B."""
    r, g, b = a[..., 0].astype(int), a[..., 1].astype(int), a[..., 2].astype(int)
    mask = (g > r + 25) & (g > b + 25) & (g > 60)
    if not mask.any():
        return None
    px = a[mask].reshape(-1, 3)
    q = (px // 8) * 8
    uniq, cnt = np.unique(q, axis=0, return_counts=True)
    dom = uniq[cnt.argmax()]
    return {"hex": hex_of(dom), "rgb": [int(v) for v in dom], "pixels": int(mask.sum())}


def card_columns(a, y0, y1, bg_tol=30):
    """Колонки карточек в полосе y0..y1: непрерывные зоны, отличные от фона полосы."""
    band = a[y0:y1]
    bg = np.median(band.reshape(-1, 3), axis=0)
    diff = np.abs(band - bg).sum(axis=-1)
    density = (diff > bg_tol * 3).mean(axis=0)
    on = density > 0.35
    runs, start = [], None
    for x, v in enumerate(on):
        if v and start is None:
            start = x
        elif not v and start is not None:
            if x - start > 20:
                runs.append((start, x - 1))
            start = None
    if start is not None and len(on) - start > 20:
        runs.append((start, len(on) - 1))
    gaps = [runs[i + 1][0] - runs[i][1] for i in range(len(runs) - 1)]
    return {
        "columns": [{"x0": int(s), "x1": int(e), "w": int(e - s + 1)} for s, e in runs],
        "count": len(runs),
        "gaps_px": [int(g) for g in gaps],
    }


def main():
    a, (W, H) = load(REF)
    edges = row_edges(a)
    out = {
        "source": REF,
        "size": {"w": W, "h": H},
        "section_edges_y": edges,
        "edge_count": len(edges),
        "accent_green": most_saturated_green(a),
        "zones": {},
    }

    # Зоны: между соседними кромками берём середину полосы (устойчиво к градиентам)
    bounds = [0] + edges + [H]
    for i in range(len(bounds) - 1):
        y0, y1 = bounds[i], bounds[i + 1]
        if y1 - y0 < 15:
            continue
        pad = (y1 - y0) // 6
        out["zones"]["y%d_%d" % (y0, y1)] = {
            "y0": y0,
            "y1": y1,
            "height": y1 - y0,
            "dominant": zone_color(a, y0 + pad, y1 - pad),
        }

    # Полоса карточек услуг — ищем как самую «многоколоночную» треть макета
    best = None
    for y0 in range(int(H * 0.25), int(H * 0.65), 20):
        cc = card_columns(a, y0, min(y0 + 120, H))
        if best is None or cc["count"] > best[1]["count"]:
            best = (y0, cc)
    out["service_cards_probe"] = {"probe_y0": best[0], **best[1]}

    print(json.dumps(out, ensure_ascii=False, indent=1))
    return 0


if __name__ == "__main__":
    sys.exit(main())
