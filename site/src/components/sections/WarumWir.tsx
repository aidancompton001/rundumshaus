"use client";

// PX-064: 8 checkmarks per Kevin's verbatim Startseite text.
// PX-070: texts moved to homepage.json (CMS-editable) — no hardcoded content.

import homepageData from "@/data/homepage.json";
import type { HomepageData } from "@/data/types";
import { ScrollReveal, Stagger } from "@/components/motion";
import SectionHeading from "@/components/ui/SectionHeading";

const data = (homepageData as HomepageData).warumWir;

export default function WarumWir() {
  return (
    <section className="py-20 md:py-28 bg-charcoal text-cream">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="mb-14">
          <SectionHeading onDark subheading={data.subheading}>
            {data.heading}
          </SectionHeading>
        </ScrollReveal>

        <Stagger
          staggerDelay={80}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {data.items.map((reason) => (
            <div
              key={reason}
              className="flex items-center gap-4 bg-charcoal-light/30 border border-cream/10 rounded-xl px-6 py-5 transition-colors hover:border-gold/40"
            >
              <span
                className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-gold/15 text-gold"
                aria-hidden="true"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="font-body text-base font-medium">{reason}</span>
            </div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
