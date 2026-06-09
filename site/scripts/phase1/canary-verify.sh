#!/usr/bin/env bash
# PX-047 Phase 1 — Post-deploy canary verification (15-min window)
# Runs 8 critical checks across 5 sample cities
# Exit code 0 = ALL PASS, 1 = at least one FAIL (trigger rollback consideration)
#
# Usage: bash site/scripts/phase1/canary-verify.sh
# Run immediately after deploy completes

set -uo pipefail

BASE="https://rundumshaus-littawe.de/leistungen/gartenpflege"
SAMPLES=(osnabrueck bramsche bad-iburg freren bielefeld)
FAIL=0
LOG="$(dirname "$0")/canary-$(date -u +%Y-%m-%dT%H%M).log"

echo "🐤 Canary verification: $LOG"
{
  echo "Canary run: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo ""
} > "$LOG"

mark_fail() {
  echo "❌ FAIL: $1" | tee -a "$LOG"
  FAIL=1
}

mark_pass() {
  echo "✅ PASS: $1" >> "$LOG"
}

mark_warn() {
  echo "⚠️ WARN: $1" | tee -a "$LOG"
}

for city in "${SAMPLES[@]}"; do
  URL="$BASE/$city/"
  HTML=$(curl -sL "$URL")
  STATUS=$(curl -sLo /dev/null -w '%{http_code}' "$URL")

  echo "" | tee -a "$LOG"
  echo "=== Testing: $city ===" | tee -a "$LOG"

  # Check 1: HTTP 200
  if [ "$STATUS" = "200" ]; then mark_pass "[$city] HTTP 200"
  else mark_fail "[$city] HTTP $STATUS expected 200"; fi

  # Check 2: Word count >= 600
  WORDS=$(echo "$HTML" | sed 's/<[^>]*>/ /g' | tr -s ' \n' ' ' | wc -w)
  if [ "$WORDS" -ge 600 ]; then mark_pass "[$city] words=$WORDS (>=600)"
  else mark_fail "[$city] words=$WORDS expected >=600"; fi

  # Check 3: 9+ H2 sections
  H2=$(echo "$HTML" | grep -cE '<h2')
  if [ "$H2" -ge 9 ]; then mark_pass "[$city] H2 count=$H2 (>=9)"
  else mark_fail "[$city] H2 count=$H2 expected >=9"; fi

  # Check 4: FAQ Schema present
  if echo "$HTML" | grep -q '"@type":"FAQPage"'; then mark_pass "[$city] FAQ Schema present"
  else mark_fail "[$city] FAQ Schema missing"; fi

  # Check 5: Kevin CTA "kostenloses Angebot" present
  if echo "$HTML" | grep -q 'kostenloses Angebot'; then mark_pass "[$city] CTA 'kostenloses Angebot' present"
  else mark_fail "[$city] CTA 'kostenloses Angebot' missing"; fi

  # Check 6: Old "auf einen Blick" FaktenBlock REMOVED
  if echo "$HTML" | grep -q 'auf einen Blick'; then mark_fail "[$city] OLD FaktenBlock 'auf einen Blick' still present"
  else mark_pass "[$city] OLD FaktenBlock removed"; fi

  # Check 7: Title length within Google limit
  TITLE=$(echo "$HTML" | grep -oE '<title>[^<]+' | head -1 | sed 's/<title>//')
  TLEN=${#TITLE}
  if [ "$TLEN" -le 65 ]; then mark_pass "[$city] title=$TLEN chars"
  else mark_warn "[$city] title=$TLEN chars (>65, Google may truncate): '$TITLE'"; fi
done

echo "" | tee -a "$LOG"
echo "=== Special checks ===" | tee -a "$LOG"

# Check 8: Osnabrück should NOT have "0 km" distance phrase
if curl -sL "$BASE/osnabrueck/" | grep -qE '0\s*km|0&nbsp;km'; then
  mark_fail "[osnabrueck] '0 km' phrase detected — distancePhrase guard broken"
else
  mark_pass "[osnabrueck] no '0 km' phrase"
fi

# Check 9: Freren (T3 50km) should NOT show Osnabrück's neighbors
# Belm is neighbor of Osnabrück, NOT of Freren
if curl -sL "$BASE/freren/" | grep -qE 'in Belm|Gärtner.*Belm'; then
  mark_fail "[freren] False neighbor 'Belm' detected — neighbors hardcoded bug"
else
  mark_pass "[freren] No false Osnabrück neighbors"
fi

# Check 10: Bielefeld (>60km) — Einsatzgebiet text shouldn't claim "60 km Umkreis"
if curl -sL "$BASE/bielefeld/" | grep -qE '60\s*km\s*Umkreis.*Bielefeld|Bielefeld.*60\s*km\s*Umkreis'; then
  mark_fail "[bielefeld] False 'bis 60 km Umkreis' claim for 55km city (borderline)"
else
  mark_pass "[bielefeld] Einsatzgebiet claim safe"
fi

echo "" | tee -a "$LOG"
if [ "$FAIL" = "0" ]; then
  echo "🎉 ALL CANARY CHECKS PASSED" | tee -a "$LOG"
  exit 0
else
  echo "🚨 CANARY FAILURES DETECTED — consider rollback" | tee -a "$LOG"
  echo "Log: $LOG"
  exit 1
fi
