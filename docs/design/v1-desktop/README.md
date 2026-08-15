# Rund ums Haus Littawe — Design-Prototyp v1-desktop

Режим: **репликация reference.jpg 1:1** (не свободный креатив). Vanilla HTML5 + CSS3 + минимум JS,
без сборщиков. Запуск: `python -m http.server 8000` в этой папке → http://localhost:8000/index.html

## Структура

```
/v1-desktop/
  index.html            Startseite (8 секций, порядок как в макете)
  leistungen.html       Хаб услуг (5 блоков: фото + описание + подуслуги + CTA)
  city-template.html    ★ Шаблон программных страниц «услуга + город» (490 шт.)
  ueber-uns.html        О компании
  referenzen.html       Галерея vorher/nachher
  ratgeber.html         Список статей
  kontakt.html          Контакты + DSGVO-форма
  impressum.html        § 5 TMG (плейсхолдер USt-IdNr. — заполнить)
  datenschutz.html      DSGVO (плейсхолдеры хостера/форм-сервиса — заполнить)
  css/tokens.css        ВСЕ переменные (палитра, типографика, spacing, radius, shadow)
  css/style.css         Вся вёрстка (ни одного хардкод-хекса в HTML)
  js/main.js            dropdown · burger · аккордеон FAQ · scroll-reveal · счётчик ·
                        WhatsApp-consent (2 шага) · consent-gate формы · chips-раскрытие
  assets/logo/          logo.svg + logo-white.svg (плейсхолдеры формы «домик + wortmarke»)
  assets/img/           brush-divider.svg (переиспользуемый «мазок») + серые фото-плейсхолдеры
```

## Соответствие макету (8 секций Startseite)

| # | Секция | Воспроизведено | Интерпретировано |
|---|--------|----------------|------------------|
| 1 | **Navbar** (sticky) | Лого слева, 6 пунктов меню, dropdown Leistungen (5 услуг), зелёная WhatsApp-кнопка в 2 строки, активный пункт подчёркнут `--color-accent`, шапка `--color-white` (белее полотна — как замерено) | Телефон в кнопке — **+49 1523 9603175 из данных бизнеса**, не номер с макета. Burger ≤820px (в макете мобайла нет) |
| 2 | **Hero** | Фото на всю ширину + градиент слева→направо (`--gradient-hero`), H1 CAPS 2 строки (белый/`--color-accent`), подзаголовок, 4 чек-бейджа, 2 CTA со стрелками внутри, тёмная полупрозрачная USP-карта справа (4 пункта), «мазок» снизу отдельным файлом `assets/img/brush-divider.svg` | Непрозрачность overlay подобрана для запаса читаемости белого H1 (в макете не замерялась). WhatsApp-CTA открывает 2-шаговый DSGVO-hinweis |
| 3 | **ServiceOverview** | Рубрика CAPS `--color-accent-ink`, H2, разделитель линия-точка-линия, 5 карточек в ряд: фото 7:5, зелёный круг-иконка наполовину на фото, заголовок 2 строки, 4 буллета, «Mehr erfahren →» | Буллеты 14px (расчёт давал 12px — поднято до порога доступности). `hyphens:auto` + `&nbsp;` перед «&» для немецких композитов |
| 4 | **AboutSection** | Фото слева с белым бейджем «100% / Zufriedene Kunden», рубрика, H2 2 строки с акцентной точкой, 2 абзаца, 4 чека, зелёная кнопка, серый водяной знак-шевроны справа, рукописная приписка со стрелкой | Handschrift — системный курсивный fallback (`--font-hand`); при порте можно self-host рукописный шрифт. Тексты абзацев — с макета дословно |
| 5 | **StatsBand** | Фон `--color-dark`, 4 колонки с 1px полупрозрачными разделителями, контурные иконки `--color-accent` (график ≥3:1), значения/подписи по замерам (31px/17px). Значения «100%», «5+», «Osnabrück & Umgebung», «Zuverlässig, schnell & preiswert» — **как в макете** | Счётчик 0→значение только у числовых колонок; отключается при `prefers-reduced-motion`. «5+ Jahre» = опыт владельца в ремесле; никаких текстов про «историю фирмы» не добавлено |
| 6 | **ReviewsBlock** | Рубрика, H2, разделитель, 3 карточки: логотип Google, 5 звёзд, текст, имя жирным; зелёная кнопка по центру со стрелкой | Тексты и имена — плейсхолдеры `[Kundenzitat N]` / `[Kundenname N]` (по ТЗ). Звёзды окрашены `--color-accent`, как читается в макете |
| 7 | **Footer** | Фон `--color-dark`, 4 колонки с 1px разделителями: лого+описание+3 соцкруга · Leistungen (6) · Informationen (6, включая Datenschutz/Impressum) · Kontakt с иконками в контурных кругах; нижняя линия | Телефон и e-mail — **из данных бизнеса** (`+49 1523 9603175`, `kontakt@rundumshaus-littawe.de`), НЕ с макета (там устаревшие). Копирайт-строка — разрешённое добавление |
| 8 | **WhatsApp-FAB** | — (нет в макете) | Разрешённое добавление: круглая зелёная кнопка справа снизу, видна только ≤820px |

