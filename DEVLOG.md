# DEVLOG — RundumsHaus

---

### [S029] — 2026-05-02 — T007 / PX-025 Phase 1+2+3+6 (+9 framework): Ultra Local SEO + AI Search

**Задача:** T007 / PX-025 Ultra-Premium Local SEO + AI Search Optimization. Phase 1 (Discovery), Phase 2 (Programmatic SEO), Phase 3 (AI Search), Phase 6 (Ratgeber), Phase 9 framework. БЕЗ deploy — ждём данные Kevin'а.
**Роли:** #1 Viktor Hartmann (координация), #3 Marco Reiter (SEO/programmatic/ratgeber), #14 Hans Landa (XL adversarial review — initial NO-GO + re-review pending)
**Статус:** Phase 2-3-6 готовы локально, NOT deployed (ожидает данные Kevin'а: цены, отзывы, фото, формулировка; ОК CEO на Bing/Yandex/Plausible). Phase 4-5-7-8 — ждут CEO.

**Что сделано:**
- **Phase 1 — Discovery:** Конкурентный аудит через WebSearch (Stockreiter, Rümpel Meister, Dukat, Hagedorn, 1A Haushaltsauflösung). Найдена существующая 11880.com-citation для Kevin'а. Шорт-лист 30→97 городов финализирован (CEO решение). Saved: `docs/SEO_RESEARCH.md`.
- **Phase 2 — Programmatic SEO Foundation (с Hans Landa fixes):**
  - `cities.json` обогащён: 98 городов с tier/slug/displayName/Bundesland/Landkreis/PLZ-Prefix/distanceKm/populationClass/uniqueHook
  - Tier 1: 12→**20** (Landa C2 fix), Tier 2: 41, Tier 3: 37
  - **Symmetrize neighbor graph** (Landa C3): 53→**0 orphans**
  - `lib/programmatic.ts` переписан: 8 intro variants/service, 12 FAQ pool/service с rotation, tier-scaled bodyParagraphs (5/3/2), city-specific Fakten (40% unique data per Google E-E-A-T 2026)
  - `[service]/[city]/page.tsx` обновлён: Fakten-Block, displayName для disambiguation Neuenkirchen, @id reference для LocalBusiness (Landa M4)
  - `layout.tsx` schema: HomeAndConstructionBusiness subtype + WebSite + Organization graph с @id refs, foundingDate 2026, founder Kevin Littawe
  - `sitemap.ts` обновлён: 7 static + 10 ratgeber + 490 programmatic = **507 URLs**
  - Build: **512 страниц** generated (Turbopack ~10s)
- **Phase 3 — AI Search Optimization (GEO 2026):**
  - `public/llms.txt` (Anthropic standard, 8.1KB) с answer-first структурой и AI-citable specific facts
  - `public/llms-full.txt` (13.4KB) — comprehensive content dump для LLM crawlers
  - `public/ai.txt` (909B) — alternative AI-policy format
  - `robots.ts` переписан с **2026 three-tier framework**: ALLOW для GPTBot/ClaudeBot/Claude-SearchBot/Claude-User/PerplexityBot/Perplexity-User/OAI-SearchBot/ChatGPT-User/Google-Extended/Applebot-Extended/CCBot/YouBot/MistralAI-User/Meta-ExternalAgent. DISALLOW для Bytespider (abusive)
  - Главная: новый `FaktenBlock` — answer-first 200-words paragraph + 18 structured Fakten (Bundesland, Standort, Telefon, Festpreis-Differenzierung, etc.)
- **Phase 6 — Ratgeber (kompakt-Format, не Pillar Pages):**
  - `/ratgeber` index page + `/ratgeber/[slug]` dynamic route (Next.js 16 generateStaticParams)
  - **10 ratgeber статей kompakt-Format 500-850 Wörter Artikel-Body** (Hans Landa Re-Review корректирует первоначальное Über-Claim 1500-2500w): Hecke schneiden Osnabrück (850w), Entrümpelung Kosten (700w), Dachreinigung sinnvoll, Hausmeister Mehrfamilienhaus (557w), Schrottabholung, Frühjahrspflege Checkliste (508w, slug fixed ASCII), Haushaltsauflösung Todesfall, Winterdienst Pflichten (647w), Gärtner vs Selbstmachen, Garten anlegen Kosten 2026
  - Каждая статья: Article schema + BreadcrumbList; HowTo schema на 3 articles (hecke-schneiden, schrottabholung, gartenpflege-fruehjahr)
  - Real regional facts: Bundesnaturschutzgesetz §39, kommunale Streupflicht-Regeln, Awigo Wertstoffhöfe, Salzstreuverbot Osnabrück 2019, etc.
  - **Phase 6.5 future work (deferred):** Expansion ratgeber до 1500-2500w Pillar Pages für stärkere informational keyword competition
- **Cross-linking:**
  - `Servicegebiet.tsx` — 98 cities → /leistungen/gartenpflege/[slug] (anti-orphan reinforcement)
  - Programmatic-страницы → 3-6 neighbor cities (symmetric)
- **Phase 9 — Measurement Framework:**
  - `docs/SEO_RESULTS.md` — baseline + weekly/4w/8w/12w report templates + AI test schedule
  - `scripts/ai-search-test.md` — 6 engines × 8 queries protocol для bi-weekly tests
  - SEO_BACKLINKS табличка в SEO_RESULTS.md (12 каталогов)
- **Bonus:** `docs/google-review-template.md` — Place ID setup + 3 WhatsApp templates + 4-5-stars strategy

**Результат проверки:**
- Build: **512 HTML страниц** ✅
- Tests: **128/128 pass** ✅
- Word counts: programmatic landings 1700-2200w (incl. nav, ~600w unique core); ratgeber 2100-2900w ✅
- Schema validity: BreadcrumbList, FAQPage, Service (с @id ref), HowTo, Article, LocalBusiness/HomeAndConstructionBusiness, WebSite, Organization
- llms.txt + llms-full.txt + ai.txt + robots.txt все generated в `out/`

**Ключевые решения:**
- 97→98 cities (4 Neuenkirchen) tiered (Landa T1=20 fix через distance-based scoring + manual override)
- Symmetric neighbor graph через reverse-link map с soft cap 6
- 8 intro variants × hash rotation = ~12 cities/variant per service (vs 33 в первой итерации)
- FAQ rotation через pickN с deterministic offset
- @id schema reference вместо N+1 LocalBusiness duplication
- HomeAndConstructionBusiness specific subtype вместо generic LocalBusiness (better Google match)
- AggregateRating SKIPPED — нет visible reviews on-page; будет добавлен после получения 5+ Google reviews от Kevin'а
- Plausible/Umami self-hosted vs только GSC — pending CEO

**Не сделано (ждёт данных от CEO/Kevin):**
- Phase 4 (Bing/Yandex/Ecosia/IndexNow) — нужны аккаунты CEO
- Phase 5 deep schema priceSpecification — нужны цены Kevin'а
- Phase 5 AggregateRating — нужны 5+ реальных отзывов
- Phase 7 Backlinks (Cylex, GBP optimization) — manual CEO/Kevin
- Phase 8 Performance (mobile LCP fix) — отложено для отдельной сессии
- Deploy — НЕ сделан до получения Kevin'овых данных и Hans Landa GO

**Артефакты (создано/изменено):**
- `site/scripts/generate-cities.mjs` (re-write)
- `site/src/data/cities.json` (regenerated)
- `site/src/data/ratgeber.json` (new)
- `site/src/lib/programmatic.ts` (re-write)
- `site/src/lib/ratgeber-content.ts` (new — 10 articles)
- `site/src/app/leistungen/[service]/[city]/page.tsx` (updated)
- `site/src/app/ratgeber/page.tsx` (new)
- `site/src/app/ratgeber/[slug]/page.tsx` (new)
- `site/src/app/sitemap.ts` (updated)
- `site/src/app/robots.ts` (re-write — 2026 AI bot framework)
- `site/src/app/layout.tsx` (schema graph re-write)
- `site/src/app/page.tsx` (FaktenBlock added)
- `site/src/components/sections/FaktenBlock.tsx` (new)
- `site/src/components/sections/Servicegebiet.tsx` (cross-links)
- `site/public/llms.txt`, `site/public/llms-full.txt`, `site/public/ai.txt` (new/rewrite)
- `docs/SEO_RESEARCH.md`, `docs/SEO_RESULTS.md`, `docs/google-review-template.md`, `scripts/ai-search-test.md` (new)
- `docs/tasks/T007_ultra_seo_ai_search.md` (roadmap)

**Следующие шаги (когда CEO предоставит):**
1. Цены Kevin'а → priceSpecification в Service schema
2. 5+ реальных отзывов → AggregateRating + visible reviews block
3. Bing/Yandex accounts → Phase 4 indexing
4. AI baseline screenshots → SEO_RESULTS.md baseline
5. ahrefs DR snapshot → backlinks baseline
6. GBP audit → Phase 7 optimization plan
7. Hans Landa re-review (XL обязательно) — pending после этой сессии
8. Phase 8 Performance fix (отдельная сессия)
9. Deploy после Hans Landa GO + минимум Phase 5 priceSpec

---

### [S028] — 2026-05-01 — PX-024: LocalBusiness image + priceRange (Rich Results warnings fix)

**Задача:** PX-024 — закрыть 2 optional warnings от Google Rich Results Test
**Роли:** #3 Marco Reiter
**Статус:** завершено

**Что сделано:**
- `layout.tsx` LocalBusiness JSON-LD: добавлено `image: "https://rundumshaus-littawe.de/images/og-image.jpg"` (1200×630, существует)
- Добавлено `priceRange: "€€"` (средний)

**Verify на live:** оба поля присутствуют в Schema на /leistungen ✅

**Метрики:** 128/128 тестов pass, build OK, deploy live (1m10s)

**Бонус (вне PX-024):** В этой же сессии починен duplicate FAQPage error (создан `FAQSchema.tsx` — единый объединённый FAQPage с 11 вопросами вместо 2 отдельных). Rich Results Test после этого: 3 элемента без ошибок (FAQ + LocalBusiness + Organization).

**Артефакты:** layout.tsx, FAQSchema.tsx (новый), ServiceFAQ.tsx (удалён schema-рендер)

---

### [S027] — 2026-05-01 — PX-023: Content fixes (25→60km + remove Wertgegenstände FAQ)

**Задача:** 2 правки контента от Kevin
**Роли:** #3 Marco Reiter (content), #14 Hans Landa (review)
**Статус:** завершено

**Что сделано:**
- 25 km → 60 km в 4 пользовательских вхождениях (services.json gartenpflege/entruempelung detailDescription + service-faq.json 2 ответа). Везде в контексте Besichtigung-Radius/Anfahrt — исправлено на реальный 60km Einsatzgebiet
- Удалён FAQ "Werden Wertgegenstände bei der Entrümpelung angerechnet?" из service-faq.json (создавал ложные ожидания клиентов → споры после Besichtigung)
- Также убрана зеркальная фраза "auf Wunsch wertanrechnung von verwertbaren Gegenständen" из entruempelung.detailDescription
- Заменена нейтральным текстом про umweltgerechte Entsorgung (для сохранения ≥100 слов SEO-теста)

**Не тронуто (по ограничению):**
- 25 km в комментарии lib/targetCities.ts (определяет SEO target radius, не Besichtigung)
- Документация (T006_local_seo_basis.md, PX_REGISTRY) — историческая

**Verify на live:**
- /leistungen: "60 km" 3× | "25 km" 0× | "Wertgegenstände" 0× | "wertanrechnung" 0× ✅

**Метрики:** 126/126 тестов pass, build OK, deploy live

**Артефакты:** services.json, service-faq.json

---

### [S026] — 2026-05-01 — T006/PX-022: Local SEO Basis-Paket (Gärtner + Entrümpelungsfirma × 7 ближних городов)

**Задача:** PX-022 — Local SEO 150€ для 2 услуг и 7 ближних городов
**Роли:** #3 Marco Reiter (Frontend + content), #2 Lena Schwarz (FAQ UI), #14 Hans Landa (review)
**Статус:** код завершён, deploy live; ждём 2-4 недели для GSC данных

**Что сделано (Wave 1):**
- `lib/targetCities.ts` — TARGET_CITIES (7 ближних: Osnabrück, Bramsche, Wallenhorst, Belm, Bissendorf, Georgsmarienhütte, Melle), runtime-validated против service-areas.json
- `services.json`: gartenpflege.detailDescription расширен с 28 до ~120 слов с упоминаниями всех 7 городов в естественных предложениях ("Als zuverlässiger Gärtner in Osnabrück...")
- `services.json`: entruempelung.detailDescription расширен аналогично ("Als Entrümpelungsfirma in Osnabrück...")
- 8 новых тестов (target-cities + Local SEO content в data.test.ts)

**Что сделано (Wave 2):**
- `service-faq.json` — 6 Q&A × 2 услуги = 12 локальных вопросов; каждый service-FAQ упоминает все 7 целевых городов
- Типы ServiceFAQEntry/Item в types.ts
- Новый `ServiceFAQ.tsx` (Accordion-based UI + Schema.org FAQPage JSON-LD для Google Rich Results)
- ServiceDetail.tsx рендерит 2 ServiceFAQ после grid карточек
- 8 новых тестов (service-faq + render + Schema)

**Что сделано (Wave 3):**
- `/leistungen` meta: title "Leistungen — Gärtner & Entrümpelungsfirma in Osnabrück und Umgebung" + description с 7 городами и обеими услугами
- layout.tsx: Schema.org Service.areaServed для Gartenpflege и Entrümpelung — массив 7 City entries (через TARGET_CITIES)
- LocalBusiness.areaServed (97 cities из T005) НЕ тронут

**Lighthouse /leistungen mobile (после T006):**
- SEO: **100/100** ✅ (цель ≥95)
- Accessibility: 94/100 (было 92)
- Best Practices: 100
- Performance: 72 (LCP 6.7s — много detail-* картинок, отдельная задача)

**Verification на live:**
- /leistungen 200 OK
- Schema.org FAQPage + Service.areaServed в DOM
- Все 7 целевых городов upmenions: Osnabrück 38, Bramsche 26, Wallenhorst 20, Belm 20, Bissendorf 20, Georgsmarienhütte 20, Melle 22

**Метрики тестов:**
- 110 → **126** pass (+16 новых)
- Build OK, CI green, deploy live

**Открытые follow-ups (через 2-4 недели):**
- GSC → Performance → импрешны/клики по локальным запросам ("Gärtner Bramsche", и т.п.)
- Если ranking растёт — апсейл premium 300-500€ (отдельные landing pages /gaertner-bramsche)
- LCP /leistungen 6.7s (тяжёлые detail-* картинки) — отдельный perf-патч если нужно

**НЕ входило в T006 (рамки 150€):**
- Отдельные landing pages /gaertner-bramsche → premium 300-500€
- 3 другие услуги (Hausmeister/Dach/Schrott) — Kevin не запросил
- Дальние города (Bielefeld/Münster/Rheine) → premium

**Артефакты:** lib/targetCities.ts, services.json, service-faq.json, types.ts, ServiceFAQ.tsx, ServiceDetail.tsx, leistungen/page.tsx, layout.tsx, target-cities.test.ts, service-faq.test.tsx, services.test.tsx (updated), data.test.ts (updated)

---

### [S025] — 2026-04-30 — T005 Wave 1+2: Leistungen restructure + /einsatzgebiet (PX-021)

**Задача:** PX-021 — реструктуризация Leistungen + 95 городов SEO + GSC setup
**Роли:** #3 Marco Reiter (Frontend), #6 Jonas Keller (DNS/SEO), #14 Hans Landa (ревью)
**Статус:** Wave 1+2 завершены (код), Wave 3 (GSC/DNS) — инструкция CEO

**Что сделано (Wave 1 — restructure):**
- `WeitereLeistungenSection.tsx` — извлечена секция, добавлен `id="weitere"`
- `/leistungen` теперь: ServiceDetail (5 главных) + WeitereLeistungenSection (9 доп.)
- `/weitere-leistungen` → client redirect на `/leistungen#weitere` + visible message + `noindex`
- Navigation: 5 → 4 ссылок (Weitere Leistungen убрано)
- sitemap: убрано `/weitere-leistungen`, добавлено `/einsatzgebiet`

**Что сделано (Wave 2 — Service Areas):**
- `service-areas.json` — 7 регионов, 95 уникальных городов (Osnabrücker Land, Artland, Münsterland, Warendorf/Bielefeld, Mittelweser, Vechta/Cloppenburg, Emsland)
- `Servicegebiet.tsx` — responsive grid (1/2/3 колонки), карточки регионов
- `/einsatzgebiet` page с SEO meta
- Footer ссылка "Einsatzgebiet"
- structured data `areaServed: City[]` (массив 95 City schema вместо одного)
- 4 новых теста на service-areas

**Wave 3 — выполнено CEO 2026-04-30:**
- GSC Domain property `rundumshaus-littawe.de` — auto-verified (без TXT, через GBP-связь)
- Sitemap `https://rundumshaus-littawe.de/sitemap.xml` submitted (status "Couldn't fetch" временный)
- Indexing requested для 4 URLs: /leistungen, /einsatzgebiet, /referenzen, /kontakt (главная уже indexed)
- GSC показал: 95 кликов с 06.04, www-версия упала на 89% impressions (Recommendation для дальнейшего SEO)
- `docs/SEO.md` — детальная инструкция + статус Wave 3

**Метрики:** 110/110 тестов pass (104 → 110, +6), 14 routes (13+/einsatzgebiet)

**Артефакты:** WeitereLeistungenSection.tsx, leistungen/page.tsx, weitere-leistungen/{page.tsx,RedirectClient.tsx}, service-areas.json, Servicegebiet.tsx, einsatzgebiet/page.tsx, types.ts, layout.tsx, Footer.tsx, sitemap.ts, docs/SEO.md

---

### [S024] — 2026-04-21 — PX-020: Bug fixes (mobile menu + Gartenpflege broken image)

**Задача:** 2 бага от CEO после Wave 2 T004 деплоя
**Роли:** #2 Lena Schwarz (UI), #3 Marco Reiter (data), #14 Hans Landa (ревью)
**Статус:** завершено

**BUG 1 — Mobile menu transparent/broken:**
- Корень: `bg-charcoal/95 backdrop-blur-2xl z-40` — iOS Safari плохо рендерит semi-transparent bg + backdrop-blur. Z-index конфликт с WhatsApp (z-40).
- Фикс: `bg-charcoal` (solid) + `z-[60]`

**BUG 2 — Gartenpflege broken image:**
- Корень: `gartenpflege-1200w.webp` возвращал 404 (оригинал 896w < 1200w, sharp скрипт пропустил upscale). High-DPI экраны запрашивали эту ширину.
- Фикс: ServiceOverview cards используют srcSet `[400, 800]` (карточки ~480px max на любом экране — 1200w не нужен)
- Curl verify: все остальные 1200w варианты существуют

**Тесты (по Landa HIGH):**
- `services.json` — все `image`/`detailImage` пути существуют физически (+1 test)
- Все responsive webp варианты в srcset существуют (+1 test)
- Результат: 104 → 106 pass

**Артефакты:** Navbar.tsx, ServiceOverview.tsx, __tests__/data.test.ts

---

### [S023] — 2026-04-21 — T004/PX-019: Performance optimization (WebP + responsive)

**Задача:** T004 — Critical image/perf optimization (LCP mobile 9.3s → <2.5s)
**Роли:** #3 Marco Reiter (Frontend), #2 Lena Schwarz (UX/UI), #14 Hans Landa (ревью)
**Статус:** частично завершено — mobile 82/100 (цель ≥90 не достигнута)

**Что сделано (Wave 1-2):**
- `scripts/optimize-images.mjs` — sharp-based конвертер (идемпотентный, не трогает оригиналы)
- Все PNG/JPG → +WebP (quality 80), 86 MB images сохранены как fallback
- Responsive варианты (400w/800w/1200w) для above-the-fold
- detail-*.png resized до 1600w WebP (9.4MB → 1.1MB, -89%)
- og-image.jpg (76 KB) для социальных сетей
- 7 компонентов `<img>` → `<picture>` (AboutSection, ServiceOverview, ServiceDetail, BeforeAfter, ReferenzenContent) + AboutSection с fetchPriority=high
- Lamp.tsx CSS background: hero-bg.png (1.27 MB) → hero-bg.webp (192 KB) — **главный фикс LCP**
- layout.tsx: preload hero-bg.webp + og-image.jpg метатеги
- `lib/getImageUrl.ts`: добавлены `toWebp()` и `toResponsiveWebpSrcSet()` helpers

**Метрики:**
- Mobile Performance: 69 → **82** (+13)
- Mobile LCP: 9.3s → **4.3s** (-54%)
- Desktop Performance: 94 → **99**
- Desktop LCP: 1.6s → **0.9s**
- Tests: 104/104 pass

**Что НЕ сделано и почему:**
- **Wave 3 (a11y prohibited aria-label):** SKIPPED — aria-label на `<p>` добавляется GSAP SplitText runtime для screen readers (real a11y); удаление ухудшит UX, Lighthouse warning = false positive
- **Gold CTA contrast fix:** SKIPPED — CEO запретил глобальные изменения палитры
- **Mobile 82 vs цель 90:** LCP всё ещё 4.3s из-за GSAP SplitText (H1 с opacity:0, анимация JS). Фикс потребует изменить Hero анимацию — отдельная задача если нужно

**Артефакты:** `scripts/optimize-images.mjs`, `lib/getImageUrl.ts`, 6 компонентов, layout.tsx, 86 MB → +48 MB WebP файлов

---

### [S022] — 2026-04-21 — PX-018: Физический адрес + имя компании

**Задача:** PX-018 — Обновление физического адреса (§5 TMG ladungsfähige Anschrift)
**Роли:** #3 Marco Reiter (Frontend), #14 Hans Landa (ревью ТС)
**Статус:** завершено

**Что сделано:**
- `site.json`: street "Osnabrück und Umgebung" (баг!) → "Bramscher Str. 161", zip 49074 → 49090
- `layout.tsx` structured data: добавлен streetAddress, postalCode 49090
- Company name: "Rundum's Haus Littawe" → "Rund ums Haus Littawe" (как пишет Kevin) в 6 файлах: seo.ts, layout.tsx (4 места), datenschutz, kontakt, weitere-leistungen, homepage.json, AboutSection alt
- CLAUDE.md обновлён (имя + адрес)
- 104/104 тестов pass, build OK, 13 routes

**Ключевые решения:**
- "Osnabrück und Umgebung" сохранён как зона обслуживания (Hero, areaServed, descriptions)
- Физический адрес (Impressum, Datenschutz, Footer, Kontakt, structured data) = Bramscher Str. 161, 49090
- Баг: `site.address.street` ранее содержал "Osnabrück und Umgebung" — исправлено

**Артефакты:** site.json, layout.tsx, seo.ts, datenschutz/page.tsx, kontakt/page.tsx, weitere-leistungen/page.tsx, homepage.json, AboutSection.tsx, CLAUDE.md

---

### [S021] — 2026-04-16 — PX-017: DSGVO Cookie Consent Banner

**Задача:** PX-017 — Cookie Banner по запросу Kevin
**Роли:** #3 Marco Reiter (Frontend), #14 Hans Landa (ревью ТС)
**Статус:** завершено

**Что сделано:**
- CookieBanner.tsx уже существовал (создан в T001 wave 9) — компонент полностью рабочий
- Баг-фикс: WhatsAppButton проверял ключ `cookie-consent`, а CookieBanner использует `rh-cookie-consent` → выровнял
- 3 теста: показ после задержки, скрытие при наличии consent, dismiss + localStorage persist
- Build: 13 routes, 104 теста pass

**Ключевые решения:**
- Компонент уже был — нужен был только фикс несовпадения ключей + тесты
- Баннер информационный (DSGVO Art. 13), не consent manager — нет optional cookies

**Артефакты:** `WhatsAppButton.tsx` (фикс ключа), `cookie-banner.test.tsx` (3 теста)

---

### [S020] — 2026-04-16 — PX-015: Визуальная инструкция для Kevin

**Задача:** PX-015 — HTML-гайд по редактированию сайта через Pages CMS
**Роли:** #2 Lena Schwarz (UX/UI), #14 Hans Landa (ревью ТС1)
**Статус:** завершено

**Что сделано:**
- `docs/ANLEITUNG_KEVIN.html` — self-contained HTML в бренд-стиле (Navy/Green/White/Gold, Plus Jakarta Sans)
- 8 разделов: Anmelden, Firmendaten, Startseite, Hauptleistungen, Weitere Dienstleistungen, Referenzen, Bilder, Kontaktformular
- 9 скриншотов CMS переименованы и встроены (`img/anleitung/01-09`)
- `@media print` для корректного Save as PDF
- `docs/ANLEITUNG_KEVIN.md` обновлён — ссылка на HTML-версию, упрощённые формулировки

**Ключевые решения:**
- HTML с relative paths к img/ (не base64 — файлы слишком большие)
- Print CSS: page-break-inside: avoid на секциях и скриншотах (по замечанию Landa)
- Контакт в подвале: WhatsApp + email клиента

**Артефакты:** `docs/ANLEITUNG_KEVIN.html`, `docs/ANLEITUNG_KEVIN.md`, `img/anleitung/*.png` (9 файлов)

---

### [S019] — 2026-04-16 — Передача прав клиенту + оплата

**Задача:** Передача доступов Kevin Littawe после оплаты
**Роли:** #1 Viktor Hartmann (Product Architect)
**Статус:** завершено

**Что сделано:**
- GitHub аккаунт для Kevin: `rundumshaus-littawe` (k_littawe@icloud.com)
- Kevin добавлен как collaborator (write) на repo `aidancompton001/rundumshaus`
- Kevin принял invite, залогинился в Pages CMS (app.pagescms.org)
- Оплата 300€ получена (Echtzeitüberweisung на Revolut)
- ANLEITUNG_KEVIN.md готова к отправке

**Ключевые решения:**
- Вариант A (collaborator) вместо transfer repo — минимальный риск, CMS работает, домен не трогаем
- Transfer repo на аккаунт Kevin — отдельная задача позже (если потребуется)
- Kevin может самостоятельно: менять тексты, добавлять услуги, загружать фото через CMS

**Переписка с клиентом (2026-04-16):**
- Kevin подтвердил работу сайта: "Klappt ich komme drauf"
- Kevin оплатил 300€ Echtzeitüberweisung (PayPal не использует)
- Kevin принял GitHub invite и зашёл в Pages CMS

**Артефакты:** docs/CREDENTIALS.md (обновлён: GitHub Kevin)

---

### [S018] — 2026-04-16 — PX-011: Деплой на rundumshaus-littawe.de

**Задача:** PX-011 — Деплой на боевой домен клиента
**Роли:** #6 Jonas Keller (SRE/Platform), #14 Hans Landa (ревью ТС1)
**Статус:** завершено

**Что сделано:**
- DNS IONOS: 4 WordPress-записи деактивированы, 4 A-записи GitHub Pages (185.199.108-111.153) + CNAME www → aidancompton001.github.io
- GitHub Pages: custom domain = rundumshaus-littawe.de, HTTPS enforced, SSL cert approved
- `site/public/CNAME` создан (копируется в out/ при build)
- `site/next.config.ts`: basePath `/rundumshaus` удалён (custom domain = root)
- DNS backup сохранён в `docs/DNS_BACKUP_2026-04-16.md`
- CI/CD: push → GitHub Actions → deploy → сайт на домене (101 тестов pass)
- Локальный DNS-кэш CEO показывал старый IP ~1 час после смены — resolved (провайдер/роутер кэш, TTL)

**Ключевые решения:**
- Порядок: DNS first → GitHub Pages → basePath removal (по замечанию Landa — zero downtime)
- Mail-записи (MX, SPF, DKIM, DMARC) НЕ тронуты — почта клиента работает
- www → 301 redirect на apex domain (GitHub Pages auto)
- IONOS WordPress-пакет остаётся (downgrade на domain-only позже, ~12€/год вместо ~100€/год)

**Верификация:**
- https://rundumshaus-littawe.de → 200 OK
- HTTPS cert: approved, enforced, expires 2026-07-15
- www → 301 redirect ✅
- Images load (/images/branding/logo-client.png) → 200 OK
- DNS: Google 8.8.8.8 → все 4 GitHub IPs
- Клиент подтвердил: сайт открывается

**Артефакты:** `site/public/CNAME`, `site/next.config.ts`, `docs/DNS_BACKUP_2026-04-16.md`

---

### [S017] — 2026-04-16 — T003: Pages CMS — визуальная админка

**Задача:** [T003](docs/tasks/T003_pages_cms.md) — Pages CMS для Kevin
**Роли:** #3 Marco Reiter (Frontend)
**Статус:** завершено

**Что сделано:**

- `.pages.yml` — 6 коллекций с German labels (Firmendaten, Startseite, Weitere Dienstleistungen, Hauptleistungen, Referenzen, Kontaktformular)
- Media: site/public/images (input) → /images (output)
- Hidden fields: icon, image, detailImage, id (Kevin не видит, не сломает)
- JSON validation step в CI deploy.yml (safety net)
- `docs/ANLEITUNG_KEVIN.md` — пошаговая инструкция на немецком
- Build: 101/101 pass, JSON validation OK

**Ключевые решения:**

- Навигация (site.json navigation) НЕ включена в CMS — Kevin не может сломать nav
- hero.ctas НЕ включены — Kevin не трогает CTA кнопки
- contact-form.json sections НЕ включены — только тексты (heading, body, submit, success, error)
- services icon/image/detailImage = hidden — Kevin меняет только тексты

**Артефакты:** `.pages.yml`, `docs/ANLEITUNG_KEVIN.md`, `.github/workflows/deploy.yml`

---

### [S015] — 2026-04-15 — PX-010: Унификация иконок (0 emoji)

**Задача:** PX-010 — замена ВСЕХ эмодзи на кастомные dual-tone SVG
**Роли:** #2 Lena Schwarz (UX/UI), #14 Hans Landa (ревью ТС1)
**Статус:** завершено

**Что сделано:**
- Создан `icon-types.ts` — shared IconProps с variant (default/light/mono)
- Создан `WarumWirIcons.tsx` — 5 SVG (Clock, Sparkle, PriceTag, Calendar, Handshake)
- Создан `ContactIcons.tsx` — 6+1 SVG (Phone, WhatsApp official, Envelope, MapPin, CheckCircle, XCircle)
- Интеграция: WarumWir.tsx (variant="light"), ContactForm.tsx (variant="mono" в кнопках), Footer.tsx (variant="mono" inline-flex)
- Тесты: 17 новых тестов (иконки + zero-emoji), все проходят
- Build: 13 routes, 101 тестов pass, 0 emoji в src/

**Ключевые решения:**
- variant prop вместо CSS override (по замечанию Landa #1 CRITICAL)
- WhatsApp = official SVG path (по замечанию Landa #4 HIGH)
- Shared IconProps в icon-types.ts (по замечанию Landa #5 MEDIUM)
- aria-hidden="true" на всех SVG (по замечанию Landa #3 HIGH)

**Артефакты:** `icon-types.ts`, `WarumWirIcons.tsx`, `ContactIcons.tsx`, `icons.test.tsx`

**Следующие шаги:**
- CEO визуальная проверка на dev server

---

### [S014] — 2026-04-15 — Landa Audit: 8/8 пунктов ТЗ PASS

**Задача:** PX-009 — полный аудит требований заказчика
**Роли:** #14 Hans Landa (Critical Reviewer)
**Статус:** завершено

**Что сделано:**
- Grep Bielefeld по всему репо: 0 в коде, 10 в docs (допустимо)
- Grep старых hex/rgba: 0 в src/ и public/
- Grep 0155 63675772 / 4915563675772: 0 в репо
- WhatsApp: 3 места, все wa.me/4915239603175
- tel: links: 4 места, все через site.phone
- Structured data: Osnabrück, 49074, +49 1523 9603175
- Datenschutz: LfD Niedersachsen (0 LDI NRW)
- Build: 13 routes, Tests: 84/84

**Findings:** 0 CRITICAL, 0 HIGH, 1 MEDIUM (CLAUDE.md:16 "Bielefeld" — устарело)

**Вердикт:** 8/8 PASS. Production ready.

---

### [S012] — 2026-04-15 — Task Registry: реестр PX-формулировок

**Задача:** Создание индексированного реестра структурированных задач CEO
**Роли:** #1 Viktor Hartmann (Product Architect)
**Статус:** завершено

**Что сделано:**
- Создан `01_Projects/RundumsHaus/Task Registry.md` в Obsidian
- Формат: PX-NNN, дата, статус, DEVLOG ref, полный текст PX as-is
- Инструкция "Как пользоваться" для других чатов (проверить последний номер перед добавлением)
- PX-001: SVG иконки (из текущего чата)

**Артефакты:** Obsidian `Task Registry.md`

---

### [S011] — 2026-04-15 — T002 Complete: город, услуги, WhatsApp, Warum wir

**Задача:** [T002](docs/tasks/T002_rebrand_flyer.md) — ребрендинг remaining waves
**Роли:** #3 Marco Reiter (Frontend), #2 Lena Schwarz (UI)
**Статус:** завершено

**Что сделано:**

- Wave 1: Bielefeld → Osnabrück und Umgebung (site.json, homepage.json, layout.tsx, referenzen, datenschutz)
- Wave 4: /weitere-leistungen — 9 услуг с флаера, галочки, в Navbar + sitemap
- Wave 5: WhatsApp кнопка (fixed z-40, wa.me/4915239603175) + «Jetzt anrufen» CTA в Contact sidebar
- Wave 6: Секция «Warum wir?» — 5 пунктов с флаера, dark section на главной
- Datenschutz: LDI NRW → LfD Niedersachsen (Prinzenstraße 5, 30159 Hannover)
- Телефон: 01523 9603175 (единственный, с флаера клиента)
- Structured data: Osnabrück, 49074, +49 1523 9603175
- Тесты обновлены: nav 4→5, LDI NRW→Niedersachsen

**Верификация:**

- grep "Bielefeld" = 0
- Build: OK (13 routes)
- Tests: 84/84 pass

**Артефакты:** site.json, homepage.json, layout.tsx, datenschutz, referenzen, page.tsx, sitemap.ts, weitere-leistungen.json, weitere-leistungen/page.tsx, WhatsAppButton.tsx, WarumWir.tsx, ContactForm.tsx, Footer.tsx, types.ts, data.test.ts, legal.test.tsx

---

### [S010] — 2026-04-15 — Палитра V2: Blau/Grün/Weiß/Gold

**Задача:** [T002](docs/tasks/T002_rebrand_flyer.md) — ребрендинг палитры по флаеру
**Роли:** #2 Lena Schwarz (UX/UI Engineer)
**Статус:** завершено

**Что сделано:**
- Замена 8 CSS-переменных (:root + @theme): Bronze/Cream → Navy/Green/White
- 2 новых токена: --color-gold (#D4A843), --color-gold-light (#E0BA5A) для CTA
- CTA-кнопки: copper → gold (Navbar, MovingBorder, ContactForm submit, error retry, mobile menu)
- Hardcoded rgba: Lamp.tsx, Spotlight.tsx, ContactForm.tsx — обновлены
- moving-border gradient + ::selection — обновлены
- Favicon icon.svg: bg #2A2A2A → #1B3A5C, stroke #9B7B4E → #4A8B3F
- 4 SVG лого: bronze → green (light), cream → white (dark)
- Checkbox accent: copper → dark green #3A7030 (WCAG fix, Landa F2)
- Footer hover underline: copper → gold

**Ключевые решения:**
- Токены НЕ переименованы (cream/charcoal/copper) — только hex swap, минимальный blast radius
- CTA = gold (как на флаере), accent = green (как в лого) — два визуальных слоя
- Checkbox #3A7030 вместо #4A8B3F — WCAG 4.8:1 для мелких элементов

**Верификация:**
- grep старых hex = 0 результатов
- grep старых rgba = 0 результатов
- Build: OK (Next.js 16.2.3)
- Tests: 84/84 pass

**Артефакты:** globals.css, Lamp.tsx, Spotlight.tsx, ContactForm.tsx, Navbar.tsx, MovingBorder.tsx, Footer.tsx, icon.svg, 4× logo SVG, docs/PALETTE_V2.md

**Следующие шаги (T002):**
- Wave 1: город Bielefeld → Osnabrück
- Wave 4: страница Weitere Leistungen
- Wave 5: WhatsApp + телефон

---

### [S008] — 2026-04-15 — Dual-tone SVG иконки услуг

**Задача:** Замена emoji на branded SVG иконки
**Роли:** #2 Lena Schwarz (UX/UI Engineer)
**Статус:** завершено

**Что сделано:**
- Создан `ServiceIcons.tsx` — 5 dual-tone SVG иконок + DefaultIcon fallback
- Каждая иконка: 2 слоя (charcoal основа + copper акцент), viewBox 24x24, stroke-width 1.5
- Обновлены ServiceOverview.tsx и ServiceDetail.tsx — iconMap → JSX-компоненты
- Responsive: w-8/h-8 mobile, w-10/h-10 desktop (w-10/h-10 → w-12/h-12 на detail)
- 0 hardcoded hex, все цвета через Tailwind tokens
- 6 новых тестов (dual-tone проверка, 0 emoji, 0 hex, fallback, iconMap coverage)

**Ключевые решения:**
- Dual-tone (подход C) вместо monochrome — премиум quiet luxury feel
- SVG paths на основе Lucide (MIT), модифицированы для split charcoal/copper
- DefaultIcon (круг) как fallback вместо crash при unknown key (Landa F3)
- Оба компонента покрыты (Landa F1: consistency Overview + Detail)

**Артефакты:** `ServiceIcons.tsx`, `ServiceOverview.tsx`, `ServiceDetail.tsx`, `services.test.tsx`

**Следующие шаги:**
- CEO визуальная проверка на dev server

### [S001] — 2026-04-14 — Развёртывание проекта RundumsHaus

**Задача:** Инициализация проекта
**Роли:** #1 Viktor Hartmann (Product Architect)
**Статус:** завершено

**Что сделано:**
- Создана структура проекта из MainCore шаблонов V8.0
- CLAUDE.md заполнен данными проекта (стек, услуги, структура сайта)
- TEAM.md: 5 ролей (#1, #2, #3, #6, #14) адаптированы под веб-проект
- docs/tasks/ готов для P0 roadmap
- Obsidian vault: создана заметка 01_Projects/RundumsHaus.md

**Ключевые решения:**
- 5 ролей (не 8) — масштаб проекта не требует Backend/Mobile/QA
- FormSubmit.co для форм — проверено на Eko-OYLIS
- GSAP + Lenis + Tailwind 4 — премиум-стек из CREATIVE_TOOLKIT

**Артефакты:** `CLAUDE.md`, `TEAM.md`, `DEVLOG.md`, `STATUS.md`, `docs/tasks/`, `docs/CREDENTIALS.md`

**Следующие шаги:**
- P0: анализ стека (Next.js SSG vs Astro vs Static HTML) + roadmap

---

### [S002] — 2026-04-14 — P0 дополнение: исследование Provenly Homes

**Задача:** [T001](docs/tasks/T001_premium_website.md) — обновление roadmap
**Роли:** #1 Viktor Hartmann (Product Architect)
**Статус:** завершено

**Что сделано:**
- Прочитаны все 14 заметок Obsidian vault Provenly Homes
- Верифицирована файловая структура PH на диске (package.json, components, data, CI/CD)
- Составлен исчерпывающий отчёт: 12 разделов (стек, дизайн, анимации, компоненты, данные, SEO, CI/CD, performance, a11y, gotchas, процесс, отвергнутые решения)
- T001 обновлён до v2: 10 фаз, 65 шагов, ~7 часов с параллелизацией
- Obsidian RundumsHaus.md обновлён с PH findings

**Ключевые решения:**
- Рекомендация: Next.js 16 вместо Astro (proven pipeline, 10 copy-paste recipes, 17 gotchas documented) — CEO решает
- 17 gotchas PH включены превентивно в roadmap
- GDPR (Impressum + Datenschutz) перенесён в Фазу 2 (раньше был в Фазе 8)
- ~20 анимаций из 39 PH выбраны для RH (остальные = overkill для Hausmeister-сайта)

**Артефакты:** `docs/tasks/T001_premium_website.md` (v2), `STATUS.md`, `DEVLOG.md`

**Следующие шаги:**
- T001 v3 execution

---

### [S003] — 2026-04-15 — T001 v3: wave-based roadmap + DESIGN_MAP + Landa review

**Задача:** [T001](docs/tasks/T001_premium_website.md) — финализация roadmap
**Роли:** #1 Viktor Hartmann, #14 Hans Landa (reviewer)
**Статус:** завершено

**Что сделано:**
- DESIGN_MAP.md: 35 Awwwards-эффектов (7 секций × библиотеки × mobile × reduced-motion)
- T001 v3: 11 волн × 5 шагов, тесты после каждой волны
- Aceternity UI: Lamp, Spotlight, 3D Card, Moving Border — выбраны и включены
- Obsidian: 13 satellite notes (зеркало структуры Provenly Homes)
- Research.md создан (Landa F2)
- Landa review: CONDITIONAL PASS, 6 findings — все закрыты в T001

**Ключевые решения:**
- Framework: Next.js 16 (CEO утвердил, PH blueprint)
- Дизайн: PH Warm Sand + Copper (временно, CEO даст палитру)
- BeforeAfter: input[range] + clip-path (accessible, Landa F3)
- Referenzen: CEO fallback (клиент шлёт фото → CEO добавляет, Landa F5)
- Параллелизм: Wave 6→7 (sequential), Wave 6→8 (parallel), Landa F4

**Артефакты:** `docs/tasks/T001_premium_website.md` (v3), `docs/DESIGN_MAP.md`, 13 Obsidian notes

**Следующие шаги:**
- T001 v3 execution → S004

---

### [S004] — 2026-04-15 — T001 v3 EXECUTION: Waves 1-11 COMPLETE

**Задача:** [T001](docs/tasks/T001_premium_website.md) — полная сборка сайта
**Роли:** #3 Marco Reiter (Frontend), #14 Hans Landa (QA audit)
**Статус:** завершено — LIVE

**Что сделано:**
- 11 волн × 5 шагов = 55 шагов выполнено
- 75 тестов (9 test files, все pass)
- 8 routes + sitemap + robots
- CI GREEN: GitHub Actions (lint→test→build→.nojekyll→deploy)
- Production: https://aidancompton001.github.io/rundumshaus/

**CI incidents:** lockfile mismatch (→ npm install), Pages not enabled (→ gh api). 3-й run GREEN.

**Артефакты:** `site/`, `.github/workflows/deploy.yml`, `docs/DNS_INSTRUCTIONS.md`

**Следующие шаги:**
- CEO визуальная проверка

---

### [S005] — 2026-04-15 — BUG: карточки Leistungen невидимые (3 попытки)

**Задача:** Фикс карточек услуг на /leistungen
**Роли:** #2 Lena Schwarz, #3 Marco Reiter, #14 Landa
**Статус:** завершено — ИСПРАВЛЕНО

**Хронология бага (3 неудачных фикса → архитектурное решение):**
1. Попытка 1: заменил glassmorphism (bg-cream-dark/30 → bg-cream-dark solid) — НЕ ПОМОГЛО
2. Попытка 2: убрал h-full с html (обрезало контент ниже viewport) — ЧАСТИЧНО
3. Попытка 3: GSAP from({opacity:0}) + ScrollTrigger = архитектурная проблема. ScrollTrigger не срабатывает для элементов уже в viewport → opacity:0 навсегда

**Корень проблемы:** GSAP `from({ opacity: 0 })` ставит начальное невидимое состояние, ScrollTrigger должен анимировать обратно. Но на страницах где контент начинается в viewport — ScrollTrigger никогда не срабатывает → контент невидим навсегда.

**Архитектурное решение (Phase 4.5 — question architecture):**
- УБРАЛИ GSAP из Stagger.tsx и ScrollReveal.tsx полностью
- CSS transitions (opacity + transform) + IntersectionObserver (.is-visible класс)
- Контент ВСЕГДА виден по умолчанию (opacity:1 в CSS)
- Анимация = CSS enhancement, не JS requirement
- noscript fallback для полной видимости без JS
- Мягкий easing: cubic-bezier(0.25, 0.1, 0.25, 1), translateY 8-12px

**Готча G18:** Glassmorphism невидим на light bg → solid bg + shadow
**Готча G19:** GSAP from({opacity:0}) + ScrollTrigger = BROKEN для elements in viewport → CSS-first

**Артефакты:** Stagger.tsx, ScrollReveal.tsx, globals.css, layout.tsx

---

### [S006] — 2026-04-15 — AI-фото подключены (4 изображения)

**Задача:** Размещение AI-фото из Nano Banana
**Роли:** #2 Lena Schwarz
**Статус:** завершено

**Что сделано:**
- IMG-01 Hero Background → public/images/hero/hero-bg.webp (за Lamp с gradient overlay)
- IMG-02 About Section → public/images/about.png (заменил emoji placeholder)
- IMG-03 Hausmeisterservice → public/images/services/hausmeisterservice.webp (карточка с hover zoom)
- IMG-04 Gartenpflege → public/images/services/gartenpflege.webp (карточка с hover zoom)
- Service type обновлён (optional image field)

**Следующие шаги:**
- CEO: оставшиеся фото (Dacharbeiten, Entrümpelung, Schrottabholung)
- CEO: DNS IONOS

---

### [S007] — 2026-04-15 — Branding: Warm Bronze palette + logos + brand guide

**Задача:** Финальная айдентика
**Роли:** #2 Lena Schwarz, #14 Landa (audit)
**Статус:** завершено

**Что сделано:**
- Палитра: PH Warm Sand → Warm Bronze (Deep Charcoal #2A2A2A, Warm Cream #F3EDE2, Aged Bronze #9B7B4E, Stone Gray #A09A90)
- SVG логотипы: 4 варианта (icon + full × light/dark) + favicon
- Navbar + Footer: logo icon подключен
- Brand guide: docs/BRAND_GUIDE.md (палитра, типографика, WCAG, CSS code)
- Landa audit: 0 старых hex, F1 (Lamp rgba) fixed, F2 (WCAG label) fixed
- Obsidian: Branding Decision.md + Design and Branding.md обновлены

**Артефакты:** globals.css, BRAND_GUIDE.md, 5 SVG файлов, Navbar.tsx, Footer.tsx

---

### [S008] — 2026-04-15 — Все 17 AI-фото размещены

**Задача:** Размещение всех изображений из img/ по назначению из LUMA_IMAGE_PROMPTS.md
**Роли:** #2 Lena Schwarz
**Статус:** завершено

**Что сделано:**
- 5 flat-lay карточек (IMG-03-07) → ServiceOverview (homepage)
- 5 detail фото (IMG-08-12) → ServiceDetail (/leistungen)
- 3 vorher/nachher (IMG-13-15) → Referenzen (showcase cards)
- Contact bg atmosphere (IMG-16) → /kontakt (gradient overlay)
- OG social share (IMG-17) → layout.tsx openGraph metadata
- services.json: `image` (flat-lay) + `detailImage` (detail) для всех 5 услуг
- referenzen.json: 3 записи вместо пустого массива
- types.ts: `detailImage` optional field добавлен
- ReferenzenContent: showcase cards вместо BeforeAfter slider (split-composition images)
- Тесты: 77/77 pass (обновлён referenzen test: items вместо empty state)

**Landa ТС2 findings закрыты:**
- F1: файлы большие (~87MB) но в рамках GitHub Pages limit (1GB)
- F2: split-composition images → showcase cards (не slider)
- F3: `image` + `detailImage` разделены

**Артефакты:** 17 image files, services.json, referenzen.json, types.ts, ServiceDetail.tsx, ReferenzenContent.tsx, ContactForm.tsx, layout.tsx

---

### [S009] — 2026-04-15 — Hero Lamp fix: soft glow вместо артефактов

**Задача:** CEO обнаружил тёмную полосу + жёлтую линию между navbar и hero heading
**Роли:** #2 Lena Schwarz
**Статус:** завершено

**Корень:** Lamp Effect (Aceternity) — `h-0.5 bg-copper` = видимая бронзовая линия, `h-44 bg-charcoal` = тёмная полоса над ней. Артефакт conic-gradient beam system.

**Решение:** Убрал conic-gradient beams, hard copper line, dark band. Оставил мягкое бронзовое свечение (blur-120px + blur-80px) поверх hero photo. Результат: тёплый ambient glow без артефактов.

**Артефакты:** Lamp.tsx, Hero.tsx
