# Phase 1 Findings Log — PX-047 Garten Refactor

> Created: 2026-06-09
> Source: 2 rounds adversarial review (Round 1: Hans Landa + 3 agents, Round 2: Plan + Data + Performance + Rollback agents)
> Status: ⏸ STANDBY — все findings зафиксированы, ждём CEO решение

---

## Сводка

**Всего findings:** 36 (5 P0 round-1 + 5 P1 round-1 + 6 new round-2 critical + 4 architectural + ~16 medium/low)

**Без этих fixes Phase 1 deploy:** 97 страниц с broken neighbors, false legal claims, LCP regression, Schema duplicates, drift между meta и content.

**С fixes:** safe deploy, измеримые результаты (analytics), foundation для остальных 4 services.

---

## 🔴 P0 BLOCKERS (15) — must fix before deploy

### B1 — Hardcoded Osnabrück data в preview (round 1)
- **File:** `site/src/app/leistungen/gartenpflege/osnabrueck/page.tsx`
- **Issue:** `NEIGHBOR_CITIES`, `SERVICES`, `USPS`, `EINSATZ_CITIES`, `FAQS` constants hardcoded под Osnabrück
- **Impact:** Apply на 97 cities → каждая страница показывает соседей Osnabrück'а вместо своих
- **Fix:** Props-driven `GartenCityTemplate({ city, neighbors, einsatzCities })` — все per-city из `getNeighborCities(city)` + `service-areas.json`
- **Owner:** Implementation step in ТС3

### B2 — distancePhrase(0) undefined behavior
- **Location:** `site/src/lib/programmatic.ts` distancePhrase function
- **Issue:** `distanceKm = 0` для Osnabrück → returns "0 km von Osnabrück entfernt"
- **Impact:** SEO catastrophe на HQ city page
- **Fix:** `safeDistancePhrase(city)` guard:
  ```ts
  if (city.distanceKm === 0) return "direkt vor Ort in Osnabrück";
  if (city.distanceKm < 5) return "in unmittelbarer Nähe zu Osnabrück";
  if (city.distanceKm <= 30) return `${city.distanceKm} km von Osnabrück entfernt`;
  if (city.distanceKm <= 60) return `${city.distanceKm} km von Osnabrück (im Einsatzgebiet)`;
  return `${city.distanceKm} km von Osnabrück (auf Anfrage)`;
  ```

### B3 — Title overflow на длинных city names
- **Issue:** "Gärtner & Gartenpflege ${city} ★ Rasen & Hecken-Experte" = 82 chars для Neuenkirchen-Kreis-Steinfurt (>60 limit Google)
- **Affected cities:** Neuenkirchen (Kreis Steinfurt) 82, Dissen aT 78, Hagen aT 76, Bad Rothenfelde 70
- **Fix:** Tier-based title `buildTitle(city)`:
  - cityLen ≤ 12: full keyword format
  - cityLen ≤ 20: medium
  - cityLen > 20: minimal "Gartenpflege ${city} | Rund ums Haus"

### B4 — False distance claim — UWG § 5 LEGAL RISK
- **Issue:** Template says "Einsatzgebiet bis 60 km um Osnabrück" но Nordhorn = 80 km, Twist = 80 km, Meppen = 70 km
- **Impact:** German UWG § 5 false advertising → Abmahnung risk от Verbraucherzentrale
- **Fix:** Conditional `buildEinsatzText()`:
  ```ts
  if (city.distanceKm > 60) return "Auf Anfrage auch außerhalb unseres regulären Einsatzgebiets verfügbar.";
  return "Im Einsatzgebiet bis 60 km um Osnabrück.";
  ```

### B5 — Atomicity (6 steps в одном PR)
- **Issue:** Если step 4 (tests) падает после step 3 (cleanup), broken state
- **Fix:** Split на 2 PR:
  - **PR-A:** Component creation + tests + fixtures (NO wiring)
  - **PR-B:** Wire-up + delete static override + remove filter + sitemap bump

