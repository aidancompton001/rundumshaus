import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ratgeberData from "@/data/ratgeber.json";
import { RATGEBER_CONTENT, type ArticleSection } from "@/lib/ratgeber-content";
import { generateSEO } from "@/lib/seo";

export const dynamicParams = false;

interface Article {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  category: string;
  publishedDate: string;
  readingTimeMinutes: number;
  primaryService: string;
  howTo?: boolean;
  howToTitle?: string;
  howToSteps?: { name: string; text: string }[];
}

const ARTICLES = ratgeberData.articles as Article[];
const BASE_URL = "https://rundumshaus-littawe.de";

export async function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) return {};
  return generateSEO({
    title: article.metaTitle,
    description: article.metaDescription,
    path: `/ratgeber/${slug}`,
  });
}

function renderSection(section: ArticleSection, idx: number) {
  switch (section.type) {
    case "h2":
      return (
        <h2
          key={idx}
          className="font-heading text-2xl md:text-3xl font-semibold text-charcoal mt-10 mb-4"
        >
          {section.text}
        </h2>
      );
    case "h3":
      return (
        <h3
          key={idx}
          className="font-heading text-xl font-semibold text-charcoal mt-8 mb-3"
        >
          {section.text}
        </h3>
      );
    case "p":
      return (
        <p key={idx} className="text-base text-charcoal-light leading-relaxed mb-5">
          {section.text}
        </p>
      );
    case "list":
      return (
        <ul
          key={idx}
          className="list-disc pl-6 text-base text-charcoal-light leading-relaxed mb-6 space-y-2"
        >
          {section.items?.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      );
    case "ol":
      return (
        <ol
          key={idx}
          className="list-decimal pl-6 text-base text-charcoal-light leading-relaxed mb-6 space-y-2"
        >
          {section.items?.map((item, i) => <li key={i}>{item}</li>)}
        </ol>
      );
    case "callout":
      return (
        <aside
          key={idx}
          className="my-8 p-6 bg-copper/5 border-l-4 border-copper rounded-r-lg"
        >
          <p className="text-charcoal font-medium leading-relaxed">{section.text}</p>
        </aside>
      );
    case "quote":
      return (
        <blockquote
          key={idx}
          className="my-6 pl-6 border-l-4 border-sand text-charcoal italic"
        >
          {section.text}
        </blockquote>
      );
  }
}

export default async function RatgeberDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) notFound();

  const content = RATGEBER_CONTENT[slug];
  if (!content) notFound();

  const canonical = `${BASE_URL}/ratgeber/${slug}`;

  // Article schema (Google requires datePublished + author + headline)
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    datePublished: article.publishedDate,
    dateModified: article.publishedDate,
    author: {
      "@type": "Organization",
      name: "Rund ums Haus Littawe",
      "@id": `${BASE_URL}/#organization`,
    },
    publisher: { "@id": `${BASE_URL}/#localbusiness` },
    mainEntityOfPage: canonical,
    inLanguage: "de-DE",
    articleSection: article.category,
    timeRequired: `PT${article.readingTimeMinutes}M`,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: `${BASE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Ratgeber", item: `${BASE_URL}/ratgeber` },
      { "@type": "ListItem", position: 3, name: article.title, item: canonical },
    ],
  };

  const howToSchema =
    article.howTo && article.howToSteps
      ? {
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: article.howToTitle ?? article.title,
          totalTime: `PT${article.readingTimeMinutes}M`,
          step: article.howToSteps.map((s, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: s.name,
            text: s.text,
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}

      <article className="py-12 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="text-sm text-charcoal-light mb-6">
            <ol className="flex flex-wrap gap-x-2">
              <li>
                <Link href="/" className="hover:text-copper">Startseite</Link>
                <span className="mx-2">/</span>
              </li>
              <li>
                <Link href="/ratgeber" className="hover:text-copper">Ratgeber</Link>
                <span className="mx-2">/</span>
              </li>
              <li className="text-charcoal" aria-current="page">{article.category}</li>
            </ol>
          </nav>

          <span className="inline-block text-xs font-medium text-copper uppercase tracking-wide mb-3">
            {article.category}
          </span>

          <h1 className="font-heading text-3xl md:text-5xl font-bold text-charcoal mb-4 leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-charcoal-light mb-10">
            <time dateTime={article.publishedDate}>{article.publishedDate}</time>
            <span>·</span>
            <span>{article.readingTimeMinutes} Min. Lesezeit</span>
            <span>·</span>
            <span>Rund ums Haus Littawe</span>
          </div>

          <div className="prose-content">
            {content.map((section, idx) => renderSection(section, idx))}
          </div>

          <div className="mt-12 pt-8 border-t border-sand/30">
            <Link href="/ratgeber" className="text-copper hover:underline">
              ← Alle Ratgeber-Artikel
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
