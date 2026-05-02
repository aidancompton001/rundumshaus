import citiesData from "@/data/cities.json";
import servicesData from "@/data/services.json";

export type ServiceId =
  | "hausmeisterservice"
  | "gartenpflege"
  | "dacharbeiten"
  | "entruempelung"
  | "schrottabholung";

export const SERVICE_IDS: ServiceId[] = [
  "hausmeisterservice",
  "gartenpflege",
  "dacharbeiten",
  "entruempelung",
  "schrottabholung",
];

export type Tier = 1 | 2 | 3;
export type PopulationClass = "city" | "large" | "medium" | "small";

export interface City {
  name: string;
  displayName: string;
  slug: string;
  region: string;
  tier: Tier;
  bundesland: string;
  landkreis: string;
  plzPrefix: string;
  distanceKm: number;
  populationClass: PopulationClass;
  uniqueHook: string;
  neighbors: string[];
}

export const CITIES = (citiesData.cities as City[]).slice();

export function getCityBySlug(slug: string): City | undefined {
  return CITIES.find((c) => c.slug === slug);
}

export function getNeighborCities(city: City): City[] {
  return city.neighbors
    .map((slug) => getCityBySlug(slug))
    .filter((c): c is City => Boolean(c));
}

export function getServiceMeta(id: ServiceId) {
  const s = servicesData.services.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown service: ${id}`);
  return s;
}

// Deterministic hash for variant selection.
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pickIndex(len: number, key: string, salt = 0): number {
  return (hash(key) + salt) % len;
}

function pickN<T>(pool: readonly T[], count: number, key: string): T[] {
  if (count >= pool.length) return [...pool];
  const start = hash(key) % pool.length;
  const out: T[] = [];
  for (let i = 0; i < count; i++) {
    out.push(pool[(start + i) % pool.length]);
  }
  return out;
}

// Population class → German label (for Fakten block, AI-citable specific data).
function populationLabel(c: PopulationClass): string {
  switch (c) {
    case "city": return "Großstadt";
    case "large": return "Mittelstadt";
    case "medium": return "Kleinstadt";
    case "small": return "Gemeinde";
  }
}

// ────────────────────────────────────────────────────────────────────
// Service-specific content blocks
// ────────────────────────────────────────────────────────────────────

interface ServiceBlocks {
  primaryKeyword: (city: City) => string;
  metaTitle: (city: City) => string;
  metaDescription: (city: City) => string;
  h1: (city: City) => string;
  // 8 intro variants for distribution; first 200 words = answer-first (GEO 2026).
  introVariants: ((city: City) => string)[];
  // 6+ body paragraphs; tier-scaled selection.
  bodyParagraphs: ((city: City, neighbors: City[]) => string)[];
  // 12+ FAQ pool rotated per page (Landa H1 fix).
  faqPool: ((city: City) => { q: string; a: string })[];
}

// ── Helper: city-context phrases (used across services) ──
const cityContext = (c: City) =>
  `${c.displayName} (${c.bundesland}, ${c.landkreis}, PLZ-Bereich ${c.plzPrefix})`;

const distancePhrase = (c: City) =>
  c.distanceKm === 0
    ? `direkt in Osnabrück`
    : c.distanceKm <= 15
      ? `nur rund ${c.distanceKm} km von unserem Standort in Osnabrück entfernt`
      : `etwa ${c.distanceKm} km von Osnabrück entfernt`;

// ====================================================================
// HAUSMEISTERSERVICE
// ====================================================================
const HAUSMEISTER: ServiceBlocks = {
  primaryKeyword: (c) => `Hausmeisterservice ${c.displayName}`,
  metaTitle: (c) =>
    `Hausmeisterservice ${c.displayName} (${c.landkreis}) | Rund ums Haus Littawe`,
  metaDescription: (c) =>
    `Zuverlässiger Hausmeisterservice in ${c.displayName} (${c.bundesland}): Reparaturen, Wartung, Treppenhausreinigung, Außenanlagen, Winterdienst. Aus Osnabrück, ${c.distanceKm} km Anfahrt. Kostenlose Besichtigung.`,
  h1: (c) => `Hausmeisterservice in ${c.displayName} — zuverlässig und schnell vor Ort`,
  introVariants: [
    (c) =>
      `Sie suchen einen verlässlichen Hausmeister in ${c.displayName}? Wir bieten Hausmeisterleistungen direkt vor Ort — von Kleinreparaturen über Wartung bis zur regelmäßigen Pflege von Treppenhaus und Außenanlagen. ${c.uniqueHook.charAt(0).toUpperCase() + c.uniqueHook.slice(1)} betreuen wir private Immobilien, Mehrfamilienhäuser und Gewerbeobjekte. Da unser Standort in Osnabrück (Bramscher Str. 161) ${distancePhrase(c)}, sind kurzfristige Termine in ${c.displayName} regelmäßig möglich.`,
    (c) =>
      `Hausmeisterdienst in ${c.displayName}: Wir kümmern uns um alle Aufgaben rund ums Haus — Reparaturen, Wartung, Reinigung, Winterdienst, Pflege der Außenanlagen. Eigentümer und Hausverwaltungen im ${c.landkreis} schätzen unsere kurzen Wege ${distancePhrase(c)} und die transparenten Festpreise. ${c.uniqueHook.charAt(0).toUpperCase() + c.uniqueHook.slice(1)} arbeiten wir mit eigenem Werkzeug, eigenem Material und festen Ansprechpartnern.`,
    (c) =>
      `Unser Hausmeisterservice für ${c.displayName} (${populationLabel(c.populationClass)} im ${c.landkreis}) deckt das gesamte Spektrum eines professionellen Hausmeisters ab: Kleinreparaturen, Sanitärkleinarbeiten, Lampen- und Sicherungswechsel, Treppenhausreinigung, Müllplatzpflege, Laubentfernung, Winterdienst. Da ${c.uniqueHook}, planen wir Anfahrten effizient und können Termine meist innerhalb weniger Tage anbieten.`,
    (c) =>
      `Hausmeisterservice ${c.displayName} aus einer Hand — termingerecht, transparent abgerechnet, ohne versteckte Zusatzkosten. Wir sind ein junger Familienbetrieb aus Osnabrück (${c.distanceKm} km nach ${c.displayName}) und übernehmen sowohl einmalige Aufträge als auch laufende Betreuungsverträge im ${c.landkreis}. Jede Anfrage beginnt mit einer kostenlosen Besichtigung vor Ort in ${c.displayName}.`,
    (c) =>
      `Wenn Sie als Eigentümer oder Hausverwalter in ${c.displayName} einen Hausmeister suchen, bekommen Sie bei uns das, was Sie erwarten: Verlässlichkeit, kurze Reaktionszeiten und ehrliche Preise. ${c.uniqueHook.charAt(0).toUpperCase() + c.uniqueHook.slice(1)} sind wir regelmäßig im Einsatz und kennen die typischen Anforderungen von Wohnobjekten in Ihrer ${c.bundesland === "Niedersachsen" ? "niedersächsischen" : "nordrhein-westfälischen"} Region.`,
    (c) =>
      `Professioneller Hausmeisterservice in ${c.displayName}: Reparaturen, Wartung, Pflege — alles aus einer Hand. Unser Standort liegt im ${c.distanceKm <= 25 ? "direkten" : c.distanceKm <= 45 ? "näheren" : "erweiterten"} Einsatzgebiet von ${c.displayName} (rund ${c.distanceKm} km). Wir betreuen Einfamilienhäuser, Mehrfamilienhäuser und kleinere Gewerbeflächen mit gleicher Sorgfalt — zum fairen Festpreis nach Besichtigung.`,
    (c) =>
      `Als Hausmeister in ${c.displayName} kümmern wir uns um das, was wirklich anfällt: tropfender Wasserhahn, defekte Lampe, klemmende Tür, verstopfte Dachrinne, ungemähter Rasen, schmutziges Treppenhaus. Anstatt mehrere Handwerker zu organisieren, haben Sie einen Ansprechpartner aus Osnabrück, der ${distancePhrase(c)} ist und im ${c.landkreis} regelmäßig unterwegs ist.`,
    (c) =>
      `Hausmeisterservice für ${c.displayName} und Umgebung: Wir sind ein Familienbetrieb aus Osnabrück und bieten Hausmeisterleistungen für Privatpersonen, Eigentümergemeinschaften und Hausverwaltungen im ${c.landkreis}. Unsere Stärke ist die Kombination aus regionaler Nähe (${c.distanceKm} km zu ${c.displayName}), klarer Kommunikation und fairer, stundenbasierter oder pauschaler Abrechnung.`,
  ],
  bodyParagraphs: [
    (c) =>
      `Zu unseren typischen Hausmeisteraufgaben in ${c.displayName} gehören: Kleinreparaturen aller Art, Lampen- und Sicherungswechsel, Sanitärkleinarbeiten (Siphon, Wasserhahn, Spülkasten), Türen, Schlösser und Fenster, Treppenhausreinigung, Pflege der Außenanlagen, Müllplatzpflege, Laubentfernung im Herbst und Winterdienst zwischen November und März. Wir arbeiten zuverlässig, dokumentieren erledigte Aufgaben und sind über kurze Wege erreichbar.`,
    (c, n) =>
      `Mehrfamilienhäuser und Eigentümergemeinschaften in ${c.displayName} betreuen wir auf Wunsch dauerhaft. Treppenhausreinigung in festen Intervallen, Pflege der Außenanlagen, Müllmanagement, kleine Reparaturen, Pflege der Heizung, Winterdienst — alles aus einer Hand und mit einem festen Ansprechpartner. Wir sind regelmäßig auch in ${n.slice(0, 3).map((x) => x.displayName).join(", ")} im Einsatz, was kurze Reaktionszeiten in der gesamten Region ermöglicht.`,
    (c) =>
      `Eine Besichtigung vor Ort in ${c.displayName} ist kostenlos und unverbindlich — im gesamten Einsatzgebiet bis 60 km um Osnabrück. Bei der Besichtigung erfassen wir den Zustand, klären Wünsche und Prioritäten und erstellen anschließend ein faires Festpreisangebot. Bei laufenden Aufträgen (z.B. Mehrfamilienhausbetreuung) erhalten Sie monatliche Übersichten der erledigten Tätigkeiten.`,
    (c) =>
      `Winterdienst in ${c.displayName}: Wir übernehmen Räum- und Streupflichten von November bis März — sowohl für private Eigentümer als auch für Hausverwaltungen. Geräumt wird in der Regel werktags vor 7:00 Uhr und sonntags vor 9:00 Uhr (gemäß lokaler Streupflicht). Streumittel stellen wir auf Wunsch zur Verfügung.`,
    (c) =>
      `Kleinreparaturen, die viele andere ablehnen, sind unser Tagesgeschäft in ${c.displayName}: nachgezogene Schrauben, gewechselte Dichtungen, justierte Türen, gewartete Fenster, kleine Putzschäden, ausgetauschte Lichtschalter. Wer einen Hausmeister im ${c.landkreis} sucht, hat oft genau diese vermeintlich kleinen Aufgaben — wir nehmen sie ernst.`,
    (c) =>
      `Pflege der Außenanlagen rund um Wohnobjekte in ${c.displayName}: Rasenmähen, Heckenschnitt, Beete, Wege, Einfahrt, Zaun. Auf Wunsch übernehmen wir die ganzjährige Betreuung — von der Frühjahrsbestellung bis zum Winterdienst. Die ${c.bundesland === "Niedersachsen" ? "niedersächsische" : "nordrhein-westfälische"} Witterung verlangt eine angepasste Pflegeplanung; wir denken sie mit.`,
    (c) =>
      `Hausverwaltungen im ${c.landkreis} schätzen unseren Service vor allem wegen der dokumentierten Tätigkeitsnachweise. Jeder Einsatz in ${c.displayName} wird schriftlich erfasst — Datum, Uhrzeit, durchgeführte Arbeiten, eingesetzte Materialien. Bei Eigentümergemeinschaften ist diese Nachweispflicht oft Voraussetzung für die Abrechnung über die Hausgeldumlage. Auf Wunsch erhalten Sie monatliche oder quartalsweise Übersichten als PDF.`,
    (c) =>
      `Beim Mieterwechsel in ${c.displayName} unterstützen wir auf Wunsch mit der Wohnungsabnahme: Zählerstände erfassen, Übergabeprotokoll mit Foto-Dokumentation, Kontrolle auf Schäden und Vereinbarungen aus dem Mietvertrag. Auch kleine Renovierungsarbeiten zwischen den Mietverhältnissen — Wände streichen, Bohrlöcher schließen, Türen justieren — bieten wir auf Anfrage zum Festpreis an.`,
    (c) =>
      `Erreichbarkeit und Reaktion: In ${c.displayName} sind wir per Telefon, E-Mail und WhatsApp erreichbar. Bei dringenden Anliegen — defekte Klingelanlage, klemmende Hauseingangstür, Wasserschaden im Treppenhaus — haben wir feste Reaktionszeiten innerhalb der Woche definiert. Hausverwaltungen mit Vertragsbindung bekommen einen festen Ansprechpartner zugewiesen, der die Objekte und ihre Eigenheiten kennt.`,
  ],
  faqPool: [
    (c) => ({
      q: `Wie schnell sind Sie als Hausmeister in ${c.displayName} vor Ort?`,
      a: `${c.displayName} liegt ${distancePhrase(c)}. Termine sind in der Regel innerhalb weniger Tage möglich, bei dringenden Anliegen oft kurzfristiger.`,
    }),
    (c) => ({
      q: `Übernehmen Sie auch Mehrfamilienhäuser in ${c.displayName}?`,
      a: `Ja. Treppenhausreinigung, Pflege der Außenanlagen, Müllmanagement, Kleinreparaturen und Winterdienst für Mehrfamilienhäuser im ${c.landkreis} sind feste Bestandteile unseres Hausmeisterservices.`,
    }),
    (c) => ({
      q: `Was kostet eine Besichtigung in ${c.displayName}?`,
      a: `Die Besichtigung in ${c.displayName} ist kostenlos und unverbindlich — im gesamten Einsatzgebiet bis 60 km um Osnabrück.`,
    }),
    (c) => ({
      q: `Bieten Sie Winterdienst in ${c.displayName} an?`,
      a: `Ja. Räum- und Streudienst von November bis März — werktags vor 7:00 Uhr, sonntags vor 9:00 Uhr (örtliche Streupflicht). Streumittel stellen wir auf Wunsch.`,
    }),
    (c) => ({
      q: `Arbeiten Sie zum Festpreis?`,
      a: `Ja. Bei klar abgrenzbaren Aufträgen in ${c.displayName} erhalten Sie ein verbindliches Festpreisangebot nach kostenloser Besichtigung — keine Überraschungen bei der Endabrechnung.`,
    }),
    (c) => ({
      q: `Kann der Hausmeisterservice in ${c.displayName} dauerhaft beauftragt werden?`,
      a: `Ja. Viele Kunden in ${c.displayName} und im ${c.landkreis} haben einen festen Betreuungsvertrag mit monatlicher Übersicht der erledigten Tätigkeiten.`,
    }),
    (c) => ({
      q: `Welche typischen Aufgaben übernehmen Sie in ${c.displayName}?`,
      a: `Kleinreparaturen, Lampen- und Sicherungswechsel, Sanitärkleinarbeiten, Türen und Schlösser, Treppenhausreinigung, Außenanlagenpflege, Müllplatzpflege, Laubentfernung, Winterdienst — alles aus einer Hand.`,
    }),
    (c) => ({
      q: `Sind Sie auch für Hausverwaltungen in ${c.bundesland} ansprechbar?`,
      a: `Ja. Hausverwaltungen erhalten von uns dokumentierte Tätigkeitsnachweise und können einen festen Ansprechpartner für Objekte im ${c.landkreis} fest buchen.`,
    }),
    (c) => ({
      q: `Wie weit ist Ihr Standort von ${c.displayName} entfernt?`,
      a: `Unser Sitz ist Bramscher Str. 161, 49090 Osnabrück — etwa ${c.distanceKm} km von ${c.displayName}. ${c.distanceKm <= 30 ? "Das ermöglicht uns kurze Reaktionszeiten." : "Trotz der Entfernung planen wir Anfahrten effizient und kommen zu fairen Konditionen."}`,
    }),
    (c) => ({
      q: `Werden Sie auch in der Nachbarschaft von ${c.displayName} tätig?`,
      a: `Ja, wir sind im gesamten ${c.region} regelmäßig im Einsatz und können benachbarte Termine bündeln.`,
    }),
    (c) => ({
      q: `Brauche ich für einen Hausmeisterservice in ${c.displayName} einen Vertrag?`,
      a: `Nein. Einzelaufträge in ${c.displayName} sind ohne Vertragsbindung möglich. Bei laufender Betreuung empfehlen wir eine schriftliche Vereinbarung mit klar definierten Leistungen.`,
    }),
    (c) => ({
      q: `Welche Versicherung haben Sie für Hausmeisterarbeiten in ${c.displayName}?`,
      a: `Wir sind als gewerblicher Dienstleister versichert. Details zur Betriebshaftpflicht legen wir auf Anfrage bei der Besichtigung in ${c.displayName} offen.`,
    }),
  ],
};

// ====================================================================
// GARTENPFLEGE
// ====================================================================
const GARTEN: ServiceBlocks = {
  primaryKeyword: (c) => `Gärtner ${c.displayName}`,
  metaTitle: (c) =>
    `Gärtner & Gartenpflege ${c.displayName} (${c.landkreis}) | Rund ums Haus Littawe`,
  metaDescription: (c) =>
    `Gartenpflege in ${c.displayName} (${c.bundesland}): Rasen mähen, Hecken schneiden, Beetpflege, Gartenbetreuung übers Jahr. Aus Osnabrück, ${c.distanceKm} km Anfahrt. Kostenlose Besichtigung.`,
  h1: (c) => `Gärtner & Gartenpflege in ${c.displayName}`,
  introVariants: [
    (c) =>
      `Sie suchen einen zuverlässigen Gärtner in ${c.displayName}? Wir übernehmen Rasenmähen, Heckenschnitt, Beetpflege, Vertikutieren und saisonale Arbeiten — einmalig oder als ganzjährige Gartenbetreuung. ${c.uniqueHook.charAt(0).toUpperCase() + c.uniqueHook.slice(1)} kennen wir die Bodenverhältnisse, das Klima und die typischen Pflanzenarten der Region. Anfahrt aus Osnabrück: ${c.distanceKm} km.`,
    (c) =>
      `Gartenpflege in ${c.displayName} aus einer Hand: vom regelmäßigen Rasenschnitt über Heckenform- und Rückschnitte bis zur kompletten Jahresbetreuung. Wir kommen mit eigenem Werkzeug und übernehmen die fachgerechte Entsorgung des Grünguts. In ${c.bundesland} unterliegt der Heckenschnitt von März bis September dem Bundesnaturschutzgesetz — wir berücksichtigen das in der Planung.`,
    (c) =>
      `Als Gärtner im ${c.landkreis} kümmern wir uns um private Gärten ebenso wie um Außenanlagen von Unternehmen in ${c.displayName}. Heckenschnitt, Rasenpflege, Unkrautentfernung, Vertikutieren, Beetpflege und saisonale Arbeiten gehören zu unseren Standardleistungen. ${c.uniqueHook.charAt(0).toUpperCase() + c.uniqueHook.slice(1)} sind wir regelmäßig vor Ort und können Termine bündeln.`,
    (c) =>
      `Heckenschnitt, Rasenmähen, Beetpflege in ${c.displayName} — wir sind ein junger Familienbetrieb aus Osnabrück (${c.distanceKm} km nach ${c.displayName}) und übernehmen sowohl einmalige Gartenarbeiten als auch ganzjährige Betreuungsverträge. Im ${c.landkreis} sind wir mehrmals pro Woche im Einsatz.`,
    (c) =>
      `Gartenpflege ${c.displayName} (${populationLabel(c.populationClass)} in ${c.bundesland}): Rasen, Hecke, Beete, Bäume, Wege, Sträucher — alles, was im Garten anfällt. Wir arbeiten mit eigenem Profi-Werkzeug, sind als Familienbetrieb versichert und entsorgen das Schnittgut fachgerecht. Unverbindliche Besichtigung kostenlos.`,
    (c) =>
      `Wenn Sie als Hauseigentümer in ${c.displayName} regelmäßig einen Gärtner brauchen — für den wöchentlichen Rasenschnitt, den jährlichen Heckenschnitt oder die komplette Betreuung —, sind wir Ihr Ansprechpartner. ${c.uniqueHook.charAt(0).toUpperCase() + c.uniqueHook.slice(1)} bündeln wir Termine effizient. Reaktionszeit in der Regel wenige Tage.`,
    (c) =>
      `Professionelle Gartenpflege in ${c.displayName}: vom Frühjahrsschnitt im März bis zum Laub-Räumen im November. Wir verstehen Gärten als Jahresprojekt und planen mit Ihnen den passenden Pflegerhythmus. Auch in ${c.region} angepasst — Bodentyp, Klima, Pflanzenmix der ${c.bundesland === "Niedersachsen" ? "niedersächsischen" : "nordrhein-westfälischen"} Region.`,
    (c) =>
      `Gärtner-Service ${c.displayName} & Umgebung: Wir betreuen private Gärten von 100 m² bis 5 000 m², Außenanlagen von Mehrfamilienhäusern, Firmenparks und kleine Gewerbeflächen. ${c.uniqueHook.charAt(0).toUpperCase() + c.uniqueHook.slice(1)} sind wir bekannt für saubere Schnittlinien, faire Stundensätze und schnelle Verfügbarkeit.`,
  ],
  bodyParagraphs: [
    (c) =>
      `Heckenschnitt in ${c.displayName} bieten wir für alle gängigen Heckenarten: Liguster, Buche, Hainbuche, Thuja, Eibe, Kirschlorbeer, Buchsbaum. Wir führen Form-, Pflege- und Rückschnitte durch — saubere Linien, fachgerechte Höhe, gleichmäßige Tiefe. Schnittzeiten beachten wir nach Bundesnaturschutzgesetz: Pflegeschnitte sind in ${c.bundesland} ganzjährig erlaubt, starke Rückschnitte und Rodungen nur zwischen 1. Oktober und 28. Februar.`,
    (c, n) =>
      `Neben ${c.displayName} sind wir regelmäßig in ${n.slice(0, 4).map((x) => x.displayName).join(", ")} unterwegs. Dadurch können wir kurze Wege bündeln und Termine in ${c.displayName} oft innerhalb weniger Tage anbieten — auch bei kurzfristigen Anfragen während der Hauptsaison (April–Oktober).`,
    (c) =>
      `Rasenpflege in ${c.displayName}: regelmäßiges Mähen (in der Hauptsaison meist 1× pro Woche), Vertikutieren im Frühjahr, Aerifizieren bei verdichteten Böden, Düngung, Nachsaat, Kantenschneiden. Auf Wunsch übernehmen wir die ganzjährige Rasenpflege im Vertrag — mit dokumentierter Pflegeplanung und festem Termin.`,
    (c) =>
      `Auf Wunsch übernehmen wir in ${c.displayName} die ganzjährige Gartenpflege: Frühjahrsschnitt und Beeteanlage im März/April, regelmäßiges Mähen im Sommer, Heckenschnitt im Spätsommer, Laubentfernung im Oktober/November, Vorbereitung auf den Winter, Winterdienst auf Gehwegen. Sie haben einen Ansprechpartner für 12 Monate.`,
    (c) =>
      `Beetpflege & Unkrautentfernung in ${c.displayName}: Wir reinigen Beete, schneiden Stauden zurück, mulchen, pflanzen Saisonpflanzen, entfernen Unkraut mechanisch (ohne Glyphosat). Auch im ${c.landkreis} ist der Verzicht auf chemische Unkrautvernichter heute Standard — wir handhaben das ebenso.`,
    (c) =>
      `Größere Grundstücke und Außenanlagen von Unternehmen in ${c.displayName} betreuen wir auf separater Vereinbarung. Aufmaß, Pflegeplan, fester Rhythmus. Bei Außenanlagen von Wohnanlagen mit mehr als 1 000 m² lohnt sich oft ein Jahresvertrag — wir kalkulieren das transparent.`,
    (c) =>
      `Boden- und Klimacharakteristik in ${c.displayName}: Die Region ${c.region} hat ${c.bundesland === "Niedersachsen" ? "atlantisch geprägtes Klima mit 750-900 mm Jahresniederschlag und gleichmäßiger Verteilung übers Jahr" : "subatlantisches Klima mit milden Wintern und feuchten Sommern"}. Daraus folgt ein hoher Mossanteil im Rasen — Vertikutieren ist deshalb in ${c.displayName} jährlich sinnvoll. Pilzkrankheiten wie Roter Faden und Schneeschimmel treten häufiger auf als in trockeneren Regionen, was eine gute Entwässerung und passende Düngung wichtig macht.`,
    (c) =>
      `Pflanzenwahl bei Heckenneuanlage in ${c.displayName}: Wir empfehlen für die Region ${c.region} bewährte Heckenarten — Hainbuche und Liguster für klassische Sichtschutzhecken (winterhart, schnittverträglich), Eibe für formale Gärten, Buche für hohe Hecken. Thuja und Kirschlorbeer eignen sich für ganzjährigen Sichtschutz, sind aber pflegeintensiver. Bei der Auswahl berücksichtigen wir auch die kommunale Vorgaben in ${c.landkreis} (Grenzabstände, max. Höhen).`,
    (c) =>
      `Pestizidfrei und nachhaltig: In ${c.displayName} arbeiten wir konsequent ohne Glyphosat und ohne synthetische Pestizide. Unkraut wird mechanisch (Hacke, Fugenbürste, Unkrautstecher) oder thermisch (Heißluft- oder Heißwassergerät) entfernt. Düngung möglichst mit organischen oder organisch-mineralischen Düngern. Diese Vorgehensweise ist nicht nur naturschutzkonform — sie passt zu den ökologischen Zielen vieler Kommunen im ${c.landkreis} (Pestizidverzicht auf öffentlichen Flächen seit Jahren Standard).`,
  ],
  faqPool: [
    (c) => ({
      q: `Bieten Sie Gartenpflege auch in ${c.displayName} an?`,
      a: `Ja, ${c.displayName} liegt in unserem regulären Einsatzgebiet (${c.distanceKm} km von Osnabrück). Rasenmähen, Heckenschnitt und ganzjährige Gartenbetreuung sind dort genauso möglich wie in der Stadt selbst.`,
    }),
    (c) => ({
      q: `Wie oft sollte eine Hecke in ${c.displayName} geschnitten werden?`,
      a: `Die meisten Hecken in der Region um ${c.displayName} schneiden wir 2× pro Jahr — einen Formschnitt im Frühsommer (Juni/Juli) und einen Pflegeschnitt im Spätsommer (August/September). Bei stark wachsenden Sorten wie Thuja oder Liguster kann ein dritter Schnitt sinnvoll sein.`,
    }),
    (c) => ({
      q: `Wann ist der beste Zeitpunkt für einen Rückschnitt in ${c.bundesland}?`,
      a: `Starke Rückschnitte und Rodungen sind in ${c.bundesland} nach Bundesnaturschutzgesetz nur zwischen 1. Oktober und 28. Februar erlaubt. Pflegeschnitte (Formschnitt) sind ganzjährig zulässig, sofern keine brütenden Vögel betroffen sind.`,
    }),
    (c) => ({
      q: `Mähen Sie auch große Grundstücke in ${c.displayName}?`,
      a: `Ja, neben privaten Gärten betreuen wir Grundstücke bis 5 000 m² und Außenanlagen von Unternehmen in ${c.displayName} und im ${c.landkreis}.`,
    }),
    (c) => ({
      q: `Was kostet eine Besichtigung des Gartens in ${c.displayName}?`,
      a: `Die Besichtigung in ${c.displayName} ist kostenlos und unverbindlich. Anschließend erhalten Sie ein faires Festpreisangebot.`,
    }),
    (c) => ({
      q: `Übernehmen Sie eine ganzjährige Gartenbetreuung in ${c.displayName}?`,
      a: `Sehr gern. Für viele Kunden in ${c.displayName} und Umgebung übernehmen wir die komplette Gartenpflege übers Jahr — mit dokumentiertem Pflegeplan vom Frühjahrsschnitt bis zur Herbstpflege.`,
    }),
    (c) => ({
      q: `Wie schnell bekomme ich in ${c.displayName} einen Termin?`,
      a: `Termine in ${c.displayName} sind in der Regel innerhalb weniger Tage möglich. In der Hauptsaison (April–Oktober) bündeln wir Aufträge, was zusätzliche Flexibilität schafft.`,
    }),
    (c) => ({
      q: `Verwenden Sie chemische Unkrautvernichter?`,
      a: `Nein. In ${c.displayName} und unserem gesamten Einsatzgebiet arbeiten wir ohne Glyphosat — Unkraut wird mechanisch entfernt oder mit thermischen Methoden behandelt.`,
    }),
    (c) => ({
      q: `Übernehmen Sie auch die Entsorgung des Grünguts in ${c.displayName}?`,
      a: `Ja. Schnittgut, Laub und Unkraut nehmen wir mit und entsorgen es fachgerecht — entweder über die kommunale Grüngut-Annahme im ${c.landkreis} oder als Eigenkompostierung.`,
    }),
    (c) => ({
      q: `Bieten Sie auch Vertikutieren und Düngung in ${c.displayName} an?`,
      a: `Ja. Vertikutieren erfolgt in ${c.displayName} idealerweise im April, eine zweite Düngung im Spätsommer. Wir planen das in Ihren Pflegeplan ein.`,
    }),
    (c) => ({
      q: `Können Sie auch Rasen neu anlegen in ${c.displayName}?`,
      a: `Ja, Rasenneuanlage und Rasensanierung in ${c.displayName} gehören zu unseren Leistungen. Bodenanalyse, Saatgutwahl, Anlage — auf Wunsch komplett.`,
    }),
    (c) => ({
      q: `Sind Sie als Gartenpflege-Dienst in ${c.displayName} versichert?`,
      a: `Ja, wir sind als gewerblicher Dienstleister mit Betriebshaftpflicht versichert.`,
    }),
  ],
};

// ====================================================================
// DACHARBEITEN / DACHREINIGUNG
// ====================================================================
const DACH: ServiceBlocks = {
  primaryKeyword: (c) => `Dachreinigung ${c.displayName}`,
  metaTitle: (c) =>
    `Dachreinigung & Dacharbeiten ${c.displayName} | Rund ums Haus Littawe`,
  metaDescription: (c) =>
    `Dachreinigung in ${c.displayName} (${c.landkreis}, ${c.bundesland}): Moos- und Algenentfernung, Dachrinnenreinigung, Beschichtung. Festpreis nach kostenloser Besichtigung. ${c.distanceKm} km aus Osnabrück.`,
  h1: (c) => `Dachreinigung in ${c.displayName} — sauber und langlebig`,
  introVariants: [
    (c) =>
      `Dachreinigung in ${c.displayName}: Wir entfernen Moos, Flechten, Algen und Verschmutzungen gründlich und schonend. Besonders ${c.uniqueHook} ist Moosbewuchs auf Dächern weit verbreitet — die regional feuchte Witterung in ${c.bundesland} begünstigt ihn. Eine fachgerechte Reinigung verlängert die Lebensdauer Ihrer Eindeckung deutlich.`,
    (c) =>
      `Sie möchten Ihr Dach in ${c.displayName} reinigen lassen? Wir übernehmen Reinigung, Moosentfernung, Dachrinnenreinigung und auf Wunsch eine schützende Beschichtung. Anfahrt aus Osnabrück (${c.distanceKm} km), faire Festpreise nach Besichtigung, fachgerechte Entsorgung des Materials.`,
    (c) =>
      `Dacharbeiten in ${c.displayName} (${c.bundesland}): Reinigung, Pflege und kleine Arbeiten rund ums Dach. Wir arbeiten mit geeigneter Ausrüstung — Hubsteiger oder Steiger mit Sicherung —, je nach Dachneigung und Höhe. Auch im ${c.landkreis} sind Dächer oft nicht zugänglich; wir bringen das passende Equipment mit.`,
    (c) =>
      `Moos, Algen, Flechten auf dem Dach in ${c.displayName}? Das ist nicht nur ein Schönheitsproblem — Moosbewuchs hält Feuchtigkeit, was langfristig zu Schäden an Ziegeln und Unterkonstruktion führen kann. Eine gründliche Dachreinigung in ${c.displayName} bringt sichtbare Ergebnisse und schützt langfristig.`,
    (c) =>
      `Dachreinigung ${c.displayName}: Wir prüfen vor jeder Reinigung den Zustand des Daches, wählen das passende Verfahren (Niederdruck, Heißwasser, mechanisch) und nennen Ihnen einen verbindlichen Festpreis. Anfahrt: ${c.distanceKm} km aus Osnabrück.`,
    (c) =>
      `Wenn Ihr Dach in ${c.displayName} stark bemoost ist, lohnt sich oft die Kombination aus Reinigung und schützender Beschichtung. Diese hält Moos- und Algenbewuchs für mehrere Jahre fern. ${c.uniqueHook.charAt(0).toUpperCase() + c.uniqueHook.slice(1)} ist das ein häufig nachgefragter Auftrag.`,
    (c) =>
      `Professionelle Dachreinigung in ${c.displayName} und im ${c.landkreis}: Wir reinigen Ziegel-, Beton- und Faserzementdächer. Materialgerechtes Verfahren, fachgerechte Entsorgung des Schmutzes, Sicherung gemäß Arbeitsschutz. Festpreis nach Besichtigung.`,
    (c) =>
      `Dach reinigen lassen in ${c.displayName} — wir machen das oft in Kombination mit Dachrinnenreinigung. Verstopfte Rinnen führen zu Wasserschäden an der Fassade; eine jährliche Reinigung beugt vor. Bei ${c.distanceKm} km Anfahrt aus Osnabrück bündeln wir gerne mehrere Aufträge in ${c.displayName}.`,
  ],
  bodyParagraphs: [
    (c) =>
      `Vor jeder Dachreinigung in ${c.displayName} erfolgt eine Besichtigung. So können wir den Zustand des Daches einschätzen, das passende Verfahren wählen (Niederdruckreinigung mit oder ohne Reinigungsmittel, Heißwasser, mechanische Bürstung) und Ihnen einen verbindlichen Festpreis nennen. Die Besichtigung ist kostenlos und unverbindlich.`,
    (c) =>
      `Eine regelmäßige Dachreinigung in ${c.displayName} verlängert die Lebensdauer der Dacheindeckung deutlich. Moos und Algen halten Feuchtigkeit; das kann mit der Zeit zu Frostsprengung an Ziegeln und Schäden an der Unterkonstruktion führen. Je nach Standort empfehlen wir eine Reinigung alle 5–10 Jahre — bei stark bemoosten Dächern oder Bäumen in unmittelbarer Nähe entsprechend häufiger.`,
    (c, n) =>
      `Wir sind in ${c.displayName} und der Umgebung — u.a. ${n.slice(0, 3).map((x) => x.displayName).join(", ")} — regelmäßig im Einsatz. Bei ${c.distanceKm} km Anfahrt aus Osnabrück bündeln wir Aufträge nach Möglichkeit, was die Anfahrtsanteile fair hält.`,
    (c) =>
      `Schutzbeschichtung in ${c.displayName}: Auf Wunsch tragen wir nach der Reinigung eine schützende Beschichtung auf, die Moos- und Algenbewuchs deutlich verlangsamt. Verfügbar in transparent oder farbig (passend zur ursprünglichen Ziegelfarbe). Haltbarkeit etwa 5–10 Jahre, je nach Standort.`,
    (c) =>
      `Dachrinnenreinigung in ${c.displayName} ist ein Standardauftrag — vor allem im Herbst. Verstopfte Rinnen führen zu Überlauf, der die Fassade beschädigt. Wir reinigen Rinnen und Fallrohre, prüfen die Funktion und melden notwendige Reparaturen.`,
    (c) =>
      `Sicherheit beim Dacharbeiten in ${c.displayName}: Wir arbeiten gemäß Arbeitsschutzbestimmungen mit Anseilung oder Hubsteiger, je nach Dachneigung. Steile Dächer (>45°) erfordern Sondermaßnahmen, was wir in der Besichtigung klären.`,
    (c) =>
      `Asbest-Hinweis: Faserzementdächer, die vor 1993 verbaut wurden, können Asbestfasern enthalten. Eine Hochdruckreinigung dieser Dächer ist verboten — die Fasern werden freigesetzt und sind gesundheitsschädlich. Bei Verdacht auf Asbest in ${c.displayName} prüfen wir das Material vor jeder Arbeit. Bei bestätigtem Asbest-Faserzement ist eine Reinigung nicht möglich; in diesem Fall ist nur eine professionelle Sanierung (Austausch durch zertifizierten Fachbetrieb) der richtige Weg.`,
    (c) =>
      `Umweltverträgliche Reinigungsmittel: Wenn Reinigungsmittel zum Einsatz kommen, verwenden wir biologisch abbaubare Produkte. Schmutzwasser wird in ${c.displayName} möglichst aufgefangen und nicht in die Regenwasserkanalisation eingeleitet — das ist in den meisten Kommunen im ${c.landkreis} ohnehin verboten. Bei größeren Dächern setzen wir mobile Auffangwannen ein, das gesammelte Wasser entsorgen wir fachgerecht.`,
    (c) =>
      `Kombination mit anderen Dachleistungen in ${c.displayName}: Wenn wir ohnehin auf dem Dach arbeiten, lohnt es sich oft, weitere kleine Aufgaben gleich zu erledigen — verschobene Ziegel zurücklegen, fehlende Mörtelfugen ausbessern, Schornsteinanschlüsse prüfen, Antennen-Halterungen kontrollieren, Fledermausschutz-Steine kontrollieren. Wir nennen diese Mit-Arbeiten transparent in der Besichtigung.`,
  ],
  faqPool: [
    (c) => ({
      q: `Wie oft sollte ein Dach in ${c.displayName} gereinigt werden?`,
      a: `Je nach Standort und Eindeckung empfehlen wir eine Dachreinigung in ${c.displayName} alle 5–10 Jahre — bei stark bemoosten Dächern oder Bäumen in der Nähe entsprechend häufiger.`,
    }),
    (c) => ({
      q: `Was kostet eine Dachreinigung in ${c.displayName}?`,
      a: `Die Kosten hängen von Dachgröße, Verschmutzungsgrad und Eindeckung ab. Nach kostenloser Besichtigung in ${c.displayName} erhalten Sie einen verbindlichen Festpreis ohne versteckte Zusatzkosten.`,
    }),
    (c) => ({
      q: `Reinigen Sie auch die Dachrinne in ${c.displayName}?`,
      a: `Ja. Dachrinnenreinigung gehört zu unseren Standardleistungen — gerne in Kombination mit der Dachreinigung in ${c.displayName}.`,
    }),
    (c) => ({
      q: `Bieten Sie eine Schutzbeschichtung nach der Reinigung an?`,
      a: `Ja, auf Wunsch tragen wir nach der Reinigung in ${c.displayName} eine schützende Beschichtung auf, die Moos- und Algenbewuchs deutlich verlangsamt. Haltbarkeit ca. 5–10 Jahre.`,
    }),
    (c) => ({
      q: `Ist die Reinigung schonend für die Dachziegel?`,
      a: `Wir arbeiten mit auf das Material abgestimmtem Druck und Mitteln. So bleiben Ihre Ziegel in ${c.displayName} unbeschädigt.`,
    }),
    (c) => ({
      q: `Welche Dächer reinigen Sie in ${c.displayName}?`,
      a: `Ziegel-, Beton- und Faserzementdächer aller Art. Sehr steile Dächer (>45°) erfordern Sondermaßnahmen — das klären wir bei der Besichtigung.`,
    }),
    (c) => ({
      q: `Brauche ich eine Genehmigung für die Dachreinigung in ${c.bundesland}?`,
      a: `Für eine Dachreinigung am eigenen Haus in ${c.displayName} ist in der Regel keine Genehmigung notwendig. Bei Mehrfamilienhäusern empfiehlt sich die Abstimmung mit der Hausverwaltung.`,
    }),
    (c) => ({
      q: `Wie lange dauert eine Dachreinigung in ${c.displayName}?`,
      a: `Ein Einfamilienhaus in ${c.displayName} ist meist innerhalb eines Tages fertig — abhängig von Dachgröße und Verschmutzungsgrad. Größere Objekte planen wir entsprechend.`,
    }),
    (c) => ({
      q: `Müssen Sie das Dach betreten oder reinigen Sie vom Boden?`,
      a: `Beides ist möglich. Bei flacheren Dächern in ${c.displayName} arbeiten wir oft direkt auf dem Dach mit Sicherung; bei steileren Dächern nutzen wir Hubsteiger oder reinigen vom Gerüst aus.`,
    }),
    (c) => ({
      q: `Wann ist der beste Zeitpunkt für eine Dachreinigung in ${c.displayName}?`,
      a: `Frühling (April/Mai) und Spätsommer (August/September) sind ideal — trockenes Wetter, keine extreme Hitze.`,
    }),
  ],
};

// ====================================================================
// ENTRÜMPELUNG
// ====================================================================
const ENTRUEMP: ServiceBlocks = {
  primaryKeyword: (c) => `Entrümpelung ${c.displayName}`,
  metaTitle: (c) =>
    `Entrümpelung & Haushaltsauflösung ${c.displayName} | Rund ums Haus Littawe`,
  metaDescription: (c) =>
    `Entrümpelung in ${c.displayName} (${c.landkreis}): vom Keller bis zur kompletten Haushaltsauflösung. Festpreis nach kostenloser Besichtigung. Aus Osnabrück, ${c.distanceKm} km Anfahrt.`,
  h1: (c) => `Entrümpelung & Haushaltsauflösung in ${c.displayName}`,
  introVariants: [
    (c) =>
      `Entrümpelungsfirma in ${c.displayName}: Wir übernehmen Entrümpelungen jeder Größe — vom einzelnen Keller oder Dachboden bis zur kompletten Haushaltsauflösung. Sauber, schnell und stressfrei. ${c.uniqueHook.charAt(0).toUpperCase() + c.uniqueHook.slice(1)} sind wir regelmäßig im Einsatz und kennen die kommunalen Entsorgungswege im ${c.landkreis}.`,
    (c) =>
      `Sie planen eine Haushaltsauflösung in ${c.displayName}? Wir räumen Wohnungen, Häuser, Garagen und Gewerbeflächen — fachgerecht entsorgt, transparent abgerechnet, kostenlos besichtigt. Anfahrt aus Osnabrück: ${c.distanceKm} km.`,
    (c) =>
      `Entrümpelung in ${c.displayName} zum Festpreis: Nach kostenloser Besichtigung erhalten Sie ein verbindliches Angebot ohne versteckte Zusatzkosten. Alle Gegenstände werden fachgerecht entsorgt oder dem Recycling zugeführt — Wertgegenstände werden nicht angerechnet, wir entrümpeln vollständig.`,
    (c) =>
      `Haushaltsauflösung ${c.displayName}: Wir kümmern uns um alles — Räumung, Entsorgung, besenreine Übergabe. Termine sind oft kurzfristig möglich, gerade bei dringenden Anfragen wegen Mietende oder Wohnungsübergabe. ${c.uniqueHook.charAt(0).toUpperCase() + c.uniqueHook.slice(1)} bündeln wir Aufträge effizient.`,
    (c) =>
      `Entrümpelung in ${c.displayName} aus einer Hand: Keller, Dachboden, einzelne Räume oder ganzes Haus. Wir sind Familienbetrieb aus Osnabrück (Bramscher Str. 161, ${c.distanceKm} km nach ${c.displayName}), arbeiten mit eigenen Fahrzeugen und ohne Subunternehmer. Festpreis nach Besichtigung.`,
    (c) =>
      `Wenn Sie in ${c.displayName} eine Wohnungsauflösung organisieren müssen — nach Umzug, Trennung oder Todesfall —, sind wir Ihre Ansprechpartner. Wir nehmen Ihnen den gesamten Prozess ab: Räumung, Sortierung, fachgerechte Entsorgung, Endreinigung. Auch in ${c.region} sind wir mit Standardaufträgen vertraut.`,
    (c) =>
      `Entrümpelungsservice ${c.displayName} (${c.bundesland}): Festpreisangebot nach Besichtigung, schnelle Terminierung, fachgerechte Entsorgung über zugelassene Wertstoffhöfe im ${c.landkreis}, besenreine Übergabe der Räume. Ohne Subunternehmer, ohne versteckte Kosten.`,
    (c) =>
      `Professionelle Entrümpelung in ${c.displayName}: Vom einzelnen Zimmer bis zum kompletten Haushaltsauflösung — wir räumen schnell, sauber und stressfrei. Anfahrtsentfernung aus Osnabrück: ${c.distanceKm} km. Bei kleineren Aufträgen Termin oft binnen Tagen, bei großen Auflösungen 1–2 Wochen Vorlaufzeit.`,
  ],
  bodyParagraphs: [
    (c) =>
      `Typische Aufträge in ${c.displayName} reichen vom Keller- oder Dachbodenausräumen über Wohnungsauflösungen nach Umzug bis zur kompletten Haushaltsauflösung nach Todesfall. Auch Messi-Wohnungen und Gewerbeflächen räumen wir auf Anfrage. In jedem Fall klären wir vorher in der Besichtigung den Umfang, das Vorgehen und den Festpreis.`,
    (c, n) =>
      `Wir sind in ${c.displayName} und Umgebung — ${n.slice(0, 3).map((x) => x.displayName).join(", ")} — regelmäßig im Einsatz und können viele Aufträge kurzfristig übernehmen, auch bei dringenden Haushaltsauflösungen wegen Mietende oder anstehender Wohnungsübergabe. Bei größeren Objekten in ${c.displayName} planen wir 1–2 Wochen Vorlauf ein.`,
    (c) =>
      `Eine Besichtigung vor Ort in ${c.displayName} ist kostenlos und unverbindlich. Wertgegenstände werden nicht angerechnet — wir entrümpeln und entsorgen, ohne dass Sie sich um Abrechnung oder Verwertung kümmern müssen. Was nicht mehr benötigt wird, übernehmen wir vollständig.`,
    (c) =>
      `Fachgerechte Entsorgung in ${c.displayName} und im ${c.landkreis}: Restmüll, Sperrmüll, Schrott, Elektrogeräte, Papier, Holz, Bauschutt — alles wird kategorisiert und über die zugelassenen Wertstoffhöfe entsorgt. So vermeiden Sie als Eigentümer haftungsrechtliche Risiken durch unsachgemäße Entsorgung.`,
    (c) =>
      `Haushaltsauflösung nach Todesfall in ${c.displayName}: Wir gehen einfühlsam vor, klären auf Wunsch den Erbumfang vorher mit Ihnen, sortieren persönliche Dokumente und Erinnerungsstücke gesondert und übergeben das Objekt am Ende besenrein. Auf Wunsch übernehmen wir auch die Schlüsselübergabe an die Hausverwaltung.`,
    (c) =>
      `Endreinigung nach der Entrümpelung in ${c.displayName}: Auf Wunsch übernehmen wir die besenreine Endreinigung. Bei Mietwohnungen mit Übergabeprotokoll planen wir die Reinigung so, dass die Wohnung im vereinbarten Zustand übergeben werden kann.`,
    (c) =>
      `Persönliche Dokumente werden in ${c.displayName} nicht einfach mit-entsorgt. Wir sichten in einer ersten Runde Fotos, Briefe, Ausweise, Verträge und Bankunterlagen und legen sie separat ab. Sie können diese am Ende abholen oder wir senden sie nach. Datenschutz-relevante Geräte (PCs, Smartphones) übergeben wir Ihnen ungeöffnet — die Daten gehören niemandem außer Ihnen. Bei Haushaltsauflösungen nach Todesfall ist diese Sortierung besonders wichtig.`,
    (c) =>
      `Ablauf einer typischen Entrümpelung in ${c.displayName}: Tag 1 — Vorabbesichtigung mit Festpreisangebot. Tag X (Auftragsbestätigung): Anlieferung Container falls nötig (im ${c.landkreis} arbeiten wir mit lokalen Containerdiensten). Tag X+1 bis X+3: Räumung mit 2-4 Personen, je nach Volumen. Sortierung in Kategorien (Sperrmüll, Schrott, E-Schrott, Holz, Bauschutt). Abtransport zu Wertstoffhöfen. Optional Endreinigung. Schlüsselübergabe an Hausverwaltung oder Eigentümer.`,
    (c) =>
      `Volumen einschätzen — eine grobe Faustregel für ${c.displayName}: 1-Zimmer-Wohnung ≈ 20-30 m³. 3-Zimmer-Wohnung ≈ 50-80 m³. Reihenhaus mit Keller ≈ 80-150 m³. Einfamilienhaus mit Speicher und Garage ≈ 100-200 m³. Diese Werte helfen für die Erstkalkulation am Telefon. Eine genaue Abrechnung ist immer nach Besichtigung vor Ort möglich, weil Zugang, Sondermüll-Anteil und Auftragstiefe stark variieren.`,
  ],
  faqPool: [
    (c) => ({
      q: `Was kostet eine Entrümpelung in ${c.displayName}?`,
      a: `Die Kosten in ${c.displayName} hängen von Volumen, Zugang und Entsorgungsaufwand ab. Nach kostenloser Besichtigung erhalten Sie einen verbindlichen Festpreis ohne versteckte Zusatzkosten.`,
    }),
    (c) => ({
      q: `Wie schnell können Sie in ${c.displayName} entrümpeln?`,
      a: `Termine in ${c.displayName} sind oft innerhalb weniger Tage möglich, bei dringenden Haushaltsauflösungen häufig auch kurzfristiger. Bei großen Objekten planen wir 1–2 Wochen Vorlauf ein.`,
    }),
    (c) => ({
      q: `Übernehmen Sie auch Haushaltsauflösungen nach Todesfall in ${c.displayName}?`,
      a: `Ja, das ist eine sehr häufige Anfrage in ${c.displayName}. Wir gehen einfühlsam vor, sortieren persönliche Dokumente gesondert und erledigen alle Schritte: Räumung, Entsorgung, besenreine Übergabe.`,
    }),
    (c) => ({
      q: `Werden Wertgegenstände bei der Entrümpelung in ${c.displayName} angerechnet?`,
      a: `Nein. Wir entrümpeln und entsorgen — Wertgegenstände werden nicht gegen den Preis verrechnet. Was nicht mehr benötigt wird, übernehmen wir vollständig.`,
    }),
    (c) => ({
      q: `Kann ich vor Ort in ${c.displayName} dabei sein?`,
      a: `Sie können bei der Entrümpelung in ${c.displayName} dabei sein, müssen es aber nicht. Auf Wunsch übernehmen wir alles eigenständig — inklusive Schlüsselübergabe.`,
    }),
    (c) => ({
      q: `Was kostet eine Besichtigung in ${c.displayName}?`,
      a: `Die Besichtigung in ${c.displayName} ist kostenlos und unverbindlich, im gesamten Umkreis von rund 60 km um Osnabrück.`,
    }),
    (c) => ({
      q: `Welche Räume entrümpeln Sie in ${c.displayName}?`,
      a: `Alle: Keller, Dachboden, einzelne Zimmer, ganze Wohnungen, ganze Häuser, Garagen, Schuppen, Gewerbeflächen. Auch Messi-Wohnungen auf Anfrage.`,
    }),
    (c) => ({
      q: `Wohin geht das entrümpelte Material in ${c.displayName}?`,
      a: `Über zugelassene Wertstoffhöfe im ${c.landkreis} und Recyclingbetriebe. Restmüll, Sperrmüll, Schrott, Elektrogeräte, Papier, Holz, Bauschutt werden kategorisiert entsorgt.`,
    }),
    (c) => ({
      q: `Bieten Sie auch Endreinigung in ${c.displayName}?`,
      a: `Ja, auf Wunsch übernehmen wir nach der Entrümpelung in ${c.displayName} eine besenreine Endreinigung — passend für Wohnungsübergabe oder Verkauf.`,
    }),
    (c) => ({
      q: `Was kostet eine Wohnungsauflösung in ${c.displayName} ungefähr?`,
      a: `Eine 2-Zimmer-Wohnung in ${c.displayName} liegt typischerweise zwischen 500 € und 1 500 € je nach Volumen, Zugang und Entsorgungsaufwand. Festpreis erhalten Sie nach kostenloser Besichtigung.`,
    }),
    (c) => ({
      q: `Arbeiten Sie mit Subunternehmern in ${c.displayName}?`,
      a: `Nein, wir arbeiten in ${c.displayName} mit eigenen Mitarbeitern und Fahrzeugen. Sie haben einen festen Ansprechpartner.`,
    }),
    (c) => ({
      q: `Kann ich Möbel oder Geräte vor der Entrümpelung in ${c.displayName} verkaufen?`,
      a: `Selbstverständlich. Was Sie behalten oder verkaufen möchten, klären wir bei der Besichtigung in ${c.displayName} und nehmen es nicht mit.`,
    }),
  ],
};

// ====================================================================
// SCHROTTABHOLUNG
// ====================================================================
const SCHROTT: ServiceBlocks = {
  primaryKeyword: (c) => `Schrottabholung ${c.displayName}`,
  metaTitle: (c) =>
    `Kostenlose Schrottabholung ${c.displayName} (${c.landkreis}) | Rund ums Haus Littawe`,
  metaDescription: (c) =>
    `Kostenlose Schrottabholung in ${c.displayName} (${c.bundesland}): Altmetall schnell und unkompliziert abgeholt. Aus Osnabrück, ${c.distanceKm} km Anfahrt. Termin kurzfristig möglich.`,
  h1: (c) => `Kostenlose Schrottabholung in ${c.displayName}`,
  introVariants: [
    (c) =>
      `Schrottabholung in ${c.displayName}: Wir holen Ihren Altmetallschrott kostenlos ab — schnell und unkompliziert. Einfach anrufen, Termin vereinbaren, fertig. Anfahrt aus Osnabrück: ${c.distanceKm} km. ${c.uniqueHook.charAt(0).toUpperCase() + c.uniqueHook.slice(1)} sind wir regelmäßig im Einsatz.`,
    (c) =>
      `Sie haben Altmetall in ${c.displayName}, das abgeholt werden soll? Unsere kostenlose Schrottabholung übernimmt das schnell und ohne Aufwand für Sie. Einsatzgebiet: gesamter ${c.landkreis} und 60 km um Osnabrück.`,
    (c) =>
      `Altmetall-Abholung in ${c.displayName}: Wir nehmen alle Arten von Schrott mit — vom defekten Gerät bis zum kompletten Altmetallhaufen. Kostenfrei und zuverlässig, mit eigenen Fahrzeugen aus Osnabrück.`,
    (c) =>
      `Kostenlose Schrottabholung ${c.displayName} (${populationLabel(c.populationClass)} in ${c.bundesland}): Heizkörper, Rohre, Werkzeug, Kabel, Räder, Gartengeräte, Bleche, Stahlträger — wir nehmen klassisches Altmetall mit, fachgerecht verwertet.`,
    (c) =>
      `Wenn Sie in ${c.displayName} Altmetall loswerden möchten — Heizkörper, alte Werkzeuge, Schrott aus Renovierung oder Räumung —, holen wir das kostenlos bei Ihnen ab. ${c.uniqueHook.charAt(0).toUpperCase() + c.uniqueHook.slice(1)} sind kurze Anfahrten zu fairen Konditionen Standard.`,
    (c) =>
      `Schrottabholung in ${c.displayName} ohne Termindruck: Bei kleineren Mengen Termin oft binnen 2–3 Werktagen, bei größeren Mengen nach Absprache. Anfahrt aus Osnabrück: ${c.distanceKm} km. Im Einsatzgebiet kostenfrei.`,
  ],
  bodyParagraphs: [
    (c) =>
      `Mitgenommen wird in ${c.displayName} klassisches Altmetall: Heizkörper, Rohre, Werkzeug, Kabel, alte Räder, Gartengeräte, Stahlträger, Bleche, Schrottautoteile (ohne Karosserie), Maschinenteile. Bei größeren Mengen oder Sondergegenständen sprechen Sie uns einfach an.`,
    (c, n) =>
      `Da wir in ${c.displayName} und Umgebung — ${n.slice(0, 3).map((x) => x.displayName).join(", ")} — regelmäßig unterwegs sind, können wir Termine kurzfristig anbieten. Bei mehreren Aufträgen in ${c.region} bündeln wir Anfahrten, was die Planung beschleunigt.`,
    (c) =>
      `Was wir nicht mitnehmen: Bauschutt, Restmüll, Holz, Elektrogeräte mit Bildschirm (TV, Monitore — DSGVO-relevant), Akkus separat, Schadstoffe (Öl, Lack, Asbest). Diese Materialien gehören in den Wertstoffhof bzw. zur Sondermüllabholung im ${c.landkreis}.`,
    (c) =>
      `Wirtschaftlichkeit für Sie als Anbieter in ${c.displayName}: Der Service funktioniert, weil Altmetall einen Materialwert hat. Mischschrott liegt 2026 bei 100-250 € pro Tonne, Kupfer bei 6 000-8 500 € pro Tonne. Aus den Erlösen finanzieren wir die Anfahrt im Einsatzgebiet und die Personalkosten. Bei haushaltsüblichen Mengen reicht der Erlös für die kostenlose Abholung — Sie sparen die Entsorgungsgebühr, die Sie sonst am Wertstoffhof zahlen würden.`,
    (c) =>
      `Praktische Tipps für Ihre Schrottabholung in ${c.displayName}: Sortieren Sie nach Möglichkeit grob in Eisen / Buntmetall / verzinkt — das beschleunigt die Abholung. Lagern Sie den Schrott trocken (nasses Eisen rostet schnell, was den Materialwert mindert). Informieren Sie uns über besondere Stücke (große Maschinen, Tresor, Heizungsanlagen mit Öl) im Voraus — wir bringen dann passendes Werkzeug mit. Bei Werkstätten-Auflösungen lohnt sich oft eine Vorab-Sichtung per Foto.`,
    (c) =>
      `Sicherheit und Datenschutz bei Schrottabholung in ${c.displayName}: Festplatten und USB-Sticks aus alten PCs, sowie SIM-Karten in Smartphones, sollten Sie vor der Abholung physisch entfernen oder zerstören — wir nehmen Geräte mit, aber DSGVO-relevante Datenträger gehören nicht in den Recycling-Strom. Ebenso bei Heizungsanlagen mit Restöl oder bei Tanks: Restflüssigkeiten müssen vor der Abholung entleert werden. Wir prüfen das vor Ort und beraten, falls Sondermaßnahmen nötig sind.`,
    (c) =>
      `Gewerbliche Schrottabholung im ${c.landkreis}: Werkstätten, Schlossereien, Heizungsbauer und Sanitärbetriebe in ${c.displayName} und Umgebung können regelmäßige Abholtermine vereinbaren — wöchentlich, zweiwöchentlich oder nach Bedarf. Bei sortenreinen Mengen ab ca. 500 kg (Kupfer, Messing, V2A) verhandeln wir Vergütungspreise nach aktuellem Tagespreis. Wir stellen ggf. einen Schrottcontainer und entleeren ihn nach Vereinbarung — bürokratiearm und mit allen Wiegeprotokollen für Ihre Buchhaltung.`,
  ],
  faqPool: [
    (c) => ({
      q: `Ist die Schrottabholung in ${c.displayName} wirklich kostenlos?`,
      a: `Ja, die Abholung von Altmetall in ${c.displayName} ist für Sie kostenfrei. Wir verwerten den Schrott fachgerecht.`,
    }),
    (c) => ({
      q: `Was wird in ${c.displayName} mitgenommen?`,
      a: `Klassisches Altmetall: Heizkörper, Rohre, Werkzeug, Kabel, alte Räder, Gartengeräte, Bleche, Stahlträger, Maschinenteile.`,
    }),
    (c) => ({
      q: `Was wird nicht mitgenommen?`,
      a: `Bauschutt, Restmüll, Holz, Elektrogeräte mit Bildschirm, Akkus, Schadstoffe (Öl, Lack, Asbest). Diese gehören in den Wertstoffhof im ${c.landkreis}.`,
    }),
    (c) => ({
      q: `Wie schnell kommen Sie in ${c.displayName}?`,
      a: `Termine in ${c.displayName} sind in der Regel innerhalb weniger Tage möglich.`,
    }),
    (c) => ({
      q: `Holen Sie auch größere Mengen in ${c.displayName} ab?`,
      a: `Ja, größere Mengen in ${c.displayName} sind kein Problem. Sprechen Sie uns kurz an, dann planen wir den passenden Termin.`,
    }),
    (c) => ({
      q: `Muss ich beim Abholen in ${c.displayName} anwesend sein?`,
      a: `Ja, kurz für die Übergabe. Genaue Position des Schrotts klären wir vorher per Telefon oder WhatsApp.`,
    }),
    (c) => ({
      q: `Bekomme ich für den Schrott in ${c.displayName} Geld?`,
      a: `Bei haushaltsüblichen Mengen ist die Abholung in ${c.displayName} kostenlos — ohne Auszahlung. Bei größeren, sortenreinen Mengen sprechen Sie uns gerne an.`,
    }),
    (c) => ({
      q: `Welche Anfahrtsentfernung gilt für ${c.displayName}?`,
      a: `${c.displayName} liegt etwa ${c.distanceKm} km von unserem Standort in Osnabrück (Bramscher Str. 161). Anfahrtskosten entstehen für Sie nicht.`,
    }),
    (c) => ({
      q: `Holen Sie auch in der Nachbarschaft ab?`,
      a: `Ja, wir sind im gesamten ${c.region} regelmäßig im Einsatz und bündeln benachbarte Termine.`,
    }),
    (c) => ({
      q: `Können Sie Schrott auch von Firmenstandorten in ${c.displayName} abholen?`,
      a: `Ja, gewerbliche Schrottabholung in ${c.displayName} ist möglich. Bei regelmäßigen Aufträgen vereinbaren wir gerne feste Termine.`,
    }),
  ],
};

const BLOCKS: Record<ServiceId, ServiceBlocks> = {
  hausmeisterservice: HAUSMEISTER,
  gartenpflege: GARTEN,
  dacharbeiten: DACH,
  entruempelung: ENTRUEMP,
  schrottabholung: SCHROTT,
};

// ────────────────────────────────────────────────────────────────────
// Page content generation (tier-scaled)
// ────────────────────────────────────────────────────────────────────

export interface FaktenItem {
  label: string;
  value: string;
}

export interface PageContent {
  h1: string;
  metaTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  intro: string;
  body: string[];
  faqs: { q: string; a: string }[];
  fakten: FaktenItem[];
  city: City;
  neighbors: City[];
  service: { id: ServiceId; title: string; description: string };
}

export function paragraphCountForTier(tier: Tier): number {
  if (tier === 1) return 7;
  if (tier === 2) return 5;
  return 3;
}

export function faqCountForTier(tier: Tier): number {
  if (tier === 1) return 8;
  if (tier === 2) return 6;
  return 5;
}

// ─────────────────────────────────────────────────────────────────────
// TEST-ONLY EXPORTS BELOW — do NOT import from production code.
// Re-exported via `programmatic.testing.ts` for clearer test-only signal.
// PX-028 follow-up: ESLint rule `no-restricted-imports` to enforce.
// ─────────────────────────────────────────────────────────────────────

// Exported for testability — read-only structural access to service blocks (pool sizes, etc.).
export function getServiceBlockSizes(serviceId: ServiceId): {
  introVariants: number;
  bodyParagraphs: number;
  faqPool: number;
} {
  const b = BLOCKS[serviceId];
  return {
    introVariants: b.introVariants.length,
    bodyParagraphs: b.bodyParagraphs.length,
    faqPool: b.faqPool.length,
  };
}

// Exported for testability — returns the deterministic indices a page would pick.
// Mirrors generatePageContent() selection logic.
export function getSelectedIndices(
  serviceId: ServiceId,
  citySlug: string
): { introIdx: number; bodyIdx: number[]; faqIdx: number[] } {
  const city = getCityBySlug(citySlug);
  if (!city) throw new Error(`Unknown city: ${citySlug}`);
  const blocks = BLOCKS[serviceId];
  const variantKey = `${serviceId}:${citySlug}`;
  const introIdx = pickIndex(blocks.introVariants.length, variantKey);

  const pickNIdx = (len: number, count: number, key: string): number[] => {
    if (count >= len) return Array.from({ length: len }, (_, i) => i);
    const start = hash(key) % len;
    const out: number[] = [];
    for (let i = 0; i < count; i++) out.push((start + i) % len);
    return out;
  };

  const bodyCount = paragraphCountForTier(city.tier);
  const faqCount = faqCountForTier(city.tier);
  const bodyIdx = pickNIdx(blocks.bodyParagraphs.length, bodyCount, variantKey + ":body");
  const faqIdx = pickNIdx(blocks.faqPool.length, faqCount, variantKey + ":faq");
  return { introIdx, bodyIdx, faqIdx };
}

function buildFakten(city: City, service: ServiceId): FaktenItem[] {
  return [
    { label: "Leistung", value: BLOCKS[service].primaryKeyword(city) },
    { label: "Bundesland", value: city.bundesland },
    { label: "Landkreis", value: city.landkreis },
    { label: "PLZ-Bereich", value: city.plzPrefix },
    { label: "Entfernung Osnabrück", value: city.distanceKm === 0 ? "Standort" : `~ ${city.distanceKm} km` },
    { label: "Region", value: city.region },
    { label: "Besichtigung", value: "kostenlos und unverbindlich" },
  ];
}

export function generatePageContent(serviceId: ServiceId, citySlug: string): PageContent {
  const city = getCityBySlug(citySlug);
  if (!city) throw new Error(`Unknown city: ${citySlug}`);

  const blocks = BLOCKS[serviceId];
  const service = getServiceMeta(serviceId);
  const neighbors = getNeighborCities(city);

  const variantKey = `${serviceId}:${citySlug}`;

  // Intro: pick by hash → distributes 8 variants across 98 cities (~12 per variant per service).
  const introIdx = pickIndex(blocks.introVariants.length, variantKey);
  const intro = blocks.introVariants[introIdx](city);

  // Body: tier-scaled count, rotated start position so different cities of same tier get different paragraphs.
  const bodyCount = paragraphCountForTier(city.tier);
  const body = pickN(blocks.bodyParagraphs, bodyCount, variantKey + ":body").map((fn) =>
    fn(city, neighbors)
  );

  // FAQ: tier-scaled count, rotated from pool of 10-12 per service.
  const faqCount = faqCountForTier(city.tier);
  const faqs = pickN(blocks.faqPool, faqCount, variantKey + ":faq").map((fn) => fn(city));

  return {
    h1: blocks.h1(city),
    metaTitle: blocks.metaTitle(city),
    metaDescription: blocks.metaDescription(city),
    primaryKeyword: blocks.primaryKeyword(city),
    intro,
    body,
    faqs,
    fakten: buildFakten(city, serviceId),
    city,
    neighbors,
    service: { id: serviceId, title: service.title, description: service.description },
  };
}

export function getAllPagePairs(): { service: ServiceId; city: string }[] {
  const pairs: { service: ServiceId; city: string }[] = [];
  for (const s of SERVICE_IDS) {
    for (const c of CITIES) {
      pairs.push({ service: s, city: c.slug });
    }
  }
  return pairs;
}
