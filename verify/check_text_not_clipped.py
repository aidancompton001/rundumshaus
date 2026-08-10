# -*- coding: utf-8 -*-
"""ПРУФ: тексты клиента ВИДНЫ ЦЕЛИКОМ, а не обрезаны средствами CSS (T010).

Landa, ревью ТС1, F-08: статическая сверка HTML с JSON зелёная и тогда, когда
DOM содержит полный текст, а пользователь видит три строки — достаточно
`-webkit-line-clamp`, `max-height + overflow:hidden` или `<details>`. Ни
check_client_texts.py (читает исходник), ни check_layout_mobile.py (меряет
переполнение по горизонтали) этого не видят.

Здесь текст проверяется в отрендеренной странице:
  * узел с data-cms виден (offsetParent, display, visibility, opacity);
  * содержимое не срезано по вертикали: scrollHeight <= clientHeight + допуск;
  * запрещённые свойства отсечения на текстовых узлах отсутствуют.

Прогон на 375 и 1440: на узкой ширине немецкие тексты выше, и обрезка,
незаметная на десктопе, проявляется именно там.

Usage: <playwright-python> verify/check_text_not_clipped.py [папка] [ширина ...]
Код возврата: 0 — TEXT_FULLY_VISIBLE, 1 — есть обрезанные или скрытые тексты.
"""
import glob
import os
import sys

from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
PAGES = os.path.join(ROOT, "docs", "design", "v1-desktop")
TOLERANCE = 2          # px: субпиксельные хвосты шрифтового рендера

# Осознанные скрытия — объявлены с причиной и ПЕЧАТАЮТСЯ в отчёте, а не молчат.
# Список закрытый: всё, чего в нём нет, считается потерянным текстом.
EXPECTED_HIDDEN = {
    "site.header.whatsapp": "подпись «Jetzt per WhatsApp» под номером скрывается в "
                            "компактной шапке до 1000px, сам номер остаётся видимым; "
                            "это служебная надпись кнопки, не текст клиента",
}

PROBE = """() => {
  const bad = [];
  const nodes = document.querySelectorAll('[data-cms]');
  for (const el of nodes) {
    const key = el.getAttribute('data-cms');
    const cs = getComputedStyle(el);
    const text = (el.textContent || '').trim();
    if (!text) continue;                       // пустые узлы (картинки) не о тексте
    if (el.offsetParent === null && cs.position !== 'fixed')
      { bad.push(['СКРЫТ', key, 'offsetParent=null']); continue; }
    if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0)
      { bad.push(['СКРЫТ', key, cs.display + '/' + cs.visibility + '/' + cs.opacity]); continue; }
    // Landa, ревью результата, C-02: текст клиента прятался в <span style="display:none">
    // ВНУТРИ размеченного узла — статическая сверка видела его как присутствующий,
    // а эта проверка смотрела только сам узел. Теперь обходим потомков.
    for (const kid of el.querySelectorAll('*')) {
      if (!(kid.textContent || '').trim()) continue;
      const kc = getComputedStyle(kid);
      if (kc.display === 'none' || kc.visibility === 'hidden' || parseFloat(kc.opacity) === 0
          || kc.fontSize === '0px' || kc.clipPath === 'inset(100%)')
        bad.push(['ТЕКСТ СПРЯТАН В ПОТОМКЕ', key, kid.tagName + ' ' + kc.display + '/' + kc.visibility]);
      if (kc.webkitLineClamp && kc.webkitLineClamp !== 'none')
        bad.push(['LINE-CLAMP В ПОТОМКЕ', key, kid.tagName]);
    }
    if (cs.webkitLineClamp && cs.webkitLineClamp !== 'none')
      bad.push(['LINE-CLAMP', key, cs.webkitLineClamp]);
    // раунд 3: те же приёмы, применённые к САМОМУ узлу, проходили мимо
    if (cs.fontSize === '0px') bad.push(['НУЛЕВОЙ КЕГЛЬ', key, cs.fontSize]);
    if (cs.clipPath === 'inset(100%)') bad.push(['CLIP-PATH', key, cs.clipPath]);
    if (cs.color === 'rgba(0, 0, 0, 0)' || cs.color === 'transparent')
      bad.push(['ПРОЗРАЧНЫЙ ЦВЕТ', key, cs.color]);
    // вылет за экран — дефект, КРОМЕ штатной горизонтальной карусели: её карточки
    // лежат правее вьюпорта по замыслу и достигаются прокруткой (та же карусель
    // отзывов, что описана негативным случаем в selftest_layout_checker)
    let inSlider = false;
    for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
      const ac = getComputedStyle(a);
      if ((ac.overflowX === 'auto' || ac.overflowX === 'scroll')
          && a.scrollWidth > a.clientWidth) { inSlider = true; break; }
    }
    const r = el.getBoundingClientRect();
    if (!inSlider && (r.right < 0 || r.bottom < 0 || r.left > document.documentElement.scrollWidth))
      bad.push(['ЗА ПРЕДЕЛАМИ ЭКРАНА', key, Math.round(r.left) + ',' + Math.round(r.top)]);
    // и цепочка предков до body: opacity:0 на обёртке прятал текст незаметно
    for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
      const ac = getComputedStyle(a);
      if (ac.display === 'none' || ac.visibility === 'hidden' || parseFloat(ac.opacity) === 0)
        { bad.push(['СКРЫТ ПРЕДКОМ', key, a.tagName + '.' + (a.className||'')]); break; }
    }
    if (cs.textOverflow === 'ellipsis')
      bad.push(['ELLIPSIS', key, cs.textOverflow]);
    const over = cs.overflowY === 'hidden' || cs.overflow === 'hidden';
    if (over && el.scrollHeight > el.clientHeight + TOL)
      bad.push(['ОБРЕЗАН', key, el.scrollHeight + '>' + el.clientHeight]);
    // текст, срезанный предком с фиксированной высотой
    let p = el.parentElement, hops = 0;
    while (p && hops++ < 4) {
      const pc = getComputedStyle(p);
      if ((pc.overflowY === 'hidden' || pc.overflow === 'hidden')
          && p.scrollHeight > p.clientHeight + TOL
          && el.getBoundingClientRect().bottom > p.getBoundingClientRect().bottom + TOL)
        { bad.push(['СРЕЗАН ПРЕДКОМ', key, p.tagName + '.' + (p.className || '')]); break; }
      p = p.parentElement;
    }
  }
  return bad;
}"""


