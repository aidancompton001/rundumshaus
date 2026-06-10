// PX-069 — placeholder substitution for CMS-editable city-template texts.
// Supported placeholders (documented for Kevin in the CMS hints):
//   {city}    → city displayName
//   {dist}    → safeDistancePhrase(city)  (UWG-safe distance wording)
//   {einsatz} → safeEinsatzText(city)     (UWG-safe service-area wording)
//   {list}    → comma list of neighbor city names
//   {count}   → number (expand label)
// Unknown placeholders are left as-is (graceful: a Kevin typo like {citi}
// renders literally instead of crashing the build).

export type TemplateVars = Record<string, string | number>;

export function subst(template: string, vars: TemplateVars): string {
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    key in vars ? String(vars[key]) : match,
  );
}

export interface CitySection {
  heading: string;
  paragraphs: string[];
}

export interface CityTemplateTexts {
  h1: string;
  heroAlt: string;
  intro1: string;
  intro2: string;
  benefits: string[];
  cta: { heading: string; text: string };
  sectionsBefore: CitySection[];
  leistungen: { heading: string; intro: string; items: string[]; footnote: string };
  sectionsAfter: CitySection[];
  warum: { heading: string; items: string[]; cityLine: string };
  einsatzgebiet: { heading: string; text: string };
  faq: { heading: string; items: { q: string; a: string; cityInQuestion: boolean }[] };
  weitereLeistungen: {
    heading: string;
    links: { label: string; servicePath: string; isHub?: boolean }[];
  };
  einsatzorte: { heading: string; chipLabel: string; expandLabel: string };
}
