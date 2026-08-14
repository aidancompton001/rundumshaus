// PX-045: Featured HQ-city hub for Osnabrück.
// Kevin reported that the 5 Osnabrück programmatic pages were not
// findable from main navigation — only via /einsatzgebiet/. This page
// fixes that by creating a dedicated, root-level hub at /osnabrueck/
// that funnels brand-query traffic ("Rund ums Haus Littawe Osnabrück")
// into the existing programmatic pages.

import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { getImageUrl, toWebp } from "@/lib/getImageUrl";
import reviewsData from "@/data/reviews.json";

// PX-046 F4+F8: title 91→58 chars, description 191→154 chars
export const metadata = generateSEO({
  title: "Hausmeister & Gartenpflege Osnabrück ★ Familienbetrieb",
  description:
    "Familienbetrieb Bramscher Str. 161: Hausmeister, Garten, Landschaftsbau, Dach, Entrümpelung in Osnabrück. ★ 5,0 aus 8 Bewertungen. ☎ direkt anrufen.",
  path: "/osnabrueck",
});

const BASE_URL = "https://rundumshaus-littawe.de";

const SERVICES = [
  {
    slug: "hausmeisterservice",
    title: "Hausmeisterservice",
    short: "Reparaturen, Wartung, Treppenhaus, Winterdienst.",
  },
  {
    slug: "gartenpflege",
    title: "Gartenpflege",
    short: "Rasen mähen, Hecken schneiden, Beetpflege.",
  },
  {
    slug: "dacharbeiten",
    title: "Dacharbeiten",
    short: "Dachreinigung, Moos- und Algenentfernung, Dachrinnen.",
  },
  {
    slug: "entruempelung",
    title: "Entrümpelung",
    short: "Keller, Dachboden, Haushaltsauflösung — besenrein.",
  },
  {
    slug: "garten-landschaftsbau",
    title: "Garten- und Landschaftsbau",
    short: "Kostenlose Abholung von Altmetall im Stadtgebiet.",
  },
];

const STADTTEILE = [
  "Innenstadt", "Schinkel", "Haste", "Eversburg", "Hellern",
  "Voxtrup", "Sutthausen", "Wüste", "Westerberg", "Atter", "Hafen",
];

const HERO_IMAGE = "/images/locations/osnabrueck-hero.png";

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite", item: `${BASE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Osnabrück", item: `${BASE_URL}/osnabrueck/` },
  ],
};

const placeSchema = {
  "@context": "https://schema.org",
  "@type": "Place",
  "@id": `${BASE_URL}/osnabrueck/#place`,
  name: "Osnabrück",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Osnabrück",
    addressRegion: "Niedersachsen",
    postalCode: "49090",
    addressCountry: "DE",
  },
  containedInPlace: {
    "@type": "AdministrativeArea",
    name: "Niedersachsen",
  },
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Leistungen in Osnabrück",
  itemListElement: SERVICES.map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `${BASE_URL}/leistungen/${s.slug}/osnabrueck/`,
    name: `${s.title} Osnabrück`,
  })),
};

// Show first 3 reviews on hub (real data, not duplicated for SEO spam).
const osnabrueckReviews = reviewsData.reviews
  .filter((r) => r.city === "Osnabrück")
  .slice(0, 3);

