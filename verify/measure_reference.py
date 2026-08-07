# -*- coding: utf-8 -*-
"""ЗАМЕР РЕФЕРЕНС-МАКЕТА (T008 Ф2, v2 после Landa) — числа из пикселей.

v2 исправляет 4 дефекта, найденных Landa в v1:
  L-1: квантование (c//8)*8 физически не могло выдать заявленный #0C121E.
       Теперь считаем ТОЧНЫЙ модальный цвет + медиану, без квантования.
  L-2: геометрия карточек меряла блоки текста ВНУТРИ карточек и выдавала их
       за гэпы между карточками. Теперь детектируем карточки по полосе ФОТО,
       где карточка = не-фоновая колонка.
  L-3: граница футера бралась из сырого списка кромок (1493) и противоречила
       собственному замеру зон. Теперь ищем границу как первую строку снизу,
       с которой медиана держится тёмной.
  L-4: 'pixels' модального цвета путался с размером всей зелёной маски.
       Теперь оба числа выводятся раздельно и подписаны.

Usage: py verify/measure_reference.py [path] > docs/design/REFERENCE_MEASUREMENTS.json
"""
import json
import sys

import numpy as np
from PIL import Image

REF = sys.argv[1] if len(sys.argv) > 1 else "docs/design/ref/reference.jpg"


def hex_of(rgb):
    return "#%02X%02X%02X" % tuple(int(round(c)) for c in rgb)


def exact_mode(px):
    """Точный модальный цвет набора пикселей (без квантования) + его доля."""
    flat = px.reshape(-1, 3)
    packed = (flat[:, 0].astype(np.int32) << 16) | (flat[:, 1].astype(np.int32) << 8) | flat[:, 2].astype(np.int32)
    vals, cnt = np.unique(packed, return_counts=True)
    v = int(vals[cnt.argmax()])
    rgb = ((v >> 16) & 255, (v >> 8) & 255, v & 255)
    return {"hex": hex_of(rgb), "rgb": list(rgb), "share_pct": round(float(cnt.max() / len(flat) * 100), 2)}


def zone_stats(a, y0, y1, x0=None, x1=None):
    """Три независимых оценки цвета зоны: точный модальный, медиана, среднее."""
    x0 = 0 if x0 is None else x0
    x1 = a.shape[1] if x1 is None else x1
    z = a[y0:y1, x0:x1]
    med = np.median(z.reshape(-1, 3), axis=0)
    mean = z.reshape(-1, 3).mean(axis=0)
    return {
        "window": {"y0": y0, "y1": y1, "x0": x0, "x1": x1},
        "mode_exact": exact_mode(z),
        "median": {"hex": hex_of(med), "rgb": [int(v) for v in med]},
        "mean": {"hex": hex_of(mean), "rgb": [int(round(v)) for v in mean]},
    }


def row_edges(a, min_jump=18):
    med = np.median(a, axis=1)
    d = np.abs(np.diff(med, axis=0)).sum(axis=1)
    idx = np.where(d > min_jump)[0]
    edges, cur = [], []
    for i in idx:
        if cur and i - cur[-1] > 4:
            edges.append(int(np.mean(cur)) + 1)
            cur = []
        cur.append(i)
    if cur:
        edges.append(int(np.mean(cur)) + 1)
    return edges


def dark_band_bounds(a, lum_threshold=60):
    """Границы тёмных полос: строки, где медианная яркость ниже порога."""
    med = np.median(a, axis=1).mean(axis=1)
    dark = med < lum_threshold
    bands, start = [], None
    for y, v in enumerate(dark):
        if v and start is None:
            start = y
        elif not v and start is not None:
            if y - start > 20:
                bands.append({"y0": start, "y1": y - 1, "height": y - start})
            start = None
    if start is not None and len(dark) - start > 20:
        bands.append({"y0": start, "y1": len(dark) - 1, "height": len(dark) - start})
    return bands


