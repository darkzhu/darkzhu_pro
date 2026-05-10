import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SectionTitle } from "@/components/layout/section-title";
import { PostCard } from "@/components/posts/post-card";
import { getAllTags, getPostsByTag } from "@/lib/posts";

export const dynamic = "force-dynamic";

type TagPageProps = {
  params: {
    tag: string;
  };
};

export async function generateStaticParams() {
  return (await getAllTags()).map((tag) => ({
    tag: tag.name
  }));
}

export function generateMetadata({ params }: TagPageProps): Metadata {
  const tag = decodeURIComponent(params.tag);

  return {
    title: `标签：${tag}`,
    description: `查看标签 ${tag} 下的所有文章。`
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const tag = decodeURIComponent(params.tag);
  const posts = await getPostsByTag(tag);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
      <SectionTitle eyebrow="Tag" title={`#${tag}`} description={`共 ${posts.length} 篇文章。`} />
      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
