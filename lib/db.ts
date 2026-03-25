import { neon } from "@neondatabase/serverless";

function getDb() {
  const url = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!url) {
    throw new Error("POSTGRES_URL oder DATABASE_URL ist nicht gesetzt.");
  }
  return neon(url);
}

let initialized = false;

export async function initDb() {
  if (initialized) return;
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id            SERIAL PRIMARY KEY,
      stripe_session TEXT UNIQUE NOT NULL,
      topic         TEXT NOT NULL,
      subject       TEXT NOT NULL,
      school_type   TEXT NOT NULL,
      status        TEXT NOT NULL DEFAULT 'paid',
      error_message TEXT,
      created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      delivered_at  TIMESTAMP WITH TIME ZONE
    )
  `;
  initialized = true;
}

export async function createOrder(
  sessionId: string,
  topic: string,
  subject: string,
  schoolType: string
): Promise<void> {
  await initDb();
  const sql = getDb();
  // ON CONFLICT: if session already exists (e.g. retry after failure), update status to generating
  await sql`
    INSERT INTO orders (stripe_session, topic, subject, school_type, status)
    VALUES (${sessionId}, ${topic}, ${subject}, ${schoolType}, 'generating')
    ON CONFLICT (stripe_session)
    DO UPDATE SET status = 'generating', error_message = NULL
    WHERE orders.status != 'delivered'
  `;
}

export async function markDelivered(sessionId: string): Promise<void> {
  await initDb();
  const sql = getDb();
  await sql`
    UPDATE orders
    SET status = 'delivered', delivered_at = NOW()
    WHERE stripe_session = ${sessionId}
  `;
}

export async function markFailed(sessionId: string, error: string): Promise<void> {
  await initDb();
  const sql = getDb();
  await sql`
    UPDATE orders
    SET status = 'failed', error_message = ${error}
    WHERE stripe_session = ${sessionId}
  `;
}

export async function isSessionUsed(sessionId: string): Promise<boolean> {
  await initDb();
  const sql = getDb();
  const rows = await sql`
    SELECT status FROM orders
    WHERE stripe_session = ${sessionId} AND status = 'delivered'
  `;
  return rows.length > 0;
}
