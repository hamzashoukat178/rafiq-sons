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
  type Product,
  type Testimonial,
  type Faq,
} from "@/content/site";
import { defaultContent, type Overrides } from "@/lib/content";
import { cn } from "@/lib/utils";
import AdminTabsNav from "./AdminTabsNav";

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
};

const tabDefs = [
  { id: "Live Analytics", label: "Live Analytics", icon: "📊" },
  { id: "Enquiries", label: "Inquiries", icon: "💬" },
  { id: "Workbench Videos", label: "Video Reels", icon: "🎬" },
  { id: "Contact & Info", label: "Contact & Info", icon: "📞" },
  { id: "Hero Section", label: "Hero Banner", icon: "👑" },
  { id: "Trust Bar", label: "Trust Marquee", icon: "⚡" },
  { id: "Manifesto", label: "Brand Story", icon: "📖" },
  { id: "Products", label: "Products Catalog", icon: "🏷️" },
  { id: "Philosophy", label: "Philosophy", icon: "🏛️" },
  { id: "Process Steps", label: "Process Steps", icon: "⚙️" },
  { id: "Showroom Gallery", label: "Showroom Gallery", icon: "🖼️" },
  { id: "Reviews", label: "Client Reviews", icon: "⭐" },
  { id: "FAQs", label: "FAQs Accordion", icon: "❓" },
  { id: "Footer", label: "Footer", icon: "⚓" },
] as const;

type Tab = (typeof tabDefs)[number]["id"];

const inputCls =
  "w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm text-ink outline-none transition-all focus:border-gold-deep focus:ring-2 focus:ring-gold-deep/20 shadow-sm";
const labelCls = "mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-ink/70";

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

