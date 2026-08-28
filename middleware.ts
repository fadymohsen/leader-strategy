import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SUPPORTED_LOCALES = ["en", "ar"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Extract the first path segment as the locale
  const segments = pathname.split("/");
  const maybeLocale = segments[1];
  const locale = SUPPORTED_LOCALES.includes(maybeLocale) ? maybeLocale : "en";

  // Clone the request headers and inject x-locale so the root layout
  // can set the correct lang/dir on <html> without knowing the URL.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", locale);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  // Run on every route except Next.js internals and static files
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|opengraph-image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)",
  ],
};
