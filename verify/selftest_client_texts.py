# -*- coding: utf-8 -*-
"""МУТАЦИОННЫЙ САМОТЕСТ проверки текстов клиента (T010).

Landa, ревью ТС1, F-20: формулировка «мутация любого поля роняет проверку»
позволяет написать ОДНУ мутацию и отчитаться. Поэтому матрица зафиксирована
здесь восемью случаями, каждый воспроизводит конкретный способ потерять текст
клиента незаметно. Проверка обязана покраснеть на каждом.

Мутации применяются к КОПИИ мокапа и копии данных во временном каталоге —
рабочее дерево не трогается вовсе (урок selftest_tokens_match.py: правка
отслеживаемого файла на месте оставляла мусор в ветке при срыве по таймауту).

Usage: py verify/selftest_client_texts.py
Печатает таблицу мутаций и SELFTEST_CLIENT_TEXTS: PASS | FAIL. Код возврата 0/1.
"""
import io
import os
import re
import shutil
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
PAGES = os.path.join(ROOT, "docs", "design", "v1-desktop")
DATA = os.path.join(ROOT, "site", "src", "data")
CHECKER = os.path.join(HERE, "check_client_texts.py")


def run(pages, data):
    r = subprocess.run([sys.executable, CHECKER, pages, data],
                       capture_output=True, text=True, encoding="utf-8", timeout=180)
    out = r.stdout.strip().splitlines()
    return out[-1] if out else "(нет вывода)"


def edit(path, fn):
    s = io.open(path, encoding="utf-8").read()
    s2 = fn(s)
    assert s2 != s, "мутация ничего не изменила: " + os.path.basename(path)
    io.open(path, "w", encoding="utf-8", newline="\n").write(s2)


# (описание, файл-мишень, функция мутации)
MUTATIONS = [
    ("a) удалено слово из середины описания", "leistungen.html",
     lambda s: s.replace("professionellen Hausmeisterservice in Osnabrück", "professionellen in Osnabrück", 1)),
    ("b) хвост описания обрезан многоточием", "leistungen.html",
     lambda s: re.sub(r"(Ideal für Privatkunden), Vermieter, Unternehmen und Hausverwaltungen\.", r"\1 …", s, count=1)),
    # раунд 1: мутации c/d били в первое вхождение строки — а оно в НАВИГАЦИИ, не в
    # заголовке услуги. Проверка молчала, и это была настоящая дыра (закрыта каналом C).
    # Здесь мутация нацелена в сам узел data-cms, чтобы проверять именно канал B.
    ("c) переставлены слова в названии услуги", "leistungen.html",
     lambda s: re.sub(r'(data-cms="services\[0\]\.title">)Gärtner &amp; Gartenpflege',
                      r"\1Gartenpflege &amp; Gärtner", s, count=1)),
    ("d) &amp; заменён связкой und в заголовке", "leistungen.html",
     lambda s: re.sub(r'(data-cms="services\[2\]\.title">)Hausmeisterservice, Objektpflege &amp; Grundstückspflege',
                      r"\1Hausmeisterservice, Objektpflege und Grundstückspflege", s, count=1)),
    ("j) подменено название услуги в НАВИГАЦИИ", "kontakt.html",
     lambda s: s.replace('#gartenpflege">Gärtner &amp; Gartenpflege',
                         '#gartenpflege">Gartenpflege komplett', 1)),
    ("e) два абзаца склеены в один", "leistungen.html",
     lambda s: re.sub(r"</p>\s*<p>", " ", s, count=1)),
    ("f) вернулась сочинённая услуга", "ueber-uns.html",
     lambda s: s.replace("</body>", "<p>Foto-Dokumentation</p></body>", 1)),
    ("g) услуги переставлены — GaLaBau не первая", "index.html",
     lambda s: s.replace('data-cms="services[4].title"', 'data-cms="services[0].title"', 1)),
    ("h) вернулся выдуманный факт о бизнесе", "ueber-uns.html",
     lambda s: s.replace("</body>", "<p>über fünf Jahren Erfahrung</p></body>", 1)),
]


def main():
    results = []
    with tempfile.TemporaryDirectory() as tmp:
        base_pages = os.path.join(tmp, "pages")
        base_data = os.path.join(tmp, "data")
        shutil.copytree(PAGES, base_pages)
        shutil.copytree(DATA, base_data)
        base = run(base_pages, base_data)
        results.append(("КОНТРОЛЬ: неизменённая копия", base == "RESULT: CLIENT_TEXTS_MATCH", base))

        for label, target, fn in MUTATIONS:
            work = os.path.join(tmp, "m")
            if os.path.exists(work):
                shutil.rmtree(work)
            shutil.copytree(base_pages, work)
            try:
                edit(os.path.join(work, target), fn)
            except AssertionError as e:
                results.append((label, False, str(e)))
                continue
            out = run(work, base_data)
            results.append((label, out.startswith("RESULT: CLIENT_TEXTS_MISMATCH"), out))

        # мутация ИСТОЧНИКА: расхождение нельзя «починить» правкой данных клиента
        work = os.path.join(tmp, "d")
        shutil.copytree(base_data, work)
        p = os.path.join(work, "services.json")
        edit(p, lambda s: s.replace("Gärtner & Gartenpflege", "Gartenpflege XYZ", 1))
        out = run(base_pages, work)
        results.append(("i) мутация ИСТОЧНИКА (services.json)",
                        out.startswith("RESULT: CLIENT_TEXTS_MISMATCH"), out))

    for label, ok, detail in results:
        print("%-44s %-7s %s" % (label, "OK" if ok else "ПРОВАЛ", detail))

    # рабочее дерево не должно было измениться
    untouched = run(PAGES, DATA) == "RESULT: CLIENT_TEXTS_MATCH"
    print("%-44s %-7s" % ("рабочее дерево не тронуто", "OK" if untouched else "ИЗМЕНЕНО"))

    ok = all(r[1] for r in results) and untouched
    print("SELFTEST_CLIENT_TEXTS: %s (%d/%d мутаций)"
          % ("PASS" if ok else "FAIL", sum(1 for r in results[1:] if r[1]), len(MUTATIONS) + 1))
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
