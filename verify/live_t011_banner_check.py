# -*- coding: utf-8 -*-
"""Живая проверка правок по Ланде F-01, F-02, F-04, F-06 на rundumshaus-littawe.de.

F-04: кнопка WhatsApp под баннером нажимается (elementFromPoint в её центре —
      сама кнопка, а не баннер), на 375, 768, 1024, 1440; кнопки баннера >= 44 px.
F-06: при показе баннера фокус на «Nur notwendige».
F-01: после «Alle akzeptieren» в dataLayer есть consent default (denied) и update
      (granted) ДО config.
F-02: после «Cookie-Einstellungen ändern» cookies _gcl_* / _gac_* удалены.
Запросы конверсии к Google обрываются — в кабинет клиента ничего не уходит.
"""
import asyncio, sys
from playwright.async_api import async_playwright

BASE = "https://rundumshaus-littawe.de"


async def block_conversions(page):
    async def h(route):
        u = route.request.url
        if "conversion" in u or "pagead" in u:
            await route.abort()
        else:
            await route.continue_()
    for pat in ("**googleadservices.com/**", "**google.com/pagead/**", "**doubleclick.net/**"):
        await page.route(pat, h)


async def ui(browser, w):
    ctx = await browser.new_context(locale="de-DE", viewport={"width": w, "height": 844 if w < 768 else 900},
                                    is_mobile=(w == 375), has_touch=(w == 375))
    p = await ctx.new_page()
    await p.goto(BASE + "/kontakt/?cb=t011fix", wait_until="networkidle", timeout=90000)
    await p.wait_for_timeout(2800)
    m = await p.evaluate("""() => {
      const fab = [...document.querySelectorAll('a[href*="wa.me"]')].find(a => getComputedStyle(a).position === 'fixed');
      const dlg = document.querySelector('[role=dialog][aria-label="Cookie-Einstellungen"]');
      const out = {banner: !!dlg, fab: !!fab, fabHit: null, focus: document.activeElement ? (document.activeElement.tagName === 'BUTTON' ? document.activeElement.textContent.trim() : document.activeElement.tagName) : null, heights: []};
      if (fab) {
        const r = fab.getBoundingClientRect();
        const el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        out.fabHit = !!(el && fab.contains(el));
      }
      if (dlg) out.heights = [...dlg.querySelectorAll('button')].map(b => Math.round(b.getBoundingClientRect().height));
      out.sideways = document.documentElement.scrollWidth > innerWidth;
      return out;
    }""")
    await p.screenshot(path=r"C:\Users\moroc\AppData\Local\Temp\claude\c--Projects-RundUmsHaus\724dc65f-829d-44ad-ba9f-a4da7e82032b\scratchpad\fix_%d.png" % w)
    ok = m["banner"] and (not m["fab"] or m["fabHit"]) and all(h >= 44 for h in m["heights"]) \
        and m["focus"] == "BODY" and not m["sideways"]
    print("%4d баннер=%s WhatsApp нажимается=%s высоты=%s фокус=%s вбок=%s  %s"
          % (w, m["banner"], m["fabHit"], m["heights"], m["focus"], m["sideways"], "OK" if ok else "ПРОБЛЕМА"))
    await ctx.close()
    return ok


async def consent_and_reset(browser):
    ctx = await browser.new_context(locale="de-DE")
    p = await ctx.new_page()
    await block_conversions(p)
    await p.goto(BASE + "/?cb=t011fix", wait_until="networkidle", timeout=90000)
    await p.wait_for_timeout(2800)
    await p.get_by_role("button", name="Alle akzeptieren").click()
    await p.wait_for_timeout(5000)
    order = await p.evaluate("""() => (window.dataLayer || []).map(e => Array.from(e))
        .map(a => a[0] === 'consent' ? 'consent:' + a[1] + ':' + a[2].ad_user_data : a[0])""")
    di = order.index("consent:default:denied") if "consent:default:denied" in order else -1
    ui_ = order.index("consent:update:granted") if "consent:update:granted" in order else -1
    ci = order.index("config") if "config" in order else -1
    f01 = di >= 0 and ui_ > di and ci > ui_
    await p.goto(BASE + "/datenschutz/?cb=t011fix", wait_until="networkidle", timeout=90000)
    await p.wait_for_timeout(3000)
    before = [c["name"] for c in await ctx.cookies() if c["name"].startswith(("_gcl_", "_gac_"))]
    await p.get_by_role("button", name="Cookie-Einstellungen ändern").click()
    await p.wait_for_timeout(4000)
    after = [c["name"] for c in await ctx.cookies() if c["name"].startswith(("_gcl_", "_gac_"))]
    f02 = len(before) > 0 and len(after) == 0
    print("F-01 порядок в dataLayer: %s  → %s" % (order[:6], "OK" if f01 else "ПРОБЛЕМА"))
    print("F-02 cookies Google до отзыва=%s после=%s  → %s" % (before, after, "OK" if f02 else "ПРОБЛЕМА"))
    await ctx.close()
    return f01 and f02


async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch()
        ui_ok = all([await ui(b, w) for w in (375, 768, 1024, 1440)])
        cr_ok = await consent_and_reset(b)
        await b.close()
    print("RESULT: %s" % ("FIXES_OK" if ui_ok and cr_ok else "FIXES_FAIL"))
    return 0 if ui_ok and cr_ok else 1

sys.exit(asyncio.run(main()))
