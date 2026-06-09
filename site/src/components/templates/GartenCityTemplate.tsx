// PX-047 Phase 1: Garten city template — props-driven, JSX only.
// Per Playbook ownership contract:
// - This template owns: visible JSX + copy
// - Route owns: metadata, JSON-LD Schema, canonical
//
// Single source via getGartenContent() from @/lib/template-content
// Per-city safety guards:
// - safeDistancePhrase: distanceKm=0 → "direkt in Osnabrück", >60 → "auf Anfrage"
// - safeTitle: tier-based length (avoid 60-char overflow)
// - safeEinsatzText: UWG § 5 guard (no "60 km Umkreis" claim for >60km cities)

import Link from "next/link";
import type { City } from "@/lib/programmatic";
import { getGartenContent } from "@/lib/template-content";
import { getImageUrl, toWebp } from "@/lib/getImageUrl";
import { WhatsAppIcon, PhoneIcon, EnvelopeIcon } from "@/components/ContactIcons";

interface Props {
  city: City;
  neighbors: City[];
}

// Shared globals (one source for all 98 cities).
const SERVICES = [
  "Rasenmähen",
  "Allgemeine Rasenpflege",
  "Vertikutieren",
  "Aerifizieren",
  "Nachsaat",
  "Düngung",
  "Unkrautentfernung",
  "Beetpflege",
  "Strauchschnitt",
  "Formschnitt",
  "Gartenreinigung",
  "Grundstückspflege",
  "Grünanlagenpflege",
  "Pflege von Außenanlagen",
  "Mulcharbeiten",
  "Bepflanzungen",
  "Entfernung von Wildwuchs",
  "Saisonale Gartenpflege",
  "Frühjahrs- und Herbstpflege",
  "Bodenbearbeitung",
  "Planierarbeiten",
  "Entsorgung von Gartenabfällen",
  "Pflege von Privatgärten",
  "Pflege von Firmengeländen",
  "Pflege von Wohnanlagen",
  "Pflege von Gewerbeobjekten",
];

const BENEFITS_HERO = [
  "Kostenlose Besichtigung",
  "Schnelle Terminvergabe",
  "Faire und transparente Preise",
  "Privat- & Gewerbekunden",
  "WhatsApp-Anfragen möglich",
];

const USPS = [
  "Kostenlose und unverbindliche Besichtigung",
  "Schnelle Terminvergabe",
  "Faire und transparente Preise",
  "Zuverlässige Ausführung",
  "Persönlicher Ansprechpartner",
  "Privat- und Gewerbekunden",
  "Regelmäßige Gartenpflege möglich",
  "Individuelle Lösungen für jedes Grundstück",
];

const FAQS = [
  {
    q: "Was kostet ein Gärtner",
    a: "Die Kosten hängen vom Umfang der Arbeiten und der Größe des Grundstücks ab. Nach einer kostenlosen Besichtigung erstellen wir Ihnen gerne ein individuelles Angebot.",
  },
  {
    q: "Bieten Sie regelmäßige Gartenpflege an?",
    a: "Ja, wir übernehmen sowohl einmalige Gartenarbeiten als auch regelmäßige Pflegeeinsätze.",
  },
  {
    q: "Pflegen Sie auch Gewerbegrundstücke?",
    a: "Ja, wir betreuen Firmengelände, Wohnanlagen, Gewerbeobjekte und größere Außenanlagen.",
  },
  {
    q: "Wie schnell sind Termine möglich?",
    a: "Kurzfristige Termine sind je nach Auslastung häufig möglich.",
  },
  {
    q: "Entsorgen Sie Gartenabfälle?",
    a: "Ja, auf Wunsch übernehmen wir die fachgerechte Entsorgung von Gartenabfällen und Grünschnitt.",
  },
  {
    q: "Arbeiten Sie auch für Hausverwaltungen?",
    a: "Ja, wir betreuen Hausverwaltungen, Vermieter und Wohnanlagen.",
  },
];

const WEITERE_LEISTUNGEN_TEMPLATES = [
  { label: "Heckenschnitt", servicePath: "gartenpflege" },
  { label: "Rasen erneuern", servicePath: "rasen-neuanlage", isHub: true },
  { label: "Hausmeisterservice", servicePath: "hausmeisterservice" },
  { label: "Dachreinigung", servicePath: "dacharbeiten" },
  { label: "Entrümpelung", servicePath: "entruempelung" },
  { label: "Schrottabholung", servicePath: "schrottabholung" },
];

