import Link from "next/link";
import ratgeberData from "@/data/ratgeber.json";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Ratgeber — Gartenpflege, Entrümpelung, Hausmeisterservice in Osnabrück",
  description:
    "Praxis-Guides aus erster Hand: Hecke schneiden in NDS/NRW, Entrümpelungskosten, Dachreinigung, Winterdienst-Pflichten, Haushaltsauflösung. Aktuell und regional für Osnabrück und 60 km Umkreis.",
  path: "/ratgeber",
});

interface Article {
  slug: string;
  title: string;
  metaDescription: string;
  category: string;
  publishedDate: string;
  readingTimeMinutes: number;
}

export default function RatgeberIndex() {
  const articles = ratgeberData.articles as Article[];

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Ratgeber Rund ums Haus",
    description:
      "Praxis-Guides zu Gartenpflege, Entrümpelung, Hausmeisterservice, Dacharbeiten und Schrottabholung.",
    publisher: { "@id": "https://rundumshaus-littawe.de/#localbusiness" },
    hasPart: articles.map((a) => ({
      "@type": "Article",
      headline: a.title,
      url: `https://rundumshaus-littawe.de/ratgeber/${a.slug}/`,
      datePublished: a.publishedDate,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-charcoal mb-4">
            Ratgeber
          </h1>
          <p className="text-lg text-charcoal-light mb-12 max-w-3xl">
            Praxiswissen rund ums Haus — geschrieben für Eigentümer, Vermieter und
            Mieter im Raum Osnabrück, im Münsterland und in Ostwestfalen. Aktuell,
            regional und ohne Marketing-Geschwafel.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((a) => (
              <Link
                key={a.slug}
                href={`/ratgeber/${a.slug}/`}
                className="group flex flex-col bg-cream-dark border border-sand/30 rounded-2xl overflow-hidden hover:border-copper hover:shadow-lg transition-all"
              >
                <div className="p-6 flex-1 flex flex-col">
                  <span className="text-xs font-medium text-copper uppercase tracking-wide mb-2">
                    {a.category}
                  </span>
                  <h2 className="font-heading text-lg font-semibold text-charcoal mb-3 leading-tight group-hover:text-copper transition-colors">
                    {a.title}
                  </h2>
                  <p className="text-sm text-charcoal-light leading-relaxed mb-4 flex-1">
                    {a.metaDescription}
                  </p>
                  <div className="text-xs text-charcoal-light/70 mt-auto">
                    {a.readingTimeMinutes} Min. Lesezeit · {a.publishedDate}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
