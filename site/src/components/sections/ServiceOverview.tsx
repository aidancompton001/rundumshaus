"use client";

import servicesData from "@/data/services.json";
import type { Service } from "@/data/types";
import { ScrollReveal, Stagger } from "@/components/motion";
import { getHref, getImageUrl, toResponsiveWebpSrcSet } from "@/lib/getImageUrl";
import { serviceIconMap, DefaultIcon } from "@/components/ServiceIcons";
import SectionHeading from "@/components/ui/SectionHeading";
import dach from "@/data/templates/dacharbeiten.json";
import entruempelung from "@/data/templates/entruempelung.json";
import galabau from "@/data/templates/garten-landschaftsbau.json";
import garten from "@/data/templates/gartenpflege.json";
import hausmeister from "@/data/templates/hausmeisterservice.json";

const { services, heading, subheading } = servicesData as {
  heading: string;
  subheading: string;
  services: Service[];
};

// Позиции под названием услуги — из файлов клиента, не сочинённые.
// В макете их ровно четыре на карточку (index.html, .card-bullets).
const BULLETS: Record<string, string[]> = {
  dacharbeiten: dach.leistungen.items,
  entruempelung: entruempelung.leistungen.items,
  "garten-landschaftsbau": galabau.leistungen.items,
  gartenpflege: garten.leistungen.items,
  hausmeisterservice: hausmeister.leistungen.items,
};

/**
 * Карточки услуг по макету (docs/design/v1-desktop/index.html, `.service-card`):
 * фото 7:5 сверху, круглая иконка наполовину поверх фото, название,
 * четыре позиции с точками, ссылка «Mehr erfahren». Пять в ряд.
 *
 * Прежняя карточка была фото + название + абзац описания, без позиций
 * и без иконки поверх фото — то есть старой вёрсткой в новых цветах.
 */
export default function ServiceOverview() {
  return (
    <section className="py-14 md:py-24 bg-paper">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="mb-10 md:mb-12">
          <SectionHeading subheading={subheading}>
            {heading}
          </SectionHeading>
        </ScrollReveal>

        <Stagger
          staggerDelay={100}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5"
        >
          {services.map((service) => {
            const Icon = serviceIconMap[service.icon] || DefaultIcon;
            const bullets = (BULLETS[service.id] || []).slice(0, 4);
            return (
              <article
                key={service.id}
                className="bg-white rounded-[14px] shadow-[0_6px_22px_rgba(16,23,31,0.07)]
                  hover:shadow-[0_14px_32px_rgba(16,23,31,0.14)] transition-shadow
                  flex flex-col min-w-0"
              >
                {service.image && (
                  <div className="rounded-t-[14px] overflow-hidden aspect-[7/5] bg-black/5">
                    <picture>
                      <source
                        type="image/webp"
                        srcSet={toResponsiveWebpSrcSet(service.image, [400, 800])}
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 20vw"
                      />
                      <img
                        src={getImageUrl(service.image)}
                        alt={service.imageAlt ?? service.title}
                        width={600}
                        height={429}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </picture>
                  </div>
                )}

                <div className="px-4 pb-5 flex flex-col flex-1">
                  {/* Иконка наполовину заходит на фото — подпись макета */}
                  <span className="w-14 h-14 rounded-full bg-copper text-white grid place-items-center
                    -mt-7 mb-3 border-[3px] border-white flex-none">
                    <Icon className="w-6 h-6" />
                  </span>

                  <h3 className="font-heading text-[1.1875rem] font-bold text-ink
                    hyphens-auto [overflow-wrap:anywhere] min-h-[2.6em] mb-2">
                    {service.title}
                  </h3>

                  <ul className="mb-4 flex-1 space-y-1.5">
                    {bullets.map((b) => (
                      <li
                        key={b}
                        className="relative pl-[1.05rem] text-sm text-sand leading-snug
                          hyphens-auto [overflow-wrap:anywhere]
                          before:content-[''] before:absolute before:left-0 before:top-[0.5em]
                          before:w-1.5 before:h-1.5 before:rounded-full before:bg-copper"
                      >
                        {b}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={getHref(`/leistungen/${service.id}/osnabrueck/`)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-copper
                      hover:gap-2.5 transition-all mt-auto"
                  >
                    Mehr erfahren
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h14m-6-6 6 6-6 6" />
                    </svg>
                  </a>
                </div>
              </article>
            );
          })}
        </Stagger>

        <ScrollReveal className="text-center mt-12">
          <a
            href={getHref("/leistungen/") + "#weitere"}
            className="inline-flex items-center gap-2 border-2 border-ink/20 hover:border-copper
              text-ink hover:text-copper px-6 py-3 rounded-[10px] font-semibold transition-colors"
          >
            Weitere Dienstleistungen
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
