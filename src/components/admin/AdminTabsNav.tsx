"use client";

import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function AdminTabsNav<T extends string>({
  tabs,
  activeTab,
  onSelectTab,
  newCount = 0,
}: {
  tabs: readonly T[];
  activeTab: T;
  onSelectTab: (tab: T) => void;
  newCount?: number;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll bounds
  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = dir === "left" ? -280 : 280;
    el.scrollBy({ left: amount, behavior: "smooth" });
    setTimeout(checkScroll, 300);
  };

  // Drag to scroll for desktop mouse users
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const onMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    setIsDown(true);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeftState(el.scrollLeft);
  };

  const onMouseLeave = () => setIsDown(false);
  const onMouseUp = () => setIsDown(false);

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDown) return;
    e.preventDefault();
    const el = scrollRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.5;
    el.scrollLeft = scrollLeftState - walk;
    checkScroll();
  };

  return (
    <div className="relative mb-6">
      <div className="flex items-center gap-2">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Scroll tabs left"
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/15 bg-white text-ink shadow-sm transition-all hover:bg-coal hover:text-ivory",
            !canScrollLeft && "opacity-40 pointer-events-none"
          )}
        >
          ←
        </button>

        {/* Scrollable / Draggable Track */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          style={{ WebkitOverflowScrolling: "touch" }}
          className={cn(
            "flex flex-1 items-center gap-2 overflow-x-auto py-2 select-none",
            "cursor-grab active:cursor-grabbing",
            "[scrollbar-width:thin] [scrollbar-color:#c6a15b_transparent]",
            "[&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-amber-300/80 [&::-webkit-scrollbar-track]:bg-transparent"
          )}
        >
          {tabs.map((t) => {
            const isActive = activeTab === t;
            return (
              <button
                key={t}
                type="button"
                onClick={(e) => {
                  onSelectTab(t);
                  // Auto scroll clicked button into view
                  (e.currentTarget as HTMLElement).scrollIntoView({
                    behavior: "smooth",
                    inline: "center",
                    block: "nearest",
                  });
                }}
                className={cn(
                  "relative shrink-0 whitespace-nowrap rounded-full px-5 py-2.5 text-xs font-semibold tracking-wide transition-all shadow-sm",
                  isActive
                    ? "bg-coal text-ivory shadow-md ring-2 ring-gold-deep"
                    : "bg-white text-ink/75 hover:bg-amber-50 hover:text-ink border border-ink/10"
                )}
              >
                {t}
                {t === "Enquiries" && newCount > 0 && (
                  <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-ink">
                    {newCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Scroll tabs right"
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/15 bg-white text-ink shadow-sm transition-all hover:bg-coal hover:text-ivory",
            !canScrollRight && "opacity-40 pointer-events-none"
          )}
        >
          →
        </button>
      </div>

      {/* Mobile Quick Dropdown */}
      <div className="mt-2 block sm:hidden">
        <select
          value={activeTab}
          onChange={(e) => onSelectTab(e.target.value as T)}
          className="w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-xs font-semibold text-ink shadow-sm outline-none focus:border-gold-deep"
        >
          {tabs.map((t) => (
            <option key={t} value={t}>
              Jump to tab: {t} {t === "Enquiries" && newCount > 0 ? `(${newCount} new)` : ""}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
