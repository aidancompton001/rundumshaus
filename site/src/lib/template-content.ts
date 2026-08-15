// PX-047 Phase 1: Single source of truth для template content.
// Consumed by BOTH generateMetadata() (route) AND template rendering.
// Prevents drift between meta and visible content.
//
// Ownership contract (per Playbook):
// - Route owns: metadata, JSON-LD Schema, canonical
// - Template owns: visible JSX, copy
// - getTemplateContent() = bridge — same strings in both places

import type { City } from "./programmatic";

// T009: порог зоны выезда. В данных 11 городов дальше 60 км — до 80
// (Nordhorn, Twist), и их 55 страниц уже опубликованы и проиндексированы,
// то есть обещание выезда туда уже дано. Порог приведён к факту, тексты
// охвата — к 80 км. Города за порогом по-прежнему получают «auf Anfrage».
const MAX_EINSATZ_KM = 80;

/**
 * Safe distance phrase with full guard coverage.
 * - distanceKm = 0 → "direkt in Osnabrück" (Osnabrück hub)
 * - distanceKm 1-15 → "nur rund X km..." (close T1 cities)
 * - distanceKm 16-30 → "etwa X km..." (T1/T2)
 * - distanceKm 31-60 → "rund X km im Einsatzgebiet" (T2/T3)
 * - distanceKm >60 → "X km — auf Anfrage" (outside regular Einsatzgebiet, avoid UWG § 5 false claim)
 */
export function safeDistancePhrase(city: City): string {
  if (city.distanceKm === 0) return "direkt in Osnabrück";
  if (city.distanceKm <= 15) return `nur rund ${city.distanceKm} km von unserem Standort in Osnabrück entfernt`;
  if (city.distanceKm <= 30) return `etwa ${city.distanceKm} km von Osnabrück entfernt`;
  if (city.distanceKm <= MAX_EINSATZ_KM) return `rund ${city.distanceKm} km von Osnabrück im Einsatzgebiet`;
  return `${city.distanceKm} km von Osnabrück — Einsätze auf Anfrage`;
}

/**
 * Safe distance metadata snippet for meta description.
 * Returns " · X km Anfahrt" or empty for Osnabrück.
 */
export function safeDistanceMeta(city: City): string {
  if (city.distanceKm === 0) return "";
  if (city.distanceKm > MAX_EINSATZ_KM) return ` · ${city.distanceKm} km (auf Anfrage)`;
  return ` · ${city.distanceKm} km Anfahrt`;
}

/**
 * Einsatzgebiet text guard — avoids UWG § 5 false advertising for cities >80 km.
 */
export function safeEinsatzText(city: City): string {
  if (city.distanceKm > MAX_EINSATZ_KM) {
    return "Auf Anfrage übernehmen wir auch Aufträge außerhalb unseres regulären Einsatzgebiets.";
  }
  return "Im Einsatzgebiet bis 80 km um Osnabrück sind wir regelmäßig vor Ort.";
}

/**
 * Tier-based title — avoids overflow for long city names (Neuenkirchen-Kreis-Steinfurt = 82 chars).
 * Google mobile title limit ~60 chars.
 *
 * @param shortSuffix — service-specific keyword extension for short city names
 *   (only used if cityLen ≤ 12). Examples:
 *   - Garten: "★ Rasen & Hecken-Experte"
 *   - Hausmeister: "★ Zuverlässig & Schnell"
 *   Pass undefined to omit (minimal format for all tiers).
 */
export function safeTitle(city: City, service: string, shortSuffix?: string): string {
  const cityLen = city.displayName.length;
  if (cityLen <= 12 && shortSuffix) {
    return `${service} ${city.displayName} ${shortSuffix}`;
  }
  if (cityLen <= 20 && shortSuffix) {
    // Medium: keep short, drop full suffix
    return `${service} ${city.displayName}`;
  }
  return `${service} ${city.displayName}`;
}

/**
 * Garten template content — single source.
 * Returns all strings needed by both generateMetadata() and the template.
 */
export interface GartenTemplateContent {
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro1: string;
  intro2: string;
  distancePhrase: string;
  einsatzText: string;
  einsatzCitiesText: string;
}

export function getGartenContent(city: City): GartenTemplateContent {
  const dist = safeDistancePhrase(city);
  const distMeta = safeDistanceMeta(city);
  const einsatz = safeEinsatzText(city);

  return {
    h1: `Gärtner & Gartenpflege in ${city.displayName}`,
    metaTitle: safeTitle(city, "Gärtner & Gartenpflege", "★ Rasen & Hecken-Experte"),
    metaDescription: `Professionelle Gartenpflege in ${city.displayName} und Umgebung: Rasenmähen, Heckenschnitt, Rasenerneuerung, Grundstückspflege. Familienbetrieb · Festpreis${distMeta}. ☎ direkt anrufen.`,
    intro1: `Sie suchen einen zuverlässigen Gärtner in ${city.displayName}? Rund ums Haus Littawe ist Ihr Ansprechpartner für professionelle Gartenpflege, Grundstückspflege und Grünanlagenpflege in ${city.displayName} und Umgebung. Wir unterstützen Privatkunden, Unternehmen, Vermieter und Hausverwaltungen bei sämtlichen Arbeiten rund um Garten, Grünflächen und Außenanlagen.`,
    intro2: `Als erfahrener Gärtner sind wir ${dist} und übernehmen sowohl regelmäßige Gartenpflege als auch einmalige Gartenarbeiten in ${city.displayName}. Unser Ziel ist es, Ihren Garten, Ihr Grundstück oder Ihre Außenanlage dauerhaft gepflegt und ansprechend zu halten.`,
    distancePhrase: dist,
    einsatzText: einsatz,
    einsatzCitiesText: einsatz,
  };
}
