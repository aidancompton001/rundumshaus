import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import FaktenBlock from "@/components/sections/FaktenBlock";
import AboutSection from "@/components/sections/AboutSection";
import WarumWir from "@/components/sections/WarumWir";
import ServiceOverview from "@/components/sections/ServiceOverview";

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
    </>
  );
}
