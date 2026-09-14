# -*- coding: utf-8 -*-
"""T012 Ф5/Ф6: городские страницы Entkernung не привязывают фирму к городу — по собранному HTML.

Смотрит ТОЛЬКО на два куска страницы site/out/leistungen/entkernung-abbrucharbeiten/<city>/:
  1) раздел «Entkernungsfirma …» (строки 125–137 текста Кевина),
  2) видимый ответ FAQ на вопрос строки 182.
Во всей странице искать нельзя: «Weitere Einsatzorte» законно содержит соседние города.

Запрещено: «in <Stadt> … tätig», «Osnabrücker Land», соседи Osnabrück из строк 129–135,
если это не соседи самого города. Обязательно: соседи города из cities.json
(первые 3 — в обоих кусках). Без флагов проверяется Nordhorn (80 км), с --all —
все 97 городов кроме Osnabrück (Ланда F-05).

Код выхода: 0 — GREEN, 1 — RED. --mutate-126 подкладывает дефект строки 126
(«Osnabrück» → город) в вырезанный кусок — проверка обязана дать 1.
"""
import html
import json
import os
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
OUT = os.path.join(ROOT, "site", "out", "leistungen", "entkernung-abbrucharbeiten")
K = [l.strip() for l in open(os.path.join(ROOT, "docs", "kevin-entkernung-text-2026-09-13.txt"), encoding="utf-8").read().splitlines()]
CITIES = {c["slug"]: c for c in json.load(open(os.path.join(ROOT, "site", "src", "data", "cities.json"), encoding="utf-8"))["cities"]}
OSN_NEIGHBORS = K[128:135]  # строки 129–135


def text_lines(fragment):
    t = re.sub(r"<(script|style)\b.*?</\1>", "", fragment, flags=re.S)
    return [html.unescape(x).strip() for x in re.split(r"<[^>]+>", t) if x.strip()]


def extract(page):
    body = re.sub(r"<script\b.*?</script>", "", page, flags=re.S)
    firma = next((s for s in re.findall(r"<section\b.*?</section>", body, flags=re.S) if K[124] in s), None)
    faq = next((d for d in re.findall(r"<details\b.*?</details>", body, flags=re.S) if K[181] in html.unescape(d)), None)
    if firma is None or faq is None:
        return None, None
    return text_lines(firma), " ".join(l for l in text_lines(faq) if l not in (K[181], "+"))


def geo(city, n):
    return [CITIES[s]["displayName"] for s in city["neighbors"] if s in CITIES and s not in ("osnabrueck", city["slug"])][:n]


def check_city(slug, mutate):
    city = CITIES[slug]
    name = city["displayName"]
    page = os.path.join(OUT, slug, "index.html")
    if not os.path.exists(page):
        return ["нет страницы"]
    firma, faq = extract(open(page, encoding="utf-8").read())
    if firma is None:
        return ["не найдены раздел «Entkernungsfirma» или вопрос строки 182"]
    if mutate:
        firma = [l.replace("Osnabrück", name) if l == K[125] else l for l in firma]
    blocks = "\n".join(firma) + "\n" + faq
    problems = []
    if re.search(r"in\s+" + re.escape(name) + r"\b[^.]{0,80}\btätig", blocks):
        problems.append("есть «in %s … tätig»" % name)
    if "Osnabrücker Land" in blocks:
        problems.append("есть «Osnabrücker Land»")
    allowed_firma = {name, *geo(city, 7)}
    allowed_faq = {name, *geo(city, 3)}
    leaked = [n for n in OSN_NEIGHBORS
              if (n in firma and n not in allowed_firma)
              or (re.search(r"\b" + re.escape(n) + r"\b", faq) and n not in allowed_faq)]
    if leaked:
        problems.append("соседи Osnabrück: " + ", ".join(leaked))
    missing = [n for n in geo(city, 3) if n not in firma or n not in faq]
    if missing:
        problems.append("нет соседей города: " + ", ".join(missing))
    return problems


def main(argv):
    mutate = "--mutate-126" in argv
    slugs = [s for s in CITIES if s != "osnabrueck"] if "--all" in argv else ["nordhorn"]
    failed = {}
    for slug in slugs:
        p = check_city(slug, mutate)
        if p:
            failed[slug] = p
    print("городов проверено: %d, с нарушениями: %d" % (len(slugs), len(failed)))
    for slug, p in list(failed.items())[:10]:
        print("  %s: %s" % (slug, "; ".join(p)))
    if failed or not slugs:
        print("RESULT: RED")
        return 1
    print("RESULT: GREEN")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
