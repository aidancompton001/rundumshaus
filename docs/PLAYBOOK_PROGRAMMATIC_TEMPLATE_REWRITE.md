# Playbook: Programmatic Template Rewrite — RundumsHaus

> Создано: 2026-06-09
> Источник: Phase 1 analysis (PX-047)
> Цель: для будущих service templates (Hausmeister, Dach, Entrümp, Schrott) — избежать ошибок Phase 1 Garten

---

## ❗ ГЛАВНЫЙ УРОК

**"Static preview одобрен клиентом ≠ template готов к раскату на N pages."**

Phase 0 preview работает только на одной city (Osnabrück) потому что все данные **hardcoded под Osnabrück**. Применение того же template на 97 других cities **сломает их**:

- Neighbors → одинаковые везде = wrong cross-links + Google distrust
- Distance language → "0 km von Osnabrück" для Osnabrück (катастрофа) или "etwa X km" для далёких городов
- Title → overflow на длинных city names (Neuenkirchen-Kreis-Steinfurt = 82 chars > 60)
- Einsatzgebiet "60 km Umkreis" → false advertising для Bielefeld (55km OK), Nordhorn (80km — UWG § 5 risk)
- Schema `provider:@id` reference → misleading local presence для tier-3 cities (Vechta 80km)

→ **Static preview = иллюстрация. Реальный template = props-driven component.**

---

## 🔁 Универсальный паттерн для всех 5 services

### Step 1: Audit preview page для hardcoded data

Перед extract компонента — найти **все массивы и константы** которые в preview hardcoded под одну city:

```bash
# Найти hardcoded arrays в preview page
grep -n "const.*=.*\[" site/src/app/leistungen/${service}/osnabrueck/page.tsx
```

Типичные hardcoded блоки в Kevin'овских templates:
- `SERVICES` (services bullet list — 25-35 items, same для всех cities)
- `USPS` (9 ✓ USP — same)
- `BENEFITS_HERO` (5 ✅ above-fold)
- `FAQS` (6 Q&A — same текст)
- `EINSATZ_CITIES` (19-20 neighbor cities — **DIFFERENT для каждой city**)
- `NEIGHBOR_CITIES` (для cross-links — **DIFFERENT**)
- `WEITERE_LEISTUNGEN` (8 cross-service links — same структура, разные URL slugs)

### Step 2: Classify hardcoded data

| Категория | Pattern | Откуда брать |
|-----------|---------|--------------|
| **Globals** (одинаковые для всех cities) | SERVICES, USPS, BENEFITS_HERO, FAQS | Shared constants в `src/data/templates/${service}.ts` |
| **Per-city dynamic** (разные для каждой city) | NEIGHBOR_CITIES, EINSATZ_CITIES | `getNeighborCities(city)` + `service-areas.json` |
| **Per-tier dynamic** (зависят от tier) | Title format, description format | Tier-based functions |
| **Per-city overrides** (исключения) | noindex, title override, hidden sections | Optional `seoOverrides?` prop |

### Step 3: Build props-driven component

**Расположение:** `site/src/components/templates/${ServiceName}CityTemplate.tsx`

```tsx
import type { City } from "@/lib/programmatic";

interface ServiceCityTemplateProps {
  city: City;
  neighbors: City[];                          // Dynamic per city
  einsatzCities: string[];                    // Dynamic per city
  distanceMeta: string;                       // Guarded distancePhrase
  // Optional per-city overrides:
  seoOverrides?: {
    noindex?: boolean;
    titleOverride?: string;
    descriptionOverride?: string;
  };
}
```

**Внутри:**
- Импортируется shared constants из `@/data/templates/${service}.ts`
- Все `${CITY}` в JSX → `{city.displayName}`
- Все `${CITY_SLUG}` → `{city.slug}`
- `distanceMeta` инжектируется в intro paragraph + description

### Step 4: Distance phrase guard (КРИТИЧНО)

