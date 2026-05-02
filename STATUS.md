# STATUS — RundumsHaus

**Обновлён:** 2026-05-02
**Этап:** T007 / PX-025 Phase 1+2+3+6 + Phase 9 framework готовы локально. **NOT DEPLOYED** — ждём данные Kevin'а + Hans Landa GO. 512 страниц generated, 128/128 тестов pass.

## Готово

- [x] W1-11 + T002-T006 (предыдущие — см. DEVLOG)
- [x] **T007 Phase 1 — Discovery:** Конкурентный аудит, 11880.com-citation existing, 98 cities tiered → `docs/SEO_RESEARCH.md`
- [x] **T007 Phase 2 — Programmatic SEO (с Hans Landa C1+C2+C3+M4 fixes):** 490 landing pages, 0 orphans, symmetric neighbor graph, 8 intro variants, 12 FAQ pool, tier-scaled Fakten-block (40% unique data)
- [x] **T007 Phase 3 — AI Search Optimization:** llms.txt + llms-full.txt + ai.txt + robots.ts с 2026 three-tier AI bot framework + Homepage answer-first FaktenBlock
- [x] **T007 Phase 6 — Ratgeber:** 10 статей × 2100-2900 слов, Article+HowTo+BreadcrumbList schema, /ratgeber index + dynamic route
- [x] **T007 Phase 9 — Framework:** SEO_RESULTS.md + ai-search-test.md + Google review template
- [x] Schema deep partial: HomeAndConstructionBusiness, @id refs (LocalBusiness/WebSite/Organization graph), founder + foundingDate, BreadcrumbList на всех типах страниц
- [x] Build OK (Turbopack ~10s), 512 HTML pages, 128/128 tests pass

## Repo + Production

- Repo: https://github.com/aidancompton001/rundumshaus
- Live: https://rundumshaus-littawe.de (старая версия, БЕЗ T007 deploy)
- CMS: https://app.pagescms.org

## Pending от CEO/Kevin (8 позиций — БЛОКИРУЮТ deploy)

1. **Цены Kevin'а** — для priceSpecification в Service schema (Phase 5)
2. **5-10 реальных отзывов** клиентов — для AggregateRating + visible reviews block (Phase 5)
3. **Фото Kevin'а** — для блока "Gründer" (Phase 5)
4. **ОК на формулировку** "junges Familienunternehmen seit 2026"
5. **Bing Webmaster Tools** аккаунт — Phase 4
6. **Yandex Webmaster** аккаунт — Phase 4
7. **AI baseline screenshots** — manual ~30 мин, 6 поисковиков × 6 запросов (`scripts/ai-search-test.md`)
8. **DSGVO решение** — Plausible/Umami self-hosted vs только GSC

## Pending — техническое (не блокирует, отдельная сессия)

- [ ] Phase 4: Bing/Yandex/Ecosia indexing + IndexNow
- [ ] Phase 5: priceSpecification после получения цен Kevin'а; AggregateRating после 5+ Google reviews
- [ ] Phase 7: Cylex/Das Örtliche/GoYellow/Yelp DE/Gelbe Seiten + GBP optimization
- [ ] Phase 8: Performance — GSAP SplitText fix mobile LCP, lazy-load detail images, dynamic GSAP/Lenis import
- [ ] Hans Landa final re-review (XL обязательно) — после этой сессии
- [ ] Deploy после Landa GO + Phase 5 priceSpec минимум
- [ ] PX-021 GSC Pages indexing check (через 1-7 дней после deploy)
- [ ] Form submit FormSubmit.co live test
- [ ] IONOS WordPress downgrade (~12€/год)
- [ ] Repo transfer to Kevin

## Блокеры

- **CEO/Kevin данные (8 позиций выше)** — блокируют deploy
- **Hans Landa re-review** — после фиксов C1+C2+C3+M4 нужна повторная adversarial проверка перед deploy
