# -*- coding: utf-8 -*-
"""МАТРИЧНЫЙ САМОТЕСТ инструмента check_layout_mobile.py.

История. Landa дважды отклонял проверки лейаута за нефальсифицируемость:
  раунд 1 — критерий scrollWidth<=clientWidth не мог провалиться при
            overflow-x:clip (он вставил блок width:3000px, проверка сказала «чисто»);
  раунд 2 — самотест закрывал ровно ОДНУ точку внедрения (прямо перед </body>),
            а из четырёх способов сломать чекер он ловил один: вложение под
            предка с overflow, переполнение ТЕКСТОМ и вылет ВЛЕВО проходили мимо.

Поэтому здесь матрица: каждый способ сломать вёрстку внедряется отдельно,
и инструмент обязан поймать КАЖДЫЙ. Если хоть один случай не пойман —
инструмент негоден, каким бы зелёным ни был его отчёт.

Usage: py verify/selftest_layout_checker.py
Печатает таблицу случаев и SELFTEST: PASS | FAIL. Код возврата 0/1.
"""
import io
import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
PAGES = os.path.join(ROOT, "docs", "design", "v1-desktop")
CHECKER = os.path.join(HERE, "check_layout_mobile.py")
PW_PY = r"C:\Projects\HausBot\backend\.venv\Scripts\python.exe"

# Блоки НЕСУТ ТЕКСТ: обрезка пустого декора визуально безвредна, а обрезка
# контента — дефект. Именно так инструмент и различает случаи после раунда 3.
WIDE = '<div style="width:3000px;height:14px">Preise ab 49 EUR - Jetzt anrufen</div>' 

# (имя случая, куда внедрять, что внедрять)
#   anchor "</body>"        — элемент прямо под body, без клипперов
#   anchor "<!-- HERO -->"  — подставляется внутрь секции hero (см. inject())
CASES = [
    # положительные: инструмент ОБЯЗАН поймать
    ("широкий блок под body",                     "body", WIDE, True),
    ("широкий блок внутри .hero",                 "hero", WIDE, True),
    ("широкий блок под обёрткой overflow:hidden", "body",
     '<div style="overflow-x:hidden;width:100%">' + WIDE + "</div>", True),
    ("блок под aria-hidden обёрткой (текст виден)", "hero",
     '<div aria-hidden="true">' + WIDE + "</div>", True),
    ("блок под pointer-events:none",              "hero",
     '<div style="pointer-events:none">' + WIDE + "</div>", True),
    ("блок под обёрткой overflow-y:auto",         "body",
     '<div style="overflow-y:auto;max-height:100px">' + WIDE + "</div>", True),
    ("блок под fixed-клиппером",                  "body",
     '<div style="position:fixed;overflow:hidden;width:100%;height:20px">' + WIDE + "</div>", True),
    ("переполнение ТЕКСТОМ (nowrap)",             "body",
     '<p style="white-space:nowrap;width:100px;overflow:visible">'
     'Hausmeisterservice-Gebaeudereinigungs-Dachrinnenreinigungs-Sonderleistung</p>', True),
    ("переполнение текстом в НЕлистовом (ul>li)", "body",
     '<ul style="width:80px;list-style:none"><li style="white-space:nowrap">'
     'Keller- und Dachbodenraeumung komplett</li></ul>', True),
    ("вылет ВЛЕВО нефокусируемого",               "body",
     '<div style="position:absolute;left:-2500px;width:600px;height:14px">Impressum</div>', True),
    # негативные: инструмент обязан МОЛЧАТЬ (иначе он кричит на здоровом)
    # негативный слайдер повторяет РЕАЛЬНЫЙ паттерн проекта (.reviews-grid):
    # overflow-x:auto + scroll-snap-type: x mandatory — намеренная карусель
    ("НЕГАТИВ: штатная карусель (scroll-snap)",   "body",
     '<div style="overflow-x:auto;scroll-snap-type:x mandatory;width:200px">'
     '<div style="width:900px;height:14px;scroll-snap-align:start">'
     'Bewertung 1 Bewertung 2 Bewertung 3</div></div>', False),
    ("НЕГАТИВ: skip-ссылка за краем",             "body",
     '<a href="#main" style="position:absolute;left:-9999px">Zum Inhalt springen</a>', False),
    ("НЕГАТИВ: декоративный svg за краем",        "hero",
     '<svg aria-hidden="true" style="position:absolute;right:-200px;width:300px;height:20px">'
     '<rect width="300" height="20"/></svg>', False),
    # раунд 5 — случаи Landa, которые прошлая версия пропускала
    ("clip-path не освобождает от проверки",      "hero",
     '<div style="clip-path:inset(0);width:3000px;height:14px">Notdienst 24/7 - 0151 23456789</div>', True),
    ("обрезанная КАРТИНКА (декор = не только текст)", "hero",
     # max-width:none обязателен: глобальное правило img{max-width:100%} иначе
     # сжимает картинку и переполнения физически не возникает
     '<div style="overflow:hidden;width:100%"><img src="assets/img/ph-hero.svg" '
     'style="width:3000px;max-width:none;height:20px" alt="Vorher Nachher"></div>', True),
    ("МОЛЧАЛИВАЯ обрезка текста без ellipsis",     "body",
     '<div style="width:120px;overflow:hidden;white-space:nowrap">'
     'Hausmeisterservice Osnabrueck Festpreis 79 Euro monatlich</div>', True),
    ("ellipsis-обрезка показывается",              "body",
     '<div style="width:120px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis">'
     'Hausmeisterservice Osnabrueck - Festpreis 79 Euro monatlich</div>', "warn"),
    ("ellipsis с текстом В ПОТОМКЕ — тоже предупреждение", "body",
     '<div style="width:120px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis">'
     '<span>Hausmeisterservice Osnabrueck - Festpreis 79 Euro monatlich</span></div>', "warn"),
    ("ellipsis + БЛОЧНЫЙ потомок — всё равно дефект", "body",
     '<div style="overflow:hidden;text-overflow:ellipsis;width:100%">'
     '<div style="width:3000px;height:14px">Preisliste komplett</div></div>', True),
    ("ellipsis + КАРТИНКА — всё равно дефект",     "hero",
     '<div style="overflow:hidden;text-overflow:ellipsis;width:100%">'
     '<img src="assets/img/ph-hero.svg" style="width:3000px;max-width:none;height:20px" '
     'alt="Vorher Nachher"></div>', True),
    ("ellipsis + inline-block — всё равно дефект",  "body",
     '<div style="overflow:hidden;text-overflow:ellipsis;width:100%">'
     '<span style="display:inline-block;width:3000px;height:14px">Preisliste komplett</span></div>', True),
    ("ellipsis + img display:inline — всё равно дефект", "hero",
     '<div style="overflow:hidden;text-overflow:ellipsis;width:100%">'
     '<img src="assets/img/ph-hero.svg" style="display:inline;width:3000px;max-width:none;height:20px" '
     'alt="Vorher Nachher"></div>', True),
    ("НЕГАТИВ: скрытый элемент (visibility:hidden)", "body",
     '<div style="visibility:hidden"><p style="white-space:nowrap;width:80px">'
     'Sehr langer deutscher Kompositatext zur Pruefung</p></div>', False),
]


