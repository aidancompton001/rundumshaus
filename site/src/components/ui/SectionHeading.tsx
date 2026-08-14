import type { ReactNode } from "react";

/**
 * Заголовок раздела по макету клиента (docs/design/v1-desktop/index.html):
 * надзаголовок капителью → H2 → разделитель «линия–точка–линия».
 *
 * Один компонент на весь сайт: разделов больше двадцати, и без общей основы
 * оформление разъезжается между страницами — именно это ревьюер назвал
 * главным риском «двухдизайнного» сайта.
 */
export default function SectionHeading({
  eyebrow,
  children,
  subheading,
  onDark = false,
  compact = false,
  className = "",
  id,
}: {
  eyebrow?: string;
  children: ReactNode;
  subheading?: ReactNode;
  onDark?: boolean;
  /** Городская страница — статья: там заголовок раздела на ступень мельче */
  compact?: boolean;
  className?: string;
  id?: string;
}) {
  return (
    <div className={`text-center ${className}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2
        id={id}
        className={`font-heading ${
          compact ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl"
        } font-extrabold ${
          onDark ? "text-cream" : "text-charcoal"
        } [text-wrap:balance]`}
      >
        {children}
      </h2>
      <div
        className={`heading-divider${onDark ? " heading-divider--on-dark" : ""}`}
        aria-hidden="true"
      >
        <span />
      </div>
      {subheading && (
        <p
          className={`mt-5 text-lg max-w-2xl mx-auto ${
            onDark ? "text-cream/70" : "text-charcoal-light"
          }`}
        >
          {subheading}
        </p>
      )}
    </div>
  );
}
