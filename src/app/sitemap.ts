import type { MetadataRoute } from "next";

import { getAllCategories, getAllPosts, getAllTags } from "@/lib/posts";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/posts", "/archive", "/tags", "/categories", "/about"].map((route) => ({
    url: absoluteUrl(route || "/"),
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7
  }));

  const postRoutes = getAllPosts().map((post) => ({
    url: absoluteUrl(`/posts/${post.slug}`),
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.8
  }));

  const tagRoutes = getAllTags().map((tag) => ({
    url: absoluteUrl(`/tags/${encodeURIComponent(tag.name)}`),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5
  }));

  const categoryRoutes = getAllCategories().map((category) => ({
    url: absoluteUrl(`/categories/${encodeURIComponent(category.name)}`),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6
  }));

  return [...staticRoutes, ...postRoutes, ...tagRoutes, ...categoryRoutes] as MetadataRoute.Sitemap;
}
