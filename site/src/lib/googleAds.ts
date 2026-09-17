// Google Ads — тег и конверсия «Kontakt» (T011, запрос клиента 2026-09-13).
//
// Тег грузится ТОЛЬКО после явного согласия в баннере: Google Ads ставит
// cookies и передаёт данные в Google, по § 25 TDDDG это требует согласия
// до загрузки. Сниппет «как есть» в <head> был бы нарушением.
//
// Ключ согласия новый. Прежний баннер спрашивал «Verstanden» про технически
// необходимые cookies — это не согласие на рекламный трекинг, поэтому
// старое значение `rh-cookie-consent=accepted` здесь не читается вовсе.

export const ADS_ID = "AW-18071508845";

// Метка снята со скриншота клиента. Неоднозначные I/l разрешены замером
// высоты глифов: позиция 6 — прописная I, позиции 16 и 18 — строчная l.
export const KONTAKT_CONVERSION = "AW-18071508845/mZFoCIrsp6YcEO2ulalD";

export const CONSENT_KEY = "rh-consent-v2";

type AdsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

export function hasAdsConsent(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) === "all";
  } catch {
    return false;
  }
}

export function initAdsIfConsented(): void {
  if (typeof window === "undefined" || !hasAdsConsent()) return;
  if (document.querySelector(`script[src*="gtag/js?id=${ADS_ID}"]`)) return;

  const w = window as AdsWindow;
  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag() {
    // gtag.js ждёт в dataLayer именно объект arguments, а не массив
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments);
  };
  // Consent Mode v2 (Ланда F-01). Google требует для посетителей из ЕЭА явные
  // сигналы согласия, иначе конверсии могут недосчитываться. Тег грузится
  // только после «Alle akzeptieren», поэтому сразу за default denied идёт
  // update granted — и оба ДО config, как предписывает порядок gtag.
  w.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
  });
  w.gtag("consent", "update", {
    ad_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
    analytics_storage: "granted",
  });
  w.gtag("js", new Date());
  w.gtag("config", ADS_ID);

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ADS_ID}`;
  document.head.appendChild(script);
}

export function trackKontaktConversion(): void {
  if (typeof window === "undefined" || !hasAdsConsent()) return;
  const w = window as AdsWindow;
  if (typeof w.gtag !== "function") return;
  w.gtag("event", "conversion", { send_to: KONTAKT_CONVERSION });
}

// T013 Ф2: клики по телефону и WhatsApp. Действия заведены в кабинете
// 17.09.2026 (Website, Contact, Count: One), метки — docs/ads/conversion_labels.md.
export const ANRUF_CONVERSION = "AW-18071508845/ajW6CLqn6PocEO2ulalD";
export const WHATSAPP_CONVERSION = "AW-18071508845/-3b4CL2n6PocEO2ulalD";

export function conversionForHref(href: string | null | undefined): string | null {
  if (!href) return null;
  const h = href.trim().toLowerCase();
  if (h.startsWith("tel:")) return ANRUF_CONVERSION;
  if (/^https?:\/\/(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)\//.test(h)) return WHATSAPP_CONVERSION;
  return null;
}

/** Клик по tel:/wa.me → конверсия, только с согласием.
    Переход НЕ перехватываем (Ланда T013 Ф2 F-01): iOS Safari и Android Chrome
    открывают приложение WhatsApp только по прямому нажатию, а переход из
    программы после задержки оставляет человека на веб-странице wa.me с лишним
    тапом. Чтобы уход со страницы не оборвал запрос, он отправляется как beacon
    — этот способ браузер доводит до конца и после выгрузки страницы. */
export function handleContactClick(event: MouseEvent): void {
  if (typeof window === "undefined") return;
  const target = event.target as Element | null;
  const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
  if (!anchor) return;
  const sendTo = conversionForHref(anchor.getAttribute("href"));
  if (!sendTo || !hasAdsConsent()) return;
  const w = window as AdsWindow;
  if (typeof w.gtag !== "function") return;
  w.gtag("event", "conversion", { send_to: sendTo, transport_type: "beacon" });
}

let clickTrackingInstalled = false;

/** Один слушатель на весь документ: ссылки на телефон и WhatsApp стоят
    в двадцати местах, и новые не должны выпадать из учёта. */
export function installContactClickTracking(): void {
  if (typeof document === "undefined" || clickTrackingInstalled) return;
  clickTrackingInstalled = true;
  document.addEventListener("click", (e) => handleContactClick(e));
}
