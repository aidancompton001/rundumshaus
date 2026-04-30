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
import {
  WrenchIcon,
  LeafIcon,
  RoofIcon,
  BoxArrowIcon,
  RecycleIcon,
  DefaultIcon,
  serviceIconMap,
} from "@/components/ServiceIcons";

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

  it("renders all 5 service titles", () => {
    render(<ServiceOverview />);
    expect(screen.getByText("Hausmeisterservice")).toBeInTheDocument();
    expect(screen.getByText("Gartenpflege")).toBeInTheDocument();
    expect(screen.getByText("Dacharbeiten")).toBeInTheDocument();
    expect(screen.getByText("Entrümpelung")).toBeInTheDocument();
    expect(screen.getByText("Schrottabholung")).toBeInTheDocument();
  });

  it("renders SVG icons instead of emoji", () => {
    const { container } = render(<ServiceOverview />);
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThanOrEqual(5);
    // No emoji text nodes
    const emojiPattern = /[\u{1F300}-\u{1F9FF}]|[♻️]/u;
    const allText = container.textContent || "";
    expect(allText).not.toMatch(emojiPattern);
  });
});

describe("ServiceDetail", () => {
  it("renders all 5 service detail descriptions", () => {
    render(<ServiceDetail />);
    expect(screen.getByText(/Ob Reparaturen, Wartungsarbeiten/)).toBeInTheDocument();
    expect(screen.getByText(/Als zuverlässiger Gärtner in Osnabrück/)).toBeInTheDocument();
    expect(screen.getByText(/Moos, Laub und Verschmutzungen/)).toBeInTheDocument();
    expect(screen.getByText(/Als Entrümpelungsfirma in Osnabrück/)).toBeInTheDocument();
    expect(screen.getByText(/Wir holen Ihren Altmetallschrott/)).toBeInTheDocument();
  });

  it("cards use solid bg, not transparent glassmorphism (bug fix)", () => {
    const { container } = render(<ServiceDetail />);
    // Service cards have group + relative + rounded-2xl + bg-cream-dark — distinguish from FAQ section bg
    const cards = container.querySelectorAll(
      ".group.relative[class*='rounded-2xl'][class*='bg-cream-dark']"
    );
    expect(cards.length).toBe(5);
    // No card should have backdrop-blur (invisible on light bg)
    cards.forEach((card) => {
      expect(card.className).not.toContain("backdrop-blur");
      // Should have solid bg (no /30 opacity)
      expect(card.className).toContain("bg-cream-dark");
      expect(card.className).not.toContain("bg-cream-dark/");
    });
  });

  it("cards have visible border (solid, not transparent)", () => {
    const { container } = render(<ServiceDetail />);
    // Same precise selector as above — exclude FAQ accordion items
    const cards = container.querySelectorAll(
      ".group.relative[class*='rounded-2xl'][class*='border-sand']"
    );
    expect(cards.length).toBe(5);
    cards.forEach((card) => {
      expect(card.className).toContain("shadow-md");
    });
  });
});

describe("AboutSection", () => {
  it("renders Über uns heading", () => {
    render(<AboutSection />);
    expect(screen.getByText("Über uns")).toBeInTheDocument();
  });

  it("renders about body text", () => {
    render(<AboutSection />);
    expect(screen.getByText(/Zuverlässigkeit, Sauberkeit/)).toBeInTheDocument();
  });

  it("renders 3 stat labels", () => {
    render(<AboutSection />);
    expect(screen.getByText("Kundenzufriedenheit")).toBeInTheDocument();
    expect(screen.getByText("Leistungsbereiche")).toBeInTheDocument();
    expect(screen.getByText("Schnelle Reaktionszeit")).toBeInTheDocument();
  });
});
