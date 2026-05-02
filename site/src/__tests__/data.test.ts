import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import siteData from "@/data/site.json";
import homepageData from "@/data/homepage.json";
import servicesData from "@/data/services.json";
import contactFormData from "@/data/contact-form.json";
import referenzenData from "@/data/referenzen.json";
import serviceAreasData from "@/data/service-areas.json";
import type {
  SiteConfig,
  HomepageData,
  Service,
  ContactFormData,
  ReferenzenData,
} from "@/data/types";

describe("Data Integrity", () => {
  describe("site.json", () => {
    const site = siteData as SiteConfig;

    it("has company name", () => {
      expect(site.company).toBeTruthy();
    });

    it("has 5 navigation links (Startseite, Leistungen, Über uns, Referenzen, Kontakt)", () => {
      expect(site.navigation).toHaveLength(5);
      const labels = site.navigation.map((n) => n.label);
      expect(labels).toEqual(["Startseite", "Leistungen", "Über uns", "Referenzen", "Kontakt"]);
    });

    it("has owner name", () => {
      expect(site.owner).toBe("Kevin Littawe");
    });

    it("has phone and email", () => {
      expect(site.phone).toBeTruthy();
      expect(site.email).toBeTruthy();
    });

    it("has legal links in footer", () => {
      expect(site.footer.legalLinks.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("homepage.json", () => {
    const homepage = homepageData as HomepageData;

    it("has hero heading and subheading", () => {
      expect(homepage.hero.heading).toBeTruthy();
      expect(homepage.hero.subheading).toBeTruthy();
    });

    it("has 2 CTAs", () => {
      expect(homepage.hero.ctas).toHaveLength(2);
    });

    it("has about section with body", () => {
      expect(homepage.about.heading).toBeTruthy();
      expect(homepage.about.body).toBeTruthy();
    });

    it("has stats", () => {
      expect(homepage.stats.length).toBeGreaterThanOrEqual(1);
      homepage.stats.forEach((stat) => {
        expect(stat.value).toBeTypeOf("number");
        expect(stat.label).toBeTruthy();
      });
    });
  });

  describe("services.json", () => {
    const { services } = servicesData as { services: Service[] };

    it("has exactly 5 services", () => {
      expect(services).toHaveLength(5);
    });

    it("every service has required fields", () => {
      services.forEach((s) => {
        expect(s.id).toBeTruthy();
        expect(s.title).toBeTruthy();
        expect(s.description).toBeTruthy();
        expect(s.detailDescription).toBeTruthy();
        expect(s.icon).toBeTruthy();
      });
    });

    it("has unique ids", () => {
      const ids = services.map((s) => s.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("includes Hausmeisterservice", () => {
      expect(services.find((s) => s.id === "hausmeisterservice")).toBeTruthy();
    });

    it("includes Schrottabholung", () => {
      expect(services.find((s) => s.id === "schrottabholung")).toBeTruthy();
    });

    describe("Local SEO content (PX-022 Wave 1)", () => {
      const TARGET_CITIES = [
        "Osnabrück",
        "Bramsche",
        "Wallenhorst",
        "Belm",
        "Bissendorf",
        "Georgsmarienhütte",
        "Melle",
      ];

      it("gartenpflege.detailDescription mentions all 7 target cities", () => {
        const garten = services.find((s) => s.id === "gartenpflege");
        expect(garten).toBeTruthy();
        TARGET_CITIES.forEach((city) => {
          expect(
            garten!.detailDescription,
            `Missing city in gartenpflege: ${city}`
          ).toContain(city);
        });
      });

      it("entruempelung.detailDescription mentions all 7 target cities", () => {
        const entr = services.find((s) => s.id === "entruempelung");
        expect(entr).toBeTruthy();
        TARGET_CITIES.forEach((city) => {
          expect(
            entr!.detailDescription,
            `Missing city in entruempelung: ${city}`
          ).toContain(city);
        });
      });

      it("gartenpflege.detailDescription has at least 100 words (SEO content)", () => {
        const garten = services.find((s) => s.id === "gartenpflege");
        const wordCount = garten!.detailDescription.split(/\s+/).length;
        expect(wordCount).toBeGreaterThanOrEqual(100);
      });

      it("entruempelung.detailDescription has at least 100 words (SEO content)", () => {
        const entr = services.find((s) => s.id === "entruempelung");
        const wordCount = entr!.detailDescription.split(/\s+/).length;
        expect(wordCount).toBeGreaterThanOrEqual(100);
      });
    });

    it("all referenced image files exist on disk", () => {
      const PUBLIC = join(process.cwd(), "public");
      services.forEach((s) => {
        if (s.image) {
          const p = join(PUBLIC, s.image);
          expect(existsSync(p), `Missing image: ${s.image}`).toBe(true);
        }
        if (s.detailImage) {
          const p = join(PUBLIC, s.detailImage);
          expect(existsSync(p), `Missing detailImage: ${s.detailImage}`).toBe(
            true
          );
        }
      });
    });

    it("all responsive webp variants used in <picture> srcset exist", () => {
      const PUBLIC = join(process.cwd(), "public");
      // ServiceOverview uses [400, 800] for service.image (cards)
      const widths = [400, 800];
      services.forEach((s) => {
        if (!s.image) return;
        const withoutExt = s.image.replace(/\.(png|jpe?g|webp)$/i, "");
        widths.forEach((w) => {
          const variant = `${withoutExt}-${w}w.webp`;
          const p = join(PUBLIC, variant);
          expect(existsSync(p), `Missing responsive variant: ${variant}`).toBe(
            true
          );
        });
      });
    });
  });

  describe("contact-form.json", () => {
    const form = contactFormData as ContactFormData;

    it("has sections with fields", () => {
      expect(form.sections.length).toBeGreaterThanOrEqual(1);
      form.sections.forEach((section) => {
        expect(section.heading).toBeTruthy();
        expect(section.fields.length).toBeGreaterThanOrEqual(1);
      });
    });

    it("has submit label", () => {
      expect(form.submitLabel).toBeTruthy();
    });

    it("has success and error messages", () => {
      expect(form.successMessage).toBeTruthy();
      expect(form.errorMessage).toBeTruthy();
    });

    it("has GDPR consent checkbox", () => {
      const allFields = form.sections.flatMap((s) => s.fields);
      const consent = allFields.find((f) => f.name === "consent");
      expect(consent).toBeTruthy();
      expect(consent?.type).toBe("checkbox");
      expect(consent?.required).toBe(true);
    });
  });

  describe("service-areas.json", () => {
    const data = serviceAreasData as {
      heading: string;
      regions: { name: string; cities: string[] }[];
    };

    it("has heading and regions", () => {
      expect(data.heading).toBeTruthy();
      expect(data.regions.length).toBeGreaterThanOrEqual(1);
    });

    it("each region has name and cities", () => {
      data.regions.forEach((r) => {
        expect(r.name).toBeTruthy();
        expect(r.cities.length).toBeGreaterThanOrEqual(1);
      });
    });

    it("contains Osnabrück (home city)", () => {
      const allCities = data.regions.flatMap((r) => r.cities);
      expect(allCities).toContain("Osnabrück");
    });

    it("has 80+ cities total (covers wide service area)", () => {
      const allCities = data.regions.flatMap((r) => r.cities);
      expect(allCities.length).toBeGreaterThanOrEqual(80);
    });
  });

  describe("referenzen.json", () => {
    const ref = referenzenData as ReferenzenData;

    it("has heading", () => {
      expect(ref.heading).toBeTruthy();
    });

    it("has empty state text", () => {
      expect(ref.emptyState).toBeTruthy();
    });

    it("items is an array", () => {
      expect(Array.isArray(ref.items)).toBe(true);
    });
  });
});
