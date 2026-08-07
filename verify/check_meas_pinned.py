# -*- coding: utf-8 -*-
"""ПРУФ: константы хеша эталонов совпадают с СОДЕРЖИМЫМ GIT-БЛОБА (T008).

Landa раунд 7: прошлый пруф этого claim'а содержал мёртвую переменную
(git hash-object даёт SHA1 блоба и с sha256-префиксом не сошёлся бы никогда)
и циркулярный grep, сверявший константу чекера саму с собой. Проверку
«хеши совпадают с git-версией» тогда доказал ревьюер, а не пруф.

Здесь: берём содержимое файла ИЗ GIT по историческому якорю (коммит замеров), считаем sha256
и сравниваем с константой, зашитой в check_tokens_match.py. Совпадение
означает, что закреплён не локальный файл, а то, что лежит в репозитории.

Usage: py verify/check_meas_pinned.py
Код возврата: 0 — константы совпадают с git, 1 — расхождение.
"""
import hashlib
import io
import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
CHECKER = os.path.join(HERE, "check_tokens_match.py")
# Landa: HEAD — движущаяся мишень, правка замера вместе с пересчётом константы
# в одном коммите прошла бы незаметно. Замеры сняты в 418ddd2, ДО появления мокапа,
# и это фиксированный исторический факт: содержимое там и в HEAD совпадает до бита.
ANCHOR = "418ddd2"
FILES = {
    "REFERENCE_MEASUREMENTS.json": "docs/design/REFERENCE_MEASUREMENTS.json",
    "TYPOGRAPHY.json": "docs/design/TYPOGRAPHY.json",
}


def const_from_checker(name):
    src = io.open(CHECKER, encoding="utf-8").read()
    m = re.search(r'"' + re.escape(name) + r'":\s*"([0-9a-f]+)"', src)
    return m.group(1) if m else None


def sha_from_git(path):
    out = subprocess.run(["git", "-C", ROOT, "show", ANCHOR + ":" + path],
                         capture_output=True, timeout=60).stdout
    if not out:
        return None
    return hashlib.sha256(out.replace(b"\r\n", b"\n")).hexdigest()[:16]


def main():
    bad = 0
    for name, path in FILES.items():
        want = const_from_checker(name)
        got = sha_from_git(path)
        ok = want is not None and want == got
        bad += not ok
        print("  %-30s const=%s git=%s  %s" % (name, want, got, "OK" if ok else "РАСХОЖДЕНИЕ"))
    print("RESULT: %s" % ("PINNED_TO_GIT" if bad == 0 else "PIN_MISMATCH:%d" % bad))
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
