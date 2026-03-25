# MFA-Abrechnung: EBM & GOÄ — Recherche für Prompt-Optimierung

## Stand: 25.03.2026

---

## 1. Zwei Abrechnungssysteme

| | EBM | GOÄ |
|--|-----|-----|
| **Für wen?** | GKV-Patienten (gesetzlich versichert) | PKV-Patienten (privat versichert) |
| **Wer gibt das raus?** | KBV (Kassenärztliche Bundesvereinigung) | Bundesregierung (Rechtsverordnung) |
| **Aktualisierung** | Quartalsweise | Sehr selten (aktuell von 1996, Reform geplant 2027/2028) |
| **Bewertung** | Punkte × Orientierungswert | Euro-Betrag × Steigerungsfaktor |
| **Prüfungsrelevanz** | Hoch (Betriebsorganisation, 120 Min.) | Hoch (Betriebsorganisation, 120 Min.) |

---

## 2. EBM — Aktuelle Zahlen 2026

### Orientierungswert
- **12,7404 Cent pro Punkt** (Stand 1.1.2026)
- Steigerung: +2,8% gegenüber Vorjahr
- Quelle: Gelbe Liste / KBV

### Wichtige GOPs (Gebührenordnungspositionen) für MFA-Unterricht
| GOP | Bezeichnung | Punkte | Euro (ca.) |
|-----|-------------|--------|------------|
| 03000 | Versichertenpauschale Hausarzt | 92 | 11,72€ |
| 03004 | Zuschlag Versichertenpauschale | 31 | 3,95€ |
| 01100 | Unvorhergesehene Inanspruchnahme | 88 | 11,21€ |
| 01430 | Verwaltungskomplex | 11 | 1,40€ |
| 32001 | Labor: Wirtschaftlichkeitsbonus | - | variabel |

### Berechnung (Prüfungsformat):
```
Vergütung = Punkte × Orientierungswert
Beispiel: GOP 03000 = 92 Punkte × 0,127404€ = 11,72€
```

### Änderungen 2026:
- GOP 01444 (neu): Videosprechstunden-Authentifizierung
- GOP 01643 (neu): Notfalldatensatz-Update
- TI-Pauschale: +2,8% erhöht

---

## 3. GOÄ — Aktueller Stand

### Steigerungsfaktoren (PRÜFUNGSRELEVANT!)
| Leistungsart | Einfachsatz | Regelhöchstsatz | Höchstsatz |
|---|---|---|---|
| Persönliche Leistung | 1,0× | 2,3× | 3,5× |
| Technische Leistung | 1,0× | 1,8× | 2,5× |
| Laborleistung | 1,0× | 1,15× | 1,3× |

### Berechnung (Prüfungsformat):
```
Vergütung = GOÄ-Ziffer-Wert × Steigerungsfaktor
Beispiel: Ziffer 5 (Symptomzentrierte Untersuchung) = 10,73€ × 2,3 = 24,68€
```

### GOÄ-Reform:
- Aktueller Stand: Entwurf vom 129. Ärztetag (2025) gebilligt
- Bundesgesundheitsministerin: Regelungsentwurf Mitte 2026 angekündigt
- Realistisches Inkrafttreten: 01.01.2027 oder 01.01.2028
- Änderungen: Digitale Leistungen neu, sprechende Medizin aufgewertet
- **Für Unterricht:** Aktuell noch alte GOÄ unterrichten, neue GOÄ als Ausblick

---

## 4. Weitere Abrechnungssysteme (MFA-relevant)

| System | Für wen | Anwendung |
|--------|---------|-----------|
| **BEL** (Bundeseinheitliches Leistungsverzeichnis) | GKV-Zahnarzt | Zahntechnische Leistungen |
| **BEMA** (Bewertungsmaßstab zahnärztlicher Leistungen) | GKV-Zahnarzt | Zahnärztliche Behandlung |
| **BG-Abrechnung** | Berufsgenossenschaft | Arbeitsunfälle |

