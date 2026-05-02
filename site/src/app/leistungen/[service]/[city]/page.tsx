import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  generatePageContent,
  getAllPagePairs,
  SERVICE_IDS,
  type ServiceId,
} from "@/lib/programmatic";
import { generateSEO } from "@/lib/seo";

export const dynamicParams = false;

export async function generateStaticParams() {
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
  try {
    const content = generatePageContent(service, city);
    return generateSEO({
      title: content.metaTitle.replace(" | Rund ums Haus Littawe", ""),
      description: content.metaDescription,
      path: `/leistungen/${service}/${city}`,
    });
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

  let content;
  try {
    content = generatePageContent(service, city);
  } catch {
    notFound();
  }

  const { h1, intro, body, faqs, fakten, neighbors, service: svc } = content;
  const cityName = content.city.displayName;
  const canonical = `${BASE_URL}/leistungen/${service}/${city}`;

  // Schema.org with @id reference to avoid N+1 LocalBusiness pollution (Landa M4 fix).
  // Service references the single LocalBusiness defined on the homepage layout.
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: `${BASE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Leistungen", item: `${BASE_URL}/leistungen` },
      { "@type": "ListItem", position: 3, name: svc.title, item: `${BASE_URL}/leistungen#${service}` },
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

          {/* Cross-links to symmetric neighbors */}
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