```ts
export function safeDistancePhrase(city: City): string {
  if (city.distanceKm === 0) return "direkt vor Ort in Osnabrück";
  if (city.distanceKm < 5) return "in unmittelbarer Nähe zu Osnabrück";
  if (city.distanceKm <= 30) return `${city.distanceKm} km von Osnabrück entfernt`;
  if (city.distanceKm <= 60) return `${city.distanceKm} km von Osnabrück (im Einsatzgebiet)`;
  return `${city.distanceKm} km von Osnabrück (auf Anfrage)`;
}
```

Без guard `distancePhrase(0)` = "0 km von Osnabrück entfernt" → SEO катастрофа для Osnabrück hub-page.

### Step 5: Tier-based title

Title 60 chars limit жёсткий. Длинные city names + длинный template = overflow.

```ts
function buildTitle(city: City, service: string): string {
  const cityLen = city.displayName.length;
  if (cityLen <= 12) {
    // "Bramsche" — full template fits
    return `${service} ${city.displayName} ★ Rasen & Hecken-Experte`;
  }
  if (cityLen <= 20) {
    // "Wallenhorst" — shorter
    return `${service} ${city.displayName} — Rasen & Hecken`;
  }
  // "Neuenkirchen-Kreis-Steinfurt" — minimal
  return `${service} ${city.displayName}`;
}
```

### Step 6: Einsatzgebiet claim validation

```ts
// Если city.distanceKm > MAX_EINSATZ_KM (60), либо обновить text, либо noindex
const MAX_EINSATZ_KM = 60;

function buildEinsatzText(city: City): string {
  if (city.distanceKm > MAX_EINSATZ_KM) {
    return "Auf Anfrage auch außerhalb unseres regulären Einsatzgebiets verfügbar.";
  }
  return "Im Einsatzgebiet bis 60 km um Osnabrück.";
}
```

Альтернативно — добавить далёкие cities в `NOINDEX_PAIRS`.

### Step 7: Schema.org provider @id reference

```ts
function buildServiceSchema(city: City) {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Gartenpflege",
    areaServed: { "@type": "City", name: city.displayName },
  };
  // НЕ ссылаться на /#localbusiness если city > 40km (misleading local presence)
  if (city.distanceKm <= 40) {
    schema.provider = { "@id": `${BASE_URL}/#localbusiness` };
  }
  return schema;
}
```

---

## 📋 Pre-implementation Checklist

Перед запуском любого PX-NNN на rewrite programmatic template:

- [ ] **Audit preview page** на hardcoded data (Step 1)
- [ ] **Classify** все массивы (Step 2)
- [ ] **Создать** shared constants файл `src/data/templates/${service}.ts`
- [ ] **Создать** `${ServiceName}CityTemplate.tsx` props-driven component
- [ ] **Применить** safeDistancePhrase + buildTitle + Einsatzgebiet guards
- [ ] **Добавить** osnabrueck в snapshot fixtures **до** regenerate
- [ ] **Manual review** новых snapshots (особенно osnabrueck + 1 tier-2 + 1 tier-3 cities)
- [ ] **Lighthouse baseline** для 3 representative cities
- [ ] **2 PR strategy**: PR-A (component+tests, no wiring) → PR-B (wire-up + cleanup)
- [ ] **Kevin communication** перед PR-B мерджем (screenshot bramsche + объяснение)
- [ ] **Pre-deploy git tag** для rollback
- [ ] **Sitemap lastmod bump** в **последнем** commit (не в первом)
- [ ] **15-min canary verify** post-deploy (5 sample cities curl-check)

---

## 🚨 Forbidden actions

- ❌ Применить static-preview-page как template без props refactor
- ❌ Hardcoded neighbors / einsatz_cities / city-specific data
- ❌ Unprotected `distancePhrase(city)` без guard для distanceKm=0
- ❌ Single title format для всех cities (overflow на длинных)
- ❌ "60 km Umkreis" claim для cities с distanceKm > 60 (UWG § 5 legal risk)
- ❌ Provider:@id Schema reference для cities > 40km (misleading local)
- ❌ Удалять старый GARTEN/SERVICE block в programmatic.ts (нужен для `getAllPagePairs()` в sitemap)
- ❌ `vitest run -u` слепо без manual snapshot review
- ❌ Snapshot fixtures без osnabrueck (slip-test через сетку)
- ❌ Все 6 шагов в одном PR (atomicity risk)
- ❌ Lighthouse baseline только на osnabrueck (не representative)
- ❌ Sitemap lastmod bump до фактического deploy (sitemap lies if build fails)

---

## 🔧 Verification commands (post-deploy)

```bash
# 1. Sample 5 representative cities (T1, T2, T3, edge, distant)
SAMPLES=("osnabrueck" "bramsche" "hagen-am-teutoburger-wald" "telgte" "bielefeld")

