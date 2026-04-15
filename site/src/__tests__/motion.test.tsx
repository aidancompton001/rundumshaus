import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock GSAP and Lenis to avoid DOM measurement issues in jsdom
vi.mock("gsap", () => ({
  default: {
    registerPlugin: vi.fn(),
    from: vi.fn(() => ({ kill: vi.fn() })),
    to: vi.fn(() => ({ kill: vi.fn() })),
    set: vi.fn(),
    ticker: {
      add: vi.fn(),
      remove: vi.fn(),
      lagSmoothing: vi.fn(),
    },
  },
  ScrollTrigger: { update: vi.fn() },
}));

vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: { update: vi.fn() },
}));

vi.mock("gsap/SplitText", () => ({
  SplitText: {
    create: vi.fn(() => ({
      chars: [],
      words: [],
      lines: [],
      revert: vi.fn(),
    })),
  },
}));

vi.mock("lenis", () => ({
  default: vi.fn().mockImplementation(() => ({
    on: vi.fn(),
    raf: vi.fn(),
    destroy: vi.fn(),
  })),
}));

// Import after mocks
import ScrollReveal from "@/components/motion/ScrollReveal";
import Stagger from "@/components/motion/Stagger";
import Parallax from "@/components/motion/Parallax";

describe("Motion Components", () => {
  it("ScrollReveal renders children", () => {
    render(
      <ScrollReveal>
        <p>Revealed content</p>
      </ScrollReveal>
    );
    expect(screen.getByText("Revealed content")).toBeInTheDocument();
  });

  it("Stagger renders children", () => {
    render(
      <Stagger>
        <div>Item 1</div>
        <div>Item 2</div>
      </Stagger>
    );
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  it("Parallax renders children", () => {
    render(
      <Parallax>
        <p>Parallax content</p>
      </Parallax>
    );
    expect(screen.getByText("Parallax content")).toBeInTheDocument();
  });
});
