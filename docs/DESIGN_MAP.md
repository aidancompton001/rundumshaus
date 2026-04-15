# DESIGN_MAP — RundumsHaus

> Каждый визуальный эффект × секция × библиотека × mobile × reduced-motion
> Источники: Aceternity UI, React Bits, GSAP, Lenis, CSS
> Дизайн-база: Provenly Homes (Warm Sand + Copper) — палитра будет заменена CEO позже

---

## Стек анимаций

| Библиотека | Роль | Когда |
|-----------|------|-------|
| **GSAP + ScrollTrigger** | Scroll-linked reveals, timelines, counters | Scroll animations |
| **GSAP SplitText** | Character/word text animation | Hero heading, section titles |
| **Motion 12** | React state: mount/unmount, hover, layout | Burger, accordion, carousel, form states |
| **Lenis** | Smooth scroll | Always-on global |
| **Aceternity UI** | Premium copy-paste components | Spotlight, 3D Cards, Moving Border, Lamp, Tabs |
| **React Bits** | Lightweight copy-paste effects | Text animations, backgrounds |
| **CSS** | Simple transitions | Hover, shadow, opacity, glassmorphism |

## Правила (железные)

- **GSAP** для scroll → **НИКОГДА** Motion для scroll
- **Motion/CSS** для hover → **НИКОГДА** GSAP для hover
- **НИКОГДА** GSAP + Motion на одном элементе
- **ЗАПРЕТ next/image** на GitHub Pages → только `<img>` + `getImageUrl()`
- **Easing:** `power2.out` (reveals), `power3.out` (text), `[0.25,0.1,0.25,1]` (page)
- **Duration:** 150-200ms micro, 600-800ms element, 800-1200ms section, 30-50ms stagger
- **Mobile:** disable complex effects (SplitText, Spotlight, 3D Tilt, Lamp) via `useIsMobile()`
- **Reduced motion:** all animations → instant final state, Lenis disabled

---

## NAVBAR (3 эффекта)

| # | Эффект | Библиотека | Код | Mobile | Reduced Motion |
|---|--------|-----------|-----|--------|----------------|
| 1 | **Floating Navbar** — hide on scroll down, reveal on scroll up | GSAP | `gsap.to(nav, { y: scrollDown ? -100 : 0, duration: 0.3 })` | ✅ Тот же | Sticky, no animation |
| 2 | **Backdrop blur** — glassmorphism bg | CSS | `backdrop-blur-xl bg-[bg-color]/90 border-b border-white/[0.08]` | ✅ Тот же | ✅ Тот же |
| 3 | **Burger rotation** — hamburger → X с rotation 45deg | Motion | `animate={{ rotate: isOpen ? 45 : 0 }}` | ✅ Only mobile | Instant toggle |

---

## HERO (7 эффектов)

| # | Эффект | Библиотека | Код | Mobile | Reduced Motion |
|---|--------|-----------|-----|--------|----------------|
| 4 | **Lamp Effect** — dramatic top lighting | Aceternity UI | `<LampContainer>` — SVG gradient cones + motion blur | ❌ Simplified glow | Static gradient |
| 5 | **SplitText heading** — chars rise from below | GSAP SplitText | `yPercent: 150, stagger: 0.03, power3.out` | ❌ Simple fade-in | Instant show |
| 6 | **Text Generate** — subheading words appear | GSAP SplitText | Words mode, `opacity: 0 → 1, stagger: 0.04` | ❌ Simple fade-in | Instant show |
| 7 | **Spotlight cursor** — radial gradient follows mouse | Aceternity UI | `<Spotlight>` — `--mouse-x/--mouse-y` custom props | ❌ Disabled | Disabled |
| 8 | **Parallax background** — image moves slower than scroll | GSAP | `ScrollTrigger scrub: true, yPercent: -20` | ❌ Disabled | Static |
| 9 | **Scroll indicator** — animated arrow/chevron | CSS | `@keyframes bounce` down arrow | ✅ Тот же | Static |
| 10 | **CTA Moving Border** — conic-gradient rotation on primary button | Aceternity UI | `<MovingBorder>` — `@property --angle`, conic-gradient | ❌ Simple border | Static border |

---

## ÜBER UNS (3 эффекта)

| # | Эффект | Библиотека | Код | Mobile | Reduced Motion |
|---|--------|-----------|-----|--------|----------------|
| 11 | **Section fade-up reveal** | GSAP ScrollReveal | `from({ opacity: 0, y: 40 }), start: "top 85%"` | ✅ Тот же | Instant show |
| 12 | **Image parallax** — photo moves at different speed | GSAP | `ScrollTrigger scrub, yPercent: -10` | ❌ Disabled | Static |
| 13 | **Counter animation** — numbers count up | GSAP | `textContent: 0→target, snap: 1, duration: 2s` | ✅ duration: 1.5s | Instant final number |

---

## SERVICES / LEISTUNGEN (6 эффектов)

