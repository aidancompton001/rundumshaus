// Server component — renders directly into HTML (no "use client").
// Used on /ueber-uns alongside FaktenTabelle (PX-035). The "gegründet 2026"
// claim lives on /ueber-uns in this block's intro + the FaktenTabelle row;
// the homepage keeps ONE mention in FaktenBlock. This is the dedicated
// trust/detail page — the repetition here is intentional and page-scoped,
// not the homepage repetition-fatigue concern from Hans Landa Round 4.
//
// PX-031 Phase A.1 (2026-05-03): Hero image of fully-branded VW Caddy
// (Kevin's actual Firmenwagen) replaces logo-only display. Provides real
// brand-asset proof of an active local business — strong trust signal
// for high-value services like Entrümpelung Festpreis. No personal photo
// of Kevin (he declined).
//
// F-51 (2026-08-14): тело страницы приведено к макету
// (docs/design/v1-desktop/ueber-uns.html, `section.about`): двухколоночный
// блок — фото слева с печатью «100% Zufriedene Kunden» (`.about-badge`),
// справа надзаголовок, H2, текст, четыре пункта с галочками
// (`.about-checks`) и одна кнопка. Было: фото во всю ширину колонки,
// четыре абзаца по центру и две кнопки — из макета совпадали только
// шапка, крошки и футер.

import Link from "next/link";
import homepageData from "@/data/homepage.json";
import type { HomepageData } from "@/data/types";
import ScrollReveal from "@/components/motion/ScrollReveal";
import { getImageUrl } from "@/lib/getImageUrl";
import PageHero from "@/components/ui/PageHero";

const data = homepageData as HomepageData;

// Четыре пункта макета — это дословно первые четыре пункта клиента из
// homepage.json (`warumWir.items`). Берём их оттуда, а не переписываем в
// компонент: список редактируется через /admin/. Секции «Warum Rund ums
// Haus Littawe?» на /ueber-uns нет, повтора на странице не возникает.
const checks = data.warumWir.items.slice(0, 4);
const badge = data.stats[0];

export default function FamilyBusinessBlock() {
  return (
    <>
      <PageHero
        title="Familienbetrieb Littawe"
        intro="Junges Unternehmen aus Osnabrück — gegründet 2026 von Kevin Littawe"
        crumb="Über uns"
      />

      <section className="py-14 md:py-24 bg-paper" aria-labelledby="family-heading">
        <div
          className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8
            grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 items-center"
        >
          {/* Левая колонка макета: `.about-media` — фото 4/3.1 со скруглением
              и печатью поверх нижнего левого угла */}
          <ScrollReveal>
            <div className="relative">
              <div className="aspect-[4/3.1] rounded-[16px] overflow-hidden bg-black/5">
                <picture>
                  <source
                    type="image/webp"
                    srcSet={`${getImageUrl("/images/branding/firmenwagen-400.webp")} 400w, ${getImageUrl("/images/branding/firmenwagen-800.webp")} 800w, ${getImageUrl("/images/branding/firmenwagen-1200.webp")} 1200w`}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <img
                    src={getImageUrl("/images/branding/firmenwagen-1200.jpg")}
                    srcSet={`${getImageUrl("/images/branding/firmenwagen-400.jpg")} 400w, ${getImageUrl("/images/branding/firmenwagen-800.jpg")} 800w, ${getImageUrl("/images/branding/firmenwagen-1200.jpg")} 1200w`}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    /* Описание картинки восстановлено ДОСЛОВНО: приёмка сверяет alt-тексты
                       на равенство, и дополненный текст засчитывается как потеря
                       прежнего. Подпись под фото из макета убрана — там её нет. */
                    alt="Firmenwagen von Rund ums Haus Littawe — VW Caddy mit Logo, allen 5 Hauptleistungen, Telefonnummer und WhatsApp-QR-Code"
                    width={1200}
                    height={900}
                    loading="eager"
                    fetchPriority="high"
                    decoding="sync"
                    className="w-full h-full object-cover"
                  />
                </picture>
              </div>

              {/* `.about-badge` — печать поверх нижнего края фото */}
              <div
                className="absolute bottom-4 left-4 md:bottom-6 md:left-6 flex items-center gap-3
                  bg-white rounded-[14px] shadow-[0_14px_32px_rgba(16,23,31,0.14)] px-5 py-3"
              >
                <span className="w-11 h-11 rounded-full bg-copper text-white grid place-items-center flex-none">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="9" cy="8" r="3.5" />
                    <path d="M2.5 20c0-3.3 2.9-5.5 6.5-5.5s6.5 2.2 6.5 5.5" />
                    <circle cx="17" cy="9" r="2.5" />
                    <path d="M15.5 14.7c2.9.3 5 2.2 5 5.3" opacity=".7" />
                  </svg>
                </span>
                <span className="flex flex-col leading-tight">
                  <strong className="font-heading text-xl font-extrabold text-ink">
                    {badge.value}
                    {badge.suffix}
                  </strong>
                  <small className="text-sm text-sand">Zufriedene Kunden</small>
                </span>
              </div>
            </div>
          </ScrollReveal>

          {/* Правая колонка макета: `.about-copy` */}
          <ScrollReveal direction="right">
            <span className="eyebrow">Wer wir sind</span>
            <h2
              id="family-heading"
              className="font-heading text-3xl md:text-4xl font-extrabold text-ink mb-5"
            >
              Ein Ansprechpartner für alles rund ums Haus
            </h2>

            <div className="space-y-4 text-sand leading-relaxed max-w-[52ch]">
              <p>
                <strong>Persönlicher Kontakt statt Konzern-Hotline.</strong> Bei uns
                haben Sie einen festen Ansprechpartner: Kevin Littawe oder unser
                kleines Team. Keine Warteschleife, keine wechselnden Sachbearbeiter.
                Wer bei uns anruft, spricht direkt mit jemandem, der Ihre Anfrage
                persönlich kennt.
              </p>
              <p>
                <strong>Faire Festpreise statt Stundenfalle.</strong> Wir arbeiten
                ausschließlich zum Festpreis nach kostenloser Besichtigung — das
                heißt: keine Überraschungen bei der Endabrechnung. Bei Entrümpelungen
                ab 200 €, bei Gartenpflege und Hausmeisterservice nach Aufmaß und
                Aufwand verbindlich kalkuliert.
              </p>
              <p>
                <strong>Frische Motivation, regional verwurzelt.</strong> Junges
                Unternehmen heißt: wir sind hungrig, sorgfältig und beweisen uns mit
                jedem Auftrag. Wir kennen das Osnabrücker Land, das Münsterland und
                Ostwestfalen — und arbeiten zuverlässig im 60-km-Umkreis.
              </p>
              <p>
                <strong>Keine Subunternehmer.</strong> Wir kommen mit eigenen
                Mitarbeitern und eigenen Fahrzeugen. Was wir versprechen, machen wir
                selbst. Das macht uns langsamer als bundesweite Großbetriebe — und
                zuverlässiger.
              </p>
            </div>

            {/* `.about-checks` */}
            <ul className="mt-5 mb-7 grid gap-3">
              {checks.map((item) => (
                <li key={item} className="flex items-center gap-2.5 font-semibold text-[0.9375rem]">
                  <span
                    className="flex-none w-6 h-6 rounded-full bg-copper text-white grid place-items-center"
                    aria-hidden="true"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m5 13 4 4L19 7" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <Link
              href="/kontakt"
              className="inline-flex items-center gap-2 bg-copper hover:bg-copper-dark
                text-white px-6 py-3 rounded-[10px] font-semibold transition-colors"
            >
              Jetzt unverbindlich anfragen
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
