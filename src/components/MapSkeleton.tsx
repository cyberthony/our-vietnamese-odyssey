"use client";

/**
 * Skeleton placeholder displayed while the Leaflet map is lazy-loading.
 * Mimics the map container dimensions to prevent layout shift.
 */
export default function MapSkeleton() {
  return (
    <div className="w-full aspect-[4/3] lg:aspect-auto lg:h-[480px] rounded-3xl bg-zinc-100 dark:bg-[#1a1d24] border border-zinc-200/50 dark:border-zinc-800/50 flex flex-col items-center justify-center gap-4 animate-pulse">
      {/* Map icon */}
      <svg
        className="w-10 h-10 text-zinc-300 dark:text-zinc-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
        />
      </svg>
      <span className="text-xs font-sans font-semibold tracking-wider uppercase text-zinc-400 dark:text-zinc-500">
        Chargement de la carte…
      </span>
    </div>
  );
}
