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
BUILD = os.path.join(ROOT, "site", "out")

# Landa, F-90: сторона «сайт» бралась с сетевого стейджинга, и ничто не
# связывало его с текущим исходником — доказательство держалось на слове
# исполнителя, что там та же сборка. Теперь снимается ЛОКАЛЬНАЯ сборка
# site/out, полученная из HEAD, и рядом печатается git-sha и возраст
# сборки (Закон 27, правило 2: среда замера фиксируется явно).
# Стейджинг можно снять поверх: RUH_SHOTS_LIVE=<url>.
LIVE_URL = os.environ.get("RUH_SHOTS_LIVE")

PAIRS = [
    ("index", "index.html", ""),
    ("leistungen", "leistungen.html", "leistungen/"),
    ("referenzen", "referenzen.html", "referenzen/"),
    ("ueber-uns", "ueber-uns.html", "ueber-uns/"),
    ("kontakt", "kontakt.html", "kontakt/"),
    ("city", "city-template.html", "leistungen/gartenpflege/osnabrueck/"),
]


def stamp():
    """git-sha исходника и возраст сборки — чтобы снимок нельзя было
    выдать за свежий."""
    import subprocess, time
    def sh(*a):
        try:
            return subprocess.run(a, cwd=ROOT, capture_output=True,
                                  text=True).stdout.strip()
        except Exception:
            return "?"
    sha = sh("git", "rev-parse", "--short", "HEAD")
    dirty = "с несохранёнными правками" if sh("git", "status", "--porcelain")         else "чисто"
    newest = 0
    for base, _dirs, files in os.walk(BUILD):
        for f in files:
            if f.endswith(".html"):
                newest = max(newest, os.path.getmtime(os.path.join(base, f)))
    age = (time.time() - newest) / 60 if newest else -1
    return sha, dirty, age


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
    # Полностраничный снимок разворачивает окно, и картинки с loading="lazy",
    # не попавшие в окно во время прокрутки, на снимке остаются пустыми —
    # причём по-разному от прогона к прогону. Снимаем ленивость и ждём, пока
    # ВСЕ картинки догрузятся: иначе «пусто» меряет расторопность браузера,
    # а не содержимое страницы.
    await page.evaluate("""async () => {
        // Блоки с анимацией появления ждут наблюдателя. При очень длинной
        // странице (375 — до 8000 px) прокрутка обгоняет его, и часть блоков
        // остаётся при opacity 0 — от прогона к прогону разная. Снимок должен
        // показывать УСТОЯВШЕЕСЯ состояние страницы, поэтому доводим их до
        // конца принудительно: правило действует только внутри снимка и
        // ничего не меняет ни в макете, ни на сайте.
        const st = document.createElement('style');
        st.textContent = '.reveal,[class*="reveal"]{opacity:1!important;'
                       + 'transform:none!important;transition:none!important}';
        document.head.appendChild(st);
        document.querySelectorAll('img[loading="lazy"]')
                .forEach(i => i.loading = 'eager');
        await Promise.all([...document.images]
            .filter(i => !i.complete)
            .map(i => new Promise(r => { i.onload = i.onerror = r; })));
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

    if LIVE_URL:
        live = LIVE_URL
        s_httpd = None
    else:
        s_handler = functools.partial(http.server.SimpleHTTPRequestHandler,
                                      directory=BUILD)
        s_handler.func.log_message = lambda *a, **k: None
        s_httpd = http.server.ThreadingHTTPServer(("127.0.0.1", 0), s_handler)
        threading.Thread(target=s_httpd.serve_forever, daemon=True).start()
        live = "http://127.0.0.1:%d/" % s_httpd.server_address[1]

    sha, dirty, age = stamp()
    print("МАКЕТ:", base)
    print("САЙТ :", live)
    print("ИСХОДНИК: HEAD %s, дерево %s; сборке %.0f мин"
          % (sha, dirty, age))

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
                                 ("live", live + live_rel)):
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
