// PX-051 Phase 5: Schrott city template — props-driven, JSX only.
// FINAL template — completes 5/5 Kevin services.
// Specific: no "Faire Preise" benefit (Schrott prices market-dependent).

import Link from "next/link";
import type { City } from "@/lib/programmatic";
import { getSchrottContent } from "@/lib/template-content-schrott";
import { getImageUrl, toWebp } from "@/lib/getImageUrl";
import { WhatsAppIcon, PhoneIcon, EnvelopeIcon } from "@/components/ContactIcons";

interface Props {
  city: City;
  neighbors: City[];
}

// 20 Leistungen per Kevin's Schrott template (specific metals listed for SEO).
const SERVICES = [
  "Schrottabholung",
  "Altmetallabholung",
  "Metallschrott entsorgen",
  "Eisenschrott entsorgen",
  "Stahlschrott entsorgen",
  "Kupferschrott entsorgen",
  "Aluminiumschrott entsorgen",
  "Messingschrott entsorgen",
  "Edelstahl entsorgen",
  "Schrottabholung bei Privatkunden",
  "Schrottabholung bei Unternehmen",
  "Schrottabholung für Gewerbe",
  "Schrottabholung für Hausverwaltungen",
  "Garagenräumungen mit Schrottentsorgung",
  "Kellerentrümpelungen mit Schrottentsorgung",
  "Hallenräumungen",
  "Lagerauflösungen",
  "Demontage kleiner Metallkonstruktionen",
  "Entsorgung alter Metallteile",
  "Fachgerechte Verwertung & Recycling",
];

// 5 benefits — NO "Faire Preise" (Schrott market-dependent).
const BENEFITS_HERO = [
  "Kostenlose Besichtigung bei größeren Mengen",
  "Schnelle Terminvergabe",
  "Privat- & Gewerbekunden",
  "Fachgerechte Verwertung",
  "Schrottabholung in der Region",
];

// 8 USPs per Kevin's Schrott template.
const USPS = [
  "Kostenlose Besichtigung bei größeren Mengen",
  "Schnelle Terminvergabe",
  "Zuverlässige und saubere Ausführung",
  "Privat- und Gewerbekunden",
  "Fachgerechte Verwertung der Metalle",
  "Persönlicher Ansprechpartner",
  "Flexible Einsatzplanung",
  "Familienbetrieb aus Osnabrück",
];

const FAQS = [
  {
    q: "Welche Metalle holen Sie ab?",
    a: "Wir holen Eisen, Stahl, Kupfer, Aluminium, Messing, Edelstahl und weitere Metalle ab — sowohl in kleineren als auch in größeren Mengen.",
    insertCity: false,
  },
  {
    q: "Ist die Altmetallabholung kostenlos",
    a: "Für die Abholung von Altmetall und Schrott berechnen wir bei größeren Mengen nichts — die Besichtigung vor Ort ist ebenfalls kostenlos. Sprechen Sie uns einfach an.",
    insertCity: true,
  },
  {
    q: "Arbeiten Sie auch für Unternehmen und Hausverwaltungen?",
    a: "Ja, wir betreuen Privatkunden, Unternehmen, Hausverwaltungen und Gewerbekunden. Auch Hallenräumungen, Lagerauflösungen und Garagenräumungen mit Schrottentsorgung gehören zu unseren Leistungen.",
    insertCity: false,
  },
  {
    q: "Wie schnell sind Termine möglich?",
    a: "Kurzfristige Termine sind je nach Auslastung häufig möglich. Bei größeren Mengen vereinbaren wir gerne einen Besichtigungstermin und planen die Abholung flexibel.",
    insertCity: false,
  },
  {
    q: "Holen Sie auch größere Mengen Schrott ab?",
    a: "Ja, gerne. Bei größeren Mengen — z. B. nach Hallenräumungen, Lagerauflösungen oder Garagenentrümpelungen — vereinbaren wir eine kostenlose Besichtigung und planen die Abholung passend zu Ihrem Termin.",
    insertCity: false,
  },
  {
    q: "Übernehmen Sie auch die Demontage von Metallteilen?",
    a: "Ja, die Demontage kleiner Metallkonstruktionen und alter Metallteile vor Ort führen wir gerne im Rahmen der Schrottabholung durch.",
    insertCity: false,
  },
];

