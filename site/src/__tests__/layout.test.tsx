import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock motion/react to avoid animation complexity in tests
vi.mock("motion/react", () => ({
  motion: {
    span: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLSpanElement> & { children?: React.ReactNode }) => (
      <span {...props}>{children}</span>
    ),
    div: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock lenis + gsap
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
vi.mock("lenis", () => ({
  default: vi.fn().mockImplementation(() => ({
    on: vi.fn(),
    raf: vi.fn(),
    destroy: vi.fn(),
  })),
}));

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

describe("Navbar", () => {
  it("renders company name", () => {
    render(<Navbar />);
    expect(screen.getByText("Rundum's Haus Littawe")).toBeInTheDocument();
  });

  it("renders 4 navigation links on desktop", () => {
    render(<Navbar />);
    const links = screen.getAllByRole("link");
    // Company link + 4 nav + 1 CTA = 6 minimum
    expect(links.length).toBeGreaterThanOrEqual(6);
  });

  it("renders Kontakt CTA button", () => {
    render(<Navbar />);
    const ctaLinks = screen.getAllByText("Kontakt");
    expect(ctaLinks.length).toBeGreaterThanOrEqual(1);
  });

  it("renders burger button for mobile", () => {
    render(<Navbar />);
    const burger = screen.getByLabelText("Menü öffnen");
    expect(burger).toBeInTheDocument();
  });
});

describe("Footer", () => {
  it("renders company name", () => {
    render(<Footer />);
    expect(screen.getByText("Rundum's Haus Littawe")).toBeInTheDocument();
  });

  it("renders owner name", () => {
    render(<Footer />);
    expect(screen.getByText("Kevin Littawe")).toBeInTheDocument();
  });

  it("renders legal links (Impressum + Datenschutz)", () => {
    render(<Footer />);
    expect(screen.getByText("Impressum")).toBeInTheDocument();
    expect(screen.getByText("Datenschutz")).toBeInTheDocument();
  });

  it("renders copyright text", () => {
    render(<Footer />);
    expect(screen.getByText(/Alle Rechte vorbehalten/)).toBeInTheDocument();
  });

  it("renders phone and email", () => {
    render(<Footer />);
    expect(screen.getByText(/kontakt@rundumshaus-littawe.de/)).toBeInTheDocument();
  });
});
