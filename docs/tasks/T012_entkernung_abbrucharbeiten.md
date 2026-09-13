# T012 — Новая основная услуга «Entkernung & Abbrucharbeiten»

**Дата:** 2026-09-13 · **Статус:** в работе — ОК CEO 13.09 · **Размер:** L · **Цена клиенту:** 70 € (согласовано)
**Ответственный:** #3 Marco Reiter — Frontend Engineer (данные, шаблон, маршрут); #2 Lena Schwarz — UX/UI (сетка главной, фото, адаптив); #14 Hans Landa — ревью
**Скиллы:** brainstorming (P0), далее writing-plans → test-driven-development → verification-before-completion
**Карточка Asana:** t012-entkernung · **Запрос клиента:** WhatsApp 13.09 — «neue Hauptdienstleistung … Entkernung und Abbrucharbeiten», «mit Seiten für die ganzen Städte»; текст страницы Osnabrück прислан CEO и сохранён дословно в `docs/kevin-entkernung-text-2026-09-13.txt` (12 481 байт, 185 строк, sha256 d8927b56e8104947) — единственный эталон для сверки «дословно»; фото — `C:\Users\moroc\Desktop\KEvinRund` (6 шт.)

---

## Анализ последствий

### Что есть сейчас (замерено)

| Величина | Сейчас | Станет | Как получено |
|---|---|---|---|
| Основных услуг | 5 | 6 | `services.json` |
| Городов | 98 | 98 | `cities.json` |
| Пар услуга×город | 490 | 588 | 5×98 → 6×98, скрипт |
| HTML-страниц в сборке | 617 | 715 | `site/out/**/*.html` + 98 |
| Адресов в sitemap | 511 | 609 | `<loc>` в `site/out/sitemap.xml` + 98, если все новые индексируемые |
| Title Osnabrück | — | 62 знака, если шаблон БЕЗ хвоста; 86 — если с хвостом «| Rund ums Haus Littawe» (сборка добавит его второй раз) | скрипт |
| Title самого длинного города | — | 83 знака без хвоста в шаблоне; 107 — с хвостом (Neuenkirchen (Kreis Steinfurt)) | скрипт |
| Title у существующих городских страниц | — | уже сейчас длинные: Entrümpelung Neuenkirchen (Kreis Steinfurt) — 108 знаков | `<title>` собранной страницы |
| Description Кевина | — | 150 знаков | скрипт |

### Как устроена услуга с городскими страницами (по коду)

Каждая из 5 услуг — это связка из пяти частей, новая повторяет её же:

1. **Запись в `site/src/data/services.json`** — `id, title, description, detailDescription, icon, image, detailImage, imageAlt`. Из неё сами собираются: карточка на главной (`ServiceOverview`), блок на `/leistungen/` (`ServiceDetail`, якорь `#<id>`), колонка «Leistungen» в подвале (`Footer.tsx:14`), вариант в выпадающем списке формы (`contact-form.json` → `optionsFrom: "services"`)
2. **Текстовый шаблон города** `site/src/data/templates/<id>.json` — `h1, heroImage, heroAlt, intro1/2, benefits, cta, sectionsBefore[], leistungen{heading,intro,items,footnote}, sectionsAfter[], warum, einsatzgebiet, faq{items[q,a,cityInQuestion]}, weitereLeistungen{links[label,servicePath]}, einsatzorte`; плейсхолдеры `{city}`, `{dist}`, `{count}`. Редактируется Кевином в админке (`public/admin/config.yml`, коллекции с `*stadtseiten_fields`)
3. **Мета-билдер** `site/src/lib/template-content-<id>.ts` (36 строк у Entrümpelung) — `metaTitle` через `safeTitle()`, `metaDescription`
4. **Компонент** `site/src/components/templates/<X>CityTemplate.tsx`
5. **Ветка в маршруте** `site/src/app/leistungen/[service]/[city]/page.tsx` — `generateMetadata` (мета + `meta-overrides` + `noindex`) и рендер с тремя JSON-LD: `BreadcrumbList`, `Service` (`areaServed` City + PostalAddress), `FAQPage`

