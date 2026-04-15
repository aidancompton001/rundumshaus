import type { IconProps } from "./icon-types";
import type { FC } from "react";

function colors(variant: IconProps["variant"] = "default") {
  switch (variant) {
    case "light":
      return { base: "text-cream", accent: "text-copper" };
    case "mono":
      return { base: "", accent: "" };
    default:
      return { base: "text-charcoal", accent: "text-copper" };
  }
}

/** Clock — Zuverlässig & Pünktlich */
export const ClockIcon: FC<IconProps> = ({ className, variant }) => {
  const c = colors(variant);
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <g className={c.base} stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" />
      </g>
      <g className={c.accent} stroke="currentColor" strokeWidth="1.5">
        <path d="M12 7v5l3 3" />
      </g>
    </svg>
  );
};

/** Sparkle — Saubere & Sorgfältige Arbeit */
export const SparkleIcon: FC<IconProps> = ({ className, variant }) => {
  const c = colors(variant);
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <g className={c.base} stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" />
      </g>
      <g className={c.accent} stroke="currentColor" strokeWidth="1.5">
        <path d="M19 3l.8 2.4L22 6.2l-2.2.8L19 9.4l-.8-2.4L16 6.2l2.2-.8L19 3z" />
      </g>
    </svg>
  );
};

/** PriceTag — Faire & Transparente Preise */
export const PriceTagIcon: FC<IconProps> = ({ className, variant }) => {
  const c = colors(variant);
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <g className={c.base} stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </g>
      <g className={c.accent} stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="10" r="1.5" />
      </g>
    </svg>
  );
};

/** Calendar — Kurzfristige Termine Möglich */
export const CalendarIcon: FC<IconProps> = ({ className, variant }) => {
  const c = colors(variant);
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <g className={c.base} stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4" />
        <path d="M8 2v4" />
        <path d="M3 10h18" />
      </g>
      <g className={c.accent} stroke="currentColor" strokeWidth="1.5">
        <path d="M9 16l2 2 4-4" />
      </g>
    </svg>
  );
};

/** Handshake — Alles aus einer Hand */
export const HandshakeIcon: FC<IconProps> = ({ className, variant }) => {
  const c = colors(variant);
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <g className={c.base} stroke="currentColor" strokeWidth="1.5">
        <path d="M2 14l4-4 4 2 4-4 4 2 4-4" />
        <path d="M2 14l3 3h4l2.5-2.5" />
        <path d="M22 6l-3 3h-4l-2.5 2.5" />
      </g>
      <g className={c.accent} stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12.5" r="1.5" />
      </g>
    </svg>
  );
};
