# Luma AI — Image Prompts for RundumsHaus

**Проект:** Rundum's Haus Littawe
**Стиль:** Quiet Luxury — calm, confident, elevated
**Палитра направление:** dark charcoal + warm cream + bronze/aged gold accent
**Фотостиль:** warm natural light, muted desaturated tones, shallow depth of field, no stock-photo look
**Настроение:** как сайт дорогого архитектурного бюро, не как шаблон для Handwerker

---

## Общие правила для всех промптов

- **НЕ генерировать:** людей с лицами, текст, логотипы, водяные знаки
- **Освещение:** golden hour или мягкий overcast, тёплые тона
- **Цветокоррекция:** muted, слегка desaturated, тёплый баланс белого
- **Стиль:** editorial photography, не стоковое фото
- **Формат выхода:** JPG/PNG → конвертировать в WebP для продакшена

---

## 1. HERO — Startseite

### IMG-01: Hero Background (полноэкран)

```
Type: hero background, full-screen atmospheric
Scene: aerial or elevated view of a beautifully maintained German residential property 
with a manicured garden, clean pathways, and a well-kept roof — seen from a slight 
bird's eye angle. Early morning golden light casting long warm shadows across the lawn. 
Soft mist in the background suggesting a quiet suburban neighborhood.
Mood: calm confidence, premium quality, quiet luxury
Color palette: muted warm tones — soft cream highlights, deep charcoal shadows, 
touches of aged bronze in the morning light
Photography style: editorial architectural photography, shallow atmospheric perspective, 
warm color grading, slightly desaturated
Composition: leave upper-left area darker/emptier for text overlay (heading + CTA)
Technical: 1920x1080 minimum, 16:9 aspect ratio, max 200KB after WebP conversion
```

**Использование:** Hero секция, `background-image`, затемнение через gradient overlay
**Файл:** `hero-bg.webp`

---

## 2. ÜBER UNS — Startseite

### IMG-02: About Section Photo

```
Type: atmospheric product/service photo
Scene: close-up of hands in quality work gloves carefully tending to a garden hedge 
with professional shears. Focus on the hands and the tool — face not visible. 
Background: blurred warm-toned German garden with a stone path and wooden fence. 
Late afternoon warm light.
Mood: craftsmanship, attention to detail, honest work
Color palette: warm earth tones — cream, olive green, bronze highlights on the metal tool
Photography style: editorial close-up, shallow depth of field (f/2.8), 
warm natural backlight, muted greens
Technical: 1200x800 minimum, 3:2 aspect ratio, max 100KB after WebP conversion
```

**Использование:** About секция, рядом с текстом "Über uns"
**Файл:** `about.webp`

---

## 3. SERVICES OVERVIEW — Startseite (5 карточек)

> **Единая серия:** все 5 карточек — overhead flat-lay на тёмном дубовом столе.
> Одинаковый ракурс (строго сверху), одинаковое освещение (один тёплый spotlight 
> слева-сверху, мягкие тени вправо-вниз), одинаковая палитра фона.
> Меняется ТОЛЬКО набор предметов. Вместе они выглядят как единая коллекция.

### IMG-03: Hausmeisterservice

```
Type: service card — series 1 of 5, overhead flat-lay
Scene: top-down view of a dark oak table surface. Neatly arranged: a brass key, 
a quality multi-tool, a small spirit level, and a clean white work cloth folded 
in a square. Items placed with deliberate spacing, like a magazine editorial.
Mood: organized, dependable, everything in its place
Color palette: dark oak surface + brass/bronze metal + white cloth + warm spotlight
Photography style: overhead flat-lay, single warm spotlight from upper-left, 
soft directional shadows, dark moody background, shallow vignette at edges
Consistency note: SAME table, SAME light angle, SAME shadow direction as all 5 cards
Technical: 800x1000 minimum, 4:5 aspect ratio, max 100KB after WebP conversion
```

**Файл:** `service-hausmeister.webp`

---

### IMG-04: Gartenpflege

```
Type: service card — series 2 of 5, overhead flat-lay
Scene: top-down view of the same dark oak table surface. Neatly arranged: 
premium garden shears (brass handles), a small terracotta pot with a sprig of 
rosemary, a pair of leather gardening gloves, and a few fresh-cut green leaves 
scattered artfully.
Mood: natural care, craftsmanship, living materials
Color palette: dark oak surface + brass shears + terracotta + deep green leaves + warm spotlight
Photography style: overhead flat-lay, single warm spotlight from upper-left, 
soft directional shadows, dark moody background, shallow vignette at edges
Consistency note: SAME table, SAME light angle, SAME shadow direction as all 5 cards
Technical: 800x1000 minimum, 4:5 aspect ratio, max 100KB after WebP conversion
```

