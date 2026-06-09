import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  generatePageContent,
  getAllPagePairs,
  getCityBySlug,
  getNeighborCities,
  getServiceMeta,
  isNoindexPair,
  SERVICE_IDS,
  type ServiceId,
} from "@/lib/programmatic";
import { generateSEO } from "@/lib/seo";
import { getGartenContent } from "@/lib/template-content";
import { getHausmeisterContent } from "@/lib/template-content-hausmeister";
import GartenCityTemplate from "@/components/templates/GartenCityTemplate";
import HausmeisterCityTemplate from "@/components/templates/HausmeisterCityTemplate";

export const dynamicParams = false;

export async function generateStaticParams() {
  // PX-047 Phase 1: filter removed — gartenpflege/osnabrueck now handled by
  // dynamic route via GartenCityTemplate component. Static override deleted.
  return getAllPagePairs().map((p) => ({ service: p.service, city: p.city }));
}

interface PageParams {
  service: string;
  city: string;
}

function isServiceId(s: string): s is ServiceId {
  return (SERVICE_IDS as readonly string[]).includes(s);
}

const BASE_URL = "https://rundumshaus-littawe.de";
const LOCAL_BUSINESS_ID = `${BASE_URL}/#localbusiness`;

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { service, city } = await params;
  if (!isServiceId(service)) return {};

  // PX-047/048: gartenpflege + hausmeisterservice use dedicated template content
  // (single source per service). All other services continue with programmatic.
  if (service === "gartenpflege") {
    const cityData = getCityBySlug(city);
    if (!cityData) return {};
    const content = getGartenContent(cityData);
    const seo = generateSEO({
      title: content.metaTitle,
      description: content.metaDescription,
      path: `/leistungen/${service}/${city}`,
    });
    if (isNoindexPair(service, city)) {
      return { ...seo, robots: { index: false, follow: true } };
    }
    return seo;
  }
  if (service === "hausmeisterservice") {
    const cityData = getCityBySlug(city);
    if (!cityData) return {};
    const content = getHausmeisterContent(cityData);
    const seo = generateSEO({
      title: content.metaTitle,
      description: content.metaDescription,
      path: `/leistungen/${service}/${city}`,
    });
    if (isNoindexPair(service, city)) {
      return { ...seo, robots: { index: false, follow: true } };
    }
    return seo;
  }

  try {
    const content = generatePageContent(service, city);
    const seo = generateSEO({
      title: content.metaTitle.replace(" | Rund ums Haus Littawe", ""),
      description: content.metaDescription,
      path: `/leistungen/${service}/${city}`,
    });
    // PX-033 Phase B.3: noindex bottom-5 thin pages to concentrate crawl budget
    if (isNoindexPair(service, city)) {
      return { ...seo, robots: { index: false, follow: true } };
    }
    return seo;
  } catch {
    return {};
  }
}

