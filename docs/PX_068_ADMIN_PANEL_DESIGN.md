# PX-068 — Admin Panel (CMS) — Research & Design Document

> **Статус:** DESIGN — ждёт OK CEO перед реализацией
> **Дата:** 2026-06-10
> **Источник:** Kevin (WhatsApp 2026-06-10): "admin Panel das ich wirklich Texte
> bearbeiten kann Bilder ändern kann etc. Wichtig auch das ich das für Google die
> Beschreibung und Titel ändern kann auch — Für Startseite und alle anderen Seiten"
> **Scope (CEO решение):** Basic + Meta

---

## 1. Executive Summary

Kevin хочет сам, без разработчика, редактировать:
1. **Тексты** главной страницы и карточек услуг
2. **Картинки** (hero, service images)
3. **Google Meta** — Title + Description — для главной, статичных страниц и услуг

**Технический вызов:** сайт — статический Next.js export на GitHub Pages, без базы
данных и без backend-сервера. Любая «админка» должна писать изменения обратно в
Git-репозиторий, после чего GitHub Actions пересобирает и деплоит сайт.

**Выбранное решение:** **Sveltia CMS** — git-based headless CMS. Работает поверх
существующего репозитория, не ломает архитектуру, бесплатен, не требует своего
сервера/БД. Изменения Kevin'а → commit в GitHub → авто-build → live за ~2-3 мин.

**Что НЕ меняется:** ни одна из 490 programmatic-страниц, ни SEO-структура, ни
производительность публичного сайта. Админка изолирована на `/admin/`, `noindex`.

---

## 2. Research — почему Sveltia CMS

### 2.1 Рассмотренные варианты

| Вариант | Вердикт | Причина |
|---------|---------|---------|
| **WordPress** | ❌ Отклонён | Потеря 490 programmatic-страниц, потеря SEO-скорости, hosting ~10€/мес, БД, обслуживание безопасности |
| **Decap CMS** (ex-Netlify CMS) | 🟡 Возможен | Старше, медленнее, развитие замедлилось |
| **Tina CMS** | 🟡 Возможен | Visual editing, но 0-29€/мес + сложнее setup |
| **Sveltia CMS** | ✅ **Выбран** | Современный, бесплатный, git-based, drop-in над репо, быстрый UI, совместим с Decap-конфигом |
| **Airtable/Sheets как source** | 🟡 Запасной | Требует переписать data-layer, build-time fetch |

### 2.2 Как работает Sveltia CMS (git-based)

```
Kevin → /admin/ (браузер)
      → логин (GitHub token или OAuth)
      → редактирует поля в UI
      → "Speichern"
      → Sveltia делает git commit в репозиторий (через GitHub API)
      → GitHub Actions: build + deploy
      → ~2-3 мин → изменения live
```

**Никакого backend-сервера у нас нет** — Sveltia общается напрямую с GitHub API из
браузера Kevin'а. Данные = существующие JSON-файлы в репо.

### 2.3 Аутентификация — 2 пути

| Метод | Setup | UX для Kevin | Рекомендация |
|-------|-------|--------------|--------------|
| **Personal Access Token** | Нулевой backend. Kevin генерирует fine-grained PAT (scope: только этот repo, Contents read/write), вставляет в окно входа | Один раз вставить token; при истечении — обновить | ✅ **Старт** — быстро, ноль внешних зависимостей |
| **GitHub OAuth + Sveltia Authenticator** | Регистрация OAuth App + деплой Cloudflare Worker | Кнопка «Login with GitHub», ничего вставлять не надо | 🟡 **Позже** — удобнее, но требует Cloudflare Worker |

**Решение для запуска:** Token-метод. Kevin — единственный редактор, ему достаточно
один раз вставить token. OAuth добавим в Phase D если Kevin захочет «кнопку логина».

> ⚠️ Открытый вопрос CEO: token (быстро, Kevin вставляет строку) ИЛИ сразу OAuth
> (нужен Cloudflare Worker от меня + OAuth App от владельца repo)?

---

## 3. Архитектура — что редактируется и где данные

