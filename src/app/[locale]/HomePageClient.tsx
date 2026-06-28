"use client";

import Media from "@/components/Media";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import InteractiveMap from "@/components/InteractiveMap";
import Timeline from "@/components/Timeline";
import PhotoMasonry from "@/components/PhotoMasonry";
import BlogCard from "@/components/BlogCard";
import { PostMetadata } from "@/lib/mdx";

interface HomePageClientProps {
  latestPosts: PostMetadata[];
}

export default function HomePageClient({ latestPosts }: HomePageClientProps) {
  const t = useTranslations("HomePage");

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative bg-brand-cream/20 dark:bg-brand-dark-bg/20">
      
      {/* Background organic blur blobs */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-brand-rose/10 dark:bg-brand-rose/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-1/2 right-1/10 w-80 h-80 bg-brand-sage/10 dark:bg-brand-sage/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* 1. HERO SECTION */}
      <section className="w-full max-w-7xl mx-auto px-6 py-12 md:py-24 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Animated Hero Text */}
        <div className="lg:col-span-6 space-y-8 flex flex-col justify-center text-left">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            <span className="inline-block text-xs uppercase tracking-[0.25em] font-sans font-bold text-brand-terracotta dark:text-brand-rose bg-brand-rose/10 dark:bg-brand-rose/5 px-4 py-2 rounded-full">
              {t("subtitle")}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-brand-charcoal dark:text-zinc-50 leading-[1.15]">
              {t("title")}
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg font-sans font-normal leading-relaxed text-zinc-500 dark:text-zinc-400 max-w-xl"
          >
            {t("description")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-4 pt-2"
          >
            <a 
              href="#map-section"
              className="px-8 py-3.5 rounded-full bg-brand-terracotta hover:bg-brand-terracotta/90 dark:bg-brand-rose dark:hover:bg-brand-rose/90 text-brand-cream dark:text-brand-charcoal font-sans font-bold text-sm tracking-wide transition-all shadow-lg shadow-brand-terracotta/10 dark:shadow-brand-rose/10 hover:shadow-brand-terracotta/20 dark:hover:shadow-brand-rose/20 cursor-pointer"
            >
              {t("explore")}
            </a>
            <a 
              href="#blog-section"
              className="px-8 py-3.5 rounded-full border border-zinc-300 dark:border-zinc-800 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 text-brand-charcoal dark:text-zinc-300 font-sans font-bold text-sm tracking-wide transition-all cursor-pointer"
            >
              {t("viewBlog")}
            </a>
          </motion.div>
        </div>

        {/* Hero Image Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 relative aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-2xl border border-zinc-200/50 dark:border-[#222225]/50 bg-zinc-200 dark:bg-zinc-900"
        >
          <Media
            src="R02_6119.JPG"
            alt="Family travel odyssey image"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0E]/50 via-transparent to-transparent opacity-60 pointer-events-none" />
          <div className="absolute bottom-6 left-6 text-white text-xs font-semibold tracking-wide bg-brand-charcoal/40 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/10">
            Seoul / Jeju (Juillet 2026)
          </div>
        </motion.div>

      </section>

      {/* 2. INTERACTIVE MAP SECTION */}
      <section id="map-section" className="w-full bg-white dark:bg-brand-dark-card/30 border-t border-b border-zinc-200/30 dark:border-[#222225]/30 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-charcoal dark:text-zinc-50">
              Tracé de notre Odyssée
            </h2>
            <p className="text-sm font-sans font-normal text-zinc-500 dark:text-zinc-400">
              Visualisez le parcours reliant la Corée et le Vietnam, et survolez les étapes clés pour révéler notre itinéraire.
            </p>
          </div>
          <InteractiveMap />
        </div>
      </section>

      {/* 3. BLOG POSTS GRID SECTION */}
      <section id="blog-section" className="w-full max-w-7xl mx-auto px-6 py-20 md:py-28">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-charcoal dark:text-zinc-50">
            Journal de Bord
          </h2>
          <p className="text-sm font-sans font-normal text-zinc-500 dark:text-zinc-400">
            Dernières publications de notre voyage en famille, illustrant notre quotidien, nos conseils et nos découvertes.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestPosts.map((post) => (
            <BlogCard key={post.slug} {...post} />
          ))}
        </div>
      </section>

      {/* 4. GALLERY PHOTO MASONRY SECTION */}
      <section className="w-full bg-white dark:bg-brand-dark-card/30 border-t border-b border-zinc-200/30 dark:border-[#222225]/30 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-charcoal dark:text-zinc-50">
              Instants Suspendus
            </h2>
            <p className="text-sm font-sans font-normal text-zinc-500 dark:text-zinc-400">
              Un aperçu de notre album photo. Cliquez sur une image pour l'ouvrir dans la lightbox interactive.
            </p>
          </div>
          <PhotoMasonry />
        </div>
      </section>

      {/* 5. TRIP TIMELINE SECTION */}
      <section className="w-full max-w-7xl mx-auto px-6 py-20 md:py-28">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-charcoal dark:text-zinc-50">
            Fil de notre Périple
          </h2>
          <p className="text-sm font-sans font-normal text-zinc-500 dark:text-zinc-400">
            L'historique au jour le jour de notre périple de 40 jours avec nos réservations hôtelières.
          </p>
        </div>
        <Timeline />
      </section>

    </div>
  );
}
