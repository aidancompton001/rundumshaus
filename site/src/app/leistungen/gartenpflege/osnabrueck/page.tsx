// PX-047 Phase 0: Garten Osnabrück — PREVIEW page для Kevin review.
// Static override перехватывает /leistungen/gartenpflege/osnabrueck/
// и рендерит новый 9-секционный template по тексту Kevin'а
// (WhatsApp 2026-06-09).
//
// Цель: Kevin смотрит live превью, утверждает дизайн → после OK
// раскат на остальные 97 cities × 5 services (Phase 1+).
//
// Старый dynamic template (programmatic.ts) продолжает работать
// для всех остальных combinations. См. фильтр в
// /leistungen/[service]/[city]/page.tsx generateStaticParams().

import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { getImageUrl, toWebp } from "@/lib/getImageUrl";
import { WhatsAppIcon, PhoneIcon, EnvelopeIcon } from "@/components/ContactIcons";

const CITY = "Osnabrück";
const CITY_SLUG = "osnabrueck";
const BASE_URL = "https://rundumshaus-littawe.de";

export const metadata = generateSEO({
  title: `Gärtner & Gartenpflege ${CITY} ★ Familienbetrieb`,
  description: `Professionelle Gartenpflege in ${CITY} und Umgebung: Rasenmähen, Heckenschnitt, Rasenerneuerung, Grundstückspflege. Familienbetrieb · Festpreis · ☎ direkt anrufen.`,
  path: `/leistungen/gartenpflege/${CITY_SLUG}`,
});

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
  `Gärtner & Gartenpflege in ${CITY} und Umgebung`,
];

const EINSATZ_CITIES = [
  "Belm",
  "Georgsmarienhütte",
  "Hasbergen",
  "Wallenhorst",
  "Hagen am Teutoburger Wald",
  "Lotte",
  "Bissendorf",
  "Bad Iburg",
  "Bramsche",
  "Melle",
  "Bad Essen",
  "Bohmte",
  "Ostercappeln",
  "Bad Laer",
  "Bad Rothenfelde",
  "Dissen am Teutoburger Wald",
  "Glandorf",
  "Westerkappeln",
  "Ibbenbüren",
];

