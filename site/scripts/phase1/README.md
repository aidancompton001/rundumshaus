# Phase 1 Validation Scripts

> PX-047 Phase 1 (Garten template refactor) — pre-deploy + post-deploy validation tooling

## Order of execution

```
1. Pre-deploy (T-15 min)
   bash site/scripts/phase1/baseline.sh
   bash site/scripts/phase1/lighthouse-baseline.sh
   git tag pre-phase1-garten-baseline
   git push origin pre-phase1-garten-baseline

2. Deploy (PR-B merged)
   # GH Actions auto-runs

3. Post-deploy canary (T+0 to T+15 min)
   bash site/scripts/phase1/canary-verify.sh
   # Exit 0 = PASS, Exit 1 = consider rollback

4. Lighthouse comparison (T+15 to T+45 min)
   bash site/scripts/phase1/lighthouse-compare.sh baseline-2026-06-09
   # Exit 0 = PASS, Exit 1 = consider rollback

5. If FAIL — rollback
   bash site/scripts/phase1/rollback.sh
```

## Scripts

| Script | When | Purpose |
|--------|------|---------|
| `baseline.sh` | Pre-deploy | Snapshot 5 sample cities: HTML size, words, title, meta, H2 count, links, Schema types |
| `lighthouse-baseline.sh` | Pre-deploy | Lighthouse mobile measurements for 3 cities |
| `canary-verify.sh` | Post-deploy 0-15 min | 10 critical checks (HTTP, words, H2, FAQ Schema, CTA, old markers, title length, "0 km" guard, false neighbors, Einsatzgebiet claim) |
| `lighthouse-compare.sh` | Post-deploy 15-45 min | Compare current Lighthouse vs baseline (Perf delta, LCP delta, CLS delta) |
| `rollback.sh` | Emergency | Revert PR + restore baseline files + push |

## Sample cities used

- **osnabrueck** — Tier 1, distance 0km, hub city (preview)
- **bramsche** — Tier 1, distance 17km, target city
- **bad-iburg** — Tier 1, distance 17km, different region
- **freren** — Tier 3, distance 50km, edge case (was thin-content)
- **bielefeld** — Tier 3, distance 55km, far edge

## Tolerance thresholds (canary)

- HTTP: must be 200
- Word count: >= 600
- H2 sections: >= 9
- FAQ Schema: must be present
- CTA "kostenloses Angebot": must be present
- Old "auf einen Blick": must be ABSENT
- Title length: <= 65 chars (warn if exceeds)
- "0 km" phrase: must be ABSENT on osnabrueck
- "in Belm" on freren: must be ABSENT (false neighbor check)

## Lighthouse tolerance

- Perf score: delta >= -10 (cannot drop > 10 points)
- LCP: delta <= +0.5s (cannot grow > 0.5s)
- CLS: delta <= +0.02 (cannot grow > 0.02)

Any breach = rollback consideration.

## Manual GSC monitoring (7-day window)

Daily checklist:
- [ ] Coverage → Indexed: count Garten URLs (alert if < 87 = 10% drop from ~97 baseline)
- [ ] Coverage → Crawled — not indexed: alert if Garten URLs in bucket grow > 5
- [ ] Performance → filter `/gartenpflege/`: clicks, impressions, CTR, position
- [ ] Screenshots: Coverage chart + Performance table → `gsc-day-N.png`

## Related docs

- `docs/PHASE1_FINDINGS_LOG.md` — all 36 findings
- `docs/PLAYBOOK_PROGRAMMATIC_TEMPLATE_REWRITE.md` — universal pattern
- `docs/LESSONS.md` — L-011 through L-015
