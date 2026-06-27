"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import BlogCard from "@/components/BlogCard";
import { PostMetadata } from "@/lib/mdx";

interface BlogPageClientProps {
  initialPosts: PostMetadata[];
}

export default function BlogPageClient({ initialPosts }: BlogPageClientProps) {
  const t = useTranslations("BlogPage");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "korea" | "vietnam">("all");

  const filteredPosts = initialPosts.filter((post) => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesFilter = 
      activeFilter === "all" || post.country === activeFilter;

    return matchesSearch && matchesFilter;
  });

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

        {/* Filter Controls (Search + Country Buttons) */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white dark:bg-brand-dark-card border border-zinc-200/50 dark:border-brand-dark-border p-6 rounded-3xl shadow-sm">
          
          {/* Filter buttons */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold font-sans tracking-wide uppercase transition-all duration-300 ${
                activeFilter === "all"
                  ? "bg-brand-terracotta dark:bg-brand-rose text-brand-cream dark:text-brand-charcoal shadow-sm"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-brand-charcoal dark:hover:text-white"
              }`}
            >
              {t("filterAll")}
            </button>
            <button
              onClick={() => setActiveFilter("korea")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold font-sans tracking-wide uppercase transition-all duration-300 ${
                activeFilter === "korea"
                  ? "bg-brand-terracotta dark:bg-brand-rose text-brand-cream dark:text-brand-charcoal shadow-sm"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-brand-charcoal dark:hover:text-white"
              }`}
            >
              {t("filterKorea")}
            </button>
            <button
              onClick={() => setActiveFilter("vietnam")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold font-sans tracking-wide uppercase transition-all duration-300 ${
                activeFilter === "vietnam"
                  ? "bg-brand-terracotta dark:bg-brand-rose text-brand-cream dark:text-brand-charcoal shadow-sm"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-brand-charcoal dark:hover:text-white"
              }`}
            >
              {t("filterVietnam")}
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:max-w-xs flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full pl-11 pr-5 py-3 rounded-full text-xs font-semibold font-sans bg-zinc-100 dark:bg-zinc-800 text-brand-charcoal dark:text-zinc-100 placeholder-zinc-400 border border-transparent focus:border-brand-terracotta/40 dark:focus:border-brand-rose/40 outline-none transition-all"
            />
            <svg 
              className="absolute left-4 w-4 h-4 text-zinc-400 pointer-events-none" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

        </div>

        {/* Grid of posts */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post) => (
              <motion.div
                key={post.slug}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <BlogCard {...post} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-24 space-y-4">
            <svg className="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm font-sans font-medium text-zinc-400 dark:text-zinc-500">
              Aucun récit de voyage ne correspond à votre recherche.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
