import { getAllPosts } from "@/lib/mdx";
import BlogPageClient from "./BlogPageClient";

export default async function BlogPage() {
  // Load MDX posts from content/blog on server
  const posts = await getAllPosts();
  return <BlogPageClient initialPosts={posts} />;
}
