import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { del, put } from "@vercel/blob";
import { isAdminAuthenticated } from "@/lib/auth";
import { ensureSchema, getSql } from "@/lib/db";

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

async function listLocalImages(): Promise<{ url: string; filename: string; source: "local" }[]> {
  const results: { url: string; filename: string; source: "local" }[] = [];
  const publicDir = path.join(process.cwd(), "public");
  try {
    const rootFiles = await fs.readdir(publicDir);
    for (const file of rootFiles) {
      if (/\.(jpe?g|png|webp|gif|svg)$/i.test(file)) {
        results.push({ url: `/${file}`, filename: file, source: "local" });
      }
    }
    const imagesDir = path.join(publicDir, "images");
    const imgFiles = await fs.readdir(imagesDir);
    for (const file of imgFiles) {
      if (/\.(jpe?g|png|webp|gif|svg)$/i.test(file)) {
        results.push({ url: `/images/${file}`, filename: file, source: "local" });
      }
    }
  } catch {
    // Ignore if directory missing
  }
  return results;
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await ensureSchema();
    const sql = getSql();
    const uploaded = (await sql`
      SELECT id, url, filename, content_type, size_bytes, created_at
      FROM media_assets
      ORDER BY created_at DESC
      LIMIT 200
    `) as {
      id: number;
      url: string;
      filename: string;
      content_type: string | null;
      size_bytes: number | null;
      created_at: string;
    }[];

    const local = await listLocalImages();
    return NextResponse.json({
      uploaded: uploaded.map((u) => ({ ...u, source: "blob" as const })),
      local,
    });
  } catch (err) {
    console.error("Media list error:", err);
    return NextResponse.json({ error: "Failed to list media" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const slot = formData.get("slot");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: "File size must be under 10 MB" }, { status: 400 });
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: "BLOB_READ_WRITE_TOKEN is not configured" },
        { status: 500 }
      );
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const blob = await put(`uploads/${Date.now()}-${safeName}`, file, {
      access: "public",
      token,
    });

    await ensureSchema();
    const sql = getSql();
    await sql`
      INSERT INTO media_assets (url, filename, content_type, size_bytes)
      VALUES (${blob.url}, ${file.name}, ${file.type}, ${file.size})
      ON CONFLICT (url) DO NOTHING
    `;

    if (typeof slot === "string" && slot.trim()) {
      await sql`
        INSERT INTO site_media (slot, url, updated_at)
        VALUES (${slot.trim()}, ${blob.url}, NOW())
        ON CONFLICT (slot) DO UPDATE SET url = EXCLUDED.url, updated_at = NOW()
      `;
      revalidateTag("site-content", { expire: 0 });
      revalidatePath("/", "layout");
    }

    return NextResponse.json({
      url: blob.url,
      filename: file.name,
      size: file.size,
      contentType: file.type,
    });
  } catch (err) {
    console.error("Blob upload error:", err);
    return NextResponse.json({ error: "Failed to upload photo" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as { id?: number; url?: string };
    if (!body.url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (token && body.url.includes("blob.vercel-storage.com")) {
      await del(body.url, { token });
    }

    await ensureSchema();
    const sql = getSql();
    if (body.id) {
      await sql`DELETE FROM media_assets WHERE id = ${body.id}`;
    } else {
      await sql`DELETE FROM media_assets WHERE url = ${body.url}`;
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Blob delete error:", err);
    return NextResponse.json({ error: "Failed to delete photo" }, { status: 500 });
  }
}
