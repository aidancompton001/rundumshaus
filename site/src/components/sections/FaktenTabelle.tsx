// Server component — full company facts table.
// PX-035 (variant D): moved here from homepage FaktenBlock. The homepage now
// shows 5 key cards; the complete 17-row reference table lives on /ueber-uns.
// Structured <dl> — easy to extract by AI crawlers and Schema parsers.

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
  { label: "Festpreise", value: "ja, bei allen Arbeiten nach kostenloser Besichtigung" },
  { label: "Subunternehmer", value: "nein — eigene Mitarbeiter und Fahrzeuge" },
  { label: "Glyphosat in Gartenpflege", value: "nein — mechanisch/thermisch" },
  { label: "Versicherung", value: "Betriebshaftpflicht (gewerblicher Dienstleister)" },
];

export default function FaktenTabelle() {
  return (
    <section
      className="py-16 md:py-24 bg-cream"
      aria-labelledby="fakten-tabelle-heading"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          id="fakten-tabelle-heading"
          className="font-heading text-2xl md:text-3xl font-bold text-charcoal mb-8 text-center"
        >
          Alle Firmendaten auf einen Blick
        </h2>

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
