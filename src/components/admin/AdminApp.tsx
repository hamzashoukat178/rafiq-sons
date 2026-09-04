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

type Data = {
  ok: boolean;
  db: boolean;
  leads: Lead[];
  orders: unknown[];
  overrides: Overrides;
};

const tabs = [
  "Enquiries",
  "Contact & Info",
  "Hero Section",
  "Trust Bar",
  "Manifesto",
  "Products",
  "Philosophy",
  "Process Steps",
  "Showroom Gallery",
  "Reviews",
  "FAQs",
  "Footer",
] as const;

type Tab = (typeof tabs)[number];

const inputCls =
  "w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-gold-deep focus:ring-1 focus:ring-gold-deep";
const labelCls = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink/60";

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
    <div className="rounded-xl border border-dashed border-ink/20 bg-amber-50/40 p-4 transition-colors hover:border-gold-deep">
      <span className={labelCls}>{label}</span>

      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {value && (
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-ink/15 bg-white shadow-sm">
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
              className="inline-flex items-center gap-2 rounded-lg bg-coal px-4 py-2 text-xs font-semibold text-ivory transition-transform hover:scale-[1.02] disabled:opacity-50"
            >
              {compressing ? "Compressing WebP..." : "Choose Image (Auto-Compress)"}
            </button>
            <p className="mt-1 text-[11px] text-ink/50">
              Large images are auto-compressed to modern WebP for high performance.
            </p>
          </div>
        </div>

        {stats && (
          <div className="rounded-lg bg-emerald-100/80 px-3 py-1.5 text-xs text-emerald-800">
            Compressed: {stats.orig} ➔ <strong>{stats.comp}</strong> ({stats.savings}% saved!)
          </div>
        )}
      </div>

      <div className="mt-3">
        <input
          type="text"
          className={cn(inputCls, "!py-2 text-xs text-ink/70")}
          placeholder="Or enter existing path (e.g. /photos/rs-092-02.jpg)"
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
  const [tab, setTab] = useState<Tab>("Enquiries");
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

  useEffect(() => {
    load();
  }, [load]);

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

  const saveOverrides = async (next: Overrides, msg = "Saved! All changes are live on the website.") => {
    setOv(next);
    if (await post({ action: "save-overrides", overrides: next })) say(msg);
    else say("Could not save. Check database configuration.");
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
  const site = { ...defaultSite, ...(ov.site ?? {}), ...(ov.contact ?? {}) };
  const hero = { ...defaultHero, ...(ov.hero ?? {}) };
  const manifesto = { ...defaultManifesto, ...(ov.manifesto ?? {}) };
  const products = ov.products?.length ? ov.products : defaultProducts;
  const philosophy = { ...defaultContent.philosophy, ...(ov.philosophy ?? {}) };
  const processSteps = ov.atelierProcess?.steps?.length ? ov.atelierProcess.steps : defaultProcess.steps;
  const processImage = ov.atelierProcess?.image || defaultProcess.image;
  const processEyebrow = ov.atelierProcess?.eyebrow || defaultProcess.eyebrow;
  const processTitle = ov.atelierProcess?.title || defaultProcess.title;
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
        Loading Rafiq Sons Admin Studio...
      </div>
    );
  }

  if (state === "login") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink px-5">
        <motion.form
          onSubmit={login}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-dark w-full max-w-md rounded-3xl border border-ivory/15 p-8 shadow-2xl"
        >
          <div className="text-center">
            <Image
              src="/brand/logo-wide-light.png"
              alt="Rafiq Sons Labels"
              width={160}
              height={50}
              className="mx-auto h-12 w-auto"
            />
            <p className="eyebrow mt-4 text-gold">Management Atelier</p>
            <h1 className="font-display mt-2 text-2xl text-ivory">Admin Sign In</h1>
          </div>

          <div className="mt-8">
            <label className="text-xs uppercase tracking-wider text-ivory/60">Admin Password</label>
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
            className="btn-sheen mt-6 w-full rounded-full bg-gold py-3.5 text-xs font-bold uppercase tracking-wider text-ink"
          >
            Access Studio
          </button>
        </motion.form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f4] text-ink">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-50 border-b border-ink/10 bg-white/90 px-6 py-4 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/brand/logo-wide.png"
              alt="Rafiq Sons Labels"
              width={140}
              height={42}
              className="h-8 w-auto"
            />
            <span className="hidden rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold text-amber-900 sm:inline-block">
              Content CMS & Auto-Compressor
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-ink/20 px-4 py-2 text-xs font-semibold text-ink transition-colors hover:bg-ink hover:text-ivory"
            >
              View Live Website ↗
            </a>
            <button
              onClick={logout}
              className="rounded-full bg-ink/10 px-4 py-2 text-xs font-semibold text-ink transition-colors hover:bg-red-50 hover:text-red-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        {/* Navigation Tabs with Smooth Horizontal Swipe, Drag, and Arrows */}
        <AdminTabsNav
          tabs={tabs}
          activeTab={tab}
          onSelectTab={(t) => setTab(t)}
          newCount={newCount}
        />

        {/* Tab Content Panels */}
        <div className="mt-4">
          {/* TAB 1: ENQUIRIES / LEADS */}
          {tab === "Enquiries" && (
            <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-ink/10 pb-4">
                <div>
                  <h2 className="font-display text-2xl text-ink">Customer Enquiries</h2>
                  <p className="text-xs text-ink/50">Quote requests submitted through the website</p>
                </div>
                <button
                  onClick={load}
                  className="rounded-lg border border-ink/20 px-3 py-1.5 text-xs font-medium hover:bg-ink/5"
                >
                  Refresh
                </button>
              </div>

              {leads.length === 0 ? (
                <div className="py-16 text-center text-sm text-ink/45">No enquiries yet.</div>
              ) : (
                <div className="mt-6 divide-y divide-ink/10">
                  {leads.map((l) => (
                    <div key={l.id} className="py-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase",
                              l.status === "new" ? "bg-amber-100 text-amber-900" : "bg-emerald-100 text-emerald-900"
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
                              if (confirm("Delete this enquiry?")) {
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

                      <div className="mt-3 grid gap-2 rounded-xl bg-amber-50/40 p-4 text-xs sm:grid-cols-3">
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

          {/* TAB 2: CONTACT & COMPANY INFO */}
          {tab === "Contact & Info" && (
            <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
              <h2 className="font-display text-2xl text-ink">Company & Contact Details</h2>
              <p className="text-xs text-ink/50">Update company numbers, Instagram, location and information</p>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
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
                  <label className={labelCls}>Phone (Display Format)</label>
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
                  <label className={labelCls}>Instagram Link</label>
                  <input
                    className={inputCls}
                    value={site.instagram}
                    onChange={(e) => setOv({ ...ov, contact: { ...ov.contact, instagram: e.target.value } })}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Location & Delivery Note</label>
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

          {/* TAB 3: HERO SECTION */}
          {tab === "Hero Section" && (
            <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
              <h2 className="font-display text-2xl text-ink">Hero Section Header</h2>
              <p className="text-xs text-ink/50">Top banner headlines, subtitle, video, and CTA buttons</p>

              <div className="mt-6 space-y-5">
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
                    className={cn(inputCls, "min-h-[5rem] resize-none")}
                    value={hero.sub}
                    onChange={(e) => setOv({ ...ov, hero: { ...ov.hero, sub: e.target.value } })}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>Primary CTA Button Text</label>
                    <input
                      className={inputCls}
                      value={hero.ctaPrimary}
                      onChange={(e) => setOv({ ...ov, hero: { ...ov.hero, ctaPrimary: e.target.value } })}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Secondary CTA Button Text</label>
                    <input
                      className={inputCls}
                      value={hero.ctaSecondary}
                      onChange={(e) => setOv({ ...ov, hero: { ...ov.hero, ctaSecondary: e.target.value } })}
                    />
                  </div>
                </div>

                <ImageUploadField
                  label="Hero Poster / Fallback Image (Auto-Compressed)"
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

          {/* TAB 4: TRUST BAR & MARQUEE */}
          {tab === "Trust Bar" && (
            <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
              <h2 className="font-display text-2xl text-ink">Trust Bar & Value Pillars</h2>
              <p className="text-xs text-ink/50">Edit continuous marquee keywords and values</p>

              <div className="mt-6 space-y-6">
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

          {/* TAB 5: MANIFESTO / STORY */}
          {tab === "Manifesto" && (
            <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
              <h2 className="font-display text-2xl text-ink">The Studio Manifesto</h2>
              <p className="text-xs text-ink/50">Why the label matters story, body text, and feature image</p>

              <div className="mt-6 space-y-5">
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
                    <label className={labelCls}>Big Title Part 1</label>
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
                    <label className={labelCls}>Big Title Part 2 (Gold Accent)</label>
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
                  label="Manifesto Story Photo (Auto-Compressed)"
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

          {/* TAB 6: PRODUCTS & COLLECTIONS */}
          {tab === "Products" && (
            <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-4">
                <div>
                  <h2 className="font-display text-2xl text-ink">Products & Collections</h2>
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

              <div className="mt-6 space-y-8">
                {products.map((p, idx) => (
                  <div key={p.slug} className="rounded-2xl border border-ink/15 bg-amber-50/20 p-5">
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
                        <label className={labelCls}>Craft Specifications Detail</label>
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

          {/* TAB 7: THE ATELIER PHILOSOPHY */}
          {tab === "Philosophy" && (
            <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
              <h2 className="font-display text-2xl text-ink">The Philosophy Section</h2>
              <p className="text-xs text-ink/50">Parallax visual quote banner and gold typography</p>

              <div className="mt-6 space-y-5">
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
                    <label className={labelCls}>Heading Line 2 (Gold Gradient)</label>
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
                  label="Philosophy Background Photo (Auto-Compressed)"
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

          {/* TAB 8: PROCESS STEPS */}
          {tab === "Process Steps" && (
            <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
              <h2 className="font-display text-2xl text-ink">Craft Process Steps</h2>
              <p className="text-xs text-ink/50">Step-by-step production timeline on the Atelier section</p>

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
                  label="Process Ambient Background Photo"
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

          {/* TAB 9: SHOWROOM GALLERY */}
          {tab === "Showroom Gallery" && (
            <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-4">
                <div>
                  <h2 className="font-display text-2xl text-ink">Showroom Gallery</h2>
                  <p className="text-xs text-ink/50">Upload new gallery images (auto-compressed) and set category tags</p>
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
                        label="Change Photo (Auto-Compress)"
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
                        Tall Masonry Format
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

          {/* TAB 10: REVIEWS / TESTIMONIALS */}
          {tab === "Reviews" && (
            <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
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

          {/* TAB 11: FAQS */}
          {tab === "FAQs" && (
            <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-ink/10 pb-4">
                <div>
                  <h2 className="font-display text-2xl text-ink">Frequently Asked Questions</h2>
                  <p className="text-xs text-ink/50">Add, edit, or delete accordion FAQ items</p>
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

          {/* TAB 12: FOOTER */}
          {tab === "Footer" && (
            <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
              <h2 className="font-display text-2xl text-ink">Footer Section</h2>
              <p className="text-xs text-ink/50">Bottom call-to-action headlines and notes</p>

              <div className="mt-6 space-y-5">
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

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-8 left-1/2 z-[300] -translate-x-1/2 rounded-full bg-coal px-6 py-3 text-xs font-semibold text-ivory shadow-2xl"
          >
            ✓ {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
