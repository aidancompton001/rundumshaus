# STATUS — RundumsHaus

**Обновлён:** 2026-08-07
**Этап:** S074 — redesign-копия создана и верифицирована (HRC PASS, Landa CONFIRMED-ALL). Редизайн по референсу Kevin оплачен (100€), старт с GaLaBau-шаблона.

## Production state

- **Live:** https://rundumshaus-littawe.de ✅ (200, sitemap 511, задеплоен bc2eab6)
- **Tests:** 247/247 (master И копия) | **Copy:** `.worktrees/redesign` = ветка `redesign/modern-2026` (origin), идентичность доказана (15 claims, PASS)

## Готово (сессия 2026-08-06/07)

- [x] S072: HRC-диагноз Entrümpelung + worstRating 5→1 (PR #81)
- [x] S073: Schrottabholung → Garten- und Landschaftsbau live (PR #82, 40€ оплачено)
- [x] S074: redesign-копия + HRC-верификация полноты (3 раунда Ланды)

## Редизайн (оплачен 100€, в работе)

- Референс-макет Kevin получен; тексты остаются НАШИ, отзывы только реальные (Kevin подтвердил)
- Порядок: прототип на GaLaBau-шаблоне → утверждение Kevin → каскад на весь сайт одним релизом
- Админка (Sveltia) адаптируется под новый дизайн (указание CEO)
- Первый коммит ветки: .gitattributes `*.snap text eol=lf` + ci.yml добавить `redesign/**` + фикс пути в optimize-bielefeld-referenz.mjs

## Открытые риски (Landa, S074)

- **Деплой-аномалия:** push 036c9a2 не породил workflow-run (GitHub потерял событие). До следующего реального деплоя: после КАЖДОГО push в master проверять появление run'а
- Kevin: фото GaLaBau (placeholder = Gartenpflege), отзывы Entrümpelung-клиентов (2/9)

## Backlog

- GSC-замер «entrümpelung osnabrück» | wkdb-профиль (PX-075) | 6 canary-WARN (Gärtner-тайтлы)
- Wartungs-Pauschale 79€/мес
