import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

vi.mock("motion/react", () => ({
  motion: {
    span: (props: React.HTMLAttributes<HTMLSpanElement> & { children?: React.ReactNode }) => <span {...props} />,
    div: (props: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => <div {...props} />,
    form: (props: React.FormHTMLAttributes<HTMLFormElement> & { children?: React.ReactNode }) => <form {...props} />,
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

import {
  ClockIcon,
  SparkleIcon,
  PriceTagIcon,
  CalendarIcon,
  HandshakeIcon,
} from "@/components/WarumWirIcons";

import {
  PhoneIcon,
  WhatsAppIcon,
  EnvelopeIcon,
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@/components/ContactIcons";

/* ────────────────────────────────────────────
   WarumWir Icons
   ──────────────────────────────────────────── */

describe("WarumWirIcons", () => {
  const icons = [ClockIcon, SparkleIcon, PriceTagIcon, CalendarIcon, HandshakeIcon];
  const names = ["ClockIcon", "SparkleIcon", "PriceTagIcon", "CalendarIcon", "HandshakeIcon"];

  it("renders all 5 icons as SVG with correct viewBox", () => {
    icons.forEach((Icon) => {
      const { container } = render(<Icon />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
    });
  });

  it("default variant: has text-charcoal + text-copper groups", () => {
    icons.forEach((Icon) => {
      const { container } = render(<Icon />);
      expect(container.querySelector(".text-charcoal")).toBeInTheDocument();
      expect(container.querySelector(".text-copper")).toBeInTheDocument();
    });
  });

  it("light variant: has text-cream + text-copper groups", () => {
    icons.forEach((Icon) => {
      const { container } = render(<Icon variant="light" />);
      expect(container.querySelector(".text-cream")).toBeInTheDocument();
      expect(container.querySelector(".text-copper")).toBeInTheDocument();
      expect(container.querySelector(".text-charcoal")).not.toBeInTheDocument();
    });
  });

  it("mono variant: no text-charcoal or text-copper, uses currentColor", () => {
    icons.forEach((Icon) => {
      const { container } = render(<Icon variant="mono" />);
      expect(container.querySelector(".text-charcoal")).not.toBeInTheDocument();
      expect(container.querySelector(".text-copper")).not.toBeInTheDocument();
      const svg = container.querySelector("svg");
      expect(svg?.innerHTML).toContain('stroke="currentColor"');
    });
  });

  it("accepts className for sizing", () => {
    icons.forEach((Icon) => {
      const { container } = render(<Icon className="w-7 h-7" />);
      const svg = container.querySelector("svg");
      expect(svg?.className.baseVal || svg?.getAttribute("class")).toContain("w-7");
    });
  });

  it("has aria-hidden=true on SVG", () => {
    icons.forEach((Icon) => {
      const { container } = render(<Icon />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("aria-hidden", "true");
    });
  });

  it("0 hardcoded hex in SVG output", () => {
    icons.forEach((Icon) => {
      const { container } = render(<Icon />);
      const svg = container.querySelector("svg");
      expect(svg?.innerHTML).not.toMatch(/#[0-9a-fA-F]{3,6}/);
    });
  });

  it("strokeWidth is 1.5 for all paths", () => {
    icons.forEach((Icon) => {
      const { container } = render(<Icon />);
      const groups = container.querySelectorAll("g");
      groups.forEach((g) => {
        expect(g.getAttribute("stroke-width") || g.getAttribute("strokeWidth")).toBe("1.5");
      });
    });
  });
});

/* ────────────────────────────────────────────
   Contact Icons
   ──────────────────────────────────────────── */

describe("ContactIcons", () => {
  const icons = [PhoneIcon, WhatsAppIcon, EnvelopeIcon, MapPinIcon, CheckCircleIcon, XCircleIcon];

  it("renders all 6 icons as SVG with correct viewBox", () => {
    icons.forEach((Icon) => {
      const { container } = render(<Icon />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
    });
  });

  it("default variant: has text-charcoal + text-copper groups", () => {
    // WhatsAppIcon uses fill, not stroke — skip dual-tone check for it
    const dualToneIcons = [PhoneIcon, EnvelopeIcon, MapPinIcon, CheckCircleIcon, XCircleIcon];
    dualToneIcons.forEach((Icon) => {
      const { container } = render(<Icon />);
      expect(container.querySelector(".text-charcoal")).toBeInTheDocument();
      expect(container.querySelector(".text-copper")).toBeInTheDocument();
    });
  });

  it("mono variant works for all icons", () => {
    icons.forEach((Icon) => {
      const { container } = render(<Icon variant="mono" />);
      expect(container.querySelector(".text-charcoal")).not.toBeInTheDocument();
      expect(container.querySelector(".text-copper")).not.toBeInTheDocument();
    });
  });

  it("has aria-hidden=true on SVG", () => {
    icons.forEach((Icon) => {
      const { container } = render(<Icon />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("aria-hidden", "true");
    });
  });

  it("WhatsAppIcon uses official WhatsApp SVG path (fill-based)", () => {
    const { container } = render(<WhatsAppIcon />);
    const svg = container.querySelector("svg");
    const path = svg?.querySelector("path");
    expect(path).toBeInTheDocument();
    // Official WhatsApp path starts with M17.472
    expect(path?.getAttribute("d")).toContain("17.472");
  });

  it("0 hardcoded hex in SVG output (except WhatsApp which may use fill)", () => {
    const strokeIcons = [PhoneIcon, EnvelopeIcon, MapPinIcon, CheckCircleIcon, XCircleIcon];
    strokeIcons.forEach((Icon) => {
      const { container } = render(<Icon />);
      const svg = container.querySelector("svg");
      expect(svg?.innerHTML).not.toMatch(/#[0-9a-fA-F]{3,6}/);
    });
  });
});

/* ────────────────────────────────────────────
   Zero emoji on site
   ──────────────────────────────────────────── */

describe("Zero emoji", () => {
  it("WarumWir component has no emoji", async () => {
    const WarumWir = (await import("@/components/sections/WarumWir")).default;
    const { container } = render(<WarumWir />);
    const emojiPattern = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    expect(container.textContent || "").not.toMatch(emojiPattern);
  });

  it("ContactForm component has no emoji", async () => {
    const ContactForm = (await import("@/components/sections/ContactForm")).default;
    const { container } = render(<ContactForm />);
    const emojiPattern = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    expect(container.textContent || "").not.toMatch(emojiPattern);
  });

  it("Footer component has no emoji", async () => {
    const Footer = (await import("@/components/layout/Footer")).default;
    const { container } = render(<Footer />);
    const emojiPattern = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    expect(container.textContent || "").not.toMatch(emojiPattern);
  });
});
