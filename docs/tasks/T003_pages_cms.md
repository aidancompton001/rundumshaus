# T003 — Pages CMS: визуальная админка для клиента

**Дата:** 2026-04-16
**Статус:** P0 — roadmap готов, ждёт ОК CEO
**Ответственный:** #3 Marco Reiter (Frontend Engineer)
**Размер:** M
**Скилл:** writing-plans

---

## Цель

Клиент Kevin заходит на app.pagescms.org, видит визуальные поля на немецком, меняет текст или добавляет услугу, нажимает Save — сайт обновляется за 1-2 минуты. Бесплатно. Навсегда.

---

## Анализ

### 6 JSON-файлов контента (текущая структура)

| Файл | Что Kevin может менять | Сложность для CMS |
|------|----------------------|-------------------|
| `site.json` | Телефон, email, адрес | Простая — flat fields + nested address |
| `homepage.json` | Hero текст, Über uns текст, статистика | Средняя — nested hero/about + array stats |
| `weitere-leistungen.json` | Список доп. услуг (добавить/убрать) | Простая — array of strings |
| `services.json` | 5 услуг: title, description | Средняя — array of objects |
| `referenzen.json` | Добавить проект (title, описание, фото) | Средняя — array of objects + images |
| `contact-form.json` | Тексты формы, success/error messages | Простая — flat fields |

### Pages CMS конфигурация

`.pages.yml` в корне репо определяет:
- `media` — куда загружать картинки
- `content` — коллекции (каждая = один JSON файл)
- Для каждой коллекции: `fields` с типами (text, textarea, number, image, list, object)
- Labels на немецком для каждого поля

### Авторизация

Pages CMS hosted (app.pagescms.org) использует GitHub OAuth. Клиенту НУЖЕН GitHub аккаунт (бесплатный). Его нужно добавить как collaborator на репо. Magic-link без GitHub НЕ поддерживается для hosted версии.

**Решение:** Создать Kevin GitHub аккаунт (CEO помогает) → добавить как collaborator → Kevin логинится через GitHub на app.pagescms.org.

---

## Roadmap

### Wave 1: Конфигурация Pages CMS (1 файл)

1. Создать `.pages.yml` в корне репо с конфигурацией:
   - media: `site/public/images/` (input path для загрузки)
   - media output: `/images/` (как ссылки в JSON)
2. Описать коллекцию `site` (site.json):
   - Поля: Firmenname, Inhaber, Straße, Stadt, PLZ, Telefon, E-Mail
   - Labels на немецком
3. Описать коллекцию `homepage` (homepage.json):
   - Hero: Überschrift, Unterüberschrift
   - Über uns: Überschrift, Text
   - Statistik: 3 items (Zahl, Einheit, Beschreibung)
4. Описать коллекцию `weitere-leistungen` (weitere-leistungen.json):
   - Überschrift, Unterüberschrift, Fußzeile
   - Dienstleistungen: список строк (добавить/убрать)
5. Описать коллекцию `services` (services.json):
   - Überschrift, Unterüberschrift
   - 5 Leistungen: Titel, Kurzbeschreibung, Detailbeschreibung
   - icon, image, detailImage — readonly или hidden (Kevin не трогает)
6. Описать коллекцию `referenzen` (referenzen.json):
   - Überschrift, Leertext
   - Projekte: Titel, Beschreibung, Datum, Vorher-Bild, Nachher-Bild
7. Описать коллекцию `contact-form` (contact-form.json):
   - Überschrift, Einleitung, Button-Text, Erfolgsmeldung, Fehlermeldung

### Wave 2: CI Safety Net

8. Добавить JSON validation step в deploy.yml (перед Lint):
   - `node -e "JSON.parse(require('fs').readFileSync('src/data/site.json'))"` для каждого файла
   - Или простой скрипт `scripts/validate-json.js`
9. Тест: намеренно сломать JSON → build должен fail → старая версия live

### Wave 3: Доступ клиента

10. Создать Kevin GitHub аккаунт (CEO делает с клиентом)
11. Добавить Kevin как collaborator на repo (write access)
12. Kevin логинится на app.pagescms.org → авторизует GitHub → видит админку

### Wave 4: Тестирование

13. Тест: открыть app.pagescms.org → выбрать репо → увидеть коллекции
14. Тест: изменить текст в Weitere Leistungen → Save → проверить что commit прошёл → CI rebuild → сайт обновился
15. Тест: добавить новый пункт в Weitere Leistungen → Save → проверить JSON валидный → сайт обновился
16. Тест: удалить пункт → Save → всё работает
17. Тест: изменить телефон в site.json → проверить что обновился на всех страницах

### Wave 5: Инструкция для Kevin

18. Создать `docs/ANLEITUNG_KEVIN.md` — пошаговая инструкция на немецком:
    - Как зайти (app.pagescms.org)
    - Как авторизоваться (GitHub login)
    - Где что менять (скриншоты полей)
    - Как добавить Weitere Leistung
    - Как добавить Referenz
    - Как сохранить
    - Что делать если что-то не работает (написать CEO)
19. Отправить Kevin инструкцию + ссылку

---

## Чеклист приёмки

- [ ] `.pages.yml` в репо, конфиг валидный
- [ ] 6 коллекций описаны с German labels
- [ ] app.pagescms.org показывает все коллекции
- [ ] Тест: изменить текст → Save → сайт обновился
- [ ] Тест: добавить Weitere Leistung → Save → сайт обновился
- [ ] Тест: невалидный JSON → CI fails → старая версия live
- [ ] Kevin добавлен как collaborator
- [ ] Инструкция на немецком готова
- [ ] Build clean, тесты pass

---

## Открытые вопросы

1. **GitHub аккаунт Kevin:** CEO поможет создать? Или Kevin сам?
2. **Какие поля скрыть от Kevin:** icon, image paths в services.json — скрыть или readonly? (рекомендация: скрыть)
3. **Navigation (site.json):** давать Kevin менять навигацию? (рекомендация: НЕТ — скрыть, может сломать)
