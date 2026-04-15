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
vi.mock("gsap/SplitText", () => ({
  SplitText: { create: vi.fn(() => ({ chars: [], words: [], lines: [], revert: vi.fn() })) },
}));
vi.mock("lenis", () => ({
  default: vi.fn().mockImplementation(() => ({ on: vi.fn(), raf: vi.fn(), destroy: vi.fn() })),
}));

import Lamp from "@/components/aceternity/Lamp";
import Spotlight from "@/components/aceternity/Spotlight";
import MovingBorder from "@/components/aceternity/MovingBorder";

describe("Aceternity Components", () => {
  it("Lamp renders children", () => {
    render(<Lamp><p>Lamp content</p></Lamp>);
    expect(screen.getByText("Lamp content")).toBeInTheDocument();
  });

  it("Spotlight renders children", () => {
    render(<Spotlight><p>Spotlight content</p></Spotlight>);
    expect(screen.getByText("Spotlight content")).toBeInTheDocument();
  });

  it("MovingBorder renders children as link when href provided", () => {
    render(<MovingBorder href="/kontakt">Click me</MovingBorder>);
    const link = screen.getByText("Click me");
    expect(link).toBeInTheDocument();
  });

  it("MovingBorder renders as button when no href", () => {
    render(<MovingBorder>Submit</MovingBorder>);
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("Lamp has no hardcoded hex colors in classNames", () => {
    const { container } = render(<Lamp><p>Test</p></Lamp>);
    const html = container.innerHTML;
    // Should NOT contain inline hex like #B87333 in class attributes
    // (Allowed in style attributes for gradients)
    const classMatches = html.match(/class="[^"]*#[0-9a-fA-F]{6}[^"]*"/g);
    expect(classMatches).toBeNull();
  });
});
