import type { ReactNode } from "react";
import { getHref } from "@/lib/getImageUrl";
import BrushDivider from "@/components/ui/BrushDivider";

/**
 * Шапка внутренней страницы по макету (docs/design/v1-desktop, `.page-hero`):
 * тёмная полоса, хлебные крошки, H1 весом 900 и подводка.
 *
 * Один компонент на все внутренние страницы: их семь, и без общей основы
 * оформление разъезжается — ровно то, из-за чего перенос пришлось
 * переделывать (docs/POSTMORTEM_T008_perenos.md).
 */
export default function PageHero({
  title,
  intro,
  crumb,
  crumbHref,
  parent,
}: {
  title: ReactNode;
  intro?: ReactNode;
  /** Название страницы в крошках */
  crumb: string;
  crumbHref?: string;
  /** Промежуточное звено, например «Leistungen» */
  parent?: { label: string; href: string };
}) {
  return (
    <section className="bg-dark text-white relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 md:pt-12 md:pb-16">
        <nav
          className="flex flex-wrap items-center gap-1.5 text-sm text-white/70 mb-4"
          aria-label="Brotkrumen-Navigation"
        >
          <a href={getHref("/")} className="hover:text-white">Startseite</a>
          <span aria-hidden="true">›</span>
          {parent && (
            <>
              <a href={getHref(parent.href)} className="hover:text-white">{parent.label}</a>
              <span aria-hidden="true">›</span>
            </>
          )}
          {crumbHref ? (
            <a href={getHref(crumbHref)} className="hover:text-white">{crumb}</a>
          ) : (
            <span aria-current="page">{crumb}</span>
          )}
        </nav>

        <h1 className="font-heading font-black text-3xl md:text-[2.875rem] leading-tight max-w-[24ch]">
          {title}
        </h1>

        {intro && <p className="mt-3 text-white/70 max-w-[62ch] text-lg">{intro}</p>}
      </div>
      <BrushDivider />
    </section>
  );
}
