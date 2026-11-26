import { NextResponse } from "next/server";
import { ensureSchema, getSql } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
    };
    const name = body.name?.trim() ?? "";
    const email = body.email?.trim() ?? "";
    const subject = body.subject?.trim() ?? "";
    const message = body.message?.trim() ?? "";

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    await ensureSchema();
    const sql = getSql();
    await sql`
      INSERT INTO contact_messages (name, email, subject, message)
      VALUES (${name}, ${email}, ${subject}, ${message})
    `;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact submission error:", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
