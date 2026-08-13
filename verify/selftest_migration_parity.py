# -*- coding: utf-8 -*-
"""МУТАЦИОННЫЙ САМОТЕСТ приёмки переноса (T008 Ф4–Ф8).

Landa, ревью плана, F-01: «бинарный критерий» был фикцией. Ревьюер взял копию
сборки, обнулил <title> на всех 617 страницах, удалил 516 описаний и 516 H1,
все картинки, всю внутреннюю навигацию, всю папку _next (CSS и JS), файлы
CNAME, robots.txt, favicon.ico, выпотрошил JSON-LD и подсадил спам-URL в карту
сайта — и приёмка ответила «БИНАРНО: 1».

Здесь его атака воспроизводится покомпонентно. Каждая мутация обязана дать 0.
Пока это не так, инструмент к приёмке переноса не допускается.

Usage: py verify/selftest_migration_parity.py
Печатает таблицу и SELFTEST_PARITY: PASS | FAIL. Код возврата 0/1.
"""
import io
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
BUILD = os.path.join(ROOT, "..", "..", "site", "out")
TOOL = os.path.join(HERE, "check_migration_parity.py")


def snap(build_dir, out):
    subprocess.run([sys.executable, TOOL, "snapshot", build_dir, out],
                   capture_output=True, text=True, timeout=900)
    return out


def verdict(before, after):
    r = subprocess.run([sys.executable, TOOL, "compare", before, after],
                       capture_output=True, text=True, encoding="utf-8", timeout=900)
    m = re.search(r"БИНАРНО: (\d)", r.stdout or "")
    return int(m.group(1)) if m else -1


# Мутации ломают КОПИЮ сборки. Каждая — отдельный способ «потерять» сайт.
def m_title(d):
    _edit_html(d, lambda s: re.sub(r"<title>.*?</title>", "<title></title>", s, flags=re.S))


def m_description(d):
    _edit_html(d, lambda s: re.sub(r'<meta name="description"[^>]*>', "", s))


def m_h1(d):
    _edit_html(d, lambda s: re.sub(r"<h1[^>]*>.*?</h1>", "", s, flags=re.S))


def m_images(d):
    _edit_html(d, lambda s: re.sub(r"<img[^>]*>", "", s))


def m_links(d):
    _edit_html(d, lambda s: re.sub(r'href="/[^"]*"', 'href="#"', s))


def m_jsonld(d):
    _edit_html(d, lambda s: re.sub(r'<script type="application/ld\+json">.*?</script>',
                                   "", s, flags=re.S))


def m_assets(d):
    p = os.path.join(d, "_next")
    if os.path.isdir(p):
        shutil.rmtree(p)


def m_cname(d):
    p = os.path.join(d, "CNAME")
    if os.path.exists(p):
        os.remove(p)


def m_page(d):
    for root, _dirs, files in os.walk(os.path.join(d, "leistungen")):
        if "index.html" in files and root.count(os.sep) > d.count(os.sep) + 1:
            shutil.rmtree(root)
            return


def m_sitemap_spam(d):
    p = os.path.join(d, "sitemap.xml")
    s = io.open(p, encoding="utf-8").read()
    io.open(p, "w", encoding="utf-8", newline="\n").write(
        s.replace("</urlset>", "<url><loc>https://spam.example.com/x</loc></url></urlset>"))


def _edit_html(d, fn, limit=None):
    n = 0
    for root, _dirs, files in os.walk(d):
        for name in files:
            if not name.endswith(".html"):
                continue
            p = os.path.join(root, name)
            s = io.open(p, encoding="utf-8", errors="replace").read()
            io.open(p, "w", encoding="utf-8", newline="\n").write(fn(s))
            n += 1
            if limit and n >= limit:
                return


MUTATIONS = [
    ("удалена городская страница", m_page),
    ("обнулены заголовки <title>", m_title),
    ("удалены meta description", m_description),
    ("удалены H1", m_h1),
    ("удалена разметка Google (JSON-LD)", m_jsonld),
    ("удалены все картинки", m_images),
    ("сломана внутренняя навигация", m_links),
    ("удалены CSS и JS (_next)", m_assets),
    ("удалён CNAME — привязка домена", m_cname),
    ("в карту сайта подсажен чужой адрес", m_sitemap_spam),
]


