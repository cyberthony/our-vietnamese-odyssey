"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const stepKeys = [
  "seoul",
  "jeju",
  "hanoi1",
  "hoian",
  "danang",
  "hue",
  "laguna",
  "quangbinh",
  "hometown",
  "vinh",
  "hanoi2",
  "ninhbinh",
  "hanoi3",
];

export default function Timeline() {
  const t = useTranslations("Itinerary");

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12 relative">
      
      {/* Central Line */}
      <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-brand-sage/50 dark:bg-zinc-800 -translate-x-1/2 pointer-events-none" />

      <div className="space-y-16">
        {stepKeys.map((key, index) => {
          const isEven = index % 2 === 0;
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className={`flex flex-col md:flex-row relative ${
                isEven ? "md:flex-row-reverse" : ""
              }`}
            >
              
              {/* Central Marker */}
              <div className="absolute left-8 md:left-1/2 top-2 -translate-x-1/2 flex items-center justify-center z-10">
                <div className="w-4 h-4 rounded-full bg-brand-terracotta dark:bg-brand-rose border-4 border-brand-cream dark:border-brand-dark-bg shadow-sm" />
              </div>

              {/* Empty Column for Layout Balancing on Desktop */}
              <div className="hidden md:block md:w-1/2" />

              {/* Card Container */}
              <div className="w-full md:w-1/2 pl-16 md:pl-0 md:px-12">
                <div className="bg-white dark:bg-brand-dark-card border border-zinc-200/50 dark:border-brand-dark-border rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow duration-300 relative group">
                  
                  {/* Speech Bubble Arrow (Desktop only) */}
                  <div className={`hidden md:block absolute top-4 w-4 h-4 rotate-45 bg-white dark:bg-brand-dark-card border-zinc-200/50 dark:border-brand-dark-border ${
                    isEven 
                      ? "-left-2 border-l border-b" 
                      : "-right-2 border-r border-t"
                  }`} />

                  {/* Date Badge */}
                  <span className="text-[10px] uppercase tracking-wider font-sans font-bold text-brand-terracotta dark:text-brand-rose bg-brand-rose/10 dark:bg-brand-rose/5 px-3 py-1.5 rounded-full">
                    {t(`steps.${key}.date`)}
                  </span>

                  {/* Title */}
                  <h3 className="mt-4 font-serif text-xl md:text-2xl font-bold text-brand-charcoal dark:text-zinc-100 group-hover:text-brand-terracotta dark:group-hover:text-brand-rose transition-colors duration-300">
                    {t(`steps.${key}.title`)}
                  </h3>

                  {/* Hotel Info if exists */}
                  {t(`steps.${key}.hotel`) && (
                    <div className="mt-2 flex items-center text-xs font-semibold text-zinc-500 dark:text-zinc-400 gap-1.5 font-sans">
                      <svg className="w-3.5 h-3.5 text-brand-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span>{t(`steps.${key}.hotel`)}</span>
                    </div>
                  )}

                  {/* Description */}
                  <p className="mt-4 text-sm font-sans leading-relaxed text-zinc-500 dark:text-zinc-400">
                    {t(`steps.${key}.desc`)}
                  </p>
                </div>
              </div>

            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
