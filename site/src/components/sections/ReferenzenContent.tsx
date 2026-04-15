"use client";

import referenzenData from "@/data/referenzen.json";
import type { ReferenzenData } from "@/data/types";
import { ScrollReveal, Stagger } from "@/components/motion";
import BeforeAfter from "./BeforeAfter";

const data = referenzenData as ReferenzenData;

export default function ReferenzenContent() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-charcoal mb-4">
            {data.heading}
          </h1>
        </ScrollReveal>

        {data.items.length === 0 ? (
          /* Empty state */
          <ScrollReveal className="text-center py-20">
            <div className="max-w-md mx-auto">
              <span className="text-6xl block mb-6">📷</span>
              <p className="text-charcoal-light text-lg animate-pulse">
                {data.emptyState}
              </p>
            </div>
          </ScrollReveal>
        ) : (
          /* Grid of before/after items */
          <Stagger staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.items.map((item) => (
              <div key={item.id} className="space-y-3">
                <BeforeAfter
                  before={item.before}
                  after={item.after}
                  title={item.title}
                />
                <h3 className="font-heading text-lg font-semibold text-charcoal">
                  {item.title}
                </h3>
                <p className="text-charcoal-light text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  );
}