const WEITERE_LEISTUNGEN_TEMPLATES = [
  { label: "Gartenpflege", servicePath: "gartenpflege" },
  { label: "Hausmeisterservice", servicePath: "hausmeisterservice" },
  { label: "Dachreinigung", servicePath: "dacharbeiten" },
  { label: "Entrümpelung", servicePath: "entruempelung" },
  { label: "Objektpflege", servicePath: "objektpflege", isHub: true },
];

export default function SchrottCityTemplate({ city, neighbors }: Props) {
  const c = getSchrottContent(city);
  const safeNeighbors = neighbors.slice(0, 12);
  const einsatzList =
    safeNeighbors.length > 0
      ? safeNeighbors.map((n) => n.displayName).join(", ")
      : "der gesamten Region um Osnabrück";

  return (
    <article className="py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-sm text-charcoal-light mb-8">
          <ol className="flex flex-wrap gap-x-2 gap-y-1">
            <li>
              <Link href="/" className="hover:text-copper">Startseite</Link>
              <span className="mx-2">/</span>
            </li>
            <li>
              <Link href="/leistungen/" className="hover:text-copper">Leistungen</Link>
              <span className="mx-2">/</span>
            </li>
            <li className="text-charcoal" aria-current="page">{c.h1}</li>
          </ol>
        </nav>

        {/* H1 */}
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-charcoal mb-6">
          {c.h1}
        </h1>

        {/* Hero image */}
        <div className="aspect-[16/9] overflow-hidden rounded-2xl mb-8 border border-sand/30">
          <picture>
            <source
              type="image/webp"
              media="(min-width: 1024px)"
              srcSet={getImageUrl("/images/services/schrott-hero-1200w.webp")}
            />
            <source
              type="image/webp"
              media="(min-width: 640px)"
              srcSet={getImageUrl("/images/services/schrott-hero-800w.webp")}
            />
            <source
              type="image/webp"
              srcSet={getImageUrl("/images/services/schrott-hero-400w.webp")}
            />
            <img
              src={getImageUrl(toWebp("/images/services/schrott-hero.png"))}
              alt={`Schrottabholung und Altmetallabholung in ${city.displayName} — Rund ums Haus Littawe`}
              width={1200}
              height={675}
              className="w-full h-full object-cover"
              loading="eager"
              decoding="async"
            />
          </picture>
        </div>

        {/* Intro */}
        <p className="text-lg text-charcoal-light leading-relaxed mb-5">{c.intro1}</p>
        <p className="text-base text-charcoal-light leading-relaxed mb-8">{c.intro2}</p>

        {/* 5 ✅ benefits */}
        <ul className="my-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BENEFITS_HERO.map((b) => (
            <li key={b} className="flex items-start gap-2 text-charcoal">
              <span className="text-copper flex-shrink-0 mt-0.5" aria-hidden="true">✅</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>

        {/* CTA block */}
        <section className="my-10 p-6 md:p-8 bg-charcoal text-cream rounded-2xl text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold mb-3">
            Jetzt kostenlose Schrottabholung anfragen
          </h2>
          <p className="text-cream/80 mb-6 leading-relaxed max-w-2xl mx-auto">
            Sie möchten Schrott oder Altmetall in {city.displayName} entsorgen?
            Kontaktieren Sie uns jetzt — kurze Wege, schnelle Termine,
            fachgerechte Verwertung.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <a
              href="tel:+4915239603175"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-copper text-white font-semibold rounded-lg hover:bg-copper-dark transition whitespace-nowrap"
            >
              <PhoneIcon className="w-5 h-5 flex-shrink-0" variant="mono" />
              <span>Anrufen</span>
            </a>
            <a
              href="mailto:kontakt@rundumshaus-littawe.de"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 border border-cream/40 text-cream font-semibold rounded-lg hover:bg-cream/10 transition whitespace-nowrap"
            >
              <EnvelopeIcon className="w-5 h-5 flex-shrink-0" variant="mono" />
              <span>E-Mail</span>
            </a>
            <a
              href="https://wa.me/4915239603175"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#1ebd5a] transition whitespace-nowrap"
            >
              <WhatsAppIcon className="w-5 h-5 flex-shrink-0" variant="light" />
              <span>WhatsApp</span>
            </a>
            <Link
              href="/kontakt/"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 border border-cream/40 text-cream font-semibold rounded-lg hover:bg-cream/10 transition whitespace-nowrap"
            >
              <span>Kontaktformular</span>
            </Link>
          </div>
          <p className="mt-4 text-sm text-cream/60">
            Telefon: <a href="tel:+4915239603175" className="underline hover:text-cream">+49 1523 9603175</a>
          </p>
        </section>

        <hr className="my-10 border-sand/30" />

        {/* Professionelle Schrottabholung */}
        <section className="mb-10">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-charcoal mb-4">
            Professionelle Schrottabholung in {city.displayName}
          </h2>
          <p className="text-base text-charcoal-light mb-4 leading-relaxed">
            Alter Schrott nimmt Platz weg — in Kellern, Garagen, Hallen oder
            auf Grundstücken. Wir holen Schrott und Altmetall in
            {" "}{city.displayName} unkompliziert ab und führen alles einer
            fachgerechten Verwertung zu. Ob einzelne Metallteile oder größere
            Mengen — gerne planen wir die Abholung passend zu Ihrem Termin.
          </p>
          <p className="text-base text-charcoal-light leading-relaxed">
            Bei größeren Mengen vereinbaren wir gerne eine kostenlose Besichtigung
            vor Ort. {c.einsatzText}
          </p>
        </section>

        <hr className="my-10 border-sand/30" />

        {/* Unsere Leistungen */}
        <section className="mb-10">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-charcoal mb-4">
            Unsere Leistungen im Bereich Schrottabholung in {city.displayName}
          </h2>
          <p className="text-base text-charcoal-light mb-5 leading-relaxed">
            Zu unseren Schrott- und Altmetall-Leistungen gehören unter anderem:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            {SERVICES.map((s) => (
              <li key={s} className="flex items-start gap-2 text-charcoal">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                  strokeLinejoin="round" className="text-copper flex-shrink-0 mt-1"
                  aria-hidden="true">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm">{s}</span>
              </li>
            ))}
            <li className="text-sm text-charcoal-light italic sm:col-span-2 mt-2">
              Weitere Abholungen auf Anfrage
            </li>
          </ul>
        </section>

        <hr className="my-10 border-sand/30" />

        {/* Altmetallabholung — Recycling */}
        <section className="mb-10">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-charcoal mb-4">
            Altmetallabholung in {city.displayName}
          </h2>
          <p className="text-base text-charcoal-light mb-4 leading-relaxed">
            Altmetall ist ein wertvoller Rohstoff. Eisen, Stahl, Kupfer,
            Aluminium, Messing und Edelstahl lassen sich nahezu vollständig
            recyceln. Wir holen Altmetall in {city.displayName} ab und sorgen
            für eine umweltgerechte Verwertung über zertifizierte Recyclingstellen.
          </p>
          <p className="text-base text-charcoal-light leading-relaxed">
            So leisten Sie aktiv einen Beitrag zum Ressourcenkreislauf — und
            schaffen gleichzeitig Platz für Neues.
          </p>
        </section>

        <hr className="my-10 border-sand/30" />

        {/* Privat- und Gewerbekunden */}
        <section className="mb-10">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-charcoal mb-4">
            Schrottentsorgung für Privat- und Gewerbekunden
          </h2>
          <p className="text-base text-charcoal-light mb-4 leading-relaxed">
            Wir holen Schrott in {city.displayName} sowohl bei Privatkunden
            (Garagenräumungen, Kellerentrümpelungen, alte Metallteile aus dem
            Haushalt) als auch bei Unternehmen und Hausverwaltungen
            (Hallenräumungen, Lagerauflösungen, Gewerbeschrott) ab.
          </p>
          <p className="text-base text-charcoal-light leading-relaxed">
            Auf Wunsch übernehmen wir auch die Demontage kleinerer
            Metallkonstruktionen und Anlagen vor der Abholung.
          </p>
        </section>

        <hr className="my-10 border-sand/30" />

        {/* Warum Rund ums Haus Littawe */}
        <section className="mb-10">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-charcoal mb-5">
            Warum Rund ums Haus Littawe?
          </h2>
          <ul className="space-y-3">
            {USPS.map((u) => (
              <li key={u} className="flex items-start gap-3 text-charcoal">
                <span className="text-copper font-bold flex-shrink-0" aria-hidden="true">✓</span>
                <span>{u}</span>
              </li>
            ))}
            <li className="flex items-start gap-3 text-charcoal">
              <span className="text-copper font-bold flex-shrink-0" aria-hidden="true">✓</span>
              <span>Schrottabholung in {city.displayName} und Umgebung</span>
            </li>
          </ul>
        </section>

        <hr className="my-10 border-sand/30" />

        {/* Einsatzgebiet */}
        <section className="mb-10">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-charcoal mb-4">
            Einsatzgebiet
          </h2>
          <p className="text-base text-charcoal-light leading-relaxed">
            Wir holen Schrott und Altmetall nicht nur in {city.displayName}{" "}
            ab, sondern auch in {einsatzList} und vielen weiteren Städten und
            Gemeinden der Region. {c.einsatzText}
          </p>
        </section>

        <hr className="my-10 border-sand/30" />

        {/* Häufige Fragen */}
        <section className="mb-10">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-charcoal mb-6">
            Häufige Fragen zur Schrottabholung
          </h2>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <details
                key={i}
                className="group bg-cream-dark border border-sand/30 rounded-xl p-4"
              >
                <summary className="cursor-pointer font-medium text-charcoal flex justify-between items-center">
                  <span>{f.q}{f.insertCity ? ` in ${city.displayName}?` : ""}</span>
                  <span className="ml-4 text-copper transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="mt-3 text-charcoal-light leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <hr className="my-10 border-sand/30" />

        {/* Weitere Leistungen */}
        <section className="mb-10">
          <h3 className="font-heading text-xl font-semibold text-charcoal mb-4">
            Weitere Leistungen
          </h3>
          <div className="flex flex-wrap gap-2">
            {WEITERE_LEISTUNGEN_TEMPLATES.map((l) => (
              <Link
                key={l.servicePath + l.label}
                href={l.isHub ? `/leistungen/${l.servicePath}/` : `/leistungen/${l.servicePath}/${city.slug}/`}
                className="inline-flex items-center px-3 py-1.5 text-sm bg-cream-dark border border-sand/40 rounded-full text-charcoal hover:border-copper hover:text-copper transition max-w-xs break-words"
              >
                {l.label} in {city.displayName}
              </Link>
            ))}
          </div>
        </section>

        {/* Weitere Einsatzorte */}
        {safeNeighbors.length > 0 && (
          <section className="mb-10">
            <h3 className="font-heading text-xl font-semibold text-charcoal mb-4">
              Weitere Einsatzorte
            </h3>
            <div className="flex flex-wrap gap-2">
              {safeNeighbors.map((n) => (
                <Link
                  key={n.slug}
                  href={`/leistungen/schrottabholung/${n.slug}/`}
                  className="inline-flex items-center px-3 py-1.5 text-sm bg-cream-dark border border-sand/40 rounded-full text-charcoal hover:border-copper hover:text-copper transition max-w-xs break-words"
                >
                  Schrottabholung in {n.displayName}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Footer nav */}
        <div className="mt-12 pt-8 border-t border-sand/30 text-sm text-charcoal-light">
          <Link href="/leistungen/" className="hover:text-copper">← Alle Leistungen</Link>
          <span className="mx-3">·</span>
          <Link href="/osnabrueck/" className="hover:text-copper">Standort Osnabrück</Link>
          <span className="mx-3">·</span>
          <Link href="/einsatzgebiet/" className="hover:text-copper">Einsatzgebiet</Link>
        </div>
      </div>
    </article>
  );
}
