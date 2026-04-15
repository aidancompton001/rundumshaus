"use client";

import { useMotion } from "@/components/motion/MotionProvider";
import { useIsMobile } from "@/hooks/useIsMobile";
import { getHref } from "@/lib/getImageUrl";

interface MovingBorderProps {
  children: React.ReactNode;
  href?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  className?: string;
}

export default function MovingBorder({
  children,
  href,
  type = "button",
  onClick,
  className = "",
}: MovingBorderProps) {
  const { reducedMotion } = useMotion();
  const isMobile = useIsMobile();

  const showAnimation = !reducedMotion && !isMobile;

  const inner = (
    <span className="relative z-10 inline-flex items-center justify-center gap-2 bg-gold px-8 py-3.5 rounded-xl text-white font-body font-semibold text-lg transition-colors hover:bg-gold-light">
      {children}
    </span>
  );

  const wrapper = showAnimation ? (
    <span className="moving-border-wrapper relative inline-block rounded-xl p-[2px]">
      <span
        className="absolute inset-0 rounded-xl overflow-hidden"
        aria-hidden="true"
      >
        <span className="moving-border-gradient absolute inset-[-200%] animate-[rotating-border_3s_linear_infinite]" />
      </span>
      {inner}
    </span>
  ) : (
    inner
  );

  if (href) {
    return (
      <a href={getHref(href)} className={className}>
        {wrapper}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={className}>
      {wrapper}
    </button>
  );
}
