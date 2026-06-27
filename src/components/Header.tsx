"use client";

import { useState } from "react";
import { Link, useRouter, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";

export default function Header() {
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const currentLocale = (params.locale as "fr" | "vi") || "fr";
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: t("home"), path: "/" },
    { name: t("itinerary"), path: "/itinerary" },
    { name: t("blog"), path: "/blog" },
    { name: t("miam"), path: "/miam" },
    { name: t("photos"), path: "/photos" },
  ];

  const switchLocale = (newLocale: "fr" | "vi") => {
    router.replace(pathname, { locale: newLocale });
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#FCF8F2]/80 dark:bg-[#0D0D0E]/80 backdrop-blur-lg border-b border-zinc-200/40 dark:border-[#222225]/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 md:h-24 flex items-center justify-between">
        
        {/* Brand Logo / Title */}
        <Link 
          href="/" 
          className="flex flex-col items-start group"
        >
          <span className="font-serif text-xl md:text-2xl font-bold tracking-tight text-brand-charcoal dark:text-zinc-50 group-hover:text-brand-terracotta dark:group-hover:text-brand-rose transition-colors duration-300">
            Our Vietnamese Odyssey
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-medium text-brand-terracotta dark:text-brand-rose">
            Family Travel Blog
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-10 text-sm font-semibold tracking-wide font-sans text-brand-charcoal/80 dark:text-zinc-300/90">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              href={link.path} 
              className={`relative py-2 transition-colors duration-300 hover:text-brand-terracotta dark:hover:text-brand-rose ${
                isActive(link.path) 
                  ? "text-brand-terracotta dark:text-brand-rose font-bold" 
                  : ""
              }`}
            >
              {link.name}
              {isActive(link.path) && (
                <motion.div 
                  layoutId="activeNavLine"
                  className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-terracotta dark:bg-brand-rose rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Controls (Theme, Locale, Mobile Burger) */}
        <div className="flex items-center space-x-6">
          
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full hover:bg-zinc-200/50 dark:hover:bg-[#161618] text-brand-charcoal dark:text-zinc-300 transition-colors duration-300 shadow-sm border border-zinc-200/30 dark:border-zinc-800/30"
            aria-label="Toggle Theme"
          >
            {theme === "light" ? (
              // Moon Icon
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12.3 22h-.1c-5.5 0-10-4.5-10-10 0-4.8 3.5-8.9 8.2-9.8.5-.1 1 .2 1.2.7.2.5 0 1.1-.4 1.4-2.8 1.9-4.3 5.3-3.7 8.7.6 3.5 3.5 6.3 7 7 3.4.6 6.8-.9 8.7-3.7.3-.4.9-.6 1.4-.4.5.2.8.7.7 1.2-.9 4.7-5 8.2-9.8 8.2h-.2z"/>
              </svg>
            ) : (
              // Sun Icon
              <svg className="w-5 h-5 fill-current text-amber-400" viewBox="0 0 24 24">
                <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-12.37c-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41zm-12.37 12.37c-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41z"/>
              </svg>
            )}
          </button>

          {/* Locale Selector */}
          <div className="flex items-center bg-zinc-200/50 dark:bg-[#161618] rounded-full p-1 text-xs font-bold border border-zinc-200/30 dark:border-zinc-800/30">
            <button 
              onClick={() => switchLocale("fr")}
              className={`px-3 py-1.5 rounded-full transition-all duration-300 ${
                currentLocale === "fr" 
                  ? "bg-white dark:bg-zinc-800 text-brand-terracotta dark:text-brand-rose shadow-sm" 
                  : "text-zinc-500 hover:text-brand-charcoal dark:hover:text-white"
              }`}
            >
              FR
            </button>
            <button 
              onClick={() => switchLocale("vi")}
              className={`px-3 py-1.5 rounded-full transition-all duration-300 ${
                currentLocale === "vi" 
                  ? "bg-white dark:bg-zinc-800 text-brand-terracotta dark:text-brand-rose shadow-sm" 
                  : "text-zinc-500 hover:text-brand-charcoal dark:hover:text-white"
              }`}
            >
              VN
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-full hover:bg-zinc-200/50 dark:hover:bg-[#161618] text-brand-charcoal dark:text-zinc-300 transition-colors duration-300 shadow-sm border border-zinc-200/30 dark:border-zinc-800/30 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                // Cross Icon
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              ) : (
                // Burger Icon
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
              )}
            </svg>
          </button>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden w-full bg-[#FCF8F2]/95 dark:bg-[#0D0D0E]/95 backdrop-blur-lg border-b border-zinc-200/50 dark:border-[#222225]/50 overflow-hidden"
          >
            <nav className="flex flex-col px-6 py-6 space-y-4 text-base font-semibold tracking-wide font-sans text-brand-charcoal dark:text-zinc-200">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2 border-b border-zinc-200/30 dark:border-zinc-800/30 transition-colors duration-300 hover:text-brand-terracotta dark:hover:text-brand-rose ${
                    isActive(link.path) 
                      ? "text-brand-terracotta dark:text-brand-rose font-bold pl-2" 
                      : ""
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
