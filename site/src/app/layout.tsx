import type { Metadata } from "next";
import { Lora, Plus_Jakarta_Sans } from "next/font/google";
import MotionProvider from "@/components/motion/MotionProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CookieBanner from "@/components/layout/CookieBanner";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import serviceAreasData from "@/data/service-areas.json";
import type { ServiceAreasData } from "@/data/types";
import { TARGET_CITIES } from "@/lib/targetCities";
import "./globals.css";

const serviceAreas = serviceAreasData as ServiceAreasData;
const allCities = serviceAreas.regions.flatMap((r) => r.cities);
const targetCitiesSchema = TARGET_CITIES.map((name) => ({
  "@type": "City",
  name,
}));

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
  title: "Rund ums Haus Littawe | Hausmeisterservice & Gartenpflege",
  description:
    "Ihr zuverlässiger Service rund ums Haus — Hausmeisterservice, Gartenpflege, Dacharbeiten und mehr in Osnabrück und Umgebung.",
  openGraph: {
    title: "Rund ums Haus Littawe | Hausmeisterservice & Gartenpflege",
    description: "Ihr zuverlässiger Service rund ums Haus — Hausmeisterservice, Gartenpflege, Dacharbeiten und mehr in Osnabrück und Umgebung.",
    url: "https://rundumshaus-littawe.de",
    locale: "de_DE",
    type: "website",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: "Rund ums Haus Littawe" }],
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
        <link
          rel="preload"
          as="image"
          href="/images/hero/hero-bg.webp"
          fetchPriority="high"
        />
        <noscript>
          <style>{`.scroll-reveal, .stagger-container > * { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
                  "@id": "https://rundumshaus-littawe.de/#localbusiness",
                  name: "Rund ums Haus Littawe",
                  legalName: "Rund ums Haus Littawe",
                  image: "https://rundumshaus-littawe.de/images/og-image.jpg",
                  logo: "https://rundumshaus-littawe.de/images/og-image.jpg",
                  priceRange: "€€",
                  description:
                    "Familienbetrieb für Hausmeisterservice, Gartenpflege, Dacharbeiten, Entrümpelung und Schrottabholung in Osnabrück und im Umkreis von 60 km.",
                  foundingDate: "2026",
                  founder: {
                    "@type": "Person",
                    name: "Kevin Littawe",
                  },
                  address: {
                    "@type": "PostalAddress",
                    streetAddress: "Bramscher Str. 161",
                    addressLocality: "Osnabrück",
                    addressRegion: "Niedersachsen",
                    postalCode: "49090",
                    addressCountry: "DE",
                  },
                  geo: {
                    "@type": "GeoCoordinates",
                    latitude: 52.30,
                    longitude: 8.04,
                  },
                  telephone: "+49 1523 9603175",
                  email: "kontakt@rundumshaus-littawe.de",
                  url: "https://rundumshaus-littawe.de",
                  knowsLanguage: "de",
                  areaServed: allCities.map((city) => ({
                    "@type": "City",
                    name: city,
                  })),
                  // PX-031 follow-up: AggregateRating pending Kevin's 4 review texts.
                  // priceSpecification details added per service below where confirmed.
                  hasOfferCatalog: {
                    "@type": "OfferCatalog",
                    name: "Leistungen",
                    itemListElement: [
                      {
                        "@type": "Service",
                        name: "Hausmeisterservice",
                        description:
                          "Alles rund ums Haus — zuverlässig zum fairen Festpreis nach Besichtigung.",
                        provider: { "@id": "https://rundumshaus-littawe.de/#localbusiness" },
                      },
                      {
                        "@type": "Service",
                        name: "Gartenpflege",
                        description:
                          "Fachgerechte Pflege Ihres Gartens — Rasen mähen, Hecken schneiden und vieles mehr. Festpreis nach kostenloser Besichtigung.",
                        provider: { "@id": "https://rundumshaus-littawe.de/#localbusiness" },
                        areaServed: targetCitiesSchema,
                      },
                      {
                        "@type": "Service",
                        name: "Dacharbeiten",
                        description:
                          "Reinigung, Pflege und Arbeiten rund ums Dach — sauber und zum fairen Festpreis.",
                        provider: { "@id": "https://rundumshaus-littawe.de/#localbusiness" },
                      },
                      {
                        "@type": "Service",
                        name: "Entrümpelung",
                        description:
                          "Entrümpelungen in allen Bereichen — vom Keller bis zur kompletten Haushaltsauflösung. Festpreis ab 200 € nach kostenloser Besichtigung.",
                        provider: { "@id": "https://rundumshaus-littawe.de/#localbusiness" },
                        areaServed: targetCitiesSchema,
                        offers: {
                          "@type": "Offer",
                          priceSpecification: {
                            "@type": "PriceSpecification",
                            minPrice: 200,
                            priceCurrency: "EUR",
                          },
                          description:
                            "Festpreisangebot ab 200 € nach kostenloser Besichtigung vor Ort. Wertgegenstände werden nicht angerechnet.",
                        },
                      },
                      {
                        "@type": "Service",
                        name: "Schrottabholung",
                        description:
                          "Kostenlose Abholung von Altmetall im 60-km-Umkreis — Tauschgeschäft (Materialwert deckt die Anfahrt).",
                        provider: { "@id": "https://rundumshaus-littawe.de/#localbusiness" },
                      },
                    ],
                  },
                },
                {
                  "@type": "WebSite",
                  "@id": "https://rundumshaus-littawe.de/#website",
                  url: "https://rundumshaus-littawe.de",
                  name: "Rund ums Haus Littawe",
                  inLanguage: "de-DE",
                  publisher: { "@id": "https://rundumshaus-littawe.de/#localbusiness" },
                },
                {
                  "@type": "Organization",
                  "@id": "https://rundumshaus-littawe.de/#organization",
                  name: "Rund ums Haus Littawe",
                  url: "https://rundumshaus-littawe.de",
                  logo: "https://rundumshaus-littawe.de/images/og-image.jpg",
                  founder: {
                    "@type": "Person",
                    name: "Kevin Littawe",
                    jobTitle: "Inhaber",
                  },
                  foundingDate: "2026",
                  email: "kontakt@rundumshaus-littawe.de",
                  telephone: "+49 1523 9603175",
                },
              ],
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