Сквозные связи:
- `site/src/lib/programmatic.ts` — `ServiceId` (union), `SERVICE_IDS`, `BLOCKS: Record<ServiceId, ServiceBlocks>` (строка 654). `getAllPagePairs()` строит пары из `SERVICE_IDS` → **sitemap и `generateStaticParams` получат 98 новых адресов сами**
- Блок «Weitere Leistungen in {city}» на городских (маршрут, строка ~730) берёт `SERVICE_IDS` — новая услуга появится сама
- `meta-overrides.json` → `services[]` с `titlePattern/descriptionPattern` (правится Кевином)
- **Title собирается так:** маршрут берёт `metaOv?.title ?? content.metaTitle`, затем `generateSEO` (`lib/seo.ts:13`) дописывает ` | Rund ums Haus Littawe`. Шаблон из админки **обходит `safeTitle`** — это прямо записано в `lib/meta-overrides.ts:7`; длину шаблона проверяет только предупреждение `validate-cms-config`. У всех 5 услуг шаблон задан, значит `safeTitle` на их городских страницах не работает вовсе. Сам `safeTitle` длинные названия тоже не укорачивает: при названии города длиннее 20 знаков он возвращает `услуга + город` целиком

### Что сломается или поплывёт, если не учесть

| Место | Что будет | Что делать |
|---|---|---|
| `programmatic.ts:654` `BLOCKS: Record<ServiceId, …>` | TypeScript-ошибка сборки: для новой услуги нет программных блоков | Решение D5 |
| Тесты `programmatic.*.test.ts` | Ждут ровно 490 пар и 5 услуг; прогоняют `generatePageContent` по всем парам — упадут на новой | Обновить числа, для шаблонных услуг — шаблонная проверка |
| `data.test.ts:81` «exactly 5 services» | Упадёт | 6 |
| `meta-overrides.test.ts:86` «all 5 services» | Упадёт | 6 + запись в `meta-overrides.json` |
| `ServiceIcons` / `services.test.tsx` «5 named icons» | Нет иконки для услуги | Новая иконка (молоток/лом) в `serviceIconMap` |
| `ServiceOverview.tsx:52` сетка `xl:grid-cols-5` | На 1440 шесть карточек лягут 5+1 — одна висит в новом ряду | Решение D2 |
| `ServiceOverview.tsx:24` `BULLETS` — импорт 5 шаблонов поимённо | У карточки не будет 4 пунктов | Добавить импорт |
| `Servicegebiet.tsx:17,38` `SERVICE_ICONS`, `SERVICE_TITLES: Record<ServiceId>` | TS-ошибка + у 98 городов на `/einsatzgebiet/` не будет иконки новой услуги | Добавить |
| `StandortOsnabrueck.tsx:9`, `app/osnabrueck/page.tsx:30` — ручные списки | Хаб Osnabrück не сошлётся на новую услугу | Добавить |
| `app/layout.tsx:134` `hasOfferCatalog` — ручной список | Разметка LocalBusiness на 715 страницах без новой услуги | Добавить `Service` |
| 5 шаблонов `weitereLeistungen.links` (по 5 ссылок) | С существующих 490 городских нет ссылки на новую услугу | Добавить ссылку во все 5; в новом — ссылки на 5 остальных |
| `public/admin/config.yml` | Кевин не сможет править тексты новой услуги | Коллекция `entkernung-abbrucharbeiten` c `*stadtseiten_fields` |
| `public/llms.txt`, `llms-full.txt` — «Hauptleistungen: 5» | ИИ-поиск не узнает об услуге | Добавить |
| `verify/check_client_texts.py` `SERVICE_SLOT` — 5 слотов макета | Новая услуга текстовой сверкой не охвачена | Отдельная проверка дословности текста Кевина |
| `verify/check_migration_parity.py` | Добавленные страницы и адреса sitemap — не фатальны (сверка валит только пропажи и чужой домен). На общих страницах добавятся ссылки/картинки — не потери. Может сдвинуться число CSS/JS на общих страницах | Если сдвинется — объявить `by_delta` поимённо |