def card_geometry(a, y0, y1, tol=14):
    """Карточки в полосе фото: колонка НЕ-фоновая, если её медиана далеко от фона полосы.

    Фон полосы определяется как медианный цвет крайних 30 px слева и справа
    (там гарантированно поле контейнера, не карточка).
    """
    band = a[y0:y1]
    edge = np.concatenate([band[:, :30], band[:, -30:]], axis=1).reshape(-1, 3)
    bg = np.median(edge, axis=0)
    colmed = np.median(band, axis=0)  # (W,3) медиана каждой колонки
    dist = np.abs(colmed - bg).sum(axis=1)
    on = dist > tol * 3

    runs, start = [], None
    for x, v in enumerate(on):
        if v and start is None:
            start = x
        elif not v and start is not None:
            if x - start > 40:
                runs.append((start, x - 1))
            start = None
    if start is not None and len(on) - start > 40:
        runs.append((start, len(on) - 1))

    gaps = [runs[i + 1][0] - runs[i][1] - 1 for i in range(len(runs) - 1)]
    W = a.shape[1]
    return {
        "band": {"y0": y0, "y1": y1},
        "bg_of_band": {"hex": hex_of(bg), "rgb": [int(v) for v in bg]},
        "cards": [{"x0": int(s), "x1": int(e), "w": int(e - s + 1)} for s, e in runs],
        "count": len(runs),
        "gaps_px": [int(g) for g in gaps],
        "margin_left": int(runs[0][0]) if runs else None,
        "margin_right": int(W - 1 - runs[-1][1]) if runs else None,
        "card_w_pct": [round((e - s + 1) / W * 100, 1) for s, e in runs],
        "gap_pct": [round(g / W * 100, 2) for g in gaps],
    }


def green_analysis(a):
    """Зелёный акцент: размер маски И модальный цвет внутри неё — раздельно."""
    r, g, b = a[..., 0].astype(int), a[..., 1].astype(int), a[..., 2].astype(int)
    mask = (g > r + 25) & (g > b + 25) & (g > 60)
    if not mask.any():
        return None
    px = a[mask].reshape(-1, 3)
    m = exact_mode(px)
    return {
        "mask_pixels": int(mask.sum()),
        "mode_exact": m,
        "mode_pixels": int(round(m["share_pct"] / 100 * mask.sum())),
        "median": {"hex": hex_of(np.median(px, axis=0)), "rgb": [int(v) for v in np.median(px, axis=0)]},
        "note": "mask_pixels = размер всей зелёной маски; mode_pixels = пиксели именно модального цвета",
    }


def main():
    im = Image.open(REF).convert("RGB")
    a = np.asarray(im, dtype=np.int16)
    H, W = a.shape[0], a.shape[1]

    dark = dark_band_bounds(a)
    out = {
        "source": REF,
        "size": {"w": W, "h": H},
        "method": "v2 after Landa: точный модальный цвет (без квантования) + медиана + среднее",
        "section_edges_y": row_edges(a),
        "dark_bands": dark,
        "green_accent": green_analysis(a),
        "zones": {},
        "card_geometry_photo_band": card_geometry(a, 565, 635),
        "card_geometry_text_band": card_geometry(a, 690, 830),
    }
    out["edge_count"] = len(out["section_edges_y"])

    named = {
        "navbar": (0, 84),
        "hero": (84, 451),
        "leistungen_heading": (451, 554),
        "leistungen_cards": (554, 828),
        "ueber_uns": (828, 1182),
        "stats_band": (1182, 1302),
        "bewertungen": (1302, 1521),
        "footer": (1521, H),
    }
    for name, (y0, y1) in named.items():
        pad = max((y1 - y0) // 8, 2)
        out["zones"][name] = {"y0": y0, "y1": y1, "height": y1 - y0, **zone_stats(a, y0 + pad, y1 - pad)}

    out["probes"] = {
        "cta_button_hero": zone_stats(a, 380, 420, 60, 230),
        "navbar_whatsapp": zone_stats(a, 28, 60, 780, 940),
        "stats_band_core": zone_stats(a, 1190, 1290),
        "footer_core": zone_stats(a, 1530, 1630),
        "services_bg": zone_stats(a, 470, 540),
        "hero_overlay_left": zone_stats(a, 150, 260, 60, 420),
        "usp_card_hero": zone_stats(a, 150, 430, 780, 950),
    }

    print(json.dumps(out, ensure_ascii=False, indent=1))
    return 0


if __name__ == "__main__":
    sys.exit(main())
