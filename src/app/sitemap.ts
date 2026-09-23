import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.rafiqsonslabels.com";
  const now = new Date();

  const sections = [
    { path: "", priority: 1.0, freq: "daily" as const },
    { path: "/#collections", priority: 0.95, freq: "daily" as const },
    { path: "/#showcase", priority: 0.9, freq: "weekly" as const },
    { path: "/#worldwide-export", priority: 0.9, freq: "weekly" as const },
    { path: "/#process", priority: 0.85, freq: "monthly" as const },
    { path: "/#gallery", priority: 0.85, freq: "weekly" as const },
    { path: "/#reels", priority: 0.8, freq: "weekly" as const },
    { path: "/#reviews", priority: 0.8, freq: "weekly" as const },
    { path: "/#faq", priority: 0.85, freq: "monthly" as const },
    { path: "/#quote", priority: 0.95, freq: "daily" as const },
  ];

  return sections.map((s) => ({
    url: `${baseUrl}${s.path}`,
    lastModified: now,
    changeFrequency: s.freq,
    priority: s.priority,
  }));
}
