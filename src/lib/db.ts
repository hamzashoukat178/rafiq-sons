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
      await sql`CREATE TABLE IF NOT EXISTS analytics_events (
        id SERIAL PRIMARY KEY,
        event TEXT NOT NULL DEFAULT 'pageview',
        path TEXT NOT NULL DEFAULT '/',
        country TEXT DEFAULT 'Unknown',
        city TEXT DEFAULT 'Unknown',
        referrer TEXT,
        user_agent TEXT,
        device TEXT DEFAULT 'desktop',
        visitor_id TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
      await sql`CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_events(created_at)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_analytics_country ON analytics_events(country)`;
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

export async function recordPageView(data: {
  path: string;
  country: string;
  city: string;
  referrer: string;
  userAgent: string;
  device: string;
  visitorId: string;
}) {
  if (!sql) return;
  try {
    await ensureTables();
    await sql`INSERT INTO analytics_events (event, path, country, city, referrer, user_agent, device, visitor_id)
      VALUES ('pageview', ${data.path}, ${data.country}, ${data.city}, ${data.referrer}, ${data.userAgent}, ${data.device}, ${data.visitorId})`;
  } catch (err) {
    console.error("Analytics record error:", err);
  }
}

export async function getAnalyticsSummary() {
  if (!sql) return null;
  try {
    await ensureTables();

    // Total and 24h page views
    const totalViewsRes = await sql`SELECT COUNT(*)::int AS count FROM analytics_events`;
    const views24hRes = await sql`SELECT COUNT(*)::int AS count FROM analytics_events WHERE created_at >= now() - INTERVAL '24 HOURS'`;
    
    // Unique visitors (all time and 24h)
    const uniqueVisitorsRes = await sql`SELECT COUNT(DISTINCT visitor_id)::int AS count FROM analytics_events`;
    const unique24hRes = await sql`SELECT COUNT(DISTINCT visitor_id)::int AS count FROM analytics_events WHERE created_at >= now() - INTERVAL '24 HOURS'`;

    // Live active visitors in the last 15 minutes
    const liveVisitorsRes = await sql`SELECT COUNT(DISTINCT visitor_id)::int AS count FROM analytics_events WHERE created_at >= now() - INTERVAL '15 MINUTES'`;

    // Countries breakdown
    const countryStats = await sql`
      SELECT 
        COALESCE(NULLIF(country, ''), 'Unknown') AS country,
        COUNT(*)::int AS count
      FROM analytics_events
      GROUP BY country
      ORDER BY count DESC
      LIMIT 15
    `;

    // Devices breakdown
    const deviceStats = await sql`
      SELECT 
        COALESCE(NULLIF(device, ''), 'desktop') AS device,
        COUNT(*)::int AS count
      FROM analytics_events
      GROUP BY device
    `;

    // Top pages
    const topPages = await sql`
      SELECT 
        path,
        COUNT(*)::int AS count
      FROM analytics_events
      GROUP BY path
      ORDER BY count DESC
      LIMIT 10
    `;

    // Daily breakdown for the last 7 days
    const dailyStats = await sql`
      SELECT 
        TO_CHAR(created_at, 'YYYY-MM-DD') AS day,
        COUNT(*)::int AS views,
        COUNT(DISTINCT visitor_id)::int AS visitors
      FROM analytics_events
      WHERE created_at >= now() - INTERVAL '7 DAYS'
      GROUP BY day
      ORDER BY day ASC
    `;

    // Recent 40 individual visits
    const recentVisits = await sql`
      SELECT 
        id,
        path,
        country,
        city,
        device,
        referrer,
        created_at
      FROM analytics_events
      ORDER BY created_at DESC
      LIMIT 40
    `;

    return {
      totalViews: totalViewsRes[0]?.count || 0,
      views24h: views24hRes[0]?.count || 0,
      uniqueVisitors: uniqueVisitorsRes[0]?.count || 0,
      unique24h: unique24hRes[0]?.count || 0,
      liveVisitors: Math.max(1, liveVisitorsRes[0]?.count || 0), // at least 1 live visitor
      countryStats,
      deviceStats,
      topPages,
      dailyStats,
      recentVisits,
    };
  } catch (err) {
    console.error("Get analytics summary error:", err);
    return null;
  }
}
