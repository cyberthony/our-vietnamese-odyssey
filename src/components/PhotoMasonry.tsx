"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface PhotoItem {
  src: string;
  title: string;
  desc: string;
  category: "seoul" | "jeju" | "hanoi" | "central";
}

const defaultImages: PhotoItem[] = [
  { src: "/images/IMG_20240702_195803.jpg", title: "Seoul Morning Glow", desc: "First walk near Myeongdong.", category: "seoul" },
  { src: "/images/IMG_20240702_195806.jpg", title: "Palace Details", desc: "Intricate paintwork on temple rafters.", category: "seoul" },
  { src: "/images/IMG_20240702_195808.jpg", title: "Seoul Street Vibe", desc: "Alleyways blending old and new.", category: "seoul" },
  { src: "/images/IMG_20240702_195815.jpg", title: "Hanok Roofs", desc: "Overlooking Bukchon Hanok Village.", category: "seoul" },
  { src: "/images/IMG_20240702_195839.jpg", title: "Jeju Coastal Path", desc: "Dramatic volcanic cliffs meets the ocean.", category: "jeju" },
  { src: "/images/IMG_20240702_195841.jpg", title: "Dol Hareubang", desc: "Traditional stone guardians in Jeju.", category: "jeju" },
  { src: "/images/IMG_20240702_202817.jpg", title: "Jeju Sunset", desc: "Soft pastel skies over the beach.", category: "jeju" },
  { src: "/images/IMG_20240702_202849.jpg", title: "Waterfall Hikes", desc: "Trekking through lush volcanic valleys.", category: "jeju" },
  { src: "/images/IMG_20240703_170941.jpg", title: "Jeju Tea Fields", desc: "Infinite green tea terraces under the sun.", category: "jeju" },
  { src: "/images/IMG_20240703_170947.jpg", title: "Flight to Hanoi", desc: "Leaving Korea, heading towards Vietnam.", category: "hanoi" },
  { src: "/images/IMG_20240703_170952.jpg", title: "Hanoi Street Life", desc: "First steps in the vibrant capital.", category: "hanoi" },
  { src: "/images/FB_IMG_1722136503847.jpg", title: "Family Photo", desc: "Happy moments together on the trip.", category: "hanoi" },
];

interface PhotoMasonryProps {
  images?: PhotoItem[];
}

export default function PhotoMasonry({ images = defaultImages }: PhotoMasonryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (activeIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, images.length]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      
      {/* Masonry Layout via Tailwind CSS columns */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        <AnimatePresence mode="popLayout">
          {images.map((img, index) => (
            <motion.div
              key={img.src}
              layout
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="break-inside-avoid relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-zinc-200/50 dark:border-brand-dark-border cursor-pointer group bg-zinc-100 dark:bg-zinc-900"
              onClick={() => setActiveIndex(index)}
            >
              <div className="relative w-full aspect-auto min-h-[220px]">
                <img
                  src={img.src}
                  alt={img.title}
                  className="w-full h-auto object-cover rounded-3xl transition-transform duration-700 ease-[0.16, 1, 0.3, 1] group-hover:scale-102"
                  loading="lazy"
                />
              </div>
              
              {/* Elegant Caption Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white pointer-events-none">
                <h4 className="font-serif text-lg font-bold">{img.title}</h4>
                <p className="text-xs font-sans text-zinc-300 mt-1">{img.desc}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeIndex !== null && images[activeIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 backdrop-blur-md"
            onClick={() => setActiveIndex(null)}
          >
            
            {/* Close Button */}
            <button
              onClick={() => setActiveIndex(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors duration-300 focus:outline-none"
              aria-label="Close Lightbox"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Previous Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors duration-300 focus:outline-none"
              aria-label="Previous Image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors duration-300 focus:outline-none"
              aria-label="Next Image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Image & Description Container */}
            <div 
              className="max-w-4xl max-h-[80vh] w-full px-6 flex flex-col items-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative aspect-auto max-h-[70vh] flex justify-center"
              >
                <img
                  src={images[activeIndex].src}
                  alt={images[activeIndex].title}
                  className="max-h-[70vh] w-auto object-contain rounded-2xl shadow-2xl border border-white/10"
                />
              </motion.div>

              <div className="text-center text-white space-y-1">
                <h3 className="font-serif text-xl font-bold">{images[activeIndex].title}</h3>
                <p className="text-sm text-zinc-400 font-sans">{images[activeIndex].desc}</p>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
