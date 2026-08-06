# STATUS — RundumsHaus

**Обновлён:** 2026-08-06
**Этап:** S073 — Garten- und Landschaftsbau LIVE (PX-077, PR #82), Schrottabholung удалена с редиректами.

## Production state

- **Live:** https://rundumshaus-littawe.de ✅ | **Admin:** /admin/ (Sveltia, коллекция galabau добавлена)
- **Tests:** 247/247 | **Canary:** 69 PASS / 0 FAIL | **Sitemap:** 98×garten-landschaftsbau, 0×schrottabholung
- **Redirects:** 100 стабов /leistungen/schrottabholung/* → galabau (meta refresh + canonical)

## Готово (эта сессия)

- [x] S072: HRC-диагноз Entrümpelung + фикс worstRating 5→1 (PR #81)
- [x] S073: услуга Schrottabholung → Garten- und Landschaftsbau, текст Kevin (PR #82)

## В ожидании

- **Kevin:** фото GaLaBau (сейчас placeholder = Gartenpflege-фото) — через Admin-Panel
- **Kevin:** отзывы Entrümpelung-клиентов с упоминанием услуги + города (2/9 сейчас)
- **CEO:** GSC-замер «entrümpelung osnabrück» + мониторинг переиндексации galabau-URL

## Backlog

- 6 canary-WARN: длинные Gärtner-тайтлы (Kevin meta-pattern) — S-задача
- wkdb-профиль (план PX-075) | Places API auto-pull | TSX→CMS страницы
- Оплата Kevin (~250€ за PX-068+; PX-077 = 40€, названо Kevin 2026-08-06) | Wartungs-Pauschale 79€/мес
