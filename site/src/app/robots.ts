import type { MetadataRoute } from "next";

export const dynamic = "force-static";

// 2026 AI bot landscape — three-tier framework:
//   1. Search/retrieval bots (live citations) → ALLOW (drives AI Search referrals)
//   2. Training bots (foundation models)     → ALLOW (improves long-term citation likelihood)
//   3. Real-time user agents (don't honor robots.txt anyway) → out of scope
//
// Strategy: maximize AI Search visibility (Anthropic Claude, Perplexity, OpenAI, Google AI)
// while remaining a good web citizen. Block only known abusive crawlers.

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      // OpenAI — search + training
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      // Anthropic — search + training + user-fetch
      { userAgent: "Claude-SearchBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Claude-User", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      // Perplexity — indexing + user-fetch
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Perplexity-User", allow: "/" },
      // Google AI training (separate from Googlebot — affects AI Overviews/Gemini training)
      { userAgent: "Google-Extended", allow: "/" },
      // Apple Intelligence
      { userAgent: "Applebot-Extended", allow: "/" },
      // Common Crawl — feeds many open LLMs and llms.txt indexers
      { userAgent: "CCBot", allow: "/" },
      // You.com
      { userAgent: "YouBot", allow: "/" },
      // Mistral
      { userAgent: "MistralAI-User", allow: "/" },
      // Meta AI
      { userAgent: "Meta-ExternalAgent", allow: "/" },
      // ByteDance
      { userAgent: "Bytespider", disallow: "/" }, // known abusive — high crawl rate, low value
    ],
    sitemap: "https://rundumshaus-littawe.de/sitemap.xml",
    host: "https://rundumshaus-littawe.de",
  };
}
