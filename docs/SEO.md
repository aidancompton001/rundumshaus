# SEO Setup — RundumsHaus

## Google Search Console (GSC)

**Account:** ebaias.muc@gmail.com (CEO)
**Property type:** Domain (покрывает все subdomains)
**Domain:** `rundumshaus-littawe.de`
**Verification:** DNS TXT record (через IONOS)

### Wave 3 — пошаговая инструкция (ручная)

**Шаг 1 — добавить property в GSC**
1. Открой `https://search.google.com/search-console` (логин `ebaias.muc@gmail.com`)
2. Слева сверху → выбери property dropdown → `+ Add property`
3. Выбери **Domain** (НЕ "URL prefix")
4. Введи: `rundumshaus-littawe.de` (без https://, без www)
5. Continue → Google покажет TXT-запись для верификации (вид: `google-site-verification=AbCdEfG...`)
6. Скопируй полное значение (от `google-site-verification=` до конца строки)

**Шаг 2 — добавить TXT-запись в IONOS**
1. Залогинься в IONOS DNS panel (доступы в `docs/CREDENTIALS.md`)
2. Domain → `rundumshaus-littawe.de` → DNS
3. Record hinzufügen → Тип: **TXT**
4. Hostname: `@` (корневой домен)
5. Wert: вставь полностью `google-site-verification=AbCdEfG...` (со скопированной строки)
6. TTL: 1 Stunde (или Auto)
7. Speichern

**Шаг 3 — verify в GSC**
1. Подожди 5–15 минут (DNS propagation)
2. Вернись в Search Console (там должна быть кнопка `Verify`)
3. Жми Verify → должно зелёным "Ownership verified"
4. Если не сработало — подожди ещё 10 минут, пробуй снова. До 24h в edge cases.

**Шаг 4 — submit sitemap**
1. После verification → левое меню → **Sitemaps**
2. В поле "Add a new sitemap" введи: `sitemap.xml`
3. Submit → должно показать "Success" с количеством URLs (~7)

**Шаг 5 — request indexing для главных страниц**
Для каждого URL ниже:
1. Левое меню → **URL inspection** (или поисковая строка сверху)
2. Введи полный URL → Enter
3. После анализа жми **Request indexing**

URLs:
- `https://rundumshaus-littawe.de/`
- `https://rundumshaus-littawe.de/leistungen/`
- `https://rundumshaus-littawe.de/einsatzgebiet/`
- `https://rundumshaus-littawe.de/referenzen/`
- `https://rundumshaus-littawe.de/kontakt/`

**Шаг 6 — анализ "не индексировано" (запрос Kevin)**
После Verification:
1. Левое меню → **Pages** (бывший Coverage)
2. Раздел "Why pages aren't indexed" — список причин
3. Зафиксируй найденное в этом файле ниже (раздел "Index Coverage Issues")

---

## Google Business Profile (GBP)

**Account:** Kevin Littawe (owner) + CEO добавлен как админ
**URL:** business.google.com
**Status:** ✅ настроен, CEO имеет доступ админа

---

## sitemap.xml

**URL:** `https://rundumshaus-littawe.de/sitemap.xml`
**Routes (после T005 Wave 2):**
- `/` (priority 1.0)
- `/leistungen/` (0.9, includes Weitere Leistungen via #weitere)
- `/einsatzgebiet/` (0.7)
- `/referenzen/` (0.7)
- `/kontakt/` (0.8)
- `/impressum/` (0.3)
- `/datenschutz/` (0.3)

**Note:** `/weitere-leistungen/` ВЫНУТО из sitemap (Wave 1 — page стал redirect-placeholder с `noindex`).

---

## Local SEO

**Service area:** 95 городов из 7 регионов (Osnabrücker Land, Artland, Münsterland, Warendorf/Bielefeld, Mittelweser, Vechta/Cloppenburg, Emsland) — см. `site/src/data/service-areas.json`.
**Schema.org:** LocalBusiness с массивом `areaServed: City[]` в `layout.tsx` structured data.
**Page:** https://rundumshaus-littawe.de/einsatzgebiet — отдельная страница для индексации long-tail запросов "Hausmeister + city".

---

## Wave 3 — выполнено 2026-04-30

- **Verification:** ✅ Auto-verified (Google связал с GBP/account)
- **Sitemap submitted:** `https://rundumshaus-littawe.de/sitemap.xml` (status "Couldn't fetch" — временно, нормально для свежего submit)
- **Indexing requests отправлены:**
  - `/` — уже indexed (URL is on Google ✅)
  - `/leistungen/` — Indexing requested ✅
  - `/einsatzgebiet/` — Indexing requested ✅
  - `/referenzen/` — Indexing requested ✅
  - `/kontakt/` — Indexing requested ✅
- **Discovered:** GSC уже работает 3+ недели (Kevin сам подключил), 95 кликов с 06.04, главная страница индексируется
- **Recommendation от GSC:** `https://www.rundumshaus-littawe.de/` потеряла 89% impressions — потенциально www-версия не редиректит на apex или потеря рейтинга после переноса на GitHub Pages

## Index Coverage Issues

> Заполнить через 1-7 дней после crawl: GSC → Pages → "Why pages aren't indexed".

| URL | Reason | Action |
|-----|--------|--------|
| — | — | — |

---

## DNS Records (IONOS)

**Назначение:** GSC verification + email infra (не трогать).
Существующие на 2026-04-30:
- A `@` × 4 → 185.199.108-111.153 (GitHub Pages) — PX-014
- CNAME `www` → aidancompton001.github.io — PX-014
- TXT `@` → SPF, DMARC, Google Verification, etc. — мейл клиента
- MX × 2 → mx00.ionos.de, mx01.ionos.de
- CNAME `_dmarc`, `s1-ionos._domainkey`, `s2-ionos._domainkey`, `autodiscover` → IONOS mail

**При добавлении TXT для GSC:** новая запись на `@`, не конфликтует с существующими (несколько TXT-записей на корневом домене допустимы).
