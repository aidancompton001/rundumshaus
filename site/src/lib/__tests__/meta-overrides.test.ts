// PX-068 V — unit tests for the CMS meta-override resolver.
// Critical contract: empty/broken input NEVER breaks meta — always null →
// caller falls back to code-generated values (Design Review fallback-first).

import { describe, it, expect } from "vitest";
import {
  resolvePageMeta,
  resolveServiceMeta,
  getPageMetaOverride,
  getServiceMetaOverride,
  type MetaOverridesData,
} from "@/lib/meta-overrides";
import metaOverridesJson from "@/data/meta-overrides.json";

describe("resolvePageMeta", () => {
  it("returns override when title set", () => {
    const data: MetaOverridesData = {
      pages: [{ path: "/", title: "Kevins Titel", description: "" }],
    };
    expect(resolvePageMeta(data, "/")).toEqual({ title: "Kevins Titel", description: undefined });
  });

  it("returns null for empty strings (= use default)", () => {
    const data: MetaOverridesData = {
      pages: [{ path: "/", title: "", description: "   " }],
    };
    expect(resolvePageMeta(data, "/")).toBeNull();
  });

  it("returns null for unknown path", () => {
    expect(resolvePageMeta({ pages: [] }, "/leistungen/")).toBeNull();
  });

  it("survives broken shapes (null entries, missing arrays)", () => {
    expect(resolvePageMeta({} as MetaOverridesData, "/")).toBeNull();
    expect(
      resolvePageMeta({ pages: [null as unknown as { path: string }] }, "/"),
    ).toBeNull();
  });

  it("trims whitespace", () => {
    const data: MetaOverridesData = {
      pages: [{ path: "/kontakt/", title: "  Kontakt NEU  " }],
    };
    expect(resolvePageMeta(data, "/kontakt/")?.title).toBe("Kontakt NEU");
  });
});

describe("resolveServiceMeta", () => {
  it("substitutes {city} everywhere in the pattern", () => {
    const data: MetaOverridesData = {
      services: [
        {
          id: "gartenpflege",
          titlePattern: "Gartenpflege {city} — Gärtner in {city}",
          descriptionPattern: "Wir arbeiten in {city}.",
        },
      ],
    };
    const r = resolveServiceMeta(data, "gartenpflege", "Bramsche");
    expect(r?.title).toBe("Gartenpflege Bramsche — Gärtner in Bramsche");
    expect(r?.description).toBe("Wir arbeiten in Bramsche.");
  });

  it("handles long city names (G6: override bypasses tier guard by design)", () => {
    const data: MetaOverridesData = {
      services: [{ id: "dacharbeiten", titlePattern: "Dach {city}" }],
    };
    const r = resolveServiceMeta(data, "dacharbeiten", "Neuenkirchen (Kreis Steinfurt)");
    expect(r?.title).toBe("Dach Neuenkirchen (Kreis Steinfurt)");
  });

  it("returns null for empty patterns (= use default)", () => {
    const data: MetaOverridesData = {
      services: [{ id: "garten-landschaftsbau", titlePattern: "", descriptionPattern: "" }],
    };
    expect(resolveServiceMeta(data, "garten-landschaftsbau", "Melle")).toBeNull();
  });

  it("returns null for unknown service id", () => {
    expect(resolveServiceMeta({ services: [] }, "gartenpflege", "Melle")).toBeNull();
  });
});

describe("committed meta-overrides.json (production state)", () => {
  it("has entries for all 5 pages and all 5 services", () => {
    const d = metaOverridesJson as MetaOverridesData;
    expect(d.pages?.map((p) => p.path)).toEqual(
      expect.arrayContaining(["/", "/leistungen/", "/ueber-uns/", "/kontakt/", "/einsatzgebiet/"]),
    );
    expect(d.services?.map((s) => s.id)).toEqual(
      expect.arrayContaining([
        "gartenpflege",
        "hausmeisterservice",
        "dacharbeiten",
        "entruempelung",
        "garten-landschaftsbau",
      ]),
    );
  });

  it("non-empty service patterns must contain {city} (anti-duplicate-titles guard)", () => {
    const d = metaOverridesJson as MetaOverridesData;
    for (const s of d.services ?? []) {
      for (const p of [s.titlePattern, s.descriptionPattern]) {
        if (p && p.trim()) expect(p, `${s.id}`).toContain("{city}");
      }
    }
  });
});

describe("wrappers bound to committed JSON", () => {
  // PX-069 hotfix: the previous "must be null" assertion gated on PROD CONTENT
  // state — Kevin's very first real CMS save (filling gartenpflege patterns)
  // broke the deploy pipeline. Same E2-class mistake the design review warned
  // about. Wrappers must accept ANY committed state; the empty→null contract
  // is covered by the pure-resolver fixture tests above.
  it("wrappers return null OR a clean {title?,description?} shape", () => {
    for (const r of [getPageMetaOverride("/"), getServiceMetaOverride("gartenpflege", "Osnabrück")]) {
      if (r !== null) {
        expect(typeof (r.title ?? "")).toBe("string");
        expect(typeof (r.description ?? "")).toBe("string");
        expect(r.title || r.description).toBeTruthy();
      }
    }
  });
});
