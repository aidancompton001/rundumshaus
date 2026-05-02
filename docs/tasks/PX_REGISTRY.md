# Task Registry — RundumsHaus
> Пронумерованный реестр всех PX-задач от CEO.
## Как пользоваться
1. Перед добавлением — посмотри последний номер PX-NNN
2. Нумерация — продолжай с последнего + 1
3. Формат — копируй PX-формулировку AS IS
4. Статус — обновляй при завершении
---

## PX-014
**Дата:** 2026-04-16
**Статус:** завершено
**DEVLOG:** S018
**Источник:** чат CEO, 2026-04-16

---
**PX-014**
**Задача:** Деплой сайта RundumsHaus на домен клиента rundumshaus-littawe.de (IONOS → GitHub Pages)
**Контекст:** DNS-панель IONOS (доступы в docs/CREDENTIALS.md), GitHub Pages repo (aidancompton001/rundumshaus), GitHub Actions CI/CD, Pages CMS
**Проблема:** Сайт клиента доступен только по техническому URL (aidancompton001.github.io/rundumshaus). На домене rundumshaus-littawe.de висит чужой WordPress-сайт ("1-2-3 Gebäudemanagement GmbH"). Клиент не может показать свой сайт заказчикам по своему домену. CMS-деплой через GitHub не проверен на боевом домене.
**Цель:** Сайт RundumsHaus доступен по https://rundumshaus-littawe.de, HTTPS работает, старый чужой сайт заменён. Полный pipeline работает: push/CMS-коммит → GitHub Actions → GitHub Pages → виден на домене.
**Скоуп:**
- Залогиниться в IONOS, найти DNS-настройки домена rundumshaus-littawe.de
- Удалить/изменить существующие DNS-записи, указывающие на старый WordPress-хостинг
- Создать A-записи и/или CNAME на GitHub Pages (185.199.108-111.153 + CNAME)
- Добавить файл CNAME в repo (rundumshaus-littawe.de)
- Включить custom domain в настройках GitHub Pages repo
- Включить Enforce HTTPS в GitHub Pages
- Дождаться DNS propagation
- Тест 1: открыть https://rundumshaus-littawe.de — сайт отображается корректно
- Тест 2: сделать тестовый push в repo → убедиться что GitHub Actions отрабатывает → изменения видны на домене
- Тест 3: сделать тестовое изменение через Pages CMS → коммит → автодеплой → видно на домене
- Проверить www-поддомен (www.rundumshaus-littawe.de → редирект или тоже работает)
**Ограничения:**
- НЕ трогать содержимое сайта (код, контент, стили)
- НЕ менять GitHub repo структуру
- НЕ переносить repo на другой аккаунт (это будет отдельная задача позже)
- Учесть: DNS propagation может занять до 24-48 часов (обычно 15-60 мин)
- Учесть: IONOS может иметь свой формат DNS-панели — действовать по ситуации
- Старый WordPress-сайт исчезнет автоматически при смене DNS — это ожидаемое поведение, он не наш
**Рекомендуемый промпт:** P0 (инфраструктурная задача — настройка, деплой, DevOps) или P1 (пошаговое выполнение с проверкой)
---

## PX-015
**Дата:** 2026-04-16
**Статус:** завершено
**DEVLOG:** S020
**Источник:** чат CEO, 2026-04-16

