// PX-059: Spezialthemen extracted to SpezialthemenSection (now in ServiceDetail).
// This component now only renders the Einsatzgebiet CTA.

import Link from "next/link";

export default function LeistungenInStaedten() {
  return (
    <>
      {/* PX-058: city section removed per Kevin's request 2026-06-09 22:51.
          Einsatzgebiete now lives as its own page in navigation. */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-charcoal mb-4">
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
