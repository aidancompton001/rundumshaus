# T008 — Redesign «Modern 2026» по референсу Kevin (1:1)

**Дата:** 2026-08-07
**Статус:** 🟡 ROADMAP — ждёт ОК CEO
**Размер:** XL (кросс-доменная: дизайн + архитектура + SEO + CMS + верификация)
**Ветка:** `redesign/modern-2026` (worktree `.worktrees/redesign`, верифицирован S074, HRC PASS)
**Оплата:** 100€ получены (Kevin, 2026-08-06)
**Ответственный:** #1 Viktor Hartmann (координация) · #2 Lena Schwarz (дизайн/CSS) · #3 Marco Reiter (интеграция/SEO) · #14 Hans Landa (гейты)

**Скиллы применены:** `p0` (этот файл) · `ui-ux-pro-max` (design system) · далее по фазам: `writing-plans`, `verification-before-completion`, `hrc`

---

## Исходные данные (факты, не предположения)

| Что | Значение | Источник |
|-----|----------|----------|
| Референс-макет | `C:\Users\moroc\Documents\Work\Claude\Kevin\RefForDis\WhatsApp Image 2026-08-06 at 23.31.53.jpeg` | CEO |
| CDP мастер-промпт | `c:/Projects/MainCore/core/CLAUDE_DESKTOP_DESIGN_PROMPT.md` (12-блочный, 33 KB) | vault MOC |
| Пиксель-система | `vault/02_Knowledge/Pixel-Perfect Site Replication System.md` (3 закона, ΔE-метрики, §6 чеклист) | vault |
| Верификаторы-эталон | `c:/Projects/HennerHeede-Site/verify/` — `pixel_toolkit.py`, `pixel_proof.py`, `pixel_diff.py`, `check_geometry.py`, `measure_mockup.py`, `VISUAL_ACCEPTANCE.md` | проект Henner Heede |
| Текущая палитра | `--copper: #4A8B3F` (зелёный), `--charcoal: #1B3A5C` (navy), `--cream: #FFFFFF` | `globals.css` |
| Страниц в проде | 511 URL в sitemap (98×5 услуг + хабы) + 100 redirect-стабов | live-замер S074 |
| Тесты | 247/247 | S074 |

---

## Анализ последствий

### 1. Что БЫЛО → что СТАНЕТ

| Слой | БЫЛО | СТАНЕТ | Риск |
|------|------|--------|------|
| Палитра | copper #4A8B3F / charcoal #1B3A5C / cream #FFFFFF | измеряется пипеткой ИЗ референса (dark-green hero-overlay, lime-accent #7CB3xx, navy-band, white) | Низкий — уже зелёно-синяя |
| Hero | Lamp-эффект + фото + текст слева | Фото на всю ширину + H1 в 2 строки (вторая — акцентом) + 4 чек-бейджа + 2 CTA + правая карточка 4 USP + «мазок» кистью снизу | Средний: новый компонент |
| Услуги | `ServiceOverview` карточки | 5 карточек: фото + круглая иконка внахлёст + заголовок 2 строки + 4 буллета + «Mehr erfahren →» | Средний |
| Über uns | `AboutSection` | Фото-слева + бейдж «100% Zufriedene Kunden» + 4 чека + CTA + рукописная стрелка | Низкий |
| **NEW** Stats-band | нет | Тёмная полоса: 4 метрики (100% / 5+ Jahre / Osnabrück & Umgebung / Zuverlässig) | **Юр. риск: «5+ Jahre» — решение CEO: ставим, ответственность Kevin** |
| Отзывы | `BewertungenSlider` (scroll-snap) | 3 карточки Google + кнопка «Alle Bewertungen auf Google ansehen» | Низкий: данные из `reviews.json` (9 реальных) |
| Navbar | текущий | + WhatsApp-кнопка справа (зелёная, 2 строки), dropdown «Leistungen» | Средний: dropdown = новый JS |
| Footer | текущий | 4 колонки (лого+текст+соцсети / Leistungen / Informationen / Kontakt) | Низкий |
| Админка (Sveltia) | 12 коллекций | адаптируется под новые поля (stats-band, hero-бейджи, USP-карточка) | **Обязательно (приказ CEO)** |

### 2. Что НЕ меняется (SEO-неприкосновенное)

