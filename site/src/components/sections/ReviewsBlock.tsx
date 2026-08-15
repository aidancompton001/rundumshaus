// Server component — Bewertungsblock auf /ueber-uns.
//
// Texte und Daten stammen wortwörtlich aus dem Google-Unternehmensprofil
// (Places API, place_id ChIJlwdlLxePaQER5QKZVHCPPx0). Wir prüfen sie nicht
// selbst — deshalb steht hier der Herkunftshinweis nach § 5b Abs. 3 UWG und
// nirgends die Behauptung, die Bewertungen seien von uns geprüft worden
// (Anhang Nr. 23b zu § 3 UWG).
//
// Zahlen: 5,0 und 10 sind Profilzahlen aus reviews.json (googleProfile),
// die Zahl der gezeigten Karten ist reviews.length.

import reviewsData from "@/data/reviews.json";
import {
  GOOGLE_PROFILE,
  GoogleLogo,
  GoogleProfileButton,
  GoogleProfileFigures,
  ReviewsSourceNote,
  ShownSelectionNote,
} from "@/components/ui/GoogleReviewBits";

interface Review {
  id: string;
  author: string;
  city: string;
  rating: number;
  datePublished: string;
  text: string;
  service: string | null;
}

const data = reviewsData as {
  source: string;
  reviews: Review[];
};

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div
      className="inline-flex items-center gap-0.5 text-copper"
      aria-label={`${rating} von ${max} Sternen`}
    >
      {Array.from({ length: max }, (_, i) => (
        <svg
          key={i}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill={i < rating ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsBlock() {
  const { reviews } = data;

  return (
    <section
      className="py-16 md:py-24 bg-cream"
      aria-labelledby="reviews-heading"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2
            id="reviews-heading"
            className="font-heading text-3xl md:text-4xl font-extrabold text-charcoal mb-3"
          >
            Kundenstimmen aus unserem Google-Unternehmensprofil
          </h2>
          <div className="flex items-center justify-center gap-3 mb-2">
            <StarRating rating={GOOGLE_PROFILE.ratingValue} />
            <span className="text-charcoal text-lg font-semibold">
              <GoogleProfileFigures />
            </span>
          </div>
          <p className="text-charcoal-light text-sm">
            <ShownSelectionNote shown={reviews.length} />
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((r) => (
            <article
              key={r.id}
              className="bg-cream-dark border border-sand/30 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <GoogleLogo />
                  <StarRating rating={r.rating} />
                </div>
                <time
                  dateTime={r.datePublished}
                  className="text-xs text-charcoal-light"
                >
                  {new Date(r.datePublished).toLocaleDateString("de-DE", {
                    year: "numeric",
                    month: "long",
                  })}
                </time>
              </div>
              <p className="text-charcoal leading-relaxed mb-4 text-base whitespace-pre-line">
                &bdquo;{r.text}&ldquo;
              </p>
              <footer className="text-sm text-charcoal-light">
                <strong className="text-charcoal">{r.author}</strong>
                {" — "}
                {r.city}
                {r.service && (
                  <>
                    {" · "}
                    <span className="text-copper">{r.service}</span>
                  </>
                )}
              </footer>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <GoogleProfileButton className="inline-flex items-center gap-2 px-6 py-3 bg-copper text-white font-semibold rounded-lg hover:bg-copper-dark transition" />
        </div>

        <ReviewsSourceNote className="text-center text-sm text-charcoal-light mt-6 max-w-2xl mx-auto" />

        <div className="mt-10 text-center border-t border-sand/30 pt-8">
          <p className="text-charcoal mb-4">
            Sie waren Kunde? Wir freuen uns über Ihre Bewertung.
          </p>
          <a
            href={GOOGLE_PROFILE.reviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-copper text-white font-semibold rounded-lg hover:bg-copper-dark transition"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
            </svg>
            Bei Google bewerten
          </a>
        </div>
      </div>
    </section>
  );
}
