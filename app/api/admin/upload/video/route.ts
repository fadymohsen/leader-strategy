import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { isAdminAuthenticated } from "@/lib/auth";
import { ensureSchema, getSql } from "@/lib/db";
import { VIDEO_TYPES } from "@/lib/video";

// Videos go straight from the browser to Vercel Blob (serverless request bodies are
// capped at ~4.5 MB). This route only issues the upload token and records the asset.
const MAX_VIDEO_BYTES = 500 * 1024 * 1024; // 500 MB

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as
    | HandleUploadBody
    | { action: "register"; url: string; filename: string; contentType?: string; size?: number };

  // Step 2 (after the browser finished uploading): remember the file in the library.
  if ("action" in body && body.action === "register") {
    try {
      await ensureSchema();
      const sql = getSql();
      await sql`
        INSERT INTO media_assets (url, filename, content_type, size_bytes)
        VALUES (${body.url}, ${body.filename}, ${body.contentType ?? "video/mp4"}, ${body.size ?? null})
        ON CONFLICT (url) DO NOTHING
      `;
      return NextResponse.json({ ok: true });
    } catch (err) {
      console.error("Video register error:", err);
      return NextResponse.json({ error: "Failed to save video" }, { status: 500 });
    }
  }

  // Step 1: issue a client upload token.
  try {
    const result = await handleUpload({
      body: body as HandleUploadBody,
      request: req,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: VIDEO_TYPES,
        maximumSizeInBytes: MAX_VIDEO_BYTES,
        addRandomSuffix: true,
      }),
    });
    return NextResponse.json(result);
  } catch (err) {
    console.error("Video token error:", err);
    return NextResponse.json({ error: "Could not start video upload" }, { status: 400 });
  }
}
