import { NextResponse } from "next/server";
import { sql, ensureTables } from "@/lib/db";
import { sendLeadEmailNotification } from "@/lib/email";

interface QuoteItemPayload {
  name?: string;
  title?: string;
  quantity?: string;
  specs?: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      product = "",
      quantity = "",
      brand = "",
      name = "",
      contact = "",
      country = "",
      city = "",
      dimensions = "",
      colors = "",
      material = "",
      deliveryPreference = "",
      items = [],
      message = "",
      fileUrl = "",
      referenceUrl = "",
    } = body ?? {};

    if (!String(name).trim() || !String(contact).trim()) {
      return NextResponse.json({ ok: false, error: "Name and contact number are required." }, { status: 400 });
    }

    const leadSummaryProduct = items && Array.isArray(items) && items.length > 0
      ? items.map((i: QuoteItemPayload) => `${i.name || i.title} (${i.quantity || "MOQ"})`).join(", ")
      : String(product || "Custom Quote Request");

    const leadSummaryQuantity = items && Array.isArray(items) && items.length > 0
      ? items.map((i: QuoteItemPayload) => `${i.quantity || ""}`).join(", ")
      : String(quantity || "Standard");

    const fullMeta = {
      brand: String(brand).slice(0, 200),
      contact: String(contact).slice(0, 200),
      country: String(country).slice(0, 100),
      city: String(city).slice(0, 100),
      dimensions: String(dimensions).slice(0, 200),
      colors: String(colors).slice(0, 200),
      material: String(material).slice(0, 200),
      deliveryPreference: String(deliveryPreference).slice(0, 100),
      items: Array.isArray(items) ? items : [],
      fileUrl: String(fileUrl || ""),
      referenceUrl: String(referenceUrl || ""),
    };

    if (!sql) {
      console.log("QUOTE SUBMITTED (fallback log):", { name, contact, brand, leadSummaryProduct, fullMeta });
      await sendLeadEmailNotification({
        type: "quote",
        name: String(name),
        contact: String(contact),
        brand: String(brand),
        product: leadSummaryProduct,
        quantity: leadSummaryQuantity,
        country: String(country),
        city: String(city),
        dimensions: String(dimensions),
        colors: String(colors),
        material: String(material),
        deliveryPreference: String(deliveryPreference),
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
        ${String(leadSummaryProduct).slice(0, 200)},
        ${String(leadSummaryQuantity).slice(0, 200)},
        ${String(message).slice(0, 4000)},
        ${JSON.stringify(fullMeta)}
      )
      RETURNING id`;

    if (rows && rows[0]?.id) {
      await sql`INSERT INTO orders (lead_id, product, quantity, status) VALUES (${rows[0].id}, ${String(leadSummaryProduct).slice(0, 200)}, ${String(leadSummaryQuantity).slice(0, 200)}, 'quote-requested')`;
    }

    // Trigger instant email notification in background
    sendLeadEmailNotification({
      type: "quote",
      name: String(name),
      contact: String(contact),
      brand: String(brand),
      product: leadSummaryProduct,
      quantity: leadSummaryQuantity,
      country: String(country),
      city: String(city),
      dimensions: String(dimensions),
      colors: String(colors),
      material: String(material),
      deliveryPreference: String(deliveryPreference),
      message: String(message),
    }).catch((err) => console.error("Email notification dispatch error:", err));

    return NextResponse.json({ ok: true, stored: "database", leadId: rows[0]?.id });
  } catch (e) {
    console.error("Quote error", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
