// PX-064: Homepage Einsatzgebiet text + closing slogan (Kevin verbatim).
// PX-070: texts moved to homepage.json (CMS-editable).

import Link from "next/link";
import homepageData from "@/data/homepage.json";
import type { HomepageData } from "@/data/types";
import SectionHeading from "@/components/ui/SectionHeading";

const data = (homepageData as HomepageData).einsatzgebiet;

export default function HomeEinsatzgebiet() {
  return (
    <section className="py-20 md:py-28 bg-cream-dark/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <SectionHeading eyebrow="Einsatzgebiet" className="mb-6">
          {data.heading}
        </SectionHeading>
        <p className="text-charcoal-light text-lg leading-relaxed mb-4">
          {data.text1}
        </p>
        <p className="text-charcoal-light leading-relaxed mb-8">
          {data.text2}
        </p>
        <Link
          href="/einsatzgebiet/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-copper text-white font-semibold rounded-lg hover:bg-copper-dark transition"
        >
          {data.ctaLabel}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>

        <p className="mt-14 text-charcoal-light italic leading-relaxed border-t border-sand/30 pt-10">
          {data.slogan}
        </p>
      </div>
    </section>
  );
}
