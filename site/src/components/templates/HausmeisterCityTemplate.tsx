// PX-048 Phase 2: Hausmeister city template — props-driven, JSX only.
// Mirrors Phase 1 GartenCityTemplate pattern.
//
// Ownership contract (per Playbook):
// - This template owns: visible JSX + copy
// - Route owns: metadata, JSON-LD Schema, canonical
//
// Single source via getHausmeisterContent() from @/lib/template-content-hausmeister

import Link from "next/link";
import type { City } from "@/lib/programmatic";
import { getHausmeisterContent } from "@/lib/template-content-hausmeister";
import { getImageUrl, toWebp } from "@/lib/getImageUrl";
import { WhatsAppIcon, PhoneIcon, EnvelopeIcon } from "@/components/ContactIcons";

interface Props {
  city: City;
  neighbors: City[];
  allOtherCities: City[];
}

// 23 Leistungen per Kevin's template (kevin-chat-log-2026-06.md).
const SERVICES = [
  "Objektpflege",
  "Grundstückspflege",
  "Pflege von Außenanlagen",
  "Kontrollgänge",
  "Sichtkontrollen von Gebäuden",
  "Kleinreparaturen",
  "Austausch defekter Leuchtmittel",
  "Reinigung von Gehwegen und Hofflächen",
  "Reinigung von Außen- und Gemeinschaftsflächen",
  "Pflege von Grünflächen",
  "Laubbeseitigung",
  "Unkrautentfernung",
  "Mülltonnenservice (Bereitstellung und Rückstellung)",
  "Betreuung von Wohnanlagen",
  "Betreuung von Gewerbeobjekten",
  "Winterdienst",
  "Entrümpelungen",
  "Schrottabholung",
  "Pflege von Treppenhäusern und Eingangsbereichen",
  "Sicht- und Sauberkeitskontrollen",
  "Pflege von Privatgrundstücken",
  "Pflege von Mehrfamilienhäusern",
  "Pflege von Firmengeländen",
];

const BENEFITS_HERO = [
  "Kostenlose Besichtigung",
  "Schnelle Terminvergabe",
  "Faire und transparente Preise",
  "Privat- & Gewerbekunden",
  "Regelmäßige Betreuung möglich",
];

// 9 USPs per Kevin's Hausmeister template (one more than Garten).
const USPS = [
  "Kostenlose und unverbindliche Besichtigung",
  "Schnelle Terminvergabe",
  "Faire und transparente Preise",
  "Zuverlässige Ausführung",
  "Persönlicher Ansprechpartner",
  "Privat- und Gewerbekunden",
  "Regelmäßige Betreuung möglich",
  "Individuelle Lösungen für jedes Objekt",
  "Viele Leistungen aus einer Hand",
];

const FAQS = [
  {
    q: "Was kostet ein Hausmeisterservice",
    a: "Die Kosten hängen vom Umfang der Leistungen und der Größe des Objekts ab. Nach einer kostenlosen Besichtigung erstellen wir Ihnen gerne ein individuelles Angebot zum Festpreis.",
    insertCity: true,
  },
  {
    q: "Bieten Sie regelmäßige Betreuung an?",
    a: "Ja, wir übernehmen sowohl einmalige Hausmeisterleistungen als auch laufende Betreuungsverträge für Privatkunden, Wohnanlagen und Gewerbeobjekte.",
    insertCity: false,
  },
  {
    q: "Arbeiten Sie auch für Hausverwaltungen?",
    a: "Ja, wir betreuen Hausverwaltungen, Vermieter, Eigentümergemeinschaften und Unternehmen mit festen Ansprechpartnern.",
    insertCity: false,
  },
  {
    q: "Übernehmen Sie auch Kleinreparaturen?",
    a: "Ja, kleinere Reparaturen, Austausch defekter Leuchtmittel und vergleichbare Hausmeisteraufgaben gehören zum Standard unseres Hausmeisterservice.",
    insertCity: false,
  },
  {
    q: "Bieten Sie Winterdienst an?",
    a: "Ja, Winterdienst gehört zu unserem Leistungsumfang. Sprechen Sie uns frühzeitig an, um Ihr Objekt zuverlässig betreuen zu können.",
    insertCity: false,
  },
  {
    q: "Wie schnell sind Termine möglich?",
    a: "Kurzfristige Termine sind je nach Auslastung häufig möglich. Kontaktieren Sie uns gerne telefonisch oder per WhatsApp.",
    insertCity: false,
  },
];

