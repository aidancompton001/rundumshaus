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
