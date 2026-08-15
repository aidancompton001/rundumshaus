# -*- coding: utf-8 -*-
"""МУТАЦИОННЫЙ САМОТЕСТ проверки видимости текста (T010).

Landa, ревью результата, C-03: check_text_not_clipped.py приехал БЕЗ самотеста —
то есть его зелёный результат ничем не обеспечен (Закон 21). Отдельно C-02: он
пропускал текст, спрятанный в потомке через display:none, и Landa доказал это
мутацией. Здесь обе дыры закрыты испытанием: каждый способ спрятать текст
обязан покраснеть.

Usage: <playwright-python> verify/selftest_text_not_clipped.py
Печатает таблицу и SELFTEST_CLIPPED: PASS | FAIL. Код возврата 0/1.
"""
import io
import os
import shutil
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
PAGES = os.path.join(ROOT, "docs", "design", "v1-desktop")
CHECKER = os.path.join(HERE, "check_text_not_clipped.py")
TARGET = "leistungen.html"

# кусок текста клиента, который прячем разными способами
NEEDLE = "Ideal für Privatkunden, Vermieter, Unternehmen und Hausverwaltungen."

MUTATIONS = [
    ("display:none на потомке (атака Ланды)",
     lambda s: s.replace(NEEDLE, '<span style="display:none">%s</span>' % NEEDLE, 1)),
    ("visibility:hidden на потомке",
     lambda s: s.replace(NEEDLE, '<span style="visibility:hidden">%s</span>' % NEEDLE, 1)),
    ("нулевой кегль",
     lambda s: s.replace(NEEDLE, '<span style="font-size:0">%s</span>' % NEEDLE, 1)),
    ("прозрачность 0",
     lambda s: s.replace(NEEDLE, '<span style="opacity:0">%s</span>' % NEEDLE, 1)),
    ("line-clamp на карточке",
     lambda s: s.replace("</head>",
                         "<style>.service-block-text{display:-webkit-box;-webkit-line-clamp:2;"
                         "-webkit-box-orient:vertical;overflow:hidden}</style></head>", 1)),
    ("фиксированная высота с overflow:hidden",
     lambda s: s.replace("</head>",
                         "<style>.service-block-text{max-height:40px;overflow:hidden}</style></head>", 1)),
    # раунд 3 Ланды: все прежние мутации навешивались на ОБЁРНУТЫЙ span внутри узла,
    # то есть проверялось одно направление. Он спрятал текст на САМОМ узле и на предке —
    # проверка молчала. Эти шесть случаев закрывают оба направления.
    ("нулевой кегль на САМОМ узле",
     lambda s: s.replace("</head>", "<style>.service-block-text{font-size:0}</style></head>", 1)),
    ("прозрачный цвет на САМОМ узле",
     lambda s: s.replace("</head>", "<style>.service-block-text{color:transparent}</style></head>", 1)),
    ("clip-path на САМОМ узле",
     lambda s: s.replace("</head>", "<style>.service-block-text{clip-path:inset(100%)}</style></head>", 1)),
    ("узел уведён за левый край",
     lambda s: s.replace("</head>", "<style>.service-block-text{position:absolute;left:-9999px}</style></head>", 1)),
    ("opacity:0 на ПРЕДКЕ",
     lambda s: s.replace("</head>", "<style>.service-block>div{opacity:0}</style></head>", 1)),
    ("visibility:hidden на ПРЕДКЕ",
     lambda s: s.replace("</head>", "<style>.service-block>div{visibility:hidden}</style></head>", 1)),
    ("текст убран под ellipsis",
     lambda s: s.replace("</head>",
                         "<style>.service-block-text{white-space:nowrap;overflow:hidden;"
                         "text-overflow:ellipsis}</style></head>", 1)),
]


def run(pages):
    r = subprocess.run([sys.executable, CHECKER, pages, "375", "1440"],
                       capture_output=True, text=True, encoding="utf-8", timeout=600)
    out = r.stdout.strip().splitlines()
    return out[-1] if out else "(нет вывода)"


def main():
    results = []
    with tempfile.TemporaryDirectory() as tmp:
        base = os.path.join(tmp, "base")
        shutil.copytree(PAGES, base)
        results.append(("КОНТРОЛЬ: неизменённая копия",
                        run(base) == "RESULT: TEXT_FULLY_VISIBLE", run(base)))

        for label, fn in MUTATIONS:
            work = os.path.join(tmp, "m")
            if os.path.exists(work):
                shutil.rmtree(work)
            shutil.copytree(base, work)
            p = os.path.join(work, TARGET)
            s = io.open(p, encoding="utf-8").read()
            s2 = fn(s)
            if s2 == s:
                results.append((label, False, "мутация не применилась"))
                continue
            io.open(p, "w", encoding="utf-8", newline="\n").write(s2)
            out = run(work)
            results.append((label, out.startswith("RESULT: TEXT_CLIPPED"), out))

    for label, ok, detail in results:
        print("%-42s %-7s %s" % (label, "OK" if ok else "ПРОВАЛ", detail))
    ok = all(r[1] for r in results)
    print("SELFTEST_CLIPPED: %s (%d/%d мутаций)"
          % ("PASS" if ok else "FAIL", sum(1 for r in results[1:] if r[1]), len(MUTATIONS)))
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
