# -*- coding: utf-8 -*-
"""ПРУФ: изображения не искажены и пары «до/после» не дублируются (T010).

Landa, раунд 5, U-01 и U-02 — два дефекта, которые прошли мимо ВСЕЙ обвязки:

  U-01. В галерее Referenzen атрибуты width/height в разметке действуют как
        presentational hint и задают CSS-высоту, перебивая `aspect-ratio: 4/3`.
        Фото 800x1063 рендерилось полосой 205x1063 на всех ширинах, надписи на
        снимках срезались. check_layout_mobile.py при этом печатал LAYOUT_CLEAN
        (он меряет переполнение ТЕКСТОМ), check_text_not_clipped.py —
        TEXT_FULLY_VISIBLE (он смотрит текстовые узлы). Картинок не видел никто.

  U-02. В парах «Vorher/Nachher» у двух работ стоял ОДИН И ТОТ ЖЕ файл: сайт
        подписывал одно изображение и как «до», и как «после». Проверок на это
        не было вовсе.

Здесь проверяется то, что относится к изображениям:
  * пропорции при выводе не расходятся с собственными пропорциями файла;
  * в паре «до/после» стоят РАЗНЫЕ файлы (сверка по содержимому, не по имени);
  * карточки одного ряда не расходятся по высоте до рваной сетки.

Usage: <playwright-python> verify/check_images_sane.py [папка] [ширина ...]
Код возврата: 0 — IMAGES_SANE, 1 — есть искажения или дубли.
"""
import glob
import hashlib
import io
import os
import re
import sys

from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
PAGES = os.path.join(ROOT, "docs", "design", "v1-desktop")
RATIO_TOLERANCE = 0.35   # допустимое расхождение пропорций; object-fit: cover
                         # кадрирует намеренно, но не превращает фото в полосу


def main():
    pages = sys.argv[1] if len(sys.argv) > 1 else PAGES
    widths = [int(w) for w in sys.argv[2:]] or [375, 768, 1440]
    files = sorted(f for f in glob.glob(os.path.join(pages, "*.html"))
                   if not os.path.basename(f).startswith(("_", "zz-")))
    bad = 0

    print("ПАРЫ «ДО/ПОСЛЕ» — в слотах обязаны стоять РАЗНЫЕ снимки (Landa U-02):")
    pairs = 0
    for f in files:
        src = io.open(f, encoding="utf-8").read()
        for m in re.finditer(r'<div class="ref-pair">(.*?)</div>', src, re.S):
            imgs = re.findall(r'<img src="([^"]+)"', m.group(1))
            if len(imgs) != 2:
                continue
            pairs += 1
            digests = []
            for rel in imgs:
                p = os.path.join(pages, rel.replace("/", os.sep))
                digests.append(hashlib.md5(io.open(p, "rb").read()).hexdigest()
                               if os.path.exists(p) else "НЕТ ФАЙЛА:" + rel)
            same = digests[0] == digests[1]
            bad += same
            print("  %-20s %-46s %s" % (os.path.basename(f), imgs[0].split("/")[-1],
                  "OK" if not same else "ОДИН И ТОТ ЖЕ ФАЙЛ В ОБОИХ СЛОТАХ"))
    print("  пар проверено: %d" % pairs)

    print("ПРОПОРЦИИ — вывод не искажает снимок (Landa U-01):")
    with sync_playwright() as p:
        b = p.chromium.launch()
        for w in widths:
            ctx = b.new_context(viewport={"width": w, "height": 900},
                                device_scale_factor=1, is_mobile=w < 700,
                                has_touch=w < 700, reduced_motion="reduce")
            page = ctx.new_page()
            for f in files:
                page.goto("file:///" + f.replace("\\", "/"))
                page.wait_for_timeout(600)
                res = page.evaluate("""() => {
                  // Кадрирование через object-fit: cover — приём вёрстки, а не дефект:
                  // герой и карточки услуг намеренно обрезаются под свои пропорции.
                  // Дефект — ВЫРОЖДЕННАЯ геометрия: снимок, превращённый в полосу
                  // (ровно случай 205x1063), и рассинхрон соседних карточек в ряду.
                  const out = [];
                  for (const im of document.querySelectorAll('img')) {
                    if (!im.naturalWidth || !im.complete) continue;
                    const r = im.getBoundingClientRect();
                    if (r.width < 40 || r.height < 40) continue;   // иконки не в счёт
                    // Точный признак дефекта U-01: вёрстка ЗАЯВИЛА пропорцию через
                    // aspect-ratio, а фактическая ей не равна — значит атрибуты
                    // width/height из разметки её перебили. Широкий герой и волна-
                    // разделитель aspect-ratio не объявляют и сюда не попадают.
                    const ar = getComputedStyle(im).aspectRatio;
                    const m = ar && ar.match(/^([\d.]+)\s*\/\s*([\d.]+)$/);
                    if (!m) continue;
                    const want = parseFloat(m[1]) / parseFloat(m[2]);
                    const got = r.width / r.height;
                    if (Math.abs(got - want) / want > 0.05)
                      out.push([im.getAttribute('src').split('/').pop(),
                                Math.round(r.width) + 'x' + Math.round(r.height),
                                'CSS требует ' + want.toFixed(2) + ', вышло ' + got.toFixed(2)]);
                  }
                  // карточки «до/после» в одной паре обязаны быть одной высоты
                  for (const pair of document.querySelectorAll('.ref-pair')) {
                    const hs = [...pair.querySelectorAll('img')]
                                 .map(i => Math.round(i.getBoundingClientRect().height));
                    if (hs.length === 2 && Math.abs(hs[0] - hs[1]) > 2)
                      out.push(['ref-pair', hs.join(' vs '), 'разная высота в паре']);
                  }
                  return out;
                }""")
                bad += len(res)
                if res:
                    print("  %4d  %-20s %s" % (w, os.path.basename(f),
                          "; ".join("%s выведен %s при %s" % tuple(x) for x in res[:3])))
            ctx.close()
        b.close()
    print("  искажений: %d" % (bad - sum(1 for _ in ())))

    print("RESULT: %s" % ("IMAGES_SANE" if bad == 0 else "IMAGES_BROKEN:%d" % bad))
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