### Текст Кевина и шаблон

Текст написан под Osnabrück. На 97 других городах он идёт через шаблон, но «Osnabrück» **не заменяется вслепую**: где фраза описывает саму фирму, подстановка города дала бы ложное утверждение, что фирма находится в этом городе. Решение по каждому вхождению — в таблице ниже.

В тексте есть маркированные списки внутри разделов («Wir übernehmen die Entfernung von: Wandfliesen, Bodenfliesen…», «Entscheidend sind: …»). Текущий тип раздела `{heading, paragraphs}` списков не умеет — у нового шаблона раздел получает необязательный `items[]`. Меняется только новый компонент, существующие 5 шаблонов не трогаются.

Текст берётся **дословно**. Правки — только плейсхолдер города.

### Разметка каждого «Osnabrück» в тексте Кевина

Источник — `docs/kevin-entkernung-text-2026-09-13.txt`. Строк с «Osnabrück»: 20, вхождений с «Osnabrücker»: 21. Решения: заменить на город — 13, оставить Osnabrück — 4, соседние города — 2, не выводится — 1. Строки 129–135 (Belm, Wallenhorst, Hasbergen, Georgsmarienhütte, Hagen am Teutoburger Wald, Lotte, Bissendorf) «Osnabrück» не содержат, но привязаны к нему — идут вместе со строкой 128.

На странице Osnabrück весь текст — дословно. Разметка действует на остальные 97 городов.

| Строка | Текст | Решение | Почему |
|---|---|---|---|
| 1 | Neue Unterseite: Entkernung & Abbrucharbeiten Osnabrück | не выводится | служебная строка («Neue Unterseite»), на страницу не выводится |
| 5 | Entkernung & Abbrucharbeiten Osnabrück \| Rund ums Haus Littawe | заменить на город | станет `titlePattern` «Entkernung & Abbrucharbeiten {city}» без хвоста; хвост дописывает generateSEO |
| 7 | Entkernung & Abbrucharbeiten in Osnabrück. Rückbau von Estrich, Böden, Bädern, Fliesen, Türen & mehr inkl. Abtransport und Entsorgung. Jetzt anfragen. | заменить на город | meta description: «… in {city}. Rückbau …» |
| 8 | Entkernung & Abbrucharbeiten in Osnabrück | заменить на город | H1 |
| 9 | Sie planen eine Renovierung, Sanierung oder einen Umbau und benötigen Unterstützung bei der Entkernung oder bei Abbrucharbeiten? Rund ums Haus Littawe übernimmt zuverlässige Entkernungs-, Rückbau- und Innenabbrucharbeiten in Osnabrück und Umgebung. | заменить на город | «… Innenabbrucharbeiten in {city} und Umgebung.» — верно для любого города из зоны выезда |
| 13 | Entkernung in Osnabrück für Wohnungen, Häuser und Gewerbeobjekte | заменить на город | заголовок раздела |
| 48 | Innenabbruch und Rückbau in Osnabrück | заменить на город | заголовок раздела |
| 53 | Wohnung entkernen in Osnabrück | заменить на город | заголовок раздела |
| 59 | Badezimmer entkernen in Osnabrück | заменить на город | заголовок раздела |
| 72 | Estrich entfernen in Osnabrück | заменить на город | заголовок раздела |
| 91 | Fliesen entfernen in Osnabrück | заменить на город | заголовок раздела |
| 125 | Entkernungsfirma in Osnabrück und Umgebung | оставить Osnabrück | «Entkernungsfirma in {city}» говорило бы, что фирма находится в этом городе — неправда. Фирма в Osnabrück |
| 126 | Rund ums Haus Littawe ist in Osnabrück und der umliegenden Region tätig. | оставить Osnabrück | «ist in {city} … tätig» — та же ложная привязка. Утверждение про фирму верно только с Osnabrück |
| 128 | Osnabrück | соседние города | первый пункт списка «unter anderem in:» → {city}; строки 129–135 (Belm … Bissendorf — соседи Osnabrück) → до 7 соседей города из `cities.json.neighbors` в их порядке. Не `getNeighborCities()`: он добивает список до 30 городами из того же кольца расстояния от Osnabrück (у Nordhorn 3 соседа + 27 вроде Molbergen, Cloppenburg) |
| 138 | Was kostet eine Entkernung in Osnabrück? | заменить на город | подзаголовок про стоимость |
| 154 | Entkernung in Osnabrück unverbindlich anfragen | заменить на город | заголовок призыва |
| 161 | Osnabrück und Umgebung | оставить Osnabrück | подпись фирмы под названием «Rund ums Haus Littawe» — это место фирмы, а не страницы |
| 164 | Was kostet die Entkernung einer Wohnung in Osnabrück? | заменить на город | вопрос FAQ про стоимость в городе |
| 182 | Führen Sie Entkernungen außerhalb von Osnabrück durch? | оставить Osnabrück | вопрос FAQ «außerhalb von Osnabrück» — про базу фирмы, смысл верен на любой странице |
| 183 | Ja. Neben Osnabrück sind Einsätze auch im umliegenden Osnabrücker Land und nach Absprache in weiteren Orten möglich. | соседние города | «Neben Osnabrück» — оставить; «im umliegenden Osnabrücker Land» → «in {city}, <первые 3 соседа из `cities.json.neighbors`>». На странице Osnabrück — дословно |

