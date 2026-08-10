# -*- coding: utf-8 -*-
"""ПРУФ: в мокапе стоят ТЕКСТЫ КЛИЕНТА, а не сочинённые при вёрстке (T010).

Клиент Kevin Littawe: «ja bei den Dienstleistungen am besten unsere Texte behalten».

Landa, ревью ТС1, F-01: разметка data-cms покрывает 37.8 % видимого текста мокапа.
Проверка, привязанная только к точкам data-cms, была бы ЗЕЛЁНОЙ при непочиненных
навигации, футере и meta — а названия услуг встречаются в мокапе 94 раза против
10 размеченных. Поэтому здесь ДВА независимых канала:

  A. ЗАПРЕТ — сочинённые строки не встречаются во ВСЕЙ папке ни разу.
     Сканируется весь файл целиком, включая <title>, meta, og:, alt, JSON-LD.
  B. ПРИСУТСТВИЕ — тексты клиента реально стоят в отведённых узлах, равенством,
     а не вхождением (F-08: «содержится в HTML» зелено при обрезанном тексте).

Нормализация зафиксирована дословно (F-08.5): её изменение — отдельное утверждение
реестра, потому что грубая нормализация (lower, срезание пунктуации) маскирует
реальные расхождения вроде «Gärtner & Gartenpflege» против «Gartenpflege & Gärtnerarbeiten».
Абзацы (F-07) сохраняются как маркер ¶ и сверяются по количеству: схлопывание
\\n\\n иначе даёт зелёный результат при потерянной структуре текста.

Usage: py verify/check_client_texts.py [папка_мокапа] [папка_данных]
Код возврата: 0 — CLIENT_TEXTS_MATCH, 1 — есть расхождения.
"""
import glob
import html
import io
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
PAGES = os.path.join(ROOT, "docs", "design", "v1-desktop")
DATA = os.path.join(ROOT, "site", "src", "data")

# Строки, сочинённые при вёрстке. Каждая обязана встречаться 0 раз во ВСЕЙ папке.
# Landa F-03: часть из них — не стиль, а несуществующие услуги и выдуманные факты
# о бизнесе клиента, которые уходили бы в Google Rich Results.
FORBIDDEN = [
    # названия услуг, которых клиент не писал.
    # ВАЖНО: запрещается точная сочинённая ФРАЗА, не отдельное слово. Первая версия
    # запрещала «Gärtnerarbeiten» — и покраснела на тексте самого клиента
    # («Ansprechpartner für Gärtnerarbeiten, Gartenpflege…»). Ниже стоит замок,
    # который такую ошибку ловит автоматически.
    "Gartenpflege &amp;&nbsp;Gärtnerarbeiten",
    "Gartenpflege & Gärtnerarbeiten",
    "Dachservice &amp;&nbsp;Dachreinigung",
    "Landschaftsbau &amp;&nbsp;Pflasterarbeiten",
    # услуги, которых у клиента нет ни в одном источнике.
    # «Treppenhausreinigung» сюда НЕ входит: слово стоит в metaDescription статьи
    # клиента про Mehrfamilienhäuser — замок выше это поймал. Запрещается сочинённый
    # буллет целиком, а не слово, встречающееся в тексте клиента.
    "<li>Treppenhausreinigung</li>",
    "Unterhaltsreinigung",
    "Dachinspektion",
    "Foto-Dokumentation",
    # выдуманные факты о бизнесе
    "fünf Jahren",
    "Jahre Erfahrung",
    "openingHours",
    "08:00",
    # заглушки, видимые клиенту
    "[Platzhalter",
    "[Kundenzitat",
    "[Kundenname",
]

# Точка мокапа -> (json-файл, путь до значения). Маппинг по id услуги, НЕ по индексу:
# в мокапе services[0]=gartenpflege, а в services.json services[0]=hausmeisterservice.
SERVICE_SLOT = {0: "gartenpflege", 1: "entruempelung", 2: "hausmeisterservice",
                3: "dacharbeiten", 4: "garten-landschaftsbau"}

NBSP = " "


def normalize(t):
    """ЗАФИКСИРОВАНА. Изменение = отдельное утверждение реестра (Landa F-08.5).

    Разворачивает сущности, приводит неразрывный пробел к обычному, схлопывает
    пробелы ВНУТРИ строки, но сохраняет границы абзацев как ¶ — иначе потеря
    структуры текста проходит незамеченной.
    """
    t = html.unescape(t).replace(NBSP, " ").replace("‑", "-")
    t = re.sub(r"[ \t]*\n\s*\n[ \t]*", "¶", t)     # абзац -> маркер
    t = re.sub(r"[ \t\r\n]+", " ", t)
    return t.strip()


