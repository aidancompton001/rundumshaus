import type { Metadata } from "next";
import { Lora, Plus_Jakarta_Sans } from "next/font/google";
import MotionProvider from "@/components/motion/MotionProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CookieBanner from "@/components/layout/CookieBanner";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import "./globals.css";

const lora = Lora({
  variable: "--font-heading",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rundum's Haus Littawe | Hausmeisterservice & Gartenpflege",
  description:
    "Zuverlässiger Hausmeisterservice, Gartenpflege, Dacharbeiten, Entrümpelung und Schrottabholung in Osnabrück und Umgebung.",
  openGraph: {
    title: "Rundum's Haus Littawe | Hausmeisterservice & Gartenpflege",
    description: "Zuverlässiger Hausmeisterservice, Gartenpflege, Dacharbeiten, Entrümpelung und Schrottabholung in Osnabrück und Umgebung.",
    url: "https://rundumshaus-littawe.de",
    locale: "de_DE",
    type: "website",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Rundum's Haus Littawe" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${lora.variable} ${plusJakarta.variable} antialiased`}
    >
      <head>
        <noscript>
          <style>{`.scroll-reveal, .stagger-container > * { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Rundum's Haus Littawe",
              description:
                "Zuverlässiger Hausmeisterservice, Gartenpflege, Dacharbeiten, Entrümpelung und Schrottabholung in Osnabrück und Umgebung.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Osnabrück",
                postalCode: "49074",
                addressCountry: "DE",
              },
              telephone: "+49 1523 9603175",
              email: "kontakt@rundumshaus-littawe.de",
              url: "https://rundumshaus-littawe.de",
              areaServed: {
                "@type": "City",
                name: "Osnabrück und Umgebung",
              },
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Leistungen",
                itemListElement: [
                  {
                    "@type": "Service",
                    name: "Hausmeisterservice",
                    description:
                      "Alles rund ums Haus — zuverlässig und schnell erledigt.",
                  },
                  {
                    "@type": "Service",
                    name: "Gartenpflege",
                    description:
                      "Fachgerechte Pflege Ihres Gartens — Rasen mähen, Hecken schneiden und vieles mehr.",
                  },
                  {
                    "@type": "Service",
                    name: "Dacharbeiten",
                    description:
                      "Reinigung, Pflege und Arbeiten rund ums Dach — sauber und zuverlässig.",
                  },
                  {
                    "@type": "Service",
                    name: "Entrümpelung",
                    description:
                      "Entrümpelungen in allen Bereichen — vom Keller bis zur kompletten Haushaltsauflösung.",
                  },
                  {
                    "@type": "Service",
                    name: "Schrottabholung",
                    description:
                      "Kostenlose Abholung von Altmetall — schnell und unkompliziert.",
                  },
                ],
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-body bg-cream text-charcoal">
        <MotionProvider>
          <Navbar />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
          <WhatsAppButton />
          <CookieBanner />
        </MotionProvider>
      </body>
    </html>
  );
}
