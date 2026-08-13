"use client";

import servicesData from "@/data/services.json";
import type { Service } from "@/data/types";
import { ScrollReveal } from "@/components/motion";
import { Stagger } from "@/components/motion";
import { getHref, getImageUrl, toResponsiveWebpSrcSet } from "@/lib/getImageUrl";
import { serviceIconMap, DefaultIcon } from "@/components/ServiceIcons";
import SectionHeading from "@/components/ui/SectionHeading";

const { services, heading, subheading } = servicesData as {
  heading: string;
  subheading: string;
  services: Service[];
};

export default function ServiceOverview() {
  return (
    <section className="py-20 md:py-28 bg-cream-dark/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="mb-16">
          <SectionHeading eyebrow="Unsere Leistungen" subheading={subheading}>
            {heading}
          </SectionHeading>
        </ScrollReveal>

        {/* Пять карточек в ряд, как в макете: там все услуги видны сразу.
            При трёх колонках две уезжали на вторую строку и терялись. */}
        <Stagger
          staggerDelay={100}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5"
        >
          {services.map((service) => (
            <a
              key={service.id}
              href={getHref(`/leistungen/${service.id}/osnabrueck/`)}
              className="group block bg-cream-dark border border-sand/30 rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-copper/30"
            >
              {service.image && (
                <div className="aspect-[16/10] overflow-hidden">
                  <picture>
                    <source
                      type="image/webp"
                      srcSet={toResponsiveWebpSrcSet(service.image, [400, 800])}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <img
                      src={getImageUrl(service.image)}
                      alt={service.imageAlt ?? service.title}
                      width={600}
                      height={375}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  {(() => {
                    const Icon = serviceIconMap[service.icon] || DefaultIcon;
                    return (
                      <Icon className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 transition-colors duration-300" />
                    );
                  })()}
                  <h3 className="font-heading text-xl font-semibold text-charcoal group-hover:text-copper transition-colors">
                    {service.title}
                  </h3>
                </div>
                <p className="text-charcoal-light text-sm leading-relaxed mb-4">
                  {service.description}
                </p>
                {/* Visible affordance — Kevin K1: "Mehr erfahren" button.
                    Not a nested <a> (parent is already <a>); styled as button-like span. */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold border border-copper/40 text-copper rounded-lg group-hover:border-copper group-hover:bg-copper/5 transition-colors">
                  Mehr erfahren
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </Stagger>

        <ScrollReveal className="text-center mt-12">
          <a
            href={getHref("/leistungen/") + "#weitere"}
            className="inline-flex items-center gap-2 border-2 border-charcoal/20 hover:border-copper text-charcoal hover:text-copper px-6 py-3 rounded-xl font-body font-semibold transition-colors duration-200"
          >
            Weitere Dienstleistungen
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
