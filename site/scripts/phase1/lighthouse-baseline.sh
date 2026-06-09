#!/usr/bin/env bash
# PX-047 Phase 1 — Lighthouse mobile baseline (pre-deploy)
# Captures performance metrics for 3 representative cities
# Output: site/scripts/phase1/baseline-YYYY-MM-DD/lh-{city}.json
#
# Usage: bash site/scripts/phase1/lighthouse-baseline.sh
# Requires: npx lighthouse installed (auto-downloads if missing)

set -euo pipefail

BASE="https://rundumshaus-littawe.de/leistungen/gartenpflege"
OUT_DIR="$(dirname "$0")/baseline-$(date -u +%Y-%m-%d)"
CITIES=(osnabrueck bramsche freren)

mkdir -p "$OUT_DIR"
echo "🏠 Lighthouse baseline: $OUT_DIR"

cd "$OUT_DIR"

for city in "${CITIES[@]}"; do
  echo ""
  echo "=== Lighthouse: $city ==="
  npx --yes lighthouse "$BASE/$city/" \
    --quiet \
    --chrome-flags="--headless=new --no-sandbox" \
    --form-factor=mobile \
    --only-categories=performance \
    --output=json \
    --output-path="./lh-$city.json" 2>&1 | tail -2 || true

  if [ -f "./lh-$city.json" ]; then
    node -e "
      const lh = require('./lh-$city.json');
      const a = lh.audits;
      const c = lh.categories;
      console.log('$city: Perf=' + Math.round(c.performance.score * 100) +
                  ' / LCP=' + a['largest-contentful-paint'].displayValue +
                  ' / CLS=' + a['cumulative-layout-shift'].displayValue +
                  ' / TBT=' + a['total-blocking-time'].displayValue +
                  ' / FCP=' + a['first-contentful-paint'].displayValue);
    " || true
  fi
done

echo ""
echo "✅ Baseline saved: $OUT_DIR"
echo "Run lighthouse-compare.sh after deploy to compare."