**Сколько городов попадает в списки (замер по `cities.json`, 97 городов без Osnabrück).** `getNeighborCities()` для Nordhorn возвращает 30 городов: 3 из `neighbors` и 27 добавленных по близости расстояния от Osnabrück (±60 км), которые с Nordhorn не соседствуют. Поэтому эти списки строятся **не** из него, а из `cities.json.neighbors` — вручную заданных соседей. Их у городов: 3 — у 56, 4 — у 16, 5 — у 18, 6 — у 6, 8 — у 1.

- Строка 183 (ответ FAQ): город + **3** первых соседа — у каждого из 97 городов их не меньше трёх, фраза везде одной длины
- Список к строке 128: город + **до 7** соседей — столько же, сколько в списке Кевина (Osnabrück + 7). Обрезка задевает один город, у которого соседей 8
- Реализация — отдельная функция `getGeoNeighbors(city, max)` рядом с `getNeighborCities`; сам `getNeighborCities` и 490 существующих страниц не меняются

Как прозвучат три предложения на самой дальней странице — Nordhorn, 80 км, соседи из `cities.json`: Twist, Meppen, Wietmarschen:

- 126: «Rund ums Haus Littawe ist in Osnabrück und der umliegenden Region tätig.» — без изменений
- 161: «Osnabrück und Umgebung» — без изменений, подпись фирмы
- 183: «Ja. Neben Osnabrück sind Einsätze auch in Nordhorn, Twist, Meppen, Wietmarschen und nach Absprache in weiteren Orten möglich.»
- 127–135: «Je nach Auftrag übernehmen wir Entkernungs- und Rückbauarbeiten unter anderem in:» Nordhorn · Twist · Meppen · Wietmarschen · und weiteren Orten in der Umgebung

### Фото клиента

