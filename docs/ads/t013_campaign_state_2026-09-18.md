# T013 — состояние кампании Search-Entruempelung-OS (18.09.2026, снято из кабинета)

Кампания опубликована 18.09, campaignId 24259182381. **Показов нет: старт 31.12.2026** (страховка до ОК CEO). Статус кабинета: Enabled / Pending.

## Настройки кампании (страница Settings, прочитано из кабинета)

| Параметр | Значение в кабинете | План T013 |
|---|---|---|
| Тип / сети | Search, только Google Search Network (партнёры и КМС сняты) | так же |
| Стратегия | Maximise clicks, лимит CPC 4,00 € (поле прочитано: 4.00) | так же |
| Бюджет | 25,00 €/день | 25 €/день (решение CEO 17.09) |
| Локация | 35 km around Osnabrück (radius), Presence | 35 км, Presence (решение CEO 17.09) |
| Языки | English and German | не задано; German обязателен |
| Automatically created assets | Off | выкл. |
| Broad match keyword | Off | только Exact/Phrase |
| AI Max | выключен; Text customisation и Final URL expansion — turned off (обзор мастера) | выкл. |
| Даты | Start 31.12.2026, End not set | запуск по ОК CEO |
| Расписание | All day | 24/7, часы — на ассете звонка |
| Цели | Account default: Contacts (Kontakt, Anruf-Klick Website, WhatsApp-Klick Website, Calls from Ads), Leads from messages, Phone call leads | эти действия и Calls from ads |

## Группы и ключи (страница Keywords: «1 - 10 of 18»)

| Группа | Ключи |
|---|---|
| Entrümpelung | [entrümpelung osnabrück], "entrümpelung osnabrück", [entrümpelungsfirma osnabrück], [entrümpelung in der nähe], [entrümpelung], [entrümpelung kosten], [entrümpelung preise] |
| Haushaltsauflösung | [haushaltsauflösung osnabrück], "haushaltsauflösung osnabrück", [wohnungsauflösung osnabrück], "wohnungsauflösung osnabrück", [haushaltsauflösung], [wohnungsauflösung], [nachlassauflösung osnabrück] (статус Low search volume) |
| Keller & Dachboden | "keller entrümpeln", "dachboden entrümpeln", "garage entrümpeln", [kellerentrümpelung osnabrück] |

Итого 18 ключей = план. Минус-слова кампании: «1 - 10 of 45» — 44 phrase + [entsorgung osnabrück] exact = план.

## Объявления (RSA, по одному на группу)

15 заголовков и 4 описания из плана (длины проверены скриптом: заголовки ≤ 30, описания 79–84 ≤ 90); «Anruf oder Nachricht genügt» заменён на «Faire Preise» (Кевин 17.09: цену не писать). Первый заголовок группы: Entrümpelung Osnabrück / Haushaltsauflösung Osnabrück / Keller entrümpeln Osnabrück. Посадочная у всех: /leistungen/entruempelung/osnabrueck/. Пути: Entruempelung/Osnabrueck, Aufloesung/Osnabrueck, Keller/Osnabrueck. **Закрепление 1-го заголовка не сделано.**

## Ассеты

- Звонок (кампания): 01523 9603175, все дни 07:00–22:00, Call reporting on
- Sitelinks (кампания, на проверке Google): Haushaltsauflösung → посадочная; Unsere Leistungen → /leistungen/; Über uns → /ueber-uns/; Kontakt → /kontakt/
- Callouts (кампания): Festpreis, Kostenlose Besichtigung, Kurzfristige Termine, Entsorgung inklusive
- Structured snippet (кампания, German, Dienstleistungen): Entrümpelung, Haushaltsauflösung, Wohnungsauflösung, Kellerentrümpelung, Dachbodenräumung
- Business name и logo (кампания)
- **Аккаунт (добавил Кевин 18.09 05:56):** callouts Kostenlose Besichtigung, Alles aus einer Hand, Faire Festpreise, Schnelle Termine; structured snippet «Dienstleistungen: Gartenpflege, Rasenneuanlage…». Google: snippets уровня аккаунта, кампании и группы показываются вместе → садовый список может выйти под объявлением Entrümpelung

## Отклонения от плана

1. Sitelink «Entrümpelung Osnabrück» заменён на «Unsere Leistungen»: он вёл бы на ту же страницу, что и объявление; якоря раздела на посадочной нет (id только у служебных узлов) — «Haushaltsauflösung» ведёт на посадочную без якоря
2. Structured snippet добавлен (в плане не было) — против садового snippet уровня аккаунта
3. Языки English + German (план молчит)
4. Закрепление заголовка 1 не сделано

## Круг 1 Ланды — закрытие HIGH (18.09)

- **H-01** Итог сверен постранично из кабинета, файлы: `docs/ads/t013_keywords_0918.txt` (18 = план, скрипт: нет в кабинете ∅, лишние ∅), `docs/ads/t013_negatives_0918.txt` (63 = 44 плана + 1 exact + 18 по H-04/L-03, скрипт: ∅/∅; ни одно минус-слово не блокирует свой ключ), `docs/ads/t013_ads_0918.txt`. Найдено и исправлено: в RSA групп Haushaltsauflösung и Keller было 14 заголовков вместо 15 — дописаны
- **H-02** Auto-apply рекомендаций: «0 of 7», «0 of 14» — выключено (`docs/ads/t013_autoapply_off_0918.png`); рекомендации 18.09 05:56 Кевин применил вручную. Просьба «не трогать» и ежедневный Change history первую неделю — текст Кевину у CEO
- **H-03** Пересечение с Leads-Search-2: `grep -iE "entrüm|auflös|räum|sperr|keller|dachboden"` по выгрузке ключей Leads-Search-2 от 17.09 (`.playwright-mcp/kw-20260917.csv`, 214 строк) → 0 строк; Change history 18.09 — у Leads-Search-2 менялись только бюджет и стратегия, ключи нет
- **H-04** Минус-слова: verkauf, verkaufe, kaufen, heute, samstag, sonntag, wochenende, privat, möbel, antik, antiquitäten, schnäppchen (+ L-03: münster, bielefeld, bremen, hannover, rheine, lingen) — добавлены, phrase
- **H-05** Не закрывается в кабинете: нужен ответ Кевина — текст у CEO
