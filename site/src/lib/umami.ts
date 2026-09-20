// T013 Ф2: доля согласий в баннере. Конверсии Google Ads уходят только у тех,
// кто нажал «Alle akzeptieren», поэтому числа кабинета — нижняя граница.
// Umami Cloud (регион EU, аккаунт CEO) работает без cookies и без согласия;
// событие consent показывает, какая доля посетителей вообще может попасть в учёт.

type UmamiWindow = Window & { umami?: { track: (...args: unknown[]) => void } };

/** Скрипт Umami грузится с defer и очереди до загрузки не имеет, поэтому
    ждём его появления, но не дольше 10 секунд. */
const WAIT_MS = 10000;
const STEP_MS = 250;

/** Общая отправка: ждём появления скрипта, но не дольше WAIT_MS. */
function send(event: string, data: Record<string, string>): void {
  if (typeof window === "undefined") return;
  const w = window as UmamiWindow;
  let waited = 0;
  const attempt = () => {
    if (w.umami && typeof w.umami.track === "function") {
      try {
        w.umami.track(event, data);
      } catch {
        // учёт не имеет права ломать работу сайта
      }
      return;
    }
    waited += STEP_MS;
    if (waited <= WAIT_MS) setTimeout(attempt, STEP_MS);
  };
  attempt();
}

export function trackConsentChoice(choice: "all" | "necessary"): void {
  send("consent", { choice });
}

// T013 Ф7: контакты с сайта. Конверсии Google Ads уходят только с согласием,
// поэтому их число — нижняя граница. Umami работает без cookies и согласия,
// значит его счёт кликов по телефону и WhatsApp — настоящее число контактов.
export function contactTypeForHref(href: string | null | undefined): "telefon" | "whatsapp" | null {
  if (!href) return null;
  const h = href.trim().toLowerCase();
  if (h.startsWith("tel:")) return "telefon";
  if (/^https?:\/\/(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)\//.test(h)) return "whatsapp";
  return null;
}

export function trackContactClick(href: string | null | undefined): void {
  const typ = contactTypeForHref(href);
  if (!typ) return;
  send("kontakt", { typ });
}

let contactTrackingInstalled = false;

/** Один слушатель на документ: ссылки на телефон и WhatsApp стоят в двадцати
    местах, новые не должны выпадать из учёта. Переход не трогаем. */
export function installUmamiContactTracking(): void {
  if (typeof document === "undefined" || contactTrackingInstalled) return;
  contactTrackingInstalled = true;
  document.addEventListener("click", (e) => {
    const target = e.target as Element | null;
    const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
    if (anchor) trackContactClick(anchor.getAttribute("href"));
  });
}
