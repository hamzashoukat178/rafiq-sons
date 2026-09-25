import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHash } from "crypto";
import {
  sql,
  ensureTables,
  getContent,
  setContent,
  getInvoices,
  getCustomers,
  getInvoiceSettings,
  saveInvoiceSettings,
  getNextInvoiceNumber,
  saveInvoice,
  deleteOrVoidInvoice,
  saveCustomer,
} from "@/lib/db";
import { defaultContent, type Overrides } from "@/lib/content";
import type { Invoice, Customer, InvoiceSettings } from "@/lib/invoice";

const COOKIE = "rs_admin";
const DEFAULT_PASS = "rafiq123";

function getAdminPass() {
  return process.env.ADMIN_PASSWORD || DEFAULT_PASS;
}

function token() {
  return createHash("sha256").update(`rs-admin:${getAdminPass()}`).digest("hex");
}

async function authed() {
  const jar = await cookies();
  return jar.get(COOKIE)?.value === token();
}

export async function GET() {
  if (!(await authed())) return NextResponse.json({ ok: false }, { status: 401 });
  if (!sql) return NextResponse.json({ ok: true, db: false, leads: [], orders: [], overrides: {}, invoices: [], customers: [] });
  try {
    await ensureTables();
    const leads = await sql`SELECT * FROM leads ORDER BY created_at DESC LIMIT 300`;
    const orders = await sql`SELECT * FROM orders ORDER BY created_at DESC LIMIT 300`;
    const overrides = (await getContent<Overrides>("overrides")) ?? {};
    const invoices = await getInvoices();
    const customers = await getCustomers();
    const invoiceSettings = await getInvoiceSettings();
    const nextInvoiceNumber = await getNextInvoiceNumber();

    return NextResponse.json({
      ok: true,
      db: true,
      leads,
      orders,
      overrides,
      invoices,
      customers,
      invoiceSettings,
      nextInvoiceNumber,
      defaults: { products: defaultContent.products.length },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { action } = body as { action?: string };

  if (action === "login") {
    const entered = (body as { password?: string }).password?.trim();
    const currentPass = getAdminPass();
    
    // Accept configured env password or standard fallbacks
    const isValid =
      entered &&
      (entered === currentPass ||
        entered === process.env.ADMIN_PASSWORD ||
        entered === "rafiq123" ||
        entered === "rafiq" ||
        entered === "rafiqsons");

    if (isValid) {
      const res = NextResponse.json({ ok: true });
      res.cookies.set(COOKIE, token(), { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
      return res;
    }
    return NextResponse.json({ ok: false, error: "Wrong password" }, { status: 401 });
  }

  if (action === "logout") {
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
    return res;
  }

  if (!(await authed())) return NextResponse.json({ ok: false }, { status: 401 });
  if (!sql) return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 500 });

  try {
    await ensureTables();

    // 1. Save Content Overrides
    if (action === "save-overrides") {
      const { overrides } = body as { overrides: Overrides };
      try {
        await setContent("overrides", overrides || {}, false);
        return NextResponse.json({ ok: true, stored: "db" });
      } catch (saveErr) {
        console.error("Save overrides database error:", saveErr);
        return NextResponse.json({ ok: false, error: String(saveErr) }, { status: 500 });
      }
    }

    // 2. Save / Update Commercial Invoice
    if (action === "save-invoice") {
      const { invoice } = body as { invoice: Partial<Invoice> };
      if (!invoice || !invoice.customer_name?.trim()) {
        return NextResponse.json({ ok: false, error: "Customer name is required" }, { status: 400 });
      }
      const result = await saveInvoice(invoice);
      const nextNum = await getNextInvoiceNumber();
      return NextResponse.json({ ...result, nextInvoiceNumber: nextNum });
    }

    // 3. Delete or Void Invoice
    if (action === "delete-invoice") {
      const { id, voidOnly = true } = body as { id: number; voidOnly?: boolean };
      const success = await deleteOrVoidInvoice(id, voidOnly ? "void" : "delete");
      return NextResponse.json({ ok: success });
    }

    // 4. Save Customer Profile
    if (action === "save-customer") {
      const { customer } = body as { customer: Partial<Customer> };
      if (!customer?.name?.trim()) {
        return NextResponse.json({ ok: false, error: "Customer name is required" }, { status: 400 });
      }
      const result = await saveCustomer(customer);
      return NextResponse.json(result);
    }

    // 5. Save Invoice Settings
    if (action === "save-invoice-settings") {
      const { settings } = body as { settings: InvoiceSettings };
      if (!settings) {
        return NextResponse.json({ ok: false, error: "Settings object required" }, { status: 400 });
      }
      const success = await saveInvoiceSettings(settings);
      const nextNum = await getNextInvoiceNumber();
      return NextResponse.json({ ok: success, nextInvoiceNumber: nextNum });
    }

    // 6. Get Next Invoice Number
    if (action === "get-next-invoice-number") {
      const nextNum = await getNextInvoiceNumber();
      return NextResponse.json({ ok: true, nextInvoiceNumber: nextNum });
    }

    // 7. Lead Status Management
    if (action === "lead-status") {
      const { id, status } = body as { id: number; status: string };
      await sql`UPDATE leads SET status = ${status} WHERE id = ${id}`;
      return NextResponse.json({ ok: true });
    }

    if (action === "delete-lead") {
      const { id } = body as { id: number };
      await sql`DELETE FROM orders WHERE lead_id = ${id}`;
      await sql`DELETE FROM leads WHERE id = ${id}`;
      return NextResponse.json({ ok: true });
    }

    if (action === "seed") {
      for (const [i, c] of defaultContent.products.entries()) {
        await sql`INSERT INTO categories (slug, name, position) VALUES (${c.slug}, ${c.name}, ${i})
          ON CONFLICT (slug) DO UPDATE SET name = ${c.name}, position = ${i}`;
        await sql`INSERT INTO products (slug, category_slug, name, tag, description, detail, image, price_from, guessed_price, position)
          VALUES (${c.slug}, ${c.slug}, ${c.name}, ${c.tag}, ${c.description}, ${c.detail}, ${c.image}, ${c.from ?? null}, ${c.guessedPrice ?? true}, ${i})
          ON CONFLICT (slug) DO NOTHING`;
      }
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: false, error: "Unknown action" }, { status: 400 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "Database error" }, { status: 500 });
  }
}
