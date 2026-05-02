# AI Search Testing Protocol — RundumsHaus

**Purpose:** Track citation rate of rundumshaus-littawe.de in AI search engines over 12 weeks. Compare against baseline (2026-05-02). Provide hard evidence for CEO/Kevin proof-of-result.

**Cadence:** Bi-weekly (every 2 weeks). ~30 minutes per session.

---

## Engines (6)

1. **ChatGPT Search** — https://chat.openai.com (Search-Modus aktivieren über das Search-Toggle)
2. **Perplexity** — https://perplexity.ai (Default Pro Search)
3. **Claude Search** — https://claude.ai (Web Search aktivieren über das Search-Toggle)
4. **Google Gemini** — https://gemini.google.com
5. **You.com** — https://you.com (Smart Mode)
6. **Bing Copilot** — https://www.bing.com/chat

---

## Test Queries (6 fix, plus 2 rotating)

### Fix queries (every test cycle)
1. `Hausmeister Osnabrück`
2. `Entrümpelung Bramsche`
3. `Gärtner Melle`
4. `Dachreinigung Osnabrück`
5. `Schrottabholung Osnabrück`
6. `Rund ums Haus Littawe` (brand check)

### Rotating queries (2 of these per cycle, rotate)
- `Gärtner Bielefeld`
- `Entrümpelung Münster`
- `Hausmeisterservice Mehrfamilienhaus Osnabrück`
- `Hecke schneiden lassen Osnabrück Kosten`
- `Haushaltsauflösung Festpreis Niedersachsen`
- `Winterdienst Osnabrück Vermieter`

Total per cycle: 6 fix + 2 rotating = 8 queries × 6 engines = **48 tests per cycle**.

---

## Per-test recording

For each (engine, query) combination, record in `docs/seo-baseline/cycle-N/`:

1. **Screenshot** of full AI response: `[engine]_[query].png`
2. **Citation status:**
   - `cited` (rundumshaus-littawe.de explicitly named or linked)
   - `mentioned` (brand "Rund ums Haus Littawe" mentioned but no link)
   - `not-found` (no mention)
3. **Position** in AI response (1st citation, 2nd, etc.)
4. **Competitor citations** (top 3 domains mentioned ahead of us, if any)

### Example log row (in SEO_RESULTS.md AI test schedule)

```
2026-05-30 | ChatGPT: cited #2 (after stockreiter.de) | Perplexity: not-found | Claude: cited #1 | Gemini: not-found | You: cited #3 | Bing: not-found
```

---

## Cycle workflow (~30 min)

1. Open all 6 engines in separate browser tabs
2. Run query 1 in all 6 → screenshot each
3. Repeat for queries 2–8
4. Save 48 screenshots to `docs/seo-baseline/cycle-N/`
5. Update `docs/SEO_RESULTS.md` AI test schedule with summary row
6. Note any surprises in "Notes & decisions log" of SEO_RESULTS.md

---

## Interpretation guide

### Baseline (Cycle 0, 2026-05-02 ahead of any optimization)
- **Expected:** 0 citations across all 48 tests
- **Treat any baseline citation as either coincidence or pre-existing 11880.com effect**

### Cycle 4 (2026-05-30, 4 weeks)
- **Realistic:** 1–3 citations across 48 (mostly Perplexity, possibly You.com)
- LLM training cycles are 6–16 weeks, so early citations are mostly retrieval-based

### Cycle 8 (2026-06-27, 8 weeks)
- **Realistic:** 5–10 citations across 48
- ChatGPT Search and Bing Copilot start picking up llms.txt content
- Claude Search may cite based on Search-Bot indexing

### Cycle 12 (2026-07-25, 12 weeks)
- **Target:** 10–20 citations across 48
- Expected stronger citations on Tier 1 city queries (close cities)
- Branded query "Rund ums Haus Littawe" should be cited by all 6 engines

### Anomalies to investigate
- **0 citations in Perplexity at week 4:** check llms.txt accessibility (curl test)
- **High citation rate but in wrong context:** check llms.txt facts accuracy
- **Citation with hallucinated facts:** report via AI engine feedback button (often fixes within 1–2 cycles)

---

## Action triggers

| Observation | Action |
|-------------|--------|
| 0 citations after week 6 | Re-check robots.txt (must allow all listed AI bots), verify llms.txt is indexed by Common Crawl, consider PR/backlink push |
| Negative information cited | File correction request via AI engine feedback. Update llms.txt to be more authoritative. |
| Wrong location/contact cited | Verify NAP consistency in all citations and external catalogues |
| Competitor cited above us | Note in log; add structured data improvements; consider topic-specific ratgeber content |
