import { getPostBySlug, getAllPosts } from "@/lib/mdx";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { compileMDX } from "next-mdx-remote/rsc";

interface PageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

// Generate static params for Next.js to pre-render the paths
export async function generateStaticParams() {
  const posts = await getAllPosts();
  const locales = ["fr", "vi"];
  
  const paramsList: any[] = [];
  posts.forEach((post) => {
    locales.forEach((locale) => {
      paramsList.push({
        locale,
        slug: post.slug,
      });
    });
  });
  
  return paramsList;
}

export default async function BlogPostPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Compile MDX content on server side using next-mdx-remote/rsc
  const { content } = await compileMDX({
    source: post.content,
    options: { parseFrontmatter: false },
  });

  return (
    <article className="flex-1 bg-brand-cream/10 dark:bg-brand-dark-bg/10 py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-6 space-y-12">
        
        {/* Back Button */}
        <div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-sans text-zinc-500 hover:text-brand-terracotta dark:hover:text-brand-rose transition-colors duration-300 group"
          >
            <svg
              className="w-4 h-4 transition-transform duration-300 ease-out group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour au journal
          </Link>
        </div>

        {/* Article Header info */}
        <header className="space-y-6">
          <div className="space-y-3">
            {/* Category / Location Badge */}
            <span className="inline-block text-[10px] uppercase tracking-wider font-sans font-bold text-brand-terracotta dark:text-brand-rose bg-brand-rose/10 dark:bg-brand-rose/5 px-3.5 py-1.5 rounded-full border border-brand-rose/10">
              {post.metadata.location}
            </span>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-brand-charcoal dark:text-zinc-50 leading-tight">
              {post.metadata.title}
            </h1>
          </div>

          {/* Metadata */}
          <div className="flex items-center text-xs font-semibold text-zinc-400 dark:text-zinc-500 gap-4 border-t border-b border-zinc-200/40 dark:border-brand-dark-border/40 py-4 font-sans">
            <span>Publié le {post.metadata.date}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <span>Temps de lecture : {post.metadata.readTime}</span>
          </div>
        </header>

        {/* Cover Image */}
        <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-lg border border-zinc-200/50 dark:border-brand-dark-border/50 bg-zinc-200 dark:bg-zinc-900">
          <Image
            src={post.metadata.imageUrl}
            alt={post.metadata.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>

        {/* MDX Body Content (Editorial typography) */}
        <section className="prose prose-zinc dark:prose-invert max-w-none 
          prose-headings:font-serif prose-headings:font-bold 
          prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
          prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
          prose-p:font-sans prose-p:leading-relaxed prose-p:text-base prose-p:text-zinc-600 dark:prose-p:text-zinc-300 prose-p:mb-6
          prose-li:font-sans prose-li:text-zinc-600 dark:prose-li:text-zinc-300 prose-li:leading-relaxed
          prose-ul:list-disc prose-ol:list-decimal"
        >
          {content}
        </section>

      </div>
    </article>
  );
}
