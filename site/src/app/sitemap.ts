import type { MetadataRoute } from "next";
import { getAllPagePairs, getCityBySlug } from "@/lib/programmatic";
import ratgeberData from "@/data/ratgeber.json";

export const dynamic = "force-static";

const BASE_URL = "https://rundumshaus-littawe.de";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, priority: 1.0, changeFrequency: "weekly" },
    { url: `${BASE_URL}/leistungen/`, lastModified: now, priority: 0.9, changeFrequency: "monthly" },
    { url: `${BASE_URL}/einsatzgebiet/`, lastModified: now, priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE_URL}/ratgeber/`, lastModified: now, priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE_URL}/referenzen/`, lastModified: now, priority: 0.7, changeFrequency: "weekly" },
    { url: `${BASE_URL}/kontakt/`, lastModified: now, priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE_URL}/impressum/`, lastModified: now, priority: 0.3, changeFrequency: "yearly" },
    { url: `${BASE_URL}/datenschutz/`, lastModified: now, priority: 0.3, changeFrequency: "yearly" },
  ];

  const ratgeberPages: MetadataRoute.Sitemap = (ratgeberData.articles as { slug: string }[]).map((a) => ({
    url: `${BASE_URL}/ratgeber/${a.slug}/`,
    lastModified: now,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  // Tier-based priority for programmatic landing pages.
  const tierPriority: Record<1 | 2 | 3, number> = { 1: 0.8, 2: 0.6, 3: 0.4 };

  const programmaticPages: MetadataRoute.Sitemap = getAllPagePairs().map((p) => {
    const city = getCityBySlug(p.city);
    const tier = (city?.tier ?? 3) as 1 | 2 | 3;
    return {
      url: `${BASE_URL}/leistungen/${p.service}/${p.city}/`,
      lastModified: now,
      priority: tierPriority[tier],
      changeFrequency: "monthly" as const,
    };
  });

  return [...staticPages, ...ratgeberPages, ...programmaticPages];
}