def main():
    pages = sys.argv[1] if len(sys.argv) > 1 else PAGES
    widths = [int(w) for w in sys.argv[2:]] or [375, 1440]
    files = sorted(f for f in glob.glob(os.path.join(pages, "*.html"))
                   if not os.path.basename(f).startswith(("_", "zz-")))
    bad_total = 0
    with sync_playwright() as p:
        b = p.chromium.launch()
        for w in widths:
            # Landa раунд 3 нашёл 189 узлов под предком с opacity:0 — это GSAP-reveal
            # до входа в вьюпорт, а не потеря текста. Меряем при reduced-motion:
            # мокап в этом режиме показывает всё сразу, и проверка говорит о КОНТЕНТЕ,
            # а не о фазе анимации. Постоянный opacity:0 при этом останется дефектом.
            ctx = b.new_context(viewport={"width": w, "height": 900},
                                device_scale_factor=1, is_mobile=w < 700,
                                has_touch=w < 700, reduced_motion="reduce")
            page = ctx.new_page()
            for f in files:
                page.goto("file:///" + f.replace("\\", "/"))
                page.wait_for_timeout(700)
                page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                page.wait_for_timeout(400)
                page.evaluate("window.scrollTo(0, 0)")
                page.wait_for_timeout(300)
                # FAQ-аккордеон свёрнут ПО ЗАМЫСЛУ. Считать его ответы потерянными
                # неверно, но и верить, что они раскроются, нельзя: раскрываем и
                # проверяем уже развёрнутыми. Не раскрывшийся ответ останется
                # «СКРЫТ» и будет дефектом — как и должен.
                page.evaluate("""() => {
                  document.querySelectorAll('details').forEach(d => d.open = true);
                  document.querySelectorAll('[aria-expanded="false"]').forEach(b => b.click());
                }""")
                page.wait_for_timeout(600)
                found = page.evaluate(PROBE.replace("TOL", str(TOLERANCE)))
                for x in [x for x in found if x[1] in EXPECTED_HIDDEN]:
                    print("%4d  %-22s ЗАЯВЛЕНО: %s — %s"
                          % (w, os.path.basename(f), x[1], EXPECTED_HIDDEN[x[1]][:70]))
                found = [x for x in found if x[1] not in EXPECTED_HIDDEN]
                n = len(found)
                bad_total += n
                # Landa C-03: страница с нулём размеченных узлов печатала OK — то есть
                # «проверено» и «нечего проверять» выглядели одинаково. Теперь видно.
                cnt = page.evaluate("document.querySelectorAll('[data-cms]').length")
                verdict = ("OK" if n == 0 else "ОБРЕЗКА: " + "; ".join("%s %s (%s)" % tuple(x) for x in found[:3]))
                if cnt == 0:
                    verdict = "НЕ ПРОВЕРЕНА (нет размеченных узлов)"
                print("%4d  %-22s узлов с data-cms: %-4d %s" % (w, os.path.basename(f), cnt, verdict))
            ctx.close()
        b.close()
    print("RESULT: %s" % ("TEXT_FULLY_VISIBLE" if bad_total == 0
                          else "TEXT_CLIPPED:%d" % bad_total))
    return 1 if bad_total else 0


if __name__ == "__main__":
    sys.exit(main())
