"use client";

import { useState } from "react";
import { getImageUrl, toWebp } from "@/lib/getImageUrl";

interface BeforeAfterProps {
  before: string;
  after: string;
  title: string;
  beforeAlt?: string;
  afterAlt?: string;
}

export default function BeforeAfter({
  before,
  after,
  title,
  beforeAlt = "Vorher",
  afterAlt = "Nachher",
}: BeforeAfterProps) {
  const [position, setPosition] = useState(50);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-sand/20">
      <p className="sr-only">
        Vorher-Nachher-Vergleich: {title}. Schieberegler bei {position}%.
      </p>

      {/* After image (full width, behind) */}
      <div className="relative aspect-[4/3]">
        <picture>
          <source type="image/webp" srcSet={getImageUrl(toWebp(after))} />
          <img
            src={getImageUrl(after)}
            alt={`${afterAlt} — ${title}`}
            width={800}
            height={600}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </picture>

        {/* Before image (clipped) */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <picture>
            <source type="image/webp" srcSet={getImageUrl(toWebp(before))} />
            <img
              src={getImageUrl(before)}
              alt={`${beforeAlt} — ${title}`}
              width={800}
              height={600}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </picture>
        </div>

        {/* Slider line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-copper z-10 pointer-events-none"
          style={{ left: `${position}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-copper rounded-full flex items-center justify-center shadow-lg">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-white">
              <path d="M6 10L2 10M2 10L5 7M2 10L5 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 10L18 10M18 10L15 7M18 10L15 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Labels — единственный макетный способ подписи: тёмная пилюля
            слева снизу (docs/design/v1-desktop/css/style.css, .ref-pair figcaption) */}
        <span className="absolute left-2 bottom-2 z-20 px-[0.55rem] py-[0.2rem] bg-charcoal text-cream text-xs font-bold leading-tight rounded-full max-w-[calc(100%-1rem)]">
          Vorher
        </span>
        <span className="absolute right-2 bottom-2 z-20 px-[0.55rem] py-[0.2rem] bg-charcoal text-cream text-xs font-bold leading-tight rounded-full max-w-[calc(100%-1rem)]">
          Nachher
        </span>
      </div>

      {/* Range input — accessible, keyboard, touch */}
      <input
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
        aria-label={`Vorher-Nachher-Schieberegler für ${title}`}
      />
    </div>
  );
}
