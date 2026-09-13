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

  it("передаёт сигналы Consent Mode v2: сначала всё denied, затем granted — и до config", () => {
    // Ланда F-01: без consent-сигналов Google не может учесть выбор посетителя
    // из ЕЭА и рискует недосчитывать конверсии.
    localStorage.setItem(CONSENT_KEY, "all");
    initAdsIfConsented();
    const dl = ((window as W).dataLayer ?? []).map((e) => Array.from(e as ArrayLike<unknown>));
    const idx = (pred: (a: unknown[]) => boolean) => dl.findIndex(pred);
    const SIGNALS = ["ad_storage", "ad_user_data", "ad_personalization", "analytics_storage"];

    const def = idx((a) => a[0] === "consent" && a[1] === "default");
    const upd = idx((a) => a[0] === "consent" && a[1] === "update");
    const cfg = idx((a) => a[0] === "config");
    expect(def).toBeGreaterThanOrEqual(0);
    expect(upd).toBeGreaterThan(def);
    expect(cfg).toBeGreaterThan(upd);
    for (const s of SIGNALS) {
      expect((dl[def][2] as Record<string, string>)[s], `default ${s}`).toBe("denied");
      expect((dl[upd][2] as Record<string, string>)[s], `update ${s}`).toBe("granted");
    }
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
