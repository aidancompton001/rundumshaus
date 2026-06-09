# Pre-Deploy Verification Framework

> Created: 2026-06-09 (PX-047 Phase 1 implementation)
> Status: Production-tested на 490 programmatic pages
> Applicability: Любой scaled deployment (static site, programmatic SEO, multi-page change)

---

## Зачем эта система

Перед deploy 97+ страниц одним PR — нужна **систематическая** verification, не "ad-hoc check'и". Эта система применилась в PX-047 Phase 1 и нашла 5 P0 blockers + 11 sub-issues которые при ручной проверке были бы пропущены.

**Outcome:** Phase 1 deploy-ready с binary verdict (YES/NO) обоснованным doxsами проверок.

---

## Архитектура — 6 слоёв проверки

```
Layer 1: Data Integrity     (cities.json, service-areas.json consistency)
Layer 2: Build              (npm run build → exit 0, all pages generated)
Layer 3: Tests              (vitest 238/238 + snapshot + invariant)
Layer 4: HTML Output Grep   (рендеренный HTML проверяется через grep)
Layer 5: Lighthouse         (local serve + mobile measurements vs baseline)
Layer 6: Architecture       (ownership contract, single source, guards)
```

Каждый слой = отдельная фаза. **Прохождение слоя N — gate для слоя N+1.**

---

## Layer 1 — Data Integrity

**Что проверяет:** Source data (JSON files) consistent across files и работают для всех edge cases.

**Commands:**

```bash
# 1.1 Cross-file consistency (displayName между файлами)
node -e "
const cities = require('./site/src/data/cities.json').cities;
const sa = require('./site/src/data/service-areas.json');
const inSA = new Set(sa.regions.flatMap(r => r.cities));
const inCJ = new Set(cities.map(c => c.displayName));
console.log('In cities.json but not in service-areas:', [...inCJ].filter(x => !inSA.has(x)));
console.log('In service-areas but not in cities.json:', [...inSA].filter(x => !inCJ.has(x)));
"

# 1.2 Edge cases coverage (0km, >60km, long names)
node -e "
const cities = require('./site/src/data/cities.json').cities;
const hq = cities.filter(c => c.distanceKm === 0);
const far = cities.filter(c => c.distanceKm > 60);
const longNames = cities.filter(c => c.displayName.length > 25);
console.log('HQ cities (0km):', hq.map(c => c.displayName));
console.log('Distant cities (>60km):', far.map(c => c.displayName + ' (' + c.distanceKm + 'km)'));
console.log('Long names (>25 chars):', longNames.map(c => c.displayName + ' (' + c.displayName.length + ')'));
"

# 1.3 Required fields validation
node -e "
const cities = require('./site/src/data/cities.json').cities;
const missing = cities.filter(c => !c.displayName || !c.slug || c.tier === undefined || c.distanceKm === undefined);
console.log(missing.length === 0 ? 'OK: all required fields present' : 'MISSING:', missing);
"
```

**Pass criteria:** No mismatches между файлами, edge cases identified для testing, no missing fields.

---

## Layer 2 — Build

**Что проверяет:** Code компилируется, все pages generated, no build errors.

**Commands:**

```bash
cd site && npm run build 2>&1 | tail -5
# Pass: exit 0, "(Static)" or "(SSG)" markers visible

# Verify all expected pages built
find site/out/leistungen/gartenpflege -name "index.html" | wc -l
# Pass: 98 (for 98 cities)

# No 404 fallbacks
ls site/out/leistungen/gartenpflege/ | wc -l
# Pass: 98 directories
```

**Pass criteria:** Exit 0, expected page count.

---

## Layer 3 — Tests

**Что проверяет:** Unit tests + snapshot tests + invariant tests pass.

**Commands:**

```bash
cd site && npx vitest run 2>&1 | tail -5
# Pass: "Tests N passed (N)" where N = expected count
```

**Pass criteria:** 100% test pass.

**Special considerations:**
- Snapshot tests — review diff manually before auto-regenerate (`vitest run -u`)
- Invariant tests — must pass without modification
- If new fixtures needed (e.g. osnabrueck), add explicitly, NOT auto-discover

---

## Layer 4 — HTML Output Grep (CRITICAL — нашёл реальные bugs)

**Что проверяет:** Рендеренный HTML output содержит ожидаемое и НЕ содержит запрещённое.

