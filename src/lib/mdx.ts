import { postsData } from "@/data/posts";

export interface PostMetadata {
  title: string;
  excerpt: string;
  date: string;
  location: string;
  country: "korea" | "vietnam";
  imageUrl: string;
  readTime: string;
  slug: string;
}

export async function getPostBySlug(slug: string) {
  const post = postsData[slug];
  if (!post) {
    return null;
  }
  
  return {
    slug,
    metadata: post.metadata,
    content: post.content,
  };
}

export async function getAllPosts(): Promise<PostMetadata[]> {
  return Object.values(postsData).map((post) => post.metadata);
}
