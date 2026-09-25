"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  products as defaultProducts,
  hero as defaultHero,
  site as defaultSite,
  testimonials as defaultTestimonials,
  faqs as defaultFaqs,
  gallery as defaultGallery,
  manifesto as defaultManifesto,
  atelierProcess as defaultProcess,
  reels as defaultReels,
  footer as defaultFooter,
  defaultGlobalExport,
  defaultSeoSettings,
  type Product,
  type Testimonial,
  type Faq,
  type ExportRegion,
  type GlobalExportContent,
  type SeoSettings,
} from "@/content/site";
import { defaultContent, type Overrides } from "@/lib/content";
import { defaultCarouselItems, type ProductCarouselItem } from "@/components/ProductCarousel";
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
  meta: { brand?: string; contact?: string } | null;
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
  quality = 0.82
): Promise<{ dataUrl: string; originalSize: number; compressedSize: number; savings: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve({
            dataUrl: e.target?.result as string,
            originalSize: file.size,
            compressedSize: file.size,
            savings: 0,
          });
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/webp", quality);
        const head = "data:image/webp;base64,";
        const base64Length = dataUrl.length - head.length;
        const compressedBytes = Math.round((base64Length * 3) / 4);
        const savings = Math.max(0, Math.round(((file.size - compressedBytes) / file.size) * 100));

        resolve({
          dataUrl,
          originalSize: file.size,
          compressedSize: compressedBytes,
          savings,
        });
      };
      img.onerror = () => reject(new Error("Image decoding failed"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("File read error"));
    reader.readAsDataURL(file);
  });
}

