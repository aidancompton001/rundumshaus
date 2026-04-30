import { generateSEO } from "@/lib/seo";
import ServiceDetail from "@/components/sections/ServiceDetail";
import WeitereLeistungenSection from "@/components/sections/WeitereLeistungenSection";

export const metadata = generateSEO({
  title: "Leistungen",
  description:
    "Hausmeisterservice, Gartenpflege, Dacharbeiten, Entrümpelung, Schrottabholung — und viele weitere Dienstleistungen rund um Haus und Garten.",
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
