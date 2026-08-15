import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

vi.mock("motion/react", () => ({
  motion: {
    span: (props: React.HTMLAttributes<HTMLSpanElement> & { children?: React.ReactNode }) => <span {...props} />,
    div: (props: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => <div {...props} />,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock("gsap", () => ({
  default: {
    registerPlugin: vi.fn(), from: vi.fn(() => ({ kill: vi.fn() })),
    to: vi.fn(() => ({ kill: vi.fn() })), set: vi.fn(),
    ticker: { add: vi.fn(), remove: vi.fn(), lagSmoothing: vi.fn() },
  },
  ScrollTrigger: { update: vi.fn() },
}));
vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: { update: vi.fn() } }));
vi.mock("lenis", () => ({
  default: vi.fn().mockImplementation(() => ({ on: vi.fn(), raf: vi.fn(), destroy: vi.fn() })),
}));

import ServiceOverview from "@/components/sections/ServiceOverview";
import ServiceDetail from "@/components/sections/ServiceDetail";
import AboutSection from "@/components/sections/AboutSection";
import WarumWir from "@/components/sections/WarumWir";
import servicesData from "@/data/services.json";
import homepageData from "@/data/homepage.json";
import type { Service } from "@/data/types";
import {
  WrenchIcon,
  LeafIcon,
  RoofIcon,
  BoxArrowIcon,
  RecycleIcon,
  DefaultIcon,
  serviceIconMap,
} from "@/components/ServiceIcons";

// Полупрозрачная подложка Tailwind: bg-<цвет>/<число>, кроме /100 (это непрозрачно).
// Границы (border-ink/10) сюда не попадают — они читаемость текста не ломают.
const TRANSLUCENT_BG = /(^|\s|:)bg-[a-z0-9-]+\/(?!100(\s|$))\d+/;

// Инлайновый фон вида rgba(...,0.6) / hsla / transparent — тот же дефект мимо классов.
function inlineBgIsTranslucent(el: Element): boolean {
  const style = el.getAttribute("style") ?? "";
  const m = style.match(/background(?:-color)?\s*:\s*([^;]+)/i);
  if (!m) return false;
  const value = m[1];
  if (/transparent/i.test(value)) return true;
  const alpha = value.match(/(?:rgba|hsla)\([^)]*?,\s*([0-9.]+)\s*\)/i);
  return alpha ? Number(alpha[1]) < 1 : false;
}

describe("ServiceIcons", () => {
  it("renders all 5 named icons as SVG", () => {
    const icons = [WrenchIcon, LeafIcon, RoofIcon, BoxArrowIcon, RecycleIcon];
    icons.forEach((Icon) => {
      const { container } = render(<Icon className="w-10 h-10" />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
    });
  });

  it("each icon has dual-tone: charcoal base + copper accent groups", () => {
    const icons = [WrenchIcon, LeafIcon, RoofIcon, BoxArrowIcon, RecycleIcon];
    icons.forEach((Icon) => {
      const { container } = render(<Icon />);
      const charcoalGroup = container.querySelector(".text-charcoal");
      const copperGroup = container.querySelector(".text-copper");
      expect(charcoalGroup).toBeInTheDocument();
      expect(copperGroup).toBeInTheDocument();
    });
  });

  it("DefaultIcon renders as SVG fallback", () => {
    const { container } = render(<DefaultIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("serviceIconMap covers all 5 service keys", () => {
    expect(serviceIconMap["wrench"]).toBe(WrenchIcon);
    expect(serviceIconMap["leaf"]).toBe(LeafIcon);
    expect(serviceIconMap["home"]).toBe(RoofIcon);
    expect(serviceIconMap["truck"]).toBe(BoxArrowIcon);
    expect(serviceIconMap["recycle"]).toBe(RecycleIcon);
  });

  it("serviceIconMap returns undefined for unknown key (fallback handled by consumer)", () => {
    expect(serviceIconMap["unknown"]).toBeUndefined();
  });

  it("0 hardcoded hex in SVG output", () => {
    const icons = [WrenchIcon, LeafIcon, RoofIcon, BoxArrowIcon, RecycleIcon];
    icons.forEach((Icon) => {
      const { container } = render(<Icon />);
      const svg = container.querySelector("svg");
      expect(svg?.innerHTML).not.toMatch(/#[0-9a-fA-F]{3,6}/);
    });
  });
});

describe("ServiceOverview", () => {
  it("renders heading from services.json", () => {
    render(<ServiceOverview />);
    expect(screen.getByText("Unsere Leistungen")).toBeInTheDocument();
  });

  // PX-068 A0: titles are CMS-editable — compare against services.json source,
  // not literals (Kevin's edits must not fail the deploy pipeline).
  it("renders all service titles from services.json", () => {
    const { container } = render(<ServiceOverview />);
    const { services } = servicesData as { services: Service[] };
    expect(services.length).toBeGreaterThanOrEqual(5);
    services.forEach((s) => {
      expect(container.textContent).toContain(s.title);
    });
  });

  // Карточка услуги — единственная карточка, пережившая перевёрстку. Исходный
  // дефект: полупрозрачный фон со стеклянным размытием, текст на светлом фоне
  // не читался. Читаемость держат непрозрачная подложка и тень, их и стережём.
  it("карточки услуг: SVG-иконка, непрозрачный фон, тень", () => {
    const { container } = render(<ServiceOverview />);
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThanOrEqual(5);
    // PX-068 A0: emoji-in-text check removed — descriptions are CMS-editable
    // and Kevin may legitimately paste emoji. The SVG-icons assertion above
    // still guards the original design regression (icons, not emoji icons).

    const cards = container.querySelectorAll("article");
    expect(cards.length).toBe(5);
    cards.forEach((card, i) => {
      const cls = card.getAttribute("class") ?? "";
      expect(cls, `card ${i}: непрозрачная подложка`).toMatch(/(^|\s)bg-(white|paper|cream[a-z-]*)(\s|$)/);
      expect(cls, `card ${i}: тень`).toMatch(/(^|\s)shadow-/);
      expect(cls, `card ${i}: без стекла`).not.toMatch(TRANSLUCENT_BG);
      expect(cls, `card ${i}: без размытия`).not.toMatch(/backdrop-blur/);
    });
  });
});

describe("ServiceDetail", () => {
  // PX-068 A0: descriptions are CMS-editable — compare against services.json
  // source so Kevin's edits never break the deploy pipeline.
  it("renders all service detail descriptions from services.json", () => {
    const { container } = render(<ServiceDetail />);
    const { services } = servicesData as { services: Service[] };
    services.forEach((s) => {
      const snippet = s.detailDescription.slice(0, 40);
      expect(container.textContent, `service ${s.id}`).toContain(snippet);
    });
  });

  // Прежние два теста стерегли прозрачные карточки: на светлом фоне текст в них
  // не читался. Карточек на этой странице больше нет — услуги идут блоками
  // «фото + текст». Дефект от этого никуда не делся: стеклянная подложка под
  // текстом убивает читаемость на любой вёрстке. Проверять внешний тег блока
  // бесполезно — фона у него нет вовсе, такой тест не может провалиться.
  // Поэтому проходим КАЖДЫЙ элемент внутри блока, у которого есть свой текст,
  // и запрещаем ему полупрозрачный фон и backdrop-blur — и в классах, и в
  // инлайновом стиле.
  it("рисует пять блоков услуг, непрозрачных и с фото", () => {
    const { container } = render(<ServiceDetail />);
    const blocks = container.querySelectorAll("section[id]");
    expect(blocks.length).toBe(5);
    blocks.forEach((block) => {
      expect(block.querySelector("h2")).toBeTruthy();
      expect(block.querySelector("img")).toBeTruthy();

      const surfaces = [block, ...Array.from(block.querySelectorAll("*"))];
      expect(surfaces.length).toBeGreaterThan(10);
      surfaces.forEach((el) => {
        const cls = el.getAttribute("class") ?? "";
        const where = `${block.id} → <${el.tagName.toLowerCase()} class="${cls}">`;
        expect(cls, `${where}: backdrop-blur`).not.toMatch(/backdrop-blur/);
        expect(cls, `${where}: полупрозрачный фон`).not.toMatch(TRANSLUCENT_BG);
        expect(inlineBgIsTranslucent(el), `${where}: полупрозрачный inline-фон`).toBe(false);
      });
    });
  });

  it("под каждым блоком стоят позиции услуги из файлов клиента", () => {
    const { container } = render(<ServiceDetail />);
    container.querySelectorAll("section[id]").forEach((block) => {
      expect(block.querySelectorAll("li").length).toBeGreaterThanOrEqual(4);
    });
  });
});

describe("Главная: список клиента не задваивается", () => {
  // Восемь пунктов warumWir.items делятся между блоком «О нас» и секцией
  // «Warum»: 4 + 4. Деление живёт в КОДЕ (homepage.json Кевин правит через
  // админку, резать массив там нельзя). Само деление до сих пор ничем не
  // стереглось: убери срез — повтор вернётся молча, все тесты останутся
  // зелёными. Стережём: в «О нас» ровно четыре галочки, и ни один пункт
  // не встречается в двух блоках сразу.
  it("в блоке «О нас» ровно четыре пункта, и они не повторяются в «Warum»", () => {
    const items = homepageData.warumWir.items as string[];
    expect(items.length).toBeGreaterThanOrEqual(8);

    const about = render(<AboutSection />).container.textContent ?? "";
    const inAbout = items.filter((t) => about.includes(t));
    expect(inAbout.length, "в «О нас» должно быть ровно четыре пункта").toBe(4);

    const warum = render(<WarumWir />).container.textContent ?? "";
    const inBoth = inAbout.filter((t) => warum.includes(t));
    expect(inBoth, "эти пункты показаны дважды на одной странице").toEqual([]);
  });
});

describe("AboutSection", () => {
  it("renders Über uns heading", () => {
    render(<AboutSection />);
    expect(screen.getByText("Über uns")).toBeInTheDocument();
  });

  // PX-068 A0: About body is CMS-editable — compare against homepage.json.
  it("renders about body text from homepage.json", () => {
    const { container } = render(<AboutSection />);
    const snippet = homepageData.about.body.slice(0, 40);
    expect(container.textContent).toContain(snippet);
  });

  it("renders 3 stat labels", () => {
    render(<AboutSection />);
    expect(screen.getByText("Kundenzufriedenheit")).toBeInTheDocument();
    expect(screen.getByText("Leistungsbereiche")).toBeInTheDocument();
    expect(screen.getByText("Schnelle Reaktionszeit")).toBeInTheDocument();
  });
});
