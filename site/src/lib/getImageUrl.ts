const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function getImageUrl(path: string): string {
  return `${basePath}${path}`;
}

export function getHref(path: string): string {
  if (path.startsWith("http")) return path;
  if (path.startsWith("/#")) return `${basePath}/${path.slice(1)}`;
  return `${basePath}${path}`;
}