### 3.1 Карта данных

| Что редактирует Kevin | Файл в репо | Тип коллекции Sveltia |
|-----------------------|-------------|----------------------|
| Hero (H1, подзаголовок, CTA) | `site/src/data/homepage.json` | file |
| Über uns (заголовок, 2 абзаца) | `site/src/data/homepage.json` | file |
| 5 карточек услуг (title, description) | `site/src/data/services.json` | list внутри file |
| Навигация (пункты меню) | `site/src/data/site.json` | list внутри file |
| Картинки (hero, service, about) | `site/public/images/...` | media library |
| **Meta главной** (title/desc) | `site/src/data/meta-overrides.json` (НОВЫЙ) | file |
| **Meta статичных** (über-uns, kontakt, einsatzgebiet, leistungen) | `site/src/data/meta-overrides.json` | file |
| **Meta-шаблон 5 услуг** | `site/src/data/meta-overrides.json` → `services.*` | file |

### 3.2 Meta-override система (ядро Phase B/C)

Сейчас meta генерируется в коде:
- Статичные страницы: `generateSEO({title, description})` в каждом `page.tsx`
- 490 city pages: `getGartenContent()` / `getHausmeisterContent()` и т.д. → `metaTitle`/`metaDescription`

**Чтобы Kevin мог переопределять, не трогая код:**

Новый файл `meta-overrides.json`:
```json
{
  "pages": {
    "/": { "title": "...", "description": "..." },
    "/leistungen/": { "title": "...", "description": "..." },
    "/ueber-uns/": { "title": "...", "description": "..." },
    "/kontakt/": { "title": "...", "description": "..." },
    "/einsatzgebiet/": { "title": "...", "description": "..." }
  },
  "services": {
    "gartenpflege":      { "titlePattern": "...{city}...", "descriptionPattern": "...{city}..." },
    "hausmeisterservice":{ "titlePattern": "...{city}...", "descriptionPattern": "...{city}..." },
    "dacharbeiten":      { "titlePattern": "...{city}...", "descriptionPattern": "...{city}..." },
    "entruempelung":     { "titlePattern": "...{city}...", "descriptionPattern": "...{city}..." },
    "schrottabholung":   { "titlePattern": "...{city}...", "descriptionPattern": "...{city}..." }
  }
}
```

**Принцип работы (helper `resolveMeta`):**
- В `generateMetadata` каждой страницы: сначала ищем override в `meta-overrides.json`,
  если есть — применяем, если нет — используем текущую кодовую генерацию (fallback).
- Для услуг: `titlePattern` с плейсхолдером `{city}` → подстановка названия города.
- **490 страниц НЕ редактируются по одной** — Kevin меняет 1 шаблон на услугу,
  он применяется ко всем 98 городам этой услуги.

**Гарантия безопасности:** если `meta-overrides.json` пустой/невалидный → 100%
fallback на текущую генерацию. Сайт не ломается ни при каком вводе Kevin'а.

---

## 4. User Journey — путь Kevin (пошагово)

### 4.1 Первый вход (однократно)
1. Kevin открывает `https://rundumshaus-littawe.de/admin/`
2. Видит экран входа Sveltia
3. (Token-метод) Кликает «Sign In with Token» → переходит по ссылке на GitHub →
   генерирует fine-grained token (инструкция со скриншотами от нас) → вставляет
4. Попадает в CMS-интерфейс

### 4.2 Редактирование текста
1. Kevin кликает коллекцию «Startseite»
2. Видит поля: Hero-Überschrift, Untertitel, Über-uns-Text…
3. Меняет текст
4. «Speichern» → Sveltia коммитит → через ~2-3 мин live
5. Kevin видит изменение на сайте (после обновления страницы)

### 4.3 Замена картинки
1. Коллекция «Startseite» → поле «Hero-Bild»
2. «Bild auswählen» → загружает новый файл (drag&drop)
3. Sveltia заливает в `public/images/...` + коммитит
4. «Speichern» → live через build

