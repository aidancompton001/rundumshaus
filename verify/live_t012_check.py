import json, re, urllib.request, concurrent.futures as cf, html
BASE = "https://rundumshaus-littawe.de"
cities = json.load(open(r"C:\Projects\RundUmsHaus\site\src\data\cities.json", encoding="utf-8"))["cities"]
K = [l.strip() for l in open(r"C:\Projects\RundUmsHaus\docs\kevin-entkernung-text-2026-09-13.txt", encoding="utf-8").read().splitlines()]
def get(u):
    req = urllib.request.Request(u + ("&" if "?" in u else "?") + "cb=t012live", headers={"User-Agent": "Mozilla/5.0 rh-t012-check"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.status, r.read().decode("utf-8", "replace")
    except Exception as e:
        return getattr(e, "code", 0), ""
urls = ["%s/leistungen/entkernung-abbrucharbeiten/%s/" % (BASE, c["slug"]) for c in cities]
with cf.ThreadPoolExecutor(8) as ex:
    res = list(ex.map(get, urls))
bad = [u for u, (st, _) in zip(urls, res) if st != 200]
print("live pages 200:", len(urls) - len(bad), "of", len(urls), bad[:3])
st, sm = get(BASE + "/sitemap.xml")
locs = re.findall(r"<loc>([^<]+)</loc>", sm)
print("sitemap", st, "locs", len(locs), "entk", sum("entkernung-abbrucharbeiten/" in l for l in locs))
osn = res[[c["slug"] for c in cities].index("osnabrueck")][1]
t = html.unescape((re.search(r"<title>(.*?)</title>", osn) or [None, ""])[1])
print("osnabrueck title ok:", t == K[4])
st, home = get(BASE + "/")
print("home", st, "grid 3:", "lg:grid-cols-3" in home and "xl:grid-cols-5" not in home, "entk card:", "Rückbau und Entfernung von Estrich" in home)
st, old = get(BASE + "/leistungen/entruempelung/nordhorn/")
print("old page", st, "links to entk:", 'href="/leistungen/entkernung-abbrucharbeiten/nordhorn/"' in old)
