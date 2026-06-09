#!/usr/bin/env bash
# PX-047 Phase 1 — Pre-deploy baseline snapshot
# Captures current state of 5 representative cities for post-deploy diff
#
# Usage: bash site/scripts/phase1/baseline.sh
# Output: site/scripts/phase1/baseline.txt + raw_*.html files

set -euo pipefail

BASE="https://rundumshaus-littawe.de/leistungen/gartenpflege"
OUT_DIR="$(dirname "$0")/baseline-$(date -u +%Y-%m-%d)"
SAMPLES=(osnabrueck bramsche bad-iburg freren bielefeld)

mkdir -p "$OUT_DIR"
echo "📸 Baseline snapshot: $OUT_DIR" >&2

{
  echo "# Phase 1 Baseline — $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo ""
} > "$OUT_DIR/baseline.txt"

for city in "${SAMPLES[@]}"; do
  URL="$BASE/$city/"
  HTML="$OUT_DIR/raw_$city.html"

  curl -sL "$URL" -o "$HTML"

  {
    echo "=== $city ==="
    echo "URL: $URL"
    echo "HTTP: $(curl -sLo /dev/null -w '%{http_code}' "$URL")"
    echo "HTML size: $(wc -c < "$HTML") bytes"
    echo "Visible words: $(sed 's/<[^>]*>/ /g' < "$HTML" | tr -s ' \n' ' ' | wc -w)"
    echo "Title: $(grep -oE '<title>[^<]+' "$HTML" | head -1 | sed 's/<title>//')"
    echo "Meta description: $(grep -oE 'name="description" content="[^"]+' "$HTML" | head -1 | sed 's/.*content="//')"
    echo "H1: $(grep -oE '<h1[^>]*>[^<]+' "$HTML" | head -1 | sed 's/<h1[^>]*>//')"
    echo "H2 count: $(grep -cE '<h2' "$HTML")"
    echo "Links (unique): $(grep -oE 'href="[^"]*"' "$HTML" | sort -u | wc -l)"
    echo "Schema @types: $(grep -oE '"@type":"[^"]+' "$HTML" | sort -u | tr '\n' ' ')"
    echo "Has 'Festpreis Beispiel' (old template marker): $(grep -c 'Festpreis Beispiel' "$HTML")"
    echo "Has 'kostenloses Angebot' (new template marker): $(grep -c 'kostenloses Angebot' "$HTML")"
    echo "Has 'auf einen Blick' (old FaktenBlock): $(grep -c 'auf einen Blick' "$HTML")"
    echo ""
  } >> "$OUT_DIR/baseline.txt"
done

echo "✅ Baseline captured: $OUT_DIR/baseline.txt"
echo "Now create git tag: git tag pre-phase1-garten-baseline && git push origin pre-phase1-garten-baseline" >&2
