"use client";

import { useEffect, useRef } from "react";
import { useMotion } from "./MotionProvider";

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  className?: string;
}

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  className = "",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    if (delay > 0) {
      el.style.setProperty("--reveal-delay", `${delay}ms`);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0 }
    );

    // PX-071: if the element is already (partly) in the viewport on mount,

    // reveal immediately — a tall container plus threshold-based IO left

    // /leistungen/ cards invisible until the first scroll (CEO bug report).

    if (el.getBoundingClientRect().top < window.innerHeight) {

      el.classList.add("is-visible");

      observer.disconnect();

    } else {

      observer.observe(el);

    }
    return () => observer.disconnect();
  }, [delay, reducedMotion]);

  const dirClass = `reveal-${direction}`;

  return (
    <div ref={ref} className={`scroll-reveal ${dirClass} ${className}`}>
      {children}
    </div>
  );
}
