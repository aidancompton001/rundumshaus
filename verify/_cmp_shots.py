# -*- coding: utf-8 -*-
"""Снимает попарно макет (локальный HTTP) и живой стейджинг в 1440 и 375.
Кладёт в _cmp/. Только съёмка, без выводов."""
import asyncio
import functools
import http.server
import os
import sys
import threading

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MOCK = os.path.join(ROOT, "docs", "design", "v1-desktop")
OUT = os.path.join(ROOT, "_cmp")
LIVE = "https://2e1be0e5-a011-4411-b47f-f2e0e6b28bd8.clouding.host/rundumshaus/"

PAIRS = [
    ("index", "index.html", ""),
    ("leistungen", "leistungen.html", "leistungen/"),
    ("referenzen", "referenzen.html", "referenzen/"),
    ("ueber-uns", "ueber-uns.html", "ueber-uns/"),
    ("kontakt", "kontakt.html", "kontakt/"),
    ("city", "city-template.html", "leistungen/gartenpflege/osnabrueck/"),
]


async def shoot(page, url, path):
    await page.goto(url, wait_until="networkidle", timeout=60000)
    # прокрутить до конца, чтобы сработали lazy/scroll-анимации
    await page.evaluate("""async () => {
        const step = window.innerHeight;
        for (let y = 0; y < document.body.scrollHeight; y += step) {
            window.scrollTo(0, y);
            await new Promise(r => setTimeout(r, 180));
        }
        window.scrollTo(0, 0);
        await new Promise(r => setTimeout(r, 400));
    }""")
    await page.wait_for_timeout(900)
    await page.screenshot(path=path, full_page=True)
    h = await page.evaluate("document.body.scrollHeight")
    return h


async def main():
    from playwright.async_api import async_playwright
    os.makedirs(OUT, exist_ok=True)
    handler = functools.partial(http.server.SimpleHTTPRequestHandler,
                                directory=MOCK)
    handler.func.log_message = lambda *a, **k: None
    httpd = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    base = "http://127.0.0.1:%d/" % httpd.server_address[1]
    print("МАКЕТ:", base)
    print("САЙТ :", LIVE)

    async with async_playwright() as pw:
        browser = await pw.chromium.launch()
        for width in (1440, 375):
            ctx = await browser.new_context(
                viewport={"width": width, "height": 900},
                device_scale_factor=1,
                is_mobile=(width == 375),
                has_touch=(width == 375))
            page = await ctx.new_page()
            for name, mock_rel, live_rel in PAIRS:
                for tag, url in (("mock", base + mock_rel),
                                 ("live", LIVE + live_rel)):
                    p = os.path.join(OUT, "%s_%s_%d.png" % (name, tag, width))
                    try:
                        h = await shoot(page, url, p)
                        print("%-12s %s %4d  height=%d" % (name, tag, width, h))
                    except Exception as e:
                        print("%-12s %s %4d  FAIL %s" % (name, tag, width, e))
                    sys.stdout.flush()
            await ctx.close()
        await browser.close()


asyncio.run(main())
