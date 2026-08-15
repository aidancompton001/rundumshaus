"use client";

import { useState, useSyncExternalStore } from "react";
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

  /* Текущий пункт меню в макете подчёркнут (`.main-nav a[aria-current="page"]`:
     цвет accent-ink + нижняя граница accent). Адрес берётся из location, а не
     из usePathname: компонент рендерится и в тестах, где контекста роутера нет.
     До гидратации подчёркивания нет — статический экспорт одинаков для всех
     страниц, и вшить признак в HTML на этапе сборки нельзя. */
  // Читаем адрес через useSyncExternalStore, а не через setState в эффекте:
  // синхронный вызов setState внутри эффекта тянет каскад перерисовок и
  // валит `npm run lint`, а падение линтера останавливает деплой целиком.
  // Серверный снимок — null: до гидратации подчёркивания нет, статический
  // экспорт одинаков для всех страниц.
  const path = useSyncExternalStore(
    () => () => {},
    () => window.location.pathname.replace(/\/+$/, "") || "/",
    () => null,
  );

  const isCurrent = (href: string) => {
    if (path === null) return false;
    const target = getHref(href).replace(/\/+$/, "") || "/";
    return path === target;
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-[0_2px_14px_rgba(16,23,31,0.06)]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Зазоры шапки — из макета: до 1000px он ужимается до 0.5rem, до 360px
            до 0.35rem, иначе лого + плашка + бургер не помещаются в 375/320.
            Полный зазор макета (1.5rem) с 1280px: на 1024–1279 меню из 7 пунктов
            вместе с ним не влезало (1031px строки при 1024px экрана). */}
        <div className="flex items-center gap-2 lg:gap-4 xl:gap-6 max-[360px]:gap-[0.35rem] min-h-[82px]">
          <a href={getHref("/")} className="inline-flex items-center flex-none">
            <img
              src={getImageUrl("/images/branding/logo-client.png")}
              alt={site.company}
              width={160}
              height={66}
              /* Высоты лого — из макета: 66px в полной шапке, 40px до 1000px,
                 34px до 360px. На 375 это освобождает место под плашку с
                 номером (расчёт ширин — в отчёте F-87). */
              className="h-10 lg:h-[66px] max-[360px]:h-[34px] w-auto"
            />
          </a>

          {/* Меню прижато вправо, как в макете (.main-nav { margin-left: auto }) */}
          {/* Зазор между пунктами — формула макета (`.main-nav ul`:
              clamp(0.9rem, 1.8vw, 1.6rem)) вместо прежних фиксированных 28px.
              У нас в меню 7 пунктов против 5 в макете, и на 1024 фиксированный
              зазор выносил шапку за экран: строка занимала 1080px при 960px
              контейнера. */}
          <nav className="hidden lg:flex items-center gap-[clamp(0.9rem,1.8vw,1.6rem)] ml-auto">
            {site.navigation.map((link) => {
              const current = isCurrent(link.href);
              return (
                <a
                  key={link.href}
                  href={getHref(link.href)}
                  aria-current={current ? "page" : undefined}
                  /* Полоса под пунктом заложена всегда прозрачной, как в макете,
                     чтобы у текущего пункта не менялась высота строки. */
                  className={`inline-flex items-center min-h-[44px] font-semibold text-[0.9375rem]
                    border-b-2 transition-colors ${
                      current
                        ? "text-copper-light border-copper"
                        : "text-ink border-transparent hover:text-copper"
                    }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Номер телефона в шапке — главный способ связи у клиента.

              Плашка с НОМЕРОМ показывается на всех ширинах, как в макете. До
              этого ниже sm она сжималась в круглую иконку 44×44 — вид, которого
              в макете нет. Помещается: при 375 макет тратит на шапку 310,6px
              (лого 71 + 8 + плашка 179,6 + 8 + бургер 44) при 337,5px
              контейнера, у нас контейнер шире (343px при px-4). Числа замерены,
              расчёт в отчёте F-87.

              Компактный режим повторяет макет: до 1000px подпись «Jetzt per
              WhatsApp» скрыта, номер 13px, поля 0.75rem, зазор 0.5rem; до 360px
              номер 12px и поля 0.55rem. */}
          <a
            href={`https://wa.me/${WA}`}
            rel="noopener"
            className="inline-flex items-center gap-2 lg:gap-3 flex-none bg-copper hover:bg-copper-dark
              text-white rounded-[10px] px-3 lg:px-[1.4rem] max-[360px]:px-[0.55rem] py-2
              min-h-[44px] transition-colors ml-auto lg:ml-0"
          >
            <span className="flex-none w-[34px] h-[34px] rounded-full bg-white/[0.18] grid place-items-center">
              <WhatsAppIcon className="w-[19px] h-[19px]" />
            </span>
            <span className="flex flex-col leading-[1.15] lg:leading-tight text-left">
              <strong className="text-[13px] lg:text-[0.9375rem] max-[360px]:text-[12px] font-semibold whitespace-nowrap">
                {site.phone}
              </strong>
              {/* Подпись до 1000px не показывается (как в макете), но остаётся
                  доступной: sr-only вместо hidden — иначе на узких ширинах имя
                  ссылки теряет слово WhatsApp. */}
              <small className="sr-only lg:not-sr-only lg:text-xs lg:opacity-90">Jetzt per WhatsApp</small>
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
