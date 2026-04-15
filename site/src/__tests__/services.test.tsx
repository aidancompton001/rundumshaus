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
});

describe("ServiceDetail", () => {
  it("renders all 5 service detail descriptions", () => {
    render(<ServiceDetail />);
    expect(screen.getByText(/Ob Reparaturen, Wartungsarbeiten/)).toBeInTheDocument();
    expect(screen.getByText(/Ihr Garten verdient/)).toBeInTheDocument();
    expect(screen.getByText(/Moos, Laub und Verschmutzungen/)).toBeInTheDocument();
    expect(screen.getByText(/Vom Keller bis zur kompletten/)).toBeInTheDocument();
    expect(screen.getByText(/Wir holen Ihren Altmetallschrott/)).toBeInTheDocument();
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