6 снимков работ (замер): `1,2,3,5,6.jpeg` — портрет 1536×2048, `4.jpeg` — пейзаж 1599×899, 252–577 KB. На снимках разобранные стены, снятая плитка, строительный мусор — реальная работа, людей нет.
- Hero городских и блок на `/leistungen/` требуют пейзаж → `4.jpeg`
- Карточка на главной (`aspect-[7/5]`) — кадрирование портрета
- Конвейер `scripts/optimize-images.mjs`: webp + 400/800/1200 для первого экрана, 1600 для детальных
- Перед публикацией — снять EXIF (геометка на телефонных снимках)

### Брейкпоинты, якоря, JS

- Главная, сетка карточек: 375 (1 колонка, 6 карточек подряд — длиннее на одну), 768 (2 колонки, 3 ряда — ровно), 1440 (см. D2)
- `/leistungen/`: блоки чередуются по индексу — шестой встанет зеркально пятому, якорь `#entkernung-abbrucharbeiten`
- Хлебные крошки городской страницы ведут на этот якорь — должен существовать
- Анимации появления (`ScrollReveal`, `Stagger`) — без изменений
- Форма Kontakt: в выпадающем списке станет 8 пунктов вместо 7
- Шапка: пункт «Leistungen» один, не меняется
- Баннер cookies / Google Ads — не затронуты

### Риски

1. **98 почти одинаковых страниц** — тот же подход, что у 5 услуг. Google может посчитать хвост «дорвеями». Смягчает уже существующая механика: соседние города, расстояние, «Weitere Einsatzorte», индивидуальный `einsatzgebiet`
2. **Объём против цены.** 70 € за L-задачу — держать скоуп строго по списку ниже, без галереи и допработ
3. **Перекрытие с Entrümpelung** в тексте («Entkernung mit vorheriger Entrümpelung») — это плюс для перелинковки, но заголовки не должны каннибализировать: Entrümpelung — про вещи, Entkernung — про строительные элементы
4. **Устаревшее вне скоупа:** `llms.txt` пишет «60 km», а после T009 охват 80 км — отметить, не чинить молча в этой задаче

---

## Решения CEO до старта

| # | Вопрос | Рекомендация |
|---|---|---|
| D1 | Все 98 новых страниц индексируемые? | Да, как у 5 услуг. `noindex` — только по данным GSC позже |
| D2 | Главная, 6 карточек на 1440 | `lg:grid-cols-3` → два ряда по три. Шесть в ряд на 1440 — карточки по ~200 px, длинные немецкие названия ломаются |
| D3 | Адрес | `/leistungen/entkernung-abbrucharbeiten/<city>/`, как рекомендовал клиент |
| D4 | Title длиннее 70 знаков у длинных городов | Прежняя рекомендация «safeTitle укоротит» неверна: шаблон из админки обходит `safeTitle`, а `safeTitle` длинные названия не укорачивает. Предлагаю: шаблон без хвоста бренда, длинные города оставить как у 5 существующих услуг (у них уже до 108 знаков) — Google обрежет показ, на индексацию это не влияет. Укорачивать title системно — отдельная задача: она меняет title на существующих страницах и требует объявления в сверке индексации |
| D5 | Программные блоки `BLOCKS` для новой услуги | Не писать заполнитель: `BLOCKS` → `Partial`, шаблонные услуги в генераторе не участвуют. Меньше кода, нет искусственного текста |
| D6 | Остальные 3 фото | В этой задаче не использовать (скоуп 70 €). Предложить Кевину отдельно — в Referenzen |

---

## Phase Tracker

| Фаза | Название | Статус | Проверка |
|---|---|---|---|
| Ф0 | Решения D1–D6 от CEO | ✅ | ОК CEO 13.09, приняты по рекомендациям |
| Ф1 | Данные и типы | ✅ | verify 14/14, tsc 0, тесты 281/281 |
| Ф2 | Фото | ✅ | verify 15/15, 8 webp без метаданных |
| Ф3 | Шаблон, мета, компонент, маршрут | ☐ | 98 страниц собраны, JSON-LD валиден |
| Ф4 | Перелинковка и сквозные места | ☐ | ссылки в обе стороны |
| Ф5 | Тесты | ☐ | lint 0, тесты зелёные |
| Ф6 | Индексация, вёрстка, ревью, выкатка | ☐ | parity, verify.py, Landa, живой замер |

