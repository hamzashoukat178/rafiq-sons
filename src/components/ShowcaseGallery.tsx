"use client";

import React, { useState } from "react";
import Image from "next/image";
import { gallery } from "@/content/site";

interface ShowcaseGalleryProps {
  items?: typeof gallery;
}

export default function ShowcaseGallery({ items = gallery }: ShowcaseGalleryProps) {
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const tags = ["All", "Woven Labels", "Hang Tags", "Satin Labels", "Thank You Cards", "Packaging", "Patches"];

  const filteredItems = items.filter((item) => {
    if (selectedTag === "All") return true;
    return item.tag.toLowerCase().includes(selectedTag.toLowerCase()) || selectedTag.toLowerCase().includes(item.tag.toLowerCase());
  });

  return (
    <section id="gallery" className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/80 text-slate-800 text-xs font-bold uppercase tracking-wider">
            <span>📸 Factory Portfolio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Finished Orders & Atelier Workbench
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Real unedited photos of custom woven labels, foil stamped hang tags, leather badges, and custom frosted packaging freshly completed for global clothing brands.
          </p>
        </div>

        {/* Gallery Filter Tags */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedTag === tag
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Masonry / Grid Gallery */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.slice(0, 16).map((item, idx) => (
            <div
              key={idx}
              onClick={() => setLightboxImage(item.src)}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-200 border border-slate-200 shadow-2xs hover:shadow-md cursor-pointer transition-all"
            >
              <Image
                src={item.src}
                alt={`Rafiq Sons Labels - ${item.tag}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <span className="text-xs font-bold text-white bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-md">
                  {item.tag}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {lightboxImage && (
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setLightboxImage(null)}
          >
            <div className="relative max-w-4xl max-h-[85vh] w-full h-[80vh]">
              <Image
                src={lightboxImage}
                alt="Enlarged order photo"
                fill
                className="object-contain"
              />
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
