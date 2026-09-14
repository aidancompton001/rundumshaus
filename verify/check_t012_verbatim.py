# -*- coding: utf-8 -*-
"""T012 Ф5/Ф6: текст Кевина дословно на собранной странице Osnabrück.

Каждая строка docs/kevin-entkernung-text-2026-09-13.txt, кроме служебных
(1 «Neue Unterseite», 2 «Empfohlene URL», 3 URL, 4 «SEO-Titel», 6 «Meta Description»),
обязана стоять на странице site/out/leistungen/entkernung-abbrucharbeiten/osnabrueck/:
строка 5 — <title>, строка 7 — meta description, строки 8–185 — видимый текст.

Ланда F-02: поиск подстроки по всей странице не видел удаление 34 строк —
«Estrich», «Parkett», целого списка мест: те же слова стоят в других строках.
Поэтому строки 8–185 сверяются как упорядоченная подпоследовательность ТОЧНЫХ
элементов видимого текста (текстовых узлов): каждая строка — отдельный узел,
равный ей целиком, и узлы идут в порядке текста Кевина. JSON-LD не считается.

Код выхода: 0 — всё на месте, 1 — нет хотя бы одной строки.
Подлоги: --mutate-word (правка одного слова), --drop-estrich (удалён пункт
«Estrich», строка 66) — оба обязаны дать 1.
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


def norm(s):
    return re.sub(r"\s+", " ", s).strip()


def main(argv):
    if not os.path.exists(PAGE):
        print("RESULT: RED — нет страницы")
        return 1
    page = open(PAGE, encoding="utf-8").read()
    title = norm(html.unescape((re.search(r"<title>(.*?)</title>", page, re.S) or [None, ""])[1]))
    desc = norm(html.unescape((re.search(r'<meta name="description" content="(.*?)"', page) or [None, ""])[1]))
    body = re.sub(r"<(script|style|head)\b.*?</\1>", " ", page, flags=re.S)
    nodes = [norm(html.unescape(x)) for x in re.split(r"<[^>]+>", body)]
    nodes = [n for n in nodes if n]
    if "--mutate-word" in argv:
        i = next(i for i, n in enumerate(nodes) if "zuverlässige" in n)
        nodes[i] = nodes[i].replace("zuverlässige", "zuverlässigste", 1)
    if "--drop-estrich" in argv:
        nodes.remove("Estrich")

    missing = []
    checked = 0
    if title != K[4]:
        missing.append("5: title %r" % title)
    if desc != K[6]:
        missing.append("7: description %r" % desc)
    checked += 2
    pos = 0
    for n in range(8, len(K) + 1):
        line = norm(K[n - 1])
        if not line:
            continue
        checked += 1
        try:
            j = nodes.index(line, pos)
        except ValueError:
            missing.append("%d: %s" % (n, line[:90]))
            continue
        pos = j + 1
    print("строк проверено: %d, нет на странице (по порядку, целым узлом): %d" % (checked, len(missing)))
    for m in missing[:10]:
        print("  нет " + m)
    if missing or checked < 170:
        print("RESULT: RED")
        return 1
    print("RESULT: GREEN")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
