# -*- coding: utf-8 -*-
"""T013 Ф2 по собранному сайту (site/out), без сети.

1. На КАЖДОЙ странице /leistungen/entruempelung/<город>/ в секции с H1 есть ссылка tel:+4915239603175.
2. Datenschutz описывает клики по Telefon/WhatsApp как Conversion, Umami и срок хранения; скрипт Umami вместо Plausible.
3. В JS сборки есть обе новые метки конверсий.

--mutate-drop-tel  убирает ссылку tel из шапки одной страницы (в памяти) — проверка обязана дать код 1.
--mutate-datenschutz  убирает упоминание Umami (в памяти) — код 1.
"""
import json, re, sys
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "site" / "out"
TEL = 'href="tel:+4915239603175"'
LABELS = ("ajW6CLqn6PocEO2ulalD", "-3b4CL2n6PocEO2ulalD")
mut_tel = "--mutate-drop-tel" in sys.argv
mut_ds = "--mutate-datenschutz" in sys.argv


def header_section(html):
    m = re.search(r"<h1[\s>]", html)
    if not m:
        return None
    start = html.rfind("<section", 0, m.start())
    end = html.find("</section>", m.start())
    if start < 0 or end < 0:
        return None
    return html[start:end]


fails = []
CITIES = json.loads((OUT.parent / "src" / "data" / "cities.json").read_text(encoding="utf-8"))
CITIES = CITIES if isinstance(CITIES, list) else CITIES.get("cities", [])
slugs = sorted(c["slug"] for c in CITIES)
pages = [OUT / "leistungen" / "entruempelung" / sl / "index.html" for sl in slugs]
for p in pages:
    if not p.is_file():
        fails.append("страницы нет в сборке: " + p.parent.name)
pages = [p for p in pages if p.is_file()]
for i, p in enumerate(pages):
    html = p.read_text(encoding="utf-8")
    sec = header_section(html)
    if mut_tel and i == 0 and sec:
        sec = sec.replace(TEL, 'href="#"')
    if not sec or TEL not in sec:
        fails.append("нет tel в шапке: " + p.parent.name)

ds = (OUT / "datenschutz" / "index.html").read_text(encoding="utf-8")
ds_text = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", ds.replace("<!-- -->", "")))
if mut_ds:
    ds_text = ds_text.replace("Umami Software, Inc.", "")
for phrase in ("Telefonnummer angetippt", "Link zu WhatsApp angeklickt", "Umami Software, Inc.",
               "Umami setzt keine Cookies", "IP-Adresse selbst wird nicht gespeichert",
               "Umami werden nach 6 Monaten gelöscht"):
    if phrase not in ds_text:
        fails.append("Datenschutz без фразы: " + phrase)
if "Plausible" in ds_text:
    fails.append("Datenschutz всё ещё упоминает Plausible")

# скрипт Umami на всех страницах сборки, Plausible нигде (проверяем главную и посадочную)
for rel in ("index.html", "leistungen/entruempelung/osnabrueck/index.html"):
    h = (OUT / rel).read_text(encoding="utf-8")
    if 'data-website-id="737c1d4b-d61a-4f3d-8957-2c1953e2879d"' not in h or "cloud.umami.is/script.js" not in h:
        fails.append("нет скрипта Umami: " + rel)
    if "plausible.io" in h:
        fails.append("остался Plausible: " + rel)

js = "".join(f.read_text(encoding="utf-8", errors="ignore") for f in (OUT / "_next").rglob("*.js"))
for lab in LABELS:
    if lab not in js:
        fails.append("метки нет в JS: " + lab)

print("страниц Entrümpelung проверено: %d" % len(pages))
for f in fails[:20]:
    print("FAIL", f)
ok = len(slugs) > 0 and not fails
print("RESULT: %s" % ("T013_F2_OK" if ok else "T013_F2_FAIL"))
sys.exit(0 if ok else 1)
