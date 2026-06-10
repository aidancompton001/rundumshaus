"use client";

import { useEffect, useRef } from "react";
import { useMotion } from "./MotionProvider";

interface StaggerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export default function Stagger({
  children,
  staggerDelay = 100,
  className = "",
}: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    // Set stagger delay CSS variable on each child
    Array.from(el.children).forEach((child, i) => {
      (child as HTMLElement).style.setProperty(
        "--stagger-delay",
        `${i * staggerDelay}ms`
      );
    });

    // IntersectionObserver — adds .is-visible when element enters viewport
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
  }, [staggerDelay, reducedMotion]);

  return (
    <div ref={ref} className={`stagger-container ${className}`}>
      {children}
    </div>
  );
}
