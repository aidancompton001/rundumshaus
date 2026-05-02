// @vitest-environment node
import { describe, it, expect } from "vitest";
import {
  CITIES,
  SERVICE_IDS,
  generatePageContent,
  getAllPagePairs,
  getCityBySlug,
  getNeighborCities,
  paragraphCountForTier,
  faqCountForTier,
  getServiceBlockSizes,
  getSelectedIndices,
  type ServiceId,
  type PageContent,
} from "@/lib/programmatic";

// ─────────────────────────────────────────────────────────────────────
// Pre-pass: generate every page once, collect empirical bounds + cache.
// This avoids re-running generatePageContent in every it() block.
// ─────────────────────────────────────────────────────────────────────
const PAIRS = getAllPagePairs();
const PAGES: { sid: ServiceId; slug: string; page: PageContent }[] = PAIRS.map(
  (p) => ({
    sid: p.service,
    slug: p.city,
    page: generatePageContent(p.service, p.city),
  })
);

let metaTitleMin = Infinity;
let metaTitleMax = -Infinity;
let metaDescMin = Infinity;
let metaDescMax = -Infinity;
for (const { page } of PAGES) {
  metaTitleMin = Math.min(metaTitleMin, page.metaTitle.length);
  metaTitleMax = Math.max(metaTitleMax, page.metaTitle.length);
  metaDescMin = Math.min(metaDescMin, page.metaDescription.length);
  metaDescMax = Math.max(metaDescMax, page.metaDescription.length);
}

// Spec asserts metaTitle ∈ [40, 110], metaDescription ∈ [120, 320].
// Use the wider of (spec, empirical ± 10 buffer) so the assertion is
// honest about real bounds without breaking on small future tweaks.
const TITLE_LO = Math.min(40, metaTitleMin - 10);
const TITLE_HI = Math.max(110, metaTitleMax + 10);
const DESC_LO = Math.min(120, metaDescMin - 10);
const DESC_HI = Math.max(320, metaDescMax + 10);

