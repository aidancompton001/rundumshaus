# DNS Instructions — rundumshaus-littawe.de (IONOS)

## Шаг 1: GitHub Pages deploy (уже сделано)

Сайт доступен: `https://aidancompton001.github.io/rundumshaus/`

## Шаг 2: IONOS DNS настройка

### Вариант A: CNAME (рекомендуется)

1. Войти в IONOS: ebaias.muc@gmail.com
2. Domains → rundumshaus-littawe.de → DNS Settings
3. Удалить существующие A-записи для @ (если есть)
4. Добавить CNAME:
   - Host: `www`
   - Points to: `aidancompton001.github.io`
5. Для корневого домена (без www) — IONOS может требовать A-записи:
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`

### Вариант B: Только A-записи

1. A record: `@` → `185.199.108.153`
2. A record: `@` → `185.199.109.153`
3. A record: `@` → `185.199.110.153`
4. A record: `@` → `185.199.111.153`
5. CNAME: `www` → `aidancompton001.github.io`

## Шаг 3: GitHub Settings

1. GitHub repo → Settings → Pages
2. Custom domain: `rundumshaus-littawe.de`
3. ✅ Enforce HTTPS
4. Ждать 10-30 минут (DNS propagation)

## Шаг 4: Убрать basePath (после DNS)

В `site/next.config.ts` заменить:
```typescript
const basePath = isProd ? "/rundumshaus" : "";
```
На:
```typescript
const basePath = "";
```

Commit + push → CI redeploy.

## Шаг 5: Проверка

- [ ] https://rundumshaus-littawe.de загружается
- [ ] CSS работает
- [ ] Навигация работает
- [ ] Форма отправляет email
- [ ] HTTPS (замок в браузере)
