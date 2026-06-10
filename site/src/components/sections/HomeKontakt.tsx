// PX-065: Large contact CTA block on homepage — Kevin's request 2026-06-10
// ("nochmal Kontakt Bereich in größer"). Mirrors the city-page CTA block
// but full-width and prominent. Phone/WhatsApp/E-Mail/Kontaktformular.

import Link from "next/link";
import { WhatsAppIcon, PhoneIcon, EnvelopeIcon } from "@/components/ContactIcons";

export default function HomeKontakt() {
  return (
    <section className="py-20 md:py-28 bg-charcoal text-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
          Jetzt kostenlos anfragen
        </h2>
        <p className="text-cream/80 text-lg mb-10 leading-relaxed max-w-2xl mx-auto">
          Sie brauchen Unterstützung rund ums Haus, Garten oder Dach?
          Kontaktieren Sie uns für eine kostenlose und unverbindliche
          Besichtigung — telefonisch, per WhatsApp oder über das Kontaktformular.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
          <a
            href="tel:+4915239603175"
            className="inline-flex items-center justify-center gap-2 px-5 py-4 bg-copper text-white font-semibold rounded-xl hover:bg-copper-dark transition"
          >
            <PhoneIcon className="w-5 h-5 flex-shrink-0" variant="mono" />
            <span>Anrufen</span>
          </a>
          <a
            href="https://wa.me/4915239603175"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-4 bg-[#25D366] text-white font-semibold rounded-xl hover:bg-[#1ebd5a] transition"
          >
            <WhatsAppIcon className="w-5 h-5 flex-shrink-0" variant="light" />
            <span>WhatsApp</span>
          </a>
          <a
            href="mailto:kontakt@rundumshaus-littawe.de"
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
        <p className="mt-8 text-cream/70">
          Telefon:{" "}
          <a href="tel:+4915239603175" className="underline hover:text-cream">
            +49 1523 9603175
          </a>
        </p>
      </div>
    </section>
  );
}
