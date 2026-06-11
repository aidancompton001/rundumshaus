"use client";

// PX-064: Google reviews slider on homepage (Kevin's request 2026-06-09).
// Data from reviews.json (8 real verified Google reviews).
// JSX only — NO Schema here: AggregateRating + Review schema already lives
// in the LocalBusiness JSON-LD in layout.tsx (ownership contract L-015).
// Auto-pull via Places API will replace the static JSON once Google
// indexes the profile (see docs/CREDENTIALS.md — Places API key ready).

import { useRef, useState } from "react";
import reviewsData from "@/data/reviews.json";
import { ScrollReveal } from "@/components/motion";

const { reviews, aggregateRating } = reviewsData;

// PX-074: long reviews (Markus, Gartenpflege) would stretch every card in the
// flex row to the tallest card's height — clamp long texts with a toggle.
const CLAMP_CHARS = 280;

function ReviewText({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > CLAMP_CHARS;
  return (
    <div className="mt-4 flex-1">
      <p
        className={`text-charcoal-light leading-relaxed ${
          isLong && !expanded ? "line-clamp-6" : ""
        }`}
      >
        &bdquo;{text}&ldquo;
      </p>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-sm font-semibold text-copper hover:underline"
        >
          {expanded ? "Weniger anzeigen" : "Mehr lesen"}
        </button>
      )}
    </div>
  );
}

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} von 5 Sternen`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < count ? "text-gold" : "text-sand/40"} aria-hidden="true">
          ★
        </span>
      ))}
    </div>
  );
}

export default function BewertungenSlider() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("article");
    const delta = card ? (card as HTMLElement).offsetWidth + 24 : 320;
    track.scrollBy({ left: dir * delta, behavior: "smooth" });
  };

  return (
    <section className="py-20 md:py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-charcoal mb-4">
            Das sagen unsere Kunden
          </h2>
          <div className="flex items-center justify-center gap-3 text-charcoal-light">
            <Stars count={Math.round(aggregateRating.ratingValue)} />
            <span className="font-semibold text-charcoal">
              {aggregateRating.ratingValue.toFixed(1)}
            </span>
            <span>·</span>
            <span>{aggregateRating.ratingCount} Google-Bewertungen</span>
          </div>
        </ScrollReveal>

        <div className="relative">
          {/* Track — CSS scroll-snap, works without JS; arrows enhance on desktop */}
          <div
            ref={trackRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {reviews.map((r) => (
              <article
                key={r.id}
                className="snap-start shrink-0 w-[300px] md:w-[360px] bg-cream-dark border border-sand/30 rounded-2xl p-6 flex flex-col"
              >
                <Stars count={r.rating} />
                <ReviewText text={r.text} />
                <div className="mt-5 pt-4 border-t border-sand/30 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-charcoal">{r.author}</p>
                    <p className="text-sm text-charcoal-light">{r.city}</p>
                  </div>
                  {r.service && (
                    <span className="text-xs bg-copper/10 text-copper rounded-full px-3 py-1">
                      {r.service}
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>

          {/* Arrow controls (desktop) */}
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Vorherige Bewertung"
            className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center rounded-full bg-white border border-sand/40 shadow-md hover:border-copper hover:text-copper transition"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Nächste Bewertung"
            className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center rounded-full bg-white border border-sand/40 shadow-md hover:border-copper hover:text-copper transition"
          >
            ›
          </button>
        </div>

        <p className="text-center text-sm text-charcoal-light mt-6">
          Verifizierte Bewertungen aus dem Google Unternehmensprofil.
        </p>
      </div>
    </section>
  );
}
