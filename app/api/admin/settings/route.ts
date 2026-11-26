import { NextResponse } from "next/server";
import { hashPassword, isAdminAuthenticated } from "@/lib/auth";
import { ensureSchema, getSql } from "@/lib/db";

export async function PUT(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as { newPassword?: string };
    const newPassword = body.newPassword?.trim() ?? "";
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    await ensureSchema();
    const sql = getSql();
    const hashed = hashPassword(newPassword);
    await sql`
      INSERT INTO site_settings (key, value, updated_at)
      VALUES ('admin_password_hash', ${JSON.stringify(hashed)}::jsonb, NOW())
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
    `;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Settings update error:", err);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
