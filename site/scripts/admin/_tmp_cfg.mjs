import { readFileSync, writeFileSync, appendFileSync } from "node:fs";
const f = "public/admin/config.yml";
let c = readFileSync(f, "utf8");

// 1) Extend homepage entry fields with the 4 new section objects
const anchor = `              - { name: value, label: Zahl, widget: number, value_type: int }
              - { name: suffix, label: Zusatz (z. B. % oder +), widget: string }
              - { name: label, label: Beschriftung, widget: string }`;
const add = anchor + `
          - name: warumWir
            label: "Warum wir? (Bereich)"
            widget: object
            fields:
              - { name: heading, label: Überschrift, widget: string }
              - { name: subheading, label: Untertitel, widget: text }
              - { name: items, label: "Punkte (Häkchen)", widget: list, field: { name: item, label: Punkt, widget: string } }
          - name: faq
            label: "Häufige Fragen (Startseite)"
            widget: object
            fields:
              - { name: heading, label: Überschrift, widget: string }
              - name: items
                label: Fragen
                widget: list
                fields:
                  - { name: q, label: Frage, widget: string }
                  - { name: a, label: Antwort, widget: text }
          - name: einsatzgebiet
            label: "Einsatzgebiet (Startseite)"
            widget: object
            fields:
              - { name: heading, label: Überschrift, widget: string }
              - { name: text1, label: "Text — Städte-Liste", widget: text }
              - { name: text2, label: "Text — Hinweis", widget: text }
              - { name: ctaLabel, label: Button-Text, widget: string }
              - { name: slogan, label: "Schluss-Slogan", widget: text }
          - name: kontaktCta
            label: "Kontakt-Bereich (unten)"
            widget: object
            fields:
              - { name: heading, label: Überschrift, widget: string }
              - { name: text, label: Text, widget: text }`;
if (!c.includes(anchor)) { console.error("homepage stats anchor not found"); process.exit(1); }
c = c.replace(anchor, add);
writeFileSync(f, c);

