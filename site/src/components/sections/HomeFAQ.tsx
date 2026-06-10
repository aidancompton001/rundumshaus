// PX-064: Homepage FAQ — Kevin's 4 verbatim questions (WhatsApp 2026-06-09).
// Server component → FAQPage JSON-LD rendered statically.
// Homepage had no FAQPage schema before, so no duplication risk.

const FAQS = [
  {
    q: "Bieten Sie kostenlose Besichtigungen an?",
    a: "Ja, Besichtigungen sind kostenlos und unverbindlich. Dadurch können wir den Aufwand genau einschätzen und ein passendes Angebot erstellen.",
  },
  {
    q: "Wie schnell sind Termine möglich?",
    a: "Je nach Auftragslage sind kurzfristige Termine häufig möglich. Kontaktieren Sie uns gerne telefonisch oder per WhatsApp.",
  },
  {
    q: "Arbeiten Sie auch für Unternehmen und Hausverwaltungen?",
    a: "Ja, wir betreuen Privatkunden, Unternehmen, Vermieter und Hausverwaltungen.",
  },
  {
    q: "Bieten Sie Festpreise an?",
    a: "Viele Leistungen können nach einer Besichtigung zu einem transparenten Festpreis angeboten werden.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function HomeFAQ() {
  return (
    <section className="py-20 md:py-28 bg-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-charcoal mb-10 text-center">
          Häufige Fragen
        </h2>
        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <details
              key={i}
              className="group bg-cream-dark border border-sand/30 rounded-xl p-5"
            >
              <summary className="cursor-pointer font-medium text-charcoal flex justify-between items-center">
                <span>{f.q}</span>
                <span className="ml-4 text-copper transition-transform group-open:rotate-45" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="mt-3 text-charcoal-light leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
