# T005 — Leistungen restructure + Service Areas + Search Console (PX-021)

**Дата:** 2026-04-25
**Статус:** roadmap (ожидает OK CEO + ответы на вопросы)
**PX:** PX-021
**Ответственный:** #3 Marco Reiter (Frontend) + #6 Jonas Keller (DNS/SEO infra) + #14 Hans Landa (review)
**Скилл:** `writing-plans` (план), затем `verification-before-completion` (выполнение)
**Размер:** L

---

## 1. Затронутые файлы (полный список)

### Wave 1 — Реструктуризация Leistungen
| Файл | Действие |
|------|----------|
| `site/src/app/leistungen/page.tsx` | Добавить рендер `<WeitereLeistungenSection>` после `<ServiceDetail>` + якорь `#weitere` |
| `site/src/app/weitere-leistungen/page.tsx` | **УДАЛИТЬ** (или клиентский redirect на `/leistungen#weitere`) |
| `site/src/components/sections/WeitereLeistungenSection.tsx` | **СОЗДАТЬ** — извлечь рендер из старой page.tsx |
| `site/src/data/site.json` | `navigation` — убрать `{label:"Weitere Leistungen", href:"/weitere-leistungen"}` (5 → 4) |
| `site/src/app/sitemap.ts` | Убрать `/weitere-leistungen/` route (7 → 6) |
| `site/src/components/layout/Navbar.tsx` | Авто-обновится через site.json (мобильное меню тоже) |
| `site/src/components/layout/Footer.tsx` | Авто-обновится через site.json |
| `site/src/__tests__/data.test.ts` | `nav 5 → 4`, обновить тест на навигацию (см. также правки от PX-018) |
| `site/src/data/weitere-leistungen.json` | **НЕ трогать** — переиспользуется |

### Wave 2 — Service Areas (зона обслуживания)
| Файл | Действие |
|------|----------|
| `site/src/data/service-areas.json` | **СОЗДАТЬ** — массив всех городов (нужен полный список — см. вопрос 1) |
| `site/src/app/einsatzgebiet/page.tsx` | **СОЗДАТЬ** (если выбран Вариант C — см. вопрос 2) |
| `site/src/components/sections/Servicegebiet.tsx` | **СОЗДАТЬ** — рендер списка городов (grid/columns) |
| `site/src/data/site.json` | Footer `legalLinks` — добавить ссылку "Einsatzgebiet" → `/einsatzgebiet` |
| `site/src/app/sitemap.ts` | Добавить `/einsatzgebiet/` route |
| `site/src/app/layout.tsx` | Structured data: `areaServed` → массив `City` schema.org вместо одного "Osnabrück und Umgebung" |
| `site/src/data/types.ts` | Добавить тип `ServiceArea` |
| `site/src/__tests__/data.test.ts` | Тест: все города из service-areas.json рендерятся |

### Wave 3 — Google Search Console + DNS
| Файл/система | Действие |
|--------------|----------|
| `search.google.com/search-console` (логин: ebaias.muc@gmail.com) | Добавить Domain property `rundumshaus-littawe.de` |
| IONOS DNS panel (доступы в `docs/CREDENTIALS.md`) | Добавить TXT record на корневой домен (формат: `google-site-verification=...`) |
| `docs/SEO.md` | **СОЗДАТЬ** — детали Search Console property, GBP, DNS verification token |
| Google Search Console UI | Submit `https://rundumshaus-littawe.de/sitemap.xml` |
| Google Search Console UI | Request indexing для `/`, `/leistungen`, `/referenzen`, `/kontakt`, `/einsatzgebiet` |

---

## 2. Что БЫЛО → что СТАНЕТ

### Navigation
**БЫЛО:** Startseite, Leistungen, Weitere Leistungen, Referenzen, Kontakt (5)
**СТАНЕТ:** Startseite, Leistungen, Referenzen, Kontakt (4)

