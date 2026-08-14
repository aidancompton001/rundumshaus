# -*- coding: utf-8 -*-
"""Вес заголовков — по вычисленному стилю, а не по классу в разметке.

Landa, F-13: класс в HTML доказывает намерение, результат доказывает браузер.
Проверка обходит по одному представителю каждого рода страниц и требует
весов из макета: `docs/design/v1-desktop/css/tokens.css:56-57` —
H1 = 900, H2 = 800.

Представителем рода берётся САМЫЙ ДЛИННЫЙ путь (Landa F-15): дефекты
немецкой вёрстки рождаются длиной слова, и первый по алфавиту `alfhausen`
их не показывает, а `neuenkirchen-kreis-steinfurt` показывает.

Замер по HTTP: под file:// собранный сайт не находит свои файлы.

Использование:  py verify/check_type_weights.py [каталог] [ширина]
"""
import asyncio
import functools
import glob
import http.server
import os
import sys
import threading

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PW_PY = os.path.join(ROOT, "verify", ".venv", "Scripts", "python.exe")

# Landa, F-53: в макете H1 весит 900 ТОЛЬКО на главной. У внутренних страниц
# `.page-hero h1` переопределён на 800 (style.css:791-796), и прежняя единая
# константа 900 уводила сайт ОТ макета на пяти родах страниц — при этом
# служила доказательством соответствия. Замерено на самом макете.
WANT_H2 = 800
WANT_H1_HOME = 900      # index.html
WANT_H1_INNER = 800     # все страницы с тёмной шапкой .page-hero


def representatives(directory):
    """По одному представителю рода; внутри рода — самый длинный путь."""
    found = [p for p in glob.glob(os.path.join(directory, "**", "*.html"),
                                  recursive=True)
             if not os.path.basename(p).startswith("_")
             and os.sep + "_next" + os.sep not in p
             and os.sep + "admin" + os.sep not in p]
    kinds = {}
    for f in found:
        rel = os.path.relpath(f, directory).replace(os.sep, "/")
        parts = rel.split("/")
        kind = "/".join(parts[:2]) if len(parts) > 2 else rel
        prev = kinds.get(kind)
        if prev is None or len(rel) > len(prev):
            kinds[kind] = rel
    return sorted(kinds.values()), len(found)


async def run(directory, width):
    from playwright.async_api import async_playwright

    pages, total = representatives(directory)
    handler = functools.partial(http.server.SimpleHTTPRequestHandler,
                                directory=os.path.abspath(directory))
    handler.func.log_message = lambda *a, **k: None
    httpd = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    base = "http://127.0.0.1:%d/" % httpd.server_address[1]
    print("СРЕДА ЗАМЕРА: HTTP %s, ширина %d" % (base, width))
    print("РОДОВ СТРАНИЦ: %d (из %d файлов; админка клиента исключена — "
          "своей вёрстки не имеет)" % (len(pages), total))

    bad = 0
    async with async_playwright() as pw:
        browser = await pw.chromium.launch()
        page = await browser.new_page(viewport={"width": width, "height": 900})
        for rel in pages:
            await page.goto(base + rel)
            await page.wait_for_timeout(120)
            got = await page.evaluate("""() => {
              const out = {};
              for (const tag of ['h1', 'h2']) {
                out[tag] = [...document.querySelectorAll(tag)].map(
                  el => parseInt(getComputedStyle(el).fontWeight, 10));
              }
              return out;
            }""")
            want_h1 = WANT_H1_HOME if rel in ("index.html", "") else WANT_H1_INNER
            flags = []
            for tag, want in (("h1", want_h1), ("h2", WANT_H2)):
                wrong = [w for w in got[tag] if w != want]
                if wrong:
                    flags.append("%s: %s вместо %d" % (tag.upper(), wrong, want))
            if flags:
                bad += 1
                print("  %-46s %s" % (rel, " | ".join(flags)))
            else:
                print("  %-46s H1=%s H2=%s  OK"
                      % (rel, got["h1"] or "нет", got["h2"] or "нет"))
        await browser.close()
    httpd.shutdown()
    print("RESULT: %s" % ("TYPE_WEIGHTS_MATCH" if bad == 0
                          else "TYPE_WEIGHTS_OFF:%d" % bad))
    return 1 if bad else 0


def main():
    directory = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "site", "out")
    width = int(sys.argv[2]) if len(sys.argv) > 2 else 1440
    try:
        import playwright  # noqa: F401
    except ImportError:
        os.execv(PW_PY, [PW_PY, os.path.abspath(__file__), directory, str(width)])
    return asyncio.run(run(directory, width))


if __name__ == "__main__":
    sys.exit(main())
