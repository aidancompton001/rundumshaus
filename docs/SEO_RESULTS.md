# SEO Results Dashboard — T007 / PX-025

**Project:** RundumsHaus Ultra Local SEO + AI Search Optimization
**Started:** 2026-05-02
**Reporting cadence:** weekly (GSC/Bing) + bi-weekly (AI search) + 4w/8w/12w milestone reports

> **Tracking philosophy:** All measurements come from authoritative sources (GSC, Bing Webmaster, Yandex Webmaster, manual AI engine queries). No fabricated metrics. Where data is unavailable, the cell is left blank with a date for re-check.

---

## 1. Baseline (T007 launch — 2026-05-02)

### 1.1 Site state at launch

| Metric | Value | Source |
|--------|-------|--------|
| Total indexed pages (GSC) | 5 | GSC Coverage report |
| Total programmatic landing pages | 490 | `getAllPagePairs().length` |
| Total ratgeber articles | 10 | `ratgeber.json` |
| Schema items per landing page | 3 (Service, BreadcrumbList, FAQPage) | inline JSON-LD |
| Mobile Performance (Lighthouse) | 64–71 | Lighthouse CI |
| Mobile LCP | 4.6–7.1s | Lighthouse CI |
| Domain Authority (ahrefs free) | TBD | manual check 2026-05-XX |
| Backlinks (ahrefs free) | TBD | manual check 2026-05-XX |
| GSC clicks (last 28 days) | ~95 | GSC Performance |
| GSC impressions (last 28 days) | TBD | GSC Performance |
| GSC avg position | TBD | GSC Performance |

### 1.2 AI Search baseline (CEO manual — pending)

To be completed by CEO. See `scripts/ai-search-test.md` for protocol.

| Engine | "Hausmeister Osnabrück" | "Entrümpelung Bramsche" | "Gärtner Melle" | "Dachreinigung Osnabrück" | "Schrottabholung Osnabrück" | "Rund ums Haus Littawe" |
|--------|------------------------|------------------------|----------------|--------------------------|----------------------------|------------------------|
| ChatGPT Search | TBD | TBD | TBD | TBD | TBD | TBD |
| Perplexity | TBD | TBD | TBD | TBD | TBD | TBD |
| Claude Search | TBD | TBD | TBD | TBD | TBD | TBD |
| Google Gemini | TBD | TBD | TBD | TBD | TBD | TBD |
| You.com | TBD | TBD | TBD | TBD | TBD | TBD |
| Bing Copilot | TBD | TBD | TBD | TBD | TBD | TBD |

Format per cell: `cited:Y/N | rank if cited`. Screenshots in `docs/seo-baseline/`.

---

## 2. Weekly tracker (auto-fill once data arrives)

### Week 1 — 2026-04-27 → 2026-05-03 (snapshot 2026-05-03, GSC)

| Metric | Value | Δ vs baseline | Notes |
|--------|-------|---------------|-------|
| GSC indexed pages | **46** | +41 (9.2x от 5) | После T007 deploy 02.05 — рост за 1 день |
| GSC discovered, not indexed | **458** | n/a | Норма для week-1 programmatic, ожидаем индексацию 2-8 недель |
| GSC crawled, not indexed | 5 | n/a | Проверить thin content |
| GSC page-with-redirect (failed) | **4** | n/a | ⚠️ FIX needed — sitemap mismatch / stale /weitere-leistungen redirect |
| GSC 404 not found | 1 | n/a | ⚠️ FIX needed — найти URL |
| GSC impressions (7d) | **415** | n/a | (baseline было 28d) |
| GSC clicks (7d) | **20** | прогноз ~80/28d ≈ baseline 95/28d | Рано судить, индексация только начинается |
| GSC CTR (7d) | 4.8% | n/a | |
| GSC avg position (7d) | **5.9** | n/a | Очень хорошо для week-1 |
| Bing indexed pages | TBD | | Account pending от Kevin |
| Bing impressions (7d) | TBD | | |
| Yandex indexed pages | TBD | | Verification meta tag установлен 03.05, ждём подтверждения |

#### Top queries (week 1)
| Query | Clicks | Impressions | CTR | Notes |
|-------|--------|-------------|-----|-------|
| rund ums haus littawe | 4 | 54 | 7.4% | ✅ Brand работает |
| gärtner osnabrück | 1 | 15 | 6.7% | ✅ PX-022 Basis Local SEO для Garten работает |
| rund ums haus | 1 | 4 | 25% | Brand-вариация |
| **dachrinnenreinigung osnabrück** | **0** | **70** | 0% | 🚨 **TOP MISSED OPPORTUNITY** — высокий спрос, не в топ-3 |
| hausmeisterservice osnabrück | 0 | 29 | 0% | Конкуренты выше |
| schrotthändler osnabrück | 0 | 12 | 0% | |
| hausmeisterdienst osnabrück | 0 | 9 | 0% | |
| glasreinigung osnabrück | 0 | 6 | 0% | |
| hausbau osnabrück | 0 | 6 | 0% | Off-topic (мы не Hausbau) |
| heckenschnitt osnabrück | 0 | 5 | 0% | |

