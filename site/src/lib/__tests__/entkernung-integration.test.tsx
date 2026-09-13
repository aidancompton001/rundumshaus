// T012 Ф5: Entkernung встроена в сайт — страницы, метаданные, ссылки в обе стороны, форма.
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { CITIES, getAllPagePairs, isNoindexPair } from "@/lib/programmatic";
import { generateMetadata } from "@/app/leistungen/[service]/[city]/page";
import ContactForm from "@/components/sections/ContactForm";
import entkernung from "@/data/templates/entkernung-abbrucharbeiten.json";
import hausmeister from "@/data/templates/hausmeisterservice.json";
import garten from "@/data/templates/gartenpflege.json";
import dach from "@/data/templates/dacharbeiten.json";
import entruempelung from "@/data/templates/entruempelung.json";
import galabau from "@/data/templates/garten-landschaftsbau.json";

const NEW = "entkernung-abbrucharbeiten";
const OLD: Record<string, { weitereLeistungen: { links: { servicePath: string }[] } }> = {
  hausmeisterservice: hausmeister,
  gartenpflege: garten,
  dacharbeiten: dach,
  entruempelung,
  "garten-landschaftsbau": galabau,
};

describe("T012 Entkernung — Integration", () => {
  it("маршрут строит страницу услуги для каждого из 98 городов", () => {
    const pairs = getAllPagePairs().filter((p) => p.service === NEW);
    expect(pairs).toHaveLength(98);
    expect(new Set(pairs.map((p) => p.city))).toEqual(new Set(CITIES.map((c) => c.slug)));
  });

  it("метаданные: canonical на адрес страницы, без noindex, title и description из шаблона мета", async () => {
    for (const city of ["osnabrueck", "nordhorn"]) {
      const meta = await generateMetadata({ params: Promise.resolve({ service: NEW, city }) });
      expect(JSON.stringify(meta.alternates ?? {})).toContain(`/leistungen/${NEW}/${city}`);
      expect(meta.robots).toBeUndefined();
      expect(isNoindexPair(NEW, city)).toBe(false);
    }
    const osn = await generateMetadata({ params: Promise.resolve({ service: NEW, city: "osnabrueck" }) });
    expect(String(osn.title)).toBe("Entkernung & Abbrucharbeiten Osnabrück | Rund ums Haus Littawe");
    expect(osn.description).toMatch(/^Entkernung & Abbrucharbeiten in Osnabrück\. Rückbau von Estrich/);
  });

  it("weitereLeistungen: 5 прежних услуг ссылаются на Entkernung, Entkernung — на все 5", () => {
    for (const [id, tpl] of Object.entries(OLD)) {
      expect(tpl.weitereLeistungen.links.map((l) => l.servicePath), id).toContain(NEW);
    }
    expect(entkernung.weitereLeistungen.links.map((l) => l.servicePath).sort()).toEqual(Object.keys(OLD).sort());
  });

  it("форма Kontakt: 6 услуг + «Sonstiges», Entkernung среди вариантов", () => {
    const { container } = render(<ContactForm />);
    const selects = Array.from(container.querySelectorAll("select")).filter((s) =>
      Array.from(s.options).some((o) => o.value === "Sonstiges"),
    );
    expect(selects).toHaveLength(1);
    const values = Array.from(selects[0].options).map((o) => o.value).filter(Boolean);
    expect(values).toContain("Entkernung & Abbrucharbeiten");
    expect(values).toHaveLength(7);
  });
});
