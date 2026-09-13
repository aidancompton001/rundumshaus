import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => <div {...props}>{children}</div>,
    // сама форма в ContactForm — motion.form; без неё рендер падает раньше отправки
    form: ({ children, ...props }: React.FormHTMLAttributes<HTMLFormElement> & { children?: React.ReactNode }) => <form {...props}>{children}</form>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock("@/components/motion", () => ({
  ScrollReveal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Stagger: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// next/link в jsdom-окружении vitest приходит объектом-модулем, а не
// компонентом, и ContactForm падает на рендере раньше, чем доходит до
// отправки формы. Подменяем обычной ссылкой — тест не про навигацию.
vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...rest }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...rest}>{children}</a>
  ),
}));

const track = vi.fn();
vi.mock("@/lib/googleAds", () => ({ trackKontaktConversion: () => track() }));

import ContactForm from "@/components/sections/ContactForm";

function submit(container: HTMLElement) {
  const form = container.querySelector("form");
  if (!form) throw new Error("форма не отрисована");
  fireEvent.submit(form);
}

describe("Kontakt — конверсия Google Ads", () => {
  beforeEach(() => track.mockClear());
  afterEach(() => vi.unstubAllGlobals());

  it("успешная отправка — конверсия ровно один раз", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));
    const { container } = render(<ContactForm />);
    submit(container);
    await waitFor(() => expect(track).toHaveBeenCalledTimes(1));
  });

  it("ошибка сервиса формы — конверсии нет", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    const { container } = render(<ContactForm />);
    submit(container);
    await waitFor(() => expect(fetch).toHaveBeenCalled());
    expect(track).not.toHaveBeenCalled();
  });

  it("сеть упала — конверсии нет", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    const { container } = render(<ContactForm />);
    submit(container);
    await waitFor(() => expect(fetch).toHaveBeenCalled());
    expect(track).not.toHaveBeenCalled();
  });
});
