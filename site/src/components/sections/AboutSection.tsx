"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import homepageData from "@/data/homepage.json";
import type { HomepageData } from "@/data/types";
import { ScrollReveal } from "@/components/motion";
import { useMotion } from "@/components/motion/MotionProvider";
import { getHref, getImageUrl, toResponsiveWebpSrcSet } from "@/lib/getImageUrl";

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
      <div className="font-heading text-[1.9375rem] font-extrabold text-copper-light mb-1">
        <span ref={ref}>{reducedMotion ? value : 0}</span>
        <span className="text-copper-light">{suffix}</span>
      </div>
      <p className="text-white/70 text-[1.0625rem]">{label}</p>
    </div>
  );
}

export default function AboutSection() {
  const { reducedMotion } = useMotion();
  const heading = data.about.heading;

  return (
    <>
      {/* Блок «О нас» по макету (index.html, section.about): фото слева с
          печатью «100% Zufriedene Kunden», текст справа — заголовок, два
          абзаца клиента, четыре пункта с галочками и кнопка.
          Прежний блок был двумя колонками текст/фото без печати, галочек
          и кнопки, а плитки с цифрами стояли тут же вместо тёмной полосы. */}
      <section className="py-14 md:py-24 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8
          grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 items-center">

          <ScrollReveal>
            <div className="relative">
              <div className="aspect-[4/3] rounded-[16px] overflow-hidden bg-black/5">
                <picture>
                  <source
                    type="image/webp"
                    srcSet={toResponsiveWebpSrcSet(data.about.image, [400, 800, 1200])}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <img
                    src={getImageUrl(data.about.image)}
                    alt={data.about.imageAlt}
                    width={1200}
                    height={900}
                    className="w-full h-full object-cover"
                    fetchPriority="high"
                    loading="eager"
                    decoding="sync"
                  />
                </picture>
              </div>

              {/* Печать поверх нижнего края фото — подпись макета */}
              <div className="absolute -bottom-6 left-6 flex items-center gap-3
                bg-white rounded-[14px] shadow-[0_14px_32px_rgba(16,23,31,0.14)] px-5 py-3">
                <span className="w-11 h-11 rounded-full bg-copper/15 text-copper grid place-items-center flex-none">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="9" cy="8" r="3.5" />
                    <path d="M2.5 20c0-3.3 2.9-5.5 6.5-5.5s6.5 2.2 6.5 5.5" />
                  </svg>
                </span>
                <span className="flex flex-col leading-tight">
                  <strong className="font-heading text-xl font-extrabold text-ink">
                    {data.stats[0].value}{data.stats[0].suffix}
                  </strong>
                  <small className="text-sm text-sand">Zufriedene Kunden</small>
                </span>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-ink mb-5">
              {heading}
            </h2>
            <p className="text-sand text-lg leading-relaxed">{data.about.body}</p>
            {data.about.body2 && (
              <p className="text-sand text-lg leading-relaxed mt-4">{data.about.body2}</p>
            )}

            {/* Четыре пункта макета сюда не переносятся: ровно эти же
                восемь пунктов клиента идут следующей секцией «Warum Rund
                ums Haus Littawe?». В макете той секции нет, у Кевина есть,
                и повтор одного списка дважды подряд читается как ошибка. */}

            <a
              href={getHref("/ueber-uns/")}
              className="inline-flex items-center gap-2 mt-7 bg-copper hover:bg-copper-dark
                text-white px-6 py-3 rounded-[10px] font-semibold transition-colors"
            >
              Mehr über uns
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </a>
          </ScrollReveal>
        </div>
      </section>

      {/* Тёмная полоса с цифрами — отдельная секция макета (section.stats) */}
      <section className="bg-dark text-white py-10 md:py-12" aria-label="Zahlen und Fakten">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8
          grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
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
      </section>
    </>
  );
}
