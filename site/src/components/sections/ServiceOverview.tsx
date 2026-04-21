"use client";

import servicesData from "@/data/services.json";
import type { Service } from "@/data/types";
import { ScrollReveal } from "@/components/motion";
import { Stagger } from "@/components/motion";
import { getHref, getImageUrl, toResponsiveWebpSrcSet } from "@/lib/getImageUrl";
import { serviceIconMap, DefaultIcon } from "@/components/ServiceIcons";

const { services, heading, subheading } = servicesData as {
  heading: string;
  subheading: string;
  services: Service[];
};

export default function ServiceOverview() {
  return (
    <section className="py-20 md:py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-charcoal mb-4">
            {heading}
          </h2>
          <p className="text-charcoal-light text-lg max-w-2xl mx-auto">
            {subheading}
          </p>
        </ScrollReveal>

        <Stagger
          staggerDelay={100}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service) => (
            <a
              key={service.id}
              href={getHref("/leistungen")}
              className="group block bg-cream-dark border border-sand/30 rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-copper/30"
            >
              {service.image && (
                <div className="aspect-[16/10] overflow-hidden">
                  <picture>
                    <source
                      type="image/webp"
                      srcSet={toResponsiveWebpSrcSet(service.image, [400, 800, 1200])}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <img
                      src={getImageUrl(service.image)}
                      alt={service.title}
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
                <p className="text-charcoal-light text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            </a>
          ))}
        </Stagger>

        <ScrollReveal className="text-center mt-12">
          <a
            href={getHref("/weitere-leistungen")}
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
