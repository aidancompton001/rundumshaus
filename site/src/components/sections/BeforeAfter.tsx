"use client";

import { useState } from "react";
import { getImageUrl } from "@/lib/getImageUrl";

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
        <img
          src={getImageUrl(after)}
          alt={`${afterAlt} — ${title}`}
          width={800}
          height={600}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />

        {/* Before image (clipped) */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <img
            src={getImageUrl(before)}
            alt={`${beforeAlt} — ${title}`}
            width={800}
            height={600}
            className="w-full h-full object-cover"
            loading="lazy"
          />
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

        {/* Labels */}
        <span className="absolute top-3 left-3 bg-charcoal/70 text-cream text-xs px-2 py-1 rounded-md z-20">
          Vorher
        </span>
        <span className="absolute top-3 right-3 bg-charcoal/70 text-cream text-xs px-2 py-1 rounded-md z-20">
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
