#!/usr/bin/env node
/**
 * PX-068 V — CMS config validator. Wired as npm "pretest" → runs in CI
 * (ci.yml + deploy.yml both call `npm run test`) and locally. Guards:
 *
 *  G1  anti-field-drop: every key present in a target JSON must be DECLARED
 *      in the collection fields — otherwise a CMS save could silently drop it.
 *  G2  supply-chain: admin/index.html must pin an exact @sveltia/cms version.
 *  G6  service meta patterns: must contain {city} when non-empty; warn when
 *      title pattern + longest city displayName exceeds 70 chars.
 *  +   collection file paths exist; media_folder exists; config parses.
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { parse as parseYaml } from "yaml";

const SITE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const REPO_ROOT = path.resolve(SITE_ROOT, "..");

let errors = 0;
const fail = (msg) => { console.error(`✗ ${msg}`); errors++; };
const ok = (msg) => console.log(`✓ ${msg}`);

/* ── G2: pinned version ─────────────────────────────────────── */
const adminHtml = readFileSync(path.join(SITE_ROOT, "public/admin/index.html"), "utf8");
if (/@sveltia\/cms@\d+\.\d+\.\d+\//.test(adminHtml)) ok("Sveltia version is pinned");
else fail("admin/index.html: @sveltia/cms version is NOT pinned to exact x.y.z");

/* ── config parses ──────────────────────────────────────────── */
const config = parseYaml(readFileSync(path.join(SITE_ROOT, "public/admin/config.yml"), "utf8"));
ok("config.yml parses");

/* ── media folder ───────────────────────────────────────────── */
const mediaDir = path.join(REPO_ROOT, config.media_folder);
if (existsSync(mediaDir)) ok(`media_folder exists (${config.media_folder})`);
else fail(`media_folder missing: ${config.media_folder}`);

/* ── G1: field coverage per file-collection ─────────────────── */
function declaredPaths(fields, prefix, out) {
  for (const f of fields ?? []) {
    const p = prefix ? `${prefix}.${f.name}` : f.name;
    out.add(p);
    if (f.fields) declaredPaths(f.fields, p, out);
  }
  return out;
}
function actualPaths(value, prefix, out) {
  if (Array.isArray(value)) {
    for (const item of value) actualPaths(item, prefix, out);
  } else if (value && typeof value === "object") {
    for (const key of Object.keys(value)) {
      const p = prefix ? `${prefix}.${key}` : key;
      out.add(p);
      actualPaths(value[key], p, out);
    }
  }
  return out;
}

for (const coll of config.collections ?? []) {
  for (const file of coll.files ?? []) {
    const target = path.join(REPO_ROOT, file.file);
    if (!existsSync(target)) { fail(`${coll.name}/${file.name}: file missing ${file.file}`); continue; }
    const json = JSON.parse(readFileSync(target, "utf8"));
    const declared = declaredPaths(file.fields, "", new Set());
    const actual = actualPaths(json, "", new Set());
    const undeclared = [...actual].filter((p) => !declared.has(p));
    if (undeclared.length) {
      fail(`${file.file}: keys NOT declared in CMS config (would be dropped on save): ${undeclared.join(", ")}`);
    } else {
      ok(`${file.file}: all ${actual.size} key-paths declared (anti-field-drop)`);
    }
  }
}

/* ── PX-069+: city-template cross-links must point to EXISTING pages ──
   Learned from the Kevin/Eduard race on 2026-06-10: a CMS save produced a
   chip linking to /leistungen/gartenpflege/ (no such page → 404).
   Rule: isHub:true → servicePath must be a real hub page;
         otherwise   → servicePath must be one of the 5 service ids. */
const SERVICE_IDS = ["gartenpflege", "hausmeisterservice", "dacharbeiten", "entruempelung", "garten-landschaftsbau"];
const HUB_PATHS = ["objektpflege", "rasen-neuanlage"];
for (const svc of SERVICE_IDS) {
  const tpl = JSON.parse(readFileSync(path.join(SITE_ROOT, `src/data/templates/${svc}.json`), "utf8"));
  for (const link of tpl.weitereLeistungen?.links ?? []) {
    if (link.isHub) {
      if (!HUB_PATHS.includes(link.servicePath))
        fail(`templates/${svc}.json link "${link.label}": isHub=true but /leistungen/${link.servicePath}/ is not an existing hub page (404!)`);
    } else if (!SERVICE_IDS.includes(link.servicePath)) {
      fail(`templates/${svc}.json link "${link.label}": servicePath "${link.servicePath}" is not a known service (404!)`);
    }
  }
}
ok("city-template cross-links point to existing pages");

/* ── G6: meta-overrides patterns ────────────────────────────── */
const meta = JSON.parse(readFileSync(path.join(SITE_ROOT, "src/data/meta-overrides.json"), "utf8"));
const cities = JSON.parse(readFileSync(path.join(SITE_ROOT, "src/data/cities.json"), "utf8")).cities;
const longestCity = cities.reduce((a, c) => (c.displayName.length > a.length ? c.displayName : a), "");
for (const s of meta.services ?? []) {
  for (const key of ["titlePattern", "descriptionPattern"]) {
    const p = (s[key] ?? "").trim();
    if (!p) continue;
    if (!p.includes("{city}")) fail(`meta-overrides ${s.id}.${key}: missing required {city} placeholder`);
    if (key === "titlePattern") {
      const worst = p.split("{city}").join(longestCity).length;
      if (worst > 70) console.warn(`⚠ ${s.id}.titlePattern: with longest city "${longestCity}" → ${worst} chars (>70, Google truncates)`);
    }
  }
}
ok(`meta-overrides patterns checked (longest city: "${longestCity}", ${longestCity.length} chars)`);

if (errors) { console.error(`\nCMS config validation FAILED (${errors})`); process.exit(1); }
console.log("\n✓ CMS config validation passed");
