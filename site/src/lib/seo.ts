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
    },
    alternates: {
      canonical: `https://${DOMAIN}${path}`,
    },
  };
}