export default async function ProgrammaticLandingPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { service, city } = await params;
  if (!isServiceId(service)) notFound();

  // PX-047 Phase 1: gartenpflege uses dedicated GartenCityTemplate.
  // Schema (BreadcrumbList + Service + FAQPage) owned by route, not template.
  if (service === "gartenpflege") {
    const cityData = getCityBySlug(city);
    if (!cityData) notFound();
    const neighbors = getNeighborCities(cityData);
    const gartenContent = getGartenContent(cityData);
    const canonical = `${BASE_URL}/leistungen/gartenpflege/${city}/`;

    const gartenBreadcrumb = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: `${BASE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Leistungen", item: `${BASE_URL}/leistungen/` },
        { "@type": "ListItem", position: 3, name: "Gartenpflege", item: `${BASE_URL}/leistungen/#gartenpflege` },
        { "@type": "ListItem", position: 4, name: cityData.displayName, item: canonical },
      ],
    };

    const gartenService: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `Gärtner & Gartenpflege ${cityData.displayName}`,
      serviceType: "Gartenpflege",
      description: gartenContent.metaDescription,
      areaServed: {
        "@type": "City",
        name: cityData.displayName,
        address: {
          "@type": "PostalAddress",
          addressLocality: cityData.displayName,
          addressRegion: cityData.bundesland,
          addressCountry: "DE",
        },
      },
      url: canonical,
    };
    // Schema provider:@id only for cities within ~40km — avoid misleading
    // local presence claim for distant cities (per Playbook architectural rule).
    if (cityData.distanceKm <= 40) {
      gartenService.provider = { "@id": LOCAL_BUSINESS_ID };
    }

    const gartenFaqs = [
      { q: `Was kostet ein Gärtner in ${cityData.displayName}?`, a: "Die Kosten hängen vom Umfang der Arbeiten und der Größe des Grundstücks ab. Nach einer kostenlosen Besichtigung erstellen wir Ihnen gerne ein individuelles Angebot." },
      { q: "Bieten Sie regelmäßige Gartenpflege an?", a: "Ja, wir übernehmen sowohl einmalige Gartenarbeiten als auch regelmäßige Pflegeeinsätze." },
      { q: "Pflegen Sie auch Gewerbegrundstücke?", a: "Ja, wir betreuen Firmengelände, Wohnanlagen, Gewerbeobjekte und größere Außenanlagen." },
      { q: "Wie schnell sind Termine möglich?", a: "Kurzfristige Termine sind je nach Auslastung häufig möglich." },
      { q: "Entsorgen Sie Gartenabfälle?", a: "Ja, auf Wunsch übernehmen wir die fachgerechte Entsorgung von Gartenabfällen und Grünschnitt." },
      { q: "Arbeiten Sie auch für Hausverwaltungen?", a: "Ja, wir betreuen Hausverwaltungen, Vermieter und Wohnanlagen." },
    ];
    const gartenFaqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: gartenFaqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    };

    return (
      <>
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(gartenBreadcrumb) }} />
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(gartenService) }} />
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(gartenFaqSchema) }} />
        <GartenCityTemplate city={cityData} neighbors={neighbors} />
      </>
    );
  }

  // PX-048 Phase 2: hausmeisterservice uses dedicated HausmeisterCityTemplate.
  if (service === "hausmeisterservice") {
    const cityData = getCityBySlug(city);
    if (!cityData) notFound();
    const neighbors = getNeighborCities(cityData);
    const hmContent = getHausmeisterContent(cityData);
    const canonical = `${BASE_URL}/leistungen/hausmeisterservice/${city}/`;

    const hmBreadcrumb = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: `${BASE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Leistungen", item: `${BASE_URL}/leistungen/` },
        { "@type": "ListItem", position: 3, name: "Hausmeisterservice", item: `${BASE_URL}/leistungen/#hausmeisterservice` },
        { "@type": "ListItem", position: 4, name: cityData.displayName, item: canonical },
      ],
    };

    const hmService: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `Hausmeisterservice ${cityData.displayName}`,
      serviceType: "Hausmeisterservice",
      description: hmContent.metaDescription,
      areaServed: {
        "@type": "City",
        name: cityData.displayName,
        address: {
          "@type": "PostalAddress",
          addressLocality: cityData.displayName,
          addressRegion: cityData.bundesland,
          addressCountry: "DE",
        },
      },
      url: canonical,
    };
    if (cityData.distanceKm <= 40) {
      hmService.provider = { "@id": LOCAL_BUSINESS_ID };
    }

    const hmFaqs = [
      { q: `Was kostet ein Hausmeisterservice in ${cityData.displayName}?`, a: "Die Kosten hängen vom Umfang der Leistungen und der Größe des Objekts ab. Nach einer kostenlosen Besichtigung erstellen wir Ihnen gerne ein individuelles Angebot zum Festpreis." },
      { q: "Bieten Sie regelmäßige Betreuung an?", a: "Ja, wir übernehmen sowohl einmalige Hausmeisterleistungen als auch laufende Betreuungsverträge für Privatkunden, Wohnanlagen und Gewerbeobjekte." },
      { q: "Arbeiten Sie auch für Hausverwaltungen?", a: "Ja, wir betreuen Hausverwaltungen, Vermieter, Eigentümergemeinschaften und Unternehmen mit festen Ansprechpartnern." },
      { q: "Übernehmen Sie auch Kleinreparaturen?", a: "Ja, kleinere Reparaturen, Austausch defekter Leuchtmittel und vergleichbare Hausmeisteraufgaben gehören zum Standard unseres Hausmeisterservice." },
      { q: "Bieten Sie Winterdienst an?", a: "Ja, Winterdienst gehört zu unserem Leistungsumfang. Sprechen Sie uns frühzeitig an, um Ihr Objekt zuverlässig betreuen zu können." },
      { q: "Wie schnell sind Termine möglich?", a: "Kurzfristige Termine sind je nach Auslastung häufig möglich. Kontaktieren Sie uns gerne telefonisch oder per WhatsApp." },
    ];
    const hmFaqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: hmFaqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    };

    return (
      <>
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(hmBreadcrumb) }} />
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(hmService) }} />
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(hmFaqSchema) }} />
        <HausmeisterCityTemplate city={cityData} neighbors={neighbors} />
      </>
    );
  }

  let content;
  try {
    content = generatePageContent(service, city);
  } catch {
    notFound();
  }

  const { h1, intro, body, faqs, fakten, neighbors, service: svc, boost } = content;
  const cityName = content.city.displayName;
  const canonical = `${BASE_URL}/leistungen/${service}/${city}/`;

  // Schema.org with @id reference to avoid N+1 LocalBusiness pollution (Landa M4 fix).
  // Service references the single LocalBusiness defined on the homepage layout.
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: `${BASE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Leistungen", item: `${BASE_URL}/leistungen/` },
      { "@type": "ListItem", position: 3, name: svc.title, item: `${BASE_URL}/leistungen/#${service}` },
      { "@type": "ListItem", position: 4, name: cityName, item: canonical },
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${svc.title} ${cityName}`,
    serviceType: svc.title,
    description: content.metaDescription,
    provider: { "@id": LOCAL_BUSINESS_ID },
    areaServed: {
      "@type": "City",
      name: cityName,
      address: {
        "@type": "PostalAddress",
        addressLocality: cityName,
        addressRegion: content.city.bundesland,
        addressCountry: "DE",
      },
    },
    url: canonical,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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
                <Link href="/leistungen" className="hover:text-copper">Leistungen</Link>
                <span className="mx-2">/</span>
              </li>
              <li>
                <Link href={`/leistungen#${service}`} className="hover:text-copper">{svc.title}</Link>
                <span className="mx-2">/</span>
              </li>
              <li className="text-charcoal" aria-current="page">{cityName}</li>
            </ol>
          </nav>

          {/* H1 */}
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-charcoal mb-6">
            {h1}
          </h1>

          {/* Answer-first intro (GEO 2026: first 200 words = direct answer for AI Search) */}
          <p className="text-lg text-charcoal-light mb-8 leading-relaxed">
            {intro}
          </p>

          {/* Lokale Fakten — city-specific structured data (40% unique content per Google E-E-A-T 2026) */}
          <aside
            className="my-10 p-6 bg-cream-dark border border-sand/30 rounded-2xl"
            aria-label={`Fakten zu ${svc.title} in ${cityName}`}
          >
            <h2 className="font-heading text-xl font-semibold text-charcoal mb-4">
              {svc.title} in {cityName} — auf einen Blick
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {fakten.map((f) => (
                <div key={f.label} className="flex flex-col">
                  <dt className="text-charcoal-light font-medium">{f.label}</dt>
                  <dd className="text-charcoal">{f.value}</dd>
                </div>
              ))}
            </dl>
          </aside>

          {/* Body paragraphs (tier-scaled: T1=5 / T2=3 / T3=2) */}
          {body.map((paragraph, i) => (
            <p key={i} className="text-base text-charcoal-light mb-5 leading-relaxed">
              {paragraph}
            </p>
          ))}

          {/* PX-033 Phase B.1: city-specific boost block — Festpreis + Anfahrt + Lokal */}
          {boost && (
            <aside className="my-10 p-6 bg-copper/5 border-l-4 border-copper rounded-r-2xl">
              <h2 className="font-heading text-xl font-semibold text-charcoal mb-4">
                Konkret für {cityName}
              </h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm mb-4">
                <div className="flex flex-col">
                  <dt className="text-charcoal-light font-medium">Anfahrt von Osnabrück (HQ)</dt>
                  <dd className="text-charcoal">ca. {boost.anfahrtMin} Min.</dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-charcoal-light font-medium">Beispiel-Festpreis</dt>
                  <dd className="text-charcoal">{boost.festpreisBeispiel}</dd>
                </div>
              </dl>
              <p className="text-charcoal-light leading-relaxed">{boost.lokal}</p>
            </aside>
          )}

          {/* CTA */}
          <div className="my-10 flex flex-wrap gap-4">
            <Link
              href="/kontakt"
              className="inline-flex items-center justify-center px-6 py-3 bg-copper text-white font-semibold rounded-lg hover:bg-copper-dark transition"
            >
              Kostenlose Besichtigung in {cityName} anfragen
            </Link>
            <a
              href="tel:+4915239603175"
              className="inline-flex items-center justify-center px-6 py-3 border border-copper text-copper font-semibold rounded-lg hover:bg-copper/5 transition"
            >
              +49 1523 9603175
            </a>
          </div>

          {/* FAQ (rotated from pool 10-12, tier-scaled count) */}
          {faqs.length > 0 && (
            <section className="mt-12">
              <h2 className="font-heading text-2xl md:text-3xl font-semibold text-charcoal mb-6">
                Häufige Fragen — {svc.title} in {cityName}
              </h2>
              <div className="space-y-3">
                {faqs.map((f, i) => (
                  <details
                    key={i}
                    className="group bg-cream-dark border border-sand/30 rounded-xl p-4"
                  >
                    <summary className="cursor-pointer font-medium text-charcoal flex justify-between items-center">
                      <span>{f.q}</span>
                      <span className="ml-4 text-copper transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-3 text-charcoal-light leading-relaxed">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Cross-links to symmetric neighbors (same service, neighbor cities) */}
          {neighbors.length > 0 && (
            <section className="mt-12 pt-8 border-t border-sand/30">
              <h2 className="font-heading text-xl font-semibold text-charcoal mb-4">
                {svc.title} auch in der Nähe
              </h2>
              <div className="flex flex-wrap gap-3">
                {neighbors.map((n) => (
                  <Link
                    key={n.slug}
                    href={`/leistungen/${service}/${n.slug}/`}
                    className="px-4 py-2 bg-cream-dark border border-sand/30 rounded-lg text-charcoal hover:border-copper hover:text-copper transition"
                  >
                    {svc.title} {n.displayName}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Vertical cross-links: same city, other services (PX-032 indexation acceleration) */}
          <section className="mt-12 pt-8 border-t border-sand/30">
            <h2 className="font-heading text-xl font-semibold text-charcoal mb-4">
              Weitere Leistungen in {cityName}
            </h2>
            <div className="flex flex-wrap gap-3">
              {SERVICE_IDS.filter((id) => id !== service).map((otherId) => {
                const other = getServiceMeta(otherId);
                return (
                  <Link
                    key={otherId}
                    href={`/leistungen/${otherId}/${city}/`}
                    className="px-4 py-2 bg-cream-dark border border-sand/30 rounded-lg text-charcoal hover:border-copper hover:text-copper transition"
                  >
                    {other.title} {cityName}
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Footer navigation */}
          <div className="mt-12 pt-8 border-t border-sand/30 text-sm text-charcoal-light">
            <Link href="/leistungen" className="hover:text-copper">
              ← Alle Leistungen
            </Link>
            <span className="mx-3">·</span>
            <Link href="/einsatzgebiet" className="hover:text-copper">
              Vollständiges Einsatzgebiet (98 Städte)
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
