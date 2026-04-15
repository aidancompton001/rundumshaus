import { generateSEO } from "@/lib/seo";
import ServiceDetail from "@/components/sections/ServiceDetail";

export const metadata = generateSEO({
  title: "Leistungen",
  description:
    "Hausmeisterservice, Gartenpflege, Dacharbeiten, Entrümpelung und Schrottabholung — alle Leistungen im Überblick.",
  path: "/leistungen",
});

export default function LeistungenPage() {
  return <ServiceDetail />;
}
