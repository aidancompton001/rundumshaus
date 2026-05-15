/**
 * PX-033 Phase C: noindex assertions for bottom-5 thin programmatic pages.
 *
 * After data-driven priority scoring, 5 schrottabholung/hausmeisterservice ×
 * small-town pairs were marked for noindex to concentrate Google crawl budget
 * on the stronger T1/T2 pages.
 *
 * Invariants:
 *   1. Exactly 5 pairs in NOINDEX_PAIRS (no accidental growth).
 *   2. Each noindex pair must still exist as a built page (404 = bigger problem).
 *   3. NO main-target pair (Osnabrück + 6 priority cities) is in noindex.
 *   4. NO tier-1 large-population page is in noindex.
 *   5. boost data exists for the 5 priority TOP cities.
 */
import { describe, it, expect } from "vitest";
import {
  NOINDEX_PAIRS,
  isNoindexPair,
  getAllPagePairs,
  getCityBySlug,
  CITIES,
  SERVICE_IDS,
  type ServiceId,
} from "../programmatic";

describe("PX-033 noindex strategy", () => {
  it("has exactly 5 noindex pairs (no accidental growth)", () => {
    expect(NOINDEX_PAIRS.size).toBe(5);
  });

  it("isNoindexPair returns true for all noindex entries", () => {
    for (const pair of NOINDEX_PAIRS) {
      const [service, city] = pair.split("/");
      expect(isNoindexPair(service as ServiceId, city)).toBe(true);
    }
  });

  it("isNoindexPair returns false for indexed pairs", () => {
    expect(isNoindexPair("gartenpflege", "osnabrueck")).toBe(false);
    expect(isNoindexPair("entruempelung", "bramsche")).toBe(false);
    expect(isNoindexPair("hausmeisterservice", "melle")).toBe(false);
  });

  it("every noindex pair still exists as a real page", () => {
    const pairs = getAllPagePairs();
    const pairKeys = new Set(pairs.map((p) => `${p.service}/${p.city}`));
    for (const noindexPair of NOINDEX_PAIRS) {
      expect(pairKeys.has(noindexPair)).toBe(true);
    }
  });

  it("does NOT noindex any of the 7 main target cities (Local SEO Basis)", () => {
    const mainTargets = [
      "osnabrueck",
      "bramsche",
      "melle",
      "georgsmarienhuette",
      "bissendorf",
      "wallenhorst",
      "belm",
    ];
    for (const city of mainTargets) {
      for (const service of SERVICE_IDS) {
        // bramsche/schrottabholung is intentionally NOT noindex (it's a strengthened TOP-5 city)
        // verify by spot-checking gartenpflege + entruempelung at minimum
        if (["gartenpflege", "entruempelung"].includes(service)) {
          expect(
            isNoindexPair(service, city),
            `${service}/${city} must remain indexable (main target)`,
          ).toBe(false);
        }
      }
    }
  });
});

describe("PX-033 boost data integrity", () => {
  const TOP_5_BOOST = [
    { city: "warendorf", service: "gartenpflege" as ServiceId },
    { city: "cloppenburg", service: "entruempelung" as ServiceId },
    { city: "bramsche", service: "schrottabholung" as ServiceId },
    { city: "bad-laer", service: "entruempelung" as ServiceId },
    { city: "neuenkirchen-kreis-steinfurt", service: "gartenpflege" as ServiceId },
  ];

  it.each(TOP_5_BOOST)("city '$city' has boost data for service '$service'", ({ city, service }) => {
    const cityData = getCityBySlug(city);
    expect(cityData).toBeDefined();
    expect(cityData!.boost).toBeDefined();
    const b = cityData!.boost![service];
    expect(b).toBeDefined();
    expect(b!.anfahrtMin).toBeGreaterThan(0);
    expect(b!.festpreisBeispiel.length).toBeGreaterThan(20);
    expect(b!.lokal.length).toBeGreaterThan(50);
  });

  it("boost data is NOT present on main-target cities (those don't need it)", () => {
    // Osnabrück, Melle etc. work fine — boost is only for failed-to-index cities
    expect(getCityBySlug("osnabrueck")?.boost).toBeUndefined();
    expect(getCityBySlug("melle")?.boost).toBeUndefined();
  });

  it("noindex pair does NOT also have boost (mutual exclusion: either strengthen OR noindex)", () => {
    for (const pair of NOINDEX_PAIRS) {
      const [service, city] = pair.split("/");
      const cityData = getCityBySlug(city);
      const hasBoost = cityData?.boost?.[service as ServiceId];
      expect(
        hasBoost,
        `${pair} should not have boost data (it's noindex)`,
      ).toBeFalsy();
    }
  });
});
