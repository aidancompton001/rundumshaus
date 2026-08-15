"use client";

// PX-064: Google reviews slider on homepage (Kevin's request 2026-06-09).
// Texte und Daten wortwörtlich aus dem Google-Unternehmensprofil übernommen.
// JSX only — kein Review-/AggregateRating-Markup: Google erlaubt keine
// Sternchen-Rich-Results für Bewertungen über das eigene Unternehmen auf der
// eigenen Website, deshalb ist das Markup in layout.tsx entfernt worden.
//
// Zahlen: 5,0 und 10 kommen aus googleProfile (Profilzahlen, per Link
// nachprüfbar), die Zahl der gezeigten Karten ist reviews.length — nie
// als Literal ins JSX schreiben, sonst wird sie beim nächsten Google-Update
// stillschweigend zur Lüge.

import { useRef, useState } from "react";
import reviewsData from "@/data/reviews.json";
import { ScrollReveal } from "@/components/motion";
import SectionHeading from "@/components/ui/SectionHeading";
import {
  GOOGLE_PROFILE,
  GoogleLogo,
  GoogleProfileButton,
  GoogleProfileFigures,
  ReviewsSourceNote,
  ShownSelectionNote,
} from "@/components/ui/GoogleReviewBits";

const { reviews } = reviewsData;

// PX-074: long reviews (Markus, Gartenpflege) would stretch every card in the
// flex row to the tallest card's height — clamp long texts with a toggle.
const CLAMP_CHARS = 280;

function ReviewText({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > CLAMP_CHARS;
  return (
    <div className="mt-4 flex-1">
      <p
        className={`text-charcoal-light leading-relaxed whitespace-pre-line ${
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
          <SectionHeading eyebrow="Bewertungen" className="mb-4">
            Das sagen unsere Kunden
          </SectionHeading>
          <p className="text-charcoal font-semibold mb-2">
            Kundenstimmen aus unserem Google-Unternehmensprofil
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-charcoal-light">
            <Stars count={Math.round(GOOGLE_PROFILE.ratingValue)} />
            <span>
              <GoogleProfileFigures />
            </span>
            <span className="hidden sm:inline">·</span>
            <span>
              <ShownSelectionNote shown={reviews.length} />
            </span>
          </div>
        </ScrollReveal>

        <div className="relative">
          {/* Track — CSS scroll-snap, works without JS; arrows enhance on desktop */}
          <div
            ref={trackRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {reviews.map((r) => (
              <article
                key={r.id}
                className="snap-start shrink-0 w-[300px] md:w-[360px] bg-cream-dark border border-sand/30 rounded-2xl p-6 flex flex-col"
              >
                <div className="flex items-center justify-between">
                  <Stars count={r.rating} />
                  <GoogleLogo />
                </div>
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
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center rounded-full bg-white border border-sand/40 shadow-md hover:border-copper hover:text-copper transition"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Nächste Bewertung"
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center rounded-full bg-white border border-sand/40 shadow-md hover:border-copper hover:text-copper transition"
          >
            ›
          </button>
        </div>

        <div className="mt-8 text-center">
          <GoogleProfileButton className="inline-flex items-center gap-2 px-6 py-3 bg-copper text-white font-semibold rounded-lg hover:bg-copper-dark transition" />
        </div>

        <ReviewsSourceNote className="text-center text-sm text-charcoal-light mt-6 max-w-2xl mx-auto" />
      </div>
    </section>
  );
}
