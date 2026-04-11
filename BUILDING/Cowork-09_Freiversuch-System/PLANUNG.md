# Cowork-09: Freiversuch-System (1 Gratis-Blatt gegen E-Mail)

## Ziel

Potenzielle Kunden können **1 kostenloses Arbeitsblatt generieren**, indem sie ihre E-Mail-Adresse angeben. Danach müssen sie kaufen (oder später: Abo). Das dient der Lead-Generierung und Kostenkontrolle.

---

## Entscheidungen (alle getroffen)

- [x] E-Mail-Pflicht für Freiversuch
- [x] 1 Versuch pro E-Mail-Adresse
- [x] **Volles Standard-Blatt** — volle Qualität, 3 Level + Lösungen. Premium bleibt zahlungspflichtig.
- [x] **Kein Wasserzeichen** (.docx ist editierbar, bringt nichts)
- [x] **Kein Newsletter, kein Marketing** — E-Mail nur für Duplikat-Check (SHA256-Hash). Kein Spam.
- [x] **Single-Opt-In** — kein Double-Opt-In nötig, da keine Marketing-Mails
- [x] **Alert-Schwelle: >50/Tag** — E-Mail an ninaklee@icloud.com (via Resend, falls RESEND_API_KEY gesetzt)
- [x] **Eigene DB** — free_trials-Tabelle in NeonDB, kein externer E-Mail-Anbieter
- [x] **Eigene `/gratis`-Seite** — separater Einstieg für Marketing-Links

---

## Implementierte Dateien

### Neu erstellt
```
app/gratis/page.tsx              ← Landing Page mit Header, Benefits, Formular, Footer-CTA
components/free-trial-form.tsx   ← Eigenständiges Formular (E-Mail + Schulform/Fach/Thema)
app/api/free-trial/route.ts      ← API-Endpoint: Validierung → Abuse-Check → Generierung → .docx-Download
lib/free-trial.ts                ← DB-Logik: Hash, Duplikat-Check, Rate-Limiting, Alerts
BUILDING/Cowork-09_Freiversuch-System/PLANUNG.md  ← Diese Datei
```

### Bestehende Dateien — NICHT geändert
Der Freiversuch nutzt die gleiche Generierungs-Pipeline wie der Kaufprozess (`generateWorksheet`, `buildDocxBuffer`, `searchBraveForTopic`), hat aber einen eigenen API-Endpoint. Die bestehende `/api/generate`-Route und `worksheet-form.tsx` wurden nicht angefasst.

---

## DB-Schema (NeonDB, auto-erstellt via `initFreeTrials()`)

```sql
CREATE TABLE IF NOT EXISTS free_trials (
  id            SERIAL PRIMARY KEY,
  email_hash    TEXT NOT NULL UNIQUE,     -- SHA256 der E-Mail (lowercase, trimmed)
  ip_address    TEXT,
  topic         TEXT,
  subject       TEXT,                     -- Fachgebiet
  school_type   TEXT,                     -- Beruf-ID (z.B. "mfa", "pflege")
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  generated_at  TIMESTAMP WITH TIME ZONE, -- NULL bis Blatt generiert
  status        TEXT NOT NULL DEFAULT 'pending'  -- pending | generated
);
```

**Hinweis:** Die Tabelle wird beim ersten Request automatisch erstellt (`initFreeTrials()`). Keine manuelle Migration nötig.

---

## Missbrauchs-Schutz

| Schutzmaßnahme | Konfiguration | Datei |
|---|---|---|
| 1 Versuch pro E-Mail | SHA256-Hash, case-insensitive | `lib/free-trial.ts` → `isEmailUsed()` |
| Rate-Limit pro IP | max 5/Stunde | `lib/free-trial.ts` → `isIpLimited()` (IP_HOURLY_LIMIT=5) |
| Globales Tageslimit | max 100/Tag | `lib/free-trial.ts` → `getDailyCount()` (DAILY_LIMIT=100) |
| Wegwerf-Mail-Block | ~20 bekannte Domains | `lib/free-trial.ts` → `isDisposableEmail()` |
| Alert bei hoher Nutzung | >50/Tag → E-Mail an ninaklee@icloud.com | `lib/free-trial.ts` → `checkAndAlert()` (ALERT_THRESHOLD=50) |

---

## Flow

```
1. User besucht /gratis
2. User füllt Formular aus: E-Mail + Schulform + Fachgebiet + Thema
3. POST /api/free-trial
   → Validierung: E-Mail, Thema (min 3 Zeichen), Schulform, Fachgebiet
   → Wegwerf-Mail? → 400 "Bitte reguläre E-Mail verwenden"
   → E-Mail schon genutzt? → 409 "Bereits genutzt, weitere ab 4,99 €"
   → IP-Limit? → 429 "Zu viele Anfragen"
   → Tageslimit? → 429 "Kontingent aufgebraucht"
   → DB-Eintrag erstellen
   → Alert prüfen (>50 → E-Mail an Nina)
   → Brave-Search für aktuelle Infos
   → Claude-Generierung (Standard-Qualität)
   → DOCX bauen
   → DB-Status → 'generated'
   → .docx als Download zurückgeben
4. Erfolgs-Ansicht: "Dein Arbeitsblatt wurde heruntergeladen!"
   → CTA: "Weitere Arbeitsblätter erstellen" (Link zu /)
```

---

## Kostenkontrolle

- API-Kosten pro Freiversuch: ~0,03-0,05 EUR (Claude Sonnet) + ~0,001 EUR (Brave Search)
- Bei 50 Freiversuchen/Tag: ~2,50 EUR/Tag = ~75 EUR/Monat
- Bei 100/Tag (Worst Case): ~5 EUR/Tag = ~150 EUR/Monat
- **Tageslimit 100 = harter Deckel bei ~150 EUR/Monat**

---

## Rollback

- Commit: `75a47f7` (feat: Freiversuch-System)
- Vorheriger Stand: `8097db0`
- Rückgängig: `git revert 75a47f7 && git push`
- Keine bestehenden Dateien geändert → Revert hat kein Risiko für andere Features

---

## Env-Variablen

| Variable | Pflicht? | Zweck |
|---|---|---|
| `POSTGRES_URL` oder `DATABASE_URL` | Ja | NeonDB-Verbindung (bereits vorhanden) |
| `ANTHROPIC_API_KEY` | Ja | Claude-Generierung (bereits vorhanden) |
| `BRAVE_API_KEY` | Ja | Brave-Search (bereits vorhanden) |
| `RESEND_API_KEY` | Optional | Alert-E-Mails versenden. Ohne: nur Console-Warnung |

---

## Status

STATUS: IMPLEMENTIERT UND DEPLOYED (2026-04-11, Commit 75a47f7)
