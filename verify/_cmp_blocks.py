# -*- coding: utf-8 -*-
"""Наличие блоков макета на живом сайте — по признаку, который видит браузер,
а не по имени класса (сайт на Tailwind, имена классов другие)."""
import asyncio
import functools
import http.server
import os
import threading

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MOCK = os.path.join(ROOT, "docs", "design", "v1-desktop")
LIVE = "https://2e1be0e5-a011-4411-b47f-f2e0e6b28bd8.clouding.host/rundumshaus/"

JS = r"""() => {
  const all = [...document.querySelectorAll('*')];
  const txt = document.body.innerText;
  const has = sel => !!document.querySelector(sel);
  const r = {};
  // волна между секциями: img/svg с "brush"/"wave" в src или классе
  r.brush = all.some(e => /brush|wave|welle/i.test(
      (e.getAttribute && (e.getAttribute('src')||'') + ' ' + (e.className.baseVal||e.className||'')) || ''));
  // водяной знак: элемент с opacity 0.02..0.12, position absolute, крупный
  r.watermark = all.some(e => {
      const c = getComputedStyle(e); const b = e.getBoundingClientRect();
      return c.position === 'absolute' && parseFloat(c.opacity) > 0.01 &&
             parseFloat(c.opacity) < 0.15 && b.width > 150 && b.height > 150;
  });
  // рукописный декор: font-family с cursive/handwriting/Caveat
  r.handwriting = all.some(e => /cursive|caveat|handwr|segoe script|comic/i.test(
      getComputedStyle(e).fontFamily));
  // eyebrow: uppercase мелкий текст с letter-spacing над заголовком
  r.eyebrow_count = all.filter(e => {
      const c = getComputedStyle(e);
      return c.textTransform === 'uppercase' && parseFloat(c.letterSpacing) > 0.5 &&
             parseFloat(c.fontSize) <= 16 && e.children.length === 0 &&
             (e.textContent||'').trim().length > 2;
  }).length;
  // heading-divider: линия-точка-линия
  r.heading_divider = all.some(e => {
      const b = e.getBoundingClientRect();
      const c = getComputedStyle(e);
      return c.borderRadius && b.width >= 6 && b.width <= 12 && b.height >= 6 &&
             b.height <= 12 && parseFloat(c.borderRadius) >= 3 &&
             c.backgroundColor !== 'rgba(0, 0, 0, 0)' && e.children.length === 0;
  });
  // круглые иконки контактов в футере (44/40px круг с рамкой)
  const foot = document.querySelector('footer');
  r.footer_icon_circles = foot ? [...foot.querySelectorAll('*')].filter(e => {
      const b = e.getBoundingClientRect(); const c = getComputedStyle(e);
      return Math.abs(b.width-b.height) < 3 && b.width >= 30 && b.width <= 50 &&
             parseFloat(c.borderRadius) >= b.width/2 - 1;
  }).length : 0;
  // вертикальные разделители колонок футера
  r.footer_col_borders = foot ? [...foot.querySelectorAll('*')].filter(e => {
      const c = getComputedStyle(e);
      return parseFloat(c.borderLeftWidth) > 0 &&
             c.borderLeftStyle === 'solid';
  }).length : 0;
  // плавающая кнопка WhatsApp
  r.fab = all.some(e => getComputedStyle(e).position === 'fixed' &&
      e.getBoundingClientRect().width > 40 &&
      e.getBoundingClientRect().width < 80 &&
      parseFloat(getComputedStyle(e).borderRadius) > 20);
  // stats: иконки внутри блока статистики
  r.stat_icons = (() => {
      const el = [...document.querySelectorAll('*')].find(e =>
          /100\s*%/.test(e.textContent||'') && (e.textContent||'').includes('24h'));
      return el ? el.querySelectorAll('svg').length : -1;
  })();
  r.skip_link = has('a[href="#main"], a[href^="#main"]');
  r.select_leistung = has('select');
  r.form_labels = document.querySelectorAll('form label').length;
  r.text_has_direkt_note = /Direkt & persönlich für Sie da!/.test(txt);
  return r;
}"""

PAIRS = [("index", "index.html", ""),
         ("ueber-uns", "ueber-uns.html", "ueber-uns/"),
         ("kontakt", "kontakt.html", "kontakt/")]


async def main():
    from playwright.async_api import async_playwright
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=MOCK)
    handler.func.log_message = lambda *a, **k: None
    httpd = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    base = "http://127.0.0.1:%d/" % httpd.server_address[1]
    print("ЗАПРОС: page.evaluate(JS-детекторы) 1440x900; макет по HTTP", base)
    async with async_playwright() as pw:
        b = await pw.chromium.launch()
        p = await b.new_page(viewport={"width": 1440, "height": 900})
        for name, mrel, lrel in PAIRS:
            res = {}
            for tag, url in (("mock", base + mrel), ("live", LIVE + lrel)):
                await p.goto(url, wait_until="networkidle", timeout=60000)
                await p.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                await p.wait_for_timeout(1200)
                await p.evaluate("window.scrollTo(0, 0)")
                res[tag] = await p.evaluate(JS)
            print("\n=== %s ===" % name)
            for k in res["mock"]:
                m, l = res["mock"][k], res["live"][k]
                mark = "  " if m == l else "<>"
                print("  %s %-22s mock=%-8s live=%s" % (mark, k, m, l))
        await b.close()

asyncio.run(main())
