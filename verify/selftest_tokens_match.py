# -*- coding: utf-8 -*-
"""МУТАЦИОННЫЙ САМОТЕСТ пруфа токенов (T008).

Landa, раунд 4: фальсифицируемость check_tokens_match.py была доказана для
ОДНОЙ проверки из семи (подменялся один цвет), а четыре типографские сверки
не проверялись никогда. Отдельно: прошлый тест правил ОТСЛЕЖИВАЕМЫЙ tokens.css
прямо в рабочем дереве через `sed -i` без trap — срыв по таймауту гейта (60s)
оставил бы в ветке подменённый цвет.

Здесь мутации делаются над КОПИЕЙ во временном каталоге, а чекер получает путь
к ней аргументом. Исходник не трогается вовсе. Мутируется представитель каждого
класса проверки: цвет, обычный кегль, кегль с заявленным отклонением.

Usage: py verify/selftest_tokens_match.py
Печатает таблицу мутаций и SELFTEST_TOKENS: PASS | FAIL. Код возврата 0/1.
"""
import io
import os
import shutil
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
TOKENS = os.path.join(ROOT, "docs", "design", "v1-desktop", "css", "tokens.css")
MEAS = os.path.join(ROOT, "docs", "design", "REFERENCE_MEASUREMENTS.json")
TYPO = os.path.join(ROOT, "docs", "design", "TYPOGRAPHY.json")
CHECKER = os.path.join(HERE, "check_tokens_match.py")

# (описание, что заменить, на что) — каждая мутация обязана уронить проверку
MUTATIONS = [
    ("цвет акцента",           "--color-accent:       #5A7F1B", "--color-accent:       #FF0000"),
    ("цвет тёмного",           "--color-dark:         #10171F", "--color-dark:         #223344"),
    ("кегль H1",               "--text-h1:", "--text-h1:         clamp(2.5rem, 4.93vw, 9rem); /*"),
    ("кегль карточки",         "--text-card-title: 1.1875rem", "--text-card-title: 2.5rem"),
    ("кегль с заявленным отклонением (bullets)",
     "--text-small:", "--text-small:      1.5rem; /*"),
]


def run(path, meas=None, typo=None):
    argv = [sys.executable, CHECKER, path, meas or MEAS, typo or TYPO]
    r = subprocess.run(argv, capture_output=True, text=True, encoding="utf-8", timeout=120)
    return r.stdout.strip().splitlines()[-1] if r.stdout.strip() else "(нет вывода)"


def main():
    original = io.open(TOKENS, encoding="utf-8").read()
    results = []

    with tempfile.TemporaryDirectory() as tmp:
        clean = os.path.join(tmp, "tokens_clean.css")
        shutil.copyfile(TOKENS, clean)
        base = run(clean)
        results.append(("КОНТРОЛЬ: неизменённая копия", base == "RESULT: TOKENS_MATCH", base))

        for label, find, repl in MUTATIONS:
            if find not in original:
                results.append((label, False, "цель мутации не найдена: " + find[:40]))
                continue
            mutant = os.path.join(tmp, "tokens_mutant.css")
            io.open(mutant, "w", encoding="utf-8", newline="\n").write(
                original.replace(find, repl, 1))
            out = run(mutant)
            caught = out.startswith("RESULT: MISMATCH")
            results.append((label, caught, out))

    # Landa раунд 6: хеш-замок эталона сам не был фальсифицирован — мутируем ЗАМЕР
    # и требуем, чтобы чекер это увидел (иначе расхождение чинится правкой эталона)
    with tempfile.TemporaryDirectory() as tmp2:
        mutant_meas = os.path.join(tmp2, "meas_mutant.json")
        raw = io.open(MEAS, encoding="utf-8").read()
        io.open(mutant_meas, "w", encoding="utf-8", newline="\n").write(
            raw.replace("#5A7F1B", "#123456", 1))
        out = run(TOKENS, meas=mutant_meas)
        results.append(("мутация ЭТАЛОНА замеров", out.startswith("RESULT: MISMATCH"), out))

    # Landa раунд 7 (LOW): пятый инструмент приехал без собственного случая.
    # Проверяем, что привязка к git фальсифицируема: подделанная константа ловится.
    with tempfile.TemporaryDirectory() as tmp3:
        fake_checker = os.path.join(tmp3, "check_tokens_match.py")
        fake_pin = os.path.join(tmp3, "check_meas_pinned.py")
        src = io.open(CHECKER, encoding="utf-8").read()
        io.open(fake_checker, "w", encoding="utf-8", newline="\n").write(
            src.replace('"REFERENCE_MEASUREMENTS.json": "', '"REFERENCE_MEASUREMENTS.json": "deadbeefdeadbeef', 1))
        pin_src = io.open(os.path.join(HERE, "check_meas_pinned.py"), encoding="utf-8").read()
        io.open(fake_pin, "w", encoding="utf-8", newline="\n").write(
            pin_src.replace('CHECKER = os.path.join(HERE, "check_tokens_match.py")',
                            'CHECKER = r"%s"' % fake_checker)
                   .replace('ROOT = os.path.dirname(HERE)', 'ROOT = r"%s"' % ROOT))
        r = subprocess.run([sys.executable, fake_pin], capture_output=True,
                           text=True, encoding="utf-8", timeout=120)
        last = r.stdout.strip().splitlines()[-1] if r.stdout.strip() else "(нет вывода)"
        results.append(("подделка константы привязки к git", last.startswith("RESULT: PIN_MISMATCH"), last))

    for label, ok, detail in results:
        print("%-44s %-7s %s" % (label, "OK" if ok else "ПРОВАЛ", detail))

    # исходник не должен был измениться ни на байт
    untouched = io.open(TOKENS, encoding="utf-8").read() == original
    print("%-44s %-7s" % ("исходный tokens.css не тронут", "OK" if untouched else "ИЗМЕНЁН"))

    ok = all(r[1] for r in results) and untouched
    print("SELFTEST_TOKENS: %s (%d/%d мутаций)" % ("PASS" if ok else "FAIL",
          sum(1 for r in results[1:] if r[1]), len(MUTATIONS) + 2))
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