### Ф0 — Решения CEO
**Цель:** закрыть D1–D6. **Done:** ответ CEO записан в этот файл. **Зависимости:** нет.

**Итог 13.09:** CEO — «Ок» на roadmap. D1–D6 приняты по рекомендациям из таблицы: все 98 страниц индексируемые; сетка главной `lg:grid-cols-3` (3×2); адрес `/leistungen/entkernung-abbrucharbeiten/<city>/`; title без хвоста бренда в шаблоне, длинные города как у существующих услуг; `BLOCKS` → `Partial`, без текста-заполнителя; 3 фото из 6.

### Ф1 — Данные и типы
**Цель:** услуга существует в данных и типах, сборка не падает.

**Уточнение при исполнении (13.09).** Запись в `services.json` переезжает в Ф2: `data.test.ts` проверяет, что картинки услуги и их варианты 400/800 лежат на диске, а фото готовятся в Ф2 — иначе приёмка красная между фазами. Чтобы между фазами не было ни сломанной сборки, ни адресов sitemap без страниц, в `programmatic.ts` вводятся `CITY_PAGE_SERVICE_IDS` (услуги, у которых уже есть городские страницы; `getAllPagePairs` и перекрёстные ссылки ходят по нему — новая услуга попадёт туда в Ф3) и `PROGRAMMATIC_SERVICE_IDS` (услуги с программными блоками). Тесты, которые ходят по генератору, переводятся на `PROGRAMMATIC_SERVICE_IDS` сейчас, а не в Ф5 — иначе полный прогон тестов упадёт уже после Ф1.

1. `services.json` — запись `entkernung-abbrucharbeiten` **(перенесено в Ф2)**: `title` «Entkernung & Abbrucharbeiten», `description` и `detailDescription` из вступления Кевина дословно, `icon`, `image`, `detailImage`, `imageAlt`
2. `programmatic.ts` — `ServiceId` + `SERVICE_IDS`; `BLOCKS` по решению D5
3. `meta-overrides.json` — `titlePattern` «Entkernung & Abbrucharbeiten {city}» **без** «| Rund ums Haus Littawe»: хвост дописывает `generateSEO`, иначе он встанет дважды (Osnabrück 86 знаков вместо 62). `descriptionPattern` — description Кевина с `{city}`
4. `ServiceIcons.tsx` — новая иконка, запись в `serviceIconMap`
5. `types.ts` — если затронуты типы
**Done:** `npx tsc --noEmit` без новых ошибок; `data.test`, `meta-overrides.test` обновлены и зелёные.
**Зависимости:** Ф0.

### Ф2 — Фото
**Цель:** три снимка в конвейере сайта.
1. Скопировать `4.jpeg` (hero/detail) и один портрет (карточка) в `site/public/images/services/` под именами `entkernung-hero.*`, `entkernung-card.*`
2. Снять EXIF
3. `optimize-images.mjs`: webp + 400/800/1200
4. `imageAlt`, `heroAlt` — по содержимому кадра, по-немецки, с названием услуги
**Done:** все варианты на диске; EXIF пуст (проверка скриптом); размеры — числом.
**Зависимости:** Ф1.

**Уточнение при исполнении (13.09).** Запись в `services.json` переезжает в Ф3: `ServiceDetail` берёт позиции блока из `templates/<id>.json` (`leistungen.items`), а шаблона до Ф3 нет — блок на `/leistungen/` вышел бы без позиций (тест «под каждым блоком ≥4 позиции» красный). Ф2 — только фото. Использовано 2 снимка из 6: `4.jpeg` → `entkernung-hero` (пейзаж: блок `/leistungen/` и hero городских), `6.jpeg` → `entkernung-card` (кадр 7:5, 1536×1097, сверху 700 px). Готовая запись для Ф3: `icon: hammer`, `image: entkernung-card.webp`, `detailImage: entkernung-hero.webp`, `detailDescription` — строки 9–12 текста Кевина дословно.

