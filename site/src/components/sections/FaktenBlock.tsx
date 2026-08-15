// Server component (no "use client") — renders directly into HTML for AI Search crawlers.
// Purpose: GEO 2026 best practice — first ~200 words after Hero is direct, citable
// answer to "Wer ist Rund ums Haus Littawe und was bietet die Firma an?"
// PX-035 (variant D): homepage shows the answer-first paragraph + 5 key fact
// cards with icons. The full 17-row fact table moved to /ueber-uns.

import { CITIES } from "@/lib/programmatic";

// 5 key "why us" facts — homepage cards. Full table lives on /ueber-uns.
const KEY_FACTS: { icon: "haus" | "pin" | "check" | "preis" | "team"; title: string; text: string }[] = [
  {
    icon: "haus",
    title: "Junges Familienunternehmen",
    text: "Gegründet 2026 in Osnabrück — Inhaber Kevin Littawe.",
  },
  {
    icon: "pin",
    title: "98 Städte Einsatzgebiet",
    text: "60-km-Umkreis um Osnabrück, Niedersachsen & NRW.",
  },
  {
    icon: "check",
    title: "Kostenlose Besichtigung",
    text: "Unverbindlich im gesamten Einsatzgebiet.",
  },
  {
    icon: "preis",
    title: "Faire Festpreise",
    text: "Bei allen Arbeiten nach kostenloser Besichtigung.",
  },
  {
    icon: "team",
    title: "Keine Subunternehmer",
    text: "Eigene Mitarbeiter und eigene Fahrzeuge.",
  },
];

function FaktIcon({ name }: { name: KeyFactIcon }) {
  const common = {
    width: 28,
    height: 28,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "haus":
      return (
        <svg {...common}>
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5 9.5V21h14V9.5" />
          <path d="M9.5 21v-6h5v6" />
        </svg>
      );
    case "pin":
      return (
        <svg {...common}>
          <path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11Z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="m8.5 12 2.5 2.5 4.5-5" />
        </svg>
      );
    case "preis":
      return (
        <svg {...common}>
          <path d="M20.5 13.5 13 21l-9-9V4h8l8.5 8.5a1.4 1.4 0 0 1 0 1Z" />
          <circle cx="8" cy="8" r="1.4" />
        </svg>
      );
    case "team":
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3" />
          <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
          <path d="M16 11a3 3 0 0 0 0-6" />
          <path d="M17.5 20a5.5 5.5 0 0 0-3-4.9" />
        </svg>
      );
  }
}

type KeyFactIcon = (typeof KEY_FACTS)[number]["icon"];

export default function FaktenBlock() {
  const tier1Count = CITIES.filter((c) => c.tier === 1).length;
  const tier2Count = CITIES.filter((c) => c.tier === 2).length;
  const tier3Count = CITIES.filter((c) => c.tier === 3).length;

  return (
    <section
      id="fakten"
      className="py-16 md:py-24 bg-cream"
      aria-labelledby="fakten-heading"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          id="fakten-heading"
          className="font-heading text-3xl md:text-4xl font-extrabold text-charcoal mb-6"
        >
          Rund ums Haus Littawe — auf einen Blick
        </h2>

        {/* Answer-first paragraph (first 200 words, GEO 2026 — kept for AI Search) */}
        <p className="text-lg text-charcoal-light leading-relaxed mb-10">
          <strong>Rund ums Haus Littawe</strong> ist ein junger Familienbetrieb mit Sitz
          in <strong>Osnabrück (Bramscher Str. 161)</strong>. Inhaber und Gründer ist{" "}
          <strong>Kevin Littawe</strong>; das Unternehmen wurde <strong>2026</strong> gegründet.
          Wir bieten <strong>5 Hauptleistungen</strong> — Hausmeisterservice, Gartenpflege,
          Dacharbeiten (insbesondere Dachreinigung), Entrümpelung mit Haushaltsauflösung
          und Garten- und Landschaftsbau — sowie 9 weitere Dienstleistungen rund ums
          Haus. Unser Einsatzgebiet umfasst <strong>98 Städte im 60-km-Umkreis</strong> um
          Osnabrück in <strong>Niedersachsen</strong> und <strong>Nordrhein-Westfalen</strong>:
          {" "}{tier1Count} Städte im direkten Nahbereich (≤25 km),{" "}{tier2Count} im
          erweiterten Gebiet (25–45 km) und {tier3Count} im weiteren Umkreis (45–60+ km).
          Eine Besichtigung vor Ort ist im gesamten Einsatzgebiet{" "}
          <strong>kostenlos und unverbindlich</strong>. Sie erhalten nach Besichtigung ein
          verbindliches <strong>Festpreisangebot</strong> für alle Arbeiten. Wir arbeiten mit
          eigenen Mitarbeitern und Fahrzeugen, ohne Subunternehmer.
        </p>

        {/* 5 key facts as cards with icons (PX-035 variant D) */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {KEY_FACTS.map((f) => (
            <li
              key={f.title}
              className="flex gap-4 p-5 bg-white rounded-2xl border border-sand/40 shadow-sm"
            >
              <span className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-copper/10 text-copper">
                <FaktIcon name={f.icon} />
              </span>
              <div>
                <h3 className="font-heading text-base font-semibold text-charcoal mb-1">
                  {f.title}
                </h3>
                <p className="text-sm text-charcoal-light leading-relaxed">{f.text}</p>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-sm text-charcoal-light">
          Alle Firmendaten und Fakten im Detail finden Sie{" "}
          <a href="/ueber-uns/" className="text-copper font-medium hover:underline">
            auf unserer Über-uns-Seite
          </a>
          .
        </p>
      </div>
    </section>
  );
}
