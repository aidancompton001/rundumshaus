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

### Week 1 — 2026-05-XX → 2026-05-XX

| Metric | Δ vs baseline | Notes |
|--------|---------------|-------|
| GSC indexed pages | | |
| GSC impressions (7d) | | |
| GSC clicks (7d) | | |
| GSC avg position | | |
| Bing indexed pages | | |
| Bing impressions (7d) | | |
| Yandex indexed pages | | |

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
