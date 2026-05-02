// @vitest-environment node
import { describe, it, expect } from "vitest";
import {
  CITIES,
  SERVICE_IDS,
  type ServiceId,
  getCityBySlug,
  getNeighborCities,
  getServiceMeta,
  generatePageContent,
  getAllPagePairs,
} from "@/lib/programmatic";

// ────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────

/** Collect all intros for a given city across all 5 services. */
function introsForCity(citySlug: string): string[] {
  return SERVICE_IDS.map((s) => generatePageContent(s, citySlug).intro);
}

/**
 * Collect all distance-phrase-bearing copy for a given city: intros + FAQ
 * answers + bodies, across all 5 services. This maximizes the surface where
 * distancePhrase(c) can land regardless of hash-driven variant selection.
 */
function distanceCorpusForCity(citySlug: string): string {
  const parts: string[] = [];
  for (const s of SERVICE_IDS) {
    const pc = generatePageContent(s, citySlug);
    parts.push(pc.intro);
    parts.push(pc.body.join(" "));
    parts.push(pc.faqs.map((f) => `${f.q} ${f.a}`).join(" "));
  }
  return parts.join(" ");
}

/** Collect concatenated body text for a given service across given cities. */
function combinedBodies(service: ServiceId, citySlugs: string[]): string {
  return citySlugs
    .map((slug) => generatePageContent(service, slug).body.join(" "))
    .join(" ");
}

// ────────────────────────────────────────────────────────────────────
// API contract — counts & uniqueness
// ────────────────────────────────────────────────────────────────────

describe("API contract — getAllPagePairs", () => {
  it("returns exactly 490 pairs (5 services × 98 cities)", () => {
    expect(getAllPagePairs().length).toBe(490);
  });

  it("contains no duplicate (service:city) pairs", () => {
    const pairs = getAllPagePairs();
    const set = new Set(pairs.map((p) => `${p.service}:${p.city}`));
    expect(set.size).toBe(490);
  });

  it("yields exactly 98 pairs per ServiceId", () => {
    for (const sid of SERVICE_IDS) {
      const count = getAllPagePairs().filter((p) => p.service === sid).length;
      expect(count, `service=${sid}`).toBe(98);
    }
  });

  it("SERVICE_IDS contains exactly 5 services", () => {
    expect(SERVICE_IDS.length).toBe(5);
    expect(new Set(SERVICE_IDS).size).toBe(5);
  });
});

// ────────────────────────────────────────────────────────────────────
// Negative cases
// ────────────────────────────────────────────────────────────────────

describe("Negative cases — getCityBySlug", () => {
  it("returns undefined for unknown slug 'mars' (does NOT throw)", () => {
    expect(() => getCityBySlug("mars")).not.toThrow();
    expect(getCityBySlug("mars")).toBeUndefined();
  });

  it("returns undefined for empty string (does NOT throw)", () => {
    expect(() => getCityBySlug("")).not.toThrow();
    expect(getCityBySlug("")).toBeUndefined();
  });
});

describe("Negative cases — generatePageContent / getServiceMeta", () => {
  it("generatePageContent throws 'Unknown city' for unknown slug", () => {
    expect(() => generatePageContent("gartenpflege", "mars")).toThrowError(
      /Unknown city/
    );
  });

  it("getServiceMeta throws 'Unknown service' for invalid id", () => {
    expect(() =>
      getServiceMeta("invalid" as unknown as ServiceId)
    ).toThrowError(/Unknown service/);
  });
});

// ────────────────────────────────────────────────────────────────────
// distancePhrase — 3 branches coverage (Landa #5)
//   Branch A: distanceKm === 0 → "direkt in Osnabrück"
//   Branch B: 0 < distanceKm <= 15 → "nur rund N km"
//   Branch C: distanceKm > 15 → "etwa N km"
// We probe by collecting intros across all 5 services for each city.
// Hash distributes 5 picks across 8 variants → not all variants seen,
// but distance phrase appears in ~6/8 intro variants per service, so
// at least one of 5 service intros is overwhelmingly likely to contain it.
// ────────────────────────────────────────────────────────────────────

describe("distancePhrase — 3 branches via intros", () => {
  it("Branch A (distanceKm=0): osnabrueck corpus (intros+bodies+faqs across 5 services) contains 'direkt in Osnabrück'", () => {
    const corpus = distanceCorpusForCity("osnabrueck");
    expect(corpus).toContain("direkt in Osnabrück");
  });

  it("Branch B (distanceKm=9, belm): corpus contains 'nur rund 9 km'", () => {
    const corpus = distanceCorpusForCity("belm");
    expect(corpus).toContain("nur rund 9 km");
  });

  it("Branch C (distanceKm=17, bramsche): corpus contains 'etwa 17 km'", () => {
    const corpus = distanceCorpusForCity("bramsche");
    expect(corpus).toContain("etwa 17 km");
  });
});

// ────────────────────────────────────────────────────────────────────
// 4 Neuenkirchen disambiguation
// ────────────────────────────────────────────────────────────────────

