# -*- coding: utf-8 -*-
"""Надзаголовок не повторяет свой заголовок.

Landa, F-07 и F-18: дважды за перенос надзаголовок вставали ровно над H2,
который с этих же слов и начинается — «Warum wir» над «Warum Rund ums Haus
Littawe?», «Unsere Leistungen» над «Unsere Leistungen als Gärtner in
Osnabrück». Оба раза чинилось руками, второй раз руками же и вернулось.
Здесь класс дефекта закрывается механически.

Правило. Надзаголовок — наше слово, а не клиента. Он не имеет права:
  1) совпадать со своим H2 целиком;
  2) быть началом своего H2;
  3) начинаться с того же слова, что и H2.

Проверяются ВСЕ страницы сборки, а не представители: надзаголовок ставится
руками, и подставить его можно в любую.

Использование:  py verify/check_eyebrow_not_dup.py [каталог сборки]
"""
import glob
import io
import os
import re
import sys
import unicodedata

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Надзаголовок и следующий за ним заголовок в собранной разметке
PAIR = re.compile(
    r'class="eyebrow"[^>]*>(?P<eyebrow>.*?)</span>\s*'
    r'<h(?P<lvl>[12])[^>]*>(?P<heading>.*?)</h(?P=lvl)>',
    re.S | re.I)
TAGS = re.compile(r"<[^>]+>")


def plain(s):
    s = TAGS.sub("", s)
    s = s.replace("&amp;", "&").replace("&nbsp;", " ").replace("&#x27;", "'")
    s = unicodedata.normalize("NFC", s)
    return re.sub(r"\s+", " ", s).strip()


def first_word(s):
    m = re.match(r"[\wÄÖÜäöüß-]+", s)
    return (m.group(0) if m else "").lower()


def main():
    out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "site", "out")
    files = [f for f in glob.glob(os.path.join(out, "**", "*.html"), recursive=True)
             if os.sep + "admin" + os.sep not in f]
    pairs = bad = 0
    seen = set()
    for f in files:
        src = io.open(f, encoding="utf-8", errors="replace").read()
        for m in PAIR.finditer(src):
            e, h = plain(m.group("eyebrow")), plain(m.group("heading"))
            if not e or not h:
                continue
            pairs += 1
            why = None
            if e.lower() == h.lower():
                why = "надзаголовок равен заголовку"
            elif h.lower().startswith(e.lower()):
                why = "заголовок начинается с надзаголовка"
            elif first_word(e) and first_word(e) == first_word(h):
                why = "первое слово общее: «%s»" % first_word(e)
            if why:
                key = (e, h)
                if key not in seen:
                    seen.add(key)
                    rel = os.path.relpath(f, out).replace(os.sep, "/")
                    print("  ДУБЛЬ  %s | «%s» над «%s» — %s" % (rel, e, h[:60], why))
                bad += 1
    print("НАДЗАГОЛОВКИ: пар проверено %d на %d страницах, дублей %d"
          % (pairs, len(files), bad))
    print("RESULT: %s" % ("EYEBROWS_CLEAN" if bad == 0 else "EYEBROW_DUP:%d" % bad))
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
