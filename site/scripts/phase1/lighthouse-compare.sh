#!/usr/bin/env bash
# PX-047 Phase 1 — Lighthouse comparison post-deploy vs baseline
# Compares current state to baseline directory
#
# Usage: bash site/scripts/phase1/lighthouse-compare.sh <baseline-dir>
# Example: bash site/scripts/phase1/lighthouse-compare.sh baseline-2026-06-09

set -euo pipefail

BASELINE_DIR="${1:-}"
if [ -z "$BASELINE_DIR" ]; then
  echo "Usage: bash $(basename "$0") <baseline-dir>"
  exit 1
fi

if [ ! -d "$(dirname "$0")/$BASELINE_DIR" ]; then
  echo "❌ Baseline dir not found: $BASELINE_DIR"
  exit 1
fi

BASE="https://rundumshaus-littawe.de/leistungen/gartenpflege"
POST_DIR="$(dirname "$0")/post-deploy-$(date -u +%Y-%m-%dT%H%M)"
CITIES=(osnabrueck bramsche freren)

mkdir -p "$POST_DIR"

# Run lighthouse post-deploy
cd "$POST_DIR"
for city in "${CITIES[@]}"; do
  echo "Running Lighthouse post-deploy: $city..."
  npx --yes lighthouse "$BASE/$city/" \
    --quiet \
    --chrome-flags="--headless=new --no-sandbox" \
    --form-factor=mobile \
    --only-categories=performance \
    --output=json \
    --output-path="./lh-$city.json" 2>&1 | tail -1 || true
done

cd "$(dirname "$0")"
echo ""
echo "=== COMPARISON: $BASELINE_DIR → $(basename "$POST_DIR") ==="
echo ""

# Compare
FAIL=0
for city in "${CITIES[@]}"; do
  BASELINE_FILE="$BASELINE_DIR/lh-$city.json"
  POST_FILE="$(basename "$POST_DIR")/lh-$city.json"

  if [ ! -f "$BASELINE_FILE" ] || [ ! -f "$POST_FILE" ]; then
    echo "⚠️  Missing lighthouse file for $city, skipping"
    continue
  fi

  node -e "
    const base = require('./$BASELINE_FILE');
    const post = require('./$POST_FILE');
    const ba = base.audits, pa = post.audits;
    const bc = base.categories.performance.score * 100;
    const pc = post.categories.performance.score * 100;
    const bLcp = ba['largest-contentful-paint'].numericValue;
    const pLcp = pa['largest-contentful-paint'].numericValue;
    const bCls = ba['cumulative-layout-shift'].numericValue;
    const pCls = pa['cumulative-layout-shift'].numericValue;

    const perfDelta = pc - bc;
    const lcpDelta = (pLcp - bLcp) / 1000;
    const clsDelta = pCls - bCls;

    console.log('$city:');
    console.log('  Perf: ' + Math.round(bc) + ' → ' + Math.round(pc) + ' (delta: ' + (perfDelta >= 0 ? '+' : '') + Math.round(perfDelta) + ')');
    console.log('  LCP:  ' + (bLcp/1000).toFixed(2) + 's → ' + (pLcp/1000).toFixed(2) + 's (delta: ' + (lcpDelta >= 0 ? '+' : '') + lcpDelta.toFixed(2) + 's)');
    console.log('  CLS:  ' + bCls.toFixed(3) + ' → ' + pCls.toFixed(3) + ' (delta: ' + (clsDelta >= 0 ? '+' : '') + clsDelta.toFixed(3) + ')');
    console.log('');

    // FAIL conditions
    if (perfDelta < -10) { console.log('  ❌ FAIL: Perf regression > 10 points'); process.exit(1); }
    if (lcpDelta > 0.5) { console.log('  ❌ FAIL: LCP regression > 0.5s'); process.exit(1); }
    if (clsDelta > 0.02) { console.log('  ❌ FAIL: CLS regression > 0.02'); process.exit(1); }
    console.log('  ✅ Within tolerance');
  " || FAIL=1
done

echo ""
if [ "$FAIL" = "0" ]; then
  echo "✅ All cities within Lighthouse tolerance"
  exit 0
else
  echo "🚨 LIGHTHOUSE REGRESSION DETECTED — consider rollback"
  exit 1
fi
