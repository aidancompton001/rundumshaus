# T001 — Создание премиум-сайта RundumsHaus

**Дата:** 2026-04-14
**Версия:** v3 (wave-based, PH-proven, Landa-reviewed)
**Статус:** P0 — ждёт ОК CEO
**Ответственный:** #1 Viktor Hartmann (Product Architect)
**Размер:** XL
**Скилл:** writing-plans

---

## Цель

Премиальный сайт (уровень 3000€) для Rundum's Haus Littawe — 4 основные страницы + legal, 35 Awwwards-эффектов, mobile-first, Lighthouse 95+. Деплой GitHub Pages.

---

## Архитектурные решения

### Framework: Next.js 16.2.3 (SSG)

Решение на основе Provenly Homes (17 сессий production experience):
- `output: "export"` → pure static HTML/CSS/JS
- 10 copy-paste рецептов из PH
- 17 gotchas задокументированы и превентивно включены
- CI/CD pipeline copy-paste ready

### Дизайн: PH Warm Sand + Copper (временно)

CEO даст финальную палитру отдельно. До этого — дизайн-система PH:
- **Источник:** `C:\Projects\fr_02_Provenly Homes\site\src\`
- **Palette:** Cream #F5EDE3, Charcoal #3A3A3A, Copper #B87333, Sand #B8A48E
- **Fonts:** Lora (heading) + Plus Jakarta Sans (body) via `next/font`
- **Стиль:** Hybrid — 70% light cream / 30% dark charcoal (Hero, CTA, Footer)
- Переключение палитры = замена hex в `@theme inline` + CSS variables (1 файл)

### Premium эффекты: Aceternity UI + GSAP + Lenis

| Компонент | Источник | Секция | Почему топ |
|----------|---------|--------|-----------|
| **Lamp Effect** | Aceternity UI | Hero | Драматичное освещение, Awwwards-level |
| **Spotlight** | Aceternity UI | Hero | Cursor-following light, premium feel |
| **3D Card Effect** | Aceternity UI | Leistungen | Perspective tilt, дорогой look |
| **Moving Border** | Aceternity UI | CTA buttons | Animated conic-gradient border |
| **SplitText chars** | GSAP (free) | Hero heading | Character-by-character reveal |
| **ScrollTrigger** | GSAP (free) | All sections | Scroll-linked animations |
| **Lenis** | npm | Global | Butter-smooth scroll |
| **Glassmorphism** | CSS (Tailwind) | Cards | backdrop-blur + transparency |

Полная карта: [DESIGN_MAP.md](../DESIGN_MAP.md) — 35 эффектов.

### Источники кода (конкретные пути)

| Источник | Путь / URL | Что копируем |
|----------|-----------|-------------|
| **Provenly Homes** | `C:\Projects\fr_02_Provenly Homes\site\src\` | MotionProvider, ScrollReveal, Stagger, Parallax, useSplitText, useIsMobile, getImageUrl, formsubmit, seo, animations.ts, deploy.yml |
| **Aceternity UI** | `ui.aceternity.com` | Lamp, Spotlight, 3D Card, Moving Border (copy-paste код) |
| **React Bits** | `reactbits.dev` | Text animations (заглушка — конкретные компоненты подберём при сборке) |
| **CREATIVE_TOOLKIT** | `C:\Projects\MainCore\core\CREATIVE_TOOLKIT.md` | Decision tree для каждого эффекта |
| **Animation Techniques** | Obsidian `02_Knowledge/Animation Techniques.md` | Code snippets GSAP, glassmorphism, parallax |
| **Visual Effects CSS** | Obsidian `02_Knowledge/Visual Effects CSS.md` | Dark Glassmorphism Tailwind classes |
| **Website Mistakes** | Obsidian `02_Knowledge/Website Mistakes.md` | 33 ошибки → превентивный чеклист |
| **Website Playbook** | Obsidian `02_Knowledge/Website Building Playbook.md` | Порядок фаз, правила |

### Железные запреты

| Запрет | Причина | Источник |
|--------|---------|---------|
| **next/image** | Не добавляет basePath на GH Pages с unoptimized | Website Mistakes #4 |
| **var() в @theme** | Breaks Tailwind v4 static compilation | PH Gotcha G1 |
| **display:none honeypot** | Боты обходят | PH Gotcha G3 |
| **Node 24 в CI** | Нет на ubuntu-latest | PH Gotcha G2 |
| **Hardcoded strings** | Все данные из JSON | PH правило |
| **Стабы как "done"** | Deliverable = данные на экране + тест | PH Crisis #1 |

---

## Obsidian структура (создаётся в Wave 1)

```
01_Projects/RundumsHaus/                  ← папка (как Provenly Homes)
├── Stack and Versions.md                 ← deps, configs, scripts
├── Design and Branding.md                ← palette, typography, WCAG, buttons
├── Components.md                         ← все компоненты: props, data, animations
├── Awwwards Effects.md                   ← 35 эффектов (зеркало DESIGN_MAP)
├── Integration Recipes.md                ← copy-paste код для ключевых интеграций
├── Gotchas and Solutions.md              ← проблемы и решения по ходу
├── CI-CD and Deploy.md                   ← pipeline, GH Pages, DNS
├── SEO and Legal.md                      ← Schema.org, GDPR, Impressum
├── Site Content.md                       ← JSON data, types, content
├── Development Timeline.md               ← все сессии хронологически
├── Tasks and Roadmap.md                  ← T001 статус, волны
├── Blueprint — How to Replicate.md       ← step-by-step для повторения
01_Projects/RundumsHaus.md                ← hub note (обновить)
```

---

## ROADMAP — ВОЛНЫ ПО 5 ШАГОВ

> После каждой волны: `npm run test` + `npm run build` + доказательство
> Если волна не прошла тесты → НЕ ПЕРЕХОДИТЬ к следующей

---

### WAVE 1: SCAFFOLD (проект + конфиги)

| # | Шаг | Файл | Критерий |
|---|-----|------|---------|
| 1 | `npx create-next-app@16 site --ts --app --tailwind --eslint` | `site/` | Папка создана |
| 2 | `npm install gsap lenis motion` + dev deps (vitest, testing-library, jsdom) | `package.json` | 6 prod + 8 dev deps |
| 3 | `next.config.ts`: output:export, basePath conditional, images:unoptimized, trailingSlash | `next.config.ts` | Build passes |
| 4 | `postcss.config.mjs` + `globals.css`: @import tailwindcss, @theme inline (PH palette temp), Lenis CSS, reduced-motion CSS | `postcss.config.mjs`, `globals.css` | Tailwind classes work |
| 5 | `layout.tsx`: fonts (Lora + Plus Jakarta Sans via next/font), lang="de", MotionProvider shell | `layout.tsx` | Dev server shows styled page |

**Тест волны:**
```bash
npm run build     # Exit 0, no errors
npm run dev       # Page loads with correct fonts
npm run test      # Smoke test: app renders
```

**Obsidian:** Создать hub + `Stack and Versions.md` (записать exact deps)

---

### WAVE 2: MOTION FOUNDATION

| # | Шаг | Файл | Критерий |
|---|-----|------|---------|
| 6 | **MotionProvider.tsx**: Lenis init + GSAP ticker sync + useSyncExternalStore reduced-motion | `components/motion/MotionProvider.tsx` | Smooth scroll works |
| 7 | **ScrollReveal.tsx**: GSAP scroll-triggered reveal (direction, delay, duration props) | `components/motion/ScrollReveal.tsx` | Elements fade-in on scroll |
| 8 | **Stagger.tsx**: dual-mode (GSAP scroll / Motion mount), staggerDelay prop | `components/motion/Stagger.tsx` | Children stagger in sequence |
| 9 | **Parallax.tsx**: scroll-linked Y-axis parallax (speed prop) | `components/motion/Parallax.tsx` | Element moves slower than scroll |
| 10 | **useSplitText.ts** + **useIsMobile.ts**: hooks from PH recipes | `hooks/` | Hooks importable, types correct |

**Тест волны:**
```bash
npm run test      # Motion components render without errors
npm run build     # Clean exit
# Manual: dev server → scroll → elements animate
```

**Obsidian:** Записать в `Integration Recipes.md` (Recipe 1-3 из PH)

---

### WAVE 3: DATA LAYER + TYPES

| # | Шаг | Файл | Критерий |
|---|-----|------|---------|
| 11 | **types.ts**: SiteConfig, Service, ContactFormField, Referenz, HomepageData | `data/types.ts` | TypeScript compiles |
| 12 | **site.json**: Rundum's Haus Littawe, Kevin Littawe, address, phone, email, nav, footer | `data/site.json` | All company fields filled |
| 13 | **homepage.json**: hero (heading, subheading, CTAs), über-uns, stats | `data/homepage.json` | Hero + about data present |
| 14 | **services.json**: 5 услуг (тексты клиента), id, title, description, icon | `data/services.json` | 5 services, all fields |
| 15 | **contact-form.json** + **referenzen.json**: form fields + empty referenzen array + beispiel | `data/` | JSON valid, types match |

**Тест волны:**
```bash
npm run test      # Data integrity: 5 services, required fields, valid JSON
npm run build     # TypeScript compiles with strict mode
```

**Obsidian:** Записать в `Site Content.md` (все JSON, types, data flow)

---

### WAVE 4: LAYOUT SHELL

| # | Шаг | Файл | Критерий |
|---|-----|------|---------|
| 16 | **Navbar.tsx**: sticky, backdrop-blur, 4 nav links from site.json, CTA button, mobile burger (44px target) | `components/layout/Navbar.tsx` | Nav renders, burger toggles |
| 17 | **Footer.tsx**: company info from site.json, nav links, legal links, copyright | `components/layout/Footer.tsx` | Footer renders with data |
| 18 | **CookieBanner.tsx**: TTDSG compliant, localStorage, Motion slide-up | `components/layout/CookieBanner.tsx` | Shows on first visit, persists |
| 19 | **lib/getImageUrl.ts** + **lib/seo.ts** + **lib/formsubmit.ts** + **lib/animations.ts** | `lib/` | Helpers importable |
| 20 | **6 page shells**: index, leistungen, referenzen, kontakt, impressum, datenschutz + not-found | `app/*/page.tsx` | All routes load without error |

**Тест волны:**
```bash
npm run test      # Navbar renders nav from site.json, Footer renders company data
npm run build     # 8 routes generate
# Manual: all pages load, burger works, links navigate
```

**Obsidian:** Записать в `Components.md` (Layout section)

---

### WAVE 5: LEGAL + SEO BASE

| # | Шаг | Файл | Критерий |
|---|-----|------|---------|
| 21 | **Impressum page**: Kevin Littawe full data + EU ODR link (Art. 14) | `app/impressum/page.tsx` | Legal data renders, ODR present |
| 22 | **Datenschutz page**: GDPR Art. 15-21 Betroffenenrechte, Art. 77, hosting (GH Pages), FormSubmit.co, SSL, storage duration | `app/datenschutz/page.tsx` | All GDPR articles listed |
| 23 | **Schema.org JSON-LD**: LocalBusiness (Bielefeld) + 5× Service | `layout.tsx` | JSON-LD in page source |
| 24 | **sitemap.ts** + **robots.ts** (both with `force-static`) | `app/sitemap.ts`, `app/robots.ts` | Sitemap generates, robots valid |
| 25 | **UI primitives**: Button (3 variants), Card (glassmorphism), Container (max-w-7xl), Accordion | `components/ui/` | Components render, props work |

**Тест волны:**
```bash
npm run test      # Legal pages contain GDPR articles, Schema.org valid JSON
npm run build     # sitemap + robots generate
# Manual: /impressum, /datenschutz render correctly
```

**Obsidian:** Записать в `SEO and Legal.md` + `Components.md` (UI section)

---

### WAVE 6: HERO SECTION (Awwwards)

> **Landa F1:** Перед вставкой Aceternity — audit каждого компонента: заменить hardcoded hex на tokens, убедиться Motion ≠ scroll, тестировать изолированно.
> **Landa F2:** Research.md должен быть заполнен ДО этой волны (конкуренты + аудитория).

| # | Шаг | Файл | Критерий |
|---|-----|------|---------|
| 26 | **Aceternity audit**: скопировать Lamp, Spotlight, 3DCard, MovingBorder → заменить hardcoded hex → проверить что Motion НЕ для scroll → изолированный тест каждого | `components/aceternity/` | Все 4 компонента рендерятся изолированно, 0 hardcoded colors |
| 27 | **Hero.tsx**: fullscreen, AI-фото bg, heading + subheading from homepage.json, 2× CTA | `components/sections/Hero.tsx` | Hero renders with JSON data |
| 28 | **Lamp Effect + SplitText**: Lamp над heading, SplitText chars (yPercent:150, power3.out, stagger 0.03), FOUC prevention (opacity:0) | Hero.tsx | Lamp + chars animate |
| 29 | **Spotlight + Parallax bg**: cursor gradient (desktop only), bg image scrub parallax | Hero.tsx | Spotlight follows cursor, parallax on scroll |
| 30 | **Moving Border CTA + scroll indicator**: animated conic-gradient on primary CTA, bounce arrow | Hero.tsx | CTA border rotates, arrow bounces |

**Тест волны:**
```bash
npm run test      # Hero renders heading from homepage.json, CTA buttons present
npm run build     # Clean exit
# Manual: Hero visible, SplitText animates, Lamp glows, Spotlight follows cursor, Moving Border rotates
# Mobile: SplitText → simple fade, Spotlight → disabled, Lamp → simplified
```

**Obsidian:** Записать в `Awwwards Effects.md` (items 4-10) + `Components.md` (Hero)

---

### WAVE 7: SERVICES (Leistungen)

| # | Шаг | Файл | Критерий |
|---|-----|------|---------|
| 31 | **ServiceOverview.tsx**: homepage grid, 5 services from services.json, icon + title + short desc, link to /leistungen | `components/sections/ServiceOverview.tsx` | 5 services render from JSON |
| 32 | **ServiceDetail.tsx**: detailed card, glassmorphism (backdrop-blur-2xl + border-white/[0.08]), full description | `components/sections/ServiceDetail.tsx` | Card renders with full data |
| 33 | **3D Card Effect** (Aceternity UI): perspective tilt on service cards, translateZ layers | `components/aceternity/3d-card.tsx` | Cards tilt on hover |
| 34 | **Stagger + ScrollReveal** on service grid: cards appear 0.12s intervals | leistungen/page.tsx | Cards stagger in on scroll |
| 35 | **AboutSection.tsx**: Über-uns block on homepage, image + text, counter animation | `components/sections/AboutSection.tsx` | Section renders, counter counts up |

**Тест волны:**
```bash
npm run test      # 5 services render from JSON, all fields present
npm run build     # /leistungen generates
# Manual: cards tilt on hover (desktop), stagger on scroll, glassmorphism visible
# Mobile: 3D tilt → simple hover lift
```

**Obsidian:** Записать в `Components.md` (Sections) + `Awwwards Effects.md` (items 14-19)

---

### WAVE 8: REFERENZEN + KONTAKT

| # | Шаг | Файл | Критерий |
|---|-----|------|---------|
| 36 | **BeforeAfter.tsx**: vorher/nachher slider — `input[type=range]` как контроллер + `clip-path: inset(0 X% 0 0)` (accessible, keyboard, touch) [Landa F3] | `components/sections/BeforeAfter.tsx` | Slider drags, keyboard works, images compare |
| 37 | **referenzen/page.tsx**: grid from referenzen.json, empty state "Bald verfügbar", image hover zoom. **Механизм наполнения [Landa F5]:** клиент шлёт фото CEO → CEO/dev добавляет в JSON + public/images/referenzen/ | `app/referenzen/page.tsx` | Page renders, empty state shows |
| 38 | **ContactForm.tsx**: FormSubmit.co AJAX, honeypot (left-[-9999px]!), GDPR checkbox, 4 states (idle/submitting/success/error) | `components/sections/ContactForm.tsx` | Form renders all fields |
| 39 | **Floating labels**: Tailwind `peer` pattern, `placeholder=" "` | ContactForm.tsx | Labels float on focus |
| 40 | **kontakt/page.tsx**: form + company info (phone, email from site.json) + stagger reveal | `app/kontakt/page.tsx` | Page renders, form fields from JSON |

**Тест волны:**
```bash
npm run test      # ContactForm renders fields from contact-form.json, honeypot present + off-screen
npm run build     # /referenzen, /kontakt generate
# Manual: slider drags, form validates, floating labels work, success state shows
# REAL TEST: submit form → email arrives at configured address
```

**Obsidian:** Записать в `Components.md` (Referenzen, Kontakt) + `Awwwards Effects.md` (items 20-28)

---

### WAVE 9: ANIMATIONS POLISH

| # | Шаг | Файл | Критерий |
|---|-----|------|---------|
| 41 | **Floating Navbar**: GSAP hide on scroll-down, reveal on scroll-up (y:-100→0, 0.3s) | Navbar.tsx | Navbar hides/reveals |
| 42 | **Section bg alternation**: cream/cream-dark rhythm across all pages | All pages | Visual rhythm consistent |
| 43 | **All ScrollReveal/Stagger wiring**: every section on every page gets scroll-triggered animations | All pages | Every section animates on scroll |
| 44 | **prefers-reduced-motion**: verify ALL 35 effects have fallback (instant show / disabled) | All components | No animation in reduced-motion |
| 45 | **Mobile verification**: verify useIsMobile() disables SplitText, Spotlight, 3D Tilt, Lamp, Parallax | All components | Mobile = simplified, no jank |

**Тест волны:**
```bash
npm run test      # Reduced-motion: components render in both states
npm run build     # Clean exit
# Manual: scroll ALL pages → every section animates correctly
# Manual: resize to 375px → no complex effects
# Manual: enable reduced-motion in OS → no animations
```

**Obsidian:** Записать в `Awwwards Effects.md` (items 29-35, final audit) + `Gotchas and Solutions.md`

---

### WAVE 10: QA + LANDA AUDIT

| # | Шаг | Файл | Критерий |
|---|-----|------|---------|
| 46 | **Content proof**: 0 stubs, 0 TODO, 0 placeholder, 0 English text (`grep -ri "click here\|learn more\|submit\|loading\|error\|success" src/`), 0 hardcoded strings [Landa F6] | All files | grep returns 0 |
| 47 | **Mobile 375px**: all 8 pages, burger, form, slider | — | No overflow, no broken layout |
| 48 | **Tablet 768px + Desktop 1440px**: all pages | — | Grid correct, whitespace correct |
| 49 | **Lighthouse**: Performance ≥95, Accessibility ≥90, SEO ≥95 | — | Scores meet targets |
| 50 | **#14 Landa audit**: GDPR (Betroffenenrechte, ODR), accessibility (skip-link, aria, contrast), performance (render-blocking, CLS), stubs check, DESIGN_MAP verification | — | All CRITICAL items fixed |

**Тест волны:**
```bash
npm run test      # ALL tests pass (target: ≥30)
npm run build     # 0 errors, 0 warnings (except known lint)
npm run lint      # 0 errors
# Lighthouse CLI or DevTools → screenshot scores
# Landa report: no CRITICAL items remaining
```

**Obsidian:** Обновить `Development Timeline.md`, `Tasks and Roadmap.md`

---

### WAVE 11: DEPLOY + PRODUCTION

| # | Шаг | Файл | Критерий |
|---|-----|------|---------|
| 51 | **deploy.yml**: GitHub Actions (Node 22, lint→test→build→.nojekyll→deploy) | `.github/workflows/deploy.yml` | Pipeline passes |
| 52 | **Push to main → GitHub Pages deploy** | — | CI green |
| 53 | **Production smoke test**: CSS loads, images visible, nav works, mobile 375px, form submits, cookie banner, HTTPS | — | All checklist items ✅ |
| 54 | **DNS preparation**: CNAME instruction for IONOS (rundumshaus-littawe.de → github.io) | `docs/DNS_INSTRUCTIONS.md` | Instructions written |
| 55 | **Final: remove basePath after DNS** (documented as CEO action) | — | Documented, not executed |

**Тест волны:**
```bash
# Production URL accessible
# Form email arrives
# All pages load on production
# Mobile responsive on real device
```

**Obsidian:** Записать в `CI-CD and Deploy.md`, обновить hub, записать `Blueprint — How to Replicate.md`

---

## Чеклист приёмки (финальный)

### Функционал
- [ ] 8 routes: index, leistungen, referenzen, kontakt, impressum, datenschutz, 404, sitemap
- [ ] Navbar: desktop links + mobile burger (44px) + floating hide/reveal
- [ ] FormSubmit.co: email доходит, honeypot off-screen, GDPR checkbox
- [ ] Referenzen: grid + empty state + BeforeAfter slider
- [ ] Cookie banner: TTDSG, localStorage persist

### Дизайн (35 эффектов из DESIGN_MAP)
- [ ] Lamp Effect (Hero)
- [ ] Spotlight cursor (Hero, desktop only)
- [ ] SplitText chars (Hero heading)
- [ ] Text Generate (Hero subheading)
- [ ] Moving Border (CTA buttons)
- [ ] 3D Card Tilt (Leistungen, desktop only)
- [ ] Glassmorphism cards (all cards)
- [ ] Parallax (Hero bg)
- [ ] ScrollReveal all sections
- [ ] Stagger all grids
- [ ] Counter animation (stats)
- [ ] Floating labels (form)
- [ ] Before/After slider (Referenzen)
- [ ] Lenis smooth scroll (global)
- [ ] prefers-reduced-motion ALL disabled

### Качество
- [ ] Lighthouse Performance ≥ 95
- [ ] Lighthouse Accessibility ≥ 90
- [ ] Lighthouse SEO ≥ 95
- [ ] 0 console errors
- [ ] 0 broken links
- [ ] 0 stubs / 0 TODO / 0 placeholder
- [ ] 0 hardcoded strings (all from JSON)
- [ ] lang="de" everywhere
- [ ] WCAG AA: all combos checked
- [ ] NO next/image anywhere (only `<img>` + getImageUrl)

### Legal (GDPR)
- [ ] Impressum: full data + EU ODR link
- [ ] Datenschutz: Art. 15-21, Art. 77, storage, SSL
- [ ] Google Fonts: local only (next/font)
- [ ] Schema.org LocalBusiness + 5× Service

### Deploy
- [ ] GitHub Pages live
- [ ] .nojekyll present
- [ ] CI pipeline: lint → test → build → deploy
- [ ] CNAME instruction for IONOS

### Obsidian Knowledge Base
- [ ] Hub note updated
- [ ] 12 satellite notes created and filled
- [ ] Every wave documented in Development Timeline

---

## Зависимости

```
Wave 1 (scaffold) → Wave 2 (motion) → Wave 3 (data)
                                            ↓
                                    Wave 4 (layout) → Wave 5 (legal)
                                            ↓
                                    Wave 6 (hero) ──────┐
                                    Wave 7 (services) ──┤→ Wave 9 (polish) → Wave 10 (QA) → Wave 11 (deploy)
                                    Wave 8 (ref+kontakt)┘
```

**Параллелизм [Landa F4]:** Wave 6 создаёт Aceternity components → Wave 7 ЖДЁТ Wave 6 (нужен 3DCard). Wave 8 может параллелиться с Wave 7.
```
Wave 6 (hero+aceternity) → Wave 7 (services, uses 3DCard)
Wave 6 ─────────────���────→ Wave 8 (ref+kontakt, independent)
```
