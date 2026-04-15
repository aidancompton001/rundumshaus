import siteData from "@/data/site.json";
import type { SiteConfig } from "@/data/types";
import { getHref, getImageUrl } from "@/lib/getImageUrl";
import { PhoneIcon, WhatsAppIcon, EnvelopeIcon } from "@/components/ContactIcons";

const site = siteData as SiteConfig;

export default function Footer() {
  return (
    <footer className="bg-charcoal text-cream/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <img
                src={getImageUrl("/images/branding/logo-client.png")}
                alt={site.company}
                width={180}
                height={54}
                className="h-12 w-auto rounded bg-white/95 px-2 py-1"
              />
            </div>
            <address className="not-italic text-sm leading-relaxed">
              <p>{site.owner}</p>
              <p>{site.address.street}</p>
              <p>
                {site.address.zip} {site.address.city}
              </p>
            </address>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-cream mb-4">
              Seiten
            </h4>
            <ul className="space-y-2">
              {site.navigation.map((link) => (
                <li key={link.href}>
                  <a
                    href={getHref(link.href)}
                    className="text-sm hover:text-cream transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-gold after:transition-all after:duration-300 hover:after:w-full"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Legal */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-cream mb-4">
              Kontakt
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={`tel:${site.phone}`}
                  className="inline-flex items-center gap-1.5 hover:text-cream transition-colors"
                >
                  <PhoneIcon className="w-4 h-4 inline-block align-middle" variant="mono" />
                  <span>{site.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/4915239603175"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-cream transition-colors"
                >
                  <WhatsAppIcon className="w-4 h-4 inline-block align-middle" variant="mono" />
                  <span>WhatsApp</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-center gap-1.5 hover:text-cream transition-colors"
                >
                  <EnvelopeIcon className="w-4 h-4 inline-block align-middle" variant="mono" />
                  <span>{site.email}</span>
                </a>
              </li>
            </ul>
            <ul className="mt-6 space-y-2 text-sm">
              {site.footer.legalLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={getHref(link.href)}
                    className="hover:text-cream transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-white/[0.08] text-center text-sm text-cream/50">
          {site.footer.copyright}
        </div>
      </div>
    </footer>
  );
}
