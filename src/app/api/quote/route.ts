import { NextResponse } from "next/server";
import { sql, ensureTables } from "@/lib/db";
import { sendLeadEmailNotification } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { product = "", quantity = "", brand = "", name = "", contact = "", message = "" } = body ?? {};

    if (!String(name).trim() || !String(contact).trim()) {
      return NextResponse.json({ ok: false, error: "Name and contact are required." }, { status: 400 });
    }

    if (!sql) {
      console.log("QUOTE (no database configured):", { product, quantity, brand, name, contact, message });
      // Send email even without db
      await sendLeadEmailNotification({
        type: "quote",
        name: String(name),
        contact: String(contact),
        brand: String(brand),
        product: String(product),
        quantity: String(quantity),
        message: String(message),
      });
      return NextResponse.json({ ok: true, stored: "log" });
    }

    await ensureTables();
    const isEmail = String(contact).includes("@");
    const rows = await sql`
      INSERT INTO leads (type, name, email, phone, product, quantity, message, meta)
      VALUES (
        'quote',
        ${String(name).slice(0, 200)},
        ${isEmail ? String(contact).slice(0, 200) : null},
        ${isEmail ? null : String(contact).slice(0, 60)},
        ${String(product).slice(0, 120)},
        ${String(quantity).slice(0, 120)},
        ${String(message).slice(0, 4000)},
        ${JSON.stringify({ brand: String(brand).slice(0, 200), contact: String(contact).slice(0, 200) })}
      )
      RETURNING id`;
    await sql`INSERT INTO orders (lead_id, product, quantity, status) VALUES (${rows[0].id}, ${String(product).slice(0, 120)}, ${String(quantity).slice(0, 120)}, 'quote-requested')`;

    // Trigger instant email notification
    sendLeadEmailNotification({
      type: "quote",
      name: String(name),
      contact: String(contact),
      brand: String(brand),
      product: String(product),
      quantity: String(quantity),
      message: String(message),
    }).catch((err) => console.error("Email notification dispatch error:", err));

    return NextResponse.json({ ok: true, stored: "database" });
  } catch (e) {
    console.error("Quote error", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
