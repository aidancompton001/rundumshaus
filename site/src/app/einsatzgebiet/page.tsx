import { generateSEO } from "@/lib/seo";
import { getPageMetaOverride } from "@/lib/meta-overrides";
import Servicegebiet from "@/components/sections/Servicegebiet";

// PX-068 B: Kevin-editable meta via /admin/ (empty override = these defaults).
const metaOverride = getPageMetaOverride("/einsatzgebiet/");
export const metadata = generateSEO({
  title: metaOverride?.title ?? "Einsatzgebiet",
  description:
    metaOverride?.description ??
    "Hausmeisterservice und Gartenpflege in Osnabrück, Münster, Bielefeld, Rheine, Lingen und über 90 weiteren Städten im Umkreis von 60 km.",
  path: "/einsatzgebiet",
});

export default function EinsatzgebietPage() {
  return <Servicegebiet />;
}
