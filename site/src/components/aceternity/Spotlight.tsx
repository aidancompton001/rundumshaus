"use client";

import { useRef, useCallback } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useMotion } from "@/components/motion/MotionProvider";

interface SpotlightProps {
  children: React.ReactNode;
  className?: string;
}

export default function Spotlight({ children, className = "" }: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { reducedMotion } = useMotion();

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isMobile || reducedMotion) return;
      const el = containerRef.current;
      if (!el) return;
      el.style.setProperty("--mouse-x", `${e.clientX}px`);
      el.style.setProperty("--mouse-y", `${e.clientY}px`);
    },
    [isMobile, reducedMotion]
  );

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`relative ${className}`}
      style={
        !isMobile && !reducedMotion
          ? {
              background:
                "radial-gradient(600px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(184,115,51,0.12), transparent 80%)",
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
