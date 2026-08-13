# -*- coding: utf-8 -*-
"""ПРУФ ПЕРЕНОСА: после редизайна сайт не потерял НИ ОДНОГО адреса и SEO-элемента.

Задача переноса (T008 Ф4–Ф8) звучит просто — «поставить новый дизайн», но у
живого сайта 617 страниц, 511 адресов в карте сайта, 490 городских страниц и
100 страниц-редиректов со снятой услуги. Любая из них, пропавшая при переносе,
это выпадение из индекса Google — ровно та беда, из-за которой клиент неделю
назад не мог найти собственную страницу Entrümpelung.

Инструмент снимает СЛЕПОК сборки и сравнивает два слепка: до и после.
Сравниваются не файлы (они изменятся все — дизайн новый), а то, что обязано
пережить редизайн:

  * множество адресов (каждый URL до = URL после);
  * <title> и meta description каждой страницы;
  * canonical и hreflang;
  * H1;
  * наличие и тип JSON-LD;
  * цепочки редиректов (meta refresh) и их цели;
  * карта сайта: состав и количество.

Дизайн-специфичное (классы, разметка, порядок блоков) НЕ сравнивается: оно
меняется по замыслу. Сравнивается смысл страницы, а не её оформление.

Usage:
    py verify/check_migration_parity.py snapshot <папка_сборки> <файл.json>
    py verify/check_migration_parity.py compare <до.json> <после.json>

Код возврата для compare: 0 — PARITY_OK (ничего не потеряно), 1 — потери есть.
Это и есть бинарный ответ: 1 = перенос безопасен, 0 = нет.
"""
import hashlib
import io
import json
import os
import re
import sys

H1_ALLOWED_CHANGES = {"/"}      # решение CEO: H1 главной заменён текстом клиента

TAGS = {
    "title": r"<title[^>]*>(.*?)</title>",
    "description": r'<meta name="description" content="([^"]*)"',
    "canonical": r'<link rel="canonical" href="([^"]*)"',
    "og_title": r'<meta property="og:title" content="([^"]*)"',
    "og_description": r'<meta property="og:description" content="([^"]*)"',
    "og_image": r'<meta property="og:image" content="([^"]*)"',
    "robots": r'<meta name="robots" content="([^"]*)"',
    "refresh": r'<meta http-equiv="refresh" content="([^"]*)"',
}


def norm(t):
    """Схлопывание пробелов и разворот сущностей — чтобы сравнивать смысл."""
    import html as _h
    return re.sub(r"\s+", " ", _h.unescape(t or "")).strip()


def page_facts(src):
    f = {}
    for key, pat in TAGS.items():
        m = re.search(pat, src, re.S | re.I)
        f[key] = norm(m.group(1)) if m else None
    m = re.search(r"<h1[^>]*>(.*?)</h1>", src, re.S | re.I)
    f["h1"] = norm(re.sub(r"<[^>]+>", " ", m.group(1))) if m else None
    ld = re.findall(r'<script type="application/ld\+json">(.*?)</script>', src, re.S)
    types = []
    for block in ld:
        try:
            d = json.loads(block)
            # Landa F-02: главная разметка сайта лежит под @graph, а парсер брал
            # только верхний @type — 112 страниц числились как «без разметки»,
            # и удаление всего LocalBusiness прошло бы незамеченным.
            items = d.get("@graph") if isinstance(d, dict) and "@graph" in d else d
            items = items if isinstance(items, list) else [items]
            for x in items:
                if not isinstance(x, dict):
                    continue
                t = x.get("@type")
                # @type бывает списком: ["LocalBusiness","Organization"]
                types.extend(t if isinstance(t, list) else [t])
        except Exception:                                   # noqa: BLE001
            types.append("НЕВАЛИДНЫЙ_JSON")
    f["jsonld"] = sorted(t for t in types if t)
    # Landa F-01: он удалил ВСЕ картинки, заменил все внутренние ссылки на "#"
    # и снёс папку _next — приёмка ответила «БИНАРНО: 1». Потому что смотрела
    # только на meta-теги. Теперь смотрит и на то, из чего страница состоит.
    f["links"] = sorted(set(re.findall(r'href="(/[^"#?]*)"', src)))
    f["images"] = sorted(set(re.findall(r'<img[^>]+src="([^"]+)"', src)))
    f["alts"] = sorted(set(re.findall(r'<img[^>]+alt="([^"]*)"', src)))
    f["assets"] = sorted(set(re.findall(r'<(?:link[^>]+href|script[^>]+src)="(/_next/[^"]+)"', src)))
    return f


