import { generateSEO } from "@/lib/seo";
import { getPageMetaOverride } from "@/lib/meta-overrides";
import FamilyBusinessBlock from "@/components/sections/FamilyBusinessBlock";
import FaktenTabelle from "@/components/sections/FaktenTabelle";
import ReviewsBlock from "@/components/sections/ReviewsBlock";

// PX-068 B: Kevin-editable meta via /admin/ (empty override = these defaults).
const metaOverride = getPageMetaOverride("/ueber-uns/");
// PX-046 F4: description 201→152 chars (Google truncation fix)
export const metadata = generateSEO({
  title: metaOverride?.title ?? "Über uns — Familienbetrieb Littawe in Osnabrück",
  description:
    metaOverride?.description ??
    "Familienbetrieb aus Osnabrück (Bramscher Str. 161). Inhaber Kevin Littawe. Persönlicher Kontakt, faire Festpreise, eigene Mitarbeiter — 80 km Umkreis.",
  path: "/ueber-uns",
});

const BASE_URL = "https://rundumshaus-littawe.de";

const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "Über uns — Rund ums Haus Littawe",
  description:
    "Familienbetrieb für Hausmeisterservice, Gartenpflege, Garten- und Landschaftsbau, Dacharbeiten und Entrümpelung in Osnabrück. Gegründet 2026 von Kevin Littawe.",
  inLanguage: "de-DE",
  url: `${BASE_URL}/ueber-uns`,
  mainEntity: { "@id": `${BASE_URL}/#localbusiness` },
  publisher: { "@id": `${BASE_URL}/#organization` },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite", item: `${BASE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Über uns", item: `${BASE_URL}/ueber-uns` },
  ],
};

export default function UeberUnsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <FamilyBusinessBlock />
      <FaktenTabelle />
      <ReviewsBlock />
    </>
  );
}
