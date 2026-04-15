"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotion } from "./MotionProvider";

gsap.registerPlugin(ScrollTrigger);

interface StaggerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  duration?: number;
  start?: string;
  className?: string;
}

export default function Stagger({
  children,
  staggerDelay = 0.1,
  duration = 0.7,
  start = "top 85%",
  className = "",
}: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    const items = el.children;
    if (items.length === 0) return;

    const tween = gsap.from(items, {
      opacity: 0,
      y: 30,
      duration,
      stagger: staggerDelay,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: "play none none none",
      },
    });

    return () => {
      tween.kill();
    };
  }, [staggerDelay, duration, start, reducedMotion]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
