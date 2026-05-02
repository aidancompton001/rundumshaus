// Environment: default (jsdom) — the pure-logic node pragma would skip the
// shared setupFiles which references `window`, so we use the project default.
import { describe, it, expect } from "vitest";
import {
  generatePageContent,
  type PageContent,
  type ServiceId,
} from "@/lib/programmatic";

// Replicated inline (private in programmatic.ts) — must stay in sync with the
// `hash` impl there. Used only to *prove* our fixture set covers all 8 intro
// variants for gartenpflege; if `hash` ever changes, this assertion catches it.
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

// Snapshot only the stable, semantically meaningful surface — NOT body content,
// which is rotated by hash and would cause noisy diffs on rebalance.
interface SnapshotShape {
  serviceId: ServiceId;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  faqQuestions: string[];
  fakten: { label: string; value: string }[];
  neighborSlugs: string[];
  bodyLength: number;
}

function toSnapshot(p: PageContent): SnapshotShape {
  return {
    serviceId: p.service.id,
    h1: p.h1,
    metaTitle: p.metaTitle,
    metaDescription: p.metaDescription,
    intro: p.intro,
    faqQuestions: p.faqs.map((f) => f.q),
    fakten: p.fakten,
    neighborSlugs: p.neighbors.map((n) => n.slug),
    bodyLength: p.body.length,
  };
}

// One city per intro variant (0..7) for gartenpflege — see verification test below.
const gartenpflegeFixtures: string[] = [
  "damme",        // var 0
  "bramsche",     // var 1
  "bad-essen",    // var 2
  "melle",        // var 3
  "belm",         // var 4
  "bohmte",       // var 5
  "lotte",        // var 6
  "bad-iburg",    // var 7
];

const otherFixtures: { service: ServiceId; city: string }[] = [
  { service: "hausmeisterservice", city: "osnabrueck" },
  { service: "entruempelung", city: "bramsche" },
  { service: "dacharbeiten", city: "lengerich" },
  { service: "schrottabholung", city: "muenster" },
];

describe("programmatic — snapshot regression suite", () => {
  it("gartenpflege fixture set covers all 8 introVariants", () => {
    const variantsHit = new Set(
      gartenpflegeFixtures.map((c) => hash(`gartenpflege:${c}`) % 8),
    );
    expect(variantsHit.size).toBe(8);
  });

  it("generatePageContent is deterministic across repeated calls", () => {
    const a = generatePageContent("gartenpflege", "bramsche");
    const b = generatePageContent("gartenpflege", "bramsche");
    const c = generatePageContent("gartenpflege", "bramsche");
    expect(toSnapshot(a)).toEqual(toSnapshot(b));
    expect(toSnapshot(b)).toEqual(toSnapshot(c));
  });

  describe("gartenpflege — covers all 8 intro variants", () => {
    for (const citySlug of gartenpflegeFixtures) {
      it(`gartenpflege / ${citySlug}`, () => {
        const page = generatePageContent("gartenpflege", citySlug);
        expect(toSnapshot(page)).toMatchSnapshot();
      });
    }
  });

  describe("other services — spot checks", () => {
    for (const { service, city } of otherFixtures) {
      it(`${service} / ${city}`, () => {
        const page = generatePageContent(service, city);
        expect(toSnapshot(page)).toMatchSnapshot();
      });
    }
  });
});
