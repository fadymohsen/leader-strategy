import { NextResponse } from "next/server";
import { ensureSchema, getSql } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string; locale?: string };
    const email = body.email?.trim().toLowerCase() ?? "";
    const locale = body.locale === "ar" ? "ar" : "en";

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    await ensureSchema();
    const sql = getSql();
    await sql`
      INSERT INTO newsletter_subscribers (email, locale)
      VALUES (${email}, ${locale})
      ON CONFLICT (email) DO UPDATE SET locale = EXCLUDED.locale
    `;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Newsletter error:", err);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
