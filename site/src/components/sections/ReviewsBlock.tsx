// Server component — visible on-page reviews required by Google for valid
// AggregateRating display (self-serving stars without visible reviews are
// not shown). PX-031 Phase A.
//
// Source: 2 verified Google Business Profile reviews from Osnabrück
// customers (CEO confirmed with Kevin via WhatsApp 2026-05-02).

import reviewsData from "@/data/reviews.json";

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
  aggregateRating: {
    ratingValue: number;
    ratingCount: number;
    bestRating: number;
    worstRating: number;
  };
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
  const { aggregateRating, reviews } = data;

  return (
    <section
      className="py-16 md:py-24 bg-cream"
      aria-labelledby="reviews-heading"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2
            id="reviews-heading"
            className="font-heading text-3xl md:text-4xl font-bold text-charcoal mb-3"
          >
            Was unsere Kunden sagen
          </h2>
          <div className="flex items-center justify-center gap-3 mb-2">
            <StarRating rating={aggregateRating.ratingValue} />
            <span className="text-charcoal text-lg font-semibold">
              {aggregateRating.ratingValue.toFixed(1)} / {aggregateRating.bestRating}
            </span>
          </div>
          <p className="text-charcoal-light text-sm">
            {aggregateRating.ratingCount} verifizierte Bewertungen aus Google
            Unternehmensprofil
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((r) => (
            <article
              key={r.id}
              className="bg-cream-dark border border-sand/30 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <StarRating rating={r.rating} />
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
              <p className="text-charcoal leading-relaxed mb-4 text-base">
                „{r.text}"
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

        <p className="text-center text-xs text-charcoal-light/70 mt-6">
          Quelle: {data.source}
        </p>
      </div>
    </section>
  );
}
