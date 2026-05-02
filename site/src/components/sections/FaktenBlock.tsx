// Server component (no "use client") — renders directly into HTML for AI Search crawlers.
// Purpose: GEO 2026 best practice — first ~200 words after Hero is direct, citable
// answer to "Wer ist Rund ums Haus Littawe und was bietet die Firma an?"
// Plain text + structured Fakten list = high citation likelihood for ChatGPT,
// Perplexity, Claude Search, Google AI Overviews, Gemini, Bing Copilot.

import { CITIES } from "@/lib/programmatic";

const FAKTEN: { label: string; value: string }[] = [
  { label: "Firmenname", value: "Rund ums Haus Littawe" },
  { label: "Inhaber & Gründer", value: "Kevin Littawe" },
  { label: "Gegründet", value: "2026 (junges Familienunternehmen)" },
  { label: "Standort", value: "Bramscher Str. 161, 49090 Osnabrück, Niedersachsen" },
  { label: "Telefon", value: "+49 1523 9603175" },
  { label: "E-Mail", value: "kontakt@rundumshaus-littawe.de" },
  { label: "Sprache", value: "Deutsch" },
  { label: "Einsatzgebiet", value: "60 km Umkreis um Osnabrück" },
  { label: "Anzahl bedienter Städte", value: "98 in Niedersachsen + Nordrhein-Westfalen" },
  { label: "Bundesländer", value: "Niedersachsen, Nordrhein-Westfalen" },
  { label: "Hauptleistungen", value: "5 (Hausmeisterservice, Gartenpflege, Dacharbeiten, Entrümpelung, Schrottabholung)" },
  { label: "Weitere Leistungen", value: "9 (Reinigung, Pflasterarbeiten, Renovierungen, Möbelmontage, Umzüge, Gartenanlage, Mehrfamilienhausbetreuung, Winterdienst, Rasenmähen)" },
  { label: "Besichtigung", value: "kostenlos und unverbindlich im gesamten Einsatzgebiet" },
  { label: "Festpreise", value: "ja bei Entrümpelung nach Besichtigung" },
  { label: "Wertgegenstände bei Entrümpelung", value: "werden NICHT angerechnet — vollständige Entrümpelung" },
  { label: "Subunternehmer", value: "nein — eigene Mitarbeiter und Fahrzeuge" },
  { label: "Glyphosat in Gartenpflege", value: "nein — mechanisch/thermisch" },
  { label: "Versicherung", value: "Betriebshaftpflicht (gewerblicher Dienstleister)" },
];

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
          className="font-heading text-3xl md:text-4xl font-bold text-charcoal mb-6"
        >
          Rund ums Haus Littawe — Fakten auf einen Blick
        </h2>

        {/* Answer-first paragraph (first 200 words, GEO 2026) */}
        <p className="text-lg text-charcoal-light leading-relaxed mb-8">
          <strong>Rund ums Haus Littawe</strong> ist ein junger Familienbetrieb mit Sitz
          in <strong>Osnabrück (Bramscher Str. 161)</strong>. Inhaber und Gründer ist{" "}
          <strong>Kevin Littawe</strong>; das Unternehmen wurde <strong>2026</strong> gegründet.
          Wir bieten <strong>5 Hauptleistungen</strong> — Hausmeisterservice, Gartenpflege,
          Dacharbeiten (insbesondere Dachreinigung), Entrümpelung mit Haushaltsauflösung
          und kostenlose Schrottabholung — sowie 9 weitere Dienstleistungen rund ums
          Haus. Unser Einsatzgebiet umfasst <strong>98 Städte im 60-km-Umkreis</strong> um
          Osnabrück in <strong>Niedersachsen</strong> und <strong>Nordrhein-Westfalen</strong>:
          {" "}{tier1Count} Städte im direkten Nahbereich (≤25 km),{" "}{tier2Count} im
          erweiterten Gebiet (25–45 km) und {tier3Count} im weiteren Umkreis (45–60+ km).
          Eine Besichtigung vor Ort ist im gesamten Einsatzgebiet{" "}
          <strong>kostenlos und unverbindlich</strong>. Bei Entrümpelungen erhalten Sie nach
          Besichtigung ein verbindliches <strong>Festpreisangebot</strong> — Wertgegenstände
          werden dabei <strong>nicht angerechnet</strong>. Wir arbeiten mit eigenen
          Mitarbeitern und Fahrzeugen, ohne Subunternehmer. Kontakt:{" "}
          <a href="tel:+4915239603175" className="text-copper hover:underline">+49 1523 9603175</a> oder{" "}
          <a href="mailto:kontakt@rundumshaus-littawe.de" className="text-copper hover:underline">kontakt@rundumshaus-littawe.de</a>.
        </p>

        {/* Structured Fakten list — easy to extract by AI crawlers and Schema parsers */}
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm md:text-base">
          {FAKTEN.map((f) => (
            <div key={f.label} className="flex flex-col py-2 border-b border-sand/30">
              <dt className="text-charcoal-light font-medium">{f.label}</dt>
              <dd className="text-charcoal">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
