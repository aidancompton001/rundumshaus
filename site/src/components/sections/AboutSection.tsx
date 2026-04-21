"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import homepageData from "@/data/homepage.json";
import type { HomepageData } from "@/data/types";
import { ScrollReveal } from "@/components/motion";
import { useMotion } from "@/components/motion/MotionProvider";
import { getImageUrl, toResponsiveWebpSrcSet } from "@/lib/getImageUrl";

gsap.registerPlugin(ScrollTrigger);

const data = homepageData as HomepageData;

function Counter({
  value,
  suffix,
  label,
  reducedMotion,
}: {
  value: number;
  suffix: string;
  label: string;
  reducedMotion: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current || reducedMotion) return;

    const obj = { val: 0 };
    const tween = gsap.to(obj, {
      val: value,
      duration: 2,
      ease: "power2.out",
      snap: { val: 1 },
      scrollTrigger: {
        trigger: ref.current,
        start: "top 85%",
        toggleActions: "play none none none",
      },
      onUpdate: () => {
        if (ref.current) ref.current.textContent = `${Math.round(obj.val)}`;
      },
    });

    return () => {
      tween.kill();
    };
  }, [value, reducedMotion]);

  return (
    <div className="text-center">
      <div className="font-heading text-4xl md:text-5xl font-bold text-copper mb-1">
        <span ref={ref}>{reducedMotion ? value : 0}</span>
        <span className="text-copper-light">{suffix}</span>
      </div>
      <p className="text-charcoal-light text-sm">{label}</p>
    </div>
  );
}

export default function AboutSection() {
  const { reducedMotion } = useMotion();

  return (
    <section className="py-20 md:py-28 bg-cream-dark/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <ScrollReveal>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-charcoal mb-6">
              {data.about.heading}
            </h2>
            <p className="text-charcoal-light text-lg leading-relaxed">
              {data.about.body}
            </p>
          </ScrollReveal>
          <ScrollReveal direction="right">
            <div className="aspect-[4/3] rounded-2xl bg-sand/20 overflow-hidden">
              <picture>
                <source
                  type="image/webp"
                  srcSet={toResponsiveWebpSrcSet("/images/about.png", [400, 800, 1200])}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <img
                  src={getImageUrl("/images/about.png")}
                  alt="Professionelle Gartenarbeit — Rund ums Haus Littawe"
                  width={1200}
                  height={800}
                  className="w-full h-full object-cover"
                  fetchPriority="high"
                  loading="eager"
                  decoding="sync"
                />
              </picture>
            </div>
          </ScrollReveal>
        </div>

        {/* Stats counter */}
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          {data.stats.map((stat) => (
            <Counter
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
