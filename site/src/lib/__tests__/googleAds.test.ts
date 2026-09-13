import { describe, it, expect, beforeEach } from "vitest";
import {
  ADS_ID,
  KONTAKT_CONVERSION,
  CONSENT_KEY,
  initAdsIfConsented,
  trackKontaktConversion,
} from "@/lib/googleAds";

type W = Window & { dataLayer?: unknown[] };

function adsScripts() {
  return document.querySelectorAll(`script[src*="googletagmanager.com/gtag/js"]`);
}

function conversionEvents() {
  return ((window as W).dataLayer ?? []).filter((entry) => {
    const a = Array.from(entry as ArrayLike<unknown>);
    return a[0] === "event" && a[1] === "conversion";
  });
}

describe("Google Ads — только с согласия (TDDDG § 25)", () => {
  beforeEach(() => {
    localStorage.clear();
    document.head.querySelectorAll("script").forEach((s) => s.remove());
    delete (window as W).dataLayer;
  });

  it("тег и метка конверсии — те, что прислал клиент", () => {
    expect(ADS_ID).toBe("AW-18071508845");
    expect(KONTAKT_CONVERSION).toBe("AW-18071508845/mZFoCIrsp6YcEO2ulalD");
  });

  it("без согласия gtag.js не грузится", () => {
    initAdsIfConsented();
    expect(adsScripts()).toHaveLength(0);
  });

  it("отказ — тоже не грузится", () => {
    localStorage.setItem(CONSENT_KEY, "necessary");
    initAdsIfConsented();
    expect(adsScripts()).toHaveLength(0);
  });

  it("старое «accepted» прежнего баннера согласием на рекламу НЕ считается", () => {
    // Прежний баннер спрашивал «Verstanden» про технически необходимые
    // cookies. Это не согласие на рекламный трекинг.
    localStorage.setItem("rh-cookie-consent", "accepted");
    initAdsIfConsented();
    expect(adsScripts()).toHaveLength(0);
  });

  it("с согласием грузится ровно один раз, с правильным ID", () => {
    localStorage.setItem(CONSENT_KEY, "all");
    initAdsIfConsented();
    initAdsIfConsented();
    const s = adsScripts();
    expect(s).toHaveLength(1);
    expect(s[0].getAttribute("src")).toContain("id=AW-18071508845");
  });

  it("конверсия без согласия не отправляется", () => {
    trackKontaktConversion();
    expect(conversionEvents()).toHaveLength(0);
  });

  it("конверсия с согласием уходит на метку клиента", () => {
    localStorage.setItem(CONSENT_KEY, "all");
    initAdsIfConsented();
    trackKontaktConversion();
    const ev = conversionEvents();
    expect(ev).toHaveLength(1);
    expect(Array.from(ev[0] as ArrayLike<unknown>)[2]).toEqual({
      send_to: "AW-18071508845/mZFoCIrsp6YcEO2ulalD",
    });
  });
});
