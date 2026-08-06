// GaLaBau template content — single source (Kevin text 2026-08-06,
// Schrottabholung → Garten- und Landschaftsbau swap).

import type { City } from "./programmatic";
import {
  safeDistancePhrase,
  safeDistanceMeta,
  safeEinsatzText,
  safeTitle,
} from "./template-content";

export interface GalabauTemplateContent {
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro1: string;
  intro2: string;
  distancePhrase: string;
  einsatzText: string;
}

export function getGalabauContent(city: City): GalabauTemplateContent {
  const dist = safeDistancePhrase(city);
  const distMeta = safeDistanceMeta(city);
  const einsatz = safeEinsatzText(city);

  return {
    h1: `Garten- und Landschaftsbau in ${city.displayName}`,
    metaTitle: safeTitle(city, "Garten- und Landschaftsbau", "★ Pflaster & Außenanlagen"),
    metaDescription: `Garten- und Landschaftsbau in ${city.displayName}: Gartenneuanlage, Pflasterarbeiten, Rollrasen, Erdarbeiten, Beete & Bepflanzung. Unverbindliches Angebot${distMeta}. ☎ direkt anrufen.`,
    intro1: `Individuelle Außenanlagen nach Ihren Vorstellungen: Als zuverlässiger Partner im Garten- und Landschaftsbau realisiert Rund ums Haus Littawe individuelle Projekte in ${city.displayName} — für Privatkunden, Unternehmen sowie Wohnanlagen. Von der ersten Planung bis zur fachgerechten Umsetzung begleiten wir Sie mit Erfahrung, Sorgfalt und einem hohen Qualitätsanspruch.`,
    intro2: `Ob die Neuanlage eines Gartens, die Umgestaltung bestehender Außenbereiche oder die Modernisierung von Einfahrten und Wegen — wir schaffen Außenanlagen in ${city.displayName}, die optisch überzeugen und langfristig Bestand haben. Als Familienbetrieb sind wir ${dist}.`,
    distancePhrase: dist,
    einsatzText: einsatz,
  };
}
