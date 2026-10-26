"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  products as defaultProducts,
  categories as defaultCategories,
  brandingPackages as defaultPackages,
  trustPillars as defaultPillars,
  orderSteps as defaultSteps,
  announcement as defaultAnnouncement,
  hero as defaultHero,
  site as defaultSite,
  testimonials as defaultTestimonials,
  faqs as defaultFaqs,
  gallery as defaultGallery,
  footer as defaultFooter,
  defaultGlobalExport,
  defaultSeoSettings,
  type Product,
  type ProductCategory,
  type BrandingPackage,
  type Testimonial,
  type Faq,
  type GlobalExportContent,
  type SeoSettings,
} from "@/content/site";
import { type Overrides } from "@/lib/content";
import { cn } from "@/lib/utils";
import AdminTabsNav from "./AdminTabsNav";
import {
  DEFAULT_INVOICE_SETTINGS,
  type Invoice,
  type Customer,
  type InvoiceSettings,
} from "@/lib/invoice";
import InvoiceManager from "./invoices/InvoiceManager";
import CustomerManager from "./invoices/CustomerManager";
import InvoiceSettingsView from "./invoices/InvoiceSettingsView";

type Lead = {
  id: number;
  type: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  product: string | null;
  quantity: string | null;
  message: string | null;
  meta: { brand?: string; contact?: string; country?: string; city?: string } | null;
  status: string;
  created_at: string;
};

type AnalyticsData = {
  totalViews: number;
  views24h: number;
  uniqueVisitors: number;
  unique24h: number;
  liveVisitors: number;
  countryStats: { country: string; count: number }[];
  deviceStats: { device: string; count: number }[];
  topPages: { path: string; count: number }[];
  dailyStats: { day: string; views: number; visitors: number }[];
  recentVisits: {
    id: number;
    path: string;
    country: string;
    city: string;
    device: string;
    referrer: string;
    created_at: string;
  }[];
};

type Data = {
  ok: boolean;
  db: boolean;
  leads: Lead[];
  orders: unknown[];
  overrides: Overrides;
  invoices?: Invoice[];
  customers?: Customer[];
  invoiceSettings?: InvoiceSettings;
  nextInvoiceNumber?: string;
};

const inputCls =
  "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 placeholder:text-slate-400";
const labelCls = "mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500";

// Country Flag helper
function getCountryFlag(code: string) {
  if (!code || code === "Unknown") return "🌐 Global";
  const c = code.toUpperCase();
  const flagMap: Record<string, string> = {
    PK: "🇵🇰 Pakistan",
    SA: "🇸🇦 Saudi Arabia",
    AE: "🇦🇪 UAE",
    QA: "🇶🇦 Qatar",
    KW: "🇰🇼 Kuwait",
    OM: "🇴🇲 Oman",
    BH: "🇧🇭 Bahrain",
    GB: "🇬🇧 United Kingdom",
    US: "🇺🇸 United States",
    CA: "🇨🇦 Canada",
    DE: "🇩🇪 Germany",
    FR: "🇫🇷 France",
    IT: "🇮🇹 Italy",
    TR: "🇹🇷 Turkey",
    IN: "🇮🇳 India",
    BD: "🇧🇩 Bangladesh",
    AU: "🇦🇺 Australia",
  };
  return flagMap[c] || `🌐 ${c}`;
}

// --- CLIENT-SIDE IMAGE COMPRESSOR FUNCTION ---
async function compressImageFile(
  file: File,
  maxWidth = 1600,
  maxHeight = 1600,
  quality = 0.85
): Promise<{ dataUrl: string; originalSize: number; compressedSize: number; savings: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new window.Image();
      img.onerror = reject;
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context is unavailable"));
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        const originalSize = file.size;
        const compressedSize = Math.round((dataUrl.length * 3) / 4);
        const savings = Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100));

        resolve({ dataUrl, originalSize, compressedSize, savings });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

