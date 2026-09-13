// T012 Ф3: Entkernung & Abbrucharbeiten — текст Кевина дословно на Osnabrück,
// разметка «Osnabrück» на остальных 97 городах (docs/tasks/T012_*.md).
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render } from "@testing-library/react";
import {
  CITIES,
  CITY_PAGE_SERVICE_IDS,
  getAllOtherCities,
  getCityBySlug,
  getGeoNeighbors,
  getNeighborCities,
} from "@/lib/programmatic";
import {
  getEntkernungContent,
  getEntkernungFaqs,
  getEntkernungFirmaItems,
} from "@/lib/template-content-entkernung";
import EntkernungCityTemplate from "@/components/templates/EntkernungCityTemplate";

const KEVIN = readFileSync(
  join(process.cwd(), "..", "docs", "kevin-entkernung-text-2026-09-13.txt"),
  "utf8",
)
  .split(/\r?\n/)
  .map((l) => l.trim());
/** Строка текста Кевина по номеру (1-based, как в разметке roadmap). */
const line = (n: number) => KEVIN[n - 1];
const norm = (s: string) => s.replace(/\s+/g, " ").trim();

const city = (slug: string) => {
  const c = getCityBySlug(slug);
  if (!c) throw new Error(slug);
  return c;
};

function renderCity(slug: string): string {
  const c = city(slug);
  const { container } = render(
    <EntkernungCityTemplate city={c} neighbors={getNeighborCities(c)} allOtherCities={getAllOtherCities(c)} />,
  );
  return norm(container.textContent ?? "");
}

describe("T012 Entkernung — Stadtseiten", () => {
  it("city pages exist for Entkernung", () => {
    expect(CITY_PAGE_SERVICE_IDS).toContain("entkernung-abbrucharbeiten");
  });

  it("getGeoNeighbors: Nachbarn aus cities.json, ohne Osnabrück und ohne die Stadt selbst", () => {
    expect(getGeoNeighbors(city("nordhorn"), 7).map((c) => c.displayName)).toEqual([
      "Twist",
      "Meppen",
      "Wietmarschen",
    ]);
    for (const c of CITIES) {
      const n = getGeoNeighbors(c, 7);
      expect(n.length).toBeLessThanOrEqual(7);
      expect(n.map((x) => x.slug)).not.toContain("osnabrueck");
      expect(n.map((x) => x.slug)).not.toContain(c.slug);
      if (c.slug !== "osnabrueck") expect(n.length, c.slug).toBeGreaterThanOrEqual(3);
    }
  });

  it("Osnabrück: Meta-Description und H1 dosl. aus dem Text", () => {
    const c = getEntkernungContent(city("osnabrueck"));
    expect(c.h1).toBe(line(8));
    expect(c.metaDescription).toBe(line(7));
  });

  it("Osnabrück: Liste der Einsatzorte dosl. (Zeilen 128–136)", () => {
    expect(getEntkernungFirmaItems(city("osnabrueck"))).toEqual(KEVIN.slice(127, 136));
  });

  it("Nordhorn: Liste = Stadt + Nachbarn, ohne Osnabrücker Nachbarn", () => {
    expect(getEntkernungFirmaItems(city("nordhorn"))).toEqual([
      "Nordhorn",
      "Twist",
      "Meppen",
      "Wietmarschen",
      line(136),
    ]);
  });

  it("FAQ: 11 Fragen; Osnabrück dosl., Nordhorn mit Nachbarn statt «Osnabrücker Land»", () => {
    const osn = getEntkernungFaqs(city("osnabrueck"));
    expect(osn).toHaveLength(11);
    osn.forEach((f, i) => {
      expect(f.q).toBe(line(164 + i * 2));
      expect(f.a).toBe(line(165 + i * 2));
    });
    const nh = getEntkernungFaqs(city("nordhorn"));
    expect(nh[0].q).toBe("Was kostet die Entkernung einer Wohnung in Nordhorn?");
    expect(nh[9].q).toBe(line(182));
    expect(nh[9].a).toBe(
      "Ja. Neben Osnabrück sind Einsätze auch in Nordhorn, Twist, Meppen, Wietmarschen und nach Absprache in weiteren Orten möglich.",
    );
  });

  it("Osnabrück-Seite enthält jede Zeile 8–185 des Kevin-Textes dosl.", () => {
    const text = renderCity("osnabrueck");
    const missing = KEVIN.slice(7, 185).filter((l) => l && !text.includes(norm(l)));
    expect(missing).toEqual([]);
  });

  it("Nordhorn-Seite: keine Osnabrück-Bindung außer Firmensitz", () => {
    const text = renderCity("nordhorn");
    expect(text).not.toContain("Osnabrücker Land");
    expect(text).not.toMatch(/in\s+Nordhorn\b[^.]{0,80}\btätig/);
    expect(text).toContain(line(126));
    expect(text).toContain(line(161));
    expect(text).toContain("Entkernung & Abbrucharbeiten in Nordhorn");
    expect(text).toContain("Estrich entfernen in Nordhorn");
  });
});
