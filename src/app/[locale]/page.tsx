import { getAllPosts } from "@/lib/mdx";
import HomePageClient from "./HomePageClient";

export default async function Home() {
  // Load real MDX posts from local disk
  const posts = await getAllPosts();
  
  // Sort posts or take the first 3 latest posts
  const latestPosts = posts.slice(0, 3);

  return <HomePageClient latestPosts={latestPosts} />;
}
