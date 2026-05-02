// @vitest-environment node
//
// Schema validation test for layout.tsx JSON-LD @graph.
// PX-026 Hans Landa Phase 6 finding (Defect #10): no schema-validation
// tests existed. PX-030 Hans Landa Round 4 (Defect #10): mandatory before
// production deploy of Phase 5 schema changes.
//
// Validates structural integrity of the LD-JSON @graph emitted by layout.tsx:
// - Parses without errors
// - Required nodes present (LocalBusiness, WebSite, Organization)
// - Required fields per node
// - @id refs are consistent
// - Service entries have proper provider @id reference
// - Founder block has Person + jobTitle (PX-030)
// - entruempelung Service has priceSpecification (PX-030)
//
// Approach: read layout.tsx source, extract the JSON.stringify({...}) payload,
// reconstruct the graph deterministically. Avoids running Next.js renderer.

import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

const LAYOUT_PATH = path.resolve(__dirname, "..", "layout.tsx");
const BASE_URL = "https://rundumshaus-littawe.de";
const LB_ID = `${BASE_URL}/#localbusiness`;
const WS_ID = `${BASE_URL}/#website`;
const ORG_ID = `${BASE_URL}/#organization`;

// Read once, parse the @graph payload from the source.
// We capture the literal `{ "@context": "https://schema.org", "@graph": [...] }`
// passed to JSON.stringify(...) inside layout.tsx by extracting the relevant
// substring and evaluating it through new Function (sandboxed read of the JS
// object literal — not eval of arbitrary code; static file under our control).
function readSchemaGraph(): {
  "@context": string;
  "@graph": Array<Record<string, unknown>>;
} {
  const source = fs.readFileSync(LAYOUT_PATH, "utf-8");

  // Find the JSON.stringify({ ... }) payload around our schema
  const startMarker = "JSON.stringify({";
  const start = source.indexOf(startMarker);
  if (start < 0) throw new Error("layout.tsx: JSON.stringify({...}) not found");

  // Find the matching closing brace + paren — tolerant of nested braces.
  let depth = 0;
  let i = start + "JSON.stringify(".length;
  for (; i < source.length; i++) {
    const c = source[i];
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) {
        i++; // include closing brace
        break;
      }
    }
  }
  const literal = source.slice(start + "JSON.stringify(".length, i);

  // Replace runtime-only references with stand-ins so the literal evaluates.
  // `allCities` and `targetCitiesSchema` are imported at top of layout.tsx —
  // resolve them by importing the same data.
  const serviceAreas = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, "..", "..", "data", "service-areas.json"),
      "utf-8"
    )
  ) as { regions: { cities: string[] }[] };
  const allCities = serviceAreas.regions.flatMap((r) => r.cities);
  const targetCitiesSchema: Array<{ "@type": "City"; name: string }> = []; // not under test here

  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const fn = new Function("allCities", "targetCitiesSchema", `return (${literal});`);
  return fn(allCities, targetCitiesSchema) as ReturnType<typeof readSchemaGraph>;
}

