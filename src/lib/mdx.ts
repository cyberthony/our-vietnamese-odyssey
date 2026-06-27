import fs from "fs";
import path from "path";

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

const postsDirectory = path.join(process.cwd(), "content/blog");

// Simple regex-based frontmatter parser
function parseFrontmatter(fileContent: string): Omit<PostMetadata, "slug"> {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
  const match = fileContent.match(frontmatterRegex);
  
  const metadata: any = {};
  if (match) {
    const lines = match[1].split("\n");
    lines.forEach((line) => {
      const parts = line.split(":");
      if (parts.length >= 2) {
        const key = parts[0].trim();
        // Rejoin in case value contains colons (e.g. titles or URLs)
        let value = parts.slice(1).join(":").trim();
        // Remove wrapping quotes
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.substring(1, value.length - 1);
        }
        metadata[key] = value;
      }
    });
  }
  
  return {
    title: metadata.title || "Sans titre",
    excerpt: metadata.excerpt || "",
    date: metadata.date || "",
    location: metadata.location || "",
    country: metadata.country || "vietnam",
    imageUrl: metadata.imageUrl || "/images/IMG_20240702_195803.jpg",
    readTime: metadata.readTime || "5 min",
  };
}

export async function getPostBySlug(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const frontmatter = parseFrontmatter(fileContents);
  
  // Extract raw content body (everything after the frontmatter block)
  const content = fileContents.replace(/^---\r?\n[\s\S]*?\r?\n---/, "").trim();
  
  return {
    slug,
    metadata: {
      ...frontmatter,
      slug,
    } as PostMetadata,
    content,
  };
}

export async function getAllPosts(): Promise<PostMetadata[]> {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const metadata = parseFrontmatter(fileContents);
      
      return {
        ...metadata,
        slug,
      } as PostMetadata;
    });
    
  return allPostsData;
}
