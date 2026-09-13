// T012: Entkernung & Abbrucharbeiten — единый источник текстов городской
// страницы для маршрута (мета, JSON-LD) и компонента. Тексты — дословно Кевин
// (docs/kevin-entkernung-text-2026-09-13.txt), правятся в админке.
//
// Разметка «Osnabrück» (docs/tasks/T012_entkernung_abbrucharbeiten.md):
// на странице Osnabrück текст идёт дословно; на остальных городах
// — список мест = город + соседи из cities.json, ответ FAQ про «Osnabrücker Land»
// заменён на город и трёх соседей. Утверждения о самой фирме
// («ist in Osnabrück … tätig», «Osnabrück und Umgebung») не меняются.

import type { City } from "./programmatic";
import { getGeoNeighbors } from "./programmatic";
import { safeTitle } from "./template-content";
import { subst } from "./template-text";
import templateTexts from "@/data/templates/entkernung-abbrucharbeiten.json";

export interface EntkernungSection {
  heading: string;
  paragraphs: string[];
  listIntro?: string;
  items?: string[];
  paragraphsAfter?: string[];
}

export interface EntkernungTemplateTexts {
  h1: string;
  heroImage: string;
  heroAlt: string;
  intro: string[];
  sectionsBefore: EntkernungSection[];
  leistungen: { heading: string; intro: string; items: string[]; footnote: string };
  sectionsAfter: EntkernungSection[];
  firma: {
    heading: string;
    paragraphs: string[];
    listIntro: string;
    hqItems: string[];
    moreItem: string;
    paragraphsAfter: string[];
  };
  sectionsEnd: EntkernungSection[];
  cta: {
    heading: string;
    paragraphs: string[];
    brand: string;
    tagline: string;
    location: string;
    button: string;
  };
  faq: {
    heading: string;
    items: { q: string; a: string; cityInQuestion: boolean; aOtherCities?: string }[];
  };
  weitereLeistungen: {
    heading: string;
    links: { label: string; servicePath: string; isHub?: boolean }[];
  };
  einsatzorte: { heading: string; chipLabel: string; expandLabel: string };
}

export const ENTKERNUNG_TEXTS = templateTexts as EntkernungTemplateTexts;

const HQ_SLUG = "osnabrueck";
/** Соседей в списке мест: столько же, сколько у Кевина рядом с Osnabrück. */
const FIRMA_NEIGHBORS = 7;
/** Соседей в ответе FAQ — у каждого города их не меньше трёх. */
const FAQ_NEIGHBORS = 3;

export interface EntkernungTemplateContent {
  h1: string;
  metaTitle: string;
  metaDescription: string;
}

export function getEntkernungContent(city: City): EntkernungTemplateContent {
  return {
    h1: subst(ENTKERNUNG_TEXTS.h1, { city: city.displayName }),
    metaTitle: safeTitle(city, "Entkernung & Abbrucharbeiten"),
    metaDescription: `Entkernung & Abbrucharbeiten in ${city.displayName}. Rückbau von Estrich, Böden, Bädern, Fliesen, Türen & mehr inkl. Abtransport und Entsorgung. Jetzt anfragen.`,
  };
}

/** Список «unter anderem in:» — Osnabrück дословно, иначе город + соседи. */
export function getEntkernungFirmaItems(city: City): string[] {
  const { hqItems, moreItem } = ENTKERNUNG_TEXTS.firma;
  const places =
    city.slug === HQ_SLUG
      ? hqItems
      : [city.displayName, ...getGeoNeighbors(city, FIRMA_NEIGHBORS).map((c) => c.displayName)];
  return [...places, moreItem];
}

/** Вопросы и ответы FAQ для видимого блока и FAQPage — один источник. */
export function getEntkernungFaqs(city: City): { q: string; a: string }[] {
  const vars = {
    city: city.displayName,
    nachbarn: getGeoNeighbors(city, FAQ_NEIGHBORS)
      .map((c) => c.displayName)
      .join(", "),
  };
  return ENTKERNUNG_TEXTS.faq.items.map((f) => {
    const q = subst(f.q, vars);
    const a = city.slug !== HQ_SLUG && f.aOtherCities ? f.aOtherCities : f.a;
    return {
      q: f.cityInQuestion ? `${q} in ${city.displayName}?` : q,
      a: subst(a, vars),
    };
  });
}
