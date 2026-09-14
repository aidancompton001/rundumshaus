// T012: Entkernung & Abbrucharbeiten — городская страница по тексту Кевина.
// Все видимые тексты — из src/data/templates/entkernung-abbrucharbeiten.json
// (правится в админке). Вёрстка — по образцу EntruempelungCityTemplate;
// разделы умеют необязательный список (listIntro + items + paragraphsAfter).

import { Fragment } from "react";
import Link from "next/link";
import type { City } from "@/lib/programmatic";
import { subst } from "@/lib/template-text";
import {
  ENTKERNUNG_TEXTS as T,
  getEntkernungFaqs,
  getEntkernungFirmaItems,
  type EntkernungSection,
} from "@/lib/template-content-entkernung";
import { getImageUrl, toWebp } from "@/lib/getImageUrl";
import siteData from "@/data/site.json";
import { WhatsAppIcon, PhoneIcon, EnvelopeIcon } from "@/components/ContactIcons";
import SectionHeading from "@/components/ui/SectionHeading";

const PHONE = (siteData as { phone: string }).phone.replace(/\s+/g, "");
const EMAIL = (siteData as { email: string }).email;
const WA = PHONE.replace(/^\+/, "");
const SERVICE_PATH = "entkernung-abbrucharbeiten";
const heroBase = (T.heroImage ?? "").replace(/\.(png|jpe?g|webp)$/i, "");
const HERO = {
  w1200: `${heroBase}-1200w.webp`,
  w800: `${heroBase}-800w.webp`,
  w400: `${heroBase}-400w.webp`,
  fallback: T.heroImage,
};

const CHIP =
  "inline-flex items-center px-3 py-1.5 text-sm bg-cream-dark border border-sand/40 rounded-full text-charcoal hover:border-copper hover:text-copper transition max-w-xs break-words";

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

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 my-5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-charcoal">
          <CheckBadge />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Paragraphs({ items, s }: { items: string[]; s: (t: string) => string }) {
  return (
    <>
      {items.map((p, i) => (
        <p key={i} className="text-base text-charcoal-light mb-4 last:mb-0 leading-relaxed">
          {s(p)}
        </p>
      ))}
    </>
  );
}

interface Props {
  city: City;
  neighbors: City[];
  allOtherCities: City[];
}