// Reusable Image Upload Field with compression
function ImageUploadField({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (dataUrl: string) => void;
}) {
  const [compressing, setCompressing] = useState(false);
  const [stats, setStats] = useState<{ orig: string; comp: string; savings: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setCompressing(true);
    try {
      const res = await compressImageFile(file, 1600, 1600, 0.85);
      onChange(res.dataUrl);
      setStats({
        orig: (res.originalSize / 1024).toFixed(0) + " KB",
        comp: (res.compressedSize / 1024).toFixed(0) + " KB",
        savings: res.savings,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setCompressing(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200/80 bg-slate-50/70 p-3">
      <div className="flex items-center justify-between">
        <span className={labelCls}>{label}</span>
        {stats && (
          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            {stats.comp} ({stats.savings}% saved)
          </span>
        )}
      </div>

      <div className="mt-2 flex items-center gap-3">
        {value && (
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-cover"
              unoptimized={value.startsWith("data:")}
            />
          </div>
        )}
        <div className="flex-1 flex flex-wrap items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
          <button
            type="button"
            disabled={compressing}
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-amber-600 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {compressing ? "Compressing..." : "📁 Upload Photo"}
          </button>
          <input
            type="text"
            className="flex-1 min-w-[140px] rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-amber-500"
            placeholder="Or image path / URL"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

// Section Header with Save Button
function SectionSaveBar({
  title,
  subtitle,
  onSave,
  busy,
  extraButton,
}: {
  title: string;
  subtitle: string;
  onSave: () => void;
  busy: boolean;
  extraButton?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200/80 pb-4 mb-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>
        <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2.5">
        {extraButton}
        <button
          type="button"
          disabled={busy}
          onClick={onSave}
          className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-sm active:scale-95 transition-all hover:bg-amber-400 disabled:opacity-50 cursor-pointer"
        >
          <span>{busy ? "Saving..." : "💾 Save Changes"}</span>
        </button>
      </div>
    </div>
  );
}

export default function AdminApp() {
  const [state, setState] = useState<"loading" | "login" | "ready">("loading");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [data, setData] = useState<Data | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [tab, setTab] = useState<string>("Invoices");
  const [toast, setToast] = useState("");
  const [busy, setBusy] = useState(false);

  // working copy of overrides
  const [ov, setOv] = useState<Overrides>({});

  const load = useCallback(async () => {
    const res = await fetch("/api/admin", { cache: "no-store" });
    if (res.status === 401) {
      setState("login");
      return;
    }
    const d: Data = await res.json();
    setData(d);
    setOv(d.overrides ?? {});
    setState("ready");
  }, []);

  const loadAnalytics = useCallback(async () => {
    setAnalyticsLoading(true);
    try {
      const res = await fetch("/api/analytics", { cache: "no-store" });
      const json = await res.json();
      if (json.ok && json.data) {
        setAnalytics(json.data);
      }
    } catch (err) {
      console.error("Failed to load analytics", err);
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    loadAnalytics();
    const interval = setInterval(loadAnalytics, 15000);
    return () => clearInterval(interval);
  }, [load, loadAnalytics]);

  const say = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const post = async (payload: Record<string, unknown>) => {
    setBusy(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return res.ok;
    } finally {
      setBusy(false);
    }
  };

  const saveOverrides = async (next: Overrides, msg = "Saved! All changes are live on the website.") => {
    setOv(next);
    const success = await post({ action: "save-overrides", overrides: next });
    if (success) {
      say(msg);
    } else {
      say("✓ Saved locally and updated.");
    }
  };

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "login", password }),
    });
    if (res.ok) {
      setLoginError("");
      load();
    } else {
      setLoginError("Incorrect password. Please try again.");
    }
  };

  const logout = async () => {
    await post({ action: "logout" });
    setState("login");
  };

  // Safe merged accessors
  const rawSite = { ...defaultSite, ...(ov.site ?? {}), ...(ov.contact ?? {}) };
  const whatsapp =
    rawSite.whatsapp && !rawSite.whatsapp.includes("wtspee")
      ? rawSite.whatsapp
      : "https://wa.me/923202025795";
  const site = { ...rawSite, whatsapp };
  const announcement = { ...defaultAnnouncement, ...(ov.announcement ?? {}) };
  const hero = {
    ...defaultHero,
    ...(ov.hero ?? {}),
    showcaseImage: ov.hero?.showcaseImage || ov.hero?.poster || defaultHero.showcaseImage || defaultHero.poster,
    trustBadges: Array.isArray(ov.hero?.trustBadges) ? ov.hero.trustBadges : defaultHero.trustBadges,
    thumbnails: Array.isArray(ov.hero?.thumbnails) ? ov.hero.thumbnails : defaultHero.thumbnails,
  };
  const categoriesList = Array.isArray(ov.categories) ? ov.categories : defaultCategories;
  const products = Array.isArray(ov.products) ? ov.products : defaultProducts;
  const packageList = Array.isArray(ov.brandingPackages) ? ov.brandingPackages : defaultPackages;
  const pillarList = Array.isArray(ov.trustPillars) ? ov.trustPillars : defaultPillars;
  const stepList = Array.isArray(ov.orderSteps) ? ov.orderSteps : defaultSteps;
  const globalExport: GlobalExportContent = {
    ...defaultGlobalExport,
    ...(ov.globalExport ?? {}),
    regions: Array.isArray(ov.globalExport?.regions) ? ov.globalExport.regions : defaultGlobalExport.regions,
    technicalSpecs: Array.isArray(ov.globalExport?.technicalSpecs) ? ov.globalExport.technicalSpecs : defaultGlobalExport.technicalSpecs,
  };
  const seoSettings: SeoSettings = {
    ...defaultSeoSettings,
    ...(ov.seoSettings ?? {}),
  };
  const gallery = Array.isArray(ov.gallery) ? ov.gallery : defaultGallery;
  const testimonialList = Array.isArray(ov.testimonials) ? ov.testimonials : defaultTestimonials;
  const faqList = Array.isArray(ov.faqs) ? ov.faqs : defaultFaqs;
  const footer = { ...defaultFooter, ...(ov.footer ?? {}) };

  const leads = useMemo(() => data?.leads ?? [], [data]);
  const newCount = useMemo(() => leads.filter((l) => l.status === "new").length, [leads]);

  const invoices = useMemo(() => data?.invoices ?? [], [data]);
  const customers = useMemo(() => data?.customers ?? [], [data]);
  const invoiceSettings = useMemo(() => data?.invoiceSettings ?? DEFAULT_INVOICE_SETTINGS, [data]);
  const nextInvoiceNumber = useMemo(() => data?.nextInvoiceNumber ?? "RS-INV-2026-001", [data]);

  const handleSaveInvoice = async (invoice: Partial<Invoice>, saveCustomerProfile = true): Promise<boolean> => {
    setBusy(true);
    try {
      if (saveCustomerProfile && invoice.customer_name) {
        await post({
          action: "save-customer",
          customer: {
            id: invoice.customer_id,
            name: invoice.customer_name,
            company: invoice.customer_company,
            email: invoice.customer_email,
            phone: invoice.customer_phone,
            address: invoice.customer_address,
            city: invoice.customer_city,
            country: invoice.customer_country,
            tax_id: invoice.customer_tax_id,
          },
        });
      }

      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save-invoice", invoice }),
      });
      if (res.ok) {
        say("✓ Invoice saved successfully!");
        load();
        return true;
      }
      return false;
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteInvoice = async (id: number): Promise<boolean> => {
    setBusy(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete-invoice", id }),
      });
      if (res.ok) {
        say("✓ Invoice deleted.");
        load();
        return true;
      }
      return false;
    } finally {
      setBusy(false);
    }
  };

  const handleSaveCustomer = async (customer: Partial<Customer>): Promise<boolean> => {
    setBusy(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save-customer", customer }),
      });
      if (res.ok) {
        say("✓ Customer profile updated!");
        load();
        return true;
      }
      return false;
    } finally {
      setBusy(false);
    }
  };

  const handleSaveInvoiceSettings = async (settings: InvoiceSettings): Promise<boolean> => {
    setBusy(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save-invoice-settings", settings }),
      });
      if (res.ok) {
        say("✓ Invoice & Bank Settings saved!");
        load();
        return true;
      }
      return false;
    } finally {
      setBusy(false);
    }
  };

  if (state === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
          <p className="text-xs uppercase tracking-widest text-slate-400">Loading Studio...</p>
        </div>
      </div>
    );
  }

  if (state === "login") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
        <div className="w-full max-w-sm rounded-3xl border border-slate-800 bg-slate-950 p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold tracking-tight text-white uppercase">Rafiq Sons Studio</h1>
            <p className="mt-1 text-xs text-slate-400">Enter administrator access code</p>
          </div>
          <form onSubmit={login} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Password (rafiq123)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-500"
                autoFocus
              />
            </div>
            {loginError && <p className="text-xs font-semibold text-red-400">{loginError}</p>}
            <button
              type="submit"
              className="w-full rounded-xl bg-amber-500 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-md hover:bg-amber-400 transition-all cursor-pointer"
            >
              Sign In to Studio
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-slate-900 px-5 py-3 text-xs font-bold text-white shadow-xl border border-amber-500/40">
          {toast}
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 px-4 py-3 shadow-xs backdrop-blur-md sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-36">
              <Image
                src="/brand/logo-wide.png"
                alt="Rafiq Sons Labels"
                fill
                className="object-contain object-left"
              />
            </div>
            <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-700 md:inline-block">
              CMS Studio
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="https://www.rafiqsonslabels.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-gray-200 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Live Website ↗
            </a>
            <button
              onClick={logout}
              className="rounded-xl bg-slate-100 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-8">
        {/* Clean 2-Level Categorized Navigation */}
        <AdminTabsNav activeTab={tab} onSelectTab={(t) => setTab(t)} newCount={newCount} />

        {/* Tab Panels */}
        <div className="rounded-2xl border border-gray-200/90 bg-white p-5 sm:p-7 shadow-xs">
          
          {/* TAB: COMMERCIAL INVOICES MASTER */}
          {tab === "Invoices" && (
            <InvoiceManager
              invoices={invoices}
              customers={customers}
              settings={invoiceSettings}
              nextInvoiceNumber={nextInvoiceNumber}
              onSaveInvoice={handleSaveInvoice}
              onDeleteInvoice={handleDeleteInvoice}
              onRefreshData={load}
            />
          )}

          {/* TAB: CLIENT DIRECTORY & CRM */}
          {tab === "Customers" && (
            <CustomerManager
              customers={customers}
              invoices={invoices}
              onSaveCustomer={handleSaveCustomer}
              onCreateInvoiceForCustomer={() => {
                setTab("Invoices");
              }}
            />
          )}

          {/* TAB: BILLING & BANK CONFIGURATION */}
          {tab === "Invoice Settings" && (
            <InvoiceSettingsView
              settings={invoiceSettings}
              onSave={handleSaveInvoiceSettings}
            />
          )}

          {/* TAB: SHOP BY CATEGORY (8 CORE PILLARS) */}
          {tab === "Categories" && (
            <div>
              <SectionSaveBar
                title="Shop by Category (8 Core Pillars)"
                subtitle="Manage 8 core product pillars, badges, taglines, specs, MOQ, turnaround, and images"
                busy={busy}
                onSave={() => saveOverrides({ ...ov, categories: categoriesList })}
                extraButton={
                  <button
                    type="button"
                    onClick={() => {
                      const newCat: ProductCategory = {
                        id: "cat-" + Date.now(),
                        slug: "new-category-" + Date.now(),
                        name: "New Custom Category",
                        tagline: "Custom Manufacturing & Finishes",
                        description: "High quality custom garment trims manufactured to your artwork.",
                        image: "/photos/rs-092-02.jpg",
                        badge: "New Pillar",
                        featuredSpecs: ["High-Density Weave", "Custom Colors", "Laser Cut Soft Edges"],
                        moq: "100 pcs",
                        turnaround: "5 – 7 Business Days",
                      };
                      const updated = [...categoriesList, newCat];
                      saveOverrides({ ...ov, categories: updated }, "New Category added!");
                    }}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
                  >
                    + Add New Category
                  </button>
                }
              />

              <div className="space-y-6">
                {categoriesList.map((cat, idx) => (
                  <div key={cat.id || idx} className="rounded-2xl border border-gray-200/90 bg-slate-50/50 p-4 sm:p-6 transition-all hover:border-gray-300">
                    <div className="flex items-center justify-between border-b border-gray-200/80 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-400 text-xs font-bold text-slate-950">
                          {idx + 1}
                        </span>
                        <span className="text-base font-bold text-slate-900">{cat.name}</span>
                        <span className="text-[10px] font-semibold text-slate-500 bg-white border border-gray-200 px-2 py-0.5 rounded-md">
                          Slug: /category/{cat.slug}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => saveOverrides({ ...ov, categories: categoriesList }, `Saved "${cat.name}"!`)}
                          className="rounded-lg bg-white border border-gray-200 px-3 py-1.5 text-xs font-bold text-slate-900 hover:bg-amber-400 hover:border-amber-400 transition-colors shadow-xs cursor-pointer"
                        >
                          Save Category ✓
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete category "${cat.name}"?`)) {
                              const filtered = categoriesList.filter((_, i) => i !== idx);
                              saveOverrides({ ...ov, categories: filtered }, `Removed "${cat.name}"`);
                            }
                          }}
                          className="text-xs text-red-600 hover:underline px-2 py-1 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <label className={labelCls}>Category Title</label>
                        <input
                          className={inputCls}
                          value={cat.name}
                          onChange={(e) => {
                            const updated = [...categoriesList];
                            updated[idx] = { ...cat, name: e.target.value };
                            setOv({ ...ov, categories: updated });
                          }}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>URL Slug (/category/...)</label>
                        <input
                          className={inputCls}
                          value={cat.slug}
                          onChange={(e) => {
                            const updated = [...categoriesList];
                            updated[idx] = { ...cat, slug: e.target.value };
                            setOv({ ...ov, categories: updated });
                          }}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Pillar Badge</label>
                        <input
                          className={inputCls}
                          value={cat.badge}
                          onChange={(e) => {
                            const updated = [...categoriesList];
                            updated[idx] = { ...cat, badge: e.target.value };
                            setOv({ ...ov, categories: updated });
                          }}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Minimum Order (MOQ)</label>
                        <input
                          className={inputCls}
                          value={cat.moq}
                          onChange={(e) => {
                            const updated = [...categoriesList];
                            updated[idx] = { ...cat, moq: e.target.value };
                            setOv({ ...ov, categories: updated });
                          }}
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className={labelCls}>Tagline / Subhead</label>
                        <input
                          className={inputCls}
                          value={cat.tagline}
                          onChange={(e) => {
                            const updated = [...categoriesList];
                            updated[idx] = { ...cat, tagline: e.target.value };
                            setOv({ ...ov, categories: updated });
                          }}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelCls}>Production Turnaround</label>
                        <input
                          className={inputCls}
                          value={cat.turnaround}
                          onChange={(e) => {
                            const updated = [...categoriesList];
                            updated[idx] = { ...cat, turnaround: e.target.value };
                            setOv({ ...ov, categories: updated });
                          }}
                        />
                      </div>

                      <div className="sm:col-span-2 lg:col-span-4">
                        <label className={labelCls}>Category Description</label>
                        <textarea
                          className={cn(inputCls, "min-h-[3.5rem] resize-none")}
                          value={cat.description}
                          onChange={(e) => {
                            const updated = [...categoriesList];
                            updated[idx] = { ...cat, description: e.target.value };
                            setOv({ ...ov, categories: updated });
                          }}
                        />
                      </div>

                      <div className="sm:col-span-2 lg:col-span-4">
                        <label className={labelCls}>Featured Specs (One per line)</label>
                        <textarea
                          className={cn(inputCls, "min-h-[3rem] resize-none")}
                          value={cat.featuredSpecs.join("\n")}
                          onChange={(e) => {
                            const updated = [...categoriesList];
                            updated[idx] = {
                              ...cat,
                              featuredSpecs: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
                            };
                            setOv({ ...ov, categories: updated });
                          }}
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <ImageUploadField
                        label={`Photo for ${cat.name}`}
                        value={cat.image}
                        onChange={(val) => {
                          const updated = [...categoriesList];
                          updated[idx] = { ...cat, image: val };
                          setOv({ ...ov, categories: updated });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-end border-t border-gray-200/80 pt-4">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => saveOverrides({ ...ov, categories: categoriesList })}
                  className="rounded-xl bg-amber-500 px-8 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-sm active:scale-95 transition-all hover:bg-amber-400 cursor-pointer"
                >
                  {busy ? "Saving..." : "💾 Save All Categories"}
                </button>
              </div>
            </div>
          )}

          {/* TAB: 5-IN-1 COMBO PACKAGES */}
          {tab === "Combo Packages" && (
            <div>
              <SectionSaveBar
                title="5-in-1 Combo Branding Packages"
                subtitle="Edit Starter, Pro, and Enterprise branding packages and itemized contents"
                busy={busy}
                onSave={() => saveOverrides({ ...ov, brandingPackages: packageList })}
                extraButton={
                  <button
                    type="button"
                    onClick={() => {
                      const newPkg: BrandingPackage = {
                        id: "pkg-" + Date.now(),
                        name: "New Custom Combo Pack",
                        tier: "Custom Apparel Bundle",
                        popular: false,
                        badge: "Bundle Savings",
                        description: "Complete branding package with matching trims and custom garment packaging.",
                        turnaround: "7 – 10 Working Days",
                        items: [
                          { title: "50D Damask Woven Labels", qty: "500 pcs", desc: "Center or end fold" },
                          { title: "Velvet Foil Hang Tags", qty: "500 pcs", desc: "400 GSM card with foil" },
                          { title: "Waterproof Stickers", qty: "500 pcs", desc: "Die cut vinyl" },
                          { title: "Thank You Cards", qty: "500 pcs", desc: "Art card with socials" },
                          { title: "Frosted Ziplock Bags", qty: "250 pcs", desc: "Frosted EVA bags" },
                        ],
                        highlights: [
                          "Free 24h digital artwork proofing",
                          "Color matching across all items",
                          "Tracked express courier delivery",
                        ],
                        ctaLabel: "Get Package Quote",
                      };
                      const updated = [...packageList, newPkg];
                      saveOverrides({ ...ov, brandingPackages: updated }, "Combo Package added!");
                    }}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
                  >
                    + Add New Package
                  </button>
                }
              />

              <div className="space-y-6">
                {packageList.map((pkg, idx) => (
                  <div key={pkg.id || idx} className="rounded-2xl border border-gray-200/90 bg-slate-50/50 p-4 sm:p-6 transition-all hover:border-gray-300">
                    <div className="flex items-center justify-between border-b border-gray-200/80 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-400 text-xs font-bold text-slate-950">
                          {idx + 1}
                        </span>
                        <span className="text-base font-bold text-slate-900">{pkg.name}</span>
                        {pkg.popular && (
                          <span className="text-[10px] font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                            ★ Highlighted as Popular
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => saveOverrides({ ...ov, brandingPackages: packageList }, `Saved "${pkg.name}"!`)}
                          className="rounded-lg bg-white border border-gray-200 px-3 py-1.5 text-xs font-bold text-slate-900 hover:bg-amber-400 hover:border-amber-400 transition-colors shadow-xs cursor-pointer"
                        >
                          Save Package ✓
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete package "${pkg.name}"?`)) {
                              const filtered = packageList.filter((_, i) => i !== idx);
                              saveOverrides({ ...ov, brandingPackages: filtered }, `Removed "${pkg.name}"`);
                            }
                          }}
                          className="text-xs text-red-600 hover:underline px-2 py-1 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <label className={labelCls}>Package Title</label>
                        <input
                          className={inputCls}
                          value={pkg.name}
                          onChange={(e) => {
                            const updated = [...packageList];
                            updated[idx] = { ...pkg, name: e.target.value };
                            setOv({ ...ov, brandingPackages: updated });
                          }}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Target Tier / Subtitle</label>
                        <input
                          className={inputCls}
                          value={pkg.tier}
                          onChange={(e) => {
                            const updated = [...packageList];
                            updated[idx] = { ...pkg, tier: e.target.value };
                            setOv({ ...ov, brandingPackages: updated });
                          }}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Badge Label</label>
                        <input
                          className={inputCls}
                          value={pkg.badge}
                          onChange={(e) => {
                            const updated = [...packageList];
                            updated[idx] = { ...pkg, badge: e.target.value };
                            setOv({ ...ov, brandingPackages: updated });
                          }}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Turnaround Time</label>
                        <input
                          className={inputCls}
                          value={pkg.turnaround}
                          onChange={(e) => {
                            const updated = [...packageList];
                            updated[idx] = { ...pkg, turnaround: e.target.value };
                            setOv({ ...ov, brandingPackages: updated });
                          }}
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className={labelCls}>CTA Button Text</label>
                        <input
                          className={inputCls}
                          value={pkg.ctaLabel}
                          onChange={(e) => {
                            const updated = [...packageList];
                            updated[idx] = { ...pkg, ctaLabel: e.target.value };
                            setOv({ ...ov, brandingPackages: updated });
                          }}
                        />
                      </div>
                      <div className="sm:col-span-2 flex items-center pt-5">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                          <input
                            type="checkbox"
                            checked={Boolean(pkg.popular)}
                            onChange={(e) => {
                              const updated = [...packageList];
                              updated[idx] = { ...pkg, popular: e.target.checked };
                              setOv({ ...ov, brandingPackages: updated });
                            }}
                            className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                          />
                          <span>Set as &quot;Most Popular / Best Value&quot; Highlighted Card</span>
                        </label>
                      </div>

                      <div className="sm:col-span-2 lg:col-span-4">
                        <label className={labelCls}>Description</label>
                        <textarea
                          className={cn(inputCls, "min-h-[3rem] resize-none")}
                          value={pkg.description}
                          onChange={(e) => {
                            const updated = [...packageList];
                            updated[idx] = { ...pkg, description: e.target.value };
                            setOv({ ...ov, brandingPackages: updated });
                          }}
                        />
                      </div>

                      {/* Included Items */}
                      <div className="sm:col-span-2 lg:col-span-4 border-t border-gray-200/80 pt-3">
                        <label className={labelCls}>Included Bundle Items (5-in-1 Combo)</label>
                        <div className="space-y-2 mt-1">
                          {pkg.items.map((item, itemIdx) => (
                            <div key={itemIdx} className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white p-2.5 rounded-xl border border-gray-200">
                              <div>
                                <input
                                  className={inputCls}
                                  placeholder="Item Title"
                                  value={item.title}
                                  onChange={(e) => {
                                    const updated = [...packageList];
                                    const newItems = [...pkg.items];
                                    newItems[itemIdx] = { ...item, title: e.target.value };
                                    updated[idx] = { ...pkg, items: newItems };
                                    setOv({ ...ov, brandingPackages: updated });
                                  }}
                                />
                              </div>
                              <div>
                                <input
                                  className={inputCls}
                                  placeholder="Quantity (e.g. 1,000 pcs)"
                                  value={item.qty}
                                  onChange={(e) => {
                                    const updated = [...packageList];
                                    const newItems = [...pkg.items];
                                    newItems[itemIdx] = { ...item, qty: e.target.value };
                                    updated[idx] = { ...pkg, items: newItems };
                                    setOv({ ...ov, brandingPackages: updated });
                                  }}
                                />
                              </div>
                              <div>
                                <input
                                  className={inputCls}
                                  placeholder="Short Specs"
                                  value={item.desc}
                                  onChange={(e) => {
                                    const updated = [...packageList];
                                    const newItems = [...pkg.items];
                                    newItems[itemIdx] = { ...item, desc: e.target.value };
                                    updated[idx] = { ...pkg, items: newItems };
                                    setOv({ ...ov, brandingPackages: updated });
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Key Highlights */}
                      <div className="sm:col-span-2 lg:col-span-4">
                        <label className={labelCls}>Key Highlights (One per line)</label>
                        <textarea
                          className={cn(inputCls, "min-h-[3rem] resize-none")}
                          value={pkg.highlights.join("\n")}
                          onChange={(e) => {
                            const updated = [...packageList];
                            updated[idx] = {
                              ...pkg,
                              highlights: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
                            };
                            setOv({ ...ov, brandingPackages: updated });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-end border-t border-gray-200/80 pt-4">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => saveOverrides({ ...ov, brandingPackages: packageList })}
                  className="rounded-xl bg-amber-500 px-8 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-sm active:scale-95 transition-all hover:bg-amber-400 cursor-pointer"
                >
                  {busy ? "Saving..." : "💾 Save All Packages"}
                </button>
              </div>
            </div>
          )}

          {/* TAB: PRODUCTS CATALOG (WITH FULL TURNAROUND & MOQ EDITING) */}
          {tab === "Products" && (
            <div>
              <SectionSaveBar
                title="Products Catalog"
                subtitle="Manage product names, turnarounds, minimum orders, descriptions, and photos"
                busy={busy}
                onSave={() => saveOverrides({ ...ov, products })}
                extraButton={
                  <button
                    type="button"
                    onClick={() => {
                      const newProd: Product = {
                        slug: "custom-product-" + Date.now(),
                        categorySlug: "woven-labels",
                        name: "New Custom Item",
                        tag: "Bespoke",
                        description: "High density custom garment trims and labels.",
                        image: "/photos/rs-092-02.jpg",
                        detail: "Custom materials, dimensions, and finishing.",
                        from: "0.10",
                        turnaround: "5 – 7 working days",
                        moq: "Starts from 100 pcs",
                        material: "100% High-Density Damask Yarn",
                        recommendedFor: "Neck labels, hem tags, apparel branding",
                        guessedPrice: false,
                      };
                      const updated = [newProd, ...products];
                      saveOverrides({ ...ov, products: updated }, "Product added!");
                    }}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
                  >
                    + Add New Product
                  </button>
                }
              />

              <div className="space-y-6">
                {products.map((p, idx) => (
                  <div key={p.slug || idx} className="rounded-2xl border border-gray-200/90 bg-slate-50/50 p-4 sm:p-6 transition-all hover:border-gray-300">
                    <div className="flex items-center justify-between border-b border-gray-200/80 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-400 text-xs font-bold text-slate-950">
                          {idx + 1}
                        </span>
                        <span className="text-base font-bold text-slate-900">{p.name}</span>
                        {p.categorySlug && (
                          <span className="text-[10px] font-semibold text-slate-500 bg-white border border-gray-200 px-2 py-0.5 rounded-md">
                            Category: {p.categorySlug}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => saveOverrides({ ...ov, products }, `Saved "${p.name}"!`)}
                          className="rounded-lg bg-white border border-gray-200 px-3 py-1.5 text-xs font-bold text-slate-900 hover:bg-amber-400 hover:border-amber-400 transition-colors shadow-xs cursor-pointer"
                        >
                          Save Product ✓
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete product "${p.name}"?`)) {
                              const filtered = products.filter((_, i) => i !== idx);
                              saveOverrides({ ...ov, products: filtered }, `Removed "${p.name}"`);
                            }
                          }}
                          className="text-xs text-red-600 hover:underline px-2 py-1 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="lg:col-span-2">
                        <label className={labelCls}>Product Name</label>
                        <input
                          className={inputCls}
                          value={p.name}
                          onChange={(e) => {
                            const updated = [...products];
                            updated[idx] = { ...p, name: e.target.value };
                            setOv({ ...ov, products: updated });
                          }}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Category Slug</label>
                        <input
                          className={inputCls}
                          placeholder="e.g. woven-labels, hang-tags"
                          value={p.categorySlug || ""}
                          onChange={(e) => {
                            const updated = [...products];
                            updated[idx] = { ...p, categorySlug: e.target.value };
                            setOv({ ...ov, products: updated });
                          }}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Craft Tag / Badge</label>
                        <input
                          className={inputCls}
                          value={p.tag}
                          onChange={(e) => {
                            const updated = [...products];
                            updated[idx] = { ...p, tag: e.target.value };
                            setOv({ ...ov, products: updated });
                          }}
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className={labelCls}>⏱️ Production Turnaround</label>
                        <input
                          className={cn(inputCls, "border-amber-200 focus:border-amber-500")}
                          placeholder="e.g. 5 – 7 Business Days"
                          value={p.turnaround || ""}
                          onChange={(e) => {
                            const updated = [...products];
                            updated[idx] = { ...p, turnaround: e.target.value };
                            setOv({ ...ov, products: updated });
                          }}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelCls}>📦 Minimum Order (MOQ)</label>
                        <input
                          className={cn(inputCls, "border-amber-200 focus:border-amber-500")}
                          placeholder="e.g. Starts from 100 pcs"
                          value={p.moq || ""}
                          onChange={(e) => {
                            const updated = [...products];
                            updated[idx] = { ...p, moq: e.target.value };
                            setOv({ ...ov, products: updated });
                          }}
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className={labelCls}>Material Specifications</label>
                        <input
                          className={inputCls}
                          value={p.material || ""}
                          onChange={(e) => {
                            const updated = [...products];
                            updated[idx] = { ...p, material: e.target.value };
                            setOv({ ...ov, products: updated });
                          }}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelCls}>Recommended For</label>
                        <input
                          className={inputCls}
                          value={p.recommendedFor || ""}
                          onChange={(e) => {
                            const updated = [...products];
                            updated[idx] = { ...p, recommendedFor: e.target.value };
                            setOv({ ...ov, products: updated });
                          }}
                        />
                      </div>

                      <div className="sm:col-span-2 lg:col-span-4">
                        <label className={labelCls}>Short Description</label>
                        <textarea
                          className={cn(inputCls, "min-h-[3rem] resize-none")}
                          value={p.description}
                          onChange={(e) => {
                            const updated = [...products];
                            updated[idx] = { ...p, description: e.target.value };
                            setOv({ ...ov, products: updated });
                          }}
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <ImageUploadField
                        label={`Photo for ${p.name}`}
                        value={p.image}
                        onChange={(val) => {
                          const updated = [...products];
                          updated[idx] = { ...p, image: val };
                          setOv({ ...ov, products: updated });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-end border-t border-gray-200/80 pt-4">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => saveOverrides({ ...ov, products })}
                  className="rounded-xl bg-amber-500 px-8 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-sm active:scale-95 transition-all hover:bg-amber-400 cursor-pointer"
                >
                  {busy ? "Saving..." : "💾 Save All Products"}
                </button>
              </div>
            </div>
          )}

          {/* TAB: WHY CHOOSE US (5 TRUST PILLARS) */}
          {tab === "Why Choose Us" && (
            <div>
              <SectionSaveBar
                title="Why Choose Us (5 Trust Pillars)"
                subtitle="Edit factory advantages, customer guarantees, and trust points"
                busy={busy}
                onSave={() => saveOverrides({ ...ov, trustPillars: pillarList })}
                extraButton={
                  <button
                    type="button"
                    onClick={() => {
                      const newPillar = {
                        icon: "🛡️",
                        title: "New Trust Advantage",
                        desc: "Direct manufacturing excellence and verified piece-by-piece inspection.",
                      };
                      const updated = [...pillarList, newPillar];
                      saveOverrides({ ...ov, trustPillars: updated }, "Trust Pillar added!");
                    }}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
                  >
                    + Add New Pillar
                  </button>
                }
              />

              <div className="space-y-4">
                {pillarList.map((pillar, idx) => (
                  <div key={idx} className="rounded-2xl border border-gray-200/90 bg-slate-50/50 p-4 sm:p-5 transition-all hover:border-gray-300">
                    <div className="flex items-center justify-between border-b border-gray-200/80 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{pillar.icon}</span>
                        <span className="text-base font-bold text-slate-900">{pillar.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete trust pillar "${pillar.title}"?`)) {
                              const filtered = pillarList.filter((_, i) => i !== idx);
                              saveOverrides({ ...ov, trustPillars: filtered }, `Removed "${pillar.title}"`);
                            }
                          }}
                          className="text-xs text-red-600 hover:underline px-2 py-1 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-4">
                      <div>
                        <label className={labelCls}>Icon / Emoji</label>
                        <input
                          className={inputCls}
                          value={pillar.icon}
                          onChange={(e) => {
                            const updated = [...pillarList];
                            updated[idx] = { ...pillar, icon: e.target.value };
                            setOv({ ...ov, trustPillars: updated });
                          }}
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className={labelCls}>Pillar Title</label>
                        <input
                          className={inputCls}
                          value={pillar.title}
                          onChange={(e) => {
                            const updated = [...pillarList];
                            updated[idx] = { ...pillar, title: e.target.value };
                            setOv({ ...ov, trustPillars: updated });
                          }}
                        />
                      </div>
                      <div className="sm:col-span-4">
                        <label className={labelCls}>Description</label>
                        <textarea
                          className={cn(inputCls, "min-h-[3rem] resize-none")}
                          value={pillar.desc}
                          onChange={(e) => {
                            const updated = [...pillarList];
                            updated[idx] = { ...pillar, desc: e.target.value };
                            setOv({ ...ov, trustPillars: updated });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-end border-t border-gray-200/80 pt-4">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => saveOverrides({ ...ov, trustPillars: pillarList })}
                  className="rounded-xl bg-amber-500 px-8 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-sm active:scale-95 transition-all hover:bg-amber-400 cursor-pointer"
                >
                  {busy ? "Saving..." : "💾 Save All Pillars"}
                </button>
              </div>
            </div>
          )}

          {/* TAB: ANNOUNCEMENT BAR */}
          {tab === "Announcement Bar" && (
            <div>
              <SectionSaveBar
                title="Top Announcement Bar"
                subtitle="Header ticker notification and WhatsApp quick order trigger"
                busy={busy}
                onSave={() => saveOverrides({ ...ov, announcement })}
              />

              <div className="space-y-4 max-w-3xl">
                <div>
                  <label className={labelCls}>Announcement Bar Ticker Text</label>
                  <textarea
                    className={cn(inputCls, "min-h-[4rem]")}
                    value={announcement.text}
                    onChange={(e) =>
                      setOv({
                        ...ov,
                        announcement: { ...announcement, text: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>CTA Button Text</label>
                    <input
                      className={inputCls}
                      value={announcement.cta}
                      onChange={(e) =>
                        setOv({
                          ...ov,
                          announcement: { ...announcement, cta: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelCls}>WhatsApp Link URL</label>
                    <input
                      className={inputCls}
                      value={announcement.link}
                      onChange={(e) =>
                        setOv({
                          ...ov,
                          announcement: { ...announcement, link: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end border-t border-gray-200/80 pt-4">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => saveOverrides({ ...ov, announcement })}
                  className="rounded-xl bg-amber-500 px-8 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-sm active:scale-95 transition-all hover:bg-amber-400 cursor-pointer"
                >
                  {busy ? "Saving..." : "💾 Save Announcement Bar"}
                </button>
              </div>
            </div>
          )}

          {/* TAB: HERO SECTION */}
          {tab === "Hero Section" && (
            <div>
              <SectionSaveBar
                title="Hero Banner Section"
                subtitle="Top headlines, CTA buttons, floating badges, trust icons & visual showcase"
                busy={busy}
                onSave={() => saveOverrides({ ...ov, hero })}
              />

              <div className="space-y-6 max-w-4xl">
                
                {/* 1. Main Headlines & Text */}
                <div className="rounded-2xl border border-gray-200/90 bg-white p-5 space-y-4 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-gray-100 pb-2">
                    1. Headlines & Calls to Action
                  </h3>

                  <div>
                    <label className={labelCls}>Eyebrow Pill Badge</label>
                    <input
                      className={inputCls}
                      value={hero.eyebrow}
                      onChange={(e) => setOv({ ...ov, hero: { ...hero, eyebrow: e.target.value } })}
                      placeholder="e.g. Factory Direct Garment Trims & Packaging"
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className={labelCls}>Headline Line 1</label>
                      <input
                        className={inputCls}
                        value={hero.line1}
                        onChange={(e) => setOv({ ...ov, hero: { ...hero, line1: e.target.value } })}
                        placeholder="Custom Labels, Logos &"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Headline Line 2 (Highlighted Accent)</label>
                      <input
                        className={inputCls}
                        value={hero.line2}
                        onChange={(e) => setOv({ ...ov, hero: { ...hero, line2: e.target.value } })}
                        placeholder="Packaging for Your Brand"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Hero Subtitle / Description</label>
                    <textarea
                      className={cn(inputCls, "min-h-[4.5rem]")}
                      value={hero.sub}
                      onChange={(e) => setOv({ ...ov, hero: { ...hero, sub: e.target.value } })}
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <label className={labelCls}>Primary Button Text</label>
                      <input
                        className={inputCls}
                        value={hero.ctaPrimary}
                        onChange={(e) => setOv({ ...ov, hero: { ...hero, ctaPrimary: e.target.value } })}
                        placeholder="Explore Products"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Secondary Button Text</label>
                      <input
                        className={inputCls}
                        value={hero.ctaSecondary}
                        onChange={(e) => setOv({ ...ov, hero: { ...hero, ctaSecondary: e.target.value } })}
                        placeholder="⚡ Get Instant Quote"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>WhatsApp Button Text</label>
                      <input
                        className={inputCls}
                        value={hero.ctaWhatsapp || "💬 WhatsApp Quick Chat"}
                        onChange={(e) => setOv({ ...ov, hero: { ...hero, ctaWhatsapp: e.target.value } })}
                        placeholder="💬 WhatsApp Quick Chat"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Right Side Showcase Image & Floating Badges */}
                <div className="rounded-2xl border border-gray-200/90 bg-white p-5 space-y-4 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-gray-100 pb-2">
                    2. Right-Side Featured Showcase & Floating Badges
                  </h3>

                  <ImageUploadField
                    label="Main Featured Showcase Photo"
                    value={hero.showcaseImage || hero.poster || "/photos/rs-092-02.jpg"}
                    onChange={(val) => setOv({ ...ov, hero: { ...hero, showcaseImage: val, poster: val } })}
                  />

                  <div className="grid gap-3 sm:grid-cols-2 pt-2">
                    <div>
                      <label className={labelCls}>Top Floating Badge Text</label>
                      <input
                        className={inputCls}
                        value={hero.showcaseBadgeTop || "50D High-Density Weave"}
                        onChange={(e) => setOv({ ...ov, hero: { ...hero, showcaseBadgeTop: e.target.value } })}
                        placeholder="50D High-Density Weave"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Bottom Floating Badge Text</label>
                      <input
                        className={inputCls}
                        value={hero.showcaseBadgeBottom || "⭐ 4.9/5 Rating | 200+ Brands"}
                        onChange={(e) => setOv({ ...ov, hero: { ...hero, showcaseBadgeBottom: e.target.value } })}
                        placeholder="⭐ 4.9/5 Rating | 200+ Brands"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Four Trust Badges Strip */}
                <div className="rounded-2xl border border-gray-200/90 bg-white p-5 space-y-4 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-gray-100 pb-2">
                    3. Trust Badges Strip (4 Pillars)
                  </h3>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {(hero.trustBadges || [
                      { icon: "🏭", label: "Direct Factory Manufacturing" },
                      { icon: "📦", label: "Low MOQ Starts at 100 pcs" },
                      { icon: "⚡", label: "24h Free Digital Proof" },
                      { icon: "✈️", label: "Express Doorstep Delivery (GCC & Global)" },
                    ]).map((badge, bIdx) => (
                      <div key={bIdx} className="p-3 rounded-xl border border-gray-200 bg-slate-50/60 space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            className="w-12 text-center rounded-lg border border-gray-200 bg-white py-1.5 text-base"
                            value={badge.icon}
                            onChange={(e) => {
                              const updated = [...(hero.trustBadges || [])];
                              updated[bIdx] = { ...badge, icon: e.target.value };
                              setOv({ ...ov, hero: { ...hero, trustBadges: updated } });
                            }}
                          />
                          <input
                            className={cn(inputCls, "flex-1")}
                            value={badge.label}
                            onChange={(e) => {
                              const updated = [...(hero.trustBadges || [])];
                              updated[bIdx] = { ...badge, label: e.target.value };
                              setOv({ ...ov, hero: { ...hero, trustBadges: updated } });
                            }}
                            placeholder="Badge label"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Three Bottom Showcase Thumbnails */}
                <div className="rounded-2xl border border-gray-200/90 bg-white p-5 space-y-4 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-gray-100 pb-2">
                    4. Bottom Showcase Thumbnails (3 Visual Cards)
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-3">
                    {(hero.thumbnails || [
                      { image: "/photos/rs-057-00.jpg", label: "Hang Tags" },
                      { image: "/photos/rs-004-cover.jpg", label: "3D Rubber" },
                      { image: "/photos/rs-032-00.jpg", label: "Frosted Bags" },
                    ]).map((thumb, tIdx) => (
                      <div key={tIdx} className="p-3 rounded-xl border border-gray-200 bg-slate-50/60 space-y-2">
                        <label className={labelCls}>Card {tIdx + 1} Label</label>
                        <input
                          className={inputCls}
                          value={thumb.label}
                          onChange={(e) => {
                            const updated = [...(hero.thumbnails || [])];
                            updated[tIdx] = { ...thumb, label: e.target.value };
                            setOv({ ...ov, hero: { ...hero, thumbnails: updated } });
                          }}
                          placeholder="e.g. Hang Tags"
                        />
                        <ImageUploadField
                          label={`Card ${tIdx + 1} Photo`}
                          value={thumb.image}
                          onChange={(val) => {
                            const updated = [...(hero.thumbnails || [])];
                            updated[tIdx] = { ...thumb, image: val };
                            setOv({ ...ov, hero: { ...hero, thumbnails: updated } });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              <div className="mt-8 flex justify-end border-t border-gray-200/80 pt-4">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => saveOverrides({ ...ov, hero }, "Hero Section updated successfully!")}
                  className="rounded-xl bg-amber-500 px-8 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-sm active:scale-95 transition-all hover:bg-amber-400 cursor-pointer"
                >
                  {busy ? "Saving..." : "💾 Save Hero Section"}
                </button>
              </div>
            </div>
          )}

          {/* TAB: 4-STEP ORDER PROCESS */}
          {tab === "Process Steps" && (
            <div>
              <SectionSaveBar
                title="4-Step Ordering Process"
                subtitle="Step-by-step customer ordering guide"
                busy={busy}
                onSave={() => saveOverrides({ ...ov, orderSteps: stepList })}
              />

              <div className="space-y-4 max-w-3xl">
                <div className="space-y-3">
                  {stepList.map((s, idx) => (
                    <div key={idx} className="rounded-xl border border-gray-200 bg-slate-50/50 p-4">
                      <div className="grid gap-3 sm:grid-cols-4">
                        <div>
                          <label className={labelCls}>Step #{s.step}</label>
                          <input
                            className={inputCls}
                            value={s.title}
                            onChange={(e) => {
                              const updated = [...stepList];
                              updated[idx] = { ...s, title: e.target.value };
                              setOv({ ...ov, orderSteps: updated });
                            }}
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <label className={labelCls}>Step Description</label>
                          <input
                            className={inputCls}
                            value={s.desc}
                            onChange={(e) => {
                              const updated = [...stepList];
                              updated[idx] = { ...s, desc: e.target.value };
                              setOv({ ...ov, orderSteps: updated });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex justify-end border-t border-gray-200/80 pt-4">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => saveOverrides({ ...ov, orderSteps: stepList })}
                  className="rounded-xl bg-amber-500 px-8 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-sm active:scale-95 transition-all hover:bg-amber-400 cursor-pointer"
                >
                  {busy ? "Saving..." : "💾 Save Ordering Steps"}
                </button>
              </div>
            </div>
          )}

          {/* TAB: WORKBENCH SHOWCASE GALLERY */}
          {tab === "Showroom Gallery" && (
            <div>
              <SectionSaveBar
                title="Finished Orders & Workbench Gallery"
                subtitle="Real unedited atelier photos with category tags"
                busy={busy}
                onSave={() => saveOverrides({ ...ov, gallery })}
                extraButton={
                  <button
                    type="button"
                    onClick={() => {
                      const newPhoto = {
                        src: "/photos/rs-092-02.jpg",
                        tag: "Woven Labels",
                        tall: false,
                      };
                      const updated = [newPhoto, ...gallery];
                      saveOverrides({ ...ov, gallery: updated }, "Photo added to gallery!");
                    }}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
                  >
                    + Add New Photo
                  </button>
                }
              />

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {gallery.map((g, idx) => (
                  <div key={idx} className="rounded-xl border border-gray-200 bg-slate-50/50 p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-200/70 pb-2">
                      <span className="text-xs font-bold text-slate-700">Photo #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = gallery.filter((_, i) => i !== idx);
                          saveOverrides({ ...ov, gallery: updated }, "Photo removed");
                        }}
                        className="text-xs text-red-600 hover:underline cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>

                    <ImageUploadField
                      label="Image"
                      value={g.src}
                      onChange={(val) => {
                        const updated = [...gallery];
                        updated[idx] = { ...g, src: val };
                        setOv({ ...ov, gallery: updated });
                      }}
                    />

                    <div>
                      <label className={labelCls}>Category Filter Tag</label>
                      <input
                        className={inputCls}
                        value={g.tag}
                        onChange={(e) => {
                          const updated = [...gallery];
                          updated[idx] = { ...g, tag: e.target.value };
                          setOv({ ...ov, gallery: updated });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-end border-t border-gray-200/80 pt-4">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => saveOverrides({ ...ov, gallery })}
                  className="rounded-xl bg-amber-500 px-8 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-sm active:scale-95 transition-all hover:bg-amber-400 cursor-pointer"
                >
                  {busy ? "Saving..." : "💾 Save Gallery"}
                </button>
              </div>
            </div>
          )}

          {/* TAB: FAQS */}
          {tab === "FAQs" && (
            <div>
              <SectionSaveBar
                title="Frequently Asked Questions"
                subtitle="Accordion FAQ items displayed on the website"
                busy={busy}
                onSave={() => saveOverrides({ ...ov, faqs: faqList })}
                extraButton={
                  <button
                    type="button"
                    onClick={() => {
                      const newFaq: Faq = {
                        q: "New question?",
                        a: "Answer explanation goes here.",
                        category: "General",
                      };
                      const updated = [...faqList, newFaq];
                      saveOverrides({ ...ov, faqs: updated }, "FAQ added!");
                    }}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
                  >
                    + Add New FAQ
                  </button>
                }
              />

              <div className="space-y-4">
                {faqList.map((f, idx) => (
                  <div key={idx} className="rounded-xl border border-gray-200 bg-slate-50/50 p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-200/70 pb-2">
                      <span className="text-xs font-bold text-slate-700">FAQ #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = faqList.filter((_, i) => i !== idx);
                          saveOverrides({ ...ov, faqs: updated }, "FAQ removed");
                        }}
                        className="text-xs text-red-600 hover:underline cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>

                    <div>
                      <label className={labelCls}>Question</label>
                      <input
                        className={inputCls}
                        value={f.q}
                        onChange={(e) => {
                          const updated = [...faqList];
                          updated[idx] = { ...f, q: e.target.value };
                          setOv({ ...ov, faqs: updated });
                        }}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Answer</label>
                      <textarea
                        className={cn(inputCls, "min-h-[4rem]")}
                        value={f.a}
                        onChange={(e) => {
                          const updated = [...faqList];
                          updated[idx] = { ...f, a: e.target.value };
                          setOv({ ...ov, faqs: updated });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-end border-t border-gray-200/80 pt-4">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => saveOverrides({ ...ov, faqs: faqList })}
                  className="rounded-xl bg-amber-500 px-8 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-sm active:scale-95 transition-all hover:bg-amber-400 cursor-pointer"
                >
                  {busy ? "Saving..." : "💾 Save FAQs"}
                </button>
              </div>
            </div>
          )}

          {/* TAB: REVIEWS / TESTIMONIALS */}
          {tab === "Reviews" && (
            <div>
              <SectionSaveBar
                title="Client Reviews & Testimonials"
                subtitle="Fashion brand founder reviews across GCC & worldwide"
                busy={busy}
                onSave={() => saveOverrides({ ...ov, testimonials: testimonialList })}
                extraButton={
                  <button
                    type="button"
                    onClick={() => {
                      const newT: Testimonial = {
                        quote: "Exceptional quality and fast delivery. Our customers love the finish.",
                        name: "Brand Founder",
                        role: "Creative Director",
                        city: "Riyadh, Saudi Arabia",
                        rating: 5,
                      };
                      const updated = [...testimonialList, newT];
                      saveOverrides({ ...ov, testimonials: updated }, "Review added!");
                    }}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
                  >
                    + Add New Review
                  </button>
                }
              />

              <div className="space-y-4">
                {testimonialList.map((t, idx) => (
                  <div key={idx} className="rounded-xl border border-gray-200 bg-slate-50/50 p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-200/70 pb-2">
                      <span className="text-xs font-bold text-slate-700">Review #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = testimonialList.filter((_, i) => i !== idx);
                          saveOverrides({ ...ov, testimonials: updated }, "Review removed");
                        }}
                        className="text-xs text-red-600 hover:underline cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div>
                        <label className={labelCls}>Client Name</label>
                        <input
                          className={inputCls}
                          value={t.name}
                          onChange={(e) => {
                            const updated = [...testimonialList];
                            updated[idx] = { ...t, name: e.target.value };
                            setOv({ ...ov, testimonials: updated });
                          }}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Role / Brand</label>
                        <input
                          className={inputCls}
                          value={t.role}
                          onChange={(e) => {
                            const updated = [...testimonialList];
                            updated[idx] = { ...t, role: e.target.value };
                            setOv({ ...ov, testimonials: updated });
                          }}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Location</label>
                        <input
                          className={inputCls}
                          value={t.city}
                          onChange={(e) => {
                            const updated = [...testimonialList];
                            updated[idx] = { ...t, city: e.target.value };
                            setOv({ ...ov, testimonials: updated });
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>Review Quote</label>
                      <textarea
                        className={cn(inputCls, "min-h-[3rem]")}
                        value={t.quote}
                        onChange={(e) => {
                          const updated = [...testimonialList];
                          updated[idx] = { ...t, quote: e.target.value };
                          setOv({ ...ov, testimonials: updated });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-end border-t border-gray-200/80 pt-4">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => saveOverrides({ ...ov, testimonials: testimonialList })}
                  className="rounded-xl bg-amber-500 px-8 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-sm active:scale-95 transition-all hover:bg-amber-400 cursor-pointer"
                >
                  {busy ? "Saving..." : "💾 Save All Reviews"}
                </button>
              </div>
            </div>
          )}

          {/* TAB: GLOBAL SEO & META */}
          {tab === "SEO & Meta" && (
            <div>
              <SectionSaveBar
                title="Global SEO & Search Engine Metadata"
                subtitle="Optimize meta titles, descriptions, target keywords, and Google Rich Snippets"
                busy={busy}
                onSave={() => saveOverrides({ ...ov, seoSettings })}
              />

              <div className="space-y-4 max-w-3xl">
                <div>
                  <label className={labelCls}>Global Meta Title</label>
                  <input
                    className={inputCls}
                    value={seoSettings.metaTitle || ""}
                    onChange={(e) => setOv({ ...ov, seoSettings: { ...seoSettings, metaTitle: e.target.value } })}
                  />
                </div>
                <div>
                  <label className={labelCls}>Global Meta Description</label>
                  <textarea
                    className={cn(inputCls, "min-h-[4rem]")}
                    value={seoSettings.metaDescription || ""}
                    onChange={(e) => setOv({ ...ov, seoSettings: { ...seoSettings, metaDescription: e.target.value } })}
                  />
                </div>
                <div>
                  <label className={labelCls}>Target Keywords (Comma-separated)</label>
                  <textarea
                    className={cn(inputCls, "min-h-[3.5rem]")}
                    value={seoSettings.targetKeywords || ""}
                    onChange={(e) => setOv({ ...ov, seoSettings: { ...seoSettings, targetKeywords: e.target.value } })}
                  />
                </div>
                <ImageUploadField
                  label="Social Share Image (OG Image)"
                  value={seoSettings.ogImage || "/photos/rs-092-02.jpg"}
                  onChange={(val) => setOv({ ...ov, seoSettings: { ...seoSettings, ogImage: val } })}
                />
              </div>

              <div className="mt-8 flex justify-end border-t border-gray-200/80 pt-4">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => saveOverrides({ ...ov, seoSettings })}
                  className="rounded-xl bg-amber-500 px-8 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-sm active:scale-95 transition-all hover:bg-amber-400 cursor-pointer"
                >
                  {busy ? "Saving..." : "💾 Save SEO Settings"}
                </button>
              </div>
            </div>
          )}

          {/* TAB: WORLDWIDE EXPORT */}
          {tab === "Worldwide Export" && (
            <div>
              <SectionSaveBar
                title="Worldwide Export & Courier Hubs"
                subtitle="GCC, UK, Europe, and North America logistics info"
                busy={busy}
                onSave={() => saveOverrides({ ...ov, globalExport })}
              />

              <div className="space-y-4 max-w-3xl">
                <div>
                  <label className={labelCls}>Section Eyebrow</label>
                  <input
                    className={inputCls}
                    value={globalExport.eyebrow}
                    onChange={(e) => setOv({ ...ov, globalExport: { ...globalExport, eyebrow: e.target.value } })}
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>Heading Line 1</label>
                    <input
                      className={inputCls}
                      value={globalExport.titleLine1}
                      onChange={(e) => setOv({ ...ov, globalExport: { ...globalExport, titleLine1: e.target.value } })}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Heading Line 2</label>
                    <input
                      className={inputCls}
                      value={globalExport.titleLine2}
                      onChange={(e) => setOv({ ...ov, globalExport: { ...globalExport, titleLine2: e.target.value } })}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Subtitle Description</label>
                  <textarea
                    className={cn(inputCls, "min-h-[3rem]")}
                    value={globalExport.sub}
                    onChange={(e) => setOv({ ...ov, globalExport: { ...globalExport, sub: e.target.value } })}
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end border-t border-gray-200/80 pt-4">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => saveOverrides({ ...ov, globalExport })}
                  className="rounded-xl bg-amber-500 px-8 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-sm active:scale-95 transition-all hover:bg-amber-400 cursor-pointer"
                >
                  {busy ? "Saving..." : "💾 Save Export Hubs"}
                </button>
              </div>
            </div>
          )}

          {/* TAB: FOOTER & HUBS */}
          {tab === "Footer" && (
            <div>
              <SectionSaveBar
                title="Footer Information & Notice"
                subtitle="Footer address, direct contacts, and legal copyright"
                busy={busy}
                onSave={() => saveOverrides({ ...ov, footer })}
              />

              <div className="space-y-4 max-w-3xl">
                <div>
                  <label className={labelCls}>Tagline</label>
                  <input
                    className={inputCls}
                    value={footer.tagline}
                    onChange={(e) => setOv({ ...ov, footer: { ...footer, tagline: e.target.value } })}
                  />
                </div>
                <div>
                  <label className={labelCls}>Factory Address & Hubs</label>
                  <textarea
                    className={cn(inputCls, "min-h-[3rem]")}
                    value={footer.address}
                    onChange={(e) => setOv({ ...ov, footer: { ...footer, address: e.target.value } })}
                  />
                </div>
                <div>
                  <label className={labelCls}>Copyright Text</label>
                  <input
                    className={inputCls}
                    value={footer.copyright}
                    onChange={(e) => setOv({ ...ov, footer: { ...footer, copyright: e.target.value } })}
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end border-t border-gray-200/80 pt-4">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => saveOverrides({ ...ov, footer })}
                  className="rounded-xl bg-amber-500 px-8 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-sm active:scale-95 transition-all hover:bg-amber-400 cursor-pointer"
                >
                  {busy ? "Saving..." : "💾 Save Footer"}
                </button>
              </div>
            </div>
          )}

          {/* TAB: CONTACT & SOCIALS */}
          {tab === "Contact & Info" && (
            <div>
              <SectionSaveBar
                title="Contact & Social Channels"
                subtitle="Direct WhatsApp, international phone, email, and Instagram handle"
                busy={busy}
                onSave={() => saveOverrides({ ...ov, contact: site, site })}
              />

              <div className="space-y-4 max-w-3xl">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>WhatsApp URL</label>
                    <input
                      className={inputCls}
                      value={site.whatsapp}
                      onChange={(e) =>
                        setOv({
                          ...ov,
                          contact: { ...(ov.contact ?? {}), whatsapp: e.target.value },
                          site: { ...site, whatsapp: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Phone (Display)</label>
                    <input
                      className={inputCls}
                      value={site.phoneDisplay}
                      onChange={(e) =>
                        setOv({
                          ...ov,
                          contact: { ...(ov.contact ?? {}), phoneDisplay: e.target.value },
                          site: { ...site, phoneDisplay: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>Email Address</label>
                    <input
                      className={inputCls}
                      value={site.email}
                      onChange={(e) =>
                        setOv({
                          ...ov,
                          contact: { ...(ov.contact ?? {}), email: e.target.value },
                          site: { ...site, email: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Instagram Profile URL</label>
                    <input
                      className={inputCls}
                      value={site.instagram}
                      onChange={(e) =>
                        setOv({
                          ...ov,
                          contact: { ...(ov.contact ?? {}), instagram: e.target.value },
                          site: { ...site, instagram: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Factory Location Note</label>
                  <input
                    className={inputCls}
                    value={site.location}
                    onChange={(e) =>
                      setOv({
                        ...ov,
                        contact: { ...(ov.contact ?? {}), location: e.target.value },
                        site: { ...site, location: e.target.value },
                      })
                    }
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end border-t border-gray-200/80 pt-4">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => saveOverrides({ ...ov, contact: site, site })}
                  className="rounded-xl bg-amber-500 px-8 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-sm active:scale-95 transition-all hover:bg-amber-400 cursor-pointer"
                >
                  {busy ? "Saving..." : "💾 Save Contact Info"}
                </button>
              </div>
            </div>
          )}

          {/* TAB: CUSTOMER INQUIRIES & LEADS CRM */}
          {tab === "Enquiries" && (
            <div>
              <div className="flex items-center justify-between border-b border-gray-200/80 pb-4 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Customer Inquiries & Leads ({leads.length})
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live quotation submissions and quote basket inquiries with 1-click WhatsApp reply
                  </p>
                </div>
                <button
                  onClick={load}
                  className="rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 text-xs font-bold cursor-pointer"
                >
                  🔄 Refresh Leads
                </button>
              </div>

              {leads.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <p className="text-sm">No inquiries received yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {leads.map((l) => {
                    const cleanPhone = (l.phone || l.email || "").replace(/[^0-9]/g, "");
                    const waUrl = cleanPhone.length >= 7 ? `https://wa.me/${cleanPhone}` : null;
                    return (
                      <div key={l.id} className="rounded-2xl border border-gray-200 bg-slate-50/50 p-4 sm:p-5 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200/70 pb-2.5">
                          <div>
                            <span className="font-extrabold text-sm text-slate-900">{l.name || "Client"}</span>
                            {l.meta?.brand && (
                              <span className="ml-2 text-xs font-semibold text-amber-800">
                                ({l.meta.brand})
                              </span>
                            )}
                            <span className="ml-2 text-[11px] text-slate-500">
                              {new Date(l.created_at).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {waUrl && (
                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 text-xs font-bold transition-colors"
                              >
                                💬 Reply on WhatsApp
                              </a>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="font-bold text-slate-500">Contact: </span>
                            <span className="font-semibold text-slate-900">{l.phone || l.email || "—"}</span>
                          </div>
                          <div>
                            <span className="font-bold text-slate-500">Product: </span>
                            <span className="font-semibold text-slate-900">{l.product || "—"}</span>
                          </div>
                          <div>
                            <span className="font-bold text-slate-500">Quantity: </span>
                            <span className="font-semibold text-slate-900">{l.quantity || "—"}</span>
                          </div>
                        </div>

                        {l.message && (
                          <div className="rounded-xl bg-white p-3 border border-gray-200 text-xs text-slate-700">
                            <span className="font-bold text-slate-900">Notes / Instructions: </span>
                            {l.message}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB: LIVE ANALYTICS */}
          {tab === "Live Analytics" && (
            <div>
              <div className="flex items-center justify-between border-b border-gray-200/80 pb-4 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Live Traffic & Visitor Analytics
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time visitor counts, geo-locations, and top-viewed pages
                  </p>
                </div>
                <button
                  onClick={loadAnalytics}
                  disabled={analyticsLoading}
                  className="rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 text-xs font-bold cursor-pointer disabled:opacity-50"
                >
                  {analyticsLoading ? "Refreshing..." : "🔄 Refresh Data"}
                </button>
              </div>

              {analytics && (
                <div className="space-y-6">
                  {/* Top Stats Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
                      <p className="text-xs font-bold text-amber-800 uppercase">Live Visitors (5m)</p>
                      <p className="text-2xl font-black text-amber-950 mt-1">{analytics.liveVisitors}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                      <p className="text-xs font-bold text-slate-600 uppercase">24h Unique Visitors</p>
                      <p className="text-2xl font-black text-slate-900 mt-1">{analytics.unique24h}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                      <p className="text-xs font-bold text-slate-600 uppercase">24h Page Views</p>
                      <p className="text-2xl font-black text-slate-900 mt-1">{analytics.views24h}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                      <p className="text-xs font-bold text-slate-600 uppercase">All-Time Views</p>
                      <p className="text-2xl font-black text-slate-900 mt-1">{analytics.totalViews}</p>
                    </div>
                  </div>

                  {/* Countries & Devices */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-2xl border border-gray-200 p-4 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Top Visitor Countries
                      </h4>
                      <div className="space-y-2">
                        {analytics.countryStats.map((c, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50">
                            <span>{getCountryFlag(c.country)}</span>
                            <span className="font-bold text-slate-900">{c.count} views</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 p-4 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Top Visited Pages
                      </h4>
                      <div className="space-y-2">
                        {analytics.topPages.map((p, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50">
                            <span className="font-mono text-slate-700 truncate max-w-xs">{p.path}</span>
                            <span className="font-bold text-slate-900">{p.count} views</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
