#!/usr/bin/env node
/**
 * Canary verification — proper HTML parsing (jsdom).
 * Replaces canary-verify.sh (deprecated — grep over React SSR HTML produces
 * false positives, see L-017).
 *
 * Usage:
 *   node site/scripts/phase1/canary-verify.mjs [service]
 *   (default service: gartenpflege)
 *
 * Exit codes:
 *   0 — all PASS
 *   1 — any FAIL
 */
import { JSDOM } from "jsdom";

const BASE = "https://rundumshaus-littawe.de";
const SERVICE = process.argv[2] || "gartenpflege";

// Sample cities — cover T1 hub + T2 nearby + T3 distant
const SAMPLES = [
  { city: "osnabrueck", tier: "T1", distanceKm: 0 },
  { city: "bramsche", tier: "T2", distanceKm: 14 },
  { city: "bad-iburg", tier: "T2", distanceKm: 17 },
  { city: "freren", tier: "T3", distanceKm: 45 },
  { city: "bielefeld", tier: "T3", distanceKm: 51 },
];

// Per-service expectations
const EXPECTATIONS = {
  gartenpflege: {
    minH2: 7,
    minH3: 2,
    requiredHeadings: [
      "Jetzt kostenloses Angebot anfragen",
      "Warum Rund ums Haus Littawe?",
      "Einsatzgebiet",
      "Häufige Fragen",
    ],
    requiredSchemas: ["BreadcrumbList", "Service", "FAQPage"],
  },
  hausmeisterservice: {
    minH2: 8,
    minH3: 2,
    requiredHeadings: [
      "Jetzt kostenloses Angebot anfragen",
      "Hausmeisterservice für Vermieter, Unternehmen & Hausverwaltungen",
      "Warum Rund ums Haus Littawe?",
      "Einsatzgebiet",
      "Häufige Fragen",
    ],
    requiredSchemas: ["BreadcrumbList", "Service", "FAQPage"],
  },
  dacharbeiten: {
    minH2: 9, // CTA + Pro + Leistungen + 3 sub + Warum + Einsatzgebiet + FAQ
    minH3: 2,
    requiredHeadings: [
      "Jetzt kostenloses Angebot anfragen",
      "Dachreinigung in",
      "Dachrinnenreinigung in",
      "Warum Rund ums Haus Littawe?",
      "Einsatzgebiet",
      "Häufige Fragen",
    ],
    requiredSchemas: ["BreadcrumbList", "Service", "FAQPage"],
  },
  entruempelung: {
    minH2: 8, // CTA + Pro + Leistungen + 2 sub + Warum + Einsatzgebiet + FAQ
    minH3: 2,
    requiredHeadings: [
      "Jetzt kostenloses Angebot anfragen",
      "Haushaltsauflösung in",
      "Wohnungsauflösung & Nachlassauflösung",
      "Warum Rund ums Haus Littawe?",
      "Einsatzgebiet",
      "Häufige Fragen",
    ],
    requiredSchemas: ["BreadcrumbList", "Service", "FAQPage"],
  },
  schrottabholung: {
    minH2: 8, // CTA + Pro + Leistungen + Altmetall + B2B + Warum + Einsatzgebiet + FAQ
    minH3: 2,
    requiredHeadings: [
      "Jetzt kostenlose Schrottabholung anfragen",
      "Altmetallabholung in",
      "Schrottentsorgung für Privat- und Gewerbekunden",
      "Warum Rund ums Haus Littawe?",
      "Einsatzgebiet",
      "Häufige Fragen zur Schrottabholung",
    ],
    requiredSchemas: ["BreadcrumbList", "Service", "FAQPage"],
  },
};

const results = [];
function pass(city, check) { results.push({ city, check, status: "PASS" }); }
function warn(city, check, msg) { results.push({ city, check, status: "WARN", msg }); }
function fail(city, check, msg) { results.push({ city, check, status: "FAIL", msg }); }

async function fetchPage(url) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return await res.text();
}

function getSchemaObjects(document) {
  const scripts = document.querySelectorAll('script[type="application/ld+json"]');
  const objs = [];
  for (const s of scripts) {
    try {
      const parsed = JSON.parse(s.textContent);
      if (Array.isArray(parsed)) objs.push(...parsed);
      else objs.push(parsed);
    } catch { /* skip malformed */ }
  }
  return objs;
}

function visibleText(document) {
  // Strip scripts/styles, then get text from body
  const clone = document.body.cloneNode(true);
  clone.querySelectorAll("script, style, noscript").forEach((el) => el.remove());
  return clone.textContent || "";
}

