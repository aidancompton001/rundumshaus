import { generateSEO } from "@/lib/seo";
import ReferenzenContent from "@/components/sections/ReferenzenContent";

export const metadata = generateSEO({
  title: "Referenzen",
  description:
    "Unsere Referenzen — Vorher/Nachher-Bilder unserer Projekte in der Region Bielefeld.",
  path: "/referenzen",
});

export default function ReferenzenPage() {
  return <ReferenzenContent />;
}
