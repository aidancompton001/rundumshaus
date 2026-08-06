# T004 — Performance, Accessibility & Image Optimization (PX-019)

**Дата:** 2026-04-21
**Статус:** roadmap (ожидает OK от CEO)
**PX:** PX-019
**Ответственный:** #3 Marco Reiter (Frontend) + #2 Lena Schwarz (UX/UI — a11y/contrast)
**Скилл:** `writing-plans` + `verification-before-completion` на верификации
**Размер:** L (4 волны × несколько шагов, ~87 MB изображений, 8 компонентов с `<img>`)

---

## 1. Текущие числа (baseline)

### Lighthouse Mobile (бенчмарк сейчас)
| Метрика | Значение | Цель |
|---------|----------|------|
| Performance | 69/100 | ≥ 90 |
| Accessibility | 92/100 | ≥ 98 |
| Best Practices | 100/100 | 100 |
| SEO | 100/100 | 100 |
| LCP | **9.3s** 🔴 | < 2.5s |
| FCP | 1.0s ✅ | < 1.8s |
| TBT | 130ms ✅ | < 200ms |
| CLS | 0 ✅ | < 0.1 |
| Speed Index | 5.6s | < 3.4s |

### Lighthouse Desktop
| Метрика | Значение |
|---------|----------|
| Performance | 94/100 ✅ |
| LCP | 1.6s ✅ |

### Изображения (total 86.1 MB в `site/public/images/`)
| Файл | Размер | WebP | Выше fold |
|------|--------|------|-----------|
| `services/detail-garten.png` | 9 870 KB | нет | — |
| `referenzen/garten-vorher-nachher.png` | 9 038 KB | нет | — |
| `services/detail-hausmeister.png` | 7 510 KB | нет | — |
| `referenzen/dach-vorher-nachher.png` | 7 362 KB | нет | — |
| `kontakt/contact-bg.png` | 7 250 KB | нет | — |
| `services/detail-dach.png` | 6 729 KB | нет | — |
| `referenzen/entruempelung-vorher-nachher.png` | 6 370 KB | нет | — |
| `services/detail-schrott.png` | 6 200 KB | нет | — |
| `services/detail-entruempelung.png` | 5 970 KB | нет | — |
| `services/hausmeisterservice.png` | 5 783 KB | **287 KB есть, не используется** | — |
| `og-image.png` | 5 757 KB | нет (для шаринга) | — |
| `services/schrottabholung.png` | 5 753 KB | нет | — |
| `about.png` | **1 444 KB** | нет | ✅ **LCP candidate** |
| `hero/hero-bg.png` | 1 266 KB | **192 KB есть, не используется** | ✅ |
| `services/gartenpflege.png` | 1 122 KB | **254 KB есть, не используется** | — |
| `services/dacharbeiten.jpg` | 1 064 KB | нет | — |
| `services/entruempelung.jpg` | 965 KB | нет | — |

**Итого:** 86.1 MB в папке, homepage загружает ~17 MB при одном открытии.

---

## 2. Файлы с `<img>` (ВСЕ затронутые)

| Файл | Элемент | LCP? |
|------|---------|------|
| `site/src/components/layout/Navbar.tsx:51` | logo (68 KB, OK) | — |
| `site/src/components/layout/Footer.tsx:16` | logo (68 KB, OK) | — |
| `site/src/components/sections/AboutSection.tsx:81` | `about.png` | **✅ LCP кандидат #1** |
| `site/src/components/sections/ServiceOverview.tsx:41` | `services/*.png` | ✅ fold на mobile |
| `site/src/components/sections/ServiceDetail.tsx:36` | `detail-*.png` (7-10 MB каждый!) | — |
| `site/src/components/sections/BeforeAfter.tsx:31,45` | `vorher-nachher.png` (6-9 MB!) | — |
| `site/src/components/sections/ReferenzenContent.tsx:40` | `referenzen/*.png` | — |

**Дополнительно:**
- `site/src/components/sections/Hero.tsx` — использует `<Lamp>` + CSS background? Читать для уверенности
- `site/src/app/layout.tsx:34` — `og-image.png` в OG meta (5.5 MB — тормозит шаринг)

**Утилита:** `site/src/lib/getImageUrl.ts` — `getImageUrl(path)` (оборачивает basePath, сейчас пустой). Для `<picture>` подхода нужен новый helper `getResponsiveImage(base, widths)`.

---

## 3. Accessibility — конкретные failures (Lighthouse)

### Prohibited ARIA (score=0)
- **Элемент:** `<p aria-label="...">` в Hero — `p.font-body text-lg sm:text-xl text-cream/70`
- **Причина:** `<p>` не поддерживает `aria-label`. Только интерактивные элементы / изображения.
- **Файл:** вероятно `site/src/components/sections/Hero.tsx` или стаггер из `homepage.json` → subheading

