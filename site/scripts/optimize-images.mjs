#!/usr/bin/env node
/**
 * Image optimization script — generates WebP + responsive variants.
 * Safe: NEVER overwrites originals. Only adds .webp files next to them.
 *
 * Usage: node scripts/optimize-images.mjs
 */
import { readdir, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, extname, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = join(__dirname, "..", "public", "images");

// Images that are above the fold — get responsive variants (400/800/1200w)
const RESPONSIVE = [
  "about.png",
  "hero/hero-bg.png",
  "services/hausmeisterservice.png",
  "services/gartenpflege.png",
  "services/dacharbeiten.jpg",
  "services/entruempelung.jpg",
  "services/schrottabholung.png",
];

// Large detail images — resize to max 1600w and convert to webp
const RESIZE_1600 = [
  "services/detail-garten.png",
  "services/detail-hausmeister.png",
  "services/detail-dach.png",
  "services/detail-schrott.png",
  "services/detail-entruempelung.png",
  "referenzen/garten-vorher-nachher.png",
  "referenzen/dach-vorher-nachher.png",
  "referenzen/entruempelung-vorher-nachher.png",
  "kontakt/contact-bg.png",
];

const WEBP_QUALITY = 80;
const WIDTHS = [400, 800, 1200];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

function relPath(abs) {
  const normAbs = abs.replace(/\\/g, "/");
  const normDir = IMAGES_DIR.replace(/\\/g, "/");
  const prefix = normDir.endsWith("/") ? normDir : normDir + "/";
  return normAbs.startsWith(prefix) ? normAbs.slice(prefix.length) : normAbs;
}

function isResponsive(rel) {
  return RESPONSIVE.includes(rel);
}

function isResize1600(rel) {
  return RESIZE_1600.includes(rel);
}

async function sizeOf(path) {
  const s = await stat(path);
  return s.size;
}

function kb(bytes) {
  return Math.round(bytes / 1024);
}

async function processFile(absPath) {
  const ext = extname(absPath).toLowerCase();
  if (![".png", ".jpg", ".jpeg"].includes(ext)) return;

  const rel = relPath(absPath);
  const baseNoExt = absPath.slice(0, absPath.length - ext.length);
  const originalSize = await sizeOf(absPath);

  console.log(`\n→ ${rel} (${kb(originalSize)} KB)`);

  // 1) Always produce full-res .webp
  const webpPath = `${baseNoExt}.webp`;
  if (!existsSync(webpPath)) {
    const img = sharp(absPath);
    const meta = await img.metadata();
    const shouldResize = isResize1600(rel) && meta.width && meta.width > 1600;
    if (shouldResize) {
      await img.resize({ width: 1600, withoutEnlargement: true }).webp({ quality: WEBP_QUALITY }).toFile(webpPath);
    } else {
      await img.webp({ quality: WEBP_QUALITY }).toFile(webpPath);
    }
    const newSize = await sizeOf(webpPath);
    console.log(`   ✓ ${basename(webpPath)} (${kb(newSize)} KB, -${Math.round((1 - newSize / originalSize) * 100)}%)`);
  } else {
    console.log(`   ↩ ${basename(webpPath)} already exists, skipping`);
  }

  // 2) Responsive variants for above-the-fold images
  if (isResponsive(rel)) {
    for (const w of WIDTHS) {
      const variantPath = `${baseNoExt}-${w}w.webp`;
      if (existsSync(variantPath)) {
        console.log(`   ↩ ${basename(variantPath)} exists, skipping`);
        continue;
      }
      const img = sharp(absPath);
      const meta = await img.metadata();
      if (meta.width && meta.width < w) {
        console.log(`   · skip ${w}w (original is ${meta.width}w)`);
        continue;
      }
      await img.resize({ width: w, withoutEnlargement: true }).webp({ quality: WEBP_QUALITY }).toFile(variantPath);
      const s = await sizeOf(variantPath);
      console.log(`   ✓ ${basename(variantPath)} (${kb(s)} KB)`);
    }
  }
}

async function generateOgJpg() {
  const ogPng = join(IMAGES_DIR, "og-image.png");
  const ogJpg = join(IMAGES_DIR, "og-image.jpg");
  if (!existsSync(ogPng)) {
    console.log("\n⚠  og-image.png not found, skipping JPG version");
    return;
  }
  if (existsSync(ogJpg)) {
    console.log("\n↩ og-image.jpg already exists");
    return;
  }
  console.log("\n→ og-image.png → og-image.jpg (social sharing optimization)");
  await sharp(ogPng).resize({ width: 1200, height: 630, fit: "cover" }).jpeg({ quality: 85, mozjpeg: true }).toFile(ogJpg);
  const s = await sizeOf(ogJpg);
  console.log(`   ✓ og-image.jpg (${kb(s)} KB)`);
}

async function main() {
  console.log("=== Image optimization ===");
  console.log(`Images dir: ${IMAGES_DIR}`);
  const files = await walk(IMAGES_DIR);
  const targets = files.filter((f) => [".png", ".jpg", ".jpeg"].includes(extname(f).toLowerCase()));
  console.log(`Found ${targets.length} PNG/JPG files`);
  for (const f of targets) {
    try {
      await processFile(f);
    } catch (e) {
      console.error(`   ✗ Error on ${relPath(f)}: ${e.message}`);
    }
  }
  await generateOgJpg();
  console.log("\n=== Done ===");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