**Файл:** `service-garten.webp`

---

### IMG-05: Dacharbeiten (Dachreinigung)

```
Type: service card — series 3 of 5, overhead flat-lay
Scene: top-down view of the same dark oak table surface. Neatly arranged: 
a single clean dark roof tile (Dachziegel), a soft-bristle brush with a wooden handle, 
a coiled rope, and a small brass carabiner. Items placed with geometric precision.
Mood: height work, precision, safety and care
Color palette: dark oak surface + slate-gray tile + natural rope + brass carabiner + warm spotlight
Photography style: overhead flat-lay, single warm spotlight from upper-left, 
soft directional shadows, dark moody background, shallow vignette at edges
Consistency note: SAME table, SAME light angle, SAME shadow direction as all 5 cards
Technical: 800x1000 minimum, 4:5 aspect ratio, max 100KB after WebP conversion
```

**Файл:** `service-dach.webp`

---

### IMG-06: Entrümpelung

```
Type: service card — series 4 of 5, overhead flat-lay
Scene: top-down view of the same dark oak table surface. Neatly arranged: 
a roll of packing tape, a pair of heavy-duty work gloves (dark gray), a brass padlock 
with a key inserted, and a small folded moving blanket in cream color. 
Clean, minimal, deliberate.
Mood: clearing out, fresh start, methodical process
Color palette: dark oak surface + cream blanket + brass padlock + dark gloves + warm spotlight
Photography style: overhead flat-lay, single warm spotlight from upper-left, 
soft directional shadows, dark moody background, shallow vignette at edges
Consistency note: SAME table, SAME light angle, SAME shadow direction as all 5 cards
Technical: 800x1000 minimum, 4:5 aspect ratio, max 100KB after WebP conversion
```

**Файл:** `service-entruempelung.webp`

---

### IMG-07: Schrottabholung

```
Type: service card — series 5 of 5, overhead flat-lay
Scene: top-down view of the same dark oak table surface. Neatly arranged: 
a short piece of copper pipe with green patina, a small aluminum bracket, 
a heavy brass fitting, and a magnet on a string (metal testing tool). 
The metal textures and patina contrast beautifully against the dark wood.
Mood: value in materials, resourcefulness, clean collection
Color palette: dark oak surface + copper patina + aluminum silver + brass + warm spotlight
Photography style: overhead flat-lay, single warm spotlight from upper-left, 
soft directional shadows, dark moody background, shallow vignette at edges
Consistency note: SAME table, SAME light angle, SAME shadow direction as all 5 cards
Technical: 800x1000 minimum, 4:5 aspect ratio, max 100KB after WebP conversion
```

**Файл:** `service-schrott.webp`

---

## 4. LEISTUNGEN — Детальные фото (5 штук)

### IMG-08: Hausmeisterservice (detail)

```
Type: service detail, wide format
Scene: exterior of a well-maintained German Mehrfamilienhaus (multi-family home). 
Clean entrance area, swept walkway, trimmed bushes along the facade, tidy mailbox area. 
Late afternoon side-lighting emphasizing the clean lines of the building. 
No people, focus on the result of good maintenance.
Mood: order, reliability, everything taken care of
Color palette: warm sandstone facade + green hedges + charcoal shadows + cream sky
Photography style: architectural exterior, warm editorial tone, straight verticals
Technical: 1200x800 minimum, 3:2 aspect ratio, max 100KB after WebP conversion
```

**Файл:** `detail-hausmeister.webp`

---

### IMG-09: Gartenpflege (detail)

```
Type: service detail, wide format
Scene: panoramic view of a beautifully maintained private German garden. 
Trimmed lawn, sculpted hedges, a gravel path leading to a small terrace. 
Mixed plantings with structured beds. Golden hour light filtering through trees, 
creating dappled shadows on the grass.
Mood: serenity, living well, nature perfected
Color palette: rich greens + warm golden light + cream gravel + dark hedge shadows
Photography style: landscape/garden editorial, warm tones, wide composition
Technical: 1200x800 minimum, 3:2 aspect ratio, max 100KB after WebP conversion
```

**Файл:** `detail-garten.webp`

---

### IMG-10: Dacharbeiten (detail)

