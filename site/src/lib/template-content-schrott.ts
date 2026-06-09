// PX-051 Phase 5: Schrott template content — single source.

import type { City } from "./programmatic";
import {
  safeDistancePhrase,
  safeDistanceMeta,
  safeEinsatzText,
  safeTitle,
} from "./template-content";

export interface SchrottTemplateContent {
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro1: string;
  intro2: string;
  distancePhrase: string;
  einsatzText: string;
}

export function getSchrottContent(city: City): SchrottTemplateContent {
  const dist = safeDistancePhrase(city);
  const distMeta = safeDistanceMeta(city);
  const einsatz = safeEinsatzText(city);

  return {
    h1: `Schrottabholung & Altmetallabholung in ${city.displayName}`,
    metaTitle: safeTitle(city, "Schrottabholung", "★ Kostenlos & schnell"),
    metaDescription: `Kostenlose Schrottabholung in ${city.displayName} und Umgebung: Eisen, Stahl, Kupfer, Aluminium, Messing, Edelstahl. Fachgerechte Verwertung${distMeta}. ☎ direkt anrufen.`,
    intro1: `Sie möchten Schrott oder Altmetall in ${city.displayName} loswerden? Rund ums Haus Littawe übernimmt die zuverlässige Schrottabholung und Altmetallabholung — bei Privatkunden, Unternehmen, Hausverwaltungen und Gewerbeobjekten. Wir holen Eisen, Stahl, Kupfer, Aluminium, Messing und Edelstahl direkt vor Ort ab und kümmern uns um die fachgerechte Verwertung.`,
    intro2: `Als Familienbetrieb sind wir ${dist} und holen sowohl kleinere Mengen als auch größere Posten Schrott in ${city.displayName} ab. Wo Schrott Platz wegnimmt, schaffen wir schnell und unkompliziert wieder Raum — bei größeren Mengen ist die Besichtigung kostenlos.`,
    distancePhrase: dist,
    einsatzText: einsatz,
  };
}