---
**PX-015**
**Задача:** Визуальная инструкция для клиента — PDF-гайд по редактированию сайта через Pages CMS (со скриншотами, в бренд-стиле сайта)
**Контекст:** `docs/ANLEITUNG_KEVIN.md` (существующая текстовая инструкция на немецком из T003), `app.pagescms.org` (CMS-интерфейс), `.pages.yml` (6 коллекций: Firmendaten, Startseite, Weitere Dienstleistungen, Hauptleistungen, Referenzen, Kontaktformular), бренд-палитра V2 (Navy #1B3A5C, Green #4A8B3F, White, Gold #D4A843)
**Проблема:** Существующая инструкция `ANLEITUNG_KEVIN.md` — чисто текстовая, на Markdown. Для нетехнического клиента Kevin'а текстовая инструкция без визуалов недостаточно понятна. Нужна красивая визуальная инструкция в стиле сайта со скриншотами, которую можно сохранить как PDF и отправить клиенту. Клиент должен сам понять как: менять тексты (Firmendaten, Startseite, Leistungen), добавлять новые Weitere Leistungen, добавлять Referenzen (фото vorher/nachher + текст), загружать картинки.
**Цель:** Один HTML-файл в бренд-стиле сайта (палитра V2: Navy/Green/White/Gold, шрифты проекта), со вставленными скриншотами, на немецком языке. CEO открывает в браузере → Save as PDF → отправляет Kevin'у. Инструкция покрывает ВСЕ сценарии редактирования. Также ревью + улучшение существующей ANLEITUNG_KEVIN.md.
**Скоуп:**
- Прочитать существующую `docs/ANLEITUNG_KEVIN.md` — оценить полноту, упростить формулировки где нужно
- Создать HTML-файл (self-contained, inline CSS) в бренд-стиле RundumsHaus (палитра V2, шрифты)
- Структура гайда: Anmelden, Firmendaten, Startseite, Hauptleistungen, Weitere Dienstleistungen, Referenzen, Bilder hochladen, Kontaktformular-Texte
- Места для скриншотов — пронумерованные плейсхолдеры
- Список скриншотов для CEO: какие экраны снять, в каком порядке
- После получения скриншотов — вставить в HTML
**Ограничения:**
- Язык: только Deutsch
- HTML = self-contained (inline CSS, base64 images или relative paths)
- НЕ менять .pages.yml, НЕ менять код сайта
- Стиль = бренд RundumsHaus (НЕ generic)
- Скриншоты делает CEO, путь: `img/anleitung/screen-N.png`
**Рекомендуемый промпт:** P1 с `ui-ux-pro-max`
---

## PX-016
**Дата:** 2026-04-16
**Статус:** новая
**DEVLOG:** —
**Источник:** чат CEO, 2026-04-16

---
**PX-016**
**Задача:** Фикс вёрстки ANLEITUNG_KEVIN.html — убрать пустоты, исправить page breaks для PDF
**Контекст:** `docs/ANLEITUNG_KEVIN.html` — визуальная инструкция для клиента, сохраняется как PDF через браузер (Ctrl+P → Save as PDF)
**Проблема:** При сохранении в PDF инструкция выглядит криво: большие пустые пространства между секциями, page breaks разрывают контент посередине — секция начинается внизу одной страницы, а продолжается на следующей. Скриншот CEO подтверждает: gap'ы между текстом и скриншотами, разрывы страниц внутри секций.
**Цель:** Инструкция плотно заполнена — каждая страница PDF содержит максимум информации без пустот. Секции не разрываются между страницами.
**Скоуп:**
- CSS `page-break-inside: avoid` на секции/карточки
- `page-break-before/after` для управления разрывами
- Убрать лишние margin/padding — уплотнить контент
- Скриншоты не создают gap'ов (max-width, object-fit)
- Скриншот + подпись = один неразрывный блок
- Тест: Chrome → Ctrl+P → Print Preview — плотные страницы без пустот
**Ограничения:**
- НЕ менять контент/текст — только CSS/layout
- НЕ менять бренд-стиль
- Должно хорошо выглядеть И в браузере, И в PDF
**Рекомендуемый промпт:** P2 с `ui-ux-pro-max`
---

## PX-017
**Дата:** 2026-04-16
**Статус:** новая
**DEVLOG:** —
**Источник:** чат CEO, 2026-04-16 (запрос Kevin)

---
**PX-017**
**Задача:** DSGVO Cookie Consent Banner — простая всплывающая плашка для согласия с cookies
**Контекст:** `site/src/app/layout.tsx` (корневой layout), `site/src/components/` (новый CookieBanner), `site/src/app/datenschutz/page.tsx` (ссылка). GitHub Pages — только функциональные cookies, нет аналитики, нет tracking, нет Google Fonts (локально).
**Проблема:** На сайте нет Cookie Consent баннера. По DSGVO сайт обязан информировать посетителей об использовании cookies. Kevin как владелец бизнеса в Германии должен соблюдать DSGVO. Клиент прямо попросил этот элемент.
**Цель:** При первом посещении — компактная плашка внизу: текст + кнопка "Akzeptieren" + ссылка на /datenschutz. После принятия — localStorage, баннер не показывается повторно. Без категорий, без toggle'ов, без внешних сервисов.
**Скоуп:**
- Создать CookieBanner.tsx — fixed bottom плашка
- Текст на немецком: "Diese Website verwendet Cookies..."
- Кнопка "Akzeptieren" → localStorage cookie-consent-accepted
- Ссылка "Datenschutz" → /datenschutz
- Стилизация в палитре V2, CSS transition (slide-up/fade-in)
- z-index > WhatsApp-кнопки (z-50 vs z-40)
- Mobile responsive 375px
- Встроить в layout.tsx (client component)
- Тест: рендер + скрытие после клика
**Ограничения:**
- НЕ устанавливать внешние библиотеки (Cookiebot, OneTrust и т.д.)
- НЕ добавлять категории cookies / toggle'и — нечего отключать
- НЕ менять /datenschutz
- НЕ конфликтовать с WhatsApp-кнопкой
- Только Tailwind CSS 4
**Рекомендуемый промпт:** P1 (фича, размер S-M)
---

## PX-018
**Дата:** 2026-04-20
**Статус:** завершено
**DEVLOG:** S022
**Источник:** чат CEO, 2026-04-20 (WhatsApp от Kevin 14:20-15:52)

---
**PX-018**
**Задача:** Обновление физического адреса и названия компании на сайте — Bramscher Str. 161, 49090 Osnabrück
**Контекст:**
- `site/src/data/site.json` — глобальные данные (название, адрес, контакты)
- `site/src/app/impressum/` — Impressum (§5 TMG)
- `site/src/app/datenschutz/` — Datenschutz (DSGVO Art. 13)
- `site/src/app/layout.tsx` — meta, Open Graph, structured data (schema.org LocalBusiness/PostalAddress)
- `site/src/app/kontakt/` — контакты
- `site/src/components/sections/Footer.tsx` — футер
- `site/src/components/sections/ContactForm.tsx` — блок контактов
- Все места с "49074 Osnabrück"
- CLAUDE.md и docs/
**Проблема:** Везде на сайте неполный адрес `49074 Osnabrück` (только PLZ, без улицы). Kevin прислал физический адрес: Bramscher Str. 161, 49090 Osnabrück. Критично для Impressum (§5 TMG — ladungsfähige Anschrift, штраф до 50 000€) и для Datenschutz. Также расхождение в названии: Kevin пишет "Rund ums Haus Littawe" (без апострофа), на сайте "Rundum's Haus Littawe" (с апострофом).
**Цель:**
1. Физический адрес Bramscher Str. 161, 49090 Osnabrück указан везде где должен быть физический адрес
2. Service area "Osnabrück und Umgebung" остаётся как описание зоны обслуживания
3. Название согласовано с тем как пишет Kevin — единый вариант
4. Старый неполный адрес заменён везде
**Скоуп:**
- Подтвердить у CEO окончательное название (с апострофом / без)
- Grep "49074 Osnabrück" — каждое место проанализировать (физический адрес vs зона обслуживания)
- site.json: street, postal_code, city поля
- Impressum: полный адрес Kevin Littawe
- Datenschutz: Verantwortlicher с полным адресом
- structured data: schema.org PostalAddress (streetAddress, postalCode, addressLocality, addressCountry)
- Meta tags / OG где упоминается адрес
- Footer + Kontakt: адрес с улицей
- CLAUDE.md: обновить
- Tests: обновить если проверяют адрес
- Build + Tests зелёные
**Ограничения:**
- НЕ удалять "Osnabrück und Umgebung" — это зона обслуживания
- НЕ менять телефон, email, WhatsApp
- НЕ трогать услуги — отдельная задача когда Kevin пришлёт список
- 49074 ≠ 49090 — разные PLZ, нужен контекст
- Impressum требует ladungsfähige Anschrift (физический адрес)
**Рекомендуемый промпт:** P1 (размер M)
---

## PX-019
**Дата:** 2026-04-21
**Статус:** частично завершено
**DEVLOG:** S023
**Источник:** чат CEO, 2026-04-21 (технический аудит performance/a11y)

---
**PX-019**
**Задача:** Критическая оптимизация изображений и производительности — LCP/mobile, WebP, responsive images, a11y
**Контекст:**
- `site/public/images/` (~87 MB): hausmeisterservice.png 5 648KB (+webp 287KB не используется), schrottabholung.png 5 618KB (нет webp), gartenpflege.png 1 096KB (+webp 254KB не используется), dacharbeiten.jpg 1 039KB (нет webp), entruempelung.jpg 942KB (нет webp), about.png 1 410KB above fold (нет webp), detail-garten.png 9 412KB, detail-hausmeister.png 7 168KB, og-image.png 5 500KB
- `site/src/components/sections/` Hero.tsx, ServiceOverview.tsx, ServiceDetail.tsx, About.tsx — компоненты с `<img>`
- `site/src/app/layout.tsx` — meta OG, preload hints
- Next.js 16 `output: 'export'` — `next/image` runtime отключён
**Проблема:**
1. LCP mobile = 9.3s (должно <2.5s)
2. Homepage payload ~17 MB
3. WebP для 2 файлов лежит рядом, код использует .png (потеря 77-95%)
4. Нет `<picture>`/srcset — mobile качает desktop-разрешение
5. Нет `fetchpriority="high"` на LCP-кандидате
6. Detail-images 9.4MB тормозят /leistungen/*
7. og-image 5.5MB — тормоза при WhatsApp/FB шаринге
8. A11y 92/100: Prohibited ARIA (MEDIUM), color contrast gold на cream (MEDIUM)
9. Unused JavaScript 150ms на mobile
**Цель:**
- LCP mobile <2.5s, desktop <1.5s
- Homepage payload <3 MB (экономия ~80%)
- Все изображения WebP + fallback через `<picture>`
- Responsive srcset (mobile 400-600px, desktop 1200-1600px)
- LCP preload + fetchpriority="high"
- og-image <500 KB
- Detail <500 KB каждое
- A11y ≥98/100
- 0 unused JS warnings
**Скоуп:**
Wave 1 (конвертация): WebP для schrottabholung, about (+responsive 400/800/1200), dacharbeiten, entruempelung, detail-garten (<500KB), detail-hausmeister (<500KB); AVIF опционально; og-image 1200×630 <500 KB
Wave 2 (код): `<picture>` с `<source type="image/webp">` везде где `<img>`; above-the-fold — loading="eager" + fetchpriority="high" + decoding="sync"; srcset + sizes; preload LCP в layout.tsx
Wave 3 (a11y): grep aria-*, валидация; WCAG calc для gold/cream; Lighthouse+axe до 0 errors
Wave 4 (JS): @next/bundle-analyzer, удалить unused imports, lazy load не-above-the-fold компонентов
Wave 5 (верификация): Lighthouse mobile+desktop ≥90, payload <3MB, DevTools Network check, тесты pass
**Ограничения:**
- НЕ удалять оригинальные PNG/JPG (fallback для старых браузеров)
- НЕ ставить heavy runtime либы
- НЕ нарушать `output: 'export'` — только client-side решения
- Конвертация через CLI (sharp / cwebp / squoosh) — скрипт `scripts/optimize-images.ts` или однократно вручную
- НЕ менять дизайн/компоновку — только форматы/атрибуты
- Pages CMS uploads от Kevin: либо CI auto-конвертация, либо инструкция обновлена
**Размер:** XL (кросс-доменная + ланда-ревью архитектуры `<picture>` vs custom loader)
**Рекомендуемый промпт:** P0 (roadmap с waves) или P9 (параллельные waves 1-4)
---

## PX-020
**Дата:** 2026-04-21
**Статус:** завершено
**DEVLOG:** S024
**Источник:** чат CEO, 2026-04-21 (2 скриншота: mobile меню + broken image Gartenpflege)

---
**PX-020**
**Задача:** Фикс мобильного меню (hamburger) + сломанная картинка на Gartenpflege
**Контекст:**
- `site/src/components/layout/Navbar.tsx` (или MobileMenu.tsx) — открывающееся меню на мобильной версии
- `site/src/components/sections/ServiceDetail.tsx` — детальная карточка услуги
- `site/src/data/services.json` — поля `image` и `detailImage` для Gartenpflege
- `site/public/images/services/` — detail-garten.png, gartenpflege.webp
- Hero.tsx — фон под меню
**Проблема:**
BUG 1 — Mobile-меню: при открытии hamburger справа пункты меню висят без backdrop/подложки поверх hero, налезают на контент страницы (кнопка "Kontakt" торчит из контента), нет padding между пунктами, нет адаптации — меню выглядит как "вывалившееся", а не как отдельный слой
BUG 2 — Картинка Gartenpflege: broken image placeholder "?" вместо фото на детальной карточке — файл не найден / path сломан / 404
**Цель:**
1. Mobile меню: backdrop overlay + solid bg панель, нормальные отступы, меню перекрывает viewport, контент не виден сквозь меню
2. Картинка Gartenpflege отображается корректно (без placeholder)
**Скоуп:**
Wave 1 (меню):
- Backdrop: `fixed inset-0 bg-black/70 backdrop-blur-sm`
- Контейнер меню: solid bg (navy или white), z-60
- Отступы: py-4 px-6 между пунктами
- Fullscreen или slide-in справа (75-80% viewport)
- Клик по backdrop + X = закрытие
- Fade-in backdrop + slide-in панель
- Тест на 375px / 390px / 768px
Wave 2 (картинка):
- services.json — проверить image/detailImage для Gartenpflege
- public/images/services/ — проверить наличие файлов
- Исправить path или восстановить файл
- Проверить остальные 4 услуги на аналогичную проблему
- DevTools Network → 200 OK для всех images на /leistungen
**Ограничения:**
- НЕ менять бренд-палитру V2
- НЕ менять desktop Navbar (работает)
- НЕ менять контент меню
- Только Tailwind CSS 4
- z-index: меню > CookieBanner (z-50) > WhatsApp (z-40)
- Тесты не сломать
**Размер:** M (2 локальных бага)
**Рекомендуемый промпт:** P2 (bug fix) с `ui-ux-pro-max`
---

## PX-021
**Дата:** 2026-04-30
**Статус:** завершено (W1+W2 код + W3 GSC manual ops)
**DEVLOG:** S025
**Источник:** чат CEO + WhatsApp Kevin 2026-04-30 09:13-11:44

---
**PX-021**
**Задача:** Контент-апдейт от Kevin: реструктуризация Leistungen + 97 городов зоны обслуживания (отдельная страница /einsatzgebiet) + Google Search Console верификация через IONOS DNS
**Контекст:**
- `site/src/app/leistungen/page.tsx`, `site/src/app/weitere-leistungen/page.tsx` (удалить/redirect), `site/src/components/sections/WeitereLeistungen.tsx`
- `site/src/components/layout/Navbar.tsx`, `Footer.tsx`, `site/src/data/site.json` — навигация
- `site/src/data/weitere-leistungen.json` (остаётся), новый `site/src/data/service-areas.json`
- `site/src/app/einsatzgebiet/page.tsx` (новая страница), `site/src/app/sitemap.ts`
- `site/src/app/layout.tsx` — structured data LocalBusiness areaServed
- IONOS DNS-панель (docs/CREDENTIALS.md) — TXT-запись Google verification
- search.google.com/search-console — аккаунт CEO (ebaias.muc@gmail.com)
- Google Unternehmensprofil — уже настроен (Kevin добавил CEO админом)
**Проблема:**
1. UX навигации: Weitere Leistungen — отдельная страница в Navbar, разделяет услуги. Kevin хочет: посетитель видит сначала 5 Hauptleistungen на /leistungen, ниже — 9 Weitere
2. Зона обслуживания не отображена: общая фраза "Osnabrück und Umgebung 60km" — нет 97 конкретных городов. Критично для local SEO ("Hausmeister Bramsche", "Gartenpflege Melle" и т.д.)
3. Google Search Console: Kevin не смог отправить email-инвайт (3 попытки failed). CEO делает сам через IONOS DNS verification. Без SC: нет sitemap submission, нет insights, нет crawl errors
**Цель:**
1. /leistungen: 5 Hauptleistungen + ниже секция Weitere Leistungen (9 услуг). /weitere-leistungen → 301 redirect на /leistungen#weitere. Из Navbar пункт убран
2. Новая страница /einsatzgebiet с 97 городами для SEO + ссылка из Footer
3. Search Console verified, sitemap.xml submitted, индексация запущена
**Скоуп:**
Wave 1 — Реструктуризация Leistungen:
- Перенести WeitereLeistungen компонент на /leistungen (нижняя часть, якорь #weitere)
- Удалить /weitere-leistungen page → 301 redirect
- Убрать пункт из site.json navigation, Navbar, Footer
- Sitemap: убрать или hash-якорь
- Тесты: nav 5→4, секция Weitere на /leistungen
Wave 2 — /einsatzgebiet (97 городов):
- service-areas.json: массив 97 городов (полный список от CEO)
- Новая страница /einsatzgebiet — SEO-friendly: H1 "Einsatzgebiet — Hausmeisterservice in 97 Städten rund um Osnabrück", grid/columns с городами, текст про 60km Umkreis, CTA Kontakt
- Ссылка из Footer "Einsatzgebiet" + из site.json при необходимости
- Structured data layout.tsx: LocalBusiness.areaServed = массив City schema.org
- Mobile responsive — multi-column grid на desktop, single-column mobile
- Sitemap.ts добавить /einsatzgebiet
- Meta: title/description для local SEO ("Hausmeisterservice in Osnabrück, Bramsche, Melle und 94 weiteren Städten")
- Тест: 97 городов в DOM, structured data валидно
Wave 3 — Google Search Console + IONOS DNS:
- search.google.com/search-console (ebaias.muc@gmail.com): добавить Domain property rundumshaus-littawe.de
- Получить TXT-запись google-site-verification=...
- IONOS DNS: добавить TXT-запись на корневой домен (НЕ конфликтуя с SPF/DMARC)
- Дождаться propagation (15-60 мин)
- Verify ownership в Search Console
- Submit sitemap: rundumshaus-littawe.de/sitemap.xml
- Request indexing основных страниц (/, /leistungen, /einsatzgebiet, /referenzen, /kontakt)
- Записать в docs/SEO.md или CREDENTIALS.md
- Проверить Google Unternehmensprofil админ-доступ
**Ограничения:**
- НЕ удалять weitere-leistungen.json (переиспользуется)
- НЕ менять контент 9 услуг и 5 Hauptleistungen
- 97 городов — один источник правды (service-areas.json), не дубль
- TXT-запись Google не должна ломать существующие TXT (SPF/DMARC)
- Тесты обновить (nav count, новые маршруты)
- Sitemap в SC обязательно после деплоя страницы /einsatzgebiet
**Размер:** L (3 wave, кросс-модульная)
**Рекомендуемый промпт:** P0 (roadmap → ОК → waves) или P9 (Wave 1-2 параллельно, Wave 3 sequential)
---

## PX-022
**Дата:** 2026-05-01
**Статус:** завершено (код deployed, ждём 2-4 недели для GSC данных)
**DEVLOG:** S026
**Источник:** WhatsApp Kevin 2026-04-20 (заказ 150€) + 2026-04-30/05-01 (уточнение скоупа)

---
**PX-022**
**Задача:** Local SEO Basis-Paket — оптимизация контента сайта под локальные поисковые запросы для двух приоритетных услуг (Gartenpflege/Gärtner и Entrümpelung/Entrümpelungsfirma) в ближнем радиусе вокруг Osnabrück (~25км, 6-7 городов)

**Контекст:**
- `site/src/data/services.json` — поле `detailDescription` для услуг `gartenpflege` и `entruempelung`
- `site/src/data/site.json` — мета-теги, structured data
- `site/src/app/leistungen/page.tsx` — рендер ServiceDetail + WeitereLeistungenSection
- `site/src/components/sections/ServiceDetail.tsx` — рендер услуг (расширяем тексты для 2 целевых)
- `site/src/app/layout.tsx` — schema.org LocalBusiness (areaServed уже массив 97 городов после T005)
- `site/src/data/service-areas.json` — данные регионов (создан в T005, регион "Osnabrücker Land & Umgebung" содержит целевые города)
- НОВОЕ: `site/src/components/sections/ServiceFAQ.tsx` — FAQ-секция под каждую из 2 целевых услуг
- НОВОЕ: `site/src/data/service-faq.json` — данные вопросов/ответов с локальными ключами
- Коммерческая договорённость: 150€ Basis (Kevin подтвердил 2026-04-20 13:48 WhatsApp)

**Проблема:**
- Сейчас сайт ranking'ует только по общим запросам типа "Hausmeisterservice Osnabrück" — не находится по локальным комбинациям типа "Gärtner in Bramsche", "Entrümpelungsfirma in Melle"
- Kevin тратит много времени на поездки на 50км для осмотра заказов — хочет больше клиентов из ближнего радиуса (Osnabrück + 5 ближайших городов)
- Local SEO базовый уровень не сделан: нет упоминаний городов в детальных описаниях услуг, нет FAQ-секций с локальными запросами, мета-теги не оптимизированы под комбинации "услуга + город"
- /einsatzgebiet (созданная в T005) даёт географию, но не связывает её с конкретными услугами — Google нужны контентные сигналы "услуга X в городе Y"

**Цель:**
- Сайт ranking'ует в топе Google по запросам типа: "Gärtner Bramsche", "Gärtner Melle", "Entrümpelungsfirma Bissendorf", "Entrümpelung Wallenhorst" и аналогичным
- Контент сайта семантически связывает услуги Gartenpflege и Entrümpelung с конкретными городами через тексты, FAQ и мета-теги
- Kevin получает больше заказов из ближнего радиуса (≤25км), сокращая время на поездки
- Через 2-4 недели в Google Search Console появляются новые impressions/clicks по локальным запросам

**Скоуп:**
- Wave 1 — Расширенные тексты в `services.json`:
  - `detailDescription` для `gartenpflege` (~150-200 слов): упомянуть 6 целевых городов в контексте Garten/Hecke/Rasen, natural keyword density для "Gärtner + Stadt"
  - `detailDescription` для `entruempelung` (~150-200 слов): упомянуть 6 целевых городов в контексте Haushaltsauflösung/Keller, natural keyword density для "Entrümpelungsfirma + Stadt"
  - НЕ трогать остальные 3 услуги
- Wave 2 — FAQ-секция (новый компонент):
  - `service-faq.json` с FAQ под Gartenpflege (5-7 вопросов с локальными ключами)
  - FAQ под Entrümpelung (5-7 вопросов с локальными ключами)
  - Компонент `ServiceFAQ.tsx` (accordion / раскрывающиеся вопросы)
  - Schema.org `FAQPage` JSON-LD для каждой FAQ-секции
  - Встроить FAQ в страницу /leistungen рядом с двумя целевыми услугами
- Wave 3 — Мета-теги и SEO:
  - `metadata` в `/leistungen/page.tsx`: title и description с упоминанием ключевых городов и обеих приоритетных услуг
  - Локализованные H2/H3 заголовки на странице
  - Schema.org Service entries: добавить areaServed (массив 6 целевых городов) к двум целевым услугам
- Wave 4 — Список 6-7 целевых городов:
  - Osnabrück, Bramsche, Melle, Georgsmarienhütte, Bissendorf, Wallenhorst, Belm
  - Все уже в service-areas.json (регион "Osnabrücker Land & Umgebung")
  - Утилита/константа TARGET_CITIES для извлечения подмассива
- Wave 5 — Тесты и верификация:
  - Тест: services.json содержит упоминания 6 целевых городов для двух услуг
  - Тест: service-faq.json валидный, ≥5 вопросов под каждую услугу
  - Тест: рендер ServiceFAQ
  - Build OK, 110+ тестов pass
  - Lighthouse SEO ≥95 на /leistungen
  - Submit обновлённый sitemap в GSC

**Ограничения:**
- НЕ создавать отдельные URLs / landing pages (это premium-вариант ≥300€, Kevin выбрал Basis за 150€)
- НЕ трогать 3 другие услуги (Hausmeister, Dacharbeiten, Schrottabholung)
- НЕ менять структуру навигации
- НЕ трогать палитру / дизайн / шрифты — CEO явно запретил
- НЕ удалять/менять /einsatzgebiet
- НЕ keyword stuffing — текст должен читаться естественно для клиентов
- Все тексты на немецком (Deutsch only)
- Kevin ездит 50км для осмотра — в FAQ подчеркнуть kostenlose Besichtigung / kurze Anfahrt как преимущество
- Через 2-4 недели после деплоя — повторный анализ GSC

**Рекомендуемый промпт:** P0 (roadmap → ОК → исполнение по waves)
---

## PX-023
**Дата:** 2026-05-01
**Статус:** завершено
**DEVLOG:** S027
**Источник:** WhatsApp Kevin 2026-05-01 14:53-14:54

---
**PX-023**
**Задача:** 2 правки контента от Kevin: Besichtigung-Radius 25→60km + удаление FAQ "Wertgegenstände bei Entrümpelung"
**Контекст:**
- `site/src/data/services.json` — поле detail/faq для услуги Entrümpelung
- `site/src/data/weitere-leistungen.json` (если там Entrümpelung)
- `site/src/data/service-faq.json` (создан в PX-022)
- `site/src/components/sections/ServiceDetail.tsx`, `ServiceFAQ.tsx` — рендер FAQ
- Поиск всего сайта на "25 km" / "25km" — возможно meta description, FAQ Besichtigung, контактный блок
**Проблема:**
1. Где-то на сайте: "Eine Besichtigung vor Ort ist im gesamten Umkreis von rund 25 km" — Kevin: реальный радиус Besichtigung = 60km (полный Einsatzgebiet)
2. FAQ "Werden Wertgegenstände bei der Entrümpelung angerechnet?" с ответом про Endabrechnung — Kevin не учитывает Wertgegenstände, просто entsorgt → ложное ожидание клиентов
**Цель:**
1. Везде "25 km" в контексте Besichtigung → "60 km"
2. FAQ "Wertgegenstände" + ответ полностью удалены из секции Entrümpelung
3. Визуальная проверка на live домене
**Скоуп:**
- Grep "25 km" / "25km" / "25 Kilometer" — оценить контекст каждого вхождения
- Заменить на "60 km" только где про Besichtigung
- Открыть services.json / service-faq.json → FAQ Entrümpelung → удалить запись Wertgegenstände
- Проверить рендер не сломался (длина массива)
- Build + tests + snapshot update
- Деплой → live проверка https://rundumshaus-littawe.de
- Проверка mobile 375px
**Ограничения:**
- НЕ менять остальной контент Entrümpelung
- НЕ менять другие FAQ
- НЕ трогать "60 km" в Hero/Einsatzgebiet/structured data — там правильно
- "25 km" вне контекста Besichtigung — спросить CEO, не blind replace
- Build + тесты не сломать
- Обязательно визуальная проверка на live
**Размер:** S (2 правки JSON, ~10 минут)
**Рекомендуемый промпт:** P8 или P2
---

## PX-024
**Дата:** 2026-05-01
**Статус:** завершено
**DEVLOG:** S028
**Источник:** Google Rich Results Test (после PX-023 deploy) — 2 optional warnings на LocalBusiness

---
**PX-024**
**Задача:** Дополнить Schema.org LocalBusiness optional полями `priceRange` и `image` (Google Rich Results 2 minor warnings)
**Контекст:** `site/src/app/layout.tsx` — JSON-LD LocalBusiness structured data
**Проблема:** Google Rich Results Test предупреждает: "Отсутствует `priceRange` (необязательно)" и "Отсутствует `image` (необязательно)". Снижает качество Knowledge Panel / Google Maps / Local Pack отображения
**Цель:** Добавить оба optional поля → 0 предупреждений; лучшая выдача в Google
**Скоуп:**
- `image: "https://rundumshaus-littawe.de/images/og-image.jpg"` (1200×630, существует)
- `priceRange: "€€"` (средний)
**Ограничения:** не трогать остальные поля Schema, не вводить новые URL
**Размер:** S
**Рекомендуемый промпт:** P8 (мелкая правка)
---

## PX-025
**Дата:** 2026-05-01
**Статус:** roadmap (T007, ожидает ОК CEO)
**DEVLOG:** —
**Roadmap:** [T007_ultra_seo_ai_search.md](T007_ultra_seo_ai_search.md)
**Источник:** WhatsApp Kevin 2026-05-01 21:19-21:50 (Ultra SEO Option B = 450€ доплата → 600€ total за SEO)

---
**PX-025**
**Задача:** Ultra-Premium Local SEO + AI-Search Optimization — региональное лидерство в Niedersachsen/NRW (Osnabrück + 60km Umkreis), включая ChatGPT Search / Perplexity / Claude / Gemini, programmatic landing pages, ratgeber-блог, backlinks, multi-engine indexing, доказательство результата
**Коммерч.:** 450€ доплата (600€ total за SEO с учётом 150€ Basis из PX-022) — Kevin подтвердил 2026-05-01 21:48 ("machen wir das volle Programm")
**Контекст:**
- Текущее состояние: PX-022 Basis Local SEO выполнен (Gartenpflege/Entrümpelung × 7 городов + FAQ Schema), PX-021 /einsatzgebiet с 97 городами, GSC verified, Lighthouse SEO 100, 47 keywords от Kevin
- Файлы:
  - layout.tsx, leistungen/page.tsx, ServiceDetail.tsx, ServiceFAQ.tsx, einsatzgebiet/page.tsx
  - data: services.json, service-faq.json, service-areas.json, homepage.json, site.json
  - lib/targetCities.ts, lib/seo.ts
  - sitemap.ts, robots.txt
  - НОВОЕ: app/leistungen/[service]/[city]/page.tsx (programmatic, generateStaticParams)
  - НОВОЕ: app/ratgeber/[slug]/page.tsx + data/ratgeber/*
  - НОВОЕ: public/llms.txt + llms-full.txt (Anthropic стандарт для AI-краулеров)
  - НОВОЕ: data/local-keywords.json
- Внешние: GSC, Bing Webmaster, Yandex Webmaster, Perplexity Sources, GBP, каталоги (Cylex, 11880, Das Örtliche, GoYellow, Yelp DE, Gelbe Seiten)
**Проблема:**
1. Google: не ranking'ует по дальним "услуга+город" парам (Bielefeld, Münster, Rheine, Vechta), низкие позиции даже по ближним
2. Нет programmatic SEO: 97 городов × 5 услуг = 485 long-tail комбинаций — у нас только 1 страница со всем сразу
3. AI Search слепое пятно: ChatGPT/Perplexity/Claude/Gemini не упоминают сайт. Нет llms.txt, контент не AI-friendly (answer-first), нет регистрации в LLM-источниках
4. Только GSC: Bing (10-15% DACH), Yandex, Ecosia не охвачены
5. Нет backlinks: сайт "островной", низкий Domain Authority
6. Нет content-marketing/блога под long-tail ("Wie oft Hecke schneiden in Osnabrück?", "Was kostet Entrümpelung?")
7. Schema.org поверхностный: нет Service с offers, Organization без logo/sameAs/founder, нет AggregateRating, Article, HowTo, BreadcrumbList
8. GBP под-оптимизирован
9. Нет measurement / доказательства результата
10. Mobile LCP 4.6-7.1s — отказы + AI Search учитывает mobile quality
**Цель:**
- A. Google: top-3 по "Gärtner [город]" + "Entrümpelungsfirma [город]" для топ-15 городов через 8-12 недель; indexed >90%; clicks х5-10 (от 95/3wk → 500-1000/3wk)
- B. AI Search: цитирование в ChatGPT Search/Perplexity/Claude (доказательство screenshots); llms.txt; AI-friendly content
- C. Bing/Yandex/Ecosia: verified + sitemap + indexed
- D. Backlinks: 15+ DACH-каталогов + 5+ GBP posts
- E. Schema deep: Service (offers/priceSpec), Organization (logo/sameAs/founder), BreadcrumbList, HowTo, Article, AggregateRating, WebSite searchAction
- F. Programmatic: 150 landing pages (5 услуг × 30 городов) — уникальный H1, 300+ слов, локальные FAQ, breadcrumbs, internal links
- G. Content: 10 ratgeber-статей (1500-2500 слов) под long-tail
- H. Performance: Mobile ≥85, LCP ≤2.5s, CWV "Good"
- I. Proof: SEO_RESULTS.md dashboard, AI-test-protocol каждые 2 недели, 4/8/12-week reports
**Скоуп (9 фаз):**
- Phase 1 — Discovery & Research (1-2 дня): конкурентный аудит, keyword research (volume/competition/CPC), AI-search baseline screenshots, backlinks audit, GBP audit → docs/SEO_RESEARCH.md
- Phase 2 — Programmatic SEO (3-5 дней): URL `/leistungen/[service]/[city]/`, generateStaticParams (Next.js 16 export), data/local-keywords.json, контент-генерация 150 pages, Schema Service+LocalBusiness+Breadcrumbs, internal links, sitemap update, тесты
- Phase 3 — AI Search Optimization (1-2 дня): public/llms.txt + llms-full.txt, answer-first restructure, факт-блок ("Gegründet 2026, Standort Osnabrück, Gründer Kevin Littawe..."), submit Perplexity/OpenAI/Bing AI, видеотест до/после
- Phase 4 — Multi-Engine Indexing (1 день): Bing Webmaster + Yandex + Ecosia setup + sitemap; IndexNow protocol; повторный GSC indexing для programmatic pages
- Phase 5 — Schema deep (1 день): Service offers/priceSpec, Organization logo/sameAs/founder, BreadcrumbList всех страниц, HowTo на ratgeber, AggregateRating, Article, WebSite searchAction
- Phase 6 — Ratgeber (3-5 дней): 10 статей по top long-tail keywords (Hecke schneiden / Entrümpelung Preise / Dachreinigung sinnvoll / Hausmeister Mehrfamilienhaus / Schrottabholung kostenlos / Gartenpflege Frühjahr / Haushaltsauflösung Todesfall / Winterdienst / Gärtner vs Selbstmachen / Garten anlegen Kosten); app/ratgeber/[slug]/page.tsx + data; index page
- Phase 7 — Backlinks/Off-Page (2-3 дня): регистрация Cylex/11880/Das Örtliche/GoYellow/Yelp DE/Gelbe Seiten/NOZ Branchenbuch/IHK/HWK Osnabrück; GBP optimization (5+ posts, 10+ photos, services full, Q&A, attributes); NAP consistency; outreach 3-5 локальных media
- Phase 8 — Performance (1 день): mobile LCP fix (GSAP SplitText opacity:0 → CSS-first), lazy-load detail-картинок, dynamic import GSAP/Lenis, target Mobile ≥85 / LCP ≤2.5s
- Phase 9 — Measurement (continuous, 12 недель): docs/SEO_RESULTS.md dashboard; weekly GSC metrics; AI-test каждые 2 недели; Plausible/Umami self-hosted (privacy-friendly без cookies); 4/8/12-week reports
**Бонус (бесплатно, обещано Kevin'у 21:47):** Google review link template (WhatsApp-ready) для роста ratings/Domain Authority
**Ограничения:**
- DSGVO: без cookies, без GA — Plausible/Umami self-hosted или только GSC
- НЕ менять brand-палитру / шрифты / общий дизайн
- НЕ трогать Pages CMS Kevin'а — programmatic только code-only
- НЕ keyword stuffing — Anthropic Claude detects thin content
- Бюджет 100MB GitHub Pages: 150 pages × ~50KB = 7.5MB ок
- Build time может вырасти до 5-10 мин (сейчас ~2 мин) — допустимо
- Все новые pages/components с тестами (render + schema validity)
- NAP consistency: Bramscher Str. 161, 49090 Osnabrück + +49 1523 9603175 + kontakt@rundumshaus-littawe.de — везде ОДИНАКОВО
- НЕ doorway pages — каждая programmatic с уникальным значимым контентом (E-E-A-T). Если нет 150 уникальных идей — лучше 75 качественных
- AI ethics: честность ("seit 2026", не "20 Jahren"), не фабриковать reviews
- Realistic: Google ranking 4-12 нед, AI citations 6-16 нед, backlinks 8-16 нед
- Зависимости от Kevin: GBP доступ ✅, реальные цены для priceSpec, реальные отзывы для AggregateRating, фото для "Gründer Kevin", решение про "junges Familienunternehmen"
- Зависимости внешние: Bing/Yandex accounts (CEO создаёт), каталоги (1-7 дней модерация), Perplexity Sources/OpenAI Business могут не быть доступны для small business
**Размер:** XL (9 фаз, ~30-50 часов работы + 12 недель monitoring, 150 страниц + 10 статей + 4 новых модуля)
**Рекомендуемый промпт:** P0 (большой roadmap → ОК → исполнение по wave/phase) с P10 (research-heavy) для Phase 1
---

## PX-026
**Дата:** 2026-05-02
**Статус:** завершено CONDITIONAL GO (Hans Landa Phase 6) — 3 follow-ups non-blocking
**DEVLOG:** S030
**Источник:** чат CEO, 2026-05-02 (после T007 commit 3167ea1, в ответ на Hans Landa Round 3 gap "тесты для programmatic.ts отсутствуют")

---
**PX-026**
**Задача:** Multi-agent протокол создания, сравнения, доработки и добавления unit-тестов для `site/src/lib/programmatic.ts` (engine генерации 490 programmatic SEO landing pages) с валидацией скиллами и агентами

**Контекст:**
- `site/src/lib/programmatic.ts` (~688 строк) — генератор контента: `generatePageContent`, `getAllPagePairs`, 5 service-блоков (HAUSMEISTER/GARTEN/DACH/ENTRUEMP/SCHROTT), 8 intro variants, 12 FAQ pool с rotation, tier-scaled body (7/5/3 paragraphs) + FAQs (8/6/5)
- `site/src/data/cities.json` (98 cities, T1=20 / T2=41 / T3=37, neighbor graph 0 orphans)
- `site/src/data/services.json` (5 услуг)
- `site/src/data/ratgeber.json` (10 articles)
- Test framework: Vitest 4 (config в site/vitest.config.ts), 13 существующих test-файлов, 128 проходящих тестов
- Существующие тесты покрывают предыдущие фазы (Hero, ContactForm, ServiceDetail, FAQSchema и т.д.) — для programmatic.ts тестов НЕТ
- Branch: `feat/t007-ultra-seo-ai-search` (commit 3167ea1)

**Проблема:**
- `programmatic.ts` — критическая инфраструктура: его поломка тихо ломает 490 страниц без явных билд-ошибок (типизация валидна, но контент может быть пустым / повторяющимся / с подставленным `undefined`)
- Регрессии будут отлавливаться только вручную (CEO/Kevin случайно зайдут на конкретную страницу)
- При будущих изменениях (новая услуга, новый город, изменение tier-логики, добавление intro variant) нет автоматической защиты от поломки контракта генератора
- Возможные тихие баги: orphan cities в neighbor graph, FAQ rotation использует только подмножество pool, intro variants распределены неравномерно (один используется для 80% городов), schema-объекты с пропущенными required полями, тiер-логика сломалась (T1 получает 3 параграфа вместо 7)
- Hans Landa Round 3 явно отметил это как gap: "Мог бы написать тесты для programmatic.ts (сейчас 128 тестов это всё что было от предыдущих фаз)"

**Цель:**
- Полностью протестированный `programmatic.ts` с покрытием всех инвариантов, edge cases, контрактов schema
- Тесты добавлены через структурированный multi-agent протокол с adversarial валидацией (не один проход, а 3 версии → критика → синтез лучшей)
- Финальный тест-файл в codebase, все тесты проходят (128 → 130+ tests pass), build green
- Документированный процесс выбора подхода (snapshot vs invariant vs example-based) — чтобы при будущих доработках programmatic.ts было ясно как тестировать

**Скоуп:**

Phase 1 — Research & Validation (агенты + скиллы):
- WebSearch best practices 2026: Vitest content generator testing, invariant vs snapshot vs example-based, property-based testing для контент-генераторов
- Skill `test-driven-development` — определить какие инварианты критичны для programmatic.ts
- Skill `requesting-code-review` для финальной валидации
- Plan agent — дизайн 3 чётко различающихся testing-стратегий

Phase 2 — Parallel Implementation (3 агента параллельно):
- Agent A: Snapshot-based подход (vitest snapshots) — захват эталонного output для фиксированных пар, regression detection при любых текстовых изменениях
- Agent B: Invariant/structural подход — for-loop по всем 490 пар (или sample-based) с structural assertions: body length matches tier, intro contains city.name, FAQ count = expected, neighbor graph symmetric, нет undefined в выводе
- Agent C: Example/contract подход — TDD-style с конкретными hand-crafted кейсами (Bramsche T1 → ожидаем X параграфов с этими ключевыми словами, mars-несуществующий → throws, etc.), edge cases (4 разных Neuenkirchen, populationClass="city" boundary)
- Каждый агент возвращает: complete test file (~80-200 lines), краткое объяснение подхода, self-assessment слабых мест

Phase 3 — Comparative Critique:
- Прочитать все 3 версии
- Определить почему 2 из 3 хуже одной (критерии: false-positive rate при legitimate code changes, coverage инвариантов, читабельность, скорость выполнения, поддерживаемость, способность ловить реальные регрессии)
- Записать чёткую таблицу-сравнение с обоснованием

Phase 4 — Gap Analysis для победителя:
- Spawn критического агента (типа `code-reviewer` или `general-purpose` с adversarial-инструкцией) — найти что лучшая версия всё ещё пропускает
- Конкретные находки: какие сценарии не покрыты, какие edge cases пропущены, какая false-confidence создаётся

Phase 5 — Fix:
- Дополнить лучшую версию тестами для найденных gap'ов
- Финальный test file `site/src/lib/programmatic.test.ts`

Phase 6 — Re-Validation:
- Hans Landa adversarial review финальной версии
- `npm test` — все тесты проходят (128 → 130+ tests pass)
- `npm run build` — build green, никаких регрессий

Phase 7 — Add to codebase:
- Commit в branch `feat/t007-ultra-seo-ai-search` (НЕ master)
- Push в origin
- Обновить DEVLOG.md и STATUS.md

**Ограничения:**
- НЕ менять `programmatic.ts` сам (только тесты для него, если найдён баг — отдельной задачей PX-027+)
- НЕ ломать существующие 128 тестов
- НЕ merge в master — только feat-ветка
- НЕ покрывать вещи вне scope `programmatic.ts` (cities.json validation — отдельная задача)
- Vitest 4 syntax (не Jest)
- TypeScript strict mode — все типы корректны
- Если 3 агента предложат идентичные подходы — переспросить с уточнениями для дифференциации
- Если лучшая версия после Phase 5 fix всё ещё имеет gap — итерировать Phase 4-5 до GO от Hans Landa (но не более 2 итераций — иначе сообщить CEO о принципиальной проблеме подхода)
- Время: задача может занять 30-60 мин (3 параллельных агента × 5-10 мин + критика + fix + Landa)
- Не заявлять word counts / coverage % без реального измерения — Round 2 урок

**Рекомендуемый промпт:** P9 (multi-agent параллельная работа) или P0 (если хочешь roadmap-first), либо новый кастомный wrapper для validation-driven multi-agent flow
---

## PX-027
**Дата:** 2026-05-02
**Статус:** новая
**DEVLOG:** —
**Источник:** PX-026 Phase 3 — invariant tests detected 2 real bugs

---
**PX-027**
**Задача:** Fix 2 реальных бага найденных PX-026 invariant tests: SCHROTT bodyParagraphs pool size 5→7, neighbor graph asymmetry для bad-essen
**Контекст:**
- `site/src/lib/programmatic.ts` строки 460-510 (SCHROTT.bodyParagraphs — 5 параграфов, нужно ≥7 для T1 paragraphCountForTier)
- `site/src/data/cities.json` — bad-essen.neighbors не reciprocates bad-iburg, bad-rothenfelde
- `site/src/lib/__tests__/programmatic.invariant.test.ts` — `it.fails()` sentinel auto-trip когда баг исправят, KNOWN_ASYMMETRIES baseline снять
**Проблема:**
- 20 T1 schrottabholung pages (Tier 1 = 20 cities × 1 service = 20) тихо shipping 5 параграфов вместо 7. Деградация контента не видна без invariant test.
- 2 cities (bad-iburg, bad-rothenfelde) reference bad-essen в neighbors, но bad-essen.neighbors не reciprocates → асимметричный граф → SEO orphan-style risk на bad-essen с этих cross-links.
**Цель:**
1. SCHROTT.bodyParagraphs расширен до ≥7 (добавить 2+ новых параграфа в стиле существующих, regional NDS/NRW specifics)
2. cities.json: bad-essen.neighbors включает bad-iburg + bad-rothenfelde
3. Sentinel тест `it.fails("bodyParagraphs ≥ 7 — SENTINEL until PX-027")` — снять `.fails()` маркер (станет regular `it()` test)
4. KNOWN_ASYMMETRIES в invariant.test.ts — empty array
5. Tests pass без expected-fails (204 → 204 без sentinel marker)
**Скоуп:**
- Phase 1: написать 2-3 новых параграфа для SCHROTT.bodyParagraphs (regional content quality, не filler)
- Phase 2: regenerate cities.json через `node scripts/generate-cities.mjs` (или manual edit) — bad-essen.neighbors включает bad-iburg + bad-rothenfelde
- Phase 3: снять `it.fails()` маркер, очистить KNOWN_ASYMMETRIES
- Phase 4: build + test + Hans Landa quick review
- Phase 5: commit в feat/t007-ultra-seo-ai-search
**Ограничения:**
- НЕ менять paragraphCountForTier / faqCountForTier
- НЕ менять existing 76 PX-026 tests (только sentinel removal + KNOWN_ASYMMETRIES cleanup)
- 2-3 новых SCHROTT параграфа должны быть unique content (не дубли существующих 5)
**Размер:** S
**Рекомендуемый промпт:** P2 (bug fix) или P8 (мелкая правка)
---

## PX-028
**Дата:** 2026-05-02
**Статус:** новая
**DEVLOG:** —
**Источник:** PX-026 Phase 6 Hans Landa CONDITIONAL GO follow-up

---
**PX-028**
**Задача:** Rename test-only exports `getServiceBlockSizes`, `getSelectedIndices` с `_TEST_ONLY` suffix или move в `programmatic.testing.ts` (test-only module)
**Контекст:**
- `site/src/lib/programmatic.ts` экспортирует 4 функции для testability: `paragraphCountForTier`, `faqCountForTier`, `getServiceBlockSizes`, `getSelectedIndices`
- Hans Landa Phase 6 пометил это как coupling risk: production code может случайно импортировать `getServiceBlockSizes` или `getSelectedIndices`, тогда refactoring сломает both prod + tests
- `paragraphCountForTier` и `faqCountForTier` — это product API (вызываются в page.tsx) — НЕ переименовывать
- `getServiceBlockSizes` и `getSelectedIndices` — internal/test-only — нуждаются в clear naming
**Проблема:**
- Public API `programmatic.ts` сейчас содержит test-only utilities без явного маркера
- Будущий dev может использовать `getServiceBlockSizes` в production-коде, тогда:
  - Test изменения сломают prod
  - Dependency analysis hard (нет clear boundary)
**Цель:**
- `getServiceBlockSizes` и `getSelectedIndices` ясно помечены как test-only
- Production code (`page.tsx`, `layout.tsx`, `sitemap.ts`) НЕ использует эти функции
- Tests продолжают работать
**Скоуп:**
- Вариант A (preferred): создать `site/src/lib/programmatic.testing.ts` — реэкспорт internal functions, импортировать только из tests
- Вариант B: rename `__getServiceBlockSizes` / `__getSelectedIndices` (double underscore convention)
- Вариант C: оставить как есть, добавить ESLint rule `no-restricted-imports` для prod code
- Update всех 3 test файлов (snapshot/invariant/example) с новыми именами/путями
- Run full test suite + build
- Hans Landa quick review
**Ограничения:**
- НЕ менять `paragraphCountForTier` и `faqCountForTier` (это product API)
- НЕ ломать существующие 204 tests
- TypeScript strict pass
**Размер:** S
**Рекомендуемый промпт:** P8 (мелкий рефактор)
---

## PX-029
**Дата:** 2026-05-02
**Статус:** новая (nice-to-have, не приоритет)
**DEVLOG:** —
**Источник:** PX-026 Phase 6 Hans Landa CONDITIONAL GO follow-up

---
**PX-029**
**Задача:** Дополнительные invariant tests для programmatic.ts — strict bounds + cross-field validation
**Контекст:**
- `site/src/lib/__tests__/programmatic.invariant.test.ts` (40 tests, после PX-026 Phase 5)
- `site/src/data/cities.json` (98 cities)
- `site/src/lib/programmatic.ts` (distancePhrase, helper functions)
**Проблема:**
- Текущие invariants ловят major regressions, но имеют residual gaps:
  - `plzPrefix` regex `/^\d{2}$/` принимает 00, 99 — реально NDS/NRW = ~28-49
  - `distanceKm ≥ 0` — нет upper bound, 9999 принимается
  - `bundesland` enum hardcoded на 2 — нет cross-validation что city.bundesland matches city.plzPrefix region
  - `h1` uniqueness — только within-service. Cross-service collision не покрыт
  - `distancePhrase` 3 branches покрыты, но если в будущем появится 4-я ветка (например `distanceKm > 60`) — тесты passes silently, новая ветка не покрыта
**Цель:**
- Stricter invariants для data + cross-field validation
- Defensive tests против future drift
**Скоуп:**
- `plzPrefix` ∈ ["28", "29", ..., "49"] (NDS/NRW range) — assertion table
- `distanceKm ≤ 100` upper bound (defensive)
- Cross-field: NDS plzPrefix ↔ NDS bundesland (consistency check)
- Cross-service h1 audit (informational warning, не fail)
- distancePhrase branch-count invariant: `expect(distancePhrase.toString().match(/return /g).length).toBe(3)` или similar reflection check
- Mutation safety: extend test для всех полей (не только body+fakten — также faqs, metaTitle, service)
**Ограничения:**
- НЕ ломать существующие 204 tests
- НЕ менять production code (только tests)
- TypeScript strict
**Размер:** S
**Рекомендуемый промпт:** P8
---

<!-- Последний номер: PX-029 -->