→ BEL/BEMA primär für ZFA, aber MFA sollten wissen, dass es existiert.

---

## 5. Was Brave Search zuverlässig liefern kann

| Datentyp | Suchbegriff für Brave | Zuverlässigkeit |
|----------|----------------------|-----------------|
| Orientierungswert aktuell | "EBM Orientierungswert [Jahr]" | ✅ Hoch — steht auf vielen Seiten |
| Einzelne GOP mit Punktwert | "EBM GOP 03000 Punkte" | ⚠️ Mittel — nicht immer aktuell |
| GOÄ-Steigerungsfaktoren | "GOÄ Steigerungsfaktor Regelhöchstsatz" | ✅ Hoch — ändern sich selten |
| GOÄ-Einzelne Ziffern | "GOÄ Ziffer 5 Betrag" | ⚠️ Mittel |
| GOÄ-Reform-Stand | "GOÄ Reform aktuell [Jahr]" | ✅ Hoch |

### Empfehlung für Brave-Query-Optimierung:
Wenn Thema "Abrechnung" oder "EBM" oder "GOÄ" erkannt wird:
```
Suche 1: "EBM Orientierungswert [aktuelles Jahr] Cent Punkt"
Suche 2: "[Thema] MFA Prüfung Abrechnung Beispiel"
```

---

## 6. Pain Points der Lehrkräfte bei Abrechnung

1. **Orientierungswert ändert sich jährlich** → Schulbücher veralten sofort
2. **GOÄ-Reform in der Schwebe** → Unsicherheit, was unterrichtet werden soll
3. **Neue GOPs** (Videosprechstunde etc.) → stehen in keinem Lehrbuch
4. **Schüler können nicht rechnen** → Prozentrechnung, Dreisatz fehlen
5. **Kein Praxisbezug** → Schüler sehen Abrechnungen erst im Betrieb

### Unser USP:
- Arbeitsblatt mit **aktuellem Orientierungswert** (via Brave Search)
- **Rechenaufgaben mit echten Zahlen** (GOP × Orientierungswert)
- **Fallbeispiele aus dem Praxisalltag** (Patient kommt, welche GOP?)
- Hinweis: "Schlage die Ziffer im EBM-Verzeichnis deiner Praxis nach"

---

## 7. Vorschlag: Prompt-Erweiterung für Abrechnungsthemen

Wenn Thema = Abrechnung/EBM/GOÄ UND Schulform = MFA:

### Level 1 (Ankreuzen):
- EBM oder GOÄ? Zuordnung GKV/PKV
- Was ist der Orientierungswert?
- Wer gibt den EBM heraus?

### Level 2 (Lückentext):
- "Der Orientierungswert beträgt aktuell _______ Cent pro Punkt."
- "Für GKV-Patienten rechnet die Praxis nach dem _______ ab."
- "Der GOÄ-Regelhöchstsatz für persönliche Leistungen ist _______"

### Level 3 (Berechnung + Transfer):
- "Frau Müller (GKV) kommt zur Untersuchung. Der Arzt rechnet GOP 03000 ab (92 Punkte). Berechne die Vergütung." → 92 × 0,127404 = 11,72€
- "Herr Schmidt (PKV) bekommt eine Untersuchung nach GOÄ Ziffer 5 (10,73€). Der Arzt wählt Faktor 2,3. Berechne."
- "Warum bekommt der Arzt für denselben Patienten nicht immer gleich viel Geld?"

---

## Quellen
- KBV EBM: https://www.kbv.de/html/ebm.php
- Gelbe Liste EBM 2026: https://www.gelbe-liste.de/allgemeinmedizin/abrechnung-2026-orientierungswert-ti-pauschale-hybrid-drg-ebm-updates
- GOÄ Reform: https://www.bundesaerztekammer.de/themen/aerzte/honorar/goae-novellierung
- GOÄ Ziffern: https://abrechnungsstelle.com/goae/ziffern/
- StudySmarter MFA: https://www.studysmarter.de/ausbildung/mfa/patientenbetreuung/abrechnung-mfa/
