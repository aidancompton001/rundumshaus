import { generateSEO } from "@/lib/seo";
import Servicegebiet from "@/components/sections/Servicegebiet";

export const metadata = generateSEO({
  title: "Einsatzgebiet",
  description:
    "Hausmeisterservice und Gartenpflege in Osnabrück, Münster, Bielefeld, Rheine, Lingen und über 90 weiteren Städten im Umkreis von 60 km.",
  path: "/einsatzgebiet",
});

export default function EinsatzgebietPage() {
  return <Servicegebiet />;
}
