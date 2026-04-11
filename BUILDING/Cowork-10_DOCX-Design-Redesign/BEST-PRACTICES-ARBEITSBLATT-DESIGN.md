# Best Practices: Professionelles Arbeitsblatt-Design

Recherche-Ergebnis (2026-04-11) — konkrete Empfehlungen für automatisch generierte .docx-Arbeitsblätter in S/W-Druck.

---

## 1. Typografie

### Schriftart
- **Arial** ist die meistempfohlene Schrift für Arbeitsblätter: serifenlos, klar, kopierfest.
- Cornelsen hat eine eigene Schriftfamilie (CV Dida) entwickelt — das zeigt, wie hoch Verlage Typografie priorisieren.
- **Max 2 Schriftarten** pro Dokument (z.B. Arial für Fließtext + Courier New für Checkboxen).

> Quelle: [Cornelsen Font-Familie (PAGE online)](https://page-online.de/typografie/umfangreiches-projekt-fontfamilie-fuer-den-cornelsen-verlag/)

### Schriftgrößen-Hierarchie

| Element | Empfehlung (pt) | Empfehlung (Half-Pt/docx) |
|---|---|---|
| Haupttitel (Thema) | 18-20pt | 36-40 |
| Abschnitt-Banner (TEIL X) | 14pt (Label), 10pt (Nummer) | 28 / 20 |
| Unterüberschrift (Merke, Aufgabe) | 13-14pt | 26-28 |
| Fließtext / Erklärung | **12pt** | 24 |
| Aufgabentext | 12pt | 24 |
| Sublabels / Hinweise | 10-11pt | 20-22 |
| Footer / Seitenzahl | 9-10pt | 18-20 |

- 12pt Basis ist der Standard für alle Schulformen.
- Für Legasthenie/DaZ wäre 14pt ideal, 12pt ist das Minimum.

> Quellen: [Locus Digital — Best Practices Typography in Education](https://www.locusdigital.com/blog/discovering-the-best-practices-for-typography-in-education), [BDA Dyslexia Style Guide 2023](https://cdn.bdadyslexia.org.uk/uploads/documents/Advice/style-guide/BDA-Style-Guide-2023.pdf)

### Zeilenabstand

- **1.5-facher Zeilenabstand** für Fließtext (`line: 360` in docx).
- Absatzabstände: `before: 100, after: 100` TWIPs für Fließtext.
- Nach Überschriften: `after: 160-200` TWIPs.
- Vor neuen Abschnitten: `before: 240-360` TWIPs.

> Quelle: [HU Berlin INA-Pflege — Arbeitsblätter gestalten](https://www2.hu-berlin.de/ina-pflege/tools/arbeitsblaetter-gestalten)

---

## 2. Layout-Prinzipien

### Seitenränder
- **Links: 2.5cm** (1417 TWIPs) — Platz für Lochung/Heftung
- **Rechts: 2cm** (1134 TWIPs)
- **Oben: 2.5cm** (1417 TWIPs)
- **Unten: 2cm** (1134 TWIPs)

> Quelle: [Lehrkräfte+ NRW — Leitfaden Arbeitsblattgestaltung](https://lehrkraefteplus-nrw.de/wp-content/uploads/Leitfaden-Arbeitsblattgestaltung.pdf)

### Schreibplatz für Schüler
- **Standardlinienabstand für Handschrift: 8mm** (Schulheft-Standard)
- Kurze Antwort: mindestens 3 Zeilen à 8mm = 24mm
- Längere Antwort: 6-8 Zeilen = 48-64mm
- Zwischen Aufgaben: mindestens 12mm Abstand

### Raster
- tutory.de nutzt ein **6-Spalten-Magnetraster** — der Goldstandard für flexible Layouts.
- Für .docx pragmatisch: volle Breite vs. 2-Spalten-Tabelle.
- **Begriffe-Tabelle:** 3500-4000 TWIPs (6-7cm) für die Begriff-Spalte.
- **Flowchart:** ca. 80% der Inhaltsbreite (7500-8000 TWIPs).

> Quelle: [tutory.de FAQ — Layout Arbeitsblatt](https://faq.tutory.de/de/Layout/Arbeitsblatt)

### Weißraum-Management
- Zwischen Abschnitten (nach TEIL-Banner): **6mm** (`spacer(340)`)
- Zwischen Aufgaben innerhalb eines Teils: **4mm** (`spacer(230)`)
- **1/3 der Seite** sollte frei bleiben für Notizen (HU Berlin Empfehlung)

---

## 3. Kopfbereich / Header-Design

### Was "edel" wirkt (Verlagslook)
- **Unsichtbare 2-Spalten-Tabelle**: Links Fach/Lernfeld + Titel, rechts Name/Datum/Klasse
- Eine einzige **dünne Linie (0.5pt)** unter dem Header
- Dezente Typografie: Titel 16-18pt Bold, Metadaten 10pt Regular
- Genug Abstand zwischen Header und erstem Inhalt (mindestens 12mm)
- **Keine Rahmen** um den Kopfbereich

### Was "selbstgemacht" wirkt (vermeiden)
- Dicke Rahmen um alles
- Zu viele verschiedene Schriftgrößen im Header
- Header der mehr als 3cm Höhe einnimmt
- Sichtbare Tabellenrahmen für Name/Datum/Klasse

### Empfohlene Struktur
```
[Fach / Lernfeld]                        [Name: ____________]
[TITEL DES ARBEITSBLATTS]                [Datum: ___________]
[Schlüsselbegriffe]                      [Klasse: __________]
────────────────────────────────────────────────────────────
```

> Quellen: [Eduki — Das perfekte Arbeitsblatt](https://medium.com/lehrermarktplatz/das-perfekte-arbeitsblatt-9fbc957e19bf), [Kreativcode — Arbeitsblätter erstellen](https://kreativcode.com/arbeitsblaetter-erstellen/)

---

## 4. Visuelle Elemente (S/W-optimiert)

### Rahmen und Boxen

| Element | Empfehlung | Grund |
|---|---|---|
| TEIL-Banner | Schwarzer Hintergrund + weiße Schrift | Sehr kopierfest, klare Orientierung |
| Info-Box | 1pt Single Border | Klar sichtbar nach Kopie |
| Merke-Box | 1.5pt Single + leichtes Grau-Shading | Double-Lines werden beim Kopieren matschig |
| Aufgabe-Box | Gestrichelt (Dashed) | Überlebt Kopien gut, signalisiert "hier schreiben" |
| Achtung-Box | Schwarzer Balken links + rechts Rahmen | Professionell, kopierfest |
| Lösungsblatt-Banner | Schwarz + Doppelrahmen | Klar abgegrenzt |

### Grautöne (Sweet Spot)
- **15-25% Schwarz** (#CCCCCC bis #C0C0C0) überlebt Standardkopierer zuverlässig
- Unter 10% → wird unsichtbar beim Kopieren
- Über 40% → Text wird unlesbar
- **Empfehlung: #CCCCCC** (20% Schwarz) als Standard-Shading

### Was beim Kopieren verloren geht
- Grautöne unter 10% → werden weiß
- Doppelte Linien unter 1pt → verschmelzen zu einer unsauberen dicken Linie
- Sehr feine Linien < 0.5pt → verschwinden
- Farben → werden zu unberechenbaren Grautönen

### Minimum-Linienstärke
- **0.5pt (size 4)** als Minimum für alle sichtbaren Rahmen
- **1pt (size 8)** für betonte Rahmen (Info-Boxen, Tabellen-Header)

> Quelle: [GEW NRW — Struktur und Lesbarkeit](https://www.nds-zeitschrift.de/nds-8-2017/arbeitsblaetter-struktur-und-lesbarkeit-sind-das-a-und-o)

---

## 5. Seitenumbrüche

### Regeln
1. `keepNext: true` für alle Überschriften und Banner
2. `keepLines: true` für Aufgabenboxen (nicht über Seitenumbruch brechen)
3. `cantSplit: true` für Tabellenzeilen
4. `widowControl: true` im Document — gegen verwaiste Zeilen
5. `pageBreakBefore: true` am Banner-Element statt harter `PageBreak` — Word optimiert dann selbst

### Wann umbrechen
- Vor Aufgabenteil (TEIL 5) — Schüler brauchen das als separate Seiten
- Vor Lösungsblatt — muss abtrennbar sein
- Zwischen Abschnitten nur wenn < 1/4 der Seite frei

### Harte Seitenumbrüche vermeiden
- `pageBreakBefore: true` am TEIL-Banner ist die pragmatische Lösung
- Lieber Word die Optimierung überlassen als halbleere Seiten zu erzeugen

> Quelle: [Microsoft — Control Pagination (Widow/Orphan)](https://support.microsoft.com/en-us/office/control-pagination-e9b3b005-cf62-41d0-afa2-24cfb223ab42)

---

## 6. Barrierefreiheit / Lesbarkeit

- **Minimum 12pt**, ideal 14pt für DaZ/Legasthenie
- **Zeilenlänge: 40-45 Zeichen** pro Zeile
- **Linksbündig, Flattersatz** (kein Blocksatz) — besonders wichtig für DaZ
- Keine Silbentrennung bei niedrigeren Sprachniveaus
- Keine durchgängige Großschreibung für längere Texte (nur für Einzelbegriffe/Banner)
- Keine Kursivierung für längere Textpassagen

> Quellen: [BDA Dyslexia Style Guide 2023](https://cdn.bdadyslexia.org.uk/uploads/documents/Advice/style-guide/BDA-Style-Guide-2023.pdf), [Dyslexia Support South — Dyslexia-friendly documents](https://www.dyslexiasupportsouth.org.nz/school-toolkit/creating-a-dyslexia-friendly-classroom/dyslexia-friendly-text-and-documents/), [HU Berlin INA-Pflege](https://www2.hu-berlin.de/ina-pflege/tools/arbeitsblaetter-gestalten)

---

## 7. Benchmarking

### tutory.de
- 6-Spalten-Magnetraster, automatische Aufgabennummerierung, Punktesummen
- Konfigurierbarer Header/Footer mit Logo-Option
- Konsistentes Design über alle Materialien

### Raabe (RAAbits)
- Klare visuelle Differenzierung zwischen Schwierigkeitslevels
- Professionelle Typografie durch erfahrene Lektoren
- Einheitliches Serienlayout

### Cornelsen / Klett
- Eigene Schriftfamilien
- Klare Abgrenzung zwischen Text, Aufgaben und Antwortbereichen
- Kurze Textabschnitte mit häufigen Zeilenumbrüchen

### eduki (Lehrermarktplatz)
- Best-Seller nutzen max 2-3 Farben, max 2 Schriften
- Icons für Aufgabentypen
- Memo-Boxen für Definitionen mit Hintergrundfarbe
- Horizontale Trennlinien zwischen Aufgaben

> Quellen: [Eduki — Das perfekte Arbeitsblatt](https://medium.com/lehrermarktplatz/das-perfekte-arbeitsblatt-9fbc957e19bf), [Lehrerforen.de — Arbeitsblatt Layout/Schrift](https://www.lehrerforen.de/thread/40458-arbeitsblatt-textblatt-erstellen-welches-layout-schrift-etc/)

---

## 8. Zusammenfassung: Änderungen für unseren DOCX-Builder

| Was | Vorher | Nachher |
|---|---|---|
| Kopfbereich | Titel + Untertitel + Rahmentabelle | 2-Spalten ohne Rahmen, dünne Trennlinie |
| Zeilenabstand (Fließtext) | spacing 60/60 | spacing 100/100, line 360 |
| Flowchart-Breite | 6000 TWIPs | 7500 TWIPs |
| Merke-Box-Rahmen | DOUBLE_BORDERS | Single 1.5pt + #CCCCCC Shading |
| Lösungsblatt-Banner | DOUBLE_BORDERS | Single 1.5pt + BLACK_SHADING (unverändert) |
| Grau-Shading | #D9D9D9 | #CCCCCC |
| Seitenumbrüche | Harte PageBreak | pageBreakBefore am Banner |
| Linker Rand | 2cm (1134) | 2.5cm (1417) |
| Widow/Orphan | nicht gesetzt | widowControl: true |
| Spacer zwischen Teilen | spacer(100-200) | spacer(340) zwischen Teilen, spacer(160) innerhalb |
| Antwortlinien Level 3 | spacing 80 | spacing ~180 (8mm Handschrift-Standard) |
