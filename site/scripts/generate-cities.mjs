// Generates src/data/cities.json from service-areas.json with rich metadata.
// Each city gets: tier, slug, region, displayName (for disambiguation),
// bundesland, landkreis, plzPrefix, distanceKm, populationClass, uniqueHook.
//
// Tier mapping: ≤25km=1 / 25-45km=2 / 45-60km+=3 (CEO-approved 2026-05-02).
// Run: node scripts/generate-cities.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, "..", "src", "data", "service-areas.json");
const OUT = path.join(__dirname, "..", "src", "data", "cities.json");

const areas = JSON.parse(fs.readFileSync(SRC, "utf-8"));

// ─────────────────────────────────────────────────────────────────────
// Per-city metadata. Hand-curated for top cities, region-derived for tail.
// Sources: Wikipedia (population, postal codes), GeoData Niedersachsen/NRW.
// ─────────────────────────────────────────────────────────────────────

// distanceKm = approximate driving distance from Osnabrück city center.
// populationClass: city (>100k) | large (30-100k) | medium (10-30k) | small (<10k)
// uniqueHook = short geographic/cultural anchor used for content uniqueness.

const CITY_DATA = {
  // ── Osnabrücker Land & Umgebung (Tier 1 mostly) ──
  "Osnabrück":              { dist: 0,  pop: "city",   plz: "49",  hook: "im Herzen der Friedensstadt", lk: "Stadt Osnabrück", bl: "Niedersachsen" },
  "Georgsmarienhütte":      { dist: 9,  pop: "large",  plz: "49",  hook: "südlich von Osnabrück am Fuß des Teutoburger Walds", lk: "Landkreis Osnabrück", bl: "Niedersachsen" },
  "Melle":                  { dist: 25, pop: "large",  plz: "49",  hook: "östlich von Osnabrück im Grönegau", lk: "Landkreis Osnabrück", bl: "Niedersachsen" },
  "Bramsche":               { dist: 17, pop: "large",  plz: "49",  hook: "nördlich von Osnabrück an der Hase", lk: "Landkreis Osnabrück", bl: "Niedersachsen" },
  "Wallenhorst":            { dist: 10, pop: "medium", plz: "49",  hook: "nördlich an Osnabrück angrenzend", lk: "Landkreis Osnabrück", bl: "Niedersachsen" },
  "Belm":                   { dist: 9,  pop: "medium", plz: "49",  hook: "nordöstlich am Stadtrand von Osnabrück", lk: "Landkreis Osnabrück", bl: "Niedersachsen" },
  "Bissendorf":             { dist: 13, pop: "medium", plz: "49",  hook: "östlich von Osnabrück am Wiehengebirge", lk: "Landkreis Osnabrück", bl: "Niedersachsen" },
  "Bad Essen":              { dist: 22, pop: "medium", plz: "49",  hook: "im Wittlager Land am Mittellandkanal", lk: "Landkreis Osnabrück", bl: "Niedersachsen" },
  "Bohmte":                 { dist: 22, pop: "medium", plz: "49",  hook: "im nördlichen Osnabrücker Land an der Hunte", lk: "Landkreis Osnabrück", bl: "Niedersachsen" },
  "Ostercappeln":           { dist: 25, pop: "small",  plz: "49",  hook: "im Wittlager Land am Wiehengebirge", lk: "Landkreis Osnabrück", bl: "Niedersachsen" },
  "Hagen am Teutoburger Wald": { dist: 12, pop: "medium", plz: "49", hook: "südwestlich von Osnabrück im Teutoburger Wald", lk: "Landkreis Osnabrück", bl: "Niedersachsen" },
  "Bad Iburg":              { dist: 17, pop: "medium", plz: "49",  hook: "südlich von Osnabrück, Kurort am Teutoburger Wald", lk: "Landkreis Osnabrück", bl: "Niedersachsen" },
  "Bad Laer":               { dist: 22, pop: "small",  plz: "49",  hook: "im südlichen Osnabrücker Land, Solebad", lk: "Landkreis Osnabrück", bl: "Niedersachsen" },
  "Bad Rothenfelde":        { dist: 25, pop: "small",  plz: "49",  hook: "südöstlich von Osnabrück, Solekurort", lk: "Landkreis Osnabrück", bl: "Niedersachsen" },
  "Dissen am Teutoburger Wald": { dist: 28, pop: "medium", plz: "49", hook: "am südlichen Rand des Teutoburger Walds", lk: "Landkreis Osnabrück", bl: "Niedersachsen" },
  "Glandorf":               { dist: 22, pop: "small",  plz: "49",  hook: "im südwestlichen Osnabrücker Land", lk: "Landkreis Osnabrück", bl: "Niedersachsen" },
  "Hasbergen":              { dist: 10, pop: "medium", plz: "49",  hook: "westlich an Osnabrück angrenzend, am Hüggel", lk: "Landkreis Osnabrück", bl: "Niedersachsen" },

  // ── Artland & Wittlager Land (Tier 2 mostly) ──
  "Quakenbrück":            { dist: 38, pop: "medium", plz: "49",  hook: "im Artland an der Hase, historische Fachwerkstadt", lk: "Landkreis Osnabrück", bl: "Niedersachsen" },
  "Bersenbrück":            { dist: 30, pop: "small",  plz: "49",  hook: "im Artland nördlich von Osnabrück", lk: "Landkreis Osnabrück", bl: "Niedersachsen" },
  "Ankum":                  { dist: 30, pop: "small",  plz: "49",  hook: "im Artland am Fuße der Ankumer Höhen", lk: "Landkreis Osnabrück", bl: "Niedersachsen" },
  "Fürstenau":              { dist: 38, pop: "small",  plz: "49",  hook: "im nördlichen Osnabrücker Land", lk: "Landkreis Osnabrück", bl: "Niedersachsen" },
  "Neuenkirchen":           { dist: 40, pop: "small",  plz: "49",  hook: "im Artland nördlich von Osnabrück", lk: "Landkreis Osnabrück", bl: "Niedersachsen" },
  "Voltlage":               { dist: 35, pop: "small",  plz: "49",  hook: "im nordwestlichen Osnabrücker Land", lk: "Landkreis Osnabrück", bl: "Niedersachsen" },
  "Rieste":                 { dist: 25, pop: "small",  plz: "49",  hook: "am Alfsee im nördlichen Osnabrücker Land", lk: "Landkreis Osnabrück", bl: "Niedersachsen" },
  "Alfhausen":              { dist: 27, pop: "small",  plz: "49",  hook: "am Alfsee nördlich von Osnabrück", lk: "Landkreis Osnabrück", bl: "Niedersachsen" },
  "Nortrup":                { dist: 35, pop: "small",  plz: "49",  hook: "im Artland nördlich von Osnabrück", lk: "Landkreis Osnabrück", bl: "Niedersachsen" },
  "Kettenkamp":             { dist: 33, pop: "small",  plz: "49",  hook: "im Artland", lk: "Landkreis Osnabrück", bl: "Niedersachsen" },
  "Eggermühlen":            { dist: 35, pop: "small",  plz: "49",  hook: "im Artland", lk: "Landkreis Osnabrück", bl: "Niedersachsen" },
  "Menslage":               { dist: 40, pop: "small",  plz: "49",  hook: "im Artland nahe der Hase", lk: "Landkreis Osnabrück", bl: "Niedersachsen" },
  "Bippen":                 { dist: 42, pop: "small",  plz: "49",  hook: "im nördlichen Osnabrücker Land", lk: "Landkreis Osnabrück", bl: "Niedersachsen" },
  "Berge":                  { dist: 42, pop: "small",  plz: "49",  hook: "im nördlichen Osnabrücker Land", lk: "Landkreis Osnabrück", bl: "Niedersachsen" },
  "Gehrde":                 { dist: 30, pop: "small",  plz: "49",  hook: "im Artland", lk: "Landkreis Osnabrück", bl: "Niedersachsen" },
  "Badbergen":              { dist: 35, pop: "small",  plz: "49",  hook: "im Artland an der Hase", lk: "Landkreis Osnabrück", bl: "Niedersachsen" },

  // ── Münsterland (Tier 2-3) ──
  "Münster":                { dist: 50, pop: "city",   plz: "48",  hook: "im Herzen des Münsterlandes, Universitätsstadt", lk: "Stadt Münster", bl: "Nordrhein-Westfalen" },
  "Greven":                 { dist: 38, pop: "medium", plz: "48",  hook: "an der Ems im westlichen Münsterland", lk: "Kreis Steinfurt", bl: "Nordrhein-Westfalen" },
  "Ibbenbüren":             { dist: 30, pop: "large",  plz: "49",  hook: "im Tecklenburger Land am Teutoburger Wald", lk: "Kreis Steinfurt", bl: "Nordrhein-Westfalen" },
  "Lengerich":              { dist: 25, pop: "medium", plz: "49",  hook: "im Tecklenburger Land am Teutoburger Wald", lk: "Kreis Steinfurt", bl: "Nordrhein-Westfalen" },
  "Tecklenburg":            { dist: 28, pop: "small",  plz: "49",  hook: "Burgstadt im Teutoburger Wald", lk: "Kreis Steinfurt", bl: "Nordrhein-Westfalen" },
  "Mettingen":              { dist: 30, pop: "medium", plz: "49",  hook: "im Tecklenburger Land", lk: "Kreis Steinfurt", bl: "Nordrhein-Westfalen" },
  "Hörstel":                { dist: 35, pop: "medium", plz: "48",  hook: "an der Mittellandkanal-Kreuzung im Tecklenburger Land", lk: "Kreis Steinfurt", bl: "Nordrhein-Westfalen" },
  "Rheine":                 { dist: 30, pop: "large",  plz: "48",  hook: "an der Ems im nördlichen Münsterland", lk: "Kreis Steinfurt", bl: "Nordrhein-Westfalen" },
  "Emsdetten":              { dist: 33, pop: "large",  plz: "48",  hook: "an der Ems im westlichen Münsterland", lk: "Kreis Steinfurt", bl: "Nordrhein-Westfalen" },
  "Steinfurt":              { dist: 40, pop: "medium", plz: "48",  hook: "Kreisstadt im westlichen Münsterland", lk: "Kreis Steinfurt", bl: "Nordrhein-Westfalen" },
  "Ochtrup":                { dist: 50, pop: "medium", plz: "48",  hook: "im westlichen Münsterland nahe der Niederlande", lk: "Kreis Steinfurt", bl: "Nordrhein-Westfalen" },
  "Horstmar":               { dist: 50, pop: "small",  plz: "48",  hook: "im westlichen Münsterland", lk: "Kreis Steinfurt", bl: "Nordrhein-Westfalen" },
  "Laer":                   { dist: 47, pop: "small",  plz: "48",  hook: "im westlichen Münsterland", lk: "Kreis Steinfurt", bl: "Nordrhein-Westfalen" },
  "Nordwalde":              { dist: 45, pop: "small",  plz: "48",  hook: "im Münsterland nördlich von Münster", lk: "Kreis Steinfurt", bl: "Nordrhein-Westfalen" },
  "Altenberge":             { dist: 47, pop: "medium", plz: "48",  hook: "im Münsterland nördlich von Münster", lk: "Kreis Steinfurt", bl: "Nordrhein-Westfalen" },
  "Telgte":                 { dist: 55, pop: "medium", plz: "48",  hook: "an der Ems östlich von Münster, Wallfahrtsort", lk: "Kreis Warendorf", bl: "Nordrhein-Westfalen" },
  "Hopsten":                { dist: 38, pop: "small",  plz: "48",  hook: "im nördlichen Münsterland", lk: "Kreis Steinfurt", bl: "Nordrhein-Westfalen" },
  "Recke":                  { dist: 28, pop: "medium", plz: "49",  hook: "im Tecklenburger Land", lk: "Kreis Steinfurt", bl: "Nordrhein-Westfalen" },
  "Westerkappeln":          { dist: 17, pop: "medium", plz: "49",  hook: "westlich von Osnabrück im Tecklenburger Land", lk: "Kreis Steinfurt", bl: "Nordrhein-Westfalen" },
  "Ladbergen":              { dist: 30, pop: "small",  plz: "49",  hook: "südlich des Teutoburger Walds im Münsterland", lk: "Kreis Steinfurt", bl: "Nordrhein-Westfalen" },
  "Saerbeck":               { dist: 33, pop: "small",  plz: "48",  hook: "im Münsterland zwischen Münster und Osnabrück", lk: "Kreis Steinfurt", bl: "Nordrhein-Westfalen" },
  "Lotte":                  { dist: 12, pop: "medium", plz: "49",  hook: "westlich an Osnabrück angrenzend, im Tecklenburger Land", lk: "Kreis Steinfurt", bl: "Nordrhein-Westfalen" },
  "Wettringen":             { dist: 45, pop: "small",  plz: "48",  hook: "im westlichen Münsterland", lk: "Kreis Steinfurt", bl: "Nordrhein-Westfalen" },
  "Neuenkirchen (Kreis Steinfurt)": { dist: 50, pop: "medium", plz: "48", hook: "im Kreis Steinfurt im westlichen Münsterland", lk: "Kreis Steinfurt", bl: "Nordrhein-Westfalen", display: "Neuenkirchen (Kreis Steinfurt)" },
  "Neuenkirchen (bei Rheine)": { dist: 35, pop: "medium", plz: "48", hook: "bei Rheine im nördlichen Münsterland", lk: "Kreis Steinfurt", bl: "Nordrhein-Westfalen", display: "Neuenkirchen bei Rheine" },

  // ── Warendorf, Bielefeld & Umgebung ──
  "Warendorf":              { dist: 60, pop: "large",  plz: "48",  hook: "im östlichen Münsterland an der Ems", lk: "Kreis Warendorf", bl: "Nordrhein-Westfalen" },
  "Sassenberg":             { dist: 55, pop: "medium", plz: "48",  hook: "im östlichen Münsterland", lk: "Kreis Warendorf", bl: "Nordrhein-Westfalen" },
  "Versmold":               { dist: 38, pop: "medium", plz: "33",  hook: "im südwestlichen Ostwestfalen am Teutoburger Wald", lk: "Kreis Gütersloh", bl: "Nordrhein-Westfalen" },
  "Halle (Westfalen)":      { dist: 50, pop: "medium", plz: "33",  hook: "in Ostwestfalen am südlichen Teutoburger Wald", lk: "Kreis Gütersloh", bl: "Nordrhein-Westfalen", display: "Halle (Westfalen)" },
  "Borgholzhausen":         { dist: 40, pop: "small",  plz: "33",  hook: "am südlichen Teutoburger Wald", lk: "Kreis Gütersloh", bl: "Nordrhein-Westfalen" },
  "Werther":                { dist: 50, pop: "medium", plz: "33",  hook: "im Ravensberger Land", lk: "Kreis Gütersloh", bl: "Nordrhein-Westfalen" },
  "Bielefeld":              { dist: 55, pop: "city",   plz: "33",  hook: "Großstadt in Ostwestfalen am Teutoburger Wald", lk: "Stadt Bielefeld", bl: "Nordrhein-Westfalen" },
  "Löhne":                  { dist: 65, pop: "large",  plz: "32",  hook: "im Ravensberger Land an der Werre", lk: "Kreis Herford", bl: "Nordrhein-Westfalen" },
  "Herford":                { dist: 65, pop: "large",  plz: "32",  hook: "Hansestadt in Ostwestfalen", lk: "Kreis Herford", bl: "Nordrhein-Westfalen" },
  "Bad Oeynhausen":         { dist: 60, pop: "large",  plz: "32",  hook: "Kurstadt im Mühlenkreis", lk: "Kreis Minden-Lübbecke", bl: "Nordrhein-Westfalen" },
  "Preußisch Oldendorf":    { dist: 45, pop: "small",  plz: "32",  hook: "im Mühlenkreis am Wiehengebirge", lk: "Kreis Minden-Lübbecke", bl: "Nordrhein-Westfalen" },

  // ── Mittelweser & Nordniedersachsen ──
  "Rahden":                 { dist: 50, pop: "medium", plz: "32",  hook: "im Mühlenkreis im nördlichen Ostwestfalen", lk: "Kreis Minden-Lübbecke", bl: "Nordrhein-Westfalen" },
  "Stemwede":               { dist: 45, pop: "medium", plz: "32",  hook: "im nördlichen Ostwestfalen am Stemweder Berg", lk: "Kreis Minden-Lübbecke", bl: "Nordrhein-Westfalen" },
  "Espelkamp":              { dist: 55, pop: "medium", plz: "32",  hook: "im Mühlenkreis", lk: "Kreis Minden-Lübbecke", bl: "Nordrhein-Westfalen" },
  "Diepholz":               { dist: 55, pop: "medium", plz: "49",  hook: "Kreisstadt im südlichen Niedersachsen", lk: "Landkreis Diepholz", bl: "Niedersachsen" },

  // ── Vechta & Cloppenburg ──
  "Vechta":                 { dist: 55, pop: "large",  plz: "49",  hook: "im Oldenburger Münsterland, Universitätsstadt", lk: "Landkreis Vechta", bl: "Niedersachsen" },
  "Lohne":                  { dist: 50, pop: "large",  plz: "49",  hook: "im Oldenburger Münsterland", lk: "Landkreis Vechta", bl: "Niedersachsen" },
  "Dinklage":               { dist: 45, pop: "medium", plz: "49",  hook: "im Oldenburger Münsterland", lk: "Landkreis Vechta", bl: "Niedersachsen" },
  "Damme":                  { dist: 35, pop: "medium", plz: "49",  hook: "am Dümmer im Oldenburger Münsterland", lk: "Landkreis Vechta", bl: "Niedersachsen" },
  "Holdorf":                { dist: 35, pop: "small",  plz: "49",  hook: "im Oldenburger Münsterland", lk: "Landkreis Vechta", bl: "Niedersachsen" },
  "Steinfeld":              { dist: 35, pop: "medium", plz: "49",  hook: "am Dammer Berge im Oldenburger Münsterland", lk: "Landkreis Vechta", bl: "Niedersachsen" },
  "Neuenkirchen-Vörden":    { dist: 35, pop: "medium", plz: "49",  hook: "im Oldenburger Münsterland", lk: "Landkreis Vechta", bl: "Niedersachsen", display: "Neuenkirchen-Vörden" },
  "Cloppenburg":            { dist: 65, pop: "large",  plz: "49",  hook: "Kreisstadt im Oldenburger Münsterland", lk: "Landkreis Cloppenburg", bl: "Niedersachsen" },
  "Cappeln (Oldenburg)":    { dist: 65, pop: "small",  plz: "49",  hook: "im Oldenburger Münsterland", lk: "Landkreis Cloppenburg", bl: "Niedersachsen", display: "Cappeln (Oldenburg)" },
  "Emstek":                 { dist: 65, pop: "medium", plz: "49",  hook: "im Oldenburger Münsterland", lk: "Landkreis Cloppenburg", bl: "Niedersachsen" },
  "Molbergen":              { dist: 70, pop: "small",  plz: "49",  hook: "im Oldenburger Münsterland", lk: "Landkreis Cloppenburg", bl: "Niedersachsen" },
  "Löningen":               { dist: 50, pop: "medium", plz: "49",  hook: "im Oldenburger Münsterland an der Hase", lk: "Landkreis Cloppenburg", bl: "Niedersachsen" },
  "Essen (Oldenburg)":      { dist: 45, pop: "medium", plz: "49",  hook: "im Oldenburger Münsterland (nicht zu verwechseln mit Essen NRW)", lk: "Landkreis Cloppenburg", bl: "Niedersachsen", display: "Essen (Oldenburg)" },

  // ── Emsland & Grafschaft Bentheim ──
  "Haselünne":              { dist: 60, pop: "medium", plz: "49",  hook: "an der Hase im Emsland", lk: "Landkreis Emsland", bl: "Niedersachsen" },
  "Meppen":                 { dist: 70, pop: "large",  plz: "49",  hook: "Kreisstadt an der Ems im Emsland", lk: "Landkreis Emsland", bl: "Niedersachsen" },
  "Lingen (Ems)":           { dist: 60, pop: "large",  plz: "49",  hook: "an der Ems im Emsland", lk: "Landkreis Emsland", bl: "Niedersachsen", display: "Lingen (Ems)" },
  "Spelle":                 { dist: 50, pop: "small",  plz: "48",  hook: "im südlichen Emsland", lk: "Landkreis Emsland", bl: "Niedersachsen" },
  "Freren":                 { dist: 50, pop: "small",  plz: "49",  hook: "im südlichen Emsland", lk: "Landkreis Emsland", bl: "Niedersachsen" },
  "Geeste":                 { dist: 65, pop: "medium", plz: "49",  hook: "im Emsland", lk: "Landkreis Emsland", bl: "Niedersachsen" },
  "Twist":                  { dist: 80, pop: "medium", plz: "49",  hook: "im Emsland nahe der Niederlande", lk: "Landkreis Emsland", bl: "Niedersachsen" },
  "Salzbergen":             { dist: 50, pop: "small",  plz: "48",  hook: "an der Ems im südlichen Emsland", lk: "Landkreis Emsland", bl: "Niedersachsen" },
  "Herzlake":               { dist: 55, pop: "small",  plz: "49",  hook: "im Emsland", lk: "Landkreis Emsland", bl: "Niedersachsen" },
  "Schüttorf":              { dist: 60, pop: "medium", plz: "48",  hook: "in der Grafschaft Bentheim", lk: "Landkreis Grafschaft Bentheim", bl: "Niedersachsen" },
  "Nordhorn":               { dist: 80, pop: "large",  plz: "48",  hook: "Kreisstadt in der Grafschaft Bentheim nahe der Niederlande", lk: "Landkreis Grafschaft Bentheim", bl: "Niedersachsen" },
  "Wietmarschen":           { dist: 70, pop: "medium", plz: "49",  hook: "in der Grafschaft Bentheim", lk: "Landkreis Grafschaft Bentheim", bl: "Niedersachsen" },
};