### Color Contrast (score=0) — 3 элемента
1. **Gold CTA (`bg-gold`):** кнопка "Kostenlos anfragen" — `span.relative z-10 bg-gold` с белым текстом → контраст #D4A843 / white = **~1.89:1** (требуется 4.5:1 для AA)
2. **Footer text:** `text-cream/50` на `bg-charcoal` → слишком прозрачный
3. **CookieBanner button:** `bg-copper hover:bg-copper-light text-white` — нужно проверить копер/white

---

## 4. Последствия (что БЫЛО → что СТАНЕТ)

### Изменения в файлах
| Файл | Было | Станет |
|------|------|--------|
| `site/public/images/*` | только PNG/JPG | + .webp для каждого + responsive варианты (400w/800w/1200w) для above-the-fold |
| `site/public/images/og-image.png` | 5.5 MB PNG | og-image.jpg 1200×630 qual 85, ~300 KB |
| `site/public/images/services/detail-*.png` | 6-10 MB | .webp ≤ 500 KB (resize до max 1600w) |
| `AboutSection.tsx` | `<img src=about.png>` | `<picture>` с WebP source + responsive srcSet, `fetchpriority="high"` `loading="eager"` |
| `ServiceOverview.tsx`, `ServiceDetail.tsx`, `BeforeAfter.tsx`, `ReferenzenContent.tsx` | `<img>` | `<picture>` с WebP source + `loading="lazy"` `decoding="async"` |
| `Hero.tsx` | (проверить — если есть bg-image) | preload hero-bg.webp, responsive |
| `layout.tsx` | preload только logo-client | + preload about.webp (LCP candidate, 400w + 800w + 1200w) |
| `lib/getImageUrl.ts` | возвращает path | + новый helper `getPictureSources(base)` |
| `.pages.yml` | нет правила на формат | (не трогаем, Kevin оставляет .png — конвертация в CI step **за рамками этой задачи**) |

### Что может сломаться
- **basePath** сейчас пустой, но утилита `getImageUrl` его учитывает — `<picture>` должен использовать её же
- **Tests:** 4 теста ищут `<img alt="...">` — должны продолжать работать (`<picture>` содержит `<img>` внутри)
- **Snapshot tests:** нет
- **SEO:** OG image смена — обновить URL в `layout.tsx` (og-image.jpg вместо .png)
- **CMS upload:** Kevin может загрузить новый PNG через Pages CMS — без auto-конвертации он будет несжатым. Инструкция: обновить ANLEITUNG_KEVIN с рекомендацией "до 2 MB"

### Breakpoints (Tailwind)
- **375px mobile:** `srcSet` 400w подтянется через `sizes="(max-width: 768px) 100vw, 50vw"`
- **768px tablet:** 800w
- **1440px desktop:** 1200w
- **2560px 4K:** 1600w (если нужно, иначе 1200w достаточно)

### Анимации / JS
- **Lenis/GSAP/motion:** не затронуты
- **IntersectionObserver (для lazy reveal):** `<picture>` совместим
- **Lamp/Spotlight:** CSS-only эффекты, без изменений

### Тесты
- **layout.test.tsx:** проверяет `getByAltText` — работает с `<picture>` (alt на `<img>` внутри)
- **services.test.tsx:** 0 emoji + dual-tone SVG — не затронуто
- **accessibility.test.tsx:** читать, если есть WCAG проверка контраста
- **Новые тесты:**
  - `picture-sources.test.tsx` — рендерит `<picture>` с WebP + fallback
  - `a11y.test.tsx` — проверяет что `<p>` не имеет aria-label
  - `perf.test.ts` — проверяет что preload hints есть в layout.tsx

---

## 5. Roadmap (4 волны)