def node_text(fragment):
    """Текст узла без разметки, с сохранением границ <p> как абзацев."""
    f = re.sub(r"<p[^>]*>", "\n\n", fragment, flags=re.I)
    f = re.sub(r"<br\s*/?>", " ", f, flags=re.I)
    f = re.sub(r"<[^>]+>", "", f)
    # открывающий <p> даёт ведущий разрыв, которому в источнике ничего не
    # соответствует: это граница узла, а не абзац
    return normalize(f).lstrip("¶").strip()


def slot(pagesrc, key):
    """Внутренность элемента, несущего data-cms="key" (с вложенными тегами)."""
    m = re.search(r'data-cms="%s"[^>]*>' % re.escape(key), pagesrc)
    if not m:
        return None
    start = m.end()
    tagm = re.search(r"<(\w+)[^>]*data-cms=\"%s\"" % re.escape(key), pagesrc)
    tag = tagm.group(1) if tagm else "div"
    depth, i = 1, start
    pat = re.compile(r"</?%s\b" % tag, re.I)
    while depth and i < len(pagesrc):
        mm = pat.search(pagesrc, i)
        if not mm:
            break
        depth += -1 if pagesrc[mm.start():mm.start() + 2] == "</" else 1
        i = mm.end()
    return pagesrc[start:pagesrc.rfind("<", start, i)] if depth == 0 else pagesrc[start:i]