### Ф3 — Шаблон, мета, компонент, маршрут
**Цель:** 98 страниц услуги, Osnabrück — с текстом Кевина.
1. `templates/entkernung-abbrucharbeiten.json` — текст Кевина дословно из `docs/kevin-entkernung-text-2026-09-13.txt`, `{city}` только в городских местах; разделы со списками — `items[]`; FAQ — 11 вопросов с `cityInQuestion`
2. `lib/template-content-entkernung.ts` — `metaTitle` через `safeTitle`, `metaDescription`
3. `components/templates/EntkernungCityTemplate.tsx` — по образцу `EntruempelungCityTemplate`, разделы с необязательным списком
4. `[service]/[city]/page.tsx` — ветка `generateMetadata` + ветка рендера + `BreadcrumbList` (позиция 3 → `/leistungen/#entkernung-abbrucharbeiten`), `Service`, `FAQPage`
5. `public/admin/config.yml` — коллекция шаблона
**Done:** сборка даёт 98 страниц `/leistungen/entkernung-abbrucharbeiten/*/`; у Osnabrück title, description, H1 — дословно из текста Кевина; три JSON-LD валидны; `validate-cms-config` проходит.
**Зависимости:** Ф1, Ф2.

### Ф4 — Перелинковка и сквозные места
**Цель:** услуга видна со всего сайта, ссылки в обе стороны.
1. `weitereLeistungen.links` — +1 ссылка в 5 существующих шаблонах; в новом — 5 ссылок на остальные
2. `ServiceOverview.tsx` — импорт шаблона в `BULLETS`, сетка по D2
3. `Servicegebiet.tsx` — `SERVICE_ICONS`, `SERVICE_TITLES`
4. `StandortOsnabrueck.tsx`, `app/osnabrueck/page.tsx` — пункт услуги
5. `app/layout.tsx` — `Service` в `hasOfferCatalog`
6. `public/llms.txt`, `public/llms-full.txt` — «Hauptleistungen: 6» + раздел услуги
7. Проверить без правок: подвал, форма, `/leistungen/` — появились сами
**Done:** на каждой из 490 существующих городских есть ссылка на новую услугу того же города; на каждой новой — на 5 остальных; главная, `/leistungen/`, подвал, форма, `/einsatzgebiet/`, `/osnabrueck/` содержат услугу — проверка скриптом по сборке.
**Зависимости:** Ф3.

### Ф5 — Тесты
**Цель:** тесты отражают 6 услуг и охраняют новое.
1. Обновить: `data.test.ts:81` (6), `programmatic.example.test.ts:51,68` и `programmatic.invariant.test.ts:52-95` (588 пар / шаблонные услуги), `meta-overrides.test.ts:86`, иконки в `services.test.tsx`
2. Новые: маршрут генерирует 98 страниц услуги; ветка метаданных даёт canonical и нет `noindex`; `weitereLeistungen` — ссылки в обе стороны; в форме 8 вариантов с новой услугой
3. Дальняя городская страница Nordhorn (80 км). Проверка смотрит **только** на два куска: раздел «Entkernungsfirma …» (строки 125–137) и ответ FAQ на вопрос строки 182. Во всей странице искать нельзя — список «Weitere Einsatzorte» на существующей `entruempelung/nordhorn` уже содержит Belm и Lotte. В этих кусках запрещено: «in Nordhorn … tätig», «Osnabrücker Land», соседи Osnabrück из строк 129–135; обязательно: Twist, Meppen, Wietmarschen. Прототип — `docs/tasks/T012_nordhorn_check_prototype.py` (собирает куски из файла текста по разметке); в Ф5 переносится в `verify/` и получает куски, вырезанные из собранного HTML. Код выхода: GREEN — 0, RED — 1; флаг `--mutate-126` подкладывает дефект строки 126. В `verify/acceptance.json` проверка заводится критерием с `expect_exit: 0` — RED валит приёмку. Замер прототипа: правильные куски — GREEN, код 0; подлог «Osnabrück» → «Nordhorn» в строке 126 — RED «есть „in Nordhorn … tätig“», код 1
4. Проверка дословности: каждое предложение `docs/kevin-entkernung-text-2026-09-13.txt` (кроме служебных строк «Neue Unterseite / Empfohlene URL / SEO-Titel / Meta Description») есть на собранной странице Osnabrück; проверка скриптом, падает на подложенной правке одного слова
**Done:** каждый новый тест сначала падает на коде без реализации (RED), затем зелёный; `npm run lint` 0 ошибок; `npm run test` без failed.
**Зависимости:** Ф1–Ф4 (тесты пишутся перед кодом каждой фазы).

