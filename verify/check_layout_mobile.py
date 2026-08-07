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

OFFCANVAS_BP = 820  # @media (max-width: 820px) в css/style.css — ниже включается бургер
PW_PY = r"C:\Projects\HausBot\backend\.venv\Scripts\python.exe"

JS_OVERFLOW = """() => {
  // Landa (раунд 2): пропускать элемент только потому, что у предка есть overflow —
  // ошибка. Overflow предка значит лишь, что предок ОБРЕЖЕТ ребёнка, а не что сам
  // предок помещается. Из-за такого пропуска 232 из 417 элементов index.html
  // не проверялись, и блок width:3000px внутри .hero не ловился вовсе.
  // Теперь: у каждого элемента ищем ближайшего клиппера и сравниваем с ЕГО рамкой,
  // а сам клиппер обязан помещаться во вьюпорт.
  const vw = document.documentElement.clientWidth;
  const bad = [];
  const name = el => el.tagName + (el.className ? '.' + String(el.className).split(' ')[0] : '');

  // Цепочка клипперов до body; берём САМЫЙ ВЕРХНИЙ — именно он определяет,
  // вылезает ли что-то за пределы страницы. Промежуточные обрезки законны.
  // <svg> исключён: у него overflow:hidden по спецификации, это графика, не layout.
  const topClipper = el => {
    let top = null;
    for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
      if (a.tagName.toLowerCase() === 'svg') continue;
      const ox = getComputedStyle(a).overflowX;
      if (ox === 'auto' || ox === 'scroll' || ox === 'hidden' || ox === 'clip') top = a;
    }
    return top;
  };

  document.querySelectorAll('body *').forEach(el => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return;
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return;

    const clip = topClipper(el);
    if (clip) {
      if (getComputedStyle(clip).position === 'fixed') return;
      const cr = clip.getBoundingClientRect();
      // 1) сам клиппер обязан помещаться во вьюпорт
      if (cr.right > vw + 1) bad.push('CLIPPER:' + name(clip) + '@' + Math.round(cr.right));
      if (cr.left < -1) bad.push('CLIPPER_LEFT:' + name(clip) + '@' + Math.round(cr.left));
      // 2) Landa: обрезка hidden/clip молча съедает контент — это хуже скролла.
      //    Для слайдера (auto/scroll) вылет законен: пользователь листает.
      //    Для hidden/clip вылет допустим только декору (aria-hidden / pointer-events:none).
      const ox = getComputedStyle(clip).overflowX;
      if (ox !== 'auto' && ox !== 'scroll' && r.right > cr.right + 1) {
        const decorative = el.closest('[aria-hidden="true"]') !== null
          || cs.pointerEvents === 'none'
          || el.tagName.toLowerCase() === 'svg' || el.closest('svg') !== null;
        if (!decorative) {
          bad.push('CLIPPED:' + name(el) + '@' + Math.round(r.right) + '>' + Math.round(cr.right));
        }
      }
      return;
    }

    if (cs.position === 'fixed') return;          // fixed позиционируется от вьюпорта
    if (r.right > vw + 1) bad.push(name(el) + '@' + Math.round(r.right));
    // Landa: левое переполнение не проверялось вообще. Скрытые skip-ссылки
    // уводят далеко влево намеренно — их отсекаем по порогу.
    if (r.left < -1 && r.left > -2000 && r.width > 4) bad.push('LEFT:' + name(el) + '@' + Math.round(r.left));
  });

  // переполнение ТЕКСТОМ (nowrap-композит) бокс не расширяет — ловим отдельно
  document.querySelectorAll('body *').forEach(el => {
    if (el.children.length) return;
    if (el.tagName.toLowerCase() === 'svg' || el.closest('svg')) return;
    if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflowX === 'visible') {
      bad.push('TEXT_OVF:' + name(el) + '(' + el.scrollWidth + '>' + el.clientWidth + ')');
    }
  });

  return { width: vw, overflow: [...new Set(bad)].slice(0, 8) };
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
        # одна страница на весь прогон: пересоздание контекста на каждую ширину
        # стоило ~2 с и не давало уложиться в таймаут гейта
        ctx = await browser.new_context(viewport={"width": widths[0], "height": 900})
        page = await ctx.new_page()
        for width in widths:
            await page.set_viewport_size({"width": width, "height": 900})
            for f in pages:
                await page.goto("file:///" + os.path.abspath(f).replace("\\", "/"))
                await page.wait_for_timeout(120)
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
                if width <= OFFCANVAS_BP:  # брейкпоинт off-canvas из CSS, не на глаз
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