export default function GartenCityTemplate({ city, neighbors }: Props) {
  const c = getGartenContent(city);
  // Cap at 9 neighbors per Playbook.
  const safeNeighbors = neighbors.slice(0, 9);
  // Build city-specific einsatz cities list from real neighbors + extra targets.
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

        {/* Hero image — responsive variants, preload prevents LCP regression */}
        <div className="aspect-[16/9] overflow-hidden rounded-2xl mb-8 border border-sand/30">
          <picture>
            <source
              type="image/webp"
              media="(min-width: 1024px)"
              srcSet={getImageUrl("/images/services/garten-hero-1200w.webp")}
            />
            <source
              type="image/webp"
              media="(min-width: 640px)"
              srcSet={getImageUrl("/images/services/garten-hero-800w.webp")}
            />
            <source
              type="image/webp"
              srcSet={getImageUrl("/images/services/garten-hero-400w.webp")}
            />
            <img
              src={getImageUrl(toWebp("/images/services/garten-hero.png"))}
              alt={`Gepflegter Garten in ${city.displayName} — professionelle Gartenpflege durch Rund ums Haus Littawe`}
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

        {/* CTA block (under benefits, per Kevin's feedback) */}
        <section className="my-10 p-6 md:p-8 bg-charcoal text-cream rounded-2xl text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold mb-3">
            Jetzt kostenloses Angebot anfragen
          </h2>
          <p className="text-cream/80 mb-6 leading-relaxed max-w-2xl mx-auto">
            Sie suchen einen erfahrenen Gärtner in {city.displayName} oder benötigen
            Unterstützung bei der Gartenpflege? Kontaktieren Sie uns jetzt für eine
            kostenlose und unverbindliche Besichtigung.
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

        {/* Professionelle Gartenpflege */}
        <section className="mb-10">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-charcoal mb-4">
            Professionelle Gartenpflege in {city.displayName}
          </h2>
          <p className="text-base text-charcoal-light mb-4 leading-relaxed">
            Ein gepflegter Garten sorgt nicht nur für einen positiven ersten Eindruck,
            sondern trägt auch zum Werterhalt Ihrer Immobilie bei. Mit unserer
            professionellen Gartenpflege in {city.displayName} unterstützen wir
            Privatkunden, Unternehmen und Hausverwaltungen bei sämtlichen
            Pflegearbeiten rund um Garten und Grundstück.
          </p>
          <p className="text-base text-charcoal-light leading-relaxed">
            Ganz gleich, ob kleine Grünfläche, Privatgarten, Firmengelände oder
            größere Wohnanlage — wir bieten individuelle Lösungen und zuverlässigen
            Service. {c.einsatzText}
          </p>
        </section>

        <hr className="my-10 border-sand/30" />

        {/* Unsere Leistungen */}
        <section className="mb-10">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-charcoal mb-4">
            Unsere Leistungen als Gärtner in {city.displayName}
          </h2>
          <p className="text-base text-charcoal-light mb-5 leading-relaxed">
            Zu unseren Leistungen im Bereich Gartenpflege gehören unter anderem:
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
              Viele weitere Gartenarbeiten
            </li>
          </ul>
        </section>

        <hr className="my-10 border-sand/30" />

        {/* Grundstückspflege */}
        <section className="mb-10">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-charcoal mb-4">
            Grundstückspflege & Grünanlagenpflege in {city.displayName}
          </h2>
          <p className="text-base text-charcoal-light mb-4 leading-relaxed">
            Neben klassischen Gartenarbeiten übernehmen wir auch die regelmäßige
            Grundstückspflege und Grünanlagenpflege in {city.displayName}. Eine
            gepflegte Außenanlage hinterlässt bei Kunden, Besuchern, Mietern und
            Gästen einen positiven Eindruck und trägt gleichzeitig zum langfristigen
            Werterhalt Ihrer Immobilie bei.
          </p>
          <p className="text-base text-charcoal-light leading-relaxed">
            Wir betreuen sowohl kleine Privatgrundstücke als auch größere Wohnanlagen,
            Gewerbeobjekte und Firmengelände in {city.displayName} und in den umliegenden Gemeinden.
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
              <span>Gärtner & Gartenpflege in {city.displayName} und Umgebung</span>
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
            Wir sind als Gärtner und Gartenpfleger nicht nur in {city.displayName}{" "}
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
                  <span>{f.q}{f.q === "Was kostet ein Gärtner" ? ` in ${city.displayName}?` : ""}</span>
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

        {/* Weitere Einsatzorte — uses ACTUAL neighbors, not hardcoded */}
        {safeNeighbors.length > 0 && (
          <section className="mb-10">
            <h3 className="font-heading text-xl font-semibold text-charcoal mb-4">
              Weitere Einsatzorte
            </h3>
            <div className="flex flex-wrap gap-2">
              {safeNeighbors.map((n) => (
                <Link
                  key={n.slug}
                  href={`/leistungen/gartenpflege/${n.slug}/`}
                  className="inline-flex items-center px-3 py-1.5 text-sm bg-cream-dark border border-sand/40 rounded-full text-charcoal hover:border-copper hover:text-copper transition max-w-xs break-words"
                >
                  Gärtner in {n.displayName}
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
