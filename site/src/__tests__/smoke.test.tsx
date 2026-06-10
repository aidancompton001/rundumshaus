import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock motion/react
vi.mock("motion/react", () => ({
  motion: {
    span: (props: React.HTMLAttributes<HTMLSpanElement> & { children?: React.ReactNode }) => <span {...props} />,
    div: (props: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => <div {...props} />,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock GSAP + Lenis
vi.mock("gsap", () => ({
  default: {
    registerPlugin: vi.fn(),
    from: vi.fn(() => ({ kill: vi.fn() })),
    to: vi.fn(() => ({ kill: vi.fn() })),
    set: vi.fn(),
    ticker: { add: vi.fn(), remove: vi.fn(), lagSmoothing: vi.fn() },
  },
  ScrollTrigger: { update: vi.fn() },
}));
vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: { update: vi.fn() } }));
vi.mock("gsap/SplitText", () => ({
  SplitText: { create: vi.fn(() => ({ chars: [], words: [], lines: [], revert: vi.fn() })) },
}));
vi.mock("lenis", () => ({
  default: vi.fn().mockImplementation(() => ({ on: vi.fn(), raf: vi.fn(), destroy: vi.fn() })),
}));

import Home from "@/app/page";
import homepageData from "@/data/homepage.json";

// PX-068 A0: content is CMS-editable by Kevin. Tests compare rendered output
// against the JSON SOURCE, never against hardcoded literals — otherwise a
// legitimate CMS edit would fail `npm test` in deploy.yml and silently block
// the deploy (Design Review E2).
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

describe("Homepage", () => {
  it("renders hero heading from homepage.json", () => {
    render(<Home />);
    const heroStart = homepageData.hero.heading.split(" ").slice(0, 3).join(" ");
    const matches = screen.getAllByText(new RegExp(escapeRe(heroStart)));
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it("renders hero subheading from homepage.json", () => {
    render(<Home />);
    const subStart = homepageData.hero.subheading.split(" ").slice(0, 4).join(" ");
    expect(screen.getAllByText(new RegExp(escapeRe(subStart))).length).toBeGreaterThanOrEqual(1);
  });

  it("renders CTA buttons from homepage.json", () => {
    render(<Home />);
    homepageData.hero.ctas.forEach((cta) => {
      const matches = screen.getAllByText(new RegExp(escapeRe(cta.label)));
      expect(matches.length).toBeGreaterThanOrEqual(1);
    });
  });
});
