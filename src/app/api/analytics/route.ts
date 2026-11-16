import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHash } from "crypto";
import { recordPageView, getAnalyticsSummary } from "@/lib/db";

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

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const headers = req.headers;

    // Extract country and city from Vercel / Cloudflare headers
    const country = headers.get("x-vercel-ip-country") || headers.get("cf-ipcountry") || "PK";
    let city = headers.get("x-vercel-ip-city") || headers.get("cf-ipcity") || "Faisalabad";
    try {
      city = decodeURIComponent(city);
    } catch {
      // keep raw if decode fails
    }

    const userAgent = headers.get("user-agent") || "";
    let device = "desktop";
    if (/mobile/i.test(userAgent)) device = "mobile";
    else if (/tablet|ipad/i.test(userAgent)) device = "tablet";

    const path = typeof body.path === "string" ? body.path : "/";
    const referrer = typeof body.referrer === "string" ? body.referrer : "";
    const visitorId = typeof body.visitorId === "string" ? body.visitorId : "anon-" + Math.random().toString(36).substring(2, 9);

    await recordPageView({
      path,
      country: country || "Unknown",
      city: city || "Unknown",
      referrer,
      userAgent: userAgent.substring(0, 200),
      device,
      visitorId,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Analytics endpoint error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function GET() {
  // STRICT ADMIN AUTH CHECK - Block unauthorized public access to analytics
  if (!(await authed())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await getAnalyticsSummary();
    if (!data) {
      return NextResponse.json({
        ok: true,
        data: {
          totalViews: 0,
          views24h: 0,
          uniqueVisitors: 0,
          unique24h: 0,
          liveVisitors: 0,
          countryStats: [],
          deviceStats: [],
          topPages: [],
        },
      });
    }

    return NextResponse.json({ ok: true, data });
  } catch (err) {
    console.error("Failed to get analytics summary", err);
    return NextResponse.json({ ok: false, error: "Database error" }, { status: 500 });
  }
}
