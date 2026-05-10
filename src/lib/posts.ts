import "server-only";

import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import type { RowDataPacket } from "mysql2";

import { db } from "@/lib/db";
import { markdownToHtml } from "@/lib/markdown";
import type { ArchiveGroup, Post, PostFrontmatter, PostSummary, TaxonomyItem } from "@/types/post";

export const postsDirectory = process.env.POSTS_DIR
  ? path.resolve(process.env.POSTS_DIR)
  : path.join(process.cwd(), "src", "content", "posts");

type PostRow = RowDataPacket & {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags_json: string;
  category: string;
  draft: number;
  cover: string | null;
  content: string;
};

let cachedPosts: (PostSummary & { content: string })[] | null = null;

export function resetPostCache() {
  cachedPosts = null;
}

function getReadingTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const cjkCharacters = content.match(/[\u4e00-\u9fff]/g)?.length ?? 0;
  const estimatedWords = words + cjkCharacters;

  return Math.max(1, Math.ceil(estimatedWords / 300));
}

function countContentWords(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const cjkCharacters = content.match(/[\u4e00-\u9fff]/g)?.length ?? 0;

  return words + cjkCharacters;
}

function parseTags(value: string) {
  try {
    const tags = JSON.parse(value);
    return Array.isArray(tags) ? tags.filter((tag): tag is string => typeof tag === "string") : [];
  } catch {
    return [];
  }
}

function toPost(row: PostRow): PostSummary & { content: string } {
  return {
    slug: row.slug,
    title: row.title,
    date: row.date,
    description: row.description,
    tags: parseTags(row.tags_json),
    category: row.category,
    draft: Boolean(row.draft),
    cover: row.cover || undefined,
    content: row.content,
    readingTime: getReadingTime(row.content)
  };
}

function readMarkdownPosts() {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  return fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const fileContents = fs.readFileSync(path.join(postsDirectory, file), "utf8");
      const { data, content } = matter(fileContents);
      const frontmatter = data as PostFrontmatter;

      return {
        slug,
        title: frontmatter.title || "",
        date: frontmatter.date || "",
        description: frontmatter.description || "",
        tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
        category: frontmatter.category || "",
        draft: Boolean(frontmatter.draft),
        cover: frontmatter.cover,
        content,
        readingTime: getReadingTime(content)
      };
    });
}

async function ensureBlogPostsTable() {
  await db.execute(
    `CREATE TABLE IF NOT EXISTS blog_posts (
      slug varchar(191) NOT NULL,
      title varchar(191) NOT NULL,
      date varchar(20) NOT NULL,
      description text NOT NULL,
      tags_json text NOT NULL,
      category varchar(80) NOT NULL,
      draft tinyint(1) NOT NULL DEFAULT 0,
      cover varchar(500) DEFAULT NULL,
      content longtext NOT NULL,
      created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (slug),
      KEY idx_blog_posts_date (date),
      KEY idx_blog_posts_category (category)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
  );
}

export async function getAllPostsIncludingDrafts() {
  if (cachedPosts) {
    return cachedPosts;
  }

  await ensureBlogPostsTable();
  const [rows] = await db.query<PostRow[]>(
    "SELECT slug, title, date, description, tags_json, category, draft, cover, content FROM blog_posts ORDER BY date DESC, created_at DESC"
  );
  const dbPosts = rows.map(toPost);
  const dbSlugs = new Set(dbPosts.map((post) => post.slug));
  const markdownPosts = readMarkdownPosts().filter((post) => !dbSlugs.has(post.slug));

  cachedPosts = [...dbPosts, ...markdownPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return cachedPosts;
}

export async function getAllPostSlugs() {
  return (await getAllPostsIncludingDrafts()).map((post) => post.slug);
}

export async function getAllPosts() {
  return (await getAllPostsIncludingDrafts()).filter((post) => !post.draft);
}

function toTaxonomyItems(values: string[]): TaxonomyItem[] {
  const counts = values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export async function getAllTags() {
  return toTaxonomyItems((await getAllPosts()).flatMap((post) => post.tags));
}

export async function getAllCategories() {
  return toTaxonomyItems((await getAllPosts()).map((post) => post.category));
}

export async function getSitePostStats() {
  const allPosts = await getAllPostsIncludingDrafts();
  const posts = allPosts.filter((post) => !post.draft);

  return {
    postCount: posts.length,
    totalWords: allPosts.reduce((total, post) => total + countContentWords(post.content), 0),
    lastUpdated: posts[0]?.date ?? ""
  };
}

export async function getPostsByTag(tag: string) {
  return (await getAllPosts()).filter((post) => post.tags.includes(tag));
}

export async function getPostsByCategory(category: string) {
  return (await getAllPosts()).filter((post) => post.category === category);
}

export async function getArchiveGroups(): Promise<ArchiveGroup[]> {
  const groups = (await getAllPosts()).reduce<Record<string, PostSummary[]>>((acc, post) => {
    const year = post.date.slice(0, 4);
    acc[year] = acc[year] ?? [];
    acc[year].push(post);
    return acc;
  }, {});

  return Object.entries(groups)
    .map(([year, posts]) => ({ year, posts }))
    .sort((a, b) => Number(b.year) - Number(a.year));
}

export async function getAdjacentPosts(slug: string) {
  const posts = await getAllPosts();
  const currentIndex = posts.findIndex((post) => post.slug === slug);

  return {
    previous: currentIndex >= 0 ? posts[currentIndex + 1] ?? null : null,
    next: currentIndex > 0 ? posts[currentIndex - 1] : null
  };
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const post = (await getAllPostsIncludingDrafts()).find((item) => item.slug === slug);

  if (!post) {
    return null;
  }

  return {
    ...post,
    contentHtml: await markdownToHtml(post.content)
  };
}
