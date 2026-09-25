"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

export type TabCategory = {
  id: string;
  label: string;
  icon: string;
  subTabs: { id: string; label: string; icon: string }[];
};

export const tabCategories: TabCategory[] = [
  {
    id: "invoices-hub",
    label: "Invoices & Billing",
    icon: "🧾",
    subTabs: [
      { id: "Invoices", label: "Commercial Invoices", icon: "📑" },
      { id: "Customers", label: "Client Directory", icon: "👥" },
      { id: "Invoice Settings", label: "Billing & Bank Setup", icon: "⚙️" },
    ],
  },
  {
    id: "leads-hub",
    label: "Inquiries",
    icon: "💬",
    subTabs: [{ id: "Enquiries", label: "Customer Inquiries", icon: "💬" }],
  },
  {
    id: "products-hub",
    label: "Products & Media",
    icon: "📦",
    subTabs: [
      { id: "Products", label: "Products Catalog", icon: "🏷️" },
      { id: "Showcase Carousel", label: "Photo Carousel", icon: "📸" },
      { id: "Showroom Gallery", label: "Showroom Gallery", icon: "🖼️" },
      { id: "Workbench Videos", label: "Video Reels", icon: "🎬" },
    ],
  },
  {
    id: "global-hub",
    label: "Global & SEO",
    icon: "🌍",
    subTabs: [
      { id: "Worldwide Export", label: "Worldwide Export Hubs", icon: "🌐" },
      { id: "SEO & Meta", label: "Global SEO & Meta", icon: "🚀" },
      { id: "Trust Bar", label: "Trust Marquee", icon: "⚡" },
    ],
  },
  {
    id: "content-hub",
    label: "Page Content",
    icon: "✍️",
    subTabs: [
      { id: "Hero Section", label: "Hero Banner", icon: "👑" },
      { id: "Manifesto", label: "Brand Story", icon: "📖" },
      { id: "Philosophy", label: "Philosophy", icon: "🏛️" },
      { id: "Process Steps", label: "Process Steps", icon: "⚙️" },
      { id: "FAQs", label: "FAQs Accordion", icon: "❓" },
      { id: "Reviews", label: "Client Reviews", icon: "⭐" },
      { id: "Footer", label: "Footer", icon: "⚓" },
    ],
  },
  {
    id: "contact-hub",
    label: "Contact & Info",
    icon: "📞",
    subTabs: [{ id: "Contact & Info", label: "Contact & Socials", icon: "📞" }],
  },
  {
    id: "analytics-hub",
    label: "Live Analytics",
    icon: "📊",
    subTabs: [{ id: "Live Analytics", label: "Traffic Analytics", icon: "📊" }],
  },
];

export default function AdminTabsNav({
  activeTab,
  onSelectTab,
  newCount = 0,
}: {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  newCount?: number;
}) {
  // Find which category contains the active subTab
  const activeCategory = useMemo(() => {
    return (
      tabCategories.find((cat) => cat.subTabs.some((sub) => sub.id === activeTab)) ||
      tabCategories[0]
    );
  }, [activeTab]);

  return (
    <div className="mb-6 space-y-3">
      {/* Level 1: Clean Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto rounded-2xl border border-gray-200/80 bg-white p-1.5 shadow-sm [scrollbar-width:none]">
        {tabCategories.map((cat) => {
          const isCatActive = cat.id === activeCategory.id;
          const hasBadge = cat.id === "leads-hub" && newCount > 0;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectTab(cat.subTabs[0].id)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200",
                isCatActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              {hasBadge && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-400 px-1 text-[10px] font-black text-slate-950">
                  {newCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Level 2: Sub-tabs (Only show if category has more than 1 subTab) */}
      {activeCategory.subTabs.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto rounded-xl bg-slate-100/80 p-1.5 [scrollbar-width:none]">
          {activeCategory.subTabs.map((sub) => {
            const isSubActive = sub.id === activeTab;
            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => onSelectTab(sub.id)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-150",
                  isSubActive
                    ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-900/10"
                    : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                )}
              >
                <span>{sub.icon}</span>
                <span>{sub.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
