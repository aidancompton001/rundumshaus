// PX-050 Phase 4: Entrümpelung city template — props-driven, JSX only.
// Mirrors Phase 2/3 pattern.

import Link from "next/link";
import type { City } from "@/lib/programmatic";
import { getEntruempelungContent } from "@/lib/template-content-entruempelung";
import { getImageUrl, toWebp } from "@/lib/getImageUrl";
import { WhatsAppIcon, PhoneIcon, EnvelopeIcon } from "@/components/ContactIcons";

interface Props {
  city: City;
  neighbors: City[];
}

// 22 Leistungen per Kevin's Entrümpelung template.
const SERVICES = [
  "Entrümpelungen aller Art",
  "Haushaltsauflösungen",
  "Wohnungsauflösungen",
  "Hausauflösungen",
  "Kellerentrümpelungen",
  "Dachbodenentrümpelungen",
  "Garagenentrümpelungen",
  "Gewerbe- und Büroauflösungen",
  "Nachlassauflösungen",
  "Räumungen nach Umzug",
  "Räumungen nach Todesfall",
  "Messi-Wohnungen",
  "Sperrmüllentsorgung",
  "Schrottentsorgung",
  "Entsorgung von Hausrat",
  "Demontage von Möbeln",
  "Demontage von Einbauküchen",
  "Räumung von Lagern und Hallen",
  "Entsorgung von Gartenabfällen",
  "Besenreine Übergabe",
  "Endreinigung auf Wunsch",
  "Fachgerechte Sortierung und Entsorgung",
];

const BENEFITS_HERO = [
  "Kostenlose Besichtigung",
  "Schnelle Terminvergabe",
  "Faire und transparente Preise",
  "Besenreine Übergabe",
  "Diskret & respektvoll",
];

// 9 USPs per Kevin's template.
const USPS = [
  "Kostenlose und unverbindliche Besichtigung",
  "Transparente Festpreise ohne versteckte Kosten",
  "Schnelle Terminvergabe",
  "Zuverlässige und saubere Ausführung",
  "Besenreine Übergabe möglich",
  "Entrümpelung inklusive fachgerechter Entsorgung",
  "Diskreter Umgang mit persönlichen Unterlagen",
  "Familienbetrieb aus Osnabrück",
  "Privat- und Gewerbekunden",
];

const FAQS = [
  {
    q: "Was kostet eine Entrümpelung",
    a: "Die Kosten hängen von der Menge, der Erreichbarkeit und dem Aufwand ab. Nach einer kostenlosen Besichtigung erstellen wir Ihnen gerne ein verbindliches Festpreis-Angebot — ohne versteckte Zusatzkosten.",
    insertCity: true,
  },
  {
    q: "Bieten Sie Festpreise an?",
    a: "Ja, nach der Besichtigung erhalten Sie ein verbindliches Festpreis-Angebot. Sie wissen vorher genau, was die Entrümpelung kostet — keine Überraschungen.",
    insertCity: false,
  },
  {
    q: "Übernehmen Sie Haushaltsauflösungen nach Todesfall?",
    a: "Ja, wir gehen bei Nachlassauflösungen besonders respektvoll und diskret vor. Persönliche Dokumente, Fotos, Urkunden, Verträge und Wertgegenstände werden aussortiert und für Sie gesondert aufbewahrt.",
    insertCity: false,
  },
  {
    q: "Was passiert mit den entsorgten Gegenständen?",
    a: "Wir achten auf eine umweltgerechte Trennung. Sperrmüll, Holz, Metall, Elektroschrott und weitere Wertstoffe werden fachgerecht sortiert und den entsprechenden Entsorgungsstellen zugeführt.",
    insertCity: false,
  },
  {
    q: "Wie schnell sind Termine möglich?",
    a: "Kurzfristige Termine für Entrümpelungen und Haushaltsauflösungen sind je nach Auslastung häufig möglich. Kontaktieren Sie uns gerne telefonisch oder per WhatsApp.",
    insertCity: false,
  },
  {
    q: "Übernehmen Sie auch Gewerbe- und Büroauflösungen?",
    a: "Ja, neben privaten Räumungen übernehmen wir auch Gewerbe-, Büro- und Lagerauflösungen sowie Räumungen von Hallen und Geschäftsflächen.",
    insertCity: false,
  },
];

const WEITERE_LEISTUNGEN_TEMPLATES = [
  { label: "Gartenpflege", servicePath: "gartenpflege" },
  { label: "Hausmeisterservice", servicePath: "hausmeisterservice" },
  { label: "Dachreinigung", servicePath: "dacharbeiten" },
  { label: "Schrottabholung", servicePath: "schrottabholung" },
  { label: "Objektpflege", servicePath: "objektpflege", isHub: true },
];

