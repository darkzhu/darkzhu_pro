import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SectionTitle } from "@/components/layout/section-title";
import { PostCard } from "@/components/posts/post-card";
import { getAllCategories, getPostsByCategory } from "@/lib/posts";

type CategoryPageProps = {
  params: {
    category: string;
  };
};

export function generateStaticParams() {
  return getAllCategories().map((category) => ({
    category: category.name
  }));
}

export function generateMetadata({ params }: CategoryPageProps): Metadata {
  const category = decodeURIComponent(params.category);

  return {
    title: `分类：${category}`,
    description: `查看分类 ${category} 下的所有文章。`
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = decodeURIComponent(params.category);
  const posts = getPostsByCategory(category);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
      <SectionTitle eyebrow="Category" title={category} description={`共 ${posts.length} 篇文章。`} />
      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
