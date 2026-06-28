"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import PhotoMasonry, { PhotoItem } from "@/components/PhotoMasonry";

const allImages: PhotoItem[] = [
  { src: "IMG_20240702_195803.jpg", title: "Seoul Morning Glow", desc: "First walk near Myeongdong.", category: "seoul" },
  { src: "IMG_20240702_195806.jpg", title: "Palace Details", desc: "Intricate paintwork on temple rafters.", category: "seoul" },
  { src: "IMG_20240702_195808.jpg", title: "Seoul Street Vibe", desc: "Alleyways blending old and new.", category: "seoul" },
  { src: "IMG_20240702_195815.jpg", title: "Hanok Roofs", desc: "Overlooking Bukchon Hanok Village.", category: "seoul" },
  { src: "IMG_20240702_195839.jpg", title: "Jeju Coastal Path", desc: "Dramatic volcanic cliffs meets the ocean.", category: "jeju" },
  { src: "IMG_20240702_195841.jpg", title: "Dol Hareubang", desc: "Traditional stone guardians in Jeju.", category: "jeju" },
  { src: "IMG_20240702_202817.jpg", title: "Jeju Sunset", desc: "Soft pastel skies over the beach.", category: "jeju" },
  { src: "IMG_20240702_202849.jpg", title: "Waterfall Hikes", desc: "Trekking through lush volcanic valleys.", category: "jeju" },
  { src: "IMG_20240703_170941.jpg", title: "Jeju Tea Fields", desc: "Infinite green tea terraces under the sun.", category: "jeju" },
  { src: "IMG_20240703_170947.jpg", title: "Flight to Hanoi", desc: "Leaving Korea, heading towards Vietnam.", category: "hanoi" },
  { src: "IMG_20240703_170952.jpg", title: "Hanoi Street Life", desc: "First steps in the vibrant capital.", category: "hanoi" },
  { src: "FB_IMG_1722136503847.jpg", title: "Family Photo", desc: "Happy moments together on the trip.", category: "hanoi" },
];

export default function PhotosPage() {
  const t = useTranslations("PhotosPage");
  const [activeFilter, setActiveFilter] = useState<"all" | "seoul" | "jeju" | "hanoi" | "central">("all");

  const filteredImages = allImages.filter(
    (img) => activeFilter === "all" || img.category === activeFilter
  );

  return (
    <div className="flex-1 bg-brand-cream/20 dark:bg-brand-dark-bg/20 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        
        {/* Page Header */}
        <section className="text-center space-y-4 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-brand-charcoal dark:text-zinc-50 leading-tight">
              {t("title")}
            </h1>
            <p className="text-base md:text-lg font-sans font-normal text-zinc-500 dark:text-zinc-400">
              {t("subtitle")}
            </p>
          </motion.div>
        </section>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 justify-center bg-white dark:bg-brand-dark-card border border-zinc-200/50 dark:border-brand-dark-border p-4 rounded-full max-w-3xl mx-auto shadow-sm">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-5 py-2.5 rounded-full text-xs font-bold font-sans tracking-wide uppercase transition-all duration-300 ${
              activeFilter === "all"
                ? "bg-brand-terracotta dark:bg-brand-rose text-brand-cream dark:text-brand-charcoal shadow-sm"
                : "text-zinc-500 hover:text-brand-charcoal dark:hover:text-white"
            }`}
          >
            {t("filterAll")}
          </button>
          <button
            onClick={() => setActiveFilter("seoul")}
            className={`px-5 py-2.5 rounded-full text-xs font-bold font-sans tracking-wide uppercase transition-all duration-300 ${
              activeFilter === "seoul"
                ? "bg-brand-terracotta dark:bg-brand-rose text-brand-cream dark:text-brand-charcoal shadow-sm"
                : "text-zinc-500 hover:text-brand-charcoal dark:hover:text-white"
            }`}
          >
            {t("filterSeoul")}
          </button>
          <button
            onClick={() => setActiveFilter("jeju")}
            className={`px-5 py-2.5 rounded-full text-xs font-bold font-sans tracking-wide uppercase transition-all duration-300 ${
              activeFilter === "jeju"
                ? "bg-brand-terracotta dark:bg-brand-rose text-brand-cream dark:text-brand-charcoal shadow-sm"
                : "text-zinc-500 hover:text-brand-charcoal dark:hover:text-white"
            }`}
          >
            {t("filterJeju")}
          </button>
          <button
            onClick={() => setActiveFilter("hanoi")}
            className={`px-5 py-2.5 rounded-full text-xs font-bold font-sans tracking-wide uppercase transition-all duration-300 ${
              activeFilter === "hanoi"
                ? "bg-brand-terracotta dark:bg-brand-rose text-brand-cream dark:text-brand-charcoal shadow-sm"
                : "text-zinc-500 hover:text-brand-charcoal dark:hover:text-white"
            }`}
          >
            {t("filterHanoi")}
          </button>
          <button
            onClick={() => setActiveFilter("central")}
            className={`px-5 py-2.5 rounded-full text-xs font-bold font-sans tracking-wide uppercase transition-all duration-300 ${
              activeFilter === "central"
                ? "bg-brand-terracotta dark:bg-brand-rose text-brand-cream dark:text-brand-charcoal shadow-sm"
                : "text-zinc-500 hover:text-brand-charcoal dark:hover:text-white"
            }`}
          >
            {t("filterCentral")}
          </button>
        </div>

        {/* Gallery */}
        <PhotoMasonry images={filteredImages} />

        {/* Empty state */}
        {filteredImages.length === 0 && (
          <div className="text-center py-24">
            <p className="text-sm font-sans font-medium text-zinc-400 dark:text-zinc-500">
              Aucune photo disponible pour cette catégorie.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
