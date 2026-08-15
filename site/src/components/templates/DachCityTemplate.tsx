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

// Галочка списка по макету (.badge-check, style.css): зелёный кружок с белой
// галочкой. На городских стояла тонкая галочка без кружка — на главной и в
// услугах кружки были, и стиль внутри сайта расходился.
function CheckBadge() {
  return (
    <span
      className="flex-none w-6 h-6 rounded-full bg-copper grid place-items-center mt-0.5"
      aria-hidden="true"
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
        <path d="m5 13 4 4L19 7" />
      </svg>
    </span>
  );
}

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
    <section className="mb-10 max-w-[76ch] mx-auto" key={sec.heading}>
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
    <>
      {/* Шапка городской страницы по макету (city-template.html, .page-hero):
          тёмная полоса с хлебными крошками и H1. Прежде крошки и заголовок
          стояли на белом внутри статьи. */}
      <section className="bg-dark text-white relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-[clamp(2.75rem,5vw,4.5rem)] pb-[clamp(3.5rem,6vw,5.5rem)]">
          <nav aria-label="Breadcrumb" className="text-sm text-white/70 mb-4">
            <ol className="flex flex-wrap gap-x-2 gap-y-1">
              <li>
                <Link href="/" className="hover:text-white">Startseite</Link>
                <span className="mx-2" aria-hidden="true">›</span>
              </li>
              <li>
                <Link href="/leistungen/" className="hover:text-white">Leistungen</Link>
                <span className="mx-2" aria-hidden="true">›</span>
              </li>
              <li className="text-white" aria-current="page">{s(T.h1)}</li>
            </ol>
          </nav>
          <h1 className="font-heading text-3xl md:text-[2.875rem] font-extrabold leading-tight max-w-[24ch]">
            {s(T.h1)}
          </h1>
        </div>
      </section>

    <article className="py-10 md:py-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero image */}
        <div className="aspect-[16/9] overflow-hidden rounded-2xl mb-8 border border-sand/30 max-w-[860px]">
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
        <div className="max-w-[76ch]">
          <p className="text-lg text-charcoal-light leading-relaxed mb-5">{s(T.intro1)}</p>
          <p className="text-base text-charcoal-light leading-relaxed mb-8">{s(T.intro2)}</p>
        </div>

        {/* 5 ✅ benefits */}
        <ul className="my-10 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-[860px]">
          {T.benefits.map((b) => (
            <li key={b} className="flex items-start gap-2 text-charcoal">
              <CheckBadge />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        {/* CTA block */}
        {/* F-84: поля плашки призыва приведены к макету (.container + .cta-panel).
            Макет: ширина min(1280px, 90vw), центр по экрану, паддинг
            clamp(1.5rem,3vw,2.5rem). У нас плашка сидела внутри контейнера с
            px-8, поэтому на 1440 стояла на left=112 шириной 1216 вместо 80/1280
            — заголовок призыва уезжал на 144/1152 против 120/1200 в макете.
            left-1/2 + -translate-x-1/2 центрируют плашку по экрану, не трогая
            остальные блоки колонки (F-72/F-73 не задеты). */}
        <section className="my-10 relative left-1/2 -translate-x-1/2 w-[min(1280px,90vw)] p-[clamp(1.5rem,3vw,2.5rem)] bg-charcoal text-cream rounded-2xl">
          <h2 className="font-heading text-2xl md:text-3xl font-extrabold mb-3">
            {s(T.cta.heading)}
          </h2>
          <p className="text-cream/80 mb-6 leading-relaxed max-w-2xl">
            {s(T.cta.text)}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-3xl">
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
          <SectionHeading eyebrow="Leistungsumfang" compact className="mb-4">
            {s(T.leistungen.heading)}
          </SectionHeading>
          <p className="text-base text-charcoal-light mb-5 leading-relaxed max-w-[76ch] mx-auto text-center">
            {s(T.leistungen.intro)}
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 max-w-[860px] mx-auto">
            {T.leistungen.items.map((item) => (
              <li key={item} className="flex items-start gap-2 text-charcoal">
                <CheckBadge />
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
          <SectionHeading eyebrow="Ihre Vorteile" compact className="mb-5">
            {s(T.warum.heading)}
          </SectionHeading>
          <ul className="space-y-3 max-w-[860px] mx-auto">
            {T.warum.items.map((u) => (
              <li key={u} className="flex items-start gap-3 text-charcoal">
                <CheckBadge />
                <span>{u}</span>
              </li>
            ))}
            <li className="flex items-start gap-3 text-charcoal">
              <CheckBadge />
              <span>{s(T.warum.cityLine)}</span>
            </li>
          </ul>
        </section>

        <hr className="my-10 border-sand/30" />

        {/* Einsatzgebiet */}
        <section className="mb-10 max-w-[76ch] mx-auto">
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
          <div className="space-y-3 max-w-[860px] mx-auto">
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
    </>
  );
}