- **URL-структура:** все 511 URL остаются 1:1. Ни один slug не меняется.
- **ServiceId:** 5 штук остаются (`hausmeisterservice`, `gartenpflege`, `dacharbeiten`, `entruempelung`, `garten-landschaftsbau`). Референс показывает расширенные ЗАГОЛОВКИ («Hausmeisterservice & Gebäudereinigung», «Garten- & Landschaftsbau & Pflasterarbeiten») — это `title` в `services.json`, НЕ новые сущности. Новые URL не создаются.
- **Schema.org:** LocalBusiness + offerCatalog + Service/FAQPage/Breadcrumb на 490 city-страницах — структура не трогается, только визуал.
- **Тексты:** остаются НАШИ (подтверждено Kevin 2026-08-06: «nicht der Text vom Bild, sondern unsere Texte, moderner»).
- **Отзывы:** только реальные 9 из `reviews.json`. Макетные Michael S./Anna K./Thomas R. — НЕ переносим.

### 3. Что может поплыть

- **City-шаблоны (490 страниц):** 5 `*CityTemplate.tsx` наследуют глобальные классы (`bg-cream-dark`, `text-charcoal`, `border-sand/30`). Смена палитры перекрасит их автоматически — нужен визуальный прогон 3 представительных городов на каждый шаблон.
- **Canary-скрипт:** `canary-verify.mjs` проверяет `minH2/minH3` и `requiredHeadings` — при перевёрстке заголовков может дать FAIL. Обновить пороги ПОСЛЕ, не ДО.
- **Snapshot-тесты:** `programmatic.snapshot.test.ts` не зависит от вёрстки (проверяет content-объекты) — не поплывёт.
- **`layout.schema.test.ts`:** 7 элементов offerCatalog — при смене title услуг тест упадёт. Обновить синхронно.
- **Изображения:** референс требует 5 новых service-фото + hero + about-фото в брендированной одежде. У Kevin своих нет → placeholder из текущих + запрос Kevin.
- **Breakpoints:** 375 / 768 / 1440 — hero с правой USP-карточкой на мобиле должен уходить ПОД фото, карточки услуг 5→1 колонка, stats-band 4→2×2.

### 4. Индексация и привязки

- Sitemap: без изменений (511), `lastmod` бампится в ПОСЛЕДНЕМ коммите фазы деплоя.
- Внутренние ссылки: nav-dropdown добавляет 5 ссылок на хабы услуг с каждой страницы → усиление internal linking (плюс для SEO).
- GSC: после релиза — Request indexing только для `/` и `/leistungen/` (остальное Google переобойдёт).
- **Правило S074 (открытый риск):** после КАЖДОГО push в master проверять появление workflow-run (GitHub однажды потерял событие).

---

## Pipeline (двухсредный, по CDP-методологии)

```
VS Code (здесь)              Claude Desktop                VS Code (здесь)
Ф1-Ф2: замеры референса  →   Ф3: генерация дизайна    →   Ф4-Ф8: порт в Next.js,
+ CDP-промпт + палитра        по CDP → /v1-desktop/         CMS, верификация, деплой
+ верификаторы                (web-artifacts-builder,
                               canvas-design, theme-factory)
```

CEO копирует в Desktop **только зону COPY** из `docs/design/CDP-RundumsHaus.md` (без frontmatter и cross-links).

---

## РАЗДЕЛЕНИЕ ТРУДА (подтверждено CEO 2026-08-07)

| Где | Что делается | Почему там |
|-----|--------------|------------|
| **Claude Desktop** | ТОЛЬКО визуальный дизайн: мокапы 1:1 по референсу Kevin. Skills: web-artifacts-builder, canvas-design, theme-factory, brand-guidelines. Выход: `/v1-desktop/` (HTML+CSS мокап + токены) | Desktop-скилы дизайна недоступны из VS Code (разные окружения) |
| **Здесь (VS Code)** | Всё остальное: CDP-промпт, замеры референса, архитектура, порт мокапа в Next.js, миграция контента и индексации, CMS, тесты, верификация, HRC/Landa, деплой | Здесь код, git, тесты, прод |

**Дизайн = 1:1 с референсом.** Не «по мотивам». Критерий приёмки — числовой: ΔE-замер против референса + геометрия скриптом (не «на глаз», Закон 1 пиксель-системы).

---

## МИГРАЦИЯ НА НОВЫЙ САЙТ (индексация + тексты + функционал)

> Ключевое требование CEO: перенести на новый дизайн ВСЁ — индексацию, тексты, привязки. Ничего не теряем.

