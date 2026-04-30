import serviceAreasData from "@/data/service-areas.json";
import type { ServiceAreasData } from "@/data/types";
import { ScrollReveal } from "@/components/motion";

const data = serviceAreasData as ServiceAreasData;

export default function Servicegebiet() {
  const totalCities = data.regions.reduce(
    (sum, r) => sum + r.cities.length,
    0
  );

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-charcoal mb-4">
            {data.heading}
          </h1>
          <p className="text-charcoal-light text-lg max-w-2xl mx-auto">
            {data.subheading}
          </p>
          <p className="text-copper text-sm font-semibold uppercase tracking-wider mt-4">
            {totalCities}+ Städte und Gemeinden
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.regions.map((region) => (
            <ScrollReveal key={region.name}>
              <div className="bg-cream-dark border border-sand/30 rounded-2xl p-6 h-full">
                <h2 className="font-heading text-xl font-semibold text-charcoal mb-4 pb-3 border-b border-sand/30">
                  {region.name}
                </h2>
                <ul className="space-y-1.5">
                  {region.cities.map((city) => (
                    <li
                      key={city}
                      className="flex items-start gap-2 text-charcoal-light text-sm"
                    >
                      <span
                        className="text-copper flex-shrink-0 mt-0.5"
                        aria-hidden="true"
                      >
                        &bull;
                      </span>
                      <span>{city}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mt-12 text-center">
          <p className="text-charcoal-light text-base italic max-w-2xl mx-auto">
            {data.footer}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
