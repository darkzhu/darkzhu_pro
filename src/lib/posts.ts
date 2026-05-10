import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

import { markdownToHtml } from "@/lib/markdown";
import type { ArchiveGroup, Post, PostFrontmatter, PostSummary, TaxonomyItem } from "@/types/post";

export const postsDirectory = process.env.POSTS_DIR
  ? path.resolve(process.env.POSTS_DIR)
  : path.join(process.cwd(), "src", "content", "posts");

let cachedSlugs: string[] | null = null;
let cachedSummaries: PostSummary[] | null = null;
let cachedTags: TaxonomyItem[] | null = null;
let cachedCategories: TaxonomyItem[] | null = null;
let cachedStats: { postCount: number; totalWords: number; lastUpdated: string } | null = null;

export function resetPostCache() {
  cachedSlugs = null;
  cachedSummaries = null;
  cachedTags = null;
  cachedCategories = null;
  cachedStats = null;
}

function readPostFile(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  return fs.readFileSync(fullPath, "utf8");
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

function getPostSummary(slug: string): PostSummary {
  const fileContents = readPostFile(slug);
  const { data, content } = matter(fileContents);
  const frontmatter = data as PostFrontmatter;

  return {
    slug,
    ...frontmatter,
    readingTime: getReadingTime(content)
  };
}

export function getAllPostSlugs() {
  if (cachedSlugs) {
    return cachedSlugs;
  }

  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  cachedSlugs = fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));

  return cachedSlugs;
}

export function getAllPosts() {
  if (cachedSummaries) {
    return cachedSummaries;
  }

  cachedSummaries = getAllPostSlugs()
    .map((slug) => getPostSummary(slug))
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return cachedSummaries;
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

export function getAllTags() {
  cachedTags = cachedTags ?? toTaxonomyItems(getAllPosts().flatMap((post) => post.tags));
  return cachedTags;
}

export function getAllCategories() {
  cachedCategories = cachedCategories ?? toTaxonomyItems(getAllPosts().map((post) => post.category));
  return cachedCategories;
}

export function getSitePostStats() {
  if (cachedStats) {
    return cachedStats;
  }

  const slugs = getAllPostSlugs();
  const posts = getAllPosts();
  const totalWords = slugs.reduce((total, slug) => {
    const fileContents = readPostFile(slug);
    const { content } = matter(fileContents);

    return total + countContentWords(content);
  }, 0);

  cachedStats = {
    postCount: posts.length,
    totalWords,
    lastUpdated: posts[0]?.date ?? ""
  };

  return cachedStats;
}

export function getPostsByTag(tag: string) {
  return getAllPosts().filter((post) => post.tags.includes(tag));
}

export function getPostsByCategory(category: string) {
  return getAllPosts().filter((post) => post.category === category);
}

export function getArchiveGroups(): ArchiveGroup[] {
  const groups = getAllPosts().reduce<Record<string, PostSummary[]>>((acc, post) => {
    const year = post.date.slice(0, 4);
    acc[year] = acc[year] ?? [];
    acc[year].push(post);
    return acc;
  }, {});

  return Object.entries(groups)
    .map(([year, posts]) => ({ year, posts }))
    .sort((a, b) => Number(b.year) - Number(a.year));
}

export function getAdjacentPosts(slug: string) {
  const posts = getAllPosts();
  const currentIndex = posts.findIndex((post) => post.slug === slug);

  return {
    previous: currentIndex >= 0 ? posts[currentIndex + 1] ?? null : null,
    next: currentIndex > 0 ? posts[currentIndex - 1] : null
  };
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = readPostFile(slug);
  const { data, content } = matter(fileContents);
  const frontmatter = data as PostFrontmatter;
  const contentHtml = await markdownToHtml(content);

  return {
    slug,
    contentHtml,
    ...frontmatter,
    readingTime: getReadingTime(content)
  };
}
