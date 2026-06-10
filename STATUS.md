# STATUS — RundumsHaus

**Обновлён:** 2026-06-10
**Этап:** **PX-073 deployed** (PR #77) — deep-audit CEO закрыт: 1 BLOCKER (referenzen images variants) + 5 WARN исправлены. Admin Panel (Sveltia CMS) live, Kevin активно редактирует сам (16+ коммитов в первый день).

## Production state

- **Live:** https://rundumshaus-littawe.de ✅ | **Admin:** /admin/ (Sveltia 0.166.1 pinned, classic PAT)
- **Tests:** 248/248 | **Canary:** 5 услуг × 69 PASS / 0 FAIL | **Validator:** G1-G6 green
- **Kevin self-edit:** тексты city-шаблонов (5 JSON), homepage, services, SEO-patterns, изображения (26 managed → auto-variants), Einstellungen (phone/email — теперь сквозные, PX-073)

## Готово (эта сессия)

- [x] **PX-052→067** Kevin WhatsApp-фидбек: CTAs, navbar, reorder секций, /leistungen/ cleanup
- [x] **PX-064→066** Startseite redesign (тексты Kevin verbatim)
- [x] **PX-068** Admin Panel: design doc → adversarial review → полный вариант, live
- [x] **PX-069** Все city-тексты Kevin-editable (legal urgency: Wettbewerbsrecht)
- [x] **PX-070→072** Inventory audit, IO threshold fix, heroImages
- [x] **PX-073** Deep-audit: referenzen variants BLOCKER, контакты из site.json (~490 страниц), config hardening

## Backlog

- Places API auto-pull reviews (Google ещё не индексировал профиль) | OAuth Phase D
- Slug rename /dacharbeiten/→/dachservice/ (нужны redirects) — Kevin намекал
- TSX-hardcoded страницы → CMS (ueber-uns, osnabrueck, objektpflege, rasen-neuanlage)
- Оплата Kevin (~250€ за PX-068+) | Wartungs-Pauschale 79€/мес

## Следующая сессия

- Реакция Kevin на admin panel (фото Referenzen — теперь безопасно)
- GSC: индексация новых meta-patterns Kevin'а
