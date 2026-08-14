#!/usr/bin/env bash
# Стейджинг на сервер CEO: /rundumshaus/ под noindex.
# Прод-сборка НЕ трогается: стейджинг собирается в отдельный каталог с basePath.
set -euo pipefail
SRV=root@187.33.159.205
DST=/opt/rundumshaus-preview

cd site
rm -rf out-staging out
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
rsync -az --delete site/out-staging/ $SRV:$DST/
ssh $SRV "ls $DST | head -5; du -sh $DST"