### 4.4 Изменение Google Meta
1. Коллекция «SEO / Meta»
2. Выбирает страницу (Startseite / Über uns / …) ИЛИ услугу (Gartenpflege…)
3. Меняет «Meta-Titel» + «Meta-Beschreibung»
4. (Для услуги) использует `{city}` как плейсхолдер города
5. «Speichern» → применяется ко всем страницам этой услуги
6. Google переиндексирует за 1-14 дней (вне нашего контроля)

### 4.5 Что Kevin НЕ может сломать
- Не видит и не трогает код, маршруты, Schema, конфиги
- Поля ограничены типами (текст/картинка) — Sveltia валидирует
- Невалидный meta-override → fallback, сайт работает
- Каждое изменение = git commit → откатываемо одним revert

---

## 5. Implementation Pipeline (фазы)

### Phase A — Базовая CMS (тексты + картинки)
- `site/public/admin/index.html` (загрузчик Sveltia)
- `site/public/admin/config.yml` (backend github + collections: homepage, services, site, media)
- Build-проверка: `/admin/` копируется в `out/`, `noindex`
- Инструкция Kevin'у (token, со скриншотами)
- **Результат:** Kevin редактирует тексты главной/услуг + меняет картинки

### Phase B — Meta-override для главной + статичных
- `site/src/data/meta-overrides.json` (пустой стартовый)
- Helper `resolveMeta(path)` в `site/src/lib/`
- Интеграция в `generateMetadata` статичных страниц (homepage, leistungen, ueber-uns, kontakt, einsatzgebiet)
- Sveltia-коллекция «SEO / Meta — Seiten»
- **Результат:** Kevin меняет Title/Description главной и статичных

### Phase C — Meta-шаблоны 5 услуг
- Расширение `meta-overrides.json` → `services.*`
- Интеграция в `generateMetadata` route `[service]/[city]` (override `titlePattern`/`descriptionPattern` с `{city}`)
- Sveltia-коллекция «SEO / Meta — Dienstleistungen»
- **Результат:** Kevin меняет meta-формулу услуги → применяется к 98 городам

### Phase D (опционально, позже) — OAuth «Login-Button»
- GitHub OAuth App + Cloudflare Worker (Sveltia Authenticator)
- Только если token-метод окажется неудобным

---

## 6. Verification & Testing Plan

### 6.1 Сборка / юнит
- [ ] `npm run build` проходит, `out/admin/index.html` существует
- [ ] `out/admin/config.yml` существует и валиден (YAML parse)
- [ ] 240/240 существующих тестов проходят (CMS ничего не ломает)
- [ ] Новый тест: `meta-overrides.json` валиден; `resolveMeta` возвращает fallback при пустом override
- [ ] Новый тест: `resolveMeta('/')` с override → возвращает override; без → fallback

### 6.2 HTML-output (jsdom)
- [ ] `/admin/` имеет `<meta name="robots" content="noindex">`
- [ ] Главная: при пустом override — title/description идентичны текущим (регрессии нет)
- [ ] Главная: при заданном override — title/description = override
- [ ] 5 sample city pages × до/после override-шаблона — корректная подстановка `{city}`

### 6.3 Functional (ручной, после deploy)
- [ ] `/admin/` грузится, экран входа Sveltia виден
- [ ] Вход по token успешен
- [ ] Правка текста → commit появляется в GitHub → live после build
- [ ] Загрузка картинки → файл в `public/images/...` → live
- [ ] Правка meta → корректный `<title>`/`<meta description>` на live

### 6.4 Канарейка / индексация
- [ ] `canary-verify.mjs` все 5 услуг — 0 FAIL (meta-override не сломал структуру)
- [ ] Sitemap не изменился (490 + статичные)
- [ ] `/admin/` НЕ в sitemap, НЕ индексируется (robots noindex)

---

## 7. Performance Impact

| Аспект | Влияние | Оценка |
|--------|---------|--------|
| Публичные страницы (главная, 490 city) | **Ноль** — `/admin/` отдельный bundle, не грузится посетителями | ✅ |
| Размер `/admin/` | Sveltia ~1 JS-файл с CDN unpkg, грузится только при входе в админку | Не влияет на SEO/посетителей |
| Build time | +доли секунды (копирование 2 статичных файлов admin) | Незначимо |
| `meta-overrides.json` чтение в `generateMetadata` | Build-time, 1 маленький JSON, кешируется | Незначимо |
| Runtime посетителя | Без изменений (всё статика как раньше) | ✅ |

