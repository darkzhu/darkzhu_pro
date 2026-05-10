import "server-only";

import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

import { postsDirectory, resetPostCache } from "@/lib/posts";
import type { PostFrontmatter } from "@/types/post";

export type EditablePost = PostFrontmatter & {
  slug: string;
  content: string;
};

export type PostInput = {
  slug?: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  category: string;
  draft?: boolean;
  cover?: string;
  content: string;
};

function ensurePostsDirectory() {
  fs.mkdirSync(postsDirectory, { recursive: true });
}

export function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function getPostPath(slug: string) {
  return path.join(postsDirectory, `${slug}.md`);
}

function assertSafeSlug(slug: string) {
  if (!slug || slug !== normalizeSlug(slug) || slug.includes("..") || slug.includes("/") || slug.includes("\\")) {
    throw new Error("Invalid post slug");
  }
}

function toEditablePost(slug: string): EditablePost {
  const file = fs.readFileSync(getPostPath(slug), "utf8");
  const { data, content } = matter(file);
  const frontmatter = data as PostFrontmatter;

  return {
    slug,
    title: frontmatter.title || "",
    date: frontmatter.date || "",
    description: frontmatter.description || "",
    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
    category: frontmatter.category || "",
    draft: Boolean(frontmatter.draft),
    cover: frontmatter.cover || "",
    content
  };
}

export function getEditablePosts() {
  ensurePostsDirectory();

  return fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".md"))
    .map((file) => toEditablePost(file.replace(/\.md$/, "")))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getEditablePost(slug: string) {
  assertSafeSlug(slug);

  const fullPath = getPostPath(slug);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  return toEditablePost(slug);
}

export function saveEditablePost(input: PostInput, currentSlug?: string) {
  ensurePostsDirectory();

  const slug = normalizeSlug(input.slug || input.title);
  const normalizedCurrentSlug = currentSlug ? normalizeSlug(currentSlug) : "";

  assertSafeSlug(slug);

  if (normalizedCurrentSlug) {
    assertSafeSlug(normalizedCurrentSlug);
  }

  const targetPath = getPostPath(slug);
  const previousPath = normalizedCurrentSlug ? getPostPath(normalizedCurrentSlug) : "";

  if (slug !== normalizedCurrentSlug && fs.existsSync(targetPath)) {
    throw new Error("Post slug already exists");
  }

  const frontmatter: PostFrontmatter = {
    title: input.title.trim(),
    date: input.date,
    description: input.description.trim(),
    tags: input.tags.map((tag) => tag.trim()).filter(Boolean),
    category: input.category.trim(),
    draft: Boolean(input.draft),
    cover: input.cover?.trim() || undefined
  };
  const file = matter.stringify(input.content || "", frontmatter);

  fs.writeFileSync(targetPath, file, "utf8");

  if (previousPath && previousPath !== targetPath && fs.existsSync(previousPath)) {
    fs.unlinkSync(previousPath);
  }

  resetPostCache();

  return toEditablePost(slug);
}

export function deleteEditablePost(slug: string) {
  assertSafeSlug(slug);

  const fullPath = getPostPath(slug);

  if (!fs.existsSync(fullPath)) {
    return false;
  }

  fs.unlinkSync(fullPath);
  resetPostCache();

  return true;
}
