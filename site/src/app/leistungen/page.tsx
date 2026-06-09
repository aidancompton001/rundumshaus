import { generateSEO } from "@/lib/seo";
import ServiceDetail from "@/components/sections/ServiceDetail";
import WeitereLeistungenSection from "@/components/sections/WeitereLeistungenSection";

// PX-046 F3+F4: title 100→52 chars, description 181→152 chars (Google truncation fix)
export const metadata = generateSEO({
  title: "Leistungen ★ Hausmeister & Gärtner Osnabrück",
  description:
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
