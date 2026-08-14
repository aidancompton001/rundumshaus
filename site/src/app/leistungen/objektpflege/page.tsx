// PX-040: dedicated B2B landing for Objektpflege.
// Kevin requested a separate page for Hausverwaltungen, Vermieter, WEGs and
// Wohnungsbaugesellschaften (WhatsApp 2026-06-03..05). Text provided by
// Kevin AS IS, 50€ agreed. CTA: phone + email only (per Kevin's request).

import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { TARGET_CITIES } from "@/lib/targetCities";
import { getImageUrl, toWebp } from "@/lib/getImageUrl";

export const metadata = generateSEO({
  title: "Objektpflege Osnabrück ★ für Hausverwaltungen & WEGs",
  description:
    "Professionelle Objektbetreuung für Mehrfamilienhäuser, Wohnanlagen & Gewerbeobjekte in Osnabrück: Hausmeister, Garten, Winterdienst, Mülltonnen, Treppenhaus. Festpreis oder Jahresvertrag. Familienbetrieb — ☎ direkt anrufen.",
  path: "/leistungen/objektpflege",
});

const BASE_URL = "https://rundumshaus-littawe.de";

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite", item: `${BASE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Leistungen", item: `${BASE_URL}/leistungen/` },
    { "@type": "ListItem", position: 3, name: "Objektpflege", item: `${BASE_URL}/leistungen/objektpflege/` },
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Objektpflege & Objektbetreuung",
  serviceType: "Objektbetreuung & Hausmeisterservice für Hausverwaltungen",
  description:
    "Professionelle Objektpflege für Mehrfamilienhäuser, Wohnanlagen, Gewerbeobjekte und Außenanlagen. Festpreis oder laufender Betreuungsvertrag.",
  provider: { "@id": `${BASE_URL}/#localbusiness` },
  url: `${BASE_URL}/leistungen/objektpflege/`,
  areaServed: TARGET_CITIES.map((name) => ({ "@type": "City", name })),
  // Landa H2 fix: use standard Schema.org `Audience` type (BusinessAudience
  // does not exist in the vocabulary and would fail Google validation).
  audience: {
    "@type": "Audience",
    audienceType: "Hausverwaltungen, Vermieter, WEGs, Wohnungsbaugesellschaften",
  },
};

const ZIELGRUPPEN = [
  { title: "Hausverwaltungen", desc: "Laufende Betreuung Ihrer Verwaltungsobjekte" },
  { title: "Wohnungsbaugesellschaften", desc: "Pflege ganzer Wohnanlagen und Bestände" },
  { title: "WEGs", desc: "Eigentümergemeinschaften — ein Ansprechpartner für alles" },
  { title: "Gewerbeobjekte", desc: "Außenanlagen, Höfe, Mitarbeiterparkplätze" },
];

const LEISTUNGEN = [
  "Regelmäßige Objektpflege",
  "Hausmeisterservice",
  "Garten- und Grünanlagenpflege",
  "Rasen mähen und Rasenkanten schneiden",
  "Hecken- und Strauchschnitt",
  "Unkrautentfernung",
  "Beetpflege",
  "Laubentfernung",
  "Mülltonnenservice",
  "Winterdienst",
  "Dachrinnenreinigung",
];

const HERO_IMAGE = "/images/services/detail-objektpflege.png";

