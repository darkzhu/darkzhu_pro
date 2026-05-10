import "server-only";

import type { ResultSetHeader } from "mysql2";

import { db } from "@/lib/db";
import { getAllPostsIncludingDrafts, resetPostCache } from "@/lib/posts";
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

export function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function assertSafeSlug(slug: string) {
  if (!slug || slug !== normalizeSlug(slug) || slug.includes("..") || slug.includes("/") || slug.includes("\\")) {
    throw new Error("Invalid post slug");
  }
}

function toEditablePost(post: Awaited<ReturnType<typeof getAllPostsIncludingDrafts>>[number]): EditablePost {
  return {
    slug: post.slug,
    title: post.title,
    date: post.date,
    description: post.description,
    tags: post.tags,
    category: post.category,
    draft: Boolean(post.draft),
    cover: post.cover || "",
    content: post.content
  };
}

export async function getEditablePosts() {
  return (await getAllPostsIncludingDrafts()).map(toEditablePost);
}

export async function getEditablePost(slug: string) {
  assertSafeSlug(slug);

  return (await getEditablePosts()).find((post) => post.slug === slug) ?? null;
}

export async function saveEditablePost(input: PostInput, currentSlug?: string) {
  const slug = normalizeSlug(input.slug || input.title);
  const normalizedCurrentSlug = currentSlug ? normalizeSlug(currentSlug) : "";

  assertSafeSlug(slug);

  if (normalizedCurrentSlug) {
    assertSafeSlug(normalizedCurrentSlug);
  }

  if (slug !== normalizedCurrentSlug) {
    const existing = await getEditablePost(slug);

    if (existing) {
      throw new Error("Post slug already exists");
    }
  }

  const title = input.title.trim();
  const date = input.date;
  const description = input.description.trim();
  const tags = input.tags.map((tag) => tag.trim()).filter(Boolean);
  const category = input.category.trim();
  const draft = Boolean(input.draft);
  const cover = input.cover?.trim() || null;
  const content = input.content || "";

  if (normalizedCurrentSlug && normalizedCurrentSlug !== slug) {
    await db.execute("DELETE FROM blog_posts WHERE slug = ?", [normalizedCurrentSlug]);
  }

  await db.execute(
    `INSERT INTO blog_posts (slug, title, date, description, tags_json, category, draft, cover, content)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       title = VALUES(title),
       date = VALUES(date),
       description = VALUES(description),
       tags_json = VALUES(tags_json),
       category = VALUES(category),
       draft = VALUES(draft),
       cover = VALUES(cover),
       content = VALUES(content)`,
    [slug, title, date, description, JSON.stringify(tags), category, draft ? 1 : 0, cover, content]
  );

  resetPostCache();

  const saved = await getEditablePost(slug);

  if (!saved) {
    throw new Error("Failed to save post");
  }

  return saved;
}

export async function deleteEditablePost(slug: string) {
  assertSafeSlug(slug);

  const [result] = await db.execute<ResultSetHeader>("DELETE FROM blog_posts WHERE slug = ?", [slug]);
  resetPostCache();

  return result.affectedRows > 0;
}
