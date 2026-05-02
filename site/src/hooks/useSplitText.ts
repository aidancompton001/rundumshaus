"use client";

import { useEffect, RefObject } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

interface UseSplitTextOptions {
  type?: "chars" | "words" | "lines";
  stagger?: number;
  duration?: number;
  yPercent?: number;
  ease?: string;
  triggerOnScroll?: boolean;
  scrollStart?: string;
  /** Skip animation entirely (e.g. on mobile for LCP performance). Text remains visible. */
  disabled?: boolean;
}

export function useSplitText(
  elementRef: RefObject<HTMLElement | null>,
  reducedMotion: boolean,
  options: UseSplitTextOptions = {}
) {
  const {
    type = "chars",
    stagger = 0.03,
    duration = 0.8,
    yPercent = 100,
    ease = "power2.out",
    triggerOnScroll = false,
    scrollStart = "top 85%",
    disabled = false,
  } = options;

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // Reduced motion or disabled (mobile): show text immediately
    if (reducedMotion || disabled) {
      gsap.set(el, { opacity: 1 });
      return;
    }

    const split = SplitText.create(el, { type });
    const targets = split[type];

    // Prevent FOUC: set targets hidden, then reveal parent
    gsap.set(targets, { yPercent, opacity: 0 });
    gsap.set(el, { opacity: 1 });

    const tween = gsap.to(targets, {
      yPercent: 0,
      opacity: 1,
      stagger,
      duration,
      ease,
      scrollTrigger: triggerOnScroll
        ? { trigger: el, start: scrollStart }
        : undefined,
    });

    return () => {
      tween.kill();
      split.revert();
    };
  }, [
    elementRef,
    reducedMotion,
    type,
    stagger,
    duration,
    yPercent,
    ease,
    triggerOnScroll,
    scrollStart,
    disabled,
  ]);
}
