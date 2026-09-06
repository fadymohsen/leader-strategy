import type { Metadata } from "next";
import { Geist, Geist_Mono, Rubik, Fraunces } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
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
    images: [{ url: "/og-image.jpeg", width: 1200, height: 630, alt: "Leader Strategies" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.jpeg"],
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
      className={`${geistSans.variable} ${geistMono.variable} ${rubik.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
