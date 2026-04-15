import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

vi.mock("motion/react", () => ({
  motion: new Proxy({}, {
    get: (_target, prop) => {
      return ({ children, ...props }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) => {
        const Tag = typeof prop === "string" ? prop : "div";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <Tag {...(props as any)}>{children}</Tag>;
      };
    },
  }),
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

import ReferenzenContent from "@/components/sections/ReferenzenContent";
import ContactForm from "@/components/sections/ContactForm";

describe("Referenzen", () => {
  it("renders heading", () => {
    render(<ReferenzenContent />);
    expect(screen.getByText("Referenzen")).toBeInTheDocument();
  });

  it("shows empty state when no items", () => {
    render(<ReferenzenContent />);
    expect(screen.getByText(/Referenzen folgen in Kürze/)).toBeInTheDocument();
  });
});

describe("ContactForm", () => {
  it("renders form heading from JSON", () => {
    render(<ContactForm />);
    expect(screen.getByText("Schreiben Sie uns")).toBeInTheDocument();
  });

  it("renders submit button with German text", () => {
    render(<ContactForm />);
    expect(screen.getByText("Anfrage absenden")).toBeInTheDocument();
  });

  it("has honeypot field off-screen (not display:none)", () => {
    const { container } = render(<ContactForm />);
    const honeypot = container.querySelector('input[name="_honey"]');
    expect(honeypot).toBeTruthy();
    expect(honeypot?.className).toContain("left-[-9999px]");
    expect(honeypot?.getAttribute("aria-hidden")).toBe("true");
    expect(honeypot?.getAttribute("tabIndex")).toBe("-1");
  });

  it("has GDPR consent checkbox", () => {
    render(<ContactForm />);
    expect(
      screen.getByText(/Verarbeitung meiner Daten gemäß der Datenschutzerklärung/)
    ).toBeInTheDocument();
  });

  it("renders phone and email from site.json", () => {
    render(<ContactForm />);
    expect(screen.getByText(/kontakt@rundumshaus-littawe.de/)).toBeInTheDocument();
  });

  it("has floating labels with placeholder space", () => {
    const { container } = render(<ContactForm />);
    const inputs = container.querySelectorAll('input[placeholder=" "], textarea[placeholder=" "]');
    expect(inputs.length).toBeGreaterThanOrEqual(3);
  });

  it("has hidden FormSubmit config fields", () => {
    const { container } = render(<ContactForm />);
    expect(container.querySelector('input[name="_captcha"]')).toBeTruthy();
    expect(container.querySelector('input[name="_subject"]')).toBeTruthy();
    expect(container.querySelector('input[name="_template"]')).toBeTruthy();
  });
});
