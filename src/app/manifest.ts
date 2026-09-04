import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rafiq Sons Labels",
    short_name: "Rafiq Sons",
    description: "Custom woven labels, hang tags and packaging for clothing brands.",
    start_url: "/",
    display: "standalone",
    background_color: "#0c0b09",
    theme_color: "#0c0b09",
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
