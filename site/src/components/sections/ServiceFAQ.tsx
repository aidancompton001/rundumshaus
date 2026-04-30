import serviceFaqData from "@/data/service-faq.json";
import type { ServiceFAQData } from "@/data/types";
import { ScrollReveal } from "@/components/motion";
import Accordion from "@/components/ui/Accordion";

const data = serviceFaqData as ServiceFAQData;

interface ServiceFAQProps {
  serviceId: "gartenpflege" | "entruempelung";
}

export default function ServiceFAQ({ serviceId }: ServiceFAQProps) {
  const faq = data[serviceId];

  // Schema.org FAQPage JSON-LD for Google Rich Results
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <section
      id={`${serviceId}-faq`}
      className="py-16 md:py-20 bg-cream-dark/40 border-t border-sand/20"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-10">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-charcoal mb-3">
            {faq.title}
          </h2>
          <p className="text-charcoal-light text-base">{faq.subheading}</p>
        </ScrollReveal>

        <ScrollReveal>
          <div className="bg-cream rounded-2xl shadow-md border border-sand/30 px-5 sm:px-8">
            {faq.items.map((item, idx) => (
              <Accordion key={idx} title={item.q}>
                <p className="leading-relaxed">{item.a}</p>
              </Accordion>
            ))}
          </div>
        </ScrollReveal>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </div>
    </section>
  );
}
