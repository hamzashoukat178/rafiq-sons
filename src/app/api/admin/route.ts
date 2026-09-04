import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHash } from "crypto";
import { sql, ensureTables, getContent, setContent } from "@/lib/db";
import { defaultContent, type Overrides } from "@/lib/content";

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
  if (!sql) return NextResponse.json({ ok: true, db: false, leads: [], orders: [], overrides: {} });
  try {
    await ensureTables();
    const leads = await sql`SELECT * FROM leads ORDER BY created_at DESC LIMIT 300`;
    const orders = await sql`SELECT * FROM orders ORDER BY created_at DESC LIMIT 300`;
    const overrides = (await getContent<Overrides>("overrides")) ?? {};
    return NextResponse.json({ ok: true, db: true, leads, orders, overrides, defaults: { products: defaultContent.products.length } });
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

    if (action === "save-overrides") {
      const { overrides } = body as { overrides: Overrides };
      await setContent("overrides", overrides, false);
      return NextResponse.json({ ok: true });
    }

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
