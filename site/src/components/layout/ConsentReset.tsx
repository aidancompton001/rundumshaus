"use client";

import { CONSENT_KEY } from "@/lib/googleAds";

/** Ланда F-02: после отзыва тег больше не грузился, но cookie _gcl_au
    оставалась в браузере. Удаляем cookies Google Ads во всех вариантах, в
    которых gtag их ставит: без домена и на домене сайта с точкой и без. */
function removeGoogleAdsCookies() {
  const host = window.location.hostname;
  const expire = "expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  for (const part of document.cookie.split(";")) {
    const name = part.split("=")[0].trim();
    if (!name.startsWith("_gcl_") && !name.startsWith("_gac_")) continue;
    document.cookie = `${name}=; ${expire}`;
    document.cookie = `${name}=; ${expire}; domain=${host}`;
    document.cookie = `${name}=; ${expire}; domain=.${host}`;
  }
}

/** Ланда N-02: gtag хранит данные о кликах по рекламе ещё и в localStorage
    (_gcl_ls). Для § 25 TDDDG это то же, что cookie — удаляем при отзыве. */
function removeGoogleAdsStorage() {
  try {
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith("_gcl")) localStorage.removeItem(key);
    }
  } catch {
    /* хранилище недоступно — удалять нечего */
  }
}

/** Отзыв согласия должен быть так же прост, как его дача (Art. 7 Abs. 3 DSGVO).
    Сбрасывает выбор и перезагружает страницу — баннер спросит заново. */
export default function ConsentReset() {
  function reset() {
    try {
      localStorage.removeItem(CONSENT_KEY);
    } catch {
      /* хранилище недоступно — сбрасывать нечего */
    }
    removeGoogleAdsCookies();
    removeGoogleAdsStorage();
    window.location.reload();
  }

  return (
    <button
      type="button"
      onClick={reset}
      className="mt-3 inline-flex items-center rounded-lg border border-charcoal/20 px-4 py-2 text-sm font-semibold text-charcoal hover:border-copper hover:text-copper transition-colors"
    >
      Cookie-Einstellungen ändern
    </button>
  );
}
