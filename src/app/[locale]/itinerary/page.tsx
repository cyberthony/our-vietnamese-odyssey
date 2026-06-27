"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import InteractiveMap from "@/components/InteractiveMap";
import Timeline from "@/components/Timeline";

export default function ItineraryPage() {
  const t = useTranslations("ItineraryPage");

  return (
    <div className="flex-1 bg-brand-cream/20 dark:bg-brand-dark-bg/20">
      
      {/* Page Header */}
      <section className="w-full max-w-7xl mx-auto px-6 pt-16 pb-8 text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-3"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-brand-charcoal dark:text-zinc-50 leading-tight">
            {t("title")}
          </h1>
          <p className="text-base md:text-lg font-sans font-normal text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>
      </section>

      {/* Interactive Map Section */}
      <section className="w-full border-b border-zinc-200/30 dark:border-[#222225]/30 py-8">
        <InteractiveMap />
      </section>

      {/* Chronological Timeline Section */}
      <section className="w-full py-16 md:py-24">
        <Timeline />
      </section>

    </div>
  );
}
