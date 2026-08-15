# -*- coding: utf-8 -*-
"""Сверка сайта с макетом по тому, что числа до сих пор не охраняли.

Ланда, раунд 6, «дыры покрытия»: видимость призыва в шапке по ширинам
(F-71), горизонтальное положение текстовой колонки и выключка заголовка
призыва на городских (F-72, F-73). Ни одна прежняя проверка этого не
видела, поэтому дефекты жили шесть раундов.

Мерятся ОБЕ стороны в одной среде: макет и сборка поднимаются по HTTP
локально, замер один и тот же (Закон 27, правило 2 — среду фиксируем
явно на обеих сторонах, иначе сверяется среда, а не данные).

Использование:  py verify/check_vs_mockup.py [каталог сборки]
"""
import asyncio
import functools
import http.server
import os
import sys
import threading

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MOCK = os.path.join(ROOT, "docs", "design", "v1-desktop")

# Городская страница: та же услуга и город, что и в прежних замерах.
CITY_SITE = "leistungen/gartenpflege/osnabrueck/index.html"
CITY_MOCK = "city-template.html"

# Сверяется ЦЕНТР колонки, а не её левый край. Ширина колонки задана в ch
# и зависит от шрифта: 76ch макета — 656 px, 76ch сайта — 767 px. При
# одинаковом центре левые края у них расходятся на 56 px просто из-за
# ширины, и сверка по левому краю ловила бы смену шрифта, а не съехавшую
# вёрстку. Охраняемая величина — центрирование (Закон 27, правило 5):
# до правки центр колонки сайта стоял на 495 против 720 у макета,
# после — 719,5 против 720.
# Допуск 40 px на порядок меньше разъезда, который ловим (225 px).
POS_TOL = 40

# Landa, F-85: перевод сверки на центр отдал ШИРИНУ колонки без охраны —
# подлог «колонка сужена до 22ch, центр сохранён» проходил как совпадение.
# Ширина сверяется в ЗНАКАХ, а не в пикселях: в пикселях 76ch макета и
# 76ch сайта это 656 и 767, разные шрифты дают разный знак. Допуск 8
# знаков — вчетверо меньше разрыва, который ловим (76 против 22).
#
# Правило про знаки годится ТОЛЬКО для колонки текста: её ширина и задана
# в ch. Плашка призыва тянется во всю ширину контейнера, она задана в
# пикселях, и мерить её в знаках значило бы сравнивать кегль заголовка,
# а не вёрстку. Поэтому у неё сверяется ширина в пикселях: макет 1200,
# сайт 1152 — те самые лишние 24 px поля с каждой стороны (F-84).
CH_TOL = 8
WIDTH_TOL_PX = 40

JS_HEADER_CTA = """() => {
  const h = document.querySelector('header');
  if (!h) return {found: 0, visible: 0};
  const links = [...h.querySelectorAll('a[href^="tel:"], a[href*="wa.me"]')];
  const vis = links.filter(a => {
    const b = a.getBoundingClientRect();
    const cs = getComputedStyle(a);
    return b.width > 0 && b.height > 0
        && cs.display !== 'none' && cs.visibility !== 'hidden';
  });
  return {found: links.length, visible: vis.length};
}"""

# Заголовки городской страницы делятся на два вида: заголовок раздела в
# колонке текста и заголовок призыва в тёмной плашке. Делить по ширине
# нельзя: колонка задана в ch, а ch зависит от шрифта — 76ch макета это
# 656 px, 76ch сайта 767 px, и любой порог по ширине сравнивал бы шрифты,
# а не вёрстку. Делим по фону ближайшего непрозрачного предка: тёмный
# фон — призыв, светлый — текст.
JS_CITY = """() => {
  const lum = c => {
    const m = c.match(/rgba?\\(([^)]+)\\)/);
    if (!m) return null;
    const p = m[1].split(',').map(Number);
    if (p.length > 3 && p[3] === 0) return null;   // прозрачный — не считается
    return 0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2];
  };
  const onDark = el => {
    for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
      const l = lum(getComputedStyle(n).backgroundColor);
      if (l !== null) return l < 128;
    }
    return false;
  };
  // Ширина колонки задана в ch, а ch — это ширина знака в ЕЁ шрифте.
  // Меряем ширину знака на месте и переводим пиксели в знаки: тогда
  // 76ch макета и 76ch сайта сравнимы, хотя в пикселях это 656 и 767.
  const chPx = el => {
    const probe = document.createElement('span');
    probe.textContent = '0'.repeat(100);
    const cs = getComputedStyle(el);
    probe.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;'
      + 'font:' + cs.font;
    if (!cs.font) {
      probe.style.fontFamily = cs.fontFamily;
      probe.style.fontSize = cs.fontSize;
      probe.style.fontWeight = cs.fontWeight;
    }
    document.body.appendChild(probe);
    const w = probe.getBoundingClientRect().width / 100;
    probe.remove();
    return w;
  };
  const out = {prose: null, cta: null};
  for (const h of document.querySelectorAll('h2')) {
    const b = h.getBoundingClientRect();
    if (b.width === 0 || b.height === 0) continue;
    const unit = chPx(h.parentElement || h);
    const rec = {left: Math.round(b.left), width: Math.round(b.width),
                 ch: unit > 0 ? Math.round(b.width / unit) : null,
                 align: getComputedStyle(h).textAlign,
                 text: h.textContent.trim().slice(0, 40)};
    const slot = onDark(h) ? 'cta' : 'prose';
    if (!out[slot]) out[slot] = rec;
  }
  return out;
}"""