def main():
    pages = sys.argv[1] if len(sys.argv) > 1 else PAGES
    data = sys.argv[2] if len(sys.argv) > 2 else DATA
    svc = {s["id"]: s for s in json.load(io.open(os.path.join(data, "services.json"), encoding="utf-8"))["services"]}
    hp = json.load(io.open(os.path.join(data, "homepage.json"), encoding="utf-8"))
    # Landa, ревью результата, C-05: скан шёл по *.html, и выдуманный факт,
    # внедрённый в js/main.js, проходил мимо — «во всей папке» было неправдой.
    files = sorted(f for f in
                   glob.glob(os.path.join(pages, "*.html"))
                   + glob.glob(os.path.join(pages, "js", "*.js"))
                   + glob.glob(os.path.join(pages, "css", "*.css"))
                   if not os.path.basename(f).startswith(("_", "zz-")))
    bad = 0

    # ЗАМОК НА САМ СПИСОК ЗАПРЕТОВ. Запрещённой может быть только та строка, которой
    # НЕТ в текстах клиента: иначе проверка запретит клиенту его собственные слова
    # и будет краснеть на правильном результате. Ровно это и случилось со словом
    # «Gärtnerarbeiten», встречающимся в homepage.about.body.
    print("ЗАМОК — ни один запрет не пересекается с текстами клиента:")
    # замок обязан видеть ВСЕ источники, включая шаблоны городов и статьи:
    # «Treppenhausreinigung» стоит в metaDescription статьи клиента, и узкий список
    # файлов пропустил бы этот запрет как правомерный
    src_blob = ""
    for p in sorted(glob.glob(os.path.join(data, "*.json"))
                    + glob.glob(os.path.join(data, "templates", "*.json"))):
        src_blob += io.open(p, encoding="utf-8").read()
    collide = [s for s in FORBIDDEN if html.unescape(s).replace(NBSP, " ") in src_blob]
    bad += len(collide) > 0
    print("  запретов: %d, пересечений с источником: %d  %s"
          % (len(FORBIDDEN), len(collide), "OK" if not collide else "ЗАПРЕТ ЛОВИТ ТЕКСТ КЛИЕНТА: " + str(collide)))

    print("КАНАЛ A — сочинённые строки обязаны отсутствовать ВО ВСЕЙ папке (%d файлов):" % len(files))
    whole = {os.path.basename(f): io.open(f, encoding="utf-8").read() for f in files}
    for s in FORBIDDEN:
        hits = {n: t.count(s) for n, t in whole.items() if s in t}
        total = sum(hits.values())
        bad += total > 0
        print("  %-42s %d вхождений  %s" % (s[:42], total,
              "OK" if total == 0 else "НАЙДЕНО в " + ", ".join(hits)))

    # Landa, ревью результата, H-01: «заглушки удалены» проверялось тремя строками,
    # а в ratgeber/datenschutz/impressum/kontakt оставались 15 скобочных заглушек и
    # две инженерные записки. Здесь ловится ЛЮБАЯ скобочная заглушка и служебный
    # жаргон разработки на странице, которую открывает клиент.
    print("ЗАГЛУШКИ И СЛУЖЕБНЫЙ ЖАРГОН — на видимых страницах их быть не должно:")
    holes = []
    for name, t in sorted(whole.items()):
        if not name.endswith(".html"):
            continue
        visible = re.sub(r"<!--.*?-->", "", t, flags=re.S)
        for m in re.finditer(r"\[[^\]<>]{4,90}\]", visible):
            holes.append((name, m.group(0)[:60]))
        for word in ("Prototyp –", "beim Port", "siehe README", "TODO", "Lorem ipsum"):
            if word in visible:
                holes.append((name, word))
    bad += len(holes) > 0
    print("  найдено: %d  %s" % (len(holes), "OK" if not holes
                                 else "; ".join("%s %r" % h for h in holes[:4])))

    print("СТРУКТУРИРОВАННЫЕ ДАННЫЕ — JSON-LD валиден и без HTML-сущностей (Landa C-01):")
    ld = bad_ld = 0
    for name, t in sorted(whole.items()):
        for m in re.finditer(r'<script type="application/ld\+json">(.*?)</script>', t, re.S):
            ld += 1
            try:
                json.loads(m.group(1))
            except Exception as e:
                bad_ld += 1
                print("  %-20s НЕ ПАРСИТСЯ: %s" % (name, e))
            if "&amp;" in m.group(1) or "&nbsp;" in m.group(1):
                bad_ld += 1
                print("  %-20s HTML-сущности внутри JSON — уйдут в Google дословно" % name)
    bad += bad_ld > 0
    print("  блоков: %d, дефектов: %d  %s" % (ld, bad_ld, "OK" if bad_ld == 0 else "ДЕФЕКТ"))

    print("КАНАЛ B — тексты клиента стоят в узлах (равенство, не вхождение):")
    idx = io.open(os.path.join(pages, "index.html"), encoding="utf-8").read()
    lst = io.open(os.path.join(pages, "leistungen.html"), encoding="utf-8").read()
    for n, sid in sorted(SERVICE_SLOT.items()):
        for page, src, key, want in (
                ("index", idx, "services[%d].title" % n, svc[sid]["title"]),
                ("leist", lst, "services[%d].title" % n, svc[sid]["title"]),
                ("leist", lst, "services[%d].description" % n, svc[sid]["detailDescription"])):
            got = node_text(slot(src, key) or "")
            w = normalize(want)
            ok = got == w
            bad += not ok
            mark = "OK" if ok else "РАСХОЖДЕНИЕ"
            print("  %-5s %-28s %-11s got=%d знак / want=%d знак" % (page, key, mark, len(got), len(w)))
            if not ok:
                print("        got : %s" % got[:120])
                print("        want: %s" % w[:120])

    # Landa, ревью результата, H-04: 50 буллетов — главный объём перенесённого текста —
    # не проверял ни один инструмент, любая регрессия там прошла бы зелёной.
    print("СПИСКИ УСЛУГ — позиции клиента из templates/<id>.json (Landa H-04):")
    lists_ok = lists_all = 0
    for n, sid in sorted(SERVICE_SLOT.items()):
        tp = os.path.join(data, "templates", "%s.json" % sid)
        items = json.load(io.open(tp, encoding="utf-8"))["leistungen"]["items"]
        for page, src, key, cnt in (("index", idx, "services[%d].bullets" % n, 4),
                                    ("leist", lst, "services[%d].subservices" % n, 6)):
            got = [normalize(x) for x in
                   re.findall(r"<li>(.*?)</li>", slot(src, key) or "", re.S)]
            got = [re.sub(r"<[^>]+>", "", g).strip() for g in got]
            want = [normalize(x) for x in items[:cnt]]
            ok = got == want
            bad += not ok
            lists_all += 1
            lists_ok += ok
            print("  %-5s %-30s %-11s %d позиций" % (page, key, "OK" if ok else "РАСХОЖДЕНИЕ", len(got)))
            if not ok:
                print("        got : %s" % got)
                print("        want: %s" % want)

    print("  списки: %d из %d совпали, расхождений: %d" % (lists_ok, lists_all, lists_all - lists_ok))

    print("АБЗАЦЫ — структура длинных текстов сохранена (Landa F-07):")
    for n, sid in sorted(SERVICE_SLOT.items()):
        want = normalize(svc[sid]["detailDescription"]).count("¶")
        got = node_text(slot(lst, "services[%d].description" % n) or "").count("¶")
        ok = got == want
        bad += not ok
        print("  %-24s абзацев в HTML=%d, в источнике=%d  %s"
              % (sid, got + 1, want + 1, "OK" if ok else "РАСХОЖДЕНИЕ"))

    # Блок «Über uns» на главной был сочинён целиком («steht für zuverlässige Arbeit,
    # faire Preise…»), хотя у клиента есть homepage.about. Проверка его не видела,
    # потому что он не про услуги — добавлен после визуального контроля.
    print("ГЛАВНАЯ — блок «Über uns» и подзаголовок героя из homepage.json:")
    for key, want in (("homepage.about.paragraph1", hp["about"]["body"]),
                      ("homepage.about.paragraph2", hp["about"]["body2"]),
                      ("homepage.hero.subtitle", hp["hero"]["subheading"])):
        got = node_text(slot(idx, key) or "")
        ok = got == normalize(want)
        bad += not ok
        print("  %-28s %-11s got=%d знак / want=%d знак"
              % (key, "OK" if ok else "РАСХОЖДЕНИЕ", len(got), len(normalize(want))))
    checks = node_text(slot(idx, "homepage.about.checks") or "")
    missing = [x for x in hp["warumWir"]["items"][:4] if normalize(x) not in checks]
    bad += len(missing) > 0
    print("  %-28s %-11s пунктов клиента в списке: %d из 4"
          % ("homepage.about.checks", "OK" if not missing else "НЕ ХВАТАЕТ " + str(missing),
             4 - len(missing)))

    print("ПОКАЗАТЕЛИ — приведены к источнику клиента (Landa F-14):")
    for i, st in enumerate(hp["stats"]):
        want_v, want_l = "%s%s" % (st["value"], st["suffix"]), st["label"]
        gv = node_text(slot(idx, "homepage.stats[%d].value" % i) or "")
        gl = node_text(slot(idx, "homepage.stats[%d].label" % i) or "")
        ok = gv == normalize(want_v) and gl == normalize(want_l)
        bad += not ok
        print("  stats[%d]  %-12s %-24s %s" % (i, gv, gl, "OK" if ok else "РАСХОЖДЕНИЕ (%s / %s)" % (want_v, want_l)))
    extra = sum(1 for t in whole.values() if "homepage.stats[%d]" % len(hp["stats"]) in t)
    bad += extra > 0
    print("  лишних плиток сверх источника: %d  %s" % (extra, "OK" if extra == 0 else "ЕСТЬ ВЫДУМАННАЯ"))

    # Самотест раунда 1 показал дыру: мутация названия услуги в НАВИГАЦИИ проходила
    # мимо обоих каналов — канал A знает только прежние сочинённые варианты, канал B
    # смотрит лишь узлы data-cms. Любой третий вариант написания оставался незамеченным.
    print("КАНАЛ C — все ссылки на услуги в меню и футере равны названиям клиента:")
    ANCHOR2ID = {"galabau": "garten-landschaftsbau", "gartenpflege": "gartenpflege",
                 "entruempelung": "entruempelung", "hausmeisterservice": "hausmeisterservice",
                 "dachservice": "dacharbeiten"}
    titles = {normalize(svc[i]["title"]) for i in svc}
    checked = wrong = 0
    for name, src in sorted(whole.items()):
        # Landa H-05: на самой leistungen.html меню и футер ссылаются локальными
        # якорями (#gartenpflege), поэтому девятая страница давала каналу 0 ссылок,
        # а утверждение говорило «всех 9 страниц».
        for m in re.finditer(r'<a href="(?:leistungen\.html)?#([a-z-]+)"[^>]*>(.*?)</a>', src, re.S):
            anchor, inner = m.group(1), node_text(m.group(2))
            if not anchor or anchor not in ANCHOR2ID:
                continue          # ссылка на страницу целиком, не на конкретную услугу
            checked += 1
            want = normalize(svc[ANCHOR2ID[anchor]]["title"])
            if inner != want and inner not in titles:
                wrong += 1
                print("  %-20s #%-20s %r != %r" % (name, anchor, inner[:40], want[:40]))
    bad += wrong > 0
    print("  ссылок проверено: %d, расхождений: %d  %s" % (checked, wrong, "OK" if wrong == 0 else "РАСХОЖДЕНИЕ"))

    print("ПОРЯДОК — GaLaBau первой, просьба клиента «Das als erstes» (Landa F-12):")
    for page, src in (("index", idx), ("leistungen", lst)):
        first = re.search(r'data-cms="services\[(\d)\]\.title"', src)
        got = SERVICE_SLOT.get(int(first.group(1))) if first else None
        ok = got == "garten-landschaftsbau"
        bad += not ok
        print("  %-12s первая услуга в DOM: %-24s %s" % (page, got, "OK" if ok else "НАРУШЕНО"))

    print("RESULT: %s" % ("CLIENT_TEXTS_MATCH" if bad == 0 else "CLIENT_TEXTS_MISMATCH:%d" % bad))
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
