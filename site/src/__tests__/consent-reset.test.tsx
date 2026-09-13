import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import ConsentReset from "@/components/layout/ConsentReset";
import { CONSENT_KEY } from "@/lib/googleAds";

function cookieNames() {
  return document.cookie.split(";").map((c) => c.split("=")[0].trim()).filter(Boolean);
}

describe("Отзыв согласия (Art. 7 Abs. 3 DSGVO)", () => {
  const reload = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    document.cookie.split(";").forEach((c) => {
      const n = c.split("=")[0].trim();
      if (n) document.cookie = `${n}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    });
    reload.mockClear();
    vi.stubGlobal("location", { ...window.location, reload, hostname: "localhost" });
  });

  afterEach(() => vi.unstubAllGlobals());

  it("сбрасывает выбор и перезагружает страницу", () => {
    localStorage.setItem(CONSENT_KEY, "all");
    render(<ConsentReset />);
    fireEvent.click(screen.getByRole("button", { name: "Cookie-Einstellungen ändern" }));
    expect(localStorage.getItem(CONSENT_KEY)).toBeNull();
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it("удаляет cookies Google Ads, уже поставленные до отзыва", () => {
    // Ланда F-02: после отзыва тег больше не грузился, но _gcl_au оставалась.
    localStorage.setItem(CONSENT_KEY, "all");
    document.cookie = "_gcl_au=1.1.123; path=/";
    document.cookie = "_gcl_aw=GCL.1.abc; path=/";
    document.cookie = "_gac_UA-1=1.abc; path=/";
    document.cookie = "foreign=keep; path=/";
    expect(cookieNames()).toEqual(expect.arrayContaining(["_gcl_au", "_gcl_aw", "_gac_UA-1", "foreign"]));

    render(<ConsentReset />);
    fireEvent.click(screen.getByRole("button", { name: "Cookie-Einstellungen ändern" }));

    const left = cookieNames();
    expect(left.filter((n) => n.startsWith("_gcl_") || n.startsWith("_gac_"))).toEqual([]);
    expect(left).toContain("foreign");
  });
});