const FAQS = [
  {
    q: `Was kostet ein Gärtner in ${CITY}?`,
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

const WEITERE_LEISTUNGEN = [
  { label: "Heckenschnitt", href: "/leistungen/gartenpflege/osnabrueck/" },
  { label: "Rasen erneuern", href: "/leistungen/rasen-neuanlage/" },
  { label: "Hausmeisterservice", href: "/leistungen/hausmeisterservice/osnabrueck/" },
  { label: "Dachreinigung", href: "/leistungen/dacharbeiten/osnabrueck/" },
  { label: "Dachrinnenreinigung", href: "/leistungen/dacharbeiten/osnabrueck/" },
  { label: "Entrümpelung", href: "/leistungen/entruempelung/osnabrueck/" },
  { label: "Haushaltsauflösung", href: "/leistungen/entruempelung/osnabrueck/" },
  { label: "Schrottabholung", href: "/leistungen/schrottabholung/osnabrueck/" },
];

const NEIGHBOR_CITIES = [
  { name: "Belm", slug: "belm" },
  { name: "Georgsmarienhütte", slug: "georgsmarienhuette" },
  { name: "Hasbergen", slug: "hasbergen" },
  { name: "Wallenhorst", slug: "wallenhorst" },
  { name: "Hagen am Teutoburger Wald", slug: "hagen-am-teutoburger-wald" },
  { name: "Lotte", slug: "lotte" },
  { name: "Bissendorf", slug: "bissendorf" },
  { name: "Bad Iburg", slug: "bad-iburg" },
  { name: "Bramsche", slug: "bramsche" },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite", item: `${BASE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Leistungen", item: `${BASE_URL}/leistungen/` },
    { "@type": "ListItem", position: 3, name: "Gartenpflege", item: `${BASE_URL}/leistungen/#gartenpflege` },
    { "@type": "ListItem", position: 4, name: CITY, item: `${BASE_URL}/leistungen/gartenpflege/${CITY_SLUG}/` },
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: `Gärtner & Gartenpflege ${CITY}`,
  serviceType: "Gartenpflege / Gärtner",
  description: `Professionelle Gartenpflege, Grundstückspflege und Grünanlagenpflege in ${CITY} und Umgebung. Für Privatkunden, Unternehmen, Vermieter und Hausverwaltungen.`,
  provider: { "@id": `${BASE_URL}/#localbusiness` },
  areaServed: {
    "@type": "City",
    name: CITY,
    address: {
      "@type": "PostalAddress",
      addressLocality: CITY,
      addressRegion: "Niedersachsen",
      addressCountry: "DE",
    },
  },
  url: `${BASE_URL}/leistungen/gartenpflege/${CITY_SLUG}/`,
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function GartenpflegeOsnabrueckPreviewPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

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
              <li className="text-charcoal" aria-current="page">Gärtner & Gartenpflege in {CITY}</li>
            </ol>
          </nav>

          {/* H1 */}
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-charcoal mb-6">
            Gärtner & Gartenpflege in {CITY}
          </h1>

          {/* Hero image — back to original position (top, right after H1) */}
          <div className="aspect-[16/9] overflow-hidden rounded-2xl mb-8 border border-sand/30">
            <picture>
              <source type="image/webp" srcSet={getImageUrl(toWebp("/images/services/garten-hero.png"))} />
              <img
                src={getImageUrl("/images/services/garten-hero.png")}
                alt={`Gepflegter Garten in ${CITY} — professionelle Gartenpflege durch Rund ums Haus Littawe`}
                width={1200}
                height={675}
                className="w-full h-full object-cover"
                loading="eager"
                decoding="async"
              />
            </picture>
          </div>

          {/* Intro */}
          <p className="text-lg text-charcoal-light leading-relaxed mb-5">
            Sie suchen einen zuverlässigen Gärtner in {CITY}? Rund ums Haus Littawe ist Ihr Ansprechpartner für professionelle Gartenpflege, Grundstückspflege und Grünanlagenpflege in {CITY} und Umgebung. Wir unterstützen Privatkunden, Unternehmen, Vermieter und Hausverwaltungen bei sämtlichen Arbeiten rund um Garten, Grünflächen und Außenanlagen.
          </p>
          <p className="text-base text-charcoal-light leading-relaxed mb-8">
            Als erfahrener Gärtner in {CITY} übernehmen wir sowohl regelmäßige Gartenpflege als auch einmalige Gartenarbeiten. Unser Ziel ist es, Ihren Garten, Ihr Grundstück oder Ihre Außenanlage dauerhaft gepflegt und ansprechend zu halten.
          </p>

          {/* 5 ✅ benefits above-fold */}
          <ul className="my-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BENEFITS_HERO.map((b) => (
              <li key={b} className="flex items-start gap-2 text-charcoal">
                <span className="text-copper flex-shrink-0 mt-0.5" aria-hidden="true">✅</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>

          {/* CTA block — Kevin Feedback 2026-06-09 (clarified): moved HERE under benefits */}
          <section className="my-10 p-6 md:p-8 bg-charcoal text-cream rounded-2xl text-center">
            <h2 className="font-heading text-2xl md:text-3xl font-semibold mb-3">
              Jetzt kostenloses Angebot anfragen
            </h2>
            <p className="text-cream/80 mb-6 leading-relaxed max-w-2xl mx-auto">
              Sie suchen einen erfahrenen Gärtner in {CITY} oder benötigen Unterstützung bei der Gartenpflege? Kontaktieren Sie uns jetzt für eine kostenlose und unverbindliche Besichtigung.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-3xl mx-auto">
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

          {/* H2: Professionelle Gartenpflege */}
          <section className="mb-10">
            <h2 className="font-heading text-2xl md:text-3xl font-semibold text-charcoal mb-4">
              Professionelle Gartenpflege in {CITY}
            </h2>
            <p className="text-base text-charcoal-light mb-4 leading-relaxed">
              Ein gepflegter Garten sorgt nicht nur für einen positiven ersten Eindruck, sondern trägt auch zum Werterhalt Ihrer Immobilie bei. Mit unserer professionellen Gartenpflege in {CITY} unterstützen wir Privatkunden, Unternehmen und Hausverwaltungen bei sämtlichen Pflegearbeiten rund um Garten und Grundstück.
            </p>
            <p className="text-base text-charcoal-light leading-relaxed">
              Ganz gleich, ob kleine Grünfläche, Privatgarten, Firmengelände oder größere Wohnanlage — wir bieten individuelle Lösungen und zuverlässigen Service.
            </p>
          </section>

          <hr className="my-10 border-sand/30" />

          {/* H2: Unsere Leistungen */}
          <section className="mb-10">
            <h2 className="font-heading text-2xl md:text-3xl font-semibold text-charcoal mb-4">
              Unsere Leistungen als Gärtner in {CITY}
            </h2>
            <p className="text-base text-charcoal-light mb-5 leading-relaxed">
              Zu unseren Leistungen im Bereich Gartenpflege gehören unter anderem:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              {SERVICES.map((s) => (
                <li key={s} className="flex items-start gap-2 text-charcoal">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-copper flex-shrink-0 mt-1"
                    aria-hidden="true"
                  >
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

          {/* H2: Grundstückspflege & Grünanlagenpflege */}
          <section className="mb-10">
            <h2 className="font-heading text-2xl md:text-3xl font-semibold text-charcoal mb-4">
              Grundstückspflege & Grünanlagenpflege in {CITY}
            </h2>
            <p className="text-base text-charcoal-light mb-4 leading-relaxed">
              Neben klassischen Gartenarbeiten übernehmen wir auch die regelmäßige Grundstückspflege und Grünanlagenpflege in {CITY}. Eine gepflegte Außenanlage hinterlässt bei Kunden, Besuchern, Mietern und Gästen einen positiven Eindruck und trägt gleichzeitig zum langfristigen Werterhalt Ihrer Immobilie bei.
            </p>
            <p className="text-base text-charcoal-light leading-relaxed">
              Wir betreuen sowohl kleine Privatgrundstücke als auch größere Wohnanlagen, Gewerbeobjekte und Firmengelände.
            </p>
          </section>

          <hr className="my-10 border-sand/30" />

          {/* H2: Warum Rund ums Haus Littawe? */}
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
            </ul>
          </section>

          <hr className="my-10 border-sand/30" />

          {/* H2: Einsatzgebiet */}
          <section className="mb-10">
            <h2 className="font-heading text-2xl md:text-3xl font-semibold text-charcoal mb-4">
              Einsatzgebiet
            </h2>
            <p className="text-base text-charcoal-light leading-relaxed">
              Wir sind als Gärtner und Gartenpfleger nicht nur in {CITY} tätig, sondern auch in {EINSATZ_CITIES.join(", ")} und vielen weiteren Städten und Gemeinden der Region.
            </p>
          </section>

          <hr className="my-10 border-sand/30" />

          {/* H2: Häufige Fragen */}
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
                    <span>{f.q}</span>
                    <span className="ml-4 text-copper transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-charcoal-light leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          <hr className="my-10 border-sand/30" />

          {/* H2: Weitere Leistungen */}
          <section className="mb-10">
            <h2 className="font-heading text-xl font-semibold text-charcoal mb-4">
              Weitere Leistungen
            </h2>
            <div className="flex flex-wrap gap-2">
              {WEITERE_LEISTUNGEN.map((l) => (
                <Link
                  key={l.label + l.href}
                  href={l.href}
                  className="inline-flex items-center px-3 py-1.5 text-sm bg-cream-dark border border-sand/40 rounded-full text-charcoal hover:border-copper hover:text-copper transition"
                >
                  {l.label} in {CITY}
                </Link>
              ))}
            </div>
          </section>

          {/* H2: Weitere Einsatzorte */}
          <section className="mb-10">
            <h2 className="font-heading text-xl font-semibold text-charcoal mb-4">
              Weitere Einsatzorte
            </h2>
            <div className="flex flex-wrap gap-2">
              {NEIGHBOR_CITIES.map((c) => (
                <Link
                  key={c.slug}
                  href={`/leistungen/gartenpflege/${c.slug}/`}
                  className="inline-flex items-center px-3 py-1.5 text-sm bg-cream-dark border border-sand/40 rounded-full text-charcoal hover:border-copper hover:text-copper transition"
                >
                  Gärtner & Gartenpflege in {c.name}
                </Link>
              ))}
            </div>
          </section>

          {/* Footer nav */}
          <div className="mt-12 pt-8 border-t border-sand/30 text-sm text-charcoal-light">
            <Link href="/leistungen/" className="hover:text-copper">
              ← Alle Leistungen
            </Link>
            <span className="mx-3">·</span>
            <Link href="/osnabrueck/" className="hover:text-copper">
              Standort Osnabrück
            </Link>
            <span className="mx-3">·</span>
            <Link href="/einsatzgebiet/" className="hover:text-copper">
              Einsatzgebiet
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
