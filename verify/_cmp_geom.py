# -*- coding: utf-8 -*-
"""Замер геометрии: ширина контейнера, высота шапки, кегль/начертание H1/H2,
цвет акцента. Печатает рядом с числом сам запрос."""
import asyncio
import functools
import http.server
import os
import threading

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MOCK = os.path.join(ROOT, "docs", "design", "v1-desktop")
LIVE = "https://2e1be0e5-a011-4411-b47f-f2e0e6b28bd8.clouding.host/rundumshaus/"

JS = """() => {
  const r = el => el ? el.getBoundingClientRect() : null;
  const cs = el => el ? getComputedStyle(el) : null;
  const out = {};
  const hdr = document.querySelector('header');
  out.header_h = hdr ? Math.round(r(hdr).height) : null;
  // ширина основного текстового контейнера: первый элемент с ограниченной шириной
  const main = document.querySelector('main');
  const firstSection = main && main.querySelector('section');
  const cont = firstSection && firstSection.firstElementChild;
  out.container_w = cont ? Math.round(r(cont).width) : null;
  const h1 = document.querySelector('h1');
  if (h1) {
    const c = cs(h1);
    out.h1 = {size: c.fontSize, weight: c.fontWeight, tt: c.textTransform,
              color: c.color, text: h1.innerText.slice(0,60)};
  }
  const h2 = document.querySelector('h2');
  if (h2) {
    const c = cs(h2);
    out.h2 = {size: c.fontSize, weight: c.fontWeight, tt: c.textTransform,
              text: h2.innerText.slice(0,60)};
  }
  out.body_font = cs(document.body).fontFamily;
  out.body_bg = cs(document.body).backgroundColor;
  const hero = document.querySelector('.hero, section');
  out.hero_h = hero ? Math.round(r(hero).height) : null;
  out.h2_count = document.querySelectorAll('h2').length;
  out.h2_texts = [...document.querySelectorAll('h2')].map(e => e.innerText.trim().slice(0,45));
  return out;
}"""

PAIRS = [("index", "index.html", ""),
         ("leistungen", "leistungen.html", "leistungen/"),
         ("referenzen", "referenzen.html", "referenzen/"),
         ("ueber-uns", "ueber-uns.html", "ueber-uns/"),
         ("kontakt", "kontakt.html", "kontakt/"),
         ("city", "city-template.html", "leistungen/gartenpflege/osnabrueck/")]


async def main():
    from playwright.async_api import async_playwright
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=MOCK)
    handler.func.log_message = lambda *a, **k: None
    httpd = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    base = "http://127.0.0.1:%d/" % httpd.server_address[1]
    print("ЗАПРОС: page.evaluate(JS) при viewport 1440x900, макет по HTTP %s" % base)
    async with async_playwright() as pw:
        b = await pw.chromium.launch()
        p = await b.new_page(viewport={"width": 1440, "height": 900})
        for name, mrel, lrel in PAIRS:
            for tag, url in (("mock", base + mrel), ("live", LIVE + lrel)):
                await p.goto(url, wait_until="networkidle", timeout=60000)
                d = await p.evaluate(JS)
                print("\n--- %s / %s ---" % (name, tag))
                for k, v in d.items():
                    print("   %-12s %s" % (k, v))
        await b.close()

asyncio.run(main())
