import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { ensureSchema, getSql } from "@/lib/db";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await ensureSchema();
    const sql = getSql();
    const messages = await sql`
      SELECT id, name, email, subject, message, is_read, created_at
      FROM contact_messages
      ORDER BY created_at DESC
      LIMIT 200
    `;
    const subscribers = await sql`
      SELECT id, email, locale, created_at
      FROM newsletter_subscribers
      ORDER BY created_at DESC
      LIMIT 500
    `;
    return NextResponse.json({ messages, subscribers });
  } catch (err) {
    console.error("Submissions fetch error:", err);
    return NextResponse.json({ error: "Failed to load submissions" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as { id?: number; is_read?: boolean };
    if (!body.id) {
      return NextResponse.json({ error: "Message ID required" }, { status: 400 });
    }
    await ensureSchema();
    const sql = getSql();
    await sql`
      UPDATE contact_messages SET is_read = ${Boolean(body.is_read)} WHERE id = ${body.id}
    `;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Submissions patch error:", err);
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as { type?: "message" | "subscriber"; id?: number };
    if (!body.id || !body.type) {
      return NextResponse.json({ error: "Type and ID required" }, { status: 400 });
    }
    await ensureSchema();
    const sql = getSql();
    if (body.type === "message") {
      await sql`DELETE FROM contact_messages WHERE id = ${body.id}`;
    } else {
      await sql`DELETE FROM newsletter_subscribers WHERE id = ${body.id}`;
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Submissions delete error:", err);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
