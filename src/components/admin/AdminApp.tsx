"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { products as defaultProducts, hero as defaultHero, site as defaultSite, testimonials as defaultTestimonials, faqs as defaultFaqs, type Product, type Testimonial, type Faq } from "@/content/site";
import { cn } from "@/lib/utils";

type Lead = {
  id: number; type: string; name: string | null; email: string | null; phone: string | null;
  product: string | null; quantity: string | null; message: string | null;
  meta: { brand?: string; contact?: string } | null; status: string; created_at: string;
};

type Overrides = {
  hero?: Partial<typeof defaultHero>;
  contact?: { phoneDisplay?: string; whatsapp?: string; email?: string; location?: string; emailGuessed?: boolean };
  products?: Product[];
  testimonials?: Testimonial[];
  faqs?: Faq[];
};

type Data = { ok: boolean; db: boolean; leads: Lead[]; orders: unknown[]; overrides: Overrides };

const tabs = ["Enquiries", "Products", "Homepage text", "Reviews", "FAQs"] as const;
type Tab = (typeof tabs)[number];

const input = "w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-gold-deep";
const label = "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/50";

function Guessed({ show, onConfirm }: { show?: boolean; onConfirm?: () => void }) {
  if (!show) return null;
  return (
    <span className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
      Guessed, please confirm
      {onConfirm && (
        <button type="button" onClick={onConfirm} className="underline underline-offset-2">Confirm</button>
      )}
    </span>
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
    if (res.status === 401) { setState("login"); return; }
    const d: Data = await res.json();
    setData(d);
    setOv(d.overrides ?? {});
    setState("ready");
  }, []);

  useEffect(() => { load(); }, [load]);

  const say = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2600); };

  const post = async (payload: Record<string, unknown>) => {
    setBusy(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return res.ok;
    } finally { setBusy(false); }
  };

  const saveOverrides = async (next: Overrides, msg = "Saved. Your website is updated.") => {
    setOv(next);
    if (await post({ action: "save-overrides", overrides: next })) say(msg);
    else say("Could not save. Check the database connection.");
  };

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "login", password }),
    });
    if (res.ok) { setLoginError(""); load(); }
    else setLoginError("That password did not match. Try again.");
  };

  const logout = async () => {
    await post({ action: "logout" });
    setState("login");
  };

  const products = ov.products?.length ? ov.products : defaultProducts;
  const testimonialList = ov.testimonials?.length ? ov.testimonials : defaultTestimonials;
  const faqList = ov.faqs?.length ? ov.faqs : defaultFaqs;
  const hero = { ...defaultHero, ...(ov.hero ?? {}) };
  const contact = { phoneDisplay: defaultSite.phoneDisplay, whatsapp: defaultSite.whatsapp, email: defaultSite.email, location: defaultSite.location, emailGuessed: defaultSite.emailGuessed, ...(ov.contact ?? {}) };

  const leads = useMemo(() => data?.leads ?? [], [data]);
  const newCount = useMemo(() => leads.filter((l) => l.status === "new").length, [leads]);

  if (state === "loading") {
    return <div className="flex min-h-screen items-center justify-center bg-ivory font-display text-2xl italic text-ink/60">Opening the studio...</div>;
  }

  if (state === "login") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink px-5">
        <motion.form
          onSubmit={login}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm rounded-2xl border border-ivory/10 bg-coal p-8"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-wide-light.png" alt="Rafiq Sons" className="h-12 w-auto" />
          <h1 className="mt-5 font-display text-3xl text-ivory">Studio admin</h1>
          <p className="mt-2 text-sm text-ivory/50">Enter your admin password to manage the website. No code needed.</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="mt-6 w-full rounded-lg border border-ivory/15 bg-ink px-4 py-3 text-ivory outline-none focus:border-gold"
            autoFocus
          />
          {loginError && <p className="mt-3 text-sm text-red-400">{loginError}</p>}
          <button className="btn-sheen mt-6 w-full rounded-full bg-gold py-3.5 text-sm font-semibold text-ink">Sign in</button>
        </motion.form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory text-ink">
      {/* header */}
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-ivory/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo-wide.png" alt="Rafiq Sons" className="h-8 w-auto" />
            <div className="border-l border-ink/15 pl-3">
              <p className="font-display text-lg leading-none">Studio admin</p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-ink/45">Rafiq Sons Labels</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {newCount > 0 && (
              <span className="rounded-full bg-gold px-3 py-1.5 text-[11px] font-bold text-ink">{newCount} new enquiry{newCount > 1 ? "s" : ""}</span>
            )}
            <a href="/" target="_blank" className="rounded-full border border-ink/15 px-4 py-2 text-xs font-semibold hover:border-gold-deep hover:text-gold-deep">View website</a>
            <button onClick={logout} className="rounded-full border border-ink/15 px-4 py-2 text-xs font-semibold hover:border-red-400 hover:text-red-500">Log out</button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-5 pb-3">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-semibold transition-colors",
                tab === t ? "bg-ink text-ivory" : "text-ink/55 hover:bg-ink/5 hover:text-ink"
              )}
            >
              {t}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
            {tab === "Enquiries" && (
              <section>
                <h2 className="font-display text-3xl">Enquiries and quote requests</h2>
                <p className="mt-2 text-sm text-ink/50">Every form submission from the website lands here. Newest first.</p>
                {leads.length === 0 ? (
                  <div className="mt-8 rounded-2xl border border-dashed border-ink/20 p-12 text-center text-ink/45">
                    No enquiries yet. Share your website and they will appear here within seconds.
                  </div>
                ) : (
                  <div className="mt-8 overflow-hidden rounded-2xl border border-ink/10 bg-white">
                    {leads.map((l, i) => (
                      <div key={l.id} className={cn("grid gap-3 p-5 sm:grid-cols-[110px_1fr_auto] sm:gap-6", i > 0 && "border-t border-ink/8")}>
                        <div>
                          <span className={cn("inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide", l.type === "quote" ? "bg-gold/20 text-gold-deep" : "bg-ink/8 text-ink/60")}>{l.type}</span>
                          <p className="mt-2 text-[11px] text-ink/40">{new Date(l.created_at).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="font-semibold">{l.name} {l.meta?.brand ? <span className="font-normal text-ink/50">({l.meta.brand})</span> : null}</p>
                          <p className="mt-0.5 text-sm text-ink/60">{l.email || l.phone || l.meta?.contact || "-"}</p>
                          {(l.product || l.quantity) && (
                            <p className="mt-1 text-sm"><span className="font-medium text-gold-deep">{l.product}</span> {l.quantity ? `· ${l.quantity}` : ""}</p>
                          )}
                          {l.message && <p className="mt-2 rounded-lg bg-ivory p-3 text-sm text-ink/70">{l.message}</p>}
                        </div>
                        <div className="flex items-start gap-2">
                          <select
                            value={l.status}
                            onChange={async (e) => {
                              await post({ action: "lead-status", id: l.id, status: e.target.value });
                              load();
                            }}
                            className="rounded-lg border border-ink/15 bg-white px-2.5 py-2 text-xs font-semibold"
                          >
                            {["new", "replied", "quoted", "won", "lost"].map((s) => <option key={s}>{s}</option>)}
                          </select>
                          <button
                            onClick={async () => { if (confirm("Delete this enquiry?")) { await post({ action: "delete-lead", id: l.id }); load(); } }}
                            className="rounded-lg border border-ink/15 px-2.5 py-2 text-xs text-ink/40 hover:border-red-400 hover:text-red-500"
                            aria-label="Delete enquiry"
                          >✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {tab === "Products" && (
              <section>
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <h2 className="font-display text-3xl">Products and guide prices</h2>
                    <p className="mt-2 text-sm text-ink/50">Edit names, descriptions and prices. Amber badges mark values I guessed. Confirm or replace them.</p>
                  </div>
                  <button
                    disabled={busy}
                    onClick={() => saveOverrides({ ...ov, products })}
                    className="btn-sheen rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ivory disabled:opacity-50"
                  >
                    Save all products
                  </button>
                </div>
                <div className="mt-8 grid gap-5">
                  {products.map((p, i) => (
                    <div key={p.slug} className="grid gap-4 rounded-2xl border border-ink/10 bg-white p-5 sm:grid-cols-[96px_1fr]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image} alt={p.name} className="h-24 w-24 rounded-xl object-cover" />
                      <div className="grid gap-3">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <span className={label}>Name</span>
                            <input className={input} value={p.name} onChange={(e) => setOv({ ...ov, products: products.map((x, j) => j === i ? { ...x, name: e.target.value } : x) })} />
                          </div>
                          <div>
                            <span className={label}>Style note</span>
                            <input className={input} value={p.tag} onChange={(e) => setOv({ ...ov, products: products.map((x, j) => j === i ? { ...x, tag: e.target.value } : x) })} />
                          </div>
                        </div>
                        <div>
                          <span className={label}>Short description</span>
                          <textarea className={cn(input, "min-h-[4.5rem]")} value={p.description} onChange={(e) => setOv({ ...ov, products: products.map((x, j) => j === i ? { ...x, description: e.target.value } : x) })} />
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <span className={label}>Details line</span>
                            <input className={input} value={p.detail} onChange={(e) => setOv({ ...ov, products: products.map((x, j) => j === i ? { ...x, detail: e.target.value } : x) })} />
                          </div>
                          <div>
                            <span className={label}>
                              Guide price from, US$ per piece
                              <Guessed show={p.guessedPrice} onConfirm={() => setOv({ ...ov, products: products.map((x, j) => j === i ? { ...x, guessedPrice: false } : x) })} />
                            </span>
                            <input
                              className={input}
                              value={p.from ?? ""}
                              placeholder="Leave empty to hide price"
                              onChange={(e) => setOv({ ...ov, products: products.map((x, j) => j === i ? { ...x, from: e.target.value, guessedPrice: false } : x) })}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {tab === "Homepage text" && (
              <section>
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <h2 className="font-display text-3xl">Homepage text and contact details</h2>
                    <p className="mt-2 text-sm text-ink/50">The big headline and your contact information. Saved changes appear on the website right away.</p>
                  </div>
                  <button
                    disabled={busy}
                    onClick={() => saveOverrides({ ...ov, hero: { eyebrow: hero.eyebrow, line1: hero.line1, line2: hero.line2, sub: hero.sub }, contact })}
                    className="btn-sheen rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ivory disabled:opacity-50"
                  >
                    Save text
                  </button>
                </div>
                <div className="mt-8 grid gap-4 rounded-2xl border border-ink/10 bg-white p-6">
                  <div>
                    <span className={label}>Small line above the headline</span>
                    <input className={input} value={hero.eyebrow} onChange={(e) => setOv({ ...ov, hero: { ...ov.hero, eyebrow: e.target.value } })} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <span className={label}>Headline, first line</span>
                      <input className={input} value={hero.line1} onChange={(e) => setOv({ ...ov, hero: { ...ov.hero, line1: e.target.value } })} />
                    </div>
                    <div>
                      <span className={label}>Headline, second line (gold)</span>
                      <input className={input} value={hero.line2} onChange={(e) => setOv({ ...ov, hero: { ...ov.hero, line2: e.target.value } })} />
                    </div>
                  </div>
                  <div>
                    <span className={label}>Paragraph under the headline</span>
                    <textarea className={cn(input, "min-h-[5rem]")} value={hero.sub} onChange={(e) => setOv({ ...ov, hero: { ...ov.hero, sub: e.target.value } })} />
                  </div>
                </div>

                <div className="mt-6 grid gap-4 rounded-2xl border border-ink/10 bg-white p-6 sm:grid-cols-2">
                  <div>
                    <span className={label}>WhatsApp display number</span>
                    <input className={input} value={contact.phoneDisplay ?? ""} onChange={(e) => setOv({ ...ov, contact: { ...contact, phoneDisplay: e.target.value } })} />
                  </div>
                  <div>
                    <span className={label}>WhatsApp link</span>
                    <input className={input} value={contact.whatsapp ?? ""} onChange={(e) => setOv({ ...ov, contact: { ...contact, whatsapp: e.target.value } })} />
                  </div>
                  <div>
                    <span className={label}>
                      Email address
                      <Guessed show={contact.emailGuessed} />
                    </span>
                    <input className={input} value={contact.email ?? ""} onChange={(e) => setOv({ ...ov, contact: { ...contact, email: e.target.value, emailGuessed: false } })} />
                    <p className="mt-1.5 text-xs text-ink/45">This email was guessed. Please type your real email so customers reach you.</p>
                  </div>
                  <div>
                    <span className={label}>Location line</span>
                    <input className={input} value={contact.location ?? ""} onChange={(e) => setOv({ ...ov, contact: { ...contact, location: e.target.value } })} />
                  </div>
                </div>
              </section>
            )}

            {tab === "Reviews" && (
              <section>
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <h2 className="font-display text-3xl">Customer reviews</h2>
                    <p className="mt-2 max-w-xl text-sm text-ink/50">
                      The current reviews are <strong>samples I wrote for layout</strong>. Replace each with a real customer quote, then save.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setOv({ ...ov, testimonials: [...testimonialList, { quote: "", name: "", role: "", city: "" }] })}
                      className="rounded-full border border-ink/20 px-5 py-3 text-sm font-semibold hover:border-gold-deep hover:text-gold-deep"
                    >
                      + Add review
                    </button>
                    <button disabled={busy} onClick={() => saveOverrides({ ...ov, testimonials: testimonialList })} className="btn-sheen rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ivory disabled:opacity-50">Save reviews</button>
                  </div>
                </div>
                <div className="mt-8 grid gap-5">
                  {testimonialList.map((t, i) => (
                    <div key={i} className="rounded-2xl border border-ink/10 bg-white p-5">
                      <div className="flex items-center justify-between">
                        <Guessed show={t.sample} />
                        <button onClick={() => setOv({ ...ov, testimonials: testimonialList.filter((_, j) => j !== i) })} className="ml-auto text-xs text-ink/40 hover:text-red-500">Remove</button>
                      </div>
                      <textarea
                        className={cn(input, "mt-2 min-h-[5rem]")}
                        placeholder="What did the customer say?"
                        value={t.quote}
                        onChange={(e) => setOv({ ...ov, testimonials: testimonialList.map((x, j) => j === i ? { ...x, quote: e.target.value, sample: false } : x) })}
                      />
                      <div className="mt-3 grid gap-3 sm:grid-cols-3">
                        <input className={input} placeholder="City" value={t.city} onChange={(e) => setOv({ ...ov, testimonials: testimonialList.map((x, j) => j === i ? { ...x, city: e.target.value } : x) })} />
                        <input className={input} placeholder="Role or business" value={t.role} onChange={(e) => setOv({ ...ov, testimonials: testimonialList.map((x, j) => j === i ? { ...x, role: e.target.value } : x) })} />
                        <input className={input} placeholder="Name (optional)" value={t.name} onChange={(e) => setOv({ ...ov, testimonials: testimonialList.map((x, j) => j === i ? { ...x, name: e.target.value } : x) })} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {tab === "FAQs" && (
              <section>
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <h2 className="font-display text-3xl">Frequently asked questions</h2>
                    <p className="mt-2 text-sm text-ink/50">Amber badges mark answers where I guessed details like minimums and timings. Edit to confirm.</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setOv({ ...ov, faqs: [...faqList, { q: "", a: "" }] })} className="rounded-full border border-ink/20 px-5 py-3 text-sm font-semibold hover:border-gold-deep hover:text-gold-deep">+ Add question</button>
                    <button disabled={busy} onClick={() => saveOverrides({ ...ov, faqs: faqList })} className="btn-sheen rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ivory disabled:opacity-50">Save FAQs</button>
                  </div>
                </div>
                <div className="mt-8 grid gap-5">
                  {faqList.map((f, i) => (
                    <div key={i} className="rounded-2xl border border-ink/10 bg-white p-5">
                      <div className="flex items-center justify-between">
                        <Guessed show={f.guessed} />
                        <button onClick={() => setOv({ ...ov, faqs: faqList.filter((_, j) => j !== i) })} className="ml-auto text-xs text-ink/40 hover:text-red-500">Remove</button>
                      </div>
                      <input className={cn(input, "mt-2 font-semibold")} placeholder="Question" value={f.q} onChange={(e) => setOv({ ...ov, faqs: faqList.map((x, j) => j === i ? { ...x, q: e.target.value } : x) })} />
                      <textarea className={cn(input, "mt-3 min-h-[5rem]")} placeholder="Answer" value={f.a} onChange={(e) => setOv({ ...ov, faqs: faqList.map((x, j) => j === i ? { ...x, a: e.target.value, guessed: false } : x) })} />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-ivory shadow-2xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
