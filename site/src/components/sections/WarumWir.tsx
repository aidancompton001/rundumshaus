"use client";

import { ScrollReveal, Stagger } from "@/components/motion";
import {
  ClockIcon,
  SparkleIcon,
  PriceTagIcon,
  CalendarIcon,
  HandshakeIcon,
} from "@/components/WarumWirIcons";
import type { FC } from "react";
import type { IconProps } from "@/components/icon-types";

const reasons: { title: string; Icon: FC<IconProps> }[] = [
  { title: "Zuverlässig & Pünktlich", Icon: ClockIcon },
  { title: "Saubere & Sorgfältige Arbeit", Icon: SparkleIcon },
  { title: "Faire & Transparente Preise", Icon: PriceTagIcon },
  { title: "Kurzfristige Termine Möglich", Icon: CalendarIcon },
  { title: "Alles aus einer Hand", Icon: HandshakeIcon },
];

export default function WarumWir() {
  return (
    <section className="py-20 md:py-28 bg-charcoal text-cream">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-14">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Warum wir?
          </h2>
          <p className="text-cream/70 text-lg max-w-2xl mx-auto">
            Was uns von anderen unterscheidet — und warum unsere Kunden uns
            weiterempfehlen.
          </p>
        </ScrollReveal>

        <Stagger
          staggerDelay={100}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="flex items-center gap-4 bg-charcoal-light/30 border border-cream/10 rounded-xl px-6 py-5 transition-colors hover:border-gold/40"
            >
              <reason.Icon
                className="w-7 h-7 flex-shrink-0"
                variant="light"
              />
              <span className="font-body text-base font-medium">
                {reason.title}
              </span>
            </div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
