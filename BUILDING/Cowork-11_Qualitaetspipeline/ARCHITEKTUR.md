# 5-Stufen-Qualitätspipeline — Architektur & Dokumentation

## Stand: 2026-04-15

## Warum diese Pipeline existiert

Wir verkaufen Arbeitsblätter für Geld. Lehrkräfte erwarten korrekte Fakten — Paragraphen, GOP-Nummern, Beitragssätze, Fristen. Claude halluziniert gelegentlich (z.B. GOP 03040 statt 03220 für "Chronikerziffer"). Das können wir uns nicht leisten.

Die Pipeline funktioniert wie ein juristischer Prüfprozess: Recherche → Generierung mit Quellen → unabhängiger Faktencheck → Korrektur.

---

## Die 5 Stufen

```
Stufe 1          Stufe 2           Stufe 3              Stufe 4           Stufe 5
Thema-Analyse → Quellenrecherche → Generierung mit  →  Faktencheck →    Korrektur
(Haiku)         (Brave Search)     Quellenverankerung   (Sonnet)         (Sonnet)
                                   (Sonnet)                              nur bei Fehlern
```

### Stufe 1: Thema-Analyse (`analyzeTopicWithSources`)

- **Modell:** Claude Haiku (schnell, günstig)
- **Input:** Thema, Fachgebiet, Beruf/Schulform
- **Output:** `TopicAnalysis` mit:
  - `category`: legal | medical | financial | procedural | conceptual
  - `searchQueries`: 3-5 gezielte Suchanfragen (z.B. "§286 BGB Zahlungsverzug Fristen")
  - `factTypes`: Welche Fakten müssen stimmen? (z.B. "Paragraphen", "Punktwerte")
  - `perspective`: Wer ist der Schüler? (z.B. "Auszubildende/r zur MFA in einer Hausarztpraxis")
  - `keyTerms`: Die wichtigsten Fachbegriffe
  - `legalBasis`: Relevante Gesetze (z.B. ["§286 BGB", "§288 BGB"])

### Stufe 2: Gezielte Quellenrecherche (`researchWithSources`)

- **Input:** Die Suchanfragen aus Stufe 1
- **Ablauf:**
  1. Alle `searchQueries` werden als Brave-Suchen ausgeführt
  2. Ergebnisse werden dedupliziert (nach URL)
  3. Top 4 Ergebnisse werden deep-fetched (HTML → Plaintext, max 3000 Zeichen)
  4. Zusätzlich wird die Standard-Berufsspezifische Suche (`searchBraveForTopic`) ausgeführt
- **Output:** `enrichedInfo` (Textblock für den Prompt) + `sources[]` (für Quellenverzeichnis)

### Stufe 3: Generierung mit Quellenverankerung

- **Modell:** Claude Sonnet (Hauptgenerierung)
- **Was die Pipeline dem Prompt hinzufügt** (via `PipelineContext` in `claude-prompt.ts`):
  - **Perspektive:** "Der Schüler ist: [Perspektive aus Stufe 1]" — muss durchgängig eingehalten werden
  - **Rechtsgrundlagen:** "Diese §§ MÜSSEN im Arbeitsblatt vorkommen"
  - **Schlüsselbegriffe:** "Diese Begriffe MÜSSEN in der Begriffe-Tabelle erscheinen"
  - **Quellenverankerung:** Claude soll ein `quellen`-Array im JSON ausgeben
  - **Roter Faden:** Einstiegsbeispiel (Teil 1) muss sich durch das gesamte Arbeitsblatt ziehen

### Stufe 4: Faktencheck (`factCheckWorksheet`)

- **Modell:** Claude Sonnet (unabhängige Prüfinstanz)
- **Prüft systematisch:**
  1. Stimmen alle Zahlen, Paragraphen, GOPs mit den Quelleninformationen überein?
  2. Gibt es Widersprüche zwischen Merke-Box, Schaubild und Aufgaben?
  3. Sind die Lösungen korrekt?
  4. Ist die Perspektive konsistent?
  5. Gibt es fachliche Ungenauigkeiten?
  6. Wird das Einstiegsbeispiel durchgezogen?
- **Output:** `{ passed: boolean, issues: [...] }`

### Stufe 5: Korrektur (`correctWorksheet`)

- **Nur wenn Stufe 4 Fehler findet**
- **Modell:** Claude Sonnet
- **Erhält:** Das Arbeitsblatt-JSON + die Issue-Liste + die Quelleninformationen
- **Korrigiert NUR die gefundenen Fehler**, ändert nichts anderes
- **Output:** Korrigiertes JSON (gleiche Struktur)

---

## Dateien & Codestruktur

