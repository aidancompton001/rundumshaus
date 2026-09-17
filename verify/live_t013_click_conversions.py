# -*- coding: utf-8 -*-
"""T013 Ф2: клики по телефону и WhatsApp как конверсии — сквозная проверка без боевых последствий.

- запросы конверсий к Google перехватываются и ОБРЫВАЮТСЯ: в кабинет Кевина ничего не попадает;
- переход на wa.me перехватывается и получает пустую страницу;
- событие Umami (/api/send) перехватывается — в статистику не попадает — в статистику не попадает.

Запуск: py verify/live_t013_click_conversions.py [BASE]   (по умолчанию боевой сайт)
Печатает RESULT: CLICK_CONV_OK или CLICK_CONV_FAIL; код возврата 0/1.
"""
import asyncio, json, re, sys
from urllib.parse import unquote
from playwright.async_api import async_playwright

BASE = (sys.argv[1] if len(sys.argv) > 1 else "https://rundumshaus-littawe.de").rstrip("/")
PAGE = "/leistungen/entruempelung/osnabrueck/"
ANRUF = "ajW6CLqn6PocEO2ulalD"
WHATSAPP = "-3b4CL2n6PocEO2ulalD"


async def run(browser, consent, width=1280, height=900):
    ctx = await browser.new_context(locale="de-DE", viewport={"width": width, "height": height})
    page = await ctx.new_page()
    conv, wa_nav, plaus = [], [], []

    async def on_google(route):
        u = unquote(route.request.url)
        if ANRUF in u or WHATSAPP in u or "/conversion" in u:
            conv.append(u)
            await route.abort()
        else:
            await route.continue_()

    async def on_wa(route):
        wa_nav.append(route.request.url)
        await route.fulfill(status=200, content_type="text/html", body="<html><body>wa</body></html>")

    async def on_plaus(route):
        if "/api/send" in route.request.url:
            plaus.append(route.request.post_data or "")
            await route.fulfill(status=200, content_type="application/json", body="{}")
        else:
            await route.continue_()

    for pat in ("**googleadservices.com/**", "**doubleclick.net/**", "**google.com/**", "**google.de/**"):
        await page.route(pat, on_google)
    await page.route("**wa.me/**", on_wa)
    await page.route("**cloud.umami.is/**", on_plaus)
    await page.route("**umami.is/api/**", on_plaus)

    await page.goto(BASE + PAGE + "?cb=t013f2", wait_until="networkidle", timeout=90000)
    await page.wait_for_timeout(2500)
    await page.get_by_role("button", name="Alle akzeptieren" if consent else "Nur notwendige").click()
    await page.wait_for_timeout(4000)

    header = page.locator("section:has(h1)").first
    tel = header.locator('a[href^="tel:"]')
    tel_count = await tel.count()
    tel_in_view = False
    if tel_count:
        box = await tel.first.bounding_box()
        tel_in_view = bool(box) and box["y"] + box["height"] <= height
        # tel: в браузере без обработчика — гасим сам переход, клик и слушатель остаются
        await page.evaluate("""() => document.addEventListener('click', e => {
            const a = e.target.closest && e.target.closest('a[href^="tel:"]');
            if (a) e.preventDefault();
        })""")
        await tel.first.click()
        await page.wait_for_timeout(3000)
    conv_after_tel = list(conv)
    dl_js = """(l) => (window.dataLayer || []).map(e => Array.from(e))
        .filter(a => a[0] === 'event' && a[1] === 'conversion' && String((a[2]||{}).send_to).endsWith(l)).length"""
    ev_tel = await page.evaluate(dl_js, ANRUF)
    revoked_ev = None
    if consent and tel_count:
        # Ланда F-05: gtag уже загружен, согласие отозвано — клик не должен дать событие
        await page.evaluate("localStorage.setItem('rh-consent-v2','necessary')")
        await tel.first.click()
        await page.wait_for_timeout(1500)
        revoked_ev = await page.evaluate(dl_js, ANRUF) - ev_tel
        await page.evaluate("localStorage.setItem('rh-consent-v2','all')")

    wa = page.locator('header a[href*="wa.me"], nav a[href*="wa.me"]').first
    if await wa.count() == 0:
        wa = page.locator('a[href*="wa.me"]:not([target="_blank"])').first
    wa_target = await wa.get_attribute("target")
    if not await wa.is_visible():
        await page.get_by_role("button", name=re.compile("Men", re.I)).first.click()
        await page.wait_for_timeout(800)
        wa = page.locator('a[href*="wa.me"]:visible').first
        wa_target = await wa.get_attribute("target")
    ev_wa_box = []
    page.on("console", lambda m: ev_wa_box.append(int(m.text.split()[1])) if m.text.startswith("EV_WA ") else None)
    await page.evaluate("""(l) => document.addEventListener('click', () => {
        const n = (window.dataLayer || []).map(e => Array.from(e))
          .filter(a => a[0] === 'event' && a[1] === 'conversion' && String((a[2]||{}).send_to).endsWith(l)).length;
        console.log('EV_WA ' + n);
    })""", WHATSAPP)
    await wa.click()
    await page.wait_for_timeout(4000)
    final_url = page.url
    await ctx.close()
    return dict(ev_wa=(ev_wa_box[-1] if ev_wa_box else None), ev_tel=ev_tel, revoked_ev=revoked_ev, width=width,
                tel_count=tel_count, tel_in_view=tel_in_view, conv_after_tel=conv_after_tel,
                conv=conv, wa_nav=wa_nav, wa_target=wa_target, final_url=final_url, plaus=plaus)


