import { describe, it, expect } from "vitest";
import { TARGET_CITIES } from "@/lib/targetCities";
import serviceAreasData from "@/data/service-areas.json";

describe("TARGET_CITIES (PX-022 Local SEO)", () => {
  it("contains exactly 7 cities", () => {
    expect(TARGET_CITIES).toHaveLength(7);
  });

  it("contains Osnabrück (home city)", () => {
    expect(TARGET_CITIES).toContain("Osnabrück");
  });

  it("all cities exist in service-areas.json (single source of truth)", () => {
    const allKnownCities = serviceAreasData.regions.flatMap((r) => r.cities);
    TARGET_CITIES.forEach((city) => {
      expect(
        allKnownCities,
        `TARGET_CITIES.${city} not found in service-areas.json`
      ).toContain(city);
    });
  });

  it("all cities are unique", () => {
    expect(new Set(TARGET_CITIES).size).toBe(TARGET_CITIES.length);
  });
});
