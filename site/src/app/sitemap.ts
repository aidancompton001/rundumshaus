import type { MetadataRoute } from "next";
import { getAllPagePairs, getCityBySlug } from "@/lib/programmatic";
import ratgeberData from "@/data/ratgeber.json";

export const dynamic = "force-static";

const BASE_URL = "https://rundumshaus-littawe.de";

// PX-046 F12: real per-page lastmod (was: всё в одну дату build time).
// Google игнорирует sitemap с fake lastmod. Static dates per page-group
// reflect when content was actually last touched (PX-history-driven).
// When a page is meaningfully updated, bump its date manually.
const LASTMOD = {
  // Updated 2026-06-08 (PX-046 audit fixes)
  home: "2026-06-08",
  osnabrueck: "2026-06-08",         // PX-045
  leistungen: "2026-06-08",         // PX-045b + PX-046
  objektpflege: "2026-06-05",       // PX-040
  rasenNeuanlage: "2026-05-28",     // PX-037
  ueberUns: "2026-06-08",           // PX-046 og:image
  einsatzgebiet: "2026-04-16",
  ratgeber: "2026-04-16",
  referenzen: "2026-05-26",          // PX-036
  kontakt: "2026-06-08",            // PX-046 LCP fix
  impressum: "2026-04-16",
  datenschutz: "2026-04-16",
  // Programmatic city pages — PX-042 thin-content fix
  programmatic: "2026-06-07",
} as const;

const toDate = (iso: string) => new Date(iso + "T00:00:00Z");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: toDate(LASTMOD.home), priority: 1.0, changeFrequency: "weekly" },
    { url: `${BASE_URL}/osnabrueck/`, lastModified: toDate(LASTMOD.osnabrueck), priority: 0.95, changeFrequency: "weekly" },
    { url: `${BASE_URL}/leistungen/`, lastModified: toDate(LASTMOD.leistungen), priority: 0.9, changeFrequency: "monthly" },
    { url: `${BASE_URL}/leistungen/rasen-neuanlage/`, lastModified: toDate(LASTMOD.rasenNeuanlage), priority: 0.85, changeFrequency: "monthly" },
    { url: `${BASE_URL}/leistungen/objektpflege/`, lastModified: toDate(LASTMOD.objektpflege), priority: 0.85, changeFrequency: "monthly" },
    { url: `${BASE_URL}/ueber-uns/`, lastModified: toDate(LASTMOD.ueberUns), priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE_URL}/einsatzgebiet/`, lastModified: toDate(LASTMOD.einsatzgebiet), priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE_URL}/ratgeber/`, lastModified: toDate(LASTMOD.ratgeber), priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE_URL}/referenzen/`, lastModified: toDate(LASTMOD.referenzen), priority: 0.7, changeFrequency: "weekly" },
    { url: `${BASE_URL}/kontakt/`, lastModified: toDate(LASTMOD.kontakt), priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE_URL}/impressum/`, lastModified: toDate(LASTMOD.impressum), priority: 0.3, changeFrequency: "yearly" },
    { url: `${BASE_URL}/datenschutz/`, lastModified: toDate(LASTMOD.datenschutz), priority: 0.3, changeFrequency: "yearly" },
  ];

  const ratgeberPages: MetadataRoute.Sitemap = (ratgeberData.articles as { slug: string; lastModified?: string }[]).map((a) => ({
    url: `${BASE_URL}/ratgeber/${a.slug}/`,
    lastModified: toDate(a.lastModified || LASTMOD.ratgeber),
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  const tierPriority: Record<1 | 2 | 3, number> = { 1: 0.8, 2: 0.6, 3: 0.4 };

  const programmaticPages: MetadataRoute.Sitemap = getAllPagePairs().map((p) => {
    const city = getCityBySlug(p.city);
    const tier = (city?.tier ?? 3) as 1 | 2 | 3;
    return {
      url: `${BASE_URL}/leistungen/${p.service}/${p.city}/`,
      lastModified: toDate(LASTMOD.programmatic),
      priority: tierPriority[tier],
      changeFrequency: "monthly" as const,
    };
  });

  return [...staticPages, ...ratgeberPages, ...programmaticPages];
}
