// PX-064: Homepage FAQ — Kevin's 4 verbatim questions.
// PX-070: texts moved to homepage.json (CMS-editable); FAQPage schema
// derives from the SAME data (single source, L-015).

import homepageData from "@/data/homepage.json";
import type { HomepageData } from "@/data/types";

const data = (homepageData as HomepageData).faq;

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: data.items.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function HomeFAQ() {
  return (
    <section className="py-20 md:py-28 bg-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-charcoal mb-10 text-center">
          {data.heading}
        </h2>
        <div className="space-y-3">
          {data.items.map((f, i) => (
            <details
              key={i}
              className="group bg-cream-dark border border-sand/30 rounded-xl p-5"
            >
              <summary className="cursor-pointer font-medium text-charcoal flex justify-between items-center">
                <span>{f.q}</span>
                <span className="ml-4 text-copper transition-transform group-open:rotate-45" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="mt-3 text-charcoal-light leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