// 2) Append 6 new collections
appendFileSync(f, `
  # ────────────────────────────────────────────────────────────
  # PX-070: full coverage — remaining content files (CEO audit demand).
  - name: inhalte
    label: Weitere Inhalte
    description: Referenzen, Bewertungen, Weitere Dienstleistungen, Einsatzgebiete-Seite, Kontaktformular, Ratgeber-Titel.
    files:
      - name: weitere-leistungen
        label: Weitere Dienstleistungen (Liste)
        file: site/src/data/weitere-leistungen.json
        fields:
          - { name: heading, label: Überschrift, widget: string }
          - { name: subheading, label: Untertitel, widget: text }
          - { name: services, label: Dienstleistungen, widget: list, field: { name: item, label: Dienstleistung, widget: string } }
          - { name: footer, label: Schlusszeile, widget: string }
      - name: referenzen
        label: Referenzen (Vorher/Nachher)
        file: site/src/data/referenzen.json
        fields:
          - { name: heading, label: Überschrift, widget: string }
          - { name: emptyState, label: "Text wenn leer", widget: string }
          - name: items
            label: Referenz-Fälle
            widget: list
            fields:
              - { name: id, label: "Technische ID (eindeutig, klein, mit Bindestrichen)", widget: string }
              - { name: title, label: Titel, widget: string }
              - { name: description, label: Beschreibung, widget: text }
              - { name: before, label: Vorher-Bild, widget: image }
              - { name: after, label: Nachher-Bild, widget: image }
              - { name: date, label: "Datum (JJJJ-MM)", widget: string }
              - name: steps
                label: "Schritte-Galerie (optional, statt Vorher/Nachher)"
                widget: list
                required: false
                fields:
                  - { name: src, label: Bild, widget: image }
                  - { name: label, label: Beschriftung, widget: string }
      - name: reviews
        label: Google-Bewertungen (Slider)
        file: site/src/data/reviews.json
        fields:
          - { name: source, label: "Quelle (nicht ändern)", widget: string, readonly: true }
          - { name: verified, label: "Verifiziert-Notiz", widget: string }
          - name: aggregateRating
            label: Gesamt-Bewertung
            widget: object
            fields:
              - { name: ratingValue, label: "Durchschnitt (z. B. 5)", widget: number, value_type: float }
              - { name: ratingCount, label: Anzahl, widget: number, value_type: int }
              - { name: bestRating, label: "Beste (5)", widget: number, value_type: int }
              - { name: worstRating, label: "Schlechteste", widget: number, value_type: int }
          - name: reviews
            label: Bewertungen
            widget: list
            fields:
              - { name: id, label: "Technische ID (eindeutig)", widget: string }
              - { name: author, label: Name, widget: string }
              - { name: city, label: Stadt, widget: string }
              - { name: rating, label: "Sterne (1-5)", widget: number, value_type: int }
              - { name: datePublished, label: "Datum (JJJJ-MM-TT)", widget: string }
              - { name: text, label: Text, widget: text }
              - { name: service, label: "Leistung (optional)", widget: string, required: false }
      - name: service-areas
        label: Einsatzgebiete-Seite (Regionen)
        file: site/src/data/service-areas.json
        fields:
          - { name: heading, label: Überschrift, widget: string }
          - { name: subheading, label: Untertitel, widget: text }
          - name: regions
            label: Regionen
            widget: list
            fields:
              - { name: name, label: Regions-Name, widget: string }
              - { name: cities, label: Städte, widget: list, field: { name: city, label: Stadt, widget: string }, hint: "Stadtnamen müssen exakt den Stadt-Seiten entsprechen" }
          - { name: footer, label: Schlusszeile, widget: string }
      - name: contact-form
        label: Kontaktformular (Texte)
        file: site/src/data/contact-form.json
        fields:
          - { name: title, label: Seitentitel, widget: string }
          - { name: heading, label: Überschrift, widget: string }
          - { name: body, label: Einleitung, widget: text }
          - name: sections
            label: Formular-Abschnitte
            widget: list
            fields:
              - { name: heading, label: Abschnitts-Überschrift, widget: string }
              - name: fields
                label: Felder
                widget: list
                fields:
                  - { name: name, label: "Technischer Name (nicht ändern)", widget: string, readonly: true }
                  - { name: label, label: Beschriftung, widget: string }
                  - { name: type, label: "Typ (nicht ändern)", widget: string, readonly: true }
                  - { name: required, label: Pflichtfeld, widget: boolean }
                  - { name: placeholder, label: Platzhalter-Text, widget: string, required: false }
          - { name: submitLabel, label: Absende-Button, widget: string }
          - { name: successMessage, label: Erfolgs-Meldung, widget: text }
          - { name: errorMessage, label: Fehler-Meldung, widget: text }
      - name: ratgeber
        label: Ratgeber (Titel & Google-Texte)
        file: site/src/data/ratgeber.json
        fields:
          - name: articles
            label: Artikel
            widget: list
            allow_add: false
            hint: "Artikel-Inhalte selbst ändert Eduard; hier nur Titel und Google-Texte."
            fields:
              - { name: slug, label: "URL-Teil (nicht ändern!)", widget: string, readonly: true }
              - { name: title, label: Titel, widget: string }
              - { name: metaTitle, label: Google-Titel, widget: string }
              - { name: metaDescription, label: Google-Beschreibung, widget: text }
              - { name: category, label: Kategorie, widget: string }
              - { name: publishedDate, label: "Datum (JJJJ-MM-TT)", widget: string }
              - { name: readingTimeMinutes, label: Lesezeit (Min.), widget: number, value_type: int }
              - { name: primaryService, label: "Zugehörige Leistung (nicht ändern)", widget: string, readonly: true }
              - { name: howTo, label: "How-To Schema aktiv", widget: boolean }
              - { name: howToTitle, label: How-To Titel, widget: string, required: false }
              - name: howToSteps
                label: How-To Schritte
                widget: list
                required: false
                fields:
                  - { name: name, label: Schritt-Titel, widget: string }
                  - { name: text, label: Schritt-Text, widget: text }
`);
console.log("config extended");
