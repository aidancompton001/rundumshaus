import { generateSEO } from "@/lib/seo";
import siteData from "@/data/site.json";
import type { SiteConfig } from "@/data/types";

const site = siteData as SiteConfig;

export const metadata = generateSEO({
  title: "Impressum",
  description: `Impressum — ${site.company}, ${site.owner}, ${site.address.city}.`,
  path: "/impressum",
});

export default function ImpressumPage() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-3xl mx-auto prose prose-charcoal">
        <h1 className="font-heading text-4xl font-bold mb-8">Impressum</h1>

        <h2 className="font-heading text-2xl font-semibold mt-8 mb-4">
          Angaben gemäß § 5 TMG
        </h2>
        <p>
          {site.owner}
          <br />
          {site.company}
          <br />
          {site.address.street}
          <br />
          {site.address.zip} {site.address.city}
        </p>

        <h2 className="font-heading text-2xl font-semibold mt-8 mb-4">
          Kontakt
        </h2>
        <p>
          Telefon:{" "}
          <a href={`tel:${site.phone}`} className="text-copper hover:text-copper-light">
            {site.phone}
          </a>
          <br />
          E-Mail:{" "}
          <a href={`mailto:${site.email}`} className="text-copper hover:text-copper-light">
            {site.email}
          </a>
        </p>

        <h2 className="font-heading text-2xl font-semibold mt-8 mb-4">
          EU-Streitschlichtung
        </h2>
        <p>
          Die Europäische Kommission stellt eine Plattform zur
          Online-Streitbeilegung (OS) bereit:{" "}
          <a
            href="https://ec.europa.eu/consumers/odr/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-copper hover:text-copper-light"
          >
            https://ec.europa.eu/consumers/odr/
          </a>
        </p>
        <p>
          Wir sind nicht bereit oder verpflichtet, an
          Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
          teilzunehmen.
        </p>

        <h2 className="font-heading text-2xl font-semibold mt-8 mb-4">
          Haftung für Inhalte
        </h2>
        <p>
          Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte
          auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach
          §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht
          verpflichtet, übermittelte oder gespeicherte fremde Informationen zu
          überwachen oder nach Umständen zu forschen, die auf eine
          rechtswidrige Tätigkeit hinweisen.
        </p>

        <h2 className="font-heading text-2xl font-semibold mt-8 mb-4">
          Haftung für Links
        </h2>
        <p>
          Unser Angebot enthält Links zu externen Websites Dritter, auf deren
          Inhalte wir keinen Einfluss haben. Deshalb können wir für diese
          fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
          verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber
          der Seiten verantwortlich.
        </p>
      </div>
    </section>
  );
}
