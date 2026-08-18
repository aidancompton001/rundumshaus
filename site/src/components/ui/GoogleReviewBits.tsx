// Gemeinsame Bausteine für alle Bewertungs-Blöcke.
//
// Warum an einer Stelle:
//  * Der Herkunfts-Hinweis ist keine Deko, sondern Pflicht. § 5b Abs. 3 UWG
//    verlangt die Angabe, ob und wie die Echtheit der Bewertungen geprüft
//    wird; Anhang Nr. 23b zu § 3 UWG verbietet die Behauptung, Bewertungen
//    seien geprüft, wenn keine Prüfmaßnahmen ergriffen wurden. Wir prüfen
//    nichts — also darf kein Wort aus der Prüf-Familie (geprüft, echtheits-
//    geprüft, "v.-Formulierung") irgendwo behauptet werden, und der
//    Hinweis muss in Sichtverbindung zu den Bewertungen selbst stehen,
//    nicht auf einer anderen Seite.
//  * Der Profil-Link ist die Nachprüfbarkeit der Profilzahlen (5,0 / 10).
//    Ohne ihn hängen beide Zahlen in der Luft.
//
// Alle Zahlen und der Stand kommen aus reviews.json (googleProfile) —
// Kevin pflegt sie über /admin/.

import reviewsData from "@/data/reviews.json";

const { googleProfile } = reviewsData;

export const GOOGLE_PROFILE = googleProfile;

/** Buntes Google-„G" aus dem Kundenmockup (docs/design/v1-desktop). */
export function GoogleLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-label="Google"
      className={className}
      width="20"
      height="20"
    >
      <path
        fill="#4285F4"
        d="M23 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.2a5.3 5.3 0 0 1-2.3 3.5v2.9h3.7c2.2-2 3.4-5 3.4-8.6Z"
      />
      <path
        fill="#34A853"
        d="M12 23.5c3.1 0 5.7-1 7.6-2.8l-3.7-2.9c-1 .7-2.4 1.1-3.9 1.1-3 0-5.5-2-6.4-4.7H1.8v3A11.5 11.5 0 0 0 12 23.5Z"
      />
      <path
        fill="#FBBC05"
        d="M5.6 14.2a6.9 6.9 0 0 1 0-4.4v-3H1.8a11.5 11.5 0 0 0 0 10.4l3.8-3Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.1c1.7 0 3.2.6 4.4 1.7l3.3-3.3A11.5 11.5 0 0 0 1.8 6.8l3.8 3c.9-2.7 3.4-4.7 6.4-4.7Z"
      />
    </svg>
  );
}

/**
 * Profilzahlen mit klarer Zuordnung: 5,0 und 10 sind Google-Zahlen,
 * die Zahl der Karten ist unsere Auswahl.
 */
export function GoogleProfileFigures() {
  return (
    <>
      {googleProfile.ratingValue.toFixed(1).replace(".", ",")} bei Google ·{" "}
      {googleProfile.ratingCount} Bewertungen (Stand: {googleProfile.asOfShort})
    </>
  );
}

/** „Hier zeigen wir N davon." — N ist immer die tatsächliche Kartenzahl. */
export function ShownSelectionNote({ shown }: { shown: number }) {
  return <>Hier zeigen wir {shown} davon.</>;
}

/** Pflichthinweis, lange Fassung. */
export function ReviewsSourceNote({ className = "" }: { className?: string }) {
  return (
    <p className={className}>
      Diese Bewertungen haben Kundinnen und Kunden bei Google veröffentlicht.
      Wir haben sie von dort übernommen (Stand: {googleProfile.asOfLabel}) und
      prüfen sie nicht selbst auf Echtheit — die Veröffentlichung und Prüfung
      erfolgt durch Google.
    </p>
  );
}

/** Pflichthinweis, kurze Fassung für enge Blöcke. */
export function ReviewsSourceNoteShort({ className = "" }: { className?: string }) {
  return (
    <p className={className}>
      Bewertungen aus unserem Google-Profil, von uns übernommen (Stand:{" "}
      {googleProfile.asOfShort}). Eine eigene Echtheitsprüfung führen wir nicht
      durch.
    </p>
  );
}

/** Button auf das Profil — Ansehen, nicht Schreiben.
    Ссылки берём те, что отдаёт сам Google (Places API, googleMapsLinks).
    Прежняя форма `maps/place/?q=place_id:` собрана руками и на телефоне
    ненадёжно открывается в приложении Google Maps — клиент видел ошибку.
    Прямая ссылка на вкладку отзывов (reviewsUri) НЕ годится: Google
    открывает её в урезанном виде с плашкой «Die Ansicht ist beschränkt
    und du siehst nur einen Teil der Google-Maps-Daten» — замерено на
    мобильном. Ведём на карточку фирмы (cid): она открывается чисто, а
    отзывы там в одно касание. */
export function GoogleProfileButton({ className = "" }: { className?: string }) {
  return (
    <a
      href={googleProfile.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      <GoogleLogo className="shrink-0" />
      <span>Alle Bewertungen auf Google ansehen</span>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        width="20"
        height="20"
        aria-hidden="true"
        className="shrink-0"
      >
        <path d="M5 12h14m-6-6 6 6-6 6" />
      </svg>
    </a>
  );
}
