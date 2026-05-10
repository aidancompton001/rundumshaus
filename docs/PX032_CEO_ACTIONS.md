# PX-032 — CEO Action Checklist

**Status:** Code fixes deployed (Phase A+B). The following actions require CEO intervention because they involve external accounts/services.

---

## 1. GitHub Pages — verify HTTPS + www (5 min)

**Why:** GSC reports 3/4 "Page with redirect (Failed)" for `http://`, `http://www.`, `https://www.` variants of the homepage. GitHub Pages needs to issue 301 redirects for these — currently it doesn't or Google can't follow them.

**Steps:**
1. Open https://github.com/aidancompton001/rundumshaus/settings/pages
2. Verify **"Enforce HTTPS"** is ✅ checked
3. Verify "Custom domain" = `rundumshaus-littawe.de` (no www)
4. If www subdomain redirect is missing, in IONOS DNS:
   - Add CNAME record: `www` → `aidancompton001.github.io`
5. After DNS settles (~1 hour), test in incognito:
   - http://rundumshaus-littawe.de → must 301 to https://
   - http://www.rundumshaus-littawe.de → must 301 to https://rundumshaus-littawe.de
   - https://www.rundumshaus-littawe.de → must 301 to https://rundumshaus-littawe.de

---

## 2. GSC — Validate Fix in 4 categories (2 min)

After deploy + ~24h crawl wait:

1. Open https://search.google.com/search-console (rundumshaus-littawe.de)
2. Indexing → Pages
3. For each of the 4 problem categories click → **"Validate Fix"**:
   - Page with redirect (Failed) — 4 URLs
   - Not found (404) — 1 URL
   - Crawled — currently not indexed — 5 URLs
   - Discovered — currently not indexed — 458 URLs

Validation runs for ~7 days; result emailed.

---

## 3. GSC — Manual "Request Indexing" for top 30 pages (10 min, optional)

Speeds up the 458 backlog. GSC limits ~10 URL/day.

**Priority order:**
1. https://rundumshaus-littawe.de/ (homepage)
2. https://rundumshaus-littawe.de/leistungen/
3. https://rundumshaus-littawe.de/einsatzgebiet/
4. https://rundumshaus-littawe.de/ueber-uns/
5. Top 7 cities × 2 priority services (Gärtner + Entrümpelung):
   - /leistungen/gartenpflege/osnabrueck/
   - /leistungen/gartenpflege/bramsche/
   - /leistungen/gartenpflege/melle/
   - /leistungen/gartenpflege/georgsmarienhuette/
   - /leistungen/gartenpflege/bissendorf/
   - /leistungen/gartenpflege/wallenhorst/
   - /leistungen/gartenpflege/belm/
   - /leistungen/entruempelung/osnabrueck/
   - /leistungen/entruempelung/bramsche/
   - /leistungen/entruempelung/melle/
   - /leistungen/entruempelung/georgsmarienhuette/
   - /leistungen/entruempelung/bissendorf/
   - /leistungen/entruempelung/wallenhorst/
   - /leistungen/entruempelung/belm/

**How:** GSC top search bar → paste URL → "Request Indexing" → wait ~1 min per URL.

---

## 4. (Optional) GSC URL Removal for the rogue non-slash URL

External backlink points to `/leistungen/entruempelung/halle-westfalen` (no trailing slash). We can't fix the source. Best option: tell GSC to ignore it.

1. GSC → Removals → New Request → "Temporarily remove URL"
2. URL: `https://rundumshaus-littawe.de/leistungen/entruempelung/halle-westfalen`
3. Type: "Remove URL only" (NOT "remove with cache")
4. Submit. Removed for ~6 months.

---

## 5. Wait & Monitor (14 days)

Day 7 (≈ 2026-05-13): Re-check GSC Pages.
- Expected: redirect-failed = 0-1 (3/4 fixed by step 1, 1 by step 4)
- Expected: 404 = 0 (self-resolved)
- Expected: crawled-not-indexed = 0-2 (improved by cross-links + canonical fix)
- Expected: discovered-not-indexed → 250-350 (down from 458)
- Expected: indexed → 100-150 (up from 46)

Day 14 (≈ 2026-05-20): Full report → update SEO_RESULTS.md week 2.

---

## What was already fixed in code (PR pending)

- ✅ `metadataBase` added to layout.tsx → og:image now resolves to production URL on all pages (was `localhost:3000`)
- ✅ Homepage now has `<link rel="canonical" href="https://rundumshaus-littawe.de/">`
- ✅ Schema.org BreadcrumbList URLs in programmatic pages now include trailing slash
- ✅ Programmatic page Schema.org `Service.url` includes trailing slash
- ✅ +1960 internal cross-links: every programmatic page now links to 4 same-city other-service pages ("Weitere Leistungen in {City}" block)
- ✅ Tests: 226/226 pass
- ✅ Build: 513 pages OK

---

## Reconciliation evidence

Full URL-by-URL audit available at `c:/tmp/px032_reconciliation.csv` (468 rows: every GSC URL classified with root_cause + fix_action).
