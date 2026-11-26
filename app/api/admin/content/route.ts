import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { isAdminAuthenticated } from "@/lib/auth";
import { ensureSchema, getSql } from "@/lib/db";
import { NO_PHOTO } from "@/lib/photo";
import { getDictionary, getStaticDictionary, isValidLocale, type Locale } from "@/lib/i18n";
import {
  getCoursesVisible,
  getNewsGallery,
  getSiteMedia,
  MEDIA_SLOTS,
  type GalleryItem,
} from "@/lib/media";

function revalidateAll() {
  revalidateTag("site-content", { expire: 0 });
  revalidatePath("/", "layout");
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [en, ar, media, gallery, coursesVisible] = await Promise.all([
      getDictionary("en"),
      getDictionary("ar"),
      getSiteMedia(),
      getNewsGallery(),
      getCoursesVisible(),
    ]);

    return NextResponse.json({
      en,
      ar,
      media,
      gallery,
      coursesVisible,
      mediaSlots: MEDIA_SLOTS,
    });
  } catch (err) {
    console.error("Admin content GET error:", err);
    return NextResponse.json({ error: "Failed to load content" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as {
      locale?: string;
      data?: unknown;
      media?: Record<string, string>;
      gallery?: GalleryItem[];
      coursesVisible?: boolean;
    };

    await ensureSchema();
    const sql = getSql();

    if (body.locale && isValidLocale(body.locale) && body.data) {
      await sql`
        INSERT INTO site_content (locale, data, updated_at)
        VALUES (${body.locale}, ${JSON.stringify(body.data)}::jsonb, NOW())
        ON CONFLICT (locale) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
      `;
    }

    if (body.media && typeof body.media === "object") {
      for (const [slot, url] of Object.entries(body.media)) {
        if (typeof url === "string") {
          // "" = photo removed on purpose, stored as "none"
          const value = url.trim() || NO_PHOTO;
          await sql`
            INSERT INTO site_media (slot, url, updated_at)
            VALUES (${slot}, ${value}, NOW())
            ON CONFLICT (slot) DO UPDATE SET url = EXCLUDED.url, updated_at = NOW()
          `;
        }
      }
    }

    if (Array.isArray(body.gallery)) {
      await sql`
        INSERT INTO site_settings (key, value, updated_at)
        VALUES ('news_gallery', ${JSON.stringify(body.gallery)}::jsonb, NOW())
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
      `;
    }

    if (typeof body.coursesVisible === "boolean") {
      await sql`
        INSERT INTO site_settings (key, value, updated_at)
        VALUES ('courses_visible', ${JSON.stringify(body.coursesVisible)}::jsonb, NOW())
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
      `;
    }

    revalidateAll();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Admin content PUT error:", err);
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as { action?: string; target?: string };
    if (body.action !== "reset") {
      return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
    }

    await ensureSchema();
    const sql = getSql();

    if (body.target === "en" || body.target === "ar") {
      const def = await getStaticDictionary(body.target as Locale);
      await sql`
        INSERT INTO site_content (locale, data, updated_at)
        VALUES (${body.target}, ${JSON.stringify(def)}::jsonb, NOW())
        ON CONFLICT (locale) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
      `;
    } else if (body.target === "media") {
      await sql`DELETE FROM site_media`;
    } else if (body.target === "gallery") {
      await sql`DELETE FROM site_settings WHERE key = 'news_gallery'`;
    } else if (body.target === "all") {
      await sql`DELETE FROM site_content`;
      await sql`DELETE FROM site_media`;
      await sql`DELETE FROM site_settings WHERE key IN ('news_gallery', 'courses_visible')`;
    }

    revalidateAll();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Admin content reset error:", err);
    return NextResponse.json({ error: "Failed to reset content" }, { status: 500 });
  }
}
