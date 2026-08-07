# -*- coding: utf-8 -*-
"""ПРУФ МОБИЛЬНОГО ЛЕЙАУТА через Playwright (T008).

Заменяет check_no_hscroll.py, который Landa признал негодным по двум причинам:
  L-A: headless-Chrome на Windows клампит окно до ~500 px, поэтому
       заявленные 375 px НИКОГДА не измерялись (реально было 485).
       Здесь viewport задаётся эмуляцией устройства — 375 значит 375.
  L-B: критерий scrollWidth <= clientWidth нефальсифицируем, если у страницы
       стоит overflow-x: clip/hidden — обрезка молча съедает контент и
       проверка всё равно говорит OK (Landa доказал вставкой width:3000px).
       Здесь меряется ГЕОМЕТРИЯ ЭЛЕМЕНТОВ: getBoundingClientRect().right,
       которую clip не подделывает.

Дополнительно проверяются вещи, которые Landa назвал непокрытыми:
  - битые картинки (naturalWidth == 0)
  - sticky-шапка реально липнет после скролла
  - ссылки закрытого off-canvas меню не в tab-порядке

Usage: py verify/check_layout_mobile.py <dir-с-html> [ширины]
Код возврата: 0 — всё чисто, 1 — есть нарушения.
"""
import asyncio
import glob
import os
import sys

PW_PY = r"C:\Projects\HausBot\backend\.venv\Scripts\python.exe"

JS_OVERFLOW = """() => {
  const w = document.documentElement.clientWidth;
  const bad = [];
  document.querySelectorAll('body *').forEach(el => {
    const cs = getComputedStyle(el);
    if (cs.position === 'fixed' || cs.display === 'none' || cs.visibility === 'hidden') return;
    // Элемент не считается переполнением страницы, если какой-то ПРОМЕЖУТОЧНЫЙ предок
    // (не html/body) сам обрабатывает горизонталь: слайдер (auto/scroll) листается
    // пользователем, а hidden/clip визуально обрезает декор (напр. водяной знак).
    // html/body сознательно исключены: overflow на них маскирует настоящие дефекты —
    // именно так пряталось переполнение до этой проверки (находка Landa).
    for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
      const ax = getComputedStyle(a).overflowX;
      if (ax === 'auto' || ax === 'scroll' || ax === 'hidden' || ax === 'clip') return;
    }
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return;
    if (r.right > w + 1) bad.push(el.tagName + '.' + (el.className || '').toString().split(' ')[0] + '@' + Math.round(r.right));
  });
  return { width: w, overflow: bad.slice(0, 8) };
}"""

JS_IMAGES = """() => {
  const imgs = [...document.images];
  return { total: imgs.length, broken: imgs.filter(i => i.complete && i.naturalWidth === 0).length };
}"""

JS_STICKY = """() => {
  const h = document.querySelector('.site-header');
  if (!h) return { found: false };
  const before = h.getBoundingClientRect().top;
  window.scrollTo(0, 1200);
  const after = h.getBoundingClientRect().top;
  window.scrollTo(0, 0);
  return { found: true, before: Math.round(before), after: Math.round(after) };
}"""

JS_TABBABLE = """() => {
  const nav = document.querySelector('.main-nav');
  if (!nav) return { found: false };
  const open = nav.dataset.open === 'true';
  const sel = 'a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"])';
  const items = [...nav.querySelectorAll(sel)].filter(el => {
    const cs = getComputedStyle(el);
    return cs.visibility !== 'hidden' && cs.display !== 'none';
  });
  return { found: true, open, tabbable: items.length };
}"""


async def run(directory, widths):
    from playwright.async_api import async_playwright

    pages = sorted(glob.glob(os.path.join(directory, "*.html")))
    pages = [p for p in pages if not os.path.basename(p).startswith("_")]
    problems = 0

    async with async_playwright() as pw:
        browser = await pw.chromium.launch()
        for width in widths:
            ctx = await browser.new_context(viewport={"width": width, "height": 900})
            page = await ctx.new_page()
            for f in pages:
                await page.goto("file:///" + os.path.abspath(f).replace("\\", "/"))
                await page.wait_for_timeout(400)
                ovf = await page.evaluate(JS_OVERFLOW)
                img = await page.evaluate(JS_IMAGES)
                line = "%4d  %-22s viewport=%d" % (width, os.path.basename(f), ovf["width"])
                flags = []
                if ovf["width"] != width:
                    flags.append("VIEWPORT_MISMATCH")
                if ovf["overflow"]:
                    flags.append("OVERFLOW:" + ",".join(ovf["overflow"]))
                if img["broken"]:
                    flags.append("BROKEN_IMG:%d/%d" % (img["broken"], img["total"]))
                if width <= 900 and os.path.basename(f) == "index.html":
                    tab = await page.evaluate(JS_TABBABLE)
                    if tab.get("found") and not tab["open"] and tab["tabbable"] > 0:
                        flags.append("CLOSED_NAV_TABBABLE:%d" % tab["tabbable"])
                st = await page.evaluate(JS_STICKY)
                if st.get("found") and st["after"] != 0:
                    flags.append("STICKY_BROKEN(top=%d)" % st["after"])
                if flags:
                    problems += 1
                    print(line + "  " + " | ".join(flags))
                else:
                    print(line + "  OK")
            await ctx.close()
        await browser.close()

    print("RESULT: %s" % ("LAYOUT_CLEAN" if problems == 0 else "PROBLEMS:%d" % problems))
    return 1 if problems else 0


def main():
    directory = sys.argv[1] if len(sys.argv) > 1 else "docs/design/v1-desktop"
    widths = [int(w) for w in sys.argv[2:]] or [375, 768, 1440]
    if "playwright" not in sys.modules:
        try:
            import playwright  # noqa: F401
        except ImportError:
            os.execv(PW_PY, [PW_PY, os.path.abspath(__file__), directory] + [str(w) for w in widths])
    return asyncio.run(run(directory, widths))


if __name__ == "__main__":
    sys.exit(main())