### URL structure
**БЫЛО:** `/leistungen` (5 главных) + `/weitere-leistungen` (9 доп.)
**СТАНЕТ:** `/leistungen` (5 главных + 9 доп. через якорь `#weitere`); `/weitere-leistungen` → 404 или redirect

### Service area
**БЫЛО:** структурированные данные `areaServed: City "Osnabrück und Umgebung"` + текст в Hero
**СТАНЕТ:** structured data `areaServed: [City "Osnabrück", City "Bramsche", ...]` (50+ City entries) + новая страница `/einsatzgebiet` (если Вариант C)

### Structured data (schema.org)
**БЫЛО:**
```json
"areaServed": { "@type": "City", "name": "Osnabrück und Umgebung" }
```
**СТАНЕТ:**
```json
"areaServed": [
  { "@type": "City", "name": "Osnabrück" },
  { "@type": "City", "name": "Bramsche" },
  ... // 50+ городов
]
```

### Google Search Console
**БЫЛО:** не настроен
**СТАНЕТ:** Domain property verified, sitemap submitted, indexing requested

---

## 3. Что может сломаться рядом

### Wave 1 риски
- **Старая закладка пользователя** на `/weitere-leistungen` → 404. **Митигация:** клиентский redirect (Next.js `output: "export"` не поддерживает 301 redirect — нужен JS-redirect через `<meta http-equiv="refresh">` в HTML или Next.js `redirects` не работает на static export → плейсхолдер-страница с auto-refresh)
- **Внешние ссылки/Google индекс** на `/weitere-leistungen`. **Митигация:** в Google Search Console пометить как "Removed URL" + sitemap без него
- **Якорь `#weitere`** — должен корректно работать с smooth scroll (Lenis)
- **Тесты:** layout.test проверяет nav links — обновить (5 → 4)

### Wave 2 риски
- **Длинный список городов** (50+) — UX/performance: рендер 50 div'ов = OK, но визуально перегружено без правильного layout (grid columns)
- **SEO дубликат:** одинаковый список в Footer + на странице — Google может счесть thin content. **Решение:** только на `/einsatzgebiet`, в Footer одна ссылка
- **Mobile:** длинный список нужно протестировать на 375px (вертикальная прокрутка)

### Wave 3 риски
- **DNS propagation** до 24-48 часов — может задержать verification
- **TXT record конфликт:** уже есть SPF, DMARC, _domainkey TXT — Google verification идёт на корневой домен, должна работать рядом
- **rundumshaus-littawe.de** — Domain property в GSC требует **DNS verification** (не file/HTML tag), что подтверждает все subdomains за раз

### Breakpoints
- **Mobile 375px:** список городов — 1 колонка, gap-2; проверить scroll на /einsatzgebiet
- **Tablet 768px:** 2 колонки grid
- **Desktop 1440px:** 3-4 колонки grid

### Анимации/JS
- Wave 1: якорная навигация `#weitere` + Lenis smooth scroll → проверить что Lenis перехватывает hash
- Wave 2: ScrollReveal для секции городов (опционально, не критично)

---

## 4. Roadmap

### Wave 1 — Leistungen restructure (1 commit)
1. Создать `site/src/components/sections/WeitereLeistungenSection.tsx` — извлечь content из `app/weitere-leistungen/page.tsx`, добавить `id="weitere"` на section
2. Обновить `site/src/app/leistungen/page.tsx` — рендерить `<ServiceDetail />` + `<WeitereLeistungenSection />`
3. Удалить `site/src/app/weitere-leistungen/page.tsx` (либо превратить в `<meta refresh url=/leistungen#weitere>` плейсхолдер на 24-48ч пока Google не реиндексирует)
4. Обновить `site/src/data/site.json` navigation — убрать Weitere Leistungen
5. Обновить `site/src/app/sitemap.ts` — убрать /weitere-leistungen
6. Обновить тесты nav 5→4 в data.test.ts
7. Запустить `npm run test` → все pass
8. `npm run build` → ОК
9. Локально: открыть `/leistungen#weitere` → секция видна
10. Commit: `refactor(leistungen): merge Weitere Leistungen into /leistungen page`