### B6 — Meta vs Template content divergence (round 2 NEW)
- **File:** `site/src/app/leistungen/[service]/[city]/page.tsx` line 46
- **Issue:** `generateMetadata` runs `generatePageContent()` — но новый template owns own copy. Meta и visible page **drift**.
- **Impact:** Kevin saw preview с meta X, deployed pages имеют meta Y. Bug #9 first round становится критичным.
- **Fix:** Single source `getTemplateContent(service, city)` function:
  ```ts
  // Used in BOTH generateMetadata AND template rendering
  export function getTemplateContent(service, city) {
    return { h1, intro, metaTitle, metaDescription, ... };
  }
  ```

### B7 — Schema duplication risk (round 2 NEW)
- **Issue:** Route в `[service]/[city]/page.tsx` уже emits Service schema. Если template emit own → 2 Service nodes per page → Google duplicate flag.
- **Fix:** **Ownership contract:**
  - **Route owns:** metadata, JSON-LD schema, canonical
  - **Template owns:** visible JSX + copy
  - Never cross

### B8 — Premature abstraction (round 2 NEW)
- **Issue:** План extract `ServiceCityTemplate` base для всех 5 services. **Leaky abstraction risk** — Garten ≠ Schrott funnel logic.
- **Fix:** **Rule of Three:**
  - Phase 1: concrete `GartenCityTemplate.tsx`
  - Phase 2: concrete `HausmeisterCityTemplate.tsx` (copy-paste OK)
  - Phase 3: NOW extract base `ServiceCityTemplate` из 3 real examples
  - Phases 4-5: consume base

### B9 — Analytics gap = success measurement blocker (round 2 NEW)
- **Status:** F13 от PX-046 unfixed
- **Issue:** Без analytics невозможно измерить успех Phase 1 vs baseline
- **Fix:** **Minimum Plausible** (cookieless, DSGVO-clean) **до** Phase 1 deploy. Tag `template_version=v2` для cohort analysis.

### B10 — service-areas.json display name mismatch (round 2 NEW)
- **Files:** `cities.json` vs `service-areas.json`
- **Issue:** "Neuenkirchen bei Rheine" в `cities.json` vs "Neuenkirchen (bei Rheine)" в `service-areas.json`
- **Impact:** Template lookup by displayName fails
- **Fix:** Standardize on slug everywhere. Fix service-areas.json display name to match cities.json.

### B11 — LCP regression on preview (round 2 NEW — MOST CRITICAL)
- **Measurement:** Lighthouse mobile
- **Phase 0 preview (NEW):** Perf 81, LCP **4.8s**, HTML 132 KB
- **Old pages (siblings):** Perf 91, LCP 3.4-3.5s, HTML 91-95 KB
- **Regression:** -10 points perf, +1.3s LCP, +39% HTML size
- **Impact:** Phase 1 deploy ухудшит ALL 97 city pages
- **Fix:**
  - Hero image responsive variants (400w/800w) — current 249KB → 80KB mobile
  - Image preload в head:
    ```html
    <link rel="preload" as="image" href="/images/services/garten-hero-800w.webp" media="(min-width: 768px)" />
    <link rel="preload" as="image" href="/images/services/garten-hero-400w.webp" media="(max-width: 767px)" />
    ```
  - Target: LCP < 3s mobile

### B12 — Sitemap lastmod timing
- **Issue:** Bumping в первом commit → sitemap "lies" если build fails
- **Fix:** Lastmod bump в **последнем** commit после deploy success verify

### B13 — Snapshot auto-regenerate без manual review
- **Issue:** `vitest run -u` captures buggy output as truth
- **Fix:** Regenerate one fixture first (osnabrueck), manual review diff, then regenerate остальные

