# -*- coding: utf-8 -*-
"""T012 Ф3/Ф6: страницы Entkernung в сборке site/out.

Печатает 1, если одновременно (Ланда F-05 — по всем 98, не только Osnabrück):
- страниц /leistungen/entkernung-abbrucharbeiten/<city>/ столько, сколько городов в cities.json;
- каждая есть в sitemap.xml;
- canonical на саму себя, без noindex;
- ровно один H1, равный «Entkernung & Abbrucharbeiten in <Stadt>»;
- title и description непустые, без дублей между страницами;
- в тексте нет сырых {city}/{nachbarn};
- три JSON-LD (BreadcrumbList, Service, FAQPage) разбираются как JSON;
- у Osnabrück title, description и H1 дословно равны строкам 5, 7, 8 текста Кевина.
Иначе печатает 0, причины — в stderr.
"""
import collections
import glob
import html
import json
import os
import re
import sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
OUT = os.path.join(ROOT, "site", "out")
SVC = "entkernung-abbrucharbeiten"
BASE = "https://rundumshaus-littawe.de"
errors = []


def first(pattern, s, flags=0):
    m = re.search(pattern, s, flags)
    return html.unescape(m.group(1)).strip() if m else ""


cities = {c["slug"]: c for c in json.load(open(os.path.join(ROOT, "site", "src", "data", "cities.json"), encoding="utf-8"))["cities"]}
pages = sorted(glob.glob(os.path.join(OUT, "leistungen", SVC, "*", "index.html")))
if not cities or len(pages) != len(cities):
    errors.append("pages %d != cities %d" % (len(pages), len(cities)))

locs = set(re.findall(r"<loc>([^<]+)</loc>", open(os.path.join(OUT, "sitemap.xml"), encoding="utf-8").read()))
titles, descs = collections.Counter(), collections.Counter()
K = [l.strip() for l in open(os.path.join(ROOT, "docs", "kevin-entkernung-text-2026-09-13.txt"), encoding="utf-8").read().splitlines()]

for slug, city in cities.items():
    url = "%s/leistungen/%s/%s/" % (BASE, SVC, slug)
    if url not in locs:
        errors.append("sitemap missing " + slug)
    p = os.path.join(OUT, "leistungen", SVC, slug, "index.html")
    if not os.path.exists(p):
        errors.append("page missing " + slug)
        continue
    s = open(p, encoding="utf-8").read()
    if first(r'<link rel="canonical" href="([^"]+)"', s) != url:
        errors.append("%s: canonical" % slug)
    if re.search(r'<meta name="robots" content="[^"]*noindex', s):
        errors.append("%s: noindex" % slug)
    h1s = re.findall(r"<h1[^>]*>(.*?)</h1>", s, re.S)
    want_h1 = "Entkernung & Abbrucharbeiten in " + city["displayName"]
    if len(h1s) != 1 or html.unescape(re.sub(r"<[^>]+>", "", h1s[0])).strip() != want_h1:
        errors.append("%s: h1 %r" % (slug, h1s))
    title = first(r"<title>(.*?)</title>", s, re.S)
    desc = first(r'<meta name="description" content="(.*?)"', s)
    if not title or len(desc) < 50:
        errors.append("%s: title/description empty" % slug)
    titles[title] += 1
    descs[desc] += 1
    body = re.sub(r"<script\b.*?</script>", "", s, flags=re.S)
    if re.search(r"\{(city|nachbarn|list|dist|count)\}", body):
        errors.append("%s: raw placeholder" % slug)
    types = []
    for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>', s, re.S):
        try:
            types.append(json.loads(block).get("@type"))
        except ValueError:
            errors.append("%s: bad JSON-LD" % slug)
    for t in ("BreadcrumbList", "Service", "FAQPage"):
        if t not in types:
            errors.append("%s: without %s" % (slug, t))
    if slug == "osnabrueck":
        for key, got, want in (("title", title, K[4]), ("description", desc, K[6]), ("h1", want_h1, K[7])):
            if got != want:
                errors.append("osnabrueck %s %r != %r" % (key, got, want))

dups = [t for t, n in list(titles.items()) + list(descs.items()) if n > 1]
if dups:
    errors.append("duplicate title/description: %r" % dups[:3])

if errors:
    print("%d errors:" % len(errors), file=sys.stderr)
    print("\n".join(errors[:20]), file=sys.stderr)
print(0 if errors else 1)
