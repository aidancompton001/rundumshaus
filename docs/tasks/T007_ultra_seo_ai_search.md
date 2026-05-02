# T007 — Ultra-Premium Local SEO + AI-Search Optimization (PX-025)

**Дата:** 2026-05-02
**Статус:** roadmap (ожидает ОК CEO)
**PX:** PX-025
**Размер:** XL (9 фаз, ~30-50 часов работы + 12 недель monitoring)
**Ответственный:** #1 Viktor Hartmann (координация) + #3 Marco Reiter (frontend/SEO/programmatic) + #2 Lena Schwarz (UX ratgeber/landing) + #6 Jonas Keller (deploy, multi-engine indexing) + #14 Hans Landa (XL review obligatorisch)
**Скилл:** `writing-plans` (этот файл) → `brainstorming` (Phase 1 research) → `dispatching-parallel-agents` (Phase 2/6 параллельно) → `verification-before-completion` (каждая фаза) → `requesting-code-review` (после Phase 5/8)
**Коммерч.:** 600€ total (150€ Basis PX-022 + 450€ доплата) — Kevin подтвердил 2026-05-01 21:48

---

## 0. Pre-flight check (до старта)

- [ ] CEO подтверждает 600€ зачислены / договорённость в письменном виде
- [ ] Kevin даст: список реальных цен (или "ab X€"), 5-10 реальных отзывов клиентов, фото себя для "Gründer", решение про "junges Familienunternehmen seit 2026"
- [ ] CEO создаёт: Bing Webmaster Tools account, Yandex Webmaster account
- [ ] CEO решает: Plausible/Umami self-hosted (DSGVO) vs только GSC для measurement
- [ ] #14 Landa подтверждает review-checkpoints на конце каждой фазы

---

## 1. Анализ последствий (что трогаем, что может сломаться)

### Затрагиваемые файлы (existing — модификация)

| Файл | Изменение | Риск |
|------|-----------|------|
| `site/src/app/layout.tsx` | Schema deep: Organization (logo/sameAs/founder), WebSite searchAction, BreadcrumbList wrapper | средний (root layout — ломается весь сайт если опечатка JSON-LD) |
| `site/src/app/leistungen/page.tsx` | Restructure to "answer-first" + internal links to programmatic, добавить Service schema offers | средний |
| `site/src/components/sections/ServiceDetail.tsx` | Возможные правки под answer-first | низкий |
| `site/src/components/sections/ServiceFAQ.tsx` | Расширение FAQ под AI-friendly формулировки | низкий |
| `site/src/app/einsatzgebiet/page.tsx` | Добавить cross-links на programmatic landing, BreadcrumbList | низкий |
| `site/src/data/services.json`, `service-faq.json`, `service-areas.json`, `homepage.json`, `site.json` | Дополнения priceRange/founder/sameAs, AI-факт-блок | низкий-средний |
| `site/src/lib/targetCities.ts` | Расширить с 7 до 30 ключевых городов для programmatic | низкий |
| `site/src/lib/seo.ts` | Helpers для генерации Schema на programmatic + ratgeber | средний |
| `site/src/app/sitemap.ts` | +75-150 programmatic URLs + 10 ratgeber + index | высокий (если build падает на >150 URL — деплой broken) |
| `site/public/robots.txt` | разрешить AI-краулеры (GPTBot, ClaudeBot, PerplexityBot, etc.) или явно настроить | средний |
| `docs/SEO.md` | Обновлённая стратегия | низкий |

### Новые файлы (creation)