def has(reqs, label):
    return sum(1 for r in reqs if label in r)


async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch()
        yes = await run(b, True)
        yes_m = await run(b, True, 375, 812)
        no = await run(b, False)
        await b.close()

    print("Страница:", BASE + PAGE)
    for name, r in (("С СОГЛАСИЕМ 1280", yes), ("С СОГЛАСИЕМ 375", yes_m), ("БЕЗ СОГЛАСИЯ 1280", no)):
        print("%s: tel в шапке=%d, в первом экране=%s; событий Anruf в dataLayer на клик=%s, после отзыва согласия=%s; "
              "событий WhatsApp на клик=%s; запросов с меткой Anruf=%d, WhatsApp=%d; переход на wa.me=%d (target=%s), "
              "итоговый адрес=%s; событий Umami=%d"
              % (name, r["tel_count"], "да" if r["tel_in_view"] else "НЕТ", r["ev_tel"], r["revoked_ev"], r["ev_wa"],
                 has(r["conv_after_tel"], ANRUF), has(r["conv"], WHATSAPP), len(r["wa_nav"]), r["wa_target"],
                 r["final_url"][:40], len(r["plaus"])))
        for p in r["plaus"]:
            print("   umami:", p[:200])

    # Скрипт Umami стоит с data-domains=rundumshaus-littawe.de и на localhost не шлёт ничего,
    # поэтому локально эта часть не проверяется — только на боевом адресе.
    local = "localhost" in BASE or "127.0.0.1" in BASE
    if local:
        print("Umami: на localhost не проверяется, только на боевом адресе")
    consent_ev = lambda r, choice: local or any('"consent"' in p and '"%s"' % choice in p for p in r["plaus"])
    good = lambda r: (r["tel_count"] >= 1 and r["tel_in_view"] and r["ev_tel"] == 1 and r["revoked_ev"] == 0
                      and has(r["conv_after_tel"], ANRUF) >= 1 and r["ev_wa"] == 1 and has(r["conv"], WHATSAPP) >= 1
                      and len(r["wa_nav"]) == 1 and "wa.me" in r["final_url"] and consent_ev(r, "all"))
    ok = (good(yes) and good(yes_m)
          and no["ev_tel"] == 0 and has(no["conv"], ANRUF) == 0 and has(no["conv"], WHATSAPP) == 0
          and len(no["wa_nav"]) == 1 and consent_ev(no, "necessary"))
    print("RESULT: %s" % ("CLICK_CONV_OK" if ok else "CLICK_CONV_FAIL"))
    return 0 if ok else 1

sys.exit(asyncio.run(main()))
