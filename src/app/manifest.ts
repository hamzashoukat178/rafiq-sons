import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rafiq Sons Labels - Custom Woven Labels & Garment Trims",
    short_name: "Rafiq Sons",
    description: "Custom woven labels, damask tags, luxury hang tags, satin wash care labels, and bespoke packaging for clothing brands worldwide.",
    start_url: "/",
    display: "standalone",
    background_color: "#0c0b09",
    theme_color: "#0c0b09",
    lang: "en",
    categories: ["business", "shopping", "manufacturing", "fashion"],
    icons: [
      {
        src: "/icon.png",
        sizes: "any",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
