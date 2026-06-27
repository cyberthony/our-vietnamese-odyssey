"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

interface CityNode {
  id: string;
  nameKey: string;
  cx: number;
  cy: number;
  country: "korea" | "vietnam";
}

const cities: CityNode[] = [
  { id: "seoul", nameKey: "seoul", cx: 450, cy: 75, country: "korea" },
  { id: "jeju", nameKey: "jeju", cx: 435, cy: 165, country: "korea" },
  { id: "hanoi1", nameKey: "hanoi1", cx: 180, cy: 110, country: "vietnam" },
  { id: "ninhbinh", nameKey: "ninhbinh", cx: 185, cy: 145, country: "vietnam" },
  { id: "vinh", nameKey: "vinh", cx: 195, cy: 195, country: "vietnam" },
  { id: "quangbinh", nameKey: "quangbinh", cx: 205, cy: 235, country: "vietnam" },
  { id: "hue", nameKey: "hue", cx: 220, cy: 275, country: "vietnam" },
  { id: "danang", nameKey: "danang", cx: 235, cy: 295, country: "vietnam" },
  { id: "hoian", nameKey: "hoian", cx: 245, cy: 310, country: "vietnam" },
];

export default function InteractiveMap() {
  const t = useTranslations("Itinerary");
  const [selectedId, setSelectedId] = useState<string>("seoul");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Path lines coordinates
  // Flight Seoul -> Jeju
  const seoulToJejuPath = "M 450 75 Q 460 120 435 165";
  // Flight Jeju -> Hanoi
  const jejuToHanoiPath = "M 435 165 Q 310 170 180 110";
  // Land Route in Vietnam
  const vietnamPath = "M 180 110 L 185 145 L 195 195 L 205 235 L 220 275 L 235 295 L 245 310";

  const getActiveData = () => {
    return {
      title: t(`steps.${selectedId}.title`),
      date: t(`steps.${selectedId}.date`),
      hotel: t(`steps.${selectedId}.hotel`),
      desc: t(`steps.${selectedId}.desc`),
    };
  };

  const activeData = getActiveData();

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-12 gap-10 items-center">
      
      {/* Map Canvas (SVG) */}
      <div className="lg:col-span-7 flex justify-center bg-white dark:bg-brand-dark-card border border-zinc-200/50 dark:border-brand-dark-border p-6 rounded-3xl shadow-sm relative overflow-hidden">
        
        {/* Soft decorative background text */}
        <div className="absolute top-6 left-6 text-[10px] font-bold font-sans uppercase tracking-[0.3em] text-zinc-300 dark:text-zinc-700 pointer-events-none">
          East Asia Route Map
        </div>

        <svg 
          viewBox="0 0 520 400" 
          className="w-full h-auto max-w-[500px] text-zinc-300 dark:text-zinc-800"
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {/* DEFINITIONS FOR GRADIENTS AND PATH MARKERS */}
          <defs>
            <linearGradient id="flightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#CCD5AE" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#E8C5C8" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* SIMPLIFIED COUNTRY OUTLINES (COORDINATES ESTIMATED FOR CLEAN GRAPHIC INTERACTION) */}
          
          {/* South Korea Outline */}
          <path 
            d="M 430 40 C 445 35, 460 30, 470 45 C 475 60, 480 80, 475 95 C 470 110, 480 120, 470 135 C 460 145, 440 145, 430 135 C 420 125, 410 110, 420 90 C 425 75, 420 55, 430 40 Z" 
            className="fill-brand-cream/60 dark:fill-brand-dark-bg/40 stroke-zinc-200 dark:stroke-zinc-800 transition-colors duration-300"
            strokeWidth="1.5"
          />
          {/* Jeju Island Circle Outline */}
          <circle 
            cx="435" 
            cy="165" 
            r="12" 
            className="fill-brand-cream/60 dark:fill-brand-dark-bg/40 stroke-zinc-200 dark:stroke-zinc-800 transition-colors duration-300"
            strokeWidth="1.5"
          />

          {/* Vietnam Outline (S-Shape stretching down) */}
          <path 
            d="M 160 85 C 180 85, 200 95, 195 110 C 190 125, 175 135, 175 145 C 175 155, 185 165, 185 180 C 185 195, 180 205, 190 215 C 200 225, 205 240, 205 255 C 205 270, 220 280, 230 290 C 240 300, 255 310, 250 325 C 245 340, 230 350, 235 365 C 240 380, 245 390, 240 395 C 235 400, 225 395, 220 385 C 215 375, 225 360, 220 350 C 215 340, 195 330, 200 315 C 205 300, 215 290, 210 275 C 205 260, 195 245, 185 235 C 175 225, 165 210, 160 195 C 155 180, 160 165, 160 150 C 160 135, 150 120, 150 105 C 150 95, 155 85, 160 85 Z" 
            className="fill-brand-cream/60 dark:fill-brand-dark-bg/40 stroke-zinc-200 dark:stroke-zinc-800 transition-colors duration-300"
            strokeWidth="1.5"
          />

          {/* ROUTE CONNECTING LINES */}
          
          {/* Flight Path 1: Seoul -> Jeju */}
          <path 
            d={seoulToJejuPath} 
            stroke="url(#flightGrad)"
            strokeWidth="2.5" 
            strokeDasharray="4,6" 
            className="opacity-70"
          />
          
          {/* Flight Path 2: Jeju -> Hanoi */}
          <path 
            d={jejuToHanoiPath} 
            stroke="url(#flightGrad)"
            strokeWidth="2.5" 
            strokeDasharray="4,6" 
            className="opacity-70"
          />

          {/* Land Route: Hanoi down to Hoi An */}
          <path 
            d={vietnamPath} 
            stroke="#D4A373" 
            strokeWidth="2" 
            strokeDasharray="3,5" 
            className="opacity-60 dark:stroke-brand-rose"
          />

          {/* CITY MARKERS */}
          {cities.map((city) => {
            const isSelected = selectedId === city.id;
            const isHovered = hoveredId === city.id;
            
            return (
              <g 
                key={city.id}
                className="cursor-pointer"
                onClick={() => setSelectedId(city.id)}
                onMouseEnter={() => setHoveredId(city.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Outer Glow on hover/selection */}
                <AnimatePresence>
                  {(isSelected || isHovered) && (
                    <motion.circle
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 0.25 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      cx={city.cx}
                      cy={city.cy}
                      r="16"
                      fill="#D4A373"
                      className="dark:fill-brand-rose pointer-events-none"
                    />
                  )}
                </AnimatePresence>

                {/* Outer Ring */}
                <circle 
                  cx={city.cx} 
                  cy={city.cy} 
                  r="6" 
                  className={`transition-colors duration-300 stroke-brand-cream dark:stroke-brand-dark-card ${
                    isSelected 
                      ? "fill-brand-terracotta dark:fill-brand-rose" 
                      : "fill-zinc-400 dark:fill-zinc-600 hover:fill-brand-terracotta dark:hover:fill-brand-rose"
                  }`}
                  strokeWidth="1.5"
                />

                {/* Inner dot */}
                <circle 
                  cx={city.cx} 
                  cy={city.cy} 
                  r="2" 
                  fill="white"
                />

                {/* City Label (visible on desktop hover or if selected) */}
                <text
                  x={city.cx + 10}
                  y={city.cy + 4}
                  className={`font-sans font-bold text-[9px] tracking-wider uppercase border-none pointer-events-none transition-all duration-300 ${
                    isSelected 
                      ? "fill-brand-terracotta dark:fill-brand-rose font-extrabold" 
                      : "fill-zinc-500 dark:fill-zinc-400 opacity-60 group-hover:opacity-100"
                  }`}
                >
                  {t(`steps.${city.id}.title`).split(" (")[0]} {/* truncate Return/Depart labels */}
                </text>
              </g>
            );
          })}

        </svg>
      </div>

      {/* Details Box */}
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
            {/* Header info */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-wider font-sans font-bold text-brand-terracotta dark:text-brand-rose bg-brand-rose/10 dark:bg-brand-rose/5 px-3 py-1.5 rounded-full">
                {activeData.date}
              </span>
              <h3 className="font-serif text-2xl font-bold text-brand-charcoal dark:text-zinc-100">
                {activeData.title}
              </h3>
            </div>

            {/* Hotel if exists */}
            {activeData.hotel && (
              <div className="flex items-center text-xs font-semibold text-zinc-500 dark:text-zinc-400 gap-1.5 font-sans border-t border-b border-zinc-100 dark:border-[#222225]/40 py-3">
                <svg className="w-4 h-4 text-brand-sage shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>{activeData.hotel}</span>
              </div>
            )}

            {/* Description */}
            <p className="text-sm font-sans font-normal leading-relaxed text-zinc-500 dark:text-zinc-400">
              {activeData.desc}
            </p>

            {/* Hint message */}
            <div className="text-[10px] text-zinc-400 dark:text-zinc-500 font-sans italic pt-2">
              * Cliquez sur les villes de la carte pour afficher les détails de l'étape.
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