export default function ObjektpflegePage() {
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
              <li className="text-charcoal" aria-current="page">Objektpflege</li>
            </ol>
          </nav>

          {/* H1 */}
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-charcoal mb-6">
            Objektpflege in Osnabrück
          </h1>

          {/* Hero image (PX-040: generated via Higgsfield nano_banana_pro) */}
          <div className="aspect-[16/9] overflow-hidden rounded-2xl mb-10 border border-sand/30">
            <picture>
              <source type="image/webp" srcSet={getImageUrl(toWebp(HERO_IMAGE))} />
              <img
                src={getImageUrl(HERO_IMAGE)}
                alt="Gepflegtes Mehrfamilienhaus in Osnabrück — Beispiel für professionelle Objektpflege"
                width={1200}
                height={675}
                className="w-full h-full object-cover"
                loading="eager"
                decoding="async"
              />
            </picture>
          </div>

          {/* Intro — Kevin text AS IS (answer-first paragraph for AI Search) */}
          <p className="text-lg text-charcoal-light leading-relaxed mb-6">
            Eine gepflegte Immobilie sorgt für einen positiven ersten Eindruck,
            zufriedene Bewohner und trägt langfristig zum Werterhalt des Objekts
            bei. Mit unserer professionellen Objektpflege übernehmen wir die
            zuverlässige Betreuung von Mehrfamilienhäusern, Wohnanlagen,
            Gewerbeobjekten und Außenanlagen in Osnabrück und Umgebung.
          </p>

          {/* Zielgruppen — B2B audience signals */}
          <section className="my-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ZIELGRUPPEN.map((z) => (
              <div
                key={z.title}
                className="p-5 bg-cream-dark border border-sand/30 rounded-xl"
              >
                <h2 className="font-heading text-lg font-semibold text-charcoal mb-1">
                  {z.title}
                </h2>
                <p className="text-sm text-charcoal-light leading-relaxed">{z.desc}</p>
              </div>
            ))}
          </section>

          {/* Leistungen-Checkliste (11 services from Kevin's list) */}
          <section className="my-10 p-6 bg-cream-dark border border-sand/30 rounded-2xl">
            <h2 className="font-heading text-2xl font-extrabold text-charcoal mb-5">
              Unsere Leistungen rund um die Objektpflege
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {LEISTUNGEN.map((s) => (
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

          {/* Body paragraphs (Kevin text AS IS, split into 2 paragraphs) */}
          <p className="text-base text-charcoal-light mb-5 leading-relaxed">
            Zu unseren Leistungen gehören regelmäßige Objektkontrollen,
            Hausmeisterservice, Treppenhausreinigung, Garten- und
            Grünanlagenpflege, Rasenmähen, Heckenschnitt, Unkrautentfernung,
            Mülltonnenservice, Gehweg- und Hofreinigung, Kleinreparaturen,
            Winterdienst sowie die allgemeine Pflege von Außenanlagen.
          </p>
          <p className="text-base text-charcoal-light mb-5 leading-relaxed">
            Auf Wunsch übernehmen wir auch saisonale Arbeiten wie die
            Dachrinnenreinigung im Herbst, um Verstopfungen, überlaufende
            Dachrinnen und mögliche Wasserschäden frühzeitig zu vermeiden. Durch
            regelmäßige Kontrollen und eine zuverlässige Betreuung stellen wir
            sicher, dass Ihre Immobilie das ganze Jahr über einen gepflegten und
            ordentlichen Eindruck hinterlässt.
          </p>
          <p className="text-base text-charcoal-light mb-5 leading-relaxed">
            Ob einmalige Unterstützung oder langfristige Objektbetreuung — wir
            bieten Ihnen individuelle Lösungen, abgestimmt auf Ihre
            Anforderungen. Rund ums Haus Littawe steht für Zuverlässigkeit,
            saubere Arbeit und persönlichen Service.
          </p>

          {/* Festpreis / Jahresvertrag trust block */}
          <aside className="my-10 p-6 bg-copper/5 border-l-4 border-copper rounded-r-2xl">
            <h2 className="font-heading text-xl font-extrabold text-charcoal mb-3">
              Festpreis oder Jahresvertrag — Sie entscheiden
            </h2>
            <p className="text-charcoal-light leading-relaxed">
              Für jedes Objekt erstellen wir ein individuelles Angebot. Sie
              wählen zwischen einmaligen Einsätzen mit Festpreis oder einer
              laufenden Betreuung als Jahresvertrag — beides ohne versteckte
              Zusatzkosten und mit festem Ansprechpartner.
            </p>
          </aside>

          {/* CTA — Telefon + Email only (per Kevin's WhatsApp request). */}
          {/* Global floating WhatsApp button already exists in layout.tsx. */}
          <section className="my-10">
            <h2 className="font-heading text-2xl font-extrabold text-charcoal mb-3">
              Jetzt Kontakt aufnehmen
            </h2>
            <p className="text-charcoal-light leading-relaxed mb-6">
              Sie benötigen Unterstützung bei der Objektpflege oder suchen einen
              zuverlässigen Hausmeisterservice für Ihre Immobilie? Kontaktieren
              Sie uns gerne für ein unverbindliches Angebot. Wir beraten Sie
              persönlich und finden die passende Lösung für Ihr Objekt.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="tel:+4915239603175"
                className="inline-flex items-center gap-2 px-6 py-3 bg-copper text-white font-semibold rounded-lg hover:bg-copper-dark transition"
              >
                <span aria-hidden="true">📞</span>
                <span>+49 1523 9603175</span>
              </a>
              <a
                href="mailto:kontakt@rundumshaus-littawe.de"
                className="inline-flex items-center gap-2 px-6 py-3 border border-copper text-copper font-semibold rounded-lg hover:bg-copper/5 transition"
              >
                <span aria-hidden="true">✉️</span>
                <span>kontakt@rundumshaus-littawe.de</span>
              </a>
            </div>
          </section>

          {/* Cross-link to Hausmeisterservice (B2C variant) */}
          <section className="mt-12 pt-8 border-t border-sand/30">
            <h2 className="font-heading text-xl font-extrabold text-charcoal mb-3">
              Sie suchen Hausmeisterservice für ein Einfamilienhaus?
            </h2>
            <p className="text-charcoal-light leading-relaxed mb-4">
              Für private Eigentümer und Einzelobjekte haben wir eine eigene
              Übersicht — von Kleinreparaturen bis zur saisonalen Pflege.
            </p>
            <Link
              href="/leistungen/"
              className="inline-flex items-center text-copper hover:underline font-medium"
            >
              Zur Übersicht aller Leistungen →
            </Link>
          </section>

          {/* Footer navigation */}
          <div className="mt-12 pt-8 border-t border-sand/30 text-sm text-charcoal-light">
            <Link href="/leistungen/" className="hover:text-copper">
              ← Alle Leistungen
            </Link>
            <span className="mx-3">·</span>
            <Link href="/einsatzgebiet/" className="hover:text-copper">
              Einsatzgebiet
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
