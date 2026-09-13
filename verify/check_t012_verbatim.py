# -*- coding: utf-8 -*-
"""T012 Ф5: текст Кевина дословно на собранной странице Osnabrück.

Каждая строка docs/kevin-entkernung-text-2026-09-13.txt, кроме служебных
(1 «Neue Unterseite», 2 «Empfohlene URL», 3 URL, 4 «SEO-Titel», 6 «Meta Description»),
обязана стоять на странице site/out/leistungen/entkernung-abbrucharbeiten/osnabrueck/:
строка 5 — в <title>, строка 7 — в meta description, строки 8–185 — в видимом тексте
(пробелы нормализуются, JSON-LD не считается).

Код выхода: 0 — всё на месте, 1 — нет хотя бы одной строки.
--mutate-word подкладывает правку одного слова в текст страницы — проверка обязана дать 1.
"""
import html
import os
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
PAGE = os.path.join(ROOT, "site", "out", "leistungen", "entkernung-abbrucharbeiten", "osnabrueck", "index.html")
K = [l.strip() for l in open(os.path.join(ROOT, "docs", "kevin-entkernung-text-2026-09-13.txt"), encoding="utf-8").read().splitlines()]
SERVICE_LINES = {1, 2, 3, 4, 6}
norm = lambda s: re.sub(r"\s+", " ", s).strip()


def main(argv):
    if not os.path.exists(PAGE):
        print("RESULT: RED — нет страницы")
        return 1
    page = open(PAGE, encoding="utf-8").read()
    title = norm(html.unescape((re.search(r"<title>(.*?)</title>", page, re.S) or [None, ""])[1]))
    desc = norm(html.unescape((re.search(r'<meta name="description" content="(.*?)"', page) or [None, ""])[1]))
    body = re.sub(r"<(script|style|head)\b.*?</\1>", " ", page, flags=re.S)
    lines = [norm(html.unescape(x)) for x in re.sub(r"<[^>]+>", "\n", body).split("\n")]
    text = "\n".join(l for l in lines if l)
    if "--mutate-word" in argv:
        text = text.replace("zuverlässige", "zuverlässigste", 1)
    missing = []
    for n, line in enumerate(K, start=1):
        if not line or n in SERVICE_LINES:
            continue
        if n == 5:
            ok = title == line
        elif n == 7:
            ok = desc == line
        else:
            ok = norm(line) in text
        if not ok:
            missing.append("%d: %s" % (n, line[:90]))
    checked = sum(1 for n, l in enumerate(K, start=1) if l and n not in SERVICE_LINES)
    print("строк проверено: %d, нет на странице: %d" % (checked, len(missing)))
    for m in missing[:10]:
        print("  нет " + m)
    if missing or checked < 170:
        print("RESULT: RED")
        return 1
    print("RESULT: GREEN")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
