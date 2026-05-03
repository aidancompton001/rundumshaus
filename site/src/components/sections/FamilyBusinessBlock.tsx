// Server component — renders directly into HTML (no "use client").
// Used on /ueber-uns. Single canonical "Familienbetrieb seit 2026" mention
// outside of homepage's FaktenBlock. Hans Landa Round 4: only ONE 2026
// mention on homepage (FaktenBlock), all detail moves here to avoid
// repetition fatigue and conversion drop signals on high-trust services.
//
// PX-031 Phase A.1 (2026-05-03): Hero image of fully-branded VW Caddy
// (Kevin's actual Firmenwagen) replaces logo-only display. Provides real
// brand-asset proof of an active local business — strong trust signal
// for high-value services like Entrümpelung Festpreis. No personal photo
// of Kevin (he declined).

import Link from "next/link";
import { getImageUrl } from "@/lib/getImageUrl";

export default function FamilyBusinessBlock() {
  return (
    <section className="py-16 md:py-24 bg-cream-dark" aria-labelledby="family-heading">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1
            id="family-heading"
            className="font-heading text-3xl md:text-5xl font-bold text-charcoal mb-3"
          >
            Familienbetrieb Littawe
          </h1>
          <p className="text-lg md:text-xl text-charcoal-light">
            Junges Unternehmen aus Osnabrück — gegründet 2026 von Kevin Littawe
          </p>
        </div>

        {/* Hero image — Kevin's branded company van. Real, verifiable brand proof. */}
        <figure className="mb-12 rounded-2xl overflow-hidden border border-sand/30 shadow-sm bg-cream">
          <picture>
            <source
              type="image/webp"
              srcSet={`${getImageUrl("/images/branding/firmenwagen-400.webp")} 400w, ${getImageUrl("/images/branding/firmenwagen-800.webp")} 800w, ${getImageUrl("/images/branding/firmenwagen-1200.webp")} 1200w`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1024px"
            />
            <img
              src={getImageUrl("/images/branding/firmenwagen-1200.jpg")}
              srcSet={`${getImageUrl("/images/branding/firmenwagen-400.jpg")} 400w, ${getImageUrl("/images/branding/firmenwagen-800.jpg")} 800w, ${getImageUrl("/images/branding/firmenwagen-1200.jpg")} 1200w`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1024px"
              alt="Firmenwagen von Rund ums Haus Littawe — VW Caddy mit Logo, allen 5 Hauptleistungen, Telefonnummer und WhatsApp-QR-Code"
              width={1200}
              height={900}
              loading="eager"
              fetchPriority="high"
              decoding="sync"
              className="w-full h-auto"
            />
          </picture>
          <figcaption className="px-4 py-3 text-sm text-charcoal-light text-center bg-cream/50">
            Unser Firmenwagen mit allen Leistungen, Telefonnummer und WhatsApp-QR — täglich im Einsatzgebiet rund um Osnabrück unterwegs.
          </figcaption>
        </figure>

        <div className="max-w-3xl mx-auto text-left space-y-6 text-base text-charcoal-light leading-relaxed mb-10">
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
