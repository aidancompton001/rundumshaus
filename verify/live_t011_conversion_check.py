# -*- coding: utf-8 -*-
"""Сквозная проверка конверсии на живом сайте БЕЗ боевых последствий:
- запрос на FormSubmit перехватывается и получает ответ 200 — письмо Кевину не уходит;
- запрос конверсии к Google перехватывается и ОБРЫВАЕТСЯ — в рекламный кабинет
  клиента ложная конверсия не попадает. Фиксируем только, что он был и с какой меткой.
"""
import asyncio, json, sys
from urllib.parse import unquote
from playwright.async_api import async_playwright

BASE = "https://rundumshaus-littawe.de"
LABEL = "mZFoCIrsp6YcEO2ulalD"

async def run(browser, consent):
    ctx = await browser.new_context(locale="de-DE", viewport={"width": 1280, "height": 900})
    page = await ctx.new_page()
    formsubmit, conv_reqs = [], []

    async def on_formsubmit(route):
        formsubmit.append(route.request.url)
        await route.fulfill(status=200, content_type="application/json", body=json.dumps({"success": "true"}))

    async def on_google(route):
        u = unquote(route.request.url)
        if "conversion" in u or LABEL in u:
            conv_reqs.append(u)
            await route.abort()          # в кабинет клиента не уходит
        else:
            await route.continue_()

    await page.route("**formsubmit.co/**", on_formsubmit)
    for pat in ("**googleadservices.com/**", "**doubleclick.net/**", "**google.com/pagead/**",
                "**google.de/pagead/**", "**googletagmanager.com/**"):
        await page.route(pat, on_google)

    await page.goto(BASE + "/kontakt/?cb=t011e2e", wait_until="networkidle", timeout=90000)
    await page.wait_for_timeout(2500)
    btn = "Alle akzeptieren" if consent else "Nur notwendige"
    await page.get_by_role("button", name=btn).click()
    await page.wait_for_timeout(3000)

    # заполнить обязательные поля формы, ловушку _honey не трогать
    await page.evaluate("""() => {
      const f = document.querySelector('form');
      for (const el of f.querySelectorAll('input, textarea, select')) {
        if (el.name === '_honey' || el.type === 'hidden' || el.type === 'submit') continue;
        if (el.tagName === 'SELECT') { if (el.options.length > 1) el.selectedIndex = 1; continue; }
        if (el.type === 'checkbox') { el.checked = true; continue; }
        if (el.type === 'email') el.value = 'pruefung@example.com';
        else if (el.type === 'tel') el.value = '0541 000000';
        else el.value = 'Technische Prüfung, bitte ignorieren';
      }
    }""")
    await page.locator("form button[type=submit], form button:not([type])").last.click()
    await page.wait_for_timeout(6000)

    events = await page.evaluate("""() => (window.dataLayer || [])
        .map(e => Array.from(e))
        .filter(a => a[0] === 'event' && a[1] === 'conversion')
        .map(a => a[2])""")
    success_text = await page.locator("text=/Vielen Dank|erfolgreich|gesendet/i").count()
    await ctx.close()
    return formsubmit, conv_reqs, events, success_text

async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch()
        fs1, cr1, ev1, ok1 = await run(b, consent=True)
        fs0, cr0, ev0, ok0 = await run(b, consent=False)
        await b.close()
    print("С СОГЛАСИЕМ : отправка формы перехвачена=%d  успех на экране=%s  событие конверсии в dataLayer=%d  запрос конверсии к Google=%d"
          % (len(fs1), "да" if ok1 else "НЕТ", len(ev1), len(cr1)))
    for e in ev1: print("   send_to:", e)
    for r in cr1[:2]: print("   запрос (оборван):", r[:160])
    print("БЕЗ СОГЛАСИЯ: отправка формы перехвачена=%d  успех на экране=%s  событие конверсии в dataLayer=%d  запрос конверсии к Google=%d"
          % (len(fs0), "да" if ok0 else "НЕТ", len(ev0), len(cr0)))
    label_ok = any(LABEL in r for r in cr1) or any((e or {}).get("send_to", "").endswith(LABEL) for e in ev1)
    ok = (len(fs1) == 1 and len(ev1) == 1 and label_ok
          and len(fs0) == 1 and len(ev0) == 0 and len(cr0) == 0)
    print("RESULT: %s" % ("CONVERSION_E2E_OK" if ok else "CONVERSION_E2E_FAIL"))
    return 0 if ok else 1

sys.exit(asyncio.run(main()))