Total queries (week 1): **56**

#### Diagnostic findings (2026-05-03)
- ✅ Indexation jumped 5 → 46 за 24h после T007 deploy — Google активно crawl'ает
- ✅ Brand SEO работает (CTR 7.4% для main brand query)
- ✅ "gärtner osnabrück" получает clicks → PX-022 Basis для Garten validated
- 🚨 "dachrinnenreinigung osnabrück" 70 imp / 0 clicks — потенциал. Действие: усилить landing page Dachreinigung с фокусом на Dachrinnenreinigung
- 🚨 4 redirect-failures + 1 404 — техдолг, fix в течение недели
- ⏳ 458 "Discovered not indexed" — natural backlog, ожидаем 30-50% индексации к week 4

### Week 2 — 2026-05-XX → 2026-05-XX

…

---

## 3. Milestone reports

### 4-Week Report (target: 2026-05-30)

To be filled.

### 8-Week Report (target: 2026-06-27)

To be filled.

### 12-Week Report (target: 2026-07-25)

To be filled. Includes ROI calculation and final AI-citation evidence.

---

## 4. Backlinks tracker

| Catalogue | Submission date | Status | URL after approval | Notes |
|-----------|-----------------|--------|-------------------|-------|
| 11880.com | (existing) | live | https://www.11880.com/branchenbuch/osnabrueck/060692243B113943310/des-unternehmens-rund-ums-haus-littawe.html | found via WebSearch 2026-05-02 |
| Cylex | TBD | | | |
| GoYellow | TBD | | | |
| Das Örtliche | TBD | | | |
| Yelp DE | TBD | | | |
| Gelbe Seiten | TBD | | | |
| Branchenbuch.de | TBD | | | |
| NOZ Branchenbuch | TBD | | | |
| IHK Osnabrück | TBD | | | |
| HWK Osnabrück | TBD | | | |
| Hausmeisterdienste.net | TBD | | | |
| gartenbau-regional.de | TBD | | | |

---

## 5. AI test schedule

| Date | Engine 1 | Engine 2 | Engine 3 | Engine 4 | Engine 5 | Engine 6 | Notes |
|------|---------|---------|---------|---------|---------|---------|-------|
| 2026-05-02 | TBD | TBD | TBD | TBD | TBD | TBD | baseline pending |
| 2026-05-16 | | | | | | | week 2 |
| 2026-05-30 | | | | | | | week 4 milestone |
| 2026-06-13 | | | | | | | week 6 |
| 2026-06-27 | | | | | | | week 8 milestone |
| 2026-07-11 | | | | | | | week 10 |
| 2026-07-25 | | | | | | | week 12 final |

---

## 6. Notes & decisions log

- **2026-05-02:** T007 launched with 490 programmatic landings + 10 ratgeber + AI Search optimization (llms.txt, llms-full.txt, ai.txt, robots.ts three-tier framework).
- **2026-05-03:** PX-032 diagnostic + fix (S035). Full reconciliation of every 468 GSC URL (`c:/tmp/px032_reconciliation.csv`). Root causes:
  - 3/4 redirect-failed = HTTP/www host normalization (GitHub Pages config, requires CEO action)
  - 1/4 redirect-failed = external backlink to non-slash URL (out of code control)
  - 1 404 = `/services/` last-crawled before T007 deploy, self-resolves
  - 5 crawled-not-indexed = thin/duplicate content quality (Google declined random 5 of 490)
  - 458 discovered-not-indexed = normal Google crawl backlog
  - **NEW finding: og:image=localhost on 5 pages incl. homepage** (metadataBase missing), homepage missing canonical
- **2026-05-03:** PX-032 fixes deployed in branch `fix/px032-metadata-canonical-crosslinks`:
  - metadataBase added → og:image now production URL on 5 pages (verified via HTML re-audit)
  - Homepage canonical added (`<link rel=canonical href="https://rundumshaus-littawe.de/">`)
  - Schema.org canonical / BreadcrumbList items / Service.url → trailing slash
  - +1960 internal cross-links: every programmatic page → 4 same-city other-service pages
  - 226/226 tests pass, build 513 pages OK
- **CEO actions pending** (`docs/PX032_CEO_ACTIONS.md`): GitHub Pages Enforce HTTPS + www CNAME + GSC Validate Fix in 4 categories + Request Indexing top 30.
