// T013 Ф2: клики по телефону и WhatsApp как конверсии Google Ads.
// Только с согласием; уход на wa.me в той же вкладке не должен обрывать запрос.
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render } from "@testing-library/react";
import {
  ANRUF_CONVERSION,
  WHATSAPP_CONVERSION,
  CONSENT_KEY,
  conversionForHref,
  handleContactClick,
  installContactClickTracking,
  initAdsIfConsented,
} from "@/lib/googleAds";
import { getAllOtherCities, getCityBySlug, getNeighborCities } from "@/lib/programmatic";
import EntruempelungCityTemplate from "@/components/templates/EntruempelungCityTemplate";

type W = Window & { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void };

function conversions() {
  return ((window as W).dataLayer ?? [])
    .map((e) => Array.from(e as ArrayLike<unknown>))
    .filter((a) => a[0] === "event" && a[1] === "conversion")
    .map((a) => a[2] as Record<string, unknown>);
}

function link(href: string, attrs: Record<string, string> = {}) {
  const a = document.createElement("a");
  a.href = href;
  for (const [k, v] of Object.entries(attrs)) a.setAttribute(k, v);
  const span = document.createElement("span");
  a.appendChild(span);
  document.body.appendChild(a);
  return { a, span };
}

function click(target: Element, init: MouseEventInit = {}): MouseEvent {
  const ev = new MouseEvent("click", { bubbles: true, cancelable: true, button: 0, ...init });
  target.dispatchEvent(ev);
  return ev;
}

describe("метки новых действий — из кабинета (docs/ads/conversion_labels.md)", () => {
  it("Anruf-Klick и WhatsApp-Klick", () => {
    expect(ANRUF_CONVERSION).toBe("AW-18071508845/ajW6CLqn6PocEO2ulalD");
    expect(WHATSAPP_CONVERSION).toBe("AW-18071508845/-3b4CL2n6PocEO2ulalD");
  });

  it("распознаёт ссылки", () => {
    expect(conversionForHref("tel:+4915239603175")).toBe(ANRUF_CONVERSION);
    expect(conversionForHref("https://wa.me/4915239603175")).toBe(WHATSAPP_CONVERSION);
    expect(conversionForHref("https://api.whatsapp.com/send?phone=49")).toBe(WHATSAPP_CONVERSION);
    expect(conversionForHref("mailto:kontakt@rundumshaus-littawe.de")).toBeNull();
    expect(conversionForHref("/kontakt/")).toBeNull();
    expect(conversionForHref(null)).toBeNull();
  });
});

describe("клик по телефону и WhatsApp", () => {
  const handler = (e: MouseEvent) => handleContactClick(e);

  beforeEach(() => {
    localStorage.clear();
    document.head.querySelectorAll("script").forEach((s) => s.remove());
    document.body.innerHTML = "";
    delete (window as W).dataLayer;
    delete (window as W).gtag;
    document.addEventListener("click", handler);
    // jsdom не умеет переходить на другие документы — гасим сам переход
    // последним слушателем, уже после нашего
    document.addEventListener("click", stopNav);
  });

  afterEach(() => {
    document.removeEventListener("click", handler);
    document.removeEventListener("click", stopNav);
  });

  function stopNav(e: MouseEvent) {
    // defaultPrevented до этой точки фиксируем отдельно
    lastPrevented = e.defaultPrevented;
    e.preventDefault();
  }
  let lastPrevented = false;

  it("без согласия — ни конверсии, ни перехвата перехода", () => {
    const { span } = link("https://wa.me/4915239603175");
    click(span);
    expect(conversions()).toHaveLength(0);
    expect(lastPrevented).toBe(false);
  });

  it("отказ «Nur notwendige» — конверсии нет", () => {
    localStorage.setItem(CONSENT_KEY, "necessary");
    const { a } = link("tel:+4915239603175");
    click(a);
    expect(conversions()).toHaveLength(0);
  });

  it("gtag уже загружен, но согласие отозвано — конверсии нет (Ланда F-05)", () => {
    localStorage.setItem(CONSENT_KEY, "all");
    initAdsIfConsented();
    localStorage.setItem(CONSENT_KEY, "necessary");
    click(link("tel:+4915239603175").a);
    localStorage.removeItem(CONSENT_KEY);
    click(link("https://wa.me/4915239603175").a);
    expect(conversions()).toHaveLength(0);
  });

  it("с согласием: tel — ровно одна конверсия Anruf, beacon, переход не трогаем", () => {
    localStorage.setItem(CONSENT_KEY, "all");
    initAdsIfConsented();
    const { span } = link("tel:+4915239603175");
    click(span);
    const c = conversions();
    expect(c).toEqual([{ send_to: ANRUF_CONVERSION, transport_type: "beacon" }]);
    expect(lastPrevented).toBe(false);
  });

  it("с согласием: wa.me в той же вкладке — ровно одна конверсия WhatsApp, переход не перехватывается (Ланда F-01)", () => {
    localStorage.setItem(CONSENT_KEY, "all");
    initAdsIfConsented();
    click(link("https://wa.me/4915239603175").a);
    expect(conversions()).toEqual([{ send_to: WHATSAPP_CONVERSION, transport_type: "beacon" }]);
    expect(lastPrevented).toBe(false);
  });

  it("wa.me в новой вкладке или с Ctrl — конверсия есть, переход не перехватываем", () => {
    localStorage.setItem(CONSENT_KEY, "all");
    initAdsIfConsented();
    click(link("https://wa.me/4915239603175", { target: "_blank" }).a);
    expect(lastPrevented).toBe(false);
    click(link("https://wa.me/4915239603175").a, { ctrlKey: true });
    expect(lastPrevented).toBe(false);
    expect(conversions()).toHaveLength(2);
  });

  it("обычные ссылки не трогаем", () => {
    localStorage.setItem(CONSENT_KEY, "all");
    initAdsIfConsented();
    click(link("/kontakt/").a);
    expect(lastPrevented).toBe(false);
    expect(conversions()).toHaveLength(0);
  });
});

describe("установка слушателя", () => {
  it("ставится один раз, сколько бы раз ни вызывали", () => {
    const spy = vi.spyOn(document, "addEventListener");
    installContactClickTracking();
    installContactClickTracking();
    expect(spy.mock.calls.filter((c) => c[0] === "click")).toHaveLength(1);
    spy.mockRestore();
  });
});

describe("посадочная Entrümpelung Osnabrück — телефон выше сгиба", () => {
  it("в тёмной шапке с H1 есть ссылка tel:, а не только WhatsApp", () => {
    const c = getCityBySlug("osnabrueck");
    if (!c) throw new Error("osnabrueck");
    const { container } = render(
      <EntruempelungCityTemplate city={c} neighbors={getNeighborCities(c)} allOtherCities={getAllOtherCities(c)} />,
    );
    const h1 = container.querySelector("h1");
    const header = h1?.closest("section");
    const tel = header?.querySelector('a[href^="tel:"]');
    expect(tel).not.toBeNull();
    expect(tel!.getAttribute("href")).toBe("tel:+4915239603175");
    expect(tel!.textContent).toMatch(/1523 9603175/);
  });
});
