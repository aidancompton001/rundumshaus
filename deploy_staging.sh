#!/usr/bin/env bash
# Стейджинг на сервер CEO: /rundumshaus/ под noindex.
#
# Landa, F-93 (CRITICAL): в шапке было написано «прод-сборка НЕ трогается»,
# а строка `rm -rf out-staging out` её сносила, и `mv out out-staging`
# уносила остаток. После КАЖДОГО деплоя каталог site/out переставал
# существовать, и вся приёмка задачи молча падала с 10/10 до 4/10 — ровно
# это ревьюер и увидел, получив «замороженный и проверенный» сайт.
# Комментарий врал коду. Теперь прод-сборка восстанавливается здесь же,
# и скрипт не заканчивается, пока её нет.
set -euo pipefail
SRV=root@187.33.159.205
DST=/opt/rundumshaus-preview

cd site
rm -rf out-staging
# Git Bash на Windows превращает /rundumshaus в путь C:/Program Files/Git/...
# MSYS_NO_PATHCONV это выключает — иначе Next получает мусор вместо пути
export MSYS_NO_PATHCONV=1
export NEXT_PUBLIC_BASE_PATH=/rundumshaus
npm run build
mv out out-staging
unset NEXT_PUBLIC_BASE_PATH
cd ..

# CNAME привязывает к домену клиента и на чужом сервере вреден
rm -f site/out-staging/CNAME
echo "файлов в стейджинг-сборке: $(find site/out-staging -type f | wc -l)"

ssh $SRV "test -d $DST && tar czf ${DST}.bak-$(date +%Y%m%d-%H%M%S).tgz -C $DST . || true"
# rsync на этой машине не установлен — переносим tar-потоком через ssh.
# --delete повторяем вручную: каталог очищается перед распаковкой, иначе
# удалённые страницы остались бы жить на стейджинге и вводили в заблуждение.
ssh $SRV "rm -rf $DST && mkdir -p $DST"
tar czf - -C site/out-staging . | ssh $SRV "tar xzf - -C $DST"
ssh $SRV "ls $DST | head -5; du -sh $DST"

# Прод-сборка: пересобрать ОБЯЗАТЕЛЬНО. Стейджинг собирается с basePath
# /rundumshaus, прод — без него, поэтому просто скопировать каталог нельзя.
cd site
unset NEXT_PUBLIC_BASE_PATH || true
npm run build
cd ..
PAGES=$(find site/out -name '*.html' | wc -l)
echo "прод-сборка восстановлена: $PAGES страниц в site/out"
if [ "$PAGES" -lt 600 ]; then
  echo "ОШИБКА: прод-сборка не восстановлена ($PAGES страниц) — приёмка задачи будет красной" >&2
  exit 1
fi
