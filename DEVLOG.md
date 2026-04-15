# DEVLOG — RundumsHaus

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
