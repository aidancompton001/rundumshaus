"use client";

import { useMotion } from "@/components/motion/MotionProvider";

interface LampProps {
  children: React.ReactNode;
}

export default function Lamp({ children }: LampProps) {
  const { reducedMotion } = useMotion();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  // PX-034 LCP fix: responsive background via CSS media query (globals.css
  // .hero-lamp-bg). Mobile loads hero-bg-800w.webp (36 KB), desktop 1200w
  // (61 KB) — never the full 192 KB hero-bg.webp. Cuts mobile LCP.
  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden w-full z-0 hero-lamp-bg"
      style={
        {
          "--hero-img-mobile": `url(${basePath}/images/hero/hero-bg-800w.webp)`,
          "--hero-img-desktop": `url(${basePath}/images/hero/hero-bg-1200w.webp)`,
        } as React.CSSProperties
      }
    >
      {/* Soft bronze glow — CSS only, no Motion dependency */}
      {!reducedMotion && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          {/* Wide ambient glow */}
          <div className="absolute w-[40rem] h-[20rem] -translate-y-[10rem] rounded-full bg-copper/30 blur-[120px] opacity-50" />
          {/* Focused center glow */}
          <div className="absolute w-[20rem] h-[12rem] -translate-y-[6rem] rounded-full bg-copper-light/40 blur-[80px] opacity-40" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-5">
        {children}
      </div>
    </div>
  );
}
