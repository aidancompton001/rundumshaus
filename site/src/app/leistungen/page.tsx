import { generateSEO } from "@/lib/seo";
import { getPageMetaOverride } from "@/lib/meta-overrides";
import ServiceDetail from "@/components/sections/ServiceDetail";
import WeitereLeistungenSection from "@/components/sections/WeitereLeistungenSection";

// PX-068 B: Kevin-editable meta via /admin/ (empty override = these defaults).
const metaOverride = getPageMetaOverride("/leistungen/");
// PX-046 F3+F4: title 100→52 chars, description 181→152 chars (Google truncation fix)
export const metadata = generateSEO({
  title: metaOverride?.title ?? "Leistungen ★ Hausmeister & Gärtner Osnabrück",
  description:
    metaOverride?.description ??
    "Hausmeister, Gartenpflege, Dacharbeiten, Entrümpelung & Schrottabholung in Osnabrück und 60-km-Umkreis. Festpreis nach kostenloser Besichtigung.",
  path: "/leistungen",
});

export default function LeistungenPage() {
  return (
    <>
      <ServiceDetail />
      <WeitereLeistungenSection />
    </>
  );
}
