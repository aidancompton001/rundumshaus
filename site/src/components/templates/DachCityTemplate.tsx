// PX-049 Phase 3: Dach city template — props-driven, JSX only.
// Mirrors Phase 2 HausmeisterCityTemplate pattern.
//
// Specific to Dach: 3 Unterabschnitte (Dachreinigung + Dachrinnen + Reparaturen)
// vs 2 in other templates — yields ~9 H2 sections.

import Link from "next/link";
import type { City } from "@/lib/programmatic";
import { getDachContent } from "@/lib/template-content-dach";
import { getImageUrl, toWebp } from "@/lib/getImageUrl";
import { WhatsAppIcon, PhoneIcon, EnvelopeIcon } from "@/components/ContactIcons";

interface Props {
  city: City;
  neighbors: City[];
}

// 20 Leistungen per Kevin's Dach template.
const SERVICES = [
  "Dachpflege",
  "Dachreinigung",
  "Dachrinnenreinigung",
  "Reinigung von Fallrohren",
  "Entfernung von Moos",
  "Entfernung von Laub",
  "Entfernung von Verschmutzungen",
  "Dachkontrollen",
  "Sichtprüfungen",
  "Kontrolle von Dachrinnen und Fallrohren",
  "Austausch einzelner Dachziegel",
  "Kleinere Dachreparaturen",
  "Ausbesserungsarbeiten",
  "Reinigung von Garagendächern",
  "Reinigung von Carports",
  "Pflege von Dachflächen",
  "Wartungsarbeiten",
  "Vorbeugende Instandhaltung",
  "Beratung zu Dachpflege",
  "Begutachtung des Dachzustands",
];

const BENEFITS_HERO = [
  "Kostenlose Besichtigung",
  "Schnelle Terminvergabe",
  "Faire und transparente Preise",
  "Privat- & Gewerbekunden",
  "Werterhalt der Immobilie",
];

// 8 USPs per Kevin's Dach template.
const USPS = [
  "Kostenlose und unverbindliche Besichtigung",
  "Schnelle Terminvergabe",
  "Faire und transparente Preise",
  "Zuverlässige und saubere Ausführung",
  "Persönlicher Ansprechpartner",
  "Privat- und Gewerbekunden",
  "Vorbeugende Wartung möglich",
  "Werterhalt durch regelmäßige Dachpflege",
];

const FAQS = [
  {
    q: "Was kostet eine Dachreinigung",
    a: "Die Kosten hängen von der Dachgröße, dem Verschmutzungsgrad und der Erreichbarkeit ab. Nach einer kostenlosen Besichtigung erstellen wir Ihnen gerne ein individuelles Angebot zum Festpreis.",
    insertCity: true,
  },
  {
    q: "Wie häufig sollte die Dachrinne gereinigt werden?",
    a: "Wir empfehlen die Dachrinnenreinigung mindestens einmal im Jahr — bevorzugt im Spätherbst, wenn das Laub gefallen ist. Bei umliegenden Bäumen oder besonders exponierten Lagen kann auch eine halbjährliche Reinigung sinnvoll sein.",
    insertCity: false,
  },
  {
    q: "Bieten Sie auch reine Dachreinigungen an?",
    a: "Ja, wir übernehmen Dachreinigungen separat — von der Moos- und Algenentfernung bis zur kompletten Pflege von Dachflächen, Garagendächern und Carports.",
    insertCity: false,
  },
  {
    q: "Übernehmen Sie auch kleinere Dachreparaturen?",
    a: "Ja, kleinere Dachreparaturen, Austausch einzelner Dachziegel und Ausbesserungsarbeiten gehören zu unseren Leistungen.",
    insertCity: false,
  },
  {
    q: "Arbeiten Sie auch für Hausverwaltungen?",
    a: "Ja, wir betreuen Hausverwaltungen, Vermieter, Eigentümergemeinschaften und Unternehmen mit festen Ansprechpartnern.",
    insertCity: false,
  },
  {
    q: "Wie schnell sind Termine möglich?",
    a: "Kurzfristige Termine sind je nach Auslastung und Wetterlage häufig möglich. Kontaktieren Sie uns gerne telefonisch oder per WhatsApp.",
    insertCity: false,
  },
];

const WEITERE_LEISTUNGEN_TEMPLATES = [
  { label: "Gartenpflege", servicePath: "gartenpflege" },
  { label: "Hausmeisterservice", servicePath: "hausmeisterservice" },
  { label: "Entrümpelung", servicePath: "entruempelung" },
  { label: "Schrottabholung", servicePath: "schrottabholung" },
  { label: "Objektpflege", servicePath: "objektpflege", isHub: true },
];

