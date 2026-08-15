# -*- coding: utf-8 -*-
"""Уезжает ли страница вбок — то, что чувствует посетитель.

Закон 27, правило 7: докладывается только то, что переживает живой человек.
Переполнение вложенного узла человеком не ощущается, если узел обрезан
родителем; ощущается — горизонтальная прокрутка страницы. Здесь меряется
именно она: ширина документа против ширины окна.

Замер идёт по HTTP, потому что собранный сайт ссылается на файлы от корня
(«/images/...») и под file:// они не резолвятся — мерилась бы не та страница.

Использование:  py verify/check_no_sideways.py [каталог] [ширина ...]
"""
import asyncio
import functools
import http.server
import os
import socketserver
import sys
import threading

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PW_PY = os.path.join(ROOT, "verify", ".venv", "Scripts", "python.exe")

# По одной странице каждого рода: главная, список услуг, форма, городская
# (их 490 — все из одного шаблона), статья. Проверять все 617 незачем:
# страницы одного рода рождаются одним компонентом.
PAGES = [
    "index.html",
    "leistungen/index.html",
    "kontakt/index.html",
    "leistungen/gartenpflege/osnabrueck/index.html",
    "ratgeber/index.html",
    "referenzen/index.html",
    "ueber-uns/index.html",
]


async def run(directory, widths):
    from playwright.async_api import async_playwright

    handler = functools.partial(http.server.SimpleHTTPRequestHandler,
                                directory=os.path.abspath(directory))
    # тихий сервер: журнал обращений в этом замере ничего не доказывает
    handler.func.log_message = lambda *a, **k: None
    httpd = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    base = "http://127.0.0.1:%d/" % httpd.server_address[1]
    print("СРЕДА ЗАМЕРА: HTTP %s (каталог %s)" % (base, directory))

    bad = 0
    async with async_playwright() as pw:
        browser = await pw.chromium.launch()
        for w in widths:
            page = await browser.new_page(viewport={"width": w, "height": 900})
            for rel in PAGES:
                if not os.path.exists(os.path.join(directory, rel.replace("/", os.sep))):
                    print("%5d  %-46s НЕТ ФАЙЛА" % (w, rel))
                    bad += 1
                    continue
                await page.goto(base + rel)
                await page.wait_for_timeout(200)
                r = await page.evaluate(
                    "() => ({dw: document.documentElement.scrollWidth,"
                    "        iw: window.innerWidth})")
                over = r["dw"] - r["iw"]
                ok = over <= 1
                bad += not ok
                print("%5d  %-46s %d/%d  %s"
                      % (w, rel, r["dw"], r["iw"],
                         "OK" if ok else "УЕЗЖАЕТ ВБОК на %d px" % over))
            await page.close()
        await browser.close()
    httpd.shutdown()
    print("RESULT: %s" % ("NO_SIDEWAYS_SCROLL" if bad == 0 else "SIDEWAYS:%d" % bad))
    return 1 if bad else 0


def main():
    directory = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "site", "out")
    # Ланда, раунд 8: дефект шапки жил на 1024-1279 именно потому, что
    # сторож ходил по 375, 768 и 1440, а между ними была дыра. Ширины
    # добраны по местам, где ломается немецкая вёрстка: сужение колонок
    # подвала и переход меню в бургер.
    widths = [int(x) for x in sys.argv[2:]] or [375, 768, 1024, 1100, 1280, 1440]
    try:
        import playwright  # noqa: F401
    except ImportError:
        os.execv(PW_PY, [PW_PY, os.path.abspath(__file__), directory]
                 + [str(w) for w in widths])
    return asyncio.run(run(directory, widths))


if __name__ == "__main__":
    sys.exit(main())