export default function OsnabrueckHubPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(placeSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <article className="py-12 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="text-sm text-charcoal-light mb-8">
            <ol className="flex flex-wrap gap-x-2 gap-y-1">
              <li>
                <Link href="/" className="hover:text-copper">Startseite</Link>
                <span className="mx-2">/</span>
              </li>
              <li className="text-charcoal" aria-current="page">Osnabrück</li>
            </ol>
          </nav>

          {/* H1 */}
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-charcoal mb-4">
            Rund ums Haus Littawe — Ihr Familienbetrieb in Osnabrück
          </h1>
          <p className="text-lg text-charcoal-light leading-relaxed mb-8">
            Familienbetrieb von Kevin Littawe in der Bramscher Straße 161.
            Hausmeisterservice, Gartenpflege, Dacharbeiten, Entrümpelung und
            Garten- und Landschaftsbau — direkt vor Ihrer Haustür in Osnabrück
            und im 60-km-Umkreis. Kostenlose Besichtigung, Festpreis nach Aufnahme.
          </p>

          {/* Hero image */}
          <div className="aspect-[16/9] overflow-hidden rounded-2xl mb-10 border border-sand/30">
            <picture>
              <source type="image/webp" srcSet={getImageUrl(toWebp(HERO_IMAGE))} />
              <img
                src={getImageUrl(HERO_IMAGE)}
                alt="Bramscher Straße in Osnabrück — Standort von Rund ums Haus Littawe"
                width={1200}
                height={675}
                className="w-full h-full object-cover"
                loading="eager"
                decoding="async"
              />
            </picture>
          </div>

          {/* E-E-A-T trust block */}
          <aside className="my-10 grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-cream-dark border border-sand/30 rounded-2xl">
            <div>
              <h2 className="font-heading text-base font-semibold text-charcoal mb-2">
                Standort
              </h2>
              <address className="not-italic text-sm text-charcoal-light leading-relaxed">
                Kevin Littawe<br />
                Bramscher Str. 161<br />
                49090 Osnabrück
              </address>
            </div>
            <div>
              <h2 className="font-heading text-base font-semibold text-charcoal mb-2">
                Bewertungen
              </h2>
              <p className="text-sm text-charcoal-light">
                <span className="text-copper font-bold text-xl">★ {reviewsData.aggregateRating.ratingValue.toFixed(1)}</span>
                {" "}aus {reviewsData.aggregateRating.ratingCount} verifizierten Google-Bewertungen
              </p>
            </div>
            <div>
              <h2 className="font-heading text-base font-semibold text-charcoal mb-2">
                Direkt erreichbar
              </h2>
              <p className="text-sm text-charcoal-light leading-relaxed">
                <a href="tel:+4915239603175" className="hover:text-copper block">
                  ☎ +49 1523 9603175
                </a>
                <a href="mailto:kontakt@rundumshaus-littawe.de" className="hover:text-copper block break-all">
                  ✉ kontakt@rundumshaus-littawe.de
                </a>
              </p>
            </div>
          </aside>

          {/* 5 Service cards — links to programmatic city pages */}
          <section className="my-12">
            <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-charcoal mb-6">
              Unsere Leistungen in Osnabrück
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SERVICES.map((s) => (
                <Link
                  key={s.slug}
                  href={`/leistungen/${s.slug}/osnabrueck/`}
                  className="p-5 bg-cream-dark border border-sand/30 rounded-xl hover:border-copper hover:shadow-md transition group"
                >
                  <h3 className="font-heading text-lg font-semibold text-charcoal group-hover:text-copper mb-1">
                    {s.title} Osnabrück
                  </h3>
                  <p className="text-sm text-charcoal-light leading-relaxed mb-3">
                    {s.short}
                  </p>
                  <span className="text-sm text-copper font-medium">
                    Details ansehen →
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* Stadtteile reinforcement */}
          <section className="my-12 p-6 bg-copper/5 border-l-4 border-copper rounded-r-2xl">
            <h2 className="font-heading text-xl font-extrabold text-charcoal mb-3">
              Wir sind in allen Stadtteilen unterwegs
            </h2>
            <p className="text-charcoal-light leading-relaxed mb-3">
              Egal ob Sie in der Innenstadt wohnen oder am Stadtrand — wir
              betreuen private und gewerbliche Objekte in ganz Osnabrück:
            </p>
            <p className="text-sm text-charcoal-light leading-relaxed">
              {STADTTEILE.join(" · ")}
            </p>
          </section>

          {/* Cross-link: B2B Objektpflege */}
          <section className="my-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/leistungen/objektpflege/"
              className="p-6 bg-cream-dark border border-sand/30 rounded-2xl hover:border-copper hover:shadow-md transition group"
            >
              <h3 className="font-heading text-lg font-semibold text-charcoal group-hover:text-copper mb-2">
                Für Hausverwaltungen & WEGs in Osnabrück
              </h3>
              <p className="text-sm text-charcoal-light leading-relaxed mb-3">
                Objektpflege als Jahresvertrag oder einmalig — Mehrfamilienhäuser,
                Wohnanlagen, Gewerbeobjekte.
              </p>
              <span className="text-sm text-copper font-medium">
                Zur Objektpflege-Seite →
              </span>
            </Link>
            <Link
              href="/leistungen/rasen-neuanlage/"
              className="p-6 bg-cream-dark border border-sand/30 rounded-2xl hover:border-copper hover:shadow-md transition group"
            >
              <h3 className="font-heading text-lg font-semibold text-charcoal group-hover:text-copper mb-2">
                Spezial: Rasen neu anlegen
              </h3>
              <p className="text-sm text-charcoal-light leading-relaxed mb-3">
                Alten Rasen entfernen, Boden vorbereiten, Rasensaat oder
                Rollrasen — in Osnabrück und Umgebung.
              </p>
              <span className="text-sm text-copper font-medium">
                Zur Rasen-Neuanlage-Seite →
              </span>
            </Link>
          </section>

          {/* 3 visible reviews from Osnabrück */}
          {osnabrueckReviews.length > 0 && (
            <section className="my-12">
              <h2 className="font-heading text-2xl font-extrabold text-charcoal mb-6">
                Was Kunden aus Osnabrück sagen
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {osnabrueckReviews.map((r) => (
                  <div
                    key={r.id}
                    className="p-5 bg-cream-dark border border-sand/30 rounded-xl"
                  >
                    <div className="text-copper text-base mb-2">★★★★★</div>
                    <p className="text-sm text-charcoal-light leading-relaxed mb-3">
                      „{r.text}&ldquo;
                    </p>
                    <p className="text-xs text-charcoal font-medium">
                      — {r.author}
                      {r.service && <span className="text-charcoal-light"> · {r.service}</span>}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CTA */}
          <section className="my-12 p-8 bg-charcoal text-cream rounded-2xl text-center">
            <h2 className="font-heading text-2xl md:text-3xl font-extrabold mb-3">
              Jetzt unverbindlich anfragen
            </h2>
            <p className="text-cream/80 mb-6 leading-relaxed max-w-2xl mx-auto">
              Kostenlose Besichtigung vor Ort in Osnabrück, Festpreis nach Aufnahme.
              Anruf, WhatsApp oder E-Mail — wir melden uns schnellstmöglich zurück.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="tel:+4915239603175"
                className="inline-flex items-center gap-2 px-6 py-3 bg-copper text-white font-semibold rounded-lg hover:bg-copper-dark transition"
              >
                <span aria-hidden="true">☎</span>
                <span>+49 1523 9603175</span>
              </a>
              <a
                href="mailto:kontakt@rundumshaus-littawe.de"
                className="inline-flex items-center gap-2 px-6 py-3 border border-copper text-copper font-semibold rounded-lg hover:bg-copper/10 transition"
              >
                <span aria-hidden="true">✉</span>
                <span>E-Mail schreiben</span>
              </a>
            </div>
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
            <span className="mx-3">·</span>
            <Link href="/referenzen/" className="hover:text-copper">
              Referenzen
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
