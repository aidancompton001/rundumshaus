// PX-049 Phase 3: Dach template content — single source.
// Pattern mirrors template-content-hausmeister.ts.
//
// Reuses safe* helpers from template-content.ts.

import type { City } from "./programmatic";
import {
  safeDistancePhrase,
  safeDistanceMeta,
  safeEinsatzText,
  safeTitle,
} from "./template-content";

export interface DachTemplateContent {
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro1: string;
  intro2: string;
  distancePhrase: string;
  einsatzText: string;
}

export function getDachContent(city: City): DachTemplateContent {
  const dist = safeDistancePhrase(city);
  const distMeta = safeDistanceMeta(city);
  const einsatz = safeEinsatzText(city);

  return {
    h1: `Dachservice & Dacharbeiten in ${city.displayName}`,
    metaTitle: safeTitle(city, "Dachservice", "★ Sauber & Werterhalt"),
    metaDescription: `Dachservice in ${city.displayName} und Umgebung: Dachreinigung, Dachrinnenreinigung, kleinere Dachreparaturen, Moos-Entfernung. Familienbetrieb · Festpreis${distMeta}. ☎ direkt anrufen.`,
    intro1: `Sie suchen einen zuverlässigen Dachservice in ${city.displayName}? Rund ums Haus Littawe übernimmt für Privatkunden, Unternehmen, Vermieter und Hausverwaltungen die professionelle Reinigung, Pflege und Instandhaltung von Dächern und Dachrinnen — vom Einfamilienhaus bis zur Wohnanlage.`,
    intro2: `Als erfahrener Dachdienstleister sind wir ${dist} und übernehmen sowohl einmalige Einsätze als auch regelmäßige Wartung in ${city.displayName}. Regen, Wind, Moos und Laub setzen jedem Dach mit der Zeit zu — eine regelmäßige Dachpflege trägt zum Werterhalt Ihrer Immobilie bei und beugt teuren Folgeschäden vor.`,
    distancePhrase: dist,
    einsatzText: einsatz,
  };
}
