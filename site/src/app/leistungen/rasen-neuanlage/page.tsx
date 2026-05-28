// PX-037: dedicated landing for Rasen-Neuanlage.
// Kevin reported many incoming requests for this service; SEO target is
// "Rasen neu anlegen Osnabrück" and surrounding cities. Text provided by
// Kevin AS IS (WhatsApp 2026-05-27). No photo available.

import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { TARGET_CITIES } from "@/lib/targetCities";

export const metadata = generateSEO({
  title: "Rasen neu anlegen & alten Rasen entfernen",
  description:
    "Professionelle Rasenneuanlage in Osnabrück und im 60-km-Umkreis: alten Rasen entfernen, Boden vorbereiten, Rasensaat oder Rollrasen. Kostenlose Besichtigung — Festpreis.",
  path: "/leistungen/rasen-neuanlage",
});

const BASE_URL = "https://rundumshaus-littawe.de";

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite", item: `${BASE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Leistungen", item: `${BASE_URL}/leistungen/` },
    { "@type": "ListItem", position: 3, name: "Rasen neu anlegen", item: `${BASE_URL}/leistungen/rasen-neuanlage/` },
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Rasenneuanlage",
  serviceType: "Gartenpflege — Rasenneuanlage",
  description:
    "Komplette Rasenneuanlage von der Entfernung des alten Rasens über Bodenvorbereitung bis zur Einsaat oder Rollrasenverlegung. Im 60-km-Umkreis um Osnabrück.",
  provider: { "@id": `${BASE_URL}/#localbusiness` },
  url: `${BASE_URL}/leistungen/rasen-neuanlage/`,
  // Hans Landa fix: full target-city array (matches Gartenpflege/Entrümpelung
  // pattern in layout.tsx) instead of single City — supports SEO for all
  // 7 priority cities, not just Osnabrück.
  areaServed: TARGET_CITIES.map((name) => ({ "@type": "City", name })),
};

const SCHRITTE = [
  "Alten Rasen entfernen",
  "Unkraut und Wurzeln beseitigen",
  "Boden lockern und vorbereiten",
  "Unebenheiten ausgleichen",
  "Fläche fein abharken",
  "Rasensamen aussäen",
  "Boden anwalzen und verdichten",
  "Nachsaat & Ausbesserungen",
  "Vorbereitung für Rollrasen oder Rasensaat",
];

export default function RasenNeuanlagePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <article className="py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="text-sm text-charcoal-light mb-8">
            <ol className="flex flex-wrap gap-x-2 gap-y-1">
              <li>
                <Link href="/" className="hover:text-copper">Startseite</Link>
                <span className="mx-2">/</span>
              </li>
              <li>
                <Link href="/leistungen/" className="hover:text-copper">Leistungen</Link>
                <span className="mx-2">/</span>
              </li>
              <li className="text-charcoal" aria-current="page">Rasen neu anlegen</li>
            </ol>
          </nav>

          {/* H1 */}
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-charcoal mb-6">
            Rasen neu anlegen &amp; alten Rasen entfernen
          </h1>

          {/* Intro — Kevin text AS IS */}
          <p className="text-lg text-charcoal-light leading-relaxed mb-6">
            Sie möchten Ihren alten, unansehnlichen Rasen erneuern oder eine
            komplette Grünfläche neu anlegen? Dann sind wir Ihr zuverlässiger
            Ansprechpartner rund um die professionelle Rasenneuanlage.
          </p>
          <p className="text-base text-charcoal-light leading-relaxed mb-10">
            Wir übernehmen sämtliche Arbeiten von der Entfernung des alten
            Rasens bis zur Vorbereitung und Einsaat der neuen Fläche. Dabei
            sorgen wir für eine saubere, gleichmäßige und langlebige Grundlage
            für einen gesunden und gepflegten Rasen.
          </p>

          {/* Leistungen-Checkliste */}
          <section className="my-10 p-6 bg-cream-dark border border-sand/30 rounded-2xl">
            <h2 className="font-heading text-2xl font-semibold text-charcoal mb-5">
              Unsere Leistungen rund um die Rasenneuanlage
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {SCHRITTE.map((s) => (
                <li key={s} className="flex items-start gap-3 text-charcoal">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-copper flex-shrink-0 mt-0.5"
                    aria-hidden="true"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* CTA */}
          <div className="my-10 flex flex-wrap gap-4">
            <Link
              href="/kontakt/"
              className="inline-flex items-center justify-center px-6 py-3 bg-copper text-white font-semibold rounded-lg hover:bg-copper-dark transition"
            >
              Kostenlose Besichtigung anfragen
            </Link>
            <a
              href="tel:+4915239603175"
              className="inline-flex items-center justify-center px-6 py-3 border border-copper text-copper font-semibold rounded-lg hover:bg-copper/5 transition"
            >
              +49 1523 9603175
            </a>
          </div>

          {/* Cross-link to Bramsche Referenz (PX-036b) */}
          <section className="mt-12 pt-8 border-t border-sand/30">
            <h2 className="font-heading text-xl font-semibold text-charcoal mb-3">
              So sieht das in der Praxis aus
            </h2>
            <p className="text-charcoal-light leading-relaxed mb-4">
              Aktuelles Projekt aus Bramsche: kompletter Neuaufbau einer
              Rasenfläche im Privatgarten — inkl. 10 cm tief verlegtem
              Maulwurfsgitter. Alle 4 Schritte (Vorher → Rasen abgeschält →
              Maulwurfsgitter → Nachher) sind auf der Referenzen-Seite zu sehen.
            </p>
            <Link
              href="/referenzen/"
              className="inline-flex items-center text-copper hover:underline font-medium"
            >
              Zur Referenz „Rasen-Neuanlage Bramsche&ldquo; →
            </Link>
          </section>

          {/* Footer navigation */}
          <div className="mt-12 pt-8 border-t border-sand/30 text-sm text-charcoal-light">
            <Link href="/leistungen/" className="hover:text-copper">
              ← Alle Leistungen
            </Link>
            <span className="mx-3">·</span>
            <Link href="/einsatzgebiet/" className="hover:text-copper">
              Einsatzgebiet (98 Städte)
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
