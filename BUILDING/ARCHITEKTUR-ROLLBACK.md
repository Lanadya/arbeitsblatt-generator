# Architektur & Rollback-Guide

## Letzte stabile Versionen

| Was | Commit | Datum | Beschreibung |
|-----|--------|-------|-------------|
| **Vor Multi-Beruf** | `2751838` | 2026-04-07 | Letzter Stand "nur MFA", alles hardcoded, produktiv getestet |
| **Multi-Beruf Infrastruktur** | `433ff9b` | 2026-04-07 | Config-System steht, MFA rückwärtskompatibel, UI noch nicht geändert |
| **Multi-Beruf UI** | *(nächster Commit)* | 2026-04-07 | Dynamische Dropdowns, optgroup, beruf-abhängige Fächer+Tags |

## Rollback-Befehle

### Komplett zurück auf "nur MFA" (nuklear):
```bash
git reset --hard 2751838
```

### Nur den letzten Commit rückgängig machen:
```bash
git revert HEAD
```

### Nur UI-Änderungen rückgängig (Config behalten):
```bash
git checkout 433ff9b -- components/worksheet-form.tsx
```

---

## Wo liegt was?

### Config-System (NEU)
```
config/berufe/
├── _schema.ts          ← TypeScript-Interface für BerufConfig
├── index.ts            ← Registry: alle Berufe + Schultypen
├── mfa.ts              ← MFA-Config (extrahiert aus altem claude-prompt.ts)
├── pflege.ts           ← Pflege-Config (aus Cowork-01 Research)
└── einzelhandel.ts     ← Einzelhandel-Config (aus Cowork-05 Research)
```

### Zentrales Modul
```
lib/beruf-config.ts     ← Lookup, Lernfeld-Resolver, resolveBerufId()
```

### Refactored (bestehende Dateien)
```
lib/claude-prompt.ts    ← Nutzt jetzt beruf-config statt hardcoded MFA_LERNFELD_MAP
lib/brave-search.ts     ← Dynamische Keywords + Trusted Domains aus Config
lib/types.ts            ← SUBJECT_OPTIONS + SCHOOL_TYPE_OPTIONS als statische Fallbacks
```

### UI (ERLEDIGT)
```
components/worksheet-form.tsx  ← Dynamische Dropdowns aus beruf-config.ts
                                  Schulform (optgroup) → Fachgebiet (dynamisch) → Thema (dynamische Tags)
                                  Sendet beruf-ID statt Label-String
```

### Research & Planung
```
BUILDING/
├── OVERVIEW.md                 ← Master-Übersicht
├── ARCHITEKTUR-ROLLBACK.md     ← Diese Datei
├── Cowork-01_Pflege-Lehrplaene/    ← Lernfeld-Daten, Keyword-Mappings
├── Cowork-02_Berufskolleg-Koeln/   ← MöFa Schulprofil + Demo-Vorschläge
├── Cowork-03_Kostenmodell-Lizenzen/ ← Pricing, Credits, Tech-Absicherung
├── Cowork-04_Foerderschule-Strategie/ ← 5 von 7 machbar
├── Cowork-05_Kaufmaennische-Berufe/   ← Einzelhandel + Büro Lernfelder
└── Cowork-06_Tech-Integration/        ← Ist-Analyse, Architektur, Migration-Plan
```

---

## Wie funktioniert das Config-System?

### Neuen Beruf hinzufügen:
1. Neue Datei `config/berufe/neuer-beruf.ts` erstellen (siehe `mfa.ts` als Template)
2. In `config/berufe/index.ts` importieren und zum `alleBerufe`-Array hinzufügen
3. Fertig — Lernfeld-Matching, Brave-Search und Prompt-Erweiterungen greifen automatisch

### Minimale Config (ohne Lernfelder):
Nur `id`, `label`, `kurz`, `kategorie` und `faecher` sind Pflicht. Alles andere ist optional.
Schultypen ohne Lernfeld-Maps (Hauptschule, DaZ, Förderschule) stehen in `weitereSchultypen` in `index.ts`.

### Rückwärtskompatibilität:
`resolveBerufId()` in `lib/beruf-config.ts` mappt alte `schoolType`-Strings (z.B. "MFA (Medizinische Fachangestellte)") auf neue IDs ("mfa"). Das heißt:
- Bestehende API-Calls funktionieren weiter
- Stripe-Metadata mit alten Labels funktioniert weiter
- Keine DB-Migration nötig

---

## Kosten der Änderung

- **0 neue Dependencies** — nur TypeScript-Dateien
- **0 DB-Änderungen** — bestehende `orders`-Tabelle unverändert
- **0 API-Breaking-Changes** — schoolType wird weiterhin als String akzeptiert