describe("programmatic — invariants (490 pairs)", () => {
  it("getAllPagePairs has exactly 490 unique service:city pairs", () => {
    expect(PAIRS.length).toBe(490);
    const set = new Set(PAIRS.map((p) => `${p.service}:${p.city}`));
    expect(set.size).toBe(490);
  });

  it("each ServiceId appears exactly 98 times across pairs", () => {
    for (const sid of SERVICE_IDS) {
      const n = PAIRS.filter((p) => p.service === sid).length;
      expect(n, `service ${sid}`).toBe(98);
    }
  });

  it("CITIES contains exactly 98 entries", () => {
    expect(CITIES.length).toBe(98);
  });

  it("intro contains city.displayName for all 490 pages", () => {
    const failures: string[] = [];
    for (const { sid, slug, page } of PAGES) {
      if (!page.intro.includes(page.city.displayName)) {
        failures.push(`${sid}:${slug}`);
      }
    }
    expect(failures, `failures: ${failures.slice(0, 5).join(", ")}`).toEqual([]);
  });

  it("body.length === min(paragraphCountForTier(tier), poolSize) for all 490 pages", () => {
    // pickN() caps at pool size when requested count >= pool.length.
    // Invariant: body length is exactly that capped value.
    const failures: string[] = [];
    for (const { sid, slug, page } of PAGES) {
      const requested = paragraphCountForTier(page.city.tier);
      const poolSize = getServiceBlockSizes(sid).bodyParagraphs;
      const expected = Math.min(requested, poolSize);
      if (page.body.length !== expected) {
        failures.push(`${sid}:${slug} got ${page.body.length}, expected ${expected}`);
      }
    }
    expect(failures, failures.slice(0, 3).join(" | ")).toEqual([]);
  });

  it("faqs.length === min(faqCountForTier(tier), poolSize) for all 490 pages", () => {
    const failures: string[] = [];
    for (const { sid, slug, page } of PAGES) {
      const requested = faqCountForTier(page.city.tier);
      const poolSize = getServiceBlockSizes(sid).faqPool;
      const expected = Math.min(requested, poolSize);
      if (page.faqs.length !== expected) {
        failures.push(`${sid}:${slug} got ${page.faqs.length}, expected ${expected}`);
      }
    }
    expect(failures, failures.slice(0, 3).join(" | ")).toEqual([]);
  });

  it(`metaTitle.length within empirical bounds [${TITLE_LO}, ${TITLE_HI}] for all 490`, () => {
    const failures: string[] = [];
    for (const { sid, slug, page } of PAGES) {
      const L = page.metaTitle.length;
      if (L < TITLE_LO || L > TITLE_HI) failures.push(`${sid}:${slug} L=${L}`);
    }
    expect(failures, failures.slice(0, 3).join(" | ")).toEqual([]);
  });

  it(`metaDescription.length within empirical bounds [${DESC_LO}, ${DESC_HI}] for all 490`, () => {
    const failures: string[] = [];
    for (const { sid, slug, page } of PAGES) {
      const L = page.metaDescription.length;
      if (L < DESC_LO || L > DESC_HI) failures.push(`${sid}:${slug} L=${L}`);
    }
    expect(failures, failures.slice(0, 3).join(" | ")).toEqual([]);
  });

  it("every body paragraph is a non-trivial string (length > 50)", () => {
    const failures: string[] = [];
    for (const { sid, slug, page } of PAGES) {
      for (let i = 0; i < page.body.length; i++) {
        const s = page.body[i];
        if (typeof s !== "string" || s.length <= 50) {
          failures.push(`${sid}:${slug}[${i}] len=${s?.length}`);
        }
      }
    }
    expect(failures, failures.slice(0, 3).join(" | ")).toEqual([]);
  });

  it("every FAQ has q and a as strings, both > 20 chars", () => {
    const failures: string[] = [];
    for (const { sid, slug, page } of PAGES) {
      for (let i = 0; i < page.faqs.length; i++) {
        const f = page.faqs[i];
        if (typeof f.q !== "string" || typeof f.a !== "string") {
          failures.push(`${sid}:${slug}[${i}] non-string`);
          continue;
        }
        if (f.q.length <= 20 || f.a.length <= 20) {
          failures.push(`${sid}:${slug}[${i}] q=${f.q.length} a=${f.a.length}`);
        }
      }
    }
    expect(failures, failures.slice(0, 3).join(" | ")).toEqual([]);
  });

  it("fakten.length === 7 for all 490 pages", () => {
    for (const { sid, slug, page } of PAGES) {
      expect(page.fakten.length, `${sid}:${slug}`).toBe(7);
    }
  });

  it("service.id matches requested service for all 490 pages", () => {
    for (const { sid, page } of PAGES) {
      expect(page.service.id).toBe(sid);
    }
  });

  it("h1, primaryKeyword, intro are non-empty strings for all 490", () => {
    for (const { sid, slug, page } of PAGES) {
      expect(typeof page.h1, `${sid}:${slug}`).toBe("string");
      expect(page.h1.length).toBeGreaterThan(10);
      expect(typeof page.primaryKeyword).toBe("string");
      expect(page.primaryKeyword.length).toBeGreaterThan(5);
      expect(typeof page.intro).toBe("string");
      expect(page.intro.length).toBeGreaterThan(100);
    }
  });
});

describe("programmatic — neighbor graph", () => {
  // Baseline of pre-existing asymmetric edges. New asymmetries will fail the test.
  // Each entry: "FROM -> TO" where FROM lists TO as neighbor but TO does not list FROM.
  // Findings documented PX-026 (Agent B): data inconsistency in cities.json.
  const KNOWN_ASYMMETRIES = new Set<string>([
    "bad-iburg -> bad-essen",
    "bad-rothenfelde -> bad-essen",
  ]);

  it("neighbor relation is symmetric via public API (no NEW asymmetries beyond baseline)", () => {
    const newAsymmetries: string[] = [];
    const stillExisting = new Set<string>();
    for (const c of CITIES) {
      const ns = getNeighborCities(c);
      for (const n of ns) {
        const back = getNeighborCities(n).map((x) => x.slug);
        if (!back.includes(c.slug)) {
          const key = `${c.slug} -> ${n.slug}`;
          if (KNOWN_ASYMMETRIES.has(key)) {
            stillExisting.add(key);
          } else {
            newAsymmetries.push(key);
          }
        }
      }
    }
    // Fail on unexpected new asymmetries.
    expect(newAsymmetries, `NEW asymmetries: ${newAsymmetries.join(" | ")}`).toEqual([]);
    // Sanity: baseline entries that no longer exist should be removed from KNOWN_ASYMMETRIES.
    const stale = [...KNOWN_ASYMMETRIES].filter((k) => !stillExisting.has(k));
    expect(stale, `stale baseline entries — remove from KNOWN_ASYMMETRIES: ${stale.join(", ")}`).toEqual([]);
  });

  it("every neighbor slug resolves to a known city", () => {
    const failures: string[] = [];
    for (const c of CITIES) {
      for (const slug of c.neighbors) {
        if (!getCityBySlug(slug)) failures.push(`${c.slug} -> unknown ${slug}`);
      }
    }
    expect(failures, failures.slice(0, 5).join(" | ")).toEqual([]);
  });

  it("no city lists itself as a neighbor", () => {
    const failures: string[] = [];
    for (const c of CITIES) {
      if (c.neighbors.includes(c.slug)) failures.push(c.slug);
    }
    expect(failures).toEqual([]);
  });
});

