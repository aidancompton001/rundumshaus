import type { Metadata } from "next";
import { getPageMetaOverride } from "@/lib/meta-overrides";
import Hero from "@/components/sections/Hero";
import BewertungenSlider from "@/components/sections/BewertungenSlider";
import ServiceOverview from "@/components/sections/ServiceOverview";
import AboutSection from "@/components/sections/AboutSection";
import WarumWir from "@/components/sections/WarumWir";
import HomeEinsatzgebiet from "@/components/sections/HomeEinsatzgebiet";
import HomeFAQ from "@/components/sections/HomeFAQ";
import HomeKontakt from "@/components/sections/HomeKontakt";

// PX-068 B: Kevin-editable homepage meta via /admin/.
// Empty override → EXACTLY today's behavior (layout defaults, canonical only).
// With override → title used AS IS (absolute, no "| Littawe" suffix — the
// homepage brand pattern differs from inner pages), og/twitter follow so
// Google and WhatsApp-shares stay consistent (Design Review G3).
const ov = getPageMetaOverride("/");
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  ...(ov?.title ? { title: { absolute: ov.title } } : {}),
  ...(ov?.description ? { description: ov.description } : {}),
  ...(ov?.title || ov?.description
    ? {
        openGraph: {
          ...(ov?.title ? { title: ov.title } : {}),
          ...(ov?.description ? { description: ov.description } : {}),
          url: "https://rundumshaus-littawe.de/",
          locale: "de_DE",
          type: "website",
          images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: "Rund ums Haus Littawe" }],
        },
        twitter: {
          card: "summary_large_image",
          ...(ov?.title ? { title: ov.title } : {}),
          ...(ov?.description ? { description: ov.description } : {}),
          images: ["/images/og-image.jpg"],
        },
      }
    : {}),
};

// PX-065/066: section order per Kevin's WhatsApp 2026-06-10:
// 1 Hero · 2 Bewertungen · 3 Leistungen · 4 Über uns · 5 Warum wir ·
// 6 FAQ · 7 Einsatzgebiet · 8 großer Kontakt-Bereich.
// (PX-066: Kevin moved FAQ between Warum wir and Einsatzgebiet.)
// FaktenBlock + StandortOsnabrueck removed (not in Kevin's list).
export default function Home() {
  return (
    <>
      <Hero />
      <BewertungenSlider />
      <ServiceOverview />
      <AboutSection />
      <WarumWir />
      <HomeFAQ />
      <HomeEinsatzgebiet />
      <HomeKontakt />
    </>
  );
}
