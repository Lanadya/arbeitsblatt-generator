# Prompt-Architektur: Wie der Arbeitsblatt-Generator funktioniert

## Stand: 25.03.2026

---

## Überblick: Der 3-Stufen-Ansatz

```
Lehrkraft gibt ein:              Der Generator macht:
  Thema ──────────────────→  1. BRAVE SEARCH (aktuelle Daten aus dem Web)
  Fachgebiet ─────────────→  2. LERNFELD-MAPPING (was gehört wo hin?)
  Schulform ──────────────→  3. CLAUDE PROMPT (alles zusammen → Arbeitsblatt)
```

---

## Stufe 1: Brave Search (aktuelle Daten)

### Was passiert?
Bevor Claude das Arbeitsblatt erstellt, sucht das System mit der Brave Search API
im Internet nach **aktuellen Informationen** zum Thema.

### Wie funktioniert die intelligente Suche?
Die Suche ist **themenspezifisch** — je nach Thema werden andere Suchbegriffe verwendet:

| Wenn das Thema enthält... | Sucht Brave nach... |
|---|---|
| EBM, GOÄ, Abrechnung | "EBM Orientierungswert [Jahr] aktuell Cent pro Punkt" |
| Sozialversicherung | "Sozialversicherung Beitragssätze [Jahr] aktuell Deutschland" |
| Hygiene, RKI | "[Thema] RKI Empfehlung aktuell [Jahr]" |
| Arbeitsrecht | "[Thema] aktuell [Jahr] Gesetzesänderung Deutschland" |
| Alles andere | "[Thema] aktuell [Jahr] Deutschland" |

Plus immer: "[Thema] [Schulform] Unterricht Prüfung"

### Datei: `lib/brave-search.ts`
- Funktion: `buildSmartQueries()` — erstellt die Suchbegriffe
- Funktion: `searchBraveForTopic()` — führt die Suchen aus, dedupliziert Ergebnisse
- Pro Thema werden 2-3 Suchanfragen gestellt (max. 3 Ergebnisse pro Anfrage)
- Ergebnis: Text-Snippets, die Claude als "AKTUELLE INFORMATIONEN" bekommt

### Grenzen:
- Brave liefert **Snippets** (kurze Textausschnitte), keine vollständigen Seiten
- Nicht garantiert, dass konkrete Zahlen (z.B. Orientierungswert) im Snippet stehen
- **Darum:** Claude hat die Anweisung, KEINE Zahlen zu erfinden wenn nichts in den
  Suchergebnissen steht → schreibt stattdessen "Frage deinen Lehrer"

### Was wir ggf. noch ergänzen könnten:
- Jährlich aktualisierte Referenztabelle für Kern-Zahlen (Orientierungswert, Beitragssätze)
- So hätten wir Zuverlässigkeit (Tabelle) + Aktualität (Brave Search)

---

## Stufe 2: Lernfeld-Mapping (nur MFA bisher)

### Was passiert?
Das System erkennt anhand von **Keywords** im Thema, zu welchem Lernfeld das gehört,
und gibt Claude zusätzlichen Kontext mit.

### Beispiel:
```
Eingabe: Thema="Hygiene", Schulform="MFA"
→ System erkennt: Keyword "hygiene" → LF 3
→ Claude bekommt: "LF 3: Praxishygiene und Schutz vor Infektionskrankheiten.
   Prüfungsbereich: Behandlungsassistenz. Kernbegriffe: RKI-Empfehlungen,
   Händehygiene, Flächendesinfektion..."
```

### Aktuell implementierte Mappings (MFA):

| Keywords | Lernfeld | Prüfungsbereich |
|---|---|---|
| Hygiene, Desinfektion, RKI... | LF 3 | Behandlungsassistenz |
| Sozialversicherung, Beitragssatz... | LF 1 + WiSo | WiSo (60 Min.) |
| EBM, GOÄ, Abrechnung... | LF 1/7 | Betriebsorganisation (120 Min.) |
| Notfall, Erste Hilfe, Reanimation... | LF 5 | Behandlungsassistenz |
| Blutentnahme, Labor, Diagnostik... | LF 4/8/9 | Behandlungsassistenz |
| Wundversorgung, Verbände, OP... | LF 10 | Behandlungsassistenz + Praktisch |
| Impfung, Vorsorge, Prävention... | LF 11 | Behandlungsassistenz |
| Datenschutz, Schweigepflicht, QM... | LF 7 | Betriebsorganisation |
| Waren, Bestellung, Material... | LF 6 | Betriebsorganisation |
| Arbeitsrecht, Kündigung, BBiG... | LF 1 + WiSo | WiSo (60 Min.) |
| Kommunikation, Patientengespräch... | LF 2 | Behandlungsassistenz |

### Datei: `lib/claude-prompt.ts`
- Konstante: `MFA_LERNFELD_MAP` — das Keyword → Kontext-Mapping
- Funktion: `getLernfeldContext()` — prüft ob MFA + findet passendes Lernfeld

### Noch nicht implementiert:
- ZFA (ähnlich wie MFA, eigene Lernfelder)
- Einzelhandelskaufleute
- Pflegefachkraft
- Friseur/in
- Allgemeinbildende Schulen (kein Lernfeld-System)

