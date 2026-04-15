# Palette V2 — Blau / Grün / Weiß (из флаера клиента)

**Источник:** `img/photo_2026-04-15_13-30-49.jpg`
**Утверждено:** CEO, 2026-04-15

---

## Основные цвета

| Роль | Token (CSS) | HEX | Описание |
|------|-------------|-----|----------|
| Dark / Body text | `--color-charcoal` | `#1B3A5C` | Тёмно-синий (navy), основной фон флаера |
| Dark lighter | `--color-charcoal-light` | `#2D5A8C` | Средний синий, secondary text |
| Light / Background | `--color-cream` | `#FFFFFF` | Белый |
| Light darker | `--color-cream-dark` | `#F0F4F8` | Светлый серо-голубой, card bg |
| Accent | `--color-copper` | `#4A8B3F` | Зелёный (из лого), акцент |
| Accent light | `--color-copper-light` | `#5AA84D` | Светлый зелёный, hover |
| Accent dark | `--color-copper-dark` | `#3A7030` | Тёмный зелёный, active/pressed |
| Neutral | `--color-sand` | `#6B7B8D` | Серо-синий, бордеры, мелкий текст |
| **CTA (NEW)** | `--color-gold` | `#D4A843` | Золотой, CTA-кнопки (как на флаере) |
| **CTA hover (NEW)** | `--color-gold-light` | `#E0BA5A` | Светлый золотой, hover CTA |

---

## Hardcoded rgba (для Lamp / Spotlight)

| Компонент | БЫЛО | СТАНЕТ |
|-----------|------|--------|
| Lamp.tsx gradient | `rgba(42,42,42,0.6)`, `rgba(42,42,42,0.85)` | `rgba(27,58,92,0.6)`, `rgba(27,58,92,0.85)` |
| Lamp.tsx glow wide | `bg-copper/30` | `bg-copper/30` (через токен, ОК) |
| Lamp.tsx glow focused | `bg-copper-light/40` | `bg-copper-light/40` (через токен, ОК) |
| Spotlight.tsx | `rgba(155,123,78,0.12)` | `rgba(74,139,63,0.12)` |
| ContactForm.tsx bg | `rgba(243,237,226,0.92)`, `rgba(243,237,226,0.96)` | `rgba(255,255,255,0.92)`, `rgba(255,255,255,0.96)` |
| globals.css moving-border | `#9B7B4E` | `#4A8B3F` |
| globals.css ::selection | `bg #9B7B4E`, `color #F3EDE2` | `bg #4A8B3F`, `color #FFFFFF` |

---

## SVG / Favicon

| Файл | БЫЛО | СТАНЕТ |
|------|------|--------|
| icon.svg bg | `#2A2A2A` | `#1B3A5C` |
| icon.svg stroke | `#9B7B4E` | `#4A8B3F` |
| logo-icon.svg | `#9B7B4E` | `#4A8B3F` |
| logo-icon-dark.svg | `#F3EDE2` | `#FFFFFF` |
| logo-full.svg | `#9B7B4E` | `#4A8B3F` |
| logo-full-dark.svg | `#F3EDE2` | `#FFFFFF` |

---

## WCAG проверка (предварительная)

| Комбинация | Ratio | Статус |
|-----------|-------|--------|
| Navy #1B3A5C на White #FFFFFF | ~8.5:1 | PASS (AAA) |
| White #FFFFFF на Navy #1B3A5C | ~8.5:1 | PASS (AAA) |
| Green #4A8B3F на White #FFFFFF | ~3.5:1 | PASS (крупный текст AA) / FAIL (мелкий) |
| Dark Green #3A7030 на White #FFFFFF | ~4.8:1 | PASS (AA) |
| Gold #D4A843 на Navy #1B3A5C | ~4.2:1 | PASS (AA) |
| White на Green #4A8B3F | ~3.5:1 | Использовать white text ТОЛЬКО на крупных элементах |

**Решение:** Мелкий текст акцентного цвета → использовать `--color-copper-dark` (#3A7030) вместо `--color-copper` (#4A8B3F).
