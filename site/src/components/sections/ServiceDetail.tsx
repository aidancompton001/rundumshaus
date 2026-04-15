"use client";

import servicesData from "@/data/services.json";
import type { Service } from "@/data/types";
import { ScrollReveal, Stagger } from "@/components/motion";

const { services, heading, subheading } = servicesData as {
  heading: string;
  subheading: string;
  services: Service[];
};

const iconMap: Record<string, string> = {
  wrench: "🔧",
  leaf: "🌿",
  home: "🏠",
  truck: "🚛",
  recycle: "♻️",
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

        <Stagger staggerDelay={0.12} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="group relative bg-cream-dark/30 backdrop-blur-xl border border-sand/20 rounded-2xl p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-copper/30"
            >
              <div className="flex items-start gap-4 mb-4">
                <span className="text-5xl flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
                  {iconMap[service.icon] || "⚡"}
                </span>
                <div>
                  <h2 className="font-heading text-2xl font-bold text-charcoal group-hover:text-copper transition-colors">
                    {service.title}
                  </h2>
                </div>
              </div>
              <p className="text-charcoal-light leading-relaxed">
                {service.detailDescription}
              </p>
            </div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
