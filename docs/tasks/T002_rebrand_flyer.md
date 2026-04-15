# T002 — Ребрендинг по флаеру клиента

**Дата:** 2026-04-15
**Статус:** В работе — Wave 2+3 (палитра) DONE, остальное в процессе
**Ответственные:** #2 Lena Schwarz (UI/палитра), #3 Marco Reiter (код/данные/новая страница)
**Размер:** L (несколько модулей, кросс-доменная)
**Скилл:** ui-ux-pro-max + dispatching-parallel-agents

---

## Цель

Привести сайт в полное соответствие с флаером клиента: город, цвета, доп. услуги, WhatsApp, телефон.

---

## Анализ последствий

### Файлы затронуты (полный список)

| # | Файл | Что меняется |
|---|------|-------------|
| 1 | `src/app/globals.css` | 8 CSS-переменных (:root + @theme), moving-border hex, ::selection hex |
| 2 | `src/data/site.json` | address (street, city, zip), phone, navigation (+ Weitere Leistungen) |
| 3 | `src/data/homepage.json` | hero.subheading ("Bielefeld" → "Osnabrück") |
| 4 | `src/app/layout.tsx` | 3× meta description, structured data (addressLocality, postalCode, areaServed, telephone) |
| 5 | `src/app/referenzen/page.tsx` | meta description "Bielefeld" |
| 6 | `src/app/icon.svg` | favicon hex (#2A2A2A, #9B7B4E) |
| 7 | `public/images/branding/logo-icon.svg` | #9B7B4E → новый акцент |
| 8 | `public/images/branding/logo-icon-dark.svg` | #F3EDE2 → новый light |
| 9 | `public/images/branding/logo-full.svg` | #9B7B4E → новый акцент |
| 10 | `public/images/branding/logo-full-dark.svg` | #F3EDE2 → новый light |
| 11 | `src/components/aceternity/Lamp.tsx` | rgba(42,42,42,...) → новый dark |
| 12 | `src/components/aceternity/Spotlight.tsx` | rgba(155,123,78,...) → новый акцент |
| 13 | `src/components/ServiceIcons.tsx` | `text-charcoal` + `text-copper` — работают через токены, НЕ hardcoded |
| 14 | `src/app/datenschutz/page.tsx` | Aufsichtsbehörde: LDI NRW → LfD Niedersachsen (Osnabrück = Niedersachsen!) |
| 15 | `src/app/sitemap.ts` | Добавить /weitere-leistungen |
| 16 | `src/data/types.ts` | Новый тип WeitereLeistung (если нужен) |
| **НОВЫЕ ФАЙЛЫ** | |
| 17 | `src/app/weitere-leistungen/page.tsx` | Новая страница |
| 18 | `src/data/weitere-leistungen.json` | Данные доп. услуг |
| 19 | `src/components/layout/WhatsAppButton.tsx` | Плавающая WhatsApp-кнопка |

### Что БЫЛО → Что СТАНЕТ

| Аспект | БЫЛО | СТАНЕТ |
|--------|------|--------|
| Город | Bielefeld, PLZ 33602 | Osnabrück und Umgebung (60 km Umkreis) |
| Телефон | +49 XXX XXXXXXX (заглушка) | 01523 9603175 (с флаера клиента) |
| Email | kontakt@rundumshaus-littawe.de | без изменений |
| --color-cream (#F3EDE2) | Warm Cream | #FFFFFF (Weiß) |
| --color-cream-dark (#E8E2D6) | Тёмный крем | ~#F0F4F8 (светлый серо-голубой) |
| --color-charcoal (#2A2A2A) | Deep Charcoal | ~#1B3A5C (тёмно-синий/navy) |
| --color-charcoal-light (#4A4A40) | Светлый уголь | ~#2D5A8C (средний синий) |
| --color-copper (#9B7B4E) | Aged Bronze | ~#4A8B3F (зелёный, акцент из лого) |
| --color-copper-light (#B89A6A) | Светлая бронза | ~#5AA84D (светлый зелёный) |
| --color-copper-dark (#7A6B58) | Тёмная бронза | ~#3A7030 (тёмный зелёный) |
| --color-sand (#A09A90) | Stone Gray | ~#6B7B8D (серо-синий) |
| Hardcoded rgba в Lamp | rgba(42,42,42,...) | rgba(27,58,92,...) |
| Hardcoded rgba в Spotlight | rgba(155,123,78,...) | rgba(74,139,63,...) |
| conic-gradient | #9B7B4E | ~#4A8B3F |
| ::selection bg | #9B7B4E → #F3EDE2 | ~#4A8B3F → #FFFFFF |
| Навигация | 4 пункта | 5 пунктов (+ Weitere Leistungen) |
| Страницы | 6 routes | 7 routes (+ /weitere-leistungen) |
| WhatsApp | нет | плавающая кнопка, fixed bottom-right |
| Телефон | текстовая ссылка tel: | кликабельная кнопка «Jetzt anrufen» |
| Aufsichtsbehörde | LDI NRW (Düsseldorf) | LfD Niedersachsen (Hannover) |

### Что может поплыть / сломаться

1. **Tailwind token names остаются** (`cream`, `charcoal`, `copper`, `sand`) — семантически неточны для новой палитры, но переименование = 20+ файлов. Решение: hex swap first, rename later (отдельная задача).
2. **Контраст (WCAG)** — новая палитра нужно проверить: белый текст на зелёном, тёмно-синий текст на белом. Navy #1B3A5C на белом = 8.5:1 (OK). Белый на зелёный #4A8B3F = ~3.5:1 (FAIL для мелкого текста → может потребоваться тёмный зелёный).
3. **Lamp/Hero glow** — бронзовое свечение → зелёное/синее свечение. Может выглядеть неестественно → нужна визуальная проверка.
4. **SVG лого** — линии были bronze/cream → станут green/white. Визуально проверить.
5. **OG Image** — IMG-17 (social share) содержит старые цвета. Нужна ли регенерация?
6. **CTA кнопка на флаере** — золотая (~#D4A843). Текущий copper = CTA-кнопки. Если copper → green, то CTA зелёные. Но на флаере CTA = gold. Возможно нужен отдельный токен `--color-gold` для CTA.
7. **AI-фото** — сгенерированы под bronze palette (тёмный дуб, brass). С новой палитрой blue/green могут не гармонировать. Визуальная проверка обязательна.

### Breakpoints

- Mobile 375 / Tablet 768 / Desktop 1440 — WhatsApp кнопка должна не перекрывать контент на mobile.
- Navbar: 5 пунктов вместо 4 → проверить overflow на tablet (768px).

### Навигация / Якоря / JS

- Navbar: добавить "Weitere Leistungen" → site.json navigation array.
- Все остальные якоря без изменений.
- GSAP/Lenis/ScrollTrigger: НЕ ЗАТРОНУТЫ (анимации привязаны к CSS-классам, не к hex).

### Тесты (обновить/написать)

- `data.test.ts` — обновить проверку phone, city, navigation length
- `smoke.test.tsx` — добавить /weitere-leistungen route
- `accessibility.test.tsx` — проверить новые WCAG контрасты
- Новый: тест для WhatsApp кнопки (рендерится, ссылка корректна)
- Новый: тест для /weitere-leistungen (рендерится, список услуг полный)

---

## Roadmap

### Wave 1: Данные и город (Data Layer)

1. Обновить `site.json`: address → Osnabrück, phone → `+49 1523 9603175`, navigation → добавить Weitere Leistungen
2. Обновить `homepage.json`: hero.subheading → "Osnabrück und Umgebung"
3. Обновить `layout.tsx`: meta descriptions, structured data (addressLocality, postalCode → 49074, areaServed, telephone)
4. Обновить `referenzen/page.tsx`: meta description
5. Обновить `datenschutz/page.tsx`: LDI NRW → LfD Niedersachsen (Prinzenstraße 5, 30159 Hannover, www.lfd.niedersachsen.de)

### Wave 2: Цветовая палитра

6. Обновить `globals.css` :root — все 8 переменных
7. Обновить `globals.css` @theme inline — все 8 переменных
8. Обновить `globals.css` moving-border-gradient hex
9. Обновить `globals.css` ::selection hex
10. Обновить `Lamp.tsx` rgba значения
11. Обновить `Spotlight.tsx` rgba значения
12. Обновить `ContactForm.tsx` inline style rgba (line 48, фон контактной формы)

### Wave 3: SVG / Favicon

13. Обновить `icon.svg` — заменить #2A2A2A → navy, #9B7B4E → green
14. Обновить `logo-icon.svg` — #9B7B4E → green
15. Обновить `logo-icon-dark.svg` — #F3EDE2 → white
16. Обновить `logo-full.svg` — #9B7B4E → green
17. Обновить `logo-full-dark.svg` — #F3EDE2 → white

### Wave 4: Новая страница «Weitere Leistungen»

18. Создать `src/data/weitere-leistungen.json` — список услуг (точно с флаера)
19. Создать `src/app/weitere-leistungen/page.tsx` — страница с галочками, без фото
20. Добавить route в `sitemap.ts`

### Wave 5: WhatsApp + Телефон

21. Создать `src/components/layout/WhatsAppButton.tsx` — fixed bottom-right, ссылка wa.me/4915239603175
22. Подключить WhatsAppButton в `layout.tsx` (внутри body, после Footer)
23. Обновить `ContactForm.tsx` — кнопка «Jetzt anrufen» + WhatsApp link в sidebar
24. Обновить `Footer.tsx` — кликабельный телефон (уже есть tel:), добавить WhatsApp link
25. Обновить `Hero.tsx` или homepage — добавить CTA с телефоном/WhatsApp (опционально, решает CEO)

### Wave 6: Контент «Warum wir?»

26. Добавить секцию «Warum wir?» в AboutSection или как отдельную секцию на главной (5 пунктов с флаера: Zuverlässig & Pünktlich, Saubere Arbeit, Faire Preise, Kurzfristige Termine, Alles aus einer Hand)

### Wave 7: Тесты + Build

27. Обновить `data.test.ts` — phone, city, navigation
28. Обновить `smoke.test.tsx` — добавить /weitere-leistungen
29. Написать тест для WhatsApp кнопки
30. Написать тест для /weitere-leistungen
31. Проверить WCAG контрасты новой палитры
32. `npm run build` — проверить что build проходит

### Wave 8: Визуальная проверка

33. Dev server → проверить все страницы desktop (1440)
34. Проверить mobile (375)
35. Проверить tablet (768)
36. Проверить Lamp/Hero glow с новыми цветами
37. Проверить AI-фото гармонию с новой палитрой

---

## Чеклист приёмки

- [ ] "Bielefeld" нигде не встречается в коде (grep = 0 results)
- [ ] "Osnabrück" в meta, OG, structured data, hero
- [ ] postalCode = 49074 (Osnabrück)
- [ ] Телефон 01523 9603175 кликабелен (tel:+4915239603175) на всех страницах
- [ ] Email kontakt@rundumshaus-littawe.de без изменений
- [ ] Все CSS-переменные обновлены (Blau/Grün/Weiß)
- [ ] 0 hardcoded старых hex (#9B7B4E, #F3EDE2, #2A2A2A в значении charcoal)
- [ ] SVG лого и favicon обновлены
- [ ] Страница /weitere-leistungen существует и содержит полный список
- [ ] /weitere-leistungen в навигации (Navbar + Footer)
- [ ] /weitere-leistungen в sitemap.ts
- [ ] WhatsApp кнопка: fixed, bottom-right, ссылка wa.me/4915239603175
- [ ] WhatsApp кнопка не перекрывает контент на mobile
- [ ] Секция «Warum wir?» на главной
- [ ] Datenschutz: LfD Niedersachsen (не NRW!)
- [ ] Structured data: areaServed = Osnabrück
- [ ] WCAG 4.5:1 для текста, 3:1 для крупного текста
- [ ] Все тесты pass
- [ ] Build clean
- [ ] Mobile 375 / Tablet 768 / Desktop 1440 — визуально ОК

---

## Закрытые вопросы

1. **CTA цвет:** Золотой (#D4A843) — как на флаере. Токен --color-gold добавлен. ✅
2. **AI-фото:** Не трогаем. ✅
3. **OG Image:** Не трогаем (нейтральное фото). ✅
4. **HEX:** Утверждены в docs/PALETTE_V2.md. ✅
5. **Телефон:** Единственный = 01523 9603175 (с флаера клиента). ✅
