# T006 — Local SEO Basis-Paket: Gartenpflege + Entrümpelung × ближний радиус (PX-022)

**Дата:** 2026-05-01
**Статус:** roadmap (ожидает ОК CEO)
**PX:** PX-022
**Размер:** L (5 wave)
**Ответственный:** #3 Marco Reiter (Frontend + SEO content) + #2 Lena Schwarz (UX FAQ accordion) + #14 Hans Landa (review)
**Скилл:** `writing-plans` (планирование), `verification-before-completion` (финальная верификация)
**Коммерч.:** 150€ Basis Local SEO (Kevin подтвердил 2026-04-20 13:48 WhatsApp)

---

## 1. Целевые города (6, без Belm)

Решение по quesion #4 из PX-022:

```
TARGET_CITIES = [
  "Osnabrück",          // home city
  "Bramsche",           //  ~17 km N
  "Wallenhorst",        //  ~10 km N
  "Belm",               //  ~9 km NE
  "Bissendorf",         //  ~13 km E
  "Georgsmarienhütte",  //  ~9 km S
  "Melle",              //  ~25 km E
]
```

7 городов (включая Belm — он тоже ≤10 км, не имеет смысла исключать). Все в радиусе ~25км (соответствует "ближний Umkreis" Kevin'а).

Все УЖЕ есть в `service-areas.json` → регион `"Osnabrücker Land & Umgebung"`. Переиспользуем как single source of truth.

---

## 2. Что БЫЛО → что СТАНЕТ

### A. `site/src/data/services.json`

**Gartenpflege (id `gartenpflege`):**

БЫЛО (44 слова):
> "Ihr Garten verdient professionelle Pflege. Wir übernehmen Rasenmähen, Heckenschnitt, Beetpflege, Unkrautentfernung und saisonale Gartenarbeiten. Regelmäßig oder auf Abruf — ganz nach Ihrem Bedarf."

СТАНЕТ (~150-180 слов): расширенный текст с естественным упоминанием 7 городов в контексте конкретных задач Gärtner. Ключи: "Gärtner in Osnabrück", "Gartenpflege Bramsche", "Heckenschnitt Wallenhorst", "Rasenmähen Belm/Bissendorf", "Gartenbetreuung Georgsmarienhütte/Melle". Преимущество: kurze Anfahrt, schnell vor Ort, kostenlose Besichtigung.

**Entrümpelung (id `entruempelung`):**

БЫЛО (28 слов):
> "Vom Keller bis zur kompletten Haushaltsauflösung — wir entrümpeln schnell, sauber und stressfrei. Alle Gegenstände werden fachgerecht entsorgt oder dem Recycling zugeführt."

СТАНЕТ (~150-180 слов): расширенный текст с естественным упоминанием 7 городов в контексте Haushaltsauflösung/Keller/Dachboden/Garage. Ключи: "Entrümpelungsfirma in Osnabrück", "Entrümpelung Bramsche", "Haushaltsauflösung Wallenhorst/Belm/Bissendorf/Georgsmarienhütte/Melle". Преимущество: kostenlose Besichtigung vor Ort, schnelle Termine im näheren Umkreis.

**Hausmeister, Dacharbeiten, Schrottabholung:** НЕ ТРОГАТЬ.

### B. НОВЫЙ файл `site/src/data/service-faq.json`

```json
{
  "gartenpflege": {
    "title": "Häufige Fragen zur Gartenpflege",
    "items": [
      { "q": "Bieten Sie Gartenpflege auch in Bramsche an?", "a": "..." },
      { "q": "Wie schnell sind Sie in Wallenhorst vor Ort?", "a": "..." },
      { "q": "Übernehmen Sie Heckenschnitt in Belm und Bissendorf?", "a": "..." },
      { "q": "Mähen Sie auch Rasen in Georgsmarienhütte?", "a": "..." },
      { "q": "Bieten Sie ganzjährige Gartenbetreuung in Melle?", "a": "..." },
      { "q": "Was kostet eine Besichtigung im Einsatzgebiet?", "a": "Kostenlos im Umkreis von 25 km um Osnabrück." }
    ]
  },
  "entruempelung": {
    "title": "Häufige Fragen zur Entrümpelung",
    "items": [
      { "q": "Entrümpeln Sie Wohnungen und Häuser in Bramsche?", "a": "..." },
      { "q": "Ist eine Haushaltsauflösung in Melle möglich?", "a": "..." },
      { "q": "Bieten Sie kostenlose Besichtigungen in Belm an?", "a": "..." },
      { "q": "Räumen Sie auch Keller und Dachböden in Bissendorf?", "a": "..." },
      { "q": "Komplette Entrümpelung in Wallenhorst — wie läuft das ab?", "a": "..." },
      { "q": "Wie schnell bekomme ich einen Termin in Osnabrück oder Georgsmarienhütte?", "a": "..." }
    ]
  }
}
```

6 вопросов × 2 услуги = 12 FAQ items, каждый с упоминанием минимум одного целевого города.

### C. НОВЫЙ компонент `site/src/components/sections/ServiceFAQ.tsx`

- Принимает `serviceId: "gartenpflege" | "entruempelung"`
- Читает `service-faq.json`, рендерит `<Accordion>` (существующий компонент в `ui/Accordion.tsx`)
- Внутри: `<script type="application/ld+json">` со Schema.org `FAQPage` schema (для Google Rich Results)
- Кнопка CTA "Kostenlose Anfrage" → `/kontakt`
- Mobile-responsive (Accordion уже responsive)

### D. `site/src/components/sections/ServiceDetail.tsx`

БЫЛО: рендерит 5 услуг в grid 2-col без дополнительного контента.

СТАНЕТ: после рендера 5 карточек добавить **2 отдельных секции** (не в grid'е):
1. `<ServiceFAQ serviceId="gartenpflege" />` — после grid'а, с visible heading "Gärtner in Osnabrück, Bramsche, Melle und Umgebung"
2. `<ServiceFAQ serviceId="entruempelung" />` — следом, с visible heading "Entrümpelungsfirma im Umkreis von Osnabrück"

H2/H3 заголовки между секциями содержат ключевые комбинации "услуга + города" — natural placement для Google.

### E. `site/src/app/leistungen/page.tsx`

БЫЛО:
```ts
metadata = { title: "Leistungen", description: "...alle Leistungen im Überblick." }
```

СТАНЕТ:
```ts
metadata = {
  title: "Leistungen — Gärtner & Entrümpelungsfirma in Osnabrück und Umgebung",
  description: "Gartenpflege, Heckenschnitt, Entrümpelung, Haushaltsauflösung — schnell und zuverlässig in Osnabrück, Bramsche, Wallenhorst, Belm, Bissendorf, Georgsmarienhütte und Melle."
}
```

Длина description ~155 символов (max 160 для Google).

### F. `site/src/app/layout.tsx` — Schema.org Service entries

БЫЛО: `hasOfferCatalog.itemListElement` — массив 5 Service entries без `areaServed`.

СТАНЕТ: для двух целевых Service entries (`Gartenpflege`, `Entrümpelung`) добавить:
```json
"areaServed": [
  { "@type": "City", "name": "Osnabrück" },
  { "@type": "City", "name": "Bramsche" },
  { "@type": "City", "name": "Wallenhorst" },
  { "@type": "City", "name": "Belm" },
  { "@type": "City", "name": "Bissendorf" },
  { "@type": "City", "name": "Georgsmarienhütte" },
  { "@type": "City", "name": "Melle" }
]
```

LocalBusiness `areaServed` (массив 97 City) **не трогаем** — он остаётся как был после T005.

### G. НОВАЯ утилита `site/src/lib/targetCities.ts`

```ts
import serviceAreasData from "@/data/service-areas.json";

export const TARGET_CITIES = [
  "Osnabrück", "Bramsche", "Wallenhorst", "Belm",
  "Bissendorf", "Georgsmarienhütte", "Melle",
] as const;

export type TargetCity = (typeof TARGET_CITIES)[number];

// Validate at module load: все TARGET_CITIES существуют в service-areas.json
const allKnownCities = serviceAreasData.regions.flatMap(r => r.cities);
TARGET_CITIES.forEach(c => {
  if (!allKnownCities.includes(c)) throw new Error(`TARGET_CITIES contains unknown city: ${c}`);
});
```

Single source of truth — переиспользуется в Schema, FAQ, мета-тегах.

---

## 3. Что может сломаться рядом

### Риски

| # | Риск | Митигация |
|---|------|-----------|
| 1 | Расширенный `detailDescription` сломает grid layout (`ServiceDetail.tsx`) — текст может быть длинным | Grid 2-col уже adaptive, текст в `<p>` с `leading-relaxed` — flex-grow карточки. Тестировать на 375/768/1440 |
| 2 | FAQ accordion с motion/react — performance на mobile | Accordion уже используется в проекте, mobile-tested. AnimatePresence overhead минимальный |
| 3 | Schema.org FAQPage конфликт с уже существующим LocalBusiness/Service в layout.tsx | Schema FAQPage — отдельный `<script type="application/ld+json">` в ServiceFAQ.tsx, separate from layout |
| 4 | Keyword stuffing penalty от Google | Ограничение: каждый город упоминается 1-2 раза в `detailDescription`, естественные предложения, не списком. Code review #14 Landa проверит |
| 5 | Тест `data.test.ts` `services.test.tsx` после расширения текстов может падать | Обновить тесты под новые тексты, добавить новые: проверка наличия 7 городов в `gartenpflege.detailDescription` и `entruempelung.detailDescription` |
| 6 | Pages CMS Kevin может случайно стереть расширенные тексты при редактировании | Не критично — Kevin может сам обратно вписать (или мы откатим из git). Документировать в `docs/SEO.md` что эти тексты SEO-оптимизированы |

### Breakpoints

- **Mobile 375px:** ServiceDetail grid → 1 col, FAQ accordion full-width, headings text-2xl
- **Tablet 768px:** ServiceDetail 2 col, FAQ max-w-3xl центр
- **Desktop 1440px:** 2 col, FAQ max-w-3xl

### Якоря и навигация

- Существующий `#weitere` (от T005) на /leistungen остаётся
- Добавляем якоря: `#gartenpflege-faq`, `#entruempelung-faq` для возможных deep-link

### JS / анимации

- Accordion использует motion/react `AnimatePresence` — уже работает, не трогаем
- ScrollReveal для FAQ headings — переиспользуем

### Тесты — что обновить/написать

Existing:
- `data.test.ts` — обновить тесты на `services.json` если они проверяют конкретный текст `detailDescription`
- `services.test.tsx` — может проверять рендер 5 карточек, не сломается

Новые:
- `data.test.ts > service-faq.json`:
  - Has both keys `gartenpflege` and `entruempelung`
  - Each has ≥5 items with `q` and `a` strings
  - Each FAQ item mentions ≥1 of TARGET_CITIES
- `data.test.ts > services.json local-seo`:
  - `gartenpflege.detailDescription` contains all 7 TARGET_CITIES
  - `entruempelung.detailDescription` contains all 7 TARGET_CITIES
  - Word count для обеих ≥ 150 слов
- `service-faq.test.tsx` (новый):
  - `<ServiceFAQ serviceId="gartenpflege" />` рендерит 6 accordion items
  - Schema FAQPage JSON-LD присутствует в DOM
  - Все вопросы доступны (visible после клика)
- `targetCities.test.ts` (новый):
  - `TARGET_CITIES` валиден, все 7 городов из service-areas.json
  - Validation throw на unknown city

---

## 4. Roadmap (5 wave)

### Wave 1 — Расширенные тексты услуг (1 коммит)

1. Создать `site/src/lib/targetCities.ts` с константой TARGET_CITIES (7 городов) + runtime валидацией против service-areas.json
2. Расширить `services.json` → `gartenpflege.detailDescription` (~150-180 слов с упоминаниями 7 целевых городов в контексте Garten)
3. Расширить `services.json` → `entruempelung.detailDescription` (~150-180 слов с упоминаниями 7 целевых городов в контексте Entrümpelung)
4. Обновить тесты в `data.test.ts`:
   - `gartenpflege.detailDescription` mentions all 7 TARGET_CITIES
   - `entruempelung.detailDescription` mentions all 7 TARGET_CITIES
   - Word count ≥ 150
5. `npm run test` → 110+ pass
6. `npm run build` → OK
7. **Локальная визуальная проверка:** /leistungen на 375/768/1440 — карточки не сломаны
8. Коммит: `feat(seo): expand Gartenpflege and Entrümpelung descriptions with local cities`

### Wave 2 — FAQ компонент + данные (1 коммит)

9. Создать `site/src/data/service-faq.json` с 6 вопросами под каждую из 2 услуг (12 items total). Каждый вопрос упоминает минимум 1 целевой город. Ответы 30-60 слов с natural keyword density
10. Создать тип `ServiceFAQData` в `site/src/data/types.ts`
11. Создать `site/src/components/sections/ServiceFAQ.tsx`:
    - Принимает `serviceId: "gartenpflege" | "entruempelung"`
    - Использует `<Accordion>` из `ui/Accordion.tsx`
    - Schema.org FAQPage JSON-LD внутри компонента
    - "use client" если нужно (Accordion уже client)
    - Mobile-responsive
12. Обновить `ServiceDetail.tsx`: после grid 5 карточек добавить 2 секции `<ServiceFAQ />` с H2-заголовками-ключами
13. Создать `service-faq.test.tsx` — рендер 6 items, schema присутствует
14. Создать `targetCities.test.ts`
15. `npm run test` → 110+ pass (новые тесты не должны ломать старые)
16. `npm run build` → OK
17. **Локальная проверка:** /leistungen — FAQ видимо, accordion работает на mobile/tablet/desktop, schema валиден (https://validator.schema.org/)
18. Коммит: `feat(seo): add ServiceFAQ component with local keywords for Gärtner + Entrümpelung`

### Wave 3 — Мета-теги + Schema Service.areaServed (1 коммит)

19. Обновить `metadata` в `/leistungen/page.tsx`:
    - title: "Leistungen — Gärtner & Entrümpelungsfirma in Osnabrück und Umgebung"
    - description: с упоминанием 7 городов и 2 услуг (~155 символов)
    - openGraph.title и openGraph.description тоже обновить
20. Обновить `layout.tsx` Schema.org:
    - Для `Service "Gartenpflege"` → добавить `areaServed: [7 City]`
    - Для `Service "Entrümpelung"` → добавить `areaServed: [7 City]`
    - LocalBusiness areaServed (97 cities) — НЕ ТРОГАТЬ
21. `npm run test` → pass
22. `npm run build` → OK, проверить generated `/leistungen/index.html` содержит обновлённый `<title>` и meta description
23. Коммит: `feat(seo): meta tags + Schema Service.areaServed for Gärtner + Entrümpelung`

### Wave 4 — Push + GSC (1 коммит, ручные операции)

24. Push → GitHub Actions deploy → live
25. Проверка live: `curl https://rundumshaus-littawe.de/leistungen` — содержит обновлённые тексты, FAQ видимо
26. Schema validator: https://validator.schema.org/ для `https://rundumshaus-littawe.de/leistungen` — FAQPage и Service.areaServed валидны
27. Google Rich Results test: https://search.google.com/test/rich-results — FAQ Rich Results eligible
28. Google Search Console:
    - Submit обновлённый sitemap (если изменился — должен переиндексировать /leistungen)
    - URL Inspection → /leistungen → Request indexing
29. Update `docs/SEO.md` с заметками о новых ключах и FAQ
30. Коммит docs: `docs(seo): add Local SEO Basis-Paket notes (PX-022)`

### Wave 5 — Финальная верификация и DEVLOG

31. Lighthouse mobile + desktop на /leistungen:
    - Performance ≥ 80 mobile / ≥ 95 desktop
    - SEO ≥ 95
    - Accessibility ≥ 90
32. Все тесты 110+ pass
33. Build OK, CI green, deploy live
34. Запись DEVLOG (S026) + STATUS + Obsidian
35. Сообщение Kevin'у: что сделано, через 2-4 недели — отчёт по GSC

---

## 5. Чеклист приёмки

### Контент
- [ ] `gartenpflege.detailDescription` ≥ 150 слов, упоминает все 7 городов естественно
- [ ] `entruempelung.detailDescription` ≥ 150 слов, упоминает все 7 городов естественно
- [ ] Тексты НЕ keyword-stuffed (Landa review)
- [ ] Service-faq.json: 6 вопросов × 2 услуги = 12 items, каждый с городом
- [ ] FAQ ответы 30-60 слов, естественные, упоминают преимущества (kostenlose Besichtigung, kurze Anfahrt)

### Технически
- [ ] `targetCities.ts` экспортирует TARGET_CITIES, валидация работает
- [ ] `<ServiceFAQ />` рендерит 6 accordion items на /leistungen
- [ ] Schema.org FAQPage JSON-LD валиден (validator.schema.org)
- [ ] Schema.org Service.areaServed для 2 целевых услуг — массив 7 City
- [ ] LocalBusiness.areaServed (97 cities) не тронут
- [ ] /leistungen meta title/description обновлены, ≤160 chars
- [ ] Mobile 375 / Tablet 768 / Desktop 1440 — layout не сломан

### Тесты + деплой
- [ ] 110+ тестов pass (новые на FAQ + targetCities + расширенные detail)
- [ ] Build OK
- [ ] CI green, deploy live
- [ ] Lighthouse SEO ≥ 95 на /leistungen
- [ ] Google Rich Results test: FAQ eligible
- [ ] GSC sitemap submitted/refreshed
- [ ] Request indexing /leistungen в GSC

### Документация
- [ ] `docs/SEO.md` обновлён (целевые ключи, города, что сделано)
- [ ] DEVLOG S026
- [ ] STATUS обновлён
- [ ] Obsidian Tasks and Roadmap

### Бизнес
- [ ] Kevin уведомлён: сделано, ждать 2-4 недели для GSC данных
- [ ] Через 2-4 недели — повторный анализ GSC: рост impressions/clicks по локальным запросам ("Gärtner Bramsche", и т.п.)
- [ ] Если результат хороший → upsell premium (300-500€ landing pages)

---

## 6. Что НЕ входит в T006 (рамки 150€)

- Отдельные landing pages /gaertner-bramsche и т.п. — это premium-вариант 300-500€
- Расширение ranking на остальные 3 услуги (Hausmeister/Dach/Schrott) — Kevin не запросил
- Расширение городов далеко (Bielefeld, Münster) — это premium 500€
- Backlinks стратегия
- Регулярный мониторинг + monthly content update — отдельная подписка

Для всего этого — отдельные PX в будущем когда Kevin захочет масштабироваться.

---

**Roadmap готов, жду ОК.**
