# -*- coding: utf-8 -*-
"""Снимает попарно макет (локальный HTTP) и живой стейджинг в 1440 и 375.
Кладёт в _cmp/.

Landa, F-70: снимок, которым доказывают «выглядит как макет», сам ничем не
проверялся. Комплект, снятый на скорую руку без прокрутки, оказался в
основном белым — блоки с анимацией появления остались при opacity 0, и
ревьюер сравнивал бы белое с белым. Поэтому здесь два отбойника:
прокрутка перед съёмкой (была) и ЗАМЕР ПУСТОТЫ после съёмки (новое) —
снимок с долей пустых строк выше порога доказательством не считается,
и прогон завершается с ненулевым кодом.
"""
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


# Доля строк пикселей, у которых разброс яркости ниже BLANK_STD, — мера
# пустоты снимка. Пороги не выдуманы, а разделяют два ЗАМЕРЕННЫХ множества
# (12 снимков в каждом, команда — эта же функция blankness):
#   годный комплект (снят отсюда, с прокруткой): доля 29,7…54,4 %,
#       самый длинный сплошной участок 130…238 px
#   негодный комплект (снят без прокрутки, F-70): доля 33,3…80,5 %,
#       участок 130…3524 px
# Порог доли 60 % оставляет годному запас 5,6 пункта; порог участка 500 px
# оставляет запас вдвое и при этом ловит ueber-uns (678 px), который по доле
# проскочил бы. Один показатель не разделяет множества, два — разделяют.
BLANK_STD = 2.0
BLANK_MAX_SHARE = 0.60
BLANK_MAX_RUN = 500


def blankness(path):
    """(доля пустых строк, самый длинный сплошной пустой участок в px)."""
    import numpy as np
    from PIL import Image
    ar = np.asarray(Image.open(path).convert("L"), dtype=np.float32)
    flat = ar.std(axis=1) < BLANK_STD
    share = float(flat.mean()) if flat.size else 1.0
    run = best = 0
    for v in flat:
        run = run + 1 if v else 0
        best = max(best, run)
    return share, best


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
                        share, run = blankness(p)
                        verdict = "OK"
                        if share > BLANK_MAX_SHARE or run > BLANK_MAX_RUN:
                            verdict = "ПУСТОЙ — не доказательство"
                            bad.append((os.path.basename(p), share, run))
                        print("%-12s %s %4d  height=%-6d пусто %4.1f%% "
                              "макс.участок %5d px  %s"
                              % (name, tag, width, h, share * 100, run, verdict))
                    except Exception as e:
                        bad.append((os.path.basename(p), -1.0, -1))
                        print("%-12s %s %4d  FAIL %s" % (name, tag, width, e))
                    sys.stdout.flush()
            await ctx.close()
        await browser.close()

    print("ПОРОГ ПУСТОТЫ: доля пустых строк > %.0f%% или сплошной участок "
          "> %d px" % (BLANK_MAX_SHARE * 100, BLANK_MAX_RUN))
    if bad:
        print("НЕГОДНЫХ СНИМКОВ: %d" % len(bad))
        for n, s, r in bad:
            print("  %s  пусто %.1f%%  участок %d px" % (n, s * 100, r))
        print("RESULT: SHOTS_BLANK:%d" % len(bad))
        return 1
    print("RESULT: SHOTS_USABLE")
    return 0


bad = []
sys.exit(asyncio.run(main()))
