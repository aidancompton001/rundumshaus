// PX-059: Extra Dienstleistungen section — Kevin's request 2026-06-09 22:51.
// Rendered immediately after the 5 main service cards on /leistungen/.

import Link from "next/link";

const EXTRA_LEISTUNGEN = [
  {
    href: "/leistungen/objektpflege/",
    title: "Objektpflege für Hausverwaltungen & WEGs",
    desc: "B2B-Komplettpaket: Hausmeister, Garten, Treppenhaus, Mülltonnen, Winterdienst. Festpreis oder Jahresvertrag.",
    cta: "Zur B2B-Seite →",
  },
  {
    href: "/leistungen/rasen-neuanlage/",
    title: "Rasen neu anlegen",
    desc: "Kompletter Rasenneuaufbau — alten Rasen entfernen, Boden vorbereiten, Rasensaat oder Rollrasen.",
    cta: "Zur Rasen-Seite →",
  },
];

export default function SpezialthemenSection() {
  return (
    <section className="py-12 md:py-16 bg-cream-dark border-y border-sand/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-charcoal mb-2">
          Weitere Spezialleistungen
        </h2>
        <p className="text-charcoal-light leading-relaxed mb-6">
          Für besondere Themen haben wir eigene Übersichtsseiten mit
          allen Details.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {EXTRA_LEISTUNGEN.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="p-6 bg-cream border border-sand/30 rounded-2xl hover:border-copper hover:shadow-md transition group"
            >
              <h3 className="font-heading text-xl font-extrabold text-charcoal group-hover:text-copper mb-2">
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
  );
}
