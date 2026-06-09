// PX-050 Phase 4: Entrümpelung template content — single source.
// Pattern mirrors template-content-dach.ts.

import type { City } from "./programmatic";
import {
  safeDistancePhrase,
  safeDistanceMeta,
  safeEinsatzText,
  safeTitle,
} from "./template-content";

export interface EntruempelungTemplateContent {
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro1: string;
  intro2: string;
  distancePhrase: string;
  einsatzText: string;
}

export function getEntruempelungContent(city: City): EntruempelungTemplateContent {
  const dist = safeDistancePhrase(city);
  const distMeta = safeDistanceMeta(city);
  const einsatz = safeEinsatzText(city);

  return {
    h1: `Entrümpelung & Haushaltsauflösung in ${city.displayName}`,
    metaTitle: safeTitle(city, "Entrümpelung", "★ Festpreis & besenrein"),
    metaDescription: `Entrümpelung & Haushaltsauflösung in ${city.displayName} und Umgebung: Wohnung, Haus, Keller, Dachboden, Garage, Gewerbe. Festpreis · besenrein${distMeta}. ☎ direkt anrufen.`,
    intro1: `Sie suchen eine zuverlässige Entrümpelungsfirma in ${city.displayName}? Rund ums Haus Littawe übernimmt die professionelle Räumung von Wohnungen, Häusern, Kellern, Dachböden, Garagen und Gewerbeobjekten — schnell, sauber und zum fairen Festpreis. Auch Haushaltsauflösungen und Nachlassauflösungen führen wir respektvoll und diskret durch.`,
    intro2: `Als Familienbetrieb sind wir ${dist} und übernehmen sowohl kleine Räumungen als auch komplette Haushaltsauflösungen in ${city.displayName}. Bei jeder Entrümpelung achten wir auf eine besenreine Übergabe und eine fachgerechte Entsorgung der Gegenstände.`,
    distancePhrase: dist,
    einsatzText: einsatz,
  };
}