| Datei | Rolle |
|-------|-------|
| `lib/quality-pipeline.ts` | Orchestrator: alle 5 Stufen + Typen |
| `lib/claude-prompt.ts` | `PipelineContext` Interface + Prompt-Erweiterungen |
| `lib/claude-client.ts` | `generateWorksheet()` akzeptiert optionalen `PipelineContext` |
| `lib/types.ts` | `WorksheetContent.quellen` Feld |
| `lib/docx-builder.ts` | `buildQuellenverzeichnis()` — Rendering im DOCX |
| `app/api/generate/route.ts` | Pipeline für Standard-Produkte eingebunden |
| `app/api/free-trial/route.ts` | Pipeline für Freiversuche eingebunden |

---

## Datenfluss

```
API Route (generate oder free-trial)
  │
  ├─ Premium + Blob?
  │   └─ Altes Verfahren: searchBraveForTopic → generateWorksheet (ohne Pipeline)
  │
  └─ Standard (kein Blob)?
      ├─ runQualityPipeline(topic, subject, schoolType, anthropic)
      │   ├─ Stufe 1: analyzeTopicWithSources → TopicAnalysis
      │   └─ Stufe 2: researchWithSources → enrichedInfo + sources
      │
      ├─ generateWorksheet(input, enrichedInfo, undefined, pipelineContext)
      │   └─ Stufe 3: Claude generiert JSON mit Quellen + Perspektive
      │
      ├─ factCheckWorksheet(json, enrichedInfo, analysis, anthropic)
      │   └─ Stufe 4: Unabhängiger Check
      │
      └─ (bei Fehlern) correctWorksheet(json, issues, enrichedInfo, anthropic)
          └─ Stufe 5: Korrektur
```

---

## Kosten pro Arbeitsblatt (Schätzung)

| Stufe | Modell | Input-Tokens | Output-Tokens | Kosten |
|-------|--------|-------------|---------------|--------|
| 1 | Haiku | ~500 | ~300 | ~$0.001 |
| 2 | - (Brave) | - | - | kostenlos (Free Tier) |
| 3 | Sonnet | ~6000 | ~4000 | ~$0.08 |
| 4 | Sonnet | ~8000 | ~500 | ~$0.03 |
| 5 | Sonnet (optional) | ~8000 | ~4000 | ~$0.08 |

**Ohne Korrektur: ~$0.11 | Mit Korrektur: ~$0.19** (vorher ~$0.08 ohne Pipeline)

---

## Wichtige Design-Entscheidungen

### Warum separate Modelle pro Stufe?
- Stufe 1 braucht nur Kategorisierung → Haiku reicht, spart Kosten
- Stufe 4 muss unabhängig prüfen → eigener Sonnet-Call, sieht die Generierung nicht

### Warum kein Pipeline für Premium?
- Premium hat bereits Lehrkraft-Material als Quelle → weniger Halluzinationsrisiko
- Aktualitätscheck via Brave reicht dort
- Kann später nachgerüstet werden

### Warum Object.assign statt Neuparse?
- Die Korrektur (Stufe 5) gibt ein korrigiertes JSON zurück
- `Object.assign(worksheetContent, corrected)` überschreibt nur die geänderten Felder
- Wenn das Korrektur-JSON nicht parsebar ist, wird das Original verwendet (Graceful Degradation)

### Roter Faden / Perspektive
- Problem: Einstiegsbeispiel (Teil 1) verschwand oft nach der Einleitung
- Lösung: Perspektive wird explizit in den Prompt injiziert + Regel "Personen aus Teil 1 durchziehen"
- Faktencheck prüft auch die Perspektiv-Konsistenz

---

## Rollback

Falls die Pipeline Probleme macht (zu langsam, zu teuer, API-Fehler):

```bash
# Letzter Stand vor Pipeline:
git revert 4882e1e
```

Die alte Logik (direkter `searchBraveForTopic` → `generateWorksheet`) funktioniert weiterhin, da alle Pipeline-Erweiterungen optional sind (`pipeline?: PipelineContext`).

---

## Offene Punkte / Nächste Schritte

- [ ] Premium-Produkte ebenfalls durch Pipeline schleusen
- [ ] Pipeline-Ergebnisse loggen (wie oft schlägt Faktencheck fehl? Welche Fehlertypen?)
- [ ] Aktualitätshinweise (`aktualitaetshinweise`) auch für Standard-Produkte aktivieren
- [ ] Timeout-Handling: Was passiert, wenn Stufe 4+5 zu lange dauern? (aktuell: maxDuration=60s)
- [ ] Quellenverzeichnis im DOCX: Aktuell als einfache Liste — evtl. als Fußnoten mit Verlinkung
