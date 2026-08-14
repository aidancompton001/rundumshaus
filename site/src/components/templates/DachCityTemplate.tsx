// PX-049 Phase 3: Dach city template — props-driven, JSX only.
// PX-069: ALL visible texts now come from src/data/templates/dacharbeiten.json
// (CMS-editable by Kevin — Wettbewerbsrecht urgency 2026-06-10). Placeholders
// {city}/{dist}/{einsatz}/{list}/{count} are substituted at build time.
// Extraction verified text-identical against pre-PX-069 baseline.

import Link from "next/link";
import type { City } from "@/lib/programmatic";
import { safeDistancePhrase, safeEinsatzText } from "@/lib/template-content";
import { subst, type CityTemplateTexts } from "@/lib/template-text";
import templateTexts from "@/data/templates/dacharbeiten.json";
import { getImageUrl, toWebp } from "@/lib/getImageUrl";
import siteData from "@/data/site.json";
import { WhatsAppIcon, PhoneIcon, EnvelopeIcon } from "@/components/ContactIcons";
import SectionHeading from "@/components/ui/SectionHeading";

const T = templateTexts as CityTemplateTexts;
// PX-073 F3: contact data from site.json (Einstellungen in CMS) — was hardcoded.
const PHONE = (siteData as { phone: string }).phone.replace(/\s+/g, "");
const EMAIL = (siteData as { email: string }).email;
const WA = PHONE.replace(/^\+/, "");
const SERVICE_PATH = "dacharbeiten";
// PX-072: hero image path comes from the template JSON (CMS-editable).
const heroBase = (T.heroImage ?? "").replace(/\.(png|jpe?g|webp)$/i, "");
const HERO = {
  w1200: `${heroBase}-1200w.webp`,
  w800: `${heroBase}-800w.webp`,
  w400: `${heroBase}-400w.webp`,
  fallback: T.heroImage,
};

interface Props {
  city: City;
  neighbors: City[];
  allOtherCities: City[];
}