describe("layout.tsx — Schema.org @graph", () => {
  const schema = readSchemaGraph();

  it("has @context schema.org and @graph array", () => {
    expect(schema["@context"]).toBe("https://schema.org");
    expect(Array.isArray(schema["@graph"])).toBe(true);
    expect(schema["@graph"].length).toBeGreaterThanOrEqual(3);
  });

  describe("LocalBusiness / HomeAndConstructionBusiness node", () => {
    const lb = (
      readSchemaGraph()["@graph"].find(
        (n) => n["@id"] === LB_ID
      ) as Record<string, unknown> | undefined
    );

    it("exists with correct @id", () => {
      expect(lb).toBeDefined();
      expect(lb!["@type"]).toEqual([
        "LocalBusiness",
        "HomeAndConstructionBusiness",
      ]);
    });

    it("has required NAP fields", () => {
      expect(lb!.name).toBe("Rund ums Haus Littawe");
      const addr = lb!.address as Record<string, string>;
      expect(addr.streetAddress).toBe("Bramscher Str. 161");
      expect(addr.postalCode).toBe("49090");
      expect(addr.addressLocality).toBe("Osnabrück");
      expect(addr.addressRegion).toBe("Niedersachsen");
      expect(addr.addressCountry).toBe("DE");
      expect(lb!.telephone).toBe("+49 1523 9603175");
      expect(lb!.email).toBe("kontakt@rundumshaus-littawe.de");
    });

    it("has founder Person with name and foundingDate 2026", () => {
      const founder = lb!.founder as Record<string, string>;
      expect(founder["@type"]).toBe("Person");
      expect(founder.name).toBe("Kevin Littawe");
      expect(lb!.foundingDate).toBe("2026");
    });

    it("has hasOfferCatalog with all 5 services", () => {
      const cat = lb!.hasOfferCatalog as { itemListElement: Array<Record<string, unknown>> };
      expect(cat.itemListElement.length).toBe(5);
      const names = cat.itemListElement.map((s) => s.name);
      expect(names).toEqual([
        "Hausmeisterservice",
        "Gartenpflege",
        "Dacharbeiten",
        "Entrümpelung",
        "Schrottabholung",
      ]);
    });

    it("every Service has provider with @id reference", () => {
      const cat = lb!.hasOfferCatalog as { itemListElement: Array<Record<string, unknown>> };
      for (const svc of cat.itemListElement) {
        const provider = svc.provider as Record<string, string>;
        expect(provider["@id"], `Service ${svc.name} provider`).toBe(LB_ID);
      }
    });

    it("Entrümpelung Service has priceSpecification minPrice 200 EUR (PX-030)", () => {
      const cat = lb!.hasOfferCatalog as { itemListElement: Array<Record<string, unknown>> };
      const entr = cat.itemListElement.find((s) => s.name === "Entrümpelung");
      expect(entr).toBeDefined();
      const offer = entr!.offers as Record<string, unknown>;
      expect(offer["@type"]).toBe("Offer");
      const ps = offer.priceSpecification as Record<string, unknown>;
      expect(ps["@type"]).toBe("PriceSpecification");
      expect(ps.minPrice).toBe(200);
      expect(ps.priceCurrency).toBe("EUR");
    });

    it("Gartenpflege Service has Festpreis description (no priceSpec) — PX-030", () => {
      const cat = lb!.hasOfferCatalog as { itemListElement: Array<Record<string, unknown>> };
      const garten = cat.itemListElement.find((s) => s.name === "Gartenpflege");
      expect(garten).toBeDefined();
      // description must mention Festpreis and not a per-hour rate
      expect(garten!.description).toMatch(/Festpreis/);
      expect(garten!.description).not.toMatch(/€\s*\/\s*h|pro Stunde|Stundenlohn/);
    });
  });

  describe("WebSite node", () => {
    const ws = readSchemaGraph()["@graph"].find(
      (n) => n["@id"] === WS_ID
    ) as Record<string, unknown> | undefined;

    it("exists with correct @id, url, language", () => {
      expect(ws).toBeDefined();
      expect(ws!["@type"]).toBe("WebSite");
      expect(ws!.url).toBe(BASE_URL);
      expect(ws!.inLanguage).toBe("de-DE");
      const publisher = ws!.publisher as Record<string, string>;
      expect(publisher["@id"]).toBe(LB_ID);
    });
  });

  describe("Organization node", () => {
    const org = readSchemaGraph()["@graph"].find(
      (n) => n["@id"] === ORG_ID
    ) as Record<string, unknown> | undefined;

    it("exists with founder Person + jobTitle Inhaber + foundingDate 2026", () => {
      expect(org).toBeDefined();
      expect(org!["@type"]).toBe("Organization");
      const founder = org!.founder as Record<string, string>;
      expect(founder["@type"]).toBe("Person");
      expect(founder.name).toBe("Kevin Littawe");
      expect(founder.jobTitle).toBe("Inhaber");
      expect(org!.foundingDate).toBe("2026");
    });

    it("has logo URL and contact fields", () => {
      expect(org!.logo).toMatch(/^https:\/\/rundumshaus-littawe\.de\//);
      expect(org!.email).toBe("kontakt@rundumshaus-littawe.de");
      expect(org!.telephone).toBe("+49 1523 9603175");
    });
  });

  describe("Cross-node integrity", () => {
    it("all 3 expected @id refs exist in graph", () => {
      const ids = readSchemaGraph()["@graph"].map((n) => n["@id"]);
      expect(ids).toContain(LB_ID);
      expect(ids).toContain(WS_ID);
      expect(ids).toContain(ORG_ID);
    });

    it("no duplicate @id values", () => {
      const ids = readSchemaGraph()["@graph"]
        .map((n) => n["@id"] as string | undefined)
        .filter((x): x is string => Boolean(x));
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe("Festpreis consistency (PX-030 UWG-risk fix)", () => {
    const lb2 = readSchemaGraph()["@graph"].find(
      (n) => n["@id"] === LB_ID
    ) as Record<string, unknown> | undefined;
    const cat = lb2!.hasOfferCatalog as { itemListElement: Array<Record<string, unknown>> };

    it("no Service description mentions Stundenlohn/Stundensatz/€/h", () => {
      for (const svc of cat.itemListElement) {
        expect(svc.description as string, `${svc.name} description`).not.toMatch(
          /Stundenlohn|Stundensatz|€\s*\/\s*h|pro Stunde/i
        );
      }
    });

    it("Schrottabholung has no Offer (Tauschgeschäft, not free service)", () => {
      const schrott = cat.itemListElement.find((s) => s.name === "Schrottabholung");
      expect(schrott).toBeDefined();
      expect(schrott!.offers).toBeUndefined();
      expect(schrott!.description).toMatch(/Tauschgeschäft|Materialwert/);
    });
  });
});
