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

  it("при уже данном согласии тег грузится без показа баннера", async () => {
    localStorage.setItem(CONSENT_KEY, "all");
    await showBanner();
    expect(adsScripts()).toHaveLength(1);
  });
});
