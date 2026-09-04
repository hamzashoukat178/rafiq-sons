"use client";

import { useEffect, useRef } from "react";

export default function TitleSwitcher() {
  const saved = useRef<string | null>(null);

  useEffect(() => {
    const onVis = () => {
      if (document.hidden) {
        saved.current = document.title;
        document.title = "Hey, come back!";
      } else if (saved.current) {
        document.title = saved.current;
        saved.current = null;
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return null;
}