### B14 — Snapshot fixture для osnabrueck не существует
- **File:** `site/src/lib/__tests__/programmatic.snapshot.test.ts`
- **Issue:** gartenpflegeFixtures = 8 cities, Osnabrück отсутствует → blind spot
- **Fix:** Add "osnabrueck" в fixtures до regenerate

### B15 — generateStaticParams filter removal coordination
- **File:** `/leistungen/[service]/[city]/page.tsx` line 21-23
- **Issue:** Filter `.filter((p) => !(p.service === "gartenpflege" && p.city === "osnabrueck"))` нужно удалить вместе со static override
- **Impact:** Если удалить отдельно — URL conflict или 404
- **Fix:** Удалить в одном PR (PR-B)

---

## 🟡 P1 HIGH (10)

### H1 — Schema provider:@id для distant cities (>40km)
- **Issue:** Все 97 cities reference `provider:@id` на `/#localbusiness` — misleading local presence для Vechta 80km
- **Fix:** Conditional `if (city.distanceKm <= 40)` для provider reference

### H2 — NOINDEX exceptions не предусмотрены в template
- **Fix:** Optional `seoOverrides?: { noindex?: boolean; titleOverride?: string }` prop

### H3 — Kevin communication gap
- **Issue:** Kevin видел preview с одним title format, после deploy будет другой (tier-based)
- **Fix:** Перед PR-B мерджем — screenshot Kevin'у Bramsche.html + объяснение

### H4 — CI partial deploy state risk
- **Issue:** GH Pages atomic per-deploy, но sitemap уже commited с new lastmod если build fails
- **Fix:** Sitemap bump в **последнем** commit post-deploy verify

### H5 — Per-tier customization через composition
- **Issue:** If future "T1 cities show testimonials, T2 not" — conditional bloat в template
- **Fix:** `sections: ReactNode[]` slot prop pattern (тuck в Playbook для будущего, но не в Phase 1)

### H6 — Sitemap re-crawl window blindness
- **Issue:** Google re-crawl 1-7 days. Optics "traffic dropped" может быть просто lag.
- **Fix:** 30-day measurement window в ТС3. CEO communication: "ignore week 1-2 GSC data".

### H7 — i18n abstraction для будущей EN версии
- **Fix:** Extract string constants в `templateCopy.de.ts` (cheap insurance, не full next-intl)

### H8 — Mobile reality check missing
- **Issue:** Kevin viewed preview на desktop (1440px)? Title overflow при 360px не tested.
- **Fix:** ТС3 QA gate: Playwright screenshots 360/768/1440 для 3 cities (T1 short, T1 long, T3)

### H9 — Word count metric undefined
- **Issue:** "600-700 слов" — prose only? Включая FAQ?
- **Fix:** prose-only (без FAQ, без headings, без CTA boilerplate). Target: 550-650 prose words.

### H10 — Rollback не покрывает Google index window
- **Issue:** Git revert restores code, но Googlebot мог crawl плохую версию в 0-24h окне
- **Fix:** 15-min canary verify window post-deploy → если fail, revert до Googlebot crawl

---

## 🟢 P2 MEDIUM (11)

### M1 — focus-visible CSS отсутствует
- **Fix в globals.css:** `a, button { @apply focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper; }`

### M2 — H2 → H3 hierarchy в "Weitere Leistungen"
- **Fix:** lines 428, 446 → `<h3>` instead of `<h2>`

### M3 — `<details>` FAQ ARIA attributes
- **Fix:** Add `aria-controls`, `aria-expanded`, `role="button"` to details/summary

### M4 — Long city name overflow в chips (320px viewport)
- **Fix:** Add `max-w-xs truncate` class или abbreviate labels

