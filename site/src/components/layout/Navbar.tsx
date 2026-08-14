"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import siteData from "@/data/site.json";
import type { SiteConfig } from "@/data/types";
import { getHref, getImageUrl } from "@/lib/getImageUrl";
import { WhatsAppIcon } from "@/components/ContactIcons";

const site = siteData as SiteConfig;
const WA = site.phone.replace(/[^\d]/g, "");

/**
 * Шапка по макету клиента (docs/design/v1-desktop, `.site-header`):
 * БЕЛАЯ и липкая, высота 82px, лого 66px, меню справа, а справа от меню —
 * двухстрочная кнопка WhatsApp с номером. Прежняя шапка была тёмной,
 * пряталась при прокрутке и вместо номера показывала слово «Kontakt».
 */
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-[0_2px_14px_rgba(16,23,31,0.06)]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 min-h-[82px]">
          <a href={getHref("/")} className="inline-flex items-center flex-none">
            <img
              src={getImageUrl("/images/branding/logo-client.png")}
              alt={site.company}
              width={160}
              height={66}
              className="h-12 sm:h-[66px] w-auto"
            />
          </a>

          {/* Меню прижато вправо, как в макете (.main-nav { margin-left: auto }) */}
          <nav className="hidden lg:flex items-center gap-7 ml-auto">
            {site.navigation.map((link) => (
              <a
                key={link.href}
                href={getHref(link.href)}
                className="text-ink font-semibold text-[0.9375rem] hover:text-copper transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Номер телефона в шапке — главный способ связи у клиента */}
          {/*
            Ниже sm кнопка сжимается в круглую иконку 44x44 (тач-цель по WCAG),
            текстовые строки уходят из потока через hidden — иначе лого + кнопка
            + бургер не помещаются в 375px и появляется горизонтальная прокрутка.
            От sm и выше вид прежний: иконка + номер + подпись.
          */}
          <a
            href={`https://wa.me/${WA}`}
            rel="noopener"
            className="inline-flex items-center justify-center sm:justify-start sm:gap-3 flex-none bg-copper hover:bg-copper-dark text-white w-11 h-11 sm:w-auto sm:h-auto rounded-full sm:rounded-[10px] sm:px-4 sm:py-2.5 min-h-[44px] transition-colors ml-auto lg:ml-0"
          >
            <span className="flex-none w-9 h-9 rounded-full sm:bg-white/20 grid place-items-center">
              <WhatsAppIcon className="w-5 h-5" />
              {/* Ниже sm видимого текста у кнопки нет — имя для скринридера
                  даёт эта строка. Через aria-label делать нельзя: он перебил
                  бы видимый номер и подпись на широких ширинах. */}
              <span className="sr-only sm:hidden">WhatsApp: {site.phone}</span>
            </span>
            <span className="hidden sm:flex flex-col leading-tight text-left">
              <strong className="text-[0.9375rem] font-semibold">{site.phone}</strong>
              <small className="text-xs opacity-90">Jetzt per WhatsApp</small>
            </span>
          </a>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden flex flex-col justify-center items-center w-11 h-11 gap-1.5 flex-none"
            aria-label={isOpen ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={isOpen}
          >
            <motion.span animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 6 : 0 }}
              transition={{ duration: 0.2 }} className="block w-6 h-0.5 bg-ink" />
            <motion.span animate={{ opacity: isOpen ? 0 : 1 }}
              transition={{ duration: 0.2 }} className="block w-6 h-0.5 bg-ink" />
            <motion.span animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -6 : 0 }}
              transition={{ duration: 0.2 }} className="block w-6 h-0.5 bg-ink" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="lg:hidden fixed top-[82px] left-0 right-0 h-[calc(100dvh-82px)] bg-white z-[60] overflow-y-auto"
          >
            <div className="flex flex-col items-center justify-center h-full gap-7">
              {site.navigation.map((link) => (
                <a
                  key={link.href}
                  href={getHref(link.href)}
                  onClick={() => setIsOpen(false)}
                  className="text-ink text-2xl font-heading font-extrabold hover:text-copper transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={`https://wa.me/${WA}`}
                rel="noopener"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-3 bg-copper text-white px-6 py-3 rounded-[10px] font-semibold mt-2"
              >
                <WhatsAppIcon className="w-5 h-5" />
                {site.phone}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