describe("Neuenkirchen disambiguation (4 distinct cities)", () => {
  const slugs = [
    "neuenkirchen",
    "neuenkirchen-bei-rheine",
    "neuenkirchen-kreis-steinfurt",
    "neuenkirchen-voerden",
  ];

  it("all 4 slugs resolve to a City", () => {
    for (const s of slugs) {
      const c = getCityBySlug(s);
      expect(c, `slug=${s}`).toBeDefined();
    }
  });

  it("each displayName contains 'Neuenkirchen' and all 4 displayNames are unique", () => {
    const displays = slugs.map((s) => getCityBySlug(s)!.displayName);
    for (const d of displays) {
      expect(d).toMatch(/Neuenkirchen/);
    }
    expect(new Set(displays).size).toBe(4);
  });

  it("h1 differs across the 4 Neuenkirchen variants for the same service", () => {
    const h1s = slugs.map((s) => generatePageContent("hausmeisterservice", s).h1);
    expect(new Set(h1s).size).toBe(4);
  });

  it("'Neuenkirchen (Kreis Steinfurt)' preserves parentheses in displayName", () => {
    const c = getCityBySlug("neuenkirchen-kreis-steinfurt");
    expect(c).toBeDefined();
    expect(c!.displayName).toBe("Neuenkirchen (Kreis Steinfurt)");
  });
});

// ────────────────────────────────────────────────────────────────────
// populationClass="city" cases — Münster, Bielefeld, Osnabrück
// ────────────────────────────────────────────────────────────────────

describe("populationClass='city' (Großstadt) cases", () => {
  const cityCities = ["muenster", "bielefeld", "osnabrueck"];

  it("all 3 have populationClass === 'city'", () => {
    for (const slug of cityCities) {
      const c = getCityBySlug(slug);
      expect(c, `slug=${slug}`).toBeDefined();
      expect(c!.populationClass, `slug=${slug}`).toBe("city");
    }
  });

  it("generatePageContent('gartenpflege','muenster') returns valid PageContent without throwing", () => {
    const pc = generatePageContent("gartenpflege", "muenster");
    expect(pc.h1).toMatch(/Münster/);
    expect(pc.metaTitle.length).toBeGreaterThan(20);
    expect(pc.metaDescription.length).toBeGreaterThan(50);
    expect(pc.body.length).toBeGreaterThanOrEqual(3);
    expect(pc.faqs.length).toBeGreaterThanOrEqual(5);
    expect(pc.intro.length).toBeGreaterThan(100);
    expect(pc.fakten.length).toBe(7);
    expect(pc.service.id).toBe("gartenpflege");
  });
});

// ────────────────────────────────────────────────────────────────────
// Pool-level body content assertions (Landa #4 fix — hash-aware)
// ────────────────────────────────────────────────────────────────────

describe("Pool-level body content (hash-aware)", () => {
  it("gartenpflege/osnabrueck body mentions 'Heckenschnitt' (universal across variants)", () => {
    const pc = generatePageContent("gartenpflege", "osnabrueck");
    const allBody = pc.body.join(" ") + " " + pc.intro;
    // 'Heckenschnitt' / 'Hecken' are core service terms expected in any gartenpflege selection.
    expect(allBody).toMatch(/Hecken/i);
  });

  it("gartenpflege bodies across multiple cities mention at least one Hecken variety (Liguster|Hainbuche|Buche|Thuja)", () => {
    const combined = combinedBodies("gartenpflege", [
      "osnabrueck",
      "muenster",
      "belm",
      "bramsche",
      "lengerich",
    ]);
    expect(combined).toMatch(/Liguster|Hainbuche|Buche|Thuja/);
  });

  it("dacharbeiten bodies across multiple cities mention 'Asbest' at least once", () => {
    const combined = combinedBodies("dacharbeiten", [
      "bramsche",
      "lengerich",
      "muenster",
      "osnabrueck",
      "belm",
      "bielefeld",
    ]);
    expect(combined).toMatch(/Asbest/);
  });
});

// ────────────────────────────────────────────────────────────────────
// Helper integrity — getNeighborCities
// ────────────────────────────────────────────────────────────────────

describe("getNeighborCities integrity", () => {
  it("returns array of valid City objects (no nulls/undefined) for every city", () => {
    for (const c of CITIES) {
      const neighbors = getNeighborCities(c);
      expect(Array.isArray(neighbors), `city=${c.slug}`).toBe(true);
      for (const n of neighbors) {
        expect(n, `city=${c.slug} neighbor`).toBeDefined();
        expect(typeof n.name, `city=${c.slug} neighbor.name`).toBe("string");
        expect(n.name.length, `city=${c.slug} neighbor.name nonempty`).toBeGreaterThan(0);
        expect(typeof n.slug).toBe("string");
        expect(n.slug.length).toBeGreaterThan(0);
      }
    }
  });

  it("osnabrueck has between 1 and 6 neighbors (soft cap)", () => {
    const os = getCityBySlug("osnabrueck");
    expect(os).toBeDefined();
    const neighbors = getNeighborCities(os!);
    expect(neighbors.length).toBeGreaterThanOrEqual(1);
    expect(neighbors.length).toBeLessThanOrEqual(6);
  });
});
