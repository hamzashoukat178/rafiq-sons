import { neon } from "@neondatabase/serverless";
import {
  type Invoice,
  type InvoiceItem,
  type Customer,
  type InvoiceSettings,
  DEFAULT_INVOICE_SETTINGS,
  generateInvoiceNumber,
} from "./invoice";

const url = process.env.DATABASE_URL;

export const hasDb = Boolean(url);
export const sql = url ? neon(url) : null;

let initPromise: Promise<void> | null = null;

export function ensureTables() {
  if (!sql) return Promise.resolve();
  if (!initPromise) {
    initPromise = (async () => {
      // Existing Leads & Orders
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

      // Categories & Products
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

      // Site content overrides
      await sql`CREATE TABLE IF NOT EXISTS site_content (
        key TEXT PRIMARY KEY,
        value JSONB,
        guessed BOOLEAN DEFAULT FALSE,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;

      // Analytics events
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

      // B2B CUSTOMERS TABLE
      await sql`CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        company TEXT,
        phone TEXT,
        whatsapp TEXT,
        email TEXT,
        address TEXT,
        city TEXT,
        country TEXT DEFAULT 'Saudi Arabia',
        customer_ref TEXT,
        notes TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;

      // B2B COMMERCIAL INVOICES TABLE
      await sql`CREATE TABLE IF NOT EXISTS invoices (
        id SERIAL PRIMARY KEY,
        invoice_number TEXT UNIQUE NOT NULL,
        customer_id INTEGER,
        customer_name TEXT NOT NULL,
        customer_company TEXT,
        customer_phone TEXT,
        customer_whatsapp TEXT,
        customer_email TEXT,
        customer_address TEXT,
        customer_city TEXT,
        customer_country TEXT NOT NULL DEFAULT 'Saudi Arabia',
        customer_ref TEXT,
        currency TEXT NOT NULL DEFAULT 'SAR',
        items JSONB NOT NULL DEFAULT '[]'::jsonb,
        subtotal NUMERIC(12,2) NOT NULL DEFAULT 0.00,
        discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
        shipping_charge NUMERIC(12,2) NOT NULL DEFAULT 0.00,
        tax_rate NUMERIC(5,2) NOT NULL DEFAULT 0.00,
        tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
        grand_total NUMERIC(12,2) NOT NULL DEFAULT 0.00,
        amount_paid NUMERIC(12,2) NOT NULL DEFAULT 0.00,
        balance_due NUMERIC(12,2) NOT NULL DEFAULT 0.00,
        payment_status TEXT NOT NULL DEFAULT 'unpaid',
        payment_method TEXT DEFAULT 'Bank Transfer',
        payment_date DATE,
        payment_ref TEXT,
        payment_notes TEXT,
        payment_terms_type TEXT NOT NULL DEFAULT '50_50',
        payment_terms_text TEXT,
        delivery_status TEXT NOT NULL DEFAULT 'pending',
        delivery_method TEXT DEFAULT 'Air Express Courier',
        courier TEXT DEFAULT 'DHL Express',
        tracking_number TEXT,
        estimated_delivery_date DATE,
        delivery_notes TEXT,
        invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
        due_date DATE,
        order_number TEXT,
        notes TEXT,
        terms TEXT,
        design_attached BOOLEAN DEFAULT FALSE,
        design_url TEXT,
        audit_log JSONB DEFAULT '[]'::jsonb,
        is_archived BOOLEAN DEFAULT FALSE,
        is_void BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;

      await sql`CREATE INDEX IF NOT EXISTS idx_invoices_num ON invoices(invoice_number)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_invoices_cust ON invoices(customer_name)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_invoices_created ON invoices(created_at DESC)`;
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
    if (!rows || !rows.length || rows[0].value === undefined || rows[0].value === null) {
      return null;
    }
    const val = rows[0].value;
    if (typeof val === "string") {
      try {
        return JSON.parse(val) as T;
      } catch {
        return val as unknown as T;
      }
    }
    return val as T;
  } catch (err) {
    console.error("getContent error:", err);
    return null;
  }
}

export async function setContent(key: string, value: unknown, guessed = false) {
  if (!sql) throw new Error("Database not configured");
  await ensureTables();
  const jsonStr = JSON.stringify(value);
  try {
    await sql`INSERT INTO site_content (key, value, guessed, updated_at)
      VALUES (${key}, ${jsonStr}::jsonb, ${guessed}, now())
      ON CONFLICT (key) DO UPDATE SET value = ${jsonStr}::jsonb, guessed = ${guessed}, updated_at = now()`;
  } catch (err) {
    console.warn("Retrying setContent without jsonb cast...", err);
    await sql`INSERT INTO site_content (key, value, guessed, updated_at)
      VALUES (${key}, ${jsonStr}, ${guessed}, now())
      ON CONFLICT (key) DO UPDATE SET value = ${jsonStr}, guessed = ${guessed}, updated_at = now()`;
  }
}

// -------------------------------------------------------------
// INVOICE SYSTEM DATABASE METHODS
// -------------------------------------------------------------

export async function getInvoiceSettings(): Promise<InvoiceSettings> {
  const saved = await getContent<Partial<InvoiceSettings>>("invoice_settings");
  return {
    ...DEFAULT_INVOICE_SETTINGS,
    ...(saved || {}),
  };
}

export async function saveInvoiceSettings(settings: InvoiceSettings): Promise<boolean> {
  await setContent("invoice_settings", settings, false);
  return true;
}

export async function getNextInvoiceNumber(): Promise<string> {
  if (!sql) return generateInvoiceNumber("RS-INV-", 1);
  try {
    await ensureTables();
    const settings = await getInvoiceSettings();
    const prefix = settings.prefix || "RS-INV-";

    // Find highest existing invoice number with this prefix
    const rows = await sql`
      SELECT invoice_number FROM invoices 
      WHERE invoice_number LIKE ${prefix + '%'}
      ORDER BY id DESC LIMIT 100
    `;

    let maxNum = settings.nextNumber || 1;
    for (const r of rows) {
      const str = String(r.invoice_number || "").replace(prefix, "");
      const n = parseInt(str, 10);
      if (!isNaN(n) && n >= maxNum) {
        maxNum = n + 1;
      }
    }

    return generateInvoiceNumber(prefix, maxNum);
  } catch (err) {
    console.error("Error generating next invoice number:", err);
    return generateInvoiceNumber("RS-INV-", 1);
  }
}

export async function getInvoices(): Promise<Invoice[]> {
  if (!sql) return [];
  try {
    await ensureTables();
    const rows = await sql`
      SELECT * FROM invoices 
      WHERE is_void = FALSE 
      ORDER BY created_at DESC 
      LIMIT 500
    `;
    return rows.map((r: Record<string, unknown>) => {
      const gt = parseFloat(String(r.grand_total)) || 0;
      const ap = parseFloat(String(r.amount_paid)) || 0;
      const bd = parseFloat(String(r.balance_due)) || 0;
      const sc = parseFloat(String(r.shipping_charge)) || 0;
      const disc = parseFloat(String(r.discount_amount)) || 0;
      const tr = parseFloat(String(r.tax_rate)) || 0;
      const ta = parseFloat(String(r.tax_amount)) || 0;
      const st = parseFloat(String(r.subtotal)) || 0;

      return {
        ...r,
        items: typeof r.items === "string" ? JSON.parse(r.items) : (r.items as InvoiceItem[]) || [],
        audit_log: typeof r.audit_log === "string" ? JSON.parse(r.audit_log) : r.audit_log || [],
        subtotal: st,
        discount_amount: disc,
        shipping_charge: sc,
        shipping_amount: sc,
        tax_rate: tr,
        tax_amount: ta,
        grand_total: gt,
        total_amount: gt,
        amount_paid: ap,
        advance_paid: ap,
        balance_due: bd,
        delivery_carrier: (r.courier as string) || "DHL Express Worldwide",
        courier: (r.courier as string) || "DHL Express Worldwide",
        payment_terms: (r.payment_terms_text as string) || "50% Advance with Order Confirmation + 50% Before Dispatch",
        invoice_date: r.invoice_date ? new Date(String(r.invoice_date)).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        due_date: r.due_date ? new Date(String(r.due_date)).toISOString().split("T")[0] : null,
      };
    }) as unknown as Invoice[];
  } catch (err) {
    console.error("getInvoices error:", err);
    return [];
  }
}

export async function getInvoiceById(id: number): Promise<Invoice | null> {
  if (!sql) return null;
  try {
    await ensureTables();
    const rows = await sql`SELECT * FROM invoices WHERE id = ${id}`;
    if (!rows.length) return null;
    const r = rows[0] as Record<string, unknown>;
    const gt = parseFloat(String(r.grand_total)) || 0;
    const ap = parseFloat(String(r.amount_paid)) || 0;
    const bd = parseFloat(String(r.balance_due)) || 0;
    const sc = parseFloat(String(r.shipping_charge)) || 0;
    const disc = parseFloat(String(r.discount_amount)) || 0;
    const tr = parseFloat(String(r.tax_rate)) || 0;
    const ta = parseFloat(String(r.tax_amount)) || 0;
    const st = parseFloat(String(r.subtotal)) || 0;

    return {
      ...r,
      items: typeof r.items === "string" ? JSON.parse(r.items) : (r.items as InvoiceItem[]) || [],
      audit_log: typeof r.audit_log === "string" ? JSON.parse(r.audit_log) : r.audit_log || [],
      subtotal: st,
      discount_amount: disc,
      shipping_charge: sc,
      shipping_amount: sc,
      tax_rate: tr,
      tax_amount: ta,
      grand_total: gt,
      total_amount: gt,
      amount_paid: ap,
      advance_paid: ap,
      balance_due: bd,
      delivery_carrier: (r.courier as string) || "DHL Express Worldwide",
      courier: (r.courier as string) || "DHL Express Worldwide",
      payment_terms: (r.payment_terms_text as string) || "50% Advance with Order Confirmation + 50% Before Dispatch",
      invoice_date: r.invoice_date ? new Date(String(r.invoice_date)).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      due_date: r.due_date ? new Date(String(r.due_date)).toISOString().split("T")[0] : null,
    } as unknown as Invoice;
  } catch (err) {
    console.error("getInvoiceById error:", err);
    return null;
  }
}

export async function saveInvoice(data: Partial<Invoice>): Promise<{ ok: boolean; id?: number; invoice?: Invoice; error?: string }> {
  if (!sql) return { ok: false, error: "Database not configured" };
  try {
    await ensureTables();

    // Auto-create or link customer if new customer name provided
    let customerId = data.customer_id;
    if (data.customer_name?.trim()) {
      const existingCust = await sql`SELECT id FROM customers WHERE LOWER(name) = LOWER(${data.customer_name.trim()}) LIMIT 1`;
      if (existingCust.length) {
        customerId = existingCust[0].id;
        await sql`
          UPDATE customers SET 
            company = COALESCE(${data.customer_company || null}, company),
            phone = COALESCE(${data.customer_phone || null}, phone),
            whatsapp = COALESCE(${data.customer_whatsapp || null}, whatsapp),
            email = COALESCE(${data.customer_email || null}, email),
            address = COALESCE(${data.customer_address || null}, address),
            city = COALESCE(${data.customer_city || null}, city),
            country = COALESCE(${data.customer_country || null}, country),
            updated_at = now()
          WHERE id = ${customerId}
        `;
      } else {
        const newCustRows = await sql`
          INSERT INTO customers (name, company, phone, whatsapp, email, address, city, country, customer_ref)
          VALUES (
            ${data.customer_name.trim()},
            ${data.customer_company || null},
            ${data.customer_phone || null},
            ${data.customer_whatsapp || null},
            ${data.customer_email || null},
            ${data.customer_address || null},
            ${data.customer_city || null},
            ${data.customer_country || 'Saudi Arabia'},
            ${data.customer_ref || null}
          ) RETURNING id
        `;
        customerId = newCustRows[0].id;
      }
    }

    const itemsJson = JSON.stringify(data.items || []);
    const auditLogJson = JSON.stringify(data.audit_log || [{ date: new Date().toISOString(), action: "Invoice Created/Updated" }]);

    const totalAmt = Number(data.total_amount ?? data.grand_total) || 0;
    const advPaid = Number(data.advance_paid ?? data.amount_paid) || 0;
    const balDue = Number(data.balance_due) ?? Math.max(0, totalAmt - advPaid);
    const shipAmt = Number(data.shipping_amount ?? data.shipping_charge) || 0;
    const discAmt = Number(data.discount_amount) || 0;
    const taxRt = Number(data.tax_rate) || 0;
    const taxAmt = Number(data.tax_amount) || 0;
    const subTot = Number(data.subtotal) || 0;
    const courierVal = data.delivery_carrier || data.courier || 'DHL Express Worldwide';
    const termsTxt = data.payment_terms || data.payment_terms_text || '50% Advance with Order Confirmation + 50% Before Dispatch';

    if (data.id) {
      // Update existing invoice
      const updatedRows = await sql`
        UPDATE invoices SET
          invoice_number = ${data.invoice_number!},
          customer_id = ${customerId || null},
          customer_name = ${data.customer_name!},
          customer_company = ${data.customer_company || null},
          customer_phone = ${data.customer_phone || null},
          customer_whatsapp = ${data.customer_whatsapp || null},
          customer_email = ${data.customer_email || null},
          customer_address = ${data.customer_address || null},
          customer_city = ${data.customer_city || null},
          customer_country = ${data.customer_country || 'Saudi Arabia'},
          customer_ref = ${data.customer_ref || null},
          currency = ${data.currency || 'SAR'},
          items = ${itemsJson}::jsonb,
          subtotal = ${subTot},
          discount_amount = ${discAmt},
          shipping_charge = ${shipAmt},
          tax_rate = ${taxRt},
          tax_amount = ${taxAmt},
          grand_total = ${totalAmt},
          amount_paid = ${advPaid},
          balance_due = ${balDue},
          payment_status = ${data.payment_status || 'pending'},
          payment_terms_text = ${termsTxt},
          courier = ${courierVal},
          tracking_number = ${data.tracking_number || null},
          delivery_status = ${data.delivery_status || 'In Production'},
          invoice_date = ${data.invoice_date || new Date().toISOString().slice(0, 10)},
          due_date = ${data.due_date || null},
          notes = ${data.notes || null},
          audit_log = ${auditLogJson}::jsonb,
          updated_at = now()
        WHERE id = ${data.id}
        RETURNING *
      `;

      return { ok: true, id: data.id, invoice: updatedRows[0] as unknown as Invoice };
    } else {
      // Create new invoice
      const invoiceNumber = data.invoice_number || (await getNextInvoiceNumber());

      const insertedRows = await sql`
        INSERT INTO invoices (
          invoice_number, customer_id, customer_name, customer_company,
          customer_phone, customer_whatsapp, customer_email, customer_address,
          customer_city, customer_country, customer_ref, currency,
          items, subtotal, discount_amount, shipping_charge, tax_rate, tax_amount,
          grand_total, amount_paid, balance_due, payment_status,
          payment_terms_text, courier, tracking_number, delivery_status,
          invoice_date, due_date, notes, audit_log
        ) VALUES (
          ${invoiceNumber},
          ${customerId || null},
          ${data.customer_name!},
          ${data.customer_company || null},
          ${data.customer_phone || null},
          ${data.customer_whatsapp || null},
          ${data.customer_email || null},
          ${data.customer_address || null},
          ${data.customer_city || null},
          ${data.customer_country || 'Saudi Arabia'},
          ${data.customer_ref || null},
          ${data.currency || 'SAR'},
          ${itemsJson}::jsonb,
          ${subTot},
          ${discAmt},
          ${shipAmt},
          ${taxRt},
          ${taxAmt},
          ${totalAmt},
          ${advPaid},
          ${balDue},
          ${data.payment_status || 'pending'},
          ${termsTxt},
          ${courierVal},
          ${data.tracking_number || null},
          ${data.delivery_status || 'In Production'},
          ${data.invoice_date || new Date().toISOString().slice(0, 10)},
          ${data.due_date || null},
          ${data.notes || null},
          ${auditLogJson}::jsonb
        )
        RETURNING *
      `;

      return { ok: true, id: insertedRows[0].id, invoice: insertedRows[0] as unknown as Invoice };
    }
  } catch (err) {
    console.error("saveInvoice error:", err);
    return { ok: false, error: String(err) };
  }
}

export async function deleteOrVoidInvoice(id: number, action: "void" | "delete" = "void"): Promise<boolean> {
  if (!sql) return false;
  try {
    await ensureTables();
    if (action === "delete") {
      await sql`DELETE FROM invoices WHERE id = ${id}`;
    } else {
      await sql`UPDATE invoices SET is_void = TRUE, updated_at = now() WHERE id = ${id}`;
    }
    return true;
  } catch (err) {
    console.error("deleteOrVoidInvoice error:", err);
    return false;
  }
}

// -------------------------------------------------------------
// CUSTOMER DIRECTORY METHODS
// -------------------------------------------------------------

export async function getCustomers(): Promise<Customer[]> {
  if (!sql) return [];
  try {
    await ensureTables();
    const rows = await sql`
      SELECT 
        c.*,
        COUNT(i.id)::int AS total_invoices,
        COALESCE(SUM(i.grand_total), 0)::float AS total_spent
      FROM customers c
      LEFT JOIN invoices i ON i.customer_id = c.id
      GROUP BY c.id
      ORDER BY c.created_at DESC
      LIMIT 500
    `;
    return rows as Customer[];
  } catch (err) {
    console.error("getCustomers error:", err);
    return [];
  }
}

export async function saveCustomer(data: Partial<Customer>): Promise<{ ok: boolean; id?: number }> {
  if (!sql) return { ok: false };
  try {
    await ensureTables();
    if (data.id) {
      await sql`
        UPDATE customers SET
          name = ${data.name!},
          company = ${data.company || null},
          phone = ${data.phone || null},
          whatsapp = ${data.whatsapp || null},
          email = ${data.email || null},
          address = ${data.address || null},
          city = ${data.city || null},
          country = ${data.country || 'Saudi Arabia'},
          customer_ref = ${data.customer_ref || null},
          notes = ${data.notes || null},
          updated_at = now()
        WHERE id = ${data.id}
      `;
      return { ok: true, id: data.id };
    } else {
      const rows = await sql`
        INSERT INTO customers (name, company, phone, whatsapp, email, address, city, country, customer_ref, notes)
        VALUES (
          ${data.name!},
          ${data.company || null},
          ${data.phone || null},
          ${data.whatsapp || null},
          ${data.email || null},
          ${data.address || null},
          ${data.city || null},
          ${data.country || 'Saudi Arabia'},
          ${data.customer_ref || null},
          ${data.notes || null}
        ) RETURNING id
      `;
      return { ok: true, id: rows[0].id };
    }
  } catch (err) {
    console.error("saveCustomer error:", err);
    return { ok: false };
  }
}

// -------------------------------------------------------------
// ANALYTICS METHODS
// -------------------------------------------------------------

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

    const totalViewsRes = await sql`SELECT COUNT(*)::int AS count FROM analytics_events`;
    const views24hRes = await sql`SELECT COUNT(*)::int AS count FROM analytics_events WHERE created_at >= now() - INTERVAL '24 HOURS'`;
    const uniqueVisitorsRes = await sql`SELECT COUNT(DISTINCT visitor_id)::int AS count FROM analytics_events`;
    const unique24hRes = await sql`SELECT COUNT(DISTINCT visitor_id)::int AS count FROM analytics_events WHERE created_at >= now() - INTERVAL '24 HOURS'`;
    const liveVisitorsRes = await sql`SELECT COUNT(DISTINCT visitor_id)::int AS count FROM analytics_events WHERE created_at >= now() - INTERVAL '15 MINUTES'`;

    const countryStats = await sql`
      SELECT 
        COALESCE(NULLIF(country, ''), 'Unknown') AS country,
        COUNT(*)::int AS count
      FROM analytics_events
      GROUP BY country
      ORDER BY count DESC
      LIMIT 15
    `;

    const deviceStats = await sql`
      SELECT 
        COALESCE(NULLIF(device, ''), 'desktop') AS device,
        COUNT(*)::int AS count
      FROM analytics_events
      GROUP BY device
    `;

    const topPages = await sql`
      SELECT 
        path,
        COUNT(*)::int AS count
      FROM analytics_events
      GROUP BY path
      ORDER BY count DESC
      LIMIT 10
    `;

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
      liveVisitors: Math.max(1, liveVisitorsRes[0]?.count || 0),
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