export default function EntruempelungCityTemplate({ city, neighbors }: Props) {
  const c = getEntruempelungContent(city);
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
              srcSet={getImageUrl("/images/services/entruempelung-hero-1200w.webp")}
            />
            <source
              type="image/webp"
              media="(min-width: 640px)"
              srcSet={getImageUrl("/images/services/entruempelung-hero-800w.webp")}
            />
            <source
              type="image/webp"
              srcSet={getImageUrl("/images/services/entruempelung-hero-400w.webp")}
            />
            <img
              src={getImageUrl(toWebp("/images/services/entruempelung-hero.png"))}
              alt={`Entrümpelung und Haushaltsauflösung in ${city.displayName} — Rund ums Haus Littawe`}
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
            Jetzt kostenloses Angebot anfragen
          </h2>
          <p className="text-cream/80 mb-6 leading-relaxed max-w-2xl mx-auto">
            Sie benötigen eine Entrümpelung oder Haushaltsauflösung in
            {" "}{city.displayName}? Kontaktieren Sie uns jetzt für eine
            kostenlose, unverbindliche Besichtigung und ein Festpreis-Angebot.
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

        {/* Professionelle Entrümpelung */}
        <section className="mb-10">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-charcoal mb-4">
            Professionelle Entrümpelung in {city.displayName}
          </h2>
          <p className="text-base text-charcoal-light mb-4 leading-relaxed">
            Ob einzelne Räume, Keller, Dachboden, Garage oder eine komplette
            Haushaltsauflösung — wir übernehmen die fachgerechte Räumung und
            Entsorgung in {city.displayName}. Dabei legen wir großen Wert auf
            Zuverlässigkeit, Diskretion und eine besenreine Übergabe.
          </p>
          <p className="text-base text-charcoal-light leading-relaxed">
            Auch kurzfristige Entrümpelungen, Räumungen nach Umzug oder
            Todesfall führen wir zuverlässig und sorgfältig durch. {c.einsatzText}
          </p>
        </section>

        <hr className="my-10 border-sand/30" />

        {/* Unsere Leistungen */}
        <section className="mb-10">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-charcoal mb-4">
            Unsere Leistungen im Bereich Entrümpelung in {city.displayName}
          </h2>
          <p className="text-base text-charcoal-light mb-5 leading-relaxed">
            Zu unseren Entrümpelungsleistungen gehören unter anderem:
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
              Viele weitere Räumungen und Auflösungen auf Anfrage
            </li>
          </ul>
        </section>

        <hr className="my-10 border-sand/30" />

        {/* Haushaltsauflösung */}
        <section className="mb-10">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-charcoal mb-4">
            Haushaltsauflösung in {city.displayName}
          </h2>
          <p className="text-base text-charcoal-light mb-4 leading-relaxed">
            Eine Haushaltsauflösung ist oft mit viel Aufwand und emotionalem
            Stress verbunden. Wir unterstützen Sie professionell bei der
            kompletten Räumung von Wohnungen und Häusern in {city.displayName}{" "}
            und übernehmen die gesamte Organisation — von der Besichtigung bis
            zur fachgerechten Entsorgung.
          </p>
          <p className="text-base text-charcoal-light leading-relaxed">
            Auf Wunsch sortieren wir Hausrat, Möbel und Geräte vor und bereiten
            die Räume besenrein für die Übergabe an Vermieter oder Käufer vor.
          </p>
        </section>

        <hr className="my-10 border-sand/30" />

        {/* Wohnungsauflösung & Nachlassauflösung */}
        <section className="mb-10">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-charcoal mb-4">
            Wohnungsauflösung & Nachlassauflösung in {city.displayName}
          </h2>
          <p className="text-base text-charcoal-light mb-4 leading-relaxed">
            Besonders bei Wohnungsauflösungen und Nachlassauflösungen nach
            Todesfällen gehen wir respektvoll und diskret vor. Persönliche
            Dokumente, Fotos, Urkunden, Verträge oder Wertgegenstände werden
            selbstverständlich aussortiert und gesondert für Sie aufbewahrt.
          </p>
          <p className="text-base text-charcoal-light leading-relaxed">
            Sprechen Sie uns gerne an — wir nehmen uns Zeit für Ihre Situation
            und finden gemeinsam mit Ihnen die passende Lösung.
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
              <span>Entrümpelung in {city.displayName} und Umgebung</span>
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
            Wir bieten unsere Entrümpelungen und Haushaltsauflösungen nicht nur
            in {city.displayName} an, sondern auch in {einsatzList} und vielen
            weiteren Städten und Gemeinden der Region. {c.einsatzText}
          </p>
        </section>

        <hr className="my-10 border-sand/30" />

        {/* Häufige Fragen */}
        <section className="mb-10">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-charcoal mb-6">
            Häufige Fragen
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
                  href={`/leistungen/entruempelung/${n.slug}/`}
                  className="inline-flex items-center px-3 py-1.5 text-sm bg-cream-dark border border-sand/40 rounded-full text-charcoal hover:border-copper hover:text-copper transition max-w-xs break-words"
                >
                  Entrümpelung in {n.displayName}
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
