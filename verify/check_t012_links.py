# -*- coding: utf-8 -*-
"""T012 Ф4: Entkernung видна со всего сайта, ссылки в обе стороны — по сборке site/out.

Печатает 1, если все условия выполнены, иначе 0 (причины — в stderr):
- на каждой городской странице 5 прежних услуг есть ссылка на Entkernung того же города;
- на каждой странице Entkernung есть ссылки на 5 прежних услуг того же города;
- главная: карточка с пунктами из шаблона, сетка lg:grid-cols-3 без xl:grid-cols-5,
  ссылка на /leistungen/entkernung-abbrucharbeiten/osnabrueck/ (блок Standort), услуга в hasOfferCatalog;
- /leistungen/: блок с якорем; подвал: ссылка на якорь; /kontakt/: вариант в форме;
- /osnabrueck/: ссылка на страницу Osnabrück; llms.txt и llms-full.txt: 6 основных услуг.
"""
import glob
import json
import os
import sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
OUT = os.path.join(ROOT, "site", "out")
NEW = "entkernung-abbrucharbeiten"
OLD = ["hausmeisterservice", "gartenpflege", "dacharbeiten", "entruempelung", "garten-landschaftsbau"]
errors = []


def read(rel):
    p = os.path.join(OUT, rel)
    if not os.path.exists(p):
        errors.append("missing " + rel)
        return ""
    return open(p, encoding="utf-8").read()


cities = json.load(open(os.path.join(ROOT, "site", "src", "data", "cities.json"), encoding="utf-8"))["cities"]
slugs = [c["slug"] for c in cities]
checked = 0
for svc in OLD:
    for slug in slugs:
        s = read("leistungen/%s/%s/index.html" % (svc, slug))
        checked += 1
        if s and 'href="/leistungen/%s/%s/"' % (NEW, slug) not in s:
            errors.append("%s/%s: no link to %s" % (svc, slug, NEW))
for slug in slugs:
    s = read("leistungen/%s/%s/index.html" % (NEW, slug))
    checked += 1
    for svc in OLD:
        if s and 'href="/leistungen/%s/%s/"' % (svc, slug) not in s:
            errors.append("%s/%s: no link to %s" % (NEW, slug, svc))
if checked != 6 * len(slugs) or not slugs:
    errors.append("checked %d pages" % checked)

tpl = json.load(open(os.path.join(ROOT, "site", "src", "data", "templates", NEW + ".json"), encoding="utf-8"))
home = read("index.html")
for item in tpl["leistungen"]["items"][:4]:
    if item not in home:
        errors.append("home card without bullet: " + item)
if "lg:grid-cols-3" not in home or "xl:grid-cols-5" in home:
    errors.append("home grid not lg:grid-cols-3 only")
if 'href="/leistungen/%s/osnabrueck/"' % NEW not in home:
    errors.append("home Standort block without link")
if '"name":"Entkernung & Abbrucharbeiten"' not in home:
    errors.append("hasOfferCatalog without service")
if 'id="%s"' % NEW not in read("leistungen/index.html"):
    errors.append("/leistungen/ without anchor")
if 'href="/leistungen/#%s"' % NEW not in read("impressum/index.html"):
    errors.append("footer without link")
if "Entkernung &amp; Abbrucharbeiten" not in read("kontakt/index.html") and "Entkernung & Abbrucharbeiten" not in read("kontakt/index.html"):
    errors.append("contact form without option")
if 'href="/leistungen/%s/osnabrueck/"' % NEW not in read("osnabrueck/index.html"):
    errors.append("/osnabrueck/ without link")
for f in ("llms.txt", "llms-full.txt"):
    s = read(f)
    if "Entkernung" not in s or "5 Services" in s or "Hauptleistungen:** 5" in s or "Hauptleistungen (5)" in s:
        errors.append(f + " not updated")

if errors:
    print("%d errors, first:" % len(errors), file=sys.stderr)
    print("\n".join(errors[:15]), file=sys.stderr)
print(0 if errors else 1)
