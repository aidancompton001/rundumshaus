// PX-068 Phase B/C — Kevin-editable Google meta (Title/Description) via CMS.
//
// Contract (Design Review, fallback-first principle):
// - Empty string / missing entry / broken JSON  →  null  →  caller uses the
//   existing code-generated meta. The site can NEVER break from CMS input.
// - Service patterns use the literal placeholder {city}, replaced with the
//   city displayName. A pattern override BYPASSES the tier-based safeTitle
//   length guard (G6 decision: simple semantics; length is linted by
//   scripts/admin/validate-cms-config.mjs against the longest city name).
//
// Pure resolve* functions take data as an argument (unit-testable);
// get* wrappers bind the imported JSON.

import metaOverridesData from "@/data/meta-overrides.json";

export interface PageMetaEntry {
  path: string;
  title?: string;
  description?: string;
}

export interface ServiceMetaEntry {
  id: string;
  titlePattern?: string;
  descriptionPattern?: string;
}

export interface MetaOverridesData {
  pages?: PageMetaEntry[];
  services?: ServiceMetaEntry[];
}

export interface ResolvedMeta {
  title?: string;
  description?: string;
}

function clean(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export function resolvePageMeta(
  data: MetaOverridesData,
  path: string,
): ResolvedMeta | null {
  try {
    const entry = (data.pages ?? []).find((p) => p && p.path === path);
    if (!entry) return null;
    const title = clean(entry.title);
    const description = clean(entry.description);
    return title || description ? { title, description } : null;
  } catch {
    return null;
  }
}

export function resolveServiceMeta(
  data: MetaOverridesData,
  serviceId: string,
  cityDisplayName: string,
): ResolvedMeta | null {
  try {
    const entry = (data.services ?? []).find((s) => s && s.id === serviceId);
    if (!entry) return null;
    const substitute = (pattern: unknown): string | undefined => {
      const p = clean(pattern);
      return p ? p.split("{city}").join(cityDisplayName) : undefined;
    };
    const title = substitute(entry.titlePattern);
    const description = substitute(entry.descriptionPattern);
    return title || description ? { title, description } : null;
  } catch {
    return null;
  }
}

const data = metaOverridesData as MetaOverridesData;

export function getPageMetaOverride(path: string): ResolvedMeta | null {
  return resolvePageMeta(data, path);
}

export function getServiceMetaOverride(
  serviceId: string,
  cityDisplayName: string,
): ResolvedMeta | null {
  return resolveServiceMeta(data, serviceId, cityDisplayName);
}