// Tier rules: distanceKm-based with population boost.
function tierFor(meta) {
  if (meta.dist <= 25) return 1;
  if (meta.dist <= 45) return 2;
  return 3;
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const allCities = [];
for (const region of areas.regions) {
  for (const name of region.cities) {
    allCities.push({ name, region: region.name });
  }
}

const cities = allCities.map((c) => {
  const meta = CITY_DATA[c.name];
  if (!meta) {
    throw new Error(`Missing metadata for city: "${c.name}". Add it to CITY_DATA in scripts/generate-cities.mjs.`);
  }
  return {
    name: c.name,
    displayName: meta.display ?? c.name,
    slug: slugify(c.name),
    region: c.region,
    tier: tierFor(meta),
    bundesland: meta.bl,
    landkreis: meta.lk,
    plzPrefix: meta.plz,
    distanceKm: meta.dist,
    populationClass: meta.pop,
    uniqueHook: meta.hook,
  };
});

// Slug uniqueness
const slugs = new Set();
for (const c of cities) {
  if (slugs.has(c.slug)) throw new Error(`Duplicate slug: ${c.slug} (${c.name})`);
  slugs.add(c.slug);
}

// SYMMETRIC neighbor graph (Landa C3 fix):
// 1. Each city gets up to 3 nearest neighbors by distance from same region (preferred)
//    or from the global pool, weighted by distance|tier closeness.
// 2. After initial assignment, ensure the graph is symmetric: if A→B exists,
//    add A to B's neighbor list (up to a soft cap of 5).
function pickInitialNeighbors(city, all) {
  const others = all.filter((c) => c.slug !== city.slug);
  const sameRegion = others.filter((c) => c.region === city.region);
  // sort by distance from this city's tier-distance (proxy)
  const distance = (other) => Math.abs(other.distanceKm - city.distanceKm) + (other.tier === city.tier ? 0 : 5);
  const pool = (sameRegion.length >= 3 ? sameRegion : others).sort((a, b) => distance(a) - distance(b));
  return pool.slice(0, 3).map((c) => c.slug);
}

const enriched = cities.map((c) => ({ ...c, neighbors: pickInitialNeighbors(c, cities) }));

// Symmetrize: build reverse-link map, then for each city add reverse-links up to soft cap 6.
const SOFT_CAP = 6;
const reverseLinks = new Map();
for (const c of enriched) reverseLinks.set(c.slug, new Set());
for (const c of enriched) {
  for (const n of c.neighbors) {
    reverseLinks.get(n)?.add(c.slug);
  }
}
for (const c of enriched) {
  const incoming = Array.from(reverseLinks.get(c.slug) ?? []);
  const merged = new Set([...c.neighbors, ...incoming]);
  c.neighbors = Array.from(merged).slice(0, SOFT_CAP);
}

// Sort: tier asc, distance asc, name asc
enriched.sort((a, b) =>
  a.tier - b.tier ||
  a.distanceKm - b.distanceKm ||
  a.name.localeCompare(b.name, "de")
);

const orphanCount = enriched.filter((c) => !enriched.some((other) => other.neighbors.includes(c.slug))).length;

const output = {
  generated: new Date().toISOString().slice(0, 10),
  totalCities: enriched.length,
  byTier: {
    1: enriched.filter((c) => c.tier === 1).length,
    2: enriched.filter((c) => c.tier === 2).length,
    3: enriched.filter((c) => c.tier === 3).length,
  },
  orphanCount,
  cities: enriched,
};

fs.writeFileSync(OUT, JSON.stringify(output, null, 2) + "\n", "utf-8");
console.log(`Wrote ${OUT}`);
console.log(`Total: ${output.totalCities} | T1: ${output.byTier[1]} | T2: ${output.byTier[2]} | T3: ${output.byTier[3]} | orphans: ${output.orphanCount}`);
