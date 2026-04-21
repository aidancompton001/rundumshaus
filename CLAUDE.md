# CLAUDE.md — RundumsHaus

## Владелец проекта

**Пользователь = CEO проекта.** Его слово — закон. Все решения CEO имеют абсолютный приоритет. Команда выполняет указания CEO без обсуждения.

**Второй после CEO: #1 Product Architect** — правая рука CEO, координатор команды. Несёт персональную ответственность за качество всех задач.

---

## Проект

**Название:** RundumsHaus
**Тип:** Коммерческий сайт для клиента (Hausmeister & Gartenpflege)
**Описание:** Премиум-сайт для компании "Rund ums Haus Littawe" — услуги по дому: Hausmeisterservice, Gartenpflege, Dacharbeiten, Entrümpelung, Schrottabholung. Клиент — Kevin Littawe, бизнес на старте. Адрес: Bramscher Str. 161, 49090 Osnabrück.
**Локация:** Мюнхен, Германия (разработка) / Osnabrück und Umgebung (клиент)
**Языки:** Deutsch (единственный язык сайта)
**Домен:** rundumshaus-littawe.de (IONOS)
**Бюджет клиента:** 300€ Festpreis
**Срок:** 1-2 дня

---

## Документация

| Файл | Назначение | Когда читать |
|------|-----------|--------------|
| `CLAUDE.md` | Главный управляющий документ | Всегда (загружается автоматически) |
| `TEAM.md` | Команда: роли, страйки, увольнения | При запуске любого агента |
| `DEVLOG.md` | Журнал разработки | Старт/завершение сессии |
| `STATUS.md` | Текущее состояние (snapshot) | Старт сессии |
| `docs/tasks/` | Roadmap-файлы задач (TNNN) | P0 создаёт, Pn исполняет |
| `docs/CREDENTIALS.md` | Доступы (НЕ в git) | Деплой, интеграции |

---

## Tech Stack

| Слой | Технология | Статус |
|------|-----------|--------|
| Framework | TBD (решить в P0: Next.js SSG / Astro / Static HTML) | Pending |
| Styling | Tailwind CSS 4 | Locked |
| Animations | GSAP + ScrollTrigger + SplitText | Locked |
| Smooth Scroll | Lenis | Locked |
| UI Components | Из CREATIVE_TOOLKIT.md (React Bits / Aceternity UI) | Locked |
| Forms | FormSubmit.co (проверено на Eko-OYLIS) | Locked |
| Hosting | GitHub Pages (позже CNAME на IONOS) | Locked |
| Images | AI-генерация (Nano Banana) | Locked |
| Language | Deutsch only | Locked |

---

## Структура сайта

| Страница | Содержание |
|----------|-----------|
| **Startseite** | Hero (полноэкран, AI-фото), короткий Über-uns, обзор 5 услуг |
| **Leistungen** | Детальные карточки 5 услуг с описаниями и фото |
| **Referenzen** | Vorher/Nachher галерея (клиент наполняет сам) |
| **Kontakt** | Форма (FormSubmit.co), телефон, email |

## Услуги (тексты от клиента)

1. **HAUSMEISTERSERVICE** — Alles rund ums Haus — zuverlässig und schnell erledigt.
2. **GARTENPFLEGE** — Fachgerechte Pflege Ihres Gartens — Rasen mähen, Hecken schneiden und vieles mehr.
3. **DACHARBEITEN** (insbesondere Dachreinigung) — Reinigung, Pflege und Arbeiten rund ums Dach — sauber und zuverlässig.
4. **ENTRÜMPELUNG** — Wir übernehmen Entrümpelungen in allen Bereichen — vom Keller bis zur kompletten Haushaltsauflösung, sauber und stressfrei.
5. **SCHROTTABHOLUNG** — Kostenlose Abholung von Altmetall — schnell und unkompliziert. Weitere Gegenstände auf Anfrage.

---

## Структура проекта

```
RundumsHaus/
├── CLAUDE.md
├── TEAM.md
├── DEVLOG.md
├── STATUS.md
├── docs/
│   ├── tasks/            # Roadmap-файлы задач (P0 создаёт)
│   └── CREDENTIALS.md    # НЕ в git
├── src/                  # Исходный код (структура зависит от стека)
└── public/               # Статика, фото
```

---

## ПРОТОКОЛ ФОРМАЛИЗАЦИИ ЗАДАЧ

> **CEO ставит задачу → агент ОБЯЗАН выполнить протокол из промпта CEO.**
> **Без промпта CEO — агент читает этот раздел как минимальный стандарт.**

### Минимальный стандарт (если CEO не вставил промпт)

```
1. Прочитай CLAUDE.md и TEAM.md
2. Назначь ответственного специалиста
3. Сформируй ТС — покажи CEO, жди ОК
4. После ОК — выполняй строго по ТС
5. Проверь результат (build/test)
6. Запиши в DEVLOG.md и STATUS.md
```

**Нарушение любого шага = страйк. 2 страйка = увольнение.**

### Шаблон ТС (M / L / XL)

```
## ТС: [Краткое название]

**Ответственный:** #N — [Имя] — [Роль]
**Размер:** S / M / L / XL
**Скилл:** {какой скилл применён}

### Цель
[Одно предложение: что и зачем]

### Скоуп
**Включено:** [что входит]
**НЕ включено:** [что явно исключено]

### Критерии приёмки
- [ ] [Проверяемый критерий 1]
- [ ] [Проверяемый критерий N]

### Файлы
- [файлы для создания/изменения]

### Верификация
{build команда} → {тест команда} → {health check}
```

### Шаблон ТС (S)

