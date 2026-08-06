// PX-045: Featured Standort Osnabrück section on homepage.
// Funnels brand-query traffic into the /osnabrueck/ hub and its 5
// programmatic city pages, which were previously findable only via
// /einsatzgebiet/.

import Link from "next/link";

const SERVICES = [
  { slug: "hausmeisterservice", title: "Hausmeister" },
  { slug: "gartenpflege", title: "Gartenpflege" },
  { slug: "dacharbeiten", title: "Dacharbeiten" },
  { slug: "entruempelung", title: "Entrümpelung" },
  { slug: "garten-landschaftsbau", title: "Garten- und Landschaftsbau" },
];

export default function StandortOsnabrueck() {
  return (
    <section className="py-16 md:py-20 bg-cream-dark border-y border-sand/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-sm text-copper font-semibold uppercase tracking-wide mb-3">
              Familienbetrieb aus Osnabrück
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-charcoal mb-4">
              Direkt in Osnabrück und im 60-km-Umkreis
            </h2>
            <p className="text-charcoal-light leading-relaxed mb-6">
              Unser Standort: Bramscher Str. 161, 49090 Osnabrück. Wir betreuen
              private Haushalte, Hausverwaltungen und Gewerbeobjekte in allen
              Stadtteilen — von der Innenstadt bis zum Stadtrand.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {SERVICES.map((s) => (
                <Link
                  key={s.slug}
                  href={`/leistungen/${s.slug}/osnabrueck/`}
                  className="inline-flex items-center px-3 py-1.5 text-sm bg-cream border border-sand/40 rounded-full text-charcoal hover:border-copper hover:text-copper transition"
                >
                  {s.title} Osnabrück
                </Link>
              ))}
            </div>
            <Link
              href="/osnabrueck/"
              className="inline-flex items-center gap-2 px-5 py-3 bg-copper text-white font-semibold rounded-lg hover:bg-copper-dark transition"
            >
              Alle Leistungen in Osnabrück ansehen
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-sand/30 shadow-md">
            <picture>
              <source
                type="image/webp"
                srcSet="/images/locations/osnabrueck-hero.webp"
              />
              <img
                src="/images/locations/osnabrueck-hero.png"
                alt="Osnabrück Altstadt — Standort von Rund ums Haus Littawe"
                width={1200}
                height={900}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </picture>
          </div>
        </div>
      </div>
    </section>
  );
}
