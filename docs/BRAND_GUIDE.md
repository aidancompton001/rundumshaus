# Brand Guide — Rundum's Haus Littawe

**Direction:** Premium Direction 1 — Warm Bronze
**Source:** Luma Labs Nano Banana 2 (2026-04-15)
**Слоган:** "Stille Klasse für Ihr Zuhause"
**Подслоган:** "Handwerk, Präzision, Vertrauen."

---

## Палитра

### Primary (из Colors.png)

| Token | Hex | CSS Variable | Tailwind Class | Роль |
|-------|-----|-------------|----------------|------|
| Deep Charcoal | `#2A2A2A` | `var(--color-charcoal)` | `text-charcoal`, `bg-charcoal` | Основной тёмный фон (Hero, CTA, Footer), body text |
| Warm Cream | `#F3EDE2` | `var(--color-cream)` | `text-cream`, `bg-cream` | Светлый фон, текст на тёмном |
| Aged Bronze | `#9B7B4E` | `var(--color-copper)` | `text-copper`, `bg-copper` | Акцент — ссылки, hover, CTA, иконки, лого |
| Stone Gray | `#A09A90` | `var(--color-sand)` | `text-sand`, `bg-sand` | Вторичный — бордеры, мелкий текст, декор |

### Extended

| Token | Hex | CSS Variable | Использование |
|-------|-----|-------------|---------------|
| Aged Bronze Light | `#B89A6A` | `var(--color-copper-light)` | Hover state |
| Aged Bronze Dark | `#7A6B58` | `var(--color-copper-dark)` | Active/pressed |
| Cream Dark | `#E8E2D6` | `var(--color-cream-dark)` | Card bg, section alternation |
| Charcoal Light | `#4A4A40` | `var(--color-charcoal-light)` | Secondary text |

### Специальные

| Контекст | Значение |
|----------|----------|
| Selection | `background: #9B7B4E; color: #F3EDE2` |
| Moving Border | `conic-gradient(..., #9B7B4E 90%, ...)` |
| Spotlight cursor | `rgba(155, 123, 78, 0.12)` |

---

## Типографика

### Шрифты (из fonts.png)

| Роль | Шрифт | Weights | Loading | CSS Variable |
|------|-------|---------|---------|-------------|
| Headings | **Lora** (Medium Serif) | 400, 600, 700 | `next/font` (local, GDPR) | `--font-heading` |
| Body | **Plus Jakarta Sans** (Light Sans) | 400, 500, 600 | `next/font` (local, GDPR) | `--font-body` |

### Type Scale

| Element | Desktop | Mobile | Weight | Font |
|---------|---------|--------|--------|------|
| H1 (Hero) | 64px / 4rem | 36px / 2.25rem | 700 | Lora |
| H2 (Section) | 48px / 3rem | 28px / 1.75rem | 700 | Lora |
| H3 | 32px / 2rem | 22px / 1.375rem | 600 | Lora |
| H4 (Card) | 24px / 1.5rem | 20px / 1.25rem | 600 | Lora |
| Body | 18px / 1.125rem | 16px / 1rem | 400 | Plus Jakarta Sans |
| Caption | 14px / 0.875rem | 13px | 500 | Plus Jakarta Sans |
| Button | 16px / 1rem | 15px | 600 | Plus Jakarta Sans |

---

## Логотип

### Файлы

| Файл | Фон | Использование | Формат |
|------|-----|---------------|--------|
| `logo-icon.svg` | Light | Favicon-ready, маленькие места | SVG, stroke #9B7B4E |
| `logo-icon-dark.svg` | Dark | Navbar, Footer (тёмный bg) | SVG, stroke #F3EDE2 |
| `logo-full.svg` | Light | Header на светлом фоне | SVG, icon + "RHL" |
| `logo-full-dark.svg` | Dark | Header на тёмном фоне | SVG, icon + "RHL" cream |
| `icon.svg` | — | Browser favicon | SVG, charcoal bg + bronze house |
| `logo-icon.png` | Dark | Растровая версия из Luma | PNG |
| `logo-full.png` | Dark | Растровая: icon + "RHL" | PNG |
| `logo-full-text.png` | Dark | Полный wordmark | PNG |

### Правила

- Иконка домика: **всегда Aged Bronze** (#9B7B4E) на light bg, **Warm Cream** (#F3EDE2) на dark bg
- Монограмма "RHL": те же правила
- Wordmark "Rundum's Haus Littawe": **Deep Charcoal** на light, **Warm Cream** на dark
- Min size: icon 24px, wordmark 100px width

---

## WCAG Контраст

| Комбинация | Контраст | Статус |
|-----------|----------|--------|
| Charcoal #2A2A2A на Cream #F3EDE2 | 13.8:1 | PASS |
| Cream #F3EDE2 на Charcoal #2A2A2A | 13.8:1 | PASS |
| Bronze #9B7B4E на Charcoal #2A2A2A | 3.9:1 | Large text only (18px+) |
| Bronze #9B7B4E на Cream #F3EDE2 | 3.5:1 | Large text only |
| Stone #A09A90 на Charcoal #2A2A2A | 4.7:1 | PASS (body) |
| Stone #A09A90 на Cream #F3EDE2 | 2.9:1 | Decorative only |

### Правила контраста

- Bronze: **НИКОГДА** как мелкий body text — только headings (18px+), иконки, акценты
- Stone Gray: на тёмном фоне OK для body, на светлом = только декоративный
- Body text: **всегда** Charcoal на Cream или Cream на Charcoal

---

## CSS Code (globals.css)

```css
:root {
  --color-cream: #F3EDE2;
  --color-cream-dark: #E8E2D6;
  --color-charcoal: #2A2A2A;
  --color-charcoal-light: #4A4A40;
  --color-copper: #9B7B4E;
  --color-copper-light: #B89A6A;
  --color-copper-dark: #7A6B58;
  --color-sand: #A09A90;
}

@theme inline {
  --color-cream: #F3EDE2;
  --color-cream-dark: #E8E2D6;
  --color-charcoal: #2A2A2A;
  --color-charcoal-light: #4A4A40;
  --color-copper: #9B7B4E;
  --color-copper-light: #B89A6A;
  --color-copper-dark: #7A6B58;
  --color-sand: #A09A90;
  --font-heading: var(--font-heading);
  --font-body: var(--font-body);
}
```