def serve(directory):
    handler = functools.partial(http.server.SimpleHTTPRequestHandler,
                                directory=os.path.abspath(directory))
    handler.func.log_message = lambda *a, **k: None
    httpd = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd, "http://127.0.0.1:%d/" % httpd.server_address[1]


async def run(out_dir):
    from playwright.async_api import async_playwright

    m_httpd, m_base = serve(MOCK)
    s_httpd, s_base = serve(out_dir)
    print("СРЕДА ЗАМЕРА: макет %s | сборка %s (%s)" % (m_base, s_base, out_dir))
    bad = 0

    async with async_playwright() as pw:
        browser = await pw.chromium.launch()

        # --- F-71: призыв в шапке по ширинам -------------------------------
        print("ПРИЗЫВ В ШАПКЕ (a[href^=tel:] или a[href*=wa.me] внутри header)")
        for width in (375, 768, 1440):
            ctx = await browser.new_context(
                viewport={"width": width, "height": 900},
                is_mobile=(width == 375), has_touch=(width == 375))
            page = await ctx.new_page()
            got = {}
            for tag, url in (("макет", m_base + "index.html"),
                             ("сайт", s_base + "index.html")):
                await page.goto(url)
                await page.wait_for_timeout(150)
                got[tag] = await page.evaluate(JS_HEADER_CTA)
            ok = got["сайт"]["visible"] >= 1 and got["макет"]["visible"] >= 1
            if not ok:
                bad += 1
            print("  %4d  макет всего %d видимых %d | сайт всего %d видимых %d  %s"
                  % (width, got["макет"]["found"], got["макет"]["visible"],
                     got["сайт"]["found"], got["сайт"]["visible"],
                     "OK" if ok else "ПРИЗЫВ СПРЯТАН"))
            await ctx.close()

        # --- F-72, F-73: положение колонки и выключка призыва --------------
        print("ГОРОДСКАЯ, viewport 1440: колонка текста и заголовок призыва")
        ctx = await browser.new_context(viewport={"width": 1440, "height": 900})
        page = await ctx.new_page()
        geo = {}
        for tag, url in (("макет", m_base + CITY_MOCK),
                         ("сайт", s_base + CITY_SITE)):
            await page.goto(url)
            await page.wait_for_timeout(250)
            # разбудить анимации появления
            await page.evaluate("window.scrollTo(0, document.body.scrollHeight);")
            await page.wait_for_timeout(400)
            await page.evaluate("window.scrollTo(0, 0);")
            await page.wait_for_timeout(300)
            geo[tag] = await page.evaluate(JS_CITY)
        for slot, human in (("prose", "колонка текста"), ("cta", "призыв")):
            for tag in ("макет", "сайт"):
                g = geo[tag][slot]
                print("  %-14s %-6s left=%s width=%s (%s знаков) align=%s  «%s»"
                      % (human, tag, g and g["left"], g and g["width"],
                         g and g["ch"], g and g["align"], g and g["text"]))
            a, b = geo["макет"][slot], geo["сайт"][slot]
            if not a or not b:
                bad += 1
                print("  %-14s ЗАМЕР НЕ СОСТОЯЛСЯ: H2 не найден на одной из "
                      "сторон" % human)
                continue
            d = abs((a["left"] + a["width"] / 2) - (b["left"] + b["width"] / 2))
            ok_pos = d <= POS_TOL
            ok_align = a["align"] == b["align"]
            if slot == "prose":
                got, want, unit = a.get("ch"), b.get("ch"), "знаков"
                tol = CH_TOL
            else:
                got, want, unit = a["width"], b["width"], "px"
                tol = WIDTH_TOL_PX
            ok_ch = (got is not None and want is not None
                     and abs(got - want) <= tol)
            if not (ok_pos and ok_align and ok_ch):
                bad += 1
            why = ("OK" if ok_pos and ok_align and ok_ch else
                   "НЕ ТАМ" if not ok_pos else
                   "ВЫКЛЮЧКА ИНАЯ" if not ok_align else
                   "ШИРИНА ИНАЯ")
            print("  %-14s центр %.0f px (допуск %d); ширина %s против %s "
                  "%s (допуск %d); выключка макет=%s сайт=%s — %s"
                  % (human, d, POS_TOL, got, want, unit, tol,
                     a["align"], b["align"], why))
        await ctx.close()
        await browser.close()

    m_httpd.shutdown()
    s_httpd.shutdown()
    print("RESULT: %s" % ("MOCKUP_MATCH" if bad == 0 else "MOCKUP_OFF:%d" % bad))
    return 1 if bad else 0


def main():
    out_dir = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "site", "out")
    if not os.path.isfile(os.path.join(out_dir, CITY_SITE)):
        print("ОХВАТ ПУСТ: нет %s — сверять нечего" % CITY_SITE)
        print("RESULT: MOCKUP_NO_COVERAGE")
        return 1
    return asyncio.run(run(out_dir))


if __name__ == "__main__":
    sys.exit(main())