def inject(html, where, snippet):
    if where == "body":
        return html.replace("</body>", snippet + "</body>")
    if where == "hero":
        m = re.search(r'(<section[^>]*class="[^"]*\bhero\b[^"]*"[^>]*>)', html)
        if not m:
            return None
        return html[: m.end()] + snippet + html[m.end():]
    raise ValueError(where)


def run_checker(width):
    return subprocess.run(
        [PW_PY, CHECKER, os.path.join(PAGES, "zz-selftest.html"), str(width)],
        capture_output=True, text=True, encoding="utf-8", timeout=300,
    ).stdout


def main():
    src = os.path.join(PAGES, "index.html")
    html = io.open(src, encoding="utf-8").read()
    tmp = os.path.join(PAGES, "zz-selftest.html")   # без "_": чекер фильтрует "_*"
    results = []

    for label, where, snippet, must_catch in CASES:
        patched = inject(html, where, snippet)
        if patched is None:
            results.append((label, False, "секция для внедрения не найдена"))
            continue
        io.open(tmp, "w", encoding="utf-8", newline="\n").write(patched)
        try:
            out = run_checker(375)
        finally:
            if os.path.exists(tmp):
                os.remove(tmp)
        lines = [ln for ln in out.splitlines() if "zz-selftest.html" in ln]
        caught = any("OVERFLOW" in ln for ln in lines)
        warned = any("предупр:" in ln for ln in lines)
        detail = (lines[0].split("  ", 2)[-1][:70] if lines else "")
        if must_catch == "warn":
            ok = warned and not caught          # предупреждение, но не дефект
            state = "предупреждение" if warned else ("ДЕФЕКТ" if caught else "молчит")
        elif must_catch:
            ok = caught
            state = ("ПОЙМАН " + detail) if caught else "молчит"
        else:
            # Landa раунд 6: негатив обязан молчать в ОБОИХ каналах. Прежняя версия
            # смотрела только дефекты, поэтому строка «карусель молчит OK» проходила
            # при карусели, которая выдавала предупреждение на каждой мобильной ширине.
            ok = (not caught) and (not warned)
            state = "молчит" if ok else ("ДЕФЕКТ " + detail if caught else "ПРЕДУПРЕЖДЕНИЕ " + detail)
        results.append((label, ok, state))

    # Landa, F-04: все случаи выше подаются чекеру ОДНИМ ФАЙЛОМ, то есть
    # проверяют ветку file://. Ветка HTTP — та, которой меряется собранный
    # сайт, — оставалась без единого подложенного дефекта. Здесь дефект
    # кладётся В ПАПКУ, и чекер обязан найти его в режиме каталога.
    http_page = os.path.join(PAGES, "zz-http-defect.html")
    io.open(http_page, "w", encoding="utf-8", newline=chr(10)).write(
        inject(html, "body", '<div style="width:3000px">HTTP-ветка</div>') or html)
    out_http = subprocess.run([PW_PY, CHECKER, PAGES, "375"],
        capture_output=True, text=True, encoding="utf-8", timeout=600).stdout
    http_caught = ("zz-http-defect" in out_http
                   and "СРЕДА ЗАМЕРА: HTTP" in out_http
                   and "PROBLEMS" in out_http)
    results.append(("дефект в режиме каталога (ветка HTTP)", http_caught,
                    "ПОЙМАН по HTTP" if http_caught else "ПРОПУЩЕН"))
    os.remove(http_page)

    # контроль чистоты — по всей папке, как в реальном прогоне
    clean = "LAYOUT_CLEAN" in subprocess.run([PW_PY, CHECKER, PAGES, "375"],
        capture_output=True, text=True, encoding="utf-8", timeout=600).stdout

    for label, caught, detail in results:
        print("%-46s %-6s %s" % (label, "OK" if caught else "ПРОВАЛ", detail))
    print("%-46s %s" % ("после удаления всех вставок", "чисто" if clean else "ГРЯЗНО"))

    ok = all(c for _, c, _ in results) and clean
    print("SELFTEST: %s (%d/%d случаев)" % ("PASS" if ok else "FAIL",
                                            sum(1 for _, c, _ in results if c), len(results)))
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
