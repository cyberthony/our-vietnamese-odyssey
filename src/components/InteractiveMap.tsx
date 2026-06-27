"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "@/i18n/routing";
import MapWrapper from "./MapWrapper";
import { CITIES, getCityById } from "@/lib/map-data";

export default function InteractiveMap() {
  const t = useTranslations("Itinerary");
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string>("seoul");

  const selectedCity = getCityById(selectedId);

  const activeData = {
    title: t(`steps.${selectedId}.title`),
    date: t(`steps.${selectedId}.date`),
    hotel: t(`steps.${selectedId}.hotel`),
    desc: t(`steps.${selectedId}.desc`),
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-12 gap-10 items-start">
      {/* ── Map (Leaflet via lazy wrapper) ── */}
      <div className="lg:col-span-7 flex flex-col">
        <MapWrapper selectedId={selectedId} onSelectCity={setSelectedId} />
      </div>

      {/* ── Details Panel ── */}
      <div className="lg:col-span-5 flex flex-col justify-center h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedId}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white dark:bg-brand-dark-card border border-zinc-200/50 dark:border-brand-dark-border p-8 rounded-3xl shadow-sm space-y-6"
          >
            {/* Country indicator */}
            {selectedCity && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider font-sans font-bold text-brand-terracotta dark:text-brand-rose bg-brand-rose/10 dark:bg-brand-rose/5 px-3 py-1.5 rounded-full">
                  {selectedCity.country === "korea"
                    ? "🇰🇷 Corée du Sud"
                    : "🇻🇳 Vietnam"}
                </span>
              </div>
            )}

            {/* Date + Title */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-wider font-sans font-bold text-brand-terracotta dark:text-brand-rose bg-brand-rose/10 dark:bg-brand-rose/5 px-3 py-1.5 rounded-full">
                {activeData.date}
              </span>
              <h3 className="font-serif text-2xl font-bold text-brand-charcoal dark:text-zinc-100">
                {activeData.title}
              </h3>
            </div>

            {/* Hotel */}
            {activeData.hotel && (
              <div className="flex items-center text-xs font-semibold text-zinc-500 dark:text-zinc-400 gap-1.5 font-sans border-t border-b border-zinc-100 dark:border-[#222225]/40 py-3">
                <svg
                  className="w-4 h-4 text-brand-sage shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <span>{activeData.hotel}</span>
              </div>
            )}

            {/* Description */}
            <p className="text-sm font-sans font-normal leading-relaxed text-zinc-500 dark:text-zinc-400">
              {activeData.desc}
            </p>

            {/* CTA to full itinerary */}
            <div className="pt-2">
              <button
                onClick={() => router.push("/itinerary")}
                className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider font-sans text-brand-terracotta dark:text-brand-rose hover:text-brand-charcoal dark:hover:text-zinc-200 transition-colors cursor-pointer"
              >
                Voir l&apos;itinéraire complet
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="3"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
