// T013 Ф2: доля согласий в баннере. Конверсии Google Ads уходят только у тех,
// кто нажал «Alle akzeptieren», поэтому числа кабинета — нижняя граница.
// Umami Cloud (регион EU, аккаунт CEO) работает без cookies и без согласия;
// событие consent показывает, какая доля посетителей вообще может попасть в учёт.

type UmamiWindow = Window & { umami?: { track: (...args: unknown[]) => void } };

/** Скрипт Umami грузится с defer и очереди до загрузки не имеет, поэтому
    ждём его появления, но не дольше 10 секунд. */
const WAIT_MS = 10000;
const STEP_MS = 250;

export function trackConsentChoice(choice: "all" | "necessary"): void {
  if (typeof window === "undefined") return;
  const w = window as UmamiWindow;
  let waited = 0;
  const attempt = () => {
    if (w.umami && typeof w.umami.track === "function") {
      try {
        w.umami.track("consent", { choice });
      } catch {
        // учёт не имеет права ломать выбор в баннере
      }
      return;
    }
    waited += STEP_MS;
    if (waited <= WAIT_MS) setTimeout(attempt, STEP_MS);
  };
  attempt();
}