### Разрешённые отступления (по списку ТЗ)
- Sticky WhatsApp-FAB (мобайл), копирайт в футере, страницы Impressum/Datenschutz,
  чекбокс согласия в форме, подъём кегля до 14px минимум.
- Прочих отступлений от композиции/палитры/порядка секций **нет**.

## Палитра и контраст (из ТЗ, проверено)
- Белый на `--color-accent` = 4.68:1 → все зелёные кнопки: белый текст, вес 600+.
- Мелкий акцентный текст на светлом (`eyebrow`, «Mehr erfahren») — `--color-accent-ink` (5.81:1), не `--color-accent` (4.41:1).
- `--color-accent` на `--color-dark` (3.85:1) — только иконки/графика.
- Hero-overlay `--gradient-hero`: подобран, в макете не замерялся (честная пометка сохранена и в tokens.css).

## Адаптив (в макете только desktop — спроектировано)
- **Базис 1440px**, контейнер `min(1280px, 100% − 2×5vw)`. Кегли по таблице ТЗ; H1:H2 = 2.0 (71/35 ≈ 2.03 из-за округления px→rem; cap-пропорция сохранена).
- **≤1100px**: карточки услуг 5 → 3 в ряд (flex-wrap, остаток центрируется — сироты нет).
- **≤900px**: USP-карта hero уходит ПОД текст; about в 1 колонку; watermark скрыт.
- **≤820px**: бургер с выездной панелью (Esc/overlay закрывают), FAB появляется.
- **≤768px**: карточки 2 в ряд (нечётная последняя — по центру), stats 2×2, отзывы — горизонтальный scroll-snap (видно ~2, третий скроллом), футер 2 колонки.
- **≤560px (класс 375px)**: карточки услуг — **вертикальный стек** (выбран вместо scroll-snap: аудитория 45–70 лет, вертикальная прокрутка предсказуемее и не прячет контент; сохраняется и без JS), всё в 1 колонку, CTA на всю ширину, H1 clamp. `overflow-x:hidden` на body + `overflow-wrap:anywhere` — горизонтального скролла нет ни на одном брейкпоинте.

## Порт в Next.js 16 + Tailwind 4

### tokens.css → Tailwind `@theme`
| CSS-переменная | Tailwind-утилита (предполагаемая) |
|---|---|
| `--color-accent` | `bg-accent` / `text-accent` / `border-accent` |
| `--color-accent-ink` | `text-accent-ink` |
| `--color-accent-hover` | `hover:bg-accent-hover` |
| `--color-dark` | `bg-dark` |
| `--color-dark-soft` | `bg-dark-soft` |
| `--color-paper` | `bg-paper` |
| `--color-white` | `bg-white-brand` |
| `--color-ink` / `--color-ink-muted` | `text-ink` / `text-ink-muted` |
| `--text-h1 … --text-small` | `text-h1 … text-small` (fontSize theme) |
| `--spacing-section` | `py-section` |
| `--spacing-card-gap` | `gap-card` |
| `--radius-card` / `--radius-button` | `rounded-card` / `rounded-button` |
| `--shadow-card` / `--shadow-card-hover` | `shadow-card` / `shadow-card-hover` |
| `--focus-ring` | `focus-visible:ring` конфиг |

