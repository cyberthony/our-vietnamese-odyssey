import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Navigation");

  return (
    <footer className="w-full bg-[#FCF8F2] dark:bg-[#0D0D0E] border-t border-zinc-200/40 dark:border-[#222225]/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <span className="font-serif text-2xl font-bold tracking-tight text-brand-charcoal dark:text-zinc-50">
              Our Vietnamese Odyssey
            </span>
            <p className="text-sm font-sans font-normal leading-relaxed text-zinc-500 dark:text-zinc-400 max-w-sm">
              Un carnet de voyage familial documentant 40 jours d'exploration entre Séoul et le Vietnam. Un héritage gravé dans le temps pour Émilie et Yaya.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] font-sans font-bold text-brand-terracotta dark:text-brand-rose">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm font-semibold font-sans text-brand-charcoal/80 dark:text-zinc-400">
              <li>
                <Link href="/" className="hover:text-brand-terracotta dark:hover:text-brand-rose transition-colors duration-300">
                  {t("home")}
                </Link>
              </li>
              <li>
                <Link href="/itinerary" className="hover:text-brand-terracotta dark:hover:text-brand-rose transition-colors duration-300">
                  {t("itinerary")}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-brand-terracotta dark:hover:text-brand-rose transition-colors duration-300">
                  {t("blog")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Discover Section */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] font-sans font-bold text-brand-terracotta dark:text-brand-rose">
              Découvertes
            </h4>
            <ul className="space-y-2 text-sm font-semibold font-sans text-brand-charcoal/80 dark:text-zinc-400">
              <li>
                <Link href="/miam" className="hover:text-brand-terracotta dark:hover:text-brand-rose transition-colors duration-300">
                  {t("miam")}
                </Link>
              </li>
              <li>
                <Link href="/photos" className="hover:text-brand-terracotta dark:hover:text-brand-rose transition-colors duration-300">
                  {t("photos")}
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Separator */}
        <hr className="my-12 border-zinc-200/50 dark:border-[#222225]/50" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between text-xs text-zinc-400 dark:text-zinc-500 gap-4">
          <p>
            &copy; {new Date().getFullYear()} Our Vietnamese Odyssey. Tous droits réservés.
          </p>
          <p className="font-sans">
            Fait avec amour par la famille • Conçu en Next.js & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
