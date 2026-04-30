import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

vi.mock("motion/react", () => ({
  motion: {
    span: (
      props: React.HTMLAttributes<HTMLSpanElement> & {
        children?: React.ReactNode;
      }
    ) => <span {...props} />,
    div: (
      props: React.HTMLAttributes<HTMLDivElement> & {
        children?: React.ReactNode;
      }
    ) => <div {...props} />,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));
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
vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: { update: vi.fn() },
}));

import ServiceFAQ from "@/components/sections/ServiceFAQ";
import faqData from "@/data/service-faq.json";

const TARGET_CITIES = [
  "Osnabrück",
  "Bramsche",
  "Wallenhorst",
  "Belm",
  "Bissendorf",
  "Georgsmarienhütte",
  "Melle",
];

describe("service-faq.json (PX-022 Wave 2)", () => {
  it("has both gartenpflege and entruempelung keys", () => {
    expect(faqData).toHaveProperty("gartenpflege");
    expect(faqData).toHaveProperty("entruempelung");
  });

  it("each FAQ has at least 5 items", () => {
    expect(faqData.gartenpflege.items.length).toBeGreaterThanOrEqual(5);
    expect(faqData.entruempelung.items.length).toBeGreaterThanOrEqual(5);
  });

  it("each FAQ item has q and a strings", () => {
    [...faqData.gartenpflege.items, ...faqData.entruempelung.items].forEach(
      (item) => {
        expect(item.q).toBeTruthy();
        expect(item.a).toBeTruthy();
        expect(typeof item.q).toBe("string");
        expect(typeof item.a).toBe("string");
      }
    );
  });

  it("FAQ as a whole mentions at least one target city per service", () => {
    // each service FAQ collectively must touch every target city
    const gartenText = faqData.gartenpflege.items
      .map((i) => `${i.q} ${i.a}`)
      .join(" ");
    const entrText = faqData.entruempelung.items
      .map((i) => `${i.q} ${i.a}`)
      .join(" ");
    TARGET_CITIES.forEach((city) => {
      expect(gartenText, `gartenpflege FAQ missing city: ${city}`).toContain(
        city
      );
      expect(entrText, `entruempelung FAQ missing city: ${city}`).toContain(
        city
      );
    });
  });
});

describe("ServiceFAQ component", () => {
  it("renders gartenpflege FAQ items", () => {
    render(<ServiceFAQ serviceId="gartenpflege" />);
    // title rendered
    expect(
      screen.getByText(/Häufige Fragen zur Gartenpflege/)
    ).toBeInTheDocument();
    // first question visible
    expect(
      screen.getByText(faqData.gartenpflege.items[0].q)
    ).toBeInTheDocument();
  });

  it("renders entruempelung FAQ items", () => {
    render(<ServiceFAQ serviceId="entruempelung" />);
    expect(
      screen.getByText(/Häufige Fragen zur Entrümpelung/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(faqData.entruempelung.items[0].q)
    ).toBeInTheDocument();
  });

  it("includes Schema.org FAQPage JSON-LD", () => {
    const { container } = render(<ServiceFAQ serviceId="gartenpflege" />);
    const schemaScript = container.querySelector(
      'script[type="application/ld+json"]'
    );
    expect(schemaScript).toBeInTheDocument();
    const schema = JSON.parse(schemaScript!.textContent || "{}");
    expect(schema["@type"]).toBe("FAQPage");
    expect(Array.isArray(schema.mainEntity)).toBe(true);
    expect(schema.mainEntity.length).toBeGreaterThanOrEqual(5);
    expect(schema.mainEntity[0]["@type"]).toBe("Question");
    expect(schema.mainEntity[0].acceptedAnswer["@type"]).toBe("Answer");
  });

  it("section has anchor id for deep-linking", () => {
    const { container } = render(<ServiceFAQ serviceId="gartenpflege" />);
    expect(container.querySelector("#gartenpflege-faq")).toBeInTheDocument();
  });
});
