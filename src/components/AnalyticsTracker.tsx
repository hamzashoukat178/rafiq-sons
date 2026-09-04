"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Only run on client side and skip admin page tracking
    if (typeof window === "undefined" || pathname.startsWith("/admin")) return;

    try {
      let visitorId = localStorage.getItem("rs_vid");
      if (!visitorId) {
        visitorId = "v-" + Math.random().toString(36).substring(2, 11);
        localStorage.setItem("rs_vid", visitorId);
      }

      const payload = {
        path: pathname + window.location.hash,
        referrer: document.referrer || "Direct",
        visitorId,
        screen: `${window.innerWidth}x${window.innerHeight}`,
      };

      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          "/api/analytics",
          new Blob([JSON.stringify(payload)], { type: "application/json" })
        );
      } else {
        fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Ignore tracker errors silently
    }
  }, [pathname]);

  return null;
}
