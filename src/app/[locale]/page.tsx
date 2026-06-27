import { getAllPosts } from "@/lib/mdx";
import HomePageClient from "./HomePageClient";
import { setRequestLocale } from "next-intl/server";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Load real MDX posts from local disk
  const posts = await getAllPosts();
  
  // Sort posts or take the first 3 latest posts
  const latestPosts = posts.slice(0, 3);

  return <HomePageClient latestPosts={latestPosts} />;
}