export default function DachCityTemplate({ city, neighbors, allOtherCities }: Props) {
  const visibleNeighbors = neighbors.slice(0, 30);
  const visibleSlugs = new Set(visibleNeighbors.map((n) => n.slug));
  const extraCities = allOtherCities.filter((c) => !visibleSlugs.has(c.slug));
  const safeNeighbors = visibleNeighbors;
  const einsatzList =
    safeNeighbors.length > 0
      ? safeNeighbors.map((n) => n.displayName).join(", ")
      : "der gesamten Region um Osnabrück";

  const vars = {
    city: city.displayName,
    dist: safeDistancePhrase(city),
    einsatz: safeEinsatzText(city),
    list: einsatzList,
  };
  const s = (text: string) => subst(text, vars);

  const renderSection = (sec: { heading: string; paragraphs: string[] }) => (
    <section className="mb-10" key={sec.heading}>
      <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-charcoal mb-4">
        {s(sec.heading)}
      </h2>
      {sec.paragraphs.map((p, i) => (
        <p
          key={i}
          className={
            i < sec.paragraphs.length - 1
              ? "text-base text-charcoal-light mb-4 leading-relaxed"
              : "text-base text-charcoal-light leading-relaxed"
          }
        >
          {s(p)}
        </p>
      ))}
    </section>
  );

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
            <li className="text-charcoal" aria-current="page">{s(T.h1)}</li>
          </ol>
        </nav>

        {/* H1 */}
        <h1 className="font-heading text-4xl md:text-5xl font-black text-charcoal mb-6">
          {s(T.h1)}
        </h1>

        {/* Hero image */}
        <div className="aspect-[16/9] overflow-hidden rounded-2xl mb-8 border border-sand/30">
          <picture>
            <source type="image/webp" media="(min-width: 1024px)" srcSet={getImageUrl(HERO.w1200)} />
            <source type="image/webp" media="(min-width: 640px)" srcSet={getImageUrl(HERO.w800)} />
            <source type="image/webp" srcSet={getImageUrl(HERO.w400)} />
            <img
              src={getImageUrl(toWebp(HERO.fallback))}
              alt={s(T.heroAlt)}
              width={1200}
              height={675}
              className="w-full h-full object-cover"
              loading="eager"
              decoding="async"
            />
          </picture>
        </div>

        {/* Intro */}
        <p className="text-lg text-charcoal-light leading-relaxed mb-5">{s(T.intro1)}</p>
        <p className="text-base text-charcoal-light leading-relaxed mb-8">{s(T.intro2)}</p>

        {/* 5 ✅ benefits */}
        <ul className="my-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {T.benefits.map((b) => (
            <li key={b} className="flex items-start gap-2 text-charcoal">
              <span className="text-copper flex-shrink-0 mt-0.5" aria-hidden="true">✅</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>

        {/* CTA block */}
        <section className="my-10 p-6 md:p-8 bg-charcoal text-cream rounded-2xl text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-extrabold mb-3">
            {s(T.cta.heading)}
          </h2>
          <p className="text-cream/80 mb-6 leading-relaxed max-w-2xl mx-auto">
            {s(T.cta.text)}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <a
              href={`tel:${PHONE}`}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-copper text-white font-semibold rounded-lg hover:bg-copper-dark transition whitespace-nowrap"
            >
              <PhoneIcon className="w-5 h-5 flex-shrink-0" variant="mono" />
              <span>Anrufen</span>
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 border border-cream/40 text-cream font-semibold rounded-lg hover:bg-cream/10 transition whitespace-nowrap"
            >
              <EnvelopeIcon className="w-5 h-5 flex-shrink-0" variant="mono" />
              <span>E-Mail</span>
            </a>
            <a
              href={`https://wa.me/${WA}`}
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
          {/* PX-062: duplicate Telefon line removed per Kevin 2026-06-09 23:27 */}
        </section>

        {T.sectionsBefore.map((sec) => (
          <span key={sec.heading}>
            <hr className="my-10 border-sand/30" />
            {renderSection(sec)}
          </span>
        ))}

        <hr className="my-10 border-sand/30" />

        {/* Leistungen list */}
        <section className="mb-10">
          <SectionHeading eyebrow="Unsere Leistungen" compact className="mb-4">
            {s(T.leistungen.heading)}
          </SectionHeading>
          <p className="text-base text-charcoal-light mb-5 leading-relaxed">
            {s(T.leistungen.intro)}
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            {T.leistungen.items.map((item) => (
              <li key={item} className="flex items-start gap-2 text-charcoal">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                  strokeLinejoin="round" className="text-copper flex-shrink-0 mt-1"
                  aria-hidden="true">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm">{item}</span>
              </li>
            ))}
            <li className="text-sm text-charcoal-light italic sm:col-span-2 mt-2">
              {s(T.leistungen.footnote)}
            </li>
          </ul>
        </section>

        {T.sectionsAfter.map((sec) => (
          <span key={sec.heading}>
            <hr className="my-10 border-sand/30" />
            {renderSection(sec)}
          </span>
        ))}

        <hr className="my-10 border-sand/30" />

        {/* Warum */}
        <section className="mb-10">
          <SectionHeading compact className="mb-5">
            {s(T.warum.heading)}
          </SectionHeading>
          <ul className="space-y-3">
            {T.warum.items.map((u) => (
              <li key={u} className="flex items-start gap-3 text-charcoal">
                <span className="text-copper font-bold flex-shrink-0" aria-hidden="true">✓</span>
                <span>{u}</span>
              </li>
            ))}
            <li className="flex items-start gap-3 text-charcoal">
              <span className="text-copper font-bold flex-shrink-0" aria-hidden="true">✓</span>
              <span>{s(T.warum.cityLine)}</span>
            </li>
          </ul>
        </section>

        <hr className="my-10 border-sand/30" />

        {/* Einsatzgebiet */}
        <section className="mb-10">
          <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-charcoal mb-4">
            {s(T.einsatzgebiet.heading)}
          </h2>
          <p className="text-base text-charcoal-light leading-relaxed">
            {s(T.einsatzgebiet.text)}
          </p>
        </section>

        <hr className="my-10 border-sand/30" />

        {/* FAQ */}
        <section className="mb-10">
          <SectionHeading eyebrow="FAQ" compact className="mb-6">
            {s(T.faq.heading)}
          </SectionHeading>
          <div className="space-y-3">
            {T.faq.items.map((f, i) => (
              <details
                key={i}
                className="group bg-cream-dark border border-sand/30 rounded-xl p-4"
              >
                <summary className="cursor-pointer font-medium text-charcoal flex justify-between items-center">
                  <span>{s(f.q)}{f.cityInQuestion ? ` in ${city.displayName}?` : ""}</span>
                  <span className="ml-4 text-copper transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="mt-3 text-charcoal-light leading-relaxed">{s(f.a)}</p>
              </details>
            ))}
          </div>
        </section>

        <hr className="my-10 border-sand/30" />

        {/* Weitere Leistungen */}
        <section className="mb-10">
          <h3 className="font-heading text-xl font-extrabold text-charcoal mb-4">
            {s(T.weitereLeistungen.heading)}
          </h3>
          <div className="flex flex-wrap gap-2">
            {T.weitereLeistungen.links.map((l) => (
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
            <h3 className="font-heading text-xl font-extrabold text-charcoal mb-4">
              {s(T.einsatzorte.heading)}
            </h3>
            <div className="flex flex-wrap gap-2">
              {safeNeighbors.map((n) => (
                <Link
                  key={n.slug}
                  href={`/leistungen/${SERVICE_PATH}/${n.slug}/`}
                  className="inline-flex items-center px-3 py-1.5 text-sm bg-cream-dark border border-sand/40 rounded-full text-charcoal hover:border-copper hover:text-copper transition max-w-xs break-words"
                >
                  {subst(T.einsatzorte.chipLabel, { city: n.displayName })}
                </Link>
              ))}
            </div>
            {extraCities.length > 0 && (
              <details className="mt-4 group">
                <summary className="cursor-pointer inline-flex items-center gap-2 text-sm font-semibold text-copper hover:underline">
                  <span>{subst(T.einsatzorte.expandLabel, { count: extraCities.length })}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-open:rotate-180" aria-hidden="true">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </summary>
                <div className="mt-3 flex flex-wrap gap-2">
                  {extraCities.map((n) => (
                    <Link
                      key={n.slug}
                      href={`/leistungen/${SERVICE_PATH}/${n.slug}/`}
                      className="inline-flex items-center px-3 py-1.5 text-sm bg-cream-dark border border-sand/40 rounded-full text-charcoal hover:border-copper hover:text-copper transition max-w-xs break-words"
                    >
                      {subst(T.einsatzorte.chipLabel, { city: n.displayName })}
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