**Template-positive checks (must be present):**

```bash
for city in osnabrueck bramsche freren bielefeld neuenkirchen-bei-rheine; do
  URL="site/out/leistungen/gartenpflege/$city/index.html"
  echo "=== $city ==="

  # H1 specific to city
  grep -oE "<h1[^<]+" "$URL" | head -1

  # CTA present
  echo "CTA: $(grep -c 'Jetzt kostenloses Angebot' "$URL")"

  # FAQ Schema
  echo "FAQ Schema: $(grep -c 'FAQPage' "$URL")"

  # Schema count (should be 3 new + 1 layout = 4 blocks, but grep matches both open+close tags)
  echo "Schema occurrences: $(grep -oE 'application/ld\+json' "$URL" | wc -l)"

  # Title length
  TITLE=$(grep -oE "<title>[^<]+" "$URL" | head -1)
  echo "Title (${#TITLE} chars): $TITLE"

  # Word count (visible text)
  WORDS=$(cat "$URL" | sed 's/<script[^>]*>[^<]*<\/script>//g' | sed 's/<[^>]*>/ /g' | tr -s ' \n' ' ' | wc -w)
  echo "Words: $WORDS (target 600-700)"
done
```

**Template-negative checks (MUST be absent):**

```bash
# Old template markers should be gone
grep -c "auf einen Blick" site/out/leistungen/gartenpflege/osnabrueck/index.html
# Expected: 0 (old FaktenBlock removed)

# "0 km" must not leak for Osnabrück (distanceKm guard)
grep -oE "\s0 km" site/out/leistungen/gartenpflege/osnabrueck/index.html | wc -l
# Expected: 0 (whitespace+0+km, not "60 km" substring)

# False neighbors check: Belm is NOT a neighbor of Freren
grep -c "href=\"/leistungen/gartenpflege/belm/\"" site/out/leistungen/gartenpflege/freren/index.html
# Expected: 0

# Distance claim guard: ">60km" cities should have "auf Anfrage" not "60 km Umkreis"
grep -oE "(80|70) km von Osnabrück[^<]+" site/out/leistungen/gartenpflege/nordhorn/index.html | head -1
# Expected: "80 km von Osnabrück — Einsätze auf Anfrage..."
```

**Pass criteria:** All positive checks find expected, all negative checks find nothing.

**КРИТИЧЕСКАЯ зона:** Layer 4 нашёл 3 реальных bugs в PX-047 Phase 1:
1. Hardcoded NEIGHBOR_CITIES — false neighbors на не-Osnabrück cities
2. Missing FAQ visible section (только Schema, no UI)
3. Грep over-match на "0 km" (substring of "60 km")

→ **Без grep verification на actual HTML output — эти баги ушли бы в production.**

---

## Layer 5 — Lighthouse (Performance)

**Что проверяет:** Performance метрики на actual generated HTML vs production baseline.

**Setup local serve:**

```bash
cd site && npx --yes serve out -l 5555 > /tmp/serve.log 2>&1 &
sleep 4
```

**Run Lighthouse mobile:**

```bash
cd c:/tmp
for city in osnabrueck bramsche freren; do
  npx --yes lighthouse "http://localhost:5555/leistungen/gartenpflege/$city/" \
    --quiet --chrome-flags="--headless=new --no-sandbox" \
    --form-factor=mobile --only-categories=performance \
    --output=json --output-path="./lh-local-$city.json"

  node -e "const lh=require('./lh-local-$city.json');const a=lh.audits;console.log('$city: Perf='+Math.round(lh.categories.performance.score*100)+' LCP='+a['largest-contentful-paint'].displayValue+' CLS='+a['cumulative-layout-shift'].displayValue+' TBT='+a['total-blocking-time'].displayValue);"
done

# Cleanup
pkill -f "serve out" 2>/dev/null
```

**Pass criteria (tolerance bounds):**
- Perf score delta vs baseline: **>= -10** (cannot drop more than 10 points)
- LCP delta: **<= +0.5s** (cannot grow more than 0.5s)
- CLS delta: **<= +0.02**
- TBT — improvement OK, no upper limit specified

**Sample selection rules:**
- Minimum 3 cities representing different characteristics
- T1 hub (e.g. Osnabrück 0km) — was preview baseline
- T1 standard (e.g. Bramsche 17km) — typical user
- T3 distant (e.g. Freren 50km, Bielefeld 55km) — edge case

