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

describe("Homepage", () => {
  it("renders hero heading from homepage.json", () => {
    render(<Home />);
    const matches = screen.getAllByText(/Alles rund ums Haus/);
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it("renders hero subheading", () => {
    render(<Home />);
    expect(screen.getByText(/zuverlässiger Service rund ums Haus/)).toBeInTheDocument();
  });

  it("renders CTA buttons", () => {
    render(<Home />);
    expect(screen.getByText("Kostenlos anfragen")).toBeInTheDocument();
    const leistungenLinks = screen.getAllByText(/Unsere Leistungen/);
    expect(leistungenLinks.length).toBeGreaterThanOrEqual(1);
  });
});