---

## Stufe 3: Der Claude-Prompt

### System-Prompt (immer gleich):
- Rolle: Didaktik-Experte für niedrigschwellige Materialien
- Zielgruppe: Geringe Grundbildung, DaZ, wenig Vorwissen
- Sprachregeln: Max. 10 Wörter/Satz, kein Passiv, einfache Hauptsätze
- **NEU: Datenaktualitäts-Regel** — "Verwende NUR Zahlen aus den Web-Ergebnissen"

### User-Prompt (pro Anfrage zusammengebaut):
1. Thema + Fachgebiet + Schulform
2. Lernfeld-Kontext (wenn MFA + erkannt)
3. 7-Teile-Struktur mit Anweisungen pro Teil
4. **Level-3-Spezialanweisungen** (wenn Abrechnung oder Sozialversicherung)
5. Aktuelle Informationen aus Brave Search
6. JSON-Schema (exakte Ausgabestruktur)
7. Few-Shot-Beispiel (vollständiges Arbeitsblatt als Referenz)

### Level-3-Spezialanweisungen:

**Bei Abrechnung (EBM/GOÄ):**
- MUSS Rechenaufgabe enthalten
- Format: "Patient kommt, Arzt rechnet GOP ab, berechne die Vergütung"
- Musterantwort mit vollständigem Rechenweg
- Hinweis: "Schlage die Ziffer im EBM-Verzeichnis deiner Praxis nach"

**Bei Sozialversicherung:**
- MUSS Fallaufgabe mit Lohnabrechnung enthalten
- Format: "Maria verdient X Euro brutto. Berechne ihren Anteil."
- Nur aktuelle Beitragssätze verwenden

---

## Differenzierungsstrategie

| Level | Sterne | Für wen | Was wird geprüft | Prüfungsnähe |
|-------|--------|---------|-------------------|--------------|
| 1 | * | Alle, auch A2 | Grundverständnis (Ankreuzen) | Weit unter Prüfung |
| 2 | ** | A2-B1 | Fachbegriffe zuordnen (Lückentext) | Unter Prüfung |
| 3 | *** | B1+ | Transfer + ggf. Berechnung (Fallbeispiel) | Angelehnt an Prüfung |

**Wichtig:** Auch Level 3 ist bewusst NICHT auf vollem Prüfungsniveau.
Es ist eine **Hinführung** zum Prüfungsformat. Die echte Prüfung ist komplexer.

---

## Dateien-Übersicht

| Datei | Funktion |
|---|---|
| `lib/claude-prompt.ts` | System-Prompt + User-Prompt + Lernfeld-Mapping |
| `lib/brave-search.ts` | Intelligente Web-Suche mit themenspezifischen Queries |
| `lib/claude-client.ts` | API-Aufruf an Claude (mit Retry-Logik) |
| `lib/docx-builder.ts` | JSON → Word-Dokument |
| `lib/types.ts` | TypeScript-Typen + Dropdown-Optionen |
| `app/api/generate/route.ts` | Orchestrierung: Stripe → Brave → Claude → DOCX |

---

## Was wir bei Problemen prüfen können

### "Das Arbeitsblatt hat falsche/veraltete Zahlen"
→ Prüfe: Hat Brave aktuelle Ergebnisse geliefert?
→ Fix: Suchbegriffe in `buildSmartQueries()` anpassen
→ Langfristig: Referenztabelle mit Kern-Zahlen anlegen

### "Level 3 ist zu einfach / keine Rechenaufgabe"
→ Prüfe: Wurde das Thema als Abrechnung/Sozialversicherung erkannt?
→ Fix: Keywords in `level3Hint`-Bedingung ergänzen

### "Lernfeld passt nicht zum Thema"
→ Prüfe: Welches Keyword hat gematcht?
→ Fix: Keywords in `MFA_LERNFELD_MAP` anpassen/ergänzen

### "Arbeitsblatt ist zu schwer / zu leicht"
→ Prüfe: System-Prompt Zielgruppen-Beschreibung
→ Fix: Sprachregeln oder Level-Anweisungen anpassen

### "Neues Lernfeld / neuer Rahmenlehrplan"
→ Fix: `MFA_LERNFELD_MAP` aktualisieren (passiert max. alle 10-15 Jahre)

### "Brave findet nichts Nützliches"
→ Prüfe: Welche Queries werden generiert? (Server-Logs)
→ Fix: `buildSmartQueries()` anpassen
→ Alternative: Referenztabelle als Fallback

---

## Nächste Schritte (TODO)

1. [ ] Referenztabelle für Kern-Zahlen (Orientierungswert, Beitragssätze, Top-GOPs)
2. [ ] Lernfeld-Mappings für ZFA, Pflegefachkraft, Einzelhandel
3. [ ] Prompt-Qualitätstests: 10 verschiedene Themen × 3 Schulformen durchlaufen
4. [ ] Level-3-Spezialanweisungen für weitere Themenbereiche (Hygiene, Notfall)
5. [ ] Few-Shot-Beispiel für Abrechnungsthema ergänzen (aktuell: Gesundheitswesen-Beispiel)
