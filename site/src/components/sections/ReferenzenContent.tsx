"use client";

import referenzenData from "@/data/referenzen.json";
import type { ReferenzenData } from "@/data/types";
import { ScrollReveal, Stagger } from "@/components/motion";
import { getImageUrl } from "@/lib/getImageUrl";

const data = referenzenData as ReferenzenData;

export default function ReferenzenContent() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-charcoal mb-4">
            {data.heading}
          </h1>
          <p className="text-charcoal-light text-lg max-w-2xl mx-auto">
            Vorher &amp; Nachher — unsere Arbeit spricht für sich.
          </p>
        </ScrollReveal>

        {data.items.length === 0 ? (
          <ScrollReveal className="text-center py-20">
            <div className="max-w-md mx-auto">
              <span className="text-6xl block mb-6">📷</span>
              <p className="text-charcoal-light text-lg animate-pulse">
                {data.emptyState}
              </p>
            </div>
          </ScrollReveal>
        ) : (
          <Stagger staggerDelay={100} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.items.map((item) => (
              <div
                key={item.id}
                className="group bg-cream-dark border border-sand/30 rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={getImageUrl(item.before)}
                    alt={`Vorher/Nachher — ${item.title}`}
                    width={800}
                    height={600}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-copper">
                      Vorher / Nachher
                    </span>
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-charcoal mb-2">
                    {item.title}
                  </h3>
                  <p className="text-charcoal-light text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  );
}
