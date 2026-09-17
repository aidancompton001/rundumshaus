import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";

vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import CookieBanner from "@/components/layout/CookieBanner";
import { CONSENT_KEY } from "@/lib/googleAds";

function adsScripts() {
  return document.querySelectorAll(`script[src*="googletagmanager.com/gtag/js"]`);
}

async function showBanner() {
  render(<CookieBanner />);
  await act(async () => {
    vi.advanceTimersByTime(2000);
  });
}

describe("CookieBanner — выбор, а не уведомление", () => {
  beforeEach(() => {
    localStorage.clear();
    document.head.querySelectorAll("script").forEach((s) => s.remove());
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("показывает обе кнопки и ссылку на Datenschutz", async () => {
    await showBanner();
    expect(screen.getByRole("button", { name: "Alle akzeptieren" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Nur notwendige" })).toBeInTheDocument();
    expect(screen.getByText("Datenschutzerklärung")).toHaveAttribute("href", "/datenschutz");
  });

  it("больше не утверждает, что трекинга нет", async () => {
    await showBanner();
    expect(screen.queryByText(/Keine\s+Tracking-Cookies/)).not.toBeInTheDocument();
    expect(screen.getByText(/Google Ads/)).toBeInTheDocument();
  });

  it("«Alle akzeptieren» сохраняет согласие и грузит тег", async () => {
    await showBanner();
    fireEvent.click(screen.getByRole("button", { name: "Alle akzeptieren" }));
    expect(localStorage.getItem(CONSENT_KEY)).toBe("all");
    expect(adsScripts()).toHaveLength(1);
    expect(screen.queryByRole("button", { name: "Alle akzeptieren" })).not.toBeInTheDocument();
  });

  it("«Nur notwendige» сохраняет отказ и тег НЕ грузит", async () => {
    await showBanner();
    fireEvent.click(screen.getByRole("button", { name: "Nur notwendige" }));
    expect(localStorage.getItem(CONSENT_KEY)).toBe("necessary");
    expect(adsScripts()).toHaveLength(0);
  });

  it("не показывается повторно после выбора", async () => {
    localStorage.setItem(CONSENT_KEY, "necessary");
    await showBanner();
    expect(screen.queryByRole("button", { name: "Alle akzeptieren" })).not.toBeInTheDocument();
  });

  it("показывается снова тем, кто нажал только «Verstanden» в прежнем баннере", async () => {
    localStorage.setItem("rh-cookie-consent", "accepted");
    await showBanner();
    expect(screen.getByRole("button", { name: "Alle akzeptieren" })).toBeInTheDocument();
  });

  it("обёртка баннера не перехватывает клики — кнопка WhatsApp под ней остаётся рабочей", async () => {
    // Ланда F-04: прозрачная обёртка на всю ширину съедала клик по плавающей
    // кнопке WhatsApp. Клики принимает только сама карточка баннера.
    await showBanner();
    const dialog = screen.getByRole("dialog", { name: "Cookie-Einstellungen" });
    expect(dialog.className).toMatch(/(^|\s)pointer-events-none(\s|$)/);
    const card = dialog.firstElementChild as HTMLElement;
    expect(card.className).toMatch(/(^|\s)pointer-events-auto(\s|$)/);
  });

  it("кнопки не меньше 44 px по высоте — тач-цель как на остальном сайте", async () => {
    await showBanner();
    for (const name of ["Alle akzeptieren", "Nur notwendige"]) {
      expect(screen.getByRole("button", { name }).className, name).toMatch(/min-h-\[44px\]/);
    }
  });

  it("при показе фокус НЕ переводится сам — пробел для прокрутки не должен ставить выбор", async () => {
    // Ланда N-05: баннер сам ставил фокус на «Nur notwendige». Посетитель жал
    // пробел, чтобы пролистать, — страница стояла, а отказ молча записывался,
    // и баннер больше не появлялся. Выбор делается только осознанно.
    await showBanner();
    expect(document.activeElement).toBe(document.body);
    expect(localStorage.getItem(CONSENT_KEY)).toBeNull();
  });

  it("не отбирает фокус, если посетитель уже печатает в форме", async () => {
    // Ланда N-01: баннер через 1,5 с уводил фокус с поля Kontakt на «Nur
    // notwendige» — набранный текст терялся, а пробел сам ставил отказ.
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.focus();
    expect(document.activeElement).toBe(input);

    await showBanner();

    expect(screen.getByRole("button", { name: "Nur notwendige" })).toBeInTheDocument();
    expect(document.activeElement).toBe(input);
    expect(localStorage.getItem(CONSENT_KEY)).toBeNull();
    input.remove();
  });

  it("при уже данном согласии тег грузится без показа баннера", async () => {
    localStorage.setItem(CONSENT_KEY, "all");
    await showBanner();
    expect(adsScripts()).toHaveLength(1);
  });
  it("выбор в баннере уходит в Umami событием consent — доля согласий (T013 Ф2)", async () => {
    const calls: unknown[][] = [];
    (window as unknown as { umami?: unknown }).umami = { track: (...a: unknown[]) => { calls.push(a); } };
    await showBanner();
    fireEvent.click(screen.getByRole("button", { name: "Nur notwendige" }));
    expect(calls).toEqual([["consent", { choice: "necessary" }]]);
    delete (window as unknown as { umami?: unknown }).umami;
  });

  it("Umami ещё не загрузился — событие уходит, когда скрипт появится", async () => {
    delete (window as unknown as { umami?: unknown }).umami;
    await showBanner();
    fireEvent.click(screen.getByRole("button", { name: "Alle akzeptieren" }));
    const calls: unknown[][] = [];
    (window as unknown as { umami?: unknown }).umami = { track: (...a: unknown[]) => { calls.push(a); } };
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    expect(calls).toEqual([["consent", { choice: "all" }]]);
    await act(async () => {
      vi.advanceTimersByTime(20000);
    });
    expect(calls).toHaveLength(1);
    delete (window as unknown as { umami?: unknown }).umami;
  });
});