def snapshot(build_dir, out_path):
    pages = {}
    for root, _dirs, files in os.walk(build_dir):
        for name in files:
            if not name.endswith(".html"):
                continue
            p = os.path.join(root, name)
            url = "/" + os.path.relpath(p, build_dir).replace(os.sep, "/")
            url = re.sub(r"/index\.html$", "/", url)
            facts = page_facts(io.open(p, encoding="utf-8", errors="replace").read())
            # Самотест поймал дыру: удаление папки _next не меняло слепок, потому
            # что ссылки в HTML оставались. Страница ссылается на CSS и JS, файлов
            # нет — сайт без стилей, а сравнение молчало. Считаем недостающие.
            # Landa F-39: считались только пути /_next/, а картинки лежат в
            # /images/** — удаление папки с фотографиями проходило незамеченным.
            local = [x for x in facts["assets"] + facts["images"] if x.startswith("/")]
            facts["assets_missing"] = sum(
                1 for a in local
                if not os.path.exists(os.path.join(build_dir, a.lstrip("/").replace("/", os.sep))))
            pages[url] = facts
    sm = os.path.join(build_dir, "sitemap.xml")
    sitemap = sorted(re.findall(r"<loc>(.*?)</loc>",
                                io.open(sm, encoding="utf-8").read())) if os.path.exists(sm) else []
    import subprocess, datetime
    files = {}
    for name in ("CNAME", "robots.txt", "sitemap.xml", "favicon.ico", "404.html",
                 ".nojekyll", "llms.txt", "ai.txt", "icon.svg"):
        fp = os.path.join(build_dir, name)
        files[name] = hashlib.sha256(io.open(fp, "rb").read()).hexdigest()[:16]             if os.path.exists(fp) else None
    try:
        sha = subprocess.run(["git", "rev-parse", "HEAD"], capture_output=True,
                             text=True, timeout=30).stdout.strip()
    except Exception:                                        # noqa: BLE001
        sha = "?"
    newest = max((os.path.getmtime(os.path.join(r, n))
                  for r, _d, fs in os.walk(build_dir) for n in fs if n.endswith(".html")),
                 default=0)
    snap = {"build_dir": os.path.abspath(build_dir), "pages": pages, "sitemap": sitemap,
            "files": files, "git_sha": sha,
            "taken_at": datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds"),
            "build_newest_html": datetime.datetime.fromtimestamp(
                newest, datetime.timezone.utc).isoformat(timespec="seconds")}
    io.open(out_path, "w", encoding="utf-8", newline="\n").write(
        json.dumps(snap, ensure_ascii=False, indent=1, sort_keys=True))
    print("страниц:  %d" % len(pages))
    print("в карте:  %d" % len(sitemap))
    print("редиректов (meta refresh): %d" % sum(1 for f in pages.values() if f.get("refresh")))
    print("слепок сохранён: %s" % out_path)
    return 0


