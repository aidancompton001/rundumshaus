"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CONSENT_KEY, initAdsIfConsented } from "@/lib/googleAds";

/** Баннер согласия (T011). Прежний только уведомлял «Verstanden» и утверждал,
    что трекинга нет. С тегом Google Ads это стало бы ложью, а загрузка тега
    без согласия нарушала бы § 25 TDDDG. Теперь — выбор из двух равноценных
    кнопок, тег грузится только после «Alle akzeptieren». */
export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const firstButton = useRef<HTMLButtonElement>(null);

  // Ланда F-06: баннер в конце DOM, с клавиатуры до него 36–42 нажатия Tab.
  // Фокус — на «Nur notwendige», первую по порядку: не подталкиваем к согласию.
  // Ланда N-01: переводим фокус ТОЛЬКО если посетитель ещё никуда не встал.
  // Иначе баннер через 1,5 с уводил фокус с поля формы Kontakt: набранный
  // текст терялся, а пробел сам нажимал «Nur notwendige».
  useEffect(() => {
    if (!visible) return;
    const active = document.activeElement;
    if (active && active !== document.body) return;
    firstButton.current?.focus({ preventScroll: true });
  }, [visible]);

  useEffect(() => {
    initAdsIfConsented();
    const timer = setTimeout(() => {
      if (!localStorage.getItem(CONSENT_KEY)) {
        setVisible(true);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  function choose(value: "all" | "necessary") {
    localStorage.setItem(CONSENT_KEY, value);
    setVisible(false);
    if (value === "all") initAdsIfConsented();
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="pointer-events-none fixed bottom-0 left-0 right-0 z-50 px-4 pt-4 pb-28 md:px-6 xl:pb-6"
          role="dialog"
          aria-label="Cookie-Einstellungen"
        >
          <div className="pointer-events-auto max-w-4xl mx-auto bg-charcoal border border-white/[0.08] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
            <p className="text-cream/80 text-sm flex-1">
              Wir verwenden technisch notwendige Cookies. Mit Ihrer Zustimmung setzen wir zusätzlich Google Ads ein, um zu messen, ob unsere Anzeigen zu Anfragen führen. Ihre Auswahl können Sie jederzeit in der{" "}
              <a
                href="/datenschutz"
                className="text-copper hover:text-copper-light underline"
              >
                Datenschutzerklärung
              </a>
              {" "}ändern.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <button
                ref={firstButton}
                type="button"
                onClick={() => choose("necessary")}
                className="min-h-[44px] border border-cream/40 text-cream hover:bg-cream/10 px-5 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 whitespace-nowrap"
              >
                Nur notwendige
              </button>
              <button
                type="button"
                onClick={() => choose("all")}
                className="min-h-[44px] bg-copper hover:bg-copper-light text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 whitespace-nowrap"
              >
                Alle akzeptieren
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
