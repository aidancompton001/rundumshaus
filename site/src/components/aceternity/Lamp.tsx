"use client";

import { motion } from "motion/react";
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
        backgroundImage: `linear-gradient(to bottom, rgba(42,42,42,0.6), rgba(42,42,42,0.85)), url(${basePath}/images/hero/hero-bg.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Soft glow — NO hard copper line, NO dark band */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Wide ambient glow */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: reducedMotion ? 0.3 : 0.5 }}
          transition={{ delay: 0.3, duration: 1.2, ease: "easeInOut" }}
          className="absolute w-[40rem] h-[20rem] -translate-y-[10rem] rounded-full bg-copper/30 blur-[120px]"
        />
        {/* Focused center glow */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: reducedMotion ? 0.2 : 0.4 }}
          transition={{ delay: 0.5, duration: 1, ease: "easeInOut" }}
          className="absolute w-[20rem] h-[12rem] -translate-y-[6rem] rounded-full bg-copper-light/40 blur-[80px]"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-5">
        {children}
      </div>
    </div>
  );
}
