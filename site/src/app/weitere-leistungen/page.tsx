import { generateSEO } from "@/lib/seo";
import weitereData from "@/data/weitere-leistungen.json";
import { ScrollReveal, Stagger } from "@/components/motion";

export const metadata = generateSEO({
  title: "Weitere Leistungen",
  description:
    "Weitere Dienstleistungen von Rund ums Haus Littawe — Fassadenreinigung, Winterdienst, Gebäudereinigung und mehr in Osnabrück und Umgebung.",
  path: "/weitere-leistungen",
});

export default function WeitereLeistungenPage() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-charcoal mb-4">
            {weitereData.heading}
          </h1>
          <p className="text-charcoal-light text-lg max-w-2xl mx-auto">
            {weitereData.subheading}
          </p>
        </ScrollReveal>

        <Stagger staggerDelay={80} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {weitereData.services.map((service) => (
            <div
              key={service}
              className="flex items-center gap-3 bg-cream-dark border border-sand/20 rounded-xl px-5 py-4 transition-colors hover:border-copper/30"
            >
              <span className="text-copper text-xl flex-shrink-0">&#10003;</span>
              <span className="text-charcoal font-body text-base">
                {service}
              </span>
            </div>
          ))}
        </Stagger>

        <ScrollReveal className="mt-10 text-center">
          <p className="text-charcoal-light text-lg italic">
            {weitereData.footer}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