### A. Индексация (511 URL) — переносится БЕЗ изменений

| Объект | Количество | Действие при редизайне |
|--------|-----------|------------------------|
| City-страницы услуг `/leistungen/<service>/<city>/` | 490 (5×98) | URL не меняется. Меняется только вёрстка внутри `*CityTemplate.tsx` |
| Хабы услуг + спец-страницы | 4 (`/leistungen/`, `/objektpflege/`, `/rasen-neuanlage/`, `/weitere-leistungen/`) | URL не меняется |
| Статические страницы | 9 (`/`, `/ueber-uns/`, `/referenzen/`, `/kontakt/`, `/einsatzgebiet/`, `/osnabrueck/`, `/ratgeber/`, `/impressum/`, `/datenschutz/`) | URL не меняется |
| Ratgeber-статьи | 9 | URL не меняется |
| Redirect-стабы schrottabholung | 100 | Остаются как есть (PX-077) |
| **Итого sitemap** | **511** | **Проверка Ф8: ровно 511, ни одного потерянного** |

**Что переносится автоматически (наследуется кодом):**
- `sitemap.ts` генерит URL из `getAllPagePairs()` — редизайн его не трогает
- `robots.txt`, `canonical`, `hreflang` — в `generateSEO()`, не в вёрстке
- Schema.org: LocalBusiness (layout) + Breadcrumb/Service/FAQPage (route) — **владеет РОУТ, не шаблон** (правило Playbook §A). Редизайн шаблонов Schema не ломает по построению
- `meta-overrides.json` — Kevin-editable паттерны title/description, работают независимо от вёрстки

**Что проверяется вручную в Ф8:**
- Live-sitemap = 511 (curl-замер)
- 5 sample-URL каждой услуги отдают 200 + правильный canonical
- Schema-валидность: 3 блока JSON-LD на city-странице
- GSC: Request indexing `/` + `/leistungen/` (остальное Google переобойдёт по sitemap)

### B. Тексты — переносятся ПОЛНОСТЬЮ, источники не меняются

