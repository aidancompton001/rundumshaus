import { generateSEO } from "@/lib/seo";
import ServiceDetail from "@/components/sections/ServiceDetail";
import WeitereLeistungenSection from "@/components/sections/WeitereLeistungenSection";

export const metadata = generateSEO({
  title: "Leistungen — Gärtner & Entrümpelungsfirma in Osnabrück und Umgebung",
  description:
    "Gartenpflege, Heckenschnitt, Entrümpelung und Haushaltsauflösung — schnell und zuverlässig in Osnabrück, Bramsche, Wallenhorst, Belm, Bissendorf, Georgsmarienhütte und Melle.",
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
