"use client";

import referenzenData from "@/data/referenzen.json";
import type { ReferenzenData } from "@/data/types";
import { ScrollReveal, Stagger } from "@/components/motion";
import { getImageUrl, toWebp } from "@/lib/getImageUrl";
import PageHero from "@/components/ui/PageHero";

const data = referenzenData as ReferenzenData;

export default function ReferenzenContent() {
  return (
    <>
      <PageHero
        title={data.heading}
        intro="Vorher & Nachher — unsere Arbeit spricht für sich."
        crumb="Referenzen"
      />
    <section className="py-14 md:py-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">

        {data.items.length === 0 ? (
          <ScrollReveal className="text-center py-20">
            <div className="max-w-md mx-auto">
              <span className="text-6xl block mb-6">📷</span>
              <p className="text-charcoal-light text-lg animate-pulse">
                {data.emptyState}
              </p>
            </div>
          </ScrollReveal>
        ) : (
          <Stagger staggerDelay={100} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.items.map((item) => (
              <div
                key={item.id}
                className="group bg-cream-dark border border-sand/30 rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {item.steps && item.steps.length > 0 ? (
                  // PX-036b: multi-step gallery — 2×2 grid with labels.
                  <div className="aspect-[4/3] grid grid-cols-2 grid-rows-2 gap-px overflow-hidden bg-charcoal/10">
                    {item.steps.slice(0, 4).map((s, i) => (
                      <figure key={i} className="relative m-0 overflow-hidden">
                        <picture>
                          <source type="image/webp" srcSet={getImageUrl(toWebp(s.src))} />
                          <img
                            src={getImageUrl(s.src)}
                            alt={`${s.label} — ${item.title}`}
                            width={400}
                            height={300}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                            decoding="async"
                          />
                        </picture>
                        <figcaption className="absolute left-2 bottom-2 z-10 px-[0.55rem] py-[0.2rem] bg-charcoal text-cream text-xs font-bold leading-tight rounded-full max-w-[calc(100%-1rem)]">
                          {i + 1}. {s.label}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                ) : item.before === item.after ? (
                  // Single composite image (legacy split-image references)
                  <div className="aspect-[4/3] overflow-hidden">
                    <picture>
                      <source type="image/webp" srcSet={getImageUrl(toWebp(item.before))} />
                      <img
                        src={getImageUrl(item.before)}
                        alt={`Vorher/Nachher — ${item.title}`}
                        width={800}
                        height={600}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                    </picture>
                  </div>
                ) : (
                  // Side-by-side vorher | nachher with labels
                  <div className="aspect-[4/3] grid grid-cols-2 gap-px overflow-hidden bg-charcoal/10">
                    <figure className="relative m-0 overflow-hidden">
                      <picture>
                        <source type="image/webp" srcSet={getImageUrl(toWebp(item.before))} />
                        <img
                          src={getImageUrl(item.before)}
                          alt={`Vorher — ${item.title}`}
                          width={400}
                          height={600}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                          decoding="async"
                        />
                      </picture>
                      <figcaption className="absolute left-2 bottom-2 z-10 px-[0.55rem] py-[0.2rem] bg-charcoal text-cream text-xs font-bold leading-tight rounded-full max-w-[calc(100%-1rem)]">
                        Vorher
                      </figcaption>
                    </figure>
                    <figure className="relative m-0 overflow-hidden">
                      <picture>
                        <source type="image/webp" srcSet={getImageUrl(toWebp(item.after))} />
                        <img
                          src={getImageUrl(item.after)}
                          alt={`Nachher — ${item.title}`}
                          width={400}
                          height={600}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                          decoding="async"
                        />
                      </picture>
                      <figcaption className="absolute left-2 bottom-2 z-10 px-[0.55rem] py-[0.2rem] bg-charcoal text-cream text-xs font-bold leading-tight rounded-full max-w-[calc(100%-1rem)]">
                        Nachher
                      </figcaption>
                    </figure>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-heading text-xl font-extrabold text-charcoal mb-2">
                    {item.title}
                  </h3>
                  <p className="text-charcoal-light text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </Stagger>
        )}
      </div>
    </section>
    </>
  );
}
