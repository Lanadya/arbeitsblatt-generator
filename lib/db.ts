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
      product_type  TEXT NOT NULL DEFAULT 'standard',
      status        TEXT NOT NULL DEFAULT 'paid',
      error_message TEXT,
      feedback      TEXT,
      created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      delivered_at  TIMESTAMP WITH TIME ZONE
    )
  `;
  // Add columns if table already exists (migration)
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS product_type TEXT DEFAULT 'standard'`;
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS feedback TEXT`;
  initialized = true;
}

export async function createOrder(
  sessionId: string,
  topic: string,
  subject: string,
  schoolType: string,
  productType: string = "standard"
): Promise<void> {
  await initDb();
  const sql = getDb();
  await sql`
    INSERT INTO orders (stripe_session, topic, subject, school_type, product_type, status)
    VALUES (${sessionId}, ${topic}, ${subject}, ${schoolType}, ${productType}, 'generating')
    ON CONFLICT (stripe_session)
    DO UPDATE SET status = 'generating', error_message = NULL
    WHERE orders.status != 'delivered'
  `;
}

export async function saveFeedback(sessionId: string, feedback: string): Promise<void> {
  await initDb();
  const sql = getDb();
  await sql`
    UPDATE orders SET feedback = ${feedback}
    WHERE stripe_session = ${sessionId}
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

export async function updateOrderTopic(sessionId: string, topic: string): Promise<void> {
  await initDb();
  const sql = getDb();
  await sql`
    UPDATE orders SET topic = ${topic}
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
