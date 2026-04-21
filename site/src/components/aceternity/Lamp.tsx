"use client";

import { useMotion } from "@/components/motion/MotionProvider";

interface LampProps {
  children: React.ReactNode;
}

export default function Lamp({ children }: LampProps) {
  const { reducedMotion } = useMotion();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden w-full z-0"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(27,58,92,0.6), rgba(27,58,92,0.85)), url(${basePath}/images/hero/hero-bg.webp)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Soft bronze glow — CSS only, no Motion dependency */}
      {!reducedMotion && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
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
