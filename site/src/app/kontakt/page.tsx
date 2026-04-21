import { generateSEO } from "@/lib/seo";
import ContactForm from "@/components/sections/ContactForm";

export const metadata = generateSEO({
  title: "Kontakt",
  description:
    "Kontaktieren Sie Rund ums Haus Littawe — kostenlose Anfrage für Hausmeisterservice, Gartenpflege und mehr.",
  path: "/kontakt",
});

export default function KontaktPage() {
  return <ContactForm />;
}
