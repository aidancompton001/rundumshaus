import Link from "next/link";
import serviceAreasData from "@/data/service-areas.json";
import type { ServiceAreasData } from "@/data/types";
import { ScrollReveal } from "@/components/motion";
import { CITIES, SERVICE_IDS, type ServiceId } from "@/lib/programmatic";

const data = serviceAreasData as ServiceAreasData;

// Build name → slug map once.
const NAME_TO_SLUG = new Map(CITIES.map((c) => [c.name, c.slug]));

// Top 10 cities by tier+distance for each service — balanced inbound from /einsatzgebiet
// to all 5 service-landings (Landa CL fix). Picks closest, highest-tier cities.
const TOP_CITIES_FOR_LINKS = CITIES
  .slice()
  .sort((a, b) => a.tier - b.tier || a.distanceKm - b.distanceKm)
  .slice(0, 10);

const SERVICE_TITLES: Record<ServiceId, string> = {
  hausmeisterservice: "Hausmeisterservice",
  gartenpflege: "Gartenpflege",
  dacharbeiten: "Dachreinigung",
  entruempelung: "Entrümpelung",
  schrottabholung: "Schrottabholung",
};

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
            {totalCities} Städte und Gemeinden — jede mit eigener Leistungs-Seite
          </p>
        </ScrollReveal>

        {/* Multi-service top-cities sections — balanced inbound to all 5 services (Landa CL fix) */}
        <ScrollReveal className="mb-12">
          <h2 className="font-heading text-2xl font-semibold text-charcoal mb-4">
            Beliebte Leistungen in unseren Top-Städten
          </h2>
          <p className="text-charcoal-light mb-6">
            Direkter Zugang zu unseren 5 Hauptleistungen in den nahegelegenen Städten.
            Für Ihre konkrete Stadt nutzen Sie die regionale Übersicht weiter unten oder
            rufen Sie uns direkt an.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 text-sm">
            {SERVICE_IDS.map((sid) => (
              <div key={sid}>
                <h3 className="font-heading text-base font-semibold text-charcoal mb-2">
                  {SERVICE_TITLES[sid]}
                </h3>
                <ul className="space-y-1">
                  {TOP_CITIES_FOR_LINKS.map((c) => (
                    <li key={`${sid}-${c.slug}`}>
                      <Link
                        href={`/leistungen/${sid}/${c.slug}/`}
                        className="text-charcoal-light hover:text-copper transition-colors"
                      >
                        {SERVICE_TITLES[sid]} {c.displayName}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <h2 className="font-heading text-2xl font-semibold text-charcoal mb-6">
          Alle {totalCities} Städte im Einsatzgebiet
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.regions.map((region) => (
            <ScrollReveal key={region.name}>
              <div className="bg-cream-dark border border-sand/30 rounded-2xl p-6 h-full">
                <h2 className="font-heading text-xl font-semibold text-charcoal mb-4 pb-3 border-b border-sand/30">
                  {region.name}
                </h2>
                <ul className="space-y-1.5">
                  {region.cities.map((city) => {
                    const slug = NAME_TO_SLUG.get(city);
                    if (!slug) {
                      return (
                        <li
                          key={city}
                          className="flex items-start gap-2 text-charcoal-light text-sm"
                        >
                          <span className="text-copper flex-shrink-0 mt-0.5" aria-hidden="true">&bull;</span>
                          <span>{city}</span>
                        </li>
                      );
                    }
                    return (
                      <li
                        key={city}
                        className="flex items-start gap-2 text-sm"
                      >
                        <span className="text-copper flex-shrink-0 mt-0.5" aria-hidden="true">&bull;</span>
                        <Link
                          href={`/leistungen/gartenpflege/${slug}/`}
                          className="text-charcoal-light hover:text-copper transition-colors"
                          title={`Leistungen in ${city} ansehen`}
                        >
                          {city}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mt-12 max-w-3xl mx-auto">
          <p className="text-charcoal-light text-base italic text-center mb-4">
            {data.footer}
          </p>
          <p className="text-sm text-charcoal-light text-center">
            Für jede Stadt finden Sie eigene Detailseiten zu unseren 5 Hauptleistungen — klicken Sie auf den Stadtnamen für{" "}
            <Link href="/leistungen" className="text-copper hover:underline">
              Gartenpflege
            </Link>
            , oder rufen Sie an für andere Leistungen: {" "}
            <a href="tel:+4915239603175" className="text-copper hover:underline">
              +49 1523 9603175
            </a>.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
