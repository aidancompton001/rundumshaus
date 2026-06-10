// PX-064: Homepage Einsatzgebiet text + closing slogan.
// Kevin's verbatim text (WhatsApp 2026-06-09). Plain text per his structure;
// full clickable list lives on /einsatzgebiet/.

import Link from "next/link";

export default function HomeEinsatzgebiet() {
  return (
    <section className="py-20 md:py-28 bg-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-charcoal mb-6">
          Einsatzgebiet – Osnabrück und Umgebung
        </h2>
        <p className="text-charcoal-light text-lg leading-relaxed mb-4">
          Wir sind regelmäßig in Osnabrück, Georgsmarienhütte, Melle, Bramsche,
          Wallenhorst, Belm, Bissendorf, Bad Essen, Bohmte, Ostercappeln, Hagen
          am Teutoburger Wald, Bad Iburg, Bad Laer, Bad Rothenfelde, Dissen am
          Teutoburger Wald, Glandorf, Hasbergen, Lotte, Westerkappeln,
          Ibbenbüren, Tecklenburg, Lengerich, Mettingen, Hörstel, Rheine,
          Emsdetten, Steinfurt, Münster, Greven, Warendorf, Bielefeld, Herford,
          Bad Oeynhausen, Vechta, Damme, Cloppenburg, Meppen, Lingen, Nordhorn
          und vielen weiteren Städten und Gemeinden tätig.
        </p>
        <p className="text-charcoal-light leading-relaxed mb-8">
          Für zahlreiche Orte stehen eigene Leistungsseiten zur Verfügung, damit
          Kunden schnell die passende Dienstleistung in ihrer Nähe finden.
        </p>
        <Link
          href="/einsatzgebiet/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-copper text-white font-semibold rounded-lg hover:bg-copper-dark transition"
        >
          Alle Einsatzgebiete ansehen
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>

        <p className="mt-14 text-charcoal-light italic leading-relaxed border-t border-sand/30 pt-10">
          Rund ums Haus Littawe – Ihr Ansprechpartner für Gärtnerarbeiten,
          Gartenpflege, Hausmeisterservice, Objektpflege, Dachservice,
          Dachreinigung, Dachrinnenreinigung, Dachreparaturen, Entrümpelungen,
          Haushaltsauflösungen und Schrottabholung in Osnabrück und Umgebung.
        </p>
      </div>
    </section>
  );
}