def compare(before_path, after_path):
    a = json.load(io.open(before_path, encoding="utf-8"))
    b = json.load(io.open(after_path, encoding="utf-8"))
    A, B = a["pages"], b["pages"]
    bad = 0

    # Landa F-35: эталон, снятый ПРЕЖНЕЙ версией инструмента, не содержит ни
    # ссылок, ни картинок, ни файлов сборки, ни типов разметки — и все проверки
    # против него молчат: вычитание из пустого множества всегда пусто. Защита
    # выглядела рабочей, а в боевом сценарии её не было.
    def schema(sn):
        pg = next(iter(sn["pages"].values()), {})
        return (frozenset(pg), "files" in sn, "git_sha" in sn)
    if schema(a) != schema(b):
        print("СХЕМА СЛЕПКОВ: РАЗНАЯ — сняты разными версиями инструмента.")
        print("  до:    ключей %d, files=%s, git_sha=%s"
              % (len(schema(a)[0]), schema(a)[1], schema(a)[2]))
        print("  после: ключей %d, files=%s, git_sha=%s"
              % (len(schema(b)[0]), schema(b)[1], schema(b)[2]))
        print("  Сравнение недействительно: пересними эталон текущей версией.")
        print("RESULT: PARITY_SCHEMA_MISMATCH")
        print("БИНАРНО: 0")
        return 1

    lost = sorted(set(A) - set(B))
    added = sorted(set(B) - set(A))
    print("АДРЕСА: было %d, стало %d" % (len(A), len(B)))
    bad += len(lost) > 0
    print("  пропало: %d  %s" % (len(lost), "OK" if not lost else "ПОТЕРЯ: " + ", ".join(lost[:8])))
    print("  добавилось: %d  %s" % (len(added), ", ".join(added[:5]) if added else "—"))

    print("SEO-ЭЛЕМЕНТЫ на общих адресах (обязаны пережить редизайн):")
    common = sorted(set(A) & set(B))
    for key in ("title", "description", "canonical", "robots", "h1", "refresh",
                "og_title", "og_description", "og_image"):
        diff = [u for u in common if A[u].get(key) != B[u].get(key)]
        # Landa раунд 1 по плану, F-01: title/description/h1 были объявлены
        # нефатальными — я обнулил заголовки всех 617 страниц, удалил 516
        # описаний, и приёмка ответила «БИНАРНО: 1». Теперь фатально всё,
        # а согласованные изменения объявляются поимённо, а не оптом.
        if key == "h1":
            diff = [u for u in diff if u not in H1_ALLOWED_CHANGES]
        fatal = True
        bad += (len(diff) > 0) and fatal
        mark = "OK" if not diff else ("ИЗМЕНЕНО: %d" % len(diff))
        print("  %-12s %-16s %s" % (key, mark,
              ("" if not diff else "напр. " + diff[0] + (" (критично)" if fatal else " (см. решение CEO)"))))

    print("СТРУКТУРИРОВАННЫЕ ДАННЫЕ:")
    # сравнивается МНОЖЕСТВО типов, а не «пусто/непусто»: выброс FAQPage при
    # сохранённом BreadcrumbList раньше проходил как OK
    lostld = [u for u in common if set(A[u]["jsonld"]) - set(B[u]["jsonld"])]
    badld = [u for u in common if "НЕВАЛИДНЫЙ_JSON" in (B[u]["jsonld"] or [])]
    bad += len(lostld) > 0 or len(badld) > 0
    print("  страниц потеряли разметку: %d | невалидный JSON: %d  %s"
          % (len(lostld), len(badld), "OK" if not lostld and not badld else "ПОТЕРЯ"))

    print("СОСТАВ СТРАНИЦ — ссылки, картинки, ассеты (Landa F-01):")
    for key, what in (("links", "внутренних ссылок"), ("images", "картинок"),
                      ("alts", "alt-текстов"), ("assets", "файлов CSS/JS")):
        lostn = [u for u in common if set(A[u].get(key) or []) - set(B[u].get(key) or [])]
        bad += len(lostn) > 0
        print("  %-16s страниц с потерей: %-5d %s" % (what, len(lostn),
              "OK" if not lostn else "ПОТЕРЯ, напр. " + lostn[0]))

    broken = [u for u in common if (B[u].get("assets_missing") or 0) > (A[u].get("assets_missing") or 0)]
    bad += len(broken) > 0
    print("  %-16s страниц с битыми: %-5d %s" % ("CSS/JS на диске", len(broken),
          "OK" if not broken else "ФАЙЛОВ НЕТ, напр. " + broken[0]))

    print("ФАЙЛЫ СБОРКИ — их потеря убивает домен и индексацию:")
    fa, fb = a.get("files") or {}, b.get("files") or {}
    lostf = [k for k, v in fa.items() if v and not fb.get(k)]
    bad += len(lostf) > 0
    print("  пропало: %d  %s" % (len(lostf), "OK" if not lostf else "ПОТЕРЯ: " + ", ".join(lostf)))
    # Landa F-38: хеши считались и не сравнивались — «robots.txt: Disallow /»
    # и подмена CNAME на чужой домен проходили как «файл на месте».
    CRITICAL_FILES = ("CNAME", "robots.txt")
    changed = [k for k in CRITICAL_FILES if fa.get(k) and fb.get(k) and fa[k] != fb[k]]
    bad += len(changed) > 0
    print("  содержимое изменено: %d  %s" % (len(changed),
          "OK" if not changed else "ПОДМЕНА: " + ", ".join(changed)
          + " — это привязка домена и правила индексации"))
    soft = [k for k, v in fa.items() if k not in CRITICAL_FILES and v and fb.get(k) and v != fb[k]]
    if soft:
        print("  изменены (не фатально): %s" % ", ".join(soft))

    print("ЧЕСТНОСТЬ ЗАМЕРА (Закон 27: среда измерителя фиксируется):")
    same_dir = a.get("build_dir") == b.get("build_dir")
    same_time = a.get("taken_at") == b.get("taken_at")
    selfcmp = same_dir and same_time
    bad += selfcmp
    print("  до:    %s  %s" % (a.get("taken_at", "?"), (a.get("git_sha") or "?")[:8]))
    print("  после: %s  %s" % (b.get("taken_at", "?"), (b.get("git_sha") or "?")[:8]))
    print("  %s" % ("OK — это два разных замера" if not selfcmp
                    else "САМОСРАВНЕНИЕ: слепок сверяется сам с собой, приёмка недействительна"))

    print("КАРТА САЙТА:")
    sa, sb = set(a["sitemap"]), set(b["sitemap"])
    smlost = sorted(sa - sb)
    bad += len(smlost) > 0
    alien = sorted(u for u in sb - sa if "rundumshaus-littawe.de" not in u)
    bad += len(alien) > 0
    print("  было %d, стало %d, пропало %d  %s"
          % (len(sa), len(sb), len(smlost), "OK" if not smlost else "ПОТЕРЯ: " + ", ".join(smlost[:5])))
    print("  чужих адресов добавлено: %d  %s"
          % (len(alien), "OK" if not alien else "ЧУЖОЙ ДОМЕН: " + ", ".join(alien[:3])))

    print("RESULT: %s" % ("PARITY_OK" if bad == 0 else "PARITY_LOST:%d" % bad))
    print("БИНАРНО: %d" % (1 if bad == 0 else 0))
    return 1 if bad else 0


def main():
    if len(sys.argv) >= 4 and sys.argv[1] == "snapshot":
        return snapshot(sys.argv[2], sys.argv[3])
    if len(sys.argv) >= 4 and sys.argv[1] == "compare":
        return compare(sys.argv[2], sys.argv[3])
    print(__doc__)
    return 2


if __name__ == "__main__":
    sys.exit(main())