| Файл | Назначение |
|------|-----------|
| `site/src/app/leistungen/[service]/[city]/page.tsx` | Programmatic landing, Next.js 16 dynamic + `generateStaticParams` для static export |
| `site/src/app/ratgeber/page.tsx` | Index ratgeber-блога |
| `site/src/app/ratgeber/[slug]/page.tsx` | Detail ratgeber (Article + HowTo schema) |
| `site/src/data/local-keywords.json` | Service × city × keyword variations (источник правды для programmatic) |
| `site/src/data/ratgeber/*.md` или `ratgeber.json` | 10 статей контентом |
| `site/src/lib/programmatic.ts` | Генератор контента по [service][city] (template + variations) |
| `site/public/llms.txt` | Anthropic-стандарт для LLM-краулеров (как robots.txt для AI) |
| `site/public/llms-full.txt` | Full content dump в AI-friendly формате |
| `site/public/ai.txt` | Альтернативный AI-стандарт |
| `docs/SEO_RESEARCH.md` | Phase 1 findings (конкуренты, keywords, AI baseline) |
| `docs/SEO_RESULTS.md` | Phase 9 dashboard (4/8/12-week reports) |
| `scripts/ai-search-test.md` | Протокол ручного теста AI-поисковиков каждые 2 недели |
| `.github/workflows/indexnow.yml` (опц.) | Auto-ping IndexNow на push |

### Внешние операции (вне репо, делает CEO)

- GSC: re-submit sitemap после deploy programmatic + ratgeber
- Bing Webmaster: setup + sitemap submit + URL inspection
- Yandex Webmaster: setup + sitemap submit
- Ecosia: submit (через Bing index = автоматически)
- IndexNow: ключ-файл в public/ + ping endpoint
- Каталоги (1-7 дней модерация): Cylex, 11880, Das Örtliche, GoYellow, Yelp DE, Gelbe Seiten, NOZ Branchenbuch, IHK Osnabrück, Handwerkskammer Osnabrück
- GBP: 5+ posts, 10+ photos, services full, Q&A 5+, attributes complete
- Perplexity Sources / OpenAI Business — submit (если доступно для small business)

### Что БЫЛО → что СТАНЕТ (ключевые значения)

| Метрика / артефакт | БЫЛО | СТАНЕТ |
|--------------------|------|--------|
| Indexed pages | 5 (/, /leistungen, /einsatzgebiet, /referenzen, /kontakt) | 90+ (5 + ~75 programmatic + 10 ratgeber + 1 index) |
| Schema items | FAQPage, LocalBusiness, Organisation (3) | + Service (×5), Article (×10), HowTo (×N), BreadcrumbList (всех страниц), AggregateRating, WebSite (~9 типов) |
| GSC clicks (3 нед.) | ~95 | цель 500-1000 (через 12 нед.) |
| Mobile Performance | 64-71 (LCP 4.6-7.1s) | ≥85 (LCP ≤2.5s) |
| AI Search citations | 0 (baseline тесты) | ≥1 в Perplexity / ChatGPT Search / Claude (доказательство screenshots) |
| Backlinks | unknown (островной) | 15+ DACH-каталогов |
| Build time | ~2 мин | до 5-10 мин (допустимо) |
| Repo size | ~14 MB | + ~8 MB (HTML programmatic + ratgeber) |
| `lib/targetCities.ts` | 7 городов | 30 (топ по keyword research) |
| AI-краулер policy | implicit allow (нет llms.txt) | explicit llms.txt + llms-full.txt + ai.txt |

### Что может поплыть / сломаться рядом

1. **Sitemap >150 URLs** — `sitemap.ts` падает или GSC ошибка → разделить на sitemap-pages.xml + sitemap-ratgeber.xml + sitemap-index.xml
2. **Build time** — Next.js 16 SSG 150+ страниц может уйти за 10 мин CI timeout → optimize, увеличить timeout, рассмотреть on-demand revalidation (но static export не позволяет — только pre-build)
3. **Repo bloat** — 100MB GitHub Pages limit. Расчёт: 150 × 50KB = 7.5MB ок. Но если ratgeber с inline images добавит ещё → следить
4. **JSON-LD ошибки** — каждая programmatic-страница имеет Service+LocalBusiness+Breadcrumb. Опечатка в template → 150 broken pages → Rich Results Test fail. Тест обязателен на 1 page до генерации всех
5. **Internal links explosion** — 150 pages × 5 cross-links = 750 internal links. Если template зацикливается / битые ссылки → SEO penalty
6. **Thin content / E-E-A-T penalty** — Google наказывает за 150 шаблонных страниц. Нужно ≥300 уникальных слов + локальные факты на каждой. Если не вытянем 30 городов уникально — сократить до 20 / 15
7. **GSAP SplitText opacity:0 на mobile** — фикс LCP может сломать анимацию hero на desktop. Тест: десктоп анимация не пропадает
8. **Pages CMS Kevin**: programmatic — code-only. Если Kevin случайно через CMS добавит коллекцию `[service]/[city]` — конфликт. Нужен README в CMS / комментарий
9. **NAP consistency**: Bramscher Str. 161, 49090 Osnabrück / +49 1523 9603175 / kontakt@rundumshaus-littawe.de — ОДНОЗНАЧНО везде. Опечатка в каталоге → minus в local-pack ranking
10. **DSGVO**: Plausible/Umami self-hosted = безопасно. GA = НЕТ. AI Search submission — не передавать персональные данные. llms.txt — public OK
11. **AI ethics**: "seit 2026" / "junges Unternehmen". Если в текстах ratgeber фабрикуются случаи или цифры — Anthropic Claude detects → потеря AI-citations
12. **Robots.txt vs llms.txt**: GPTBot/ClaudeBot уважают robots.txt. Если случайно `Disallow: /` для них — AI Search невозможен

