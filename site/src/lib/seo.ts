import type { Metadata } from "next";

interface SEOInput {
  title: string;
  description: string;
  path?: string;
}

const SITE_NAME = "Rund ums Haus Littawe";
const DOMAIN = "rundumshaus-littawe.de";

export function generateSEO({ title, description, path = "" }: SEOInput): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;
  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url: `https://${DOMAIN}${path}`,
      locale: "de_DE",
      type: "website",
      // PX-046 F14: og:image fallback на всех страницах (6 из 7 главных
      // не имели — отсутствовал preview в WhatsApp/LinkedIn/FB shares).
      images: [
        {
          url: "/images/og-image.jpg",
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ["/images/og-image.jpg"],
    },
    alternates: {
      canonical: `https://${DOMAIN}${path}`,
    },
  };
}
