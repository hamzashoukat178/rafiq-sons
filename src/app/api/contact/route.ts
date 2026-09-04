import { NextResponse } from "next/server";
import { sql, ensureTables } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name = "", contact = "", message = "" } = body ?? {};
    if (!String(name).trim() || !String(message).trim()) {
      return NextResponse.json({ ok: false, error: "Name and message are required." }, { status: 400 });
    }
    if (!sql) {
      console.log("CONTACT (no database configured):", { name, contact, message });
      return NextResponse.json({ ok: true, stored: "log" });
    }
    await ensureTables();
    const isEmail = String(contact).includes("@");
    await sql`
      INSERT INTO leads (type, name, email, phone, message)
      VALUES (
        'contact',
        ${String(name).slice(0, 200)},
        ${isEmail ? String(contact).slice(0, 200) : null},
        ${isEmail ? null : String(contact).slice(0, 60)},
        ${String(message).slice(0, 4000)}
      )`;
    return NextResponse.json({ ok: true, stored: "database" });
  } catch (e) {
    console.error("Contact error", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