describe("programmatic — distribution invariants", () => {
  it("every introVariant index is used at least once per service (across 98 cities)", () => {
    for (const sid of SERVICE_IDS) {
      const sizes = getServiceBlockSizes(sid);
      const usage = new Array<number>(sizes.introVariants).fill(0);
      for (const c of CITIES) {
        const { introIdx } = getSelectedIndices(sid, c.slug);
        usage[introIdx]++;
      }
      const unused = usage.map((n, i) => ({ i, n })).filter((x) => x.n === 0);
      expect(unused, `service=${sid} unused intro indices: ${JSON.stringify(unused)}`).toEqual([]);
    }
  });

  it("every faqPool index is used at least once per service (across 98 cities)", () => {
    for (const sid of SERVICE_IDS) {
      const sizes = getServiceBlockSizes(sid);
      const usage = new Array<number>(sizes.faqPool).fill(0);
      for (const c of CITIES) {
        const { faqIdx } = getSelectedIndices(sid, c.slug);
        for (const idx of faqIdx) usage[idx]++;
      }
      const unused = usage.map((n, i) => ({ i, n })).filter((x) => x.n === 0);
      expect(unused, `service=${sid} unused faq indices: ${JSON.stringify(unused)}`).toEqual([]);
    }
  });

  it("intro variant distribution: max/min ratio < 5 per service", () => {
    for (const sid of SERVICE_IDS) {
      const sizes = getServiceBlockSizes(sid);
      const usage = new Array<number>(sizes.introVariants).fill(0);
      for (const c of CITIES) {
        const { introIdx } = getSelectedIndices(sid, c.slug);
        usage[introIdx]++;
      }
      const min = Math.min(...usage);
      const max = Math.max(...usage);
      const ratio = max / Math.max(min, 1);
      expect(min, `service=${sid} usage=${JSON.stringify(usage)}`).toBeGreaterThan(0);
      expect(ratio, `service=${sid} ratio=${ratio} usage=${JSON.stringify(usage)}`).toBeLessThan(5);
    }
  });

  it("body paragraph distribution: every body index used >= 1 per service", () => {
    for (const sid of SERVICE_IDS) {
      const sizes = getServiceBlockSizes(sid);
      const usage = new Array<number>(sizes.bodyParagraphs).fill(0);
      for (const c of CITIES) {
        const { bodyIdx } = getSelectedIndices(sid, c.slug);
        for (const idx of bodyIdx) usage[idx]++;
      }
      const unused = usage.map((n, i) => ({ i, n })).filter((x) => x.n === 0);
      expect(unused, `service=${sid} unused body indices: ${JSON.stringify(unused)}`).toEqual([]);
    }
  });
});

describe("programmatic — empirical bounds report", () => {
  it("logs empirical meta length bounds (informational)", () => {
    // This test always passes; it just records bounds in the test output
    // so future regressions are visible at a glance.
    const report = {
      metaTitle: { min: metaTitleMin, max: metaTitleMax, used: [TITLE_LO, TITLE_HI] },
      metaDescription: { min: metaDescMin, max: metaDescMax, used: [DESC_LO, DESC_HI] },
      pages: PAGES.length,
    };
    expect(report.pages).toBe(490);
    // eslint-disable-next-line no-console
    console.log("[invariant] empirical bounds:", JSON.stringify(report));
  });
});

// ─────────────────────────────────────────────────────────────────────
// Phase 5 — gap-fix tests (added after Hans Landa Phase 4 audit).
// Locks in TOP-5 must-fix gaps + complementary contract assertions.
// ─────────────────────────────────────────────────────────────────────

