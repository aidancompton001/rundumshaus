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
    // Слово «Referenzen» теперь стоит дважды: в хлебных крошках и в H1 —
    // так устроена шапка страницы в макете. Проверяем именно заголовок.
    const { container } = render(<ReferenzenContent />);
    expect(container.querySelector("h1")?.textContent).toContain("Referenzen");
  });

  it("renders referenzen items with titles", () => {
    render(<ReferenzenContent />);
    expect(screen.getByText(/Vorgartenpflege.*Bielefeld/)).toBeInTheDocument();
    expect(screen.getByText("Dachreinigung")).toBeInTheDocument();
    expect(screen.getByText("Kellerentrümpelung")).toBeInTheDocument();
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

  // Прежде подписи полей жили ВНУТРИ поля и исчезали, стоило начать печатать:
  // человек переставал видеть, что именно он заполняет. В макете подпись стоит
  // над полем и остаётся на месте. Стережём это: у каждого поля есть видимая
  // подпись, связанная с ним через htmlFor.
  it("у каждого поля видимая подпись над ним", () => {
    const { container } = render(<ContactForm />);
    const fields = container.querySelectorAll(
      'input:not([type="hidden"]):not([type="checkbox"]), textarea, select'
    );
    // Ловушка для спам-ботов подписи иметь не должна — она за экраном
    const visible = [...fields].filter((f) => f.getAttribute("name") !== "_honey");
    expect(visible.length).toBeGreaterThanOrEqual(4);
    visible.forEach((f) => {
      const id = f.getAttribute("id");
      expect(id, "поле без id: " + f.getAttribute("name")).toBeTruthy();
      const label = container.querySelector(`label[for="${id}"]`);
      expect(label, "нет подписи у поля " + id).toBeTruthy();
      expect(label?.className).not.toContain("absolute");
    });
  });

  it("в форме есть выбор услуги — иначе заявка приходит без неё", () => {
    const { container } = render(<ContactForm />);
    const select = container.querySelector('select[name="service"]');
    expect(select).toBeTruthy();
    // варианты — названия услуг клиента, а не сочинённый список
    expect(select!.querySelectorAll("option").length).toBeGreaterThanOrEqual(6);
  });

  it("has hidden FormSubmit config fields", () => {
    const { container } = render(<ContactForm />);
    expect(container.querySelector('input[name="_captcha"]')).toBeTruthy();
    expect(container.querySelector('input[name="_subject"]')).toBeTruthy();
    expect(container.querySelector('input[name="_template"]')).toBeTruthy();
  });
});