```
Type: service detail, wide format
Scene: wide shot of a clean German residential roof (Satteldach / gable roof) 
against a dramatic warm sky. The tiles are pristine, gutters clean, 
ridge tiles perfectly aligned. Shot from ground level looking up at an angle. 
Warm evening light on the tiles.
Mood: protection, solidity, craftsmanship above
Color palette: dark red-brown tiles + warm sky gradient (cream to charcoal) + bronze light
Photography style: architectural upward angle, dramatic sky, warm color grading
Technical: 1200x800 minimum, 3:2 aspect ratio, max 100KB after WebP conversion
```

**Файл:** `detail-dach.webp`

---

### IMG-11: Entrümpelung (detail)

```
Type: service detail, wide format
Scene: split composition — left side shows a cluttered attic or basement corner 
(boxes, old furniture, dim lighting), right side shows the same space completely 
cleared and clean with fresh light coming in. Conceptual before/after in one frame. 
If split is not possible: show a spacious, bright, empty Keller (basement) 
with clean concrete floor and organized shelving.
Mood: transformation, liberation, professional result
Color palette: warm cream light (clean side) vs muted charcoal (cluttered side)
Photography style: interior, natural light, documentary-editorial hybrid
Technical: 1200x800 minimum, 3:2 aspect ratio, max 100KB after WebP conversion
```

**Файл:** `detail-entruempelung.webp`

---

### IMG-12: Schrottabholung (detail)

```
Type: service detail, wide format
Scene: a clean, organized collection point — metal items neatly stacked 
(old radiators, pipes, bike frames) ready for pickup. Set against a clean 
industrial backdrop — perhaps a garage with concrete floor. 
Professional, not chaotic. Warm side-lighting.
Mood: efficiency, environmental responsibility, clean process
Color palette: industrial gray + warm copper/rust tones + charcoal shadows
Photography style: industrial-editorial, controlled composition, warm accent light
Technical: 1200x800 minimum, 3:2 aspect ratio, max 100KB after WebP conversion
```

**Файл:** `detail-schrott.webp`

---

## 5. REFERENZEN — Vorher/Nachher Placeholders (3 пары)

### IMG-13a/b: Garten Vorher/Nachher

```
Type: before/after pair
Scene VORHER: overgrown garden — tall uncut grass, wild hedge, 
scattered leaves on a stone path. Overcast flat lighting, slightly cool tones.
Scene NACHHER: same garden angle — freshly mowed lawn, trimmed hedge, 
clean path, defined bed edges. Warm golden hour lighting.
Mood: transformation, dramatic improvement
Color palette: VORHER: cool muted greens, gray. NACHHER: warm rich greens, golden light
Photography style: same exact camera angle for both, documentary style
Technical: 800x800 minimum per image, 1:1 aspect ratio, max 100KB each
```

**Файлы:** `ref-garten-vorher.webp`, `ref-garten-nachher.webp`

---

### IMG-14a/b: Dach Vorher/Nachher

```
Type: before/after pair
Scene VORHER: dirty roof with moss, algae stains, clogged gutter. 
Flat overcast light, cool desaturated tones.
Scene NACHHER: same roof angle — clean tiles, clear gutter, no moss. 
Warm light showing the natural tile color.
Mood: neglect vs care, dramatic clean result
Color palette: VORHER: gray-green moss, dull tiles. NACHHER: warm red-brown tiles, clean lines
Photography style: same camera angle, before=cool grade, after=warm grade
Technical: 800x800 minimum per image, 1:1 aspect ratio, max 100KB each
```

**Файлы:** `ref-dach-vorher.webp`, `ref-dach-nachher.webp`

---

### IMG-15a/b: Entrümpelung Vorher/Nachher

```
Type: before/after pair
Scene VORHER: cluttered garage or basement — boxes stacked, old furniture, 
dim single bulb lighting. Feels overwhelming and neglected.
Scene NACHHER: same space completely empty and clean — swept floor, 
organized walls, bright natural light from an open door.
Mood: chaos to order, stress to relief
Color palette: VORHER: dark, murky, gray. NACHHER: bright, warm cream, clean
Photography style: same camera angle, dramatic lighting shift
Technical: 800x800 minimum per image, 1:1 aspect ratio, max 100KB each
```

**Файлы:** `ref-keller-vorher.webp`, `ref-keller-nachher.webp`

---

## 6. KONTAKT — Background

### IMG-16: Contact Page Atmosphere

