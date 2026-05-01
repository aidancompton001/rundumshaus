import serviceFaqData from "@/data/service-faq.json";
import type { ServiceFAQData } from "@/data/types";

const data = serviceFaqData as ServiceFAQData;

/**
 * Single FAQPage Schema.org JSON-LD covering all service FAQ items.
 * Rendered ONCE per page to avoid Google "duplicate FAQPage" Rich Results error.
 * Combines Gartenpflege + Entrümpelung questions into one mainEntity array.
 */
export default function FAQSchema() {
  const allItems = [
    ...data.gartenpflege.items,
    ...data.entruempelung.items,
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
