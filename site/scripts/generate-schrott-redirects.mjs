// PX-077: Schrottabholung → Garten- und Landschaftsbau swap.
// GitHub Pages cannot serve real 301s, so old /leistungen/schrottabholung/*
// URLs get static stub pages with an instant meta-refresh + canonical to the
// replacement URL. Google treats <meta refresh 0> as a redirect signal.
// Run: node scripts/generate-schrott-redirects.mjs  (from site/)

import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const cities = JSON.parse(
  readFileSync(join(root, "src/data/cities.json"), "utf-8"),
).cities;

const stub = (target) => `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<title>Weiterleitung — Rund ums Haus Littawe</title>
<meta http-equiv="refresh" content="0; url=${target}">
<link rel="canonical" href="https://rundumshaus-littawe.de${target}">
<meta name="robots" content="noindex">
</head>
<body>
<p>Diese Seite ist umgezogen: <a href="${target}">rundumshaus-littawe.de${target}</a></p>
</body>
</html>
`;

let n = 0;
const write = (dir, target) => {
  const abs = join(root, "public", dir);
  mkdirSync(abs, { recursive: true });
  writeFileSync(join(abs, "index.html"), stub(target), "utf-8");
  n++;
};

for (const c of cities) {
  write(
    `leistungen/schrottabholung/${c.slug}`,
    `/leistungen/garten-landschaftsbau/${c.slug}/`,
  );
}
write("leistungen/schrottabholung", "/leistungen/");
write("ratgeber/kostenlose-schrottabholung-wie-funktioniert", "/ratgeber/");

console.log(`generated ${n} redirect stubs`);