// --- CLEAN COMPACT IMAGE UPLOADER COMPONENT ---
function ImageUploadField({
  value,
  onChange,
  label = "Upload Image",
}: {
  value: string;
  onChange: (val: string) => void;
  label?: string;
}) {
  const [compressing, setCompressing] = useState(false);
  const [stats, setStats] = useState<{ orig: string; comp: string; savings: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setCompressing(true);
    try {
      const res = await compressImageFile(file);
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
            className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-amber-600 transition-colors disabled:opacity-50"
          >
            {compressing ? "Compressing..." : "📁 Choose Photo"}
          </button>
          <input
            type="text"
            className="flex-1 min-w-[140px] rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-amber-500"
            placeholder="Or image path / URL"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

// Clean Section Header with Save Button
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
          className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-sm active:scale-95 transition-all hover:bg-amber-400 disabled:opacity-50"
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
  const hero = { ...defaultHero, ...(ov.hero ?? {}) };
  const manifesto = { ...defaultManifesto, ...(ov.manifesto ?? {}) };
  const products = ov.products?.length ? ov.products : defaultProducts;
  const carouselList = ov.carousel?.length ? ov.carousel : defaultCarouselItems;
  const globalExport: GlobalExportContent = {
    ...defaultGlobalExport,
    ...(ov.globalExport ?? {}),
    regions: ov.globalExport?.regions?.length ? ov.globalExport.regions : defaultGlobalExport.regions,
    technicalSpecs: ov.globalExport?.technicalSpecs?.length ? ov.globalExport.technicalSpecs : defaultGlobalExport.technicalSpecs,
  };
  const seoSettings: SeoSettings = {
    ...defaultSeoSettings,
    ...(ov.seoSettings ?? {}),
  };
  const philosophy = { ...defaultContent.philosophy, ...(ov.philosophy ?? {}) };
  const processSteps = ov.atelierProcess?.steps?.length ? ov.atelierProcess.steps : defaultProcess.steps;
  const processImage = ov.atelierProcess?.image || defaultProcess.image;
  const processEyebrow = ov.atelierProcess?.eyebrow || defaultProcess.eyebrow;
  const processTitle = ov.atelierProcess?.title || defaultProcess.title;
  const reelsList = ov.reels?.length ? ov.reels : defaultReels;
  const gallery = ov.gallery?.length ? ov.gallery : defaultGallery;
  const testimonialList = ov.testimonials?.length ? ov.testimonials : defaultTestimonials;
  const faqList = ov.faqs?.length ? ov.faqs : defaultFaqs;
  const footer = { ...defaultFooter, ...(ov.footer ?? {}) };
  const trustBar = ov.trustBar || {};

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
      const json = await res.json();
      if (json.ok) {
        say("Commercial Invoice saved successfully!");
        await load();
        return true;
      } else {
        alert(json.error || "Failed to save invoice");
        return false;
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save invoice");
      return false;
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteInvoice = async (id: number, voidOnly = false): Promise<boolean> => {
    setBusy(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete-invoice", id, voidOnly }),
      });
      const json = await res.json();
      if (json.ok) {
        say("Invoice updated/removed!");
        await load();
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
      const json = await res.json();
      if (json.ok) {
        say("Client profile saved!");
        await load();
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
      const json = await res.json();
      if (json.ok) {
        say("Billing & Bank Settings saved!");
        await load();
        return true;
      }
      return false;
    } finally {
      setBusy(false);
    }
  };

  if (state === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 font-display text-2xl italic text-amber-400">
        Loading Rafiq Sons Atelier Studio...
      </div>
    );
  }

  if (state === "login") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <motion.form
          onSubmit={login}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-8 sm:p-10 shadow-2xl"
        >
          <div className="text-center">
            <Image
              src="/brand/logo-wide-light.png"
              alt="Rafiq Sons Labels"
              width={160}
              height={50}
              className="mx-auto h-11 w-auto"
            />
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-amber-400">Management Studio</p>
            <h1 className="mt-2 text-2xl font-bold text-white">Admin Sign In</h1>
          </div>

          <div className="mt-7">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Password</label>
            <input
              type="password"
              className="mt-2 w-full rounded-xl border border-white/15 bg-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-amber-400"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            {loginError && <p className="mt-2 text-xs text-red-400">{loginError}</p>}
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-xl bg-amber-400 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-lg active:scale-98 hover:bg-amber-300 transition-colors"
          >
            Access Studio
          </button>
        </motion.form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-28 text-slate-900 antialiased font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 px-4 py-3 sm:px-8 shadow-xs backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Image
              src="/brand/logo-wide.png"
              alt="Rafiq Sons Labels"
              width={130}
              height={38}
              className="h-7 w-auto sm:h-8"
            />
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
              className="rounded-xl bg-slate-100 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-red-50 hover:text-red-700 transition-colors"
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
                        name: "New Custom Item",
                        tag: "Bespoke",
                        description: "High density custom garment trims and labels.",
                        image: "/photos/rs-092-02.jpg",
                        detail: "Custom materials, dimensions, and finishing.",
                        from: "0.10",
                        turnaround: "7 – 10 working days",
                        moq: "Starts from 100 pcs",
                        material: "Custom fabric or board",
                        colors: "Full color",
                        folds: "Standard fold",
                        guessedPrice: false,
                      };
                      const updated = [newProd, ...products];
                      saveOverrides({ ...ov, products: updated }, "Product added!");
                    }}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs"
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
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => saveOverrides({ ...ov, products }, `Saved "${p.name}"!`)}
                          className="rounded-lg bg-white border border-gray-200 px-3 py-1.5 text-xs font-bold text-slate-900 hover:bg-amber-400 hover:border-amber-400 transition-colors shadow-xs"
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
                          className="text-xs text-red-600 hover:underline px-2 py-1"
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
                      <div>
                        <label className={labelCls}>Price From ($)</label>
                        <input
                          className={inputCls}
                          value={p.from || ""}
                          onChange={(e) => {
                            const updated = [...products];
                            updated[idx] = { ...p, from: e.target.value };
                            setOv({ ...ov, products: updated });
                          }}
                        />
                      </div>

                      {/* TURNAROUND & MINIMUM ORDER FIELDS (REQUESTED IN USER ATTACHMENT) */}
                      <div className="lg:col-span-2 bg-amber-50/70 p-3 rounded-xl border border-amber-200/60">
                        <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-amber-900">
                          ⏱️ Turnaround / Making Time
                        </label>
                        <input
                          className={cn(inputCls, "border-amber-200 focus:border-amber-500")}
                          placeholder="e.g. 7 – 10 working days (or 8 to 10 Days Making Time)"
                          value={p.turnaround || ""}
                          onChange={(e) => {
                            const updated = [...products];
                            updated[idx] = { ...p, turnaround: e.target.value };
                            setOv({ ...ov, products: updated });
                          }}
                        />
                      </div>

                      <div className="lg:col-span-2 bg-amber-50/70 p-3 rounded-xl border border-amber-200/60">
                        <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-amber-900">
                          📦 Minimum Order (MOQ)
                        </label>
                        <input
                          className={cn(inputCls, "border-amber-200 focus:border-amber-500")}
                          placeholder="e.g. Starts from 100 pcs (bulk savings at 500+)"
                          value={p.moq || ""}
                          onChange={(e) => {
                            const updated = [...products];
                            updated[idx] = { ...p, moq: e.target.value };
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
                      <div className="sm:col-span-2 lg:col-span-4">
                        <label className={labelCls}>Technical Detail Note</label>
                        <input
                          className={inputCls}
                          value={p.detail}
                          onChange={(e) => {
                            const updated = [...products];
                            updated[idx] = { ...p, detail: e.target.value };
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
                  className="rounded-xl bg-amber-500 px-8 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-sm active:scale-95 transition-all hover:bg-amber-400"
                >
                  {busy ? "Saving..." : "💾 Save All Products"}
                </button>
              </div>
            </div>
          )}

          {/* TAB: SHOWCASE CAROUSEL */}
          {tab === "Showcase Carousel" && (
            <div>
              <SectionSaveBar
                title="Product Photos Carousel"
                subtitle="Macro detail slider displayed below products collection"
                busy={busy}
                onSave={() => saveOverrides({ ...ov, carousel: carouselList })}
                extraButton={
                  <button
                    type="button"
                    onClick={() => {
                      const newItem: ProductCarouselItem = {
                        id: "c-" + Date.now(),
                        image: "/photos/rs-092-02.jpg",
                        title: "Custom Craft Closeup",
                        tag: "Macro Detail",
                        material: "High density weave & finishing",
                      };
                      const updated = [...carouselList, newItem];
                      saveOverrides({ ...ov, carousel: updated }, "Carousel photo added!");
                    }}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs"
                  >
                    + Add Slide Photo
                  </button>
                }
              />

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {carouselList.map((c, idx) => (
                  <div key={c.id || idx} className="rounded-xl border border-gray-200 bg-slate-50/50 p-4">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                      <span className="font-bold text-xs text-slate-700">Slide #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Remove Carousel Slide #${idx + 1}?`)) {
                            const updated = carouselList.filter((_, i) => i !== idx);
                            saveOverrides({ ...ov, carousel: updated }, "Slide removed");
                          }
                        }}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-3 relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-gray-200 bg-white">
                      <Image
                        src={c.image}
                        alt={c.title}
                        fill
                        className="object-cover"
                        unoptimized={c.image.startsWith("data:")}
                      />
                    </div>

                    <div className="mt-3 space-y-2.5">
                      <div>
                        <label className={labelCls}>Photo Title</label>
                        <input
                          className={inputCls}
                          value={c.title}
                          onChange={(e) => {
                            const updated = [...carouselList];
                            updated[idx] = { ...c, title: e.target.value };
                            setOv({ ...ov, carousel: updated });
                          }}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Craft Badge</label>
                        <input
                          className={inputCls}
                          value={c.tag}
                          onChange={(e) => {
                            const updated = [...carouselList];
                            updated[idx] = { ...c, tag: e.target.value };
                            setOv({ ...ov, carousel: updated });
                          }}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Material Note</label>
                        <input
                          className={inputCls}
                          value={c.material || ""}
                          onChange={(e) => {
                            const updated = [...carouselList];
                            updated[idx] = { ...c, material: e.target.value };
                            setOv({ ...ov, carousel: updated });
                          }}
                        />
                      </div>

                      <ImageUploadField
                        label="Change Image"
                        value={c.image}
                        onChange={(val) => {
                          const updated = [...carouselList];
                          updated[idx] = { ...c, image: val };
                          setOv({ ...ov, carousel: updated });
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
                  onClick={() => saveOverrides({ ...ov, carousel: carouselList })}
                  className="rounded-xl bg-amber-500 px-8 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-sm active:scale-95 transition-all hover:bg-amber-400"
                >
                  {busy ? "Saving..." : "💾 Save Carousel"}
                </button>
              </div>
            </div>
          )}

          {/* TAB: SHOWROOM GALLERY */}
          {tab === "Showroom Gallery" && (
            <div>
              <SectionSaveBar
                title="Showroom Gallery"
                subtitle="Archive of crafted product photos categorized with tags"
                busy={busy}
                onSave={() => saveOverrides({ ...ov, gallery })}
                extraButton={
                  <button
                    type="button"
                    onClick={() => {
                      const newItem = {
                        src: "/photos/rs-092-02.jpg",
                        tag: "Woven labels",
                        tall: false,
                      };
                      const updated = [newItem, ...gallery];
                      saveOverrides({ ...ov, gallery: updated }, "Gallery photo added!");
                    }}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs"
                  >
                    + Add Gallery Photo
                  </button>
                }
              />

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {gallery.map((g, idx) => (
                  <div key={idx} className="rounded-xl border border-gray-200 bg-slate-50/50 p-3">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-gray-200 bg-white">
                      <Image
                        src={g.src}
                        alt={g.tag}
                        fill
                        className="object-cover"
                        unoptimized={g.src.startsWith("data:")}
                      />
                    </div>

                    <div className="mt-2.5">
                      <label className={labelCls}>Category</label>
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

                    <div className="mt-2">
                      <ImageUploadField
                        label="Change Photo"
                        value={g.src}
                        onChange={(val) => {
                          const updated = [...gallery];
                          updated[idx] = { ...g, src: val };
                          setOv({ ...ov, gallery: updated });
                        }}
                      />
                    </div>

                    <div className="mt-2.5 flex items-center justify-between">
                      <label className="flex items-center gap-1.5 text-xs text-slate-600">
                        <input
                          type="checkbox"
                          checked={Boolean(g.tall)}
                          onChange={(e) => {
                            const updated = [...gallery];
                            updated[idx] = { ...g, tall: e.target.checked };
                            setOv({ ...ov, gallery: updated });
                          }}
                        />
                        Tall Format
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const filtered = gallery.filter((_, i) => i !== idx);
                          saveOverrides({ ...ov, gallery: filtered }, "Photo removed");
                        }}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-end border-t border-gray-200/80 pt-4">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => saveOverrides({ ...ov, gallery })}
                  className="rounded-xl bg-amber-500 px-8 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-sm active:scale-95 transition-all hover:bg-amber-400"
                >
                  {busy ? "Saving..." : "💾 Save Gallery"}
                </button>
              </div>
            </div>
          )}

          {/* TAB: WORKBENCH VIDEO REELS */}
          {tab === "Workbench Videos" && (
            <div>
              <SectionSaveBar
                title="Workbench Video Reels"
                subtitle="Video clips of the production workbench"
                busy={busy}
                onSave={() => saveOverrides({ ...ov, reels: reelsList })}
                extraButton={
                  <button
                    type="button"
                    onClick={() => {
                      const newReel = {
                        src: "/videos/rs-003-video.mp4",
                        poster: "/photos/rs-003-cover.jpg",
                        label: "Custom Craft Reel",
                      };
                      const updated = [...reelsList, newReel];
                      saveOverrides({ ...ov, reels: updated }, "Added reel!");
                    }}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs"
                  >
                    + Add New Reel
                  </button>
                }
              />

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {reelsList.map((r, idx) => (
                  <div key={idx} className="rounded-xl border border-gray-200 bg-slate-50/50 p-4">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                      <span className="font-bold text-xs text-slate-700">Reel #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Remove Reel #${idx + 1}?`)) {
                            const updated = reelsList.filter((_, i) => i !== idx);
                            saveOverrides({ ...ov, reels: updated }, "Removed reel");
                          }
                        }}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-3 relative aspect-[9/16] max-h-48 w-full overflow-hidden rounded-lg bg-slate-900">
                      <video src={r.src} poster={r.poster} controls className="h-full w-full object-cover" />
                    </div>

                    <div className="mt-3 space-y-2.5">
                      <div>
                        <label className={labelCls}>Title / Label</label>
                        <input
                          className={inputCls}
                          value={r.label}
                          onChange={(e) => {
                            const updated = [...reelsList];
                            updated[idx] = { ...r, label: e.target.value };
                            setOv({ ...ov, reels: updated });
                          }}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Video URL</label>
                        <input
                          className={inputCls}
                          value={r.src}
                          onChange={(e) => {
                            const updated = [...reelsList];
                            updated[idx] = { ...r, src: e.target.value };
                            setOv({ ...ov, reels: updated });
                          }}
                        />
                      </div>
                      <ImageUploadField
                        label="Video Poster"
                        value={r.poster}
                        onChange={(val) => {
                          const updated = [...reelsList];
                          updated[idx] = { ...r, poster: val };
                          setOv({ ...ov, reels: updated });
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
                  onClick={() => saveOverrides({ ...ov, reels: reelsList })}
                  className="rounded-xl bg-amber-500 px-8 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-sm active:scale-95 transition-all hover:bg-amber-400"
                >
                  {busy ? "Saving..." : "💾 Save Video Reels"}
                </button>
              </div>
            </div>
          )}

          {/* TAB: WORLDWIDE EXPORT & HUBS */}
          {tab === "Worldwide Export" && (
            <div>
              <SectionSaveBar
                title="Worldwide Export & Manufacturing Hubs"
                subtitle="Manage shipping destinations, express courier delivery timelines, and popular region crafts"
                busy={busy}
                onSave={() => saveOverrides({ ...ov, globalExport })}
                extraButton={
                  <button
                    type="button"
                    onClick={() => {
                      const newRegion: ExportRegion = {
                        id: "region-" + Date.now(),
                        name: "New International Region",
                        flag: "🌐",
                        hubs: "Major fashion capitals & apparel hubs",
                        timeline: "3 – 5 Business Days (Air Express)",
                        popular: ["Custom Woven Damask Labels", "Luxury Embossed Hang Tags"],
                        note: "Bespoke sampling and door-to-door courier clearance.",
                      };
                      const updated = [...globalExport.regions, newRegion];
                      saveOverrides(
                        { ...ov, globalExport: { ...globalExport, regions: updated } },
                        "New region added!"
                      );
                    }}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs"
                  >
                    + Add New Region
                  </button>
                }
              />

              <div className="space-y-6">
                <div className="rounded-xl border border-gray-200 bg-slate-50/50 p-4">
                  <h3 className="font-bold text-sm text-slate-900 mb-3">Section Headers</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className={labelCls}>Eyebrow</label>
                      <input
                        className={inputCls}
                        value={globalExport.eyebrow}
                        onChange={(e) =>
                          setOv({
                            ...ov,
                            globalExport: { ...globalExport, eyebrow: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Title Line 1</label>
                      <input
                        className={inputCls}
                        value={globalExport.titleLine1}
                        onChange={(e) =>
                          setOv({
                            ...ov,
                            globalExport: { ...globalExport, titleLine1: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Title Line 2 (Accent)</label>
                      <input
                        className={inputCls}
                        value={globalExport.titleLine2}
                        onChange={(e) =>
                          setOv({
                            ...ov,
                            globalExport: { ...globalExport, titleLine2: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Subtitle</label>
                      <input
                        className={inputCls}
                        value={globalExport.sub}
                        onChange={(e) =>
                          setOv({
                            ...ov,
                            globalExport: { ...globalExport, sub: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-sm text-slate-900">Regional Destinations</h3>
                  {globalExport.regions.map((reg, rIdx) => (
                    <div key={reg.id || rIdx} className="rounded-xl border border-gray-200 bg-slate-50/50 p-4">
                      <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{reg.flag}</span>
                          <span className="font-bold text-sm text-slate-900">{reg.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => saveOverrides({ ...ov, globalExport }, `Saved "${reg.name}"!`)}
                            className="rounded-lg bg-white border border-gray-200 px-3 py-1 text-xs font-bold text-slate-900 hover:bg-amber-400"
                          >
                            Save ✓
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete region "${reg.name}"?`)) {
                                const updated = globalExport.regions.filter((_, i) => i !== rIdx);
                                saveOverrides(
                                  { ...ov, globalExport: { ...globalExport, regions: updated } },
                                  `Removed "${reg.name}"`
                                );
                              }
                            }}
                            className="text-xs text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 grid gap-3 sm:grid-cols-3">
                        <div>
                          <label className={labelCls}>Region Name</label>
                          <input
                            className={inputCls}
                            value={reg.name}
                            onChange={(e) => {
                              const updated = [...globalExport.regions];
                              updated[rIdx] = { ...reg, name: e.target.value };
                              setOv({
                                ...ov,
                                globalExport: { ...globalExport, regions: updated },
                              });
                            }}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Flag Emojis</label>
                          <input
                            className={inputCls}
                            value={reg.flag}
                            onChange={(e) => {
                              const updated = [...globalExport.regions];
                              updated[rIdx] = { ...reg, flag: e.target.value };
                              setOv({
                                ...ov,
                                globalExport: { ...globalExport, regions: updated },
                              });
                            }}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Timeline</label>
                          <input
                            className={inputCls}
                            value={reg.timeline}
                            onChange={(e) => {
                              const updated = [...globalExport.regions];
                              updated[rIdx] = { ...reg, timeline: e.target.value };
                              setOv({
                                ...ov,
                                globalExport: { ...globalExport, regions: updated },
                              });
                            }}
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <label className={labelCls}>Delivery Hubs</label>
                          <input
                            className={inputCls}
                            value={reg.hubs}
                            onChange={(e) => {
                              const updated = [...globalExport.regions];
                              updated[rIdx] = { ...reg, hubs: e.target.value };
                              setOv({
                                ...ov,
                                globalExport: { ...globalExport, regions: updated },
                              });
                            }}
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <label className={labelCls}>Regional Note</label>
                          <textarea
                            className={cn(inputCls, "min-h-[2.8rem] resize-none")}
                            value={reg.note}
                            onChange={(e) => {
                              const updated = [...globalExport.regions];
                              updated[rIdx] = { ...reg, note: e.target.value };
                              setOv({
                                ...ov,
                                globalExport: { ...globalExport, regions: updated },
                              });
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
                  onClick={() => saveOverrides({ ...ov, globalExport })}
                  className="rounded-xl bg-amber-500 px-8 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-sm active:scale-95 transition-all hover:bg-amber-400"
                >
                  {busy ? "Saving..." : "💾 Save Worldwide Export"}
                </button>
              </div>
            </div>
          )}

          {/* TAB: GLOBAL SEO & META */}
          {tab === "SEO & Meta" && (
            <div>
              <SectionSaveBar
                title="Global SEO & Search Metadata"
                subtitle="Configure Google title, meta description, and worldwide B2B ranking keywords"
                busy={busy}
                onSave={() => saveOverrides({ ...ov, seoSettings })}
              />

              <div className="space-y-4 max-w-3xl">
                <div>
                  <label className={labelCls}>Google Page Title</label>
                  <input
                    className={inputCls}
                    value={seoSettings.metaTitle || ""}
                    onChange={(e) =>
                      setOv({
                        ...ov,
                        seoSettings: { ...seoSettings, metaTitle: e.target.value },
                      })
                    }
                  />
                  <p className="mt-1 text-[11px] text-slate-400">Shows in Google search results and browser tab.</p>
                </div>

                <div>
                  <label className={labelCls}>Google Meta Description</label>
                  <textarea
                    className={cn(inputCls, "min-h-[4.5rem]")}
                    value={seoSettings.metaDescription || ""}
                    onChange={(e) =>
                      setOv({
                        ...ov,
                        seoSettings: { ...seoSettings, metaDescription: e.target.value },
                      })
                    }
                  />
                </div>

                <div>
                  <label className={labelCls}>Target Keywords (Comma-separated)</label>
                  <textarea
                    className={cn(inputCls, "min-h-[4rem]")}
                    value={seoSettings.targetKeywords || ""}
                    onChange={(e) =>
                      setOv({
                        ...ov,
                        seoSettings: { ...seoSettings, targetKeywords: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>Review Rating Score</label>
                    <input
                      className={inputCls}
                      value={seoSettings.ratingValue || "4.9"}
                      onChange={(e) =>
                        setOv({
                          ...ov,
                          seoSettings: { ...seoSettings, ratingValue: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Review Count</label>
                    <input
                      className={inputCls}
                      value={seoSettings.reviewCount || "186"}
                      onChange={(e) =>
                        setOv({
                          ...ov,
                          seoSettings: { ...seoSettings, reviewCount: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>

                <ImageUploadField
                  label="Social Media Share Banner Image"
                  value={seoSettings.ogImage || "/photos/rs-092-02.jpg"}
                  onChange={(val) =>
                    setOv({
                      ...ov,
                      seoSettings: { ...seoSettings, ogImage: val },
                    })
                  }
                />
              </div>

              <div className="mt-8 flex justify-end border-t border-gray-200/80 pt-4">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => saveOverrides({ ...ov, seoSettings })}
                  className="rounded-xl bg-amber-500 px-8 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-sm active:scale-95 transition-all hover:bg-amber-400"
                >
                  {busy ? "Saving..." : "💾 Save SEO Settings"}
                </button>
              </div>
            </div>
          )}

          {/* TAB: HERO SECTION */}
          {tab === "Hero Section" && (
            <div>
              <SectionSaveBar
                title="Hero Banner Section"
                subtitle="Top headlines, video, and CTA buttons"
                busy={busy}
                onSave={() => saveOverrides(ov)}
              />

              <div className="space-y-4 max-w-3xl">
                <div>
                  <label className={labelCls}>Eyebrow Badge</label>
                  <input
                    className={inputCls}
                    value={hero.eyebrow}
                    onChange={(e) => setOv({ ...ov, hero: { ...ov.hero, eyebrow: e.target.value } })}
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>Headline Line 1</label>
                    <input
                      className={inputCls}
                      value={hero.line1}
                      onChange={(e) => setOv({ ...ov, hero: { ...ov.hero, line1: e.target.value } })}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Headline Line 2 (Accent)</label>
                    <input
                      className={inputCls}
                      value={hero.line2}
                      onChange={(e) => setOv({ ...ov, hero: { ...ov.hero, line2: e.target.value } })}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Subtitle</label>
                  <textarea
                    className={cn(inputCls, "min-h-[4rem]")}
                    value={hero.sub}
                    onChange={(e) => setOv({ ...ov, hero: { ...ov.hero, sub: e.target.value } })}
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>Primary CTA Button</label>
                    <input
                      className={inputCls}
                      value={hero.ctaPrimary}
                      onChange={(e) => setOv({ ...ov, hero: { ...ov.hero, ctaPrimary: e.target.value } })}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Secondary CTA Button</label>
                    <input
                      className={inputCls}
                      value={hero.ctaSecondary}
                      onChange={(e) => setOv({ ...ov, hero: { ...ov.hero, ctaSecondary: e.target.value } })}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Video URL</label>
                  <input
                    className={inputCls}
                    value={hero.video}
                    onChange={(e) => setOv({ ...ov, hero: { ...ov.hero, video: e.target.value } })}
                  />
                </div>
                <ImageUploadField
                  label="Hero Poster Fallback Photo"
                  value={hero.poster}
                  onChange={(val) => setOv({ ...ov, hero: { ...ov.hero, poster: val } })}
                />
              </div>

              <div className="mt-8 flex justify-end border-t border-gray-200/80 pt-4">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => saveOverrides(ov)}
                  className="rounded-xl bg-amber-500 px-8 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-sm active:scale-95 transition-all hover:bg-amber-400"
                >
                  {busy ? "Saving..." : "💾 Save Hero"}
                </button>
              </div>
            </div>
          )}

          {/* TAB: TRUST MARQUEE */}
          {tab === "Trust Bar" && (
            <div>
              <SectionSaveBar
                title="Trust Bar & Marquee"
                subtitle="Scrolling trust keywords and brand pillars"
                busy={busy}
                onSave={() => saveOverrides(ov)}
              />

              <div className="space-y-4 max-w-3xl">
                <div>
                  <label className={labelCls}>Marquee Row 1 (Comma-separated)</label>
                  <textarea
                    className={cn(inputCls, "min-h-[3.5rem]")}
                    value={(trustBar.marquee1 || []).join(", ")}
                    onChange={(e) =>
                      setOv({
                        ...ov,
                        trustBar: {
                          ...ov.trustBar,
                          marquee1: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <label className={labelCls}>Marquee Row 2 (Comma-separated)</label>
                  <textarea
                    className={cn(inputCls, "min-h-[3.5rem]")}
                    value={(trustBar.marquee2 || []).join(", ")}
                    onChange={(e) =>
                      setOv({
                        ...ov,
                        trustBar: {
                          ...ov.trustBar,
                          marquee2: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end border-t border-gray-200/80 pt-4">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => saveOverrides(ov)}
                  className="rounded-xl bg-amber-500 px-8 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-sm active:scale-95 transition-all hover:bg-amber-400"
                >
                  {busy ? "Saving..." : "💾 Save Trust Bar"}
                </button>
              </div>
            </div>
          )}

          {/* TAB: BRAND STORY & MANIFESTO */}
          {tab === "Manifesto" && (
            <div>
              <SectionSaveBar
                title="Brand Story & Manifesto"
                subtitle="Core manifesto statement and photo"
                busy={busy}
                onSave={() => saveOverrides(ov)}
              />

              <div className="space-y-4 max-w-3xl">
                <div>
                  <label className={labelCls}>Eyebrow</label>
                  <input
                    className={inputCls}
                    value={manifesto.eyebrow}
                    onChange={(e) => setOv({ ...ov, manifesto: { ...ov.manifesto, eyebrow: e.target.value } })}
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>Title Part 1</label>
                    <input
                      className={inputCls}
                      value={manifesto.big[0]}
                      onChange={(e) =>
                        setOv({
                          ...ov,
                          manifesto: { ...ov.manifesto, big: [e.target.value, manifesto.big[1]] },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Title Part 2 (Accent)</label>
                    <input
                      className={inputCls}
                      value={manifesto.big[1]}
                      onChange={(e) =>
                        setOv({
                          ...ov,
                          manifesto: { ...ov.manifesto, big: [manifesto.big[0], e.target.value] },
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Body Paragraph</label>
                  <textarea
                    className={cn(inputCls, "min-h-[4rem]")}
                    value={manifesto.body}
                    onChange={(e) => setOv({ ...ov, manifesto: { ...ov.manifesto, body: e.target.value } })}
                  />
                </div>
                <ImageUploadField
                  label="Manifesto Photo"
                  value={manifesto.image}
                  onChange={(val) => setOv({ ...ov, manifesto: { ...ov.manifesto, image: val } })}
                />
              </div>

              <div className="mt-8 flex justify-end border-t border-gray-200/80 pt-4">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => saveOverrides(ov)}
                  className="rounded-xl bg-amber-500 px-8 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-sm active:scale-95 transition-all hover:bg-amber-400"
                >
                  {busy ? "Saving..." : "💾 Save Manifesto"}
                </button>
              </div>
            </div>
          )}

          {/* TAB: CRAFT PHILOSOPHY */}
          {tab === "Philosophy" && (
            <div>
              <SectionSaveBar
                title="Craft Philosophy"
                subtitle="Visual quote banner and atelier background"
                busy={busy}
                onSave={() => saveOverrides(ov)}
              />

              <div className="space-y-4 max-w-3xl">
                <div>
                  <label className={labelCls}>Eyebrow</label>
                  <input
                    className={inputCls}
                    value={philosophy.eyebrow}
                    onChange={(e) => setOv({ ...ov, philosophy: { ...philosophy, eyebrow: e.target.value } })}
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>Heading Line 1</label>
                    <input
                      className={inputCls}
                      value={philosophy.heading1}
                      onChange={(e) => setOv({ ...ov, philosophy: { ...philosophy, heading1: e.target.value } })}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Heading Line 2</label>
                    <input
                      className={inputCls}
                      value={philosophy.heading2}
                      onChange={(e) => setOv({ ...ov, philosophy: { ...philosophy, heading2: e.target.value } })}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Body</label>
                  <textarea
                    className={cn(inputCls, "min-h-[4rem]")}
                    value={philosophy.body}
                    onChange={(e) => setOv({ ...ov, philosophy: { ...philosophy, body: e.target.value } })}
                  />
                </div>
                <ImageUploadField
                  label="Philosophy Photo"
                  value={philosophy.image}
                  onChange={(val) => setOv({ ...ov, philosophy: { ...philosophy, image: val } })}
                />
              </div>

              <div className="mt-8 flex justify-end border-t border-gray-200/80 pt-4">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => saveOverrides(ov)}
                  className="rounded-xl bg-amber-500 px-8 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-sm active:scale-95 transition-all hover:bg-amber-400"
                >
                  {busy ? "Saving..." : "💾 Save Philosophy"}
                </button>
              </div>
            </div>
          )}

          {/* TAB: PROCESS STEPS */}
          {tab === "Process Steps" && (
            <div>
              <SectionSaveBar
                title="Craft Process Steps"
                subtitle="Step-by-step production timeline (5 steps)"
                busy={busy}
                onSave={() => saveOverrides(ov)}
              />

              <div className="space-y-4 max-w-3xl">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>Eyebrow</label>
                    <input
                      className={inputCls}
                      value={processEyebrow}
                      onChange={(e) =>
                        setOv({ ...ov, atelierProcess: { ...ov.atelierProcess, eyebrow: e.target.value } })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Title</label>
                    <input
                      className={inputCls}
                      value={processTitle}
                      onChange={(e) =>
                        setOv({ ...ov, atelierProcess: { ...ov.atelierProcess, title: e.target.value } })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {processSteps.map((s, idx) => (
                    <div key={s.n} className="rounded-xl border border-gray-200 bg-slate-50/50 p-3.5">
                      <div className="grid gap-2 sm:grid-cols-4">
                        <div>
                          <label className={labelCls}>Step #{s.n}</label>
                          <input
                            className={inputCls}
                            value={s.title}
                            onChange={(e) => {
                              const updated = [...processSteps];
                              updated[idx] = { ...s, title: e.target.value };
                              setOv({ ...ov, atelierProcess: { ...ov.atelierProcess, steps: updated } });
                            }}
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <label className={labelCls}>Description</label>
                          <input
                            className={inputCls}
                            value={s.body}
                            onChange={(e) => {
                              const updated = [...processSteps];
                              updated[idx] = { ...s, body: e.target.value };
                              setOv({ ...ov, atelierProcess: { ...ov.atelierProcess, steps: updated } });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <ImageUploadField
                  label="Process Ambient Photo"
                  value={processImage}
                  onChange={(val) => setOv({ ...ov, atelierProcess: { ...ov.atelierProcess, image: val } })}
                />
              </div>

              <div className="mt-8 flex justify-end border-t border-gray-200/80 pt-4">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => saveOverrides(ov)}
                  className="rounded-xl bg-amber-500 px-8 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-sm active:scale-95 transition-all hover:bg-amber-400"
                >
                  {busy ? "Saving..." : "💾 Save Process"}
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
                        q: "What is the delivery timeline?",
                        a: "Digital proofs arrive in 24 hours. Production takes 7-10 working days plus tracked courier dispatch.",
                        guessed: false,
                      };
                      const updated = [...faqList, newFaq];
                      saveOverrides({ ...ov, faqs: updated }, "FAQ added!");
                    }}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs"
                  >
                    + Add FAQ
                  </button>
                }
              />

              <div className="space-y-3.5">
                {faqList.map((f, idx) => (
                  <div key={idx} className="rounded-xl border border-gray-200 bg-slate-50/50 p-4">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                      <span className="font-bold text-xs text-slate-800">FAQ #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const filtered = faqList.filter((_, i) => i !== idx);
                          saveOverrides({ ...ov, faqs: filtered }, "FAQ deleted");
                        }}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="mt-3 space-y-2">
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
                          className={cn(inputCls, "min-h-[3rem] resize-none")}
                          value={f.a}
                          onChange={(e) => {
                            const updated = [...faqList];
                            updated[idx] = { ...f, a: e.target.value };
                            setOv({ ...ov, faqs: updated });
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
                  onClick={() => saveOverrides({ ...ov, faqs: faqList })}
                  className="rounded-xl bg-amber-500 px-8 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-sm active:scale-95 transition-all hover:bg-amber-400"
                >
                  {busy ? "Saving..." : "💾 Save FAQs"}
                </button>
              </div>
            </div>
          )}

          {/* TAB: CLIENT REVIEWS */}
          {tab === "Reviews" && (
            <div>
              <SectionSaveBar
                title="Client Reviews"
                subtitle="5-star testimonials shown on the website"
                busy={busy}
                onSave={() => saveOverrides({ ...ov, testimonials: testimonialList })}
                extraButton={
                  <button
                    type="button"
                    onClick={() => {
                      const newTest: Testimonial = {
                        quote: "Outstanding weave quality and rapid turnaround for our brand.",
                        name: "Brand Director",
                        role: "Owner, Boutique Studio",
                        city: "Dubai",
                        sample: false,
                      };
                      const updated = [...testimonialList, newTest];
                      saveOverrides({ ...ov, testimonials: updated }, "Review added!");
                    }}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs"
                  >
                    + Add Review
                  </button>
                }
              />

              <div className="space-y-4">
                {testimonialList.map((t, idx) => (
                  <div key={idx} className="rounded-xl border border-gray-200 bg-slate-50/50 p-4">
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="font-bold text-xs text-slate-800">Review #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const filtered = testimonialList.filter((_, i) => i !== idx);
                          saveOverrides({ ...ov, testimonials: filtered }, "Review deleted");
                        }}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="mt-3 space-y-2">
                      <div>
                        <label className={labelCls}>Quote</label>
                        <textarea
                          className={cn(inputCls, "min-h-[2.8rem] resize-none")}
                          value={t.quote}
                          onChange={(e) => {
                            const updated = [...testimonialList];
                            updated[idx] = { ...t, quote: e.target.value };
                            setOv({ ...ov, testimonials: updated });
                          }}
                        />
                      </div>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div>
                          <label className={labelCls}>Reviewer Name</label>
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
                          <label className={labelCls}>City / Country</label>
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
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-end border-t border-gray-200/80 pt-4">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => saveOverrides({ ...ov, testimonials: testimonialList })}
                  className="rounded-xl bg-amber-500 px-8 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-sm active:scale-95 transition-all hover:bg-amber-400"
                >
                  {busy ? "Saving..." : "💾 Save Reviews"}
                </button>
              </div>
            </div>
          )}

          {/* TAB: FOOTER */}
          {tab === "Footer" && (
            <div>
              <SectionSaveBar
                title="Footer Section"
                subtitle="Bottom call-to-action headlines and notes"
                busy={busy}
                onSave={() => saveOverrides(ov)}
              />

              <div className="space-y-4 max-w-3xl">
                <div>
                  <label className={labelCls}>Big Headline</label>
                  <input
                    className={inputCls}
                    value={footer.big}
                    onChange={(e) => setOv({ ...ov, footer: { ...ov.footer, big: e.target.value } })}
                  />
                </div>
                <div>
                  <label className={labelCls}>Top Note / Subtitle</label>
                  <input
                    className={inputCls}
                    value={footer.note}
                    onChange={(e) => setOv({ ...ov, footer: { ...ov.footer, note: e.target.value } })}
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end border-t border-gray-200/80 pt-4">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => saveOverrides(ov)}
                  className="rounded-xl bg-amber-500 px-8 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-sm active:scale-95 transition-all hover:bg-amber-400"
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
                title="Contact & Company Info"
                subtitle="Phone, WhatsApp, email, Instagram and location details"
                busy={busy}
                onSave={() => saveOverrides(ov)}
              />

              <div className="grid gap-4 sm:grid-cols-2 max-w-3xl">
                <div>
                  <label className={labelCls}>Company Name</label>
                  <input
                    className={inputCls}
                    value={site.name}
                    onChange={(e) => setOv({ ...ov, site: { ...ov.site, name: e.target.value } })}
                  />
                </div>
                <div>
                  <label className={labelCls}>Short Brand Name</label>
                  <input
                    className={inputCls}
                    value={site.shortName}
                    onChange={(e) => setOv({ ...ov, site: { ...ov.site, shortName: e.target.value } })}
                  />
                </div>
                <div>
                  <label className={labelCls}>Phone (Display)</label>
                  <input
                    className={inputCls}
                    value={site.phoneDisplay}
                    onChange={(e) => setOv({ ...ov, contact: { ...ov.contact, phoneDisplay: e.target.value } })}
                  />
                </div>
                <div>
                  <label className={labelCls}>WhatsApp URL</label>
                  <input
                    className={inputCls}
                    value={site.whatsapp}
                    onChange={(e) => setOv({ ...ov, contact: { ...ov.contact, whatsapp: e.target.value } })}
                  />
                </div>
                <div>
                  <label className={labelCls}>Email Address</label>
                  <input
                    className={inputCls}
                    value={site.email}
                    onChange={(e) => setOv({ ...ov, contact: { ...ov.contact, email: e.target.value } })}
                  />
                </div>
                <div>
                  <label className={labelCls}>Instagram Link</label>
                  <input
                    className={inputCls}
                    value={site.instagram}
                    onChange={(e) => setOv({ ...ov, contact: { ...ov.contact, instagram: e.target.value } })}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Location Note</label>
                  <input
                    className={inputCls}
                    value={site.location}
                    onChange={(e) => setOv({ ...ov, contact: { ...ov.contact, location: e.target.value } })}
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end border-t border-gray-200/80 pt-4">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => saveOverrides(ov)}
                  className="rounded-xl bg-amber-500 px-8 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-sm active:scale-95 transition-all hover:bg-amber-400"
                >
                  {busy ? "Saving..." : "💾 Save Contact Details"}
                </button>
              </div>
            </div>
          )}

          {/* TAB: INQUIRIES */}
          {tab === "Enquiries" && (
            <div>
              <div className="flex items-center justify-between border-b border-gray-200/80 pb-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Customer Inquiries</h2>
                  <p className="text-xs text-slate-500">Live incoming quote requests</p>
                </div>
                <button
                  onClick={load}
                  className="rounded-xl border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Refresh 🔄
                </button>
              </div>

              {leads.length === 0 ? (
                <div className="py-16 text-center text-sm text-slate-400">No inquiries yet.</div>
              ) : (
                <div className="divide-y divide-gray-200/80">
                  {leads.map((l) => (
                    <div key={l.id} className="py-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={cn(
                              "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase",
                              l.status === "new" ? "bg-amber-100 text-amber-900 ring-1 ring-amber-300" : "bg-emerald-100 text-emerald-900"
                            )}
                          >
                            {l.status}
                          </span>
                          <span className="text-base font-bold text-slate-900">{l.name || "Anonymous"}</span>
                          {l.meta?.brand && <span className="text-xs text-slate-500">({l.meta.brand})</span>}
                        </div>

                        <div className="flex items-center gap-2">
                          {l.phone && (
                            <a
                              href={`https://wa.me/${l.phone.replace(/[^0-9]/g, "")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-lg bg-[#25D366]/15 px-3 py-1 text-xs font-bold text-[#128C7E] hover:bg-[#25D366]/30"
                            >
                              WhatsApp Reply ↗
                            </a>
                          )}
                          <button
                            onClick={async () => {
                              await post({
                                action: "lead-status",
                                id: l.id,
                                status: l.status === "new" ? "replied" : "new",
                              });
                              load();
                            }}
                            className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100"
                          >
                            Mark {l.status === "new" ? "Replied" : "New"}
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm("Delete this inquiry?")) {
                                await post({ action: "delete-lead", id: l.id });
                                load();
                              }
                            }}
                            className="rounded-lg px-2 text-xs text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <div className="mt-2.5 grid gap-2 rounded-xl bg-slate-50 p-3 text-xs sm:grid-cols-3">
                        <div>
                          <span className="font-semibold text-slate-500">Product:</span> {l.product || "N/A"}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-500">Quantity:</span> {l.quantity || "N/A"}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-500">Contact:</span> {l.phone || l.email || l.meta?.contact || "N/A"}
                        </div>
                        {l.message && (
                          <div className="sm:col-span-3">
                            <span className="font-semibold text-slate-500">Notes / Artwork:</span> {l.message}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: LIVE ANALYTICS */}
          {tab === "Live Analytics" && (
            <div className="space-y-6">
              <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-gray-200 bg-slate-50/50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Live Online</span>
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                    </span>
                  </div>
                  <p className="mt-1 text-3xl font-extrabold text-slate-900">{analytics?.liveVisitors ?? 1}</p>
                  <p className="text-[11px] text-emerald-700 font-medium">Active on site now</p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-slate-50/50 p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">24h Views</span>
                  <p className="mt-1 text-3xl font-extrabold text-slate-900">{analytics?.views24h ?? 0}</p>
                  <p className="text-[11px] text-slate-500">Unique: {analytics?.unique24h ?? 0}</p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-slate-50/50 p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Views</span>
                  <p className="mt-1 text-3xl font-extrabold text-amber-600">{analytics?.totalViews ?? 0}</p>
                  <p className="text-[11px] text-slate-500">Lifetime pageviews</p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-slate-50/50 p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Visitors</span>
                  <p className="mt-1 text-3xl font-extrabold text-slate-900">{analytics?.uniqueVisitors ?? 0}</p>
                  <p className="text-[11px] text-slate-500">Distinct devices</p>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-slate-50/50 p-4 sm:p-5">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                    <h3 className="font-bold text-sm text-slate-900">Traffic by Country</h3>
                    <button onClick={loadAnalytics} className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs">
                      {analyticsLoading ? "..." : "Refresh"}
                    </button>
                  </div>
                  <div className="mt-3 divide-y divide-gray-200">
                    {analytics?.countryStats?.map((c, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2 text-xs">
                        <span className="font-semibold text-slate-800">{getCountryFlag(c.country)}</span>
                        <span className="font-bold text-slate-900">{c.count} views</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-slate-50/50 p-4 sm:p-5">
                  <h3 className="font-bold text-sm text-slate-900 border-b border-gray-200 pb-3">Top Visited Pages</h3>
                  <div className="mt-3 divide-y divide-gray-200">
                    {analytics?.topPages?.map((p, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2 text-xs">
                        <span className="font-mono text-slate-700">{p.path}</span>
                        <span className="font-bold text-slate-900">{p.count} views</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-6 left-1/2 z-[300] -translate-x-1/2 rounded-full bg-slate-950 px-6 py-3 text-xs font-bold text-white shadow-2xl flex items-center gap-2 border border-amber-400"
          >
            <span className="text-amber-400">✓</span> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
