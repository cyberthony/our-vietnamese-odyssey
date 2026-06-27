import { getAllPosts } from "@/lib/mdx";
import BlogPageClient from "./BlogPageClient";
import { setRequestLocale } from "next-intl/server";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function BlogPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Load MDX posts on server
  const posts = await getAllPosts();
  return <BlogPageClient initialPosts={posts} />;
}
