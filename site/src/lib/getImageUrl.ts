const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function getImageUrl(path: string): string {
  return `${basePath}${path}`;
}

export function getHref(path: string): string {
  if (path.startsWith("http")) return path;
  if (path.startsWith("/#")) return `${basePath}/${path.slice(1)}`;
  return `${basePath}${path}`;
}

/**
 * Returns the path to the .webp version of an image (same folder, same basename).
 * Does NOT check file existence — relies on optimize-images.mjs having run.
 * Example: "/images/about.png" → "/images/about.webp"
 */
export function toWebp(path: string): string {
  return path.replace(/\.(png|jpe?g)$/i, ".webp");
}

/**
 * Builds a srcSet string for responsive WebP variants.
 * Example: toResponsiveWebpSrcSet("/images/about.png", [400, 800, 1200])
 *       → "/images/about-400w.webp 400w, /images/about-800w.webp 800w, /images/about-1200w.webp 1200w"
 */
export function toResponsiveWebpSrcSet(path: string, widths: number[]): string {
  const withoutExt = path.replace(/\.(png|jpe?g|webp)$/i, "");
  return widths.map((w) => `${basePath}${withoutExt}-${w}w.webp ${w}w`).join(", ");
}
