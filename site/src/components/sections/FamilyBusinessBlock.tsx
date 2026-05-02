// Server component — renders directly into HTML (no "use client").
// Used on /ueber-uns. Single canonical "Familienbetrieb seit 2026" mention
// outside of homepage's FaktenBlock. Hans Landa Round 4: only ONE 2026
// mention on homepage (FaktenBlock), all detail moves here to avoid
// repetition fatigue and conversion drop signals on high-trust services.
//
// IMPORTANT: No personal photo of Kevin (he declined 2026-05-02). Brand
// logo + text accent only. Family-Business framing stresses persönlicher
// Kontakt + faire Festpreise + frische Motivation as differentiation.

import Link from "next/link";
import { getImageUrl } from "@/lib/getImageUrl";

export default function FamilyBusinessBlock() {
  return (
    <section className="py-16 md:py-24 bg-cream-dark" aria-labelledby="family-heading">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8 flex justify-center">
          <img
            src={getImageUrl("/images/branding/logo-full.svg")}
            alt="Rund ums Haus Littawe Logo"
            width={200}
            height={160}
            className="object-contain w-32 h-32 md:w-40 md:h-40"
            loading="lazy"
            decoding="async"
          />
        </div>

        <h1
          id="family-heading"
          className="font-heading text-3xl md:text-4xl font-bold text-charcoal mb-3"
        >
          Familienbetrieb Littawe
        </h1>
        <p className="text-lg text-charcoal-light mb-10">
          Junges Unternehmen aus Osnabrück — gegründet 2026 von Kevin Littawe
        </p>

        <div className="text-left space-y-6 text-base text-charcoal-light leading-relaxed mb-10">
          <p>
            <strong>Persönlicher Kontakt statt Konzern-Hotline.</strong> Bei uns
            haben Sie einen festen Ansprechpartner: Kevin Littawe oder unser
            kleines Team. Keine Warteschleife, keine wechselnden Sachbearbeiter.
            Wer bei uns anruft, spricht direkt mit jemandem, der Ihre Anfrage
            persönlich kennt.
          </p>
          <p>
            <strong>Faire Festpreise statt Stundenfalle.</strong> Wir arbeiten
            ausschließlich zum Festpreis nach kostenloser Besichtigung — das
            heißt: keine Überraschungen bei der Endabrechnung. Bei Entrümpelungen
            ab 200 €, bei Gartenpflege und Hausmeisterservice nach Aufmaß und
            Aufwand verbindlich kalkuliert.
          </p>
          <p>
            <strong>Frische Motivation, regional verwurzelt.</strong> Junges
            Unternehmen heißt: wir sind hungrig, sorgfältig und beweisen uns mit
            jedem Auftrag. Wir kennen das Osnabrücker Land, das Münsterland und
            Ostwestfalen — und arbeiten zuverlässig im 60-km-Umkreis.
          </p>
          <p>
            <strong>Keine Subunternehmer.</strong> Wir kommen mit eigenen
            Mitarbeitern und eigenen Fahrzeugen. Was wir versprechen, machen wir
            selbst. Das macht uns langsamer als bundesweite Großbetriebe — und
            zuverlässiger.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/kontakt"
            className="inline-flex items-center justify-center px-6 py-3 bg-copper text-white font-semibold rounded-lg hover:bg-copper-dark transition"
          >
            Jetzt unverbindlich anfragen
          </Link>
          <Link
            href="/leistungen"
            className="inline-flex items-center justify-center px-6 py-3 border border-copper text-copper font-semibold rounded-lg hover:bg-copper/5 transition"
          >
            Alle Leistungen ansehen
          </Link>
        </div>
      </div>
    </section>
  );
}