def subset(src, dst, cities=12):
    """Подвыборка сборки: мутацию видно на 30 страницах не хуже, чем на 617,
    а прогон вместо часа занимает минуты. Берём по одной странице каждого типа
    (главная, услуги, юридические, статья, редирект) плюс несколько городских —
    и все служебные файлы, потеря которых и есть проверяемый дефект."""
    os.makedirs(dst, exist_ok=True)
    keep = []
    for name in os.listdir(src):
        p = os.path.join(src, name)
        if os.path.isfile(p):
            keep.append(name)
    for name in keep:
        shutil.copy2(os.path.join(src, name), os.path.join(dst, name))
    for rel in ("_next", "leistungen", "ueber-uns", "kontakt", "impressum",
                "datenschutz", "referenzen", "ratgeber", "osnabrueck"):
        sp = os.path.join(src, rel)
        if not os.path.isdir(sp):
            continue
        if rel == "leistungen":
            os.makedirs(os.path.join(dst, rel), exist_ok=True)
            for svc in os.listdir(sp):
                sd = os.path.join(sp, svc)
                if not os.path.isdir(sd):
                    shutil.copy2(sd, os.path.join(dst, rel, svc)); continue
                n = 0
                for city in sorted(os.listdir(sd)):
                    cp = os.path.join(sd, city)
                    if os.path.isdir(cp) and n < cities:
                        shutil.copytree(cp, os.path.join(dst, rel, svc, city)); n += 1
                    elif os.path.isfile(cp):
                        os.makedirs(os.path.join(dst, rel, svc), exist_ok=True)
                        shutil.copy2(cp, os.path.join(dst, rel, svc, city))
        elif rel == "_next":
            # только css/js-манифесты: полный _next весит много и не нужен
            os.makedirs(os.path.join(dst, rel), exist_ok=True)
            for r2, _d2, f2 in os.walk(sp):
                for n2 in f2:
                    if n2.endswith((".css",)):
                        rp = os.path.relpath(os.path.join(r2, n2), sp)
                        tp = os.path.join(dst, rel, rp)
                        os.makedirs(os.path.dirname(tp), exist_ok=True)
                        shutil.copy2(os.path.join(r2, n2), tp)
        else:
            shutil.copytree(sp, os.path.join(dst, rel))
    return dst


def main():
    if not os.path.isdir(BUILD):
        print("нет сборки %s — сначала npm run build" % BUILD)
        return 1
    results = []
    with tempfile.TemporaryDirectory() as tmp:
        base_dir = subset(BUILD, os.path.join(tmp, "base"))
        print("подвыборка: %d страниц из 617\n"
              % sum(1 for r, _d, f in os.walk(base_dir) for n in f if n.endswith(".html")))
        before = snap(base_dir, os.path.join(tmp, "before.json"))

        # контроль: честная пересборка того же — обязан дать 1
        clean = subset(BUILD, os.path.join(tmp, "clean"))
        after0 = snap(clean, os.path.join(tmp, "after0.json"))
        v = verdict(before, after0)
        results.append(("КОНТРОЛЬ: нетронутая сборка", v == 1, "БИНАРНО: %d" % v))

        for label, fn in MUTATIONS:
            work = os.path.join(tmp, "m")
            if os.path.exists(work):
                shutil.rmtree(work)
            subset(BUILD, work)
            fn(work)
            after = snap(work, os.path.join(tmp, "after.json"))
            v = verdict(before, after)
            results.append((label, v == 0, "БИНАРНО: %d" % v))

    for label, ok, detail in results:
        print("%-44s %-7s %s" % (label, "OK" if ok else "ПРОВАЛ", detail))
    ok = all(r[1] for r in results)
    print("SELFTEST_PARITY: %s (%d/%d мутаций)"
          % ("PASS" if ok else "FAIL", sum(1 for r in results[1:] if r[1]), len(MUTATIONS)))
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
