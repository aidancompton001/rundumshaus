// PX-065: Large contact CTA block on homepage (Kevin's request).
// PX-070: texts moved to homepage.json (CMS-editable).

import Link from "next/link";
import homepageData from "@/data/homepage.json";
import type { HomepageData } from "@/data/types";
import siteData from "@/data/site.json";
import { WhatsAppIcon, PhoneIcon, EnvelopeIcon } from "@/components/ContactIcons";

const data = (homepageData as HomepageData).kontaktCta;
const PHONE = (siteData as { phone: string }).phone.replace(/\s+/g, "");
const EMAIL = (siteData as { email: string }).email;
const WA = PHONE.replace(/^\+/, "");

export default function HomeKontakt() {
  return (
    <section className="py-20 md:py-28 bg-charcoal text-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
          {data.heading}
        </h2>
        <p className="text-cream/80 text-lg mb-10 leading-relaxed max-w-2xl mx-auto">
          {data.text}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
          <a
            href={`tel:${PHONE}`}
            className="inline-flex items-center justify-center gap-2 px-5 py-4 bg-copper text-white font-semibold rounded-xl hover:bg-copper-dark transition"
          >
            <PhoneIcon className="w-5 h-5 flex-shrink-0" variant="mono" />
            <span>Anrufen</span>
          </a>
          <a
            href={`https://wa.me/${WA}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-4 bg-[#25D366] text-white font-semibold rounded-xl hover:bg-[#1ebd5a] transition"
          >
            <WhatsAppIcon className="w-5 h-5 flex-shrink-0" variant="light" />
            <span>WhatsApp</span>
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="inline-flex items-center justify-center gap-2 px-5 py-4 border border-cream/40 text-cream font-semibold rounded-xl hover:bg-cream/10 transition"
          >
            <EnvelopeIcon className="w-5 h-5 flex-shrink-0" variant="mono" />
            <span>E-Mail</span>
          </a>
          <Link
            href="/kontakt/"
            className="inline-flex items-center justify-center gap-2 px-5 py-4 border border-cream/40 text-cream font-semibold rounded-xl hover:bg-cream/10 transition"
          >
            <span>Kontaktformular</span>
          </Link>
        </div>
        {/* PX-067: duplicate "Telefon: ..." line removed per Kevin 2026-06-10 */}
      </div>
    </section>
  );
}
