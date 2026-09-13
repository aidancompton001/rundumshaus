# -*- coding: utf-8 -*-
"""T012 Ф3: страницы Entkernung в сборке site/out.

Печатает 1, если одновременно:
- страниц /leistungen/entkernung-abbrucharbeiten/<city>/ ровно столько, сколько городов в cities.json;
- каждая из них есть в sitemap.xml;
- на каждой три JSON-LD (BreadcrumbList, Service, FAQPage) разбираются как JSON;
- у Osnabrück title, description и H1 дословно равны строкам 5, 7, 8 текста Кевина.
Иначе печатает 0, причины — в stderr.
"""
import glob
import html
import json
import os
import re
import sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
OUT = os.path.join(ROOT, "site", "out")
SVC = "entkernung-abbrucharbeiten"
errors = []

cities = json.load(open(os.path.join(ROOT, "site", "src", "data", "cities.json"), encoding="utf-8"))["cities"]
pages = sorted(glob.glob(os.path.join(OUT, "leistungen", SVC, "*", "index.html")))
if not cities or len(pages) != len(cities):
    errors.append("pages %d != cities %d" % (len(pages), len(cities)))

sitemap = open(os.path.join(OUT, "sitemap.xml"), encoding="utf-8").read()
locs = set(re.findall(r"<loc>([^<]+)</loc>", sitemap))
for c in cities:
    if "https://rundumshaus-littawe.de/leistungen/%s/%s/" % (SVC, c["slug"]) not in locs:
        errors.append("sitemap missing " + c["slug"])

for p in pages:
    s = open(p, encoding="utf-8").read()
    types = []
    for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>', s, re.S):
        try:
            types.append(json.loads(block).get("@type"))
        except ValueError:
            errors.append("bad JSON-LD " + p)
    for t in ("BreadcrumbList", "Service", "FAQPage"):
        if t not in types:
            errors.append("%s without %s" % (os.path.basename(os.path.dirname(p)), t))

K = [l.strip() for l in open(os.path.join(ROOT, "docs", "kevin-entkernung-text-2026-09-13.txt"), encoding="utf-8").read().splitlines()]
osn = os.path.join(OUT, "leistungen", SVC, "osnabrueck", "index.html")
if os.path.exists(osn):
    s = open(osn, encoding="utf-8").read()
    got = {
        "title": html.unescape((re.search(r"<title>(.*?)</title>", s) or [None, ""])[1]),
        "description": html.unescape((re.search(r'<meta name="description" content="(.*?)"', s) or [None, ""])[1]),
        "h1": html.unescape(re.sub(r"<[^>]+>", "", (re.search(r"<h1[^>]*>(.*?)</h1>", s, re.S) or [None, ""])[1])).strip(),
    }
    for key, want in (("title", K[4]), ("description", K[6]), ("h1", K[7])):
        if got[key] != want:
            errors.append("osnabrueck %s %r != %r" % (key, got[key], want))
else:
    errors.append("osnabrueck page missing")

if errors:
    print("\n".join(errors[:20]), file=sys.stderr)
print(0 if errors else 1)