### Wave 2 — Service Areas (1 commit)
11. **STOP** — ждать ответ CEO на вопросы 1 и 2 (см. ниже)
12. Создать `site/src/data/service-areas.json` с полным списком
13. Создать `site/src/data/types.ts` тип `ServiceArea`
14. Создать `site/src/components/sections/Servicegebiet.tsx` — grid/columns layout
15. (Если Вариант C) Создать `site/src/app/einsatzgebiet/page.tsx` с SEO meta + рендер `<Servicegebiet />`
16. Обновить `site/src/data/site.json` — добавить ссылку в footer (или отдельная nav-ссылка — спросить у CEO)
17. Обновить `site/src/app/sitemap.ts` — добавить `/einsatzgebiet/`
18. Обновить `site/src/app/layout.tsx` structured data — `areaServed` массив City
19. Тесты: все города рендерятся
20. Build + tests
21. Mobile 375 + Desktop 1440 — visual check
22. Commit: `feat(seo): add /einsatzgebiet with 50+ service area cities`

### Wave 3 — Google Search Console (manual ops, no code)
23. Залогиниться в `search.google.com/search-console` (ebaias.muc@gmail.com)
24. Add property → Domain → `rundumshaus-littawe.de`
25. Скопировать TXT verification token от Google
26. IONOS DNS panel: добавить TXT запись на корневой домен (`@`) со значением `google-site-verification=...`
27. Подождать 5-15 минут (DNS propagation, обычно быстро)
28. Search Console → Verify
29. После verification: Submit sitemap → `https://rundumshaus-littawe.de/sitemap.xml`
30. URL Inspection → Request indexing для `/`, `/leistungen`, `/referenzen`, `/kontakt`, `/einsatzgebiet`
31. Создать `docs/SEO.md` с заметками: GSC property URL, GBP админ, DNS verification token, sitemap URL
32. Проверить через 24h: index coverage report, найти "не индексировано" URLs (про которые Kevin спрашивал)
33. Commit: `docs(seo): add Search Console + GBP setup notes`

### Verification (Wave 4)
34. `npm run test` → 106+ pass
35. `npm run build` → OK
36. Push → CI green
37. Live: `/leistungen` показывает 5 + 9, `/leistungen#weitere` скроллит к секции
38. Live: `/einsatzgebiet` рендерит 50+ городов
39. `curl /weitere-leistungen` → 404 или redirect
40. Search Console → property verified, sitemap submitted, indexing requests sent
41. Запись в DEVLOG (S025), STATUS, Obsidian

---

## 5. Чеклист приёмки

### Структурные
- [ ] `/leistungen` показывает 5 главных + секцию "Weitere Leistungen" с 9 услугами
- [ ] Якорь `/leistungen#weitere` работает (smooth scroll к секции)
- [ ] Navbar и Mobile menu — 4 пункта (без "Weitere Leistungen")
- [ ] Footer не содержит "Weitere Leistungen"
- [ ] `/weitere-leistungen` → 404 или redirect на `/leistungen#weitere`
- [ ] sitemap.xml не содержит `/weitere-leistungen`

### Service Areas
- [ ] `/einsatzgebiet` страница live (если Вариант C)
- [ ] Все города из service-areas.json отображаются на странице
- [ ] Mobile 375px: список читаемый, не выходит за viewport
- [ ] Structured data `areaServed` содержит массив City schema
- [ ] Footer ссылка на /einsatzgebiet

### Search Console
- [ ] Domain property `rundumshaus-littawe.de` verified
- [ ] sitemap.xml submitted и принят
- [ ] Все 7 главных URL отправлены на indexing
- [ ] Google Unternehmensprofil доступ CEO подтверждён
- [ ] docs/SEO.md создан

