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
    label: "Products & Catalog",
    icon: "📦",
    subTabs: [
      { id: "Categories", label: "Shop by Category (8 Pillars)", icon: "🏛️" },
      { id: "Products", label: "Products Catalog", icon: "🏷️" },
      { id: "Combo Packages", label: "5-in-1 Combo Packages", icon: "🎁" },
      { id: "Showroom Gallery", label: "Workbench Showcase Gallery", icon: "📸" },
    ],
  },
  {
    id: "content-hub",
    label: "Page Content",
    icon: "✍️",
    subTabs: [
      { id: "Hero Section", label: "Hero Banner & Badges", icon: "👑" },
      { id: "Announcement Bar", label: "Top Announcement Bar", icon: "📢" },
      { id: "Why Choose Us", label: "5 Trust Pillars", icon: "🛡️" },
      { id: "Process Steps", label: "4-Step Order Guide", icon: "⚙️" },
      { id: "Reviews", label: "Client Reviews", icon: "⭐" },
      { id: "FAQs", label: "FAQs Accordion", icon: "❓" },
      { id: "Footer", label: "Footer & Hubs", icon: "⚓" },
    ],
  },
  {
    id: "global-hub",
    label: "Global & SEO",
    icon: "🌍",
    subTabs: [
      { id: "SEO & Meta", label: "Global SEO & Meta", icon: "🚀" },
      { id: "Worldwide Export", label: "Worldwide Export Hubs", icon: "🌐" },
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
      {/* Level 1: Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto rounded-2xl border border-gray-200/80 bg-white p-1.5 shadow-sm [scrollbar-width:none]">
        {tabCategories.map((cat) => {
          const isCatActive = cat.id === activeCategory.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                if (cat.subTabs.length > 0) {
                  onSelectTab(cat.subTabs[0].id);
                }
              }}
              className={cn(
                "relative flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer",
                isCatActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              {cat.id === "leads-hub" && newCount > 0 && (
                <span className="rounded-full bg-emerald-500 px-1.5 py-0.2 text-[10px] font-bold text-white">
                  {newCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Level 2: Sub-tabs */}
      {activeCategory.subTabs.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto rounded-xl border border-gray-200/60 bg-slate-50 p-1.5 [scrollbar-width:none]">
          {activeCategory.subTabs.map((sub) => {
            const isSubActive = sub.id === activeTab;
            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => onSelectTab(sub.id)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                  isSubActive
                    ? "bg-white text-amber-900 shadow-sm border border-amber-300 font-bold"
                    : "text-slate-600 hover:bg-white/60 hover:text-slate-900"
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
