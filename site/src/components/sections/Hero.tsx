"use client";

import homepageData from "@/data/homepage.json";
import siteData from "@/data/site.json";
import type { HomepageData, SiteConfig } from "@/data/types";
import { getHref } from "@/lib/getImageUrl";
import { WhatsAppIcon } from "@/components/ContactIcons";
import BrushDivider from "@/components/ui/BrushDivider";

const data = homepageData as HomepageData;
const site = siteData as SiteConfig;
const WA = site.phone.replace(/[^\d]/g, "");

/**
 * Герой по макету клиента (docs/design/v1-desktop/index.html, `.hero`):
 * фото на всю ширину, тёмный градиент слева направо, две колонки — текст
 * и карточка преимуществ, бейджи с галочками, двухстрочные кнопки.
 *
 * Прежний герой был центрированной колонкой без карточки, бейджей и
 * WhatsApp — то есть старой вёрсткой в новых цветах.
 */

// Тексты бейджей и карточки — из макета, одобренного клиентом.
// Иконки те же, что в макете: щит, часы, монета, человек.
const BADGES = ["Zuverlässig", "Schnell", "Preiswert", "Persönlich"];

const USP: { title: string; text: string; path: string }[] = [
  { title: "Zuverlässig", text: "Wir halten unsere Versprechen",
    path: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z M9 12l2 2 4-4" },
  { title: "Schnell", text: "Kurzfristige Termine möglich",
    path: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z M12 7v5l3 3" },
  { title: "Preiswert", text: "Faire Preise, klare Angebote",
    path: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z M14.5 9a2.5 2.5 0 0 0-2.5-1.5C10.6 7.5 9.5 8.4 9.5 10s1.5 2 2.5 2 2.5.4 2.5 2-1.1 2.5-2.5 2.5A2.5 2.5 0 0 1 9.5 15" },
  { title: "Persönlich", text: "Direkt & persönlich für Sie da",
    path: "M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" },
];

function Check() {
  return (
    <span className="flex-none w-6 h-6 rounded-full bg-copper grid place-items-center" aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
        <path d="m5 13 4 4L19 7" />
      </svg>
    </span>
  );
}

export default function Hero() {
  // Заголовок клиента длинный; в макете он разбит на две части, вторая —
  // зелёная. Делим по «in Osnabrück», если оно есть, иначе печатаем целиком.
  const full = data.hero.heading;
  const cut = full.indexOf("in Osnabrück");
  const main = cut > 0 ? full.slice(0, cut).trim() : full;
  const accent = cut > 0 ? full.slice(cut).trim() : "";

  return (
    <section
      className="hero-lamp-bg relative overflow-hidden text-white"
      /* Переменные фона прежде ставил компонент Lamp; новый герой рисует
         фото сам, поэтому объявляет их у себя. Без них была белая полоса. */
      style={{
        "--hero-img-mobile": `url(${getHref("/images/hero/hero-bg-800w.webp")})`,
        "--hero-img-desktop": `url(${getHref("/images/hero/hero-bg-1200w.webp")})`,
      } as React.CSSProperties}
    >
      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8
        grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(300px,380px)]
        gap-8 lg:gap-12 items-center
        pt-14 pb-20 md:pt-20 md:pb-28 min-h-[480px] lg:min-h-[620px]">

        <div>
          {/* Капслок — из макета: style.css `.hero h1 { text-transform: uppercase }`.
              Начертанием, а не переписыванием: текст клиента в homepage.json
              остаётся в обычном регистре. */}
          <h1 className="font-heading font-black leading-[1.15] [text-wrap:balance] uppercase
            text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] mb-5">
            <span className="block">{main}</span>
            {accent && <span className="block text-copper-light">{accent}</span>}
          </h1>

          <p className="text-lg md:text-[1.5625rem] leading-snug max-w-[34ch] mb-6">
            {data.hero.subheading}
          </p>

          <ul className="flex flex-wrap gap-x-6 gap-y-3 mb-7 p-0">
            {BADGES.map((b) => (
              <li key={b} className="inline-flex items-center gap-2 font-semibold text-[0.9375rem]">
                <Check />
                {b}
              </li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={`https://wa.me/${WA}`}
              rel="noopener"
              className="inline-flex items-center gap-3 min-h-[44px] px-5 py-3 rounded-[10px]
                bg-copper hover:bg-copper-dark text-white font-semibold transition-colors"
            >
              <span className="flex-none w-9 h-9 rounded-full bg-white/20 grid place-items-center">
                <WhatsAppIcon className="w-5 h-5" />
              </span>
              <span className="flex flex-col leading-tight text-left">
                <strong>Jetzt per WhatsApp</strong>
                <small className="text-xs opacity-90">schnell anfragen</small>
              </span>
            </a>
            {/* Кнопки клиента из homepage.json — обе. Кнопка WhatsApp взята из
                макета и добавлена К ним, а не вместо: «Kostenlos anfragen»
                ведёт на форму, и терять эту ссылку с главной нельзя. */}
            {data.hero.ctas.map((cta) => (
              <a
                key={cta.href}
                href={getHref(cta.href)}
                className="inline-flex items-center gap-3 min-h-[44px] px-5 py-3 rounded-[10px]
                  border border-white/40 hover:border-white text-white font-semibold transition-colors"
              >
                <span className="flex flex-col leading-tight text-left">
                  <strong>{cta.label}</strong>
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Карточка преимуществ — правая колонка макета */}
        <aside
          className="rounded-[14px] border border-white/15 bg-[rgba(16,23,31,0.88)]
            p-5 md:p-6 flex flex-col gap-5 backdrop-blur-[2px]"
          aria-label="Unsere Vorteile"
        >
          {USP.map((u) => (
            <div key={u.title} className="flex gap-4 items-start">
              <span className="flex-none w-11 h-11 rounded-full bg-copper/20 text-copper-light grid place-items-center" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d={u.path} />
                </svg>
              </span>
              <div>
                <h3 className="font-heading font-bold text-[1.0625rem]">{u.title}</h3>
                <p className="text-sm text-white/70">{u.text}</p>
              </div>
            </div>
          ))}
        </aside>
      </div>
      <BrushDivider />
    </section>
  );
}