### Breakpoints (mobile 375 / tablet 768 / desktop 1440)

- Programmatic landing pages — должны быть mobile-first (Kevin'и клиенты ищут с телефона)
- Ratgeber-статьи 1500-2500 слов — типографика, line-length, prose readability на 375px
- Breadcrumbs — на mobile collapsible или wrap
- AI-факт-блок ("Über uns в цифрах") — table/grid на desktop, stacked на mobile

### Якоря, навигация, JS, анимации — затронуты?

- Navbar: добавить пункт "Ratgeber" (4-й уже Kontakt → 5? либо в Footer только) — обсудить с CEO
- Footer: добавить ссылку на /ratgeber + ссылки на топ-5 programmatic landing
- JS: dynamic import GSAP / Lenis (Phase 8) — может сломать ScrollTrigger init order
- Анимации: hero LCP fix может убрать SplitText — компромисс между performance и UX
- Якоря: /leistungen#weitere остаётся; добавятся /leistungen#faq (через ServiceFAQ)

### Тесты (что писать / обновлять)

- **Phase 2:** test render `/leistungen/gartenpflege/bramsche`, schema validity Service+LocalBusiness+Breadcrumb, generateStaticParams возвращает корректное число
- **Phase 3:** test существование `/llms.txt`, `/llms-full.txt`, валидность формата
- **Phase 5:** schema-validator тесты на каждый тип (Service offers, Organization sameAs, BreadcrumbList items, HowTo steps, Article author/datePublished)
- **Phase 6:** ratgeber render, Article schema, HowTo schema (где применимо)
- **Phase 8:** Lighthouse Mobile ≥85 в CI (lighthouse-ci action)
- **Phase 9:** не тесты — manual screenshots + log в SEO_RESULTS.md
- **Регрессия:** все 126/126 текущих тестов должны pass

---

## 2. Roadmap (9 фаз, пронумерованные шаги)

> Каждая фаза = отдельный wave. После завершения wave — review (#14 на XL), commit + push, deploy, verify on live, обновить DEVLOG.md + STATUS.md, потом следующая.

### Phase 1 — Discovery & Research (1-2 дня) — `brainstorming` skill

1. Конкурентный аудит: вручную (или через Ahrefs/SEMrush trial) — топ-3 в Google по 5 запросам ("Gärtner Bramsche", "Gärtner Osnabrück", "Entrümpelung Bielefeld", "Hausmeisterservice Osnabrück", "Dachreinigung Münster"). Записать: домены, размер сайта, schema, ratgeber, backlinks
2. Keyword research через Google Keyword Planner / Ubersuggest free tier — для 5 услуг × 30 кандидатов-городов получить volume + competition + CPC. Сохранить в `docs/SEO_RESEARCH.md` таблицей
3. Финализировать список 30 городов для programmatic (отбор по volume × расстояние × Kevin-приоритет ≤60km, реально ездит ≤50km)
4. AI Search baseline: запросить ChatGPT Search, Perplexity, Claude Search, Gemini, You.com, Bing Copilot — `"Hausmeister in Osnabrück"`, `"Entrümpelung Bramsche"`, `"Gärtner Melle"`. Screenshot результатов в `docs/seo-baseline/`. Записать: упоминается ли rundumshaus-littawe.de (ожидаемо: нет)
5. Backlinks audit через ahrefs.com/free — текущий count, DR, top referring domains
6. GBP audit: какие поля пусты, photos count, posts last 30 days, reviews count, Q&A count
7. Создать `docs/SEO_RESEARCH.md` с findings + финальным списком 30 городов + final keyword matrix

**Verify:** CEO ОК на 30 городов и keyword matrix → переход к Phase 2

### Phase 2 — Programmatic SEO Foundation (3-5 дней) — `dispatching-parallel-agents`

8. Создать `site/src/data/local-keywords.json` — для каждой пары (service × city): primary keyword, 3-5 secondary, 2-3 local FAQ topics
9. Расширить `site/src/lib/targetCities.ts` с 7 → 30 городов (с координатами, distance from OS, region)
10. Создать `site/src/lib/programmatic.ts` — generator контента: H1 template, intro 300-500 слов с city-specific фактами, 5-7 локальных FAQ, schema generators
11. Создать `site/src/app/leistungen/[service]/[city]/page.tsx` с `generateStaticParams` (5 services × 30 cities = 150 pages, или 75 если отбраковано)
12. Schema на каждой странице: `Service` (areaServed=[city], offers stub), `LocalBusiness` (с локализованным address mention), `BreadcrumbList`
13. Internal links: с каждой landing → /leistungen/[service] (parent), /einsatzgebiet, /kontakt, +3 sibling cities (cluster)
14. Cross-links: /einsatzgebiet → топ-15 ключевых programmatic landing pages
15. /leistungen — добавить раздел "Unsere Leistungen in Ihrer Stadt" с links на programmatic
16. Update `site/src/app/sitemap.ts`: добавить все programmatic URLs (или sitemap-index с разделением)
17. Тесты: render одной landing-страницы (gartenpflege/bramsche) + schema validity (Rich Results Test) + generateStaticParams length match expected
18. Build check — измерить time, repo size; если >10 мин или >70MB → сократить до 75 pages (15 cities × 5 services)
19. Deploy → spot-check 5 random programmatic URLs на live + Rich Results Test
20. **#14 Landa review:** thin content audit (есть ли уникальные факты на каждой? E-E-A-T?), template-уязвимости

### Phase 3 — AI Search Optimization (1-2 дня)

21. Создать `site/public/llms.txt` (Anthropic стандарт): описание сайта, услуги, контакты, links на ключевые pages
22. Создать `site/public/llms-full.txt`: full content dump в structured plain text
23. Создать `site/public/ai.txt` (альтернативный стандарт)
24. Restructure /leistungen и homepage в "answer-first" формат: первый абзац = прямой ответ на implied question
25. Добавить "Fakten über uns" блок на главной: "Gegründet: 2026, Standort: Osnabrück (Bramscher Str. 161), Gründer: Kevin Littawe, Telefon: +49 1523 9603175, Einsatzgebiet: 97 Städte/60km, Hauptleistungen: 5, Weitere: 9, Sprache: Deutsch"
26. Update `site/public/robots.txt`: explicit allow для GPTBot, ClaudeBot, PerplexityBot, Google-Extended, OAI-SearchBot, Bingbot, YandexBot, etc.
27. Submit (manual): Perplexity Sources (если форма доступна), OpenAI Business (если доступно), Bing AI Index через Bing Webmaster
28. AI-test после 24-48h: повторить запросы из Phase 1 шага 4 → screenshot → log дельта (вряд ли изменится сразу — 6-16 нед окно)
29. Записать в `docs/SEO.md` AI-search section

### Phase 4 — Multi-Engine Indexing (1 день) — `verification-before-completion`

30. CEO: создать аккаунт Bing Webmaster Tools (Microsoft) → setup → DNS verification (TXT в IONOS) → submit sitemap.xml
31. Bing: URL inspection главных + 5 топ programmatic
32. CEO: Yandex Webmaster setup → verify → sitemap
33. Ecosia: проверить authoindex через Bing
34. IndexNow: сгенерировать ключ → файл `site/public/{key}.txt` → ping endpoint при deploy через GitHub Action или manual curl
35. GSC: повторно request indexing для всех новых programmatic + ratgeber pages (через URL inspection batch — реально ~10 в день limit, надо 75-150 → растянуть на дни)
36. Записать в `docs/SEO.md` все verifications

### Phase 5 — Schema.org Deep (1 день)

37. `Service` entries (5) с `offers` + `priceSpecification` (если Kevin даст реальные диапазоны "ab X€") и `areaServed` массивом
38. `Organization` schema: `logo` (URL на /images/logo.png), `sameAs` ([GBP URL, Facebook если есть, Instagram если есть]), `founder` (Person Kevin Littawe), `foundingDate: "2026"`, `address` PostalAddress
39. `BreadcrumbList` на ВСЕХ страницах (через wrapper в layout или per-page)
40. `WebSite` с `potentialAction` (SearchAction) — для site-search в Google SERP
41. `AggregateRating` placeholder + реальные rating (получить от Kevin минимум 5 отзывов из GBP, average rating, ratingCount)
42. `Article` schema на каждой ratgeber (после Phase 6)
43. `HowTo` schema на ratgeber где применимо ("Hecke schneiden", "Garten anlegen Schritte")
44. Validate: Rich Results Test на 5 типах страниц (homepage, /leistungen, /leistungen/[s]/[c], /ratgeber/[s], /einsatzgebiet) — 0 errors, 0 warnings
45. **#14 Landa review:** schema completeness, нет ли missing required fields для feature eligibility

### Phase 6 — Content Marketing / Ratgeber (3-5 дней) — `dispatching-parallel-agents`

46. Финализировать темы из шорт-листа PX-025 (10 шт)
47. Создать `site/src/app/ratgeber/page.tsx` — index с card grid
48. Создать `site/src/app/ratgeber/[slug]/page.tsx` — detail с MDX или JSON content
49. Создать `site/src/data/ratgeber/` структуру (10 файлов)
50. Написать 10 статей (1500-2500 слов): H1/H2/H3, 3-5 internal links, FAQ блок, локальные ключи (Osnabrück+Umgebung естественно), Article+HowTo schema (через `lib/seo.ts`)
51. Sitemap update: +10 ratgeber + index
52. Navigation: link на /ratgeber из Footer (Navbar — обсудить с CEO)
53. Тесты: каждая ratgeber render + schema valid + reading time helper
54. **#14 Landa review:** AI ethics check — нет фабрикаций, нет фейк-кейсов, нет thin/stuffed content

### Phase 7 — Backlinks & Off-Page (2-3 дня, calendar — модерация ждёт) — CEO + #1

55. NAP-карточка зафиксирована: "Rund ums Haus Littawe, Inhaber: Kevin Littawe, Bramscher Str. 161, 49090 Osnabrück, +49 1523 9603175, kontakt@rundumshaus-littawe.de, https://rundumshaus-littawe.de"
56. Регистрация в каталогах (по 1, ждать модерацию): Cylex, 11880, Das Örtliche, GoYellow, Yelp DE, Gelbe Seiten, Branchenbuch.de, NOZ Branchenbuch, IHK Osnabrück, Handwerkskammer Osnabrück
57. GBP optimization: services full (5 main + 9 weitere), 10+ photos (вкл. фото Kevin'а), 5+ posts (1/Woche локальные ключи), Q&A 5+, attributes (woman-owned/family-owned не применимо, German-speaking, free quotes)
58. Outreach (опц., обсудить с CEO): 3-5 emails локальным media (NOZ, Osnabrück.de blog, regional Hausmeister-vereine)
59. Trackable spreadsheet `docs/SEO_BACKLINKS.md`: дата подачи, статус, URL после approve

### Phase 8 — Performance Optimization (1 день) — `systematic-debugging`

60. Lighthouse mobile baseline (sample 5 pages: /, /leistungen, /leistungen/[s]/[c], /ratgeber/[slug], /einsatzgebiet) — записать
61. Hero: GSAP SplitText opacity:0 → CSS-first reveal (text shown immediately, animation = enhancement)
62. Lazy-loading: detail-* images на /leistungen — `loading="lazy"` ниже fold
63. Dynamic import: GSAP, Lenis — только на клиенте, после initial paint
64. Verify: Mobile Performance ≥85, LCP ≤2.5s на всех 5 sample pages
65. CWV check через PageSpeed Insights / Search Console Core Web Vitals report
66. **#14 Landa review:** не сломаны ли animations на desktop, аккессибилити (motion-reduced)

### Phase 9 — Measurement & Proof (continuous, 12 недель)

67. Создать `docs/SEO_RESULTS.md` с baseline (state до T007)
68. Установить Plausible/Umami self-hosted (если CEO ОК) или ограничиться GSC + Bing Webmaster
69. AI-test protocol `scripts/ai-search-test.md`: каждые 2 недели запрашивать в 6 AI-поисковиках 10 тестовых запросов → screenshot → log в SEO_RESULTS.md
70. Weekly: GSC impressions/clicks/CTR/avg-position snapshot
71. Bi-weekly: backlinks count (ahrefs free)
72. 4-week report: snapshot + delta from baseline → отправить CEO + Kevin
73. 8-week report: + ranking-changes по 30 ключевым keyword/city pairs
74. 12-week report: финальный — ROI calculation (cost 600€ vs leads delivered), AI-citation evidence, Google ranking proof
75. ВАЖНО: запланировать через `/schedule` 4w/8w/12w напоминалки

---

## 3. Чеклист приёмки (проверить в конце)

### Phase 1
- [ ] `docs/SEO_RESEARCH.md` существует с данными по 5 конкурентам, keyword matrix 5×30, AI baseline screenshots, GBP audit
- [ ] CEO дал ОК на финальный список 30 городов

### Phase 2
- [ ] `site/src/app/leistungen/[service]/[city]/page.tsx` создан, generateStaticParams работает
- [ ] Build генерирует ≥75 programmatic HTML files
- [ ] Rich Results Test: 5 random landing pages — 0 errors
- [ ] Internal links не битые (link-checker)
- [ ] Sitemap.xml содержит все новые URLs
- [ ] Build time <10 мин, repo <70MB
- [ ] Все existing 126+ тестов pass + новые ≥3 теста pass
- [ ] #14 Landa подписал thin-content audit

### Phase 3
- [ ] `/llms.txt`, `/llms-full.txt`, `/ai.txt` доступны на live (curl 200)
- [ ] /leistungen и homepage переписаны answer-first
- [ ] Fakten-блок на главной с 8+ структурированными фактами
- [ ] robots.txt allow GPTBot/ClaudeBot/PerplexityBot/Google-Extended/OAI-SearchBot
- [ ] AI-test после 24h: log в `docs/seo-baseline/post-phase3.md`

### Phase 4
- [ ] Bing Webmaster verified, sitemap submitted, indexed ≥3 main URLs
- [ ] Yandex Webmaster verified, sitemap submitted
- [ ] IndexNow ключ на live, ping работает (test endpoint)
- [ ] GSC: re-submission completed для programmatic + ratgeber

### Phase 5
- [ ] Service schema (5) с offers/priceSpec/areaServed
- [ ] Organization с logo/sameAs/founder/foundingDate
- [ ] BreadcrumbList на всех типах страниц
- [ ] WebSite с SearchAction
- [ ] AggregateRating (если данные от Kevin) с реальным rating
- [ ] Rich Results Test на 5 типах: 0 errors / 0 warnings
- [ ] #14 Landa подписал schema audit

### Phase 6
- [ ] /ratgeber index существует, 10 статей в DOM
- [ ] Каждая ratgeber 1500-2500 слов, Article schema, HowTo где применимо
- [ ] Internal links: каждая ratgeber → 3-5 других страниц
- [ ] Sitemap содержит ratgeber URLs
- [ ] #14 Landa подписал AI ethics + content quality audit

### Phase 7
- [ ] ≥10 каталогов поданы (статус `docs/SEO_BACKLINKS.md`)
- [ ] GBP: services 14, photos ≥10, posts ≥5, Q&A ≥5
- [ ] NAP consistency check: спот-проверка 5 каталогов = ОДИНАКОВО

### Phase 8
- [ ] Lighthouse Mobile ≥85 на 5 sample pages
- [ ] LCP ≤2.5s на всех sample pages (PageSpeed Insights)
- [ ] CWV "Good" в GSC через 28 дней (отдельный check в Phase 9)
- [ ] Анимации на desktop не сломаны
- [ ] #14 Landa подписал performance + a11y review

### Phase 9
- [ ] `docs/SEO_RESULTS.md` ведётся с baseline
- [ ] AI-test ran weeks 2, 4, 6, 8, 10, 12 — screenshots в репо
- [ ] 4-week report отправлен CEO/Kevin
- [ ] 8-week report отправлен CEO/Kevin
- [ ] 12-week report отправлен CEO/Kevin с ROI, AI-citations, Google ranking proof

### Глобально (XL-задача)
- [ ] DEVLOG.md записи S029-S0XX (по фазам)
- [ ] STATUS.md обновлён
- [ ] PX_REGISTRY: PX-025 → "завершено" после Phase 8 (Phase 9 = monitoring, не блокирует closure)
- [ ] CEO + Kevin подписали 12-week report как proof результата
- [ ] 600€ зачислены полностью
- [ ] /schedule создан на 4w / 8w / 12w напоминалки

---

## 4. Риски и митигация (T007-specific)

| # | Риск | Вероятность | Митигация |
|---|------|-------------|-----------|
| 1 | E-E-A-T penalty за thin programmatic | средняя | Уникальные локальные факты на каждой landing; готовы сократить с 150 до 75 если не вытянем уникальность |
| 2 | Google Ranking не растёт за 12 нед | низкая-средняя | Realistic expectation set'нут с Kevin'ом; 12 нед — нижняя граница для конкурентного DACH рынка; backlinks ускорят |
| 3 | AI Search не цитирует 12 нед | средняя | LLM training cycles 6-16 нед; llms.txt — необходимое но не достаточное; продолжаем monitoring дольше |
| 4 | Build time >10 мин на CI | средняя | Sokratit do 75 pages; or self-hosted runner; or pre-build cache |
| 5 | GSAP fix ломает desktop animations | низкая | Тест на desktop после фикса; CSS-first = enhancement-progressive |
| 6 | Каталоги отказывают в модерации | средняя | NAP consistency + valid Impressum + GBP-доказательство = ОК |
| 7 | Kevin не даст реальные цены | средняя | "ab X€" placeholder; offer без price — допустимо для Schema |
| 8 | Kevin не даст реальные отзывы | средняя | AggregateRating не публикуем; ждём накопления реальных GBP reviews |
| 9 | Schema-ошибка ломает все pages | низкая | Тест на 1 page до генерации всех + Rich Results Test обязательно |
| 10 | DSGVO violation (analytics) | низкая | Plausible/Umami self-hosted ИЛИ только GSC; explicit decision CEO |

---

## 5. Зависимости и последовательность

```
Phase 1 (research) ──► Phase 2 (programmatic) ──► Phase 5 (schema deep)
                  │                              │
                  ├─► Phase 3 (AI search) ───────┤
                  │                              │
                  └─► Phase 6 (ratgeber) ────────┘
                                                 │
                       Phase 4 (multi-engine) ◄──┤
                                                 │
                       Phase 8 (performance) ◄───┤
                                                 │
                       Phase 7 (backlinks, calendar parallel)
                                                 │
                                                 ▼
                       Phase 9 (measurement, continuous 12wk)
```

- Phase 1 — блокер всего
- Phase 2 + Phase 6 могут идти параллельно (#3 Marco + #2 Lena)
- Phase 5 после 2+6 (нужны URLs/контент)
- Phase 7 — calendar-driven (модерация), стартует после Phase 5 чтобы NAP+schema+ratgeber были live
- Phase 8 — после всего нового кода (последний CI/perf check)
- Phase 9 — стартует одновременно с Phase 1 (baseline)

---

## 6. Бонусы (обещано Kevin'у 2026-05-01 21:47)

- [ ] Google review link template (WhatsApp-ready) — отдельный артефакт `docs/google-review-template.md`

---

**Нарушение протокола = страйк. 2 страйка = увольнение. После каждой фазы — STOP, review #14 (XL обязательно), DEVLOG, STATUS, ОК CEO → next phase.**
