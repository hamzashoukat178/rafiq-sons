"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { quote as defaultQuote, site as defaultSite } from "@/content/site";
import { Eyebrow, FadeUp, RevealWords } from "./Reveal";
import Magnetic from "./Magnetic";
import { easeLuxe, cn } from "@/lib/utils";

const steps = ["Product", "Quantity", "Contact"];
const inputCls =
  "w-full rounded-xl border border-ivory/15 bg-ink/70 px-4 py-3.5 text-sm text-ivory placeholder-ivory/30 outline-none transition-colors focus:border-gold";

function Chip({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2.5 text-xs font-semibold tracking-wide transition-all duration-300",
        active ? "border-gold bg-gold text-ink shadow-[0_4px_15px_-3px_rgba(198,161,91,0.5)]" : "border-ivory/15 bg-ink/40 text-ivory/70 hover:border-gold/40 hover:text-ivory"
      )}
    >
      {children}
    </button>
  );
}

const initial = {
  product: "Woven Labels",
  quantity: "1,000 to 5,000 pieces",
  brand: "",
  name: "",
  contact: "",
  message: "",
};

export default function Quote({
  quote = defaultQuote,
  site = defaultSite,
}: {
  quote?: typeof defaultQuote;
  site?: typeof defaultSite;
}) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initial);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleProductSelect = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (detail) {
        setForm((prev) => ({ ...prev, product: detail }));
      }
    };
    window.addEventListener("quote:product", handleProductSelect);
    return () => window.removeEventListener("quote:product", handleProductSelect);
  }, []);

  const canNext =
    (step === 0 && Boolean(form.product)) ||
    (step === 1 && Boolean(form.quantity)) ||
    (step === 2 && Boolean(form.name.trim() && form.contact.trim()));

  const submit = async () => {
    if (!form.name.trim() || !form.contact.trim()) {
      setError("Please provide your name and WhatsApp or email");
      return;
    }
    setError("");
    setSending(true);

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Could not send");
      setDone(true);
    } catch {
      // If API fails or offline, still succeed and let user continue on WhatsApp
      setDone(true);
    } finally {
      setSending(false);
    }
  };

  const waText = encodeURIComponent(
    `Hi Rafiq Sons Labels, I would like to request a quote:\n\n• Product: ${form.product}\n• Quantity: ${form.quantity}\n• Brand: ${form.brand || "Not specified"}\n• Name: ${form.name}\n• Notes: ${form.message || "None"}`
  );

  return (
    <section id="quote" className="relative scroll-mt-20 overflow-hidden bg-coal py-24 lg:py-36">
      <div className="absolute inset-0 opacity-20">
        <Image src="/ai/weave-dark.jpg" alt="" fill sizes="100vw" className="object-cover" aria-hidden />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-coal/80 via-coal/60 to-coal" />
      <div className="pointer-events-none absolute -left-32 top-24 h-96 w-96 rounded-full bg-gold/10 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_1.15fr] lg:gap-24">
        {/* Left Column: Heading & WhatsApp Direct Contact */}
        <div>
          <Eyebrow>{quote.eyebrow}</Eyebrow>
          <h2 className="display-tight mt-6 font-display text-4xl text-ivory sm:text-6xl">
            <RevealWords text={quote.title} />
          </h2>
          <FadeUp delay={0.15} className="mt-6 max-w-md leading-relaxed text-ivory/60">
            {quote.sub}
          </FadeUp>

          <FadeUp delay={0.25} className="mt-10 hidden lg:block">
            <div className="glass-dark rounded-3xl border border-gold/30 p-8">
              <span className="eyebrow text-[10px] text-gold">Direct WhatsApp Desk</span>
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="mt-3 block font-display text-2xl text-ivory transition-colors hover:text-gold"
              >
                {site.phoneDisplay}
              </a>
              <p className="mt-2 text-xs leading-relaxed text-ivory/50">
                Voice note your idea or send high-res artwork files. We reply with expert advice and clear landed pricing within 24 hours.
              </p>
            </div>
          </FadeUp>
        </div>

        {/* Right Column: Interactive Form */}
        <FadeUp delay={0.1}>
          <div className="glass-dark relative overflow-hidden rounded-3xl border border-ivory/12 p-6 sm:p-10">
            <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-gold/15 blur-[80px]" />

            <AnimatePresence mode="wait">
              {done ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: easeLuxe }}
                  className="flex min-h-[26rem] flex-col items-center justify-center text-center"
                >
                  <motion.span
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.15 }}
                    className="flex h-20 w-20 items-center justify-center rounded-full bg-gold text-3xl text-ink font-bold shadow-[0_0_30px_rgba(198,161,91,0.6)]"
                  >
                    ✓
                  </motion.span>
                  <h3 className="mt-8 font-display text-3xl text-ivory">Your request is on our table.</h3>
                  <p className="mt-4 max-w-sm text-sm leading-relaxed text-ivory/65">
                    We study every artwork before quoting. Expect a clear reply within 24 hours. Want a faster answer?
                  </p>
                  <Magnetic strength={0.25} className="mt-8">
                    <a
                      href={`${site.whatsapp}?text=${waText}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-sheen inline-block rounded-full bg-gold px-8 py-4 text-sm font-semibold text-ink"
                    >
                      Continue on WhatsApp
                    </a>
                  </Magnetic>
                  <button
                    onClick={() => {
                      setDone(false);
                      setForm(initial);
                      setStep(0);
                    }}
                    className="mt-6 text-xs text-smoke underline-offset-4 hover:text-ivory hover:underline"
                  >
                    Send another request
                  </button>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -30 }}>
                  {/* Step Progress Pills */}
                  <div className="mb-10 flex items-center gap-3">
                    {steps.map((s, i) => (
                      <div key={s} className="flex flex-1 items-center gap-3">
                        <button
                          onClick={() => i < step && setStep(i)}
                          className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-all",
                            i <= step ? "border-gold bg-gold text-ink shadow-[0_0_15px_rgba(198,161,91,0.4)]" : "border-ivory/20 text-ivory/40"
                          )}
                          aria-label={`Step ${i + 1}: ${s}`}
                        >
                          {i + 1}
                        </button>
                        <div className="hidden sm:block">
                          <p className={cn("text-[11px] font-semibold uppercase tracking-[0.18em]", i <= step ? "text-ivory" : "text-ivory/35")}>
                            {s}
                          </p>
                        </div>
                        {i < steps.length - 1 && <div className="h-px flex-1 bg-ivory/12" />}
                      </div>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    {step === 0 && (
                      <motion.div
                        key="s0"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.45, ease: easeLuxe }}
                      >
                        <p className="font-display text-2xl text-ivory">What product are we making?</p>
                        <p className="mt-1 text-xs text-smoke">Select the primary craft for your project</p>
                        <div className="mt-6 flex flex-wrap gap-2.5">
                          {quote.products.map((p) => (
                            <Chip key={p} active={form.product === p} onClick={() => setForm({ ...form, product: p })}>
                              {p}
                            </Chip>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {step === 1 && (
                      <motion.div
                        key="s1"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.45, ease: easeLuxe }}
                      >
                        <p className="font-display text-2xl text-ivory">How many pieces, roughly?</p>
                        <p className="mt-1 text-xs text-smoke">Higher volume runs benefit from significantly lower unit prices</p>
                        <div className="mt-6 flex flex-wrap gap-2.5">
                          {quote.quantities.map((q) => (
                            <Chip key={q} active={form.quantity === q} onClick={() => setForm({ ...form, quantity: q })}>
                              {q}
                            </Chip>
                          ))}
                        </div>
                        <input
                          className={cn(inputCls, "mt-8")}
                          placeholder="Your brand name (optional)"
                          value={form.brand}
                          onChange={(e) => setForm({ ...form, brand: e.target.value })}
                        />
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        key="s2"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.45, ease: easeLuxe }}
                      >
                        <p className="font-display text-2xl text-ivory">Where do we send your quote?</p>
                        <div className="mt-6 grid gap-5 sm:grid-cols-2">
                          <input
                            className={inputCls}
                            placeholder="Your name *"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                          />
                          <input
                            className={inputCls}
                            placeholder="WhatsApp number or email *"
                            value={form.contact}
                            onChange={(e) => setForm({ ...form, contact: e.target.value })}
                          />
                        </div>
                        <textarea
                          className={cn(inputCls, "mt-5 min-h-[6rem] resize-none")}
                          placeholder="Project details: sizes, yarn colors, artwork link, or target delivery country."
                          value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                        />
                        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-10 flex items-center justify-between">
                    <button
                      onClick={() => setStep((s) => Math.max(0, s - 1))}
                      className={cn("text-sm text-smoke transition-colors hover:text-ivory", step === 0 && "pointer-events-none opacity-0")}
                    >
                      ← Back
                    </button>
                    {step < 2 ? (
                      <Magnetic strength={0.2}>
                        <button
                          onClick={() => canNext && setStep(step + 1)}
                          disabled={!canNext}
                          className={cn(
                            "rounded-full px-8 py-3.5 text-sm font-semibold transition-all",
                            canNext ? "bg-gold text-ink btn-sheen shadow-[0_8px_25px_-5px_rgba(198,161,91,0.5)]" : "cursor-not-allowed bg-ivory/10 text-ivory/30"
                          )}
                        >
                          Continue
                        </button>
                      </Magnetic>
                    ) : (
                      <Magnetic strength={0.2}>
                        <button
                          onClick={submit}
                          disabled={!canNext || sending}
                          className={cn(
                            "rounded-full px-8 py-3.5 text-sm font-semibold transition-all",
                            canNext && !sending ? "bg-gold text-ink btn-sheen shadow-[0_8px_25px_-5px_rgba(198,161,91,0.5)]" : "cursor-not-allowed bg-ivory/10 text-ivory/30"
                          )}
                        >
                          {sending ? "Sending..." : "Submit Quote Request"}
                        </button>
                      </Magnetic>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
