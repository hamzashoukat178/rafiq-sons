"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { reels, site } from "@/content/site";
import { Eyebrow, FadeUp, RevealWords } from "./Reveal";
import { cn, easeLuxe } from "@/lib/utils";

function ReelCard({
  src,
  poster,
  label,
  onOpen,
}: {
  src: string;
  poster: string;
  label: string;
  onOpen: () => void;
}) {
  const v = useRef<HTMLVideoElement>(null);
  const play = () => v.current?.play().catch(() => {});
  const pause = () => {
    if (!v.current) return;
    v.current.pause();
  };

  return (
    <div
      className="group relative w-[240px] shrink-0 snap-start cursor-pointer overflow-hidden rounded-3xl border border-ivory/10 bg-coal transition-all duration-500 hover:border-gold/60 hover:shadow-[0_20px_50px_-15px_rgba(198,161,91,0.3)] sm:w-[280px]"
      onMouseEnter={play}
      onMouseLeave={pause}
      onClick={onOpen}
    >
      <video
        ref={v}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        className="aspect-[9/16] h-full w-full scale-[1.02] object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent" />
      
      <div className="absolute inset-x-4 bottom-5">
        <span className="inline-block rounded-full bg-gold/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold backdrop-blur-md">
          Workbench Reel
        </span>
        <p className="mt-2 text-sm font-semibold text-ivory">{label}</p>
        <p className="mt-1 text-[10px] uppercase tracking-[0.24em] text-smoke transition-opacity duration-300 group-hover:opacity-0">
          Tap for video & sound
        </p>
      </div>

      <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-ivory/20 bg-ink/70 text-gold backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:bg-gold group-hover:text-ink">
        <svg width="14" height="16" viewBox="0 0 12 14" fill="currentColor">
          <path d="M0 0l12 7-12 7z" />
        </svg>
      </div>
    </div>
  );
}

export default function Reels() {
  const track = useRef<HTMLDivElement>(null);
  const [activeVideo, setActiveVideo] = useState<{ src: string; label: string } | null>(null);

  const scrollBy = (dir: number) => track.current?.scrollBy({ left: dir * 320, behavior: "smooth" });

  return (
    <section id="reels" className="scroll-mt-20 border-t border-ivory/10 bg-coal py-24 lg:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <Eyebrow>Reels from the workbench</Eyebrow>
            <h2 className="display-tight mt-6 font-display text-4xl text-ivory sm:text-5xl">
              <RevealWords text="Real orders," />{" "}
              <span className="italic text-gold-grad">
                <RevealWords text="shot on our table." delay={0.25} />
              </span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ivory/60 sm:text-base">
              Watch the textures, threads, and metallic foil finishes in motion before they are packed for client delivery.
            </p>
          </div>

          <FadeUp className="flex gap-3">
            {[["←", -1], ["→", 1]].map(([arrow, dir]) => (
              <button
                key={arrow as string}
                onClick={() => scrollBy(dir as number)}
                aria-label={`Scroll reels ${dir === -1 ? "left" : "right"}`}
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-full border border-ivory/15 bg-ink text-ivory/70 transition-all",
                  "hover:border-gold hover:text-gold"
                )}
              >
                {arrow}
              </button>
            ))}
          </FadeUp>
        </div>
      </div>

      <FadeUp delay={0.15}>
        <div
          ref={track}
          className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:px-8 [&::-webkit-scrollbar]:hidden"
          style={{ scrollPaddingLeft: "2rem" }}
        >
          {reels.map((r) => (
            <ReelCard
              key={r.src}
              {...r}
              onOpen={() => setActiveVideo({ src: r.src, label: r.label })}
            />
          ))}

          <div className="flex w-[240px] shrink-0 snap-start flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-ivory/20 bg-ink/40 p-6 text-center sm:w-[280px]">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold">
              📸
            </span>
            <p className="font-display text-xl italic text-ivory/90">
              {site.followers.toLocaleString()}+ Instagram followers
            </p>
            <p className="text-xs text-smoke">
              Hundreds of daily reel previews and behind-the-scenes craft clips.
            </p>
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer"
              className="btn-sheen mt-2 rounded-full border border-gold/60 px-6 py-3 text-[12px] font-semibold text-gold transition-colors hover:bg-gold hover:text-ink"
            >
              Follow @rafiqsonslabelss
            </a>
          </div>
        </div>
      </FadeUp>

      {/* Fullscreen Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[220] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-2xl sm:p-8"
            onClick={() => setActiveVideo(null)}
          >
            <button
              onClick={() => setActiveVideo(null)}
              aria-label="Close video"
              className="absolute right-6 top-6 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-ivory/20 bg-coal text-xl text-ivory transition-colors hover:border-gold hover:text-gold"
            >
              ✕
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ ease: easeLuxe, duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-dark relative aspect-[9/16] max-h-[85vh] w-full max-w-sm overflow-hidden rounded-3xl border border-ivory/20 bg-coal shadow-2xl"
            >
              <video
                src={activeVideo.src}
                autoPlay
                controls
                playsInline
                className="h-full w-full object-cover"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