for city in "${SAMPLES[@]}"; do
  url="https://rundumshaus-littawe.de/leistungen/${SERVICE}/$city/"
  
  echo "=== $city ==="
  curl -s -o /dev/null -w "HTTP: %{http_code}\n" "$url"
  
  # Word count
  curl -s "$url" | sed 's/<[^>]*>/ /g' | tr -s ' \n' ' ' | wc -w
  
  # H2 count (expect 9)
  curl -s "$url" | grep -oc "<h2"
  
  # Schema present
  curl -s "$url" | grep -c "FAQPage" "BreadcrumbList" "Service"
  
  # Neighbors not wrong (NOT showing Osnabrück's neighbors for non-Osnabrück city)
  if [ "$city" != "osnabrueck" ]; then
    curl -s "$url" | grep -c "in Belm$\|in Wallenhorst$" 
    # Expect 0 unless those are real neighbors of this city
  fi
done

# 2. Lighthouse mobile на 3 representative
for city in osnabrueck bramsche bielefeld; do
  npx lighthouse "https://rundumshaus-littawe.de/leistungen/${SERVICE}/$city/" \
    --quiet --form-factor=mobile --only-categories=performance \
    --output=json --output-path=./lh-$city.json
done
```

---

## 🎯 Phase 1 Garten Stats (ожидаемые после fixes)

| Метрика | Pre-Phase 1 | Post-Phase 1 (после fixes) |
|---------|-------------|----------------------------|
| Word count (Tier 1 city) | 570-720 | 650-750 (target) |
| Word count (Tier 3 city) | 300-440 | 600-700 (Kevin template after expansion) |
| Title chars (max) | 75 | 60 (tier-based) |
| Internal links per page | 14-15 | 23 |
| FAQs (Schema) | 0 | 6 with FAQPage rich snippet |
| Schema.org blocks | 1 | 3 (Breadcrumb + Service + FAQPage) |
| Lighthouse mobile (target) | 75-82 | ≥ 80 |
| LCP (target mobile) | ≤ 4.1s | ≤ 3s with image preload |

---

## 🔄 Применение Playbook к остальным 4 services

После Phase 1 Garten merged + verified:

| Service | Kevin text получен? | Estimated time |
|---------|---------------------|----------------|
| **Garten** | ✅ Phase 1 (с этими fixes) | 3-4 ч |
| **Entrümpelung** | ✅ template same format | **2 ч** (применяем playbook) |
| **Hausmeister** | ✅ template same format | **2 ч** |
| **Dach** | ✅ template same format | **2 ч** |
| **Schrott** | ✅ template same format | **2 ч** |
| **Startseite** | ✅ full version | **2-3 ч** (отдельная архитектура) |

**Итого Phase 1-5: ~12-15 часов** (вместо 24-30 если делать каждый раз с нуля).

---

## 📚 Связанные документы

- [docs/kevin-chat-log-2026-06.md](kevin-chat-log-2026-06.md) — все тексты Kevin'а AS IS
- [docs/PENDING_KEVIN_REDESIGN_2026-06-08.md](PENDING_KEVIN_REDESIGN_2026-06-08.md) — оригинальный technical plan
- [docs/LESSONS.md](LESSONS.md) — L-001..L-013
- [docs/tasks/PX_REGISTRY.md](tasks/PX_REGISTRY.md) — все PX задачи

---

**Status:** STANDBY — ждём CEO решение по Phase 1 после рассмотрения этого Playbook.

---

## 📌 ADDENDUM (2026-06-09 round 2) — критические architecture updates

После повторного re-check 4-мя agents найдены дополнительные 6 critical findings. Эти rules **обязательны** для всех future service templates:

### A. Schema ownership contract

**Route owns:** metadata, JSON-LD schema (BreadcrumbList, Service, FAQPage), canonical
**Template owns:** visible JSX + copy
**NEVER cross.**

Reason: Template emitting own Schema = duplicate Service nodes per page = Google duplicate flag.

### B. Single source of truth: `getTemplateContent()`

```ts
// site/src/lib/template-content.ts
export function getTemplateContent(service: ServiceId, city: City): {
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  // ... все computed strings
} {
  // Single source consumed BY:
  // 1. generateMetadata() in route
  // 2. Template rendering
}
```

Reason: Если route's `generateMetadata` и template owns own copy → drift между meta и visible content (Kevin saw preview X, Google sees Y).

### C. Rule of Three (НЕ extract base прежде времени)

- Phase 1: concrete `GartenCityTemplate.tsx`
- Phase 2: concrete `HausmeisterCityTemplate.tsx` (copy-paste OK)
- Phase 3: ТОЛЬКО ТЕПЕРЬ extract base `ServiceCityTemplate` из 3 real examples
- Phases 4-5: consume base

Reason: Generalizing с N=1 = leaky abstraction (Garten ≠ Schrott funnel logic).

### D. Analytics — Phase 1 blocker

Без analytics невозможно измерить успех vs baseline. Минимум Plausible (cookieless, DSGVO-clean) **до** Phase 1 deploy. F13 from PX-046 audit → Phase 1 blocker.

### E. Image performance ДО deploy

Hero image responsive variants + preload **ДО** Phase 1, не "позже". Phase 0 preview уже регрессировал LCP +1.3s vs siblings — деплоить как есть нельзя.

```html
<link rel="preload" as="image" href="/images/services/garten-hero-800w.webp" media="(min-width: 768px)" />
<link rel="preload" as="image" href="/images/services/garten-hero-400w.webp" media="(max-width: 767px)" />
```

### F. Validation scripts — обязательно

`site/scripts/phase1/`:
- `baseline.sh` — pre-deploy snapshot 5 cities
- `lighthouse-baseline.sh` — pre-deploy Lighthouse 3 cities
- `canary-verify.sh` — post-deploy 10 checks
- `lighthouse-compare.sh` — post-deploy comparison
- `rollback.sh` — emergency procedure

→ Применимы для всех будущих services (просто меняй sample cities).

### G. service-areas.json ↔ cities.json consistency

Display names must match exactly. Use **slug** for lookups, never displayName.

### H. Phase split mandatory: PR-A + PR-B

- **PR-A**: Component + tests + fixtures + analytics + image optimization (NO wiring)
- **PR-B**: Wire-up + delete static override + remove filter + sitemap bump (last commit)

Reason: Atomicity — если PR-A падает, нет broken state в production.

---

**Updated total Phase 1 estimate:** ~5 часов работы + 2 часа monitoring.

После Phase 1 + Rule of Three extraction (после Phase 2): Phases 3-5 = по 2ч каждая благодаря shared base.

**Total Phase 1-5: ~13-15 часов** (с этим Playbook).
