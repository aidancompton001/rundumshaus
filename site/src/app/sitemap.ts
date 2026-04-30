import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE_URL = "https://rundumshaus-littawe.de";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE_URL}/`, lastModified: new Date(), priority: 1.0, changeFrequency: "weekly" },
    { url: `${BASE_URL}/leistungen/`, lastModified: new Date(), priority: 0.9, changeFrequency: "monthly" },
    { url: `${BASE_URL}/einsatzgebiet/`, lastModified: new Date(), priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE_URL}/referenzen/`, lastModified: new Date(), priority: 0.7, changeFrequency: "weekly" },
    { url: `${BASE_URL}/kontakt/`, lastModified: new Date(), priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE_URL}/impressum/`, lastModified: new Date(), priority: 0.3, changeFrequency: "yearly" },
    { url: `${BASE_URL}/datenschutz/`, lastModified: new Date(), priority: 0.3, changeFrequency: "yearly" },
  ];
}
