"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import siteData from "@/data/site.json";
import type { SiteConfig } from "@/data/types";
import { getHref } from "@/lib/getImageUrl";
import { useMotion } from "@/components/motion/MotionProvider";

const site = siteData as SiteConfig;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  const { reducedMotion } = useMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const el = headerRef.current;
      if (!el) return;

      if (currentY > lastScrollY.current && currentY > 80) {
        // Scrolling down — hide
        gsap.to(el, { y: -100, duration: 0.3, ease: "power2.out" });
      } else {
        // Scrolling up — reveal
        gsap.to(el, { y: 0, duration: 0.3, ease: "power2.out" });
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [reducedMotion]);

  return (
    <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50">
      <nav className="backdrop-blur-xl bg-charcoal/90 border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo / Company */}
            <a
              href={getHref("/")}
              className="font-heading text-xl font-bold text-cream"
            >
              {site.company}
            </a>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {site.navigation.map((link) => (
                <a
                  key={link.href}
                  href={getHref(link.href)}
                  className="text-cream/80 hover:text-cream transition-colors duration-200 text-sm font-body font-medium"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={getHref("/kontakt")}
                className="bg-copper hover:bg-copper-light text-white px-5 py-2 rounded-lg text-sm font-body font-semibold transition-colors duration-200"
              >
                Kontakt
              </a>
            </div>

            {/* Mobile Burger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden flex flex-col justify-center items-center w-11 h-11 gap-1.5"
              aria-label={isOpen ? "Menü schließen" : "Menü öffnen"}
              aria-expanded={isOpen}
            >
              <motion.span
                animate={{
                  rotate: isOpen ? 45 : 0,
                  y: isOpen ? 6 : 0,
                }}
                transition={{ duration: 0.2 }}
                className="block w-6 h-0.5 bg-cream"
              />
              <motion.span
                animate={{ opacity: isOpen ? 0 : 1 }}
                transition={{ duration: 0.2 }}
                className="block w-6 h-0.5 bg-cream"
              />
              <motion.span
                animate={{
                  rotate: isOpen ? -45 : 0,
                  y: isOpen ? -6 : 0,
                }}
                transition={{ duration: 0.2 }}
                className="block w-6 h-0.5 bg-cream"
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="md:hidden fixed inset-0 top-16 bg-charcoal/95 backdrop-blur-2xl z-40"
            >
              <div className="flex flex-col items-center justify-center h-full gap-8">
                {site.navigation.map((link) => (
                  <a
                    key={link.href}
                    href={getHref(link.href)}
                    onClick={() => setIsOpen(false)}
                    className="text-cream text-2xl font-heading font-semibold hover:text-copper transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href={getHref("/kontakt")}
                  onClick={() => setIsOpen(false)}
                  className="bg-copper hover:bg-copper-light text-white px-8 py-3 rounded-lg text-lg font-body font-semibold transition-colors mt-4"
                >
                  Kontakt
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
