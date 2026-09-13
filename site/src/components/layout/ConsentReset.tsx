"use client";

import { CONSENT_KEY } from "@/lib/googleAds";

/** Отзыв согласия должен быть так же прост, как его дача (Art. 7 Abs. 3 DSGVO).
    Сбрасывает выбор и перезагружает страницу — баннер спросит заново. */
export default function ConsentReset() {
  function reset() {
    try {
      localStorage.removeItem(CONSENT_KEY);
    } catch {
      /* хранилище недоступно — сбрасывать нечего */
    }
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
