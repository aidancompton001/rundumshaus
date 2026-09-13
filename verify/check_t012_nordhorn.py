# -*- coding: utf-8 -*-
"""T012 Ф5: дальняя городская страница Nordhorn (80 км) — по собранному HTML.

Смотрит ТОЛЬКО на два куска страницы site/out/leistungen/entkernung-abbrucharbeiten/nordhorn/:
  1) раздел «Entkernungsfirma …» (строки 125–137 текста Кевина),
  2) видимый ответ FAQ на вопрос строки 182.
Во всей странице искать нельзя: «Weitere Einsatzorte» законно содержит соседние города.

Запрещено: «in Nordhorn … tätig», «Osnabrücker Land», соседи Osnabrück из строк 129–135.
Обязательно: соседи Nordhorn из cities.json (Twist, Meppen, Wietmarschen) в обоих кусках.

Код выхода: 0 — GREEN, 1 — RED. --mutate-126 подкладывает дефект строки 126
(«Osnabrück» → «Nordhorn») в вырезанный кусок — проверка обязана дать 1.
"""
import html
import json
import os
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
PAGE = os.path.join(ROOT, "site", "out", "leistungen", "entkernung-abbrucharbeiten", "nordhorn", "index.html")
K = [l.strip() for l in open(os.path.join(ROOT, "docs", "kevin-entkernung-text-2026-09-13.txt"), encoding="utf-8").read().splitlines()]
CITIES = {c["slug"]: c for c in json.load(open(os.path.join(ROOT, "site", "src", "data", "cities.json"), encoding="utf-8"))["cities"]}
OSN_NEIGHBORS = K[128:135]  # строки 129–135


def text_lines(fragment):
    """HTML-фрагмент → строки видимого текста."""
    t = re.sub(r"<(script|style)\b.*?</\1>", "", fragment, flags=re.S)
    t = re.sub(r"<[^>]+>", "\n", t)
    return [html.unescape(x).strip() for x in t.split("\n") if x.strip()]


def extract(page):
    body = re.sub(r"<script\b.*?</script>", "", page, flags=re.S)
    firma = next((s for s in re.findall(r"<section\b.*?</section>", body, flags=re.S) if K[124] in s), None)
    faq = next((d for d in re.findall(r"<details\b.*?</details>", body, flags=re.S) if K[181] in html.unescape(d)), None)
    if firma is None or faq is None:
        return None, None
    faq_lines = [l for l in text_lines(faq) if l not in (K[181], "+")]
    return text_lines(firma), " ".join(faq_lines)


def check(name, neighbors, firma, faq):
    blocks = "\n".join(firma) + "\n" + faq
    problems = []
    if re.search(r"in\s+" + re.escape(name) + r"\b[^.]{0,80}\btätig", blocks):
        problems.append("есть «in %s … tätig»" % name)
    if "Osnabrücker Land" in blocks:
        problems.append("есть «Osnabrücker Land»")
    leaked = [n for n in OSN_NEIGHBORS if n in firma or re.search(r"\b" + re.escape(n) + r"\b", faq)]
    if leaked:
        problems.append("соседи Osnabrück: " + ", ".join(leaked))
    missing = [n for n in neighbors if n not in firma or n not in faq]
    if missing:
        problems.append("нет соседей города: " + ", ".join(missing))
    return problems


def main(argv):
    city = CITIES["nordhorn"]
    name = city["displayName"]
    neighbors = [CITIES[s]["displayName"] for s in city["neighbors"] if s in CITIES and s not in ("osnabrueck", city["slug"])][:3]
    if not os.path.exists(PAGE):
        print("RESULT: RED — нет страницы " + PAGE)
        return 1
    firma, faq = extract(open(PAGE, encoding="utf-8").read())
    if firma is None:
        print("RESULT: RED — на странице не найдены раздел «Entkernungsfirma» или вопрос строки 182")
        return 1
    if "--mutate-126" in argv:
        firma = [l.replace("Osnabrück", name) if l == K[125] else l for l in firma]
    print("  126:", next((l for l in firma if "tätig" in l), "—"))
    print("  183:", faq)
    problems = check(name, neighbors, firma, faq)
    if problems:
        print("RESULT: RED — " + "; ".join(problems))
        return 1
    print("RESULT: GREEN")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
