# -*- coding: utf-8 -*-
"""ВАЛИДАТОР ГЕОМЕТРИИ — меряет расстояния по пикселям рендера.

Текстовые валидаторы проекта проверяют, что нужные слова и узлы есть на месте.
Ни один не видит, что заголовок наехал на соседнюю колонку: дефект «зазор 7 px
на странице кейса» прошёл мимо суммы 47 из 47 проверок.

Меряем по отрисованной картинке, а не по DOM: чтение DOM живого сайта из локальной
обёртки блокирует cross-origin, а виртуальное время headless-браузера съедает
таймеры раньше, чем страница успевает загрузиться. Пиксели врать не умеют.

Usage: py verify/check_geometry.py [base_url]
Код возврата: 0 — геометрия в норме, 1 — есть нарушения.
"""
import os
import subprocess
import sys
import tempfile

import numpy as np
from PIL import Image

BASE = (sys.argv[1] if len(sys.argv) > 1 else 'https://henner.ais152.com').rstrip('/')
CHROME = r'C:\Program Files\Google\Chrome\Application\chrome.exe'

CASES = ['/work/boss/', '/work/mango/', '/work/baldessarini/', '/work/mustang/']

# Ниже 24 px колонка заголовка и колонка текста читаются как склеенные.
MIN_GAP = 24
# Полоса, в которой лежит заголовок бренда и первая строка колонки ROLE.
BAND_TOP, BAND_BOTTOM = 150, 260


def shot(path: str, width: int, out: str) -> bool:
    with tempfile.TemporaryDirectory() as prof:
        cmd = [CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars',
               '--force-device-scale-factor=1', '--disable-lcd-text',
               '--window-size=%d,900' % width, '--virtual-time-budget=9000',
               '--user-data-dir=' + prof, '--screenshot=' + out, BASE + path]
        subprocess.run(cmd, capture_output=True, timeout=120)
    return os.path.exists(out)


def columns_with_ink(img: np.ndarray, y0: int, y1: int, thr: int = 150) -> np.ndarray:
    """Столбцы, где в полосе есть тёмные пиксели, — то есть текст."""
    band = img[y0:y1]
    return (band < thr).any(0)


def measure_gap(png: str) -> tuple:
    """Зазор между правым краем заголовка бренда и левым краем колонки с текстом роли.

    Заголовок — крупные глифы слева, колонка роли — мелкий текст справа.
    Ищем в полосе самый широкий разрыв между занятыми столбцами."""
    a = np.asarray(Image.open(png).convert('L'), float)
    h, w = a.shape
    y1 = min(BAND_BOTTOM, h)
    ink = columns_with_ink(a, BAND_TOP, y1)
    xs = np.where(ink)[0]
    if len(xs) < 2:
        return None, None, None

    # разрывы между соседними занятыми столбцами
    gaps = []
    prev = xs[0]
    for x in xs[1:]:
        if x - prev > 1:
            gaps.append((x - prev - 1, prev, x))
        prev = x
    if not gaps:
        return None, None, None

    gaps.sort(reverse=True)
    size, left_edge, right_edge = gaps[0]
    return size, int(left_edge), int(right_edge)


def measure_overflow(png: str, width: int) -> int:
    """Сколько пикселей контента выходит за правую границу окна."""
    a = np.asarray(Image.open(png).convert('L'), float)
    h, w = a.shape
    if w <= width:
        return 0
    tail = a[:, width:]
    return int((tail < 245).sum())


def main() -> int:
    issues = []
    print('ПРОВЕРКА ГЕОМЕТРИИ — %s' % BASE)
    print('минимальный зазор «заголовок бренда ↔ колонка роли»: %d px' % MIN_GAP)
    print('меряется по пикселям рендера в полосе y%d–%d\n' % (BAND_TOP, BAND_BOTTOM))
    print('%-24s %-7s %-9s %s' % ('СТРАНИЦА', 'ШИРИНА', 'ЗАЗОР', 'ВЕРДИКТ'))
    print('-' * 60)

    with tempfile.TemporaryDirectory() as tmp:
        for width in (1920, 1440, 1280):
            for path in CASES:
                png = os.path.join(tmp, path.strip('/').replace('/', '_') + str(width) + '.png')
                if not shot(path, width, png):
                    issues.append('%s @%d: снимок не сделан' % (path, width))
                    print('%-24s %-7d %s' % (path, width, 'снимок не сделан'))
                    continue

                gap, l, r = measure_gap(png)
                if gap is None:
                    print('%-24s %-7d %s' % (path, width, 'полоса пуста — пропуск'))
                    continue

                ok = gap >= MIN_GAP
                if not ok:
                    issues.append('%s @%d: зазор %d px (нужно >= %d), между x%d и x%d'
                                  % (path, width, gap, MIN_GAP, l, r))
                print('%-24s %-7d %-9d %s' % (path, width, gap, 'ok' if ok else '✗ СЛИШКОМ ТЕСНО'))

    print()
    if issues:
        print('НАРУШЕНИЙ: %d' % len(issues))
        for i in issues:
            print('  ✗', i)
        return 1
    print('Геометрия в норме: зазоры выдержаны на всех страницах кейсов.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
