# STATUS — RundumsHaus

**Обновлён:** 2026-08-07
**Этап:** T008 Ф1-Ф3 завершены — CDP-промпт готов к запуску в Claude Desktop.

## Production state

- **Live:** https://rundumshaus-littawe.de (200, sitemap 511, деплой-триггер проверен)
- **Tests:** 247/247 | **Копия:** ветка `redesign/modern-2026` (worktree `.worktrees/redesign`)

## Редизайн (оплачен 100€) — где мы

- [x] Ф1 пиксельный тулкит (из HennerHeede-Site) + свои скрипты замера
- [x] Ф2 макет измерен: палитра, карта высот, геометрия карточек, типографика (cap-height)
- [x] Ф3 CDP-промпт (9 экранов, режим репликации 1:1) — 4 раунда Landa
- [ ] **СЛЕДУЮЩИЙ ШАГ CEO:** скопировать зону COPY из `docs/design/CDP-RundumsHaus.md`
      в Claude Desktop, приложить ТОЛЬКО `docs/design/ref/reference.jpg` → получить `/v1-desktop/`
- [ ] Ф4-Ф8: порт токенов и секций, каскад на 490 страниц, админка, preview Kevin, деплой

## Измеренные константы макета

- Акцент `#5A7F1B` (текст на светлом — `#4A6B16`, 5.81:1) · Тёмный `#10171F` · Фон `#F8F8F8`
- Карточки услуг: 5 шт, ширина 16.2-17.8 %, гэп 1.5 % → при 1280px: 240px / gap 21px
- Типографика: H1 cap 34 / H2 cap 17 → **отношение 2.0** (ключевая пропорция)

## Открытые вопросы

- **Kevin:** подтвердить часы работы Mo-Sa 08:00-18:00 (есть в макете, нет в данных бизнеса)
- **Kevin:** фото GaLaBau (сейчас placeholder), отзывы Entrümpelung-клиентов (2 из 9)
- В макете неверные телефон и e-mail (info@) — в промпте зафиксированы реальные из site.json

## Backlog

- GSC-замер «entrümpelung osnabrück» | wkdb-профиль | 6 canary-WARN (Gärtner-тайтлы)
- Wartungs-Pauschale 79€/мес