const WEITERE_LEISTUNGEN_TEMPLATES = [
  { label: "Gartenpflege", servicePath: "gartenpflege" },
  { label: "Entrümpelung", servicePath: "entruempelung" },
  { label: "Dachreinigung", servicePath: "dacharbeiten" },
  { label: "Schrottabholung", servicePath: "schrottabholung" },
  { label: "Objektpflege", servicePath: "objektpflege", isHub: true },
];

export default function HausmeisterCityTemplate({ city, neighbors, allOtherCities }: Props) {
  const c = getHausmeisterContent(city);
  const visibleNeighbors = neighbors.slice(0, 30);
  const visibleSlugs = new Set(visibleNeighbors.map((n) => n.slug));
  const extraCities = allOtherCities.filter((c) => !visibleSlugs.has(c.slug));
  const safeNeighbors = visibleNeighbors;
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

        {/* Hero image — responsive variants */}
        <div className="aspect-[16/9] overflow-hidden rounded-2xl mb-8 border border-sand/30">
          <picture>
            <source
              type="image/webp"
              media="(min-width: 1024px)"
              srcSet={getImageUrl("/images/services/hausmeister-hero-1200w.webp")}
            />
            <source
              type="image/webp"
              media="(min-width: 640px)"
              srcSet={getImageUrl("/images/services/hausmeister-hero-800w.webp")}
            />
            <source
              type="image/webp"
              srcSet={getImageUrl("/images/services/hausmeister-hero-400w.webp")}
            />
            <img
              src={getImageUrl(toWebp("/images/services/hausmeister-hero.png"))}
              alt={`Hausmeister bei der Objektpflege in ${city.displayName} — Rund ums Haus Littawe`}
              width={1200}
              height={675}
              className="w-full h-full object-cover"
              loading="eager"
              decoding="async"
            />
          </picture>
        </div>

        {/* Intro paragraphs */}
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

        {/* CTA block (under benefits, per Kevin's Phase 0 feedback) */}
        <section className="my-10 p-6 md:p-8 bg-charcoal text-cream rounded-2xl text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold mb-3">
            Jetzt kostenloses Angebot anfragen
          </h2>
          <p className="text-cream/80 mb-6 leading-relaxed max-w-2xl mx-auto">
            Sie suchen einen erfahrenen Hausmeister in {city.displayName} oder
            benötigen Unterstützung bei der Objektpflege? Kontaktieren Sie uns
            jetzt für eine kostenlose und unverbindliche Besichtigung.
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

        {/* Professioneller Hausmeisterservice */}
        <section className="mb-10">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-charcoal mb-4">
            Professioneller Hausmeisterservice in {city.displayName}
          </h2>
          <p className="text-base text-charcoal-light mb-4 leading-relaxed">
            Ob Mehrfamilienhaus, Wohnanlage, Gewerbeobjekt, Bürogebäude oder
            Privatimmobilie — wir übernehmen die laufende Betreuung Ihrer Objekte
            in {city.displayName}. Mit zuverlässigem Hausmeisterservice sorgen wir
            für gepflegte Außenanlagen, funktionierende Technik im Alltag und ein
            ordentliches Erscheinungsbild Ihrer Immobilie.
          </p>
          <p className="text-base text-charcoal-light leading-relaxed">
            Ganz gleich, ob Sie einen einmaligen Einsatz oder eine regelmäßige
            Betreuung benötigen — wir bieten individuelle Lösungen und feste
            Ansprechpartner. {c.einsatzText}
          </p>
        </section>

        <hr className="my-10 border-sand/30" />

        {/* Unsere Leistungen */}
        <section className="mb-10">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-charcoal mb-4">
            Unsere Leistungen im Bereich Hausmeisterservice in {city.displayName}
          </h2>
          <p className="text-base text-charcoal-light mb-5 leading-relaxed">
            Zu unseren Hausmeisterleistungen gehören unter anderem:
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
              Viele weitere Hausmeisterleistungen auf Anfrage
            </li>
          </ul>
        </section>

        <hr className="my-10 border-sand/30" />

        {/* Objektpflege & Grundstückspflege */}
        <section className="mb-10">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-charcoal mb-4">
            Objektpflege & Grundstückspflege in {city.displayName}
          </h2>
          <p className="text-base text-charcoal-light mb-4 leading-relaxed">
            Eine regelmäßige Objektpflege trägt zum Werterhalt Ihrer Immobilie
            bei und sorgt für ein gepflegtes Gesamtbild. Wir kümmern uns um
            laufende Sichtkontrollen, Pflege der Außenanlagen, Reinigung von
            Gemeinschaftsflächen und kleinere Instandhaltungsarbeiten in
            {" "}{city.displayName}.
          </p>
          <p className="text-base text-charcoal-light leading-relaxed">
            So bleibt Ihre Immobilie dauerhaft attraktiv für Mieter, Käufer und
            Besucher — ohne dass Sie sich selbst um die Details kümmern müssen.
          </p>
        </section>

        <hr className="my-10 border-sand/30" />

        {/* B2B-Fokus */}
        <section className="mb-10">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-charcoal mb-4">
            Hausmeisterservice für Vermieter, Unternehmen & Hausverwaltungen
          </h2>
          <p className="text-base text-charcoal-light mb-4 leading-relaxed">
            Vermieter, Hausverwaltungen und Gewerbekunden in {city.displayName}{" "}
            schätzen feste Ansprechpartner, transparente Festpreise und
            zuverlässige Betreuungsverträge. Wir übernehmen die laufende Pflege
            von Wohnanlagen, Gewerbeobjekten und Bürogebäuden — auf Wunsch mit
            regelmäßiger Berichterstattung.
          </p>
          <p className="text-base text-charcoal-light leading-relaxed">
            Auch kurzfristige Einsätze, Sondertermine und saisonale Aufgaben
            (z. B. Laubbeseitigung, Winterdienst) lassen sich flexibel im
            Rahmen der Betreuung abdecken.
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
              <span>Hausmeisterservice in {city.displayName} und Umgebung</span>
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
            Wir sind als Hausmeisterservice nicht nur in {city.displayName}{" "}
            tätig, sondern auch in {einsatzList} und vielen weiteren Städten und
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

        {/* Weitere Einsatzorte — 30 visible + expandable */}
        {safeNeighbors.length > 0 && (
          <section className="mb-10">
            <h3 className="font-heading text-xl font-semibold text-charcoal mb-4">
              Weitere Einsatzorte
            </h3>
            <div className="flex flex-wrap gap-2">
              {safeNeighbors.map((n) => (
                <Link
                  key={n.slug}
                  href={`/leistungen/hausmeisterservice/${n.slug}/`}
                  className="inline-flex items-center px-3 py-1.5 text-sm bg-cream-dark border border-sand/40 rounded-full text-charcoal hover:border-copper hover:text-copper transition max-w-xs break-words"
                >
                  Hausmeisterservice in {n.displayName}
                </Link>
              ))}
            </div>
            {extraCities.length > 0 && (
              <details className="mt-4 group">
                <summary className="cursor-pointer inline-flex items-center gap-2 text-sm font-semibold text-copper hover:underline">
                  <span>Weitere {extraCities.length} Städte anzeigen</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-open:rotate-180" aria-hidden="true">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </summary>
                <div className="mt-3 flex flex-wrap gap-2">
                  {extraCities.map((n) => (
                    <Link
                      key={n.slug}
                      href={`/leistungen/hausmeisterservice/${n.slug}/`}
                      className="inline-flex items-center px-3 py-1.5 text-sm bg-cream-dark border border-sand/40 rounded-full text-charcoal hover:border-copper hover:text-copper transition max-w-xs break-words"
                    >
                      Hausmeisterservice in {n.displayName}
                    </Link>
                  ))}
                </div>
              </details>
            )}
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
