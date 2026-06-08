// PX-045b: fix blindspots remaining after Osnabrück hub.
// Two issues this section solves:
// 1. The 485 programmatic city pages (7 target cities × ~5 services
//    each, excluding the Osnabrück hub) were only findable via
//    /einsatzgebiet/. Now they get direct entry points from the
//    main /leistungen/ page.
// 2. The two sub-page hubs (Rasen-Neuanlage, Objektpflege) only had
//    subPage CTAs hidden inside other service cards. Now they have
//    dedicated featured cards on /leistungen/.

import Link from "next/link";

const SERVICES = [
  { slug: "hausmeisterservice", label: "Hausmeister" },
  { slug: "gartenpflege", label: "Garten" },
  { slug: "dacharbeiten", label: "Dach" },
  { slug: "entruempelung", label: "Entrümpelung" },
  { slug: "schrottabholung", label: "Schrott" },
];

// Top cities (the 7 in TARGET_CITIES). Osnabrück gets its dedicated
// hub link instead of city-service grid (avoids visual duplication).
const TOP_CITIES = [
  { slug: "bramsche", label: "Bramsche" },
  { slug: "wallenhorst", label: "Wallenhorst" },
  { slug: "belm", label: "Belm" },
  { slug: "bissendorf", label: "Bissendorf" },
  { slug: "georgsmarienhuette", label: "Georgsmarienhütte" },
  { slug: "melle", label: "Melle" },
];

const SPEZIAL = [
  {
    href: "/leistungen/objektpflege/",
    title: "Objektpflege für Hausverwaltungen & WEGs",
    desc: "B2B-Komplettpaket: Hausmeister, Garten, Treppenhaus, Mülltonnen, Winterdienst. Festpreis oder Jahresvertrag.",
    cta: "Zur B2B-Seite →",
  },
  {
    href: "/leistungen/rasen-neuanlage/",
    title: "Spezial: Rasen neu anlegen",
    desc: "Kompletter Rasenneuaufbau — alten Rasen entfernen, Boden vorbereiten, Rasensaat oder Rollrasen.",
    cta: "Zur Rasen-Seite →",
  },
];

export default function LeistungenInStaedten() {
  return (
    <>
      {/* Spezialthemen — dedicated landing pages */}
      <section className="py-16 md:py-20 bg-cream-dark border-y border-sand/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-charcoal mb-2">
            Spezialthemen
          </h2>
          <p className="text-charcoal-light leading-relaxed mb-6">
            Für besondere Themen haben wir eigene Übersichtsseiten mit
            allen Details.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {SPEZIAL.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="p-6 bg-cream border border-sand/30 rounded-2xl hover:border-copper hover:shadow-md transition group"
              >
                <h3 className="font-heading text-xl font-semibold text-charcoal group-hover:text-copper mb-2">
                  {s.title}
                </h3>
                <p className="text-charcoal-light leading-relaxed mb-3">
                  {s.desc}
                </p>
                <span className="text-copper font-medium">{s.cta}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top cities — links to programmatic city pages */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-charcoal mb-2">
            Leistungen direkt in Ihrer Stadt
          </h2>
          <p className="text-charcoal-light leading-relaxed mb-6">
            Wir sind regelmäßig in Osnabrück und im 60-km-Umkreis unterwegs.
            Wählen Sie Ihre Stadt für lokale Details, Anfahrtszeit und
            Festpreis-Beispiele.
          </p>

          {/* Osnabrück hub — featured */}
          <Link
            href="/osnabrueck/"
            className="block mb-6 p-5 bg-copper/5 border-l-4 border-copper rounded-r-xl hover:bg-copper/10 transition group"
          >
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="font-heading text-lg font-semibold text-charcoal group-hover:text-copper">
                  Standort Osnabrück — alle Leistungen
                </h3>
                <p className="text-sm text-charcoal-light mt-1">
                  Familienbetrieb · Bramscher Str. 161 · alle 5 Leistungen plus
                  Stadtteil-Übersicht
                </p>
              </div>
              <span className="text-copper font-medium">Zur Osnabrück-Seite →</span>
            </div>
          </Link>

          {/* Other 6 top cities — grid */}
          <div className="space-y-4">
            {TOP_CITIES.map((city) => (
              <div
                key={city.slug}
                className="p-4 bg-cream-dark border border-sand/30 rounded-xl"
              >
                <h3 className="font-heading text-base font-semibold text-charcoal mb-2">
                  {city.label}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {SERVICES.map((s) => (
                    <Link
                      key={`${city.slug}-${s.slug}`}
                      href={`/leistungen/${s.slug}/${city.slug}/`}
                      className="inline-flex items-center px-3 py-1.5 text-sm bg-cream border border-sand/40 rounded-full text-charcoal hover:border-copper hover:text-copper transition"
                    >
                      {s.label} {city.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-sm text-charcoal-light">
            Ihre Stadt nicht dabei? Im{" "}
            <Link href="/einsatzgebiet/" className="text-copper hover:underline">
              Einsatzgebiet
            </Link>{" "}
            findest du alle 98 Städte im 60-km-Umkreis.
          </div>
        </div>
      </section>
    </>
  );
}