### Маркировка
- `data-component="Navbar|Hero|ServiceOverview|AboutSection|StatsBand|ReviewsBlock|Footer"` на корне каждой секции (плюс внутренние: ServiceDetail, City*, ContactSection и т.д.).
- `data-cms="<путь в json>"` на каждом клиентском тексте (`homepage.hero.title`, `homepage.stats[1].value`, `services[0].title`, `cityPage.faq[0].answer` …). Юридические шаблоны (impressum/datenschutz) не маркированы — по правилу ТЗ.

### city-template.html (490 страниц)
Литеральные плейсхолдеры: `{{Leistung}}`, `{{Stadt}}`, `{{Leistung-slug}}`, `{{Stadt-slug}}`,
`{{Intro_Absatz_1..2}}`, `{{Textsektion_1..4_*}}`, `{{Unterleistung_1..6}}`, `{{FAQ_Antwort_1..6}}`, `{{Ort_1..30}}`.
- **Статично на всех 490**: header, footer, CTA-блок (4 кнопки), «Warum wir» (8 чеков), Einsatzgebiet, порядок секций.
- **Варьируется по городу**: breadcrumb, H1, intro, FAQ-ответы, чипы «Weitere Leistungen in {{Stadt}}».
- **Варьируется по услуге**: список подуслуг, «Weitere Einsatzorte» (30 чипов, 21–30 скрыты за «Alle Orte anzeigen +»).
- JSON-LD: BreadcrumbList + Service + FAQPage с теми же плейсхолдерами.

## DSGVO
- Шрифты: Google-CDN не используется; в `style.css` — комментарий-заглушка `@font-face` (self-host при порте), сейчас системный fallback.
- WhatsApp (`[data-wa]` на всех кнопках/FAB): 2-шаговый hinweis «Es öffnet sich WhatsApp – dabei werden Daten an Meta übertragen» с явной кнопкой «Einverstanden» и «Abbrechen» (main.js, §6).
- Форма: submit заблокирован без чекбокса согласия (ссылка на datenschutz.html); **обработчик формы — сторонний US-сервис, подключается и оценивается на этапе порта** (в datenschutz.html оставлен плейсхолдер).
- Трекеров/карт/cookies нет → cookie-баннер не нужен.

## Доступность
- Контраст по расчётам ТЗ; focus-ring двухслойный (`--focus-ring`) на всех интерактивных элементах; тач-зоны ≥44×44px (кнопки, чипы, соцкруги, burger); текстовые ссылки списков ≥24px (WCAG 2.2 §2.5.8).
- Dropdown/аккордеон/бургер: Tab/Enter/Esc, `aria-expanded`, закрытие по клику вне.
- `prefers-reduced-motion: reduce` — все анимации и счётчики отключены, контент виден сразу.
- Один H1 на страницу, иерархия H2→H3 без пропусков; осмысленные alt на немецком; skip-link.
- Hover без `scale()` (только тень + сдвиг стрелки) — layout не дёргается.

## Известные ограничения прототипа
- Фото — серые SVG-плейсхолдеры с подписью (генерация фото — отдельный этап после утверждения макета). `<picture>`+WebP+srcset подключаются при появлении реальных фото; место под медиа зарезервировано (`aspect-ratio`/width/height — CLS нет).
- Ссылки «Weiterlesen», соцсети и «Alle Bewertungen auf Google ansehen» — заглушки `#` до появления реальных URL.
- Рукописный шрифт «Direkt & persönlich…» — системный fallback.