// --- IMAGE UPLOADER COMPONENT WITH AUTOMATIC COMPRESSION ---
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
    <div className="rounded-2xl border border-dashed border-ink/20 bg-amber-50/30 p-3.5 sm:p-4 transition-colors hover:border-gold-deep">
      <span className={labelCls}>{label}</span>

      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          {value && (
            <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-xl border border-ink/15 bg-white shadow-sm">
              <Image
                src={value}
                alt="Preview"
                fill
                className="object-cover"
                unoptimized={value.startsWith("data:")}
              />
            </div>
          )}
          <div>
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
              className="inline-flex items-center gap-1.5 rounded-xl bg-coal px-3.5 py-2 text-xs font-semibold text-ivory shadow-sm transition-transform active:scale-95 disabled:opacity-50 hover:bg-gold-deep"
            >
              {compressing ? "⚡ Compressing..." : "📁 Choose Image (Auto-Compress)"}
            </button>
            <p className="mt-1 text-[11px] text-ink/50">
              Auto-compressed to modern WebP for top performance.
            </p>
          </div>
        </div>

        {stats && (
          <div className="rounded-lg bg-emerald-100/90 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
            {stats.orig} ➔ {stats.comp} ({stats.savings}% saved)
          </div>
        )}
      </div>

      <div className="mt-3">
        <input
          type="text"
          className={cn(inputCls, "!py-2 text-xs text-ink/75")}
          placeholder="Or enter path / URL (e.g. /photos/rs-092-02.jpg)"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
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
  const [tab, setTab] = useState<Tab>("Live Analytics");
  const [toast, setToast] = useState("");
  const [busy, setBusy] = useState(false);

  // working copies
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
    setTimeout(() => setToast(""), 2800);
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

  const saveOverrides = async (next: Overrides, msg = "Saved! Live site updated.") => {
    setOv(next);
    if (await post({ action: "save-overrides", overrides: next })) say(msg);
    else say("Could not save. Check database connection.");
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

  if (state === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink font-display text-2xl italic text-gold">
        Loading Rafiq Sons Atelier Studio...
      </div>
    );
  }

  if (state === "login") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink px-4">
        <motion.form
          onSubmit={login}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-dark w-full max-w-md rounded-3xl border border-ivory/15 p-7 sm:p-10 shadow-2xl"
        >
          <div className="text-center">
            <Image
              src="/brand/logo-wide-light.png"
              alt="Rafiq Sons Labels"
              width={160}
              height={50}
              className="mx-auto h-11 w-auto"
            />
            <p className="eyebrow mt-4 text-gold">Management Atelier</p>
            <h1 className="font-display mt-2 text-2xl text-ivory">Admin Sign In</h1>
          </div>

          <div className="mt-7">
            <label className="text-xs uppercase tracking-wider text-ivory/60 font-semibold">Admin Password</label>
            <input
              type="password"
              className="mt-2 w-full rounded-xl border border-ivory/20 bg-coal px-4 py-3 text-sm text-ivory outline-none focus:border-gold"
              placeholder="Enter your admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            {loginError && <p className="mt-2 text-xs text-red-400">{loginError}</p>}
          </div>

          <button
            type="submit"
            className="btn-sheen mt-6 w-full rounded-full bg-gold py-3.5 text-xs font-bold uppercase tracking-wider text-ink shadow-lg active:scale-98"
          >
            Access Studio
          </button>
        </motion.form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f4] pb-24 text-ink antialiased">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-50 border-b border-ink/10 bg-white/95 px-4 py-3.5 sm:px-8 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-4">
            <Image
              src="/brand/logo-wide.png"
              alt="Rafiq Sons Labels"
              width={130}
              height={38}
              className="h-7 w-auto sm:h-8"
            />
            <span className="hidden rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold text-amber-900 md:inline-block">
              CMS Studio & Live Analytics
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="https://www.rafiqsonslabels.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-ink/20 px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold text-ink transition-colors hover:bg-ink hover:text-ivory"
            >
              Live Site ↗
            </a>
            <button
              onClick={logout}
              className="rounded-full bg-ink/5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold text-ink/80 transition-colors hover:bg-red-50 hover:text-red-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-8">
        {/* Sleek Mobile & Desktop Tabs Navigation */}
        <AdminTabsNav
          tabs={tabDefs}
          activeTab={tab}
          onSelectTab={(t) => setTab(t)}
          newCount={newCount}
        />

        {/* Tab Content Panels */}
        <div>
          {/* TAB 1: LIVE ANALYTICS */}
          {tab === "Live Analytics" && (
            <div className="space-y-6">
              {/* Top Stat Cards */}
              <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-ink/10 bg-white p-4 sm:p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-ink/50">Live Online</span>
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#25D366]" />
                    </span>
                  </div>
                  <p className="font-display mt-2 text-3xl sm:text-4xl font-bold text-ink">
                    {analytics?.liveVisitors ?? 1}
                  </p>
                  <p className="mt-1 text-[11px] text-[#128C7E] font-medium">Active on site now</p>
                </div>

                <div className="rounded-2xl border border-ink/10 bg-white p-4 sm:p-6 shadow-sm">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-ink/50">24h Views</span>
                  <p className="font-display mt-2 text-3xl sm:text-4xl font-bold text-ink">
                    {analytics?.views24h ?? 0}
                  </p>
                  <p className="mt-1 text-[11px] text-ink/50">
                    Unique: {analytics?.unique24h ?? 0}
                  </p>
                </div>

                <div className="rounded-2xl border border-ink/10 bg-white p-4 sm:p-6 shadow-sm">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-ink/50">Total Views</span>
                  <p className="font-display mt-2 text-3xl sm:text-4xl font-bold text-gold-deep">
                    {analytics?.totalViews ?? 0}
                  </p>
                  <p className="mt-1 text-[11px] text-ink/50">Lifetime pageviews</p>
                </div>

                <div className="rounded-2xl border border-ink/10 bg-white p-4 sm:p-6 shadow-sm">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-ink/50">Total Visitors</span>
                  <p className="font-display mt-2 text-3xl sm:text-4xl font-bold text-ink">
                    {analytics?.uniqueVisitors ?? 0}
                  </p>
                  <p className="mt-1 text-[11px] text-ink/50">Distinct devices</p>
                </div>
              </div>

              {/* Country Breakdown & Top Pages Grid */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Country Breakdown */}
                <div className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6 shadow-sm">
                  <div className="flex items-center justify-between border-b border-ink/10 pb-4">
                    <div>
                      <h3 className="font-display text-xl text-ink">Traffic by Country</h3>
                      <p className="text-xs text-ink/50">Geographic origin of visitors</p>
                    </div>
                    <button
                      onClick={loadAnalytics}
                      className="rounded-lg border border-ink/20 px-3 py-1 text-xs hover:bg-ink/5"
                    >
                      {analyticsLoading ? "..." : "Refresh"}
                    </button>
                  </div>

                  <div className="mt-4 divide-y divide-ink/10">
                    {analytics?.countryStats && analytics.countryStats.length > 0 ? (
                      analytics.countryStats.map((c, idx) => {
                        const total = analytics.totalViews || 1;
                        const pct = Math.round((c.count / total) * 100);
                        return (
                          <div key={idx} className="flex items-center justify-between py-3">
                            <span className="font-semibold text-sm text-ink">{getCountryFlag(c.country)}</span>
                            <div className="flex items-center gap-3">
                              <div className="w-20 sm:w-28 h-2 rounded-full bg-amber-100 overflow-hidden">
                                <div className="h-full bg-gold-deep rounded-full" style={{ width: `${Math.min(100, Math.max(10, pct * 2))}%` }} />
                              </div>
                              <span className="font-display text-xs sm:text-sm font-bold text-ink min-w-14 text-right">{c.count} views</span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="py-6 text-center text-xs text-ink/50">Collecting live traffic...</p>
                    )}
                  </div>
                </div>

                {/* Top Visited Pages & Devices */}
                <div className="space-y-6">
                  <div className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6 shadow-sm">
                    <h3 className="font-display text-xl text-ink border-b border-ink/10 pb-4">Top Pages</h3>
                    <div className="mt-4 divide-y divide-ink/10">
                      {analytics?.topPages && analytics.topPages.length > 0 ? (
                        analytics.topPages.map((p, idx) => (
                          <div key={idx} className="flex items-center justify-between py-2.5 text-xs">
                            <span className="font-mono text-ink/80 truncate max-w-[200px]">{p.path}</span>
                            <span className="font-bold text-ink">{p.count} views</span>
                          </div>
                        ))
                      ) : (
                        <p className="py-4 text-center text-xs text-ink/50">Collecting page stats...</p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6 shadow-sm">
                    <h3 className="font-display text-xl text-ink border-b border-ink/10 pb-4">Device Breakdown</h3>
                    <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3 text-center">
                      {analytics?.deviceStats?.map((d) => (
                        <div key={d.device} className="rounded-xl bg-amber-50/50 p-3">
                          <p className="text-[10px] uppercase tracking-wider text-ink/50 font-bold">{d.device}</p>
                          <p className="font-display mt-1 text-xl sm:text-2xl font-bold text-ink">{d.count}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Recent Visitors Stream */}
              <div className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-ink/10 pb-4">
                  <div>
                    <h3 className="font-display text-xl text-ink">Live Visitor Stream</h3>
                    <p className="text-xs text-ink/50">Incoming visitor sessions log</p>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                  </span>
                </div>

                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-ink/10 text-ink/50 uppercase tracking-wider">
                        <th className="pb-3 font-semibold">Time</th>
                        <th className="pb-3 font-semibold">Location</th>
                        <th className="pb-3 font-semibold">Page</th>
                        <th className="pb-3 font-semibold">Device</th>
                        <th className="pb-3 font-semibold">Source</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/10">
                      {analytics?.recentVisits && analytics.recentVisits.length > 0 ? (
                        analytics.recentVisits.map((v) => (
                          <tr key={v.id} className="hover:bg-amber-50/20">
                            <td className="py-3 text-ink/60 whitespace-nowrap">
                              {new Date(v.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </td>
                            <td className="py-3 font-semibold text-ink whitespace-nowrap">
                              {getCountryFlag(v.country)} {v.city && v.city !== "Unknown" ? `(${v.city})` : ""}
                            </td>
                            <td className="py-3 font-mono text-ink/75">{v.path}</td>
                            <td className="py-3 capitalize text-ink/70">{v.device}</td>
                            <td className="py-3 text-ink/60">{v.referrer || "Direct"}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-ink/50">No recent visitor logs yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INQUIRIES */}
          {tab === "Enquiries" && (
            <div className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-ink/10 pb-4">
                <div>
                  <h2 className="font-display text-2xl text-ink">Customer Inquiries</h2>
                  <p className="text-xs text-ink/50">Quote requests submitted by clients</p>
                </div>
                <button
                  onClick={load}
                  className="rounded-lg border border-ink/20 px-3 py-1.5 text-xs font-semibold hover:bg-ink/5"
                >
                  Refresh
                </button>
              </div>

              {leads.length === 0 ? (
                <div className="py-16 text-center text-sm text-ink/45">No inquiries yet.</div>
              ) : (
                <div className="mt-6 divide-y divide-ink/10">
                  {leads.map((l) => (
                    <div key={l.id} className="py-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase",
                              l.status === "new" ? "bg-amber-100 text-amber-900 ring-1 ring-amber-300" : "bg-emerald-100 text-emerald-900"
                            )}
                          >
                            {l.status}
                          </span>
                          <span className="font-display text-lg font-semibold text-ink">{l.name || "Anonymous"}</span>
                          {l.meta?.brand && (
                            <span className="text-xs text-ink/60">({l.meta.brand})</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {l.phone && (
                            <a
                              href={`https://wa.me/${l.phone.replace(/[^0-9]/g, "")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-full bg-[#25D366]/15 px-3 py-1 text-xs font-semibold text-[#128C7E] hover:bg-[#25D366]/30"
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
                            className="rounded-full border border-ink/15 px-3 py-1 text-xs text-ink/70 hover:bg-ink/5"
                          >
                            Mark as {l.status === "new" ? "Replied" : "New"}
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm("Delete this inquiry?")) {
                                await post({ action: "delete-lead", id: l.id });
                                load();
                              }
                            }}
                            className="rounded-full px-2 text-xs text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 grid gap-2 rounded-xl bg-amber-50/40 p-3.5 text-xs sm:grid-cols-3">
                        <div>
                          <span className="font-semibold text-ink/60">Product:</span> {l.product || "N/A"}
                        </div>
                        <div>
                          <span className="font-semibold text-ink/60">Quantity:</span> {l.quantity || "N/A"}
                        </div>
                        <div>
                          <span className="font-semibold text-ink/60">Contact:</span> {l.phone || l.email || l.meta?.contact || "N/A"}
                        </div>
                        {l.message && (
                          <div className="sm:col-span-3">
                            <span className="font-semibold text-ink/60">Notes / Artwork:</span> {l.message}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WORKBENCH VIDEOS / REELS */}
          {tab === "Workbench Videos" && (
            <div className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-4">
                <div>
                  <h2 className="font-display text-2xl text-ink">Workbench Video Reels</h2>
                  <p className="text-xs text-ink/50">Manage video clips, auto-compressed poster images and titles</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newReel = {
                      src: "/videos/rs-003-video.mp4",
                      poster: "/photos/rs-003-cover.jpg",
                      label: "Custom Craft Reel",
                    };
                    setOv({ ...ov, reels: [...reelsList, newReel] });
                  }}
                  className="rounded-full bg-coal px-4 py-2 text-xs font-semibold text-ivory hover:bg-gold-deep"
                >
                  + Add New Video Reel
                </button>
              </div>

              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {reelsList.map((r, idx) => (
                  <div key={idx} className="rounded-2xl border border-ink/15 bg-amber-50/20 p-4">
                    <div className="flex items-center justify-between border-b border-ink/10 pb-2">
                      <span className="font-bold text-xs uppercase tracking-wider text-ink">Reel #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Remove Reel #${idx + 1}?`)) {
                            const updated = reelsList.filter((_, i) => i !== idx);
                            setOv({ ...ov, reels: updated });
                          }
                        }}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-3 relative aspect-[9/16] max-h-56 w-full overflow-hidden rounded-xl bg-coal shadow-inner">
                      <video
                        src={r.src}
                        poster={r.poster}
                        controls
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="mt-4 space-y-3">
                      <div>
                        <label className={labelCls}>Video Title / Label</label>
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
                        <label className={labelCls}>Video File URL / Path</label>
                        <input
                          className={inputCls}
                          value={r.src}
                          placeholder="/videos/rs-003-video.mp4"
                          onChange={(e) => {
                            const updated = [...reelsList];
                            updated[idx] = { ...r, src: e.target.value };
                            setOv({ ...ov, reels: updated });
                          }}
                        />
                      </div>

                      <ImageUploadField
                        label="Video Poster Image"
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

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => saveOverrides(ov)}
                  className="rounded-full bg-coal px-8 py-3 text-xs font-bold uppercase tracking-wider text-ivory hover:bg-gold-deep"
                >
                  Save All Video Reels
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: CONTACT & COMPANY INFO */}
          {tab === "Contact & Info" && (
            <div className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6 shadow-sm">
              <h2 className="font-display text-2xl text-ink">Company & Contact Details</h2>
              <p className="text-xs text-ink/50">Update company phone, WhatsApp, Instagram, location and information</p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
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
                  <label className={labelCls}>Phone Number (Display Format)</label>
                  <input
                    className={inputCls}
                    value={site.phoneDisplay}
                    onChange={(e) => setOv({ ...ov, contact: { ...ov.contact, phoneDisplay: e.target.value } })}
                  />
                </div>
                <div>
                  <label className={labelCls}>WhatsApp URL Link</label>
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
                  <label className={labelCls}>Instagram URL</label>
                  <input
                    className={inputCls}
                    value={site.instagram}
                    onChange={(e) => setOv({ ...ov, contact: { ...ov.contact, instagram: e.target.value } })}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Location & Worldwide Note</label>
                  <input
                    className={inputCls}
                    value={site.location}
                    onChange={(e) => setOv({ ...ov, contact: { ...ov.contact, location: e.target.value } })}
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => saveOverrides(ov)}
                  className="rounded-full bg-coal px-8 py-3 text-xs font-bold uppercase tracking-wider text-ivory hover:bg-gold-deep"
                >
                  Save Contact Info
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: HERO SECTION */}
          {tab === "Hero Section" && (
            <div className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6 shadow-sm">
              <h2 className="font-display text-2xl text-ink">Hero Banner Header</h2>
              <p className="text-xs text-ink/50">Top headlines, gold accent text, video and primary call-to-actions</p>

              <div className="mt-6 space-y-4">
                <div>
                  <label className={labelCls}>Eyebrow Badge</label>
                  <input
                    className={inputCls}
                    value={hero.eyebrow}
                    onChange={(e) => setOv({ ...ov, hero: { ...ov.hero, eyebrow: e.target.value } })}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>Headline Line 1</label>
                    <input
                      className={inputCls}
                      value={hero.line1}
                      onChange={(e) => setOv({ ...ov, hero: { ...ov.hero, line1: e.target.value } })}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Headline Line 2 (Gold Gradient)</label>
                    <input
                      className={inputCls}
                      value={hero.line2}
                      onChange={(e) => setOv({ ...ov, hero: { ...ov.hero, line2: e.target.value } })}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Subtitle Description</label>
                  <textarea
                    className={cn(inputCls, "min-h-[4.5rem] resize-none")}
                    value={hero.sub}
                    onChange={(e) => setOv({ ...ov, hero: { ...ov.hero, sub: e.target.value } })}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
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
                  <label className={labelCls}>Hero Background Video URL / Path</label>
                  <input
                    className={inputCls}
                    value={hero.video}
                    onChange={(e) => setOv({ ...ov, hero: { ...ov.hero, video: e.target.value } })}
                  />
                </div>

                <ImageUploadField
                  label="Hero Poster / Fallback Image"
                  value={hero.poster}
                  onChange={(val) => setOv({ ...ov, hero: { ...ov.hero, poster: val } })}
                />
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => saveOverrides(ov)}
                  className="rounded-full bg-coal px-8 py-3 text-xs font-bold uppercase tracking-wider text-ivory hover:bg-gold-deep"
                >
                  Save Hero Section
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: TRUST MARQUEE */}
          {tab === "Trust Bar" && (
            <div className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6 shadow-sm">
              <h2 className="font-display text-2xl text-ink">Trust Bar & Marquee</h2>
              <p className="text-xs text-ink/50">Edit scrolling words and key values</p>

              <div className="mt-6 space-y-5">
                <div>
                  <label className={labelCls}>Marquee Row 1 (Comma-separated)</label>
                  <textarea
                    className={cn(inputCls, "min-h-[4rem]")}
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
                    className={cn(inputCls, "min-h-[4rem]")}
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

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => saveOverrides(ov)}
                  className="rounded-full bg-coal px-8 py-3 text-xs font-bold uppercase tracking-wider text-ivory hover:bg-gold-deep"
                >
                  Save Trust Bar
                </button>
              </div>
            </div>
          )}

          {/* TAB 7: MANIFESTO */}
          {tab === "Manifesto" && (
            <div className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6 shadow-sm">
              <h2 className="font-display text-2xl text-ink">The Studio Manifesto</h2>
              <p className="text-xs text-ink/50">Brand story, body text, and feature image</p>

              <div className="mt-6 space-y-4">
                <div>
                  <label className={labelCls}>Eyebrow</label>
                  <input
                    className={inputCls}
                    value={manifesto.eyebrow}
                    onChange={(e) => setOv({ ...ov, manifesto: { ...ov.manifesto, eyebrow: e.target.value } })}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
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
                    <label className={labelCls}>Title Part 2 (Gold Accent)</label>
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
                    className={cn(inputCls, "min-h-[5rem]")}
                    value={manifesto.body}
                    onChange={(e) => setOv({ ...ov, manifesto: { ...ov.manifesto, body: e.target.value } })}
                  />
                </div>

                <ImageUploadField
                  label="Manifesto Story Photo"
                  value={manifesto.image}
                  onChange={(val) => setOv({ ...ov, manifesto: { ...ov.manifesto, image: val } })}
                />
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => saveOverrides(ov)}
                  className="rounded-full bg-coal px-8 py-3 text-xs font-bold uppercase tracking-wider text-ivory hover:bg-gold-deep"
                >
                  Save Manifesto
                </button>
              </div>
            </div>
          )}

          {/* TAB 8: PRODUCTS CATALOG */}
          {tab === "Products" && (
            <div className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-4">
                <div>
                  <h2 className="font-display text-2xl text-ink">Products Catalog</h2>
                  <p className="text-xs text-ink/50">Edit names, tags, specs, pricing, and upload product photos</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newProd: Product = {
                      slug: "new-craft-" + Date.now(),
                      name: "New Product",
                      tag: "Custom",
                      description: "High-grade custom apparel accessories.",
                      image: "/photos/rs-092-02.jpg",
                      detail: "Custom materials and sizing.",
                      from: "0.10",
                      guessedPrice: false,
                    };
                    const updated = [...products, newProd];
                    setOv({ ...ov, products: updated });
                  }}
                  className="rounded-full bg-coal px-4 py-2 text-xs font-semibold text-ivory hover:bg-gold-deep"
                >
                  + Add New Product
                </button>
              </div>

              <div className="mt-6 space-y-6">
                {products.map((p, idx) => (
                  <div key={p.slug} className="rounded-2xl border border-ink/15 bg-amber-50/20 p-4 sm:p-5">
                    <div className="flex items-center justify-between border-b border-ink/10 pb-3">
                      <span className="font-display text-lg font-bold text-ink">
                        #{idx + 1} {p.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete product "${p.name}"?`)) {
                            const filtered = products.filter((_, i) => i !== idx);
                            setOv({ ...ov, products: filtered });
                          }
                        }}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Remove Product
                      </button>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div>
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
                      <div className="sm:col-span-2">
                        <label className={labelCls}>Description</label>
                        <textarea
                          className={cn(inputCls, "min-h-[3.5rem]")}
                          value={p.description}
                          onChange={(e) => {
                            const updated = [...products];
                            updated[idx] = { ...p, description: e.target.value };
                            setOv({ ...ov, products: updated });
                          }}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelCls}>Craft Specifications</label>
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
                      <div>
                        <label className={labelCls}>Guide Price From ($ / piece)</label>
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
                    </div>

                    <div className="mt-4">
                      <ImageUploadField
                        label={`Upload Photo for ${p.name}`}
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

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => saveOverrides(ov)}
                  className="rounded-full bg-coal px-8 py-3 text-xs font-bold uppercase tracking-wider text-ivory hover:bg-gold-deep"
                >
                  Save All Products
                </button>
              </div>
            </div>
          )}

          {/* TAB 9: PHILOSOPHY */}
          {tab === "Philosophy" && (
            <div className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6 shadow-sm">
              <h2 className="font-display text-2xl text-ink">The Craft Philosophy</h2>
              <p className="text-xs text-ink/50">Visual quote banner and typography</p>

              <div className="mt-6 space-y-4">
                <div>
                  <label className={labelCls}>Eyebrow</label>
                  <input
                    className={inputCls}
                    value={philosophy.eyebrow}
                    onChange={(e) =>
                      setOv({ ...ov, philosophy: { ...philosophy, eyebrow: e.target.value } })
                    }
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>Heading Line 1</label>
                    <input
                      className={inputCls}
                      value={philosophy.heading1}
                      onChange={(e) =>
                        setOv({ ...ov, philosophy: { ...philosophy, heading1: e.target.value } })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Heading Line 2 (Gold)</label>
                    <input
                      className={inputCls}
                      value={philosophy.heading2}
                      onChange={(e) =>
                        setOv({ ...ov, philosophy: { ...philosophy, heading2: e.target.value } })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Body Paragraph</label>
                  <textarea
                    className={cn(inputCls, "min-h-[5rem]")}
                    value={philosophy.body}
                    onChange={(e) =>
                      setOv({ ...ov, philosophy: { ...philosophy, body: e.target.value } })
                    }
                  />
                </div>

                <ImageUploadField
                  label="Philosophy Background Photo"
                  value={philosophy.image}
                  onChange={(val) =>
                    setOv({ ...ov, philosophy: { ...philosophy, image: val } })
                  }
                />
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => saveOverrides(ov)}
                  className="rounded-full bg-coal px-8 py-3 text-xs font-bold uppercase tracking-wider text-ivory hover:bg-gold-deep"
                >
                  Save Philosophy
                </button>
              </div>
            </div>
          )}

          {/* TAB 10: PROCESS STEPS */}
          {tab === "Process Steps" && (
            <div className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6 shadow-sm">
              <h2 className="font-display text-2xl text-ink">Craft Process Steps</h2>
              <p className="text-xs text-ink/50">Step-by-step production timeline</p>

              <div className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>Section Eyebrow</label>
                    <input
                      className={inputCls}
                      value={processEyebrow}
                      onChange={(e) =>
                        setOv({
                          ...ov,
                          atelierProcess: { ...ov.atelierProcess, eyebrow: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Section Title</label>
                    <input
                      className={inputCls}
                      value={processTitle}
                      onChange={(e) =>
                        setOv({
                          ...ov,
                          atelierProcess: { ...ov.atelierProcess, title: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {processSteps.map((s, idx) => (
                    <div key={s.n} className="rounded-xl border border-ink/10 bg-amber-50/20 p-4">
                      <div className="grid gap-3 sm:grid-cols-4">
                        <div>
                          <label className={labelCls}>Step #</label>
                          <input
                            className={inputCls}
                            value={s.n}
                            onChange={(e) => {
                              const updated = [...processSteps];
                              updated[idx] = { ...s, n: e.target.value };
                              setOv({
                                ...ov,
                                atelierProcess: { ...ov.atelierProcess, steps: updated },
                              });
                            }}
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <label className={labelCls}>Step Title</label>
                          <input
                            className={inputCls}
                            value={s.title}
                            onChange={(e) => {
                              const updated = [...processSteps];
                              updated[idx] = { ...s, title: e.target.value };
                              setOv({
                                ...ov,
                                atelierProcess: { ...ov.atelierProcess, steps: updated },
                              });
                            }}
                          />
                        </div>
                        <div className="sm:col-span-4">
                          <label className={labelCls}>Description</label>
                          <textarea
                            className={cn(inputCls, "min-h-[3rem]")}
                            value={s.body}
                            onChange={(e) => {
                              const updated = [...processSteps];
                              updated[idx] = { ...s, body: e.target.value };
                              setOv({
                                ...ov,
                                atelierProcess: { ...ov.atelierProcess, steps: updated },
                              });
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
                  onChange={(val) =>
                    setOv({
                      ...ov,
                      atelierProcess: { ...ov.atelierProcess, image: val },
                    })
                  }
                />
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => saveOverrides(ov)}
                  className="rounded-full bg-coal px-8 py-3 text-xs font-bold uppercase tracking-wider text-ivory hover:bg-gold-deep"
                >
                  Save Process Steps
                </button>
              </div>
            </div>
          )}

          {/* TAB 11: SHOWROOM GALLERY */}
          {tab === "Showroom Gallery" && (
            <div className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-4">
                <div>
                  <h2 className="font-display text-2xl text-ink">Showroom Gallery</h2>
                  <p className="text-xs text-ink/50">Upload new gallery images with automatic compression and tags</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newItem = {
                      src: "/photos/rs-092-02.jpg",
                      tag: "Woven labels",
                      tall: false,
                    };
                    setOv({ ...ov, gallery: [newItem, ...gallery] });
                  }}
                  className="rounded-full bg-coal px-4 py-2 text-xs font-semibold text-ivory hover:bg-gold-deep"
                >
                  + Add Gallery Photo
                </button>
              </div>

              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {gallery.map((g, idx) => (
                  <div key={idx} className="rounded-xl border border-ink/15 bg-amber-50/20 p-4">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-ink/10 bg-white">
                      <Image
                        src={g.src}
                        alt={g.tag}
                        fill
                        className="object-cover"
                        unoptimized={g.src.startsWith("data:")}
                      />
                    </div>

                    <div className="mt-3">
                      <label className={labelCls}>Category Tag</label>
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

                    <div className="mt-3">
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

                    <div className="mt-3 flex items-center justify-between">
                      <label className="flex items-center gap-2 text-xs text-ink/70">
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
                          setOv({ ...ov, gallery: filtered });
                        }}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => saveOverrides(ov)}
                  className="rounded-full bg-coal px-8 py-3 text-xs font-bold uppercase tracking-wider text-ivory hover:bg-gold-deep"
                >
                  Save Gallery
                </button>
              </div>
            </div>
          )}

          {/* TAB 12: REVIEWS */}
          {tab === "Reviews" && (
            <div className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-ink/10 pb-4">
                <div>
                  <h2 className="font-display text-2xl text-ink">Client Reviews</h2>
                  <p className="text-xs text-ink/50">Manage 5-star testimonials shown on the website</p>
                </div>
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
                    setOv({ ...ov, testimonials: [...testimonialList, newTest] });
                  }}
                  className="rounded-full bg-coal px-4 py-2 text-xs font-semibold text-ivory hover:bg-gold-deep"
                >
                  + Add Review
                </button>
              </div>

              <div className="mt-6 space-y-4">
                {testimonialList.map((t, idx) => (
                  <div key={idx} className="rounded-xl border border-ink/10 bg-amber-50/20 p-4">
                    <div className="flex justify-between">
                      <span className="font-semibold text-sm text-ink">Review #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const filtered = testimonialList.filter((_, i) => i !== idx);
                          setOv({ ...ov, testimonials: filtered });
                        }}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="mt-3 space-y-3">
                      <div>
                        <label className={labelCls}>Quote</label>
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
                      <div className="grid gap-3 sm:grid-cols-3">
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
                        <div>
                          <label className={labelCls}>Role / Brand Type</label>
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
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => saveOverrides(ov)}
                  className="rounded-full bg-coal px-8 py-3 text-xs font-bold uppercase tracking-wider text-ivory hover:bg-gold-deep"
                >
                  Save Reviews
                </button>
              </div>
            </div>
          )}

          {/* TAB 13: FAQS */}
          {tab === "FAQs" && (
            <div className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-ink/10 pb-4">
                <div>
                  <h2 className="font-display text-2xl text-ink">Frequently Asked Questions</h2>
                  <p className="text-xs text-ink/50">Add, edit, or remove accordion FAQ items</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newFaq: Faq = {
                      q: "What is the delivery timeline?",
                      a: "Digital proofs arrive in 24 hours. Production takes 7-10 working days plus tracked courier dispatch.",
                      guessed: false,
                    };
                    setOv({ ...ov, faqs: [...faqList, newFaq] });
                  }}
                  className="rounded-full bg-coal px-4 py-2 text-xs font-semibold text-ivory hover:bg-gold-deep"
                >
                  + Add FAQ
                </button>
              </div>

              <div className="mt-6 space-y-4">
                {faqList.map((f, idx) => (
                  <div key={idx} className="rounded-xl border border-ink/10 bg-amber-50/20 p-4">
                    <div className="flex justify-between">
                      <span className="font-semibold text-sm text-ink">Question #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const filtered = faqList.filter((_, i) => i !== idx);
                          setOv({ ...ov, faqs: filtered });
                        }}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="mt-3 space-y-3">
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
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => saveOverrides(ov)}
                  className="rounded-full bg-coal px-8 py-3 text-xs font-bold uppercase tracking-wider text-ivory hover:bg-gold-deep"
                >
                  Save FAQs
                </button>
              </div>
            </div>
          )}

          {/* TAB 14: FOOTER */}
          {tab === "Footer" && (
            <div className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6 shadow-sm">
              <h2 className="font-display text-2xl text-ink">Footer Section</h2>
              <p className="text-xs text-ink/50">Bottom call-to-action headlines and notes</p>

              <div className="mt-6 space-y-4">
                <div>
                  <label className={labelCls}>Big Footer Heading</label>
                  <input
                    className={inputCls}
                    value={footer.big}
                    onChange={(e) => setOv({ ...ov, footer: { ...ov.footer, big: e.target.value } })}
                  />
                </div>
                <div>
                  <label className={labelCls}>Top Note / Eyebrow</label>
                  <input
                    className={inputCls}
                    value={footer.note}
                    onChange={(e) => setOv({ ...ov, footer: { ...ov.footer, note: e.target.value } })}
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => saveOverrides(ov)}
                  className="rounded-full bg-coal px-8 py-3 text-xs font-bold uppercase tracking-wider text-ivory hover:bg-gold-deep"
                >
                  Save Footer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Sticky Save Button Bar on Mobile */}
      {tab !== "Live Analytics" && tab !== "Enquiries" && (
        <div className="fixed bottom-0 inset-x-0 z-40 border-t border-ink/10 bg-white/95 p-3.5 shadow-2xl backdrop-blur-md md:hidden flex items-center justify-between gap-3">
          <div className="text-[11px] text-ink/60">
            {busy ? "Saving updates..." : "Unsaved changes apply instantly"}
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={() => saveOverrides(ov)}
            className="rounded-full bg-gold px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-ink shadow-md active:scale-95 transition-transform"
          >
            {busy ? "Saving..." : "Save Now ✓"}
          </button>
        </div>
      )}

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-20 sm:bottom-8 left-1/2 z-[300] -translate-x-1/2 rounded-full bg-coal px-6 py-3 text-xs font-semibold text-ivory shadow-2xl flex items-center gap-2 border border-gold/40"
          >
            <span className="text-gold">✓</span> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