### M5 — CTA grid breakpoint 768px missing
- **Current:** `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- **Fix:** Add `md:grid-cols-3` для 768-1023px range

### M6 — Programmatic uniqueness — 588 identical FAQ entries
- **Issue:** Static 6 FAQ × 98 cities = 588 одинаковых = duplicate content risk
- **Fix:** Pool > used (12+ FAQs), select 6 by hash(city.slug)

### M7 — Skills not invoked в plan
- **Fix:** Add explicit invocations:
  - `test-driven-development` для new component
  - `verification-before-completion` перед claim "done"
  - `systematic-debugging` при errors

### M8 — Lighthouse baseline measurement (3 cities, не только osnabrueck)
- **Fix:** Pre-deploy baseline на 3 representative (T1 short, T2, T3 distant). Post-deploy comparison same 3.

### M9 — UNUSED variable lint warning в icons.test.tsx:49
- **Fix:** Remove `const names = [...]` declaration (dead code)

### M10 — Print styles missing
- **Fix:** Add `@media print { .bg-charcoal { background: transparent; color: black; } }` в globals.css

### M11 — Service worker / PWA не нужен
- **Status:** Confirmed no SW, no manifest. **No risk.**

---

## ✅ POSITIVE FINDINGS (Data agent)

- ✅ All 98 cities имеют валидные fields
- ✅ `getNeighborCities()` никогда empty (avg 3.8, max 8)
- ✅ Distance range 0-80 km (Osnabrück 0, Nordhorn 80)
- ✅ Tier distribution: 20 T1, 41 T2, 37 T3
- ✅ 0 Garten в NOINDEX_PAIRS → все 98 будут indexed
- ✅ Content pool sizes ≥ tier demand (8 introVariants, 9 body, 12 FAQ)
- ✅ displayName length safe (max 30 chars)
- ✅ Boost coverage strategic (3 T3 cities имеют Garten boost)

---

## Action Items Priority Order

| # | Item | Severity | ETA |
|---|------|----------|-----|
| 1 | Fix service-areas.json displayName | P0 | 5 min |
| 2 | Hero image responsive variants (400w/800w/1200w) | P0 | 20 min |
| 3 | Image preload в head | P0 | 5 min |
| 4 | Plausible analytics setup | P0 | 30 min |
| 5 | `getTemplateContent()` single source function | P0 | 30 min |
| 6 | `safeDistancePhrase()` guard | P0 | 15 min |
| 7 | `buildTitle()` tier-based | P0 | 15 min |
| 8 | `buildEinsatzText()` guard | P0 | 10 min |
| 9 | Schema ownership contract (template returns JSX only) | P0 | included in component |
| 10 | Props-driven `GartenCityTemplate.tsx` (with all guards) | P0 | 1.5 ч |
| 11 | Add osnabrueck to snapshot fixtures | P0 | 5 min |
| 12 | Wire-up в dynamic route (PR-B) | P0 | 30 min |
| 13 | Delete static override (PR-B) | P0 | 2 min |
| 14 | Remove generateStaticParams filter (PR-B) | P0 | 2 min |
| 15 | Sitemap lastmod bump (last commit) | P0 | 2 min |
| 16 | Validation scripts (canary, lighthouse, monitoring) | P0 | 1 ч |
| 17 | P1 fixes (10 items) | P1 | inline в template |
| 18 | P2 fixes (10 items, M11 skip) | P2 | inline |

**Total estimated time:** ~5 часов работы + 2 часа monitoring (happy path).

---

## Links

- [docs/PLAYBOOK_PROGRAMMATIC_TEMPLATE_REWRITE.md](PLAYBOOK_PROGRAMMATIC_TEMPLATE_REWRITE.md) — universal pattern (updated с round 2 findings)
- [docs/LESSONS.md](LESSONS.md) — L-011..L-015
- [docs/kevin-chat-log-2026-06.md](kevin-chat-log-2026-06.md)
- [docs/PENDING_KEVIN_REDESIGN_2026-06-08.md](PENDING_KEVIN_REDESIGN_2026-06-08.md)
- [docs/tasks/PX_REGISTRY.md](tasks/PX_REGISTRY.md) — PX-047