```
Type: atmospheric background, wide cinematic
Scene: a quiet German residential street at golden hour, shot from waist height. 
A stone garden path leads to the entrance of a warm-toned Einfamilienhaus. 
Low garden hedges on both sides, a wrought-iron mailbox near the gate. 
No people, no cars. The front door is visible but not the focus — 
the whole scene breathes "someone takes care of this home." 
Long warm shadows stretch across the path. Shallow depth at the edges.
Mood: inviting, residential warmth, "we come to your door"
Color palette: warm sandstone + deep green hedges + bronze evening light + charcoal shadows
Photography style: cinematic wide shot, 24mm lens feel, golden hour side-light, 
muted warm color grade, film grain subtle
Technical: 1920x1080 minimum, 16:9 aspect ratio, max 200KB after WebP conversion
```

**Использование:** Kontakt page background, затемнение overlay для читаемости формы
**Файл:** `contact-bg.webp`

---

## 7. SEO / SOCIAL

### IMG-17: OG Image (Social Share)

```
Type: social media preview card
Scene: minimalist composition — the hero image (IMG-01) cropped and darkened, 
with space for brand name overlay. Alternatively: a premium close-up of a 
house facade detail (door handle, window frame, garden gate) with warm bronze tones.
Mood: premium, recognizable, clean
Color palette: charcoal dominant + cream text area + bronze accent
Photography style: tightly cropped architectural detail, dark elegant
Technical: 1200x630 exact, 1.91:1 aspect ratio, max 100KB
Note: text overlay (brand name) will be added in code/design, not in Luma
```

**Файл:** `og-image.webp` (+ `og-image.jpg` fallback)

---

## Сводная таблица

| # | Файл | Секция | Ratio | Мин. размер | Макс. вес |
|---|------|--------|-------|-------------|-----------|
| 01 | `hero-bg.webp` | Startseite Hero | 16:9 | 1920×1080 | 200KB |
| 02 | `about.webp` | Startseite Über uns | 3:2 | 1200×800 | 100KB |
| 03 | `service-hausmeister.webp` | Startseite Services | 4:5 | 800×1000 | 100KB |
| 04 | `service-garten.webp` | Startseite Services | 4:5 | 800×1000 | 100KB |
| 05 | `service-dach.webp` | Startseite Services | 4:5 | 800×1000 | 100KB |
| 06 | `service-entruempelung.webp` | Startseite Services | 4:5 | 800×1000 | 100KB |
| 07 | `service-schrott.webp` | Startseite Services | 4:5 | 800×1000 | 100KB |
| 08 | `detail-hausmeister.webp` | Leistungen | 3:2 | 1200×800 | 100KB |
| 09 | `detail-garten.webp` | Leistungen | 3:2 | 1200×800 | 100KB |
| 10 | `detail-dach.webp` | Leistungen | 3:2 | 1200×800 | 100KB |
| 11 | `detail-entruempelung.webp` | Leistungen | 3:2 | 1200×800 | 100KB |
| 12 | `detail-schrott.webp` | Leistungen | 3:2 | 1200×800 | 100KB |
| 13 | `ref-garten-vorher/nachher.webp` | Referenzen | 1:1 | 800×800 | 100KB×2 |
| 14 | `ref-dach-vorher/nachher.webp` | Referenzen | 1:1 | 800×800 | 100KB×2 |
| 15 | `ref-keller-vorher/nachher.webp` | Referenzen | 1:1 | 800×800 | 100KB×2 |
| 16 | `contact-bg.webp` | Kontakt | 16:9 | 1920×1080 | 200KB |
| 17 | `og-image.webp` | SEO/Social | 1.91:1 | 1200×630 | 100KB |

**Итого: 17 уникальных сцен = 23 файла** (включая 6 Vorher/Nachher пар)

---

## Порядок генерации (рекомендация)

1. **Hero** (IMG-01) — задаёт визуальный тон всего сайта
2. **Services overview** (IMG-03–07) — 5 карточек, видны на главной
3. **About** (IMG-02) — дополняет главную
4. **Service details** (IMG-08–12) — страница Leistungen
5. **Contact** (IMG-16) — атмосфера
6. **Referenzen placeholders** (IMG-13–15) — Vorher/Nachher
7. **OG Image** (IMG-17) — можно кропнуть из Hero

---

*Документ создан по методологии Stage 6 из `02_Knowledge/Branding Methodology — Luma AI.md`*
*Все промпты выдержаны в стилистике Quiet Luxury (v2 Brand Brief)*