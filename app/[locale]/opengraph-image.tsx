import { ImageResponse } from "next/og";
import { OG_SIZE, OgImageTemplate, ogPageConfig } from "@/lib/seo/og-image";

export const alt = "Leader Strategies — Home";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const lang = locale === "ar" ? "ar" : "en";
  const cfg = ogPageConfig.home;

  return new ImageResponse(
    <OgImageTemplate
      locale={lang}
      icon={cfg.icon}
      title={cfg.title[lang]}
      subtitle={cfg.subtitle[lang]}
      badge={cfg.badge[lang]}
    />,
    { ...OG_SIZE }
  );
}
