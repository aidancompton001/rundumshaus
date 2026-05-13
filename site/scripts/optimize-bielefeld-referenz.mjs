/**
 * One-shot: optimize Bielefeld Vorgartenpflege Referenz photos.
 * Source: c:/Projects/RundUmsHaus/img/referenzen-real/
 * Target: site/public/images/referenzen/bielefeld-vorgarten/
 *
 * Generates WebP + JPG fallback at 800w (Referenzen card aspect 4:3).
 */
import { readdir, mkdir, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = "c:/Projects/RundUmsHaus/img/referenzen-real";
const DST = join(__dirname, "..", "public", "images", "referenzen", "bielefeld-vorgarten");

// Mapping: source filename → semantic destination name
const MAPPING = [
  { src: "WhatsApp Image 2026-05-13 at 17.52.039.jpeg", dst: "vorher-uebersicht", role: "VORHER" },
  { src: "WhatsApp Image 2026-05-13 at 17.52.094.jpeg", dst: "vorher-detail", role: "VORHER detail" },
  { src: "WhatsApp Image 2026-05-13 at 17.52.09.jpeg", dst: "prozess-1-ausgraben", role: "PROZESS" },
  { src: "WhatsApp Image 2026-05-13 at 17.52.091.jpeg", dst: "prozess-2-wurzeln", role: "PROZESS" },
  { src: "WhatsApp Image 2026-05-13 at 3.jpeg", dst: "prozess-3-jaeten", role: "PROZESS" },
  { src: "WhatsApp Image 2026-05-13 at 17.52.150.jpeg", dst: "prozess-4-anhaenger", role: "PROZESS — Entsorgung" },
  { src: "WhatsApp Image 2026-05-13 at 17.52.160.jpeg", dst: "prozess-5-detail", role: "PROZESS detail" },
  { src: "WhatsApp Image 2026-05-13 at 7.jpeg", dst: "nachher-uebersicht", role: "NACHHER" },
  { src: "WhatsApp Image 2026-05-13 at 17.52.10.jpeg", dst: "nachher-pflaster", role: "NACHHER detail" },
  { src: "WhatsApp Image 2026-05-13 at 17.52.11.jpeg", dst: "nachher-detail", role: "NACHHER closeup" },
];

const WIDTHS = [400, 800, 1200];
const WEBP_Q = 80;
const JPG_Q = 82;

async function main() {
  if (!existsSync(DST)) {
    await mkdir(DST, { recursive: true });
    console.log(`mkdir ${DST}`);
  }

  for (const m of MAPPING) {
    const srcPath = join(SRC, m.src);
    if (!existsSync(srcPath)) {
      console.error(`MISSING: ${srcPath}`);
      continue;
    }
    const meta = await sharp(srcPath).metadata();
    console.log(`\n[${m.role}] ${m.src}  (${meta.width}x${meta.height})`);

    // Generate WebP × 3 widths
    for (const w of WIDTHS) {
      const out = join(DST, `${m.dst}-${w}.webp`);
      await sharp(srcPath).rotate().resize({ width: w }).webp({ quality: WEBP_Q }).toFile(out);
      const size = (await sharp(out).metadata()).size;
      console.log(`  -> ${m.dst}-${w}.webp`);
    }
    // Generate JPG fallback at 800w (used in <img> src)
    const jpgOut = join(DST, `${m.dst}-800.jpg`);
    await sharp(srcPath).rotate().resize({ width: 800 }).jpeg({ quality: JPG_Q }).toFile(jpgOut);
    console.log(`  -> ${m.dst}-800.jpg (fallback)`);
  }
  console.log(`\n✓ Done. ${MAPPING.length} sources × 4 outputs = ${MAPPING.length * 4} files in ${DST}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