### Тесты + деплой
- [ ] 106+ тестов pass (после обновления nav 5→4)
- [ ] Build OK
- [ ] CI green, deploy live
- [ ] DEVLOG S025 + STATUS + Obsidian обновлены

---

## 6. Вопросы CEO (до Wave 2)

### Вопрос 1 — Полный список городов
В переписке Kevin список обрезан на `Neuenkirc...`. Из контекста (60 km Umkreis Osnabrück) видны:
**Niedersachsen:** Osnabrück, Georgsmarienhütte, Melle, Bramsche, Wallenhorst, Belm, Bissendorf, Bad Essen, Bohmte, Ostercappeln, Fürstenau, Quakenbrück, Bersenbrück, Ankum, Neuenkirchen, Voltlage, Rieste, Alfhausen, Nortrup, Kettenkamp, Eggermühlen, Menslage, Bippen, Berge, Gehrde, Hagen, Bad Iburg, Bad Laer, Bad Rothenfelde, Dissen, Glandorf, Diepholz, Vechta, Lohne, Dinklage, Damme, Holdorf, Steinfeld
**NRW:** Münster, Greven, Ibbenbüren, Lengerich, Tecklenburg, Mettingen, Hörstel, Rheine, Emsdetten, Steinfurt, Ochtrup, Horstmar, Laer, Nordwalde, Altenberge, Telgte, Warendorf, Sassenberg, Versmold, Halle (Westfalen), Borgholzhausen, Werther, Bielefeld, Löhne, Herford, Bad Oeynhausen, Preußisch Oldendorf, Rahden, Stemwede, Espelkamp

**→ Нужен от CEO/Kevin полный список (Kevin прислал WhatsApp обрезанный).**

### Вопрос 2 — Где разместить список городов
| Вариант | + | − |
|---------|---|---|
| A. Footer (везде) | Виден на всех страницах | Громоздит footer, дубликат content |
| B. Секция на /leistungen или главной | Видно при поиске услуг | Длинная страница, отвлекает |
| **C. Отдельная страница /einsatzgebiet (рекомендую)** | **SEO bonus, чисто** | Один клик до списка |
| D. На каждой странице услуги | — | Избыточно, Google штрафует за дубли |

**Рекомендация:** **Вариант C** + ссылка из Footer ("Einsatzgebiet").

### Вопрос 3 — `/weitere-leistungen` removal strategy
- 3a. **Hard 404** — быстро, но посетители со старой закладкой получат 404
- 3b. **Auto-refresh placeholder** — простая HTML страница с `<meta http-equiv="refresh" content="0;url=/leistungen#weitere">` (Next.js export支持)
- 3c. **Cliennt-side redirect** через JS (медленнее, требует JS)

**Рекомендация:** **3b** на 30 дней (пока Google переиндексирует), потом hard 404.

---

## 7. Риски и митигация

| # | Риск | Митигация |
|---|------|-----------|
| 1 | DNS TXT verification > 48h | Проверить IONOS TTL = 300; пробовать TXT verification как backup-метод HTML-tag |
| 2 | Список 50+ городов выглядит как spam | grid columns + responsive + alphabet sort + не дублировать в footer |
| 3 | `/weitere-leistungen` 404 ломает PageRank | Auto-refresh placeholder + GSC URL removal request |
| 4 | Якорь #weitere не работает с Lenis | Test после Wave 1; fallback `scrollIntoView()` |
| 5 | Структурированные данные с 50 City — слишком тяжёлый JSON-LD | Используем компактный массив имён без duplicate fields |
| 6 | Google Search Console "не индексировано" — отдельная отладка | Анализ после verification (Wave 3.32) — может быть отдельный PX |

---

**Roadmap готов, жду ОК.**

Перед стартом Wave 2 нужны ответы CEO:
1. Полный список городов
2. Подтверждение Варианта C для /einsatzgebiet
3. Подтверждение варианта 3b для /weitere-leistungen redirect