---

## Layer 6 — Architecture Contracts

**Что проверяет:** Code design choices verified в built artifacts.

**6.1 Ownership contract verification:**

Schema generation должна быть **только в route**, НЕ в template:

```bash
# Template файл НЕ должен иметь JSON-LD
grep -c "application/ld+json" site/src/components/templates/GartenCityTemplate.tsx
# Expected: 0

# Route файл ДОЛЖЕН иметь JSON-LD generation
grep -c "application/ld+json" site/src/app/leistungen/\[service\]/\[city\]/page.tsx
# Expected: ≥1
```

**6.2 Single source verification:**

generateMetadata и template должны использовать одну функцию для strings:

```bash
# Both должны импортировать getGartenContent
grep -c "getGartenContent" site/src/app/leistungen/\[service\]/\[city\]/page.tsx
# Expected: 1+ (used in generateMetadata)

grep -c "getGartenContent" site/src/components/templates/GartenCityTemplate.tsx
# Expected: 1+ (used in render)
```

**6.3 Conditional Schema provider:**

Provider:@id reference должен быть **только для close cities**:

```bash
# Bielefeld (55km) НЕ должен иметь provider:@id reference в Service Schema
grep -A20 "Gartenpflege Bielefeld" site/out/leistungen/gartenpflege/bielefeld/index.html | grep -c "@id.*localbusiness"
# Expected: 0 в Service schema (LocalBusiness reference в layout.tsx — отдельно)
```

**Pass criteria:** All architectural checks pass.

---

## Decision Matrix (Binary Verdict)

| Layer | Status | Action |
|-------|--------|--------|
| 1 Data | FAIL | STOP — fix data first |
| 2 Build | FAIL | STOP — code errors |
| 3 Tests | FAIL | STOP — test failures must be addressed |
| 4 HTML | FAIL | STOP — actual output не matches spec |
| 5 Lighthouse | FAIL (within tolerance) | WARN — document trade-off |
| 5 Lighthouse | FAIL (over tolerance) | STOP — performance regression |
| 6 Architecture | FAIL | STOP — design contracts violated |

**Binary verdict:**
- All layers PASS → **YES, deploy**
- Any STOP → **NO, fix and re-run**
- Any WARN → **CONDITIONAL YES** with documented trade-off + rollback plan ready

---

## Reusability Checklist

Применимость к будущим scaled deployments:

✅ **Programmatic SEO** (любые N×M page generators)
✅ **Template refactors** (extract component, rename, restructure)
✅ **Schema.org changes** (rich snippets, new types)
✅ **Performance optimizations** (image responsive, code split)
✅ **Multi-region/multi-language** (added per-tier/per-locale checks)
✅ **A/B test rollouts** (если используется feature flag — separate layer)

**Не подходит** для:
- ❌ Single page changes (over-engineered)
- ❌ Non-deterministic content (AI-generated — нужны другие checks)
- ❌ Database-backed sites (нужен DB integrity layer)

---

## Time investment

| Layer | Time | Frequency |
|-------|------|-----------|
| 1 Data | 10 min | Once per dataset change |
| 2 Build | 1-2 min | Every iteration |
| 3 Tests | 1-2 min | Every iteration |
| 4 HTML Grep | 15 min | Every deploy candidate |
| 5 Lighthouse | 10 min | Every deploy candidate |
| 6 Architecture | 5 min | Every deploy candidate |

**Total per deploy candidate:** ~40 min systematic verification → 5+ hours saved by avoiding rollbacks.

---

## Connection to existing artifacts

- **PHASE1_FINDINGS_LOG.md** — 36 findings discovered via this framework
- **PLAYBOOK_PROGRAMMATIC_TEMPLATE_REWRITE.md** — implementation patterns
- **validation scripts** in `site/scripts/phase1/` — automated layers 4+5
- **LESSONS.md** L-016 — meta-lesson on systematic verification

---

## Update process

When new finding type emerges (e.g. legal compliance check, accessibility audit):
1. Document the check pattern in appropriate layer
2. Add to validation scripts if reproducible
3. Update this framework
4. Add lesson if pattern was missed in past

**Never:** remove a layer because "we don't need it this time" — make it conditional, but keep documented.
