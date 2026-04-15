# BUILDING — Arbeitsblatt-Generator Expansion

## Stand: 2026-04-07

## Vision
Den Arbeitsblatt-Generator von einem MFA-fokussierten Einzelprodukt zu einer Plattform für alle Ausbildungsberufe an Berufsschulen ausbauen — mit Abo-Modell, echten Lehrplan-Daten und nachhaltiger Kostenstruktur.

---

## Cowork-Übersicht

| Nr | Name | Aufgabe | Status |
|----|------|---------|--------|
| 01 | Pflege-Lehrpläne | Rahmenlehrpläne Pflegefachfrau/-mann + Pflegehilfe aufarbeiten, Lernfeld-Mapping erstellen (analog MFA) | 🟡 Dateien fertig, STATUS.md fehlt |
| 02 | Berufskolleg Köln | Berufskolleg Köln-Lindenthal recherchieren (Möbel + kaufmännisch), Bewerbungs-Demo vorbereiten | 🟡 Dateien fertig, STATUS.md fehlt |
| 03 | Kostenmodell Lizenzen | Abo-Preise kalkulieren inkl. API-Kosten (Claude, Brave), Break-Even berechnen, Fair-Use-Limits definieren | ✅ FERTIG |
| 04 | Förderschule-Strategie | Förderschule als Zielgruppe bewerten: Was geht, was nicht? Alternatives Produktformat konzipieren | ✅ FERTIG |
| 05 | Kaufmännische Berufe | Top-5 kaufmännische Ausbildungsberufe: Lehrpläne, IHK-Prüfungsthemen, Lernfeld-Mapping | ✅ FERTIG |
| 06 | Tech-Integration | Technische Umsetzung: Multi-Beruf-Support in Prompt + UI, neues Lernfeld-System | ✅ FERTIG |
| 07 | Marketing-Strategie | Marketing-Ansätze für Berufsschulen und Lehrkräfte | 🟡 In Arbeit |
| 08 | Schulformen-Analyse | Analyse weiterer Schulformen für Expansion | 🟡 In Arbeit |
| 09 | Freiversuch-System | 1 kostenloses Arbeitsblatt gegen E-Mail (Lead-Generierung) | ✅ FERTIG |
| 10 | DOCX-Design-Redesign | Verlagslook: Typografie, Layout, Kopfbereich, Kopierfestigkeit | ✅ FERTIG |
| 11 | Qualitätspipeline | 5-Stufen-Faktencheck: Analyse → Recherche → Generierung → Check → Korrektur | ✅ FERTIG |

---

## Wichtige Entscheidungen

### Förderschule: RAUS (vorerst)
Förderschule-Schüler können oft nicht lesen. Unser 7-Schritte-Textformat funktioniert dort nicht. Entweder komplett anderes Produkt (Bildkarten? Audio?) oder vorerst nicht bedienen. → Cowork-04 klärt die Optionen.

### Kosten bei Flatrate
Claude Sonnet 4: ~$3 input / $15 output pro 1M Tokens. Ein Arbeitsblatt ≈ 4K-8K Output-Tokens → ~$0.06-$0.12 pro Blatt. Bei 9,99€/Monat Abo und 50 Blättern/Monat = ~$6 API-Kosten. Machbar, aber braucht Fair-Use-Limit. → Cowork-03 rechnet durch.

### Neue Berufe = Neue Lernfelder
Jeder Ausbildungsberuf hat eigene Lernfelder (KMK-Rahmenlehrplan). Diese müssen in `lib/claude-prompt.ts` als Context-Maps hinterlegt werden (wie aktuell für MFA). → Cowork-01, 05, 06.

---

## Arbeitsweise

- Jede Cowork hat einen eigenen Unterordner mit `AUFTRAG.md`
- Ergebnisse werden als Markdown-Dateien im jeweiligen Ordner abgelegt
- Dieses OVERVIEW.md wird aktualisiert, wenn Coworks Ergebnisse liefern
- Brain (Hauptsession) checkt regelmäßig alle Ordner und integriert

---

## Nächste Schritte
1. ~~Cowork-Aufträge finalisieren~~ ✅
2. ~~Research-Ergebnisse (Pflege, Kaufmännisch, Berufskolleg) einfließen lassen~~ ✅
3. Cowork-01 + 02 abschließen (nur noch STATUS.md)
4. **CODE BAUEN:** Multi-Beruf-Infrastruktur gemäß Cowork-06 Architektur implementieren
   - Phase 1: `config/berufe/` Ordner + Schema + MFA-Config extrahieren
   - Phase 2: `lib/beruf-config.ts` Modul + Refactoring `claude-prompt.ts`
   - Phase 3: Pflege + Kaufmännisch-Configs aus Research-Ergebnissen
   - Phase 4: UI-Anpassung (Beruf-Dropdown, dynamische Fächer)
