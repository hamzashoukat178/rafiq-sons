import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;

export const hasDb = Boolean(url);
export const sql = url ? neon(url) : null;

let initPromise: Promise<void> | null = null;

export function ensureTables() {
  if (!sql) return Promise.resolve();
  if (!initPromise) {
    initPromise = (async () => {
      await sql`CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        type TEXT NOT NULL DEFAULT 'enquiry',
        name TEXT,
        email TEXT,
        phone TEXT,
        product TEXT,
        quantity TEXT,
        message TEXT,
        meta JSONB DEFAULT '{}'::jsonb,
        status TEXT NOT NULL DEFAULT 'new',
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
      await sql`CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        lead_id INTEGER REFERENCES leads(id),
        product TEXT,
        quantity TEXT,
        price TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        meta JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
      await sql`CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        slug TEXT UNIQUE,
        name TEXT,
        position INTEGER DEFAULT 0
      )`;
      await sql`CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        slug TEXT UNIQUE,
        category_slug TEXT,
        name TEXT,
        tag TEXT,
        description TEXT,
        detail TEXT,
        image TEXT,
        price_from TEXT,
        guessed_price BOOLEAN DEFAULT TRUE,
        position INTEGER DEFAULT 0,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
      await sql`CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        quote TEXT,
        name TEXT,
        role TEXT,
        city TEXT,
        sample BOOLEAN DEFAULT TRUE,
        position INTEGER DEFAULT 0
      )`;
      await sql`CREATE TABLE IF NOT EXISTS site_content (
        key TEXT PRIMARY KEY,
        value JSONB,
        guessed BOOLEAN DEFAULT FALSE,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
    })().catch((e) => {
      console.error("DB init failed", e);
      initPromise = null;
    });
  }
  return initPromise;
}

export async function getContent<T>(key: string): Promise<T | null> {
  if (!sql) return null;
  try {
    await ensureTables();
    const rows = await sql`SELECT value FROM site_content WHERE key = ${key}`;
    return rows.length ? (rows[0].value as T) : null;
  } catch {
    return null;
  }
}

export async function setContent(key: string, value: unknown, guessed = false) {
  if (!sql) throw new Error("Database not configured");
  await ensureTables();
  await sql`INSERT INTO site_content (key, value, guessed, updated_at)
    VALUES (${key}, ${JSON.stringify(value)}, ${guessed}, now())
    ON CONFLICT (key) DO UPDATE SET value = ${JSON.stringify(value)}, guessed = ${guessed}, updated_at = now()`;
}
