import type { Metadata } from "next";
import { Geist, Geist_Mono, Cairo } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://leaderstrategies.org"),
  title: {
    default: "Leader Strategies",
    template: "%s | Leader Strategies",
  },
  description:
    "A Christian organization for spiritual service and leadership training in Egypt — building influential leaders through specialized professional groups.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    siteName: "Leader Strategies",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Leader Strategies" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/opengraph-image"],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Read locale injected by middleware so we can set lang/dir on <html>
  const headersList = await headers();
  const locale = headersList.get("x-locale") ?? "en";
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