export default function DachCityTemplate({ city, neighbors }: Props) {
  const c = getDachContent(city);
  const safeNeighbors = neighbors.slice(0, 9);
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
              srcSet={getImageUrl("/images/services/dach-hero-1200w.webp")}
            />
            <source
              type="image/webp"
              media="(min-width: 640px)"
              srcSet={getImageUrl("/images/services/dach-hero-800w.webp")}
            />
            <source
              type="image/webp"
              srcSet={getImageUrl("/images/services/dach-hero-400w.webp")}
            />
            <img
              src={getImageUrl(toWebp("/images/services/dach-hero.png"))}
              alt={`Dachdecker bei Dachreinigung und Dachrinnenreinigung in ${city.displayName} — Rund ums Haus Littawe`}
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
            Sie benötigen eine Dachreinigung, Dachrinnenreinigung oder kleinere
            Dachreparaturen in {city.displayName}? Kontaktieren Sie uns jetzt
            für eine kostenlose und unverbindliche Besichtigung.
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

        {/* Professioneller Dachservice — Wetter-Argument */}
        <section className="mb-10">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-charcoal mb-4">
            Professioneller Dachservice in {city.displayName}
          </h2>
          <p className="text-base text-charcoal-light mb-4 leading-relaxed">
            Regen, Wind, Sturm, Moos, Laub und UV-Strahlung setzen jedem Dach
            mit der Zeit zu. In {city.displayName} und Umgebung sorgt eine
            regelmäßige Dachpflege dafür, dass Ihr Dach lange dicht bleibt und
            das Erscheinungsbild Ihrer Immobilie gepflegt aussieht — egal ob
            Einfamilienhaus, Mehrfamilienhaus oder Gewerbeobjekt.
          </p>
          <p className="text-base text-charcoal-light leading-relaxed">
            Wir übernehmen Dachreinigung, Dachrinnenreinigung, Dachkontrollen
            und kleinere Reparaturen — alles aus einer Hand. {c.einsatzText}
          </p>
        </section>

        <hr className="my-10 border-sand/30" />

        {/* Unsere Leistungen */}
        <section className="mb-10">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-charcoal mb-4">
            Unsere Leistungen im Bereich Dachservice in {city.displayName}
          </h2>
          <p className="text-base text-charcoal-light mb-5 leading-relaxed">
            Zu unseren Leistungen rund ums Dach gehören unter anderem:
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
              Viele weitere Arbeiten rund ums Dach auf Anfrage
            </li>
          </ul>
        </section>

        <hr className="my-10 border-sand/30" />

        {/* Sub 1: Dachreinigung */}
        <section className="mb-10">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-charcoal mb-4">
            Dachreinigung in {city.displayName}
          </h2>
          <p className="text-base text-charcoal-light mb-4 leading-relaxed">
            Moos, Algen, Flechten und Laub auf dem Dach sehen nicht nur
            unschön aus — sie können langfristig die Lebensdauer Ihres Dachs
            verkürzen. Mit einer fachgerechten Dachreinigung entfernen wir
            Verschmutzungen schonend und sorgen für ein sauberes, gepflegtes
            Dachbild in {city.displayName}.
          </p>
          <p className="text-base text-charcoal-light leading-relaxed">
            Auch Garagendächer, Carports und kleinere Dachflächen reinigen wir
            zuverlässig und sorgfältig.
          </p>
        </section>

        <hr className="my-10 border-sand/30" />

        {/* Sub 2: Dachrinnenreinigung */}
        <section className="mb-10">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-charcoal mb-4">
            Dachrinnenreinigung in {city.displayName}
          </h2>
          <p className="text-base text-charcoal-light mb-4 leading-relaxed">
            Verstopfte Dachrinnen und Fallrohre sind eine häufige Ursache für
            Wasserschäden an Fassade und Mauerwerk. Wir reinigen Dachrinnen
            und Fallrohre in {city.displayName} gründlich, prüfen die Abläufe
            und melden Ihnen rechtzeitig, wenn eine Ausbesserung sinnvoll ist.
          </p>
          <p className="text-base text-charcoal-light leading-relaxed">
            Eine regelmäßige Dachrinnenreinigung — mindestens einmal jährlich —
            beugt teuren Folgeschäden vor und schützt Ihre Immobilie nachhaltig.
          </p>
        </section>

        <hr className="my-10 border-sand/30" />

        {/* Sub 3: Kleinere Reparaturen */}
        <section className="mb-10">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-charcoal mb-4">
            Kleinere Dachreparaturen & Dacharbeiten in {city.displayName}
          </h2>
          <p className="text-base text-charcoal-light mb-4 leading-relaxed">
            Einzelne verrutschte oder beschädigte Dachziegel, kleinere
            Ausbesserungen oder vorbeugende Wartungsarbeiten — wir übernehmen
            kleinere Dachreparaturen in {city.displayName} fachgerecht und
            zuverlässig.
          </p>
          <p className="text-base text-charcoal-light leading-relaxed">
            Bei umfangreicheren Sanierungen oder komplexen Dachprojekten
            empfehlen wir gerne einen spezialisierten Dachdeckerbetrieb. Im
            Rahmen der laufenden Pflege und kleinerer Reparaturen sind wir Ihr
            zuverlässiger Ansprechpartner.
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
              <span>Dachservice in {city.displayName} und Umgebung</span>
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
            Wir bieten unseren Dachservice nicht nur in {city.displayName}{" "}
            an, sondern auch in {einsatzList} und vielen weiteren Städten und
            Gemeinden der Region. {c.einsatzText}
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
                  href={`/leistungen/dacharbeiten/${n.slug}/`}
                  className="inline-flex items-center px-3 py-1.5 text-sm bg-cream-dark border border-sand/40 rounded-full text-charcoal hover:border-copper hover:text-copper transition max-w-xs break-words"
                >
                  Dachservice in {n.displayName}
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