async function verifyPage(sample) {
  const url = `${BASE}/leistungen/${SERVICE}/${sample.city}/`;
  const expect = EXPECTATIONS[SERVICE];
  console.log(`\n=== ${sample.city} (${sample.tier}, ${sample.distanceKm}km) ===`);

  let html;
  try { html = await fetchPage(url); }
  catch (e) { fail(sample.city, "fetch", e.message); return; }

  const dom = new JSDOM(html);
  const { document } = dom.window;

  // === H1 ===
  const h1s = document.querySelectorAll("h1");
  if (h1s.length === 1) pass(sample.city, "h1-single");
  else fail(sample.city, "h1-single", `found ${h1s.length}`);

  // === H2 count ===
  const h2s = document.querySelectorAll("h2");
  if (h2s.length >= expect.minH2) pass(sample.city, `h2-count>=${expect.minH2}`);
  else fail(sample.city, `h2-count>=${expect.minH2}`, `got ${h2s.length}`);

  // === H3 count ===
  const h3s = document.querySelectorAll("h3");
  if (h3s.length >= expect.minH3) pass(sample.city, `h3-count>=${expect.minH3}`);
  else fail(sample.city, `h3-count>=${expect.minH3}`, `got ${h3s.length}`);

  // === Required headings (substring match — robust to {city.displayName} interpolation) ===
  const allHeadingText = [...document.querySelectorAll("h1, h2, h3")]
    .map((h) => h.textContent.trim()).join(" || ");
  for (const required of expect.requiredHeadings) {
    if (allHeadingText.includes(required)) pass(sample.city, `heading:${required}`);
    else fail(sample.city, `heading:${required}`, "not found");
  }

  // === Title length ===
  const title = document.querySelector("title")?.textContent || "";
  if (title.length <= 65) pass(sample.city, `title-len<=65`);
  else warn(sample.city, `title-len<=65`, `${title.length} chars: ${title.slice(0, 60)}…`);

  // === Schema.org types ===
  const schemas = getSchemaObjects(document);
  const types = new Set(schemas.map((s) => s["@type"]).filter(Boolean));
  for (const required of expect.requiredSchemas) {
    if (types.has(required)) pass(sample.city, `schema:${required}`);
    else fail(sample.city, `schema:${required}`, `types found: ${[...types].join(",")}`);
  }

  // === Visible text checks (NOT Schema.org) ===
  const visible = visibleText(document);

  // City name appears in visible text
  // (URL is slug; display name may have umlauts — use partial match)
  const displayCity = sample.city.replace(/-/g, " ");
  if (visible.toLowerCase().includes(displayCity.toLowerCase().split(" ")[0])) {
    pass(sample.city, "city-in-visible");
  } else {
    warn(sample.city, "city-in-visible", "city name not found in visible text");
  }

  // No "0 km" bare phrase in visible text (would mean distancePhrase guard failed)
  // Match: " 0 km" or "(0 km" or similar isolated zero
  const zeroKmMatches = visible.match(/(^|[^0-9])0\s*km/g) || [];
  if (zeroKmMatches.length === 0) pass(sample.city, "no-bare-0km");
  else fail(sample.city, "no-bare-0km", `${zeroKmMatches.length} instances`);

  // === Neighbors check (scoped to "Weitere Einsatzorte" section only) ===
  // Find the H3 with "Weitere Einsatzorte" and check its parent section
  const einsatzorteH3 = [...document.querySelectorAll("h3")]
    .find((h) => h.textContent.includes("Weitere Einsatzorte"));
  if (einsatzorteH3) {
    const section = einsatzorteH3.closest("section") || einsatzorteH3.parentElement;
    const neighborLinks = section
      ? [...section.querySelectorAll(`a[href*="/leistungen/${SERVICE}/"]`)]
      : [];
    const neighborCount = neighborLinks.length;
    if (neighborCount >= 1 && neighborCount <= 9) {
      pass(sample.city, `neighbors-count(1-9)=${neighborCount}`);
    } else if (neighborCount > 9) {
      warn(sample.city, `neighbors-count`, `${neighborCount} > 9 (cap broken?)`);
    } else {
      fail(sample.city, `neighbors-count`, `${neighborCount} (no neighbors rendered)`);
    }
  } else {
    fail(sample.city, "neighbors-section", "Weitere Einsatzorte section missing");
  }

  // === Plausible analytics present ===
  const plausibleScript = document.querySelector('script[src*="plausible.io"]');
  if (plausibleScript) pass(sample.city, "plausible-loaded");
  else warn(sample.city, "plausible-loaded", "script tag missing");
}

// === Run ===
console.log(`🐤 Canary verification: ${SERVICE} on ${SAMPLES.length} cities`);

for (const sample of SAMPLES) {
  await verifyPage(sample);
}

// === Report ===
console.log("\n=== Summary ===");
const fails = results.filter((r) => r.status === "FAIL");
const warns = results.filter((r) => r.status === "WARN");
const passes = results.filter((r) => r.status === "PASS");

console.log(`✅ PASS: ${passes.length}`);
console.log(`⚠️  WARN: ${warns.length}`);
console.log(`❌ FAIL: ${fails.length}`);

if (warns.length) {
  console.log("\n--- Warnings ---");
  for (const w of warns) console.log(`  [${w.city}] ${w.check}: ${w.msg}`);
}

if (fails.length) {
  console.log("\n--- Failures ---");
  for (const f of fails) console.log(`  [${f.city}] ${f.check}: ${f.msg}`);
  console.log("\n🚨 CANARY FAILED — consider rollback");
  process.exit(1);
}

console.log("\n✅ Canary PASSED — deploy is healthy");
process.exit(0);
