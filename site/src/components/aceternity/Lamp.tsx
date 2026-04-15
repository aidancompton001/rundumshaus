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
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-charcoal w-full z-0"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(42,42,42,0.7), rgba(42,42,42,0.9)), url(${basePath}/images/hero/hero-bg.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Lamp beams */}
      <div className="relative flex w-full flex-1 items-center justify-center isolate z-0">
        <motion.div
          initial={reducedMotion ? { opacity: 0.5, width: "15rem" } : { opacity: 0.5, width: "15rem" }}
          whileInView={reducedMotion ? { opacity: 0.5, width: "15rem" } : { opacity: 1, width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{
            backgroundImage:
              "conic-gradient(var(--conic-position), var(--tw-gradient-stops))",
          }}
          className="absolute inset-auto right-1/2 h-56 overflow-visible w-[30rem] bg-gradient-to-l from-copper via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]"
        >
          <div className="absolute w-[100%] left-0 bg-charcoal h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute w-40 h-[100%] left-0 bg-charcoal bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>
        <motion.div
          initial={reducedMotion ? { opacity: 0.5, width: "15rem" } : { opacity: 0.5, width: "15rem" }}
          whileInView={reducedMotion ? { opacity: 0.5, width: "15rem" } : { opacity: 1, width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{
            backgroundImage:
              "conic-gradient(var(--conic-position), var(--tw-gradient-stops))",
          }}
          className="absolute inset-auto left-1/2 h-56 w-[30rem] bg-gradient-to-r from-transparent via-transparent to-copper text-white [--conic-position:from_290deg_at_center_top]"
        >
          <div className="absolute w-40 h-[100%] right-0 bg-charcoal bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute w-[100%] right-0 bg-charcoal h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>

        {/* Central glow */}
        <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-charcoal blur-2xl" />
        <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md" />
        <div className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-copper opacity-50 blur-3xl" />
        <motion.div
          initial={reducedMotion ? { width: "8rem" } : { width: "8rem" }}
          whileInView={reducedMotion ? { width: "8rem" } : { width: "16rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full bg-copper-light blur-2xl"
        />
        <motion.div
          initial={reducedMotion ? { width: "15rem" } : { width: "15rem" }}
          whileInView={reducedMotion ? { width: "15rem" } : { width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[7rem] bg-copper"
        />
        <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-charcoal" />
      </div>

      {/* Content below lamp */}
      <div className="relative z-50 flex -translate-y-60 flex-col items-center px-5">
        {children}
      </div>
    </div>
  );
}
