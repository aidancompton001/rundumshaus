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

// PX-054: Top 30 cities by tier + distance (Kevin's request 2026-06-09).
// All T1 (19) + closest T2 (11) = 30 cities. Osnabrück excluded (own hub).
// Full list of 98 cities accessible via /einsatzgebiet/ CTA below.
const TOP_CITIES = [
  { slug: "belm", label: "Belm" },
  { slug: "georgsmarienhuette", label: "Georgsmarienhütte" },
  { slug: "hasbergen", label: "Hasbergen" },
  { slug: "wallenhorst", label: "Wallenhorst" },
  { slug: "hagen-am-teutoburger-wald", label: "Hagen am Teutoburger Wald" },
  { slug: "lotte", label: "Lotte" },
  { slug: "bissendorf", label: "Bissendorf" },
  { slug: "bad-iburg", label: "Bad Iburg" },
  { slug: "bramsche", label: "Bramsche" },
  { slug: "westerkappeln", label: "Westerkappeln" },
  { slug: "bad-essen", label: "Bad Essen" },
  { slug: "bad-laer", label: "Bad Laer" },
  { slug: "bohmte", label: "Bohmte" },
  { slug: "glandorf", label: "Glandorf" },
  { slug: "bad-rothenfelde", label: "Bad Rothenfelde" },
  { slug: "lengerich", label: "Lengerich" },
  { slug: "melle", label: "Melle" },
  { slug: "ostercappeln", label: "Ostercappeln" },
  { slug: "rieste", label: "Rieste" },
  { slug: "alfhausen", label: "Alfhausen" },
  { slug: "dissen-am-teutoburger-wald", label: "Dissen am Teutoburger Wald" },
  { slug: "recke", label: "Recke" },
  { slug: "tecklenburg", label: "Tecklenburg" },
  { slug: "ankum", label: "Ankum" },
  { slug: "bersenbrueck", label: "Bersenbrück" },
  { slug: "gehrde", label: "Gehrde" },
  { slug: "ibbenbueren", label: "Ibbenbüren" },
  { slug: "ladbergen", label: "Ladbergen" },
  { slug: "mettingen", label: "Mettingen" },
  { slug: "rheine", label: "Rheine" },
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

      {/* PX-058: city section removed per Kevin's request 2026-06-09 22:51.
          Einsatzgebiete now lives as its own page in navigation. */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-charcoal mb-4">
            Einsatzgebiet — Osnabrück und 60-km-Umkreis
          </h2>
          <p className="text-charcoal-light leading-relaxed mb-6 max-w-2xl mx-auto">
            Wir sind in Osnabrück und allen Städten und Gemeinden im
            60-km-Umkreis im Einsatz — von Bramsche bis Münster, von
            Cloppenburg bis Bielefeld.
          </p>
          <Link
            href="/einsatzgebiet/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-copper text-white font-semibold rounded-lg hover:bg-copper-dark transition"
          >
            Alle 98 Einsatzgebiete ansehen
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
