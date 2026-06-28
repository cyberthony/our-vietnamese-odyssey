import { getPostBySlug, getAllPosts } from "@/lib/mdx";
import { notFound } from "next/navigation";
import Media from "@/components/Media";
import { Link } from "@/i18n/routing";
import React from "react";
import { setRequestLocale } from "next-intl/server";

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

// Simple, ultra-lightweight Markdown-to-React parser to avoid loading heavy next-mdx-remote bundles in Edge workers
function parseMarkdown(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let keyCounter = 0;
  
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    
    // Header 3
    if (trimmed.startsWith("### ")) {
      elements.push(
        <h3 key={keyCounter++} className="font-serif text-xl font-bold mt-8 mb-4 text-brand-charcoal dark:text-zinc-50">
          {parseInline(trimmed.substring(4))}
        </h3>
      );
      return;
    }
    
    // Header 2
    if (trimmed.startsWith("## ")) {
      elements.push(
        <h2 key={keyCounter++} className="font-serif text-2xl font-bold mt-10 mb-4 text-brand-charcoal dark:text-zinc-50">
          {parseInline(trimmed.substring(3))}
        </h2>
      );
      return;
    }
    
    // List item (ordered)
    if (/^\d+\.\s/.test(trimmed)) {
      const content = trimmed.replace(/^\d+\.\s/, "");
      elements.push(
        <li key={keyCounter++} className="list-decimal ml-6 pl-2 font-sans text-base text-zinc-600 dark:text-zinc-300 leading-relaxed mb-3">
          {parseInline(content)}
        </li>
      );
      return;
    }
    
    // List item (unordered)
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const content = trimmed.substring(2);
      elements.push(
        <li key={keyCounter++} className="list-disc ml-6 pl-2 font-sans text-base text-zinc-600 dark:text-zinc-300 leading-relaxed mb-3">
          {parseInline(content)}
        </li>
      );
      return;
    }
    
    // Paragraph
    elements.push(
      <p key={keyCounter++} className="font-sans text-base leading-relaxed text-zinc-600 dark:text-zinc-300 mb-5">
        {parseInline(trimmed)}
      </p>
    );
  });
  
  return elements;
}

// Sub-parser for inline elements (supports basic markdown bold: **text**)
function parseInline(text: string): React.ReactNode[] {
  const parts = text.split("**");
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return (
        <strong key={index} className="font-bold text-brand-charcoal dark:text-zinc-100">
          {part}
        </strong>
      );
    }
    return part;
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { locale, slug } = resolvedParams;
  setRequestLocale(locale);
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Render the markdown using our lightweight custom parser
  const parsedContent = parseMarkdown(post.content);

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
          <Media
            src={post.metadata.imageUrl}
            alt={post.metadata.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>

        {/* Rendered Body Content */}
        <section className="prose prose-zinc dark:prose-invert max-w-none">
          {parsedContent}
        </section>

      </div>
    </article>
  );
}