### Ф6 — Индексация, вёрстка, ревью, выкатка
**Цель:** ничего не потеряно, новое индексируемо и выглядит как сайт.
1. Сборка: 715 HTML, sitemap 609 адресов (скриптом)
2. `check_migration_parity.py` — новый слепок против эталона: пропало 0; если сдвинулись CSS/JS на общих страницах — объявить поимённо
3. Новые страницы: canonical на себя, без `noindex`, title/description/H1, JSON-LD валиден — все 98, скриптом
4. `check_layout_mobile`, `check_no_sideways` (6 ширин), `check_type_weights`, `check_eyebrow_not_dup` — с новыми страницами
5. Снимки 375/768/1440: главная (сетка), `/leistungen/` (6-й блок), `/leistungen/entkernung-abbrucharbeiten/osnabrueck/`, один дальний город
6. `verify.py` → 100 %
7. Ланда: круг 1, круг 2 (Закон 31 — дальше долг)
8. Выкатка; живой замер: новые адреса 200, есть в sitemap, живые проверки T011 (баннер, конверсия) не сломались
9. Кевину — ссылка на страницу Osnabrück; запрос индексации в GSC — вручную
**Done:** parity БИНАРНО 1; verify.py 100 %; вердикт Ланды GO; живой замер зелёный.
**Зависимости:** Ф5.

---

## Чеклист приёмки

- [ ] `/leistungen/entkernung-abbrucharbeiten/osnabrueck/` отдаёт 200; title = «Entkernung & Abbrucharbeiten Osnabrück | Rund ums Haus Littawe» (62 знака, хвост один раз); description и H1 — дословно из `docs/kevin-entkernung-text-2026-09-13.txt`
- [ ] Страница Nordhorn: нет «in Nordhorn … tätig», нет «Osnabrücker Land», соседи — Nordhorns, не Osnabrücks
- [ ] 98 страниц услуги в сборке и в sitemap; canonical на себя; `noindex` нет
- [ ] BreadcrumbList, Service, FAQPage валидны на всех 98
- [ ] Главная: 6 карточек, на 1440 два ряда по три; 375/768 без сдвига вбок
- [ ] `/leistungen/`: блок и якорь `#entkernung-abbrucharbeiten`
- [ ] Подвал, форма (8 вариантов), `/einsatzgebiet/`, `/osnabrueck/` содержат услугу
- [ ] 490 существующих городских ссылаются на новую услугу своего города; новые — на 5 остальных
- [ ] Кевин правит тексты новой услуги в админке; `validate-cms-config` проходит
- [ ] Фото без EXIF, варианты webp на месте
- [ ] parity: пропало 0 из 617 страниц и 511 адресов
- [ ] lint 0 ошибок, тесты без failed, verify.py 100 %
- [ ] Ланда GO; живой замер после выкатки зелёный; баннер cookies и конверсия Google Ads работают