| Источник текста | Файл | Кто владеет | При редизайне |
|-----------------|------|-------------|---------------|
| Тексты 5 city-шаблонов | `src/data/templates/*.json` | Kevin (CMS) | **Не трогаем.** Компоненты рендерят те же поля |
| Startseite | `homepage.json` | Kevin (CMS) | Поля сохраняем; НОВЫЕ поля добавляем (stats, бейджи) |
| Услуги (карточки) | `services.json` | Kevin (CMS) | `title` может расшириться (реш. #3); `description` наш |
| Отзывы | `reviews.json` (9 реальных) | CEO | Переносим все 9. Макетные из референса — НЕТ |
| Meta-паттерны | `meta-overrides.json` | Kevin (CMS) | Не трогаем |
| Ratgeber | `ratgeber.json` + `ratgeber-content.ts` | наш | Не трогаем |
| Контакты | `site.json` | Kevin (CMS) | Не трогаем (сквозные, PX-073) |

**Правило:** ни один текст не переписывается «под макет». Подтверждено Kevin: «nicht der Text vom Bild — unsere Texte, moderner verpackt».

**Машинная проверка (Ф6, HRC-claim):** количество текстовых полей в JSON до = после; diff по значениям пуст (кроме явно согласованных).

### C. Функционал — что сохраняем и что добавляем

| Функция | Статус | Примечание |
|---------|--------|------------|
| Sveltia CMS (12 коллекций) | Сохраняем + расширяем | Ф7, приказ CEO |
| FormSubmit.co контакт-форма | Сохраняем | Проверить стилизацию под новый дизайн |
| WhatsApp-ссылки | Сохраняем + усиливаем | Референс: WhatsApp-кнопка в navbar + hero-CTA |
| Image-варианты (auto 400/800/1200w) | Сохраняем | `generate-image-variants.mjs` в prebuild |
| Cross-links (neighbors, weitere Leistungen) | Сохраняем | Внутренняя перелинковка = SEO-актив |
| Expandable «Weitere Einsatzorte» | Сохраняем | 30 видимых + раскрытие |
| **NEW** Nav-dropdown «Leistungen» | Добавляем | +5 внутренних ссылок с каждой страницы |
| **NEW** Stats-band | Добавляем | Данные из `homepage.json` (CMS-editable) |

### D. Порядок переключения (Ф8) — без окна недоступности

1. Preview-деплой ветки → Kevin смотрит на живом URL
2. Freigabe Kevin (письменно в WhatsApp)
3. PR в master → Landa-ревью диффа → merge
4. Деплой (проверить появление run — правило S074)
5. Live-верификация ДО уведомления Kevin: sitemap 511, ΔE, canary 0 FAIL, 200 на 10 sample-URL
6. Откат при провале: `git revert` merge-коммита → повторный деплой (RTO ≈ 10 мин)

---

## Phase Tracker

| # | Фаза | Статус | Гейт |
|---|------|--------|------|
| Ф1 | Перенос верификационного тулкита из HennerHeede | ☐ | HRC |
| Ф2 | Замеры референса: палитра, геометрия, карта высот | ☐ | HRC + Landa |
| Ф3 | CDP-промпт → дизайн в Claude Desktop → `/v1-desktop/` | ☐ | Landa (промпт до отправки) |
| Ф4 | Порт: палитра + токены + Navbar/Footer | ☐ | HRC |
| Ф5 | Порт: Hero + Services + About + Stats + Reviews | ☐ | HRC + ΔE-гейт |
| Ф6 | Каскад на 490 city-страниц + внутренние страницы | ☐ | canary + ΔE |
| Ф7 | Админка Sveltia под новые поля | ☐ | HRC + validate-cms-config |
| Ф8 | Preview для Kevin → Freigabe → merge → деплой | ☐ | HRC + Landa + live-верификация |

---

### Ф1 — Верификационный тулкит

**Цель:** в `redesign`-ветке лежит рабочий инструмент попиксельного замера, доказанный на чужом проекте.

**Шаги:**
1. Скопировать в `verify/`: `pixel_toolkit.py`, `pixel_proof.py`, `pixel_diff.py`, `check_geometry.py`, `measure_mockup.py` из `HennerHeede-Site/verify/`
2. Адаптировать пути/BASE_URL под RundumsHaus (убрать хардкод `henner.ais152.com`)
3. Создать `verify/VISUAL_ACCEPTANCE.md` — чеклист по страницам RundumsHaus
4. Установить зависимости: `numpy`, `Pillow` (проверить наличие)
5. Smoke-тест: прогнать `pixel_toolkit.py proof` на паре «референс vs текущий сайт» — получить baseline-ΔE (ожидаемо плохой, это точка отсчёта)

**Done-критерии (verify-чеки фазы):**
- [ ] `py verify/pixel_toolkit.py proof <ref> <baseline>` возвращает JSON с CIE76/CIEDE2000 и создаёт композит
- [ ] `py verify/check_geometry.py` запускается без ошибок (Chrome headless найден)
- [ ] baseline-ΔE зафиксирован в HRC-реестре как отправная точка

**Зависимости:** нет.

---

### Ф2 — Замеры референса

**Цель:** все числа дизайна взяты ИЗ референса скриптом, ни одного «на глаз» (Закон 1 пиксель-системы).

**Шаги:**
1. `measure_mockup.py` → карта высот: границы секций (hero/услуги/about/stats/reviews/footer) в px
2. `bgaudit` → палитра по зонам: hero-overlay, фон секций, зелёный акцент, navy-полоса, футер — HEX каждого
3. Замер типографики: размеры H1/H2/body, вес, letter-spacing (bbox-методом)
4. Замер геометрии: gap между карточками, padding контейнера, border-radius, высота карточек
5. Записать всё в `docs/design/REFERENCE_MEASUREMENTS.md` — единственный источник чисел для Ф3-Ф5

**Done-критерии:**
- [ ] `REFERENCE_MEASUREMENTS.md` содержит ≥20 измеренных значений, каждое с командой-замером
- [ ] Ни одного числа без источника (HRC-claim на каждый блок)
- [ ] Landa: проверка на фабрикацию цифр — CONFIRMED

**Зависимости:** Ф1.

---

### Ф3 — CDP-промпт и генерация дизайна

**Цель:** Kevin-референс + наши измерения → промпт для Claude Desktop → готовые мокапы.

**Шаги:**
1. Взять шаблон `CLAUDE_DESKTOP_DESIGN_PROMPT.md` (§ ШАБЛОН, строки 66-468)
2. Заполнить 12 блоков: ШАГ 0 (desktop-skills: web-artifacts-builder, canvas-design, theme-factory, brand-guidelines) → бренд-константы ЗАМОРОЖЕНЫ (лого Kevin, палитра из Ф2, шрифты) → структура (6 секций Startseite) → стек (Next.js 16 + Tailwind 4 → HTML-мокап) → §A-G анти-ошибки → §H Закон 21 → формат вывода `/v1-desktop/`
3. **Landa-ревью промпта ДО отправки** (по прецеденту Taxi-Moennigmann)
4. CEO копирует зону COPY в Claude Desktop → получает мокапы
5. Мокапы кладутся в `docs/design/v1-desktop/`

**Done-критерии:**
- [ ] `docs/design/CDP-RundumsHaus.md` существует, зона COPY размечена явно
- [ ] Landa: вердикт GO (или GO с правками — правки внесены)
- [ ] `/v1-desktop/` содержит мокап Startseite + токены (палитра/шрифты)

**Зависимости:** Ф2.

---

### Ф4 — Порт: фундамент

**Цель:** новая палитра и каркас в коде, сайт не сломан.

**Шаги:**
1. `globals.css`: CSS-переменные из Ф2 (значения-числа, не «примерно»)
2. `Navbar`: WhatsApp-кнопка + dropdown «Leistungen» (5 услуг, доступный по клавиатуре)
3. `Footer`: 4 колонки по референсу
4. Прогон тестов + build

**Done-критерии:**
- [ ] Тесты 247/247 (или обновлённое число с объяснением каждого изменения)
- [ ] Build зелёный
- [ ] `bgaudit` палитры: HEX в CSS == HEX из `REFERENCE_MEASUREMENTS.md` (0 расхождений)
- [ ] Dropdown: Tab-навигация + Esc закрывает + `aria-expanded`

**Зависимости:** Ф3.

---

### Ф5 — Порт: секции Startseite

**Цель:** Startseite визуально 1:1 с референсом.

**Шаги:**
1. `Hero`: фото + H1 (2 строки, вторая акцентом) + 4 бейджа + 2 CTA + USP-карточка справа + «мазок»
2. `ServiceOverview`: 5 карточек по референсу (фото + иконка внахлёст + 4 буллета)
3. `AboutSection`: фото + бейдж 100% + 4 чека + CTA
4. **NEW** `StatsBand`: 4 метрики на тёмной полосе
5. `ReviewsBlock`: 3 карточки Google из `reviews.json` + кнопка
6. Responsive: 375/768/1440 вручную для каждой секции

**Done-критерии:**
- [ ] ΔE-гейт: `pixel_proof.py` даёт **два** числа (вся страница + «код-построено») — оба в HRC-реестре
- [ ] `check_geometry.py`: 0 нарушений (заголовки не наезжают, зазоры ≥ порога)
- [ ] Нет горизонтального скролла на 375px
- [ ] §6 чеклист пиксель-системы пройден весь (9 пунктов)
- [ ] Landa: независимый ре-прогон ΔE своим скриптом

**Зависимости:** Ф4.

---

### Ф6 — Каскад на внутренние страницы

**Цель:** 490 city-страниц + хабы выглядят как единый сайт.

**Шаги:**
1. Прогон 5 city-шаблонов × 3 представительных города (T1/T2/T3) — визуальная проверка
2. Внутренние страницы: `/leistungen/`, `/ueber-uns/`, `/referenzen/`, `/ratgeber/`, `/kontakt/`, `/osnabrueck/`, `/einsatzgebiet/`
3. Обновить `canary-verify.mjs` пороги ПОД новую вёрстку
4. Обновить `layout.schema.test.ts` под новые title услуг (если менялись)

**Done-критерии:**
- [ ] `node scripts/phase1/canary-verify.mjs` (локально): 0 FAIL
- [ ] Тесты зелёные
- [ ] Скриншоты 15 city-страниц (5 шаблонов × 3 tier) — ни одной поехавшей секции

**Зависимости:** Ф5.

---

### Ф7 — Админка Sveltia

**Цель:** Kevin может править новый дизайн так же, как правил старый (приказ CEO).

**Шаги:**
1. `config.yml`: поля для новых блоков (hero-бейджи, USP-карточка, stats-band, footer-колонки)
2. Проверить, что все тексты новых секций читаются из JSON, не хардкод
3. `validate-cms-config.mjs` — прогон

**Done-критерии:**
- [ ] `node scripts/admin/validate-cms-config.mjs`: PASS
- [ ] grep: 0 хардкод-строк в новых компонентах (все через `homepage.json`/`site.json`)
- [ ] Kevin может изменить каждый видимый текст новых секций через /admin/

**Зависимости:** Ф6.

---

### Ф8 — Preview, Freigabe, деплой

**Цель:** Kevin утвердил → сайт переключён без потерь SEO.

**Шаги:**
1. Preview-деплой ветки (механизм решает CEO: отдельный GH-Pages repo / Vercel preview)
2. Ссылка Kevin → его Freigabe в WhatsApp (по мессенджер-протоколу)
3. PR `redesign/modern-2026` → master, Landa-ревью диффа
4. Merge → проверить появление workflow-run (правило S074) → деплой
5. Live-верификация: 511 URL в sitemap, ΔE на живом сайте, canary, прод 200
6. GSC: Request indexing для `/` и `/leistungen/`

**Done-критерии:**
- [ ] Live: sitemap 511 URL (ни одного потерянного)
- [ ] Live ΔE ≥ порога, зафиксированного в Ф5
- [ ] canary на проде: 0 FAIL
- [ ] Kevin дал письменное Freigabe (скрин в DEVLOG)
- [ ] HRC финальный: PASS + Landa CONFIRMED-ALL

**Зависимости:** Ф7.

---

## Чеклист приёмки (весь T008)

- [ ] Все 8 фаз ✅ в Phase Tracker
- [ ] Ни один из 511 URL не потерян и не изменён
- [ ] Тексты — наши, отзывы — реальные (9 из Google)
- [ ] Тесты зелёные, canary 0 FAIL, build зелёный
- [ ] ΔE-числа даны CEO ЧЕСТНО: два числа (вся страница + код-построено), с оговоркой про фото-плейсхолдеры
- [ ] Админка работает с новым дизайном
- [ ] HRC PASS + Landa CONFIRMED-ALL на каждом гейте
- [ ] DEVLOG + STATUS обновлены

---

## Технические долги, которые чиним первым коммитом ветки

Найдены Landa в S074, не блокируют, но лечим сразу:
1. `.gitattributes`: `*.snap text eol=lf` (иначе гейт вечно оставляет грязный статус в обоих деревьях)
2. `ci.yml`: добавить `redesign/**` в триггеры (сейчас ветка без CI)
3. `site/scripts/optimize-bielefeld-referenz.mjs`: убрать захардкоженный абсолютный путь `c:/Projects/RundUmsHaus/img/...` (утечка изоляции worktree)

---

## Решения CEO (приняты 2026-08-07) — БИНАРНО

| # | Вопрос | РЕШЕНИЕ CEO |
|---|--------|-------------|
| 1 | Preview-механизм для Kevin | **Любой** → берём отдельный GH-Pages репо (наш стек, бесплатно) |
| 2 | Фото услуг | **AI-генерация на основе референс-макета Kevin.** Не ждём его фото. Источник стиля — изображение из `RefForDis` |
| 3 | Titles услуг как в референсе | **Меняем** (URL не трогаются) |
| 4 | Объём генерации в Claude Desktop | **ВЕСЬ САЙТ**, не только Startseite: Startseite + Leistungen-хаб + шаблон city-страницы + Über uns + Referenzen + Ratgeber + Kontakt |

### Следствия решения #2 (фото)

- 5 фото услуг + hero + about-фото генерируются AI по стилю референса (тёмно-зелёная гамма, реальные рабочие сцены, брендированная одежда)
- Инструмент: Higgsfield MCP (`generate_image`) — в арсенале, скилы `higgsfield-image-auto`
- Промпты фото выводятся ИЗ референса на Ф2 (замер цветовой гаммы + композиции), не выдумываются
- Фото — плейсхолдеры до тех пор, пока Kevin не пришлёт свои; в ΔE-отчёте CEO это указывается явно (Закон честного нарратива §8)

### Следствия решения #4 (весь сайт в Desktop)

Ф3 расширяется: CDP-промпт описывает **7 экранов**, а не один. Выход `/v1-desktop/` должен содержать:
1. `index.html` — Startseite (6 секций по референсу)
2. `leistungen.html` — хаб услуг
3. `city-template.html` — шаблон программной city-страницы (критично: 490 страниц)
4. `ueber-uns.html`, `referenzen.html`, `ratgeber.html`, `kontakt.html`
5. `tokens.css` — палитра/типографика/spacing единым файлом (источник для порта)

---

> KB: skip — state-only update (роадмап проекта; методология и пиксель-система уже в vault: `Pixel-Perfect Site Replication System.md`, `CDP Pipeline`)
