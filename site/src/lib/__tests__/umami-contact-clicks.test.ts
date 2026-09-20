// T013 Ф7: клики по телефону и WhatsApp в Umami — без cookies и без согласия,
// поэтому это единственное честное число контактов с сайта (разбор Дреда 20.09).
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { trackContactClick, installUmamiContactTracking } from "@/lib/umami";

type W = Window & { umami?: { track: (...a: unknown[]) => void } };

function calls(): unknown[][] {
  return ((window as unknown as { __u?: unknown[][] }).__u ?? []) as unknown[][];
}

function fakeUmami() {
  (window as unknown as { __u: unknown[][] }).__u = [];
  (window as W).umami = { track: (...a: unknown[]) => { calls().push(a); } };
}

function link(href: string) {
  const a = document.createElement("a");
  a.href = href;
  const span = document.createElement("span");
  a.appendChild(span);
  document.body.appendChild(a);
  return { a, span };
}

function click(el: Element) {
  el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }));
}

describe("Umami: контакты с сайта", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    localStorage.clear();
    delete (window as W).umami;
    vi.useFakeTimers();
  });
  afterEach(() => vi.useRealTimers());

  it("клик по телефону уходит событием kontakt с типом telefon", () => {
    fakeUmami();
    trackContactClick("tel:+4915239603175");
    expect(calls()).toEqual([["kontakt", { typ: "telefon" }]]);
  });

  it("клик по WhatsApp уходит событием kontakt с типом whatsapp", () => {
    fakeUmami();
    trackContactClick("https://wa.me/4915239603175");
    expect(calls()).toEqual([["kontakt", { typ: "whatsapp" }]]);
  });

  it("обычные ссылки событий не дают", () => {
    fakeUmami();
    trackContactClick("/kontakt/");
    trackContactClick("mailto:kontakt@rundumshaus-littawe.de");
    expect(calls()).toHaveLength(0);
  });

  it("считает и без согласия на рекламу — Umami работает без cookies", () => {
    localStorage.setItem("rh-consent-v2", "necessary");
    fakeUmami();
    trackContactClick("tel:+4915239603175");
    expect(calls()).toHaveLength(1);
  });

  it("скрипт ещё не загрузился — событие уходит, когда он появится", () => {
    trackContactClick("https://wa.me/4915239603175");
    fakeUmami();
    vi.advanceTimersByTime(1000);
    expect(calls()).toEqual([["kontakt", { typ: "whatsapp" }]]);
    vi.advanceTimersByTime(20000);
    expect(calls()).toHaveLength(1);
  });

  it("слушатель ловит клик по ссылке на странице и ставится один раз", () => {
    fakeUmami();
    const spy = vi.spyOn(document, "addEventListener");
    installUmamiContactTracking();
    installUmamiContactTracking();
    expect(spy.mock.calls.filter((c) => c[0] === "click")).toHaveLength(1);
    spy.mockRestore();
    const { span } = link("tel:+4915239603175");
    click(span);
    expect(calls()).toEqual([["kontakt", { typ: "telefon" }]]);
  });
});
