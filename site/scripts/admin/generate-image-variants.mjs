#!/usr/bin/env node
/**
 * PX-068 A+ — auto-generate responsive webp variants for CMS-managed images.
 * Fixes Design Review E3: a Kevin upload via /admin/ has no -400w/-800w/-1200w
 * variants → broken <picture> srcset; an overwrite leaves STALE variants.
 *
 * Managed set = images referenced from homepage.json (about.image) and
 * services.json (image, detailImage). For each source we (re)generate:
 *   <name>-400w.webp, <name>-800w.webp, <name>-1200w.webp, <name>.webp
 * Always regenerated (idempotent, ~7 small images) → overwrites can't go stale.
 *
 * Wired as npm "prebuild" → runs automatically in CI (deploy.yml/ci.yml call
 * `npm run build`) and locally. No workflow edits needed.
 *
 * Modes:
 *   --write (default)  generate variants
 *   --check            exit 1 if any source missing or any variant absent/stale
 */
import { readFileSync, existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const SITE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const PUBLIC = path.join(SITE_ROOT, "public");
const WIDTHS = [400, 800, 1200];
const CHECK = process.argv.includes("--check");

const homepage = JSON.parse(readFileSync(path.join(SITE_ROOT, "src/data/homepage.json"), "utf8"));
const servicesData = JSON.parse(readFileSync(path.join(SITE_ROOT, "src/data/services.json"), "utf8"));

const managed = new Set();
if (homepage?.about?.image) managed.add(homepage.about.image);
for (const s of servicesData?.services ?? []) {
  if (s.image) managed.add(s.image);
  if (s.detailImage) managed.add(s.detailImage);
}

const stripExt = (p) => p.replace(/\.(png|jpe?g|webp)$/i, "");

let failures = 0;
let generated = 0;

for (const webPath of managed) {
  const src = path.join(PUBLIC, webPath);
  if (!existsSync(src)) {
    console.error(`✗ source missing: ${webPath}`);
    failures++;
    continue;
  }
  const base = stripExt(src);
  const srcMtime = statSync(src).mtimeMs;
  const targets = [
    ...WIDTHS.map((w) => ({ out: `${base}-${w}w.webp`, width: w })),
    // plain .webp fallback used by toWebp(); skip if source already .webp
    ...(/\.webp$/i.test(src) ? [] : [{ out: `${base}.webp`, width: null }]),
  ];

  for (const t of targets) {
    const fresh = existsSync(t.out) && statSync(t.out).mtimeMs >= srcMtime;
    if (CHECK) {
      if (!fresh) {
        console.error(`✗ stale/missing variant: ${path.relative(PUBLIC, t.out)}`);
        failures++;
      }
      continue;
    }
    let pipe = sharp(src);
    if (t.width) pipe = pipe.resize({ width: t.width, withoutEnlargement: true });
    await pipe.webp({ quality: 82 }).toFile(t.out);
    generated++;
  }
}

if (CHECK) {
  if (failures) {
    console.error(`\nimage-variants check FAILED (${failures} problems)`);
    process.exit(1);
  }
  console.log(`✓ image-variants check OK (${managed.size} managed images)`);
} else {
  if (failures) {
    console.error(`\ngenerate finished with ${failures} missing sources`);
    process.exit(1);
  }
  console.log(`✓ generated ${generated} variants for ${managed.size} managed images`);
}
