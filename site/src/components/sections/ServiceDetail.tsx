"use client";

import servicesData from "@/data/services.json";
import type { Service } from "@/data/types";
import { ScrollReveal, Stagger } from "@/components/motion";
import { getImageUrl, toWebp } from "@/lib/getImageUrl";
import { serviceIconMap, DefaultIcon } from "@/components/ServiceIcons";
import ServiceFAQ from "@/components/sections/ServiceFAQ";
import FAQSchema from "@/components/sections/FAQSchema";
import SpezialthemenSection from "@/components/sections/SpezialthemenSection";

const { services, heading, subheading } = servicesData as {
  heading: string;
  subheading: string;
  services: Service[];
};

export default function ServiceDetail() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-charcoal mb-4">
            {heading}
          </h1>
          <p className="text-charcoal-light text-lg max-w-2xl mx-auto">
            {subheading}
          </p>
        </ScrollReveal>

        <Stagger staggerDelay={100} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="group relative bg-cream-dark border border-sand/30 rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-copper/30"
            >
              {(service.detailImage || service.image) && (() => {
                const imgSrc = service.detailImage || service.image || "";
                return (
                  <div className="aspect-[16/9] overflow-hidden">
                    <picture>
                      <source type="image/webp" srcSet={getImageUrl(toWebp(imgSrc))} />
                      <img
                        src={getImageUrl(imgSrc)}
                        alt={service.title}
                        width={800}
                        height={450}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                    </picture>
                  </div>
                );
              })()}
              <div className="p-8">
                <div className="flex items-start gap-4 mb-4">
                  {(() => {
                    const Icon = serviceIconMap[service.icon] || DefaultIcon;
                    return (
                      <Icon className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 transition-colors duration-300" />
                    );
                  })()}
                  <h2 className="font-heading text-2xl font-bold text-charcoal group-hover:text-copper transition-colors">
                    {service.title}
                  </h2>
                </div>
                <p className="text-charcoal-light leading-relaxed">
                  {service.detailDescription}
                </p>
                {/* PX-052 K2: "Mehr erfahren" CTA to Osnabrück city page.
                    Each service.id maps 1:1 to URL slug. */}
                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                  <a
                    href={`/leistungen/${service.id}/osnabrueck/`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold border border-copper/40 text-copper rounded-lg hover:border-copper hover:bg-copper/5 transition-colors"
                  >
                    Mehr erfahren
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                  {/* PX-053: Kevin asked to temporarily remove subPage links
                      ("erstmal raus" 2026-06-09 18:31). Data preserved in
                      services.json — uncomment to re-enable.
                  {service.subPage && (
                    <a
                      href={service.subPage.href}
                      className="text-copper font-semibold hover:underline"
                    >
                      {service.subPage.label}
                    </a>
                  )}
                  */}
                </div>
              </div>
            </div>
          ))}
        </Stagger>
      </div>

      {/* PX-059: Extra Dienstleistungen — Kevin wants these directly under the 5 main cards */}
      <SpezialthemenSection />

      {/* Local SEO FAQ — Gartenpflege + Entrümpelung (PX-022) */}
      <ServiceFAQ serviceId="gartenpflege" />
      <ServiceFAQ serviceId="entruempelung" />

      {/* Single combined Schema.org FAQPage (PX-024 fix: avoid duplicate FAQPage) */}
      <FAQSchema />
    </section>
  );
}
