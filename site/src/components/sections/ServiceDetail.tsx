"use client";

import servicesData from "@/data/services.json";
import type { Service } from "@/data/types";
import { ScrollReveal } from "@/components/motion";
import { getHref, getImageUrl, toWebp } from "@/lib/getImageUrl";
import dach from "@/data/templates/dacharbeiten.json";
import entruempelung from "@/data/templates/entruempelung.json";
import galabau from "@/data/templates/garten-landschaftsbau.json";
import garten from "@/data/templates/gartenpflege.json";
import hausmeister from "@/data/templates/hausmeisterservice.json";
import BrushDivider from "@/components/ui/BrushDivider";

const { services, heading, subheading } = servicesData as {
  heading: string;
  subheading: string;
  services: Service[];
};

// Позиции услуги — из файлов клиента. В макете их шесть на блок, в две колонки.
const ITEMS: Record<string, string[]> = {
  dacharbeiten: dach.leistungen.items,
  entruempelung: entruempelung.leistungen.items,
  "garten-landschaftsbau": galabau.leistungen.items,
  gartenpflege: garten.leistungen.items,
  hausmeisterservice: hausmeister.leistungen.items,
};

function Check() {
  return (
    <span className="flex-none w-6 h-6 rounded-full bg-copper grid place-items-center mt-0.5" aria-hidden="true">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
        <path d="m5 13 4 4L19 7" />
      </svg>
    </span>
  );
}

/**
 * Страница услуг по макету (docs/design/v1-desktop/leistungen.html):
 * тёмная шапка страницы с H1, затем блоки услуг — фото и текст в две
 * колонки, стороны чередуются, под текстом шесть позиций с галочками
 * в два столбца и кнопка «Jetzt anfragen». Между блоками тонкая линия.
 *
 * Прежняя страница была сеткой карточек 2×3 — старой вёрсткой.
 */
export default function ServiceDetail() {
  return (
    <>
      <section className="bg-dark text-white relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 md:pt-16 md:pb-20">
          <nav className="flex flex-wrap gap-1.5 text-sm text-white/70 mb-4" aria-label="Brotkrumen-Navigation">
            <a href={getHref("/")} className="hover:text-white">Startseite</a>
            <span aria-hidden="true">›</span>
            <span aria-current="page">Leistungen</span>
          </nav>
          <h1 className="font-heading font-black text-3xl md:text-[2.875rem] leading-tight max-w-[24ch] mb-4">
            {heading}
          </h1>
          <p className="text-white/70 max-w-[62ch] text-lg">{subheading}</p>
        </div>
        <BrushDivider />
      </section>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {services.map((service, i) => {
          const img = service.detailImage || service.image || "";
          const items = (ITEMS[service.id] || []).slice(0, 6);
          return (
            <ScrollReveal key={service.id}>
              <section
                id={service.id}
                className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]
                  gap-7 lg:gap-12 items-center py-10 md:py-14
                  border-b border-ink/10 last:border-b-0"
              >
                {img && (
                  <div className={i % 2 === 1 ? "md:order-2" : ""}>
                    <picture>
                      <source type="image/webp" srcSet={getImageUrl(toWebp(img))} />
                      <img
                        src={getImageUrl(img)}
                        alt={service.imageAlt ?? service.title}
                        width={800}
                        height={571}
                        className="w-full aspect-[7/5] object-cover rounded-[16px]"
                        loading="lazy"
                        decoding="async"
                      />
                    </picture>
                  </div>
                )}

                <div>
                  <h2 className="font-heading text-2xl md:text-[2.1875rem] font-extrabold text-ink hyphens-auto mb-3">
                    {service.title}
                  </h2>
                  <p className="text-sand leading-relaxed">{service.detailDescription}</p>

                  {items.length > 0 && (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 my-5">
                      {items.map((t) => (
                        <li key={t} className="flex items-start gap-2.5 text-[0.9375rem] font-semibold
                          text-ink hyphens-auto [overflow-wrap:anywhere]">
                          <Check />
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex flex-wrap items-center gap-4">
                    <a
                      href={getHref("/kontakt/")}
                      className="inline-flex items-center gap-2 bg-copper hover:bg-copper-dark
                        text-white px-5 py-3 rounded-[10px] font-semibold transition-colors"
                    >
                      Jetzt anfragen
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12h14m-6-6 6 6-6 6" />
                      </svg>
                    </a>
                    <a
                      href={`/leistungen/${service.id}/osnabrueck/`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-copper hover:underline"
                    >
                      Mehr erfahren
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              </section>
            </ScrollReveal>
          );
        })}
      </div>
    </>
  );
}