| # | Эффект | Библиотека | Код | Mobile | Reduced Motion |
|---|--------|-----------|-----|--------|----------------|
| 14 | **Cards stagger** — cards appear one by one | GSAP Stagger | `from({ y: 50, opacity: 0 }), stagger: 0.12` | ✅ Тот же | Instant show |
| 15 | **3D Card Tilt** — perspective rotate on hover | Aceternity UI | `<CardContainer><CardBody><CardItem translateZ>` | ❌ Simple hover lift | No hover effect |
| 16 | **Glassmorphism cards** — frosted glass effect | CSS | `backdrop-blur-2xl bg-[card-bg]/40 border border-white/[0.08]` | ✅ Тот же | ✅ Тот же |
| 17 | **Icon scale on hover** | CSS | `transition: transform 200ms; hover:scale-105` | ✅ Тот же | No scale |
| 18 | **Card hover lift** — y:-4 + shadow boost | Motion | `whileHover={{ y: -4 }}` | ✅ Тот же | No hover |
| 19 | **Heading ClipPath reveal** | GSAP | `clipPath: inset(100% 0 0 0) → inset(0%)` | ✅ Тот же | Instant show |

---

## REFERENZEN (4 эффекта)

| # | Эффект | Библиотека | Код | Mobile | Reduced Motion |
|---|--------|-----------|-----|--------|----------------|
| 20 | **Before/After slider** — drag to compare | CSS + JS | Custom slider с `clip-path` или `overflow: hidden` + drag handle | ✅ Touch-friendly | Static side-by-side |
| 21 | **Grid stagger** — cards appear sequentially | GSAP Stagger | `from({ y: 30, opacity: 0 }), stagger: 0.1` | ✅ Тот же | Instant show |
| 22 | **Empty state** — красивое "Bald verfügbar" | CSS + Motion | `animate={{ opacity: [0.5, 1] }}` pulse | ✅ Тот же | Static |
| 23 | **Image hover zoom** — scale 1.05 inside overflow hidden | CSS | `overflow-hidden; img: hover:scale-105 transition-500` | ✅ Тот же | No zoom |

---

## KONTAKT (5 эффектов)

| # | Эффект | Библиотека | Код | Mobile | Reduced Motion |
|---|--------|-----------|-----|--------|----------------|
| 24 | **Form sections stagger** | GSAP Stagger | `from({ y: 30, opacity: 0 }), stagger: 0.15` | ✅ Тот же | Instant show |
| 25 | **Floating labels** — label moves up on focus | CSS Tailwind | `peer-focus:top-1.5 peer-focus:text-xs` + `placeholder=" "` | ✅ Тот же | ✅ Тот же |
| 26 | **Error pop-in** | Motion | `animate={{ scale: [0.95, 1], opacity: [0, 1] }}` | ✅ Тот же | Instant show |
| 27 | **Success celebration** — checkmark + scale | Motion | `animate={{ scale: [0.8, 1.1, 1] }}` | ✅ Тот же | Instant show |
| 28 | **Input focus glow** — accent border on focus | CSS | `focus:ring-2 focus:ring-[accent]/50 transition-all` | ✅ Тот же | ✅ Тот же |

---

## FOOTER (2 эффекта)

| # | Эффект | Библиотека | Код | Mobile | Reduced Motion |
|---|--------|-----------|-----|--------|----------------|
| 29 | **Link hover underline grow** | CSS | `::after { width: 0 → 100%, transition: 300ms }` | ✅ Тот же | ✅ Тот же |
| 30 | **Section fade-up** | GSAP ScrollReveal | `from({ opacity: 0, y: 30 })` | ✅ Тот же | Instant show |

---

## GLOBAL / POLISH (5 эффектов)

| # | Эффект | Библиотека | Код | Mobile | Reduced Motion |
|---|--------|-----------|-----|--------|----------------|
| 31 | **Lenis smooth scroll** — site-wide | Lenis | `duration: 1.2, exponential easing` | ✅ `touchMultiplier: 2` | Disabled (native scroll) |
| 32 | **Lenis + GSAP sync** — ticker wiring | GSAP + Lenis | `lenis.on("scroll", ScrollTrigger.update); gsap.ticker.add(...)` | ✅ Тот же | N/A (Lenis disabled) |
| 33 | **Section bg alternation** — visual rhythm | CSS | Alternating section backgrounds (light/dark sections) | ✅ Тот же | ✅ Тот же |
| 34 | **Cookie banner slide-up** | Motion | `y: 100 → 0, AnimatePresence exit` | ✅ Тот же | Instant show |
| 35 | **Skip link** — "Zum Inhalt springen" | CSS | `sr-only focus:not-sr-only` | ✅ Тот же | ✅ Тот же |

---

## ИТОГО: 35 эффектов

| Библиотека | Количество |
|-----------|-----------|
| GSAP ScrollTrigger | 10 |
| GSAP SplitText | 2 |
| Aceternity UI | 4 (Lamp, Spotlight, 3D Card, Moving Border) |
| Motion | 5 |
| CSS | 11 |
| Lenis | 2 |
| JS (custom) | 1 (Before/After) |

| Категория | Desktop | Mobile |
|----------|---------|--------|
| Полностью работает | 35 | 24 |
| Упрощено | 0 | 5 |
| Отключено | 0 | 6 |
