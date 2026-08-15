import type { Metadata } from "next";
import { Inter } from "next/font/google";
import MotionProvider from "@/components/motion/MotionProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CookieBanner from "@/components/layout/CookieBanner";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import serviceAreasData from "@/data/service-areas.json";
import reviewsData from "@/data/reviews.json";
import type { ServiceAreasData } from "@/data/types";
import { TARGET_CITIES } from "@/lib/targetCities";
import "./globals.css";

const serviceAreas = serviceAreasData as ServiceAreasData;
const allCities = serviceAreas.regions.flatMap((r) => r.cities);
const targetCitiesSchema = TARGET_CITIES.map((name) => ({
  "@type": "City",
  name,
}));

// Reviews: visible on /ueber-uns. Schema below references this data.
// PX-031 Phase A: AggregateRating + individual Review entries.
const reviewSchemas = reviewsData.reviews.map((r) => ({
  "@type": "Review",
  author: { "@type": "Person", name: r.author },
  datePublished: r.datePublished,
  reviewRating: {
    "@type": "Rating",
    ratingValue: r.rating,
    bestRating: 5,
    worstRating: 1,
  },
  reviewBody: r.text,
}));

// Макет клиента набран Inter — и заголовки, и текст
// (docs/design/v1-desktop/css/tokens.css:44). Прежняя пара Lora +
// Plus Jakarta давала засечный заголовок, которого в макете нет.
// Веса 800 и 900 обязательны: ими заданы H2 и H1 макета.
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rundumshaus-littawe.de"),
  title: "Rund ums Haus Littawe | Hausmeisterservice & Gartenpflege",
  description:
    "Ihr zuverlässiger Service rund ums Haus — Hausmeisterservice, Gartenpflege, Dacharbeiten und mehr in Osnabrück und Umgebung.",
  openGraph: {
    title: "Rund ums Haus Littawe | Hausmeisterservice & Gartenpflege",
    description: "Ihr zuverlässiger Service rund ums Haus — Hausmeisterservice, Gartenpflege, Dacharbeiten und mehr in Osnabrück und Umgebung.",
    url: "https://rundumshaus-littawe.de/",
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
      className={`${inter.variable} antialiased`}
    >
      <head>
        {/* Yandex Webmaster verification (PX-031 Phase B). */}
        <meta name="yandex-verification" content="f5a1b4f7b6386a4c" />
        {/* PX-034 LCP fix: preload responsive hero variant by viewport.
            Mobile (<768px) preloads 800w (36 KB); desktop preloads 1200w (61 KB).
            Matches .hero-lamp-bg media query — no wasted 192 KB download. */}
        <link
          rel="preload"
          as="image"
          href="/images/hero/hero-bg-800w.webp"
          media="(max-width: 767px)"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/images/hero/hero-bg-1200w.webp"
          media="(min-width: 768px)"
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
                    "Familienbetrieb für Hausmeisterservice, Gartenpflege, Garten- und Landschaftsbau, Dacharbeiten und Entrümpelung in Osnabrück und im Umkreis von 80 km.",
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
                  // AggregateRating: 2 verified Google reviews from Osnabrück
                  // (PX-031 Phase A, CEO confirmed with Kevin 2026-05-02).
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: reviewsData.aggregateRating.ratingValue,
                    ratingCount: reviewsData.aggregateRating.ratingCount,
                    bestRating: reviewsData.aggregateRating.bestRating,
                    worstRating: reviewsData.aggregateRating.worstRating,
                  },
                  review: reviewSchemas,
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
                            "Festpreisangebot ab 200 € nach kostenloser Besichtigung vor Ort.",
                        },
                      },
                      {
                        "@type": "Service",
                        name: "Garten- und Landschaftsbau",
                        description:
                          "Neuanlage und Umgestaltung von Gärten, Pflasterarbeiten, Rollrasen, Erdarbeiten und Bepflanzung — individuelle Außenanlagen im 60-km-Umkreis.",
                        provider: { "@id": "https://rundumshaus-littawe.de/#localbusiness" },
                      },
                      // PX-037: dedicated Rasenneuanlage sub-service with its own landing page.
                      {
                        "@type": "Service",
                        name: "Rasenneuanlage",
                        serviceType: "Gartenpflege — Rasenneuanlage",
                        description:
                          "Komplette Rasenneuanlage: alten Rasen entfernen, Boden vorbereiten, Rasensaat oder Rollrasen-Verlegung. Kostenlose Besichtigung — Festpreis.",
                        provider: { "@id": "https://rundumshaus-littawe.de/#localbusiness" },
                        url: "https://rundumshaus-littawe.de/leistungen/rasen-neuanlage/",
                        areaServed: targetCitiesSchema,
                      },
                      // PX-040: dedicated B2B Objektpflege landing for property managers, WEGs etc.
                      {
                        "@type": "Service",
                        name: "Objektpflege",
                        serviceType: "Objektbetreuung & Hausmeisterservice für Hausverwaltungen",
                        description:
                          "Professionelle Objektpflege für Mehrfamilienhäuser, Wohnanlagen, Gewerbeobjekte und Außenanlagen. Festpreis oder Jahresvertrag.",
                        provider: { "@id": "https://rundumshaus-littawe.de/#localbusiness" },
                        url: "https://rundumshaus-littawe.de/leistungen/objektpflege/",
                        areaServed: targetCitiesSchema,
                        audience: {
                          "@type": "Audience",
                          audienceType: "Hausverwaltungen, Vermieter, WEGs, Wohnungsbaugesellschaften",
                        },
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
                  image: [
                    "https://rundumshaus-littawe.de/images/branding/firmenwagen-1200.jpg",
                    "https://rundumshaus-littawe.de/images/og-image.jpg",
                  ],
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
        {/* PX-047 Phase 1: Plausible analytics (cookieless, DSGVO-clean).
            Required для измерения успеха Phase 1 vs baseline. */}
        <script
          defer
          data-domain="rundumshaus-littawe.de"
          src="https://plausible.io/js/script.js"
        />
      </head>
      <body className="min-h-screen flex flex-col font-body bg-cream text-charcoal">
        <MotionProvider>
          <Navbar />
          {/* отступ равен высоте шапки: шапка фиксирована сверху, и при 64px
             против её новых 82px контент уезжал бы под неё на всех 617
             страницах сразу (находка ревьюера F-09) */}
          {/* Шапка макета липкая, а не плавающая: место под неё держит она
              сама. Прежний отступ в 82px был нужен для fixed-шапки и теперь
              дал бы пустую полосу под ней. */}
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppButton />
          <CookieBanner />
        </MotionProvider>
      </body>
    </html>
  );
}
