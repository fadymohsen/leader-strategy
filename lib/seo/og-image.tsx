/**
 * Shared Open Graph image builder used by every opengraph-image.tsx route.
 * Returns a React element suitable for passing to `new ImageResponse(...)`.
 */

export const OG_SIZE = { width: 1200, height: 630 };

interface OgImageConfig {
  locale: string;
  icon: string;
  title: string;
  subtitle: string;
  /** Short label that appears in the badge pill at the top */
  badge: string;
}

export function OgImageTemplate({ locale, icon, title, subtitle, badge }: OgImageConfig) {
  const isRtl = locale === "ar";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #1e3a5f 0%, #0d2540 55%, #1a1030 100%)",
        fontFamily: "sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Decorative circles ── */}
      <div
        style={{
          position: "absolute",
          top: -140,
          right: -140,
          width: 480,
          height: 480,
          borderRadius: "50%",
          background: "rgba(200,151,46,0.10)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -100,
          left: -100,
          width: 360,
          height: 360,
          borderRadius: "50%",
          background: "rgba(200,151,46,0.06)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "35%",
          right: "8%",
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.03)",
        }}
      />

      {/* ── Top bar: logo + org name + badge ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "44px 64px 0",
          flexDirection: isRtl ? "row-reverse" : "row",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexDirection: isRtl ? "row-reverse" : "row" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#c8972e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-1px",
            }}
          >
            LS
          </div>
          <span
            style={{
              color: "#ffffff",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.3px",
            }}
          >
            Leader Strategies
          </span>
        </div>

        {/* Badge pill */}
        <div
          style={{
            padding: "8px 20px",
            borderRadius: 999,
            border: "1px solid rgba(200,151,46,0.45)",
            background: "rgba(200,151,46,0.12)",
            color: "#e0b245",
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: "0.04em",
          }}
        >
          {badge}
        </div>
      </div>

      {/* ── Center content ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 80px",
          textAlign: "center",
        }}
      >
        {/* Icon */}
        <div style={{ fontSize: 88, lineHeight: 1, marginBottom: 28 }}>{icon}</div>

        {/* Gold divider */}
        <div
          style={{
            width: 64,
            height: 3,
            background: "#c8972e",
            borderRadius: 2,
            marginBottom: 28,
          }}
        />

        {/* Title */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.15,
            letterSpacing: "-1.5px",
            marginBottom: 18,
            maxWidth: 860,
            textAlign: "center",
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 24,
            color: "#c8972e",
            fontWeight: 600,
            maxWidth: 780,
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          {subtitle}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 64px 40px",
          flexDirection: isRtl ? "row-reverse" : "row",
        }}
      >
        <div style={{ width: 80, height: 2, background: "rgba(255,255,255,0.12)", borderRadius: 1 }} />
        <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 16, fontWeight: 500 }}>
          leaderstrategies.org
        </span>
        <div style={{ width: 80, height: 2, background: "rgba(255,255,255,0.12)", borderRadius: 1 }} />
      </div>
    </div>
  );
}

// ── Per-page config ────────────────────────────────────────────────────────────

type Bilingual = { en: string; ar: string };

export const ogPageConfig: Record<
  string,
  { icon: string; title: Bilingual; subtitle: Bilingual; badge: Bilingual }
> = {
  home: {
    icon: "✝️",
    title: {
      en: "Building Influential Leaders in Egypt",
      ar: "صنع قادة مؤثرين في مصر",
    },
    subtitle: {
      en: "Make Your Work a Center for Your Mission",
      ar: "اجعل من عملك مركزاً لارساليتك",
    },
    badge: { en: "Spiritual Leadership Movement", ar: "حركة القيادة الروحية" },
  },
  about: {
    icon: "👥",
    title: {
      en: "Our Vision, Mission & Team",
      ar: "رؤيتنا ومهمتنا وفريقنا",
    },
    subtitle: {
      en: "5 Core Values · Real Board Members · City Teams Across Egypt",
      ar: "٥ قيم أساسية · مجلس الإدارة · فرق المحافظات",
    },
    badge: { en: "About Us", ar: "من نحن" },
  },
  services: {
    icon: "💼",
    title: {
      en: "5 Professional Sectors",
      ar: "٥ قطاعات مهنية",
    },
    subtitle: {
      en: "Graduates · Business · Teachers · Lawyers · Doctors",
      ar: "الخريجون · رجال الأعمال · المدرسون · المحامون · الأطباء",
    },
    badge: { en: "Professional Sectors", ar: "القطاعات المهنية" },
  },
  news: {
    icon: "📰",
    title: {
      en: "News & Stories of Impact",
      ar: "أخبار وقصص التأثير",
    },
    subtitle: {
      en: "Updates from the Leader Strategies movement across Egypt",
      ar: "تحديثات من حركة Leader Strategies في جميع أنحاء مصر",
    },
    badge: { en: "News & Stories", ar: "الأخبار والقصص" },
  },
  courses: {
    icon: "🎓",
    title: {
      en: "Training Courses for Leaders",
      ar: "دورات تدريبية للقادة",
    },
    subtitle: {
      en: "Biblical Leadership · Leader Impact · ISP · FLAG · Medical Strategy",
      ar: "القيادة الكتابية · Leader Impact · ISP · FLAG · Medical Strategy",
    },
    badge: { en: "Training & Courses", ar: "التدريب والدورات" },
  },
  contact: {
    icon: "✉️",
    title: {
      en: "Join the Movement",
      ar: "انضم إلى الحركة",
    },
    subtitle: {
      en: "Connect with Leader Strategies — Cairo · Alexandria · Minya · Assiut · Tanta",
      ar: "تواصل مع Leader Strategies — القاهرة · الإسكندرية · المنيا · أسيوط · طنطا",
    },
    badge: { en: "Contact Us", ar: "اتصل بنا" },
  },
};
