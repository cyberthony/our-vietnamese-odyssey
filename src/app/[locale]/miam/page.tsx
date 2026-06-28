"use client";

import { useState } from "react";
import Media from "@/components/Media";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

const dishesData = [
  {
    key: "pho",
    rating: 5,
    region: "north",
    imageUrl: "IMG_20240714_122039.jpg",
  },
  {
    key: "banhmi",
    rating: 4.5,
    region: "north",
    imageUrl: "IMG_20240714_123011.jpg",
  },
  {
    key: "bunbohue",
    rating: 5,
    region: "central",
    imageUrl: "IMG_20240716_104832.jpg",
  },
  {
    key: "caolau",
    rating: 4.5,
    region: "central",
    imageUrl: "IMG_20240716_104919.jpg",
  },
];

export default function MiamPage() {
  const t = useTranslations("MiamPage");
  const [activeRegion, setActiveRegion] = useState<"all" | "north" | "central" | "south">("all");

  const filteredDishes = dishesData.filter(
    (dish) => activeRegion === "all" || dish.region === activeRegion
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

        {/* Region Filter Controls */}
        <div className="flex flex-wrap gap-2 justify-center bg-white dark:bg-brand-dark-card border border-zinc-200/50 dark:border-brand-dark-border p-4 rounded-full max-w-2xl mx-auto shadow-sm">
          <button
            onClick={() => setActiveRegion("all")}
            className={`px-5 py-2 rounded-full text-xs font-bold font-sans tracking-wide uppercase transition-all duration-300 ${
              activeRegion === "all"
                ? "bg-brand-terracotta dark:bg-brand-rose text-brand-cream dark:text-brand-charcoal shadow-sm"
                : "text-zinc-500 hover:text-brand-charcoal dark:hover:text-white"
            }`}
          >
            {t("filterAll")}
          </button>
          <button
            onClick={() => setActiveRegion("north")}
            className={`px-5 py-2 rounded-full text-xs font-bold font-sans tracking-wide uppercase transition-all duration-300 ${
              activeRegion === "north"
                ? "bg-brand-terracotta dark:bg-brand-rose text-brand-cream dark:text-brand-charcoal shadow-sm"
                : "text-zinc-500 hover:text-brand-charcoal dark:hover:text-white"
            }`}
          >
            {t("filterNorth")}
          </button>
          <button
            onClick={() => setActiveRegion("central")}
            className={`px-5 py-2 rounded-full text-xs font-bold font-sans tracking-wide uppercase transition-all duration-300 ${
              activeRegion === "central"
                ? "bg-brand-terracotta dark:bg-brand-rose text-brand-cream dark:text-brand-charcoal shadow-sm"
                : "text-zinc-500 hover:text-brand-charcoal dark:hover:text-white"
            }`}
          >
            {t("filterCentral")}
          </button>
          <button
            onClick={() => setActiveRegion("south")}
            className={`px-5 py-2 rounded-full text-xs font-bold font-sans tracking-wide uppercase transition-all duration-300 ${
              activeRegion === "south"
                ? "bg-brand-terracotta dark:bg-brand-rose text-brand-cream dark:text-brand-charcoal shadow-sm"
                : "text-zinc-500 hover:text-brand-charcoal dark:hover:text-white"
            }`}
          >
            {t("filterSouth")}
          </button>
        </div>

        {/* Dishes Grid */}
        <div className="grid md:grid-cols-2 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredDishes.map((dish) => (
              <motion.div
                key={dish.key}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col sm:flex-row bg-white dark:bg-brand-dark-card border border-zinc-200/50 dark:border-brand-dark-border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
              >
                {/* Image Section */}
                <div className="relative aspect-video sm:aspect-square w-full sm:w-48 shrink-0 overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                  <Media
                    src={dish.imageUrl}
                    alt={t(`dishes.${dish.key}.name`)}
                    fill
                    sizes="(max-width: 640px) 100vw, 192px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>

                {/* Info Content Section */}
                <div className="flex-1 p-6 md:p-8 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <span className="text-[9px] uppercase tracking-wider font-sans font-bold text-brand-terracotta dark:text-brand-rose bg-brand-rose/10 dark:bg-brand-rose/5 px-2.5 py-1 rounded-full">
                      {t(`filter${dish.region.charAt(0).toUpperCase() + dish.region.slice(1)}`)}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-brand-charcoal dark:text-zinc-100">
                      {t(`dishes.${dish.key}.name`)}
                    </h3>
                    <p className="text-xs font-sans leading-relaxed text-zinc-500 dark:text-zinc-400">
                      {t(`dishes.${dish.key}.desc`)}
                    </p>
                  </div>

                  {/* Rating / Stars */}
                  <div className="flex items-center justify-between border-t border-zinc-100 dark:border-[#222225]/40 pt-4">
                    <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      {t("rating")}
                    </span>
                    <div className="flex items-center gap-1">
                      {/* Render Stars */}
                      {Array.from({ length: 5 }).map((_, i) => {
                        const starVal = i + 1;
                        const isFull = starVal <= dish.rating;
                        const isHalf = !isFull && starVal - 0.5 <= dish.rating;
                        
                        return (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              isFull
                                ? "text-amber-400 fill-current"
                                : isHalf
                                ? "text-amber-400 fill-current" // simplfied full color for half star SVG mapping
                                : "text-zinc-200 dark:text-zinc-800 fill-current"
                            }`}
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        );
                      })}
                      <span className="text-xs font-bold font-sans text-brand-charcoal dark:text-zinc-300 ml-1">
                        {dish.rating}/5
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {filteredDishes.length === 0 && (
          <div className="text-center py-24">
            <p className="text-sm font-sans font-medium text-zinc-400 dark:text-zinc-500">
              Aucune spécialité enregistrée pour cette région.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
