import { Fragment } from "react";
import siteData from "@/data/site.json";
import servicesData from "@/data/services.json";
import type { SiteConfig } from "@/data/types";
import { getHref, getImageUrl } from "@/lib/getImageUrl";
import {
  PhoneIcon,
  WhatsAppIcon,
  EnvelopeIcon,
  MapPinIcon,
} from "@/components/ContactIcons";

const site = siteData as SiteConfig;
const services = (servicesData as { services: { id: string; title: string }[] })
  .services;

/**
 * Beschreibung unter dem Logo — im Mockup als `data-cms="site.footer.description"`
 * markiert, in `site.json` gibt es das Feld aber noch nicht. Kundendaten werden
 * hier nicht eigenmächtig angelegt; sobald `site.footer.description` existiert,
 * ersetzt es diese Konstante.
 */
const FOOTER_DESCRIPTION =
  "Ihr Partner für Gartenpflege, Entrümpelung, Hausmeisterservice, Dachservice & Dachpflege, Garten- und Landschaftsbau und mehr in Osnabrück und Umgebung.";

const waHref = `https://wa.me/${site.phone.replace(/\D/g, "")}`;

/**
 * Die Kontaktspalte ist ab `lg` schmal; die E-Mail passt dort nicht in eine Zeile.
 * Deshalb werden erlaubte Umbruchstellen (`@` und der Domain-Bindestrich) explizit
 * als `<wbr>` gesetzt — der Browser bricht dann dort statt mitten im Wort.
 * Der Text selbst kommt unverändert aus `site.json`, `<wbr>` fügt kein Zeichen hinzu.
 */
const EMAIL_PARTS = site.email.split(/(?<=[@-])/);

const linkClass =
  "text-sm inline-flex items-center min-h-[24px] hover:text-cream transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-gold after:transition-all after:duration-300 hover:after:w-full";

/** Nav-Einträge, die in der Spalte «Informationen» stehen (Leistungen: eigene Spalte). */
const infoNav = site.navigation.filter((l) => l.href !== "/leistungen/");

export default function Footer() {
  return (
    <footer className="bg-charcoal text-cream/75">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Vier Spalten wie im Mockup: Marke, Leistungen, Informationen, Kontakt.
            Trennlinien zwischen den Spalten (Mockup: .footer-col border-left). */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1.25fr] gap-8 md:gap-10">
          {/* 1 — Marke: Logo, Beschreibung, runder WhatsApp-Button */}
          <div className="min-w-0 lg:pr-8">
            <img
              src={getImageUrl("/images/branding/logo-client.png")}
              alt={site.company}
              width={180}
              height={54}
              className="h-12 w-auto rounded bg-white/95 px-2 py-1 mb-4"
            />
            <p className="text-sm leading-relaxed mb-5">{FOOTER_DESCRIPTION}</p>
            <div className="flex gap-2.5">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-11 h-11 rounded-full border-[1.5px] border-cream/15 grid place-items-center text-cream hover:border-gold hover:text-gold transition-colors duration-200"
              >
                <WhatsAppIcon className="w-5 h-5" variant="mono" />
              </a>
            </div>
          </div>

          {/* 2 — Leistungen */}
          <nav aria-label="Leistungen" className="min-w-0 lg:border-l lg:border-cream/15 lg:pl-8">
            <h4 className="font-heading text-lg font-semibold text-cream mb-4">
              Leistungen
            </h4>
            <ul className="space-y-2 [&_li]:break-words [hyphens:auto]">
              {services.map((s) => (
                <li key={s.id}>
                  <a href={getHref(`/leistungen/#${s.id}`)} className={linkClass}>
                    {s.title}
                  </a>
                </li>
              ))}
              {site.navigation
                .filter((l) => l.href === "/leistungen/")
                .map((l) => (
                  <li key={l.href}>
                    <a href={getHref(l.href)} className={linkClass}>
                      {l.label}
                    </a>
                  </li>
                ))}
              <li>
                <a href={getHref("/leistungen/rasen-neuanlage/")} className={linkClass}>
                  Rasen neu anlegen
                </a>
              </li>
              <li>
                <a href={getHref("/leistungen/objektpflege/")} className={linkClass}>
                  Objektpflege (B2B)
                </a>
              </li>
            </ul>
          </nav>

          {/* 3 — Informationen */}
          <nav aria-label="Informationen" className="min-w-0 lg:border-l lg:border-cream/15 lg:pl-8">
            <h4 className="font-heading text-lg font-semibold text-cream mb-4">
              Informationen
            </h4>
            <ul className="space-y-2 [&_li]:break-words [hyphens:auto]">
              {infoNav.map((link) => (
                <li key={link.href}>
                  <a href={getHref(link.href)} className={linkClass}>
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={getHref("/osnabrueck/")} className={linkClass}>
                  Standort Osnabrück
                </a>
              </li>
              {site.footer.legalLinks.map((link) => (
                <li key={link.href}>
                  <a href={getHref(link.href)} className={linkClass}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* 4 — Kontakt: runde Icon-Badges wie im Mockup */}
          <div className="min-w-0 lg:border-l lg:border-cream/15 lg:pl-8">
            <h4 className="font-heading text-lg font-semibold text-cream mb-4">
              Kontakt
            </h4>
            <ul className="space-y-3.5 text-sm [&_li]:min-w-0 [&_li]:break-words">
              <li className="flex items-center gap-3">
                <span className="flex-none w-10 h-10 rounded-full border-[1.5px] border-cream/15 grid place-items-center text-gold">
                  <PhoneIcon className="w-[18px] h-[18px]" variant="mono" />
                </span>
                <a
                  href={`tel:${site.phone}`}
                  className="inline-flex items-center min-h-[24px] hover:text-cream transition-colors"
                >
                  {site.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex-none w-10 h-10 rounded-full border-[1.5px] border-cream/15 grid place-items-center text-gold">
                  <EnvelopeIcon className="w-[18px] h-[18px]" variant="mono" />
                </span>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-center min-h-[24px] hover:text-cream transition-colors"
                >
                  {EMAIL_PARTS.map((part, i) => (
                    <Fragment key={i}>
                      {part}
                      {i < EMAIL_PARTS.length - 1 ? <wbr /> : null}
                    </Fragment>
                  ))}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-none w-10 h-10 rounded-full border-[1.5px] border-cream/15 grid place-items-center text-gold">
                  <MapPinIcon className="w-[18px] h-[18px]" variant="mono" />
                </span>
                {/* NAP für die lokale Suche: Name, Adresse, Telefon stehen auf jeder Seite */}
                <address className="not-italic leading-relaxed">
                  <span className="block">{site.owner}</span>
                  <span className="block">{site.address.street}</span>
                  <span className="block">
                    {site.address.zip} {site.address.city}
                  </span>
                </address>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-cream/15 text-center text-sm text-cream/50">
          {site.footer.copyright}
        </div>
      </div>
    </footer>
  );
}
