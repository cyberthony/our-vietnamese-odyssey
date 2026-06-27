"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";

interface BlogCardProps {
  title: string;
  excerpt: string;
  date: string;
  location: string;
  imageUrl: string;
  readTime: string;
  slug: string;
}

export default function BlogCard({
  title,
  excerpt,
  date,
  location,
  imageUrl,
  readTime,
  slug,
}: BlogCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col bg-white dark:bg-brand-dark-card rounded-3xl overflow-hidden border border-zinc-200/50 dark:border-brand-dark-border shadow-md hover:shadow-xl transition-shadow duration-300 group"
    >
      {/* Feature Image Wrapper */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          {/* Location Badge */}
          <span className="text-[10px] uppercase tracking-wider font-sans font-bold bg-white/90 dark:bg-brand-dark-card/90 backdrop-blur-sm text-brand-charcoal dark:text-zinc-200 px-3 py-1.5 rounded-full border border-white/20 shadow-sm flex items-center gap-1">
            <svg className="w-3 h-3 text-brand-terracotta dark:text-brand-rose" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            {location}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 md:p-8 flex flex-col justify-between space-y-6">
        <div className="space-y-3">
          
          {/* Metadata Row */}
          <div className="flex items-center text-xs font-semibold text-zinc-400 dark:text-zinc-500 gap-4">
            <span className="font-sans">{date}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <span className="font-sans">{readTime}</span>
          </div>

          {/* Heading */}
          <h3 className="font-serif text-xl md:text-2xl font-bold leading-snug text-brand-charcoal dark:text-zinc-100 group-hover:text-brand-terracotta dark:group-hover:text-brand-rose transition-colors duration-300">
            <Link href={`/blog/${slug}`}>
              {title}
            </Link>
          </h3>

          {/* Excerpt */}
          <p className="text-sm font-sans font-normal leading-relaxed text-zinc-500 dark:text-zinc-400 line-clamp-3">
            {excerpt}
          </p>
        </div>

        {/* Read More button */}
        <div className="pt-2">
          <Link 
            href={`/blog/${slug}`}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-sans text-brand-terracotta dark:text-brand-rose group/btn transition-colors hover:text-brand-charcoal dark:hover:text-white"
          >
            Lire la suite
            <svg 
              className="w-4 h-4 transition-transform duration-300 ease-out group-hover/btn:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
            </svg>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
