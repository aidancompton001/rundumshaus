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

  it("renders SVG icons for every service card", () => {
    const { container } = render(<ServiceOverview />);
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThanOrEqual(5);
    // PX-068 A0: emoji-in-text check removed — descriptions are CMS-editable
    // and Kevin may legitimately paste emoji. The SVG-icons assertion above
    // still guards the original design regression (icons, not emoji icons).
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
