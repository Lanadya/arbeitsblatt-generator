# Cowork-09: Freiversuch-System (1 Gratis-Blatt gegen E-Mail)

## Ziel

Potenzielle Kunden können **1 kostenloses Arbeitsblatt generieren**, indem sie ihre E-Mail-Adresse angeben. Danach müssen sie kaufen (oder später: Abo). Das dient der Lead-Generierung und Kostenkontrolle.

---

## Entscheidungen

### Entschieden
- [x] E-Mail-Pflicht für Freiversuch
- [x] 1 Versuch pro E-Mail-Adresse
- [x] Alert an Nina bei ungewöhnlicher Nutzung
- [x] Kein Wasserzeichen (.docx ist editierbar, bringt nichts)

### Entschieden (von Nina)
- [x] **Volles Standard-Blatt** (Option C) — volle Qualität, 3 Level + Lösungen. Premium bleibt zahlungspflichtig.
- [x] **Kein Newsletter, kein Marketing** — E-Mail nur für Freiversuch-Duplikat-Check. Kein Spam.
- [x] **Single-Opt-In** — kein Double-Opt-In nötig, da keine Marketing-Mails.
- [x] **Alert-Schwelle: >50/Tag** — E-Mail an ninaklee@icloud.com
- [x] **Eigene DB** — free_trials-Tabelle in NeonDB, kein externer E-Mail-Anbieter.
- [x] **Eigene `/gratis`-Seite** — separater Einstieg für Marketing-Links.

---

## Technische Architektur

### Neue Dateien
```
app/gratis/page.tsx              ← Landing Page für Freiversuch
app/api/free-trial/route.ts      ← E-Mail prüfen, Token generieren
lib/free-trial.ts                ← DB-Logik: E-Mail-Check, Rate-Limiting, Alerts
```

### Bestehende Dateien (Änderungen)
```
app/api/generate/route.ts        ← Freiversuch-Token als Alternative zu Stripe-Session
components/worksheet-form.tsx    ← Gratis-Modus (E-Mail statt Checkout)
lib/db.ts                        ← Neue Tabelle: free_trials
```

### DB-Schema (NeonDB)
```sql
CREATE TABLE free_trials (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  email_hash TEXT NOT NULL UNIQUE,    -- SHA256, für Duplikat-Check ohne Klartext zu speichern
  ip_address TEXT,
  topic TEXT,
  school_type TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  generated_at TIMESTAMP,             -- NULL bis Blatt generiert
  status TEXT DEFAULT 'pending'        -- pending | generated | expired
);

CREATE INDEX idx_free_trials_email_hash ON free_trials(email_hash);
CREATE INDEX idx_free_trials_created_at ON free_trials(created_at);
```

### Missbrauchs-Schutz
1. **1 Versuch pro E-Mail** (Hash-basiert, case-insensitive)
2. **Rate-Limit pro IP**: max 5 Freiversuche/Stunde pro IP
3. **Globales Tageslimit**: max 100 Freiversuche/Tag (konfigurierbar)
4. **Wegwerf-Mail-Erkennung**: Block bekannter Disposable-Domains (guerrillamail, tempmail, etc.)
5. **Alert**: E-Mail an Nina wenn Tageslimit >50 erreicht

### Flow
```
1. User besucht /gratis (oder sieht "1× kostenlos testen" im Formular)
2. User füllt Formular aus: Schulform + Fach + Thema + E-Mail
3. POST /api/free-trial
   → Prüfe: E-Mail schon genutzt? → Fehler "Du hast deinen Freiversuch bereits genutzt"
   → Prüfe: IP-Rate-Limit? → Fehler "Zu viele Anfragen"
   → Prüfe: Wegwerf-Mail? → Fehler "Bitte verwende deine Schul-E-Mail"
   → Prüfe: Tageslimit? → Fehler "Heute nicht mehr verfügbar, versuche es morgen"
   → OK: Speichere in DB, generiere Token
4. Generierung läuft (gleiche Pipeline wie Kauf, ohne Stripe)
5. User bekommt .docx zum Download
6. Danach: "Hat dir das Arbeitsblatt gefallen? Weitere ab 4,99 €" + CTA
```

---

## Aufwand-Schätzung

| Baustein | Aufwand |
|----------|---------|
| DB-Migration (free_trials Tabelle) | 15 Min |
| `/api/free-trial` Route | 1-2 Std |
| `/gratis` Landing Page | 1 Std |
| Worksheet-Form Gratis-Modus | 1 Std |
| Generate-Route: Freiversuch-Token akzeptieren | 30 Min |
| Missbrauchs-Schutz (Rate-Limit, Disposable-Check) | 1 Std |
| Alert-System (E-Mail an Nina) | 30 Min |
| Testen | 1 Std |
| **Gesamt** | **~6-8 Std** |

---

## Kostenkontrolle

- API-Kosten pro Freiversuch: ~0,03-0,05 EUR (Claude Sonnet) + ~0,001 EUR (Brave Search)
- Bei 50 Freiversuchen/Tag: ~2,50 EUR/Tag = ~75 EUR/Monat
- Bei 100/Tag (Worst Case): ~5 EUR/Tag = ~150 EUR/Monat
- **Tageslimit 100 = harter Deckel bei ~150 EUR/Monat**

---

## Status

STATUS: IMPLEMENTIERT — alle Entscheidungen getroffen, Code gebaut.