```
## ТС: [Название]
**Ответственный:** #N | **Размер:** S
**Что сделать:** [1-2 предложения]
**Критерий:** [1 строка]
**Файлы:** [список]
```

### Размеры задач

| Размер | Описание | Бюджет итераций | ОК от CEO | Тесты |
|--------|---------|----------------|-----------|-------|
| **S** | 1 файл, <50 строк | 3 | Нет | Нет |
| **M** | Один модуль | 7 | Да | 1-2 unit |
| **L** | Несколько модулей | 15 | Да | Unit + Integration |
| **XL** | Кросс-доменная | 25 | Да + Landa Review | Unit + Integration + E2E |

**Бюджет превышен → СТОП → STATUS.md → ждать CEO.**

---

## ВЕРИФИКАЦИЯ

| Размер | Что проверить | Готово когда |
|--------|-------------|-------------|
| **S** | Build проходит | `build` OK |
| **M** | Build + Service + Тесты | Build OK + Health OK + тесты написаны и проходят |
| **L** | Build + Service + Тесты + Устройство/Браузер | Всё выше + проверка на реальном устройстве |
| **XL** | Всё от L + Ланда ревью + Chaos-сценарии | Всё выше + критическое ревью + тесты отказов |

**Нет галочек = не готово. Пропуск верификации = страйк.**

---

## ПРАВИЛА

### Команда
- Каждая задача = один ответственный из TEAM.md
- #1 Product Architect = правая рука CEO. Ведёт реестр замечаний
- 2 замечания = увольнение (без обсуждения)
- #14 Hans Landa = критический ревьюер (вызывается на XL и по запросу CEO)

### Скиллы (выбирает #1)
- L/XL фича → `brainstorming`
- UI/Дизайн → `ui-ux-pro-max`
- Баг → `systematic-debugging`
- Перед кодом → `test-driven-development`
- Ревью → `requesting-code-review`
- Параллельная работа → `dispatching-parallel-agents`
- Перед "готово" → `verification-before-completion`

### Числа (ЖЕЛЕЗНОЕ ПРАВИЛО)
> ВСЕ расчёты через скрипт (Python/Node.js). НИКОГДА в голове. Нарушение = увольнение.

### Credentials
- Все секреты в `docs/CREDENTIALS.md` (НЕ в git)
- IONOS логин получен на ebaias.muc@gmail.com

### Git
- Conventional Commits: `type(scope): description`
- Типы: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`
- Co-Authored-By: `Claude <noreply@anthropic.com>`

### ЗАПРЕЩЕНО (без исключений)
- Коммит в `main`/`master` напрямую (без ТС и одобрения)
- `git push --force`, `git reset --hard`
- Удалять файлы без указания CEO
- Менять `.env`, CI/CD без подтверждения
- Устанавливать пакеты вне скоупа ТС
- Начинать работу без ТС (M+ задачи)
- Решать за CEO (хостинг, домен, сервисы, архитектуру)

---

## ЖУРНАЛ (DEVLOG)

### Формат записи

```
### [SNNN] — ГГГГ-ММ-ДД — Заголовок (макс 60 символов)

**Задача:** [TNNN](docs/tasks/TNNN_название.md)
**Роли:** #N Роль
**Статус:** завершено | частично | заблокировано

**Что сделано:**
- Результат 1 (не процесс!)

**Ключевые решения:**
- Решение — причина

**Артефакты:** `файл1`, `файл2`

**Следующие шаги:**
- Конкретное действие
```

### STATUS.md (перезаписывать каждую сессию, макс 30 строк)

Текущий snapshot: этап, готово, следующее, блокеры.

---

## Риски

| # | Риск | Владелец | Стратегия |
|---|------|---------|-----------|
| 1 | Клиент не пришлёт фото для Referenzen | #1 | AI-фото Nano Banana + placeholder |
| 2 | FormSubmit.co down | #3 | Fallback: mailto: link |
| 3 | GitHub Pages ограничения (100MB) | #6 | Оптимизация фото, lazy loading |
| 4 | IONOS DNS propagation delay | #6 | Тестируем на GitHub Pages URL сначала |
| 5 | Клиент не может наполнять Referenzen | #1 | Максимально простой механизм + инструкция |
| 6 | Нарушение протокола | #1 | Strike System: 2 страйка = увольнение |

---

## CREATIVE ARSENAL (Закон 19)

> **Агент ОБЯЗАН использовать ТОЛЬКО библиотеки из Creative Toolkit.**
> Установка библиотеки не из арсенала = страйк.

Перед любой визуальной/анимационной задачей:
1. Открой `c:\Projects\MainCore\core\CREATIVE_TOOLKIT.md`
2. Найди в Decision Tree → что нужно → какая библиотека
3. Установи из арсенала
4. Используй рецепт из toolkit

**Decision Tree (краткая версия):**
- Scroll-анимации → GSAP + ScrollTrigger (`npm i gsap`)
- Smooth scroll → Lenis (`npm i lenis`)
- Page transitions → Barba.js + GSAP (если статика) или Next.js View Transitions
- Text animation → GSAP SplitText (бесплатно)
- UI компоненты → React Bits / Aceternity UI / Magic UI
- Parallax → react-scroll-parallax или GSAP ScrollTrigger (scrub: true)
- Glassmorphism → Tailwind: backdrop-blur-xl + bg-white/5

**Полный toolkit:** `c:\Projects\MainCore\core\CREATIVE_TOOLKIT.md`

---

## Security Baseline (перед деплоем)

- [ ] Секреты не в коде
- [ ] HTTPS only в production
- [ ] CORS whitelist настроен
- [ ] Форма защищена от спама (honeypot / reCAPTCHA)
