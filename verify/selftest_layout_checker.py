# -*- coding: utf-8 -*-
"""САМОТЕСТ ИНСТРУМЕНТА check_layout_mobile.py.

Landa отклонил предыдущую проверку лейаута за нефальсифицируемость: она
не могла провалиться в принципе (overflow-x:clip делал scrollWidth равным
clientWidth), и он доказал это, вставив в страницу блок width:3000px.

Этот самотест делает то же самое автоматически: во временную копию страницы
вставляется заведомо переполняющий блок, инструмент обязан его поймать.
Если не ловит — инструмент негоден, каким бы зелёным ни был его отчёт.

Usage: py verify/selftest_layout_checker.py
Печатает SELFTEST: PASS | FAIL. Код возврата 0/1.
"""
import io
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
PAGES = os.path.join(ROOT, "docs", "design", "v1-desktop")
CHECKER = os.path.join(HERE, "check_layout_mobile.py")
PW_PY = r"C:\Projects\HausBot\backend\.venv\Scripts\python.exe"
INJECT = '<div style="width:3000px;height:10px" id="selftest-overflow"></div>'


def run_checker(directory, width):
    return subprocess.run(
        [PW_PY, CHECKER, directory, str(width)],
        capture_output=True, text=True, encoding="utf-8", timeout=300,
    ).stdout


def main():
    src = os.path.join(PAGES, "index.html")
    # имя БЕЗ подчёркивания: чекер исключает "_*", и самотест на таком имени
    # молча проходил бы мимо — ровно та слепота, которую он должен ловить
    tmp = os.path.join(PAGES, "zz-selftest.html")
    html = io.open(src, encoding="utf-8").read()
    io.open(tmp, "w", encoding="utf-8", newline="\n").write(
        html.replace("</body>", INJECT + "</body>")
    )
    try:
        out = run_checker(PAGES, 375)
    finally:
        if os.path.exists(tmp):
            os.remove(tmp)

    caught = any("zz-selftest.html" in ln and "OVERFLOW" in ln for ln in out.splitlines())
    clean_after = "LAYOUT_CLEAN" in run_checker(PAGES, 375)

    print("вставлен блок width:3000px -> инструмент %s" % ("ПОЙМАЛ" if caught else "НЕ ПОЙМАЛ"))
    print("после удаления вставки -> %s" % ("чисто" if clean_after else "всё ещё грязно"))
    ok = caught and clean_after
    print("SELFTEST: %s" % ("PASS" if ok else "FAIL"))
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
