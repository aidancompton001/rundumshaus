"use client";

import { useRef } from "react";
import homepageData from "@/data/homepage.json";
import type { HomepageData } from "@/data/types";
import { useMotion } from "@/components/motion/MotionProvider";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useSplitText } from "@/hooks/useSplitText";
import Lamp from "@/components/aceternity/Lamp";
import Spotlight from "@/components/aceternity/Spotlight";
import MovingBorder from "@/components/aceternity/MovingBorder";
import Button from "@/components/ui/Button";

const data = homepageData as HomepageData;

export default function Hero() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const { reducedMotion } = useMotion();
  const isMobile = useIsMobile();

  // On mobile: skip SplitText entirely for fastest LCP. Text appears instantly.
  // On desktop: full animation as designed.
  useSplitText(headingRef, reducedMotion, {
    type: "chars",
    yPercent: 150,
    ease: "power3.out",
    stagger: 0.03,
    duration: 0.8,
    disabled: isMobile,
  });

  useSplitText(subheadingRef, reducedMotion, {
    type: "words",
    yPercent: 0,
    ease: "power2.out",
    stagger: 0.04,
    duration: 0.6,
    disabled: isMobile,
  });

  return (
    <Lamp>
      <Spotlight className="w-full max-w-4xl mx-auto text-center">
        {/* LCP fix: no inline opacity:0 — text shown immediately for fast LCP.
            useSplitText sets opacity:0 inside useEffect (1-frame after first paint),
            then animates chars in. If JS fails or is slow, text remains visible. */}
        <h1
          ref={headingRef}
          className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-cream leading-tight mb-6"
        >
          {data.hero.heading}
        </h1>

        <p
          ref={subheadingRef}
          className="font-body text-lg sm:text-xl text-cream/70 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {data.hero.subheading}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {data.hero.ctas.map((cta) =>
            cta.variant === "primary" ? (
              <MovingBorder key={cta.href} href={cta.href}>
                {cta.label}
              </MovingBorder>
            ) : (
              <Button
                key={cta.href}
                href={cta.href}
                variant="ghost"
                size="lg"
                className="border-cream/30 text-cream hover:bg-cream/10 hover:text-cream"
              >
                {cta.label}
              </Button>
            )
          )}
        </div>

        {!isMobile && !reducedMotion && (
          <div className="mt-16 animate-bounce">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-cream/40 mx-auto"
            >
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </div>
        )}
      </Spotlight>
    </Lamp>
  );
}
