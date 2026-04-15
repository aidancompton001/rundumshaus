# DEVLOG — RundumsHaus

---

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
- CEO решение: Next.js 16 vs Astro
- CEO ОК на T001 v2
- Фаза 1: Scaffold

---

### [S003] — 2026-04-14 — T001 v3: wave-based roadmap + DESIGN_MAP + Landa review

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
- CEO ОК на T001 v3
- CEO даёт палитру
- Wave 1: Scaffold
