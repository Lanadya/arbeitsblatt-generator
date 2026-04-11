import { neon } from "@neondatabase/serverless";
import crypto from "crypto";

function getDb() {
  const url = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!url) throw new Error("POSTGRES_URL oder DATABASE_URL ist nicht gesetzt.");
  return neon(url);
}

// Known disposable email domains (extend as needed)
const DISPOSABLE_DOMAINS = new Set([
  "guerrillamail.com", "guerrillamailblock.com", "tempmail.com", "temp-mail.org",
  "throwaway.email", "mailinator.com", "yopmail.com", "sharklasers.com",
  "guerrillamail.info", "guerrillamail.de", "trashmail.com", "trashmail.me",
  "10minutemail.com", "minutemail.com", "dispostable.com", "maildrop.cc",
  "fakeinbox.com", "getairmail.com", "mailnesia.com", "tempail.com",
]);

const ALERT_EMAIL = process.env.ALERT_EMAIL || "ninaklee@icloud.com";
const DAILY_LIMIT = 100;       // hard cap
const ALERT_THRESHOLD = 50;    // send alert
const IP_HOURLY_LIMIT = 5;

function hashEmail(email: string): string {
  return crypto.createHash("sha256").update(email.toLowerCase().trim()).digest("hex");
}

export async function initFreeTrials() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS free_trials (
      id            SERIAL PRIMARY KEY,
      email_hash    TEXT NOT NULL UNIQUE,
      ip_address    TEXT,
      topic         TEXT,
      subject       TEXT,
      school_type   TEXT,
      created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      generated_at  TIMESTAMP WITH TIME ZONE,
      status        TEXT NOT NULL DEFAULT 'pending'
    )
  `;
}

/** Check if email is from a known disposable domain */
export function isDisposableEmail(email: string): boolean {
  const domain = email.toLowerCase().trim().split("@")[1];
  return DISPOSABLE_DOMAINS.has(domain);
}

/** Check if email has already been used for a free trial */
export async function isEmailUsed(email: string): Promise<boolean> {
  await initFreeTrials();
  const sql = getDb();
  const hash = hashEmail(email);
  const rows = await sql`SELECT id FROM free_trials WHERE email_hash = ${hash}`;
  return rows.length > 0;
}

/** Check IP rate limit (max per hour) */
export async function isIpLimited(ip: string): Promise<boolean> {
  await initFreeTrials();
  const sql = getDb();
  const rows = await sql`
    SELECT COUNT(*)::int AS cnt FROM free_trials
    WHERE ip_address = ${ip} AND created_at > NOW() - INTERVAL '1 hour'
  `;
  return (rows[0]?.cnt ?? 0) >= IP_HOURLY_LIMIT;
}

/** Check global daily limit */
export async function getDailyCount(): Promise<number> {
  await initFreeTrials();
  const sql = getDb();
  const rows = await sql`
    SELECT COUNT(*)::int AS cnt FROM free_trials
    WHERE created_at > NOW() - INTERVAL '24 hours'
  `;
  return rows[0]?.cnt ?? 0;
}

/** Create a free trial record, returns the trial ID */
export async function createFreeTrial(
  email: string,
  ip: string,
  topic: string,
  subject: string,
  schoolType: string
): Promise<string> {
  await initFreeTrials();
  const sql = getDb();
  const hash = hashEmail(email);
  const rows = await sql`
    INSERT INTO free_trials (email_hash, ip_address, topic, subject, school_type)
    VALUES (${hash}, ${ip}, ${topic}, ${subject}, ${schoolType})
    RETURNING id
  `;
  return `free_${rows[0].id}`;
}

/** Mark a free trial as generated */
export async function markTrialGenerated(trialId: string): Promise<void> {
  const id = parseInt(trialId.replace("free_", ""), 10);
  const sql = getDb();
  await sql`
    UPDATE free_trials SET status = 'generated', generated_at = NOW()
    WHERE id = ${id}
  `;
}

/** Get trial metadata by ID */
export async function getTrialData(trialId: string): Promise<{
  topic: string; subject: string; schoolType: string;
} | null> {
  const id = parseInt(trialId.replace("free_", ""), 10);
  const sql = getDb();
  const rows = await sql`
    SELECT topic, subject, school_type FROM free_trials
    WHERE id = ${id} AND status = 'pending'
  `;
  if (rows.length === 0) return null;
  return { topic: rows[0].topic, subject: rows[0].subject, schoolType: rows[0].school_type };
}

/** Send alert if threshold reached (simple console + optional email) */
export async function checkAndAlert(dailyCount: number): Promise<void> {
  if (dailyCount < ALERT_THRESHOLD) return;

  console.warn(`[FREE-TRIAL ALERT] ${dailyCount} Freiversuche heute! Schwelle: ${ALERT_THRESHOLD}`);

  // Send alert email via simple fetch to a mail API if configured
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "alerts@arbeitsblatt-generator.com",
          to: ALERT_EMAIL,
          subject: `[Alert] ${dailyCount} Freiversuche heute`,
          text: `Es wurden heute ${dailyCount} kostenlose Arbeitsblätter generiert.\n\nTageslimit: ${DAILY_LIMIT}\nAlert-Schwelle: ${ALERT_THRESHOLD}\n\nDas ist eine automatische Benachrichtigung.`,
        }),
      });
    } catch (err) {
      console.error("Alert email failed:", err);
    }
  }
}

export { DAILY_LIMIT };