### Wave 1 — Image conversion (CLI через sharp, одноразово)
1. Установить `sharp` как devDependency (`npm i -D sharp`)
2. Создать `scripts/optimize-images.mjs` — node-скрипт, читает `site/public/images/**`, генерирует:
   - `.webp` (quality 80) для каждого .png/.jpg
   - `-400w.webp`, `-800w.webp`, `-1200w.webp` для above-the-fold (hero-bg, about, services/*)
   - Resize больших detail-* и referenzen до max 1600w → `.webp` quality 80
3. Запустить скрипт локально: `node scripts/optimize-images.mjs`
4. Создать новый `og-image.jpg` (1200×630, quality 85) вместо 5.5 MB PNG
5. Коммит: `feat(images): webp conversion + responsive variants`
6. **Verify:** `du -sh site/public/images/` показывает < 20 MB

### Wave 2 — Code changes (`<picture>`)
7. Обновить `lib/getImageUrl.ts`: добавить `getPictureSources(basePath, widths?)`
8. `AboutSection.tsx`: заменить `<img>` на `<picture>`: WebP srcSet (400w, 800w, 1200w) + fallback PNG, `loading="eager"`, `fetchpriority="high"`, `decoding="sync"`, `width/height`
9. `layout.tsx`: добавить preload для `about-800w.webp` (LCP candidate) с `<link rel="preload" as="image" imagesrcset="..." imagesizes="...">`
10. `layout.tsx`: OG image → `og-image.jpg`
11. `Hero.tsx`: если есть bg-image — перевести на WebP + preload
12. `ServiceOverview.tsx`: `<picture>` + lazy для всех 5 сервисов
13. `ServiceDetail.tsx`: `<picture>` + lazy
14. `BeforeAfter.tsx`: `<picture>` + lazy для before/after
15. `ReferenzenContent.tsx`: `<picture>` + lazy
16. Build check: `npm run build` — out/ генерируется без ошибок
17. Коммит: `feat(images): <picture> with webp srcset + preload LCP`

### Wave 3 — Accessibility
18. Найти `<p aria-label=...>` в Hero.tsx → убрать aria-label (или перенести на `<h1>`/container)
19. CTA `bg-gold` с white text — заменить на dark navy text или потемнить gold:
    - Вариант A: `text-charcoal` на `bg-gold` (#1B3A5C / #D4A843 = ~6:1 ✅)
    - Вариант B: оставить white, но сменить bg на `bg-green` (#4A8B3F / white = ~4.9:1 ✅)
    - **Рекомендация:** Вариант A — соответствует флаеру (gold + dark text)
20. Footer `text-cream/50` → `text-cream/70` или `text-cream/80` (проверить WCAG calc)
21. CookieBanner `bg-copper` — проверить контраст white на copper; если < 4.5, заменить на `bg-charcoal` или потемнить copper
22. Обновить тесты контраста, если есть
23. Коммит: `fix(a11y): remove prohibited aria-label + fix color contrast`

### Wave 4 — JS bundle cleanup
24. Установить `@next/bundle-analyzer` (devDep), обновить `next.config.ts` с `withBundleAnalyzer`
25. `ANALYZE=true npm run build` — посмотреть отчёт
26. Найти крупные модули без необходимости (framer-motion если не везде используется, иконки imported non-tree-shakable)
27. Dynamic import для `ContactForm` (страница Kontakt — не критична на Startseite bundle)
28. Dynamic import для `CookieBanner` — уже "use client", но можно `next/dynamic` с `ssr: false`
29. Build и сравнить out size до/после
30. Коммит: `perf(bundle): dynamic imports for below-fold components`

### Wave 5 — Verification
31. Запустить `npm run test` → 104+ pass
32. Запустить `npm run build` → нет ошибок
33. Push → ждать GitHub Actions green
34. Lighthouse mobile на live домене:
    - Performance ≥ 90
    - Accessibility ≥ 98
    - LCP < 2.5s
35. Lighthouse desktop: Performance ≥ 95
36. DevTools Network: homepage total ≤ 3 MB
37. Тест шаринга в WhatsApp (или `curl -I og-image`) — новый размер
38. Запись DEVLOG (S023) + STATUS + Obsidian
39. Commit: `docs(devlog): T004 PX-019 performance optimization complete`

---

## 6. Чеклист приёмки

### Перформанс
- [ ] Lighthouse mobile Performance ≥ 90
- [ ] Lighthouse mobile LCP < 2.5s
- [ ] Lighthouse desktop Performance ≥ 95
- [ ] Homepage total payload (DevTools Network) < 3 MB
- [ ] Все 9 detail-*.png resized до < 500 KB (WebP)
- [ ] og-image.jpg < 500 KB

### Accessibility
- [ ] Lighthouse Accessibility ≥ 98
- [ ] 0 Prohibited ARIA warnings
- [ ] 0 Color Contrast failures (gold CTA, footer text, cookie button)

### Код
- [ ] Все 7 компонентов с `<img>` используют `<picture>` с WebP source
- [ ] LCP candidate (about) имеет `fetchpriority="high"` + `loading="eager"` + preload в layout
- [ ] Остальные `<img>` имеют `loading="lazy"` + `decoding="async"`
- [ ] 104+ тестов pass
- [ ] Build OK, CI green, deploy live

### Не сломано
- [ ] Все страницы рендерятся на 375/768/1440
- [ ] Referenzen slider (BeforeAfter) работает
- [ ] WhatsApp-кнопка, CookieBanner — функционируют
- [ ] Pages CMS upload продолжает работать
- [ ] basePath utility не сломана

---

## 7. Риски

| # | Риск | Митигация |
|---|------|-----------|
| 1 | Sharp не собирается на Windows (native binaries) | Использовать `sharp` pre-built binaries или `@squoosh/cli` альтернатива |
| 2 | `<picture>` в тестах ломает existing alt-checks | Тесты ищут alt на `<img>` — работает (picture содержит img) |
| 3 | Gold CTA text change = визуальное изменение | CEO утвердил gold в T002 — согласовать вариант A (dark text) перед коммитом |
| 4 | Kevin загрузит новый PNG через CMS без конвертации | Отдельная задача: CI step с sharp-конвертацией (вне скоупа T004) |
| 5 | basePath изменится (например repo transfer) | `getImageUrl` уже централизованно |

---

**Roadmap готов, жду ОК.**
