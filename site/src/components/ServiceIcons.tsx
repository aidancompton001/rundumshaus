import type { FC } from "react";

interface IconProps {
  className?: string;
}

/** Wrench — Hausmeisterservice */
export const WrenchIcon: FC<IconProps> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <g className="text-charcoal" stroke="currentColor" strokeWidth="1.5">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </g>
    <g className="text-copper" stroke="currentColor" strokeWidth="1.5">
      <circle cx="6.5" cy="17.5" r="1.5" />
    </g>
  </svg>
);

/** Leaf — Gartenpflege */
export const LeafIcon: FC<IconProps> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <g className="text-charcoal" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 22c1.25-1.25 2.5-3.5 2.5-6A9.5 9.5 0 0 1 14 6.5c3 0 5.5.5 7.5 2.5S24 14 24 14" />
    </g>
    <g className="text-copper" stroke="currentColor" strokeWidth="1.5">
      <path d="M6.5 12.5C8 14 9.5 15 12 15c2 0 4-1 5.5-2.5" />
      <path d="M20 4c-2 2-5.5 4.5-8.5 5.5" />
    </g>
  </svg>
);

/** Roof / House — Dacharbeiten */
export const RoofIcon: FC<IconProps> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <g className="text-charcoal" stroke="currentColor" strokeWidth="1.5">
      <path d="M5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7" />
      <rect x="9" y="15" width="6" height="5" rx="0.5" />
    </g>
    <g className="text-copper" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 12l10-9 10 9" />
    </g>
  </svg>
);

/** Box with arrow — Entrümpelung */
export const BoxArrowIcon: FC<IconProps> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <g className="text-charcoal" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 8v13H3V8" />
      <rect x="1" y="3" width="22" height="5" rx="1" />
    </g>
    <g className="text-copper" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 18v-8" />
      <path d="M8.5 13.5 12 10l3.5 3.5" />
    </g>
  </svg>
);

/** Recycle — Schrottabholung */
export const RecycleIcon: FC<IconProps> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <g className="text-charcoal" stroke="currentColor" strokeWidth="1.5">
      <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
      <path d="M11 19h6.031a1.83 1.83 0 0 0 1.57-.881 1.785 1.785 0 0 0 .004-1.784L14.5 9" />
    </g>
    <g className="text-copper" stroke="currentColor" strokeWidth="1.5">
      <path d="m7 16-3 3 3 3" />
      <path d="m17 16 3 3-3 3" />
      <path d="M12 2l3.5 6H8.5L12 2z" />
    </g>
  </svg>
);

/** Default fallback icon (simple circle) */
export const DefaultIcon: FC<IconProps> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <g className="text-charcoal" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" />
    </g>
    <g className="text-copper" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="3" />
    </g>
  </svg>
);

/** Map service icon keys to components */
export const serviceIconMap: Record<string, FC<IconProps>> = {
  wrench: WrenchIcon,
  leaf: LeafIcon,
  home: RoofIcon,
  truck: BoxArrowIcon,
  recycle: RecycleIcon,
};