**Вывод:** нулевое влияние на производительность публичного сайта.

---

## 8. SEO / Indexation Impact

| Риск | Митигация |
|------|-----------|
| `/admin/` попадёт в индекс Google | `<meta robots noindex>` + НЕ в sitemap + (опц.) Disallow в robots.txt |
| Kevin введёт слишком длинный meta-title | Sveltia hint + (опц.) валидация длины; Google просто обрежет — не критично |
| Override сломает meta 490 страниц | Fallback при пустом/невалидном; jsdom-тест «пустой override = текущее поведение» |
| Дубликаты title между городами | Шаблон обязан содержать `{city}` — добавим проверку/подсказку |
| Потеря текущих оптимизированных meta | Стартовый `meta-overrides.json` ПУСТОЙ → 100% текущее поведение, пока Kevin сам не изменит |

**Ключевой принцип:** пустой override = сегодняшнее SEO без изменений. Любое
изменение — осознанное действие Kevin'а, откатываемое git-revert.

---

## 9. Risks & Mitigation (сводно)

| # | Риск | Митигация |
|---|------|-----------|
| 1 | Token Kevin'а утечёт | Fine-grained token, scope только этот repo, Contents only; можно отозвать в GitHub |
| 2 | Kevin удалит/сломает контент через CMS | Каждое изменение = commit → git revert; поля типизированы |
| 3 | Sveltia CDN (unpkg) недоступен | Запасной: pin версии или self-host JS-файла в `public/admin/` |
| 4 | Невалидный meta-override ломает build | `resolveMeta` обёрнут в try/catch → fallback; тест на пустой/битый JSON |
| 5 | Kevin не справится с token | Инструкция со скриншотами; запасной — OAuth Phase D |
| 6 | Конфликт commit'ов (Kevin + я одновременно) | Маловероятно (один редактор); git merge при необходимости |

---

## 10. Cost / Time Estimate

| Фаза | Время | Примечание |
|------|-------|------------|
| A — Базовая CMS | ~2-3 ч | config + collections + инструкция |
| B — Meta статичных | ~2 ч | meta-overrides + resolveMeta + интеграция |
| C — Meta услуг | ~2 ч | шаблоны + интеграция в route |
| D — OAuth (опц.) | ~2 ч | Cloudflare Worker + OAuth App |
| Верификация (все фазы) | ~1-2 ч | тесты + canary + ручная проверка |
| **Итого A+B+C** | **~7-9 ч** | без OAuth |

**Цена (paid scope, вне 300€ deal):** ориентир ~150-200€ — согласовать с Kevin.

---

## 11. Открытые решения для CEO

1. **Auth-метод:** Token (быстро, Kevin вставляет строку) ИЛИ сразу OAuth (нужен
   Cloudflare Worker + OAuth App, но «кнопка логина»)?
2. **robots.txt:** добавить `Disallow: /admin/` (доп. защита от индексации) — да/нет?
3. **Стартовые meta-overrides:** оставить пустыми (= текущее SEO) — подтверждаю да?
4. **Цена с Kevin** — кто и когда озвучивает (~150-200€)?
5. **Phase D (OAuth) сейчас или позже** — после теста token-метода?

---

## 12. Что НЕ входит в этот scope

- ❌ Редактирование каждой из 490 city-страниц по отдельности (Kevin меняет шаблон услуги, не 98 городов вручную)
- ❌ Редактирование текстов внутри city-template (programmatic, из `template-content-*.ts`) — отдельный scope если понадобится
- ❌ Визуальный drag&drop конструктор страниц (Sveltia — поля, не page-builder)
- ❌ Управление отзывами (reviews.json) — можно добавить коллекцией позже
- ❌ Pflastersteine/новые спец-страницы (Kevin создаёт контент, новые маршруты — код)