export default function EntkernungCityTemplate({ city, neighbors, allOtherCities }: Props) {
  const visibleNeighbors = neighbors.slice(0, 30);
  const visibleSlugs = new Set(visibleNeighbors.map((n) => n.slug));
  const extraCities = allOtherCities.filter((c) => !visibleSlugs.has(c.slug));
  const s = (text: string) => subst(text, { city: city.displayName });
  // F-01 (Ланда): раздел фирмы — утверждения о самой фирме. {city} здесь не
  // подставляется: иначе правка в админке («Entkernungsfirma in {city}») дала бы
  // ложный адрес фирмы на 97 страницах. Валидатор админки запрещает {city} там же.
  const raw = (text: string) => text;
  const faqs = getEntkernungFaqs(city);
  const firmaItems = getEntkernungFirmaItems(city);

  const renderSection = (sec: EntkernungSection, key: string) => (
    <Fragment key={key}>
      <hr className="my-10 border-sand/30" />
      <section className="mb-10 max-w-[76ch] mx-auto">
        <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-charcoal mb-4">
          {s(sec.heading)}
        </h2>
        <Paragraphs items={sec.paragraphs} s={s} />
        {sec.listIntro && (
          <p className="text-base text-charcoal font-semibold mt-4 leading-relaxed">{s(sec.listIntro)}</p>
        )}
        {sec.items && sec.items.length > 0 && <CheckList items={sec.items.map(s)} />}
        {sec.paragraphsAfter && <Paragraphs items={sec.paragraphsAfter} s={s} />}
      </section>
    </Fragment>
  );

  return (
    <>
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

          <div className="max-w-[76ch]">
            {T.intro.map((p, i) => (
              <p
                key={i}
                className={i === 0 ? "text-lg text-charcoal-light leading-relaxed mb-5" : "text-base text-charcoal-light leading-relaxed mb-5"}
              >
                {s(p)}
              </p>
            ))}
          </div>

          {T.sectionsBefore.map((sec, i) => renderSection(sec, `b${i}`))}

          <hr className="my-10 border-sand/30" />

          <section className="mb-10">
            <SectionHeading eyebrow="Leistungsumfang" compact className="mb-4">
              {s(T.leistungen.heading)}
            </SectionHeading>
            <p className="text-base text-charcoal-light mb-5 leading-relaxed max-w-[76ch] mx-auto text-center">
              {s(T.leistungen.intro)}
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 max-w-[860px] mx-auto">
              {T.leistungen.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-charcoal">
                  <CheckBadge />
                  <span className="text-sm">{s(item)}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-charcoal-light italic mt-5 max-w-[860px] mx-auto">
              {s(T.leistungen.footnote)}
            </p>
          </section>

          {T.sectionsAfter.map((sec, i) => renderSection(sec, `a${i}`))}

          <hr className="my-10 border-sand/30" />

          <section className="mb-10 max-w-[76ch] mx-auto">
            <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-charcoal mb-4">
              {raw(T.firma.heading)}
            </h2>
            <Paragraphs items={T.firma.paragraphs} s={raw} />
            <p className="text-base text-charcoal font-semibold mt-4 leading-relaxed">{raw(T.firma.listIntro)}</p>
            <CheckList items={firmaItems} />
            <Paragraphs items={T.firma.paragraphsAfter} s={raw} />
          </section>

          {T.sectionsEnd.map((sec, i) => renderSection(sec, `e${i}`))}

          <section className="my-10 relative left-1/2 -translate-x-1/2 w-[min(1280px,90vw)] p-[clamp(1.5rem,3vw,2.5rem)] bg-charcoal text-cream rounded-2xl">
            <h2 className="font-heading text-2xl md:text-3xl font-extrabold mb-3">
              {s(T.cta.heading)}
            </h2>
            {T.cta.paragraphs.map((p, i) => (
              <p key={i} className="text-cream/80 mb-3 leading-relaxed max-w-2xl">
                {s(p)}
              </p>
            ))}
            <div className="my-6">
              <p className="font-heading font-extrabold text-lg">{T.cta.brand}</p>
              <p className="text-cream/80">{T.cta.tagline}</p>
              <p className="text-cream/80">{T.cta.location}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-3xl">
              <Link
                href="/kontakt/"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-copper text-white font-semibold rounded-lg hover:bg-copper-dark transition sm:col-span-2 md:col-span-3 lg:col-span-4"
              >
                <span>{T.cta.button}</span>
              </Link>
              <a
                href={`tel:${PHONE}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 border border-cream/40 text-cream font-semibold rounded-lg hover:bg-cream/10 transition whitespace-nowrap"
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
            </div>
          </section>

          <section className="mb-10">
            <SectionHeading eyebrow="FAQ" compact className="mb-6">
              {s(T.faq.heading)}
            </SectionHeading>
            <div className="space-y-3 max-w-[860px] mx-auto">
              {faqs.map((f, i) => (
                <details key={i} className="group bg-cream-dark border border-sand/30 rounded-xl p-4">
                  <summary className="cursor-pointer font-medium text-charcoal flex justify-between items-center">
                    <span>{f.q}</span>
                    <span className="ml-4 text-copper transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                  </summary>
                  <p className="mt-3 text-charcoal-light leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          <hr className="my-10 border-sand/30" />

          <section className="mb-10">
            <h3 className="font-heading text-xl font-extrabold text-charcoal mb-4">
              {s(T.weitereLeistungen.heading)}
            </h3>
            <div className="flex flex-wrap gap-2">
              {T.weitereLeistungen.links.map((l) => (
                <Link
                  key={l.servicePath + l.label}
                  href={l.isHub ? `/leistungen/${l.servicePath}/` : `/leistungen/${l.servicePath}/${city.slug}/`}
                  className={CHIP}
                >
                  {l.label} in {city.displayName}
                </Link>
              ))}
            </div>
          </section>

          {visibleNeighbors.length > 0 && (
            <section className="mb-10">
              <h3 className="font-heading text-xl font-extrabold text-charcoal mb-4">
                {s(T.einsatzorte.heading)}
              </h3>
              <div className="flex flex-wrap gap-2">
                {visibleNeighbors.map((n) => (
                  <Link key={n.slug} href={`/leistungen/${SERVICE_PATH}/${n.slug}/`} className={CHIP}>
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
                      <Link key={n.slug} href={`/leistungen/${SERVICE_PATH}/${n.slug}/`} className={CHIP}>
                        {subst(T.einsatzorte.chipLabel, { city: n.displayName })}
                      </Link>
                    ))}
                  </div>
                </details>
              )}
            </section>
          )}

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
