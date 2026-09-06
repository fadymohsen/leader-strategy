"use client";

import { useEffect } from "react";

/**
 * The root layout sets <html dir/lang> server-side, but that layout doesn't
 * re-render on a client-side <Link> navigation between /en and /ar (no
 * dynamic segment changed at that level), so the attribute can go stale.
 * This keeps it in sync on every locale change, client-side included.
 */
export function DirSync({ locale }: { locale: string }) {
  useEffect(() => {
    const dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale]);

  return null;
}
