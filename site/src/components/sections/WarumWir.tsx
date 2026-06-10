"use client";

import { ScrollReveal, Stagger } from "@/components/motion";

// PX-064: 8 ✓ checkmarks per Kevin's verbatim Startseite text (WhatsApp 2026-06-09).
// Replaced the 5 varied icons with uniform ✓ to match the rest of the new design.
const reasons: string[] = [
  "Schnelle Terminvergabe",
  "Kostenlose und unverbindliche Besichtigung",
  "Faire und transparente Preise",
  "Zuverlässige und saubere Ausführung",
  "Persönlicher Ansprechpartner",
  "Viele Dienstleistungen aus einer Hand",
  "Für Privat- und Gewerbekunden",
  "Tätig in Osnabrück und Umgebung",
];

export default function WarumWir() {
  return (
    <section className="py-20 md:py-28 bg-charcoal text-cream">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-14">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Warum Rund ums Haus Littawe?
          </h2>
          <p className="text-cream/70 text-lg max-w-2xl mx-auto">
            Was uns von anderen unterscheidet — und warum unsere Kunden uns
            weiterempfehlen.
          </p>
        </ScrollReveal>

        <Stagger
          staggerDelay={80}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {reasons.map((reason) => (
            <div
              key={reason}
              className="flex items-center gap-4 bg-charcoal-light/30 border border-cream/10 rounded-xl px-6 py-5 transition-colors hover:border-gold/40"
            >
              <span
                className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-gold/15 text-gold"
                aria-hidden="true"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="font-body text-base font-medium">{reason}</span>
            </div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
