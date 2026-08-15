# -*- coding: utf-8 -*-
"""ПРУФ НА ЖИВОМ САЙТЕ: опубликованное совпадает с тем, что проверяли локально.

Landa, ревью плана, F-12: доказательство снималось с локальной сборки, а в
интернет уезжает артефакт, собранный на CI другой командой (`npm install`
на ubuntu-runner против локальной Windows). Это разные вещи, и Закон 27 п.2
требует фиксировать среду измерителя, а не подразумевать её.

Отдельно F-34: план проверял «10 случайных адресов отвечают 200» — 2 % от 511
и без единого слова о содержимом. Здесь обходятся ВСЕ адреса карты сайта и
сверяются с локальным слепком: код ответа, title, description, canonical,
типы разметки.

Usage:
    <playwright-python> verify/check_live_site.py <слепок.json> [домен]

Код возврата: 0 — LIVE_MATCHES_BUILD, 1 — расхождения.
"""
import concurrent.futures as cf
import io
import json
import re
import sys
import urllib.error
import urllib.request

DEFAULT_HOST = "https://rundumshaus-littawe.de"
TIMEOUT = 30
WORKERS = 8


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "parity-check/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
            return r.status, r.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return e.code, ""
    except Exception as e:                                   # noqa: BLE001
        return 0, str(e)[:80]


def facts(src):
    # Слепок хранит текст с РАЗВЁРНУТЫМИ сущностями, живой HTML — с сырыми.
    # Без этого «Dachpflege &amp; …» не совпадало с «Dachpflege & …», и первый
    # же прогон дал 502 ложных расхождения на совпадающих заголовках.
    import html as _h

    def one(pat):
        m = re.search(pat, src, re.S | re.I)
        raw = (m.group(1) if m else "") or ""
        return re.sub(r"\s+", " ", _h.unescape(raw)).strip() or None
    types = []
    for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>', src, re.S):
        try:
            d = json.loads(block)
            items = d.get("@graph") if isinstance(d, dict) and "@graph" in d else d
            for x in (items if isinstance(items, list) else [items]):
                if isinstance(x, dict):
                    t = x.get("@type")
                    types.extend(t if isinstance(t, list) else [t])
        except Exception:                                    # noqa: BLE001
            types.append("НЕВАЛИДНЫЙ_JSON")
    return {
        "title": one(r"<title[^>]*>(.*?)</title>"),
        "description": one(r'<meta name="description" content="([^"]*)"'),
        "canonical": one(r'<link rel="canonical" href="([^"]*)"'),
        "jsonld": sorted(t for t in types if t),
    }


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return 2
    snap = json.load(io.open(sys.argv[1], encoding="utf-8"))
    host = (sys.argv[2] if len(sys.argv) > 2 else DEFAULT_HOST).rstrip("/")
    urls = snap.get("sitemap") or []
    print("АДРЕСОВ В КАРТЕ САЙТА: %d — обходим ВСЕ, не выборку (Landa F-34)" % len(urls))

    def check(u):
        path = re.sub(r"^https?://[^/]+", "", u) or "/"
        code, src = fetch(host + path)
        local = snap["pages"].get(path) or snap["pages"].get(path.rstrip("/") + "/")
        if code != 200:
            return ("КОД %s" % code, path)
        if not local:
            return ("нет в локальном слепке", path)
        live = facts(src)
        for key in ("title", "description", "canonical"):
            if (local.get(key) or None) != (live.get(key) or None):
                return ("%s расходится" % key, path)
        if set(local.get("jsonld") or []) - set(live["jsonld"]):
            return ("потеряна разметка", path)
        return None

    problems = []
    with cf.ThreadPoolExecutor(max_workers=WORKERS) as ex:
        for i, res in enumerate(ex.map(check, urls), 1):
            if res:
                problems.append(res)
            if i % 100 == 0:
                print("  проверено %d/%d, расхождений %d" % (i, len(urls), len(problems)))

    print("РАСХОЖДЕНИЙ: %d" % len(problems))
    for what, path in problems[:15]:
        print("  %-28s %s" % (what, path))
    print("RESULT: %s" % ("LIVE_MATCHES_BUILD" if not problems
                          else "LIVE_MISMATCH:%d" % len(problems)))
    print("БИНАРНО: %d" % (0 if problems else 1))
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
