// PX-048 Phase 2: Hausmeister template content — single source.
// Pattern mirrors template-content.ts (Garten Phase 1).
//
// Reuses safe* helpers from template-content.ts (Rule of Three not yet hit;
// after Phase 3 (Dach) extract into template-content-shared.ts).

import type { City } from "./programmatic";
import {
  safeDistancePhrase,
  safeDistanceMeta,
  safeEinsatzText,
  safeTitle,
} from "./template-content";

export interface HausmeisterTemplateContent {
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro1: string;
  intro2: string;
  distancePhrase: string;
  einsatzText: string;
}

export function getHausmeisterContent(city: City): HausmeisterTemplateContent {
  const dist = safeDistancePhrase(city);
  const distMeta = safeDistanceMeta(city);
  const einsatz = safeEinsatzText(city);

  return {
    h1: `Hausmeisterservice & Objektpflege in ${city.displayName}`,
    metaTitle: safeTitle(city, "Hausmeisterservice", "★ Zuverlässig & Schnell"),
    metaDescription: `Hausmeisterservice in ${city.displayName} und Umgebung: Kontrollgänge, Kleinreparaturen, Objektpflege, Grundstückspflege, Winterdienst. Familienbetrieb · Festpreis${distMeta}. ☎ direkt anrufen.`,
    intro1: `Sie suchen einen zuverlässigen Hausmeisterservice in ${city.displayName}? Rund ums Haus Littawe übernimmt für Privatkunden, Unternehmen, Vermieter und Hausverwaltungen die Betreuung von Immobilien und Außenanlagen — von Kontrollgängen über Kleinreparaturen bis zur regelmäßigen Objektpflege.`,
    intro2: `Als erfahrener Hausmeister sind wir ${dist} und übernehmen sowohl einmalige Aufträge als auch laufende Betreuungsverträge in ${city.displayName}. Eine regelmäßige Pflege Ihres Objekts trägt zum Werterhalt der Immobilie bei und sorgt für ein gepflegtes Erscheinungsbild.`,
    distancePhrase: dist,
    einsatzText: einsatz,
  };
}
