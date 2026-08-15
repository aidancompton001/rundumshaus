/**
 * Перенос макета в шапку и герой (F-83, F-80, F-87).
 *
 * Проверяется то, что нельзя увидеть замером в браузере на статике: признак
 * текущего пункта меню появляется после гидратации, поэтому его наличие
 * доказывается здесь, а геометрия и контраст — замерами в отчёте.
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

vi.mock("lenis", () => ({
  default: vi.fn(() => ({ on: vi.fn(), raf: vi.fn(), destroy: vi.fn() })),
}));

import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import homepageData from "@/data/homepage.json";
import siteData from "@/data/site.json";

describe("Navbar — макет (F-87)", () => {
  it("текущий пункт меню помечен aria-current и подчёркнут", () => {
    // jsdom открыт на "/" — текущий пункт «Startseite»
    render(<Navbar />);
    const current = screen.getByRole("link", { name: "Startseite" });
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current.className).toContain("border-copper");

    const other = screen.getByRole("link", { name: "Leistungen" });
    expect(other).not.toHaveAttribute("aria-current");
    expect(other.className).toContain("border-transparent");
  });

  it("в шапке стоит плашка с номером телефона, а не одна иконка", () => {
    render(<Navbar />);
    const phone = (siteData as { phone: string }).phone;
    const plate = screen.getAllByText(phone)[0];
    expect(plate.tagName).toBe("STRONG");
    // номер не спрятан ни на одной ширине: класса hidden у него нет
    expect(plate.className).not.toContain("hidden");
    // подпись остаётся в доступном имени и на узких ширинах
    expect(screen.getByText("Jetzt per WhatsApp").className).toContain("sr-only");
  });
});

describe("Hero — макет (F-83, F-80)", () => {
  it("каждая кнопка героя несёт стрелку, обводку 2px или заливку и вид макета", () => {
    const { container } = render(<Hero />);
    const buttons = [...container.querySelectorAll("a")].filter(
      (a) => a.querySelector("strong") !== null,
    );
    // WhatsApp из макета + кнопки клиента из homepage.json
    const ctas = (homepageData as { hero: { ctas: unknown[] } }).hero.ctas;
    expect(buttons.length).toBe(1 + ctas.length);
    for (const b of buttons) {
      expect(b.className).toContain("rounded-[10px]");
      expect(b.className).toContain("px-[1.4rem]");
      expect(b.querySelector("svg path[d='M5 12h14m-6-6 6 6-6 6']")).not.toBeNull();
    }
  });

  it("вторая строка кнопки «Unsere Leistungen» взята из макета", () => {
    render(<Hero />);
    expect(screen.getByText("entdecken")).toBeInTheDocument();
    expect(screen.getByText("schnell anfragen")).toBeInTheDocument();
  });

  it("акцентная строка H1 окрашена цветом, читаемым на тёмном кадре", () => {
    const { container } = render(<Hero />);
    const h1 = container.querySelector("h1")!;
    const accent = [...h1.querySelectorAll("span")].find((s) =>
      s.textContent!.includes("Osnabrück"),
    )!;
    // #ACBE8C = color-mix(in srgb, --color-copper 50%, --color-white);
    // худший пиксель фона даёт 3,48:1 при пороге крупного текста 3:1
    expect(accent).toHaveStyle({ color: "rgb(172, 190, 140)" });
    expect(h1.className).toContain("font-black");
  });
});
