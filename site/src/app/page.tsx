import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import FaktenBlock from "@/components/sections/FaktenBlock";
import AboutSection from "@/components/sections/AboutSection";
import WarumWir from "@/components/sections/WarumWir";
import ServiceOverview from "@/components/sections/ServiceOverview";
import BewertungenSlider from "@/components/sections/BewertungenSlider";
import HomeFAQ from "@/components/sections/HomeFAQ";
import HomeEinsatzgebiet from "@/components/sections/HomeEinsatzgebiet";
import StandortOsnabrueck from "@/components/sections/StandortOsnabrueck";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <FaktenBlock />
      <AboutSection />
      <WarumWir />
      <ServiceOverview />
      {/* PX-064 Startseite Redesign — Kevin's new sections */}
      <BewertungenSlider />
      <HomeFAQ />
      <HomeEinsatzgebiet />
      <StandortOsnabrueck />
    </>
  );
}