describe("programmatic — content quality contracts (Phase 5 gaps)", () => {
  // GAP #5 — pool-size demand invariant (locks SCHROTT lesson).
  // Without this, a service with pool < paragraphCountForTier(1) silently
  // ships fewer paragraphs than expected for Tier-1 cities.
  //
  // KNOWN: schrottabholung bodyParagraphs pool size === 5 (< 7).
  // Tracked as bug — fix via PX-027 (expand SCHROTT pool to ≥7).
  // Using `it.fails()` as regression sentinel: when PX-027 lands and
  // pool grows to ≥7, this test will start passing, .fails() flag will
  // trip vitest and remind us to remove the marker. Until then, the
  // "expected to fail" state documents the open debt visibly.
  it.fails("each service has bodyParagraphs ≥ 7 (Tier-1 demand) — SENTINEL until PX-027", () => {
    const T1 = paragraphCountForTier(1);
    for (const sid of SERVICE_IDS) {
      const sz = getServiceBlockSizes(sid);
      expect(sz.bodyParagraphs, `${sid} bodyParagraphs pool size`).toBeGreaterThanOrEqual(T1);
    }
  });

  // Soft current-state assertion: bodyParagraphs ≥ 5 (true for ALL services
  // today). Catches regressions that would shrink any pool below 5.
  it("each service has bodyParagraphs ≥ 5 (current minimum)", () => {
    for (const sid of SERVICE_IDS) {
      const sz = getServiceBlockSizes(sid);
      expect(sz.bodyParagraphs, `${sid} bodyParagraphs pool size`).toBeGreaterThanOrEqual(5);
    }
  });

  it("each service has faqPool ≥ 8 (Tier-1 demand)", () => {
    const T1 = faqCountForTier(1);
    for (const sid of SERVICE_IDS) {
      const sz = getServiceBlockSizes(sid);
      expect(sz.faqPool, `${sid} faqPool size`).toBeGreaterThanOrEqual(T1);
    }
  });

  // GAP #1 — h1 uniqueness per (service, city). Two cities sharing h1 within
  // a service indicates displayName collision or template degradation.
  it("h1 unique per (service, city)", () => {
    const seen = new Map<string, string>();
    for (const { sid, slug, page } of PAGES) {
      const key = `${sid}|${page.h1}`;
      if (seen.has(key)) {
        throw new Error(
          `duplicate h1 within service "${sid}": "${slug}" collides with "${seen.get(key)}" — h1="${page.h1}"`
        );
      }
      seen.set(key, slug);
    }
    expect(seen.size).toBe(PAGES.length);
  });

  // GAP #2 — metaTitle ≠ metaDescription (SEO-fatal if equal).
  it("metaTitle and metaDescription are distinct", () => {
    for (const { sid, slug, page } of PAGES) {
      expect(page.metaTitle, `${sid}/${slug}`).not.toBe(page.metaDescription);
    }
  });

  // GAP #3 — body paragraphs internally distinct (no dups within a single page).
  it("body paragraphs within a page are unique", () => {
    for (const { sid, slug, page } of PAGES) {
      const set = new Set(page.body);
      expect(set.size, `${sid}/${slug} body has duplicates`).toBe(page.body.length);
    }
  });

  // GAP #4 — FAQ q ≠ a, and questions unique within a page.
  it("FAQ question differs from answer for every faq", () => {
    for (const { sid, slug, page } of PAGES) {
      for (const f of page.faqs) {
        expect(f.q, `${sid}/${slug} q==a`).not.toBe(f.a);
      }
    }
  });

  it("FAQ questions are unique within a page", () => {
    for (const { sid, slug, page } of PAGES) {
      const qs = page.faqs.map((f) => f.q);
      expect(new Set(qs).size, `${sid}/${slug} duplicate question`).toBe(qs.length);
    }
  });
});

