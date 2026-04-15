"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useSyncExternalStore,
} from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ── Reduced-motion detection (React 19 pattern) ── */

function subscribeToReducedMotion(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

/* ── Context ── */

interface MotionContextType {
  reducedMotion: boolean;
  lenisRef: React.RefObject<Lenis | null>;
}

const MotionContext = createContext<MotionContextType>({
  reducedMotion: false,
  lenisRef: { current: null },
});

export function useMotion() {
  return useContext(MotionContext);
}

/* ── Provider ── */

export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // KEY: Wire Lenis scroll → GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // KEY: GSAP ticker drives Lenis RAF (same frame loop = perfect sync)
    const rafCallback = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(rafCallback);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  return (
    <MotionContext.Provider value={{ reducedMotion, lenisRef }}>
      {children}
    </MotionContext.Provider>
  );
}
