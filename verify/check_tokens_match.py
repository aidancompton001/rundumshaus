# -*- coding: utf-8 -*-
"""ПРУФ СООТВЕТСТВИЯ ТОКЕНОВ МОКАПА ЗАМЕРАМ МАКЕТА (T008).

Landa требовал этого четыре раунда: «токены совпали» говорилось CEO, но не
проверялось ничем, хотя в редизайне 1:1 это единственное, что интересует заказчика.

Пятый раунд — его же замечание к первой версии: она проверяла ФИЛЬТРОВАННОЕ
ПОДМНОЖЕСТВО (4 кегля из 9 и 3 цвета из 4), причём все взятые совпадали, а
единственный расходящийся — card_bullet — из проверки был исключён. Поэтому здесь:
  * перебираются ВСЕ элементы TYPOGRAPHY.json и ВСЕ измеренные базовые цвета;
  * осознанные отклонения объявлены явным списком EXPECTED_DEVIATIONS с причиной
    и ПОКАЗЫВАЮТСЯ в отчёте, а не отсутствуют в нём;
  * незаявленное отклонение = провал, заявленное с другой величиной = тоже провал.

Сверка идёт с РАСЧЁТНОЙ величиной font_size_at_1440_est, которая построена на двух
объявленных допущениях (cap-height ≈ 0.72 кегля, макет 962px — уменьшенный скриншот
дизайна под 1440px). Поэтому «совпало» здесь значит «совпало с расчётной оценкой
в пределах допуска», а не «точно» — Landa справедливо забраковал слово «точное».

Usage: py verify/check_tokens_match.py [путь к tokens.css]
Код возврата: 0 — всё сошлось, 1 — есть расхождения.
"""
import io
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
DEFAULT_TOKENS = os.path.join(ROOT, "docs", "design", "v1-desktop", "css", "tokens.css")
MEAS = os.path.join(ROOT, "docs", "design", "REFERENCE_MEASUREMENTS.json")
TYPO = os.path.join(ROOT, "docs", "design", "TYPOGRAPHY.json")
PX_TOLERANCE = 1

# ВСЕ измеренные базовые цвета: токен -> путь к медиане зоны в замерах
COLORS = {
    "color-accent": ("green_accent", "median", "hex"),
    "color-dark": ("zones", "stats_band", "median", "hex"),
    "color-paper": ("zones", "leistungen_heading", "median", "hex"),
    "color-white": ("zones", "navbar", "median", "hex"),
}
# ВСЕ элементы TYPOGRAPHY.json: ключ замера -> токен кегля
TYPESCALE = {
    "h1_hero": "text-h1",
    "hero_subline": "text-hero-sub",
    "h2_section": "text-h2",
    "h2_about": "text-h2-about",
    "eyebrow_caps": "text-eyebrow",
    "card_title": "text-card-title",
    "card_bullet": "text-small",
    "stats_value": "text-stat-value",
    "stats_label": "text-stat-label",
}
# Осознанные отклонения: (измерено, в токене, причина). Отклонение обязано быть
# ровно таким, как заявлено, иначе провал — «разрешено» не значит «что угодно».
EXPECTED_DEVIATIONS = {
    "card_bullet": (12, 14, "жёсткий нижний порог кегля 14px: 12px нечитаемо, конфликтует с доступностью"),
}


def dig(d, path):
    for k in path:
        d = d[k]
    return d


def token(css, name):
    m = re.search(r"--" + re.escape(name) + r":\s*([^;]+);", css)
    return m.group(1).strip() if m else None


def clamp_max_px(value):
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
    tokens_path = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_TOKENS
    css = io.open(tokens_path, encoding="utf-8").read()
    meas = json.load(io.open(MEAS, encoding="utf-8"))
    typo = json.load(io.open(TYPO, encoding="utf-8"))
    bad = 0

    print("ЦВЕТА (%d измеренных, все проверяются):" % len(COLORS))
    for name, path in sorted(COLORS.items()):
        got = (token(css, name) or "—").upper()
        want = dig(meas, path).upper()
        ok = got == want
        bad += not ok
        print("  --%-16s %-9s vs %-9s  %s" % (name, got, want, "OK" if ok else "РАСХОЖДЕНИЕ"))

    print("ТИПОГРАФИКА (%d измеренных, все проверяются):" % len(typo["elements"]))
    for key in sorted(typo["elements"]):
        want = typo["elements"][key]["font_size_at_1440_est"]
        tname = TYPESCALE.get(key)
        got = clamp_max_px(token(css, tname)) if tname else None
        dev = EXPECTED_DEVIATIONS.get(key)
        if dev:
            m_want, m_got, why = dev
            ok = (want == m_want and got == m_got)
            bad += not ok
            print("  %-14s %-9s vs %-9s  %s (отклонение заявлено: %s)"
                  % (key, str(got) + "px", str(want) + "px",
                     "OK" if ok else "РАСХОЖДЕНИЕ", why))
            continue
        ok = got is not None and abs(got - want) <= PX_TOLERANCE
        bad += not ok
        print("  %-14s %-9s vs %-9s  %s" % (key, str(got) + "px", str(want) + "px",
                                            "OK" if ok else "РАСХОЖДЕНИЕ"))

    print("RESULT: %s" % ("TOKENS_MATCH" if bad == 0 else "MISMATCH:%d" % bad))
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
