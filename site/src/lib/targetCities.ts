import serviceAreasData from "@/data/service-areas.json";

/**
 * Top 7 ближних городов (≤25 km вокруг Osnabrück) для Local SEO.
 * Используется в:
 * - services.json detailDescription (Wave 1)
 * - service-faq.json вопросы (Wave 2)
 * - layout.tsx Schema.org Service.areaServed для Gartenpflege + Entrümpelung (Wave 3)
 * - leistungen/page.tsx meta-теги (Wave 3)
 *
 * Все города уже присутствуют в service-areas.json (регион "Osnabrücker Land & Umgebung").
 */
export const TARGET_CITIES = [
  "Osnabrück",
  "Bramsche",
  "Wallenhorst",
  "Belm",
  "Bissendorf",
  "Georgsmarienhütte",
  "Melle",
] as const;

export type TargetCity = (typeof TARGET_CITIES)[number];

/**
 * Validation: каждый TARGET_CITY должен существовать в service-areas.json.
 * Throws на module load если кто-то изменил service-areas.json и забыл синхронизировать.
 */
const allKnownCities = serviceAreasData.regions.flatMap((r) => r.cities);
for (const city of TARGET_CITIES) {
  if (!allKnownCities.includes(city)) {
    throw new Error(
      `TARGET_CITIES contains city not present in service-areas.json: "${city}"`
    );
  }
}
