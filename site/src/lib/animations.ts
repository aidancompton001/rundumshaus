/* GSAP Animation Presets — shared across all components */

export const REVEAL = {
  opacity: 0,
  y: 40,
  duration: 0.8,
  ease: "power2.out",
};

export const STAGGER = {
  each: 0.1,
};

export const HEADING_REVEAL = {
  opacity: 0,
  y: 50,
  duration: 1,
  ease: "power2.out",
};

export const CHAR_SPLIT = {
  yPercent: 150,
  duration: 0.8,
  ease: "power3.out",
  stagger: 0.03,
};

export const CLIPPATH_REVEAL = {
  from: "inset(100% 0 0 0)",
  to: "inset(0% 0 0 0)",
  duration: 0.8,
  ease: "power2.inOut",
};

export const MOTION_PAGE_EASE = [0.25, 0.1, 0.25, 1] as const;

export const MOTION_HOVER_DURATION = 0.2;
