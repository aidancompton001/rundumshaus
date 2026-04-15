"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const STORAGE_KEY = "rh-cookie-consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-4xl mx-auto bg-charcoal/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p className="text-cream/80 text-sm flex-1">
              Diese Website verwendet nur technisch notwendige Cookies. Keine
              Tracking-Cookies, keine Analyse-Tools. Weitere Informationen
              finden Sie in unserer{" "}
              <a
                href="/datenschutz"
                className="text-copper hover:text-copper-light underline"
              >
                Datenschutzerklärung
              </a>
              .
            </p>
            <button
              onClick={accept}
              className="bg-copper hover:bg-copper-light text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 whitespace-nowrap"
            >
              Verstanden
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