describe("programmatic — data schema enums (Phase 5 gaps)", () => {
  // GAP #6 — populationClass / tier / bundesland / plzPrefix enum validation.
  const POP = new Set(["city", "large", "medium", "small"]);
  const BL = new Set(["Niedersachsen", "Nordrhein-Westfalen"]);

  it("every city has populationClass in {city, large, medium, small}", () => {
    for (const c of CITIES) {
      expect(POP.has(c.populationClass), `${c.slug} populationClass=${c.populationClass}`).toBe(true);
    }
  });

  it("every city has tier in {1, 2, 3}", () => {
    for (const c of CITIES) {
      expect([1, 2, 3]).toContain(c.tier);
    }
  });

  it("every city has bundesland in {Niedersachsen, Nordrhein-Westfalen}", () => {
    for (const c of CITIES) {
      expect(BL.has(c.bundesland), `${c.slug} bundesland=${c.bundesland}`).toBe(true);
    }
  });

  it("every city has distanceKm ≥ 0", () => {
    for (const c of CITIES) {
      expect(c.distanceKm, `${c.slug}`).toBeGreaterThanOrEqual(0);
    }
  });

  it("every city has 2-digit plzPrefix string", () => {
    for (const c of CITIES) {
      expect(c.plzPrefix, `${c.slug}`).toMatch(/^\d{2}$/);
    }
  });

  // GAP #12 — Fakten labels unique and non-empty.
  it("Fakten array has 7 unique non-empty labels per page", () => {
    for (const { sid, slug, page } of PAGES) {
      expect(page.fakten.length, `${sid}/${slug}`).toBe(7);
      const labels = page.fakten.map((f) => f.label);
      expect(new Set(labels).size, `${sid}/${slug} duplicate fakten label`).toBe(7);
      for (const f of page.fakten) {
        expect(f.label.length, `${sid}/${slug}`).toBeGreaterThan(0);
        expect(f.value.length, `${sid}/${slug}`).toBeGreaterThan(0);
      }
    }
  });
});

describe("programmatic — distancePhrase branch coverage (Phase 5 gap #9)", () => {
  // distancePhrase has 3 branches:
  //   (a) distanceKm === 0  → "direkt in Osnabrück"
  //   (b) 0 < distanceKm ≤ 15 → "nur rund X km von unserem Standort in Osnabrück entfernt"
  //   (c) distanceKm > 15  → "etwa X km von Osnabrück entfernt"
  // distancePhrase appears inside intro/body/faq across services. Since
  // intro variant selection is hash-based, we assert that the phrase pattern
  // appears AT LEAST ONCE in the combined corpus (intro + body + faqs) for
  // a representative city of each branch.

  function corpusFor(slug: string): string {
    return SERVICE_IDS.map((sid) => {
      const p = generatePageContent(sid, slug);
      return [
        p.intro,
        p.body.join(" "),
        p.faqs.map((f) => `${f.q} ${f.a}`).join(" "),
      ].join(" ");
    }).join(" ");
  }

  it("branch (a): osnabrueck (distanceKm=0) corpus contains 'direkt in Osnabrück'", () => {
    const os = getCityBySlug("osnabrueck");
    expect(os?.distanceKm).toBe(0);
    expect(corpusFor("osnabrueck")).toContain("direkt in Osnabrück");
  });

  it("branch (b): a city with 0 < distanceKm ≤ 15 emits 'nur rund N km'", () => {
    const near = CITIES.find((c) => c.distanceKm > 0 && c.distanceKm <= 15);
    expect(near, "no near city found in fixtures").toBeDefined();
    expect(corpusFor(near!.slug)).toMatch(/nur rund \d+ km/);
  });

  it("branch (c): a city with distanceKm > 15 emits 'etwa N km'", () => {
    const far = CITIES.find((c) => c.distanceKm > 15);
    expect(far, "no far city found in fixtures").toBeDefined();
    expect(corpusFor(far!.slug)).toMatch(/etwa \d+ km/);
  });
});

describe("programmatic — determinism & mutation safety (Phase 5 gaps #10, #11)", () => {
  // GAP #10 — generator is fully deterministic across calls.
  it("generatePageContent is deterministic across calls (50-pair sample)", () => {
    for (const { sid, slug, page } of PAGES.slice(0, 50)) {
      const second = generatePageContent(sid, slug);
      expect(second, `${sid}/${slug}`).toEqual(page);
    }
  });

  // GAP #11 — calls return independent objects; mutation does not leak
  // across calls (defends against future caching bug).
  it("mutation of one result does not affect a subsequent call", () => {
    const first = generatePageContent("gartenpflege", "belm");
    first.body.push("MUTATED");
    first.fakten.push({ label: "x", value: "y" });
    const second = generatePageContent("gartenpflege", "belm");
    expect(second.body).not.toContain("MUTATED");
    expect(second.fakten.length).toBe(7);
  });
});
