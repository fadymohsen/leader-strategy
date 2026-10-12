import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Leader Strategies",
    short_name: "Leader Strategies",
    description:
      "A leader-led movement within the Spiritual Service and Leadership Training Organization in Egypt.",
    start_url: "/en",
    display: "standalone",
    background_color: "#f5f0ea",
    theme_color: "#a3462a",
    icons: [
      { src: "/icon.png", sizes: "192x192", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
