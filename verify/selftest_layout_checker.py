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

WIDE = '<div style="width:3000px;height:10px"></div>'

# (имя случая, куда внедрять, что внедрять)
#   anchor "</body>"        — элемент прямо под body, без клипперов
#   anchor "<!-- HERO -->"  — подставляется внутрь секции hero (см. inject())
CASES = [
    ("широкий блок под body",        "body",    WIDE),
    ("широкий блок внутри .hero",    "hero",    WIDE),
    ("широкий блок под обёрткой overflow:hidden", "body",
     '<div style="overflow-x:hidden;width:100%">' + WIDE + "</div>"),
    ("переполнение ТЕКСТОМ (nowrap)", "body",
     '<p style="white-space:nowrap;width:100px;overflow:visible">'
     'Hausmeisterservice-Gebaeudereinigungs-Dachrinnenreinigungs-Sonderleistung</p>'),
    ("вылет ВЛЕВО (left:-800px)",    "body",
     '<div style="position:absolute;left:-800px;width:600px;height:10px"></div>'),
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
        [PW_PY, CHECKER, PAGES, str(width)],
        capture_output=True, text=True, encoding="utf-8", timeout=300,
    ).stdout


def main():
    src = os.path.join(PAGES, "index.html")
    html = io.open(src, encoding="utf-8").read()
    tmp = os.path.join(PAGES, "zz-selftest.html")   # без "_": чекер фильтрует "_*"
    results = []

    for label, where, snippet in CASES:
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
        caught = any("zz-selftest.html" in ln and "OVERFLOW" in ln for ln in out.splitlines())
        detail = next((ln.split("OVERFLOW:")[-1][:60] for ln in out.splitlines()
                       if "zz-selftest.html" in ln and "OVERFLOW" in ln), "")
        results.append((label, caught, detail))

    clean = "LAYOUT_CLEAN" in run_checker(375)

    for label, caught, detail in results:
        print("%-46s %s  %s" % (label, "ПОЙМАН" if caught else "ПРОПУЩЕН", detail))
    print("%-46s %s" % ("после удаления всех вставок", "чисто" if clean else "ГРЯЗНО"))

    ok = all(c for _, c, _ in results) and clean
    print("SELFTEST: %s (%d/%d случаев)" % ("PASS" if ok else "FAIL",
                                            sum(1 for _, c, _ in results if c), len(results)))
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
