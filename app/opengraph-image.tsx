import { ImageResponse } from "next/og";

export const alt = "Leader Strategies — Make Your Work a Center for Your Mission";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1e3a5f 0%, #0f2040 60%, #1a1a2e 100%)",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circle top-right */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(200, 151, 46, 0.12)",
          }}
        />
        {/* Decorative circle bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(200, 151, 46, 0.08)",
          }}
        />

        {/* Logo circle */}
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: "#c8972e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 38,
            fontWeight: 800,
            color: "#fff",
            marginBottom: 32,
            letterSpacing: "-1px",
          }}
        >
          LS
        </div>

        {/* Site name */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "-2px",
            lineHeight: 1.1,
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          Leader Strategies
        </div>

        {/* Divider */}
        <div
          style={{
            width: 120,
            height: 3,
            background: "#c8972e",
            borderRadius: 2,
            marginBottom: 24,
          }}
        />

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: "#c8972e",
            fontWeight: 600,
            textAlign: "center",
            maxWidth: 800,
            marginBottom: 12,
          }}
        >
          Make Your Work a Center for Your Mission
        </div>

        {/* Sub-tagline */}
        <div
          style={{
            fontSize: 20,
            color: "rgba(255,255,255,0.55)",
            textAlign: "center",
            maxWidth: 700,
          }}
        >
          Spiritual Service & Leadership Training — Egypt
        </div>
      </div>
    ),
    { ...size }
  );
}
