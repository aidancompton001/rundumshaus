import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import BewertungenSlider from "@/components/sections/BewertungenSlider";
import ServiceOverview from "@/components/sections/ServiceOverview";
import AboutSection from "@/components/sections/AboutSection";
import WarumWir from "@/components/sections/WarumWir";
import HomeEinsatzgebiet from "@/components/sections/HomeEinsatzgebiet";
import HomeFAQ from "@/components/sections/HomeFAQ";
import HomeKontakt from "@/components/sections/HomeKontakt";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// PX-065: section order per Kevin's WhatsApp 2026-06-10:
// 1 Hero · 2 Bewertungen · 3 Leistungen · 4 Über uns · 5 Warum wir ·
// 6 Einsatzgebiet · 7 großer Kontakt-Bereich.
// FaktenBlock + StandortOsnabrueck removed (not in Kevin's list).
// FAQ kept before Kontakt (Kevin supplied the text + FAQPage schema for SEO).
export default function Home() {
  return (
    <>
      <Hero />
      <BewertungenSlider />
      <ServiceOverview />
      <AboutSection />
      <WarumWir />
      <HomeEinsatzgebiet />
      <HomeFAQ />
      <HomeKontakt />
    </>
  );
}
