"use client";

import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface TabItem<T extends string = string> {
  id: T;
  label: string;
  icon: string;
  badge?: number;
}

export default function AdminTabsNav<T extends string>({
  tabs,
  activeTab,
  onSelectTab,
  newCount = 0,
}: {
  tabs: readonly { id: T; label: string; icon: string }[];
  activeTab: T;
  onSelectTab: (tab: T) => void;
  newCount?: number;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check scroll bounds
  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = dir === "left" ? -260 : 260;
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
    const walk = (x - startX) * 1.6;
    el.scrollLeft = scrollLeftState - walk;
    checkScroll();
  };

  const currentTabObj = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <div className="relative mb-6">
      {/* Mobile Top Active Bar & Quick Switcher */}
      <div className="mb-3 flex items-center justify-between rounded-2xl border border-ink/10 bg-white p-3 shadow-sm md:hidden">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-base shadow-inner">
            {currentTabObj.icon}
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-ink/50">Current Section</p>
            <p className="font-display text-sm font-bold text-ink">{currentTabObj.label}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex items-center gap-1.5 rounded-full bg-coal px-3.5 py-1.5 text-xs font-semibold text-ivory shadow-sm active:scale-95 transition-transform"
        >
          <span>All Tabs</span>
          <span className="text-[10px] opacity-70">▼</span>
        </button>
      </div>

      {/* Mobile Dropdown Panel */}
      {isMobileMenuOpen && (
        <div className="mb-4 grid grid-cols-2 gap-2 rounded-2xl border border-ink/10 bg-white p-3 shadow-lg md:hidden animate-in fade-in zoom-in-95 duration-150">
          {tabs.map((t) => {
            const isActive = activeTab === t.id;
            const hasNew = t.id === "Enquiries" && newCount > 0;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  onSelectTab(t.id);
                  setIsMobileMenuOpen(false);
                }}
                className={cn(
                  "flex items-center gap-2 rounded-xl p-2.5 text-left text-xs font-semibold transition-all",
                  isActive
                    ? "bg-coal text-ivory ring-1 ring-gold shadow-sm"
                    : "bg-amber-50/40 text-ink/80 hover:bg-amber-100/60"
                )}
              >
                <span className="text-sm">{t.icon}</span>
                <span className="truncate">{t.label}</span>
                {hasNew && (
                  <span className="ml-auto flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-ink">
                    {newCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Desktop & Tablet Swipable Navigation Track */}
      <div className="flex items-center gap-2">
        {/* Left Arrow Button (hidden on very small screens, visible on md) */}
        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Scroll tabs left"
          className={cn(
            "hidden md:flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/15 bg-white text-ink text-xs font-bold shadow-sm transition-all hover:bg-coal hover:text-ivory active:scale-95",
            !canScrollLeft && "opacity-30 pointer-events-none"
          )}
        >
          ◀
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
            "flex flex-1 items-center gap-2 overflow-x-auto py-1 select-none scroll-smooth",
            "cursor-grab active:cursor-grabbing",
            "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          )}
        >
          {tabs.map((t) => {
            const isActive = activeTab === t.id;
            const hasNew = t.id === "Enquiries" && newCount > 0;
            return (
              <button
                key={t.id}
                type="button"
                onClick={(e) => {
                  onSelectTab(t.id);
                  (e.currentTarget as HTMLElement).scrollIntoView({
                    behavior: "smooth",
                    inline: "center",
                    block: "nearest",
                  });
                }}
                className={cn(
                  "group relative flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-200",
                  isActive
                    ? "bg-coal text-ivory shadow-md ring-2 ring-gold-deep"
                    : "bg-white text-ink/70 hover:bg-amber-50 hover:text-ink border border-ink/10"
                )}
              >
                <span className="text-sm opacity-90 group-hover:scale-110 transition-transform">{t.icon}</span>
                <span>{t.label}</span>
                {hasNew && (
                  <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-ink animate-pulse">
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
            "hidden md:flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/15 bg-white text-ink text-xs font-bold shadow-sm transition-all hover:bg-coal hover:text-ivory active:scale-95",
            !canScrollRight && "opacity-30 pointer-events-none"
          )}
        >
          ▶
        </button>
      </div>
    </div>
  );
}
