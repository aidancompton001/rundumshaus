# Anleitung — Admin-Panel (rundumshaus-littawe.de/admin/)

> Für Kevin. Stand: Juni 2026. Bei Fragen → Eduard per WhatsApp.

---

## Was du damit machen kannst

| Bereich | Was du ändern kannst |
|---------|----------------------|
| **Startseite** | Hero-Überschrift, Untertitel, Buttons, Über-uns-Texte, Über-uns-Bild, Statistik-Zahlen |
| **Dienstleistungen** | Titel + Beschreibungen der 5 Karten, Karten-Bilder, Icons |
| **SEO / Google** | Google-Titel + Google-Beschreibung für: Startseite, Leistungen, Über uns, Kontakt, Einsatzgebiete, Datenschutz, Impressum — UND als Muster für alle 98 Stadt-Seiten je Dienstleistung |
| **Stadt-Seiten Texte** | Komplette Texte der 98 Stadt-Seiten je Dienstleistung: Leistungslisten, Beschreibungen, FAQ, Überschriften |
| **Einstellungen** | Telefon, E-Mail, Adresse, Menü, Footer |

**Leer lassen bei SEO-Feldern = automatischer Standard bleibt aktiv.** Du kannst
nichts kaputt machen — jede Änderung lässt sich rückgängig machen.

---

## Einmalig: Zugang einrichten (ca. 5 Minuten)

Das Panel speichert Änderungen direkt in unserem GitHub-Projekt. Dafür brauchst
du einen **Zugangsschlüssel (Token)** von deinem GitHub-Konto (`rundumshaus-littawe`):

1. Einloggen auf https://github.com (dein Konto `rundumshaus-littawe`)
2. Öffne direkt: **https://github.com/settings/tokens/new**
   (Classic Token — wichtig: NICHT "fine-grained", das funktioniert bei uns nicht)
3. **Note:** `Admin Panel Website`
4. **Expiration:** „No expiration" wählen (sonst musst du in 30 Tagen einen neuen machen)
5. Häkchen setzen bei: **repo** (der oberste Haken — alle Unterpunkte werden automatisch mit angehakt)
6. Unten **„Generate token"** → der Schlüssel wird angezeigt (beginnt mit `ghp_…`)
7. **Kopieren und sicher speichern** (z. B. Notizen-App) — er wird nur EINMAL angezeigt!

### Anmelden im Panel

1. Öffne **https://rundumshaus-littawe.de/admin/**
2. Klicke **„Sign in with GitHub"** → dann unten **„Use a personal access token"** (bzw. „Sign In with Token")
3. Token einfügen → fertig. Die Anmeldung bleibt im Browser gespeichert.

---

## Texte ändern

1. Links den Bereich wählen (z. B. **Startseite**)
2. Eintrag öffnen → Felder ändern
3. Oben rechts **„Speichern"** (Save)
4. **Warten: ca. 3–10 Minuten** bis es online ist
   (2–3 Min. automatischer Neuaufbau der Seite + bis zu 10 Min. Browser-Cache).
   Wenn du es nicht siehst: Seite mit **Strg+F5** neu laden oder privates Fenster.

## Bilder ändern

1. Im jeweiligen Eintrag aufs Bild-Feld → **„Bild auswählen"** → hochladen
2. Speichern. Die verschiedenen Bildgrößen für Handy/Desktop werden
   **automatisch** erzeugt — du musst nichts weiter tun.
3. Empfehlung: Querformat, mindestens 1200 px breit, JPG oder PNG.

## Stadt-Seiten Texte ändern (alle 98 Städte je Dienstleistung)

Im Bereich **Stadt-Seiten Texte** änderst du die kompletten Texte der Stadt-Seiten —
Leistungslisten, Beschreibungen, FAQ, Überschriften. Eine Änderung gilt automatisch
für **alle 98 Städte** der jeweiligen Dienstleistung.

1. Bereich **Stadt-Seiten Texte** → Dienstleistung wählen (z. B. Dachservice)
2. Felder ändern — z. B. einen Punkt aus der **Leistungsliste** löschen (Mülleimer-Symbol)
   oder einen FAQ-Eintrag anpassen
3. **Speichern** → nach ca. 3–10 Minuten auf allen 98 Stadt-Seiten live
   (auch in den Google-Daten/Schema der Seiten — automatisch synchron)

**Platzhalter in den Texten (einfach stehen lassen bzw. mitverwenden):**

| Platzhalter | Wird ersetzt durch |
|-------------|--------------------|
| `{city}` | Stadtname (z. B. Bramsche) |
| `{dist}` | automatischer Entfernungs-Satz (z. B. „nur rund 17 km von Osnabrück entfernt") |
| `{einsatz}` | automatischer Einsatzgebiets-Satz |
| `{list}` | Liste der Nachbarstädte |
| `{count}` | Anzahl (beim Aufklapp-Text) |

Ein Tippfehler in einem Platzhalter macht nichts kaputt — er wird dann einfach
als Text angezeigt, bis du ihn korrigierst.

## Google-Titel & Beschreibung ändern

1. Bereich **SEO / Google** → **Google Titel & Beschreibungen**
2. **Einzelne Seiten:** Seite wählen, Titel/Beschreibung eintragen.
   - Der Zusatz „| Rund ums Haus Littawe" wird automatisch angehängt (außer Startseite — dort gilt dein Text 1:1).
   - Empfohlen: Titel max. 60 Zeichen, Beschreibung 120–160 Zeichen.
3. **Dienstleistungs-Seiten:** Hier änderst du das **Muster für alle 98 Städte**
   einer Dienstleistung auf einmal. Der Platzhalter **{city}** wird automatisch
   durch den Stadtnamen ersetzt. Beispiel:
   - Muster: `Gartenpflege {city} ★ Ihr Gärtner vor Ort`
   - Ergebnis Bramsche: „Gartenpflege Bramsche ★ Ihr Gärtner vor Ort"
   - **{city} muss im Muster vorkommen** — sonst hätten alle 98 Seiten denselben Titel (schlecht für Google).
4. Feld **leeren + Speichern** = zurück zum automatischen Standard.
5. Google übernimmt Änderungen nicht sofort — das dauert erfahrungsgemäß **1–14 Tage**.

---

## Wichtig zu wissen

- **Jede Änderung geht direkt live** (nach dem Neuaufbau). Es gibt keine Entwürfe.
- Wenn etwas schiefgeht: Eduard kann **jede Änderung per Klick zurückdrehen**.
- Die 98 Stadt-Seiten-**Texte** (nicht die Google-Titel) bleiben automatisch —
  Änderungen daran weiterhin über Eduard.
- Token verloren? Einfach auf GitHub einen neuen erstellen (gleiche Schritte)
  und den alten unter https://github.com/settings/tokens löschen.
