# -*- coding: utf-8 -*-
"""ПРУФ СООТВЕТСТВИЯ ТОКЕНОВ МОКАПА ЗАМЕРАМ МАКЕТА (T008).

Landa требовал этого ЧЕТЫРЕ раунда подряд: «токены совпали» говорилось CEO,
но не проверялось ничем, хотя это единственное, что вообще интересует
заказчика в редизайне 1:1.

Сверяет css/tokens.css мокапа с измеренными значениями макета Kevin:
  цвета      — против REFERENCE_MEASUREMENTS.json (медиана по зоне)
  типографика — против TYPOGRAPHY.json (cap-height -> font-size при 1440)

Usage: py verify/check_tokens_match.py
Код возврата: 0 — всё сошлось, 1 — есть расхождения.
"""
import io
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
TOKENS = os.path.join(ROOT, "docs", "design", "v1-desktop", "css", "tokens.css")
MEAS = os.path.join(ROOT, "docs", "design", "REFERENCE_MEASUREMENTS.json")
TYPO = os.path.join(ROOT, "docs", "design", "TYPOGRAPHY.json")

# (имя токена, путь в JSON замеров) — цвета берутся по МЕДИАНЕ зоны:
# для JPEG она устойчивее модального цвета
COLORS = [
    ("color-accent", ("green_accent", "median", "hex")),
    ("color-dark", ("zones", "stats_band", "median", "hex")),
    ("color-paper", ("zones", "leistungen_heading", "median", "hex")),
]
# (имя токена, ключ элемента в TYPOGRAPHY.json) — сверяется максимум clamp()
TYPESCALE = [
    ("text-h1", "h1_hero"),
    ("text-h2", "h2_section"),
    ("text-hero-sub", "hero_subline"),
    ("text-card-title", "card_title"),
]
PX_TOLERANCE = 1


def dig(d, path):
    for k in path:
        d = d[k]
    return d


def token(css, name):
    m = re.search(r"--" + re.escape(name) + r":\s*([^;]+);", css)
    return m.group(1).strip() if m else None


def clamp_max_px(value):
    """Максимум clamp(...) в px; если значение простое — оно само."""
    if value is None:
        return None
    rems = re.findall(r"([\d.]+)rem\s*\)", value)
    if rems:
        return round(float(rems[0]) * 16)
    m = re.match(r"^([\d.]+)rem$", value)
    if m:
        return round(float(m.group(1)) * 16)
    m = re.match(r"^([\d.]+)px$", value)
    return round(float(m.group(1))) if m else None


def main():
    css = io.open(TOKENS, encoding="utf-8").read()
    meas = json.load(io.open(MEAS, encoding="utf-8"))
    typo = json.load(io.open(TYPO, encoding="utf-8"))
    bad = 0

    print("ЦВЕТА (токен мокапа против медианы зоны макета):")
    for name, path in COLORS:
        got = (token(css, name) or "").upper()
        want = dig(meas, path).upper()
        ok = got == want
        bad += not ok
        print("  --%-16s %-9s vs %-9s  %s" % (name, got, want, "OK" if ok else "РАСХОЖДЕНИЕ"))

    print("ТИПОГРАФИКА (максимум clamp против расчёта из cap-height):")
    for name, key in TYPESCALE:
        got = clamp_max_px(token(css, name))
        want = typo["elements"][key]["font_size_at_1440_est"]
        ok = got is not None and abs(got - want) <= PX_TOLERANCE
        bad += not ok
        print("  --%-16s %-9s vs %-9s  %s" % (name, str(got) + "px", str(want) + "px",
                                              "OK" if ok else "РАСХОЖДЕНИЕ"))

    print("RESULT: %s" % ("TOKENS_MATCH" if bad == 0 else "MISMATCH:%d" % bad))
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
