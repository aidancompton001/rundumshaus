#!/usr/bin/env bash
# PX-047 Phase 1 — Emergency rollback procedure
# Reverts deploy if canary or Lighthouse compare fails
#
# Usage: bash site/scripts/phase1/rollback.sh
# Pre-req: git tag pre-phase1-garten-baseline must exist

set -euo pipefail

echo "🚨 PHASE 1 ROLLBACK PROCEDURE"
echo "Verifying baseline tag exists..."

if ! git rev-parse pre-phase1-garten-baseline >/dev/null 2>&1; then
  echo "❌ Tag 'pre-phase1-garten-baseline' not found. Cannot rollback safely."
  exit 1
fi

PHASE1_SHA=$(git log --grep="phase 1\|phase-1\|PX-047" --oneline -1 --format=%H)
if [ -z "$PHASE1_SHA" ]; then
  echo "⚠️  Could not auto-detect Phase 1 commit. Manual revert required."
  exit 1
fi

echo "Phase 1 commit detected: $PHASE1_SHA"
echo ""
read -p "Confirm rollback to baseline? (yes/no): " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
  echo "Rollback cancelled."
  exit 1
fi

echo "Reverting..."
git revert "$PHASE1_SHA" --no-edit || {
  echo "⚠️  Revert failed (conflicts?). Trying file-level restore..."
  git checkout pre-phase1-garten-baseline -- \
    site/src/app/leistungen/gartenpflege/ \
    site/src/app/leistungen/\[service\]/\[city\]/page.tsx \
    site/src/lib/programmatic.ts \
    site/src/app/sitemap.ts
  git commit -am "rollback(px-047 phase 1): file-level restore from pre-phase1-garten-baseline"
}

git push origin master

echo ""
echo "✅ Rollback pushed. GH Actions deploy ~1.5 min."
echo "Next steps:"
echo "  1. Wait ~2 min for deploy to complete"
echo "  2. Run canary-verify.sh to confirm rollback successful"
echo "  3. Submit URL Inspection requests in GSC for top-5 cities:"
echo "     osnabrueck, bramsche, melle, wallenhorst, bielefeld"
echo "  4. Inform Kevin via WhatsApp using rollback template"
