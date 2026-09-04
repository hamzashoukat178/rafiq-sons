"use client";

import { useRef } from "react";
import { reels } from "@/content/site";
import { Eyebrow, FadeUp } from "./Reveal";
import { cn } from "@/lib/utils";

function Reel({ src, poster, label }: { src: string; poster: string; label: string }) {
  const v = useRef<HTMLVideoElement>(null);
  const play = () => v.current?.play().catch(() => {});
  const pause = () => {
    if (!v.current) return;
    v.current.pause();
  };

  return (
    <div
      className="group relative w-[240px] shrink-0 snap-start overflow-hidden rounded-2xl border border-ivory/10 bg-ink sm:w-[280px]"
      onMouseEnter={play}
      onMouseLeave={pause}
      onClick={() => (v.current?.paused ? play() : pause())}
    >
      <video
        ref={v}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        className="aspect-[9/16] h-full w-full scale-[1.02] object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
      <div className="absolute inset-x-4 bottom-4">
        <p className="text-sm font-medium text-ivory/90">{label}</p>
        <p className="mt-1 text-[10px] uppercase tracking-[0.24em] text-gold/80 transition-opacity duration-300 group-hover:opacity-0">Tap or hover to play</p>
      </div>
      <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-ink/50 text-ivory backdrop-blur-md transition-transform duration-500 group-hover:scale-0">
        <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor"><path d="M0 0l12 7-12 7z" /></svg>
      </div>
    </div>
  );
}

export default function Reels() {
  const track = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: number) => track.current?.scrollBy({ left: dir * 320, behavior: "smooth" });

  return (
    <section id="reels" className="scroll-mt-20 border-y border-line-dark bg-ink py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex items-end justify-between gap-8">
          <div className="max-w-xl">
            <Eyebrow> reels from the workbench</Eyebrow>
            <h2 className="display-tight mt-7 font-display text-4xl text-ivory sm:text-5xl">
              Real orders, <span className="italic text-gold-grad">shot on our table.</span>
            </h2>
          </div>
          <FadeUp className="hidden gap-3 sm:flex">
            {[["←", -1], ["→", 1]].map(([arrow, dir]) => (
              <button
                key={arrow as string}
                onClick={() => scrollBy(dir as number)}
                aria-label={`Scroll reels ${dir === -1 ? "left" : "right"}`}
                className={cn(
                  "h-12 w-12 rounded-full border border-ivory/15 text-ivory/70 transition-colors",
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
          className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:px-8 [&::-webkit-scrollbar]:hidden"
          style={{ scrollPaddingLeft: "2rem" }}
        >
          {reels.map((r) => (
            <Reel key={r.src} {...r} />
          ))}
          <div className="flex w-[240px] shrink-0 snap-start flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-ivory/15 sm:w-[280px]">
            <p className="px-8 text-center font-display text-xl italic text-ivory/70">
              Hundreds more on Instagram
            </p>
            <a
              href="https://www.instagram.com/rafiqsonslabelss"
              target="_blank"
              rel="noreferrer"
              className="btn-sheen rounded-full border border-gold/60 px-6 py-3 text-[12px] font-semibold text-gold transition-colors hover:bg-gold hover:text-ink"
            >
              Follow the atelier
            </a>
          </div>
        </div>
      </FadeUp>
    </section>
  );
}
