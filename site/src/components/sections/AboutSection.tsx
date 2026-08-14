"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import homepageData from "@/data/homepage.json";
import type { HomepageData } from "@/data/types";
import { ScrollReveal } from "@/components/motion";
import { useMotion } from "@/components/motion/MotionProvider";
import { getHref, getImageUrl, toResponsiveWebpSrcSet } from "@/lib/getImageUrl";

gsap.registerPlugin(ScrollTrigger);

const data = homepageData as HomepageData;

/** Шрифт рукописной приписки — стек макета (tokens.css, --font-hand).
    Токена --font-hand в globals.css нет, а globals.css вне скоупа этой
    правки, поэтому стек задан здесь тем же составом, что в макете. */
const HAND_FONT = '"Segoe Script", "Bradley Hand", "Comic Sans MS", cursive';

/** Иконки полосы цифр — обводка 1.6 как в макете (section.stats, .stat-icon) */
const STAT_ICONS: Record<string, ReactNode> = {
  Kundenzufriedenheit: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.3 2.9-5.5 6.5-5.5s6.5 2.2 6.5 5.5" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M15.5 14.7c2.9.3 5 2.2 5 5.3" />
    </>
  ),
  Leistungsbereiche: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v4m8-4v4" />
    </>
  ),
  "Schnelle Reaktionszeit": (
    <>
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
};

function StatIcon({ label }: { label: string }) {
  const paths = STAT_ICONS[label];
  if (!paths) return null;
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-copper mx-auto mb-2"
      aria-hidden="true"
    >
      {paths}
    </svg>
  );
}

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
      <StatIcon label={label} />
      {/* Цифры в макете белые, зелёный остаётся только на иконке */}
      <div className="font-heading text-[1.9375rem] font-extrabold text-white leading-[1.1] mb-1">
        <span ref={ref}>{reducedMotion ? value : 0}</span>
        <span>{suffix}</span>
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
      <section className="relative overflow-hidden py-14 md:py-24 bg-white">
        {/* Водяной знак макета (.about-watermark): диагональные шевроны
            справа, контур цвета --color-ink на 5 % — только десктоп */}
        <svg
          viewBox="0 0 300 300"
          fill="none"
          stroke="currentColor"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="hidden md:block pointer-events-none absolute z-0
            right-[-2rem] top-1/2 -translate-y-1/2 w-[clamp(220px,26vw,380px)]
            text-ink opacity-5"
        >
          <path d="M20 220 120 120l60 60L280 80" />
          <path d="M60 280 160 180l60 60 60-60" />
          <path d="M-20 160 80 60l60 60 100-100" />
        </svg>

        <div className="relative z-[1] max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8
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

              {/* Печать макета (.about-badge): лежит ВНУТРИ фото у левого
                  нижнего угла, кружок иконки залит акцентом, значок белый.
                  Раньше печать выступала за край фото, а кружок был бледным */}
              <div className="absolute bottom-3 left-3 md:bottom-5 md:left-5 flex items-center gap-3
                bg-white rounded-[14px] shadow-[0_14px_32px_rgba(16,23,31,0.14)] px-[1.1rem] py-[0.8rem]">
                <span className="w-11 h-11 rounded-full bg-copper text-white grid place-items-center flex-none">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="9" cy="8" r="3.5" />
                    <path d="M2.5 20c0-3.3 2.9-5.5 6.5-5.5s6.5 2.2 6.5 5.5" />
                    <circle cx="17" cy="9" r="2.5" />
                    <path d="M15.5 14.7c2.9.3 5 2.2 5 5.3" opacity=".7" />
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

            {/* Четыре галочки макета (.about-checks): первая половина
                warumWir.items. Источник — ОДИН массив клиента в
                homepage.json, который Кевин правит через /admin/; делить
                его в данных нельзя, поэтому деление живёт здесь, в коде.
                Вторую половину — items.slice(4) — показывает секция
                «Warum Rund ums Haus Littawe?», так что ни один пункт
                не встречается на странице дважды. */}
            {/* Отступ снизу даёт mt-7 у кнопки — как margin-bottom 1.75rem
                у .about-checks в макете; дублировать его тут не нужно */}
            <ul className="grid gap-[0.7rem] mt-5">
              {data.warumWir.items.slice(0, 4).map((item) => (
                <li key={item} className="flex items-center gap-[0.6rem]
                  text-[0.9375rem] font-semibold text-ink
                  [overflow-wrap:anywhere] hyphens-auto min-w-0">
                  <span
                    className="flex-none w-6 h-6 rounded-full bg-copper text-white grid place-items-center"
                    aria-hidden="true"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m5 13 4 4L19 7" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>

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

            {/* Рукописная приписка макета (.about-note): декор, не текст
                клиента — поэтому aria-hidden и скрыта на мобильном,
                ровно как в макете */}
            <p
              aria-hidden="true"
              className="hidden md:block relative mt-4 max-w-[240px] text-[1.25rem]
                text-copper-light -rotate-[4deg]"
              style={{ fontFamily: HAND_FONT }}
            >
              Direkt &amp; persönlich für Sie da!
              <svg
                viewBox="0 0 60 44"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="56"
                height="40"
                className="mt-1"
                aria-hidden="true"
              >
                <path d="M52 6C40 10 20 12 12 30" />
                <path d="m8 24 4 8 9-3" />
              </svg>
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Тёмная полоса с цифрами — отдельная секция макета (section.stats) */}
      <section className="bg-dark text-white py-10 md:py-12" aria-label="Zahlen und Fakten">
        {/* Разделители между колонками — как в макете (.stat border-left).
            На мобильном колонки складываются, и линия переезжает наверх */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8
          grid grid-cols-1 sm:grid-cols-3 text-center">
          {data.stats.map((stat) => (
            <div
              key={stat.label}
              className="px-3 lg:px-8 py-5 sm:py-0
                border-t border-white/[0.14] first:border-t-0
                sm:border-t-0 sm:border-l sm:first:border-l-0
                [overflow-wrap:anywhere] hyphens-auto min-w-0"
            >
              <Counter
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                reducedMotion={reducedMotion}
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
