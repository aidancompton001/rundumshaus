import { generateSEO } from "@/lib/seo";
import { getPageMetaOverride } from "@/lib/meta-overrides";
import ContactForm from "@/components/sections/ContactForm";

// PX-068 B: Kevin-editable meta via /admin/ (empty override = these defaults).
const metaOverride = getPageMetaOverride("/kontakt/");
export const metadata = generateSEO({
  title: metaOverride?.title ?? "Kontakt",
  description:
    metaOverride?.description ??
    "Kontaktieren Sie Rund ums Haus Littawe — kostenlose Anfrage für Hausmeisterservice, Gartenpflege und mehr.",
  path: "/kontakt",
});

export default function KontaktPage() {
  return <ContactForm />;
}
